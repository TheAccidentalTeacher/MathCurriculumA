// src/app/api/lessons/[documentId]/[lessonNumber]/prepare/route.ts
// API endpoint for preparing lesson content for Virtual Tutor

import { NextRequest, NextResponse } from 'next/server';
import { LessonContentService } from '@/lib/lesson-content-service';

interface RouteParams {
  params: Promise<{
    documentId: string;
    lessonNumber: string;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`📚 Preparing lesson content for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Check if we already have cached analysis
    const cachedAnalysis = await LessonContentService.getCachedLessonAnalysis(documentId, lessonNum);
    
    if (cachedAnalysis) {
      console.log(`✅ Using cached analysis for ${documentId} - Lesson ${lessonNum}`);
      return NextResponse.json({
        success: true,
        analysis: cachedAnalysis,
        cached: true,
        message: 'Lesson content ready from cache'
      });
    }

    // Prepare fresh analysis
    const startTime = Date.now();
    const analysis = await LessonContentService.prepareLessonContent(documentId, lessonNum);
    const processingTime = Date.now() - startTime;

    console.log(`✅ Lesson content prepared in ${processingTime}ms for ${documentId} - Lesson ${lessonNum}`);

    return NextResponse.json({
      success: true,
      analysis,
      cached: false,
      processingTimeMs: processingTime,
      message: 'Lesson content analysis complete'
    });

  } catch (error) {
    console.error('❌ Error preparing lesson content:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to prepare lesson content'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    if (isNaN(lessonNum)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Try to get cached analysis
    const cachedAnalysis = await LessonContentService.getCachedLessonAnalysis(documentId, lessonNum);
    
    if (cachedAnalysis) {
      return NextResponse.json({
        success: true,
        analysis: cachedAnalysis,
        cached: true
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Lesson content not prepared yet',
      message: 'Call POST /prepare to analyze lesson content'
    }, { status: 404 });

  } catch (error) {
    console.error('❌ Error getting lesson content:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lesson content'
    }, { status: 500 });
  }
}
