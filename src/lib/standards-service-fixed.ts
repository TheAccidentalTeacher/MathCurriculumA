import { PrismaClient } from '@prisma/client';

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
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getStandardsForGrade(gradeLevel: string): Promise<StandardsMapping[]> {
    try {
      const documents = await this.prisma.document.findMany({
        where: {
          grade_level: gradeLevel
        },
        include: {
          units: {
            include: {
              lessons: true
            },
            orderBy: { order_index: 'asc' }
          }
        }
      });

      const mappings: StandardsMapping[] = [];
      
      for (const document of documents) {
        for (const unit of document.units) {
          for (const lesson of unit.lessons) {
            mappings.push({
              gradeLevel,
              unit: unit.title,
              lesson: lesson.title,
              standards: JSON.parse(lesson.standards || '[]'),
              focusType: lesson.focus_type as 'major' | 'supporting' | 'additional',
              instructionalDays: lesson.instructional_days
            });
          }
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
      const lesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          sessions: {
            orderBy: { order_index: 'asc' }
          }
        }
      });

      if (!lesson) return [];

      return lesson.sessions.map((session) => ({
        id: session.id,
        sessionNumber: session.session_number,
        title: session.title || undefined,
        sessionType: session.session_type as 'explore' | 'develop' | 'refine' | undefined,
        content: session.content,
        orderIndex: session.order_index
      }));
    } catch (error) {
      console.error('Error fetching lesson sessions:', error);
      return [];
    }
  }

  async getStandardsByFocus(gradeLevel: string, focusType: 'major' | 'supporting' | 'additional'): Promise<StandardsMapping[]> {
    try {
      const documents = await this.prisma.document.findMany({
        where: {
          grade_level: gradeLevel
        },
        include: {
          units: {
            include: {
              lessons: {
                where: {
                  focus_type: focusType
                }
              }
            },
            orderBy: { order_index: 'asc' }
          }
        }
      });

      const mappings: StandardsMapping[] = [];
      
      for (const document of documents) {
        for (const unit of document.units) {
          for (const lesson of unit.lessons) {
            mappings.push({
              gradeLevel,
              unit: unit.title,
              lesson: lesson.title,
              standards: JSON.parse(lesson.standards || '[]'),
              focusType: lesson.focus_type as 'major' | 'supporting' | 'additional',
              instructionalDays: lesson.instructional_days
            });
          }
        }
      }

      return mappings.sort((a, b) => a.lesson.localeCompare(b.lesson));
    } catch (error) {
      console.error('Error fetching standards by focus:', error);
      return [];
    }
  }

  async getAllGrades(): Promise<string[]> {
    try {
      const documents = await this.prisma.document.findMany({
        select: { grade_level: true },
        distinct: ['grade_level']
      });
      
      return documents
        .map(d => d.grade_level)
        .filter(Boolean)
        .sort();
    } catch (error) {
      console.error('Error fetching available grades:', error);
      return [];
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
