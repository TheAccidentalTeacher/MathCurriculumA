import { PacingCurriculumIntegration, LessonInfo } from './pacing-curriculum-integration';

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
  private curriculumIntegration: PacingCurriculumIntegration;

  constructor() {
    this.curriculumIntegration = new PacingCurriculumIntegration();
  }

  async getStandardsForGrade(gradeLevel: string): Promise<StandardsMapping[]> {
    try {
      console.log(`🔍 [StandardsService] Getting standards for grade ${gradeLevel}`);
      
      const curriculumData = await this.curriculumIntegration.getCurriculumDataForGrade(gradeLevel);
      const mappings: StandardsMapping[] = [];
      
      for (const unit of curriculumData.units) {
        for (const lesson of unit.lessons) {
          // Extract standards from lesson title (simplified approach)
          const standards = this.extractStandardsFromTitle(lesson.title);
          const focusType = this.determineFocusType(lesson.title);
          
          mappings.push({
            gradeLevel,
            unit: unit.unitTitle,
            lesson: lesson.title,
            standards,
            focusType,
            instructionalDays: this.estimateInstructionalDays(lesson)
          });
        }
      }

      console.log(`📊 [StandardsService] Generated ${mappings.length} standards mappings for grade ${gradeLevel}`);
      return mappings.sort((a, b) => a.lesson.localeCompare(b.lesson));
    } catch (error) {
      console.error('Error fetching standards for grade:', error);
      return [];
    }
  }

  async getStandardsByFocus(gradeLevel: string, focusType: 'major' | 'supporting' | 'additional'): Promise<StandardsMapping[]> {
    const allStandards = await this.getStandardsForGrade(gradeLevel);
    return allStandards.filter(standard => standard.focusType === focusType);
  }

  async getAllGrades(): Promise<string[]> {
    return this.curriculumIntegration.getAllGrades();
  }

  async getLessonSessions(lessonId: string): Promise<SessionData[]> {
    // This would need enhancement to extract actual session data
    // For now, return a default session
    return [{
      id: lessonId,
      sessionNumber: '1',
      title: 'Session 1',
      sessionType: 'explore',
      content: 'Session content placeholder',
      orderIndex: 1
    }];
  }

  /**
   * Extract mathematical standards from lesson title
   */
  private extractStandardsFromTitle(title: string): string[] {
    const standards: string[] = [];
    
    // Map lesson topics to common core standards (simplified)
    const standardsMap: { [key: string]: string[] } = {
      'expressions': ['6.EE.A.1', '6.EE.A.2', '7.EE.A.1'],
      'equations': ['6.EE.B.5', '6.EE.B.6', '7.EE.B.4'],
      'proportional': ['7.RP.A.1', '7.RP.A.2'],
      'ratios': ['6.RP.A.1', '6.RP.A.2', '6.RP.A.3'],
      'negative numbers': ['6.NS.C.5', '6.NS.C.6', '7.NS.A.1'],
      'integers': ['6.NS.C.5', '7.NS.A.1', '7.NS.A.2'],
      'fractions': ['6.NS.A.1', '7.NS.A.2'],
      'decimals': ['6.NS.B.3', '7.NS.A.2'],
      'inequalities': ['6.EE.B.5', '6.EE.B.8'],
      'percents': ['7.RP.A.3'],
      'probability': ['7.SP.C.5', '7.SP.C.6'],
      'area': ['6.G.A.1', '7.G.B.6'],
      'volume': ['6.G.A.2', '7.G.B.6'],
      'geometry': ['6.G.A.1', '7.G.A.1'],
      'transformations': ['8.G.A.1', '8.G.A.2'],
      'functions': ['8.F.A.1', '8.F.A.2'],
      'linear': ['8.F.B.4', '8.F.B.5'],
      'systems': ['8.EE.C.8'],
      'exponents': ['8.EE.A.1', '8.EE.A.3'],
      'pythagorean': ['8.G.B.7', '8.G.B.8']
    };

    const lowerTitle = title.toLowerCase();
    
    for (const [concept, conceptStandards] of Object.entries(standardsMap)) {
      if (lowerTitle.includes(concept)) {
        standards.push(...conceptStandards);
      }
    }

    // Remove duplicates
    return [...new Set(standards)];
  }

  /**
   * Determine focus type based on lesson content
   */
  private determineFocusType(title: string): 'major' | 'supporting' | 'additional' {
    const lowerTitle = title.toLowerCase();
    
    // Major focus areas (core grade-level concepts)
    const majorTopics = ['expressions', 'equations', 'proportional', 'ratios', 'fractions', 'linear', 'functions'];
    
    // Supporting focus areas (reinforce major work)
    const supportingTopics = ['integers', 'decimals', 'area', 'volume', 'geometry'];
    
    // Check for major topics first
    for (const topic of majorTopics) {
      if (lowerTitle.includes(topic)) {
        return 'major';
      }
    }
    
    // Check for supporting topics
    for (const topic of supportingTopics) {
      if (lowerTitle.includes(topic)) {
        return 'supporting';
      }
    }
    
    // Default to additional
    return 'additional';
  }

  /**
   * Estimate instructional days for a lesson
   */
  private estimateInstructionalDays(lesson: LessonInfo): number {
    // Estimate based on page count and typical lesson structure
    const pageCount = lesson.endPage - lesson.startPage + 1;
    
    if (pageCount <= 10) return 3;      // Short lesson: 3 days
    if (pageCount <= 20) return 5;      // Medium lesson: 5 days  
    if (pageCount <= 30) return 7;      // Long lesson: 7 days
    return Math.ceil(pageCount / 5);    // Very long lesson: ~1 day per 5 pages
  }

  async disconnect() {
    // No database connection to disconnect
  }
}
