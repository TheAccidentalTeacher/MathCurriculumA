import { NextResponse } from 'next/server';
import { curriculumService } from '@/lib/curriculum-service';

// Debug endpoint for curriculum service
export async function GET() {
  const debug: any = {
    timestamp: new Date().toISOString(),
    service: 'CurriculumService',
    tests: {}
  };

  try {
    // Test getAllDocuments
    const startTime = Date.now();
    const documents = await curriculumService.getAllDocuments();
    const documentsTime = Date.now() - startTime;
    
    debug.tests.getAllDocuments = {
      status: 'SUCCESS',
      count: documents.length,
      executionTime: `${documentsTime}ms`,
      sample: documents.slice(0, 2).map(doc => ({
        id: doc.id,
        filename: doc.filename,
        title: doc.title,
        grade_level: doc.grade_level,
        contentLength: doc.contentPreview.length
      }))
    };

    // Test getStats
    const statsStartTime = Date.now();
    const stats = await curriculumService.getStats();
    const statsTime = Date.now() - statsStartTime;
    
    debug.tests.getStats = {
      status: 'SUCCESS',
      data: stats,
      executionTime: `${statsTime}ms`
    };

    // Test search functionality
    if (documents.length > 0) {
      const searchStartTime = Date.now();
      const searchResults = await curriculumService.searchContent('mathematics');
      const searchTime = Date.now() - searchStartTime;
      
      debug.tests.searchContent = {
        status: 'SUCCESS',
        query: 'mathematics',
        resultCount: searchResults.length,
        executionTime: `${searchTime}ms`
      };
    }

    debug.overallStatus = 'SUCCESS';

  } catch (error: any) {
    debug.tests.error = {
      status: 'ERROR',
      message: error.message,
      stack: error.stack,
      code: error.code
    };
    debug.overallStatus = 'ERROR';
  }

  return NextResponse.json(debug, {
    status: debug.overallStatus === 'SUCCESS' ? 200 : 500
  });
}
