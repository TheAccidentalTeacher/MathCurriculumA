import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAIService, PacingGuideRequest } from '@/lib/enhanced-ai-service';

export async function POST(request: NextRequest) {
  console.group('🎯 [API] Pacing Guide Generation Request');
  
  try {
    const body: PacingGuideRequest = await request.json();
    console.log('📝 [API] Request body received:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    console.log('✅ [API] Validating required fields...');
    if (!body.gradeLevel || !body.timeframe || !body.studentPopulation) {
      console.error('❌ [API] Missing required fields');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: gradeLevel, timeframe, and studentPopulation are required' 
        },
        { status: 400 }
      );
    }

    // Validate grade level - support both single grades and combinations
    const validGrades = ['6', '7', '8', '9'];
    let gradesToValidate: string[] = [];
    
    console.log('🔍 [API] Validating grade combination...');
    
    if (body.gradeCombination?.selectedGrades && (body.gradeCombination.selectedGrades.length || 0) > 0) {
      // Advanced mode: validate each selected grade
      console.log('📚 [API] Advanced mode - Multi-grade combination detected:', body.gradeCombination.selectedGrades);
      gradesToValidate = body.gradeCombination.selectedGrades;
    } else if (body.gradeLevel) {
      // Simple mode: validate single grade or parse combination
      console.log('📖 [API] Simple mode - Grade level:', body.gradeLevel);
      if (body.gradeLevel.includes('+')) {
        // Handle legacy "6+7" format
        console.log('🔗 [API] Legacy combination format detected');
        gradesToValidate = body.gradeLevel.split('+').map(g => g.trim());
      } else {
        console.log('📝 [API] Single grade detected');
        gradesToValidate = [body.gradeLevel];
      }
    }
    
    console.log('✅ [API] Final grades to validate:', gradesToValidate);
    
    // Validate all grades in the combination
    const invalidGrades = gradesToValidate.filter(grade => !validGrades.includes(grade));
    console.log('🔍 [API] Invalid grades found:', invalidGrades);
    
    if (invalidGrades.length > 0) {
      console.error('❌ [API] Grade validation failed');
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid grade level(s): ${invalidGrades.join(', ')}. Must be 6, 7, 8, or 9` 
        },
        { status: 400 }
      );
    }
    
    if (gradesToValidate.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid grade levels specified. Must select at least one grade (6, 7, 8, or 9)' 
        },
        { status: 400 }
      );
    }

    // Validate timeframe
    const validTimeframes = ['quarter', 'semester', 'trimester', 'year'];
    const isValidTimeframe = validTimeframes.some(tf => 
      body.timeframe.toLowerCase().includes(tf)
    ) || /\d+\s*week/i.test(body.timeframe);
    
    if (!isValidTimeframe) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid timeframe. Must be quarter, semester, trimester, year, or specify number of weeks' 
        },
        { status: 400 }
      );
    }

    // Validate schedule constraints if provided
    if (body.scheduleConstraints) {
      const { daysPerWeek, minutesPerClass } = body.scheduleConstraints;
      
      if (daysPerWeek && (daysPerWeek < 1 || daysPerWeek > 7)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Days per week must be between 1 and 7' 
          },
          { status: 400 }
        );
      }
      
      if (minutesPerClass && minutesPerClass < 10) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Class time must be at least 10 minutes' 
          },
          { status: 400 }
        );
      }
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OpenAI API key is not configured' 
        },
        { status: 500 }
      );
    }

    // Generate pacing guide
    console.log('🤖 [API] Initializing AI service...');
    const aiService = new EnhancedAIService();
    
    try {
      console.log('🚀 [API] Calling AI service with request:', JSON.stringify(body, null, 2));
      const result = await aiService.generatePacingGuide(body);
      
      console.log('📊 [API] AI service response received:');
      console.log('  Success:', result.success);
      console.log('  Has pacing guide:', !!result.pacingGuide);
      
      if (result.pacingGuide) {
        console.log('  Pacing guide structure:');
        console.log('    Overview:', result.pacingGuide.overview);
        console.log('    Weekly schedule count:', result.pacingGuide.weeklySchedule?.length || 0);
        console.log('    Assessment plan:', !!result.pacingGuide.assessmentPlan);
        console.log('    Differentiation strategies count:', result.pacingGuide.differentiationStrategies?.length || 0);
        console.log('    Standards alignment count:', result.pacingGuide.standardsAlignment?.length || 0);
        
        if (result.pacingGuide.weeklySchedule?.length > 0) {
          console.log('    First week:', result.pacingGuide.weeklySchedule[0].unit);
          console.log('    First week lessons count:', result.pacingGuide.weeklySchedule[0].lessons?.length || 0);
        }
      }
      
      if (!result.success) {
        console.error('❌ [API] AI service returned failure:', result.error);
        return NextResponse.json(
          { 
            success: false, 
            error: result.error || 'Failed to generate pacing guide' 
          },
          { status: 500 }
        );
      }

      console.log('✅ [API] Returning successful response');
      return NextResponse.json(result);
      
    } finally {
      console.log('🧹 [API] Cleaning up AI service...');
      // Clean up AI service
      await aiService.disconnect();
      console.groupEnd();
    }

  } catch (error) {
    console.error('💥 [API] Error in pacing guide generation:', error);
    console.groupEnd();
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      console.error('❌ [API] JSON syntax error');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      // Don't expose internal error details to client
      const isDevelopment = process.env.NODE_ENV === 'development';
      console.error('❌ [API] Error details:', {
        message: error.message,
        stack: isDevelopment ? error.stack : 'Hidden in production'
      });
      
      return NextResponse.json(
        { 
          success: false, 
          error: isDevelopment ? error.message : 'Internal server error' 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Pacing Guide Generator API',
      endpoints: {
        'POST /api/pacing/generate': 'Generate a new pacing guide',
      },
      version: '1.0.0'
    }
  );
}
