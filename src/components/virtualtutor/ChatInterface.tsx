'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  character?: 'somers' | 'gimli';
}

interface ChatInterfaceProps {
  character: 'somers' | 'gimli';
  onExpressionChange?: (expression: 'idle' | 'speaking' | 'thinking') => void;
  lessonContext: {
    documentId: string;
    lessonNumber: number;
    lessonTitle: string;
  };
}

export default function ChatInterface({ 
  character, 
  onExpressionChange, 
  lessonContext 
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Character-specific configurations
  const characterConfig = {
    somers: {
      name: 'Mr. Somers',
      color: 'blue',
      initialMessage: `Hello! I'm Mr. Somers, your math teacher. I'm here to help you understand ${lessonContext.lessonTitle}. Feel free to ask me anything about this lesson - from basic concepts to challenging problems!`,
      placeholderText: 'Ask Mr. Somers about this lesson...'
    },
    gimli: {
      name: 'Gimli',
      color: 'green',
      initialMessage: `Woof woof! Hi there! I'm Gimli, and I'm super excited to learn ${lessonContext.lessonTitle} with you! Don't worry if it seems tough - we'll figure it out together, and I'll cheer you on every step of the way! 🎾`,
      placeholderText: 'Chat with Gimli about this lesson...'
    }
  };

  const config = characterConfig[character];

  // Initialize conversation when character changes
  useEffect(() => {
    const initialMessage: ChatMessage = {
      id: `init-${character}-${Date.now()}`,
      type: 'assistant',
      content: config.initialMessage,
      timestamp: new Date(),
      character: character
    };

    setMessages([initialMessage]);
    setInputValue('');
  }, [character, config.initialMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Set character to thinking while processing
    onExpressionChange?.('thinking');

    // Simulate AI response (Phase 1 - we'll replace this with real AI in Phase 3)
    setTimeout(() => {
      // Set character to speaking while responding
      onExpressionChange?.('speaking');
      
      const responses = {
        somers: [
          "That's an excellent question! Let me break this down step by step for you.",
          "I can see why that might be confusing. Let's work through this concept together.",
          "Great thinking! Here's how we can approach this problem...",
          "That's a common question in this lesson. The key thing to remember is..."
        ],
        gimli: [
          "Woof! That's a great question! Let me help you fetch the answer! 🐕",
          "Ooh ooh! I know this one! *wags tail excitedly*",
          "Don't worry, we've got this! Let's tackle it together! 💪",
          "That's exactly the kind of curiosity I love to see! Let me explain..."
        ]
      };

      const randomResponse = responses[character][Math.floor(Math.random() * responses[character].length)];

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        content: randomResponse + ` (Note: This is a placeholder response for Phase 1. In Phase 3, I'll analyze "${lessonContext.lessonTitle}" and give you specific help!)`,
        timestamp: new Date(),
        character: character
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Return character to idle after response
      setTimeout(() => {
        onExpressionChange?.('idle');
      }, 1000);
    }, 1000 + Math.random() * 2000); // Random delay to simulate thinking
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full" role="region" aria-label={`Chat with ${config.name}`}>
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3" 
        role="log" 
        aria-live="polite" 
        aria-label="Chat messages"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            role="article"
            aria-label={`${message.type === 'user' ? 'Your' : config.name + "'s"} message`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.type === 'user'
                  ? 'bg-gray-200 text-gray-900'
                  : config.color === 'blue'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              <div className="text-sm" aria-label="Message content">{message.content}</div>
              <div className="text-xs opacity-70 mt-1" aria-label="Message time">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start" aria-live="polite" aria-label={`${config.name} is typing`}>
            <div className={`rounded-lg px-3 py-2 ${
              config.color === 'blue' ? 'bg-blue-50' : 'bg-green-50'
            }`}>
              <div className="flex space-x-1" aria-hidden="true">
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                }`} style={{ animationDelay: '0ms' }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                }`} style={{ animationDelay: '150ms' }}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${
                  config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                }`} style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="sr-only">{config.name} is typing a response</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} role="form" aria-label="Send message to virtual tutor">
          <div className="flex space-x-2 items-end">
            <div className="flex-1">
              <label htmlFor="chat-input" className="sr-only">
                Type your message to {config.name}
              </label>
              <textarea
                id="chat-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={config.placeholderText}
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                rows={Math.min(4, Math.max(2, inputValue.split('\n').length))}
                disabled={isTyping}
                aria-describedby="input-help"
                aria-invalid={false}
                maxLength={2000}
              />
              <div id="input-help" className="flex items-center justify-between mt-2 px-1">
                <span className="text-xs text-gray-500" aria-live="polite">
                  {inputValue.length > 0 && `${inputValue.length}/2000 characters`}
                </span>
                <span className="text-xs text-gray-400">
                  Press Enter to send, Shift+Enter for new line
                </span>
              </div>
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                inputValue.trim() && !isTyping
                  ? config.color === 'blue'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl focus:ring-blue-500'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl focus:ring-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300'
              }`}
              aria-label={isTyping ? `${config.name} is responding, please wait` : 'Send message'}
              title={isTyping ? 'AI is responding...' : 'Send message'}
            >
              {isTyping ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true"></div>
                  <span>...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <span>Send</span>
                  <span aria-hidden="true">📤</span>
                </div>
              )}
            </button>
          </div>
        </form>
        
        {/* Quick Actions */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setInputValue("Can you explain this lesson's main concept?")}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            disabled={isTyping}
          >
            💡 Main Concept
          </button>
          <button
            onClick={() => setInputValue("I need help with a practice problem")}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            disabled={isTyping}
          >
            🔢 Practice Problem
          </button>
          <button
            onClick={() => setInputValue("Can you give me a hint?")}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            disabled={isTyping}
          >
            💭 Hint Please
          </button>
        </div>
      </div>
    </div>
  );
}
