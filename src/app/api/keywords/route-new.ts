import { NextRequest, NextResponse } from "next/server";
import { CurriculumService } from "@/lib/curriculum-service";

const curriculumService = new CurriculumService();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q");
    
    if (keyword) {
      // Search for documents containing the keyword
      const results = await curriculumService.searchContent(keyword);
      return NextResponse.json({ 
        keyword, 
        count: results.length,
        documents: results 
      });
    }
    
    // If no keyword provided, return basic stats
    const stats = await curriculumService.getStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Keywords API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
