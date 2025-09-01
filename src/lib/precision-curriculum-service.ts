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

interface Lesson {
  id: number;
  title: string;
  lesson_number: number;
  unit_number: number;
  unit_title: string;
  grade: number;
  volume: string;
  subject: string;
  standards: string[];
  unitTheme: string;
  learningObjectives: string[];
  keyVocabulary: string[];
  contentSummary: string;
  extractionConfidence: number;
  sessionCount: number;
  contentLength: number;
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
  private isPrecisionDb: boolean = false;

  constructor() {
    // Try precision database first, fall back to regular database
    let dbPath = join(process.cwd(), 'curriculum_precise.db');
    
    if (!fs.existsSync(dbPath)) {
      console.warn('⚠️ Precision database not found, falling back to curriculum.db');
      dbPath = join(process.cwd(), 'curriculum.db');
      
      if (!fs.existsSync(dbPath)) {
        throw new Error('No curriculum database found. Please ensure either curriculum_precise.db or curriculum.db exists.');
      }
    }
    
    this.db = new Database(dbPath);
    
    // Check if this is the precision database by looking for specific tables
    try {
      const tables = this.db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as any[];
      const tableNames = tables.map(t => t.name);
      this.isPrecisionDb = tableNames.includes('lesson_summaries_gpt5');
      
      if (this.isPrecisionDb) {
        console.log('✅ Using precision database with enhanced features');
      } else {
        console.log('⚠️ Using legacy database - some features may be limited');
      }
    } catch (e) {
      console.warn('Could not detect database schema, assuming legacy format');
      this.isPrecisionDb = false;
    }
    
    // Enable optimizations
    this.db.pragma('journal_mode = WAL');
    this.db.pragma('synchronous = NORMAL');
    this.db.pragma('cache_size = 10000');
    
    console.log(`✅ Connected to curriculum database: ${dbPath}`);
  }

  /**
   * Get comprehensive database statistics
   */
  getDatabaseStats(): DatabaseStats {
    if (this.statsCache) {
      return this.statsCache;
    }

    if (this.isPrecisionDb) {
      // Precision database stats
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
    } else {
      // Legacy database stats - check for existing tables
      try {
        const totalLessons = this.db.prepare("SELECT COUNT(*) as count FROM lessons").get() as any;
        const totalSessions = this.db.prepare("SELECT COUNT(*) as count FROM sessions").get() as any;
        const totalTopics = this.db.prepare("SELECT COUNT(*) as count FROM topics").get() as any;
        const totalKeywords = this.db.prepare("SELECT COUNT(*) as count FROM keywords").get() as any;

        // If legacy database is empty, provide helpful default values
        if (totalLessons.count === 0) {
          console.warn('⚠️ Legacy database is empty - no curriculum data available');
          this.statsCache = {
            total_lessons: 0,
            total_sessions: 0,
            total_activities: 0,
            total_problems: 0,
            high_confidence_lessons: 0,
            lessons_with_standards: 0,
            grade_distribution: {},
            volume_distribution: {}
          };
        } else {
          // Grade distribution for legacy db (if it has data)
          const gradeDistQuery = this.db.prepare(`
            SELECT COALESCE(u.id, '6') as grade, COUNT(l.id) as lesson_count
            FROM lessons l
            LEFT JOIN units u ON l.unit_id = u.id
            GROUP BY COALESCE(u.id, '6')
          `);
          const gradeDist: Record<string, number> = {};
          for (const row of gradeDistQuery.all() as any[]) {
            gradeDist[`Grade ${row.grade}`] = row.lesson_count;
          }

          this.statsCache = {
            total_lessons: totalLessons.count,
            total_sessions: totalSessions.count,
            total_activities: totalTopics.count,
            total_problems: totalKeywords.count,
            high_confidence_lessons: Math.floor(totalLessons.count * 0.1), // Estimate
            lessons_with_standards: 0, // Legacy db has no reliable standards
            grade_distribution: gradeDist,
            volume_distribution: { 'Volume V1': totalLessons.count }
          };
        }
      } catch (error) {
        console.warn('⚠️ Error querying legacy database:', error);
        this.statsCache = {
          total_lessons: 0,
          total_sessions: 0,
          total_activities: 0,
          total_problems: 0,
          high_confidence_lessons: 0,
          lessons_with_standards: 0,
          grade_distribution: {},
          volume_distribution: {}
        };
      }
    }

    return this.statsCache;
  }

  /**
   * Get all lessons with comprehensive data for precision analysis
   */
  getAllLessons(): Lesson[] {
    if (this.isPrecisionDb) {
      // Precision database with comprehensive lesson data
      const query = `
        SELECT DISTINCT
          l.id, l.title, l.lesson_number, l.unit_number, l.unit_title, l.standards,
          d.grade, d.volume, d.subject,
          ls.unit_theme, ls.learning_objectives, ls.key_vocabulary, 
          ls.content_summary, ls.extraction_confidence,
          COUNT(s.id) as session_count,
          SUM(LENGTH(COALESCE(s.content, ''))) as content_length
        FROM lessons l
        JOIN documents d ON l.document_id = d.id
        LEFT JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
        LEFT JOIN sessions s ON l.id = s.lesson_id
        GROUP BY l.id
        ORDER BY d.grade, d.volume, l.unit_number, l.lesson_number
      `;

      const results = this.db.prepare(query).all() as any[];
      console.log(`📚 Found ${results.length} precision lessons`);
      
      return results.map(row => ({
        id: row.id,
        title: row.title || 'Untitled Lesson',
        lesson_number: row.lesson_number || 0,
        unit_number: row.unit_number || 0,
        unit_title: row.unit_title || 'Unknown Unit',
        grade: parseInt(row.grade),
        volume: row.volume || 'V1',
        subject: row.subject || 'mathematics',
        standards: this.parseJSON(row.standards) || [],
        unitTheme: row.unit_theme || '',
        learningObjectives: this.parseJSON(row.learning_objectives) || [],
        keyVocabulary: this.parseJSON(row.key_vocabulary) || [],
        contentSummary: row.content_summary || '',
        extractionConfidence: parseFloat(row.extraction_confidence || '0'),
        sessionCount: parseInt(row.session_count || '1'),
        contentLength: parseInt(row.content_length || '0')
      }));
    } else {
      // Legacy database fallback - check if there's any data
      const lessonCount = this.db.prepare("SELECT COUNT(*) as count FROM lessons").get() as any;
      
      if (lessonCount.count === 0) {
        console.warn('⚠️ Legacy database is empty - no lessons found. Consider using precision database.');
        return [];
      }

      // Query legacy database structure
      const query = `
        SELECT DISTINCT
          l.id, l.title, l.lesson_number, 
          CAST(l.lesson_number as INTEGER) as unit_number,
          'Unit ' || l.lesson_number as unit_title,
          l.standards, u.id as grade,
          'V1' as volume, 'mathematics' as subject,
          '' as unit_theme, '' as learning_objectives, '' as key_vocabulary,
          'Legacy lesson data - limited information available' as content_summary,
          0.3 as extraction_confidence,
          1 as session_count,
          100 as content_length
        FROM lessons l
        LEFT JOIN units u ON l.unit_id = u.id
        ORDER BY l.lesson_number
      `;

      const results = this.db.prepare(query).all() as any[];
      console.log(`📚 Found ${results.length} legacy lessons (limited data)`);
      
      return results.map(row => ({
        id: row.id,
        title: row.title || 'Legacy Lesson',
        lesson_number: parseInt(row.lesson_number || '0'),
        unit_number: row.unit_number || 0,
        unit_title: row.unit_title || 'Legacy Unit',
        grade: parseInt(row.grade || '6'),
        volume: row.volume || 'V1',
        subject: row.subject || 'mathematics',
        standards: this.parseJSON(row.standards) || [],
        unitTheme: row.unit_theme || '',
        learningObjectives: this.parseJSON(row.learning_objectives) || [],
        keyVocabulary: this.parseJSON(row.key_vocabulary) || [],
        contentSummary: row.content_summary || '',
        extractionConfidence: parseFloat(row.extraction_confidence || '0'),
        sessionCount: parseInt(row.session_count || '1'),
        contentLength: parseInt(row.content_length || '0')
      }));
    }
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
        ls.unit_theme,
        ls.estimated_days,
        ls.is_major_work,
        ls.extraction_confidence
      FROM lesson_summaries_gpt5 ls
      WHERE ls.grade IN (${placeholders})
        AND (
          ls.title LIKE 'LESSON %' 
          OR ls.title LIKE 'Lesson %'
          OR ls.title LIKE '%LESSON %'
          OR (ls.lesson_number BETWEEN 1 AND 50 AND ls.title NOT LIKE '%page%' AND ls.title NOT LIKE '%session%')
        )
        AND LENGTH(ls.title) > 10
        AND ls.extraction_confidence > 0.3
      ORDER BY ls.grade, ls.lesson_number
    `);

    const results = query.all(...grades.map(g => g.toString())) as any[];
    console.log(`📚 Found ${results.length} filtered curriculum lessons for grades ${grades.join(', ')}`);
    
    const lessons = results.map((row: any) => this.processLessonRow(row));
    this.lessonsCache.set(cacheKey, lessons);
    
    return lessons;
  }

  /**
   * Get lessons filtered by grades AND volumes (for precise curriculum selection)
   */
  getLessonsByGradeVolume(grades: number[], volumes: string[] = []): PrecisionLessonData[] {
    if (!this.isPrecisionDb) {
      console.warn('⚠️ Volume filtering only available with precision database');
      return this.getLessonsByGrades(grades);
    }

    // Build grade and volume filters
    const gradeList = grades.map(g => g.toString());
    
    let volumeFilter = '';
    let params = [...gradeList];
    if (volumes.length > 0) {
      volumeFilter = ` AND d.volume IN (${volumes.map(() => '?').join(',')})`;
      params.push(...volumes);
    }
    
    // Query for actual curriculum lessons only
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
        ls.unit_theme,
        ls.estimated_days,
        ls.is_major_work,
        ls.extraction_confidence,
        d.volume
      FROM lesson_summaries_gpt5 ls
      JOIN lessons l ON ls.lesson_id = l.id
      JOIN documents d ON l.document_id = d.id
      WHERE ls.grade IN (${gradeList.map(() => '?').join(',')})
        ${volumeFilter}
        AND (
          ls.title LIKE 'LESSON %' 
          OR ls.title LIKE 'Lesson %'
          OR ls.title LIKE '%LESSON %'
          OR (ls.lesson_number BETWEEN 1 AND 50 AND ls.title NOT LIKE '%page%' AND ls.title NOT LIKE '%session%')
        )
        AND LENGTH(ls.title) > 10
        AND ls.extraction_confidence > 0.3
      ORDER BY d.grade, d.volume, ls.lesson_number
    `);

    const results = query.all(...params) as any[];
    const volumeText = volumes.length > 0 ? ` volumes ${volumes.join(',')}` : ' all volumes';
    console.log(`📚 Found ${results.length} filtered curriculum lessons for grades ${grades.join(', ')}${volumeText}`);
    
    return results.map((row: any) => this.processLessonRow(row));
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
   * Generate custom pacing guide with precision lesson data and volume selection
   */
  generateCustomPathway(parameters: {
    gradeRange: number[];
    volumes?: string[];
    targetPopulation: string;
    totalDays: number;
    majorWorkFocus: number;
    includePrerequisites: boolean;
  }): PrecisionLessonData[] {
    console.log('🎯 Generating precision pathway with parameters:', parameters);
    
    // Use volume-aware method if volumes specified
    let lessons = parameters.volumes && parameters.volumes.length > 0 
      ? this.getLessonsByGradeVolume(parameters.gradeRange, parameters.volumes)
      : this.getLessonsByGrades(parameters.gradeRange);
      
    const volumeText = parameters.volumes && parameters.volumes.length > 0 
      ? ` (volumes: ${parameters.volumes.join(', ')})` : '';
    console.log(`📚 Found ${lessons.length} precision lessons for grades ${parameters.gradeRange.join(', ')}${volumeText}`);
    
    if (lessons.length === 0) {
      console.warn('❌ No lessons found for specified grades and volumes');
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
    let sql: string;
    let params: any[];

    if (this.isPrecisionDb) {
      // Precision database search
      sql = `
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
      params = [`%${query}%`, `%${query}%`];
      
      if (grades && grades.length > 0) {
        const placeholders = grades.map(() => '?').join(',');
        sql += ` AND ls.grade IN (${placeholders})`;
        params.push(...grades.map(g => g.toString()));
      }
      
      sql += ` ORDER BY ls.grade, l.lesson_number`;
    } else {
      // Legacy database search
      sql = `
        SELECT 
          s.id as lesson_id,
          s.page_start as lesson_number,
          s.title,
          'Unit ' || s.section_number as unit_theme,
          d.grade,
          0.3 as extraction_confidence,
          d.filename
        FROM sections s
        JOIN documents d ON s.document_id = d.id
        WHERE s.title LIKE '%LESSON%' AND (s.title LIKE ? OR s.content LIKE ?)
      `;
      params = [`%${query}%`, `%${query}%`];
      
      if (grades && grades.length > 0) {
        const placeholders = grades.map(() => '?').join(',');
        sql += ` AND d.grade IN (${placeholders})`;
        params.push(...grades.map(g => g.toString()));
      }
      
      sql += ` ORDER BY d.grade, s.page_start`;
    }
    
    const query_stmt = this.db.prepare(sql);
    return query_stmt.all(...params) as any[];
  }

  /**
   * Get lesson details including sessions
   */
  getLessonDetails(lessonId: number): any {
    if (this.isPrecisionDb) {
      // Precision database lesson details
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
        sessions
      };
    } else {
      // Legacy database lesson details
      const lessonQuery = this.db.prepare(`
        SELECT s.*, d.filename, d.grade
        FROM sections s
        JOIN documents d ON s.document_id = d.id
        WHERE s.id = ?
      `);
      
      const lesson = lessonQuery.get(lessonId);
      if (!lesson) return null;

      // No sessions table in legacy db, return basic structure
      return {
        lesson: {
          ...lesson,
          gpt5_context: (lesson as any).content?.substring(0, 500) || '',
          extraction_confidence: 0.3
        },
        sessions: [] // Empty for legacy database
      };
    }
  }

  close() {
    this.db.close();
    console.log('🔌 Closed precision database connection');
  }

  /**
   * Safely parse JSON strings, return empty array on error
   */
  private parseJSON(jsonString: string | null): any[] {
    if (!jsonString || jsonString.trim() === '' || jsonString === '[]') {
      return [];
    }
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return [];
    }
  }
}

export default PrecisionCurriculumService;
