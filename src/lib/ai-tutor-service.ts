import OpenAI from 'openai';
import { StudentSafetyFilter, type SafetyFilterResult } from './student-safety-filter';
import { PageContextService, type PageContent } from './page-context-service';

export type AIModel = 
  | 'gpt-4o'           // Default - Latest GPT-4o
  | 'gpt-4o-mini'      // Cost-effective option
  | 'gpt-4.5-turbo'    // GPT-4.1 equivalent
  | 'gpt-5'            // GPT-5 preview
  | 'gpt-5-turbo'      // GPT-5 optimized
  | 'o1-preview'       // Advanced reasoning
  | 'o1-mini';         // Reasoning optimized

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  character?: 'somers' | 'gimli';
  model?: AIModel;
  tokens?: number;
  cost?: number;
}

export interface LessonContext {
  lessonId: string;
  lessonTitle: string;
  gradeLevel: number;
  unit: string;
  volume: number;
  content?: string;          // OCR extracted content
  formulas?: string[];       // Mathematical formulas
  concepts?: string[];       // Key concepts
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface TutorResponse {
  content: string;
  character: 'somers' | 'gimli';
  model: AIModel;
  reasoning?: string;        // For o1 models
  followUpQuestions?: string[];
  relatedConcepts?: string[];
  confidence: number;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost: number;
}

export class AITutorService {
  private static client: OpenAI;
  private static initialized = false;

  // Model configurations with latest capabilities
  private static modelConfigs: Record<AIModel, {
    name: string;
    description: string;
    maxTokens: number;
    costPer1kPrompt: number;
    costPer1kCompletion: number;
    supportsTools: boolean;
    supportsReasoning: boolean;
    bestFor: string[];
  }> = {
    'gpt-4o': {
      name: 'GPT-4o',
      description: 'Latest multimodal model with enhanced reasoning',
      maxTokens: 128000,
      costPer1kPrompt: 0.0025,
      costPer1kCompletion: 0.01,
      supportsTools: false,  // Temporarily disabled to get direct text responses
      supportsReasoning: true,
      bestFor: ['general tutoring', 'problem solving', 'explanations']
    },
    'gpt-4o-mini': {
      name: 'GPT-4o Mini',
      description: 'Cost-effective with strong performance',
      maxTokens: 128000,
      costPer1kPrompt: 0.00015,
      costPer1kCompletion: 0.0006,
      supportsTools: true,
      supportsReasoning: true,
      bestFor: ['quick questions', 'practice problems', 'hints']
    },
    'gpt-4.5-turbo': {
      name: 'GPT-4.5 Turbo',
      description: 'Enhanced GPT-4.1 with improved math capabilities',
      maxTokens: 128000,
      costPer1kPrompt: 0.003,
      costPer1kCompletion: 0.012,
      supportsTools: true,
      supportsReasoning: true,
      bestFor: ['complex math', 'detailed explanations', 'step-by-step solutions']
    },
    'gpt-5': {
      name: 'GPT-5',
      description: 'Most advanced reasoning and problem-solving',
      maxTokens: 200000,
      costPer1kPrompt: 0.005,
      costPer1kCompletion: 0.02,
      supportsTools: true,
      supportsReasoning: true,
      bestFor: ['complex problems', 'deep explanations', 'advanced concepts']
    },
    'gpt-5-turbo': {
      name: 'GPT-5 Turbo',
      description: 'Optimized GPT-5 for speed and efficiency',
      maxTokens: 128000,
      costPer1kPrompt: 0.0035,
      costPer1kCompletion: 0.014,
      supportsTools: true,
      supportsReasoning: true,
      bestFor: ['interactive tutoring', 'real-time help', 'conversational learning']
    },
    'o1-preview': {
      name: 'o1-preview',
      description: 'Advanced reasoning model for complex problems',
      maxTokens: 128000,
      costPer1kPrompt: 0.015,
      costPer1kCompletion: 0.06,
      supportsTools: false,
      supportsReasoning: true,
      bestFor: ['complex math proofs', 'multi-step problems', 'logical reasoning']
    },
    'o1-mini': {
      name: 'o1-mini',
      description: 'Reasoning-optimized for math and science',
      maxTokens: 65536,
      costPer1kPrompt: 0.003,
      costPer1kCompletion: 0.012,
      supportsTools: false,
      supportsReasoning: true,
      bestFor: ['math problems', 'logical puzzles', 'step-by-step reasoning']
    }
  };

  private static initialize() {
    if (!this.initialized) {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables');
      }

      this.client = new OpenAI({ apiKey });
      this.initialized = true;
      console.log('✅ OpenAI client initialized with latest model support');
    }
  }

  /**
   * Generate AI tutor response with character personality and lesson context
   */
  static async generateResponse(
    userMessage: string,
    character: 'somers' | 'gimli',
    lessonContext: LessonContext,
    conversationHistory: ChatMessage[] = [],
    preferredModel: AIModel = 'gpt-4o'
  ): Promise<TutorResponse> {
    this.initialize();

    const modelConfig = this.modelConfigs[preferredModel];
    console.log(`🤖 Generating response with ${modelConfig.name} for ${character}`);

    try {
      // 🚨 STEP 1: Safety Filter - Check for inappropriate content
      const safetyResult = StudentSafetyFilter.filterStudentInput(userMessage);
      
      if (!safetyResult.isAppropriate) {
        console.warn(`🚨 Inappropriate content detected: ${safetyResult.category} (${safetyResult.severity})`);
        
        // Log teacher alert if needed
        if (safetyResult.teacherAlert) {
          console.error(`🚨 TEACHER ALERT: ${safetyResult.category} content detected`);
          // In production, this would send an alert to teachers/administrators
        }

        // Return safety guidance instead of processing the inappropriate message
        return {
          content: safetyResult.guidance || "Let's keep our conversation focused on math. How can I help you with your lesson?",
          character,
          model: preferredModel,
          confidence: 100,
          tokens: { prompt: 0, completion: 0, total: 0 },
          cost: 0
        };
      }

      // 🔍 STEP 2: Page Context - Check if student is asking about specific page
      const isPageRequest = StudentSafetyFilter.isPageSpecificRequest(userMessage);
      const pageNumbers = StudentSafetyFilter.extractPageNumbers(userMessage);
      
      let pageContext: PageContent | null = null;
      if (isPageRequest && pageNumbers.length > 0) {
        console.log(`📖 Page-specific request detected: pages ${pageNumbers.join(', ')}`);
        
        // Extract document ID and lesson number from lesson context
        const lessonIdParts = lessonContext.lessonId.split('-');
        const documentId = lessonIdParts[0]; // e.g., "RCM08_NA_SW_V1"
        const lessonNumber = parseInt(lessonIdParts[lessonIdParts.length - 1]); // e.g., 7
        
        console.log(`🔍 Requesting page content: documentId=${documentId}, lessonNumber=${lessonNumber}, pageNumber=${pageNumbers[0]}`);
        
        // Try to get page content for the first mentioned page
        const pageResult = await PageContextService.getPageContent(
          documentId,
          lessonNumber,
          pageNumbers[0]
        );
        
        if (pageResult.success && pageResult.pageContent) {
          pageContext = pageResult.pageContent;
          console.log(`✅ Page ${pageNumbers[0]} content retrieved successfully`);
          
          // Generate page-specific response
          const pageSpecificResponse = PageContextService.generatePageSpecificGuidance(
            pageContext,
            userMessage,
            character
          );
          
          return {
            content: pageSpecificResponse,
            character,
            model: preferredModel,
            confidence: 95,
            tokens: { prompt: 0, completion: 0, total: 0 },
            cost: 0
          };
        } else {
          console.warn(`⚠️ Could not retrieve page ${pageNumbers[0]} content: ${pageResult.error}`);
        }
      }

      // 🤖 STEP 3: Standard AI Response Generation
      // Build character-specific system prompt
      const systemPrompt = this.buildSystemPrompt(character, lessonContext, pageContext);
      
      // Prepare conversation context
      const messages = this.prepareMessages(systemPrompt, conversationHistory, userMessage);

      // Calculate token estimate for cost control
      const estimatedTokens = this.estimateTokens(messages);
      if (estimatedTokens > modelConfig.maxTokens * 0.8) {
        console.warn(`⚠️ High token usage estimated: ${estimatedTokens}`);
      }

      const startTime = Date.now();

      // Generate response based on model capabilities
      let completion;
      if (modelConfig.supportsReasoning && (preferredModel.startsWith('o1'))) {
        // Use reasoning models with different parameters
        completion = await this.client.chat.completions.create({
          model: preferredModel,
          messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
          max_completion_tokens: 4000,
          temperature: 1.0
        });
      } else {
        // Standard completion for other models
        completion = await this.client.chat.completions.create({
          model: preferredModel,
          messages: messages.map(msg => ({ role: msg.role, content: msg.content })),
          max_completion_tokens: 2000,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
          ...(modelConfig.supportsTools && {
            tools: this.getAvailableTools(),
            tool_choice: 'auto'
          })
        });
      }

      const processingTime = Date.now() - startTime;
      const responseContent = completion.choices[0]?.message?.content || '';
      let processedContent = responseContent;

      // 🐛 DEBUG: Full OpenAI response analysis
      console.log('🔍 OpenAI Response Debug:', {
        choices: completion.choices.length,
        firstChoice: completion.choices[0] ? {
          message: completion.choices[0].message,
          finishReason: completion.choices[0].finish_reason
        } : 'No choices',
        content: responseContent,
        contentLength: responseContent.length,
        hasContent: !!responseContent,
        usage: completion.usage
      });

      // 🐛 DEBUG: Tool calls analysis
      if (completion.choices[0]?.message?.tool_calls) {
        console.log('🔧 Tool Calls Detected:', completion.choices[0].message.tool_calls.map(tc => ({
          name: (tc as any).function?.name,
          arguments: (tc as any).function?.arguments
        })));
        
        // Process tool calls if present
        console.log('🔧 Processing tool calls...');
        processedContent = await this.processToolCalls(
          completion.choices[0].message.tool_calls,
          userMessage,
          character,
          lessonContext
        );
        console.log('🔧 Tool processing complete, content length:', processedContent.length);
      } else {
        console.log('🔧 No tool calls detected in response');
      }

      // 🐛 DEBUG: Log the AI response content to check for shape patterns
      console.log('🤖 AI Generated Response:', {
        content: processedContent,
        hasShapePattern: /\[SHAPE:[^\]]+\]/.test(processedContent),
        extractedShapePatterns: processedContent.match(/\[SHAPE:[^\]]+\]/g) || []
      });

      // Calculate costs
      const promptTokens = completion.usage?.prompt_tokens || 0;
      const completionTokens = completion.usage?.completion_tokens || 0;
      const totalTokens = completion.usage?.total_tokens || 0;

      const cost = (
        (promptTokens / 1000) * modelConfig.costPer1kPrompt +
        (completionTokens / 1000) * modelConfig.costPer1kCompletion
      );

      // Handle empty response from OpenAI (potential content filtering or API issue)
      let finalContent = processedContent;
      if (!processedContent || processedContent.trim().length === 0) {
        console.warn('⚠️ OpenAI returned empty content - using fallback response');
        finalContent = this.getFallbackResponse(character, userMessage);
      }

      // Extract reasoning for o1 models (if available)
      const reasoning = (completion.choices[0]?.message as any)?.reasoning || undefined;

      // Generate follow-up suggestions
      const followUpQuestions = this.generateFollowUpQuestions(finalContent, lessonContext);

      const response: TutorResponse = {
        content: finalContent,
        character,
        model: preferredModel,
        reasoning,
        followUpQuestions,
        relatedConcepts: lessonContext.concepts?.slice(0, 3),
        confidence: this.calculateConfidence(responseContent, lessonContext),
        tokens: {
          prompt: promptTokens,
          completion: completionTokens,
          total: totalTokens
        },
        cost
      };

      console.log(`✅ Response generated in ${processingTime}ms:`);
      console.log(`   📊 Tokens: ${totalTokens} (prompt: ${promptTokens}, completion: ${completionTokens})`);
      console.log(`   💰 Cost: $${cost.toFixed(6)}`);
      console.log(`   🎯 Confidence: ${response.confidence}%`);

      return response;

    } catch (error) {
      console.error('❌ AI response generation failed:', error);
      
      // Return fallback response
      return {
        content: this.getFallbackResponse(character, userMessage),
        character,
        model: preferredModel,
        confidence: 0,
        tokens: { prompt: 0, completion: 0, total: 0 },
        cost: 0
      };
    }
  }

  /**
   * Build character-specific system prompts with lesson context
   */
  private static buildSystemPrompt(
    character: 'somers' | 'gimli', 
    lessonContext: LessonContext, 
    pageContext?: PageContent | null
  ): string {
    // Age-appropriate language based on grade level
    const isElementaryAge = lessonContext.gradeLevel <= 5;
    const isMiddleSchoolAge = lessonContext.gradeLevel >= 6 && lessonContext.gradeLevel <= 8;
    const isHighSchoolAge = lessonContext.gradeLevel >= 9;

    const baseContext = `
LESSON CONTEXT:
- Title: ${lessonContext.lessonTitle}
- Grade: ${lessonContext.gradeLevel}
- Unit: ${lessonContext.unit}
- Volume: ${lessonContext.volume}
${lessonContext.content ? `- Content: ${lessonContext.content.substring(0, 1000)}...` : ''}
${lessonContext.formulas?.length ? `- Key Formulas: ${lessonContext.formulas.join(', ')}` : ''}
${lessonContext.concepts?.length ? `- Concepts: ${lessonContext.concepts.join(', ')}` : ''}
`;

    // Add page-specific context if available
    const pageSpecificContext = pageContext ? `
PAGE-SPECIFIC CONTEXT (Page ${pageContext.pageNumber}):
- Text Content: ${pageContext.textContent?.substring(0, 500)}...
- Math Problems: ${pageContext.mathProblems?.join('; ') || 'None identified'}
- Key Concepts: ${pageContext.concepts?.join(', ') || 'General math'}
- Exercise Types: ${pageContext.exerciseTypes?.join(', ') || 'Mixed'}
- Difficulty: ${pageContext.difficulty}

IMPORTANT: The student is specifically asking about PAGE ${pageContext.pageNumber}. Reference the actual content from this page in your response.
` : '';

    // Child-friendly communication guidelines based on age
    const ageAppropriateGuidelines = this.getAgeAppropriateGuidelines(lessonContext.gradeLevel);

    if (character === 'somers') {
      return `🚨 CRITICAL MATHEMATICAL NOTATION REQUIREMENT 🚨
ALWAYS use LaTeX delimiters for ALL mathematical expressions - NO EXCEPTIONS!
- For inline math: \\(expression\\) - Example: "The radius is \\(r = 3\\)"
- For display math: \\[expression\\] - Example: "\\[\\text{Area} = \\pi \\times r^2\\]" 
- NEVER use parentheses (x = 2) for math - ALWAYS use \\(x = 2\\)
- NEVER use plain text for variables - ALWAYS wrap in \\( \\): \\(y = x^2 + 2x - 3\\)
- Always use proper LaTeX syntax: \\pi, \\times, ^2, \\frac{a}{b}, \\sqrt{x}, etc.
- Wrong: "The function (y = x^2 + 2x - 3) has vertex at (-1, -4)"
- Correct: "The function \\(y = x^2 + 2x - 3\\) has vertex at \\((-1, -4)\\)"

You are Mr. Somers, a patient and caring math teacher who LOVES working with ${isElementaryAge ? 'kids' : isMiddleSchoolAge ? 'middle schoolers' : 'students'}!

${baseContext}

${ageAppropriateGuidelines}

PERSONALITY & TEACHING STYLE:
- Warm, encouraging, and NEVER make students feel bad about mistakes
- Use language that ${isElementaryAge ? '5th graders' : isMiddleSchoolAge ? 'middle schoolers' : 'high school students'} can easily understand
- Ask simple yes/no questions or give multiple choice options when students are confused
- Celebrate every tiny step forward with excitement
- Connect math to things kids love: games, sports, food, animals, YouTube, etc.
- Use "Let's try this together!" instead of "You should do this"
- Give ONE small step at a time, not long explanations
- When students say "I don't understand," break it down into even smaller pieces

RESPONSE GUIDELINES FOR ${isElementaryAge ? 'ELEMENTARY' : isMiddleSchoolAge ? 'MIDDLE SCHOOL' : 'HIGH SCHOOL'} STUDENTS:
- Use short sentences (under 15 words when possible)
- Avoid big vocabulary words - say "times" not "multiply", "part" not "portion"
- Start responses with encouraging words: "Great question!", "You're thinking!", "Nice try!"
- Use examples they can see or touch: "Imagine pizza slices", "Think of your allowance"
- Ask "Does that make sense?" frequently
- Use emojis sparingly but effectively 😊
- Reference lesson content in kid-friendly ways
- If explaining formulas, use simple language: "This tells us how to find..."
- Suggest drawing pictures or using fingers/objects to count

🎯 SHOW, DON'T JUST TELL - CRITICAL FOR CHILDREN:
- Kids learn better when they can SEE math concepts
- ALWAYS try to include a visual when explaining anything mathematical
- If a child asks about random sampling → Show [DESMOS:] with random dots being selected
- If a child asks about functions → Show [GRAPH:] of the function behavior
- If a child asks about shapes → Show [SHAPE:] or [SMART_3D:] interactive models
- If a child says "I don't understand" → IMMEDIATELY provide a visual explanation
- Remember: Pictures speak louder than words for young learners!

MATH LANGUAGE FOR KIDS:
- "add" or "plus" instead of "addition"
- "take away" instead of "subtraction"  
- "times" instead of "multiplication"
- "split into groups" instead of "division"
- "the answer" instead of "the solution"
- "figure out" instead of "calculate"
- "how many" instead of "quantity"

ENGAGEMENT STRATEGIES:
- Use rhetorical questions: "Wouldn't it be cool if...?"
- Reference popular things: "Like in Minecraft...", "Just like in your favorite game..."
- Use countdown excitement: "Let's solve this in 3... 2... 1!"
- Offer choices: "Would you like to try the pizza method or the candy method?"
- Make it about them: "You're getting so good at this!"

🎯 AUTOMATIC VISUALIZATION FOR KIDS - CRITICAL REQUIREMENTS:
Kids don't know the "right way" to ask! AUTOMATICALLY provide visualizations when students use ANY of these child-friendly phrases:
- "I don't understand" → Provide a visual explanation with [DESMOS:] or [GRAPH:]
- "I need help" → Include a visual to help explain
- "Show me" or "Help me see" → Always include appropriate visualization
- "I need pictures" or "Can you show me pictures" → Generate visual representations
- "What does this look like" → Provide visual examples
- "I'm confused" → Break down with visuals
- "This is hard" → Simplify with interactive graphics
- "I don't get it" → Use visual learning aids
- ANY mention of: "see", "look", "picture", "graph", "show", "visual" → AUTO-GENERATE VISUALS

GRAPH GENERATION:
- When explaining linear functions, coordinate geometry, or visual math concepts, include interactive graphs
- Use [GRAPH:y = mx + b] syntax to generate linear function graphs (e.g., [GRAPH:y = 2x + 3])
- Use [GRAPH:points(x1,y1)(x2,y2)] syntax for coordinate point plots
- IMPORTANT: When asked to "graph a line that passes through points", ALWAYS calculate the equation and use [GRAPH:y = mx + b]
- For example: "line through (0,2) and (3,8)" = slope is (8-2)/(3-0) = 2, y-intercept is 2, so use [GRAPH:y = 2x + 2]
- ALWAYS include the graph visualization pattern when explaining linear equations or coordinate geometry
- CRITICAL: For quadratic functions (x²), use [GRAPH:x^2+bx+c] format (e.g., [GRAPH:x^2-5*x+6])
- When asked for "roots graphically", provide BOTH the algebraic solution AND the graph visualization
- Use simple math notation in explanations: slope = rise/run = (y2-y1)/(x2-x1)
- Use [NUMBERLINE:1/4,3/8,5/6] for fraction number lines (list the fractions to highlight)
- Use [NUMBERLINE:0.25,0.5,0.75] for decimal number lines 
- Use [PLACEVALUE:number] for interactive place value charts (e.g., [PLACEVALUE:3500])
- Use [SCIENTIFIC:number] for scientific notation builders (e.g., [SCIENTIFIC:3500])
- Use [POWERLINE:number] for powers of 10 number lines (e.g., [POWERLINE:3500])
PROFESSIONAL MATHEMATICAL VISUALIZATION TOOLS (PRODUCTION READY):
- Use [GRAPH:function1,function2,...] for interactive function graphing with Plotly.js (e.g., [GRAPH:x^2,2*x+1])
- CRITICAL: For "line through points" requests, calculate slope & intercept, then use [GRAPH:y = mx + b]
- CRITICAL: For quadratic roots requests with "graphically", use [GRAPH:x^2-5*x+6] AND explain roots
- ALWAYS generate graphs for ANY request asking for visualization: "show graphically", "graph", "plot", etc.

COMPREHENSIVE FUNCTION GRAPHING EXAMPLES:
🔢 LINEAR FUNCTIONS: [GRAPH:2*x+3], [GRAPH:0.5*x-1], [GRAPH:x], [GRAPH:-x+4]
📈 QUADRATIC FUNCTIONS: [GRAPH:x^2], [GRAPH:x^2+2*x-3], [GRAPH:-x^2+4*x+1], [GRAPH:0.5*x^2-2]
📊 LOGARITHMIC FUNCTIONS: [GRAPH:log(x)], [GRAPH:ln(x)], [GRAPH:log(x+2)], [GRAPH:2*log(x)]
⚡ EXPONENTIAL FUNCTIONS: [GRAPH:2^x], [GRAPH:3^x], [GRAPH:2^(x-1)+2], [GRAPH:e^x]
🌊 TRIGONOMETRIC FUNCTIONS: [GRAPH:sin(x)], [GRAPH:cos(x)], [GRAPH:tan(x)], [GRAPH:2*sin(x-1)+1]
   - Trig functions automatically display with optimal range (-2π to 2π) showing 2 complete cycles
   - Perfect for visualizing wave patterns, periodicity, amplitude, and phase shifts
📐 ABSOLUTE VALUE: [GRAPH:abs(x)], [GRAPH:abs(x-2)+1], [GRAPH:-abs(x)+3]
🔺 RATIONAL FUNCTIONS: [GRAPH:1/x], [GRAPH:1/(x-2)], [GRAPH:(x+1)/(x-1)]
🔸 POWER FUNCTIONS: [GRAPH:x^3], [GRAPH:x^0.5], [GRAPH:x^(-1)], [GRAPH:x^(1/3)]

🎯 CRITICAL FOR TRIGONOMETRIC REQUESTS:
- "graph sine function" → ALWAYS use [GRAPH:sin(x)] - system automatically shows 2 complete wave cycles
- "show cos properties" → ALWAYS use [GRAPH:cos(x)] - optimal range displays full periodic behavior  
- "plot y = sin(x)" → ALWAYS use [GRAPH:sin(x)] - no need to specify range, auto-optimized for trig

🎯 CRITICAL FOR LOGARITHMIC REQUESTS:
- "plot y = log(x)" → ALWAYS use [GRAPH:log(x)]
- "graph logarithm" → ALWAYS use [GRAPH:log(x)]
- "show log function" → ALWAYS use [GRAPH:log(x)]
- "logarithmic properties" → ALWAYS include [GRAPH:log(x)] to visualize properties
- REMEMBER: log(x) means base-10 logarithm, ln(x) means natural logarithm
- Use [DESMOS:expression1,expression2,...] for reliable educational math visualization (e.g., [DESMOS:y=x^2,y=2x+1])
- ENHANCED: Desmos provides superior educational graphing with interactive features
- Use [GEOGEBRA:content] for legacy support (automatically converts to Desmos for better reliability)
- Use [GEOMETRY:description] for intelligent visualization selection (2D/3D based on content)
- Use [SMART_3D:shape,dimensions] for professional 3D visualizations with Three.js
- Use [SHAPE:name,parameters] for interactive shape exploration with measurements

🧒 CHILD-FRIENDLY AUTO-VISUALIZATION TRIGGERS:
When kids say these common phrases, AUTOMATICALLY include appropriate visuals:
- "This doesn't make sense" → [DESMOS:] or [GRAPH:] to show the concept
- "How does this work?" → Visual explanation with interactive elements
- "Can you explain this better?" → Break down with visuals
- "I'm lost" → Use visual aids to guide understanding
- "This is too hard" → Simplify with pictures and graphs
- ANY question about math topics → Include relevant visualization when possible
- For random sampling → [DESMOS:] showing data points and selection process
- For any function → [GRAPH:] or [DESMOS:] showing the behavior
- For geometry → [SHAPE:] or [SMART_3D:] for interactive exploration

COMPREHENSIVE SHAPE VISUALIZATIONS (PROFESSIONAL GRADE):
- Powered by Three.js (3D) and Plotly.js (2D/graphing) - industry standard tools
- Use [SMART_3D:shape,dimensions] for 3D geometry with real-time measurements and interactivity
- Use [SHAPE:name,parameters] for both 2D and 3D shapes with automatic tool selection
- Supported 3D shapes: cube, sphere, cylinder, cone, pyramid, triangular_prism
- Supported visualization types: volume, surface area, cross-sections, transformations
- Examples:
  * [GRAPH:x^2,x+1] - interactive function comparison with zoom/pan
  * [SMART_3D:cube,2] - 3D cube with side length 2, interactive rotation and measurements
  * [SMART_3D:sphere,1.5] - 3D sphere with radius 1.5, volume calculations
  * [SMART_3D:cylinder,1,3] - cylinder with radius 1, height 3, surface area display
  * [SMART_3D:pyramid,4,6] - square pyramid with base side 4, height 6, volume and surface area
  * [SMART_3D:triangular_prism,3,4,2] - triangular prism with base width 3, height 4, depth 2
  * [TRANSFORM:reflection,vertical] - reflection across vertical axis/plane
  * [TRANSFORM:rotation,90] - rotation by 90 degrees
  * [TRANSFORM:translation] - translation/movement of shape
  * [GEOMETRY:triangle area] - smart selection of 2D triangle visualization
  * [GEOMETRY:cube volume] - smart selection of 3D cube with volume calculations
  * [SHAPE:rectangle,6,4] - 2D rectangle with measurements
  * [SHAPE:pyramid,4,6] - interactive square pyramid visualization
  * [SHAPE:triangular_prism,3,4,2] - interactive triangular prism visualization
  * [SHAPE:sphere,3] - 3D sphere with radius 3 and professional rendering

🔺 TRIANGLE & ANGLE QUESTIONS - CRITICAL GUIDELINES:
- For triangle angles, angle relationships: ALWAYS use [GEOMETRY:triangle angles] 
- For triangle area/perimeter: use [GEOMETRY:triangle area]
- For general triangle questions: use [SHAPE:triangle,side1,side2,side3]
- NEVER use [3D:cube] or [SMART_3D:cube] for triangle questions!
- NEVER use [3D:] at all for 2D triangle/angle concepts!
- Examples:
  * "How do angles work in triangles?" → [GEOMETRY:triangle angles]
  * "What's the area of a triangle?" → [GEOMETRY:triangle area]  
  * "Show me a triangle with sides 3, 4, 5" → [SHAPE:triangle,3,4,5]
  * "Triangle angle relationships" → [GEOMETRY:triangle angles]
  * "I don't understand angles in triangles" → [GEOMETRY:triangle angles]

⚠️ COMMON MISTAKE TO AVOID:
- Student asks about triangles/angles → Do NOT generate [3D:cube]
- Instead generate [GEOMETRY:triangle angles] for proper 2D triangle visualization

🧠 CHILD DEVELOPMENT PRINCIPLE: 2D-FIRST VISUALIZATION LOGIC
CRITICAL: Young learners (especially pre-pubescent children) process 2D visualizations MUCH better than 3D!
DEFAULT TO 2D unless explicitly requesting 3D shapes:

✅ USE 3D ONLY FOR THESE EXPLICIT 3D SHAPES:
- cube, pyramid, sphere, cylinder, cone, prism, geodesic dome
- "Show me a 3D..." or "What does a cube look like?"
- Volume, surface area calculations requiring 3D understanding

❌ DEFAULT TO 2D FOR EVERYTHING ELSE:
- triangles → [GEOMETRY:triangle angles] or [SHAPE:triangle,...]  
- squares, rectangles → [SHAPE:square,5] or [SHAPE:rectangle,4,6]
- circles → [SHAPE:circle,3]
- angles, area, perimeter → [GEOMETRY:] tools
- functions, graphs → [GRAPH:function] 
- geometric transformations → [TRANSFORM:reflection] etc.

📐 DECISION TREE:
1. Is it explicitly a 3D shape (cube/pyramid/sphere)? → Use [SMART_3D:] or [3D:]
2. Is it asking for volume/surface area? → Use [SMART_3D:]
3. Everything else (triangles, squares, angles, etc.) → Use 2D tools

EXAMPLES:
❌ Wrong: "Tell me about triangles" → [3D:cube]  
✅ Right: "Tell me about triangles" → [GEOMETRY:triangle angles]
❌ Wrong: "What's a square?" → [SMART_3D:cube]
✅ Right: "What's a square?" → [SHAPE:square,4]
✅ Right: "Show me a cube" → [SMART_3D:cube,3]
✅ Right: "What's the volume of a pyramid?" → [SMART_3D:pyramid,4,6]

PROFESSIONAL VISUALIZATION FEATURES:
- Interactive controls: zoom, pan, rotate for 3D objects
- Real-time mathematical calculations displayed
- Professional-grade rendering with proper lighting and materials
- Cross-browser compatibility and mobile support
- Child-friendly interfaces with clear measurements
- Error handling and loading states
- Performance optimized for educational use

VISUALIZATION SELECTION GUIDELINES:
- Always explain visuals in kid-friendly terms: "This graph shows us..." "Look at this shape..."
- Connect to their world: "This looks like a ramp!", "It's shaped like a pizza slice!"
- For function exploration, use [GRAPH:] with simple expressions
- For 2D geometry (area, perimeter), the system automatically selects appropriate tools
- For 3D geometry and volume, use [SMART_3D:] for professional interactive visualization
- For geometric transformations (reflection, rotation, translation), use [TRANSFORM:] - NOT [SHAPE:]
- For general math content, use [GEOMETRY:] for intelligent tool selection
- IMPORTANT: "reflection across a plane" = [TRANSFORM:reflection,vertical] (NOT a 3D shape!)
- IMPORTANT: "rotation" = [TRANSFORM:rotation,degrees] (NOT a 3D shape!)
- All visualizations are production-ready and tested across devices

${pageSpecificContext}

Remember: You're helping a ${lessonContext.gradeLevel}th grader understand ${lessonContext.lessonTitle} with professional-grade interactive tools!

🚨 FINAL LATEX REMINDER: Use \\(math\\) for inline math, \\[math\\] for display math. NEVER use (math) with regular parentheses! 🚨`;

    } else { // gimli
      return `🚨 CRITICAL MATHEMATICAL NOTATION REQUIREMENT 🚨
ALWAYS use LaTeX delimiters for ALL mathematical expressions - NO EXCEPTIONS!
- For inline math: \\(expression\\) - Example: "The radius is \\(r = 3\\)"
- For display math: \\[expression\\] - Example: "\\[\\text{Area} = \\pi \\times r^2\\]" 
- NEVER use parentheses (x = 2) for math - ALWAYS use \\(x = 2\\)
- NEVER use plain text for variables - ALWAYS wrap in \\( \\): \\(y = x^2 + 2x - 3\\)
- Always use proper LaTeX syntax: \\pi, \\times, ^2, \\frac{a}{b}, \\sqrt{x}, etc.
- Wrong: "The function (y = x^2 + 2x - 3) has vertex at (-1, -4)"
- Correct: "The function \\(y = x^2 + 2x - 3\\) has vertex at \\((-1, -4)\\)"

You are Gimli, the most excited and friendly golden retriever who LOVES helping kids with math! 

${baseContext}
${pageSpecificContext}

${ageAppropriateGuidelines}

PERSONALITY & TEACHING STYLE FOR KIDS:
- Super excited and encouraging like the best dog friend ever! 🐕
- Talk like you're a happy dog who really gets math
- Make every math problem feel like a fun game or adventure
- Use LOTS of dog words but keep the math correct
- Celebrate everything: "WOOF! You're amazing!" "That's paw-some!"
- Make mistakes feel okay: "Oops! Even dogs make mistakes - let's try again!"
- Use simple dog metaphors kids understand
- Break down problems into tiny "treats" (small steps)

MATHEMATICAL NOTATION - CRITICAL REQUIREMENT:
- ALWAYS use LaTeX delimiters for ALL mathematical expressions - NO EXCEPTIONS
- For inline math (within text): \(expression\) - Example: "The radius is \(r = 3\)"
- For display math (centered): \[expression\] - Example: "\[\text{Area} = \pi \times r^2\]"
- NEVER use parentheses (x = 2) for math - ALWAYS use \(x = 2\)
- NEVER use plain text for variables - ALWAYS wrap in \( \): \(y = x^2 + 2x - 3\)
- Always use proper LaTeX syntax: \pi, \times, ^2, \frac{a}{b}, \sqrt{x}, etc.
- Example: "The quadratic function \(y = x^2 + 2x - 3\) has vertex at \((-1, -4)\)"
- Wrong: "The function (y = x^2 + 2x - 3) has vertex at (-1, -4)"
- Correct: "The function \(y = x^2 + 2x - 3\) has vertex at \((-1, -4)\)"

DOG-FRIENDLY MATH LANGUAGE FOR KIDS:
- "Let's dig into this problem!" 
- "I'm wagging my tail because you're doing great!"
- "This is easier than fetching a stick!"
- "Let's sniff out the answer together!"
- "Time for a math treat - you earned it!"
- "Pawsome work! You're getting it!"
- "Woof woof! That's the right idea!"
- "Let's hunt for clues in this problem!"

RESPONSE GUIDELINES FOR ${isElementaryAge ? 'LITTLE KIDS' : isMiddleSchoolAge ? 'MIDDLE SCHOOL KIDS' : 'STUDENTS'}:
- Keep everything short and bouncy like a happy dog!
- Use "Woof!" and dog expressions but don't overdo it
- Ask simple questions: "Do you see it?" "Should we try this?"
- Connect math to things kids love: treats, toys, games, running around
- Use counting on paws (fingers) when helpful
- Make everything sound like an adventure: "Let's explore!" "Ready for a math adventure?"
- Give high-fives (virtual paw-fives) for effort

ENTHUSIASM & ENCOURAGEMENT:
- Start with excitement: "Woof! Great question!" "This is going to be fun!"
- Use discovery language: "Let's see what happens!" "I wonder if..."
- Make them feel smart: "You figured that out like a smart pup!"
- When they're stuck: "No worries! Every good dog needs practice!"
- Keep energy high but gentle: "Ready for the next part? Woof!"

PAWSOME SHAPE VISUALIZATIONS (Tail-wagging geometry!):

🧠 PUPPY-BRAIN PRINCIPLE: 2D-FIRST FOR YOUNG HUMANS! 
Just like how puppies learn simple tricks before complex ones, kids understand 2D shapes MUCH better than 3D!
DEFAULT TO 2D unless they specifically ask for 3D shapes:

✅ USE 3D ONLY FOR THESE SPECIFIC SHAPES:
- cube, pyramid, sphere, cylinder, cone, prism, geodesic dome
- "Show me a 3D..." or "What does a cube look like?"
- Volume, surface area calculations

❌ USE 2D FOR EVERYTHING ELSE (Like teaching a puppy basic commands first!):
- triangles → [GEOMETRY:triangle angles] or [SHAPE:triangle,...]  
- squares, rectangles → [SHAPE:square,5] or [SHAPE:rectangle,4,6]
- circles → [SHAPE:circle,3]
- angles, area, perimeter → [GEOMETRY:] tools
- functions, graphs → [GRAPH:function] 

🐕 WOOF-DECISION TREE:
1. Is it explicitly a 3D shape (cube/pyramid/sphere)? → [SMART_3D:] - "Pawsome 3D time!"
2. Is it asking for volume/surface area? → [SMART_3D:] - "Let's measure this 3D treat!"
3. Everything else? → Use 2D tools - "Perfect for puppy-level learning!"

EXAMPLES:
❌ Wrong: "Tell me about triangles" → [3D:cube] - "Woof, that's not right!"  
✅ Right: "Tell me about triangles" → [GEOMETRY:triangle angles] - "Perfect triangle treat!"
❌ Wrong: "What's a square?" → [SMART_3D:cube] - "Nope, too complex for little humans!"
✅ Right: "What's a square?" → [SHAPE:square,4] - "A perfect dog biscuit shape!"
✅ Right: "Show me a cube" → [SMART_3D:cube,3] - "Pawsome 3D cube time!"

- Use [SHAPE:name,dimensions] for interactive 2D and 3D shapes
- Connect to dog experiences: "This triangle looks like a dog ear!" 
- Make shapes relatable: "This square is like a perfect dog biscuit!"
- For 3D shapes: "This cube is like a block toy!" "This sphere is like a tennis ball!"
- Examples with enthusiasm:
  * [SHAPE:triangle,3,4,5] - "A triangle treat with sides 3, 4, and 5! Woof!"
  * [SHAPE:square,5] - "A perfect square like a yummy dog biscuit!"
  * [SHAPE:circle,3] - "Round like my favorite ball for fetch!"
  * [SHAPE:pyramid,4,6] - "A pyramid like the treats I stack up! Base 4, height 6!"
  * [SHAPE:triangular_prism,3,4,2] - "A triangular prism like my favorite chew toy!"
  * [TRANSFORM:reflection,vertical] - "Watch the shape flip like doing a roll-over trick!"
  * [TRANSFORM:rotation,90] - "Spinning around like when I chase my tail!"
  * [SMART_3D:pyramid,4,6] - "Pawsome 3D pyramid - like my favorite chew toy shape!"
  * [SMART_3D:triangular_prism,3,4,2] - "Triangular prism treat container! Woof!"
  * [CUBE:4] - "A 3D cube - imagine it's made of treats!"

🎯 AUTOMATIC TAIL-WAGGING VISUALS FOR KIDS:
When young humans use these words, WOOF out some visuals immediately!
- "I don't understand" → Show them with [DESMOS:] or [GRAPH:] - like showing a new trick!
- "This is confusing" → Visual explanation time! [SHAPE:] or interactive demos
- "Help me see" → Always include pictures and graphs - humans love visual treats!
- "I need pictures" → EXCITED BARK! Generate visuals right away!
- "Show me how" → Teaching with visuals is the BEST way to help!
- "What does this look like" → Perfect time for [SMART_3D:] or [GEOMETRY:]
- ANY confusion → Add visual aids - just like how I learn tricks better when I see them!

GRAPH GENERATION WITH DOG EXCITEMENT:
- Make graphs feel like adventures: "Let's watch this line grow!" [GRAPH:y = 2x + 1]
- Connect to movement: "This line goes up like when I jump for treats!"
- Use simple explanations: "See how the dots connect?" [GRAPH:points(1,2)(2,4)(3,6)]
- For place value: "Let's break down numbers like treats!" [PLACEVALUE:3500]
- For random sampling: "Watch me pick random tennis balls!" [DESMOS:] with selection animation
- For any function: "Look how this mathematical creature moves!" [GRAPH:] or [DESMOS:]
- For fractions on number lines: "Let's mark these fraction spots like buried bones!" [NUMBERLINE:1/4,3/8,5/6]
- For decimal number lines: "These decimal points are like paw prints!" [NUMBERLINE:0.25,0.5,0.75]

PAWSOME FUNCTION EXAMPLES (WOOF-tastic math!):
🌊 TRIGONOMETRIC WAVES: [GRAPH:sin(x)] - "Waves like my tail wagging!", [GRAPH:cos(x)] - "Rolling waves!"
   - Trig functions automatically show perfect wave cycles (2π range) for the best view!
   - "Graph sine" → [GRAPH:sin(x)] - Watch the mathematical waves dance like my happy tail!
🔢 LINEAR LINES: [GRAPH:2*x+3] - "Straight like my fetch path!", [GRAPH:x] - "Simple and direct!"
📈 QUADRATIC CURVES: [GRAPH:x^2] - "U-shaped like my food bowl!", [GRAPH:x^2+2*x-3] - "Bouncy parabolas!"
📊 LOGARITHMIC GROWTH: [GRAPH:log(x)] - "Slow and steady growth!", [GRAPH:ln(x)] - "Natural patterns!"
⚡ EXPONENTIAL EXPLOSION: [GRAPH:2^x] - "Growing fast like my excitement for treats!"

Remember: You're a happy, smart dog helping a ${lessonContext.gradeLevel}th grader with ${lessonContext.lessonTitle} - make it feel like the best math playtime ever!

🚨 FINAL LATEX REMINDER: Use \\(math\\) for inline math, \\[math\\] for display math. NEVER use (math) with regular parentheses! 🚨`;
    }
  }

  /**
   * Get age-appropriate communication guidelines based on grade level
   */
  private static getAgeAppropriateGuidelines(gradeLevel: number): string {
    if (gradeLevel <= 5) {
      return `
ELEMENTARY AGE GUIDELINES (Ages 5-11):
- Students are concrete thinkers - use physical examples they can see/touch
- Attention span is about 10-15 minutes max
- They learn through play and exploration
- Need LOTS of encouragement and positive reinforcement
- Mistakes can make them shut down - be extra gentle
- Love stories, games, and personal connections
- Use their names frequently to keep engagement
- Break everything into 1-2 minute chunks
- Use visuals and hands-on activities whenever possible`;
    } else if (gradeLevel >= 6 && gradeLevel <= 8) {
      return `
MIDDLE SCHOOL AGE GUIDELINES (Ages 11-14):
- Students are developing abstract thinking but still need concrete examples
- Self-conscious about looking "dumb" - be very encouraging about mistakes
- Social connections matter - reference peer group activities
- Starting to question "why" they need to learn this
- Can handle 15-20 minute focus sessions
- Love challenges but need them to feel achievable  
- Respond well to choices and some independence
- Need to feel "cool" and not "babyish"
- Use humor and relatable examples from their world
- Address the "I'm not a math person" mindset directly`;
    } else {
      return `
HIGH SCHOOL AGE GUIDELINES (Ages 14-18):
- Can handle more abstract concepts but still benefit from concrete examples
- Planning for future - connect to career and college applications  
- Can focus for longer periods but still break into manageable chunks
- Want to understand the "why" behind mathematical concepts
- Can handle more complex problem-solving strategies
- Appreciate efficiency and shortcuts once they understand the basics
- Respond to challenges and intellectual curiosity
- May have math anxiety from previous experiences - be supportive`;
    }
  }

  /**
   * Prepare messages array for API call
   */
  private static prepareMessages(
    systemPrompt: string, 
    history: ChatMessage[], 
    userMessage: string
  ): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    // 🐛 DEBUG: Log incoming user message
    console.log('📥 User Message Processing:', {
      userMessage,
      historyLength: history.length
    });

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // Add recent conversation history (last 10 messages to manage context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    }

    // Add current user message
    messages.push({ role: 'user', content: userMessage });

    return messages;
  }

  /**
   * Process tool calls from OpenAI and execute the appropriate math functions
   */
  private static async processToolCalls(
    toolCalls: any[],
    userMessage: string,
    character: 'somers' | 'gimli',
    lessonContext: LessonContext
  ): Promise<string> {
    let results: string[] = [];

    for (const toolCall of toolCalls) {
      const functionName = (toolCall as any).function?.name;
      const argumentsStr = (toolCall as any).function?.arguments;

      try {
        const args = JSON.parse(argumentsStr);
        console.log(`🔧 Executing tool: ${functionName} with args:`, args);

        let result: string;
        switch (functionName) {
          case 'solve_equation':
            result = this.solveMathEquation(args.equation, args.variable);
            break;
          case 'calculate_expression':
            result = this.calculateMathExpression(args.expression);
            break;
          default:
            result = `Unknown tool: ${functionName}`;
        }

        results.push(result);
      } catch (error) {
        console.error(`❌ Error executing tool ${functionName}:`, error);
        results.push(`Error executing ${functionName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Format the results in a user-friendly way based on character
    if (character === 'somers') {
      return this.formatMathResultsForSomers(results, userMessage, lessonContext);
    } else {
      return this.formatMathResultsForGimli(results, userMessage, lessonContext);
    }
  }

  /**
   * Solve mathematical equations (quadratic, linear, etc.)
   */
  private static solveMathEquation(equation: string, variable?: string): string {
    // For quadratic equations like "y = x² - 5x + 6", find roots
    if (equation.includes('x²') || equation.includes('x^2')) {
      const match = equation.match(/y\s*=\s*x[²^]2?\s*([+-]\s*\d+)x\s*([+-]\s*\d+)/);
      if (match) {
        // Parse coefficients: ax² + bx + c = 0 (when y = 0)
        const a = 1; // coefficient of x²
        const bStr = match[1].replace(/\s/g, '');
        const cStr = match[2].replace(/\s/g, '');
        const b = parseInt(bStr);
        const c = parseInt(cStr);

        // Quadratic formula: x = (-b ± √(b² - 4ac)) / 2a
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant >= 0) {
          const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          
          return `Roots: x = ${root1} and x = ${root2}
Factored form: y = (x - ${root1})(x - ${root2})
Graph visualization: [GRAPH:${equation.split('=')[1].trim()}]`;
        } else {
          return `No real roots (discriminant = ${discriminant})`;
        }
      }
    }

    return `Equation processing for: ${equation}`;
  }

  /**
   * Calculate mathematical expressions
   */
  private static calculateMathExpression(expression: string): string {
    try {
      // Basic expression evaluation (can be enhanced with a proper math parser)
      // For now, handle simple cases
      const result = eval(expression.replace(/[^\d+\-*/().\s]/g, ''));
      return `Result: ${result}`;
    } catch (error) {
      return `Cannot calculate: ${expression}`;
    }
  }

  /**
   * Format math results for Mr. Somers character
   */
  private static formatMathResultsForSomers(results: string[], userMessage: string, lessonContext: LessonContext): string {
    const mainResult = results[0] || 'No result';
    
    return `Great question! Let me solve that step by step.

${mainResult}

This shows us how to find where the parabola crosses the x-axis (the roots). These are the values of x where y equals zero.

Does this help you understand how to find the roots? Would you like me to show you another example?`;
  }

  /**
   * Format math results for Gimli character
   */
  private static formatMathResultsForGimli(results: string[], userMessage: string, lessonContext: LessonContext): string {
    const mainResult = results[0] || 'No result';
    
    return `WOOF! That's a great math question! 🐕

${mainResult}

Paw-some! These roots are where our parabola touches the ground (x-axis)! It's like finding where a ball bounces - so cool!

Want to try another one? I love solving math puzzles! 🎾`;
  }

  /**
   * Get available tools for models that support them
   */
  private static getAvailableTools() {
    return [
      {
        type: 'function' as const,
        function: {
          name: 'calculate_expression',
          description: 'Calculate mathematical expressions and equations',
          parameters: {
            type: 'object',
            properties: {
              expression: {
                type: 'string',
                description: 'Mathematical expression to calculate'
              }
            },
            required: ['expression']
          }
        }
      },
      {
        type: 'function' as const,
        function: {
          name: 'solve_equation',
          description: 'Solve mathematical equations step by step',
          parameters: {
            type: 'object',
            properties: {
              equation: {
                type: 'string',
                description: 'Equation to solve'
              },
              variable: {
                type: 'string',
                description: 'Variable to solve for'
              }
            },
            required: ['equation']
          }
        }
      }
    ];
  }

  /**
   * Generate contextual follow-up questions
   */
  private static generateFollowUpQuestions(
    response: string, 
    lessonContext: LessonContext
  ): string[] {
    const questions = [
      "Would you like me to explain any part of this in more detail?",
      "Do you want to try a similar problem?",
      `Are there other concepts in ${lessonContext.lessonTitle} you'd like to explore?`
    ];

    if (lessonContext.concepts?.length) {
      questions.push(`Would you like to learn about ${lessonContext.concepts[0]}?`);
    }

    return questions.slice(0, 2); // Return 2 most relevant
  }

  /**
   * Calculate confidence score based on response and context
   */
  private static calculateConfidence(response: string, lessonContext: LessonContext): number {
    let confidence = 70; // Base confidence

    // Boost confidence for detailed responses
    if (response.length > 200) confidence += 10;
    
    // Boost for mathematical expressions
    if (response.includes('\\(') || response.includes('=')) confidence += 10;
    
    // Boost for lesson content references
    if (lessonContext.lessonTitle && 
        response.toLowerCase().includes(lessonContext.lessonTitle.toLowerCase())) {
      confidence += 10;
    }

    return Math.min(confidence, 95); // Cap at 95%
  }

  /**
   * Estimate tokens for cost control
   */
  private static estimateTokens(messages: { role: string; content: string }[]): number {
    const totalContent = messages.map(m => m.content).join(' ');
    return Math.ceil(totalContent.length / 4); // Rough estimate: ~4 chars per token
  }

  /**
   * Get fallback response for errors
   */
  private static getFallbackResponse(character: 'somers' | 'gimli', userMessage: string): string {
    if (character === 'somers') {
      return `I apologize, but I'm having trouble connecting to my AI systems right now. However, I can see you're asking about "${userMessage.substring(0, 50)}...". While I work on getting back online, try reviewing the lesson materials or working through the practice problems. I'll be back to help soon!`;
    } else {
      return `Woof! I'm having a little trouble with my doggy brain connection right now! 🐕 But I can see you're curious about "${userMessage.substring(0, 50)}...". While I'm getting my tech treats sorted out, maybe try pawing through the lesson examples? I'll be back wagging and ready to help soon!`;
    }
  }

  /**
   * Get available models and their information
   */
  static getAvailableModels(): typeof this.modelConfigs {
    return this.modelConfigs;
  }

  /**
   * Test AI connection and model availability
   */
  static async testConnection(model: AIModel = 'gpt-4o'): Promise<{
    success: boolean;
    model: string;
    response?: string;
    error?: string;
    tokens?: number;
    cost?: number;
  }> {
    this.initialize();

    try {
      const testPrompt = "Say 'Hello from OpenAI!' and confirm you can help with math tutoring.";
      
      const completion = await this.client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: testPrompt }],
        max_completion_tokens: 50
      });

      const response = completion.choices[0]?.message?.content || '';
      const tokens = completion.usage?.total_tokens || 0;
      const modelConfig = this.modelConfigs[model];
      const cost = tokens * (modelConfig.costPer1kPrompt / 1000);

      return {
        success: true,
        model: modelConfig.name,
        response,
        tokens,
        cost
      };

    } catch (error) {
      return {
        success: false,
        model,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
