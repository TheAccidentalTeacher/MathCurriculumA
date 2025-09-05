import { NextRequest, NextResponse } from 'next/server';
import { EnhancedAIService, PacingGuideRequest } from '@/lib/enhanced-ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: PacingGuideRequest = await request.json();
    
    // Validate required fields
    if (!body.gradeLevel || !body.timeframe || !body.studentPopulation) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: gradeLevel, timeframe, and studentPopulation are required' 
        },
        { status: 400 }
      );
    }

    // Validate grade level - support both single grades and combinations
    const validGrades = ['6', '7', '8'];
    let gradesToValidate: string[] = [];
    
    if (body.gradeCombination?.selectedGrades?.length > 0) {
      // Advanced mode: validate each selected grade
      gradesToValidate = body.gradeCombination.selectedGrades;
    } else if (body.gradeLevel) {
      // Simple mode: validate single grade or parse combination
      if (body.gradeLevel.includes('+')) {
        // Handle legacy "6+7" format
        gradesToValidate = body.gradeLevel.split('+').map(g => g.trim());
      } else {
        gradesToValidate = [body.gradeLevel];
      }
    }
    
    // Validate all grades in the combination
    const invalidGrades = gradesToValidate.filter(grade => !validGrades.includes(grade));
    if (invalidGrades.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Invalid grade level(s): ${invalidGrades.join(', ')}. Must be 6, 7, or 8` 
        },
        { status: 400 }
      );
    }
    
    if (gradesToValidate.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No valid grade levels specified. Must select at least one grade (6, 7, or 8)' 
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
    const aiService = new EnhancedAIService();
    
    try {
      const result = await aiService.generatePacingGuide(body);
      
      if (!result.success) {
        return NextResponse.json(
          { 
            success: false, 
            error: result.error || 'Failed to generate pacing guide' 
          },
          { status: 500 }
        );
      }

      return NextResponse.json(result);
      
    } finally {
      // Clean up AI service
      await aiService.disconnect();
    }

  } catch (error) {
    console.error('Error in pacing guide API:', error);
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
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
