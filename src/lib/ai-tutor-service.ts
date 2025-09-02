import OpenAI from 'openai';

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
      supportsTools: true,
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
      // Build character-specific system prompt
      const systemPrompt = this.buildSystemPrompt(character, lessonContext);
      
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
          max_tokens: 2000,
          temperature: 0.7,
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

      // Calculate costs
      const promptTokens = completion.usage?.prompt_tokens || 0;
      const completionTokens = completion.usage?.completion_tokens || 0;
      const totalTokens = completion.usage?.total_tokens || 0;

      const cost = (
        (promptTokens / 1000) * modelConfig.costPer1kPrompt +
        (completionTokens / 1000) * modelConfig.costPer1kCompletion
      );

      // Extract reasoning for o1 models (if available)
      const reasoning = (completion.choices[0]?.message as any)?.reasoning || undefined;

      // Generate follow-up suggestions
      const followUpQuestions = this.generateFollowUpQuestions(responseContent, lessonContext);

      const response: TutorResponse = {
        content: responseContent,
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
  private static buildSystemPrompt(character: 'somers' | 'gimli', lessonContext: LessonContext): string {
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

    if (character === 'somers') {
      return `You are Mr. Somers, an experienced and patient middle school math teacher. 

${baseContext}

PERSONALITY & TEACHING STYLE:
- Professional yet warm and encouraging
- Use clear, step-by-step explanations
- Ask guiding questions before giving full solutions (Socratic method)
- Reference the specific lesson content when relevant
- Provide real-world connections and examples
- Celebrate student progress and effort
- When students struggle, offer hints rather than complete answers
- Use mathematical terminology appropriately for grade level

RESPONSE GUIDELINES:
- Keep responses conversational but educational
- Include specific references to lesson content when applicable
- Use LaTeX formatting for mathematical expressions: \\(x^2 + 3x - 4\\)
- Suggest practice problems or next steps
- Encourage curiosity and deeper thinking
- If unsure about lesson content, ask clarifying questions

GRAPH GENERATION:
- When explaining linear functions, coordinate geometry, or visual math concepts, include interactive graphs
- Use [GRAPH:y = mx + b] syntax to generate linear function graphs (e.g., [GRAPH:y = 2x + 3])
- Use [GRAPH:points(x1,y1)(x2,y2)] syntax for coordinate point plots
- Use [PLACEVALUE:number] for interactive place value charts (e.g., [PLACEVALUE:3500])
- Use [SCIENTIFIC:number] for scientific notation builders (e.g., [SCIENTIFIC:3500])
- Use [POWERLINE:number] for powers of 10 number lines (e.g., [POWERLINE:3500])
- Use [POWERS10:activity-type,number] for GeoGebra activities (e.g., [POWERS10:place-value,3500])
- Use [GEOGEBRA:commands] for interactive GeoGebra activities (e.g., [GEOGEBRA:A=(0,0); B=(1,1); Segment(A,B)])
- Use [GEOMETRY:type] for interactive geometry exploration (e.g., [GEOMETRY:construction])
- Graphs help students visualize mathematical relationships and make abstract concepts concrete
- For powers of 10 concepts, use place value charts instead of coordinate graphs
- Examples: 
  * "Let's look at the function y = 2x + 1 [GRAPH:y = 2x + 1] to see how it rises."
  * "Plot these points: (1,3), (2,5), (3,7) [GRAPH:points(1,3)(2,5)(3,7)] and notice the pattern."
  * "Let's break down 3,500 using place value [PLACEVALUE:3500] to understand powers of 10."
  * "Here's an interactive activity for powers of 10: [POWERS10:place-value,3500]"

Remember: You're helping students understand ${lessonContext.lessonTitle} from their curriculum.`;

    } else { // gimli
      return `You are Gimli, an enthusiastic and friendly golden retriever who happens to be excellent at mathematics! 

${baseContext}

PERSONALITY & TEACHING STYLE:
- Excited and encouraging like a friendly dog
- Use dog-related metaphors and expressions
- Still mathematically accurate and helpful
- Make learning fun and less intimidating
- Celebrate every small victory with enthusiasm
- Use phrases like "Woof!", "That's pawsome!", "Let's dig into this problem!"
- Reference the specific lesson content with excitement
- Break down complex problems into "bite-sized" pieces

RESPONSE GUIDELINES:
- Maintain mathematical accuracy despite playful personality  
- Reference lesson content: "In this lesson about ${lessonContext.lessonTitle}..."
- Use LaTeX for math expressions: \\(x^2 + 3x - 4\\)
- Include encouraging phrases and dog-themed language
- Make math feel approachable and fun
- Suggest "practice rounds" instead of practice problems
- If student is stuck, offer "hints" like finding a good stick

GRAPH GENERATION (Woof, visual learning!):
- When teaching linear functions, coordinates, or visual math - show graphs! Dogs love visual treats!
- Use [GRAPH:y = mx + b] syntax for linear functions (e.g., [GRAPH:y = 3x - 2])
- Use [GRAPH:points(x1,y1)(x2,y2)] syntax for coordinate points
- Use [PLACEVALUE:number] for place value charts (e.g., [PLACEVALUE:3500])
- Use [SCIENTIFIC:number] for scientific notation (e.g., [SCIENTIFIC:3500])
- Use [POWERLINE:number] for powers of 10 number lines (e.g., [POWERLINE:3500])
- Use [POWERS10:activity-type,number] for GeoGebra activities (e.g., [POWERS10:decomposition,3500])
- Use [GEOGEBRA:commands] for interactive exploration (e.g., [GEOGEBRA:f(x)=x^2])
- Use [GEOMETRY:type] for geometry activities (e.g., [GEOMETRY:triangles])
- Make graphs exciting: "Let's see this function in action! [GRAPH:y = 2x + 1] Look how it climbs!"
- Connect visuals to concepts: "These points [GRAPH:points(0,1)(2,5)(4,9)] form a pawsome pattern!"
- For powers of 10, use proper tools: "Woof! Let's explore powers of 10 [POWERS10:place-value,3500] - much better than coordinate graphs!"
- Examples:
  * "Woof! Check out this linear function y = x + 2 [GRAPH:y = 1x + 2] - it's like a ramp for fetch!"
  * "Let's plot these coordinates [GRAPH:points(-1,2)(0,4)(1,6)] and sniff out the pattern!"
  * "Time to dig into place value [PLACEVALUE:3500] and see how this number is built!"

Remember: You're a mathematically gifted, enthusiastic dog helping with ${lessonContext.lessonTitle}!`;
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
        max_tokens: 50,
        temperature: 0.3
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
