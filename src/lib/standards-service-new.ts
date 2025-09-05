import { PacingCurriculumIntegration, DetectedLesson, GradeCurriculum } from './pacing-curriculum-integration';

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
      console.log(`📚 [StandardsService] Getting standards for grade ${gradeLevel}`);
      const curriculumData = await this.curriculumIntegration.getCurriculumForGrade(gradeLevel);
      
      const mappings: StandardsMapping[] = [];
      
      // Convert detected lessons to standards mappings
      for (const unit of curriculumData.unitStructure) {
        for (const lesson of unit.lessons) {
          mappings.push({
            gradeLevel,
            unit: unit.unitTitle,
            lesson: lesson.title,
            standards: this.generateStandardsForLesson(lesson, gradeLevel),
            focusType: this.determineFocusType(lesson),
            instructionalDays: this.estimateInstructionalDays(lesson)
          });
        }
      }

      console.log(`✅ [StandardsService] Grade ${gradeLevel}: ${mappings.length} standards mappings`);
      return mappings;
    } catch (error) {
      console.error('❌ [StandardsService] Error fetching standards for grade:', error);
      return [];
    }
  }

  async getStandardsByFocus(gradeLevel: string, focusType: 'major' | 'supporting' | 'additional'): Promise<StandardsMapping[]> {
    const allStandards = await this.getStandardsForGrade(gradeLevel);
    return allStandards.filter(standard => standard.focusType === focusType);
  }

  async getAllGrades(): Promise<string[]> {
    // Return grades that have curriculum data
    return ['6', '7', '8'];
  }

  async getLessonSessions(lessonId: string): Promise<SessionData[]> {
    // For now, return basic session structure
    // This would need to be implemented if session-level data is needed
    return [];
  }

  /**
   * Generate standards codes for a lesson based on its content
   */
  private generateStandardsForLesson(lesson: DetectedLesson, gradeLevel: string): string[] {
    const standards: string[] = [];
    const gradePrefix = `${gradeLevel}.`;
    
    // Generate standards based on lesson title and content
    // This is a simplified version - in a real system you'd have a mapping
    if (lesson.title.toLowerCase().includes('equation')) {
      standards.push(`${gradePrefix}EE.4`); // Expressions and Equations
    }
    if (lesson.title.toLowerCase().includes('ratio')) {
      standards.push(`${gradePrefix}RP.1`); // Ratios and Proportional Relationships
    }
    if (lesson.title.toLowerCase().includes('fraction')) {
      standards.push(`${gradePrefix}NS.1`); // Number System
    }
    if (lesson.title.toLowerCase().includes('geometry') || lesson.title.toLowerCase().includes('area')) {
      standards.push(`${gradePrefix}G.1`); // Geometry
    }
    if (lesson.title.toLowerCase().includes('statistics') || lesson.title.toLowerCase().includes('data')) {
      standards.push(`${gradePrefix}SP.1`); // Statistics and Probability
    }
    
    // Default standard if none match
    if (standards.length === 0) {
      standards.push(`${gradePrefix}MATH.${lesson.lessonNumber}`);
    }
    
    return standards;
  }

  /**
   * Determine focus type based on lesson characteristics
   */
  private determineFocusType(lesson: DetectedLesson): 'major' | 'supporting' | 'additional' {
    // Simple heuristic based on lesson number and content
    if (lesson.lessonNumber <= 20) {
      return 'major'; // Early lessons are usually major concepts
    } else if (lesson.lessonNumber <= 30) {
      return 'supporting';
    } else {
      return 'additional';
    }
  }

  /**
   * Estimate instructional days for a lesson
   */
  private estimateInstructionalDays(lesson: DetectedLesson): number {
    // Estimate based on session count and page count
    const basedays = lesson.sessionCount || 1;
    const pageSpan = lesson.endPage - lesson.startPage + 1;
    
    // More pages generally means more instructional time
    if (pageSpan > 10) {
      return basedays + 1;
    }
    
    return Math.max(1, basedays);
  }

  async disconnect() {
    // No database connection to disconnect in this implementation
  }
}
