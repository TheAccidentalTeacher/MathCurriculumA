// src/app/api/lessons/[documentId]/[lessonNumber]/generate-questions/route.ts
// API endpoint for generating student practice questions based on lesson analysis

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { LessonContentService } from '@/lib/lesson-content-service';

interface RouteParams {
  params: Promise<{
    documentId: string;
    lessonNumber: string;
  }>;
}

/**
 * GET: Retrieve cached student questions if available
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`📖 [API] Getting student questions for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Check for cached questions
    const cacheStatus = LessonContentService.getCacheStatus();
    const questionsCacheKey = `lesson_questions_${documentId}_${lessonNum}`;
    
    const hasQuestions = cacheStatus.keys.includes(questionsCacheKey);
    
    console.log(`📊 [API] Questions cache status for ${documentId}-${lessonNum}:`, {
      questionsAvailable: hasQuestions,
      totalCached: cacheStatus.size
    });
    
    if (hasQuestions) {
      // Retrieve questions from cache
      const cachedQuestions = LessonContentService.getCachedQuestions(documentId, lessonNum);
      
      if (cachedQuestions) {
        console.log(`🎯 [API] Retrieved ${cachedQuestions.questions.length} cached questions`);
        
        return NextResponse.json({
          success: true,
          questions: cachedQuestions.questions,
          metadata: cachedQuestions.metadata,
          cached: true,
          message: 'Student questions ready',
          cacheInfo: {
            totalCached: cacheStatus.size,
            cacheKey: questionsCacheKey
          }
        });
      }
    }

    // No cached questions available
    return NextResponse.json({
      success: false,
      error: 'No cached questions available',
      message: 'Call POST to generate new practice questions'
    }, { status: 404 });

  } catch (error) {
    console.error('❌ [API] Error getting questions:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get questions'
    }, { status: 500 });
  }
}

/**
 * POST: Generate student practice questions based on lesson summary
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);
    const body = await request.json();

    console.log(`🎯 [API] Generating student questions for ${documentId} - Lesson ${lessonNum}`);

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
        error: 'OpenAI API key not configured'
      }, { status: 500 });
    }

    const { lessonSummary, lessonTitle, documentId: docId } = body;

    if (!lessonSummary) {
      return NextResponse.json({
        success: false,
        error: 'Lesson summary is required'
      }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create a comprehensive prompt for generating student questions
    const questionsPrompt = `
Based on the following comprehensive lesson analysis, generate 10 diverse practice questions for students.

LESSON CONTEXT:
- Title: ${lessonTitle}
- Document: ${docId}
- Lesson Number: ${lessonNum}

LESSON ANALYSIS:
${JSON.stringify(lessonSummary, null, 2)}

Generate exactly 10 student practice questions with the following structure for each:

{
  "questions": [
    {
      "questionNumber": 1,
      "difficulty": "beginner" | "intermediate" | "advanced",
      "type": "word problem" | "computational" | "visual/diagram" | "conceptual" | "real-world application",
      "question": "Clear, engaging question text that students can understand",
      "conceptsFocused": ["specific mathematical concepts this question practices"],
      "estimatedTimeMinutes": 3-8,
      "vocabularyReinforced": ["mathematical vocabulary terms used in this question"],
      "learningObjective": "What specific skill or understanding this question develops",
      "hint": "Optional helpful hint for struggling students",
      "extension": "Optional challenge or extension for advanced students"
    }
  ]
}

REQUIREMENTS:
1. Create questions at different difficulty levels (3-4 beginner, 3-4 intermediate, 2-3 advanced)
2. Include diverse question types (word problems, computational, visual, conceptual, real-world)
3. Questions should directly relate to the lesson content and mathematical concepts identified
4. Use vocabulary and terminology from the lesson analysis
5. Make questions age-appropriate and engaging
6. Include practical time estimates (3-8 minutes per question)
7. Focus on the core learning objectives and key insights from the analysis

Return ONLY the JSON object with the questions array. Do not include any additional text or explanations.`;

    console.log(`🤖 [API] Sending question generation request to OpenAI...`);
    
    const startTime = Date.now();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert mathematics educator who creates engaging, standards-aligned practice questions for students. You understand different learning levels and create questions that reinforce key concepts while building mathematical thinking skills."
        },
        {
          role: "user",
          content: questionsPrompt
        }
      ],
      max_tokens: 4000,
      temperature: 0.3
    });

    const processingTime = Date.now() - startTime;
    const responseText = response.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('📝 [API] Raw OpenAI questions response (first 200 chars):', responseText.substring(0, 200));

    // Parse the JSON response
    let questionsData;
    try {
      // Remove any potential markdown formatting
      const cleanedResponse = responseText.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
      questionsData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ [API] Failed to parse questions JSON:', parseError);
      console.error('❌ [API] Raw response:', responseText);
      throw new Error('Failed to parse questions response from OpenAI');
    }

    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Invalid questions format from OpenAI');
    }

    console.log(`✅ [API] Successfully generated ${questionsData.questions.length} questions in ${processingTime}ms`);
    console.log(`📊 [API] Question breakdown:`, {
      total: questionsData.questions.length,
      beginner: questionsData.questions.filter((q: any) => q.difficulty === 'beginner').length,
      intermediate: questionsData.questions.filter((q: any) => q.difficulty === 'intermediate').length,
      advanced: questionsData.questions.filter((q: any) => q.difficulty === 'advanced').length
    });

    // Create metadata for caching
    const metadata = {
      lessonId: `${docId}-lesson-${lessonNum}`,
      generatedAt: new Date().toISOString(),
      processingTimeMs: processingTime,
      questionCount: questionsData.questions.length,
      model: "gpt-4o"
    };

    // Cache the questions for persistent storage
    const questionsWithMetadata = {
      questions: questionsData.questions,
      metadata: metadata
    };
    
    LessonContentService.cacheQuestions(docId, lessonNum, questionsWithMetadata);
    console.log(`💾 [API] Student questions cached for ${docId} - Lesson ${lessonNum}`);

    return NextResponse.json({
      success: true,
      questions: questionsData.questions,
      metadata: metadata,
      cached: true,
      message: `Generated ${questionsData.questions.length} practice questions successfully`
    });

  } catch (error) {
    console.error('❌ [API] Error generating questions:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate questions',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * DELETE: Clear cached student questions for this lesson
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, lessonNumber } = await params;
    const lessonNum = parseInt(lessonNumber);

    console.log(`🗑️ [API] Clearing student questions cache for ${documentId} - Lesson ${lessonNum}`);

    if (isNaN(lessonNum)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid lesson number'
      }, { status: 400 });
    }

    // Clear questions cache for this lesson
    LessonContentService.clearCachedQuestions(documentId, lessonNum);
    
    console.log(`✅ [API] Questions cache cleared for ${documentId} - Lesson ${lessonNum}`);

    return NextResponse.json({
      success: true,
      message: 'Student questions cache cleared',
      cacheStatus: LessonContentService.getCacheStatus()
    });

  } catch (error) {
    console.error('❌ [API] Error clearing questions cache:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear questions cache'
    }, { status: 500 });
  }
}
