import { NextRequest, NextResponse } from "next/server";
import { CurriculumService } from "@/lib/curriculum-service";

const curriculumService = new CurriculumService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sectionId = parseInt(id);
    
    if (isNaN(sectionId)) {
      return NextResponse.json({ error: "Invalid section ID" }, { status: 400 });
    }
    
    const section = await curriculumService.getSectionById(sectionId);
    
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    
    return NextResponse.json(section);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
