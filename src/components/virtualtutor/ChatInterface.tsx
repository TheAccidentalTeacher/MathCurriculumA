'use client';

import { useState, useRef, useEffect } from 'react';
import MathRenderer from '../MathRenderer';
import MathGrapher, { createLinearGraph, createPointGraph } from '../MathGrapher';
import PlaceValueChart, { createPowersOf10Chart } from '../PlaceValueChart';
import ScientificNotationBuilder, { createScientificNotationExample } from '../ScientificNotationBuilder';
import PowersOf10NumberLine, { createPowersOf10NumberLine } from '../PowersOf10NumberLine';
// PROFESSIONAL VISUALIZATION TOOLS (replacing GeoGebra)
import ProfessionalMathVisualizer, { createMathVisualization } from '../ProfessionalMathVisualizer';
import PlotlyGrapher, { LinearFunctionGrapher, QuadraticFunctionGrapher } from '../PlotlyGrapher';
import ThreeGeometryVisualizer, { CubeExplorer, SphereExplorer, CylinderExplorer } from '../ThreeGeometryVisualizer';
// DISABLED: GeoGebra integration removed by user request
// import GeoGebraWidget, { GeometryExplorer } from '../GeoGebraWidget';
// import PowersOf10Activity from '../PowersOf10GeoGebra';
// import GeometryVisualizer, { TriangleExplorer, CircleExplorer, CubeExplorer, SphereExplorer, CylinderExplorer } from '../GeometryVisualizer';
// import SmartGeoGebraFrame from '../SmartGeoGebraFrame';
import { intelligentTutor, type LessonAnalysis } from '@/lib/intelligent-tutor-engine';

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
    content?: any; // Full lesson content for analysis
    analysis?: LessonAnalysis; // Optional pre-analyzed lesson content
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
  const [lessonAnalysis, setLessonAnalysis] = useState<LessonAnalysis | null>(lessonContext.analysis || null);
  const [isAnalyzingLesson, setIsAnalyzingLesson] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Analyze lesson content when it loads
  useEffect(() => {
    const analyzeLessonContent = async () => {
      if (lessonAnalysis || !lessonContext.content || isAnalyzingLesson) return;
      
      setIsAnalyzingLesson(true);
      console.log(`🔍 [ChatInterface] Analyzing lesson content for: ${lessonContext.lessonTitle}`);
      
      try {
        const analysis = await intelligentTutor.analyzeLessonContent(lessonContext.content);
        setLessonAnalysis(analysis);
        console.log(`✅ [ChatInterface] Lesson analysis complete:`, analysis);
      } catch (error) {
        console.error('❌ [ChatInterface] Lesson analysis failed:', error);
        // Create fallback analysis
        setLessonAnalysis({
          topics: ['general math'],
          mathConcepts: [lessonContext.lessonTitle],
          visualizationNeeds: ['basic diagrams'],
          difficulty: 'middle',
          suggestedTools: intelligentTutor.getAvailableTools().slice(0, 3),
          keyTerms: [],
          objectives: [`Understand ${lessonContext.lessonTitle}`]
        });
      } finally {
        setIsAnalyzingLesson(false);
      }
    };

    analyzeLessonContent();
  }, [lessonContext.content, lessonAnalysis, isAnalyzingLesson]);

  // Character-specific configurations (updated with intelligent analysis)
  const characterConfig = {
    somers: {
      name: 'Mr. Somers',
      color: 'blue',
      initialMessage: lessonAnalysis 
        ? `Hello! I'm Mr. Somers, your math teacher. I've analyzed "${lessonContext.lessonTitle}" and I'm ready to help you with ${(lessonAnalysis.mathConcepts || []).slice(0, 2).join(' and ')}. Based on my analysis, we'll be working on ${(lessonAnalysis.topics || []).join(', ')} concepts. I have ${(lessonAnalysis.suggestedTools || []).length} interactive tools ready to help visualize and understand these topics!`
        : `Hello! I'm Mr. Somers, your math teacher. I'm here to help you understand "${lessonContext.lessonTitle}". ${isAnalyzingLesson ? 'I\'m currently analyzing the lesson content to provide you with the best possible help...' : 'Feel free to ask me anything about this lesson!'}`,
      placeholderText: 'Ask Mr. Somers about this lesson...'
    },
    gimli: {
      name: 'Gimli',
      color: 'green',
      initialMessage: lessonAnalysis
        ? `Woof woof! Hi there! I'm Gimli, and I've been studying "${lessonContext.lessonTitle}" just for you! We're going to explore ${(lessonAnalysis.topics || []).slice(0, 2).join(' and ')}, and I've got ${(lessonAnalysis.suggestedTools || []).length} cool interactive tools to make learning fun! ${lessonAnalysis.difficulty === 'elementary' ? 'This looks like fun stuff!' : lessonAnalysis.difficulty === 'middle' ? 'This is perfect for us to tackle together!' : 'This might be challenging, but we\'ve got this!'} 🎾`
        : `Woof woof! Hi there! I'm Gimli, and I'm super excited to learn "${lessonContext.lessonTitle}" with you! ${isAnalyzingLesson ? 'I\'m sniffing around the lesson content to understand it better...' : 'Don\'t worry if it seems tough - we\'ll figure it out together!'} 🎾`,
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
        concepts: lessonContext.analysis.mathConcepts,
        topics: lessonContext.analysis.topics,
        tools: lessonContext.analysis.suggestedTools,
        difficulty: lessonContext.analysis.difficulty
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

  // Function to detect and render mathematical content in messages
  const renderMessageWithGraphs = (content: string) => {
    // 🐛 DEBUG: Log the full content to analyze
    console.log('📝 Processing message content:', {
      content,
      hasShapePattern: /\[SHAPE:[^\]]+\]/.test(content),
      allPatterns: content.match(/\[[A-Z]+:[^\]]+\]/g) || []
    });
    
    // Split content by markers - GeoGebra features are disabled but patterns preserved for user feedback
    const parts = content.split(/(\[GRAPH:[^\]]+\]|\[PLACEVALUE:[^\]]+\]|\[SCIENTIFIC:[^\]]+\]|\[POWERLINE:[^\]]+\]|\[GEOGEBRA:[^\]]+\]|\[GEOMETRY:[^\]]+\]|\[SHAPE:[^\]]+\]|\[POWERS10:[^\]]+\]|\[CUBE:[^\]]+\]|\[3D:[^\]]+\])/g);
    
    console.log('🔪 Content split into parts:', parts);
    
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

      // PROFESSIONAL: Interactive function graphing with Plotly.js
      const plotlyGraphMatch = part.match(/\[GRAPH:([^\]]+)\]/);
      if (plotlyGraphMatch) {
        let functions = plotlyGraphMatch[1].split(',').map(f => f.trim());
        
        // Clean up function expressions - remove "y =" and "f(x) =" prefixes
        functions = functions.map(func => {
          return func
            .replace(/^y\s*=\s*/, '')      // Remove "y = " prefix
            .replace(/^f\(x\)\s*=\s*/, '') // Remove "f(x) = " prefix
            .trim();
        });
        
        return (
          <div key={index} className="my-4">
            <PlotlyGrapher
              functions={functions}
              title="Interactive Function Graph"
              width={700}
              height={450}
              interactive={true}
              showGrid={true}
              xRange={[-10, 10]}
              yRange={[-10, 10]}
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

      // DISABLED: GeoGebra activities removed by user request
      // const geogebraMatch = part.match(/\[GEOGEBRA:([^\]]+)\]/);
      // if (geogebraMatch) {
      //   const activity = geogebraMatch[1];
      //   const commands = activity.split(';').map(cmd => cmd.trim());
      //   
      //   return (
      //     <div key={index} className="my-4">
      //       <GeoGebraWidget 
      //         appName="graphing"
      //         commands={commands}
      //         width={600}
      //         height={400}
      //         showAlgebraInput={true}
      //         showToolBar={false}
      //       />
      //     </div>
      //   );
      // }

      // GeoGebra features have been disabled
      // PROFESSIONAL: Function and general graphing with Plotly.js (replacing GEOGEBRA)
      const geogebraMatch = part.match(/\[GEOGEBRA:([^\]]+)\]/);
      if (geogebraMatch) {
        const content = geogebraMatch[1];
        const visualization = createMathVisualization(content);
        
        return (
          <div key={index} className="my-4">
            <ProfessionalMathVisualizer
              type={visualization.type}
              content={visualization.content}
              config={visualization.config}
            />
          </div>
        );
      }

      // DISABLED: Powers of 10 GeoGebra activity removed by user request
      const powers10Match = part.match(/\[POWERS10:([^\]]+)\]/);
      if (powers10Match) {
        return (
          <div key={index} className="my-4 p-4 bg-gray-100 border rounded">
            <p className="text-gray-600">Powers of 10 GeoGebra visualization disabled</p>
          </div>
        );
      }

      // PROFESSIONAL: 3D geometry with Three.js (replacing SMART_3D)
      const smart3DMatch = part.match(/\[SMART_3D:([^,]+),?([^\]]*)\]/);
      if (smart3DMatch) {
        const shape = smart3DMatch[1].toLowerCase().trim();
        const dimensionStr = smart3DMatch[2] || '';
        
        // 🐛 DEBUG: Log SMART_3D pattern detection
        console.log('🎲 SMART_3D Pattern Detected:', {
          fullMatch: smart3DMatch[0],
          shape,
          dimensionStr,
          originalPart: part
        });
        
        // Parse dimensions if provided
        let dimensions = { width: 2, height: 2, depth: 2, radius: 1 };
        if (dimensionStr) {
          const dimMatch = dimensionStr.match(/(\d+\.?\d*)/g);
          console.log('🔢 SMART_3D Parameter parsing:', {
            dimensionStr,
            extractedNumbers: dimMatch
          });
          
          if (dimMatch) {
            if (shape === 'sphere') {
              dimensions.radius = parseFloat(dimMatch[0]) || 1;
              console.log('⚽ SMART_3D Sphere dimensions set:', dimensions);
            } else if (shape === 'cylinder') {
              dimensions.radius = parseFloat(dimMatch[0]) || 1;
              dimensions.height = parseFloat(dimMatch[1]) || 2;
              console.log('🛢️ SMART_3D Cylinder dimensions set:', dimensions);
            } else if (shape === 'cube') {
              // 🧊 CUBE FIX: For cubes, use the same dimension for all sides
              const sideLength = parseFloat(dimMatch[0]) || 2;
              dimensions.width = sideLength;
              dimensions.height = sideLength;
              dimensions.depth = sideLength;
              console.log('🧊 SMART_3D Cube dimensions set (equal sides):', dimensions);
            } else {
              dimensions.width = parseFloat(dimMatch[0]) || 2;
              dimensions.height = parseFloat(dimMatch[1]) || 2;
              dimensions.depth = parseFloat(dimMatch[2]) || 2;
              console.log('📦 SMART_3D Generic box dimensions set:', dimensions);
            }
          }
        }

        console.log('🎯 SMART_3D Sending to ThreeGeometryVisualizer:', {
          shape,
          dimensions,
          showMeasurements: true,
          showAxes: true,
          interactive: true,
          animation: "none",  // 🛑 Stop spinning for educational clarity
          color: "#93c5fd"    // 🎨 Light blue for better grid contrast
        });

        return (
          <div key={index} className="my-4">
            <ThreeGeometryVisualizer
              shape={shape as any}
              dimensions={dimensions}
              showMeasurements={true}
              showAxes={true}
              interactive={true}
              animation="none"
              color="#93c5fd"
            />
          </div>
        );
      }

      // PROFESSIONAL: Geometry visualization with smart tool selection (replacing GEOMETRY)
      const geometryMatch = part.match(/\[GEOMETRY:([^\]]+)\]/);
      if (geometryMatch) {
        const content = geometryMatch[1];
        const visualization = createMathVisualization(content);
        
        return (
          <div key={index} className="my-4">
            <ProfessionalMathVisualizer
              type={visualization.type}
              content={visualization.content}
              config={visualization.config}
            />
          </div>
        );
      }

      // PROFESSIONAL: Shape visualization with Three.js (replacing SHAPE)
      const shapeMatch = part.match(/\[SHAPE:([^,\]]+),?([^\]]*)\]/);
      if (shapeMatch) {
        const shapeName = shapeMatch[1].toLowerCase().trim();
        const parameters = shapeMatch[2] || '';
        
        // 🐛 DEBUG: Log the matched pattern
        console.log('🎲 SHAPE Pattern Detected:', {
          fullMatch: shapeMatch[0],
          shapeName,
          parameters,
          originalPart: part
        });
        
        let dimensions = { width: 2, height: 2, depth: 2, radius: 1 };
        if (parameters) {
          const paramMatch = parameters.match(/(\d+\.?\d*)/g);
          console.log('🔢 Parameter parsing:', {
            parametersString: parameters,
            extractedNumbers: paramMatch
          });
          
          if (paramMatch) {
            if (shapeName.includes('sphere') || shapeName.includes('ball')) {
              dimensions.radius = parseFloat(paramMatch[0]) || 1;
              console.log('⚽ Sphere dimensions set:', dimensions);
            } else if (shapeName.includes('cylinder')) {
              dimensions.radius = parseFloat(paramMatch[0]) || 1;
              dimensions.height = parseFloat(paramMatch[1]) || 2;
              console.log('🛢️ Cylinder dimensions set:', dimensions);
            } else if (shapeName.includes('cube')) {
              // For cubes, use the same dimension for all sides
              const sideLength = parseFloat(paramMatch[0]) || 2;
              dimensions.width = sideLength;
              dimensions.height = sideLength;
              dimensions.depth = sideLength;
              console.log('🧊 Cube dimensions set (equal sides):', dimensions);
            } else {
              dimensions.width = parseFloat(paramMatch[0]) || 2;
              dimensions.height = parseFloat(paramMatch[1]) || 2;
              dimensions.depth = parseFloat(paramMatch[2]) || 2;
              console.log('📦 Generic box dimensions set:', dimensions);
            }
          }
        }

        // Map shape names to our supported shapes
        let mappedShape = 'cube';
        if (shapeName.includes('sphere') || shapeName.includes('ball')) mappedShape = 'sphere';
        else if (shapeName.includes('cylinder')) mappedShape = 'cylinder';
        else if (shapeName.includes('cone')) mappedShape = 'cone';
        else if (shapeName.includes('cube') || shapeName.includes('box')) mappedShape = 'cube';

        console.log('🎯 Shape mapping result:', {
          originalShapeName: shapeName,
          mappedShape,
          finalDimensions: dimensions
        });

        return (
          <div key={index} className="my-4">
            <ThreeGeometryVisualizer
              shape={mappedShape as any}
              dimensions={dimensions}
              showMeasurements={true}
              showAxes={true}
              interactive={true}
              color="#4f46e5"
            />
          </div>
        );
      }

      // DISABLED: 3D cube visualizations removed by user request (was GeoGebra-based)
      const cubeMatch = part.match(/\[CUBE:([^\]]+)\]/);
      if (cubeMatch) {
        return (
          <div key={index} className="my-4 p-4 bg-gray-100 border rounded">
            <p className="text-gray-600">Cube visualization disabled</p>
          </div>
        );
      }

      // DISABLED: General 3D visualizations removed by user request (was GeoGebra-based)
      const threeDMatch = part.match(/\[3D:([^\]]+)\]/);
      if (threeDMatch) {
        const shape = threeDMatch[1].toLowerCase();
        return (
          <div key={index} className="my-4 p-4 bg-gray-100 border rounded">
            <p className="text-gray-600">3D visualization disabled: {shape}</p>
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
      hasAnalysis: !!lessonAnalysis
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
      // Use intelligent tutor engine for smarter responses
      if (lessonAnalysis) {
        console.log(`🧠 [ChatInterface] Using intelligent tutor engine`);
        
        // Analyze user query to determine intent and tools needed
        const queryAnalysis = await intelligentTutor.analyzeUserQuery(
          userMessage.content, 
          lessonAnalysis
        );
        
        console.log(`🔍 [ChatInterface] Query analysis:`, queryAnalysis);
        
        // Generate smart response using GPT-4o
        const aiResponse = await intelligentTutor.generateResponse(
          queryAnalysis,
          lessonAnalysis,
          character
        );
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
          character: character
        };

        setMessages(prev => [...prev, assistantMessage]);
        console.log(`✅ [ChatInterface] Intelligent response generated`);
      } else {
        // Fallback to original API if no analysis available
        console.log(`🤖 [ChatInterface] Using fallback API (no lesson analysis)`);
        
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
              gradeLevel: 7,
              unit: 'Mathematics',
              volume: 1
            }
          })
        });

        if (!response.ok) {
          throw new Error(`AI API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage: ChatMessage = {
          id: data.response?.id || `assistant-${Date.now()}`,
          type: 'assistant',
          content: data.response?.content || data.message || "I'm having trouble right now. Could you try rephrasing your question?",
          timestamp: new Date(),
          character: character
        };

        setMessages(prev => [...prev, assistantMessage]);
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
