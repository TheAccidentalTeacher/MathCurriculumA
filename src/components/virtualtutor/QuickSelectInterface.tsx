'use client';

import { useState } from 'react';
import { CHILD_FRIENDLY_DESIGN, QUICK_QUESTIONS, MATH_TOPICS } from '@/lib/child-friendly-design';

interface QuickSelectProps {
  lessonTitle: string;
  lessonNumber: number;
  onQuestionSelect: (question: string) => void;
  disabled: boolean;
  userAge: number;
  className?: string;
  lessonSpecificQuestions?: string[]; // Add lesson-specific questions
  isGeneratingQuestions?: boolean; // Add loading state
}

export default function QuickSelectInterface({ 
  lessonTitle,
  lessonNumber,
  onQuestionSelect, 
  disabled,
  userAge,
  className = '',
  lessonSpecificQuestions = [], // Add lesson-specific questions with default
  isGeneratingQuestions = false // Add loading state with default
}: QuickSelectProps) {
  const [selectedCategory, setSelectedCategory] = useState<'questions' | 'topics' | null>(null);

  const handleQuestionClick = (question: string) => {
    onQuestionSelect(question);
    setSelectedCategory(null); // Reset after selection
  };

  const buttonBaseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg transition-all duration-200
    border-2 border-solid
    cursor-pointer select-none
    transform hover:scale-105 active:scale-95
    focus:outline-none focus:ring-4 focus:ring-blue-200
  `;

  const primaryButtonClasses = `
    ${buttonBaseClasses}
    text-white bg-blue-600 border-blue-600
    hover:bg-blue-700 hover:border-blue-700
    shadow-lg hover:shadow-xl
  `;

  const secondaryButtonClasses = `
    ${buttonBaseClasses}
    text-blue-700 bg-blue-50 border-blue-200
    hover:bg-blue-100 hover:border-blue-300
  `;

  const emergencyButtonClasses = `
    ${buttonBaseClasses}
    text-white bg-red-500 border-red-500
    hover:bg-red-600 hover:border-red-600
    shadow-lg hover:shadow-xl
  `;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current lesson context */}
      {lessonTitle && (
        <div className="text-center p-4 bg-green-50 border-2 border-green-200 rounded-lg">
          <p className="text-lg font-medium text-green-800">
            📚 Today we're learning: <span className="font-bold">{lessonTitle}</span>
          </p>
        </div>
      )}

      {/* Main category selection */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 gap-4">
          <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
            How can I help you today?
          </h3>
          
          {/* Quick Questions Button */}
          <button
            onClick={() => setSelectedCategory('questions')}
            className={primaryButtonClasses}
            style={{ 
              minHeight: CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.preferredSize,
              fontSize: CHILD_FRIENDLY_DESIGN.TYPOGRAPHY.buttonText,
              padding: `${CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.spacing} 24px`
            }}
          >
            <span className="text-2xl mr-3">❓</span>
            I have a quick question
          </button>

          {/* Math Topics Button */}
          <button
            onClick={() => setSelectedCategory('topics')}
            className={secondaryButtonClasses}
            style={{ 
              minHeight: CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.preferredSize,
              fontSize: CHILD_FRIENDLY_DESIGN.TYPOGRAPHY.buttonText,
              padding: `${CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.spacing} 24px`
            }}
          >
            <span className="text-2xl mr-3">🔢</span>
            I need help with a math topic
          </button>

          {/* Emergency Help Button */}
          <button
            onClick={() => onQuestionSelect("I need help from my teacher!")}
            className={emergencyButtonClasses}
            style={{ 
              minHeight: CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.preferredSize,
              fontSize: CHILD_FRIENDLY_DESIGN.TYPOGRAPHY.buttonText,
              padding: `${CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.spacing} 24px`
            }}
          >
            <span className="text-2xl mr-3">🆘</span>
            I need help from my teacher!
          </button>
        </div>
      )}

      {/* Quick Questions Selection */}
      {selectedCategory === 'questions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">Choose your question:</h4>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              ↩️
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Show loading state while generating lesson-specific questions */}
            {isGeneratingQuestions && (
              <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                  <span className="text-blue-700 text-sm font-medium">
                    🧠 Thinking of questions you might ask about this lesson...
                  </span>
                </div>
              </div>
            )}
            
            {/* Use lesson-specific questions if available, otherwise fall back to generic ones */}
            {!isGeneratingQuestions && (lessonSpecificQuestions.length > 0 ? lessonSpecificQuestions : QUICK_QUESTIONS).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(question)}
                className={secondaryButtonClasses}
                style={{ 
                  minHeight: CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.preferredSize,
                  fontSize: CHILD_FRIENDLY_DESIGN.TYPOGRAPHY.bodyText,
                  padding: `${CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.spacing} 20px`,
                  textAlign: 'left'
                }}
              >
                <span className="text-xl mr-3">💭</span>
                {question}
              </button>
            ))}
            
            {/* Show a special indicator when we have lesson-specific questions */}
            {!isGeneratingQuestions && lessonSpecificQuestions.length > 0 && (
              <div className="text-center mt-2">
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">
                  ✨ These questions are smart and made just for this lesson!
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Math Topics Selection */}
      {selectedCategory === 'topics' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-gray-800">What math topic?</h4>
            <button 
              onClick={() => setSelectedCategory(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              ↩️
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {MATH_TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(`Can you help me with ${topic}?`)}
                className={secondaryButtonClasses}
                style={{ 
                  minHeight: CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.preferredSize,
                  fontSize: CHILD_FRIENDLY_DESIGN.TYPOGRAPHY.bodyText,
                  padding: `${CHILD_FRIENDLY_DESIGN.TOUCH_TARGETS.spacing} 16px`
                }}
              >
                <span className="text-lg mr-2">📊</span>
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement Message */}
      <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 font-medium">
          🌟 Remember: There are no silly questions! I'm here to help you learn.
        </p>
      </div>
    </div>
  );
}
