'use client';

import { useState, useEffect } from 'react';
import CharacterDisplay from './CharacterDisplay';
import ChatInterface from './ChatInterface';

interface VirtualTutorPanelProps {
  documentId: string;
  lessonNumber: number;
  lessonTitle: string;
}

export default function VirtualTutorPanel({ 
  documentId, 
  lessonNumber, 
  lessonTitle 
}: VirtualTutorPanelProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<'somers' | 'gimli'>('somers');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize virtual tutor for this specific lesson
    console.log(`Virtual Tutor initialized for Lesson ${lessonNumber}: ${lessonTitle}`);
    setIsInitialized(true);
  }, [documentId, lessonNumber, lessonTitle]);

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
    <div className="h-full bg-white rounded-lg border border-gray-200 flex flex-col relative z-10 shadow-sm">
      {/* Header with character selection */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Virtual Tutor</h3>
          <div className="text-xs text-gray-500">
            Lesson {lessonNumber}
          </div>
        </div>
        
        {/* Character Selection Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => handleCharacterSwitch('somers')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCharacter === 'somers'
                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
            }`}
            aria-label="Select Mr. Somers as your tutor"
          >
            👨‍🏫 Mr. Somers
          </button>
          <button
            onClick={() => handleCharacterSwitch('gimli')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCharacter === 'gimli'
                ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200'
            }`}
            aria-label="Select Gimli as your learning companion"
          >
            🐕 Gimli
          </button>
        </div>
      </div>

      {/* Character Display Area */}
      <div className="flex-shrink-0">
        <CharacterDisplay 
          character={selectedCharacter}
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
          lessonContext={{
            documentId,
            lessonNumber,
            lessonTitle
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
