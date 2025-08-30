'use client';

import { useState, useEffect } from 'react';
import { YouTubeVideo } from '@/lib/youtube-service';

interface KhanAcademyVideosProps {
  documentId: string;
  lessonNumber: number;
  lessonTitle: string;
}

export default function KhanAcademyVideos({ 
  documentId, 
  lessonNumber, 
  lessonTitle 
}: KhanAcademyVideosProps) {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [documentId, lessonNumber, lessonTitle]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `/api/lessons/${documentId}/${lessonNumber}/videos?title=${encodeURIComponent(lessonTitle)}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Khan Academy videos');
      }
      
      const data = await response.json();
      setVideos(data.videos || []);
      
      if (data.videos && data.videos.length > 0) {
        setSelectedVideo(data.videos[0]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Khan Academy videos error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">KA</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Khan Academy Videos</h3>
        </div>
        
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Finding perfect videos...</span>
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">KA</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Khan Academy Videos</h3>
        </div>
        
        <div className="text-center py-6">
          <div className="text-gray-500 mb-2">
            {error ? '⚠️ Unable to load videos' : '📹 No videos found for this lesson'}
          </div>
          <p className="text-sm text-gray-400">
            {error || 'Try searching Khan Academy directly for related content'}
          </p>
          
          <a
            href={`https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(lessonTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            🔍 Search Khan Academy
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">KA</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Khan Academy Videos</h3>
          <p className="text-sm text-gray-600">Perfect explanations for this lesson</p>
        </div>
      </div>

      {selectedVideo && (
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.id}?rel=0&modestbranding=1`}
                title={selectedVideo.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            <div className="p-4">
              <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                {selectedVideo.title}
              </h4>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center">
                  ⏱️ {selectedVideo.duration}
                </span>
                
                {selectedVideo.viewCount && (
                  <span className="flex items-center">
                    👁️ {parseInt(selectedVideo.viewCount).toLocaleString()} views
                  </span>
                )}
              </div>
              
              {selectedVideo.description && (
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {selectedVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {videos.length > 1 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Related Videos:</h4>
          
          {videos.map((video) => (
            <div
              key={video.id}
              className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedVideo?.id === video.id 
                  ? 'bg-green-100 border-2 border-green-300' 
                  : 'bg-white hover:bg-gray-50 border border-gray-200'
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-15 object-cover rounded flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
                  {video.title}
                </h5>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span>⏱️ {video.duration}</span>
                  {video.viewCount && (
                    <span>👁️ {parseInt(video.viewCount).toLocaleString()}</span>
                  )}
                </div>
              </div>
              
              {selectedVideo?.id === video.id && (
                <div className="text-green-600">
                  ▶️
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href={`https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(lessonTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
        >
          🔍 Find more videos on Khan Academy →
        </a>
      </div>
    </div>
  );
}
