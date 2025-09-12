'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Fun avatar animations CSS
const avatarStyles = `
  @keyframes wiggle {
    0%, 7% { transform: rotateZ(0deg); }
    15% { transform: rotateZ(-15deg); }
    20% { transform: rotateZ(10deg); }
    25% { transform: rotateZ(-10deg); }
    30% { transform: rotateZ(6deg); }
    35% { transform: rotateZ(-4deg); }
    40%, 100% { transform: rotateZ(0deg); }
  }
  
  @keyframes heartbeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.05); }
    28% { transform: scale(1); }
    42% { transform: scale(1.05); }
    70% { transform: scale(1); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
  }
  
  .animate-wiggle { animation: wiggle 1s ease-in-out; }
  .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-glow { animation: glow 2s ease-in-out infinite; }
  .animate-spin-once { animation: spin 0.6s ease-in-out; }
`;

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
  const [avatarAnimation, setAvatarAnimation] = useState('');
  const [clickCount, setClickCount] = useState(0);

  // Inject our custom styles
  useEffect(() => {
    if (!document.getElementById('avatar-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'avatar-styles';
      styleElement.textContent = avatarStyles;
      document.head.appendChild(styleElement);
    }
  }, []);

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

  // Animation cycling effect with fun idle animations
  useEffect(() => {
    const animationFrames = config.animations[currentExpression];
    if (animationFrames.length > 1) {
      const interval = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % animationFrames.length);
        
        // Add random fun animations when idle
        if (currentExpression === 'idle' && Math.random() < 0.3) {
          const randomAnimations = ['animate-float', 'animate-heartbeat', 'animate-wiggle'];
          const randomAnimation = randomAnimations[Math.floor(Math.random() * randomAnimations.length)];
          setAvatarAnimation(randomAnimation);
          
          // Clear animation after it finishes
          setTimeout(() => setAvatarAnimation(''), 3000);
        }
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
        <div 
          className={`relative w-40 h-40 rounded-full overflow-hidden ${config.borderColor} border-2 bg-white shadow-sm flex-shrink-0 
                     hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-pointer avatar-container
                     ${currentExpression === 'speaking' ? 'animate-pulse shadow-blue-300 animate-glow' : ''}
                     ${currentExpression === 'thinking' ? 'animate-bounce' : ''}
                     ${avatarAnimation}`}
          onClick={() => {
            setClickCount(prev => prev + 1);
            
            // Different fun effects based on click count
            const effects = ['animate-wiggle', 'animate-heartbeat', 'animate-spin-once', 'animate-glow'];
            const effect = effects[clickCount % effects.length];
            setAvatarAnimation(effect);
            
            // Fun messages on multiple clicks
            if (clickCount >= 3) {
              const funMessages = [
                'Hey, that tickles! 😄',
                'I\'m getting dizzy! 🌀',
                'Math is fun, but so is this! 🎉',
                'Ready to solve some problems? 🧮'
              ];
              console.log(funMessages[clickCount % funMessages.length]);
            }
            
            // Clear animation after it finishes
            setTimeout(() => setAvatarAnimation(''), 1000);
          }}
        >
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
            <div className="w-full h-full flex items-center justify-center text-8xl">
              {character === 'somers' ? '👨‍🏫' : '🐕'}
            </div>
          )}
          
          {/* Enhanced Expression indicator */}
          <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center shadow-lg
                          ${currentExpression === 'speaking' ? 'animate-bounce bg-blue-100 border-blue-400' : ''}
                          ${currentExpression === 'thinking' ? 'animate-pulse bg-purple-100 border-purple-400' : ''}
                          transition-all duration-300`}>
            <span className={`text-lg transition-all duration-300 ${
              currentExpression === 'speaking' ? 'animate-pulse' : ''
            } ${currentExpression === 'thinking' ? 'animate-ping' : ''}`}>
              {currentExpression === 'idle' && '😊'}
              {currentExpression === 'speaking' && '💬'}
              {currentExpression === 'thinking' && '🤔'}
            </span>
          </div>
        </div>

        {/* Character Info - Compact with Fun Enhancements */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className={`font-semibold text-gray-900 text-sm truncate hover:text-blue-600 transition-colors duration-200 cursor-default
                           ${currentExpression === 'speaking' ? 'text-blue-600' : ''}`}>
              {config.name}
            </h4>
            
            {/* Enhanced status indicator with fun emojis */}
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border flex-shrink-0 transition-all duration-300
                            ${currentExpression === 'idle' ? 'bg-green-50 border-green-200 text-green-700' : 
                              currentExpression === 'speaking' ? 'bg-blue-50 border-blue-200 text-blue-700 animate-pulse' : 
                              'bg-purple-50 border-purple-200 text-purple-700 animate-bounce'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                currentExpression === 'idle' ? 'bg-green-400' : 
                currentExpression === 'speaking' ? 'bg-blue-400' : 'bg-purple-400'
              }`}></div>
              <span>
                {currentExpression === 'idle' && '😊 Ready'}
                {currentExpression === 'speaking' && '💬 Helping'}
                {currentExpression === 'thinking' && '🤔 Thinking'}
              </span>
            </div>
          </div>
          
          <div 
            className="text-xs text-gray-600 mt-0.5 truncate cursor-help hover:text-gray-800 transition-colors"
            title={`Click the avatar for fun effects! Total clicks: ${clickCount}`}>
            📚 Lesson {lessonContext.lessonNumber}: {lessonContext.lessonTitle}
            
            {/* Click counter easter egg */}
            {clickCount > 0 && (
              <span className="ml-1 text-blue-500 font-medium">
                🎯{clickCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
