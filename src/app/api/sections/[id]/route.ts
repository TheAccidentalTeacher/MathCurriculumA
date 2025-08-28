import { NextRequest, NextResponse } from "next/server";
import { CurriculumService } from "@/lib/curriculum-service";

const curriculumService = new CurriculumService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In Prisma with PostgreSQL, IDs are strings (cuid), not numbers
    const section = await curriculumService.getSectionById(id);
    
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    
    return NextResponse.json(section);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
