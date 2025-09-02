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

    console.log(`📚 [API] Starting lesson content preparation for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      console.error(`❌ [API] Invalid lesson number: ${lessonNumber}`);
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Prepare lesson content (caching is handled internally)
    const startTime = Date.now();
    console.log(`⏱️ [API] Starting content preparation at ${new Date().toISOString()}`);
    
    const analysis = await LessonContentService.prepareLessonContent(documentId, lessonNum);
    const processingTime = Date.now() - startTime;

    console.log(`✅ [API] Lesson content prepared in ${processingTime}ms for ${documentId} - Lesson ${lessonNum}`);

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

    console.log(`📖 [API] Getting lesson content status for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      console.error(`❌ [API] Invalid lesson number: ${lessonNumber}`);
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Get cache status
    const cacheStatus = LessonContentService.getCacheStatus();
    const cacheKey = `lesson_analysis_${documentId}_${lessonNum}`;
    const isCached = cacheStatus.keys.includes(cacheKey);
    
    console.log(`📊 [API] Cache status for ${cacheKey}: ${isCached ? 'found' : 'not found'}`);
    
    if (isCached) {
      return NextResponse.json({
        success: true,
        cached: true,
        message: 'Lesson content is ready',
        cacheInfo: {
          totalCached: cacheStatus.size,
          cacheKey
        }
      });
    }

    return NextResponse.json({
      success: false,
      cached: false,
      error: 'Lesson content not prepared yet',
      message: 'Call POST /prepare to analyze lesson content'
    }, { status: 404 });

  } catch (error) {
    console.error('❌ [API] Error getting lesson content:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lesson content'
    }, { status: 500 });
  }
}
