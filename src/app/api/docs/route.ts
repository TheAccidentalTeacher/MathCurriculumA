import { NextRequest, NextResponse } from "next/server";
import { CurriculumService } from "@/lib/curriculum-service";

const curriculumService = new CurriculumService();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const grade = searchParams.get("grade");
    const difficulty = searchParams.get("difficulty");
    const topicType = searchParams.get("topicType");
    const sectionType = searchParams.get("sectionType");

    if (query) {
      const filters = {
        ...(grade && { grade: parseInt(grade) }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(topicType && { topicType: topicType as any }),
        ...(sectionType && { sectionType: sectionType as any }),
      };
      
      const results = await curriculumService.searchContent(query, filters);
      return NextResponse.json({ 
        query,
        filters,
        count: results.length, 
        results 
      });
    }

    const documents = await curriculumService.getAllDocuments();
    const stats = await curriculumService.getStats();
    
    return NextResponse.json({ 
      documents, 
      stats
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
