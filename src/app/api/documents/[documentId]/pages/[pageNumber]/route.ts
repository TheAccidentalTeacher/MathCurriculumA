import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface RouteParams {
  params: Promise<{
    documentId: string;
    pageNumber: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId, pageNumber } = await params;
    
    // Validate inputs
    const pageNum = parseInt(pageNumber);
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }

    // Map document IDs to folder names
    const documentMap: { [key: string]: string } = {
      'rcm07-na-sw-v1': 'RCM07_NA_SW_V1',
      'test-sample': 'test_sample'
    };

    const folderName = documentMap[documentId];
    if (!folderName) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Format page number (pad with zeros)
    const filename = `page_${pageNum.toString().padStart(3, '0')}.png`;
    
    // Construct path to image
    const imagePath = path.join(process.cwd(), 'webapp_pages', folderName, 'pages', filename);
    
    try {
      // Read the image file
      const imageBuffer = await readFile(imagePath);
      
      // Return the image with proper headers
      return new NextResponse(imageBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24 hours
          'Content-Length': imageBuffer.length.toString(),
        },
      });
    } catch (fileError) {
      console.error('File read error:', fileError);
      return NextResponse.json({ 
        error: 'Page image not found',
        details: `Could not find page ${pageNum} for document ${documentId}`
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
