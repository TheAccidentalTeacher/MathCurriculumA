'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { LessonData, LessonSession } from '../lib/lesson-service';
import KhanAcademyVideos from './KhanAcademyVideos';
import VirtualTutorPanel from './virtualtutor/VirtualTutorPanel';
import { LessonAnalysis } from '../lib/intelligent-tutor-engine';

// Transform vision analysis data to format expected by ChatInterface
function transformVisionAnalysisForTutor(visionAnalysis: any): LessonAnalysis | null {
  if (!visionAnalysis) return null;
  
  console.log(`🔄 [LessonViewer] Transforming vision analysis to tutor format:`, visionAnalysis);
  
  try {
    // Extract concepts from the analysis object
    const analysisData = visionAnalysis.analysis || {};
    const extractedContent = visionAnalysis.extractedContent || {};
    
    // Get mathematical concepts from various sources in the vision analysis
    const conceptSources = [
      analysisData.concepts || [],
      analysisData.mathematicalConcepts || [],
      extractedContent.mathematicalConcepts || [],
      visionAnalysis.content?.mathematicalConcepts || []
    ].flat().filter(Boolean);
    
    // Get key terms from various sources
    const termSources = [
      analysisData.keyTerms || [],
      analysisData.vocabularyTerms || [],
      extractedContent.vocabularyTerms || [],
      visionAnalysis.content?.vocabularyTerms || []
    ].flat().filter(Boolean);
    
    // Get learning objectives
    const objectiveSources = [
      analysisData.learningObjectives || [],
      analysisData.objectives || [],
      extractedContent.learningObjectives || [],
      visionAnalysis.content?.learningObjectives || []
    ].flat().filter(Boolean);
    
    // Determine difficulty level
    const difficultyMapping: { [key: string]: 'elementary' | 'middle' | 'high' } = {
      'beginner': 'elementary',
      'elementary': 'elementary',
      'intermediate': 'middle',
      'middle': 'middle',
      'advanced': 'high',
      'high': 'high'
    };
    
    const rawDifficulty = analysisData.difficultyLevel || extractedContent.difficultyLevel || 'middle';
    const difficulty = difficultyMapping[rawDifficulty] || 'middle';
    
    const transformed: LessonAnalysis = {
      topics: conceptSources.slice(0, 5), // Use top concepts as topics
      mathConcepts: conceptSources,
      visualizationNeeds: ['graphs', 'diagrams', 'mathematical notation'], // Default visualization needs
      difficulty,
      suggestedTools: [], // Will be populated by intelligent tutor
      keyTerms: termSources,
      objectives: objectiveSources.length > 0 ? objectiveSources : [`Understand ${visionAnalysis.title || 'lesson concepts'}`]
    };
    
    console.log(`✅ [LessonViewer] Transformed analysis:`, {
      topics: transformed.topics.length,
      mathConcepts: transformed.mathConcepts.length,
      keyTerms: transformed.keyTerms.length,
      objectives: transformed.objectives.length,
      difficulty: transformed.difficulty
    });
    
    return transformed;
  } catch (error) {
    console.error(`❌ [LessonViewer] Error transforming vision analysis:`, error);
    return null;
  }
}

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
  const [tutorHeight, setTutorHeight] = useState<number>(2000); // Default 2000px - minimum 500px
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  
  // Lesson Summary State
  const [lessonSummary, setLessonSummary] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  // Student Questions State
  const [studentQuestions, setStudentQuestions] = useState<any[]>([]);
  const [showStudentQuestions, setShowStudentQuestions] = useState(false);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Guided tutoring state
  const [guidedTutoringActive, setGuidedTutoringActive] = useState(false);
  const [guidedTutoringData, setGuidedTutoringData] = useState<any>(null);

  // Mouse drag resize handlers with useCallback to prevent recreation
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaY = e.clientY - startY;
    const newHeight = Math.max(500, startHeight + deltaY); // Minimum 500px, no maximum limit
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

  // Keyboard shortcuts for resizing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Alt + Arrow keys for resizing
      if (e.ctrlKey && e.altKey) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            setTutorHeight(prev => Math.max(500, prev - 100));
            console.log('🔧 [LessonViewer] Keyboard resize: decreased height by 100px');
            break;
          case 'ArrowDown':
            e.preventDefault();
            setTutorHeight(prev => prev + 100);
            console.log('🔧 [LessonViewer] Keyboard resize: increased height by 100px');
            break;
          case '1':
            e.preventDefault();
            setTutorHeight(800);
            console.log('🔧 [LessonViewer] Keyboard preset: set to 800px');
            break;
          case '2':
            e.preventDefault();
            setTutorHeight(1200);
            console.log('🔧 [LessonViewer] Keyboard preset: set to 1200px');
            break;
          case '3':
            e.preventDefault();
            setTutorHeight(2000);
            console.log('🔧 [LessonViewer] Keyboard preset: set to 2000px');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debug logging for tutor height changes and ensure minimum
  useEffect(() => {
    console.log(`📏 [LessonViewer] Tutor height changed to: ${tutorHeight}px`);
    // Ensure minimum height of 500px
    if (tutorHeight < 500) {
      console.log(`⚠️ [LessonViewer] Height too small (${tutorHeight}px), setting to 500px`);
      setTutorHeight(500);
    }
  }, [tutorHeight]);

  // Regenerate lesson analysis handler
  const handleRegenerateAnalysis = async () => {
    if (isRegenerating) return;
    
    setIsRegenerating(true);
    console.log(`🔄 [LessonViewer] Starting regeneration for ${documentId} - Lesson ${lessonNumber}`);
    
    try {
      const response = await fetch(`/api/lessons/${documentId}/${lessonNumber}/regenerate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ [LessonViewer] Successfully regenerated analysis`);
        
        // Update the lesson summary with the new analysis
        if (result.analysis?.lessonSummary) {
          setLessonSummary(result.analysis.lessonSummary);
          console.log(`📋 [LessonViewer] Updated lesson summary with regenerated content`);
        }
        
        // Clear existing student questions since analysis changed
        setStudentQuestions([]);
        console.log(`🗑️ [LessonViewer] Cleared cached questions due to analysis regeneration`);
        
        // Show a success message
        alert('✅ Lesson analysis regenerated successfully! Fresh AI analysis has been generated. Previous student questions cleared.');
        
      } else {
        throw new Error(result.details || 'Regeneration failed');
      }
      
    } catch (error) {
      console.error('❌ [LessonViewer] Error regenerating analysis:', error);
      alert(`❌ Error regenerating analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Generate student practice questions based on lesson summary
  const generateStudentQuestions = async () => {
    if (isGeneratingQuestions || !lessonSummary) return;
    
    setIsGeneratingQuestions(true);
    console.log(`🎯 [LessonViewer] Checking for cached student questions for ${documentId} - Lesson ${lessonNumber}`);
    
    try {
      // First, check if questions are already cached
      const getResponse = await fetch(`/api/lessons/${documentId}/${lessonNumber}/generate-questions`);
      
      if (getResponse.ok) {
        const cachedResult = await getResponse.json();
        
        if (cachedResult.success && cachedResult.questions) {
          console.log(`✅ [LessonViewer] Using ${cachedResult.questions.length} cached questions (no API cost!)`);
          setStudentQuestions(cachedResult.questions);
          
          // Show a success message
          alert(`✅ Loaded ${cachedResult.questions.length} practice questions from cache!`);
          setIsGeneratingQuestions(false);
          return; // Exit early with cached questions
        }
      }
      
      // No cached questions found, generate new ones
      console.log(`🔄 [LessonViewer] No cached questions found, generating new ones...`);
      
      const response = await fetch(`/api/lessons/${documentId}/${lessonNumber}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonSummary: lessonSummary,
          lessonTitle: lessonData?.lessonTitle || `Lesson ${lessonNumber}`,
          documentId: documentId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.questions) {
        console.log(`✅ [LessonViewer] Successfully generated ${result.questions.length} student questions`);
        setStudentQuestions(result.questions);
        
        // Show a success message
        alert(`✅ Generated ${result.questions.length} NEW practice questions (cached for future use)!`);
        
      } else {
        throw new Error(result.details || 'Question generation failed');
      }
      
    } catch (error) {
      console.error('❌ [LessonViewer] Error generating questions:', error);
      alert(`❌ Error generating questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Load lesson data and prepare content on component mount
  useEffect(() => {
    console.log(`🚀 [LessonViewer] Component mounted for ${documentId} - Lesson ${lessonNumber}`);
    loadLessonData();
    checkForCachedQuestions(); // Check for cached questions on load
  }, [documentId, lessonNumber]);

  // Function to check for cached student questions
  const checkForCachedQuestions = async () => {
    try {
      const response = await fetch(`/api/lessons/${documentId}/${lessonNumber}/generate-questions`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.questions) {
          console.log(`✅ [LessonViewer] Found ${result.questions.length} cached questions`);
          setStudentQuestions(result.questions);
        }
      } else if (response.status === 404) {
        console.log(`📝 [LessonViewer] No cached questions found - user can generate new ones`);
      }
    } catch (error) {
      console.warn('⚠️ [LessonViewer] Error checking for cached questions:', error);
    }
  };

  // Force regenerate student practice questions (bypassing cache)
  const forceRegenerateQuestions = async () => {
    if (isGeneratingQuestions || !lessonSummary) return;
    
    if (!confirm('⚠️ This will generate NEW questions and cost API credits. Are you sure?')) {
      return;
    }
    
    setIsGeneratingQuestions(true);
    console.log(`🔄 [LessonViewer] FORCE regenerating student questions for ${documentId} - Lesson ${lessonNumber}`);
    
    try {
      // Skip cache check and directly generate new questions
      const response = await fetch(`/api/lessons/${documentId}/${lessonNumber}/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonSummary: lessonSummary,
          lessonTitle: lessonData?.lessonTitle || `Lesson ${lessonNumber}`,
          documentId: documentId,
          forceRegenerate: true // Flag to indicate forced regeneration
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.questions) {
        console.log(`✅ [LessonViewer] Successfully FORCE-generated ${result.questions.length} new student questions`);
        setStudentQuestions(result.questions);
        
        // Show a success message
        alert(`✅ Force-generated ${result.questions.length} BRAND NEW practice questions!`);
        
      } else {
        throw new Error(result.details || 'Question generation failed');
      }
      
    } catch (error) {
      console.error('❌ [LessonViewer] Error force-regenerating questions:', error);
      alert(`❌ Error generating new questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Guided tutoring function to handle practice question tutoring
  const startGuidedTutoring = (question: any) => {
    console.log(`🎯 [LessonViewer] Starting guided tutoring for question:`, question);
    
    // Set up guided tutoring data with question context
    setGuidedTutoringData({
      question: question.question,
      learningObjective: question.learningObjective,
      hint: question.hint,
      difficulty: question.difficulty,
      conceptsFocused: question.conceptsFocused,
      vocabularyReinforced: question.vocabularyReinforced,
      lessonContext: {
        documentId,
        lessonNumber,
        lessonTitle: lessonData?.sessions?.[0]?.sessionName || `Lesson ${lessonNumber}`
      },
      currentStep: 0,
      totalSteps: 0, // Will be determined by the AI
      isComplete: false
    });
    
    // Activate guided tutoring mode
    setGuidedTutoringActive(true);
    
    // Show success message
    alert(`🎯 Starting step-by-step guidance for this practice question!`);
  };

  // Perform vision analysis after lesson data loads
  useEffect(() => {
    if (lessonData && !lessonAnalysis) {
      console.log(`📊 [LessonViewer] Lesson data loaded, starting vision analysis...`);
      performVisionAnalysis();
    }
  }, [lessonData, lessonAnalysis]);

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
        const transformedAnalysis = transformVisionAnalysisForTutor(checkResult.analysis);
        setLessonAnalysis(transformedAnalysis);
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
        
        // Transform standard analysis to ChatInterface format
        const transformedAnalysis = transformVisionAnalysisForTutor(prepareResult.analysis);
        setLessonAnalysis(transformedAnalysis);
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

  /**
   * COMPREHENSIVE VISION ANALYSIS using OpenAI Vision API
   * Analyzes ALL lesson pages for enhanced AI understanding
   */
  const performVisionAnalysis = async () => {
    console.log(`🔍 [LessonViewer] Starting COMPREHENSIVE VISION ANALYSIS for ${documentId}/${lessonNumber}`);
    setContentPreparationStatus('🖼️ Performing OpenAI Vision analysis...');
    
    try {
      // Check if vision analysis is already cached
      const visionCheckUrl = `/api/lessons/${documentId}/${lessonNumber}/vision-analysis`;
      console.log(`🔎 [LessonViewer] Checking for existing vision analysis: ${visionCheckUrl}`);
      
      const checkResponse = await fetch(visionCheckUrl);
      
      // Handle response based on status code
      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        
        if (checkResult.success && checkResult.type === 'vision-analysis') {
          console.log(`✅ [LessonViewer] Found cached VISION analysis!`);
          const transformedAnalysis = transformVisionAnalysisForTutor(checkResult.analysis);
          setLessonAnalysis(transformedAnalysis);
          
          // Extract and set lesson summary
          if (checkResult.analysis?.extractedContent?.comprehensiveAnalysis) {
            setLessonSummary(checkResult.analysis.extractedContent.comprehensiveAnalysis);
            console.log(`📋 [LessonViewer] Lesson summary loaded from cache`);
          }
          
          setContentPreparationStatus('🎯 Advanced Vision Analysis ready (cached)');
          return;
        }
      } else if (checkResponse.status === 404) {
        // 404 means no cached analysis available - this is expected
        const checkResult = await checkResponse.json();
        console.log(`📝 [LessonViewer] No cached vision analysis found (404): ${checkResult.message || 'No cache available'}`);
      } else {
        // Other error statuses
        console.warn(`⚠️ [LessonViewer] Unexpected response status: ${checkResponse.status}`);
      }

      // Perform new vision analysis
      console.log(`🆕 [LessonViewer] No cached vision analysis found, performing new analysis...`);
      setContentPreparationStatus('🔬 Analyzing ALL lesson pages with OpenAI Vision...');
      
      const pageCount = lessonData ? (lessonData.endPage - lessonData.startPage + 1) : 'unknown';
      setContentPreparationStatus(`🖼️ Processing ${pageCount} pages with OpenAI Vision API...`);
      
      const visionResponse = await fetch(visionCheckUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`🔧 [LessonViewer] Vision analysis response status: ${visionResponse.status}`);
      const visionResult = await visionResponse.json();
      console.log(`🎯 [LessonViewer] Vision analysis response:`, visionResult);
      
      if (visionResult.success) {
        console.log(`🎉 [LessonViewer] VISION ANALYSIS COMPLETED SUCCESSFULLY!`);
        console.log(`📊 [LessonViewer] Vision analysis summary:`, {
          pageCount: visionResult.pageCount,
          concepts: visionResult.analysis?.analysis?.concepts,
          confidence: visionResult.analysis?.extractedContent?.confidence,
          processingTime: visionResult.processingTimeMs,
          features: visionResult.features
        });
        
        // Transform vision analysis to ChatInterface format
        const transformedAnalysis = transformVisionAnalysisForTutor(visionResult.analysis);
        setLessonAnalysis(transformedAnalysis);
        
        // Extract and set lesson summary
        if (visionResult.analysis?.extractedContent?.comprehensiveAnalysis) {
          setLessonSummary(visionResult.analysis.extractedContent.comprehensiveAnalysis);
          console.log(`📋 [LessonViewer] Lesson summary extracted from new analysis`);
        }
        
        setContentPreparationStatus(`🎯 Enhanced Vision Analysis complete! (${visionResult.pageCount} pages, ${visionResult.processingTimeMs}ms)`);
      } else {
        console.error(`❌ [LessonViewer] Vision analysis failed:`, visionResult.error);
        console.log(`🔄 [LessonViewer] Falling back to standard analysis...`);
        setContentPreparationStatus('⚠️ Vision analysis failed, using standard analysis');
        // Fall back to standard analysis
        await prepareLessonContent();
      }
      
    } catch (error) {
      console.error(`💥 [LessonViewer] Vision analysis error:`, error);
      console.log(`🔄 [LessonViewer] Falling back to standard analysis...`);
      setContentPreparationStatus('⚠️ Vision analysis error, using standard analysis');
      // Fall back to standard analysis
      await prepareLessonContent();
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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Lesson {lessonData.lessonNumber}: {lessonData.lessonTitle}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {lessonData.volumeName} • {lessonData.totalPages} pages • {lessonData.sessions.length} sessions
            </p>
            {/* Content Preparation Status */}
            <div className="mt-2 text-sm">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {contentPreparationStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Vision Analysis Button */}
            <button
              onClick={performVisionAnalysis}
              disabled={contentPreparationStatus.includes('Performing') || contentPreparationStatus.includes('Processing')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                contentPreparationStatus.includes('Vision Analysis') 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : contentPreparationStatus.includes('Performing') || contentPreparationStatus.includes('Processing')
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
              title={`Perform comprehensive OpenAI Vision analysis of all ${lessonData.totalPages} lesson pages`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>
                {contentPreparationStatus.includes('Vision Analysis') ? 'Vision Complete' : 
                 contentPreparationStatus.includes('Performing') || contentPreparationStatus.includes('Processing') ? 'Analyzing...' : 
                 'AI Vision Analysis'}
              </span>
            </button>
            {/* Standard Analysis Button */}
            <button
              onClick={prepareLessonContent}
              disabled={contentPreparationStatus.includes('Performing') || contentPreparationStatus.includes('Processing')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                contentPreparationStatus.includes('ready') && !contentPreparationStatus.includes('Vision') 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : contentPreparationStatus.includes('Performing') || contentPreparationStatus.includes('Processing')
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title="Perform standard OCR-based lesson analysis"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>
                {contentPreparationStatus.includes('ready') && !contentPreparationStatus.includes('Vision') ? 'Standard Ready' : 
                 contentPreparationStatus.includes('Performing') || contentPreparationStatus.includes('Processing') ? 'Analyzing...' : 
                 'Standard Analysis'}
              </span>
            </button>
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
        
        {/* Lesson Summary Section - AI Vision Analysis Results */}
        {lessonSummary && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="w-full px-6 py-4 text-left hover:bg-purple-100 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <h3 className="text-lg font-bold text-purple-800">
                      AI Lesson Analysis Summary
                    </h3>
                    <p className="text-sm text-purple-600">
                      Comprehensive insights from OpenAI Vision analysis of all lesson pages
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRegenerateAnalysis();
                    }}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                      isRegenerating 
                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                        : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-50 hover:border-purple-400'
                    }`}
                    title="Regenerate AI analysis with fresh OpenAI Vision analysis"
                  >
                    {isRegenerating ? '🔄 Regenerating...' : '🔄 Regenerate'}
                  </div>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    AI Generated
                  </span>
                  <svg 
                    className={`w-5 h-5 text-purple-600 transition-transform ${showSummary ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {showSummary && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Overall Summary */}
                  {lessonSummary.overallSummary && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-2 flex items-center">
                        <span className="mr-2">📖</span>
                        Lesson Overview
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {lessonSummary.overallSummary}
                      </p>
                    </div>
                  )}
                  
                  {/* Key Insights */}
                  {lessonSummary.keyInsights && lessonSummary.keyInsights.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Key Mathematical Insights
                      </h4>
                      <ul className="space-y-2">
                        {lessonSummary.keyInsights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3"></span>
                            <span className="text-gray-700">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Learning Progression */}
                  {lessonSummary.learningProgression && lessonSummary.learningProgression.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🎯</span>
                        Learning Progression
                      </h4>
                      <div className="space-y-2">
                        {lessonSummary.learningProgression.map((step: string, index: number) => (
                          <div key={index} className="flex items-center">
                            <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center mr-3">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Teaching Opportunities */}
                  {lessonSummary.teachingOpportunities && lessonSummary.teachingOpportunities.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🎓</span>
                        Teaching Opportunities
                      </h4>
                      <ul className="space-y-2">
                        {lessonSummary.teachingOpportunities.map((opportunity: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2 mr-3"></span>
                            <span className="text-gray-700">{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Assessment Suggestions */}
                  {lessonSummary.assessmentSuggestions && lessonSummary.assessmentSuggestions.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">📊</span>
                        Assessment Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {lessonSummary.assessmentSuggestions.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></span>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Vocabulary Section */}
                  {lessonSummary.vocabulary && lessonSummary.vocabulary.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">📚</span>
                        Key Vocabulary
                      </h4>
                      <div className="space-y-3">
                        {lessonSummary.vocabulary.map((vocab: any, index: number) => (
                          <div key={index} className="border-l-4 border-purple-300 pl-4 bg-purple-50 p-3 rounded-r-lg">
                            <div className="font-medium text-purple-700 text-lg">{vocab.term}</div>
                            <div className="text-sm text-gray-700 mt-1 font-medium">{vocab.definition}</div>
                            {vocab.gradeLevel && (
                              <div className="text-sm text-blue-600 mt-1 bg-blue-50 p-2 rounded">
                                <strong>For Students:</strong> {vocab.gradeLevel}
                              </div>
                            )}
                            {vocab.usage && (
                              <div className="text-xs text-gray-600 mt-1 italic">
                                <strong>Usage:</strong> {vocab.usage}
                              </div>
                            )}
                            {vocab.synonyms && vocab.synonyms.length > 0 && (
                              <div className="text-xs text-green-600 mt-1">
                                <strong>Also known as:</strong> {vocab.synonyms.join(', ')}
                              </div>
                            )}
                            {vocab.visualCue && (
                              <div className="text-xs text-orange-600 mt-1 bg-orange-50 p-1 rounded">
                                <strong>Remember:</strong> {vocab.visualCue}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Student Practice Problems */}
                  {lessonSummary.studentPracticeProblems && lessonSummary.studentPracticeProblems.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                        <span className="mr-2">📝</span>
                        Student Practice Problems ({lessonSummary.studentPracticeProblems.length} Problems)
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {lessonSummary.studentPracticeProblems.map((problem: any, index: number) => (
                          <div key={index} className={`border rounded-lg p-3 ${
                            problem.difficulty === 'beginner' ? 'bg-green-50 border-green-200' :
                            problem.difficulty === 'intermediate' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-red-50 border-red-200'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">Problem #{problem.problemNumber}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                problem.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {problem.difficulty}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              <span className="font-medium">{problem.type}</span> • {problem.estimatedTimeMinutes} min
                            </div>
                            <div className="text-sm text-gray-800 mb-3">{problem.question}</div>
                            {problem.conceptsFocused && problem.conceptsFocused.length > 0 && (
                              <div className="text-xs text-gray-600 mb-2">
                                <strong>Concepts:</strong> {problem.conceptsFocused.join(', ')}
                              </div>
                            )}
                            {problem.vocabularyReinforced && problem.vocabularyReinforced.length > 0 && (
                              <div className="text-xs text-purple-600">
                                <strong>Vocabulary:</strong> {problem.vocabularyReinforced.join(', ')}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-sm text-blue-800 font-medium mb-1">Practice Problem Summary:</div>
                        <div className="text-xs text-blue-700 flex flex-wrap gap-4">
                          <span>• Beginner: {lessonSummary.studentPracticeProblems.filter((p: any) => p.difficulty === 'beginner').length} problems</span>
                          <span>• Intermediate: {lessonSummary.studentPracticeProblems.filter((p: any) => p.difficulty === 'intermediate').length} problems</span>
                          <span>• Advanced: {lessonSummary.studentPracticeProblems.filter((p: any) => p.difficulty === 'advanced').length} problems</span>
                          <span>• Total Time: {lessonSummary.studentPracticeProblems.reduce((sum: number, p: any) => sum + (p.estimatedTimeMinutes || 0), 0)} minutes</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Problem Examples */}
                  {lessonSummary.problemExamples && lessonSummary.problemExamples.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🧮</span>
                        Example Problems
                      </h4>
                      <div className="space-y-4">
                        {lessonSummary.problemExamples.map((problem: any, index: number) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="font-medium text-gray-800 mb-2">{problem.type} - {problem.difficulty}</div>
                            <div className="text-sm text-gray-700 mb-2">
                              <strong>Problem:</strong> {problem.problem}
                            </div>
                            <div className="text-sm text-gray-600">
                              <strong>Solution:</strong> {problem.solution}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Problem Generation Templates */}
                  {lessonSummary.problemGenerationTemplates && lessonSummary.problemGenerationTemplates.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🎲</span>
                        Problem Creation Templates
                      </h4>
                      <div className="space-y-3">
                        {lessonSummary.problemGenerationTemplates.map((template: any, index: number) => (
                          <div key={index} className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="text-sm text-gray-700 mb-2">{template.template}</div>
                            {template.variables && Array.isArray(template.variables) && (
                              <div className="text-xs text-green-700">
                                <strong>Variables:</strong> {template.variables.join(', ')}
                              </div>
                            )}
                            {template.scaffolding && (
                              <div className="text-xs text-green-600 mt-1">
                                <strong>Scaffolding:</strong> {template.scaffolding}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Common Misconceptions */}
                  {lessonSummary.commonMisconceptions && lessonSummary.commonMisconceptions.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">⚠️</span>
                        Common Misconceptions
                      </h4>
                      <div className="space-y-4">
                        {lessonSummary.commonMisconceptions.map((misconception: any, index: number) => (
                          <div key={index} className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <div className="font-medium text-yellow-800 mb-2">{misconception.misconception}</div>
                            <div className="text-sm text-yellow-700 mb-2">
                              <strong>Why it happens:</strong> {misconception.whyItHappens}
                            </div>
                            <div className="text-sm text-yellow-700 mb-2">
                              <strong>How to correct:</strong> {misconception.howToCorrect}
                            </div>
                            <div className="text-sm text-yellow-600">
                              <strong>Check understanding:</strong> {misconception.checkForUnderstanding}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Differentiation Strategies */}
                  {lessonSummary.differentiationStrategies && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🎯</span>
                        Differentiation Strategies
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        {lessonSummary.differentiationStrategies.strugglingStudents && (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <h5 className="font-medium text-red-800 mb-2">Struggling Students</h5>
                            <ul className="text-sm space-y-1">
                              {lessonSummary.differentiationStrategies.strugglingStudents.map((strategy: string, index: number) => (
                                <li key={index} className="text-red-700">• {strategy}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {lessonSummary.differentiationStrategies.onLevelStudents && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-800 mb-2">On-Level Students</h5>
                            <ul className="text-sm space-y-1">
                              {lessonSummary.differentiationStrategies.onLevelStudents.map((strategy: string, index: number) => (
                                <li key={index} className="text-blue-700">• {strategy}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {lessonSummary.differentiationStrategies.advancedStudents && (
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <h5 className="font-medium text-green-800 mb-2">Advanced Students</h5>
                            <ul className="text-sm space-y-1">
                              {lessonSummary.differentiationStrategies.advancedStudents.map((strategy: string, index: number) => (
                                <li key={index} className="text-green-700">• {strategy}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Real World Connections */}
                  {lessonSummary.realWorldConnections && lessonSummary.realWorldConnections.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">🌍</span>
                        Real-World Connections
                      </h4>
                      <div className="space-y-3">
                        {lessonSummary.realWorldConnections.map((connection: any, index: number) => (
                          <div key={index} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            {typeof connection === 'string' ? (
                              <div className="text-gray-700">{connection}</div>
                            ) : (
                              <>
                                <div className="font-medium text-orange-800 mb-2">{connection.context}</div>
                                <div className="text-sm text-orange-700 mb-2">{connection.explanation}</div>
                                {connection.studentActivity && (
                                  <div className="text-sm text-orange-600">
                                    <strong>Student Activity:</strong> {connection.studentActivity}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Teaching Tips */}
                  {lessonSummary.teachingTips && lessonSummary.teachingTips.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-100">
                      <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                        <span className="mr-2">💡</span>
                        Teaching Tips
                      </h4>
                      <ul className="space-y-2">
                        {lessonSummary.teachingTips.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3"></span>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Footer Info */}
                  <div className="text-xs text-purple-600 bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span>📡 Generated by OpenAI Vision API analysis of all lesson pages</span>
                      <span>⚡ Cached for instant loading</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generated Student Questions Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <button
              onClick={() => setShowStudentQuestions(!showStudentQuestions)}
              className="w-full px-6 py-4 text-left hover:bg-green-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="text-lg font-bold text-green-800">
                    Student Practice Questions
                  </h3>
                  <p className="text-sm text-green-600">
                    AI-generated practice questions based on lesson analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    generateStudentQuestions();
                  }}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors cursor-pointer ${
                    isGeneratingQuestions 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-white text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400'
                  }`}
                  title="Load questions from cache or generate new ones if needed"
                >
                  {isGeneratingQuestions ? '⚡ Loading...' : '📚 Load Questions'}
                </div>
                {studentQuestions.length > 0 && (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                    {studentQuestions.length} Questions
                  </span>
                )}
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                  AI Generated
                </span>
                <span className={`transform transition-transform ${showStudentQuestions ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
            </button>
            
            {showStudentQuestions && (
              <div className="px-6 pb-6">
                {studentQuestions.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📝</span>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                      No Practice Questions Generated Yet
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Click "Load Questions" to check for cached questions or generate new ones if needed.
                    </p>
                    <button
                      onClick={generateStudentQuestions}
                      disabled={isGeneratingQuestions || !lessonSummary}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isGeneratingQuestions || !lessonSummary
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isGeneratingQuestions ? '⚡ Loading Questions...' : '📚 Load Practice Questions'}
                    </button>
                    {!lessonSummary && (
                      <p className="text-xs text-orange-600 mt-2">
                        📋 Lesson analysis required first - expand the AI Lesson Analysis Summary above
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {studentQuestions.map((question: any, index: number) => (
                        <div key={index} className={`border rounded-lg p-4 ${
                          question.difficulty === 'beginner' ? 'bg-green-50 border-green-200' :
                          question.difficulty === 'intermediate' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-sm">Question #{question.questionNumber}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              question.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                              question.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {question.difficulty}
                            </span>
                          </div>
                          
                          <div className="text-xs text-gray-600 mb-2 flex items-center justify-between">
                            <span className="font-medium">{question.type}</span>
                            <span>{question.estimatedTimeMinutes} min</span>
                          </div>
                          
                          <div className="text-sm text-gray-800 mb-3 font-medium">
                            {question.question}
                          </div>
                          
                          {question.learningObjective && (
                            <div className="text-xs text-blue-700 mb-2 bg-blue-50 p-2 rounded">
                              <strong>Goal:</strong> {question.learningObjective}
                            </div>
                          )}
                          
                          {question.hint && (
                            <div className="text-xs text-purple-700 mb-2 bg-purple-50 p-2 rounded">
                              <strong>Hint:</strong> {question.hint}
                            </div>
                          )}
                          
                          {question.extension && (
                            <div className="text-xs text-orange-700 mb-2 bg-orange-50 p-2 rounded">
                              <strong>Challenge:</strong> {question.extension}
                            </div>
                          )}
                          
                          {question.conceptsFocused && question.conceptsFocused.length > 0 && (
                            <div className="text-xs text-gray-600 mb-2">
                              <strong>Concepts:</strong> {question.conceptsFocused.join(', ')}
                            </div>
                          )}
                          
                          {question.vocabularyReinforced && question.vocabularyReinforced.length > 0 && (
                            <div className="text-xs text-green-600 mb-3">
                              <strong>Vocabulary:</strong> {question.vocabularyReinforced.join(', ')}
                            </div>
                          )}
                          
                          {/* Get Help Button */}
                          <button
                            onClick={() => startGuidedTutoring(question)}
                            className="w-full mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <span>🎓</span>
                            <span>Get Step-by-Step Help</span>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary Stats */}
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm text-green-800 font-medium mb-1">Question Summary:</div>
                      <div className="text-xs text-green-700 flex flex-wrap gap-4">
                        <span>• Beginner: {studentQuestions.filter((q: any) => q.difficulty === 'beginner').length} questions</span>
                        <span>• Intermediate: {studentQuestions.filter((q: any) => q.difficulty === 'intermediate').length} questions</span>
                        <span>• Advanced: {studentQuestions.filter((q: any) => q.difficulty === 'advanced').length} questions</span>
                        <span>• Total Time: {studentQuestions.reduce((sum: number, q: any) => sum + (q.estimatedTimeMinutes || 0), 0)} minutes</span>
                        <span>• Total Questions: {studentQuestions.length}</span>
                      </div>
                    </div>
                    
                    {/* Regenerate Button */}
                    <div className="mt-4 text-center">
                      <button
                        onClick={forceRegenerateQuestions}
                        disabled={isGeneratingQuestions || !lessonSummary}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                          isGeneratingQuestions || !lessonSummary
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                        title="Generate completely new questions (costs API credits)"
                      >
                        {isGeneratingQuestions ? '🔄 Regenerating...' : '🔄 Force Regenerate Questions'}
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        ⚠️ Only use if you need different questions (costs API credits)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
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
                  <span className="font-medium">Specialized in:</span> {(lessonAnalysis.content?.mathematicalConcepts && Array.isArray(lessonAnalysis.content.mathematicalConcepts)) ? lessonAnalysis.content.mathematicalConcepts.join(', ') : 'General Mathematics'}
                  {lessonAnalysis.content?.confidence && (
                    <span className="ml-2">• Confidence: {Math.round(lessonAnalysis.content.confidence * 100)}%</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced Resize Handle - Modern and Intuitive */}
          <div 
            className="group cursor-row-resize py-4 px-6 flex items-center justify-center hover:bg-blue-50 transition-all duration-200 border-y-2 border-gray-200 hover:border-blue-400 bg-gray-50 hover:shadow-md"
            onMouseDown={handleMouseDown}
            title={`Drag to resize tutor panel (currently ${tutorHeight}px)\nKeyboard shortcuts: Ctrl+Alt+↑/↓ to adjust height, Ctrl+Alt+1/2/3 for presets (800px/1200px/2000px)`}
            style={{ 
              minHeight: '48px',
              userSelect: 'none'
            }}
          >
            <div className="flex flex-col items-center space-y-2">
              {/* Three horizontal resize bars for better visual indication */}
              <div className="flex space-x-1">
                <div className="w-8 h-1 bg-gray-400 group-hover:bg-blue-500 transition-colors duration-200 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-400 group-hover:bg-blue-500 transition-colors duration-200 rounded-full"></div>
                <div className="w-8 h-1 bg-gray-400 group-hover:bg-blue-500 transition-colors duration-200 rounded-full"></div>
              </div>
              <div className="text-sm text-gray-600 group-hover:text-blue-700 font-medium transition-colors duration-200 flex items-center space-x-2">
                <span>↕ DRAG TO RESIZE</span>
                <span className="text-xs bg-gray-200 group-hover:bg-blue-200 px-2 py-1 rounded-md transition-colors duration-200">
                  {tutorHeight}px
                </span>
                <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors duration-200 hidden sm:inline">
                  • Ctrl+Alt+↑↓ to adjust
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
            <div style={{ height: `${tutorHeight}px` }}>
              <VirtualTutorPanel
                documentId={documentId}
                lessonNumber={lessonNumber}
                lessonTitle={lessonData?.lessonTitle || `Lesson ${lessonNumber}`}
                lessonAnalysis={lessonAnalysis}
                lessonContent={lessonData}
                lessonSummary={lessonSummary}
                guidedTutoringActive={guidedTutoringActive}
                guidedTutoringData={guidedTutoringData}
                onGuidedTutoringComplete={() => {
                  setGuidedTutoringActive(false);
                  setGuidedTutoringData(null);
                }}
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
