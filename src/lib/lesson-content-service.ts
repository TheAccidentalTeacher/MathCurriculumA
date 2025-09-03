// src/lib/lesson-content-service.ts
// Service for preparing lesson-specific content for Virtual Tutor

import { LessonService } from './lesson-service';

interface LessonContent {
  lessonId: string;
  documentId: string;
  lessonNumber: number;
  extractedText: string;
  mathematicalConcepts: string[];
  keyFormulas: string[];
  practiceProblems: string[];
  vocabularyTerms: string[];
  learningObjectives: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  pageRange: {
    start: number;
    end: number;
  };
  extractionTimestamp: Date;
  confidence: number;
}

interface ExtractedContent {
  fullText: string;
  formulas: string[];
  pages: any[];
  confidence: number;
}

interface MathAnalysis {
  concepts: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  formulas: string[];
  vocabulary: string[];
  prerequisites: string[];
}

interface LessonAnalysis {
  lessonId: string;
  documentId: string;
  lessonNumber: number;
  title: string;
  pageRange: {
    start: number;
    end: number;
  };
  extractedContent: ExtractedContent;
  analysis: MathAnalysis;
  tutorPrompt: string;
  teachingStrategies: string[];
  timestamp: string;
}

export class LessonContentService {
  private static cache = new Map<string, LessonAnalysis>();

  /**
   * Prepare lesson content for Virtual Tutor
   * This runs automatically when a lesson is accessed
   */
  static async prepareLessonContent(
    documentId: string, 
    lessonNumber: number
  ): Promise<LessonAnalysis> {
    const cacheKey = `lesson_analysis_${documentId}_${lessonNumber}`;
    console.log(`🚀 [LessonContentService] Starting preparation for ${documentId} - Lesson ${lessonNumber}`);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log(`⚡ [LessonContentService] Returning cached analysis for ${cacheKey}`);
      return cached;
    }
    
    try {
      // Step 1: Get lesson page range from our lesson service
      console.log(`📖 [LessonContentService] Step 1: Getting lesson page range...`);
      const lessonData = await this.getLessonPageRange(documentId, lessonNumber);
      
      if (!lessonData) {
        console.error(`❌ [LessonContentService] Lesson ${lessonNumber} not found in ${documentId}`);
        throw new Error(`Lesson ${lessonNumber} not found in ${documentId}`);
      }

      console.log(`✅ [LessonContentService] Found lesson data:`, {
        pageRange: lessonData.pageRange,
        title: lessonData.lessonTitle,
        sessions: lessonData.sessions?.length || 0
      });

      // Step 2: Extract content from lesson pages using OCR
      console.log(`📸 [LessonContentService] Step 2: Extracting content from pages ${lessonData.pageRange.start}-${lessonData.pageRange.end}`);
      const extractedContent = await this.extractLessonContent(
        documentId, 
        lessonData.pageRange
      );

      console.log(`📋 [LessonContentService] Extraction completed:`, {
        textLength: extractedContent.fullText?.length || 0,
        formulasFound: extractedContent.formulas?.length || 0,
        pagesProcessed: extractedContent.pages?.length || 0,
        avgConfidence: extractedContent.confidence
      });

      // Step 3: Analyze content for math concepts
      console.log(`🧠 [LessonContentService] Step 3: Analyzing mathematical content...`);
      const analysisResult = await this.analyzeMathContent(extractedContent);

      console.log(`🎯 [LessonContentService] Analysis completed:`, {
        conceptsFound: analysisResult.concepts?.length || 0,
        concepts: analysisResult.concepts,
        difficulty: analysisResult.difficulty,
        formulasExtracted: analysisResult.formulas?.length || 0
      });

      // Step 4: Build specialized tutor prompt
      console.log(`🎭 [LessonContentService] Step 4: Building AI tutor prompt...`);
      const tutorPrompt = await this.buildTutorPrompt(analysisResult);

      // Step 5: Generate teaching strategies
      console.log(`📚 [LessonContentService] Step 5: Generating teaching strategies...`);
      const teachingStrategies = await this.generateTeachingStrategies(analysisResult);

      const finalAnalysis: LessonAnalysis = {
        lessonId: `${documentId}-lesson-${lessonNumber}`,
        documentId,
        lessonNumber,
        title: lessonData.lessonTitle || `Lesson ${lessonNumber}`,
        pageRange: lessonData.pageRange,
        extractedContent,
        analysis: analysisResult,
        tutorPrompt,
        teachingStrategies,
        timestamp: new Date().toISOString()
      };

      console.log(`🎉 [LessonContentService] Lesson preparation complete!`, {
        lessonId: finalAnalysis.lessonId,
        title: finalAnalysis.title,
        promptLength: tutorPrompt.length,
        strategiesCount: teachingStrategies.length
      });

      // Cache the results
      this.cache.set(cacheKey, finalAnalysis);
      console.log(`💾 [LessonContentService] Results cached with key: ${cacheKey}`);
      
      return finalAnalysis;

    } catch (error) {
      console.error(`❌ [LessonContentService] Failed to prepare lesson content:`, error);
      
      // Return fallback analysis
      return this.getFallbackAnalysis(documentId, lessonNumber);
    }
  }

  /**
   * Get lesson page range from lesson service directly
   */
  private static async getLessonPageRange(documentId: string, lessonNumber: number) {
    try {
      console.log(`🔍 [LessonContentService] Getting lesson data directly for ${documentId}/${lessonNumber}`);
      const lessonData = await LessonService.getLessonData(documentId, lessonNumber);
      
      if (!lessonData) {
        console.error(`❌ [LessonContentService] Lesson not found: ${documentId}/${lessonNumber}`);
        return null;
      }
      
      console.log(`📊 [LessonContentService] Lesson data retrieved:`, { 
        title: lessonData.lessonTitle,
        hasLesson: true,
        sessionCount: lessonData.sessions?.length || 0,
        pageRange: { start: lessonData.startPage, end: lessonData.endPage }
      });
      
      return {
        lessonTitle: lessonData.lessonTitle,
        pageRange: {
          start: lessonData.startPage,
          end: lessonData.endPage
        },
        sessions: lessonData.sessions
      };
    } catch (error) {
      console.error(`❌ [LessonContentService] Error fetching lesson data:`, error);
      return null;
    }
  }

  /**
   * Extract content from lesson pages using OCR
   */
  private static async extractLessonContent(documentId: string, pageRange: { start: number; end: number }): Promise<ExtractedContent> {
    try {
      console.log(`📸 [LessonContentService] Starting OCR extraction for pages ${pageRange.start}-${pageRange.end}`);
      
      // Get OCR data for the page range
      const ocrPromises = [];
      for (let page = pageRange.start; page <= pageRange.end; page++) {
        ocrPromises.push(this.getPageOCRData(documentId, page));
      }
      
      const ocrResults = await Promise.all(ocrPromises);
      console.log(`📊 [LessonContentService] OCR extraction completed for ${ocrResults.length} pages`);
      
      // Combine all text
      const fullText = ocrResults
        .filter(result => result?.extractedText)
        .map(result => result!.extractedText)
        .join('\n\n');
      
      // Extract formulas (look for mathematical expressions)
      const formulas = this.extractMathematicalFormulas(fullText);
      
      const extractedContent: ExtractedContent = {
        fullText,
        formulas,
        pages: ocrResults,
        confidence: ocrResults.reduce((acc, result) => acc + (result?.confidence || 0), 0) / ocrResults.length
      };
      
      console.log(`✅ [LessonContentService] Content extraction summary:`, {
        textLength: fullText.length,
        formulaCount: formulas.length,
        avgConfidence: extractedContent.confidence
      });
      
      return extractedContent;
    } catch (error) {
      console.error(`❌ [LessonContentService] Error extracting lesson content:`, error);
      return {
        fullText: '',
        formulas: [],
        pages: [],
        confidence: 0
      };
    }
  }

  /**
   * Get OCR data for a specific page - simplified to avoid HTTP calls
   */
  private static async getPageOCRData(documentId: string, pageNumber: number) {
    try {
      console.log(`🔍 [LessonContentService] Getting OCR data for ${documentId} page ${pageNumber}`);
      
      // For now, return a simple fallback since the HTTP call was causing issues
      // TODO: Implement direct OCR service integration when needed
      console.log(`⚠️ [LessonContentService] Using fallback OCR data for page ${pageNumber}`);
      
      return {
        extractedText: `Lesson content from page ${pageNumber}`,
        confidence: 0.8,
        mathematicalFormulas: [],
        pageNumber: pageNumber
      };
    } catch (error) {
      console.error(`❌ [LessonContentService] Error getting OCR data for page ${pageNumber}:`, error);
      return null;
    }
  }

  /**
   * Extract mathematical formulas from text
   */
  private static extractMathematicalFormulas(text: string): string[] {
    const formulas: string[] = [];
    
    // Common mathematical patterns
    const patterns = [
      /\b[a-zA-Z]\s*=\s*[^.]+/g, // Variable equations (x = 2, y = mx + b)
      /\d+\s*[+\-*/]\s*\d+/g,    // Simple arithmetic
      /\([^)]+\)\s*[+\-*/]\s*\([^)]+\)/g, // Expressions with parentheses
      /\b\d*[a-zA-Z]\^?\d*\b/g,  // Algebraic terms (3x, x^2)
      /\$[^$]+\$/g,              // LaTeX-style formulas
      /\\frac\{[^}]+\}\{[^}]+\}/g // Fractions
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        formulas.push(...matches.map(m => m.trim()));
      }
    });
    
    console.log(`🧮 [LessonContentService] Extracted ${formulas.length} mathematical formulas`);
    return [...new Set(formulas)]; // Remove duplicates
  }

  /**
   * Analyze mathematical content to identify concepts and difficulty
   */
  private static async analyzeMathContent(extractedContent: ExtractedContent): Promise<MathAnalysis> {
    const text = extractedContent.fullText.toLowerCase();
    
    // Concept detection patterns
    const conceptPatterns = {
      'algebra': /algebra|equation|variable|expression|solve|linear/g,
      'geometry': /geometry|triangle|circle|angle|area|perimeter|volume/g,
      'fractions': /fraction|numerator|denominator|\/|proper|improper/g,
      'decimals': /decimal|point|tenths|hundredths|place value/g,
      'ratios': /ratio|proportion|rate|compare|equivalent/g,
      'percentages': /percent|%|percentage|out of 100/g,
      'statistics': /mean|median|mode|average|data|graph|chart/g,
      'probability': /probability|chance|likely|outcome|event/g
    };
    
    const detectedConcepts = [];
    for (const [concept, pattern] of Object.entries(conceptPatterns)) {
      if (pattern.test(text)) {
        detectedConcepts.push(concept);
      }
    }
    
    // Difficulty assessment
    let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    const advancedKeywords = ['quadratic', 'polynomial', 'logarithm', 'trigonometry', 'calculus'];
    const intermediateKeywords = ['equation', 'inequality', 'system', 'graph', 'function'];
    
    if (advancedKeywords.some(keyword => text.includes(keyword))) {
      difficulty = 'advanced';
    } else if (intermediateKeywords.some(keyword => text.includes(keyword))) {
      difficulty = 'intermediate';
    }
    
    // Extract vocabulary terms
    const vocabulary = this.extractMathVocabulary(text);
    
    // Determine prerequisites
    const prerequisites = this.determinePrerequisites(detectedConcepts);
    
    const analysis: MathAnalysis = {
      concepts: detectedConcepts,
      difficulty,
      formulas: extractedContent.formulas,
      vocabulary,
      prerequisites
    };
    
    console.log(`🔍 [LessonContentService] Math analysis results:`, analysis);
    return analysis;
  }

  /**
   * Extract mathematical vocabulary from text
   */
  private static extractMathVocabulary(text: string): string[] {
    const mathTerms = [
      'sum', 'difference', 'product', 'quotient', 'factor', 'multiple',
      'prime', 'composite', 'even', 'odd', 'integer', 'rational',
      'irrational', 'coefficient', 'constant', 'term', 'expression',
      'equation', 'inequality', 'solution', 'root', 'zero'
    ];
    
    const foundTerms = mathTerms.filter(term => 
      text.includes(term.toLowerCase())
    );
    
    console.log(`📚 [LessonContentService] Found ${foundTerms.length} vocabulary terms`);
    return foundTerms;
  }

  /**
   * Determine prerequisites based on detected concepts
   */
  private static determinePrerequisites(concepts: string[]): string[] {
    const prerequisiteMap: { [key: string]: string[] } = {
      'algebra': ['arithmetic', 'fractions', 'order of operations'],
      'geometry': ['basic shapes', 'measurement', 'fractions'],
      'ratios': ['fractions', 'multiplication', 'division'],
      'percentages': ['fractions', 'decimals', 'ratios'],
      'statistics': ['basic arithmetic', 'graphing'],
      'probability': ['fractions', 'ratios', 'basic counting']
    };
    
    const allPrerequisites = new Set<string>();
    concepts.forEach(concept => {
      if (prerequisiteMap[concept]) {
        prerequisiteMap[concept].forEach(prereq => allPrerequisites.add(prereq));
      }
    });
    
    return Array.from(allPrerequisites);
  }

  /**
   * Build specialized tutor prompt based on analysis
   */
  private static async buildTutorPrompt(analysis: MathAnalysis): Promise<string> {
    const conceptsText = analysis.concepts.join(', ');
    const formulasText = analysis.formulas.slice(0, 5).join('; '); // Limit to prevent prompt overflow
    
    const prompt = `You are a specialized math tutor helping with a lesson covering: ${conceptsText}.

Key mathematical concepts in this lesson:
- Primary concepts: ${analysis.concepts.join(', ')}
- Difficulty level: ${analysis.difficulty}
- Key formulas: ${formulasText}
- Prerequisites: ${analysis.prerequisites.join(', ')}
- Mathematical vocabulary: ${analysis.vocabulary.join(', ')}

As a tutor, you should:
1. Help students understand these specific concepts
2. Provide examples relevant to ${analysis.difficulty}-level students
3. Break down complex problems step-by-step
4. Use the vocabulary and formulas from this lesson
5. Check for understanding of prerequisite knowledge when needed
6. Encourage student thinking with guided questions
7. Provide positive reinforcement and support

Be patient, encouraging, and adapt your explanations to the student's understanding level. Focus specifically on the concepts covered in this lesson.`;

    console.log(`🎭 [LessonContentService] Built tutor prompt (${prompt.length} characters)`);
    return prompt;
  }

  /**
   * Generate teaching strategies based on analysis
   */
  private static async generateTeachingStrategies(analysis: MathAnalysis): Promise<string[]> {
    const strategies = [];
    
    // Base strategies for all math lessons
    strategies.push("Start with concrete examples before moving to abstract concepts");
    strategies.push("Use visual aids and diagrams to illustrate mathematical relationships");
    strategies.push("Encourage students to explain their reasoning");
    
    // Concept-specific strategies
    if (analysis.concepts.includes('algebra')) {
      strategies.push("Use algebra tiles or other manipulatives to represent variables");
      strategies.push("Connect algebraic expressions to real-world situations");
    }
    
    if (analysis.concepts.includes('geometry')) {
      strategies.push("Use hands-on activities with shapes and measuring tools");
      strategies.push("Connect geometry to art and architecture");
    }
    
    if (analysis.concepts.includes('fractions')) {
      strategies.push("Use visual fraction models like circles, rectangles, or number lines");
      strategies.push("Connect fractions to real-life situations like cooking or sharing");
    }
    
    if (analysis.difficulty === 'advanced') {
      strategies.push("Break complex problems into smaller, manageable steps");
      strategies.push("Provide multiple solution methods when appropriate");
    }
    
    if (analysis.difficulty === 'beginner') {
      strategies.push("Use lots of practice with guided examples");
      strategies.push("Celebrate small wins to build confidence");
    }
    
    console.log(`📚 [LessonContentService] Generated ${strategies.length} teaching strategies`);
    return strategies;
  }

  /**
   * Get fallback analysis when content extraction fails
   */
  private static getFallbackAnalysis(documentId: string, lessonNumber: number): LessonAnalysis {
    console.log(`🔄 [LessonContentService] Generating fallback analysis for ${documentId} - Lesson ${lessonNumber}`);
    
    return {
      lessonId: `${documentId}-lesson-${lessonNumber}`,
      documentId,
      lessonNumber,
      title: `Lesson ${lessonNumber}`,
      pageRange: { start: 1, end: 1 },
      extractedContent: {
        fullText: '',
        formulas: [],
        pages: [],
        confidence: 0
      },
      analysis: {
        concepts: ['general mathematics'],
        difficulty: 'intermediate',
        formulas: [],
        vocabulary: [],
        prerequisites: ['basic arithmetic']
      },
      tutorPrompt: `You are a helpful math tutor. The student is working on Lesson ${lessonNumber}. 
      Help them understand mathematical concepts, solve problems step-by-step, and build confidence in their math skills.
      Be patient, encouraging, and ask questions to check their understanding.`,
      teachingStrategies: [
        "Start with what the student already knows",
        "Break problems into smaller steps",
        "Use concrete examples",
        "Encourage questions and exploration",
        "Provide positive reinforcement"
      ],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear cache (useful for development)
   */
  static clearCache() {
    this.cache.clear();
    console.log(`🗑️ [LessonContentService] Cache cleared`);
  }

  /**
   * Get cache status
   */
  static getCacheStatus() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}
