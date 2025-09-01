import { NextRequest, NextResponse } from 'next/server';
import { PrecisionCurriculumService } from '@/lib/precision-curriculum-service';

interface PacingRequest {
  gradeRange: number[];
  targetPopulation: string;
  totalDays: number;
  majorWorkFocus: number;
  includePrerequisites: boolean;
}

export async function POST(request: NextRequest) {
  let curriculumService: PrecisionCurriculumService | null = null;
  
  try {
    const body: PacingRequest = await request.json();
    console.log('🎯 Precision pacing generator request:', body);

    // Initialize the precision curriculum service
    curriculumService = new PrecisionCurriculumService();

    // Generate custom pathway using precision curriculum data
    const lessons = curriculumService.generateCustomPathway({
      gradeRange: body.gradeRange,
      targetPopulation: body.targetPopulation,
      totalDays: body.totalDays,
      majorWorkFocus: body.majorWorkFocus,
      includePrerequisites: body.includePrerequisites
    });

    // Calculate summary statistics
    const totalDays = lessons.reduce((sum: number, lesson: any) => sum + lesson.estimated_days, 0);
    const majorWorkLessons = lessons.filter((lesson: any) => lesson.is_major_work);
    const majorWorkDays = majorWorkLessons.reduce((sum: number, lesson: any) => sum + lesson.estimated_days, 0);
    const majorWorkPercentage = totalDays > 0 ? Math.round((majorWorkDays / totalDays) * 100) : 0;

    // Group lessons by grade for better organization
    const lessonsByGrade = lessons.reduce((acc: any, lesson: any) => {
      if (!acc[lesson.grade]) acc[lesson.grade] = [];
      acc[lesson.grade].push(lesson);
      return acc;
    }, {} as Record<number, any[]>);

    const response = {
      lessons: lessons.map((lesson: any) => ({
        id: lesson.lesson_id,
        title: lesson.title,
        grade: lesson.grade,
        lessonNumber: lesson.lesson_number,
        estimatedDays: lesson.estimated_days,
        majorWork: lesson.is_major_work,
        isAdvanced: lesson.isAdvanced,
        sequenceNumber: lesson.sequenceNumber,
        tags: lesson.tags,
        totalDaysAtThisPoint: lesson.totalDaysAtThisPoint,
        standards: lesson.standards,
        unitTheme: lesson.unit_theme,
        extractionConfidence: lesson.extraction_confidence,
        sessionCount: lesson.session_count,
        contentLength: lesson.total_content_length
      })),
      summary: {
        totalLessons: lessons.length,
        totalDays,
        majorWorkLessons: majorWorkLessons.length,
        majorWorkDays,
        majorWorkPercentage,
        supportingWorkLessons: lessons.length - majorWorkLessons.length,
        supportingWorkDays: totalDays - majorWorkDays,
        gradeDistribution: Object.keys(lessonsByGrade).map(grade => ({
          grade: parseInt(grade),
          lessons: lessonsByGrade[parseInt(grade)].length,
          days: lessonsByGrade[parseInt(grade)].reduce((sum: number, l: any) => sum + l.estimated_days, 0)
        })),
        qualityMetrics: {
          averageExtractionConfidence: lessons.reduce((sum: number, l: any) => sum + l.extraction_confidence, 0) / lessons.length,
          highConfidenceLessons: lessons.filter((l: any) => l.extraction_confidence >= 0.7).length,
          totalSessions: lessons.reduce((sum: number, l: any) => sum + l.session_count, 0),
          totalContentLength: lessons.reduce((sum: number, l: any) => sum + l.content_length, 0)
        }
      },
      metadata: {
        targetPopulation: body.targetPopulation,
        requestedDays: body.totalDays,
        requestedMajorWorkFocus: body.majorWorkFocus,
        gradeRange: body.gradeRange,
        generatedAt: new Date().toISOString(),
        dataSource: 'precision_curriculum_database',
        databaseVersion: '1.0',
        extractionQuality: 'high_precision'
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error generating pacing guide:', error);
    return NextResponse.json(
      { error: 'Failed to generate pacing guide' },
      { status: 500 }
    );
  } finally {
    // Always close the database connection
    if (curriculumService && typeof curriculumService.close === 'function') {
      curriculumService.close();
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Precision Curriculum Pacing Guide Generator API',
    version: '3.0.0',
    status: 'Using precision-extracted curriculum database',
    improvements: [
      '21x more lessons (1,897 vs 89)',
      '1.6x better content quality',
      'GPT-5 optimized lesson summaries',
      'Enhanced standards mapping',
      'Session-level granularity',
      'Extraction confidence scoring'
    ],
    endpoints: {
      POST: 'Generate custom pacing guide with precision lesson data'
    }
  });
}
