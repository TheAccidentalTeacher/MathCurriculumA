'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import components to avoid SSR issues
const CharacterDisplay = dynamic(() => import('@/components/virtualtutor/CharacterDisplay'), {
  loading: () => <div className="animate-pulse bg-gray-200 w-48 h-48 rounded-full"></div>,
  ssr: false
});

const ChatInterface = dynamic(() => import('@/components/virtualtutor/ChatInterface'), {
  loading: () => <div className="animate-pulse bg-gray-100 h-96 rounded-lg"></div>,
  ssr: false
});

export default function VirtualTutorPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<'somers' | 'gimli'>('somers');
  const [characterExpression, setCharacterExpression] = useState<'idle' | 'speaking' | 'thinking'>('idle');
  const searchParams = useSearchParams();
  
  // Get lesson context from URL parameters or use default for standalone mode
  const getLessonContext = () => {
    const docId = searchParams.get('docId');
    const lessonNum = searchParams.get('lessonNumber');
    const lessonTitle = searchParams.get('lessonTitle');
    
    if (docId && lessonNum && lessonTitle) {
      return {
        documentId: docId,
        lessonNumber: parseInt(lessonNum),
        lessonTitle: decodeURIComponent(lessonTitle)
      };
    }
    
    // Default standalone mode - no specific lesson
    return {
      documentId: 'standalone',
      lessonNumber: 0,
      lessonTitle: 'General Math Help'
    };
  };

  const lessonContext = getLessonContext();
  const isStandalone = lessonContext.documentId === 'standalone';

  const characterConfigs = {
    somers: {
      name: 'Mr. Somers',
      title: 'Math Teacher',
      description: 'Professional, encouraging, and knowledgeable',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    gimli: {
      name: 'Gimli',
      title: 'Math Companion',
      description: 'Friendly, adventurous, and supportive',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                ← Back to Home
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                🎓 Virtual Tutor Assistant
              </h1>
            </div>
            
            {/* Character Selector */}
            <div className="flex space-x-2">
              {Object.entries(characterConfigs).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCharacter(key as 'somers' | 'gimli')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCharacter === key
                      ? `${config.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {key === 'somers' ? '👨‍🏫' : '🐕'} {config.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Context Banner */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isStandalone 
                  ? 'bg-green-100' 
                  : 'bg-indigo-100'
              }`}>
                <span className={`font-medium ${
                  isStandalone 
                    ? 'text-green-600' 
                    : 'text-indigo-600'
                }`}>
                  {isStandalone ? '🎯' : `L${lessonContext.lessonNumber}`}
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isStandalone 
                  ? 'Ready to help with any math topic!'
                  : 'Currently helping with:'
                }
              </h2>
              <p className="text-gray-600">
                {isStandalone 
                  ? 'Ask me about any math concept, problem, or lesson you need help with.'
                  : lessonContext.lessonTitle
                }
              </p>
            </div>
          </div>
        </div>

        {/* Character and Chat Layout */}
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          {/* Character Display */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border h-full p-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {characterConfigs[selectedCharacter].name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {characterConfigs[selectedCharacter].title}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  Ready to help
                </div>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <CharacterDisplay 
                  character={selectedCharacter}
                  expression={characterExpression}
                  onExpressionChange={setCharacterExpression}
                  lessonContext={lessonContext}
                />
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500 italic">
                  {characterConfigs[selectedCharacter].description}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border h-full overflow-hidden">
              <div className="h-full">
                <ChatInterface
                  character={selectedCharacter}
                  onExpressionChange={setCharacterExpression}
                  lessonContext={lessonContext}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Minimal AI Attribution - Bottom Right Corner */}
        <div className="fixed bottom-2 right-2 z-10">
          <div className="text-xs text-gray-400 opacity-50 hover:opacity-75 transition-opacity">
            GPT
          </div>
        </div>
      </div>
    </div>
  );
}
