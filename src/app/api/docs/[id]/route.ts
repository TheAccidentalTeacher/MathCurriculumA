import { NextRequest, NextResponse } from "next/server";
import { CurriculumService } from "@/lib/curriculum-service";

const curriculumService = new CurriculumService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docId = parseInt(id);
    
    if (isNaN(docId)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }
    
    const document = await curriculumService.getDocumentById(docId);
    
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    
    return NextResponse.json(document);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
