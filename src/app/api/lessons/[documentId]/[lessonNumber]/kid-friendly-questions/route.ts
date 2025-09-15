import { NextRequest, NextResponse } from 'next/server';
import { LessonContentService } from '@/lib/lesson-content-service';

interface RouteParams {
  documentId: string;
  lessonNumber: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<RouteParams> }
) {
  try {
    const { documentId, lessonNumber } = await context.params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`📖 [API] Getting kid-friendly questions for ${documentId} - Lesson ${lessonNum}`);

    if (!documentId || !lessonNumber || isNaN(lessonNum)) {
      return NextResponse.json(
        { error: 'Document ID and lesson number are required' },
        { status: 400 }
      );
    }

    // 💰 COST SAVINGS: Check cache first before expensive generation
    const cacheStatus = LessonContentService.getCacheStatus();
    const questionsCacheKey = `lesson_questions_${documentId}_${lessonNum}`;
    
    const hasQuestions = cacheStatus.keys.includes(questionsCacheKey);
    
    console.log(`📊 [API] Kid-friendly questions cache status for ${documentId}-${lessonNum}:`, {
      questionsAvailable: hasQuestions,
      totalCached: cacheStatus.size
    });
    
    if (hasQuestions) {
      // Retrieve questions from cache
      const cachedQuestions = LessonContentService.getCachedQuestions(documentId, lessonNum);
      
      if (cachedQuestions && cachedQuestions.questions) {
        console.log(`🎯 [API] Retrieved ${cachedQuestions.questions.length} cached kid-friendly questions`);
        console.log(`💰 [API] COST SAVINGS: Used cached questions, no OpenAI API call needed!`);
        
        return NextResponse.json({ questions: cachedQuestions.questions }, { status: 200 });
      }
    }

    console.log(`🤖 [API] No cached questions found, generating new kid-friendly questions...`);

    // First get the lesson analysis/summary
    const lessonAnalysis = await LessonContentService.analyzeCompleteVisualLesson(documentId, lessonNum);
    
    // Then generate kid-friendly questions based on that summary
    const questions = await LessonContentService.generateKidFriendlyQuestions(lessonAnalysis);

    console.log(`💰 [API] Generated new kid-friendly questions and cached for future use`);

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('❌ [API] Error generating kid-friendly questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}