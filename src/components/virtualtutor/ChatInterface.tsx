'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import MathRenderer from '../MathRenderer';
import MathGrapher, { createLinearGraph, createPointGraph } from '../MathGrapher';
import PlaceValueChart, { createPowersOf10Chart } from '../PlaceValueChart';
import ScientificNotationBuilder, { createScientificNotationExample } from '../ScientificNotationBuilder';
import PowersOf10NumberLine, { createPowersOf10NumberLine } from '../PowersOf10NumberLine';
import NumberLineVisualizer from '../math-tools/NumberLineVisualizer';
import VisualizationContainer, { MultiVisualizationContainer } from './VisualizationContainer';
// PROFESSIONAL VISUALIZATION TOOLS (replacing GeoGebra)
import ProfessionalMathVisualizer, { createMathVisualization } from '../ProfessionalMathVisualizer';
import PlotlyGrapher, { LinearFunctionGrapher, QuadraticFunctionGrapher } from '../PlotlyGrapher';
import ThreeGeometryVisualizer, { CubeExplorer, SphereExplorer, CylinderExplorer } from '../ThreeGeometryVisualizer';
import TransformationVisualizer, { ReflectionExplorer, RotationExplorer, TranslationExplorer } from '../TransformationVisualizer';
// ENHANCED: Desmos integration for reliable math visualization
import DesmosCalculator, { QuickGraph, parseMathExpression } from '../DesmosCalculator';
// DISABLED: GeoGebra integration removed by user request
// import GeoGebraWidget, { GeometryExplorer } from '../GeoGebraWidget';
// import PowersOf10Activity from '../PowersOf10GeoGebra';
// import GeometryVisualizer, { TriangleExplorer, CircleExplorer, CubeExplorer, SphereExplorer, CylinderExplorer } from '../GeometryVisualizer';
// import SmartGeoGebraFrame from '../SmartGeoGebraFrame';
import { intelligentTutor, type LessonAnalysis } from '@/lib/intelligent-tutor-engine';
// CHILD-FRIENDLY COMPONENTS
import QuickSelectInterface from './QuickSelectInterface';
import SessionManager from './SessionManager';
import { CHILD_FRIENDLY_DESIGN } from '@/lib/child-friendly-design';

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
    summary?: any; // Comprehensive AI-generated lesson summary with vocabulary, examples, etc.
  };
  // CHILD-FRIENDLY OPTIONS
  childFriendlyMode?: boolean; // Enable child-friendly interface
  userAge?: number; // User age for safety and interface customization
  // GUIDED TUTORING OPTIONS
  guidedTutoringActive?: boolean; // Whether guided tutoring mode is active
  guidedTutoringData?: any; // Data about the current guided tutoring session
  onGuidedTutoringComplete?: () => void; // Callback when guided tutoring is complete
}

export default function ChatInterface({ 
  character, 
  onExpressionChange, 
  lessonContext,
  childFriendlyMode = false,
  userAge = 11,
  guidedTutoringActive = false,
  guidedTutoringData = null,
  onGuidedTutoringComplete
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lessonAnalysis, setLessonAnalysis] = useState<LessonAnalysis | null>(lessonContext.analysis || null);
  const [isAnalyzingLesson, setIsAnalyzingLesson] = useState(false);
  // CHILD-FRIENDLY STATE
  const [sessionActive, setSessionActive] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(childFriendlyMode);
  const [isExpanded, setIsExpanded] = useState(false); // New state for expandable chat
  const [lessonSpecificQuestions, setLessonSpecificQuestions] = useState<string[]>([]); // Kid-friendly questions
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  // GUIDED TUTORING STATE
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [guidedSteps, setGuidedSteps] = useState<string[]>([]);
  const [isGeneratingStep, setIsGeneratingStep] = useState(false);
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
      avatar: '/animations/somers-1.png',
      initialMessage: lessonContext.summary
        ? `Hello! I'm Mr. Somers, your math teacher. I've thoroughly analyzed "${lessonContext.lessonTitle}" and I'm fully connected to this lesson! 📚 I have access to ${(lessonContext.summary.vocabulary || []).length} key vocabulary terms, ${(lessonContext.summary.problemExamples || []).length} problem examples, and comprehensive teaching strategies. ${lessonContext.summary.overallSummary ? `Here's what we're covering: ${lessonContext.summary.overallSummary.slice(0, 150)}...` : ''} I'm ready to help you understand every concept!`
        : lessonAnalysis 
        ? `Hello! I'm Mr. Somers, your math teacher. I've analyzed "${lessonContext.lessonTitle}" and I'm ready to help you with ${(lessonAnalysis.mathConcepts || []).slice(0, 2).join(' and ')}. Based on my analysis, we'll be working on ${(lessonAnalysis.topics || []).join(', ')} concepts. I have ${(lessonAnalysis.suggestedTools || []).length} interactive tools ready to help visualize and understand these topics!`
        : `Hello! I'm Mr. Somers, your math teacher. I'm here to help you understand "${lessonContext.lessonTitle}". ${isAnalyzingLesson ? 'I\'m currently analyzing the lesson content to provide you with the best possible help...' : 'Feel free to ask me anything about this lesson!'}`,
      placeholderText: 'Ask Mr. Somers about this lesson...'
    },
    gimli: {
      name: 'Gimli',
      color: 'green',
      avatar: '/animations/gimli-1.png',
      initialMessage: lessonContext.summary
        ? `Woof woof! Hi there! I'm Gimli, and I'm super connected to "${lessonContext.lessonTitle}"! 🎾 I've studied all the vocabulary words (${(lessonContext.summary.vocabulary || []).length} of them!), looked at the problem examples, and I even know about the real-world connections! ${lessonContext.summary.realWorldConnections && lessonContext.summary.realWorldConnections.length > 0 ? `Like how this math connects to ${lessonContext.summary.realWorldConnections[0].context || 'real life'}!` : ''} Let's explore this lesson together!`
        : lessonAnalysis
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
    console.log(`📋 [ChatInterface] Summary available:`, !!lessonContext.summary);
    
    if (lessonContext.summary) {
      console.log(`🎯 [ChatInterface] Using comprehensive lesson summary for ${character}:`, {
        vocabularyCount: (lessonContext.summary.vocabulary || []).length,
        problemExamplesCount: (lessonContext.summary.problemExamples || []).length,
        realWorldConnections: (lessonContext.summary.realWorldConnections || []).length,
        hasOverallSummary: !!lessonContext.summary.overallSummary
      });
    }
    
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

  // Generate lesson-specific questions when summary becomes available
  useEffect(() => {
    const generateKidQuestions = async () => {
      if (!lessonContext.summary || isGeneratingQuestions || lessonSpecificQuestions.length > 0) {
        return; // Don't generate if already generated or in progress
      }

      console.log(`🧒 [ChatInterface] Generating kid-friendly questions for: ${lessonContext.lessonTitle}`);
      setIsGeneratingQuestions(true);

      try {
        const response = await fetch(`/api/lessons/${lessonContext.documentId}/${lessonContext.lessonNumber}/kid-friendly-questions`);
        if (response.ok) {
          const data = await response.json();
          const questions = data.questions || [];
          console.log(`✅ [ChatInterface] Generated ${questions.length} kid-friendly questions:`, questions);
          setLessonSpecificQuestions(questions);
        } else {
          console.error('❌ [ChatInterface] Failed to generate questions:', response.status);
        }
      } catch (error) {
        console.error('❌ [ChatInterface] Error generating kid-friendly questions:', error);
        // Keep empty array to use fallback questions
      } finally {
        setIsGeneratingQuestions(false);
      }
    };

    if (lessonContext.summary) {
      generateKidQuestions();
    }
  }, [lessonContext.summary, lessonSpecificQuestions.length, isGeneratingQuestions]);

  // Initialize guided tutoring when activated
  useEffect(() => {
    const initializeGuidedTutoring = async () => {
      if (!guidedTutoringActive || !guidedTutoringData || guidedSteps.length > 0) {
        return; // Don't initialize if already initialized or not active
      }

      console.log(`🎯 [ChatInterface] Initializing guided tutoring for:`, guidedTutoringData);
      
      // Clear existing messages and start fresh
      setMessages([]);
      
      // Add initial guided tutoring message
      const initialMessage: ChatMessage = {
        id: `guided-init-${Date.now()}`,
        type: 'assistant',
        content: `🎯 **Step-by-Step Help Mode Activated!**\n\nI'll help you work through this practice question step by step. Let's start!\n\n**Question:** ${guidedTutoringData.question}\n\n**Learning Goal:** ${guidedTutoringData.learningObjective}\n\nAre you ready to begin? I'll guide you through each step one at a time! 🚀`,
        timestamp: new Date(),
        character
      };
      
      setMessages([initialMessage]);
      setCurrentStep(0);
      setTotalSteps(0); // Will be determined dynamically
      setGuidedSteps([]);
    };

    if (guidedTutoringActive && guidedTutoringData) {
      initializeGuidedTutoring();
    }
  }, [guidedTutoringActive, guidedTutoringData, character]);

  // Function to detect and render mathematical content in messages
  const renderMessageWithGraphs = (content: string) => {
    // Safety check for undefined/null content
    if (!content || typeof content !== 'string') {
      console.warn('⚠️ renderMessageWithGraphs called with invalid content:', content);
      return <span>Error: Invalid message content</span>;
    }
    
    // 🐛 DEBUG: Log the full content to analyze
    console.log('📝 Processing message content:', {
      content,
      hasShapePattern: /\[SHAPE:[^\]]+\]/.test(content),
      allPatterns: content.match(/\[[A-Z]+:[^\]]+\]/g) || []
    });
    
    // Split content by markers - GeoGebra features are disabled but patterns preserved for user feedback
    const parts = content.split(/(\[GRAPH:[^\]]+\]|\[PLACEVALUE:[^\]]+\]|\[SCIENTIFIC:[^\]]+\]|\[POWERLINE:[^\]]+\]|\[NUMBERLINE:[^\]]+\]|\[GEOGEBRA:[^\]]+\]|\[GEOMETRY:[^\]]+\]|\[TRANSFORM:[^\]]+\]|\[SHAPE:[^\]]+\]|\[SMART_3D:[^\]]+\]|\[POWERS10:[^\]]+\]|\[CUBE:[^\]]+\]|\[3D:[^\]]+\])/g);
    
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
        
        // Clean up function expressions - remove "y =" and "f(x) =" prefixes and escape characters
        functions = functions.map(func => {
          return func
            .replace(/^y\s*=\s*/, '')      // Remove "y = " prefix
            .replace(/^f\(x\)\s*=\s*/, '') // Remove "f(x) = " prefix
            .replace(/\\/g, '')            // Remove escape characters like \sin -> sin
            .trim();
        });
        
        // Determine appropriate ranges based on function types
        const hasTrig = functions.some(func => /sin|cos|tan/.test(func));
        const hasLog = functions.some(func => /log|ln/.test(func));
        const hasExp = functions.some(func => /\^|exp/.test(func) && !/\^2/.test(func)); // exponential but not quadratic
        const hasQuadratic = functions.some(func => /\^2|x\*x|x²/.test(func));
        
        let xRange: [number, number] = [-10, 10];
        let yRange: [number, number] = [-10, 10];
        
        // Set optimal ranges for different function types
        if (hasTrig) {
          // For trigonometric functions, show 2 complete cycles
          xRange = [-2 * Math.PI, 2 * Math.PI]; // About [-6.28, 6.28]
          yRange = [-3, 3]; // sin/cos range with some padding
        } else if (hasLog) {
          // For logarithmic functions, start from positive domain
          xRange = [0.1, 20];
          yRange = [-3, 3];
        } else if (hasExp) {
          // For exponential functions
          xRange = [-5, 5];
          yRange = [0, 20];
        } else if (hasQuadratic) {
          // For quadratic functions
          xRange = [-8, 8];
          yRange = [-10, 15];
        }
        
        return (
          <div key={index} className="my-4">
            <PlotlyGrapher
              functions={functions}
              title="Interactive Function Graph"
              width={700}
              height={450}
              interactive={true}
              showGrid={true}
              xRange={xRange}
              yRange={yRange}
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

      // Check for General Number Line instruction (for fractions, decimals, etc.)
      const numberLineMatch = part.match(/\[NUMBERLINE:([^\]]+)\]/);
      if (numberLineMatch) {
        const instruction = numberLineMatch[1];
        // Parse fractions like "1/4,3/8,5/6" or range like "0,1,0.25"
        const fractionStrings = instruction.split(',').map(str => str.trim());
        const numbers = fractionStrings.map(str => {
          if (str.includes('/')) {
            // Parse fraction
            const [num, den] = str.split('/').map(s => parseFloat(s.trim()));
            return num / den;
          }
          return parseFloat(str);
        }).filter(n => !isNaN(n));

        // Create fraction labels for display
        const fractionLabels = fractionStrings.reduce((acc, str, idx) => {
          if (!isNaN(numbers[idx])) {
            acc[numbers[idx]] = str;
          }
          return acc;
        }, {} as Record<number, string>);

        // Determine range for the number line
        const min = Math.min(0, ...numbers);
        const max = Math.max(1, ...numbers);
        const range = max - min;
        const padding = range * 0.1;
        
        return (
          <VisualizationContainer 
            key={index}
            title="Interactive Number Line"
            description={`Exploring fractions: ${fractionStrings.join(', ')}`}
            className="number-line-visualization"
          >
            <NumberLineVisualizer
              min={min - padding}
              max={max + padding}
              step={0.25}
              highlightNumbers={numbers}
              fractionLabels={fractionLabels}
              showFractions={true}
              title="Fraction Number Line"
            />
          </VisualizationContainer>
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
            <VisualizationContainer 
              key={index}
              title={`Linear Function: ${graphInstruction}`}
              description="Interactive graph with gridlines and point plotting"
            >
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
            </VisualizationContainer>
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
            <VisualizationContainer 
              key={index}
              title="Coordinate Points"
              description={`Plotting ${points.length} point${points.length > 1 ? 's' : ''} on the coordinate plane`}
            >
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
            </VisualizationContainer>
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

      // ENHANCED: Desmos integration for reliable educational math visualization
      const desmosMatch = part.match(/\[DESMOS:([^\]]+)\]/);
      if (desmosMatch) {
        const expressionsStr = desmosMatch[1];
        const expressions = expressionsStr.split(',').map(expr => parseMathExpression(expr.trim()));
        
        return (
          <div key={index} className="my-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Interactive Graph</h4>
              <DesmosCalculator
                expressions={expressions}
                width="100%"
                height={350}
                options={{
                  expressions: expressions.length > 1, // Show expressions list if multiple functions
                  settingsMenu: false,
                  zoomButtons: true,
                  pointsOfInterest: true,
                  trace: true
                }}
              />
            </div>
          </div>
        );
      }

      // LEGACY: GeoGebra pattern now redirects to Desmos for better reliability
      const geogebraMatch = part.match(/\[GEOGEBRA:([^\]]+)\]/);
      if (geogebraMatch) {
        const content = geogebraMatch[1];
        // Convert common GeoGebra-style content to Desmos expressions
        const expressions = content.includes(',') 
          ? content.split(',').map(expr => parseMathExpression(expr.trim()))
          : [parseMathExpression(content)];
        
        return (
          <div key={index} className="my-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <h4 className="text-sm font-medium text-blue-800">Enhanced with Desmos</h4>
              </div>
              <DesmosCalculator
                expressions={expressions}
                width="100%"
                height={350}
                options={{
                  expressions: expressions.length > 1,
                  settingsMenu: false,
                  zoomButtons: true,
                  pointsOfInterest: true,
                  trace: true
                }}
              />
            </div>
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
            } else if (shape === 'cone') {
              dimensions.radius = parseFloat(dimMatch[0]) || 1;
              dimensions.height = parseFloat(dimMatch[1]) || 2;
              console.log('🔺 SMART_3D Cone dimensions set:', dimensions);
            } else if (shape === 'pyramid') {
              // For pyramids: first param is base size, second is height
              dimensions.width = parseFloat(dimMatch[0]) || 2;  // Base size
              dimensions.height = parseFloat(dimMatch[1]) || 2; // Height
              console.log('🔺 SMART_3D Pyramid dimensions set (base, height):', dimensions);
            } else if (shape === 'triangular_prism') {
              // For triangular prisms: width, height, depth
              dimensions.width = parseFloat(dimMatch[0]) || 3;  // Base width
              dimensions.height = parseFloat(dimMatch[1]) || 4; // Height
              dimensions.depth = parseFloat(dimMatch[2]) || 2;  // Depth
              console.log('🔺 SMART_3D Triangular Prism dimensions set (width, height, depth):', dimensions);
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
            <div className="mb-2 text-sm text-gray-600">
              🎲 3D Visualization: {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </div>
            {console.log('🔥 ABOUT TO RENDER ThreeGeometryVisualizer')}
            <ThreeGeometryVisualizer
              shape={shape as any}
              dimensions={dimensions}
              showMeasurements={true}
              showAxes={true}
              interactive={true}
              animation="none"
              color="#93c5fd"
            />
            {console.log('🔥 ThreeGeometryVisualizer JSX RENDERED')}
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

      // PROFESSIONAL: Geometric Transformations with Three.js (NEW)
      const transformMatch = part.match(/\[TRANSFORM:([^,\]]+),?([^\]]*)\]/);
      if (transformMatch) {
        const transformType = transformMatch[1].toLowerCase().trim();
        const parameters = transformMatch[2] || '';
        
        console.log('🔄 TRANSFORM Pattern Detected:', {
          fullMatch: transformMatch[0],
          transformType,
          parameters,
          originalPart: part
        });
        
        // Parse transformation parameters
        let type: 'reflection' | 'rotation' | 'translation' = 'reflection';
        let axis: 'x' | 'y' | 'vertical' | 'horizontal' = 'vertical';
        let shape: 'triangle' | 'square' | 'polygon' = 'triangle';
        let angle = 90;
        
        // Map transformation types
        if (transformType.includes('reflect') || transformType.includes('mirror')) {
          type = 'reflection';
        } else if (transformType.includes('rotate') || transformType.includes('turn')) {
          type = 'rotation';
        } else if (transformType.includes('translate') || transformType.includes('move') || transformType.includes('slide')) {
          type = 'translation';
        }
        
        // Parse axis for reflection
        if (parameters) {
          if (parameters.includes('horizontal') || parameters.includes('x')) {
            axis = 'horizontal';
          } else if (parameters.includes('vertical') || parameters.includes('y')) {
            axis = 'vertical';
          }
          
          // Parse angle for rotation
          const angleMatch = parameters.match(/(\d+)/);
          if (angleMatch) {
            angle = parseInt(angleMatch[1]);
          }
        }
        
        console.log('🔄 Transformation visualization:', { type, axis, shape, angle });
        
        return (
          <div key={index} className="my-4">
            <div className="mb-2 text-sm text-gray-600">
              🔄 3D Transformation: {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <TransformationVisualizer
              type={type}
              shape={shape}
              axis={axis}
              angle={angle}
              showAnimation={true}
              className="professional-grade"
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
            } else if (shapeName.includes('cone')) {
              dimensions.radius = parseFloat(paramMatch[0]) || 1;
              dimensions.height = parseFloat(paramMatch[1]) || 2;
              console.log('🔺 Cone dimensions set:', dimensions);
            } else if (shapeName.includes('pyramid')) {
              // For pyramids: first param is base size, second is height
              dimensions.width = parseFloat(paramMatch[0]) || 2;  // Base size
              dimensions.height = parseFloat(paramMatch[1]) || 2; // Height
              console.log('🔺 Pyramid dimensions set (base, height):', dimensions);
            } else if (shapeName.includes('triangular') && shapeName.includes('prism')) {
              // For triangular prisms: width, height, depth
              dimensions.width = parseFloat(paramMatch[0]) || 3;  // Base width
              dimensions.height = parseFloat(paramMatch[1]) || 4; // Height
              dimensions.depth = parseFloat(paramMatch[2]) || 2;  // Depth
              console.log('🔺 Triangular Prism dimensions set (width, height, depth):', dimensions);
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
        else if (shapeName.includes('pyramid')) mappedShape = 'pyramid';
        else if (shapeName.includes('triangular') && shapeName.includes('prism')) mappedShape = 'triangular_prism';
        else if (shapeName.includes('cube') || shapeName.includes('box')) mappedShape = 'cube';

        console.log('🎯 Shape mapping result:', {
          originalShapeName: shapeName,
          mappedShape,
          finalDimensions: dimensions
        });

        return (
          <div key={index} className="my-4">
            <div className="mb-2 text-sm text-gray-600">
              🎲 3D Visualization: {mappedShape.charAt(0).toUpperCase() + mappedShape.slice(1)}
            </div>
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

  // Helper function to add messages
  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `${message.type}-${Date.now()}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputValue.trim();
    if (!messageToSend || isTyping) return;

    // GUIDED TUTORING: Special handling for guided tutoring mode
    if (guidedTutoringActive && guidedTutoringData) {
      console.log(`🎯 [ChatInterface] Processing guided tutoring message: "${messageToSend}"`);
      
      // Set generating step flag
      setIsGeneratingStep(true);
      
      // Check if this is a step progression request
      const isNextStep = messageToSend.toLowerCase().includes('next step') || 
                        messageToSend.toLowerCase().includes('ready');
      const isHint = messageToSend.toLowerCase().includes('hint');
      const isCheck = messageToSend.toLowerCase().includes('check');
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: messageToSend,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      if (!customMessage) setInputValue('');
      setIsTyping(true);
      onExpressionChange?.('thinking');
      
      try {
        // Generate step-by-step guidance based on request type
        let guidedPrompt = '';
        
        if (isNextStep) {
          guidedPrompt = `The student is working on this math problem step-by-step: "${guidedTutoringData.question}"
          
Learning Objective: ${guidedTutoringData.learningObjective}
Current Step: ${currentStep + 1}
Concepts: ${guidedTutoringData.conceptsFocused?.join(', ') || 'General math'}

The student is ready for the next step. Provide ONLY the next single step to solve this problem. 
- Don't give the full solution
- Give just one clear, actionable step
- Include any necessary explanation for that step only
- End with encouragement to try that step

Be encouraging and age-appropriate for an 11-year-old student.`;
        } else if (isHint) {
          guidedPrompt = `The student is working on this math problem: "${guidedTutoringData.question}"
          
Learning Objective: ${guidedTutoringData.learningObjective}
Hint Available: ${guidedTutoringData.hint}
Current Step: ${currentStep + 1}

The student needs a hint. Provide a helpful hint that guides them toward the next step without giving the answer.
- Be encouraging and supportive
- Reference the hint if helpful: ${guidedTutoringData.hint}
- Don't solve it for them
- Age-appropriate for an 11-year-old

Give them confidence to keep trying!`;
        } else if (isCheck) {
          guidedPrompt = `The student is working on this math problem: "${guidedTutoringData.question}"
          
Learning Objective: ${guidedTutoringData.learningObjective}
Current Step: ${currentStep + 1}

The student wants to check their work. Ask them to share what they've done so far, then provide feedback.
- Encourage them to show their thinking
- Don't give answers away
- Be supportive and positive
- Age-appropriate for an 11-year-old

Help them build confidence in their problem-solving!`;
        } else {
          // General guided tutoring response
          guidedPrompt = `The student is working on this math problem: "${guidedTutoringData.question}"
          
Learning Objective: ${guidedTutoringData.learningObjective}
Student's message: "${messageToSend}"

Respond helpfully to their question while maintaining the step-by-step tutoring approach.
- Don't give full solutions
- Guide them to think through the problem
- Be encouraging and age-appropriate for an 11-year-old
- Keep them engaged in the learning process`;
        }
        
        // Generate guided response using GPT-4o
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: guidedPrompt,
            character: character,
            lessonContext: {
              lessonId: lessonContext.documentId + '-' + lessonContext.lessonNumber,
              lessonTitle: lessonContext.lessonTitle || 'Math Lesson',
              gradeLevel: 6,
              guidedTutoring: true,
              stepByStep: true
            },
            temperature: 0.7
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // If this was a next step, increment step counter
        if (isNextStep) {
          setCurrentStep(prev => prev + 1);
          if (totalSteps === 0) {
            setTotalSteps(5); // Estimate 5 steps for most problems
          }
        }
        
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: data.content || "I'm having trouble generating a response right now. Please try again! 🤔",
          timestamp: new Date(),
          character: character
        };

        setMessages(prev => [...prev, assistantMessage]);
        console.log(`✅ [ChatInterface] Guided tutoring response generated`);
        
      } catch (error) {
        console.error('❌ [ChatInterface] Error in guided tutoring:', error);
        
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          type: 'assistant',
          content: "I'm having trouble right now, but don't give up! Try asking your question in a different way. 🤔",
          timestamp: new Date(),
          character: character
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
        setIsGeneratingStep(false);
        onExpressionChange?.('idle');
      }
      
      return; // Exit early for guided tutoring
    }

    // REGULAR CHAT: Continue with normal chat processing

    // Child-friendly safety check
    if ((childFriendlyMode || showQuickSelect) && userAge <= 13) {
      // Content safety filter for young users
      const sensitiveTopics = CHILD_FRIENDLY_DESIGN.SAFETY.blockedTopics;
      const lowerMessage = messageToSend.toLowerCase();
      
      for (const topic of sensitiveTopics) {
        if (lowerMessage.includes(topic.toLowerCase())) {
          addMessage({
            type: 'assistant',
            content: `Hey! Let's keep our chat focused on ${lessonContext.lessonTitle}! 📚 I'm here to help you with math. What would you like to learn about this lesson? 🤔`,
            character
          });
          setInputValue('');
          return;
        }
      }
    }

    console.log(`💬 [ChatInterface] User sending message: "${messageToSend}"`);
    console.log(`🎭 [ChatInterface] Current character: ${character}`);
    console.log(`📚 [ChatInterface] Lesson context:`, {
      lessonId: lessonContext.documentId + '-' + lessonContext.lessonNumber,
      hasAnalysis: !!lessonAnalysis
    });

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customMessage) setInputValue(''); // Only clear input if using text input
    setIsTyping(true);
    
    // Set character to thinking while processing
    onExpressionChange?.('thinking');

    try {
    // Use intelligent tutor engine for smarter responses
    if (lessonAnalysis) {
      // Check if this is vision-based analysis
      const isVisionAnalysis = lessonContext.analysis?.analysisType === 'vision-analysis';
      
      console.log(`🧠 [ChatInterface] Using intelligent tutor engine with ${isVisionAnalysis ? 'VISION' : 'standard'} analysis`);
      if (isVisionAnalysis) {
        console.log(`🔬 [ChatInterface] 🎯 ENHANCED VISION ANALYSIS ACTIVE - AI has full visual understanding of all lesson pages!`);
        console.log(`📊 [ChatInterface] Raw vision analysis structure:`, lessonContext.analysis);
      }
      
      // Transform vision analysis data to intelligent tutor format if needed
      let transformedAnalysis = lessonAnalysis;
      if (isVisionAnalysis && lessonContext.analysis?.analysis) {
        const visionData = lessonContext.analysis.analysis;
        transformedAnalysis = {
          topics: visionData.concepts || [],
          mathConcepts: visionData.concepts || [],
          visualizationNeeds: [],
          difficulty: visionData.difficulty === 'beginner' ? 'elementary' : 
                     visionData.difficulty === 'advanced' ? 'high' : 'middle',
          suggestedTools: [],
          keyTerms: visionData.vocabulary || [],
          objectives: visionData.prerequisites || [],
          analysisType: 'vision-analysis'
        };
        console.log(`🔄 [ChatInterface] Transformed vision analysis for tutor engine:`, transformedAnalysis);
      }
      
      // Analyze user query to determine intent and tools needed
      const queryAnalysis = await intelligentTutor.analyzeUserQuery(
        userMessage.content, 
        transformedAnalysis
      );
      
      console.log(`🔍 [ChatInterface] Query analysis:`, queryAnalysis);
      
      // Generate smart response using GPT-4o with child-friendly modifications
      const aiResponse = await intelligentTutor.generateResponse(
        queryAnalysis,
        transformedAnalysis,
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
    <div className={`flex flex-col transition-all duration-300 ${
      isExpanded ? 'fixed inset-0 z-50 bg-white' : 'h-full'
    }`} role="region" aria-label={`Chat with ${config.name}`}>
      
      {/* Modern Header with Expand/Collapse */}
      <div className={`flex items-center justify-between p-6 ${
        config.color === 'blue' 
          ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
          : 'bg-gradient-to-r from-green-500 to-green-600'
      } text-white shadow-lg`}>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full ${
            config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
          } flex items-center justify-center text-2xl`}>
            {character === 'gimli' ? '🐕' : '👨‍🏫'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{config.name}</h2>
            <p className="text-sm opacity-90">
              {isTyping ? 'Typing...' : `Ready to help with ${lessonContext.lessonTitle}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Vision Analysis Status */}
          {lessonContext.analysis?.analysisType === 'vision-analysis' ? (
            <div className="flex items-center space-x-2 bg-purple-500 bg-opacity-30 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm font-medium text-purple-200">Vision AI</span>
            </div>
          ) : lessonAnalysis ? (
            <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <svg className="w-4 h-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-200">Text AI</span>
            </div>
          ) : null}
          
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            aria-label={isExpanded ? 'Minimize chat' : 'Expand chat to fullscreen'}
          >
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Spacious Messages Area */}
      <div 
        className={`flex-1 overflow-y-auto bg-gray-50 ${
          isExpanded ? 'p-8' : 'p-6'
        }`}
        role="log" 
        aria-live="polite" 
        aria-label="Chat messages"
      >
        <div className={`max-w-4xl mx-auto space-y-6`}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              role="article"
              aria-label={`${message.type === 'user' ? 'Your' : config.name + "'s"} message`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : config.color === 'blue'
                    ? 'bg-white text-gray-800 border border-blue-100'
                    : 'bg-white text-gray-800 border border-green-100'
                }`}
              >
                <div className="text-base leading-relaxed" aria-label="Message content">
                  {message.type === 'user' ? (
                    <MathRenderer content={message.content || ''} />
                  ) : (
                    renderMessageWithGraphs(message.content || '')
                  )}
                </div>
                <div className="text-xs opacity-60 mt-3 flex items-center space-x-2" aria-label="Message time">
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2">
                      <Image 
                        src={config.avatar} 
                        alt={config.name}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="font-medium">{config.name}</span>
                    </div>
                  )}
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start" aria-live="polite" aria-label={`${config.name} is typing`}>
              <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Image 
                      src={config.avatar} 
                      alt={config.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-600">{config.name} is typing...</span>
                  </div>
                  <div className="flex space-x-1" aria-hidden="true">
                    <div className={`w-3 h-3 rounded-full animate-bounce ${
                      config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                    }`} style={{ animationDelay: '0ms' }}></div>
                    <div className={`w-3 h-3 rounded-full animate-bounce ${
                      config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                    }`} style={{ animationDelay: '150ms' }}></div>
                    <div className={`w-3 h-3 rounded-full animate-bounce ${
                      config.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                    }`} style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-gray-500 text-sm">{config.name} is thinking...</span>
                </div>
                <span className="sr-only">{config.name} is typing a response</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Modern Input Area */}
      <div className={`bg-white border-t border-gray-200 ${
        isExpanded ? 'p-8' : 'p-6'
      }`}>
        <div className="max-w-4xl mx-auto">
          
          {/* Guided Tutoring Controls */}
          {guidedTutoringActive && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                  🎯 Step-by-Step Guidance Mode
                </h3>
                <button
                  onClick={() => {
                    if (onGuidedTutoringComplete) {
                      onGuidedTutoringComplete();
                    }
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Exit Guided Mode
                </button>
              </div>
              
              {/* Progress Bar */}
              {totalSteps > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{currentStep}/{totalSteps} steps</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Guided Tutoring Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => handleSendMessage("I'm ready for the next step!")}
                  disabled={isTyping || isGeneratingStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Next Step</span>
                  <span>➡️</span>
                </button>
                
                <button
                  onClick={() => handleSendMessage("Can you give me a hint?")}
                  disabled={isTyping || isGeneratingStep}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Need a Hint</span>
                  <span>💡</span>
                </button>
                
                <button
                  onClick={() => handleSendMessage("I think I understand! Can you check my work?")}
                  disabled={isTyping || isGeneratingStep}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Check My Work</span>
                  <span>✅</span>
                </button>
              </div>
              
              {/* Question Context */}
              {guidedTutoringData && (
                <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>Working on:</strong> {guidedTutoringData.question}
                  </p>
                  {guidedTutoringData.hint && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Remember:</strong> {guidedTutoringData.hint}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Child-Friendly Mode Toggle */}
          {!childFriendlyMode && (
            <div className="mb-6 flex items-center justify-center">
              <div className="bg-gray-100 rounded-xl p-1 flex">
                <button
                  onClick={() => setShowQuickSelect(false)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !showQuickSelect
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  ⌨️ Advanced Mode
                </button>
                <button
                  onClick={() => setShowQuickSelect(true)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    showQuickSelect
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  🧒 Kid-Friendly Mode
                </button>
              </div>
            </div>
          )}

          {/* Session Manager for Child-Friendly Mode */}
          {(childFriendlyMode || showQuickSelect) && (
            <div className="mb-6">
              <SessionManager
                userAge={userAge}
                lessonTitle={lessonContext.lessonTitle}
                isActive={sessionActive}
                onSessionStart={() => setSessionActive(true)}
                onSessionEnd={() => setSessionActive(false)}
                onBreakSuggested={() => {
                  addMessage({
                    type: 'assistant',
                    content: `Hey! You've been working hard! 🌟 Let's take a quick break. Stand up, stretch, or grab some water. I'll be here when you're ready to continue! 💪`,
                    character
                  });
                }}
              />
            </div>
          )}

          {/* Quick Select Interface for Child-Friendly Mode */}
          {(childFriendlyMode || showQuickSelect) && (
            <div className="mb-6">
              <QuickSelectInterface
                lessonTitle={lessonContext.lessonTitle}
                lessonNumber={lessonContext.lessonNumber}
                onQuestionSelect={(question) => {
                  setInputValue(question);
                  handleSendMessage(question);
                }}
                disabled={isTyping}
                userAge={userAge}
                lessonSpecificQuestions={lessonSpecificQuestions}
                isGeneratingQuestions={isGeneratingQuestions}
              />
            </div>
          )}

          {/* Enhanced Text Input (Always available) */}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} role="form" aria-label="Send message to virtual tutor">
            <div className="flex space-x-4 items-end">
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
                  className="w-full resize-none border-2 border-gray-200 rounded-2xl px-6 py-4 text-base bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                  rows={Math.min(6, Math.max(3, inputValue.split('\n').length + 1))}
                  disabled={isTyping}
                  aria-describedby="input-help"
                  aria-invalid={false}
                  maxLength={2000}
                />
                <div id="input-help" className="flex items-center justify-between mt-3 px-2">
                  <span className="text-sm text-gray-500" aria-live="polite">
                    {inputValue.length > 0 && `${inputValue.length}/2000 characters`}
                  </span>
                  <span className="text-sm text-gray-400">
                    Press Enter to send, Shift+Enter for new line
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className={`px-8 py-4 rounded-2xl text-base font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[120px] ${
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
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" aria-hidden="true"></div>
                    <span>...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Send</span>
                    <span aria-hidden="true">📤</span>
                  </div>
                )}
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setInputValue("Can you explain this lesson's main concept?")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium transition-all duration-200"
                disabled={isTyping}
              >
                💡 Explain Main Concept
              </button>
              <button
                onClick={() => setInputValue("I need help with a practice problem")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium transition-all duration-200"
                disabled={isTyping}
              >
                🔢 Practice Problem Help
              </button>
              <button
                onClick={() => setInputValue("Can you give me a hint?")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium transition-all duration-200"
                disabled={isTyping}
              >
                💭 Give Me a Hint
              </button>
              <button
                onClick={() => setInputValue("Can you show me an example?")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 text-sm font-medium transition-all duration-200"
                disabled={isTyping}
              >
                📝 Show Example
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
