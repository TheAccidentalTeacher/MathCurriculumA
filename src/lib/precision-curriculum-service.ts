/**
 * Precision Curriculum Database Service
 * Uses the high-quality precision-extracted curriculum database
 * Replaces the old curriculum service with 21x more lessons and better quality
 */

import Database from 'better-sqlite3';
import { join } from 'path';
import fs from 'fs';

interface PrecisionLessonData {
  lesson_id: number;
  grade: number;
  lesson_number: number;
  title: string;
  standards: string[];
  session_count: number;
  total_content_length: number;
  extraction_confidence: number;
  gpt5_context: string;
  unit_theme: string;
  estimated_days: number;
  is_major_work: boolean;
  // Computed fields for pacing
  sequenceNumber?: number;
  totalDaysAtThisPoint?: number;
  tags?: string[];
  prerequisites?: string[];
  isAdvanced?: boolean;
}

interface DatabaseStats {
  total_lessons: number;
  total_sessions: number;
  total_activities: number;
  total_problems: number;
  high_confidence_lessons: number;
  lessons_with_standards: number;
  grade_distribution: Record<string, number>;
  volume_distribution: Record<string, number>;
}

export class PrecisionCurriculumService {
  private db: Database.Database;
  private lessonsCache: Map<string, PrecisionLessonData[]> = new Map();
  private statsCache: DatabaseStats | null = null;

  constructor() {
    const dbPath = join(process.cwd(), 'curriculum_precise.db');
    
    if (!fs.existsSync(dbPath)) {
      throw new Error(`Precision database not found at ${dbPath}. Please run the extraction process first.`);
    }
    
    this.db = new Database(dbPath);
    
    // Enable optimizations
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 10000');
    
    console.log('✅ Connected to precision curriculum database');
  }

  /**
   * Get comprehensive database statistics
   */
  getDatabaseStats(): DatabaseStats {
    if (this.statsCache) {
      return this.statsCache;
    }

    const totalLessons = this.db.prepare("SELECT COUNT(*) as count FROM lessons").get() as any;
    const totalSessions = this.db.prepare("SELECT COUNT(*) as count FROM sessions").get() as any;
    const totalActivities = this.db.prepare("SELECT COUNT(*) as count FROM activities").get() as any;
    const totalProblems = this.db.prepare("SELECT COUNT(*) as count FROM problems").get() as any;
    
    const highConfidence = this.db.prepare(
      "SELECT COUNT(*) as count FROM lesson_summaries_gpt5 WHERE extraction_confidence >= 0.7"
    ).get() as any;
    
    const withStandards = this.db.prepare(
      "SELECT COUNT(*) as count FROM lessons WHERE standards IS NOT NULL AND standards != '' AND standards != '[]'"
    ).get() as any;

    // Grade distribution
    const gradeDistQuery = this.db.prepare(`
      SELECT d.grade, COUNT(l.id) as lesson_count
      FROM documents d 
      LEFT JOIN lessons l ON d.id = l.document_id 
      GROUP BY d.grade
    `);
    const gradeDist: Record<string, number> = {};
    for (const row of gradeDistQuery.all() as any[]) {
      gradeDist[`Grade ${row.grade}`] = row.lesson_count;
    }

    // Volume distribution
    const volumeDistQuery = this.db.prepare(`
      SELECT d.volume, COUNT(l.id) as lesson_count
      FROM documents d 
      LEFT JOIN lessons l ON d.id = l.document_id 
      GROUP BY d.volume
    `);
    const volumeDist: Record<string, number> = {};
    for (const row of volumeDistQuery.all() as any[]) {
      volumeDist[`Volume ${row.volume}`] = row.lesson_count;
    }

    this.statsCache = {
      total_lessons: totalLessons.count,
      total_sessions: totalSessions.count,
      total_activities: totalActivities.count,
      total_problems: totalProblems.count,
      high_confidence_lessons: highConfidence.count,
      lessons_with_standards: withStandards.count,
      grade_distribution: gradeDist,
      volume_distribution: volumeDist
    };

    return this.statsCache;
  }

  /**
   * Get all lessons with GPT-5 optimized summaries
   */
  getAllLessons(): PrecisionLessonData[] {
    const cacheKey = 'all_lessons';
    if (this.lessonsCache.has(cacheKey)) {
      return this.lessonsCache.get(cacheKey)!;
    }

    const query = this.db.prepare(`
      SELECT 
        ls.lesson_id,
        ls.grade,
        ls.lesson_number,
        ls.title,
        ls.standards_list,
        ls.session_count,
        ls.total_content_length,
        ls.gpt5_context,
        ls.extraction_confidence,
        l.unit_theme,
        l.estimated_days,
        l.is_major_work
      FROM lesson_summaries_gpt5 ls
      JOIN lessons l ON ls.lesson_id = l.id
      ORDER BY ls.grade, ls.lesson_number
    `);

    const lessons = (query.all() as any[]).map(row => this.processLessonRow(row));
    this.lessonsCache.set(cacheKey, lessons);
    
    console.log(`📚 Loaded ${lessons.length} precision lessons`);
    return lessons;
  }

  /**
   * Get lessons filtered by grade range
   */
  getLessonsByGrades(grades: number[]): PrecisionLessonData[] {
    const cacheKey = `grades_${grades.join('_')}`;
    if (this.lessonsCache.has(cacheKey)) {
      return this.lessonsCache.get(cacheKey)!;
    }

    const placeholders = grades.map(() => '?').join(',');
    const query = this.db.prepare(`
      SELECT 
        ls.lesson_id,
        ls.grade,
        ls.lesson_number,
        ls.title,
        ls.standards_list,
        ls.session_count,
        ls.total_content_length,
        ls.gpt5_context,
        ls.extraction_confidence,
        l.unit_theme,
        l.estimated_days,
        l.is_major_work
      FROM lesson_summaries_gpt5 ls
      JOIN lessons l ON ls.lesson_id = l.id
      WHERE ls.grade IN (${placeholders})
      ORDER BY ls.grade, ls.lesson_number
    `);

    const lessons = (query.all(...grades) as any[]).map(row => this.processLessonRow(row));
    this.lessonsCache.set(cacheKey, lessons);
    
    console.log(`📚 Loaded ${lessons.length} lessons for grades ${grades.join(', ')}`);
    return lessons;
  }

  /**
   * Process raw database row into structured lesson data
   */
  private processLessonRow(row: any): PrecisionLessonData {
    // Parse standards from JSON
    let standards: string[] = [];
    try {
      standards = row.standards_list ? JSON.parse(row.standards_list) : [];
    } catch (e) {
      console.warn(`Failed to parse standards for lesson ${row.lesson_id}:`, e);
    }

    // Generate enhanced tags based on title and standards
    const tags = this.generateTags(row.title, standards, row.grade);
    
    // Generate prerequisites based on content and standards
    const prerequisites = this.generatePrerequisites(row.title, standards, row.grade);

    return {
      lesson_id: row.lesson_id,
      grade: row.grade,
      lesson_number: row.lesson_number,
      title: row.title,
      standards,
      session_count: row.session_count || 1,
      total_content_length: row.total_content_length || 0,
      extraction_confidence: row.extraction_confidence || 0.5,
      gpt5_context: row.gpt5_context || '',
      unit_theme: row.unit_theme || 'General Mathematics',
      estimated_days: row.estimated_days || 2,
      is_major_work: Boolean(row.is_major_work),
      tags,
      prerequisites
    };
  }

  /**
   * Generate comprehensive tags for a lesson
   */
  private generateTags(title: string, standards: string[], grade: number): string[] {
    const tags: string[] = [];
    const lowerTitle = title.toLowerCase();

    // Content-based tags
    const contentTags = {
      'ratio': 'Proportional Reasoning',
      'proportion': 'Proportional Reasoning',
      'percent': 'Percent',
      'equation': 'Algebraic Thinking',
      'expression': 'Algebraic Thinking', 
      'solve': 'Problem Solving',
      'graph': 'Graphing',
      'coordinate': 'Coordinate Plane',
      'function': 'Functions',
      'linear': 'Linear Relationships',
      'geometry': 'Geometry',
      'angle': 'Geometry',
      'area': 'Measurement',
      'volume': 'Measurement',
      'statistics': 'Statistics',
      'data': 'Data Analysis',
      'probability': 'Probability',
      'integer': 'Integer Operations',
      'rational': 'Rational Numbers',
      'fraction': 'Fractions',
      'decimal': 'Decimals',
      'exponent': 'Exponents',
      'transformation': 'Transformations'
    };

    for (const [keyword, tag] of Object.entries(contentTags)) {
      if (lowerTitle.includes(keyword)) {
        tags.push(tag);
      }
    }

    // Standards-based tags
    for (const standard of standards) {
      if (standard.includes('RP')) tags.push('Ratios & Proportional Relationships');
      if (standard.includes('NS')) tags.push('Number System');
      if (standard.includes('EE')) tags.push('Expressions & Equations');
      if (standard.includes('G')) tags.push('Geometry');
      if (standard.includes('SP')) tags.push('Statistics & Probability');
      if (standard.includes('F')) tags.push('Functions');
    }

    // Grade-level tags
    if (grade >= 7) {
      tags.push('Middle School');
      if (lowerTitle.includes('advanced') || lowerTitle.includes('algebra')) {
        tags.push('Algebra Readiness');
      }
    }

    // Unique tags only
    return [...new Set(tags)];
  }

  /**
   * Generate prerequisites for a lesson
   */
  private generatePrerequisites(title: string, standards: string[], grade: number): string[] {
    const prerequisites: string[] = [];
    const lowerTitle = title.toLowerCase();

    // Basic prerequisites by grade
    if (grade >= 7) {
      prerequisites.push('Grade 6 Mathematics');
    }
    if (grade >= 8) {
      prerequisites.push('Grade 7 Mathematics');
    }

    // Content-specific prerequisites
    const prereqMap: Record<string, string[]> = {
      'ratio': ['Multiplication fluency', 'Division concepts'],
      'proportion': ['Ratio understanding', 'Cross multiplication'],
      'equation': ['Algebraic thinking', 'Inverse operations'],
      'coordinate': ['Number line understanding', 'Ordered pairs'],
      'function': ['Coordinate plane', 'Input-output tables'],
      'integer': ['Number line', 'Positive/negative numbers'],
      'rational': ['Fraction operations', 'Decimal understanding'],
      'exponent': ['Multiplication patterns', 'Repeated multiplication'],
      'geometry': ['Basic shapes', 'Measurement concepts'],
      'statistics': ['Data collection', 'Basic graphs']
    };

    for (const [keyword, prereqs] of Object.entries(prereqMap)) {
      if (lowerTitle.includes(keyword)) {
        prerequisites.push(...prereqs);
      }
    }

    return [...new Set(prerequisites)]; // Remove duplicates
  }

  /**
   * Generate custom pacing guide with precision lesson data
   */
  generateCustomPathway(parameters: {
    gradeRange: number[];
    targetPopulation: string;
    totalDays: number;
    majorWorkFocus: number;
    includePrerequisites: boolean;
  }): PrecisionLessonData[] {
    console.log('🎯 Generating precision pathway with parameters:', parameters);
    
    let lessons = this.getLessonsByGrades(parameters.gradeRange);
    console.log(`📚 Found ${lessons.length} precision lessons for grades ${parameters.gradeRange.join(', ')}`);
    
    if (lessons.length === 0) {
      console.warn('❌ No lessons found for specified grades');
      return [];
    }

    // Filter by major work focus if needed
    if (parameters.majorWorkFocus > 85) {
      const originalCount = lessons.length;
      
      if (parameters.majorWorkFocus > 95) {
        // Very high focus: only major work
        lessons = lessons.filter(lesson => lesson.is_major_work);
      } else if (parameters.majorWorkFocus > 90) {
        // High focus: prioritize major work, include some supporting
        const majorWork = lessons.filter(lesson => lesson.is_major_work);
        const supportingWork = lessons
          .filter(lesson => !lesson.is_major_work)
          .sort((a, b) => b.extraction_confidence - a.extraction_confidence) // Best supporting work first
          .slice(0, Math.floor(originalCount * 0.2));
        lessons = [...majorWork, ...supportingWork];
      }
      
      console.log(`🎯 After major work filtering: ${lessons.length} lessons (was ${originalCount})`);
    }

    // Sort lessons logically: by grade, then by lesson number
    lessons.sort((a, b) => {
      if (a.grade !== b.grade) return a.grade - b.grade;
      return a.lesson_number - b.lesson_number;
    });

    // Adjust pacing based on target population
    lessons.forEach((lesson, index) => {
      let originalDays = lesson.estimated_days;
      
      switch (parameters.targetPopulation) {
        case 'accelerated-algebra-prep':
          lesson.estimated_days = Math.max(1, Math.ceil(originalDays * 0.6));
          lesson.isAdvanced = true;
          break;
        case 'accelerated':
          lesson.estimated_days = Math.max(1, Math.ceil(originalDays * 0.75));
          lesson.isAdvanced = true;
          break;
        case 'intensive':
          lesson.estimated_days = Math.ceil(originalDays * 1.5);
          break;
        case 'standard':
        default:
          // Keep original pacing
          break;
      }

      if (parameters.includePrerequisites) {
        lesson.estimated_days += 1; // Add prerequisite review day
      }

      // Add sequence information
      lesson.sequenceNumber = index + 1;
    });

    // Calculate cumulative days
    let cumulativeDays = 0;
    lessons.forEach(lesson => {
      cumulativeDays += lesson.estimated_days;
      lesson.totalDaysAtThisPoint = cumulativeDays;
    });

    // Adjust if over target days
    const totalDays = lessons.reduce((sum, lesson) => sum + lesson.estimated_days, 0);
    if (totalDays > parameters.totalDays && lessons.length > 0) {
      console.log(`⚠️ Total days (${totalDays}) exceeds target (${parameters.totalDays}), scaling down...`);
      
      const scaleFactor = parameters.totalDays / totalDays;
      lessons.forEach(lesson => {
        lesson.estimated_days = Math.max(1, Math.floor(lesson.estimated_days * scaleFactor));
      });

      // Recalculate cumulative days
      cumulativeDays = 0;
      lessons.forEach(lesson => {
        cumulativeDays += lesson.estimated_days;
        lesson.totalDaysAtThisPoint = cumulativeDays;
      });
    }

    const finalDays = lessons.reduce((sum, lesson) => sum + lesson.estimated_days, 0);
    console.log(`✅ Generated precision pathway: ${lessons.length} lessons, ${finalDays} total days`);
    
    return lessons;
  }

  /**
   * Search lessons by content
   */
  searchLessons(query: string, grades?: number[]): any[] {
    let sql = `
      SELECT 
        l.id as lesson_id,
        l.lesson_number,
        l.title,
        l.unit_theme,
        ls.grade,
        ls.extraction_confidence,
        d.filename
      FROM lessons l
      JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
      JOIN documents d ON l.document_id = d.id
      WHERE (l.title LIKE ? OR l.unit_theme LIKE ?)
    `;
    
    const params = [`%${query}%`, `%${query}%`];
    
    if (grades && grades.length > 0) {
      const placeholders = grades.map(() => '?').join(',');
      sql += ` AND ls.grade IN (${placeholders})`;
      params.push(...grades);
    }
    
    sql += ` ORDER BY ls.grade, l.lesson_number`;
    
    const query_stmt = this.db.prepare(sql);
    return query_stmt.all(...params) as any[];
  }

  /**
   * Get lesson details including sessions
   */
  getLessonDetails(lessonId: number): any {
    // Get lesson info
    const lessonQuery = this.db.prepare(`
      SELECT l.*, ls.gpt5_context, ls.extraction_confidence, d.filename
      FROM lessons l
      LEFT JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
      JOIN documents d ON l.document_id = d.id
      WHERE l.id = ?
    `);
    
    const lesson = lessonQuery.get(lessonId);
    if (!lesson) return null;

    // Get sessions
    const sessionsQuery = this.db.prepare(`
      SELECT id, session_number, title, session_type, content, activities_count, problems_count
      FROM sessions
      WHERE lesson_id = ?
      ORDER BY session_number
    `);
    
    const sessions = sessionsQuery.all(lessonId);
    
    return {
      lesson,
      sessions,
      total_sessions: sessions.length,
      total_content: sessions.reduce((sum: number, s: any) => sum + (s.content?.length || 0), 0)
    };
  }

  close() {
    this.db.close();
    console.log('🔌 Closed precision database connection');
  }
}

export default PrecisionCurriculumService;
