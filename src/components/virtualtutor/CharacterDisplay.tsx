'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CharacterDisplayProps {
  character: 'somers' | 'gimli';
  expression?: 'idle' | 'speaking' | 'thinking';
  onExpressionChange?: (expression: 'idle' | 'speaking' | 'thinking') => void;
  lessonContext: {
    documentId: string;
    lessonNumber: number;
    lessonTitle: string;
  };
}

export default function CharacterDisplay({ 
  character, 
  expression: controlledExpression,
  onExpressionChange,
  lessonContext 
}: CharacterDisplayProps) {
  const [internalExpression, setInternalExpression] = useState<'idle' | 'speaking' | 'thinking'>('idle');
  const [imageError, setImageError] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Use controlled expression if provided, otherwise use internal state
  const currentExpression = controlledExpression ?? internalExpression;

  // Character configuration with animation frames - Updated with new avatar photos
  const characterConfig = {
    somers: {
      name: 'Mr. Somers',
      primaryImage: '/animations/somers-1.png',
      animations: {
        idle: ['/animations/somers-1.png', '/animations/somers-2.png'],
        speaking: ['/animations/somers-2.png', '/animations/somers-3.png', '/animations/somers-4.png'],
        thinking: ['/animations/somers-1.png', '/animations/somers-4.png']
      },
      altText: 'Mr. Somers, your math teacher',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      greetingMessage: `Hello! I'm Mr. Somers, and I'm here to help you with ${lessonContext.lessonTitle}. What would you like to explore first?`
    },
    gimli: {
      name: 'Gimli',
      primaryImage: '/animations/gimli-1.png',
      animations: {
        idle: ['/animations/gimli-1.png', '/animations/gimli-2.png'],
        speaking: ['/animations/gimli-3.png', '/animations/gimli-4.png', '/animations/gimli-5.png'],
        thinking: ['/animations/gimli-2.png', '/animations/gimli-5.png']
      },
      altText: 'Gimli, your friendly learning companion',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      greetingMessage: `Woof! Hi there! I'm Gimli, and I'm super excited to learn ${lessonContext.lessonTitle} together! Let's have some fun with math!`
    }
  };

  const config = characterConfig[character];

  // Animation cycling effect
  useEffect(() => {
    const animationFrames = config.animations[currentExpression];
    if (animationFrames.length > 1) {
      const interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % animationFrames.length);
      }, currentExpression === 'speaking' ? 800 : 2000); // Faster for speaking

      return () => clearInterval(interval);
    } else {
      setCurrentFrame(0);
    }
  }, [currentExpression, config.animations]);

  useEffect(() => {
    // Reset expression when character changes
    if (controlledExpression === undefined) {
      setInternalExpression('idle');
    }
    setImageError(false);
    setCurrentFrame(0);
  }, [character, controlledExpression]);

  // Function to change expression (will be called from chat interface)
  const changeExpression = (expression: 'idle' | 'speaking' | 'thinking') => {
    if (controlledExpression === undefined) {
      setInternalExpression(expression);
    }
    onExpressionChange?.(expression);
    setCurrentFrame(0);
  };

  // Get current animation frame
  const getCurrentImage = () => {
    const animationFrames = config.animations[currentExpression];
    return animationFrames[currentFrame] || config.primaryImage;
  };

  const handleImageError = () => {
    const currentImage = getCurrentImage();
    console.warn(`Failed to load image for ${character}: ${currentImage}`);
    setImageError(true);
  };

  return (
    <div className={`p-2 ${config.bgColor} ${config.borderColor} border-b`}>
      {/* Compact horizontal layout */}
      <div className="flex items-center space-x-3">
        {/* Larger Character Image */}
        <div className={`relative w-12 h-12 rounded-full overflow-hidden ${config.borderColor} border-2 bg-white shadow-sm flex-shrink-0`}>
          {!imageError ? (
            <Image
              src={getCurrentImage()}
              alt={`${config.altText} - ${currentExpression}`}
              fill
              className="object-cover transition-opacity duration-300"
              onError={handleImageError}
              priority
            />
          ) : (
            // Fallback emoji display
            <div className="w-full h-full flex items-center justify-center text-2xl">
              {character === 'somers' ? '👨‍🏫' : '🐕'}
            </div>
          )}
          
          {/* Expression indicator */}
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center">
            <span className={`text-xs transition-all duration-300 ${
              currentExpression === 'speaking' ? 'animate-pulse' : ''
            }`}>
              {currentExpression === 'idle' && '😊'}
              {currentExpression === 'speaking' && '💬'}
              {currentExpression === 'thinking' && '🤔'}
            </span>
          </div>
        </div>

        {/* Character Info - Compact */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{config.name}</h4>
            <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white border border-gray-200 flex-shrink-0">
              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                currentExpression === 'idle' ? 'bg-green-400' : 
                currentExpression === 'speaking' ? 'bg-blue-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-gray-700">
                {currentExpression === 'idle' && 'Ready'}
                {currentExpression === 'speaking' && 'Helping'}
                {currentExpression === 'thinking' && 'Thinking'}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-gray-600 mt-0.5 truncate">
            Lesson {lessonContext.lessonNumber}: {lessonContext.lessonTitle}
          </div>
        </div>
      </div>
    </div>
  );
}
