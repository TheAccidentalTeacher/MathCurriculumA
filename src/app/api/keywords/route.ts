import { NextRequest, NextResponse } from "next/server";
import { CurriculumService } from "@/lib/curriculum-service";

const curriculumService = new CurriculumService();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");
    
    if (keyword) {
      const topics = await curriculumService.getTopicsByKeyword(keyword);
      return NextResponse.json({ keyword, topics });
    }
    
    const keywords = await curriculumService.getKeywords();
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
