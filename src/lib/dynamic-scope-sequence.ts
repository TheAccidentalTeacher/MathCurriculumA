/**
 * Dynamic Scope & Sequence Service
 * 
 * Generates pacing information dynamically from the actual curriculum data
 * rather than using hardcoded values. Reads from the lesson boundaries 
 * defined in the curriculum system.
 */

import { PacingCurriculumIntegration } from './pacing-curriculum-integration';

export interface ScopeSequenceData {
  grade: string;
  displayName: string;
  totalLessons: number;
  totalUnits: number;
  estimatedDays: number;
  documents: {
    id: string;
    title: string;
    volume: string;
    lessons: number;
  }[];
  units: {
    unitNumber: number;
    unitTitle: string;
    lessonCount: number;
    estimatedDays: number;
    topics: string[];
  }[];
}

export interface DynamicPacingConfig {
  grade: string;
  totalLessons: number;
  averageSessionsPerLesson: number;
  totalSessions: number;
  estimatedDays: number;
  pacing: {
    standard: number; // lessons per week
    accelerated: number;
    intensive: number;
  };
}

export class DynamicScopeSequenceService {
  private curriculumIntegration: PacingCurriculumIntegration;
  
  // Standard pacing assumptions based on educational research
  private static readonly PACING_ASSUMPTIONS = {
    sessionsPerWeek: 5,
    averageSessionsPerLesson: 1.2, // Some lessons take multiple sessions
    bufferDays: 0.15, // 15% buffer for assessments, reviews, etc.
    standardPace: 1.0, // 1 lesson per day baseline
    acceleratedMultiplier: 1.3,
    intensiveMultiplier: 1.6
  };

  constructor() {
    this.curriculumIntegration = new PacingCurriculumIntegration();
  }

  /**
   * Get dynamic scope and sequence data for all grades
   */
  async getAllScopeSequenceData(): Promise<ScopeSequenceData[]> {
    const grades = ['6', '7', '8', '9'];
    const scopeData: ScopeSequenceData[] = [];

    for (const grade of grades) {
      try {
        const data = await this.getScopeSequenceForGrade(grade);
        scopeData.push(data);
      } catch (error) {
        console.warn(`Could not load scope data for grade ${grade}:`, error);
      }
    }

    return scopeData;
  }

  /**
   * Get scope and sequence data for a specific grade
   */
  async getScopeSequenceForGrade(grade: string): Promise<ScopeSequenceData> {
    console.log(`🔍 [DynamicScopeSequence] Loading scope data for grade ${grade}`);
    
    const curriculumData = await this.curriculumIntegration.getCurriculumDataForGrade(grade);
    
    // Calculate total lessons from actual curriculum data
    const totalLessons = curriculumData.totalLessons;
    
    // Map documents with lesson counts
    const documents = curriculumData.documents.map(doc => ({
      id: doc.id,
      title: doc.title,
      volume: doc.volume,
      lessons: doc.totalLessons
    }));

    // Extract units from curriculum data
    const units = curriculumData.units.map((unit, index) => ({
      unitNumber: index + 1,
      unitTitle: unit.unitTitle,
      lessonCount: unit.lessons.length,
      estimatedDays: this.calculateUnitDays(unit.lessons.length),
      topics: unit.lessons.map(lesson => lesson.title)
    }));

    // Calculate estimated days with buffer
    const baseDays = totalLessons * DynamicScopeSequenceService.PACING_ASSUMPTIONS.averageSessionsPerLesson;
    const estimatedDays = Math.ceil(baseDays * (1 + DynamicScopeSequenceService.PACING_ASSUMPTIONS.bufferDays));

    const displayName = this.getGradeDisplayName(grade);

    return {
      grade,
      displayName,
      totalLessons,
      totalUnits: units.length,
      estimatedDays,
      documents,
      units
    };
  }

  /**
   * Generate dynamic pacing configurations for a grade
   */
  async getDynamicPacingConfig(grade: string): Promise<DynamicPacingConfig> {
    const scopeData = await this.getScopeSequenceForGrade(grade);
    const assumptions = DynamicScopeSequenceService.PACING_ASSUMPTIONS;
    
    const totalSessions = Math.ceil(scopeData.totalLessons * assumptions.averageSessionsPerLesson);
    
    // Calculate different pacing options
    const standardLessonsPerWeek = assumptions.standardPace * assumptions.sessionsPerWeek;
    const acceleratedLessonsPerWeek = standardLessonsPerWeek * assumptions.acceleratedMultiplier;
    const intensiveLessonsPerWeek = standardLessonsPerWeek * assumptions.intensiveMultiplier;

    return {
      grade,
      totalLessons: scopeData.totalLessons,
      averageSessionsPerLesson: assumptions.averageSessionsPerLesson,
      totalSessions,
      estimatedDays: scopeData.estimatedDays,
      pacing: {
        standard: Math.round(standardLessonsPerWeek * 10) / 10,
        accelerated: Math.round(acceleratedLessonsPerWeek * 10) / 10,
        intensive: Math.round(intensiveLessonsPerWeek * 10) / 10
      }
    };
  }

  /**
   * Get cross-grade accelerated pathway configurations
   */
  async getAcceleratedPathwayConfigs(): Promise<{
    pathway: string;
    grades: string[];
    totalLessons: number;
    estimatedDays: number;
    description: string;
  }[]> {
    const pathways = [
      {
        pathway: 'grade-7-8-accelerated',
        grades: ['7', '8'],
        description: 'Accelerated Grade 7-8 pathway combining key concepts'
      },
      {
        pathway: 'grade-8-algebra1-accelerated', 
        grades: ['8', '9'],
        description: 'Accelerated Grade 8 to Algebra I pathway'
      },
      {
        pathway: 'grade-8-9-accelerated',
        grades: ['8', '9'],
        description: 'Advanced Grade 8-9 pathway with Algebra II concepts'
      }
    ];

    const configs = [];
    
    for (const pathway of pathways) {
      let totalLessons = 0;
      let totalDays = 0;
      
      for (const grade of pathway.grades) {
        const scopeData = await this.getScopeSequenceForGrade(grade);
        totalLessons += scopeData.totalLessons;
        totalDays += scopeData.estimatedDays;
      }
      
      // Accelerated pathways typically compress content by 20-30%
      const acceleratedDays = Math.ceil(totalDays * 0.75);
      
      configs.push({
        ...pathway,
        totalLessons,
        estimatedDays: acceleratedDays
      });
    }
    
    return configs;
  }

  /**
   * Generate lesson-level pacing recommendations
   */
  async getLessonLevelPacing(grade: string, scheduleType: 'standard' | 'block' | 'modified'): Promise<{
    lessonNumber: number;
    title: string;
    recommendedSessions: number;
    estimatedMinutes: number;
    sequenceDay: number;
  }[]> {
    const curriculumData = await this.curriculumIntegration.getCurriculumDataForGrade(grade);
    const sessionMinutes = this.getSessionLength(scheduleType);
    
    const pacing = [];
    let currentDay = 1;

    for (const unit of curriculumData.units) {
      for (const lesson of unit.lessons) {
        const sessions = this.calculateLessonSessions(lesson.title, scheduleType);
        const totalMinutes = sessions * sessionMinutes;
        
        pacing.push({
          lessonNumber: lesson.lessonNumber,
          title: lesson.title,
          recommendedSessions: sessions,
          estimatedMinutes: totalMinutes,
          sequenceDay: currentDay
        });
        
        currentDay += sessions;
      }
    }
    
    return pacing;
  }

  /**
   * Private helper methods
   */
  private calculateUnitDays(lessonCount: number): number {
    const assumptions = DynamicScopeSequenceService.PACING_ASSUMPTIONS;
    const baseDays = lessonCount * assumptions.averageSessionsPerLesson;
    return Math.ceil(baseDays * (1 + assumptions.bufferDays));
  }

  private getGradeDisplayName(grade: string): string {
    const gradeMap: { [key: string]: string } = {
      '6': 'Grade 6',
      '7': 'Grade 7', 
      '8': 'Grade 8',
      '9': 'Algebra 1'
    };
    return gradeMap[grade] || `Grade ${grade}`;
  }

  private getSessionLength(scheduleType: string): number {
    const sessionLengths: { [key: string]: number } = {
      'standard': 50,
      'block': 90,
      'modified': 75
    };
    return sessionLengths[scheduleType] || 50;
  }

  private calculateLessonSessions(lessonTitle: string, scheduleType: string): number {
    // Analyze lesson title to determine complexity and recommend sessions
    const complexityIndicators = [
      'solve problems', 'analyze', 'apply', 'construct', 'prove',
      'systems', 'functions', 'quadratic', 'polynomial'
    ];
    
    const lowerTitle = lessonTitle.toLowerCase();
    const complexityScore = complexityIndicators.reduce((score, indicator) => {
      return lowerTitle.includes(indicator) ? score + 1 : score;
    }, 0);
    
    // Base sessions: 1 for standard, adjust based on complexity and schedule
    let sessions = 1;
    
    if (complexityScore >= 2) sessions = 2;
    if (complexityScore >= 4) sessions = 3;
    
    // Adjust for schedule type
    if (scheduleType === 'block' && sessions > 1) {
      sessions = Math.ceil(sessions * 0.7); // Block schedules can cover more
    }
    
    return Math.max(1, sessions);
  }
}

export const dynamicScopeSequenceService = new DynamicScopeSequenceService();
