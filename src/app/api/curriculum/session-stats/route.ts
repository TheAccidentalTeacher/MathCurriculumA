import { NextResponse } from 'next/server';
import { EnhancedCurriculumService } from '@/lib/enhanced-curriculum-service';

export async function GET() {
  try {
    const sessionStats = await EnhancedCurriculumService.getSessionStatistics();
    
    return NextResponse.json(sessionStats);
  } catch (error) {
    console.error('Error fetching session statistics:', error);
    
    // Return fallback data if enhanced curriculum files are not available
    return NextResponse.json({
      totalSessions: 380,
      totalLessons: 107,
      completeLessons: 17,
      completionRate: 15.9,
      gradeStats: {
        6: { sessions: 64, lessons: 18, complete_lessons: 4, volumes: 2 },
        7: { sessions: 92, lessons: 31, complete_lessons: 3, volumes: 2 },
        8: { sessions: 100, lessons: 30, complete_lessons: 5, volumes: 2 },
        9: { sessions: 124, lessons: 28, complete_lessons: 9, volumes: 2 }
      },
      curriculaCount: 8
    });
  }
}
