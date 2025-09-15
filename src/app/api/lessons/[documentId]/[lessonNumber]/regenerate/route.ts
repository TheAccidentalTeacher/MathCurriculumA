import { NextRequest, NextResponse } from 'next/server';
import { LessonContentService } from '@/lib/lesson-content-service';

export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string; lessonNumber: string } }
) {
  try {
    const { documentId, lessonNumber: lessonNumberStr } = params;
    const lessonNumber = parseInt(lessonNumberStr);
    
    console.log(`🔄 [API] Regenerating lesson analysis for ${documentId} - Lesson ${lessonNumber}`);

    // Clear the cache for this specific lesson
    await LessonContentService.clearLessonCache(documentId, lessonNumber);
    
    // Force fresh analysis by bypassing cache
    const analysis = await LessonContentService.analyzeCompleteVisualLesson(
      documentId, 
      lessonNumber,
      true // bypassCache = true
    );

    console.log(`✅ [API] Successfully regenerated lesson analysis for ${documentId} - Lesson ${lessonNumber}`);

    return NextResponse.json({
      success: true,
      message: 'Lesson analysis regenerated successfully',
      analysis,
      regeneratedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [API] Error regenerating lesson analysis:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to regenerate lesson analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
