import { NextRequest, NextResponse } from 'next/server';
import { OCRService } from '@/lib/ocr-service';

export async function GET() {
  try {
    const volumes = await OCRService.getAvailableVolumes();
    
    return NextResponse.json({
      message: 'OCR Processing Service',
      status: 'ready',
      version: '1.0.0',
      availableVolumes: volumes,
      endpoints: {
        'GET /api/ocr': 'Service status and available volumes',
        'POST /api/ocr/process': 'Start OCR processing for a volume',
        'GET /api/ocr/test': 'Test OCR with a sample page',
        'GET /api/ocr/status/[jobId]': 'Get processing job status'
      },
      capabilities: [
        'Azure Document Intelligence integration',
        'Mathematical formula extraction',
        'Table recognition and extraction', 
        'Batch processing with progress tracking',
        'Error handling and retry logic'
      ]
    });
  } catch (error) {
    console.error('OCR service error:', error);
    return NextResponse.json({
      error: 'OCR service unavailable',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, volumeId } = body;

    if (action === 'test') {
      console.log(`🧪 Testing OCR service${volumeId ? ` with volume: ${volumeId}` : ''}`);
      
      const testResult = await OCRService.testOCR(volumeId);
      
      if (!testResult) {
        return NextResponse.json({
          success: false,
          error: 'OCR test failed - check server logs for details'
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        testResult: {
          pageNumber: testResult.pageNumber,
          textLength: testResult.extractedText.length,
          textPreview: testResult.extractedText.substring(0, 200) + (testResult.extractedText.length > 200 ? '...' : ''),
          formulasFound: testResult.mathematicalFormulas.length,
          formulas: testResult.mathematicalFormulas.slice(0, 3), // First 3 formulas
          tablesFound: testResult.tables.length,
          confidence: Math.round(testResult.confidence * 100),
          processingTimeMs: testResult.processingTimeMs,
          metadata: testResult.metadata
        }
      });
    }

    return NextResponse.json({
      error: 'Invalid action',
      validActions: ['test']
    }, { status: 400 });

  } catch (error) {
    console.error('OCR API error:', error);
    return NextResponse.json({
      error: 'Request processing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
