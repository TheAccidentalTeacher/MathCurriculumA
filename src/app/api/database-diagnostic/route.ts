import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database connection for curriculum data...');
    
    // Check documents table
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        title: true,
        grade_level: true,
        _count: {
          select: {
            units: true
          }
        }
      }
    });
    
    console.log('📊 Documents found:', documents);
    
    // Check units and lessons for each grade
    const gradeAnalysis: Record<string, any> = {};
    
    for (const grade of ['6', '7', '8']) {
      const gradeDocuments = await prisma.document.findMany({
        where: { grade_level: grade },
        include: {
          units: {
            include: {
              lessons: true
            }
          }
        }
      });
      
      let totalLessons = 0;
      let totalUnits = 0;
      
      gradeDocuments.forEach(doc => {
        totalUnits += doc.units.length;
        doc.units.forEach(unit => {
          totalLessons += unit.lessons.length;
        });
      });
      
      gradeAnalysis[grade] = {
        documents: gradeDocuments.length,
        units: totalUnits,
        lessons: totalLessons,
        sampleDocument: gradeDocuments[0]?.title || 'None',
        sampleUnit: gradeDocuments[0]?.units[0]?.title || 'None',
        sampleLesson: gradeDocuments[0]?.units[0]?.lessons[0]?.title || 'None'
      };
    }
    
    console.log('📈 Grade analysis:', gradeAnalysis);
    
    return NextResponse.json({
      success: true,
      totalDocuments: documents.length,
      documents: documents,
      gradeAnalysis: gradeAnalysis
    });
    
  } catch (error) {
    console.error('❌ Database diagnostic error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
