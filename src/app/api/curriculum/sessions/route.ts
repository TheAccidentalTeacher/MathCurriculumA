import { NextResponse } from 'next/server';
import { EnhancedCurriculumService } from '@/lib/enhanced-curriculum-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const grade = searchParams.get('grade');
    const sessionType = searchParams.get('sessionType');

    const sessions = await EnhancedCurriculumService.searchSessions(
      query,
      grade ? parseInt(grade) : undefined,
      sessionType || undefined
    );

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    
    // Return sample data if enhanced curriculum files are not available
    return NextResponse.json([
      {
        grade: 8,
        volume: "Volume 1",
        unit: "Geometric Figures: Rigid Transformations and Congruence",
        lesson: "Understand Rigid Transformations and Their Properties",
        lesson_number: 1,
        session: {
          session_number: 1,
          session_type: "Explore",
          title: "Rigid Transformations",
          start_page: 17,
          end_page: 23,
          page_span: 7,
          content_focus: "Prior knowledge activation, concept introduction",
          activities: ["Instructional Activity"],
          inferred_type: false,
          estimated_duration: "50 minutes"
        },
        context: {
          unit_number: 1,
          standards_focus: ["8.G.1"],
          key_concepts: ["Rigid transformations", "Properties of transformations", "Coordinate plane"]
        }
      },
      {
        grade: 8,
        volume: "Volume 1", 
        unit: "Geometric Figures: Rigid Transformations and Congruence",
        lesson: "Understand Rigid Transformations and Their Properties",
        lesson_number: 1,
        session: {
          session_number: 2,
          session_type: "Develop",
          title: "Figure WXUY is a transformation of figure STUV",
          start_page: 24,
          end_page: 25,
          page_span: 2,
          content_focus: "Skill building and practice",
          activities: ["Instructional Activity"],
          inferred_type: true,
          estimated_duration: "50 minutes"
        },
        context: {
          unit_number: 1,
          standards_focus: ["8.G.1"],
          key_concepts: ["Rigid transformations", "Properties of transformations", "Coordinate plane"]
        }
      }
    ]);
  }
}
