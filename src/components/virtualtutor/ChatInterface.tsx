'use client';

import { useState, useRef, useEffect } from 'react';
import MathRenderer from '../MathRenderer';
import MathGrapher, { createLinearGraph, createPointGraph } from '../MathGrapher';
import PlaceValueChart, { createPowersOf10Chart } from '../PlaceValueChart';
import ScientificNotationBuilder, { createScientificNotationExample } from '../ScientificNotationBuilder';
import PowersOf10NumberLine, { createPowersOf10NumberLine } from '../PowersOf10NumberLine';
import GeoGebraWidget, { PowersOf10GeoGebra, GeometryExplorer, FunctionGrapher } from '../GeoGebraWidget';
import PowersOf10Activity from '../PowersOf10GeoGebra';
import Cube3DVisualizer from '../Cube3DVisualizer';

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
    analysis?: any; // Optional lesson content analysis
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
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Character-specific configurations
  const characterConfig = {
    somers: {
      name: 'Mr. Somers',
      color: 'blue',
      initialMessage: lessonContext.analysis 
        ? `Hello! I'm Mr. Somers, your math teacher. I've analyzed ${lessonContext.lessonTitle} and I'm ready to help you with ${lessonContext.analysis.content?.mathematicalConcepts?.slice(0, 2).join(' and ') || 'the lesson concepts'}. I can explain formulas, help with practice problems, and guide you through any challenging topics!`
        : `Hello! I'm Mr. Somers, your math teacher. I'm here to help you understand ${lessonContext.lessonTitle}. Feel free to ask me anything about this lesson - from basic concepts to challenging problems!`,
      placeholderText: 'Ask Mr. Somers about this lesson...'
    },
    gimli: {
      name: 'Gimli',
      color: 'green',
      initialMessage: lessonContext.analysis
        ? `Woof woof! Hi there! I'm Gimli, and I've been studying ${lessonContext.lessonTitle} just for you! We'll be working on ${lessonContext.analysis.content?.mathematicalConcepts?.slice(0, 2).join(' and ') || 'cool math stuff'} together. Don't worry if it seems tricky - I'll be your learning buddy every step of the way! 🎾`
        : `Woof woof! Hi there! I'm Gimli, and I'm super excited to learn ${lessonContext.lessonTitle} with you! Don't worry if it seems tough - we'll figure it out together, and I'll cheer you on every step of the way! 🎾`,
      placeholderText: 'Chat with Gimli about this lesson...'
    }
  };

  const config = characterConfig[character];

    // Initialize messages when character changes or first time only
  useEffect(() => {
    console.log(`💬 [ChatInterface] Initializing chat for character: ${character}`);
    console.log(`📖 [ChatInterface] Lesson context:`, lessonContext);
    console.log(`🧠 [ChatInterface] Analysis available:`, !!lessonContext.analysis);
    
    if (lessonContext.analysis) {
      console.log(`🎯 [ChatInterface] Using specialized content for ${character}:`, {
        concepts: lessonContext.analysis.content?.mathematicalConcepts,
        tutorPrompt: lessonContext.analysis.tutorPrompt?.substring(0, 100) + '...',
        confidence: lessonContext.analysis.content?.confidence
      });
    }
    
    const config = characterConfig[character];
    console.log(`🎭 [ChatInterface] Character config:`, {
      name: config.name,
      initialMessage: config.initialMessage.substring(0, 100) + '...'
    });
    
    const initialMessage: ChatMessage = {
      id: `${character}-welcome-${Date.now()}`,
      type: 'assistant',
      content: config.initialMessage,
      timestamp: new Date(),
    };

    console.log(`✅ [ChatInterface] Setting initial message for ${config.name}`);
    setMessages([initialMessage]);
    setInputValue('');
    setIsInitialized(true);
  }, [character]); // Only depend on character, not lessonContext

  // Update initial message when analysis becomes available (but don't reset conversation)
  useEffect(() => {
    if (isInitialized && lessonContext.analysis && messages.length === 1) {
      console.log(`🔄 [ChatInterface] Updating initial message with analysis data`);
      
      const config = characterConfig[character];
      const updatedMessage: ChatMessage = {
        id: `${character}-welcome-updated-${Date.now()}`,
        type: 'assistant',
        content: config.initialMessage,
        timestamp: new Date(),
      };
      
      setMessages([updatedMessage]);
    }
  }, [lessonContext.analysis, isInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to detect and render mathematical graphs in messages
  const renderMessageWithGraphs = (content: string) => {
    // Split content by graph markers including GeoGebra activities and 3D visualizers
    const parts = content.split(/(\[GRAPH:[^\]]+\]|\[PLACEVALUE:[^\]]+\]|\[SCIENTIFIC:[^\]]+\]|\[POWERLINE:[^\]]+\]|\[GEOGEBRA:[^\]]+\]|\[GEOMETRY:[^\]]+\]|\[POWERS10:[^\]]+\]|\[CUBE:[^\]]+\]|\[3D:[^\]]+\])/g);
    
    return parts.map((part, index) => {
      // Check for Place Value Chart instruction
      const placeValueMatch = part.match(/\[PLACEVALUE:([^\]]+)\]/);
      if (placeValueMatch) {
        const number = parseFloat(placeValueMatch[1]) || 3500;
        return (
          <div key={index} className="my-4">
            <PlaceValueChart 
              number={number}
              showPowersOf10={true}
              interactive={true}
              width={600}
              height={300}
            />
          </div>
        );
      }

      // Check for Scientific Notation Builder instruction
      const scientificMatch = part.match(/\[SCIENTIFIC:([^\]]+)\]/);
      if (scientificMatch) {
        const number = parseFloat(scientificMatch[1]) || 3500;
        return (
          <div key={index} className="my-4">
            <ScientificNotationBuilder 
              initialNumber={number}
              interactive={true}
              showSteps={true}
              width={700}
              height={400}
            />
          </div>
        );
      }

      // Check for Powers of 10 Number Line instruction
      const powerLineMatch = part.match(/\[POWERLINE:([^\]]+)\]/);
      if (powerLineMatch) {
        const number = parseFloat(powerLineMatch[1]) || 3500;
        return (
          <div key={index} className="my-4">
            <PowersOf10NumberLine 
              currentNumber={number}
              interactive={true}
              showLabels={true}
              width={800}
              height={200}
            />
          </div>
        );
      }

      // Check if this part is a graph instruction
      const graphMatch = part.match(/\[GRAPH:([^\]]+)\]/);
      if (graphMatch) {
        const graphInstruction = graphMatch[1];
        
        // Parse linear function: y = mx + b
        const linearMatch = graphInstruction.match(/y\s*=\s*([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?/);
        if (linearMatch) {
          const slope = parseFloat(linearMatch[1] || '1');
          const yIntercept = parseFloat((linearMatch[2] || '0').replace(/\s/g, ''));
          
          return (
            <div key={index} className="my-4">
              <MathGrapher 
                slope={slope}
                yIntercept={yIntercept}
                config={{ 
                  type: 'linear', 
                  title: `Graph of ${graphInstruction}`,
                  gridlines: true 
                }}
                width={400}
                height={300}
              />
            </div>
          );
        }
        
        // Parse coordinate points: points(x1,y1)(x2,y2)...
        const pointsMatch = graphInstruction.match(/points\(([^)]+)\)/g);
        if (pointsMatch) {
          const points = pointsMatch.map(pointStr => {
            const coords = pointStr.match(/\(([^,]+),([^)]+)\)/);
            if (coords) {
              return {
                x: parseFloat(coords[1]),
                y: parseFloat(coords[2]),
                label: `(${coords[1]}, ${coords[2]})`
              };
            }
            return null;
          }).filter(Boolean) as { x: number; y: number; label: string }[];
          
          return (
            <div key={index} className="my-4">
              <MathGrapher 
                points={points}
                config={{ 
                  type: 'coordinate', 
                  title: 'Coordinate Points',
                  gridlines: true 
                }}
                width={400}
                height={300}
              />
            </div>
          );
        }
        
        // If no specific pattern matches, show the instruction as text
        return <div key={index} className="text-gray-600 italic">{graphInstruction}</div>;
      }

      // Check for GeoGebra activities
      const geogebraMatch = part.match(/\[GEOGEBRA:([^\]]+)\]/);
      if (geogebraMatch) {
        const activity = geogebraMatch[1];
        const commands = activity.split(';').map(cmd => cmd.trim());
        
        return (
          <div key={index} className="my-4">
            <GeoGebraWidget 
              appName="graphing"
              commands={commands}
              width={600}
              height={400}
              showAlgebraInput={true}
              showToolBar={false}
            />
          </div>
        );
      }

      // Check for Powers of 10 GeoGebra activity
      const powers10Match = part.match(/\[POWERS10:([^\]]+)\]/);
      if (powers10Match) {
        const params = powers10Match[1].split(',');
        const activityType = (params[0] || 'place-value') as 'place-value' | 'number-line' | 'scientific-notation' | 'decomposition';
        const number = parseFloat(params[1]) || 3500;
        
        return (
          <div key={index} className="my-4">
            <PowersOf10Activity 
              activityType={activityType}
              number={number}
            />
          </div>
        );
      }

      // Check for geometry activities
      const geometryMatch = part.match(/\[GEOMETRY:([^\]]+)\]/);
      if (geometryMatch) {
        const geometryType = geometryMatch[1];
        
        return (
          <div key={index} className="my-4">
            <GeometryExplorer />
          </div>
        );
      }

      // Check for 3D cube visualizations
      const cubeMatch = part.match(/\[CUBE:([^\]]+)\]/);
      if (cubeMatch) {
        const sideLength = parseFloat(cubeMatch[1]) || 4;
        
        return (
          <div key={index} className="my-4">
            <Cube3DVisualizer 
              sideLength={sideLength}
              showVolume={true}
              showFormula={true}
              interactive={true}
            />
          </div>
        );
      }

      // Check for general 3D visualizations
      const threeDMatch = part.match(/\[3D:([^\]]+)\]/);
      if (threeDMatch) {
        const shape = threeDMatch[1].toLowerCase();
        
        if (shape.includes('cube')) {
          return (
            <div key={index} className="my-4">
              <Cube3DVisualizer 
                sideLength={4}
                showVolume={true}
                showFormula={true}
                interactive={true}
              />
            </div>
          );
        }
        
        // For other 3D shapes, use GeoGebra 3D
        return (
          <div key={index} className="my-4">
            <GeoGebraWidget 
              appName="3d"
              commands={[`${shape.charAt(0).toUpperCase() + shape.slice(1)}((0,0,0), 3)`]}
              width={600}
              height={500}
              showToolBar={true}
              showAlgebraInput={true}
            />
          </div>
        );
      }
      
      // Regular content - render with math and proper formatting
      return (
        <div key={index} className="whitespace-pre-wrap break-words">
          <MathRenderer content={part} />
        </div>
      );
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to format long AI responses
  const formatAIResponse = (content: string) => {
    // Split by sentences that end with periods followed by uppercase letters
    const sentences = content.split(/(\. [A-Z])/g);
    let formattedContent = '';
    
    for (let i = 0; i < sentences.length; i += 2) {
      if (sentences[i]) {
        // Add the sentence
        formattedContent += sentences[i];
        // Add back the period and space if there's a following part
        if (sentences[i + 1]) {
          formattedContent += sentences[i + 1];
        }
        // Add line break after every few sentences for readability
        if (i > 0 && (i / 2) % 3 === 2) {
          formattedContent += '\n\n';
        }
      }
    }
    
    return formattedContent;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    console.log(`💬 [ChatInterface] User sending message: "${inputValue.trim()}"`);
    console.log(`🎭 [ChatInterface] Current character: ${character}`);
    console.log(`📚 [ChatInterface] Lesson context:`, {
      lessonId: lessonContext.documentId + '-' + lessonContext.lessonNumber,
      hasAnalysis: !!lessonContext.analysis
    });

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

    try {
      console.log(`🤖 [ChatInterface] Sending AI request for ${character}`);
      console.log(`📡 [ChatInterface] AI API payload preview:`, {
        message: userMessage.content,
        character,
        lessonId: lessonContext.documentId + '-' + lessonContext.lessonNumber,
        hasAnalysisData: !!lessonContext.analysis,
        concepts: lessonContext.analysis?.content?.mathematicalConcepts || ['fallback'],
        extractionConfidence: lessonContext.analysis?.content?.confidence || 'none'
      });
      
      // Call our AI API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          character: character,
          lessonContext: {
            lessonId: lessonContext.documentId + '-' + lessonContext.lessonNumber,
            lessonTitle: lessonContext.lessonTitle || 'Math Lesson',
            gradeLevel: 7, // Default grade level
            unit: 'Mathematics', // Default unit
            volume: 1, // Default volume
            
            // Enhanced lesson context from OCR analysis
            ...(lessonContext.analysis && {
              extractedContent: lessonContext.analysis.content?.extractedText,
              mathematicalConcepts: lessonContext.analysis.content?.mathematicalConcepts || [],
              keyFormulas: lessonContext.analysis.content?.keyFormulas || [],
              vocabularyTerms: lessonContext.analysis.content?.vocabularyTerms || [],
              practiceProblems: lessonContext.analysis.content?.practiceProblems || [],
              difficultyLevel: lessonContext.analysis.content?.difficultyLevel,
              prerequisites: lessonContext.analysis.content?.prerequisites || [],
              tutorPrompt: lessonContext.analysis.tutorPrompt,
              suggestedQuestions: lessonContext.analysis.suggestedQuestions || [],
              teachingStrategies: lessonContext.analysis.teachingStrategies || [],
              extractionConfidence: lessonContext.analysis.content?.confidence
            }),
            
            // Fallback concepts if no analysis available
            concepts: lessonContext.analysis?.content?.mathematicalConcepts || ['problem solving', 'mathematical reasoning']
          },
          conversationHistory: messages,
          model: 'gpt-4o' // Default to GPT-4o
        })
      });

      console.log(`📡 [ChatInterface] AI API response status: ${response.status}`);
      const data = await response.json();
      console.log(`📄 [ChatInterface] AI API response data:`, data);
      
      if (data.success && data.response) {
        console.log(`✅ [ChatInterface] AI response received successfully`);
        
        // Set character to speaking while responding
        onExpressionChange?.('speaking');
        
        const assistantMessage: ChatMessage = {
          id: data.response.id || `assistant-${Date.now()}`,
          type: 'assistant',
          content: formatAIResponse(data.response.content || data.response),
          timestamp: new Date(),
          character: character
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Log AI response metrics
        if (data.metrics) {
          console.log(`📊 [ChatInterface] AI Response metrics:`);
          console.log(`   � Tokens: ${data.metrics.tokens}`);
          console.log(`   💰 Cost: ${data.metrics.costFormatted}`);
          console.log(`   🧠 Model: ${data.model}`);
        }
        
      } else {
        console.error(`❌ [ChatInterface] AI API returned error:`, data.error || 'Unknown error');
        // Handle API error with fallback
        
        const fallbackMessage: ChatMessage = {
          id: `assistant-fallback-${Date.now()}`,
          type: 'assistant',
          content: data.fallback?.content || getFallbackResponse(character, userMessage.content),
          timestamp: new Date(),
          character: character
        };

        setMessages(prev => [...prev, fallbackMessage]);
      }
      
    } catch (error) {
      console.error('❌ AI request failed:', error);
      
      // Fallback to placeholder response
      const errorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        type: 'assistant',
        content: getErrorFallbackResponse(character),
        timestamp: new Date(),
        character: character
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      
      // Return character to idle after response
      setTimeout(() => {
        onExpressionChange?.('idle');
      }, 1000);
    }
  };

  // Fallback response method
  const getFallbackResponse = (char: string, userMsg: string): string => {
    if (char === 'somers') {
      return `I can see you're asking about "${userMsg.substring(0, 50)}...". While I'm having some technical difficulties connecting to my AI systems, I encourage you to review the lesson materials and try working through the practice problems. I'll be back to help soon!`;
    } else {
      return `Woof! I'm having a little trouble with my doggy brain connection! 🐕 But I can see you're curious about "${userMsg.substring(0, 50)}...". While my tech treats are loading, maybe try pawing through the lesson examples? I'll be back wagging and ready to help soon!`;
    }
  };

  // Error fallback response
  const getErrorFallbackResponse = (char: string): string => {
    if (char === 'somers') {
      return `I apologize, but I'm experiencing some technical difficulties right now. Please try asking your question again, or refer to your lesson materials for help. I'll be back online shortly!`;
    } else {
      return `Woof! My doggy brain is having a little technical hiccup! 🐕 Try asking me again in a moment, or check out those lesson examples while I get my digital treats sorted out!`;
    }
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
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" 
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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : config.color === 'blue'
                  ? 'bg-blue-50 text-blue-900 border border-blue-200'
                  : 'bg-green-50 text-green-900 border border-green-200'
              }`}
            >
              <div className="text-sm" aria-label="Message content">
                {message.type === 'user' ? (
                  <MathRenderer content={message.content} />
                ) : (
                  renderMessageWithGraphs(message.content)
                )}
              </div>
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
                className="w-full resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
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
