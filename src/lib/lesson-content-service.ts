// src/lib/lesson-content-service.ts
// Service for preparing lesson-specific content for Virtual Tutor with OpenAI Vision Analysis

import { LessonService } from './lesson-service';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

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
  // Enhanced with vision analysis
  visualElements?: {
    diagrams: string[];
    mathematicalNotation: string[];
    visualModels: string[];
    problemTypes: string[];
  };
  comprehensiveAnalysis?: {
    pageAnalyses: PageAnalysis[];
    overallSummary: string;
    keyInsights: string[];
    teachingOpportunities: string[];
  };
}

interface PageAnalysis {
  pageNumber: number;
  content: string;
  mathematicalElements: string[];
  visualElements: string[];
  concepts: string[];
  problemTypes: string[];
  confidence: number;
}

interface VisionAnalysisResult {
  success: boolean;
  content: string;
  mathematicalElements: string[];
  visualElements: string[];
  concepts: string[];
  confidence: number;
  error?: string;
  comprehensiveAnalysis?: any;
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
  analysisType?: 'vision-analysis' | 'standard-analysis';
}

export class LessonContentService {
  private static cache = new Map<string, LessonAnalysis>();
  private static dbPath = path.join(process.cwd(), 'vision_cache.db');
  private static database: Database.Database | null = null;
  private static generationLocks = new Map<string, Promise<any>>();
  private static openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  /**
   * UNIVERSAL LESSON VISION ANALYSIS
   * Comprehensive analysis of ALL lesson pages using OpenAI Vision API
   * Works for any lesson regardless of page count (22, 40, 15, etc.)
   */
  /**
   * Initialize database with WAL mode for better concurrency
   */
  private static initDatabase(): Database.Database {
    if (!this.database) {
      this.database = new Database(this.dbPath);
      
      // Enable WAL mode for better concurrent read/write performance
      this.database.pragma('journal_mode = WAL');
      this.database.pragma('synchronous = NORMAL');
      this.database.pragma('cache_size = 1000');
      this.database.pragma('temp_store = memory');
      
      // Create table if it doesn't exist
      this.database.exec(`
        CREATE TABLE IF NOT EXISTS vision_analysis_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cache_key TEXT UNIQUE NOT NULL,
          document_id TEXT NOT NULL,
          lesson_number INTEGER NOT NULL,
          analysis_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          api_cost_estimate DECIMAL(10,4) DEFAULT 0.02
        )
      `);
      
      console.log('🏗️ [Database] Initialized with WAL mode for concurrent access');
    }
    
    return this.database;
  }

  /**
   * Get database instance (singleton pattern for connection pooling)
   */
  private static getDatabase(): Database.Database {
    return this.initDatabase();
  }

  /**
   * Cleanup database connection (call on app shutdown)
   */
  static closeDatabase(): void {
    if (this.database) {
      this.database.close();
      this.database = null;
      console.log('🔌 [Database] Connection closed');
    }
  }

  static async analyzeCompleteVisualLesson(
    documentId: string, 
    lessonNumber: number, 
    bypassCache: boolean = false
  ): Promise<LessonAnalysis> {
    const cacheKey = `lesson_vision_analysis_${documentId}_${lessonNumber}`;
    console.log(`🔍 [LessonContentService] Starting COMPLETE VISION ANALYSIS for ${documentId} - Lesson ${lessonNumber}${bypassCache ? ' (BYPASSING CACHE)' : ''}`);

    // 🚀 CONCURRENCY PROTECTION: Check if already generating
    if (this.generationLocks.has(cacheKey)) {
      console.log(`⏳ [LessonContentService] Already generating ${cacheKey}, waiting for completion...`);
      return await this.generationLocks.get(cacheKey)!;
    }

    // Skip cache if bypassCache is true
    if (!bypassCache) {
      // LAYER 1: Check in-memory cache first (fastest - microseconds)
      const memoryCache = this.cache.get(cacheKey);
      if (memoryCache) {
        console.log(`⚡ [LessonContentService] MEMORY HIT - returning instant result for ${cacheKey}`);
        return memoryCache;
      }

      // LAYER 2: Check persistent database cache (fast - milliseconds)
      const dbCache = await this.loadFromPersistentCache(cacheKey);
      if (dbCache) {
        console.log(`💾 [LessonContentService] DATABASE HIT - loading from persistent cache for ${cacheKey}`);
        // Cache in memory for next time
        this.cache.set(cacheKey, dbCache);
        return dbCache;
      }
    } else {
      console.log(`🔄 [LessonContentService] CACHE BYPASS - forcing fresh analysis`);
    }

    // 🔒 CONCURRENCY PROTECTION: Create generation lock
    const generationPromise = this.performVisionAnalysis(documentId, lessonNumber, cacheKey);
    this.generationLocks.set(cacheKey, generationPromise);

    try {
      const result = await generationPromise;
      return result;
    } finally {
      // Clean up lock when done
      this.generationLocks.delete(cacheKey);
    }
  }

  /**
   * Perform the actual vision analysis (protected by concurrency locks)
   */
  private static async performVisionAnalysis(
    documentId: string, 
    lessonNumber: number, 
    cacheKey: string
  ): Promise<LessonAnalysis> {    // LAYER 3: Only call API if NO cache exists (expensive - 10-30 seconds)
    console.log(`🔥 [LessonContentService] CACHE MISS - calling OpenAI API for ${cacheKey} (this should be rare!)`);
    console.log(`💰 [Cost] This API call costs ~$0.01-0.05`);
    
    try {
      // Step 1: Get lesson page range dynamically
      console.log(`📖 [LessonContentService] Step 1: Getting lesson page range...`);
      const lessonData = await this.getLessonPageRange(documentId, lessonNumber);
      
      if (!lessonData) {
        console.error(`❌ [LessonContentService] Lesson ${lessonNumber} not found in ${documentId}`);
        throw new Error(`Lesson ${lessonNumber} not found in ${documentId}`);
      }

      const pageCount = lessonData.pageRange.end - lessonData.pageRange.start + 1;
      console.log(`✅ [LessonContentService] Found lesson: ${pageCount} pages (${lessonData.pageRange.start}-${lessonData.pageRange.end})`);

      // Step 2: Process ALL lesson pages with OpenAI Vision
      console.log(`🖼️ [LessonContentService] Step 2: Processing ${pageCount} pages with OpenAI Vision API...`);
      const visionAnalysis = await this.processLessonPagesWithVision(
        documentId, 
        lessonData.pageRange
      );

      if (!visionAnalysis.success) {
        console.warn(`⚠️ [LessonContentService] Vision analysis failed, falling back to text extraction`);
        return await this.prepareLessonContent(documentId, lessonNumber);
      }

      // Step 3: Generate comprehensive lesson analysis
      console.log(`🧠 [LessonContentService] Step 3: Generating comprehensive analysis...`);
      const analysis = await this.generateComprehensiveAnalysis(visionAnalysis);

      // Step 4: Build enhanced tutor prompt
      console.log(`🎭 [LessonContentService] Step 4: Building enhanced AI tutor prompt...`);
      const tutorPrompt = this.buildEnhancedTutorPrompt(lessonData, visionAnalysis, analysis);

      // Step 5: Generate advanced teaching strategies
      console.log(`📚 [LessonContentService] Step 5: Generating advanced teaching strategies...`);
      const teachingStrategies = await this.generateAdvancedStrategies(visionAnalysis, analysis);

      const result: LessonAnalysis = {
        lessonId: `${documentId}-lesson-${lessonNumber}`,
        documentId,
        lessonNumber,
        title: lessonData.lessonTitle || `Lesson ${lessonNumber}`,
        pageRange: lessonData.pageRange,
        extractedContent: {
          fullText: visionAnalysis.content,
          formulas: visionAnalysis.mathematicalElements,
          pages: visionAnalysis.pageAnalyses || [],
          confidence: visionAnalysis.confidence,
          comprehensiveAnalysis: visionAnalysis.comprehensiveAnalysis
        },
        analysis,
        tutorPrompt,
        teachingStrategies,
        timestamp: new Date().toISOString(),
        analysisType: 'vision-analysis'
      };

      // Cache the result in both memory and persistent storage
      await this.saveToBothCaches(cacheKey, result);
      console.log(`💾 [LessonContentService] Vision analysis cached in memory and database: ${cacheKey}`);
      console.log(`🎉 [LessonContentService] COMPLETE VISION ANALYSIS finished! {
  lessonId: '${result.lessonId}',
  title: '${result.title}',
  pages: ${pageCount},
  confidence: ${visionAnalysis.confidence}
}`);

      return result;
    } catch (error) {
      console.error(`❌ [LessonContentService] Vision analysis failed:`, error);
      // Fallback to original method
      return await this.prepareLessonContent(documentId, lessonNumber);
    }
  }

  /**
   * Process all lesson pages using OpenAI Vision API
   * Handles lessons of any size with efficient batching
   */
  private static async processLessonPagesWithVision(
    documentId: string,
    pageRange: { start: number; end: number }
  ): Promise<VisionAnalysisResult & { pageAnalyses?: PageAnalysis[]; comprehensiveAnalysis?: any }> {
    try {
      console.log(`🔍 [LessonContentService] Processing pages ${pageRange.start}-${pageRange.end} with Vision API`);
      
      const pageAnalyses: PageAnalysis[] = [];
      let allContent = '';
      let allMathElements: string[] = [];
      let allVisualElements: string[] = [];
      let allConcepts: string[] = [];
      let totalConfidence = 0;
      let processedPages = 0;

      // Process pages in batches to manage API limits
      const batchSize = 5; // Adjust based on API limits
      for (let i = pageRange.start; i <= pageRange.end; i += batchSize) {
        const batchEnd = Math.min(i + batchSize - 1, pageRange.end);
        console.log(`📄 [LessonContentService] Processing batch: pages ${i}-${batchEnd}`);
        
        const batchPromises: Promise<PageAnalysis | null>[] = [];
        for (let pageNum = i; pageNum <= batchEnd; pageNum++) {
          batchPromises.push(this.analyzePageWithVision(documentId, pageNum));
        }
        
        const batchResults = await Promise.all(batchPromises);
        
        for (const result of batchResults) {
          if (result) {
            pageAnalyses.push(result);
            allContent += result.content + '\n\n';
            allMathElements.push(...result.mathematicalElements);
            allVisualElements.push(...result.visualElements);
            allConcepts.push(...result.concepts);
            totalConfidence += result.confidence;
            processedPages++;
          }
        }
        
        // Small delay between batches to respect rate limits
        if (batchEnd < pageRange.end) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Generate comprehensive analysis from all pages
      const comprehensiveAnalysis = await this.generateLessonSummary(pageAnalyses, allContent);

      const avgConfidence = processedPages > 0 ? totalConfidence / processedPages : 0;
      
      console.log(`✅ [LessonContentService] Vision processing complete: ${processedPages} pages analyzed`);
      
      return {
        success: true,
        content: allContent,
        mathematicalElements: [...new Set(allMathElements)],
        visualElements: [...new Set(allVisualElements)],
        concepts: [...new Set(allConcepts)],
        confidence: avgConfidence,
        pageAnalyses,
        comprehensiveAnalysis
      };
    } catch (error) {
      console.error(`❌ [LessonContentService] Vision processing failed:`, error);
      return {
        success: false,
        content: '',
        mathematicalElements: [],
        visualElements: [],
        concepts: [],
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Analyze a single page using OpenAI Vision API
   */
  private static async analyzePageWithVision(
    documentId: string,
    pageNumber: number
  ): Promise<PageAnalysis | null> {
    try {
      console.log(`🔍 [LessonContentService] Analyzing page ${pageNumber} with Vision API`);
      
      // Step 1: Get the image path/URL for the page
      console.log(`📁 [LessonContentService] Step 1: Getting image path for ${documentId} page ${pageNumber}`);
      const imagePath = this.getPageImagePath(documentId, pageNumber);
      
      if (!imagePath) {
        console.warn(`⚠️ [LessonContentService] ISSUE: No image found for page ${pageNumber} - falling back to minimal analysis`);
        console.warn(`🔍 [LessonContentService] This could be why 0 concepts are found - images are required for vision analysis`);
        return this.getFallbackPageAnalysis(pageNumber);
      }

      console.log(`✅ [LessonContentService] Image found: ${imagePath}`);

      // Step 2: Convert image to base64 if it's a local file
      console.log(`🖼️ [LessonContentService] Step 2: Preparing image for Vision API`);
      const imageData = await this.prepareImageForVision(imagePath);
      
      if (!imageData) {
        console.warn(`⚠️ [LessonContentService] ISSUE: Could not prepare image for page ${pageNumber} - image loading failed`);
        console.warn(`🔍 [LessonContentService] This could be why 0 concepts are found - image preparation failed`);
        return this.getFallbackPageAnalysis(pageNumber);
      }

      console.log(`✅ [LessonContentService] Image prepared successfully (${imageData.length} chars)`);

      // Step 3: Check OpenAI API key
      if (!process.env.OPENAI_API_KEY) {
        console.error(`❌ [LessonContentService] CRITICAL: OpenAI API key not found in environment`);
        console.error(`🔍 [LessonContentService] This is definitely why 0 concepts are found - no API key`);
        return this.getFallbackPageAnalysis(pageNumber);
      }

      console.log(`🔑 [LessonContentService] OpenAI API key available: ${process.env.OPENAI_API_KEY.substring(0, 7)}...`);

      // Step 4: Call OpenAI Vision API
      console.log(`🤖 [LessonContentService] Step 3: Calling OpenAI Vision API...`);
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // GPT-4o has vision capabilities
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analyze this mathematics lesson page. Extract:
1. All text content (problems, explanations, instructions)
2. Mathematical elements (equations, formulas, expressions)
3. Visual elements (diagrams, charts, models, illustrations)
4. Mathematical concepts being taught
5. Problem types and examples

IMPORTANT: Respond with ONLY valid JSON, no markdown formatting or code blocks.

Return this exact JSON structure:
{
  "content": "full text content",
  "mathematicalElements": ["equation1", "formula1", ...],
  "visualElements": ["diagram type", "chart description", ...],
  "concepts": ["concept1", "concept2", ...],
  "problemTypes": ["type1", "type2", ...],
  "confidence": 0.95
}`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1
      });

      console.log(`✅ [LessonContentService] OpenAI API call successful`);

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) {
        console.error(`❌ [LessonContentService] ISSUE: No response content from Vision API`);
        console.error(`🔍 [LessonContentService] API call succeeded but no content returned`);
        throw new Error('No response from Vision API');
      }

      console.log(`📝 [LessonContentService] Response received (${responseText.length} chars): ${responseText.substring(0, 100)}...`);

      // Step 5: Parse the JSON response (handle markdown-wrapped JSON)
      console.log(`🔄 [LessonContentService] Step 4: Parsing JSON response...`);
      
      // Clean the response - remove markdown code block wrappers if present
      let cleanedResponse = responseText.trim();
      if (cleanedResponse.startsWith('```json')) {
        console.log(`🧹 [LessonContentService] Removing markdown code block wrapper...`);
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        console.log(`🧹 [LessonContentService] Removing generic code block wrapper...`);
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      console.log(`🔍 [LessonContentService] Cleaned response (${cleanedResponse.length} chars): ${cleanedResponse.substring(0, 100)}...`);
      
      let analysis;
      try {
        analysis = JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.warn(`⚠️ [LessonContentService] JSON parse failed, attempting to extract JSON from response...`);
        console.warn(`🔍 [LessonContentService] Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
        
        // Try to find JSON content within the response
        const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log(`🔍 [LessonContentService] Found JSON pattern, attempting to parse...`);
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error(`Could not extract valid JSON from response: ${cleanedResponse.substring(0, 200)}...`);
        }
      }
      
      console.log(`✅ [LessonContentService] Page ${pageNumber} analyzed successfully`);
      console.log(`📊 [LessonContentService] Found ${analysis.concepts?.length || 0} concepts: ${(analysis.concepts || []).slice(0, 3).join(', ')}`);
      
      return {
        pageNumber,
        content: analysis.content || '',
        mathematicalElements: analysis.mathematicalElements || [],
        visualElements: analysis.visualElements || [],
        concepts: analysis.concepts || [],
        problemTypes: analysis.problemTypes || [],
        confidence: analysis.confidence || 0.8
      };
    } catch (error) {
      console.error(`❌ [LessonContentService] Vision analysis failed for page ${pageNumber}:`, error);
      console.error(`🔍 [LessonContentService] Error details:`, {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'Unknown',
        type: (error as any)?.type || 'Unknown'
      });
      console.warn(`⚠️ [LessonContentService] FALLING BACK to minimal analysis - this is why you see 0 concepts and 0.5 confidence`);
      return this.getFallbackPageAnalysis(pageNumber);
    }
  }

  /**
   * Get the image path for a specific page
   */
  private static getPageImagePath(documentId: string, pageNumber: number): string | null {
    // Check common image paths
    const pageNumberStr = pageNumber.toString().padStart(3, '0'); // Ensure 3-digit format
    const possiblePaths = [
      // Primary path: webapp_pages structure
      path.join(process.cwd(), 'webapp_pages', documentId, 'pages', `page_${pageNumberStr}.png`),
      // Fallback paths for legacy support
      path.join(process.cwd(), 'public', 'documents', documentId, 'pages', `${pageNumber}.png`),
      path.join(process.cwd(), 'public', 'documents', documentId, 'pages', `page_${pageNumber}.png`),
      path.join(process.cwd(), 'public', 'images', documentId, `${pageNumber}.png`),
    ];

    for (const imagePath of possiblePaths) {
      if (fs.existsSync(imagePath)) {
        console.log(`📁 [LessonContentService] Found image: ${imagePath}`);
        return imagePath;
      }
    }

    console.warn(`⚠️ [LessonContentService] No image found for ${documentId} page ${pageNumber}`);
    return null;
  }

  /**
   * Prepare image for Vision API (convert to base64 data URL)
   */
  private static async prepareImageForVision(imagePath: string): Promise<string | null> {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
      return `data:${mimeType};base64,${base64Image}`;
    } catch (error) {
      console.error(`❌ [LessonContentService] Error preparing image:`, error);
      return null;
    }
  }

  /**
   * Generate a comprehensive lesson summary from all page analyses
   */
  private static async generateLessonSummary(
    pageAnalyses: PageAnalysis[],
    allContent: string
  ): Promise<any> {
    try {
      console.log(`🧠 [LessonContentService] Generating comprehensive lesson summary...`);
      console.log(`📊 [LessonContentService] Content length: ${allContent.length} chars, Pages: ${pageAnalyses.length}`);
      
      // Truncate content if it's too long to avoid token limits
      const maxContentLength = 6000; // Reduced to avoid token limits
      const truncatedContent = allContent.length > maxContentLength 
        ? allContent.substring(0, maxContentLength) + '...(content truncated due to length)'
        : allContent;
        
      console.log(`📊 [LessonContentService] Using content length: ${truncatedContent.length} chars`);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert mathematics educator and content analyzer. You MUST respond ONLY with valid JSON - no explanatory text, no markdown formatting, no code blocks, no refusals. If you cannot analyze the content for any reason, still return valid JSON with placeholder values. ALWAYS return JSON."
          },
          {
            role: "user",
            content: `Create a comprehensive lesson summary for this mathematics lesson containing ${pageAnalyses.length} pages.

LESSON CONTENT SAMPLE:
${truncatedContent}

KEY CONCEPTS FOUND: ${[...new Set(pageAnalyses.flatMap(p => p.concepts))].join(', ')}

Create a detailed educational summary with exactly this JSON structure:

{
  "overallSummary": "2-3 paragraph explanation of what students learn and why it matters",
  "vocabulary": [
    {
      "term": "proportional relationship",
      "definition": "clear definition",
      "gradeLevel": "student-friendly explanation", 
      "usage": "how it's used",
      "synonyms": ["related terms"],
      "visualCue": "memory aid"
    }
  ],
  "studentPracticeProblems": [
    {
      "problemNumber": 1,
      "difficulty": "beginner",
      "type": "word problem",
      "question": "Real practice problem based on lesson content",
      "conceptsFocused": ["specific concepts"],
      "estimatedTimeMinutes": 3,
      "vocabularyReinforced": ["vocabulary terms"]
    }
  ],
  "conceptBreakdown": [
    {
      "concept": "main concept from lesson",
      "explanation": "detailed explanation",
      "whyItMatters": "importance",
      "connections": "connections to other topics"
    }
  ],
  "problemExamples": [
    {
      "problemType": "example type",
      "example": "actual example from lesson",
      "solution": "step-by-step solution",
      "keySteps": ["step 1", "step 2"],
      "commonErrors": "typical mistakes"
    }
  ],
  "teachingTips": [
    "actionable teaching tip based on lesson content"
  ]
}

Provide 8-12 vocabulary terms, exactly 10 practice problems (3 beginner, 4 intermediate, 3 advanced), and comprehensive educational content.`
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      });

      const responseText = response.choices[0]?.message?.content;
      if (responseText) {
        console.log('📝 [LessonContentService] Raw OpenAI response (first 200 chars):', responseText.substring(0, 200));
        
        // Check if AI refused the request or hit content policies
        if (responseText.trim().startsWith("I'm unable") || 
            responseText.trim().startsWith("I cannot") || 
            responseText.trim().startsWith("I apologize") ||
            !responseText.includes('{')) {
          console.warn('⚠️ [LessonContentService] AI refused request or returned non-JSON. Response:', responseText.substring(0, 100));
          throw new Error('AI returned non-JSON response - likely content policy or token limit issue');
        }
        
        // Clean the response - remove markdown code block wrappers if present
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        try {
          const parsedSummary = JSON.parse(cleanedResponse);
          console.log('✅ [LessonContentService] Successfully parsed lesson summary with vocabulary count:', parsedSummary.vocabulary?.length);
          console.log('✅ [LessonContentService] Practice problems count:', parsedSummary.studentPracticeProblems?.length);
          return parsedSummary;
        } catch (parseError) {
          console.error('❌ [LessonContentService] JSON parse error:', parseError);
          console.error('❌ [LessonContentService] Failed content (first 300 chars):', cleanedResponse.substring(0, 300));
          throw parseError;
        }
      }
    } catch (error) {
      console.error(`❌ [LessonContentService] Error generating lesson summary:`, error);
    }

    // Fallback summary with comprehensive structure
    return {
      overallSummary: `Comprehensive lesson covering ${pageAnalyses.length} pages of mathematical content`,
      keyInsights: ["Mathematical content identified across all pages"],
      vocabulary: [
        {
          term: "Mathematical Content",
          definition: "Concepts and procedures covered in this lesson",
          gradeLevel: "age-appropriate explanation",
          usage: "Used throughout mathematical problem solving",
          synonyms: ["math concepts", "mathematical ideas"],
          visualCue: "Look for numbers, symbols, and mathematical operations"
        },
        {
          term: "PEMDAS",
          definition: "Order of operations: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction",
          gradeLevel: "The steps to follow when solving math problems with multiple operations",
          usage: "Used to solve complex mathematical expressions correctly",
          synonyms: ["GEMDAS", "Order of Operations"],
          visualCue: "Please Excuse My Dear Aunt Sally"
        },
        {
          term: "Variable",
          definition: "A letter or symbol that represents an unknown number",
          gradeLevel: "A placeholder for a number we don't know yet",
          usage: "Used in equations and expressions to represent unknown values",
          synonyms: ["unknown", "letter"],
          visualCue: "Usually letters like x, y, or n"
        },
        {
          term: "Expression",
          definition: "A mathematical phrase with numbers, operations, and variables",
          gradeLevel: "A math sentence without an equals sign",
          usage: "Used to represent mathematical relationships and calculations",
          synonyms: ["mathematical phrase"],
          visualCue: "Contains numbers and operations but no equals sign"
        }
      ],
      studentPracticeProblems: [
        {
          problemNumber: 1,
          difficulty: "beginner",
          type: "word problem",
          question: "Practice problem based on lesson content for beginning learners",
          conceptsFocused: ["Basic lesson concepts"],
          estimatedTimeMinutes: 3,
          vocabularyReinforced: ["Mathematical Content"]
        },
        {
          problemNumber: 2,
          difficulty: "beginner",
          type: "computational",
          question: "Simple computational practice problem",
          conceptsFocused: ["Basic calculations"],
          estimatedTimeMinutes: 3,
          vocabularyReinforced: ["Expression", "PEMDAS"]
        },
        {
          problemNumber: 3,
          difficulty: "beginner",
          type: "visual/diagram",
          question: "Visual problem using diagrams or charts",
          conceptsFocused: ["Visual representation"],
          estimatedTimeMinutes: 4,
          vocabularyReinforced: ["Mathematical Content"]
        },
        {
          problemNumber: 4,
          difficulty: "intermediate",
          type: "word problem",
          question: "More complex real-world application problem",
          conceptsFocused: ["Applied concepts"],
          estimatedTimeMinutes: 5,
          vocabularyReinforced: ["Variable", "Expression"]
        },
        {
          problemNumber: 5,
          difficulty: "intermediate",
          type: "computational",
          question: "Multi-step computational challenge",
          conceptsFocused: ["Complex calculations"],
          estimatedTimeMinutes: 4,
          vocabularyReinforced: ["PEMDAS"]
        },
        {
          problemNumber: 6,
          difficulty: "intermediate",
          type: "visual/diagram",
          question: "Complex visual analysis problem",
          conceptsFocused: ["Advanced visual skills"],
          estimatedTimeMinutes: 6,
          vocabularyReinforced: ["Mathematical Content"]
        },
        {
          problemNumber: 7,
          difficulty: "intermediate",
          type: "word problem",
          question: "Multi-step real-world scenario",
          conceptsFocused: ["Problem solving"],
          estimatedTimeMinutes: 6,
          vocabularyReinforced: ["Variable", "Expression"]
        },
        {
          problemNumber: 8,
          difficulty: "advanced",
          type: "computational",
          question: "Advanced computational challenge",
          conceptsFocused: ["Complex operations"],
          estimatedTimeMinutes: 7,
          vocabularyReinforced: ["PEMDAS", "Expression"]
        },
        {
          problemNumber: 9,
          difficulty: "advanced",
          type: "visual/diagram",
          question: "Advanced visual problem requiring deep analysis",
          conceptsFocused: ["Advanced reasoning"],
          estimatedTimeMinutes: 8,
          vocabularyReinforced: ["Mathematical Content"]
        },
        {
          problemNumber: 10,
          difficulty: "advanced",
          type: "word problem",
          question: "Complex real-world scenario requiring multiple strategies",
          conceptsFocused: ["Advanced problem solving"],
          estimatedTimeMinutes: 8,
          vocabularyReinforced: ["Variable", "Expression", "PEMDAS"]
        }
      ],
      problemExamples: [
        {
          type: "Practice Problem",
          problem: "Example mathematical problem from lesson content",
          solution: "Step-by-step solution approach",
          difficulty: "moderate"
        }
      ],
      problemGenerationTemplates: [
        {
          template: "Create problems similar to those found in the lesson",
          variables: ["adjust numbers and contexts"],
          scaffolding: "provide hints and support as needed"
        }
      ],
      teachingOpportunities: ["Use visual elements to enhance understanding"],
      learningProgression: ["Introduction", "Development", "Practice", "Assessment"],
      prerequisiteKnowledge: ["Prior mathematical concepts needed"],
      commonMisconceptions: [
        {
          misconception: "Common errors students might make",
          whyItHappens: "Incomplete understanding of concepts",
          howToCorrect: "Provide clear explanations and examples",
          checkForUnderstanding: "Ask targeted questions"
        }
      ],
      differentiationStrategies: {
        strugglingStudents: ["Provide additional visual supports"],
        onLevelStudents: ["Use standard teaching approaches"],
        advancedStudents: ["Offer extension challenges"]
      },
      realWorldConnections: [
        {
          context: "Everyday mathematical applications",
          explanation: "How mathematical concepts apply in daily life",
          studentActivity: "Explore real-world examples and connections"
        }
      ],
      assessmentSuggestions: ["Formative assessment", "Practice problems", "Concept checks"],
      assessmentRubric: {
        criteria: ["Understanding of concepts", "Problem-solving skills"],
        levels: ["Beginning", "Developing", "Proficient", "Advanced"]
      },
      extensionActivities: ["Additional challenges for interested students"],
      teachingTips: ["Effective strategies for presenting this content"],
      parentConnections: ["Ways parents can support learning at home"]
    };
  }

  /**
   * Fallback page analysis when vision fails
   * This is why you see 0 concepts found and 0.5 confidence
   */
  private static getFallbackPageAnalysis(pageNumber: number): PageAnalysis {
    console.warn(`⚠️ [LessonContentService] Using FALLBACK analysis for page ${pageNumber}`);
    console.warn(`📊 [LessonContentService] This will contribute 0 concepts and 0.5 confidence to the final result`);
    console.warn(`🔍 [LessonContentService] Check above logs for the specific failure reason`);
    
    return {
      pageNumber,
      content: `Mathematical content from page ${pageNumber} (fallback - vision analysis failed)`,
      mathematicalElements: [],
      visualElements: [],
      concepts: [], // This is why you get 0 concepts!
      problemTypes: [],
      confidence: 0.5 // This is why you get 0.5 confidence!
    };
  }

  /**
   * Generate comprehensive analysis from vision results
   */
  private static async generateComprehensiveAnalysis(visionAnalysis: VisionAnalysisResult): Promise<MathAnalysis> {
    try {
      console.log(`🧠 [LessonContentService] Generating comprehensive analysis from vision results...`);
      
      const text = visionAnalysis.content.toLowerCase();
      
      // Enhanced concept detection using vision results
      const allConcepts = [...new Set([
        ...visionAnalysis.concepts,
        ...this.detectConceptsFromText(text)
      ])];
      
      // Determine difficulty from mathematical elements
      const difficulty = this.assessDifficultyFromElements(visionAnalysis.mathematicalElements);
      
      // Extract vocabulary from content
      const vocabulary = this.extractMathVocabulary(text);
      
      // Determine prerequisites
      const prerequisites = this.determinePrerequisites(allConcepts);
      
      const analysis: MathAnalysis = {
        concepts: allConcepts,
        difficulty,
        formulas: visionAnalysis.mathematicalElements,
        vocabulary,
        prerequisites
      };
      
      console.log(`✅ [LessonContentService] Comprehensive analysis complete:`, {
        conceptCount: allConcepts.length,
        difficulty,
        formulaCount: visionAnalysis.mathematicalElements.length
      });
      
      return analysis;
    } catch (error) {
      console.error(`❌ [LessonContentService] Error generating comprehensive analysis:`, error);
      
      // Fallback analysis
      return {
        concepts: visionAnalysis.concepts,
        difficulty: 'intermediate',
        formulas: visionAnalysis.mathematicalElements,
        vocabulary: [],
        prerequisites: ['basic arithmetic']
      };
    }
  }

  /**
   * Detect mathematical concepts from text content
   */
  private static detectConceptsFromText(text: string): string[] {
    const conceptPatterns = {
      'algebra': /algebra|equation|variable|expression|solve|linear|quadratic/g,
      'geometry': /geometry|triangle|circle|angle|area|perimeter|volume|polygon/g,
      'fractions': /fraction|numerator|denominator|\/|proper|improper|mixed number/g,
      'decimals': /decimal|point|tenths|hundredths|place value/g,
      'ratios': /ratio|proportion|rate|compare|equivalent/g,
      'percentages': /percent|%|percentage|out of 100/g,
      'statistics': /mean|median|mode|average|data|graph|chart|survey/g,
      'probability': /probability|chance|likely|outcome|event|random/g,
      'measurement': /measure|length|width|height|weight|capacity|temperature/g,
      'number_operations': /addition|subtraction|multiplication|division|factor|multiple/g
    };
    
    const detectedConcepts: string[] = [];
    for (const [concept, pattern] of Object.entries(conceptPatterns)) {
      if (pattern.test(text)) {
        detectedConcepts.push(concept);
      }
    }
    
    return detectedConcepts;
  }

  /**
   * Assess difficulty level from mathematical elements
   */
  private static assessDifficultyFromElements(mathematicalElements: string[]): 'beginner' | 'intermediate' | 'advanced' {
    const elementsText = mathematicalElements.join(' ').toLowerCase();
    
    const advancedIndicators = [
      'quadratic', 'polynomial', 'logarithm', 'trigonometry', 'calculus',
      'derivative', 'integral', 'function', 'inequality system', 'matrix'
    ];
    
    const intermediateIndicators = [
      'equation', 'variable', 'expression', 'graph', 'coordinate',
      'slope', 'intercept', 'system', 'inequality'
    ];
    
    if (advancedIndicators.some(indicator => elementsText.includes(indicator))) {
      return 'advanced';
    } else if (intermediateIndicators.some(indicator => elementsText.includes(indicator))) {
      return 'intermediate';
    }
    
    return 'beginner';
  }

  /**
   * Build enhanced tutor prompt from vision analysis
   */
  private static buildEnhancedTutorPrompt(
    lessonData: any,
    visionAnalysis: VisionAnalysisResult,
    analysis: MathAnalysis
  ): string {
    const pageCount = lessonData.pageRange.end - lessonData.pageRange.start + 1;
    const conceptsText = analysis.concepts.join(', ');
    const visualElements = visionAnalysis.visualElements.slice(0, 10).join(', ');
    
    const prompt = `You are an expert AI math tutor with comprehensive knowledge of "${lessonData.lessonTitle || `Lesson ${lessonData.lessonNumber}`}" - a ${pageCount}-page mathematics lesson.

LESSON OVERVIEW:
- Title: ${lessonData.lessonTitle || `Lesson ${lessonData.lessonNumber}`}
- Pages: ${pageCount} (${lessonData.pageRange.start}-${lessonData.pageRange.end})
- Concepts: ${conceptsText}
- Difficulty Level: ${analysis.difficulty}
- Visual Elements: ${visualElements}

MATHEMATICAL CONTENT ANALYZED:
- Key formulas and equations: ${visionAnalysis.mathematicalElements.slice(0, 8).join('; ')}
- Mathematical vocabulary: ${analysis.vocabulary.join(', ')}
- Prerequisites needed: ${analysis.prerequisites.join(', ')}

COMPREHENSIVE LESSON INSIGHTS:
${visionAnalysis.comprehensiveAnalysis?.overallSummary || 'Complete visual analysis of all lesson pages performed'}

Your role as an AI tutor:
1. Help students master the SPECIFIC concepts from this ${pageCount}-page lesson
2. Reference the actual visual elements and diagrams from the lesson pages
3. Use the exact mathematical formulas and terminology from the lesson
4. Provide step-by-step guidance appropriate for ${analysis.difficulty}-level students
5. Connect new concepts to the identified prerequisites
6. Encourage exploration and understanding, not just memorization
7. Use the comprehensive lesson analysis to provide contextual help

Be patient, encouraging, and leverage the complete lesson content to provide the most helpful tutoring experience possible.`;

    console.log(`🎭 [LessonContentService] Built enhanced tutor prompt (${prompt.length} characters)`);
    return prompt;
  }

  /**
   * Generate advanced teaching strategies from vision analysis
   */
  private static async generateAdvancedStrategies(
    visionAnalysis: VisionAnalysisResult,
    analysis: MathAnalysis
  ): Promise<string[]> {
    const strategies: string[] = [];
    
    // Base strategies enhanced with vision insights
    strategies.push("Leverage the visual diagrams and illustrations from the lesson pages");
    strategies.push("Reference specific examples and problems shown in the lesson");
    strategies.push("Use the mathematical formulas exactly as presented in the lesson");
    
    // Vision-specific strategies
    if (visionAnalysis.visualElements.length > 0) {
      strategies.push(`Utilize the ${visionAnalysis.visualElements.length} visual elements identified: ${visionAnalysis.visualElements.slice(0, 3).join(', ')}`);
      strategies.push("Connect visual representations to abstract mathematical concepts");
    }
    
    // Mathematical element strategies
    if (visionAnalysis.mathematicalElements.length > 5) {
      strategies.push("Practice with the variety of mathematical expressions and formulas in the lesson");
      strategies.push("Build connections between different mathematical representations");
    }
    
    // Concept-specific enhanced strategies
    if (analysis.concepts.includes('algebra')) {
      strategies.push("Use the lesson's variable examples to build algebraic thinking");
      strategies.push("Connect algebraic expressions to the real-world contexts shown");
    }
    
    if (analysis.concepts.includes('geometry')) {
      strategies.push("Measure and analyze the geometric figures shown in the lesson");
      strategies.push("Create similar problems using the lesson's geometric examples");
    }
    
    // Difficulty-based strategies
    if (analysis.difficulty === 'advanced') {
      strategies.push("Break the complex mathematical processes into the steps shown in the lesson");
      strategies.push("Provide multiple solution approaches as demonstrated in the lesson");
    }
    
    if (analysis.difficulty === 'beginner') {
      strategies.push("Use the lesson's step-by-step examples for guided practice");
      strategies.push("Reinforce basic concepts with the lesson's foundational examples");
    }
    
    // Comprehensive analysis strategies
    if (visionAnalysis.comprehensiveAnalysis) {
      const insights = visionAnalysis.comprehensiveAnalysis.keyInsights || [];
      if (insights.length > 0) {
        strategies.push(`Focus on key insights: ${insights.slice(0, 2).join(' and ')}`);
      }
      
      const opportunities = visionAnalysis.comprehensiveAnalysis.teachingOpportunities || [];
      if (opportunities.length > 0) {
        strategies.push(`Leverage teaching opportunities: ${opportunities.slice(0, 2).join(' and ')}`);
      }
    }
    
    console.log(`📚 [LessonContentService] Generated ${strategies.length} advanced teaching strategies`);
    return strategies;
  }
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
        timestamp: new Date().toISOString(),
        analysisType: 'standard-analysis'
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
   * Get cached lesson analysis if it exists
   */
  static getCachedAnalysis(documentId: string, lessonNumber: number): LessonAnalysis | null {
    const cacheKey = `lesson_analysis_${documentId}_${lessonNumber}`;
    const cached = this.cache.get(cacheKey);
    console.log(`🔍 [LessonContentService] Getting cached analysis for ${cacheKey}: ${cached ? 'found' : 'not found'}`);
    return cached || null;
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

  /**
   * Cache student questions for persistent storage
   */
  static cacheQuestions(documentId: string, lessonNumber: number, questionsData: any) {
    const cacheKey = `lesson_questions_${documentId}_${lessonNumber}`;
    
    // Store in memory cache
    this.cache.set(cacheKey, questionsData);
    
    // Store in persistent database cache
    this.saveToPersistentCache(cacheKey, questionsData);
    
    console.log(`💾 [LessonContentService] Student questions cached with key: ${cacheKey}`);
  }

  /**
   * Get cached student questions if they exist
   */
  static getCachedQuestions(documentId: string, lessonNumber: number): any | null {
    const cacheKey = `lesson_questions_${documentId}_${lessonNumber}`;
    
    // Check memory cache first
    let cached = this.cache.get(cacheKey);
    
    if (!cached) {
      // Try to load from persistent cache
      try {
        cached = this.loadQuestionsFromPersistentCache(cacheKey);
        if (cached) {
          // Store in memory for faster access
          this.cache.set(cacheKey, cached);
        }
      } catch (error) {
        console.warn(`⚠️ [LessonContentService] Error loading questions from persistent cache:`, error);
      }
    }
    
    console.log(`🔍 [LessonContentService] Getting cached questions for ${cacheKey}: ${cached ? 'found' : 'not found'}`);
    return cached || null;
  }

  /**
   * Clear cached questions for a specific lesson
   */
  static clearCachedQuestions(documentId: string, lessonNumber: number) {
    const cacheKey = `lesson_questions_${documentId}_${lessonNumber}`;
    
    // Remove from memory cache
    this.cache.delete(cacheKey);
    
    // Remove from persistent cache
    try {
      const db = this.getDatabase();
      const stmt = db.prepare('DELETE FROM vision_analysis_cache WHERE cache_key = ?');
      stmt.run(cacheKey);
      console.log(`🗑️ [LessonContentService] Cleared questions cache for ${cacheKey}`);
    } catch (error) {
      console.warn(`⚠️ [LessonContentService] Error clearing questions from persistent cache:`, error);
    }
  }

  /**
   * Load from persistent database cache
   */
  private static async loadFromPersistentCache(cacheKey: string): Promise<LessonAnalysis | null> {
    try {
      const db = this.getDatabase();
      
      const stmt = db.prepare(`
        SELECT analysis_data, created_at 
        FROM vision_analysis_cache 
        WHERE cache_key = ?
      `);
      
      const row = stmt.get(cacheKey) as any;
      
      if (row) {
        console.log(`📊 [Cache] Found persistent cache entry from ${row.created_at}`);
        return JSON.parse(row.analysis_data);
      }
      
      return null;
    } catch (error) {
      console.warn(`⚠️ [Cache] Error loading from persistent cache:`, error);
      return null;
    }
  }

  /**
   * Load questions from persistent database cache
   */
  private static loadQuestionsFromPersistentCache(cacheKey: string): any | null {
    try {
      const db = new Database(this.dbPath, { readonly: true });
      
      const stmt = db.prepare(`
        SELECT analysis_data, created_at 
        FROM vision_analysis_cache 
        WHERE cache_key = ?
      `);
      
      const row = stmt.get(cacheKey) as any;
      db.close();
      
      if (row) {
        console.log(`📊 [Cache] Found persistent questions cache entry from ${row.created_at}`);
        return JSON.parse(row.analysis_data);
      }
      
      return null;
    } catch (error) {
      console.warn(`⚠️ [Cache] Error loading questions from persistent cache:`, error);
      return null;
    }
  }

  /**
   * Save questions to persistent database cache
   */
  private static saveToPersistentCache(cacheKey: string, questionsData: any): void {
    try {
      const db = this.getDatabase();
      
      // Extract document ID and lesson number from cache key
      // Format: lesson_questions_RCM07_NA_SW_V1_1
      const keyParts = cacheKey.split('_');
      const lessonNumber = parseInt(keyParts[keyParts.length - 1]);
      const documentId = keyParts.slice(2, -1).join('_');
      
      // Insert or replace cache entry
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO vision_analysis_cache 
        (cache_key, document_id, lesson_number, analysis_data)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run(
        cacheKey,
        documentId,
        lessonNumber,
        JSON.stringify(questionsData)
      );
      
      console.log(`💾 [Cache] Saved to persistent database: ${cacheKey}`);
      
    } catch (error) {
      console.warn(`⚠️ [Cache] Error saving to persistent cache:`, error);
    }
  }

  /**
   * Save to both memory and persistent cache
   */
  private static async saveToBothCaches(cacheKey: string, analysis: LessonAnalysis): Promise<void> {
    // Save to memory cache
    this.cache.set(cacheKey, analysis);
    
    // Save to persistent database cache
    try {
      const db = new Database(this.dbPath);
      
      // Create table if it doesn't exist
      db.exec(`
        CREATE TABLE IF NOT EXISTS vision_analysis_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cache_key TEXT UNIQUE NOT NULL,
          document_id TEXT NOT NULL,
          lesson_number INTEGER NOT NULL,
          analysis_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          api_cost_estimate DECIMAL(10,4) DEFAULT 0.02
        )
      `);
      
      // Insert or replace cache entry
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO vision_analysis_cache 
        (cache_key, document_id, lesson_number, analysis_data)
        VALUES (?, ?, ?, ?)
      `);
      
      const [docId, lessonStr] = analysis.lessonId.split('-');
      // Extract lesson number from lessonId format like "RCM07_NA_SW_V1-lesson-2"
      const lessonNumberMatch = analysis.lessonId.match(/lesson-(\d+)$/);
      const lessonNumber = lessonNumberMatch ? parseInt(lessonNumberMatch[1]) : parseInt(lessonStr || '0');
      
      stmt.run(
        cacheKey,
        docId,
        lessonNumber,
        JSON.stringify(analysis)
      );
      
      db.close();
      console.log(`💾 [Cache] Saved to persistent database: ${cacheKey}`);
      
    } catch (error) {
      console.error(`❌ [Cache] Error saving to persistent cache:`, error);
      // Continue anyway - we still have memory cache
    }
  }

  /**
   * Check if lesson analysis exists in ANY cache layer
   */
  static async isLessonCached(documentId: string, lessonNumber: number): Promise<boolean> {
    const cacheKey = `lesson_vision_analysis_${documentId}_${lessonNumber}`;
    
    // Check memory first
    if (this.cache.has(cacheKey)) {
      return true;
    }
    
    // Check persistent cache
    const dbCache = await this.loadFromPersistentCache(cacheKey);
    return dbCache !== null;
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    memoryEntries: number;
    persistentEntries: number;
    totalSavedApiCalls: number;
    estimatedSavings: number;
  }> {
    try {
      const db = new Database(this.dbPath, { readonly: true });
      
      const stmt = db.prepare('SELECT COUNT(*) as count, SUM(api_cost_estimate) as savings FROM vision_analysis_cache');
      const result = stmt.get() as any;
      db.close();
      
      return {
        memoryEntries: this.cache.size,
        persistentEntries: result.count || 0,
        totalSavedApiCalls: result.count || 0,
        estimatedSavings: result.savings || 0
      };
    } catch (error) {
      return {
        memoryEntries: this.cache.size,
        persistentEntries: 0,
        totalSavedApiCalls: 0,
        estimatedSavings: 0
      };
    }
  }

  /**
   * Clear cache for a specific lesson to force regeneration
   */
  static async clearLessonCache(documentId: string, lessonNumber: number): Promise<void> {
    const cacheKey = `lesson_vision_analysis_${documentId}_${lessonNumber}`;
    console.log(`🗑️ [LessonContentService] Clearing cache for ${cacheKey}`);
    
    // Clear from memory cache
    this.cache.delete(cacheKey);
    
    // Clear from persistent cache
    try {
      const db = new Database(this.dbPath);
      const stmt = db.prepare('DELETE FROM vision_analysis_cache WHERE cache_key = ?');
      const result = stmt.run(cacheKey);
      db.close();
      
      console.log(`✅ [LessonContentService] Cleared ${result.changes} entries from persistent cache`);
    } catch (error) {
      console.error('❌ [LessonContentService] Error clearing persistent cache:', error);
    }
  }

  /**
   * Generate lesson-specific questions that 11-year-olds would naturally ask
   * Based on the lesson summary and anticipating student confusion points
   */
  static async generateKidFriendlyQuestions(lessonSummary: any): Promise<string[]> {
    console.log(`🧒 [LessonContentService] Generating kid-friendly questions from lesson summary`);
    
    if (!lessonSummary || !this.openai) {
      console.log(`⚠️ [LessonContentService] No lesson summary or OpenAI not available, using fallback questions`);
      return [
        "What does this mean?",
        "How do I solve this?", 
        "Can you explain this step?",
        "I don't understand this part",
        "Can you show me an example?",
        "Is this the right answer?"
      ];
    }

    try {
      console.log(`🔍 [LessonContentService] Full lesson summary object:`, JSON.stringify(lessonSummary, null, 2).substring(0, 500));
      
      // Try different possible data structures
      const concepts = lessonSummary.conceptBreakdown?.map((c: any) => c.concept) || 
                      lessonSummary.concepts?.map((c: any) => c.concept || c.name || c) || 
                      lessonSummary.analysis?.concepts || [];
      
      const vocabulary = lessonSummary.vocabulary?.map((v: any) => v.term) || 
                        lessonSummary.keyTerms || 
                        lessonSummary.analysis?.vocabulary || [];
      
      const overallSummary = lessonSummary.overallSummary || 
                            lessonSummary.summary || 
                            lessonSummary.title || 
                            lessonSummary.analysis?.summary || '';

      console.log(`🔍 [LessonContentService] Lesson summary structure:`, {
        hasConceptBreakdown: !!lessonSummary.conceptBreakdown,
        conceptsCount: concepts.length,
        hasVocabulary: !!lessonSummary.vocabulary,
        vocabularyCount: vocabulary.length,
        overallSummaryLength: overallSummary.length,
        summaryPreview: overallSummary.substring(0, 200),
        availableKeys: Object.keys(lessonSummary || {})
      });

      if (!overallSummary && concepts.length === 0) {
        console.log(`⚠️ [LessonContentService] No meaningful lesson data found, using fallback questions`);
        return [
          "What does this mean?",
          "How do I solve this?", 
          "Can you explain this step?",
          "I don't understand this part",
          "Can you show me an example?",
          "Is this the right answer?"
        ];
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert in child psychology and elementary mathematics education. You understand exactly what confuses 11-year-old students and what questions they naturally ask when learning new math concepts. 

CRITICAL: You must respond with ONLY a JSON array of exactly 6 questions. No explanations, no markdown, no other text. Just the JSON array.

The questions should:
- Be written exactly as an 11-year-old would ask them
- Use simple, kid-friendly language
- Focus on the specific confusion points in this lesson
- Anticipate where kids get stuck
- Sound natural and authentic to how kids actually speak`
          },
          {
            role: "user",
            content: `Create exactly 6 questions that 11-year-old students would naturally ask about this math lesson:

LESSON SUMMARY: ${overallSummary.substring(0, 500)}

KEY CONCEPTS: ${concepts.slice(0, 5).join(', ')}

VOCABULARY TERMS: ${vocabulary.slice(0, 8).join(', ')}

Examples of how 11-year-olds ask questions:
- "Wait, what does [term] mean again?"
- "I'm confused about the [concept] part"
- "How do you know when to [action]?"
- "What if I get a different answer?"
- "Is there an easier way to do this?"
- "Why do we have to do it this way?"

Return exactly 6 questions as a JSON array that sound like real questions 11-year-olds would ask about THIS specific lesson.`
          }
        ],
        max_tokens: 300,
        temperature: 0.3
      });

      console.log(`🤖 [LessonContentService] Sent prompt to OpenAI with:`, {
        overallSummary: overallSummary.substring(0, 100) + '...',
        concepts: concepts.slice(0, 3),
        vocabulary: vocabulary.slice(0, 5)
      });

      const responseText = response.choices[0]?.message?.content;
      if (responseText) {
        console.log(`🔍 [LessonContentService] Raw OpenAI response:`, responseText.substring(0, 300));
        
        // Clean the response
        let cleanedResponse = responseText.trim();
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        console.log(`🧹 [LessonContentService] Cleaned response:`, cleanedResponse.substring(0, 300));

        try {
          const questions = JSON.parse(cleanedResponse);
          if (Array.isArray(questions) && questions.length >= 4) {
            console.log(`✅ [LessonContentService] Generated ${questions.length} kid-friendly questions:`, questions);
            return questions.slice(0, 6); // Ensure max 6 questions
          } else {
            console.warn(`⚠️ [LessonContentService] Invalid questions format - expected array with 4+ items, got:`, typeof questions, Array.isArray(questions) ? questions.length : 'not array');
          }
        } catch (parseError) {
          console.error('❌ [LessonContentService] Error parsing AI response:', parseError);
          console.error('Response was:', cleanedResponse.substring(0, 200));
        }
      } else {
        console.error('❌ [LessonContentService] No response content from OpenAI');
      }
    } catch (error) {
      console.error(`❌ [LessonContentService] Error generating kid-friendly questions:`, error);
    }

    // Fallback questions if AI generation fails
    return [
      "What does this mean?",
      "How do I solve this?", 
      "Can you explain this step?",
      "I don't understand this part",
      "Can you show me an example?",
      "Is this the right answer?"
    ];
  }

  /**
   * Clear all cache entries (use with caution)
   */
  static async clearAllCache(): Promise<void> {
    console.log(`🗑️ [LessonContentService] Clearing ALL cache entries`);
    
    // Clear memory cache
    this.cache.clear();
    
    // Clear persistent cache
    try {
      const db = new Database(this.dbPath);
      const stmt = db.prepare('DELETE FROM vision_analysis_cache');
      const result = stmt.run();
      db.close();
      
      console.log(`✅ [LessonContentService] Cleared ${result.changes} entries from persistent cache`);
    } catch (error) {
      console.error('❌ [LessonContentService] Error clearing persistent cache:', error);
    }
  }
}
