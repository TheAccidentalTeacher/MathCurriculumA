import { NextRequest, NextResponse } from 'next/server';
import { CurriculumService } from '@/lib/curriculum-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const grade = searchParams.get('grade');

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const curriculumService = new CurriculumService();
    const filters: any = {};
    if (grade) {
      filters.grade = grade;
    }

    const results = await curriculumService.searchContent(query, filters);
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Global search error:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
