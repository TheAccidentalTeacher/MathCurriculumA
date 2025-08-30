import { useState, useEffect } from 'react';

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

interface VideoRecommendationsProps {
  documentId: string;
  lessonNumber: number;
  lessonTitle: string;
}

export function VideoRecommendations({ documentId, lessonNumber, lessonTitle }: VideoRecommendationsProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadVideos();
  }, [documentId, lessonNumber]);

  const loadVideos = async () => {
    if (!lessonTitle) return;
    
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        title: lessonTitle
      });
      
      const response = await fetch(
        `/api/lessons/${documentId}/${lessonNumber}/videos?${params}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load videos');
      }
      
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Error loading Khan Academy videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const formatViewCount = (viewCount?: string): string => {
    if (!viewCount) return '';
    const views = parseInt(viewCount, 10);
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              <path d="M9.545 15.568V8.432L15.818 12z" fill="white"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800">Khan Academy Videos</h3>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <span className="ml-3 text-red-700">Finding relevant videos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              <path d="M9.545 15.568V8.432L15.818 12z" fill="white"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800">Khan Academy Videos</h3>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <p className="text-yellow-800 font-medium">Videos unavailable in development</p>
              <p className="text-yellow-700 text-sm mt-1">
                Khan Academy videos will be available when deployed to Railway with your YouTube API key.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              <path d="M9.545 15.568V8.432L15.818 12z" fill="white"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-800">Khan Academy Videos</h3>
        </div>
        
        <p className="text-red-700 text-center py-4">
          No Khan Academy videos found for this lesson topic.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/>
              <path d="M9.545 15.568V8.432L15.818 12z" fill="white"/>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-800">Khan Academy Videos</h3>
            <p className="text-red-600 text-sm">{videos.length} video{videos.length === 1 ? '' : 's'} found</p>
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-red-600 hover:text-red-700 transition-colors"
        >
          <svg 
            className={`w-5 h-5 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className={`space-y-4 ${expanded ? 'block' : 'hidden'}`}>
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg border border-red-200 overflow-hidden hover:border-red-300 transition-colors">
            <div className="flex">
              {/* Video Thumbnail */}
              <div className="flex-shrink-0 w-48 h-36 bg-gray-100 relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>

              {/* Video Details */}
              <div className="flex-1 p-4">
                <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  <a 
                    href={video.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-red-600 transition-colors"
                  >
                    {video.title}
                  </a>
                </h4>
                
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium text-red-700">{video.channelTitle}</span>
                  {video.viewCount && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{formatViewCount(video.viewCount)}</span>
                    </>
                  )}
                  <span className="mx-2">•</span>
                  <span>{formatDate(video.publishedAt)}</span>
                </div>

                <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                  {video.description}
                </p>

                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Video
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!expanded && videos.length > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-4 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          View {videos.length} Khan Academy Video{videos.length === 1 ? '' : 's'}
        </button>
      )}
    </div>
  );
}
