'use client';

import { useState, useEffect, useCallback } from 'react';
import { CHILD_FRIENDLY_DESIGN, MATH_TOPICS } from '@/lib/child-friendly-design';

interface SessionManagerProps {
  userAge: number;
  lessonTitle: string;
  isActive: boolean;
  onSessionStart: () => void;
  onSessionEnd: () => void;
  onBreakSuggested: () => void;
}

interface SessionState {
  startTime: Date;
  totalMinutes: number;
  breakCount: number;
  offTopicCount: number;
  lastActivityTime: Date;
}

export default function SessionManager({ 
  userAge,
  lessonTitle,
  isActive,
  onSessionStart,
  onSessionEnd,
  onBreakSuggested
}: SessionManagerProps) {
  const [session, setSession] = useState<SessionState>({
    startTime: new Date(),
    totalMinutes: 0,
    breakCount: 0,
    offTopicCount: 0,
    lastActivityTime: new Date()
  });

  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);

  // Update session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSession(prev => ({
        ...prev,
        totalMinutes: Math.floor((Date.now() - prev.startTime.getTime()) / (1000 * 60))
      }));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Check for break reminders
  useEffect(() => {
    const { totalMinutes, breakCount } = session;
    const minutesSinceLastBreak = totalMinutes - (breakCount * CHILD_FRIENDLY_DESIGN.SAFETY.breakReminderMinutes);
    
    if (minutesSinceLastBreak >= CHILD_FRIENDLY_DESIGN.SAFETY.breakReminderMinutes && !showBreakReminder && !isOnBreak) {
      setShowBreakReminder(true);
      onBreakSuggested();
    }
  }, [session.totalMinutes, session.breakCount, showBreakReminder, isOnBreak, onBreakSuggested]);

  // Activity tracking
  const trackActivity = useCallback(() => {
    setSession(prev => ({
      ...prev,
      lastActivityTime: new Date()
    }));
  }, []);

  // Content safety check
  const checkContentSafety = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Check if message is math-related
    const isMathRelated = MATH_TOPICS.some(topic => 
      lowerMessage.includes(topic) || 
      lowerMessage.includes('math') ||
      lowerMessage.includes('number') ||
      lowerMessage.includes('solve') ||
      lowerMessage.includes('calculate')
    );

    // Check for inappropriate content (basic keywords)
    const inappropriateKeywords = [
      'violence', 'weapon', 'hurt', 'kill', 'death', 'sex', 'drug', 
      'alcohol', 'cigarette', 'gambling', 'hate', 'bully'
    ];
    
    const hasInappropriateContent = inappropriateKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (hasInappropriateContent) {
      // onOffTopicWarning("I can only help with math questions. Let's focus on learning!");
      return false;
    }

    if (!isMathRelated && lowerMessage.length > 20) { // Allow short greetings
      setSession(prev => ({
        ...prev,
        offTopicCount: prev.offTopicCount + 1
      }));

      if (session.offTopicCount >= CHILD_FRIENDLY_DESIGN.SAFETY.offTopicWarningCount) {
        // onOffTopicWarning("I love chatting, but I'm here to help you with math! What math question can I help you with?");
        return false;
      }
    }

    return true;
  }, [session.offTopicCount]);

  const handleTakeBreak = () => {
    setIsOnBreak(true);
    setShowBreakReminder(false);
    setSession(prev => ({
      ...prev,
      breakCount: prev.breakCount + 1
    }));

    // Auto-resume after 5 minutes
    setTimeout(() => {
      setIsOnBreak(false);
    }, 5 * 60 * 1000);
  };

  const handleContinue = () => {
    setShowBreakReminder(false);
  };

  // Break Reminder Modal
  if (showBreakReminder) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
          <div className="text-center">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Time for a Brain Break!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              You've been working hard for {session.totalMinutes} minutes. 
              Taking a short break helps your brain learn better!
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleTakeBreak}
                className="w-full py-4 px-6 bg-green-600 text-white rounded-lg text-lg font-bold hover:bg-green-700 transition-colors"
              >
                🌟 Take a 5-minute break
              </button>
              
              <button
                onClick={handleContinue}
                className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg text-lg hover:bg-gray-300 transition-colors"
              >
                Continue for a few more minutes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Break Mode
  if (isOnBreak) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-6">🌈</div>
          <h1 className="text-4xl font-bold mb-4">Break Time!</h1>
          <p className="text-xl mb-8">
            Stand up, stretch, get some water, or look out a window.
            <br />
            You'll be back to math in a few minutes!
          </p>
          
          <div className="space-y-4">
            <div className="text-lg">Break suggestions:</div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                🤸‍♀️ Stretch your arms
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                💧 Drink some water
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                👀 Look out a window
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                🧘 Take deep breaths
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setIsOnBreak(false)}
            className="mt-8 py-3 px-8 bg-white text-green-600 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors"
          >
            I'm ready to continue learning!
          </button>
        </div>
      </div>
    );
  }

  // Normal mode with session info
  return (
    <div onClick={trackActivity}>
      {/* Session Info Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              ⏱️ Session: {session.totalMinutes} min
            </span>
            {session.breakCount > 0 && (
              <span className="text-green-600">
                🌟 Breaks taken: {session.breakCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the content safety check for use in other components
export type { SessionManagerProps };
