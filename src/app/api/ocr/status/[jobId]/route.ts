import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RouteParams {
  params: Promise<{
    jobId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({
        error: 'Job ID is required'
      }, { status: 400 });
    }

    // Get job status from database
    const jobResult = await db.$queryRaw<Array<{
      job_id: string;
      volume_id: string;
      status: string;
      progress: number;
      total_pages: number;
      processed_pages: number;
      errors: any;
      results: any;
      started_at: Date;
      completed_at: Date | null;
      created_at: Date;
      updated_at: Date;
    }>>`
      SELECT 
        job_id, volume_id, status, progress, total_pages, processed_pages,
        errors, results, started_at, completed_at, created_at, updated_at
      FROM ocr_processing_jobs 
      WHERE job_id = ${jobId}
      LIMIT 1
    `;

    if (jobResult.length === 0) {
      return NextResponse.json({
        error: 'Job not found',
        jobId
      }, { status: 404 });
    }

    const job = jobResult[0];

    // Get detailed page results if completed
    let pageResults = null;
    if (job.status === 'completed') {
      const pageResultsQuery = await db.$queryRaw<Array<{
        page_number: number;
        confidence: number;
        processing_time_ms: number;
        text_length: number;
        formulas_count: number;
        tables_count: number;
      }>>`
        SELECT 
          page_number,
          confidence,
          processing_time_ms,
          LENGTH(extracted_text) as text_length,
          JSONB_ARRAY_LENGTH(mathematical_formulas) as formulas_count,
          JSONB_ARRAY_LENGTH(tables_data) as tables_count
        FROM ocr_page_results 
        WHERE job_id = ${jobId}
        ORDER BY page_number
      `;

      pageResults = pageResultsQuery;
    }

    // Calculate summary statistics
    const processingTime = job.completed_at 
      ? job.completed_at.getTime() - job.started_at.getTime()
      : Date.now() - job.started_at.getTime();

    const summary = job.results ? (() => {
      const results = Array.isArray(job.results) ? job.results : [];
      return {
        totalFormulas: results.reduce((sum: number, r: any) => sum + (r.mathematicalFormulas?.length || 0), 0),
        totalTables: results.reduce((sum: number, r: any) => sum + (r.tables?.length || 0), 0),
        avgConfidence: results.length > 0 
          ? Math.round((results.reduce((sum: number, r: any) => sum + (r.confidence || 0), 0) / results.length) * 100)
          : 0,
        totalTextLength: results.reduce((sum: number, r: any) => sum + (r.extractedText?.length || 0), 0)
      };
    })() : null;

    const response = {
      jobId: job.job_id,
      volumeId: job.volume_id,
      status: job.status,
      progress: job.progress,
      totalPages: job.total_pages,
      processedPages: job.processed_pages,
      errors: Array.isArray(job.errors) ? job.errors : [],
      startedAt: job.started_at.toISOString(),
      completedAt: job.completed_at?.toISOString() || null,
      processingTimeMs: processingTime,
      lastUpdated: job.updated_at.toISOString(),
      summary,
      pageResults
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Error fetching job status:', error);
    
    return NextResponse.json({
      error: 'Failed to fetch job status',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({
        error: 'Job ID is required'
      }, { status: 400 });
    }

    // Delete job and all related data (CASCADE will handle page results)
    const deleteResult = await db.$executeRaw`
      DELETE FROM ocr_processing_jobs WHERE job_id = ${jobId}
    `;

    return NextResponse.json({
      success: true,
      message: `Job ${jobId} deleted successfully`
    });

  } catch (error) {
    console.error('❌ Error deleting job:', error);
    
    return NextResponse.json({
      error: 'Failed to delete job',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
