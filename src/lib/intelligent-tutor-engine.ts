/**
 * Intelligent Tutor Engine
 * Analyzes lesson content and dynamically selects appropriate tools based on user queries
 */

export interface LessonAnalysis {
  topics: string[];
  mathConcepts: string[];
  visualizationNeeds: string[];
  difficulty: 'elementary' | 'middle' | 'high';
  suggestedTools: ToolType[];
  keyTerms: string[];
  objectives: string[];
}

export interface ToolType {
  name: string;
  category: 'visualization' | 'calculation' | 'practice' | 'explanation';
  applicableTopics: string[];
  complexity: number;
  syntax: string;
}

export interface UserQuery {
  text: string;
  intent: 'explain' | 'visualize' | 'practice' | 'calculate' | 'explore';
  topics: string[];
  toolNeeds: ToolType[];
  complexity: number;
}

export class IntelligentTutorEngine {
  private availableTools: ToolType[] = [
    // Visualization Tools
    {
      name: 'GeoGebra3D',
      category: 'visualization',
      applicableTopics: ['geometry', '3d shapes', 'plane sections', 'volume', 'surface area'],
      complexity: 3,
      syntax: '[3D:shape_name,param1,param2,...]'
    },
    {
      name: 'GeoGebra2D',
      category: 'visualization',
      applicableTopics: ['algebra', 'functions', '2d geometry', 'graphing'],
      complexity: 2,
      syntax: '[GRAPH:function_or_shape]'
    },
    {
      name: 'ShapeExplorer',
      category: 'visualization',
      applicableTopics: ['shapes', 'polygons', 'circles', 'basic geometry'],
      complexity: 1,
      syntax: '[SHAPE:name,dimensions]'
    },
    {
      name: 'PowersOf10',
      category: 'visualization',
      applicableTopics: ['scientific notation', 'decimals', 'place value', 'exponents'],
      complexity: 2,
      syntax: '[POWERS10:type,number]'
    },
    
    // Calculation Tools
    {
      name: 'Calculator',
      category: 'calculation',
      applicableTopics: ['arithmetic', 'algebra', 'basic math'],
      complexity: 1,
      syntax: '[CALC:expression]'
    },
    {
      name: 'StepBySolver',
      category: 'calculation',
      applicableTopics: ['equations', 'algebra', 'problem solving'],
      complexity: 3,
      syntax: '[SOLVE:equation]'
    },
    
    // Practice Tools
    {
      name: 'InteractiveExercise',
      category: 'practice',
      applicableTopics: ['any'],
      complexity: 2,
      syntax: '[PRACTICE:topic,difficulty]'
    }
  ];

  /**
   * Analyze lesson content to understand what tools and concepts are relevant
   */
  async analyzeLessonContent(lessonData: any): Promise<LessonAnalysis> {
    const prompt = `
    Analyze this lesson content and extract key information for an intelligent tutoring system:

    Lesson Title: ${lessonData.title || 'Unknown'}
    Content: ${JSON.stringify(lessonData.content || lessonData).substring(0, 2000)}...

    Please identify:
    1. Main mathematical topics covered
    2. Specific math concepts and skills
    3. What types of visualizations would help students
    4. Difficulty level (elementary/middle/high)
    5. Key learning objectives
    6. Important mathematical terms

    Respond in JSON format:
    {
      "topics": ["topic1", "topic2"],
      "mathConcepts": ["concept1", "concept2"], 
      "visualizationNeeds": ["need1", "need2"],
      "difficulty": "middle",
      "keyTerms": ["term1", "term2"],
      "objectives": ["objective1", "objective2"]
    }
    `;

    try {
      const response = await fetch('/api/ai/analyze-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          model: 'gpt-4o-mini' // Use faster model for analysis
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze lesson content');
      }

      const analysis = await response.json();
      
      // Add suggested tools based on analysis
      const suggestedTools = this.selectToolsForTopics(analysis.topics || []);
      
      return {
        ...analysis,
        suggestedTools
      };
    } catch (error) {
      console.error('Lesson analysis failed:', error);
      
      // Fallback analysis
      return {
        topics: ['general math'],
        mathConcepts: ['problem solving'],
        visualizationNeeds: ['basic diagrams'],
        difficulty: 'middle',
        suggestedTools: this.availableTools.slice(0, 3),
        keyTerms: [],
        objectives: ['understand concepts']
      };
    }
  }

  /**
   * Analyze user query to determine intent and required tools
   */
  async analyzeUserQuery(query: string, lessonContext: LessonAnalysis): Promise<UserQuery> {
    const prompt = `
    You are an intelligent tutoring system analyzer. Analyze this student question in the context of the current lesson.

    Student Question: "${query}"

    Lesson Context:
    - Topics: ${lessonContext.topics.join(', ')}
    - Concepts: ${lessonContext.mathConcepts.join(', ')}
    - Difficulty: ${lessonContext.difficulty}
    - Key Terms: ${lessonContext.keyTerms.join(', ')}

    Available Tools: ${this.availableTools.map(t => `${t.name} (${t.syntax})`).join(', ')}

    Analyze the student's intent and determine:
    1. What are they trying to understand/do? (explain/visualize/practice/calculate/explore)
    2. What topics does their question relate to?
    3. Which tools would best help answer their question?
    4. How complex is their question? (1-5 scale)

    Respond in JSON format:
    {
      "intent": "visualize",
      "topics": ["topic1", "topic2"],
      "recommendedTools": ["ToolName1", "ToolName2"],
      "complexity": 3,
      "reasoning": "Why these tools were selected"
    }
    `;

    try {
      const response = await fetch('/api/ai/analyze-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          model: 'o1-mini' // Use reasoning model for analysis
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze user query');
      }

      const analysis = await response.json();
      
      const toolNeeds = this.availableTools.filter(tool => 
        analysis.recommendedTools?.includes(tool.name)
      );

      return {
        text: query,
        intent: analysis.intent || 'explain',
        topics: analysis.topics || [],
        toolNeeds,
        complexity: analysis.complexity || 2
      };
    } catch (error) {
      console.error('Query analysis failed:', error);
      
      // Fallback analysis
      return {
        text: query,
        intent: 'explain',
        topics: lessonContext.topics,
        toolNeeds: lessonContext.suggestedTools.slice(0, 2),
        complexity: 2
      };
    }
  }

  /**
   * Generate intelligent response using GPT-4o based on analysis
   */
  async generateResponse(
    userQuery: UserQuery, 
    lessonContext: LessonAnalysis,
    character: string = 'somers'
  ): Promise<string> {
    const toolSyntaxExamples = userQuery.toolNeeds.map(tool => 
      `${tool.name}: ${tool.syntax} - for ${tool.applicableTopics.join(', ')}`
    ).join('\n');

    const prompt = `
    You are ${character}, an engaging math tutor. The student asked: "${userQuery.text}"

    LESSON CONTEXT:
    - Current topics: ${lessonContext.topics.join(', ')}
    - Key concepts: ${lessonContext.mathConcepts.join(', ')}
    - Learning objectives: ${lessonContext.objectives.join(', ')}
    - Difficulty level: ${lessonContext.difficulty}

    ANALYSIS RESULTS:
    - Student intent: ${userQuery.intent}
    - Query topics: ${userQuery.topics.join(', ')}
    - Complexity: ${userQuery.complexity}/5

    RECOMMENDED TOOLS FOR THIS QUESTION:
    ${toolSyntaxExamples}

    INSTRUCTIONS:
    1. Provide a clear, ${lessonContext.difficulty}-school appropriate explanation
    2. Use the recommended tools by including their syntax in your response
    3. Connect your answer to the current lesson topics when relevant
    4. If the question is off-topic, still help but gently connect back to lesson concepts
    5. Be encouraging and match the ${character} character personality

    TOOL SYNTAX RULES:
    - Use [3D:shape_name] for 3D visualizations (cube, sphere, cylinder, cone, etc.)
    - Use [SHAPE:name,dimensions] for 2D shapes and basic geometry
    - Use [GRAPH:function] for algebraic graphing
    - Use [POWERS10:type,number] for scientific notation and place value
    - Use [CALC:expression] for calculations
    - Multiple tools can be used in one response

    Generate a helpful response that uses the appropriate tools for this specific question.
    `;

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          character,
          model: 'gpt-4o', // Use GPT-4o for response generation
          lessonContext: {
            topics: lessonContext.topics,
            concepts: lessonContext.mathConcepts
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate response');
      }

      const result = await response.json();
      return result.content || result.message || "I'd be happy to help! Could you rephrase your question?";

    } catch (error) {
      console.error('Response generation failed:', error);
      return "I'm having trouble processing that right now. Could you try asking your question again?";
    }
  }

  /**
   * Select appropriate tools based on topics
   */
  private selectToolsForTopics(topics: string[]): ToolType[] {
    const relevantTools: ToolType[] = [];
    
    topics.forEach(topic => {
      const matchingTools = this.availableTools.filter(tool =>
        tool.applicableTopics.some(applicableTopic =>
          topic.toLowerCase().includes(applicableTopic.toLowerCase()) ||
          applicableTopic.toLowerCase().includes(topic.toLowerCase())
        )
      );
      
      matchingTools.forEach(tool => {
        if (!relevantTools.find(t => t.name === tool.name)) {
          relevantTools.push(tool);
        }
      });
    });

    // Sort by complexity and relevance
    return relevantTools
      .sort((a, b) => a.complexity - b.complexity)
      .slice(0, 5); // Limit to top 5 tools
  }

  /**
   * Get all available tools
   */
  getAvailableTools(): ToolType[] {
    return this.availableTools;
  }

  /**
   * Add a new tool to the engine
   */
  addTool(tool: ToolType): void {
    this.availableTools.push(tool);
  }
}

export const intelligentTutor = new IntelligentTutorEngine();
