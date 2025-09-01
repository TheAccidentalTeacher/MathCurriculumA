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

  // Character configuration with animation frames
  const characterConfig = {
    somers: {
      name: 'Mr. Somers',
      primaryImage: '/animations/download-13.png',
      animations: {
        idle: ['/animations/download-13.png', '/animations/download-14.png'],
        speaking: ['/animations/download-15.png', '/animations/download-16.png', '/animations/download-17.png'],
        thinking: ['/animations/download-18.png', '/animations/download-19.png']
      },
      altText: 'Mr. Somers, your math teacher',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      greetingMessage: `Hello! I'm Mr. Somers, and I'm here to help you with ${lessonContext.lessonTitle}. What would you like to explore first?`
    },
    gimli: {
      name: 'Gimli',
      primaryImage: '/animations/Gimbers.png',
      animations: {
        idle: ['/animations/Gimbers.png'],
        speaking: ['/animations/Gimbers.png'], // Can add more Gimli frames later
        thinking: ['/animations/Gimbers.png']
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
    <div className={`p-4 ${config.bgColor} ${config.borderColor} border-b`}>
      {/* Character Image */}
      <div className="flex flex-col items-center">
        <div className={`relative w-24 h-24 mb-3 rounded-full overflow-hidden ${config.borderColor} border-2 bg-white shadow-sm`}>
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
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {character === 'somers' ? '👨‍🏫' : '🐕'}
            </div>
          )}
          
          {/* Expression indicator with animation */}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white border border-gray-300 flex items-center justify-center">
            <span className={`text-sm transition-all duration-300 ${
              currentExpression === 'speaking' ? 'animate-pulse' : ''
            }`}>
              {currentExpression === 'idle' && '😊'}
              {currentExpression === 'speaking' && '💬'}
              {currentExpression === 'thinking' && '🤔'}
            </span>
          </div>
        </div>

        {/* Character Name */}
        <h4 className="font-semibold text-gray-900 mb-2">{config.name}</h4>
        
        {/* Status/Expression */}
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white border border-gray-200">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              currentExpression === 'idle' ? 'bg-green-400' : 
              currentExpression === 'speaking' ? 'bg-blue-400' : 'bg-yellow-400'
            }`}></div>
            <span className="text-gray-700">
              {currentExpression === 'idle' && 'Ready to help'}
              {currentExpression === 'speaking' && 'Explaining...'}
              {currentExpression === 'thinking' && 'Thinking...'}
            </span>
          </div>
        </div>

        {/* Lesson Context Display */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-600 mb-1">Currently helping with:</div>
          <div className="text-sm font-medium text-gray-800 line-clamp-2">
            Lesson {lessonContext.lessonNumber}: {lessonContext.lessonTitle}
          </div>
        </div>
      </div>
    </div>
  );
}
