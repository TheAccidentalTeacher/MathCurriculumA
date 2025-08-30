'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Import PDF.js for text search functionality
declare const pdfjsLib: any;

interface PageViewerProps {
  documentId: string;
  totalPages: number;
  initialPage?: number;
  volumeName?: string;
  volume?: string;
  navigationParams?: {
    navigationId?: string;
    searchPattern?: string;
    lessonNumber?: number;
    fallbackPattern?: string;
    estimatedPage?: number;
  };
}

export default function PageViewer({ 
  documentId, 
  totalPages, 
  initialPage = 1, 
  volumeName, 
  volume,
  navigationParams 
}: PageViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string>('');

  // Handle search-based navigation on component mount
  useEffect(() => {
    if (navigationParams?.searchPattern || navigationParams?.navigationId) {
      handleSearchBasedNavigation();
    }
  }, []);

  const handleSearchBasedNavigation = async () => {
    if (!navigationParams || !navigationParams.searchPattern) return;

    setSearchStatus('🔍 Searching for lesson...');
    
    try {
      // Try to find the lesson using search pattern
      let targetPage = await searchForLessonInPDF(
        navigationParams.searchPattern,
        navigationParams.fallbackPattern
      );
      
      if (targetPage) {
        setSearchStatus(`✅ Found lesson on page ${targetPage}`);
        goToPage(targetPage);
        // Clear status after 3 seconds
        setTimeout(() => setSearchStatus(''), 3000);
      } else {
        setSearchStatus('❌ Lesson not found - using estimated page');
        if (navigationParams.estimatedPage) {
          goToPage(navigationParams.estimatedPage);
        }
        setTimeout(() => setSearchStatus(''), 5000);
      }
    } catch (error) {
      setSearchStatus('⚠️ Search error - using estimated page');
      if (navigationParams.estimatedPage) {
        goToPage(navigationParams.estimatedPage);
      }
      setTimeout(() => setSearchStatus(''), 5000);
    }
  };

// Professional search function using extracted document data
const searchForLessonInPDF = async (searchPattern: string, fallbackPattern?: string): Promise<number | null> => {
  console.log(`🔍 Professional search for: ${searchPattern}`);
  
  try {
    const response = await fetch(`/api/search/${documentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchPattern,
        fallbackPattern
      })
    });
    
    const result = await response.json();
    
    if (result.success && result.pageNumber) {
      console.log(`✅ Professional search found lesson at page: ${result.pageNumber}`);
      return result.pageNumber;
    } else {
      console.warn(`❌ Professional search failed: ${result.error}`);
      return null;
    }
  } catch (error) {
    console.error('Professional search error:', error);
    return null;
  }
};  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setIsLoading(true);
      setImageError(false);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      {/* Search Status */}
      {searchStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md">
          <div className="text-blue-800 text-center font-medium">
            {searchStatus}
          </div>
        </div>
      )}

      {/* Lesson Navigation Info */}
      {navigationParams && (navigationParams.searchPattern || navigationParams.navigationId) && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 max-w-2xl">
          <h3 className="text-purple-800 font-semibold mb-2">📍 Lesson Navigation</h3>
          <div className="text-sm text-purple-700">
            {navigationParams.navigationId && (
              <div><strong>ID:</strong> {navigationParams.navigationId}</div>
            )}
            {navigationParams.lessonNumber && (
              <div><strong>Lesson:</strong> {navigationParams.lessonNumber}</div>
            )}
            {navigationParams.searchPattern && (
              <div><strong>Searching for:</strong> {navigationParams.searchPattern}</div>
            )}
          </div>
        </div>
      )}

      {/* Page Navigation */}
      <div className="flex items-center space-x-4 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="px-6 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors font-medium"
        >
          ← Previous
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">Page</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.currentTarget.value);
                if (page >= 1 && page <= totalPages) {
                  goToPage(page);
                }
              }
            }}
            className="w-20 px-3 py-2 border-2 border-gray-300 rounded-md text-center text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
            placeholder={currentPage.toString()}
          />
          <span className="text-gray-700 font-medium">of {totalPages}</span>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="px-6 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors font-medium"
        >
          Next →
        </button>
      </div>

      {/* Page Display */}
      <div className="relative max-w-4xl w-full">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-gray-500 text-lg">
              📄 Page {currentPage} could not be loaded
            </div>
            <button 
              onClick={() => {
                setImageError(false);
                setIsLoading(true);
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="relative">
            <Image
              src={`/api/documents/${documentId}/pages/${currentPage}`}
              alt={`Page ${currentPage}`}
              width={1275}
              height={1632}
              className="w-full h-auto border border-gray-200 rounded-lg shadow-lg"
              onLoad={handleImageLoad}
              onError={handleImageError}
              priority={currentPage <= 3} // Prioritize first few pages
            />
            
            {/* Page overlay info */}
            <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
              Page {currentPage}
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap gap-2 justify-center max-w-4xl">
        {/* Show page numbers for quick navigation */}
        {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                currentPage === pageNum
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        {totalPages > 10 && (
          <>
            <span className="px-2 py-2 text-gray-500">...</span>
            <button
              onClick={() => goToPage(totalPages)}
              className={`w-10 h-10 rounded-md text-sm font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
