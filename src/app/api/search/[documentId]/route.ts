import { NextRequest, NextResponse } from 'next/server';
import { DocumentSearchService } from '../../../../lib/document-search';

interface RouteParams {
  params: Promise<{
    documentId: string;
  }>;
}

/**
 * Professional lesson search API endpoint
 * POST /api/search/[documentId]
 * 
 * Searches through extracted document text data to find lessons
 * Uses multiple search strategies for maximum accuracy and reliability
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    const body = await request.json();
    
    // Validate request body
    if (!body.searchPattern) {
      return NextResponse.json(
        { error: 'searchPattern is required' }, 
        { status: 400 }
      );
    }
    
    const { searchPattern, fallbackPattern } = body;
    
    // Perform the search using professional search service
    const pageNumber = await DocumentSearchService.searchForLesson(
      documentId,
      searchPattern,
      fallbackPattern
    );
    
    if (pageNumber) {
      return NextResponse.json({
        success: true,
        pageNumber,
        searchPattern,
        fallbackPattern: fallbackPattern || null
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Lesson not found',
        searchPattern,
        fallbackPattern: fallbackPattern || null
      }, { status: 404 });
    }
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

/**
 * Get document information
 * GET /api/search/[documentId]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { documentId } = await params;
    
    const documentInfo = await DocumentSearchService.getDocumentInfo(documentId);
    
    if (documentInfo) {
      return NextResponse.json(documentInfo);
    } else {
      return NextResponse.json(
        { error: 'Document not found' }, 
        { status: 404 }
      );
    }
    
  } catch (error) {
    console.error('Document info API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}
