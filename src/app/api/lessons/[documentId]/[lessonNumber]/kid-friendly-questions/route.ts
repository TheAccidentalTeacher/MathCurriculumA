import { NextRequest, NextResponse } from 'next/server';
import { LessonContentService } from '@/lib/lesson-content-service';

interface RouteParams {
  documentId: string;
  lessonNumber: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { documentId, lessonNumber } = params;

    if (!documentId || !lessonNumber) {
      return NextResponse.json(
        { error: 'Document ID and lesson number are required' },
        { status: 400 }
      );
    }

    // First get the lesson analysis/summary
    const lessonAnalysis = await LessonContentService.analyzeCompleteVisualLesson(documentId, parseInt(lessonNumber));
    
    // Then generate kid-friendly questions based on that summary
    const questions = await LessonContentService.generateKidFriendlyQuestions(lessonAnalysis);

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('❌ [API] Error generating kid-friendly questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}