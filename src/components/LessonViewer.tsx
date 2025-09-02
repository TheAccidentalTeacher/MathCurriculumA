'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { LessonData, LessonSession } from '../lib/lesson-service';
import KhanAcademyVideos from './KhanAcademyVideos';
import VirtualTutorPanel from './virtualtutor/VirtualTutorPanel';

interface LessonViewerProps {
  documentId: string;
  lessonNumber: number;
  onClose?: () => void;
}

export default function LessonViewer({ documentId, lessonNumber, onClose }: LessonViewerProps) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [currentSession, setCurrentSession] = useState<LessonSession | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [contentPreparationStatus, setContentPreparationStatus] = useState<string>('Initializing...');
  const [lessonAnalysis, setLessonAnalysis] = useState<any>(null);
  const [tutorHeight, setTutorHeight] = useState<number>(800); // Much larger default - minimum 500px
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  // Mouse drag resize handlers with useCallback to prevent recreation
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - startY;
    const newHeight = Math.max(500, Math.min(1200, startHeight + deltaY)); // Minimum 500px
    setTutorHeight(newHeight);
    console.log(`🖱️ [LessonViewer] Dragging: new height ${newHeight}px`);
  }, [isResizing, startY, startHeight]);

  const handleMouseUp = useCallback(() => {
    console.log('🖱️ [LessonViewer] Mouse up - stopping resize');
    setIsResizing(false);
    document.body.style.cursor = 'default';
    document.body.style.userSelect = 'auto';
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    console.log('🖱️ [LessonViewer] Mouse down - starting resize');
    e.preventDefault();
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(tutorHeight);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
  };

  // Add/remove mouse event listeners for drag resize
  useEffect(() => {
    if (isResizing) {
      console.log('🖱️ [LessonViewer] Adding mouse event listeners');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        console.log('🖱️ [LessonViewer] Removing mouse event listeners');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Debug logging for tutor height changes and ensure minimum
  useEffect(() => {
    console.log(`📏 [LessonViewer] Tutor height changed to: ${tutorHeight}px`);
    // Ensure minimum height of 500px
    if (tutorHeight < 500) {
      console.log(`⚠️ [LessonViewer] Height too small (${tutorHeight}px), setting to 500px`);
      setTutorHeight(500);
    }
  }, [tutorHeight]);

  // Load lesson data and prepare content on component mount
  useEffect(() => {
    console.log(`🚀 [LessonViewer] Component mounted for ${documentId} - Lesson ${lessonNumber}`);
    loadLessonData();
    prepareLessonContent();
  }, [documentId, lessonNumber]);

  // Set initial session when lesson data loads
  useEffect(() => {
    if (lessonData && lessonData.sessions.length > 0 && !currentSession) {
      console.log(`📋 [LessonViewer] Setting initial session, found ${lessonData.sessions.length} sessions`);
      setCurrentSession(lessonData.sessions[0]);
      setCurrentPageIndex(0);
    }
  }, [lessonData, currentSession]);

  const loadLessonData = async () => {
    console.log(`📚 [LessonViewer] Starting to load lesson data for ${documentId}/${lessonNumber}`);
    setIsLoading(true);
    setError(null);
    
    try {
      const apiUrl = `/api/lessons/${documentId}/${lessonNumber}`;
      console.log(`🌐 [LessonViewer] Fetching from: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      console.log(`📡 [LessonViewer] API Response status: ${response.status}`);
      
      const result = await response.json();
      console.log(`📄 [LessonViewer] API Response data:`, result);
      
      if (result.success) {
        console.log(`✅ [LessonViewer] Lesson data loaded successfully:`, result.lesson);
        setLessonData(result.lesson);
      } else {
        console.error(`❌ [LessonViewer] API returned error:`, result.error);
        setError(result.error || 'Failed to load lesson data');
      }
    } catch (err) {
      console.error(`💥 [LessonViewer] Network/parsing error:`, err);
      setError('Network error loading lesson data');
    } finally {
      setIsLoading(false);
      console.log(`🏁 [LessonViewer] loadLessonData completed`);
    }
  };

  const prepareLessonContent = async () => {
    console.log(`🔍 [LessonViewer] Starting content preparation for ${documentId}/${lessonNumber}`);
    setContentPreparationStatus('🔍 Analyzing lesson content...');
    
    try {
      // First check if content is already prepared
      const checkUrl = `/api/lessons/${documentId}/${lessonNumber}/prepare`;
      console.log(`🔎 [LessonViewer] Checking for existing analysis: ${checkUrl}`);
      
      const checkResponse = await fetch(checkUrl);
      console.log(`📊 [LessonViewer] Check response status: ${checkResponse.status}`);
      
      const checkResult = await checkResponse.json();
      console.log(`📈 [LessonViewer] Check response data:`, checkResult);
      
      if (checkResult.success) {
        console.log(`✅ [LessonViewer] Found cached lesson analysis:`, checkResult.analysis);
        setLessonAnalysis(checkResult.analysis);
        setContentPreparationStatus('✅ Lesson analysis ready (cached)');
        return;
      }

      // Prepare new content analysis
      console.log(`🆕 [LessonViewer] No cached analysis found, preparing new analysis...`);
      setContentPreparationStatus('📖 Extracting content from lesson pages...');
      
      const prepareResponse = await fetch(checkUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`🔧 [LessonViewer] Prepare response status: ${prepareResponse.status}`);
      const prepareResult = await prepareResponse.json();
      console.log(`🎯 [LessonViewer] Prepare response data:`, prepareResult);
      
      if (prepareResult.success) {
        console.log(`🎉 [LessonViewer] Content analysis completed successfully!`);
        console.log(`📋 [LessonViewer] Analysis summary:`, {
          concepts: prepareResult.analysis?.content?.mathematicalConcepts,
          confidence: prepareResult.analysis?.content?.confidence,
          processingTime: prepareResult.processingTimeMs
        });
        
        setLessonAnalysis(prepareResult.analysis);
        setContentPreparationStatus(`✅ Virtual Tutor ready with specialized knowledge (${prepareResult.processingTimeMs}ms)`);
      } else {
        console.error(`❌ [LessonViewer] Content preparation failed:`, prepareResult.error);
        throw new Error(prepareResult.error);
      }
      
    } catch (error) {
      console.error(`💥 [LessonViewer] Content preparation error:`, error);
      console.log(`🔄 [LessonViewer] Falling back to general tutoring mode`);
      setContentPreparationStatus('⚠️ Using general tutoring mode');
      setLessonAnalysis(null);
    }
  };

  const switchToSession = (session: LessonSession) => {
    setCurrentSession(session);
    setCurrentPageIndex(0);
    setImageError(false);
  };

  const goToPage = (pageIndex: number) => {
    if (currentSession && pageIndex >= 0 && pageIndex < currentSession.pages.length) {
      setCurrentPageIndex(pageIndex);
      setImageError(false);
    }
  };

  const nextPage = () => goToPage(currentPageIndex + 1);
  const prevPage = () => goToPage(currentPageIndex - 1);

  const getSessionTypeColor = (sessionType: string): string => {
    const colors: Record<string, string> = {
      introduction: 'bg-indigo-500 hover:bg-indigo-600',
      explore: 'bg-green-500 hover:bg-green-600',
      develop: 'bg-blue-500 hover:bg-blue-600',
      refine: 'bg-purple-500 hover:bg-purple-600',
      apply: 'bg-orange-500 hover:bg-orange-600',
      practice: 'bg-red-500 hover:bg-red-600',
      session: 'bg-gray-500 hover:bg-gray-600'
    };
    return colors[sessionType] || colors.session;
  };

  const getCurrentPage = () => {
    return currentSession?.pages[currentPageIndex] || null;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <div className="text-lg font-medium">Loading Lesson {lessonNumber}...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Lesson</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={loadLessonData}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Retry
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!lessonData || !currentSession) {
    return null;
  }

  const currentPage = getCurrentPage();

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Lesson {lessonData.lessonNumber}: {lessonData.lessonTitle}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {lessonData.volumeName} • {lessonData.totalPages} pages • {lessonData.sessions.length} sessions
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
              title="Close Lesson Viewer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Session Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex space-x-2 overflow-x-auto">
          {lessonData.sessions.map((session) => (
            <button
              key={session.sessionNumber}
              onClick={() => switchToSession(session)}
              className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                currentSession.sessionNumber === session.sessionNumber
                  ? getSessionTypeColor(session.sessionType)
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {session.sessionName}
              <span className="ml-2 text-xs opacity-75">
                ({session.totalPages} pages)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Session Info */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">
              {currentSession.sessionName} 
              <span className="ml-2 text-sm font-normal text-blue-600">
                (Session {currentSession.sessionNumber})
              </span>
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              Pages {currentSession.startPage} - {currentSession.endPage} • 
              Page {currentPageIndex + 1} of {currentSession.totalPages}
            </p>
          </div>
          
          {/* Page Navigation Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPageIndex <= 0}
              className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
            >
              ← Prev
            </button>
            
            <input
              type="number"
              min={1}
              max={currentSession.totalPages}
              value={currentPageIndex + 1}
              onChange={(e) => {
                const pageNum = parseInt(e.target.value) - 1;
                if (pageNum >= 0 && pageNum < currentSession.totalPages) {
                  goToPage(pageNum);
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
            />
            
            <button
              onClick={nextPage}
              disabled={currentPageIndex >= currentSession.totalPages - 1}
              className="px-3 py-1 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors text-sm"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="max-w-full mx-auto p-6 flex gap-6">
          {/* Main Content Area - Fixed width */}
          <div className="w-2/3">
            {currentPage && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {imageError ? (
                  <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                    <div className="text-gray-500 text-lg mb-4">
                      📄 Page could not be loaded
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Page {currentPage.pageNumber} • {currentPage.filename}
                    </p>
                  <button 
                    onClick={() => setImageError(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Image
                    src={`/api/documents/${documentId}/pages/${currentPage.pageNumber}`}
                    alt={`Lesson ${lessonNumber} - ${currentSession.sessionName} - Page ${currentPage.pageNumber}`}
                    width={1275}
                    height={1632}
                    className="w-full h-auto"
                    onError={() => setImageError(true)}
                    priority={currentPageIndex < 3}
                  />
                  
                  {/* Page Info Overlay */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-md text-sm">
                    Page {currentPage.pageNumber}
                  </div>
                  
                  {/* Content Preview - Now much wider */}
                  {currentPage.textPreview && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-md text-base text-gray-700 max-h-32 overflow-y-auto">
                      <div className="font-medium mb-2 text-lg">Content Preview:</div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {currentPage.textPreview}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </div>
          
          {/* Right Sidebar: Khan Academy Videos */}
          <div className="w-1/3 min-w-[300px]">
            <KhanAcademyVideos
              documentId={documentId}
              lessonNumber={lessonNumber}
              lessonTitle={lessonData?.lessonTitle || `Lesson ${lessonNumber}`}
            />
          </div>
        </div>
        
        {/* Virtual Tutor Section - Below Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
          <div className="mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🎓</span>
              Virtual Tutor Assistant
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Get personalized help with this lesson from Mr. Somers or Gimli</p>
            
            {/* Content Preparation Status */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
                  {contentPreparationStatus.includes('✅') ? '🧠' : '⚡'}
                </div>
                <div className="text-sm text-blue-800">
                  <span className="font-medium">AI Preparation: </span>
                  {contentPreparationStatus}
                </div>
              </div>
              
              {lessonAnalysis && (
                <div className="mt-2 text-xs text-blue-600">
                  <span className="font-medium">Specialized in:</span> {lessonAnalysis.content?.mathematicalConcepts?.join(', ') || 'General Mathematics'}
                  {lessonAnalysis.content?.confidence && (
                    <span className="ml-2">• Confidence: {Math.round(lessonAnalysis.content.confidence * 100)}%</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Resize Bar - More Visible */}
          <div 
            className="group cursor-row-resize py-3 px-4 flex items-center justify-center hover:bg-blue-100 transition-colors duration-200 border-2 border-gray-200 hover:border-blue-300 bg-gray-50"
            onMouseDown={handleMouseDown}
            title={`Drag to resize tutor panel height (currently ${tutorHeight}px)`}
            style={{ 
              minHeight: '40px',
              userSelect: 'none'
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="w-12 h-1 bg-gray-400 group-hover:bg-blue-500 transition-colors duration-200 rounded-full"></div>
              <div className="text-sm text-gray-600 group-hover:text-blue-700 font-medium transition-colors duration-200">
                ↕ DRAG TO RESIZE
              </div>
              <div className="w-12 h-1 bg-gray-400 group-hover:bg-blue-500 transition-colors duration-200 rounded-full"></div>
            </div>
            <span className="ml-3 text-sm text-gray-500 group-hover:text-blue-600 transition-colors duration-200 font-medium">
              {tutorHeight}px
            </span>
          </div>
          
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            <div style={{ height: `${tutorHeight}px` }}>
              <VirtualTutorPanel
                documentId={documentId}
                lessonNumber={lessonNumber}
                lessonTitle={lessonData?.lessonTitle || `Lesson ${lessonNumber}`}
                lessonAnalysis={lessonAnalysis}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer with quick session navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Quick Navigation:</span>
            {lessonData.sessions.map((session) => (
              <button
                key={session.sessionNumber}
                onClick={() => switchToSession(session)}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  currentSession.sessionNumber === session.sessionNumber
                    ? 'bg-blue-100 text-blue-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                {session.sessionName}
              </button>
            ))}
          </div>
          <div>
            Lesson {lessonData.lessonNumber} • {lessonData.totalPages} total pages
          </div>
        </div>
      </div>
    </div>
  );
}
