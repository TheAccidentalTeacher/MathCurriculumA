import { NextRequest, NextResponse } from 'next/server';
import { AITutorService, type AIModel } from '@/lib/ai-tutor-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model = 'gpt-5' } = body;

    console.log(`🧪 Testing AI connection with model: ${model}`);
    
    const testResult = await AITutorService.testConnection(model as AIModel);
    
    if (testResult.success) {
      console.log(`✅ AI test successful with ${testResult.model}`);
      console.log(`   📝 Response: ${testResult.response}`);
      console.log(`   📊 Tokens: ${testResult.tokens}`);
      console.log(`   💰 Cost: $${testResult.cost?.toFixed(6)}`);
    } else {
      console.log(`❌ AI test failed: ${testResult.error}`);
    }

    return NextResponse.json({
      success: testResult.success,
      model: testResult.model,
      response: testResult.response,
      metrics: testResult.success ? {
        tokens: testResult.tokens,
        cost: testResult.cost,
        costFormatted: `$${testResult.cost?.toFixed(6)}`
      } : undefined,
      error: testResult.error,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI test request failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Test request failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const model = searchParams.get('model') || 'gpt-5';

  try {
    console.log(`🧪 Quick AI test with model: ${model}`);
    
    const testResult = await AITutorService.testConnection(model as AIModel);
    
    return NextResponse.json({
      success: testResult.success,
      model: testResult.model,
      response: testResult.response,
      error: testResult.error,
      quickTest: true,
      availableModels: Object.keys(AITutorService.getAvailableModels()),
      recommendedModels: {
        costEffective: 'gpt-4o-mini',
        balanced: 'gpt-4o',
        advanced: 'gpt-5',
        reasoning: 'o1-preview'
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Quick test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
