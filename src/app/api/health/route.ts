import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Comprehensive database health check endpoint
export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  try {
    // 1. Environment Variables Check
    diagnostics.checks.environment = {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_preview: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.substring(0, 20) + '...[REDACTED]...' + process.env.DATABASE_URL.slice(-20) : 
        'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL || 'false',
      RAILWAY: process.env.RAILWAY_ENVIRONMENT || 'not railway'
    };

    // 2. Prisma Client Connection Test
    const prisma = new PrismaClient();
    const startTime = Date.now();
    
    try {
      // Test basic connection
      await prisma.$connect();
      const connectionTime = Date.now() - startTime;
      
      diagnostics.checks.connection = {
        status: 'SUCCESS',
        connectionTime: `${connectionTime}ms`,
        message: 'Prisma client connected successfully'
      };

      // 3. Database Query Tests
      try {
        // Test document count
        const documentCount = await prisma.document.count();
        diagnostics.checks.documents = {
          status: 'SUCCESS',
          count: documentCount,
          message: `Found ${documentCount} documents`
        };

        // Test sample document fetch
        if (documentCount > 0) {
          const sampleDoc = await prisma.document.findFirst({
            select: {
              id: true,
              filename: true,
              title: true,
              grade_level: true,
              created_at: true
            }
          });
          
          diagnostics.checks.sampleDocument = {
            status: 'SUCCESS',
            data: sampleDoc,
            message: 'Successfully fetched sample document'
          };
        }

        // Test raw query
        const rawResult = await prisma.$queryRaw`SELECT version()`;
        diagnostics.checks.rawQuery = {
          status: 'SUCCESS',
          result: rawResult,
          message: 'Raw SQL query executed successfully'
        };

      } catch (queryError: any) {
        diagnostics.checks.queries = {
          status: 'ERROR',
          error: queryError.message,
          code: queryError.code,
          message: 'Database queries failed'
        };
      }

    } catch (connectionError: any) {
      diagnostics.checks.connection = {
        status: 'ERROR',
        error: connectionError.message,
        code: connectionError.code,
        message: 'Failed to connect to database'
      };
    } finally {
      await prisma.$disconnect();
    }

    // 4. Overall Health Assessment
    const hasErrors = Object.values(diagnostics.checks).some((check: any) => check.status === 'ERROR');
    diagnostics.overallHealth = hasErrors ? 'UNHEALTHY' : 'HEALTHY';

  } catch (error: any) {
    diagnostics.checks.system = {
      status: 'CRITICAL_ERROR',
      error: error.message,
      stack: error.stack,
      message: 'System-level error occurred'
    };
    diagnostics.overallHealth = 'CRITICAL';
  }

  return NextResponse.json(diagnostics, { 
    status: diagnostics.overallHealth === 'HEALTHY' ? 200 : 500 
  });
}

// Also add a simple POST endpoint to test database writes
export async function POST() {
  try {
    const prisma = new PrismaClient();
    
    // Test write operation by creating a test record
    const testDoc = await prisma.document.create({
      data: {
        filename: `test-${Date.now()}.pdf`,
        title: 'Database Connection Test',
        grade_level: 'Test',
        subject: 'Testing',
        content: 'This is a test document to verify database write operations.'
      }
    });

    // Immediately delete it
    await prisma.document.delete({
      where: { id: testDoc.id }
    });

    await prisma.$disconnect();

    return NextResponse.json({
      status: 'SUCCESS',
      message: 'Database write/delete test completed successfully',
      testId: testDoc.id
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      message: 'Database write test failed',
      error: error.message,
      code: error.code
    }, { status: 500 });
  }
}
