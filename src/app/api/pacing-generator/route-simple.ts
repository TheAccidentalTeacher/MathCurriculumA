import { NextRequest, NextResponse } from 'next/server';

// Import the real curriculum service (we'll need to create this import properly)
const { RealCurriculumService } = require('@/lib/real-curriculum-service.js');

interface PacingRequest {
  gradeRange: number[];
  targetPopulation: string;
  totalDays: number;
  majorWorkFocus: number;
  includePrerequisites: boolean;
}

export async function POST(request: NextRequest) {
  let curriculumService: any = null;
  
  try {
    const body: PacingRequest = await request.json();
    console.log('Pacing generator request:', body);

    // Initialize the real curriculum service
    curriculumService = new RealCurriculumService();

    // Generate custom pathway using real curriculum data
    const lessons = curriculumService.generateCustomPathway({
      gradeRange: body.gradeRange,
      targetPopulation: body.targetPopulation,
      totalDays: body.totalDays,
      majorWorkFocus: body.majorWorkFocus,
      includePrerequisites: body.includePrerequisites
    });

    // Calculate summary statistics
    const totalDays = lessons.reduce((sum: number, lesson: any) => sum + lesson.estimatedDays, 0);
    const majorWorkLessons = lessons.filter((lesson: any) => lesson.majorWork);
    const majorWorkDays = majorWorkLessons.reduce((sum: number, lesson: any) => sum + lesson.estimatedDays, 0);
    const majorWorkPercentage = totalDays > 0 ? Math.round((majorWorkDays / totalDays) * 100) : 0;

    // Group lessons by grade for better organization
    const lessonsByGrade = lessons.reduce((acc: any, lesson: any) => {
      if (!acc[lesson.grade]) acc[lesson.grade] = [];
      acc[lesson.grade].push(lesson);
      return acc;
    }, {} as Record<number, any[]>);

    const response = {
      lessons: lessons.map((lesson: any) => ({
        id: lesson.id,
        title: lesson.title,
        grade: lesson.grade,
        lessonNumber: lesson.lessonNumber,
        estimatedDays: lesson.estimatedDays,
        majorWork: lesson.majorWork,
        isAdvanced: lesson.isAdvanced,
        sequenceNumber: lesson.sequenceNumber,
        tags: lesson.tags,
        totalDaysAtThisPoint: lesson.totalDaysAtThisPoint
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
          days: lessonsByGrade[parseInt(grade)].reduce((sum: number, l: any) => sum + l.estimatedDays, 0)
        }))
      },
      metadata: {
        targetPopulation: body.targetPopulation,
        requestedDays: body.totalDays,
        requestedMajorWorkFocus: body.majorWorkFocus,
        gradeRange: body.gradeRange,
        generatedAt: new Date().toISOString()
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
    message: 'Real Curriculum Pacing Guide Generator API',
    version: '2.0.0',
    status: 'Using actual curriculum database',
    endpoints: {
      POST: 'Generate custom pacing guide with real lesson data'
    }
  });
}
