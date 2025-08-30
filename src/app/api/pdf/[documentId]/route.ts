import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface RouteParams {
  params: Promise<{
    documentId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    
    // Map document IDs to PDF filenames
    const documentMap: { [key: string]: string } = {
      'RCM07_NA_SW_V1': 'RCM07_NA_SW_V1.pdf',
      'rcm07-na-sw-v1': 'RCM07_NA_SW_V1.pdf',
      'RCM07_NA_SW_V2': 'RCM07_NA_SW_V2.pdf',
      'rcm07-na-sw-v2': 'RCM07_NA_SW_V2.pdf',
      'RCM08_NA_SW_V1': 'RCM08_NA_SW_V1.pdf',
      'rcm08-na-sw-v1': 'RCM08_NA_SW_V1.pdf',
      'RCM08_NA_SW_V2': 'RCM08_NA_SW_V2.pdf',
      'rcm08-na-sw-v2': 'RCM08_NA_SW_V2.pdf',
    };

    const filename = documentMap[documentId];
    if (!filename) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Construct path to PDF file
    const pdfPath = path.join(process.cwd(), 'pdfs', filename);
    
    try {
      // Read the PDF file
      const pdfBuffer = await readFile(pdfPath);
      
      // Return the PDF with proper headers
      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'application/pdf',
          'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24 hours
          'Content-Length': pdfBuffer.length.toString(),
          'Content-Disposition': `inline; filename="${filename}"`,
        },
      });
    } catch (fileError) {
      console.error('PDF file read error:', fileError);
      return NextResponse.json({ 
        error: 'PDF file not found',
        details: `Could not find PDF for document ${documentId}`
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('PDF API route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
