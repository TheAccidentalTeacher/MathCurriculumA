import { CurriculumDatabaseIntegration, CurriculumDocument, UnitStructure } from './curriculum-database-integration';

export interface StandardsMapping {
  gradeLevel: string;
  unit: string;
  lesson: string;
  standards: string[];
  focusType?: 'major' | 'supporting' | 'additional';
  instructionalDays?: number;
}

export interface SessionData {
  id: string;
  sessionNumber: string;
  title?: string;
  sessionType?: 'explore' | 'develop' | 'refine';
  content: string;
  orderIndex: number;
}

export class StandardsService {
  private curriculumDb: CurriculumDatabaseIntegration;

  constructor() {
    this.curriculumDb = new CurriculumDatabaseIntegration();
  }

  async getStandardsForGrade(gradeLevel: string): Promise<StandardsMapping[]> {
    try {
      const curriculumData = await this.curriculumDb.getCurriculumDataForGrade(gradeLevel);
      const mappings: StandardsMapping[] = [];
      
      for (const unit of curriculumData.units) {
        for (const lesson of unit.lessons) {
          // Map lesson data to standards format
          mappings.push({
            gradeLevel,
            unit: unit.unitTitle,
            lesson: lesson.title,
            standards: lesson.keywords, // Use keywords as standards for now
            focusType: this.inferFocusType(lesson.title, lesson.keywords),
            instructionalDays: 1 // Rough estimate - each lesson = 1 day
          });
        }
      }

      return mappings.sort((a, b) => a.lesson.localeCompare(b.lesson));
    } catch (error) {
      console.error('Error fetching standards for grade:', error);
      return [];
    }
  }

  async getLessonSessions(lessonId: string): Promise<SessionData[]> {
    try {
      // For now, return empty array since we don't have session-level data in the current structure
      // This could be enhanced to parse content for session-like sections
      console.log('Session data not yet implemented for lesson:', lessonId);
      return [];
    } catch (error) {
      console.error('Error fetching lesson sessions:', error);
      return [];
    }
  }

  async getStandardsByFocus(gradeLevel: string, focusType: 'major' | 'supporting' | 'additional'): Promise<StandardsMapping[]> {
    try {
      const allStandards = await this.getStandardsForGrade(gradeLevel);
      return allStandards.filter(standard => standard.focusType === focusType);
    } catch (error) {
      console.error('Error fetching standards by focus:', error);
      return [];
    }
  }

  async getAllGrades(): Promise<string[]> {
    try {
      const documents = await this.curriculumDb.getDocuments();
      const grades = [...new Set(documents.map(doc => doc.grade.toString()))]
        .filter(grade => Boolean(grade))
        .sort();
      return grades;
    } catch (error) {
      console.error('Error fetching available grades:', error);
      return [];
    }
  }

  async disconnect() {
    // No cleanup needed for SQLite connections in this implementation
    return Promise.resolve();
  }

  /**
   * Helper method to infer focus type from lesson content
   */
  private inferFocusType(title: string, keywords: string[]): 'major' | 'supporting' | 'additional' {
    const titleLower = title.toLowerCase();
    const keywordsLower = keywords.map(k => k.toLowerCase());
    
    // Major concepts (core mathematical topics)
    const majorPatterns = [
      'equation', 'function', 'ratio', 'proportion', 'fraction', 'decimal', 'percent',
      'algebra', 'geometry', 'measurement', 'data', 'probability', 'statistics'
    ];
    
    // Supporting concepts (skills and procedures)
    const supportingPatterns = [
      'solve', 'calculate', 'compute', 'simplify', 'evaluate', 'graph', 'plot',
      'practice', 'drill', 'review', 'skill'
    ];
    
    // Check title and keywords for patterns
    const hasMajor = majorPatterns.some(pattern => 
      titleLower.includes(pattern) || keywordsLower.some(k => k.includes(pattern))
    );
    
    const hasSupporting = supportingPatterns.some(pattern => 
      titleLower.includes(pattern) || keywordsLower.some(k => k.includes(pattern))
    );
    
    if (hasMajor) return 'major';
    if (hasSupporting) return 'supporting';
    return 'additional';
  }
}
