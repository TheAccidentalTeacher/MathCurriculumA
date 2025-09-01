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
  lessonContext: {
    documentId: string;
    lessonNumber: number;
    lessonTitle: string;
  };
}

export default function ChatInterface({ character, lessonContext }: ChatInterfaceProps) {
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

    // Simulate AI response (Phase 1 - we'll replace this with real AI in Phase 3)
    setTimeout(() => {
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
    }, 1000 + Math.random() * 2000); // Random delay to simulate thinking
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
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
              <div className="text-sm">{message.content}</div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`rounded-lg px-3 py-2 ${
              config.color === 'blue' ? 'bg-blue-50' : 'bg-green-50'
            }`}>
              <div className="flex space-x-1">
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
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={config.placeholderText}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputValue.trim() && !isTyping
                ? config.color === 'blue'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            {isTyping ? '...' : 'Send'}
          </button>
        </div>
        
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
