import { NextRequest, NextResponse } from 'next/server';
import { OCRService } from '@/lib/ocr-service';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { volumeId, options = {} } = body;

    if (!volumeId) {
      return NextResponse.json({
        error: 'Volume ID is required'
      }, { status: 400 });
    }

    console.log(`🚀 Starting OCR processing for volume: ${volumeId}`);

    // Start the batch processing job
    const jobStatus = await OCRService.batchProcessVolume(
      volumeId,
      (status) => {
        // Progress callback - in production, you might want to use WebSocket or SSE
        console.log(`📊 Job ${status.jobId} progress: ${status.progress}% (${status.processedPages}/${status.totalPages})`);
      }
    );

    // Store job status in database
    try {
      await db.$executeRaw`
        INSERT INTO ocr_processing_jobs (
          job_id, volume_id, status, progress, total_pages, 
          processed_pages, errors, results, started_at, completed_at
        ) VALUES (
          ${jobStatus.jobId}::VARCHAR,
          ${volumeId}::VARCHAR,
          ${jobStatus.status}::VARCHAR,
          ${jobStatus.progress}::INTEGER,
          ${jobStatus.totalPages}::INTEGER,
          ${jobStatus.processedPages}::INTEGER,
          ${JSON.stringify(jobStatus.errors)}::JSONB,
          ${JSON.stringify(jobStatus.results || [])}::JSONB,
          ${jobStatus.startedAt}::TIMESTAMP,
          ${jobStatus.completedAt ? jobStatus.completedAt : null}::TIMESTAMP
        )
        ON CONFLICT (job_id) DO UPDATE SET
          status = EXCLUDED.status,
          progress = EXCLUDED.progress,
          processed_pages = EXCLUDED.processed_pages,
          errors = EXCLUDED.errors,
          results = EXCLUDED.results,
          completed_at = EXCLUDED.completed_at,
          updated_at = NOW()
      `;

      // If completed, also store individual page results
      if (jobStatus.status === 'completed' && jobStatus.results) {
        for (const result of jobStatus.results) {
          await db.$executeRaw`
            INSERT INTO ocr_page_results (
              job_id, volume_id, page_number, extracted_text,
              mathematical_formulas, tables_data, confidence,
              processing_time_ms, metadata
            ) VALUES (
              ${jobStatus.jobId}::VARCHAR,
              ${volumeId}::VARCHAR,
              ${result.pageNumber}::INTEGER,
              ${result.extractedText}::TEXT,
              ${JSON.stringify(result.mathematicalFormulas)}::JSONB,
              ${JSON.stringify(result.tables)}::JSONB,
              ${result.confidence}::DECIMAL,
              ${result.processingTimeMs}::INTEGER,
              ${JSON.stringify(result.metadata)}::JSONB
            )
            ON CONFLICT DO NOTHING
          `;
        }
      }

      console.log(`✅ Job status saved to database: ${jobStatus.jobId}`);
    } catch (dbError) {
      console.error('❌ Error saving job status to database:', dbError);
      // Continue anyway - the OCR processing succeeded
    }

    return NextResponse.json({
      success: true,
      jobId: jobStatus.jobId,
      status: jobStatus.status,
      progress: jobStatus.progress,
      totalPages: jobStatus.totalPages,
      processedPages: jobStatus.processedPages,
      errors: jobStatus.errors,
      summary: {
        volumeId,
        startedAt: jobStatus.startedAt,
        completedAt: jobStatus.completedAt,
        processingTime: jobStatus.completedAt 
          ? new Date(jobStatus.completedAt).getTime() - new Date(jobStatus.startedAt).getTime()
          : null
      },
      results: jobStatus.results ? {
        totalFormulas: jobStatus.results.reduce((sum, r) => sum + r.mathematicalFormulas.length, 0),
        totalTables: jobStatus.results.reduce((sum, r) => sum + r.tables.length, 0),
        avgConfidence: Math.round((jobStatus.results.reduce((sum, r) => sum + r.confidence, 0) / jobStatus.results.length) * 100),
        textLength: jobStatus.results.reduce((sum, r) => sum + r.extractedText.length, 0)
      } : null
    });

  } catch (error) {
    console.error('❌ OCR processing failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'OCR processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
