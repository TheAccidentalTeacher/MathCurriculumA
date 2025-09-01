import { NextRequest, NextResponse } from 'next/server';
import { OCRService } from '@/lib/ocr-service';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const volumeId = searchParams.get('volume');

  try {
    console.log(`🧪 Running OCR test${volumeId ? ` with volume: ${volumeId}` : ''}`);
    
    const testResult = await OCRService.testOCR(volumeId || undefined);
    
    if (!testResult) {
      return NextResponse.json({
        success: false,
        error: 'OCR test failed',
        message: 'Unable to process test image. Check server logs for details.'
      }, { status: 500 });
    }

    // Prepare a clean response with sample data
    const response = {
      success: true,
      testCompleted: true,
      testResult: {
        pageNumber: testResult.pageNumber,
        confidence: Math.round(testResult.confidence * 100),
        processingTimeMs: testResult.processingTimeMs,
        content: {
          textLength: testResult.extractedText.length,
          textPreview: testResult.extractedText.length > 300 
            ? testResult.extractedText.substring(0, 300) + '...'
            : testResult.extractedText,
          textSample: testResult.extractedText
            .split('\n')
            .filter(line => line.trim().length > 10)
            .slice(0, 5)
            .map(line => line.trim()),
          mathematicalFormulas: {
            count: testResult.mathematicalFormulas.length,
            samples: testResult.mathematicalFormulas.slice(0, 3)
          },
          tables: {
            count: testResult.tables.length,
            samples: testResult.tables.slice(0, 2).map(table => ({
              rowCount: table.rows.length,
              columnCount: table.rows[0]?.length || 0,
              confidence: Math.round(table.confidence * 100),
              preview: table.rows.slice(0, 3) // First 3 rows
            }))
          }
        },
        metadata: testResult.metadata,
        assessment: {
          textQuality: testResult.extractedText.length > 100 ? 'Good' : 'Limited',
          formulaDetection: testResult.mathematicalFormulas.length > 0 ? 'Active' : 'None detected',
          tableDetection: testResult.tables.length > 0 ? 'Active' : 'None detected',
          overallConfidence: testResult.confidence >= 0.8 ? 'High' : testResult.confidence >= 0.6 ? 'Medium' : 'Low'
        }
      },
      serviceStatus: {
        azureConnection: 'Connected',
        availableVolumes: await OCRService.getAvailableVolumes(),
        ready: true
      }
    };

    console.log(`✅ OCR test completed successfully:`);
    console.log(`   📝 Text: ${testResult.extractedText.length} chars`);
    console.log(`   📐 Formulas: ${testResult.mathematicalFormulas.length}`);
    console.log(`   📊 Tables: ${testResult.tables.length}`);
    console.log(`   🎯 Confidence: ${Math.round(testResult.confidence * 100)}%`);
    console.log(`   ⏱️  Processing: ${testResult.processingTimeMs}ms`);

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ OCR test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'OCR test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: {
        checkAzureKeys: 'Verify AZURE_AI_FOUNDRY_ENDPOINT and AZURE_AI_FOUNDRY_KEY are set',
        checkFiles: 'Ensure webapp_pages directory exists with image files',
        checkConnection: 'Verify Azure AI Document Intelligence service is accessible'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { volumeId, pageNumber } = body;

    if (!volumeId) {
      return NextResponse.json({
        error: 'Volume ID is required for specific page testing'
      }, { status: 400 });
    }

    // Test with a specific volume/page
    console.log(`🎯 Testing OCR with specific volume: ${volumeId}${pageNumber ? `, page: ${pageNumber}` : ''}`);
    
    const testResult = await OCRService.testOCR(volumeId);
    
    if (!testResult) {
      return NextResponse.json({
        success: false,
        error: 'OCR test failed for specified volume',
        volumeId
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      volumeId,
      testResult: {
        pageNumber: testResult.pageNumber,
        textLength: testResult.extractedText.length,
        formulasFound: testResult.mathematicalFormulas.length,
        tablesFound: testResult.tables.length,
        confidence: Math.round(testResult.confidence * 100),
        processingTimeMs: testResult.processingTimeMs
      }
    });

  } catch (error) {
    console.error('❌ Specific OCR test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Specific OCR test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
