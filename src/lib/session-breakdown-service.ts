// Import the curriculum data structure
interface Lesson {
  number: number;
  title: string;
  sessions: number;
  startPage: number;
  endPage: number;
  isMajorWork?: boolean;
  standards?: string[];
}

interface Unit {
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  totalLessons: number;
  estimatedDays: number;
  majorWorkCount: number;
}

interface Grade {
  level: number;
  title: string;
  volume1: Unit[];
  volume2: Unit[];
}

export interface SessionDetail {
  sessionNumber: number;
  sessionName: string;
  sessionType: 'explore' | 'develop' | 'refine';
  dayNumber: number;
  focus: string;
  activities: string[];
  estimatedMinutes: number;
}

export interface LessonWithSessions {
  lessonNumber: number;
  lessonTitle: string;
  totalSessions: number;
  sessions: SessionDetail[];
  startPage: number;
  endPage: number;
  isMajorWork: boolean;
}

export interface UnitWithSessionBreakdown {
  unitNumber: number;
  unitTitle: string;
  unitDescription: string;
  lessons: LessonWithSessions[];
  totalDays: number;
}

export class SessionBreakdownService {
  
  /**
   * Apply the 5-day session structure to existing curriculum lessons
   * Based on Ready Classroom Mathematics session patterns:
   * Day 1: Explore (introduction, prior knowledge activation)
   * Day 2-4: Develop (concept introduction, skill building, practice)
   * Day 5: Refine (review, reinforce, extend)
   */
  static generateSessionBreakdown(lessonData: Lesson): SessionDetail[] {
    const totalSessions = lessonData.sessions || 3; // Default to 3 if not specified
    const sessions: SessionDetail[] = [];
    
    for (let i = 1; i <= totalSessions; i++) {
      let sessionType: 'explore' | 'develop' | 'refine';
      let sessionName: string;
      let focus: string;
      let activities: string[] = [];
      
      if (i === 1) {
        // First session is always Explore
        sessionType = 'explore';
        sessionName = 'Explore Session';
        focus = 'Prior knowledge activation, concept introduction';
        activities = [
          'Connect prior knowledge',
          'Introduce new concepts',
          'Hands-on exploration',
          'Initial practice'
        ];
      } else if (i === totalSessions) {
        // Last session is always Refine
        sessionType = 'refine';
        sessionName = 'Refine Session';
        focus = 'Review, reinforce, and extend learning';
        activities = [
          'Review key concepts',
          'Reinforce understanding',
          'Extend learning',
          'Connect to other concepts'
        ];
      } else {
        // Middle sessions are Develop
        sessionType = 'develop';
        sessionName = `Develop Session ${i - 1}`;
        focus = 'Build conceptual understanding and procedural skills';
        activities = [
          'Build conceptual understanding',
          'Develop procedural skills',
          'Guided practice',
          'Independent practice'
        ];
      }
      
      sessions.push({
        sessionNumber: i,
        sessionName,
        sessionType,
        dayNumber: i,
        focus,
        activities,
        estimatedMinutes: 50 // Standard class period
      });
    }
    
    return sessions;
  }
  
  /**
   * Convert existing curriculum structure to include session breakdowns
   * For now, we'll use a simplified approach to demonstrate the concept
   */
  static adaptExistingCurriculum(): { [grade: string]: UnitWithSessionBreakdown[] } {
    // Sample data structure - in a real implementation, this would come from your curriculum database
    const sampleGrade6Data: Unit[] = [
      {
        number: 1,
        title: "Expressions and Equations",
        description: "Area, Algebraic Expressions, and Exponents",
        totalLessons: 6,
        estimatedDays: 30,
        majorWorkCount: 6,
        lessons: [
          { number: 1, title: "Find the Area of a Parallelogram", sessions: 3, startPage: 3, endPage: 18, isMajorWork: true },
          { number: 2, title: "Find the Area of Triangles and Other Polygons", sessions: 3, startPage: 19, endPage: 40, isMajorWork: true },
          { number: 3, title: "Use Nets to Find Surface Area", sessions: 3, startPage: 41, endPage: 62, isMajorWork: true },
        ]
      }
    ];
    
    const adaptedCurriculum: { [grade: string]: UnitWithSessionBreakdown[] } = {};
    
    // Process Grade 6 sample data
    adaptedCurriculum['6'] = sampleGrade6Data.map(unit => {
      const adaptedUnit: UnitWithSessionBreakdown = {
        unitNumber: unit.number,
        unitTitle: unit.title,
        unitDescription: unit.description,
        lessons: [],
        totalDays: 0
      };
      
      // Process each lesson in the unit
      unit.lessons.forEach((lesson: Lesson) => {
        const sessionBreakdown = this.generateSessionBreakdown(lesson);
        
        const lessonWithSessions: LessonWithSessions = {
          lessonNumber: lesson.number,
          lessonTitle: lesson.title,
          totalSessions: lesson.sessions,
          sessions: sessionBreakdown,
          startPage: lesson.startPage,
          endPage: lesson.endPage,
          isMajorWork: lesson.isMajorWork || false
        };
        
        adaptedUnit.lessons.push(lessonWithSessions);
        adaptedUnit.totalDays += lesson.sessions;
      });
      
      return adaptedUnit;
    });
    
    return adaptedCurriculum;
  }
  
  /**
   * Get session breakdown for a specific lesson
   */
  static getLessonSessionBreakdown(grade: string, lessonNumber: number): LessonWithSessions | null {
    const adaptedCurriculum = this.adaptExistingCurriculum();
    const gradeData = adaptedCurriculum[grade];
    
    if (!gradeData) return null;
    
    for (const unit of gradeData) {
      const lesson = unit.lessons.find(l => l.lessonNumber === lessonNumber);
      if (lesson) {
        return lesson;
      }
    }
    
    return null;
  }
  
  /**
   * Get all sessions for a specific grade
   */
  static getAllSessionsForGrade(grade: string): SessionDetail[] {
    const adaptedCurriculum = this.adaptExistingCurriculum();
    const gradeData = adaptedCurriculum[grade];
    
    if (!gradeData) return [];
    
    const allSessions: SessionDetail[] = [];
    
    gradeData.forEach(unit => {
      unit.lessons.forEach(lesson => {
        allSessions.push(...lesson.sessions);
      });
    });
    
    return allSessions;
  }
  
  /**
   * Generate pacing calendar with session-level detail
   */
  static generateSessionPacingCalendar(grade: string, startDate: Date = new Date()): any[] {
    const adaptedCurriculum = this.adaptExistingCurriculum();
    const gradeData = adaptedCurriculum[grade];
    
    if (!gradeData) return [];
    
    const calendar: any[] = [];
    let currentDate = new Date(startDate);
    
    gradeData.forEach(unit => {
      unit.lessons.forEach(lesson => {
        lesson.sessions.forEach(session => {
          // Skip weekends
          while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          
          calendar.push({
            date: new Date(currentDate),
            unitNumber: unit.unitNumber,
            unitTitle: unit.unitTitle,
            lessonNumber: lesson.lessonNumber,
            lessonTitle: lesson.lessonTitle,
            session: session,
            isMajorWork: lesson.isMajorWork
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        });
      });
    });
    
    return calendar;
  }
}
