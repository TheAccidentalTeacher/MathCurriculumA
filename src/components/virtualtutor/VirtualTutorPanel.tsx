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

  useEffect(() => {
    // Initialize virtual tutor for this specific lesson
    console.log(`🎓 [VirtualTutorPanel] Initializing for Lesson ${lessonNumber}: ${lessonTitle}`);
    console.log(`📊 [VirtualTutorPanel] Document ID: ${documentId}`);
    console.log(`🧠 [VirtualTutorPanel] Lesson Analysis Available:`, !!lessonAnalysis);
    console.log(`🔬 [VirtualTutorPanel] DEBUG - Full lessonAnalysis object:`, lessonAnalysis);
    
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
    } else {
      console.log(`⚠️ [VirtualTutorPanel] No lesson analysis provided - using fallback mode`);
    }
    
    setIsInitialized(true);
  }, [documentId, lessonNumber, lessonTitle, lessonAnalysis]);

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
        <div className="flex space-x-2" role="group" aria-label="Choose your virtual tutor">
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
      </div>

      {/* Compact Character Display Area */}
      <div className="flex-shrink-0" style={{ maxHeight: '120px' }}>
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
        />
      </div>

      {/* Footer with lesson context */}
      <div className="border-t border-gray-200 p-3 bg-gray-50 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          🎯 Ready to help with <span className="font-medium">{lessonTitle}</span>
        </div>
      </div>
    </div>
  );
}
