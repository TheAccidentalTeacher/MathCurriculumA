'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PageViewerProps {
  documentId: string;
  totalPages: number;
  initialPage?: number;
  volumeName?: string;
}

export default function PageViewer({ documentId, totalPages, initialPage = 1, volumeName }: PageViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const goToPage = (pageNumber: number) => {
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
      {/* Page Navigation */}
      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-md p-4">
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
        >
          ← Previous
        </button>
        
        <div className="flex items-center space-x-2">
          <span className="text-gray-600">Page</span>
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
            className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-600">of {totalPages}</span>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
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
