import { NextRequest, NextResponse } from 'next/server';
import { DatabaseFreeLessonService } from '../../../../../lib/database-free-lesson-service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string; lessonNumber: string }> }
) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    if (isNaN(lessonNum)) {
      return NextResponse.json(
        { error: 'Invalid lesson number' },
        { status: 400 }
      );
    }

    const lessonData = await DatabaseFreeLessonService.getLessonData(documentId, lessonNum);
    
    return NextResponse.json({
      success: true,
      lesson: lessonData
    });
  } catch (error) {
    console.error('Lesson API error:', error);
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { 
          error: error.message,
          success: false 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to load lesson data',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Get available lessons for a document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string; lessonNumber: string }> }
) {
  try {
    const { documentId } = await params;
    // For now, use the same method - we'll need to add this to ReliableLessonService
    // const lessons = await ReliableLessonService.getAvailableLessons(documentId);
    
    return NextResponse.json({
      success: true,
      lessons: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]  // Temporary
    });
  } catch (error) {
    console.error('Available lessons API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to load available lessons',
        success: false 
      },
      { status: 500 }
    );
  }
}
