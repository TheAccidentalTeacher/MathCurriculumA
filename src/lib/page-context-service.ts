/**
 * Page Context Service - Retrieves specific page content using Vision Analysis
 */

export interface PageContent {
  pageNumber: number;
  textContent?: string;
  mathProblems?: string[];
  diagrams?: string[];
  concepts?: string[];
  difficulty?: 'elementary' | 'middle' | 'high';
  exerciseTypes?: string[];
}

export interface PageAnalysisResult {
  success: boolean;
  pageContent?: PageContent;
  error?: string;
}

export class PageContextService {
  /**
   * Get specific page content for lesson context
   */
  static async getPageContent(
    documentId: string, 
    lessonNumber: number, 
    pageNumber: number
  ): Promise<PageAnalysisResult> {
    try {
      console.log(`🔍 Fetching page ${pageNumber} content for lesson ${lessonNumber} in document ${documentId}`);

      // First, get the lesson data to understand context
      const lessonResponse = await fetch(`/api/lessons/${documentId}/${lessonNumber}`);
      
      if (!lessonResponse.ok) {
        throw new Error(`Lesson data fetch failed: ${lessonResponse.statusText}`);
      }

      const lessonData = await lessonResponse.json();
      
      if (!lessonData.success) {
        throw new Error(lessonData.error || 'Failed to get lesson data');
      }

      // Extract lesson-specific content for the page
      const lesson = lessonData.lesson;
      const pageContent = this.extractPageContentFromLesson(lesson, pageNumber);

      return {
        success: true,
        pageContent
      };

    } catch (error) {
      console.error('❌ Page content retrieval failed:', error);
      
      // Fallback: try to get basic lesson structure
      try {
        console.log('🔄 Attempting fallback lesson context...');
        const fallbackContent = this.getFallbackPageContent(documentId, lessonNumber, pageNumber);
        return {
          success: true,
          pageContent: fallbackContent
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
  }

  /**
   * Extract page content from lesson data
   */
  private static extractPageContentFromLesson(lesson: any, pageNumber: number): PageContent {
    const content: PageContent = {
      pageNumber,
    };

    // Use lesson title and context for page content
    content.textContent = `Lesson ${lesson.lessonNumber}: ${lesson.lessonTitle}`;
    
    // Determine lesson concepts based on title
    content.concepts = this.extractConceptsFromTitle(lesson.lessonTitle);
    
    // Set difficulty based on document grade level
    content.difficulty = this.getDifficultyFromDocument(lesson.documentId);
    
    // Check if page is within lesson boundaries
    if (pageNumber >= lesson.startPage && pageNumber <= lesson.endPage) {
      // Find specific session for this page
      const session = lesson.sessions?.find((s: any) => 
        pageNumber >= s.startPage && pageNumber <= s.endPage
      );
      
      if (session) {
        content.textContent += `\n\nSession: ${session.sessionName} (${session.sessionType})`;
        content.exerciseTypes = this.getExerciseTypesFromSession(session.sessionType);
      }
      
      // Find specific page data if available
      const pageData = lesson.allPages?.find((p: any) => p.pageNumber === pageNumber);
      if (pageData && pageData.textPreview) {
        content.textContent += `\n\nPage Content: ${pageData.textPreview}`;
      }
    }

    return content;
  }

  /**
   * Get fallback page content when lesson data is unavailable
   */
  private static getFallbackPageContent(documentId: string, lessonNumber: number, pageNumber: number): PageContent {
    return {
      pageNumber,
      textContent: `Page ${pageNumber} in Lesson ${lessonNumber}`,
      difficulty: this.getDifficultyFromDocument(documentId),
      exerciseTypes: ['general-practice']
    };
  }

  /**
   * Extract key concepts from lesson title
   */
  private static extractConceptsFromTitle(title: string): string[] {
    const concepts: string[] = [];
    const titleLower = title.toLowerCase();
    
    // Mathematics concepts mapping
    if (titleLower.includes('area')) concepts.push('area calculation');
    if (titleLower.includes('circumference')) concepts.push('circumference calculation');
    if (titleLower.includes('circle')) concepts.push('circle geometry');
    if (titleLower.includes('proportional')) concepts.push('proportional relationships');
    if (titleLower.includes('ratio')) concepts.push('ratios');
    if (titleLower.includes('scale')) concepts.push('scale factors');
    if (titleLower.includes('equation')) concepts.push('equations');
    if (titleLower.includes('expression')) concepts.push('algebraic expressions');
    if (titleLower.includes('fraction')) concepts.push('fractions');
    if (titleLower.includes('decimal')) concepts.push('decimals');
    if (titleLower.includes('percent')) concepts.push('percentages');
    if (titleLower.includes('volume')) concepts.push('volume calculation');
    if (titleLower.includes('surface area')) concepts.push('surface area');
    if (titleLower.includes('integer')) concepts.push('integers');
    if (titleLower.includes('negative')) concepts.push('negative numbers');
    if (titleLower.includes('coordinate')) concepts.push('coordinate plane');
    if (titleLower.includes('graph')) concepts.push('graphing');
    if (titleLower.includes('inequality')) concepts.push('inequalities');
    
    return concepts.length > 0 ? concepts : ['general mathematics'];
  }

  /**
   * Get difficulty level from document ID
   */
  private static getDifficultyFromDocument(documentId: string): 'elementary' | 'middle' | 'high' {
    if (documentId.includes('06')) return 'middle'; // Grade 6
    if (documentId.includes('07')) return 'middle'; // Grade 7 
    if (documentId.includes('08')) return 'middle'; // Grade 8
    if (documentId.includes('09') || documentId.includes('ALG')) return 'high'; // Grade 9/Algebra
    return 'elementary'; // Default
  }

  /**
   * Get exercise types from session type
   */
  private static getExerciseTypesFromSession(sessionType: string): string[] {
    const types: string[] = [];
    
    switch (sessionType) {
      case 'introduction':
        types.push('conceptual-introduction');
        break;
      case 'explore':
        types.push('exploration', 'discovery');
        break;
      case 'develop':
        types.push('skill-building', 'practice');
        break;
      case 'refine':
        types.push('advanced-practice', 'refinement');
        break;
      case 'apply':
        types.push('application', 'word-problems');
        break;
      case 'practice':
        types.push('practice', 'problem-solving');
        break;
      default:
        types.push('general-practice');
    }
    
    return types;
  }

  /**
   * Assess difficulty level based on content analysis
   */
  private static assessDifficulty(analysis: any): 'elementary' | 'middle' | 'high' {
    const content = (analysis.textContent || '').toLowerCase();
    
    // High school indicators
    if (content.includes('algebra') || content.includes('quadratic') || 
        content.includes('polynomial') || content.includes('logarithm')) {
      return 'high';
    }

    // Middle school indicators
    if (content.includes('proportion') || content.includes('ratio') || 
        content.includes('percent') || content.includes('integer')) {
      return 'middle';
    }

    // Default to elementary
    return 'elementary';
  }

  /**
   * Identify types of exercises on the page
   */
  private static identifyExerciseTypes(analysis: any): string[] {
    const content = (analysis.textContent || '').toLowerCase();
    const types: string[] = [];

    if (content.includes('solve') || content.includes('find')) {
      types.push('problem-solving');
    }

    if (content.includes('graph') || content.includes('plot')) {
      types.push('graphing');
    }

    if (content.includes('word problem') || content.includes('real-world')) {
      types.push('word-problems');
    }

    if (content.includes('practice') || content.includes('exercise')) {
      types.push('practice');
    }

    if (content.includes('example') || content.includes('sample')) {
      types.push('examples');
    }

    return types;
  }

  /**
   * Generate page-specific tutor response
   */
  static generatePageSpecificGuidance(
    pageContent: PageContent,
    studentQuestion: string,
    character: 'somers' | 'gimli'
  ): string {
    const isGimli = character === 'gimli';
    
    let response = isGimli 
      ? `Woof! I can see you're looking at page ${pageContent.pageNumber}! 🐕 ` 
      : `I can see you're working on page ${pageContent.pageNumber}. `;

    // Add lesson-specific context
    if (pageContent.textContent) {
      const lessonInfo = pageContent.textContent.split('\n')[0]; // Get lesson title
      response += isGimli 
        ? `This page is from "${lessonInfo}" - perfect for practicing these skills! 🎾 `
        : `This page is part of "${lessonInfo}". `;
    }

    // Add specific content analysis for math problems
    if (pageContent.mathProblems && pageContent.mathProblems.length > 0) {
      const problems = pageContent.mathProblems.slice(0, 2); // Show first 2 problems
      response += isGimli 
        ? `I can see there are math problems here like: "${problems[0]}". Which specific part is making you scratch your head? 🎾 `
        : `I can see the mathematical problems on this page, including: "${problems[0]}". Which specific problem or concept would you like help with? `;
    }

    // Add concept-specific help based on lesson analysis
    if (pageContent.concepts && pageContent.concepts.length > 0) {
      const concepts = pageContent.concepts.slice(0, 3);
      response += isGimli 
        ? `This page covers ${concepts.join(', ')}. Let's work through these concepts together! `
        : `This page focuses on ${concepts.join(', ')}. I can help you understand these concepts with step-by-step explanations. `;
        
      // Add specific guidance for circle geometry
      if (concepts.some(c => c.includes('circle') || c.includes('area') || c.includes('circumference'))) {
        response += isGimli 
          ? `Circle problems are fun! Remember: Area = π × r² and Circumference = 2 × π × r. Which formula do you need help with? 🔄 `
          : `For circle problems, we use specific formulas: Area = π × r² and Circumference = 2 × π × r. Which aspect would you like to explore? `;
      }
    }

    // Add specific guidance based on exercise types
    if (pageContent.exerciseTypes) {
      if (pageContent.exerciseTypes.includes('word-problems') || pageContent.exerciseTypes.includes('application')) {
        response += isGimli 
          ? `I love word problems! Let's read through it together and find the important clues! 🕵️‍♂️ `
          : `For word problems, let's identify the key information and what we're solving for. `;
      }
      
      if (pageContent.exerciseTypes.includes('graphing')) {
        response += isGimli 
          ? `Graphing is like drawing a picture of math! Want me to show you how? 📊 `
          : `I can help you visualize this with graphing tools and step-by-step explanations. `;
      }

      if (pageContent.exerciseTypes.includes('practice') || pageContent.exerciseTypes.includes('skill-building')) {
        response += isGimli 
          ? `Practice makes perfect! Let's work through these problems step by step! 💪 `
          : `Let's practice these skills systematically with guided examples. `;
      }
    }

    response += isGimli 
      ? `What exactly is confusing you about this page? 🤔`
      : `What specifically would you like help with on this page?`;

    return response;
  }
}
