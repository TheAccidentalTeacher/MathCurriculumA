import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string; pageNumber: string } }
) {
  try {
    const { documentId, pageNumber } = params;
    
    // Validate inputs
    const pageNum = parseInt(pageNumber);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > 999) {
      return NextResponse.json({ error: 'Invalid page number' }, { status: 400 });
    }

    // Map document IDs to file paths
    const documentMap: { [key: string]: string } = {
      'rcm07-na-sw-v1': 'RCM07_NA_SW_V1',
      'test-sample': 'test_sample'
    };

    const folderName = documentMap[documentId];
    if (!folderName) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Construct file path
    const filename = `page_${pageNum.toString().padStart(3, '0')}.png`;
    const imagePath = path.join(process.cwd(), 'webapp_pages', folderName, 'pages', filename);

    try {
      // Read the image file
      const imageBuffer = await readFile(imagePath);

      // Return the image with proper headers
      return new NextResponse(imageBuffer as unknown as BodyInit, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          'Content-Length': imageBuffer.length.toString(),
        },
      });
    } catch (fileError) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving page image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
