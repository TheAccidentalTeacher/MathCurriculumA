/**
 * Real Curriculum Database Service
 * Works with the existing SQLite database that contains extracted curriculum data
 */

import Database from 'better-sqlite3';
import { join } from 'path';

interface CurriculumDocument {
  id: number;
  filename: string;
  title: string;
  grade: number;
  subject: string;
  publisher: string;
  version: string;
  total_pages: number;
  extracted_at: number;
  raw_text: string;
  metadata: string;
}

interface CurriculumSection {
  id: number;
  document_id: number;
  title: string;
  section_number: string;
  start_page: number;
  end_page: number;
  content: string;
  section_type: string;
}

interface LessonData {
  id: number;
  title: string;
  lessonNumber: string;
  grade: number;
  volume: string;
  startPage: number;
  endPage: number;
  majorWork: boolean;
  estimatedDays: number;
  prerequisites: string[];
  standards: string[];
  unit: string;
}

export class RealCurriculumService {
  private db: Database.Database;
  private lessonsCache: Map<string, LessonData[]> = new Map();

  constructor() {
    const dbPath = join(process.cwd(), 'curriculum.db');
    this.db = new Database(dbPath);
    
    // Enable WAL mode for better performance
    this.db.pragma('journal_mode = WAL');
  }

  /**
   * Get all documents in the database
   */
  getAllDocuments(): CurriculumDocument[] {
    const query = this.db.prepare(`
      SELECT id, filename, title, grade, subject, publisher, version, 
             total_pages, extracted_at, raw_text, metadata 
      FROM documents 
      ORDER BY grade, filename
    `);
    
    return query.all() as CurriculumDocument[];
  }

  /**
   * Get all lessons from all grades
   */
  getAllLessons(): LessonData[] {
    const query = this.db.prepare(`
      SELECT 
        s.id,
        s.title,
        s.start_page,
        s.end_page,
        s.content,
        d.grade,
        d.filename,
        d.total_pages
      FROM sections s
      JOIN documents d ON s.document_id = d.id
      WHERE s.title LIKE '%LESSON%'
        AND s.title NOT LIKE '%End of Lesson%'
        AND s.title NOT LIKE '%Personalized%'
        AND LENGTH(s.title) > 10
      ORDER BY d.grade, s.start_page
    `);

    const sections = query.all() as any[];
    
    return sections.map(section => this.parseLesson(section));
  }

  /**
   * Get lessons filtered by grade range
   */
  getLessonsByGrade(grades: number[]): LessonData[] {
    const placeholders = grades.map(() => '?').join(',');
    const query = this.db.prepare(`
      SELECT 
        s.id,
        s.title,
        s.start_page,
        s.end_page,
        s.content,
        d.grade,
        d.filename,
        d.total_pages
      FROM sections s
      JOIN documents d ON s.document_id = d.id
      WHERE s.title LIKE '%LESSON%'
        AND s.title NOT LIKE '%End of Lesson%'
        AND s.title NOT LIKE '%Personalized%'
        AND LENGTH(s.title) > 10
        AND d.grade IN (${placeholders})
      ORDER BY d.grade, s.start_page
    `);

    const sections = query.all(...grades) as any[];
    return sections.map(section => this.parseLesson(section));
  }

  /**
   * Get lessons for accelerated pathway (Grade 6-7-8 combined)
   */
  getAcceleratedPathwayLessons(): LessonData[] {
    // For now, get all lessons from grades 6, 7, 8
    // In a real implementation, this would filter based on accelerated sequence
    return this.getLessonsByGrade([6, 7, 8]);
  }

  /**
   * Parse raw lesson data into structured format
   */
  private parseLesson(section: any): LessonData {
    const title = section.title;
    const grade = section.grade;
    
    // Extract lesson number from title
    const lessonMatch = title.match(/LESSON\s+(\d+)/i);
    const lessonNumber = lessonMatch ? lessonMatch[1] : '0';
    
    // Clean up the lesson title
    let cleanTitle = title
      .replace(/.*LESSON\s+\d+\s*/i, '')
      .replace(/©.*$/, '')
      .replace(/Copying is not permitted\./, '')
      .trim();
    
    // Determine volume based on filename or page numbers
    let volume = 'V1';
    if (section.filename && section.filename.includes('V2')) {
      volume = 'V2';
    } else if (section.start_page && section.start_page > (section.total_pages / 2)) {
      volume = 'V2';
    }

    // Determine if it's major work (this is a simplified heuristic)
    const majorWorkTopics = [
      'proportional', 'ratio', 'equation', 'expression', 'function',
      'linear', 'algebra', 'integer', 'rational', 'coordinate'
    ];
    const isMajorWork = majorWorkTopics.some(topic => 
      cleanTitle.toLowerCase().includes(topic)
    );

    // Estimate instructional days (simplified)
    const pageCount = section.end_page - section.start_page;
    const estimatedDays = Math.max(1, Math.ceil(pageCount / 8));

    // Determine unit based on lesson number (simplified)
    let unit = 'Unit 1';
    const lessonNum = parseInt(lessonNumber);
    if (grade === 7) {
      if (lessonNum <= 6) unit = 'Unit A: Proportional Relationships';
      else if (lessonNum <= 14) unit = 'Unit B: Operations with Rational Numbers';
      else if (lessonNum <= 19) unit = 'Unit C: Expressions and Equations';
      else if (lessonNum <= 21) unit = 'Unit D: Percent and Proportional Relationships';
      else if (lessonNum <= 24) unit = 'Unit E: Sampling and Statistical Inference';
      else unit = 'Unit F: Geometric Applications';
    } else if (grade === 8) {
      if (lessonNum <= 7) unit = 'Unit A: Transformations and Angle Relationships';
      else if (lessonNum <= 14) unit = 'Unit B: Linear Relationships';
      else if (lessonNum <= 18) unit = 'Unit C: Functions';
      else if (lessonNum <= 25) unit = 'Unit D: Exponents and Scientific Notation';
      else if (lessonNum <= 28) unit = 'Unit E: Pythagorean Theorem and Geometry';
      else unit = 'Unit F: Statistics and Data Analysis';
    }

    return {
      id: section.id,
      title: cleanTitle,
      lessonNumber,
      grade,
      volume,
      startPage: section.start_page,
      endPage: section.end_page,
      majorWork: isMajorWork,
      estimatedDays,
      prerequisites: this.getPrerequisites(cleanTitle),
      standards: this.getStandards(grade, lessonNumber),
      unit
    };
  }

  /**
   * Get prerequisites for a lesson based on its title
   */
  private getPrerequisites(title: string): string[] {
    const prereqMap: { [key: string]: string[] } = {
      'scale': ['Ratio concepts', 'Multiplication fluency'],
      'unit rates': ['Fraction operations', 'Division concepts'],
      'proportional': ['Ratios', 'Equivalent fractions'],
      'coordinate': ['Coordinate plane understanding'],
      'equation': ['Algebraic thinking', 'Inverse operations'],
      'integer': ['Number line understanding', 'Positive/negative concepts'],
      'rational': ['Fraction operations', 'Decimal understanding'],
      'circle': ['Area formulas', 'Pi concept'],
      'geometry': ['Basic shapes', 'Measurement concepts'],
      'function': ['Coordinate plane', 'Input/output relationships']
    };

    const prerequisites: string[] = [];
    const lowerTitle = title.toLowerCase();
    
    for (const [key, prereqs] of Object.entries(prereqMap)) {
      if (lowerTitle.includes(key)) {
        prerequisites.push(...prereqs);
      }
    }

    return prerequisites.length > 0 ? prerequisites : ['Basic arithmetic'];
  }

  /**
   * Get standards for a lesson based on grade and lesson number
   */
  private getStandards(grade: number, lessonNumber: string): string[] {
    // This is simplified - in reality, you'd have a complete mapping
    const standards: string[] = [];
    const lessonNum = parseInt(lessonNumber);

    if (grade === 7) {
      if (lessonNum <= 6) {
        standards.push('7.RP.A.1', '7.RP.A.2', '7.RP.A.3');
      } else if (lessonNum <= 14) {
        standards.push('7.NS.A.1', '7.NS.A.2', '7.NS.A.3');
      } else if (lessonNum <= 19) {
        standards.push('7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4');
      }
    } else if (grade === 8) {
      if (lessonNum <= 7) {
        standards.push('8.G.A.1', '8.G.A.2', '8.G.A.3');
      } else if (lessonNum <= 14) {
        standards.push('8.EE.B.5', '8.EE.B.6', '8.F.A.1');
      } else if (lessonNum <= 18) {
        standards.push('8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4');
      }
    }

    return standards;
  }

  /**
   * Generate custom pacing guide based on parameters
   */
  generateCustomPathway(parameters: {
    gradeRange: number[];
    targetPopulation: 'accelerated' | 'standard' | 'scaffolded' | 'remedial';
    totalDays: number;
    majorWorkFocus: number; // percentage 0-100
    includePrerequisites: boolean;
  }): LessonData[] {
    let lessons = this.getLessonsByGrade(parameters.gradeRange);
    
    // Filter based on major work focus
    if (parameters.majorWorkFocus > 80) {
      // High focus: prioritize major work
      lessons = lessons.filter(lesson => lesson.majorWork || Math.random() < 0.3);
    } else if (parameters.majorWorkFocus > 60) {
      // Medium focus: include most lessons but prioritize major work
      lessons = lessons.filter(lesson => lesson.majorWork || Math.random() < 0.7);
    }
    
    // Adjust pacing based on target population
    lessons.forEach(lesson => {
      switch (parameters.targetPopulation) {
        case 'accelerated':
          lesson.estimatedDays = Math.max(1, Math.ceil(lesson.estimatedDays * 0.75));
          break;
        case 'scaffolded':
          lesson.estimatedDays = Math.ceil(lesson.estimatedDays * 1.5);
          break;
        case 'remedial':
          lesson.estimatedDays = Math.ceil(lesson.estimatedDays * 2);
          break;
        default:
          // standard - no change
          break;
      }
      
      if (parameters.includePrerequisites) {
        lesson.estimatedDays += 1; // Add a day for prerequisite review
      }
    });
    
    return lessons;
  }

  close() {
    this.db.close();
  }
}

export default RealCurriculumService;
