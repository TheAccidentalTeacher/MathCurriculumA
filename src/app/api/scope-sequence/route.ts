import { NextRequest, NextResponse } from 'next/server';
import { dynamicScopeSequenceService } from '@/lib/dynamic-scope-sequence';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    
    if (grade) {
      // Get scope and sequence data for a specific grade
      const scopeData = await dynamicScopeSequenceService.getScopeSequenceForGrade(grade);
      const pacingConfig = await dynamicScopeSequenceService.getDynamicPacingConfig(grade);
      
      return NextResponse.json({
        success: true,
        data: {
          scopeSequence: scopeData,
          pacingConfig: pacingConfig
        }
      });
    } else {
      // Get scope and sequence data for all grades
      const allScopeData = await dynamicScopeSequenceService.getAllScopeSequenceData();
      const acceleratedPathways = await dynamicScopeSequenceService.getAcceleratedPathwayConfigs();
      
      return NextResponse.json({
        success: true,
        data: {
          allGrades: allScopeData,
          acceleratedPathways: acceleratedPathways
        }
      });
    }
  } catch (error) {
    console.error('Error fetching scope and sequence data:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch scope and sequence data'
      },
      { status: 500 }
    );
  }
}
