import { NextRequest, NextResponse } from 'next/server';
import { YouTubeService } from '@/lib/youtube-service';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ documentId: string; lessonNumber: string }> }
) {
  try {
    const { documentId, lessonNumber } = await context.params;
    const lessonNum = parseInt(lessonNumber);
    
    if (isNaN(lessonNum)) {
      return NextResponse.json(
        { error: 'Invalid lesson number' },
        { status: 400 }
      );
    }
    
    // Get lesson title from URL params or use a default
    const { searchParams } = new URL(request.url);
    const lessonTitle = searchParams.get('title') || `Lesson ${lessonNum}`;
    
    console.log(`🎥 Searching Khan Academy videos for ${documentId} Lesson ${lessonNum}: ${lessonTitle}`);
    
    // Search for Khan Academy videos
    const videos = await YouTubeService.getCachedVideosForLesson(
      documentId,
      lessonNum,
      lessonTitle
    );
    
    return NextResponse.json({
      success: true,
      lesson: {
        documentId,
        lessonNumber: lessonNum,
        title: lessonTitle
      },
      videos,
      totalVideos: videos.length
    });
    
  } catch (error) {
    console.error('Khan Academy video search error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search Khan Academy videos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
