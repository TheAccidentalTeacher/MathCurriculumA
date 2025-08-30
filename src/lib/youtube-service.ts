interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  publishedAt: string;
  viewCount?: string;
  url: string;
}

interface YouTubeSearchParams {
  lessonTitle: string;
  grade: 7 | 8;
  topic?: string;
  maxResults?: number;
}

export class YouTubeService {
  private static readonly API_KEY = process.env.YOUTUBE_API_KEY;
  private static readonly BASE_URL = 'https://www.googleapis.com/youtube/v3';
  private static readonly KHAN_ACADEMY_CHANNEL_ID = 'UC4a-Gbdw7vOaccHmFo40b9g';
  
  /**
   * Search for Khan Academy videos related to a specific lesson
   */
  static async searchKhanAcademyVideos(params: YouTubeSearchParams): Promise<YouTubeVideo[]> {
    const { lessonTitle, grade, topic, maxResults = 3 } = params;
    
    try {
      // Check if API key is available
      if (!this.API_KEY) {
        console.warn('⚠️ YouTube API key not found. Videos will not be available until deployed to Railway.');
        return [];
      }
      
      // Build search query optimized for Khan Academy math content
      const searchQuery = this.buildSearchQuery(lessonTitle, grade, topic);
      
      const searchUrl = new URL(`${this.BASE_URL}/search`);
      searchUrl.searchParams.append('key', this.API_KEY);
      searchUrl.searchParams.append('part', 'snippet');
      searchUrl.searchParams.append('channelId', this.KHAN_ACADEMY_CHANNEL_ID);
      searchUrl.searchParams.append('q', searchQuery);
      searchUrl.searchParams.append('type', 'video');
      searchUrl.searchParams.append('maxResults', maxResults.toString());
      searchUrl.searchParams.append('order', 'relevance');
      searchUrl.searchParams.append('safeSearch', 'strict');
      
      console.log(`🔍 Searching Khan Academy for: "${searchQuery}"`);
      
      const response = await fetch(searchUrl.toString());
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        console.log(`📹 No Khan Academy videos found for: ${searchQuery}`);
        return [];
      }
      
      // Get detailed video information
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const videos = await this.getVideoDetails(videoIds);
      
      console.log(`✅ Found ${videos.length} Khan Academy videos for: ${lessonTitle}`);
      return videos;
      
    } catch (error) {
      console.error('Khan Academy search error:', error);
      return [];
    }
  }
  
  /**
   * Get detailed information about specific videos
   */
  private static async getVideoDetails(videoIds: string): Promise<YouTubeVideo[]> {
    try {
      if (!this.API_KEY) {
        return [];
      }
      
      const detailsUrl = new URL(`${this.BASE_URL}/videos`);
      detailsUrl.searchParams.append('key', this.API_KEY);
      detailsUrl.searchParams.append('part', 'snippet,contentDetails,statistics');
      detailsUrl.searchParams.append('id', videoIds);
      
      const response = await fetch(detailsUrl.toString());
      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: this.formatDuration(item.contentDetails.duration),
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount,
        url: `https://www.youtube.com/watch?v=${item.id}`
      }));
      
    } catch (error) {
      console.error('Video details error:', error);
      return [];
    }
  }
  
  /**
   * Build an optimized search query for math lessons
   */
  private static buildSearchQuery(lessonTitle: string, grade: 7 | 8, topic?: string): string {
    // Clean the lesson title for better searching
    let cleanTitle = lessonTitle
      .replace(/LESSON\s+\d+/i, '') // Remove "LESSON X"
      .replace(/[|:]/g, '') // Remove separators
      .trim();
    
    // Add grade-appropriate context
    const gradeContext = grade === 7 ? 'middle school' : '8th grade algebra';
    
    // Build search terms based on common lesson patterns
    const mathTopics = this.extractMathTopics(cleanTitle);
    const searchTerms = [
      ...mathTopics,
      gradeContext,
      'mathematics'
    ].filter(Boolean).join(' ');
    
    console.log(`🎯 Search query built: "${searchTerms}" from "${lessonTitle}"`);
    return searchTerms;
  }
  
  /**
   * Extract mathematical concepts from lesson titles
   */
  private static extractMathTopics(title: string): string[] {
    const topics: string[] = [];
    
    // Common math concept mappings
    const conceptMap: Record<string, string[]> = {
      'proportional': ['proportional relationships', 'ratios', 'proportions'],
      'ratio': ['ratios', 'proportional reasoning'],
      'scale': ['scale factor', 'similar figures', 'proportions'],
      'fraction': ['fractions', 'rational numbers'],
      'equation': ['equations', 'solving equations', 'linear equations'],
      'expression': ['algebraic expressions', 'simplifying expressions'],
      'coordinate': ['coordinate plane', 'graphing', 'plotting points'],
      'geometry': ['geometry', 'geometric shapes'],
      'angle': ['angles', 'angle relationships'],
      'triangle': ['triangles', 'triangle properties'],
      'circle': ['circles', 'circumference', 'area'],
      'volume': ['volume', '3d shapes', 'solid geometry'],
      'surface area': ['surface area', '3d geometry'],
      'statistics': ['statistics', 'data analysis'],
      'probability': ['probability', 'chance'],
      'negative': ['negative numbers', 'integers'],
      'absolute': ['absolute value'],
      'linear': ['linear functions', 'linear relationships'],
      'slope': ['slope', 'rate of change'],
      'intercept': ['y-intercept', 'x-intercept'],
      'inequality': ['inequalities', 'solving inequalities']
    };
    
    const lowerTitle = title.toLowerCase();
    
    for (const [key, concepts] of Object.entries(conceptMap)) {
      if (lowerTitle.includes(key)) {
        topics.push(...concepts);
      }
    }
    
    // If no specific concepts found, use the title as-is
    if (topics.length === 0) {
      topics.push(title);
    }
    
    return [...new Set(topics)]; // Remove duplicates
  }
  
  /**
   * Format YouTube duration from ISO 8601 to readable format
   */
  private static formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  /**
   * Cache videos for lessons to avoid repeated API calls
   */
  static async getCachedVideosForLesson(documentId: string, lessonNumber: number, lessonTitle: string): Promise<YouTubeVideo[]> {
    const cacheKey = `${documentId}-${lessonNumber}`;
    
    // In a real implementation, you'd use Redis or database caching
    // For now, we'll implement in-memory caching
    if (!this.videoCache.has(cacheKey)) {
      const grade = documentId.includes('07') ? 7 : 8;
      const videos = await this.searchKhanAcademyVideos({
        lessonTitle,
        grade,
        maxResults: 2
      });
      
      this.videoCache.set(cacheKey, videos);
    }
    
    return this.videoCache.get(cacheKey) || [];
  }
  
  private static videoCache = new Map<string, YouTubeVideo[]>();
}

export type { YouTubeVideo, YouTubeSearchParams };
