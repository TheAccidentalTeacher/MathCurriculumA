// src/app/api/lessons/[documentId]/[lessonNumber]/vision-analysis/route.ts
// API endpoint for comprehensive OpenAI Vision-based lesson analysis

import { NextRequest, NextResponse } from 'next/server';
import { LessonContentService } from '@/lib/lesson-content-service';

interface RouteParams {
  params: Promise<{
    documentId: string;
    lessonNumber: string;
  }>;
}

/**
 * POST: Perform comprehensive OpenAI Vision analysis of entire lesson
 * This endpoint analyzes ALL pages of the lesson using OpenAI Vision API
 * Works for lessons of any page count (22 pages, 40 pages, etc.)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`🔍 [API] Starting COMPREHENSIVE VISION ANALYSIS for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      console.error(`❌ [API] Invalid lesson number: ${lessonNumber}`);
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error(`❌ [API] OpenAI API key not configured`);
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured',
        fallback: 'Use standard OCR analysis instead'
      }, { status: 500 });
    }

    // Start comprehensive vision analysis
    const startTime = Date.now();
    console.log(`⏱️ [API] Starting vision analysis at ${new Date().toISOString()}`);
    
    const analysis = await LessonContentService.analyzeCompleteVisualLesson(documentId, lessonNum);
    const processingTime = Date.now() - startTime;

    console.log(`✅ [API] VISION ANALYSIS COMPLETE in ${processingTime}ms for ${documentId} - Lesson ${lessonNum}`);
    console.log(`📊 [API] Analysis Results:`, {
      lessonId: analysis.lessonId,
      title: analysis.title,
      pageCount: analysis.pageRange.end - analysis.pageRange.start + 1,
      conceptsFound: analysis.analysis.concepts.length,
      confidence: analysis.extractedContent.confidence
    });

    return NextResponse.json({
      success: true,
      type: 'vision-analysis',
      analysis,
      processingTimeMs: processingTime,
      pageCount: analysis.pageRange.end - analysis.pageRange.start + 1,
      features: {
        visionAnalysis: true,
        comprehensivePageAnalysis: !!analysis.extractedContent.comprehensiveAnalysis,
        enhancedTutorPrompt: analysis.tutorPrompt.length > 1000,
        advancedStrategies: analysis.teachingStrategies.length
      },
      message: `Complete visual analysis of ${analysis.pageRange.end - analysis.pageRange.start + 1} pages completed successfully`
    });

  } catch (error) {
    console.error('❌ [API] Error in vision analysis:', error);
    
    return NextResponse.json({
      success: false,
      type: 'vision-analysis',
      error: error instanceof Error ? error.message : 'Failed to perform vision analysis',
      fallback: 'Standard OCR analysis is available via /prepare endpoint'
    }, { status: 500 });
  }
}

/**
 * GET: Check vision analysis status and retrieve cached results
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`📖 [API] Getting vision analysis status for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      console.error(`❌ [API] Invalid lesson number: ${lessonNumber}`);
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Check for vision analysis cache (different cache key than standard analysis)
    const cacheStatus = LessonContentService.getCacheStatus();
    const visionCacheKey = `lesson_vision_analysis_${documentId}_${lessonNum}`;
    const standardCacheKey = `lesson_analysis_${documentId}_${lessonNum}`;
    
    const hasVisionAnalysis = cacheStatus.keys.includes(visionCacheKey);
    const hasStandardAnalysis = cacheStatus.keys.includes(standardCacheKey);
    
    console.log(`📊 [API] Cache status for ${documentId}-${lessonNum}:`, {
      visionAnalysis: hasVisionAnalysis,
      standardAnalysis: hasStandardAnalysis,
      totalCached: cacheStatus.size
    });
    
    if (hasVisionAnalysis) {
      // Retrieve vision analysis from cache
      const cachedAnalysis = LessonContentService.getCachedAnalysis(documentId, lessonNum);
      
      if (cachedAnalysis && cachedAnalysis.extractedContent.comprehensiveAnalysis) {
        console.log(`🎯 [API] Retrieved cached VISION analysis`);
        
        return NextResponse.json({
          success: true,
          type: 'vision-analysis',
          analysis: cachedAnalysis,
          cached: true,
          features: {
            visionAnalysis: true,
            comprehensivePageAnalysis: !!cachedAnalysis.extractedContent.comprehensiveAnalysis,
            enhancedTutorPrompt: cachedAnalysis.tutorPrompt.length > 1000,
            advancedStrategies: cachedAnalysis.teachingStrategies.length
          },
          message: 'Vision analysis ready',
          cacheInfo: {
            totalCached: cacheStatus.size,
            cacheKey: visionCacheKey
          }
        });
      }
    }

    // Check if standard analysis is available as fallback
    if (hasStandardAnalysis) {
      return NextResponse.json({
        success: false,
        type: 'vision-analysis',
        cached: false,
        fallbackAvailable: true,
        error: 'Vision analysis not available, but standard analysis exists',
        message: 'Call POST /vision-analysis to perform comprehensive vision analysis'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: false,
      type: 'vision-analysis',
      cached: false,
      fallbackAvailable: false,
      error: 'No analysis available',
      message: 'Call POST /vision-analysis to perform comprehensive vision analysis'
    }, { status: 404 });

  } catch (error) {
    console.error('❌ [API] Error getting vision analysis:', error);
    
    return NextResponse.json({
      success: false,
      type: 'vision-analysis',
      error: error instanceof Error ? error.message : 'Failed to get vision analysis'
    }, { status: 500 });
  }
}

/**
 * DELETE: Clear vision analysis cache for this lesson
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`🗑️ [API] Clearing vision analysis cache for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Clear all cache for this lesson (both vision and standard)
    LessonContentService.clearCache();
    
    console.log(`✅ [API] Cache cleared for ${documentId} - Lesson ${lessonNum}`);

    return NextResponse.json({
      success: true,
      message: 'Vision analysis cache cleared',
      cacheStatus: LessonContentService.getCacheStatus()
    });

  } catch (error) {
    console.error('❌ [API] Error clearing cache:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cache'
    }, { status: 500 });
  }
}
