import { NextRequest, NextResponse } from 'next/server';
import { AITutorService, type AIModel, type LessonContext, type ChatMessage } from '@/lib/ai-tutor-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      character = 'somers', 
      lessonContext, 
      conversationHistory = [],
      model = 'gpt-4o' as AIModel
    } = body;

    if (!message) {
      return NextResponse.json({
        error: 'Message is required'
      }, { status: 400 });
    }

    if (!lessonContext) {
      return NextResponse.json({
        error: 'Lesson context is required'
      }, { status: 400 });
    }

    console.log(`🤖 AI Chat Request: ${character} helping with "${lessonContext.lessonTitle}"`);
    console.log(`📝 User message: ${message.substring(0, 100)}...`);
    console.log(`🧠 Using model: ${model}`);

    // Generate AI response
    const response = await AITutorService.generateResponse(
      message,
      character,
      lessonContext,
      conversationHistory,
      model
    );

    // Log response metrics
    console.log(`✅ Response generated:`);
    console.log(`   📊 Tokens: ${response.tokens.total}`);
    console.log(`   💰 Cost: $${response.cost.toFixed(6)}`);
    console.log(`   🎯 Confidence: ${response.confidence}%`);

    return NextResponse.json({
      success: true,
      response: {
        id: `ai-${Date.now()}`,
        type: 'assistant',
        content: response.content,
        character: response.character,
        model: response.model,
        timestamp: new Date().toISOString(),
        metadata: {
          reasoning: response.reasoning,
          followUpQuestions: response.followUpQuestions,
          relatedConcepts: response.relatedConcepts,
          confidence: response.confidence,
          tokens: response.tokens,
          cost: response.cost
        }
      }
    });

  } catch (error) {
    console.error('❌ AI Chat error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'AI service unavailable',
      message: error instanceof Error ? error.message : 'Unknown error',
      fallback: {
        id: `fallback-${Date.now()}`,
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting to my AI systems right now. Please try again in a moment, or check with your teacher for help with this lesson.',
        timestamp: new Date().toISOString()
      }
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const models = AITutorService.getAvailableModels();
    
    return NextResponse.json({
      message: 'AI Tutor Service - Phase 3',
      status: 'ready',
      version: '1.0.0',
      capabilities: {
        characters: ['somers', 'gimli'],
        models: Object.keys(models),
        features: [
          'Lesson-context aware responses',
          'Character personalities (Mr. Somers & Gimli)',
          'Mathematical reasoning and problem solving',
          'Step-by-step explanations',
          'Follow-up question generation',
          'Confidence scoring',
          'Cost tracking and optimization',
          'Tool integration support'
        ]
      },
      models: Object.entries(models).map(([key, config]) => ({
        id: key,
        name: config.name,
        description: config.description,
        maxTokens: config.maxTokens,
        costPer1k: {
          prompt: config.costPer1kPrompt,
          completion: config.costPer1kCompletion
        },
        features: {
          tools: config.supportsTools,
          reasoning: config.supportsReasoning
        },
        bestFor: config.bestFor
      })),
      endpoints: {
        'POST /api/ai/chat': 'Generate AI tutor response',
        'GET /api/ai/chat': 'Service info and available models',
        'POST /api/ai/test': 'Test AI connection and models'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Service information unavailable',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
