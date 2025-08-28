import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Raw database inspection endpoint
export async function GET() {
  try {
    const prisma = new PrismaClient();
    
    const inspection = {
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL on Railway',
      tables: {}
    };

    // Get table information
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    ` as any[];

    inspection.tables = {
      count: tables.length,
      list: tables.map((t: any) => t.table_name)
    };

    // Check documents table specifically
    const documentTableInfo = await prisma.$queryRaw`
      SELECT 
        column_name, 
        data_type, 
        is_nullable, 
        column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = 'documents'
      ORDER BY ordinal_position;
    ` as any[];

    const documentCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM documents;
    ` as any[];

    const sampleDocuments = await prisma.$queryRaw`
      SELECT 
        id, 
        filename, 
        title, 
        grade_level, 
        LENGTH(content) as content_length,
        created_at
      FROM documents 
      LIMIT 5;
    ` as any[];

    (inspection as any).documentsTable = {
      exists: documentTableInfo.length > 0,
      columns: documentTableInfo,
      rowCount: documentCount[0]?.count || 0,
      samples: sampleDocuments
    };

    await prisma.$disconnect();

    return NextResponse.json(inspection);

  } catch (error: any) {
    return NextResponse.json({
      error: 'Database inspection failed',
      message: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
}
