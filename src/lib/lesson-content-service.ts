// src/lib/lesson-content-service.ts
// Service for preparing lesson-specific content for Virtual Tutor

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

interface LessonAnalysis {
  content: LessonContent;
  tutorPrompt: string;
  suggestedQuestions: string[];
  commonStruggles: string[];
  teachingStrategies: string[];
}

export class LessonContentService {
  /**
   * Prepare lesson content for Virtual Tutor
   * This runs automatically when a lesson is accessed
   */
  static async prepareLessonContent(
    documentId: string, 
    lessonNumber: number
  ): Promise<LessonAnalysis> {
    console.log(`🔍 Preparing lesson content for ${documentId} - Lesson ${lessonNumber}`);
    
    try {
      // Step 1: Get lesson page range from our lesson service
      const lessonData = await this.getLessonPageRange(documentId, lessonNumber);
      
      if (!lessonData) {
        throw new Error(`Lesson ${lessonNumber} not found in ${documentId}`);
      }

      // Step 2: Extract content from lesson pages using OCR
      const extractedContent = await this.extractLessonContent(
        documentId, 
        lessonData.pageRange
      );

      // Step 3: Analyze content for math concepts
      const analysisResult = await this.analyzeMathContent(extractedContent);

      // Step 4: Build specialized tutor prompt
      const tutorPrompt = await this.buildTutorPrompt(analysisResult);

      // Step 5: Generate teaching strategies
      const teachingStrategies = await this.generateTeachingStrategies(analysisResult);

      const lessonAnalysis: LessonAnalysis = {
        content: {
          lessonId: `${documentId}-L${lessonNumber}`,
          documentId,
          lessonNumber,
          extractedText: extractedContent.fullText,
          mathematicalConcepts: analysisResult.concepts,
          keyFormulas: analysisResult.formulas,
          practiceProblems: analysisResult.problems,
          vocabularyTerms: analysisResult.vocabulary,
          learningObjectives: analysisResult.objectives,
          difficultyLevel: analysisResult.difficulty,
          prerequisites: analysisResult.prerequisites,
          pageRange: lessonData.pageRange,
          extractionTimestamp: new Date(),
          confidence: extractedContent.confidence
        },
        tutorPrompt,
        suggestedQuestions: this.generateSuggestedQuestions(analysisResult),
        commonStruggles: this.identifyCommonStruggles(analysisResult),
        teachingStrategies
      };

      // Step 6: Cache the analysis for quick access
      await this.cacheLessonAnalysis(lessonAnalysis);

      console.log(`✅ Lesson content prepared successfully for ${documentId} - Lesson ${lessonNumber}`);
      return lessonAnalysis;

    } catch (error) {
      console.error(`❌ Failed to prepare lesson content:`, error);
      
      // Return fallback analysis
      return this.getFallbackAnalysis(documentId, lessonNumber);
    }
  }

  /**
   * Get lesson page range from existing lesson service
   */
  private static async getLessonPageRange(documentId: string, lessonNumber: number) {
    try {
      const response = await fetch(`/api/lessons/${documentId}/${lessonNumber}`);
      const result = await response.json();
      
      if (result.success && result.lesson) {
        // Calculate page range from lesson sessions
        const allPages = result.lesson.sessions.flatMap((session: any) => 
          session.pages.map((p: any) => p.pageNumber)
        );
        
        return {
          pageRange: {
            start: Math.min(...allPages),
            end: Math.max(...allPages)
          },
          lessonTitle: result.lesson.lessonTitle,
          sessions: result.lesson.sessions
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting lesson page range:', error);
      return null;
    }
  }

  /**
   * Extract content from lesson pages using OCR service
   */
  private static async extractLessonContent(documentId: string, pageRange: { start: number; end: number }) {
    console.log(`📖 Extracting content from pages ${pageRange.start}-${pageRange.end}`);
    
    const extractedPages = [];
    let totalConfidence = 0;

    // Extract content from each page in the lesson
    for (let pageNum = pageRange.start; pageNum <= pageRange.end; pageNum++) {
      try {
        const response = await fetch('/api/ocr/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId,
            pageNumber: pageNum
          })
        });

        const ocrResult = await response.json();
        
        if (ocrResult.success) {
          extractedPages.push({
            pageNumber: pageNum,
            text: ocrResult.extractedText || '',
            formulas: ocrResult.formulas || [],
            tables: ocrResult.tables || [],
            confidence: ocrResult.confidence || 0.5
          });
          totalConfidence += ocrResult.confidence || 0.5;
        }
      } catch (error) {
        console.warn(`Failed to extract page ${pageNum}:`, error);
      }
    }

    // Combine all extracted text
    const fullText = extractedPages.map(page => page.text).join('\n\n');
    const allFormulas = extractedPages.flatMap(page => page.formulas);
    const avgConfidence = extractedPages.length > 0 ? totalConfidence / extractedPages.length : 0.3;

    return {
      fullText,
      formulas: allFormulas,
      pages: extractedPages,
      confidence: avgConfidence
    };
  }

  /**
   * Analyze mathematical content using pattern recognition
   */
  private static async analyzeMathContent(extractedContent: any) {
    const text = extractedContent.fullText.toLowerCase();
    
    // Mathematical concept detection patterns
    const conceptPatterns = {
      algebra: /equation|variable|solve|expression|coefficient/g,
      geometry: /triangle|circle|angle|area|perimeter|polygon/g,
      fractions: /fraction|numerator|denominator|mixed number/g,
      decimals: /decimal|place value|hundredth|tenth/g,
      ratios: /ratio|proportion|rate|percent/g,
      statistics: /mean|median|mode|graph|data|chart/g,
      measurement: /length|width|height|volume|capacity/g
    };

    const detectedConcepts = [];
    for (const [concept, pattern] of Object.entries(conceptPatterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length >= 2) {
        detectedConcepts.push(concept);
      }
    }

    // Extract formulas and key terms
    const formulas = extractedContent.formulas || [];
    const vocabulary = this.extractVocabulary(text);
    const objectives = this.extractLearningObjectives(text);

    // Determine difficulty based on concept complexity
    let difficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (detectedConcepts.includes('algebra') || detectedConcepts.includes('geometry')) {
      difficulty = 'intermediate';
    }
    if (text.includes('quadratic') || text.includes('theorem') || text.includes('proof')) {
      difficulty = 'advanced';
    }

    return {
      concepts: detectedConcepts,
      formulas: formulas.slice(0, 10), // Top 10 formulas
      problems: this.extractPracticeProblems(text),
      vocabulary,
      objectives,
      difficulty,
      prerequisites: this.identifyPrerequisites(detectedConcepts)
    };
  }

  private static extractVocabulary(text: string): string[] {
    const vocabularyPatterns = [
      /define[s]?\s+([a-z\s]{3,20})/gi,
      /([a-z\s]{3,20})\s+is\s+defined/gi,
      /the\s+([a-z\s]{3,20})\s+means/gi
    ];

    const terms = new Set<string>();
    
    vocabularyPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          terms.add(match[1].trim().toLowerCase());
        }
      }
    });

    return Array.from(terms).slice(0, 8);
  }

  private static extractLearningObjectives(text: string): string[] {
    const objectivePatterns = [
      /students?\s+will\s+([^.]{10,50})/gi,
      /objective[s]?:\s*([^.]{10,50})/gi,
      /goal[s]?:\s*([^.]{10,50})/gi
    ];

    const objectives = new Set<string>();
    
    objectivePatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          objectives.add(match[1].trim());
        }
      }
    });

    return Array.from(objectives).slice(0, 5);
  }

  private static extractPracticeProblems(text: string): string[] {
    const problemPatterns = [
      /\d+\.\s+([^.]{10,100})/g,
      /solve:\s*([^.]{10,100})/gi,
      /find:\s*([^.]{10,100})/gi
    ];

    const problems = new Set<string>();
    
    problemPatterns.forEach(pattern => {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].includes('=')) {
          problems.add(match[1].trim());
        }
      }
    });

    return Array.from(problems).slice(0, 6);
  }

  private static identifyPrerequisites(concepts: string[]): string[] {
    const prerequisiteMap: { [key: string]: string[] } = {
      algebra: ['basic arithmetic', 'fractions', 'decimals'],
      geometry: ['basic shapes', 'measurement', 'fractions'],
      ratios: ['fractions', 'decimals', 'multiplication'],
      statistics: ['basic arithmetic', 'fractions', 'decimals']
    };

    const prerequisites = new Set<string>();
    concepts.forEach(concept => {
      const reqs = prerequisiteMap[concept] || [];
      reqs.forEach(req => prerequisites.add(req));
    });

    return Array.from(prerequisites);
  }

  /**
   * Build specialized prompt for AI tutor
   */
  private static async buildTutorPrompt(analysis: any): Promise<string> {
    return `You are an expert math tutor helping with a lesson focused on: ${analysis.concepts.join(', ')}.

LESSON CONTENT SUMMARY:
- Main concepts: ${analysis.concepts.join(', ')}
- Key formulas: ${analysis.formulas.slice(0, 3).join('; ')}
- Vocabulary: ${analysis.vocabulary.join(', ')}
- Difficulty level: ${analysis.difficulty}

TEACHING GUIDELINES:
1. Reference the specific concepts from this lesson
2. Use the vocabulary terms naturally in explanations
3. Connect new concepts to prerequisites: ${analysis.prerequisites.join(', ')}
4. Provide step-by-step guidance for practice problems
5. Encourage students and celebrate progress

When students ask questions, relate your answers back to this specific lesson content.`;
  }

  private static async generateTeachingStrategies(analysis: any): Promise<string[]> {
    const strategies = [
      `Use visual aids to explain ${analysis.concepts[0] || 'mathematical concepts'}`,
      'Break complex problems into smaller, manageable steps',
      'Connect new learning to real-world applications',
      'Encourage students to verbalize their thinking process'
    ];

    if (analysis.difficulty === 'beginner') {
      strategies.push('Use manipulatives and concrete examples');
      strategies.push('Provide plenty of guided practice');
    } else if (analysis.difficulty === 'advanced') {
      strategies.push('Challenge students with extension problems');
      strategies.push('Encourage mathematical reasoning and proof');
    }

    return strategies;
  }

  private static generateSuggestedQuestions(analysis: any): string[] {
    return [
      `Can you help me understand ${analysis.concepts[0] || 'this concept'}?`,
      'Can you show me how to solve this step by step?',
      'What does this vocabulary term mean?',
      'Can you give me a similar practice problem?',
      'How does this connect to what we learned before?'
    ];
  }

  private static identifyCommonStruggles(analysis: any): string[] {
    const struggles = ['Understanding the vocabulary', 'Connecting concepts to prior knowledge'];

    if (analysis.concepts.includes('fractions')) {
      struggles.push('Finding common denominators', 'Converting between mixed numbers and improper fractions');
    }
    if (analysis.concepts.includes('algebra')) {
      struggles.push('Isolating variables', 'Understanding negative numbers');
    }
    if (analysis.concepts.includes('geometry')) {
      struggles.push('Visualizing 3D shapes', 'Remembering formulas');
    }

    return struggles;
  }

  /**
   * Cache lesson analysis for quick retrieval
   */
  private static async cacheLessonAnalysis(analysis: LessonAnalysis) {
    try {
      // In a production app, this would save to database
      // For now, we'll use localStorage in the browser
      if (typeof window !== 'undefined') {
        const cacheKey = `lesson_analysis_${analysis.content.lessonId}`;
        localStorage.setItem(cacheKey, JSON.stringify(analysis));
      }
    } catch (error) {
      console.warn('Failed to cache lesson analysis:', error);
    }
  }

  /**
   * Get cached lesson analysis
   */
  static async getCachedLessonAnalysis(documentId: string, lessonNumber: number): Promise<LessonAnalysis | null> {
    try {
      if (typeof window !== 'undefined') {
        const cacheKey = `lesson_analysis_${documentId}-L${lessonNumber}`;
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          return JSON.parse(cached);
        }
      }
      return null;
    } catch (error) {
      console.warn('Failed to get cached lesson analysis:', error);
      return null;
    }
  }

  /**
   * Fallback analysis when OCR fails
   */
  private static getFallbackAnalysis(documentId: string, lessonNumber: number): LessonAnalysis {
    return {
      content: {
        lessonId: `${documentId}-L${lessonNumber}`,
        documentId,
        lessonNumber,
        extractedText: 'Content extraction in progress...',
        mathematicalConcepts: ['general mathematics'],
        keyFormulas: [],
        practiceProblems: [],
        vocabularyTerms: [],
        learningObjectives: [`Complete Lesson ${lessonNumber} successfully`],
        difficultyLevel: 'intermediate',
        prerequisites: ['basic arithmetic'],
        pageRange: { start: 1, end: 1 },
        extractionTimestamp: new Date(),
        confidence: 0.1
      },
      tutorPrompt: `You are helping with Lesson ${lessonNumber}. Provide general math tutoring support and encourage the student to ask specific questions about the lesson content.`,
      suggestedQuestions: [
        'Can you explain this concept to me?',
        'How do I solve this problem?',
        'Can you give me an example?'
      ],
      commonStruggles: [
        'Understanding new concepts',
        'Applying formulas correctly',
        'Connecting to previous learning'
      ],
      teachingStrategies: [
        'Provide step-by-step guidance',
        'Use encouraging language',
        'Break down complex problems'
      ]
    };
  }
}

export type { LessonContent, LessonAnalysis };
