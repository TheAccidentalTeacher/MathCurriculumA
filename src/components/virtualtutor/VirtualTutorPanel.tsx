'use client';

import { useState, useEffect } from 'react';
import CharacterDisplay from './CharacterDisplay';
import ChatInterface from './ChatInterface';

interface VirtualTutorPanelProps {
  documentId: string;
  lessonNumber: number;
  lessonTitle: string;
  lessonAnalysis?: any; // Legacy lesson content analysis from OCR
  lessonContent?: any; // Full lesson content for intelligent analysis
}

export default function VirtualTutorPanel({ 
  documentId, 
  lessonNumber, 
  lessonTitle,
  lessonAnalysis,
  lessonContent 
}: VirtualTutorPanelProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<'somers' | 'gimli'>('somers');
  const [isInitialized, setIsInitialized] = useState(false);
  const [characterExpression, setCharacterExpression] = useState<'idle' | 'speaking' | 'thinking'>('idle');
  const [childFriendlyMode, setChildFriendlyMode] = useState(true); // Allow toggling between modes

  useEffect(() => {
    // Initialize virtual tutor for this specific lesson
    console.log(`🎓 [VirtualTutorPanel] Initializing for Lesson ${lessonNumber}: ${lessonTitle}`);
    console.log(`📊 [VirtualTutorPanel] Document ID: ${documentId}`);
    console.log(`🧠 [VirtualTutorPanel] Lesson Analysis Available:`, !!lessonAnalysis);
    console.log(`🔬 [VirtualTutorPanel] DEBUG - Full lessonAnalysis object:`, lessonAnalysis);
    console.log(`📄 [VirtualTutorPanel] DEBUG - Full lessonContent object:`, lessonContent);
    console.log(`📋 [VirtualTutorPanel] DEBUG - lessonContent type and keys:`, {
      type: typeof lessonContent,
      isNull: lessonContent === null,
      isUndefined: lessonContent === undefined,
      keys: lessonContent ? Object.keys(lessonContent) : 'N/A',
      hasContent: !!(lessonContent?.sessions || lessonContent?.content || lessonContent?.pages)
    });
    
    if (lessonAnalysis) {
      console.log(`📚 [VirtualTutorPanel] Analysis details:`, {
        rawAnalysis: lessonAnalysis,
        concepts: lessonAnalysis.content?.mathematicalConcepts,
        confidence: lessonAnalysis.content?.confidence,
        difficulty: lessonAnalysis.content?.difficultyLevel,
        formulas: lessonAnalysis.content?.keyFormulas?.length || 0,
        vocabulary: lessonAnalysis.content?.vocabularyTerms?.length || 0
      });
      
      // Convert legacy analysis to new format for intelligent tutor
      console.log(`🔄 [VirtualTutorPanel] Converting legacy analysis to intelligent format`);
    } else if (lessonContent) {
      console.log(`🚀 [VirtualTutorPanel] No legacy analysis, but lesson content available - intelligent tutor will analyze`);
    } else {
      console.log(`⚠️ [VirtualTutorPanel] No lesson analysis OR content provided - using fallback mode`);
    }
    
    setIsInitialized(true);
  }, [documentId, lessonNumber, lessonTitle, lessonAnalysis, lessonContent]);

  const handleCharacterSwitch = (character: 'somers' | 'gimli') => {
    setSelectedCharacter(character);
    console.log(`Switched to ${character === 'somers' ? 'Mr. Somers' : 'Gimli'}`);
  };

  if (!isInitialized) {
    return (
      <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading Virtual Tutor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header with character selection */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Choose Your Learning Assistant</h3>
          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Lesson {lessonNumber}
          </div>
        </div>
        
        {/* Character Selection Buttons */}
        <div className="flex space-x-2 mb-4" role="group" aria-label="Choose your virtual tutor">
          <button
            onClick={() => handleCharacterSwitch('somers')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 ${
              selectedCharacter === 'somers'
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
            }`}
            aria-label="Select Mr. Somers as your tutor"
            aria-pressed={selectedCharacter === 'somers'}
            role="button"
            tabIndex={0}
          >
            👨‍🏫 Mr. Somers
          </button>
          <button
            onClick={() => handleCharacterSwitch('gimli')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-300 ${
              selectedCharacter === 'gimli'
                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
            }`}
            aria-label="Select Gimli as your learning companion"
            aria-pressed={selectedCharacter === 'gimli'}
            role="button"
            tabIndex={0}
          >
            🐕 Gimli
          </button>
        </div>

        {/* Mode Selection Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-xl p-1 flex">
            <button
              onClick={() => setChildFriendlyMode(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                childFriendlyMode
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🧒 Kid-Friendly Mode
            </button>
            <button
              onClick={() => setChildFriendlyMode(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !childFriendlyMode
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⌨️ Expert Mode
            </button>
          </div>
        </div>
      </div>

      {/* Compact Character Display Area - Updated for larger avatars */}
      <div className="flex-shrink-0" style={{ maxHeight: '200px' }}>
        <CharacterDisplay 
          character={selectedCharacter}
          expression={characterExpression}
          onExpressionChange={setCharacterExpression}
          lessonContext={{
            documentId,
            lessonNumber,
            lessonTitle
          }}
        />
      </div>

      {/* Chat Interface */}
      <div className="flex-1 min-h-0">
        <ChatInterface 
          character={selectedCharacter}
          onExpressionChange={setCharacterExpression}
          lessonContext={{
            documentId,
            lessonNumber,
            lessonTitle,
            content: lessonContent, // Pass full content for intelligent analysis
            analysis: lessonAnalysis // Keep legacy analysis for backward compatibility
          }}
          childFriendlyMode={childFriendlyMode} // Use dynamic mode
          userAge={11} // Default to 11 years old (6th grade)
        />
      </div>

      {/* Footer with lesson context and resize handle */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 flex-shrink-0 relative">
        <div className="text-xs text-gray-500 text-center">
          🎯 Ready to help with <span className="font-medium">{lessonTitle}</span>
        </div>
        
        {/* Corner Resize Handle - Visual indicator only since parent handles the actual resizing */}
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-gray-300 hover:bg-blue-400 transition-colors duration-200 cursor-nw-resize opacity-70 hover:opacity-100" 
             style={{
               background: 'linear-gradient(-45deg, transparent 30%, #9CA3AF 30%, #9CA3AF 40%, transparent 40%, transparent 60%, #9CA3AF 60%, #9CA3AF 70%, transparent 70%)',
               borderTopLeftRadius: '4px'
             }}
             title="Use the horizontal resize bar above to resize the panel">
        </div>
      </div>
    </div>
  );
}
