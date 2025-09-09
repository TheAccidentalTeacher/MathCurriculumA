import OpenAI from 'openai';
import { AICurriculumContextService, CurriculumContext, UnitPacingRecommendation, AIModel, AVAILABLE_MODELS, ModelConfiguration } from './ai-curriculum-context';
import { dynamicScopeSequenceService, DynamicPacingConfig } from './dynamic-scope-sequence';
import fs from 'fs';
import path from 'path';

export interface PacingGuideRequest {
  gradeLevel: string; // Keep for backwards compatibility
  gradeCombination?: {
    selectedGrades: string[];
    pathwayType: 'sequential' | 'accelerated' | 'combined' | 'custom';
    skipGrades?: string[];
    emphasis?: 'balanced' | 'foundational' | 'advanced';
  };
  timeframe: string;
  studentPopulation: string;
  priorities?: string[];
  scheduleConstraints?: {
    daysPerWeek: number;
    minutesPerClass: number;
    specialEvents?: string[];
  };
  differentiationNeeds?: string[];
  chunkInfo?: {
    isChunk: boolean;
    chunkNumber: number;
    totalChunks: number;
    startWeek: number;
    endWeek: number;
    totalWeeks: number;
    previousChunkContext?: {
      lastUnit?: string;
      assessmentPlan?: any;
    };
  };
}

export interface PacingGuideResponse {
  success: boolean;
  pacingGuide?: GeneratedPacingGuide;
  detailedLessonGuide?: DetailedLessonGuide;
  recommendations?: UnitPacingRecommendation[];
  error?: string;
}

export interface DetailedLessonGuide {
  pathway: {
    name: string;
    description: string;
    targetOutcome: string;
    duration: string;
  };
  analysisResults: {
    choicesAnalyzed: any;
    scopeAndSequenceMatch: string;
    standardsCoverage: StandardsCoverageAnalysis;
    prerequisiteCheck: PrerequisiteAnalysis;
  };
  lessonByLessonBreakdown: DetailedLesson[];
  progressionMap: ProgressionStage[];
  assessmentStrategy: DetailedAssessmentStrategy;
  teachingSupport: TeachingSupport;
}

export interface DetailedLesson {
  lessonNumber: number;
  title: string;
  textbookSource?: string;
  volume?: string;
  unit: string;
  unitNumber?: number;
  pageNumber?: string;
  grade: string;
  week?: number;
  standards: {
    primary: string[];
    supporting: string[];
    mathematicalPractices: string[];
    ccssCode?: string;
    description?: string;
  } | string[]; // Support both old and new formats
  objectives: string;
  keyTopics: string[];
  sessions?: Array<{
    sessionNumber: number;
    sessionTitle: string;
    duration: string;
    focus: string;
  }>;
  estimatedDays: number;
  prerequisites?: string;
  connectionToNext?: string;
  teachingNotes?: string;
  // Legacy fields for backward compatibility
  duration?: {
    sessions: number;
    totalMinutes: number;
  };
  learningObjectives?: string[];
  keyVocabulary?: string[];
  materials?: string[];
  lessonStructure?: LessonPhase[];
  differentiation?: {
    supports: string[];
    extensions: string[];
    accommodations: string[];
  };
  assessment?: {
    formative: string[];
    summative?: string;
    exitTicket: string;
  };
  homework: string;
  realWorldApplication: string;
}

export interface LessonPhase {
  phase: 'Warm-Up' | 'Explore' | 'Develop' | 'Refine' | 'Practice' | 'Apply';
  timeMinutes: number;
  description: string;
  teacherActions: string[];
  studentActions: string[];
  keyQuestions: string[];
}

export interface StandardsCoverageAnalysis {
  majorWork: string[];
  supportingWork: string[];
  additionalWork: string[];
  crossGradeConnections: string[];
  algebralReadinessIndicators: string[];
}

export interface PrerequisiteAnalysis {
  prerequisitesRequired: string[];
  prerequisitesMet: string[];
  potentialGaps: string[];
  interventionSuggestions: string[];
}

export interface ProgressionStage {
  stage: string;
  weeks: number[];
  focus: string;
  milestones: string[];
  assessmentPoints: string[];
}

export interface DetailedAssessmentStrategy {
  overallApproach: string;
  formativeStrategies: string[];
  summativeAssessments: DetailedSummativeAssessment[];
  diagnosticCheckpoints: DiagnosticCheckpoint[];
  portfolioElements: string[];
  masteryIndicators: string[];
}

export interface DetailedSummativeAssessment {
  name: string;
  timing: string;
  standards: string[];
  format: string;
  duration: string;
  purpose: string;
  gradingCriteria: string[];
}

export interface DiagnosticCheckpoint {
  timing: string;
  focus: string;
  assessmentMethod: string;
  interventionTriggers: string[];
}

export interface TeachingSupport {
  pedagogicalApproach: string;
  classroomManagement: string[];
  parentCommunication: string[];
  professionalDevelopment: string[];
  resources: {
    required: string[];
    recommended: string[];
    digital: string[];
  };
}

export interface GeneratedPacingGuide {
  overview: {
    gradeLevel: string;
    timeframe: string;
    totalWeeks: number;
    lessonsPerWeek: number;
    totalLessons: number;
  };
  weeklySchedule: WeeklySchedule[];
  assessmentPlan: AssessmentPlan;
  differentiationStrategies: DifferentiationStrategy[];
  flexibilityOptions: FlexibilityOption[];
  standardsAlignment: StandardsAlignment[];
}

export interface WeeklySchedule {
  week: number;
  unit: string;
  lessons: string[];
  focusStandards: string[];
  learningObjectives: string[];
  assessmentType?: 'formative' | 'summative' | 'diagnostic';
  differentiationNotes?: string;
}

export interface AssessmentPlan {
  formativeFrequency: string;
  summativeSchedule: SummativeAssessment[];
  diagnosticCheckpoints: number[];
  portfolioComponents: string[];
}

export interface SummativeAssessment {
  week: number;
  type: string;
  standards: string[];
  description: string;
}

export interface DifferentiationStrategy {
  studentGroup: string;
  modifications: string[];
  resources: string[];
  assessmentAdjustments: string[];
}

export interface FlexibilityOption {
  scenario: string;
  adjustments: string[];
  impactAnalysis: string;
}

export interface StandardsAlignment {
  standard: string;
  weeksCovered: number[];
  depth: 'introduction' | 'development' | 'mastery';
  connections: string[];
}

export class EnhancedAIService {
  private openai: OpenAI;
  private curriculumService: AICurriculumContextService;
  private selectedModel: AIModel;
  private modelConfig: ModelConfiguration;

  constructor(model: AIModel = 'gpt-4o') {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.selectedModel = model;
    this.modelConfig = AVAILABLE_MODELS[model];
    this.curriculumService = new AICurriculumContextService(model);
    
    console.log(`🚀 [Enhanced AI] Initialized with ${model} - ${this.modelConfig.description}`);
    console.log(`📊 [Enhanced AI] Model Config - Max Tokens: ${this.modelConfig.maxTokens}, Cost: ${this.modelConfig.costTier}`);
  }

  /**
   * Get current model information
   */
  getModelInfo(): { current: ModelConfiguration; available: Record<AIModel, ModelConfiguration> } {
    return {
      current: this.modelConfig,
      available: AVAILABLE_MODELS
    };
  }

  /**
   * Switch to a different AI model
   */
  setModel(model: AIModel): void {
    this.selectedModel = model;
    this.modelConfig = AVAILABLE_MODELS[model];
    this.curriculumService.setModel(model);
    
    console.log(`🔄 [Enhanced AI] Switched to ${model} - ${this.modelConfig.description}`);
    console.log(`📊 [Enhanced AI] New Config - Max Tokens: ${this.modelConfig.maxTokens}, Cost: ${this.modelConfig.costTier}`);
  }

  /**
   * Load actual curriculum structures from JSON files
   */
  private loadCurriculumData(grades: string[]): any {
    const curriculumData: any = {};
    
    try {
      for (const grade of grades) {
        if (grade === '6') {
          const grade6Path = path.join(process.cwd(), 'GRADE6_COMPLETE_CURRICULUM_STRUCTURE.json');
          if (fs.existsSync(grade6Path)) {
            curriculumData.grade6 = JSON.parse(fs.readFileSync(grade6Path, 'utf8'));
            console.log('📚 [Curriculum] Loaded Grade 6 structure:', curriculumData.grade6.total_units, 'units,', curriculumData.grade6.total_lessons, 'lessons');
          }
        } else if (grade === '7') {
          const grade7Path = path.join(process.cwd(), 'GRADE7_COMPLETE_CURRICULUM_STRUCTURE.json');
          if (fs.existsSync(grade7Path)) {
            curriculumData.grade7 = JSON.parse(fs.readFileSync(grade7Path, 'utf8'));
            console.log('📚 [Curriculum] Loaded Grade 7 structure:', curriculumData.grade7.total_units, 'units,', curriculumData.grade7.total_lessons, 'lessons');
          }
        } else if (grade === '8') {
          const grade8Path = path.join(process.cwd(), 'GRADE8_COMPLETE_CURRICULUM_STRUCTURE.json');
          if (fs.existsSync(grade8Path)) {
            curriculumData.grade8 = JSON.parse(fs.readFileSync(grade8Path, 'utf8'));
            console.log('📚 [Curriculum] Loaded Grade 8 structure:', curriculumData.grade8.total_units, 'units,', curriculumData.grade8.total_lessons, 'lessons');
          }
        } else if (grade === '9') {
          const algebra1Path = path.join(process.cwd(), 'ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE.json');
          if (fs.existsSync(algebra1Path)) {
            curriculumData.algebra1 = JSON.parse(fs.readFileSync(algebra1Path, 'utf8'));
            console.log('📚 [Curriculum] Loaded Algebra 1 structure:', curriculumData.algebra1.total_units, 'units,', curriculumData.algebra1.total_lessons, 'lessons');
          }
        }
      }
    } catch (error) {
      console.error('❌ [Curriculum] Error loading curriculum data:', error);
    }
    
    return curriculumData;
  }

  async generatePacingGuide(request: PacingGuideRequest): Promise<PacingGuideResponse> {
    console.group('🧠 [Main Generator] Starting Pacing Guide Generation');
    console.log('📝 [Main Generator] Request received:', {
      gradeLevel: request.gradeLevel,
      timeframe: request.timeframe,
      studentPopulation: request.studentPopulation,
      priorities: request.priorities,
      gradeCombination: request.gradeCombination
    });
    
    try {
      // Check if this is a multi-grade combination that needs chunked generation
      const isMultiGrade = (request.gradeCombination?.selectedGrades?.length || 0) > 1;
      const totalWeeks = this.calculateWeeks(request.timeframe);
      
      console.log('🎯 [Main Generator] Generation path analysis:', {
        isMultiGrade: isMultiGrade,
        totalWeeks: totalWeeks,
        selectedGrades: request.gradeCombination?.selectedGrades,
        pathwayType: request.gradeCombination?.pathwayType
      });

      // ENHANCED: Check for dual-grade accelerated pathway
      const isDualGradeAccelerated = isMultiGrade && 
        request.gradeCombination?.pathwayType === 'accelerated' &&
        totalWeeks >= 30;

      if (isDualGradeAccelerated) {
        console.log('🚀 [Main Generator] ➡️ Routing to DUAL-GRADE ACCELERATED GENERATION');
        console.groupEnd();
        try {
          return await this.generateDualGradeAcceleratedPacingGuide(request);
        } catch (dualGradeError) {
          console.group('⚠️ [Main Generator] Dual-Grade Generation Fallback');
          console.warn('⚠️ [Main Generator] Dual-grade generation failed, falling back to chunked generation');
          console.error('🔍 [Main Generator] Dual-grade error details:', dualGradeError);
          console.log('🔄 [Main Generator] ➡️ Routing to CHUNKED GENERATION (fallback)');
          console.groupEnd();
          // Fall back to chunked generation
          return await this.generateChunkedPacingGuide(request);
        }
      } else if (isMultiGrade && totalWeeks >= 30) {
        console.log('📊 [Main Generator] ➡️ Routing to CHUNKED GENERATION (multi-grade, ' + totalWeeks + ' weeks)');
        console.groupEnd();
        try {
          return await this.generateChunkedPacingGuide(request);
        } catch (chunkError) {
          console.group('⚠️ [Main Generator] Chunked Generation Fallback');
          console.warn('⚠️ [Main Generator] Chunked generation failed, falling back to standard generation');
          console.error('🔍 [Main Generator] Chunk error details:', chunkError);
          console.log('🔄 [Main Generator] ➡️ Routing to STANDARD GENERATION (fallback)');
          console.groupEnd();
          // Fall back to standard generation
          return await this.generateStandardPacingGuide(request);
        }
      }
      
      // Standard pacing guide generation (existing logic)
      console.log('📝 [Main Generator] ➡️ Routing to STANDARD GENERATION');
      console.groupEnd();
      return await this.generateStandardPacingGuide(request);
    } catch (error) {
      console.error('💥 [AI Service] Error generating pacing guide:', error);
      console.groupEnd();
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateDetailedLessonGuide(request: PacingGuideRequest): Promise<PacingGuideResponse> {
    console.group('📚 [AI Service] Generating Detailed Lesson Guide');
    console.log('🎯 [AI Service] Accelerated pathway detected');
    
    try {
      // Just get basic lesson count without loading massive data
      const { ACCELERATED_PATHWAY } = await import('./accelerated-pathway');
      const lessonCount = ACCELERATED_PATHWAY.reduce((total, unit) => total + unit.lessons.length, 0);
      console.log('� [AI Service] Total available lessons:', lessonCount);
      
      // Determine effective grade configuration
      const gradeConfig = this.parseGradeConfiguration(request);
      console.log('📊 [AI Service] Grade config:', gradeConfig);
      
      // Create simple prompt without massive data structures
      const detailedPrompt = this.buildSimpleLessonPrompt(request, lessonCount);
      console.log('📝 [AI Service] Built simple prompt, length:', detailedPrompt.length);

      // Call OpenAI with GPT-4o for fast, comprehensive analysis
      console.log(`🤖 [AI Service] Calling OpenAI API with ${this.selectedModel}...`);
      let completion;
      try {
        completion = await this.openai.chat.completions.create({
          model: this.selectedModel,
          messages: [
            {
              role: "system",
              content: `You are a mathematics curriculum specialist using ${this.selectedModel}. Create practical, implementable pacing guides efficiently. Focus on clear structure and essential information. 

${this.selectedModel === 'gpt-5' ? 
  'CRITICAL FOR GPT-5: Your advanced reasoning should focus on sophisticated lesson sequencing and pedagogical insights. Avoid generating overly long responses.' : 
  'CRITICAL: Your response must be ONLY valid JSON - no markdown, no explanations, no code blocks, just pure JSON starting with { and ending with }.'
}`
            },
            {
              role: "user", 
              content: detailedPrompt
            }
          ],
          max_completion_tokens: this.modelConfig.maxTokens,
          temperature: this.modelConfig.temperature
        });
      } catch (apiError) {
        console.error('❌ [AI Service] OpenAI API Error:', apiError);
        throw new Error(`OpenAI API Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
      }
      
      console.log('📊 [AI Service] OpenAI completion received:', {
        id: completion.id,
        model: completion.model,
        choices: completion.choices?.length || 0,
        usage: completion.usage,
        choice0: completion.choices?.[0] ? {
          index: completion.choices[0].index,
          finish_reason: completion.choices[0].finish_reason,
          content_length: completion.choices[0].message?.content?.length || 0
        } : null
      });
      
      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        console.error('❌ [AI Service] No response content from OpenAI:', {
          completion: completion,
          choice: completion.choices?.[0],
          message: completion.choices?.[0]?.message
        });
        throw new Error(`No response from AI service. Completion ID: ${completion.id}, Finish reason: ${completion.choices?.[0]?.finish_reason || 'unknown'}`);
      }
      
      // Check if response was truncated due to length limit
      if (completion.choices?.[0]?.finish_reason === 'length') {
        console.warn('⚠️ [AI Service] Response was truncated due to token limit, but continuing with partial content');
        console.log('📏 [AI Service] Truncated response length:', aiResponse.length);
      }
      
      console.log('📨 [AI Service] Received detailed response, length:', aiResponse.length);
      
      // Parse the JSON response from AI into structured data
      let parsedResponse;
      try {
        // Try to extract JSON from the response (in case it's wrapped in markdown or other text)
        let jsonContent = aiResponse.trim();
        
        // Check if response is wrapped in markdown code blocks
        if (jsonContent.includes('```json')) {
          console.log('🔍 [AI Service] Extracting JSON from markdown code block');
          const jsonMatch = jsonContent.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonContent = jsonMatch[1];
          }
        } else if (jsonContent.includes('```')) {
          console.log('🔍 [AI Service] Extracting JSON from generic code block');
          const jsonMatch = jsonContent.match(/```\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            jsonContent = jsonMatch[1];
          }
        }
        
        // Try to find JSON object in the response if it starts with text
        if (!jsonContent.startsWith('{') && jsonContent.includes('{')) {
          console.log('🔍 [AI Service] Extracting JSON object from mixed content');
          const jsonStart = jsonContent.indexOf('{');
          const jsonEnd = jsonContent.lastIndexOf('}') + 1;
          if (jsonStart !== -1 && jsonEnd > jsonStart) {
            jsonContent = jsonContent.substring(jsonStart, jsonEnd);
          }
        }
        
        console.log('🔍 [AI Service] JSON content to parse (first 200 chars):', jsonContent.substring(0, 200));
        console.log('🔍 [AI Service] JSON content to parse (last 200 chars):', jsonContent.substring(Math.max(0, jsonContent.length - 200)));
        
        parsedResponse = JSON.parse(jsonContent);
        console.log('📊 [AI Service] Successfully parsed AI response');
      } catch (parseError) {
        console.error('❌ [AI Service] Failed to parse AI response as JSON:', parseError);
        console.log('🔍 [AI Service] Raw response preview (first 1000 chars):', aiResponse.substring(0, 1000));
        console.log('🔍 [AI Service] Raw response ending (last 500 chars):', aiResponse.substring(Math.max(0, aiResponse.length - 500)));
        
        // Try to provide more helpful error information
        const hasOpenBrace = aiResponse.includes('{');
        const hasCloseBrace = aiResponse.includes('}');
        const hasJsonKeyword = aiResponse.toLowerCase().includes('json');
        const hasCodeBlock = aiResponse.includes('```');
        
        console.log('🔍 [AI Service] Response analysis:', {
          hasOpenBrace,
          hasCloseBrace,
          hasJsonKeyword,
          hasCodeBlock,
          length: aiResponse.length
        });
        
        throw new Error(`AI returned invalid JSON format. Analysis: hasOpenBrace=${hasOpenBrace}, hasCloseBrace=${hasCloseBrace}, hasCodeBlock=${hasCodeBlock}, length=${aiResponse.length}`);
      }
      
      console.log('✅ [AI Service] Detailed lesson guide generated successfully');
      console.groupEnd();
      
      return {
        success: true,
        detailedLessonGuide: parsedResponse
      };
      
    } catch (error) {
      console.error('💥 [AI Service] Error generating detailed lesson guide:', error);
      console.groupEnd();
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async callOpenAI(prompt: string): Promise<string> {
    console.log('🤖 [AI Service] Calling OpenAI API...');
    console.log('📏 [AI Service] Prompt length:', prompt.length, 'characters');
    console.log('🔍 [AI Service] Prompt preview (first 500 chars):', prompt.substring(0, 500));
    console.log('🔍 [AI Service] Prompt ending (last 300 chars):', prompt.substring(Math.max(0, prompt.length - 300)));
    
    try {
      const startTime = Date.now();
      console.log('⏰ [AI Service] OpenAI API call started at:', new Date().toISOString());
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a mathematics curriculum specialist. Create practical, implementable pacing guides efficiently. Focus on clear structure and essential information. ALWAYS return valid JSON format."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_completion_tokens: 16000,   // Increased for 30-36 concise lessons
        temperature: 0.1               // Lower temperature for faster, more focused responses
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      console.log('⏰ [AI Service] OpenAI API call completed in:', duration, 'ms');
      
      console.log('📊 [AI Service] OpenAI completion received:', {
        id: completion.id,
        model: completion.model,
        choices: completion.choices?.length || 0,
        finishReason: completion.choices?.[0]?.finish_reason,
        usage: completion.usage
      });
      
      const aiResponse = completion.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        console.error('❌ [AI Service] No response content from OpenAI:', {
          completion: completion,
          choice: completion.choices?.[0],
          message: completion.choices?.[0]?.message
        });
        throw new Error(`No response from AI service. Completion ID: ${completion.id}, Finish reason: ${completion.choices?.[0]?.finish_reason || 'unknown'}`);
      }
      
      // Check if response was truncated due to length limit
      if (completion.choices?.[0]?.finish_reason === 'length') {
        console.error('❌ [AI Service] CRITICAL: Response was truncated due to token limit');
        console.log('📏 [AI Service] Truncated response length:', aiResponse.length);
        console.log('🔍 [AI Service] Truncated response ending:', aiResponse.substring(Math.max(0, aiResponse.length - 500)));
        
        // For chunked generation, we need complete JSON, so this is a critical error
        throw new Error('AI response was truncated, resulting in incomplete JSON. Please try again or reduce scope.');
      }
      
      console.log('📝 [AI Service] AI response length:', aiResponse.length, 'characters');
      console.log('🔍 [AI Service] AI response preview (first 300 chars):', aiResponse.substring(0, 300));
      console.log('🔍 [AI Service] AI response ending (last 300 chars):', aiResponse.substring(Math.max(0, aiResponse.length - 300)));
      
      // Check for common JSON issues
      const jsonBlockCount = (aiResponse.match(/```json/g) || []).length;
      const jsonEndBlockCount = (aiResponse.match(/```/g) || []).length;
      const braceCount = (aiResponse.match(/{/g) || []).length - (aiResponse.match(/}/g) || []).length;
      
      console.log('🔍 [AI Service] JSON structure analysis:', {
        jsonBlockStart: jsonBlockCount,
        totalCodeBlocks: jsonEndBlockCount,
        braceBalance: braceCount,
        startsWithCodeBlock: aiResponse.trim().startsWith('```'),
        endsWithCodeBlock: aiResponse.trim().endsWith('```'),
        containsJson: aiResponse.includes('{') && aiResponse.includes('}')
      });
      
      if (braceCount !== 0) {
        console.warn('⚠️ [AI Service] WARNING: Unbalanced braces detected in response');
      }
      
      if (jsonBlockCount > 0 && jsonEndBlockCount % 2 !== 0) {
        console.warn('⚠️ [AI Service] WARNING: Unmatched code block markers detected');
      }
      
      return aiResponse;
      
    } catch (apiError) {
      console.error('❌ [AI Service] OpenAI API Error:', apiError);
      console.error('🔍 [AI Service] Error details:', {
        name: apiError instanceof Error ? apiError.name : 'Unknown',
        message: apiError instanceof Error ? apiError.message : String(apiError),
        stack: apiError instanceof Error ? apiError.stack : undefined
      });
      throw new Error(`OpenAI API Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
    }
  }

  async generateChunkedPacingGuide(request: PacingGuideRequest): Promise<PacingGuideResponse> {
    console.group('📊 [Chunked Generation] Starting Chunked Pacing Guide Generation');
    console.log('🔄 [Chunked Generation] Using 2-chunk approach for full year coverage');
    
    try {
      const totalWeeks = this.calculateWeeks(request.timeframe);
      const chunk1Weeks = Math.ceil(totalWeeks / 2); // First 18 weeks (or half)
      const chunk2Weeks = totalWeeks - chunk1Weeks;  // Remaining weeks
      
      console.log('📅 [Chunked Generation] Chunk breakdown:', {
        totalWeeks,
        chunk1Weeks,
        chunk2Weeks,
        chunk1Range: `1-${chunk1Weeks}`,
        chunk2Range: `${chunk1Weeks + 1}-${totalWeeks}`
      });
      
      // Prepare context for both chunks
      console.log('🔧 [Chunked Generation] Preparing curriculum context...');
      const gradeConfig = this.parseGradeConfiguration(request);
      
      // Build curriculum contexts for all selected grades
      const contexts = await Promise.all(
        gradeConfig.selectedGrades.map(grade => 
          this.curriculumService.buildCurriculumContext(grade)
        )
      );
      
      // Merge contexts
      const mergedContext = this.mergeCurriculumContexts(contexts, gradeConfig);
      
      console.log('🎯 [Chunked Generation] Context prepared:', {
        gradeConfig: gradeConfig,
        contextUnits: mergedContext.unitStructure.length,
        totalLessons: mergedContext.totalLessons,
        availableStandards: mergedContext.availableStandards.length
      });
      
      // ===== CHUNK 1 GENERATION =====
      console.group('🎯 [Chunk 1] Generating first chunk (weeks 1-' + chunk1Weeks + ')');
      const chunk1StartTime = Date.now();
      
      const chunk1Request = { 
        ...request, 
        chunkInfo: { 
          isChunk: true, 
          chunkNumber: 1, 
          totalChunks: 2, 
          startWeek: 1,
          endWeek: chunk1Weeks,
          totalWeeks 
        }
      };
      
      console.log('📝 [Chunk 1] Building prompt for chunk 1...');
      const chunk1Prompt = this.buildAdvancedPrompt(mergedContext, gradeConfig, chunk1Request);
      console.log('📏 [Chunk 1] Prompt length:', chunk1Prompt.length, 'characters');
      console.log('🔍 [Chunk 1] Prompt preview:', chunk1Prompt.substring(0, 300));
      
      console.log('🤖 [Chunk 1] Calling OpenAI for chunk 1...');
      const chunk1Response = await this.callOpenAI(chunk1Prompt);
      
      const chunk1Duration = Date.now() - chunk1StartTime;
      console.log('⏰ [Chunk 1] Generated in:', chunk1Duration, 'ms');
      console.log('📝 [Chunk 1] Response received, length:', chunk1Response.length, 'characters');
      
      console.log('🔧 [Chunk 1] Parsing chunk 1 response...');
      const chunk1Guide = await this.parseAIResponse(chunk1Response, mergedContext, chunk1Request);
      
      console.log('✅ [Chunk 1] Parsed successfully:', {
        weeklyScheduleLength: chunk1Guide.weeklySchedule?.length || 0,
        hasOverview: !!chunk1Guide.overview,
        firstWeek: chunk1Guide.weeklySchedule?.[0]?.week,
        lastWeek: chunk1Guide.weeklySchedule?.[chunk1Guide.weeklySchedule.length - 1]?.week
      });
      console.groupEnd();
      
      // ===== CHUNK 2 GENERATION =====
      console.group('🎯 [Chunk 2] Generating second chunk (weeks ' + (chunk1Weeks + 1) + '-' + totalWeeks + ')');
      const chunk2StartTime = Date.now();
      
      const chunk2Request = { 
        ...request, 
        chunkInfo: { 
          isChunk: true, 
          chunkNumber: 2, 
          totalChunks: 2, 
          startWeek: chunk1Weeks + 1,
          endWeek: totalWeeks,
          totalWeeks
        }
      };
      
      console.log('📝 [Chunk 2] Building prompt for chunk 2...');
      const chunk2Prompt = this.buildAdvancedPrompt(mergedContext, gradeConfig, chunk2Request);
      console.log('📏 [Chunk 2] Prompt length:', chunk2Prompt.length, 'characters');
      console.log('🔍 [Chunk 2] Prompt preview:', chunk2Prompt.substring(0, 300));
      
      console.log('🤖 [Chunk 2] Calling OpenAI for chunk 2...');
      const chunk2Response = await this.callOpenAI(chunk2Prompt);
      
      const chunk2Duration = Date.now() - chunk2StartTime;
      console.log('⏰ [Chunk 2] Generated in:', chunk2Duration, 'ms');
      console.log('📝 [Chunk 2] Response received, length:', chunk2Response.length, 'characters');
      
      console.log('🔧 [Chunk 2] Parsing chunk 2 response...');
      const chunk2Guide = await this.parseAIResponse(chunk2Response, mergedContext, chunk2Request);
      
      console.log('✅ [Chunk 2] Parsed successfully:', {
        weeklyScheduleLength: chunk2Guide.weeklySchedule?.length || 0,
        hasOverview: !!chunk2Guide.overview,
        firstWeek: chunk2Guide.weeklySchedule?.[0]?.week,
        lastWeek: chunk2Guide.weeklySchedule?.[chunk2Guide.weeklySchedule.length - 1]?.week
      });
      console.groupEnd();
      
      // ===== MERGING CHUNKS =====
      console.group('🔗 [Merge] Merging chunks into complete curriculum');
      console.log('🔧 [Merge] Pre-merge validation...');
      
      // Validate chunks before merging
      if (!chunk1Guide.weeklySchedule || chunk1Guide.weeklySchedule.length === 0) {
        throw new Error('Chunk 1 has empty or missing weeklySchedule');
      }
      
      if (!chunk2Guide.weeklySchedule || chunk2Guide.weeklySchedule.length === 0) {
        throw new Error('Chunk 2 has empty or missing weeklySchedule');
      }
      
      console.log('📊 [Merge] Chunk validation passed:', {
        chunk1Weeks: chunk1Guide.weeklySchedule.length,
        chunk2Weeks: chunk2Guide.weeklySchedule.length,
        expectedTotal: totalWeeks
      });
      
      // Check for week number conflicts
      const chunk1WeekNumbers = chunk1Guide.weeklySchedule.map(w => w.week);
      const chunk2WeekNumbers = chunk2Guide.weeklySchedule.map(w => w.week);
      const weekOverlap = chunk1WeekNumbers.filter(w => chunk2WeekNumbers.includes(w));
      
      if (weekOverlap.length > 0) {
        console.warn('⚠️ [Merge] Week number overlap detected:', weekOverlap);
      }
      
      const mergedPacingGuide = {
        ...chunk1Guide,
        overview: {
          ...chunk1Guide.overview,
          totalWeeks: totalWeeks,
          description: 'Complete 36-week curriculum combining multiple grade levels'
        },
        weeklySchedule: [
          ...chunk1Guide.weeklySchedule,
          ...chunk2Guide.weeklySchedule
        ],
        assessmentPlan: {
          formativeFrequency: chunk1Guide.assessmentPlan?.formativeFrequency || 'Weekly',
          summativeSchedule: [
            ...(chunk1Guide.assessmentPlan?.summativeSchedule || []),
            ...(chunk2Guide.assessmentPlan?.summativeSchedule || [])
          ],
          diagnosticCheckpoints: [
            ...(chunk1Guide.assessmentPlan?.diagnosticCheckpoints || []),
            ...(chunk2Guide.assessmentPlan?.diagnosticCheckpoints || [])
          ].sort((a, b) => a - b),
          portfolioComponents: [
            ...(chunk1Guide.assessmentPlan?.portfolioComponents || []),
            ...(chunk2Guide.assessmentPlan?.portfolioComponents || [])
          ]
        },
        differentiationStrategies: [
          ...(chunk1Guide.differentiationStrategies || []),
          ...(chunk2Guide.differentiationStrategies || [])
        ],
        flexibilityOptions: [
          ...(chunk1Guide.flexibilityOptions || []),
          ...(chunk2Guide.flexibilityOptions || [])
        ],
        standardsAlignment: [
          ...(chunk1Guide.standardsAlignment || []),
          ...(chunk2Guide.standardsAlignment || [])
        ]
      };
      
      // Final validation
      const finalWeekNumbers = mergedPacingGuide.weeklySchedule.map(w => w.week).sort((a, b) => a - b);
      const expectedWeekNumbers = Array.from({length: totalWeeks}, (_, i) => i + 1);
      const missingWeeks = expectedWeekNumbers.filter(w => !finalWeekNumbers.includes(w));
      const duplicateWeeks = finalWeekNumbers.filter((w, i) => finalWeekNumbers.indexOf(w) !== i);
      
      console.log('📊 [Merge] Final validation results:', {
        totalWeeksGenerated: mergedPacingGuide.weeklySchedule.length,
        expectedWeeks: totalWeeks,
        weekNumberRange: `${Math.min(...finalWeekNumbers)}-${Math.max(...finalWeekNumbers)}`,
        missingWeeks: missingWeeks.length > 0 ? missingWeeks : 'None',
        duplicateWeeks: duplicateWeeks.length > 0 ? duplicateWeeks : 'None',
        assessmentPlanMerged: !!mergedPacingGuide.assessmentPlan,
        totalSummativeAssessments: mergedPacingGuide.assessmentPlan?.summativeSchedule?.length || 0
      });
      
      if (missingWeeks.length > 0) {
        console.warn('⚠️ [Merge] Missing weeks detected:', missingWeeks);
      }
      
      if (duplicateWeeks.length > 0) {
        console.warn('⚠️ [Merge] Duplicate weeks detected:', duplicateWeeks);
      }
      
      console.log('✅ [Merge] Successfully merged chunks');
      console.groupEnd();
      
      const totalDuration = (chunk1Duration + chunk2Duration) / 1000;
      console.log('🎉 [Chunked Generation] Complete! Total time:', totalDuration.toFixed(1), 'seconds');
      console.groupEnd();
      
      return {
        success: true,
        pacingGuide: mergedPacingGuide,
        recommendations: []
      };
      
    } catch (error) {
      console.error('💥 [Chunked Generation] Error generating chunked pacing guide:', error);
      console.error('🔍 [Chunked Generation] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack?.split('\n').slice(0, 5) : undefined
      });
      console.groupEnd();
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private buildSimpleLessonPrompt(request: PacingGuideRequest, lessonCount: number): string {
    const grades = request.gradeCombination?.selectedGrades || [request.gradeLevel];
    
    // Load actual curriculum data
    const curriculumData = this.loadCurriculumData(grades);
    
    // Build curriculum context from actual textbook data
    let curriculumContext = '';
    let totalLessonsAvailable = 0;
    const gradeDescriptions: string[] = [];
    const gradeFocus: string[] = [];
    
    if (curriculumData.grade6) {
      curriculumContext += `\n**GRADE 6 CURRICULUM (Ready Classroom Mathematics Grade 6):**\n`;
      gradeDescriptions.push("Grade 6: Ratios, Fractions, Basic Algebra");
      gradeFocus.push("foundational number operations and proportional reasoning");
      for (const [volumeName, volume] of Object.entries(curriculumData.grade6.volumes as any)) {
        curriculumContext += `\n${volumeName}:\n`;
        for (const unit of (volume as any).units) {
          curriculumContext += `  Unit ${unit.unit_number}: ${unit.title}\n`;
          for (const lesson of unit.lessons) {
            curriculumContext += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
            totalLessonsAvailable++;
          }
        }
      }
    }
    
    if (curriculumData.grade7) {
      curriculumContext += `\n**GRADE 7 CURRICULUM (Ready Classroom Mathematics Grade 7):**\n`;
      gradeDescriptions.push("Grade 7: Proportional Reasoning, Operations");
      gradeFocus.push("advanced proportional relationships and algebraic thinking");
      for (const [volumeName, volume] of Object.entries(curriculumData.grade7.volumes as any)) {
        curriculumContext += `\n${volumeName}:\n`;
        for (const unit of (volume as any).units) {
          curriculumContext += `  Unit ${unit.unit_number}: ${unit.title}\n`;
          for (const lesson of unit.lessons) {
            curriculumContext += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
            totalLessonsAvailable++;
          }
        }
      }
    }
    
    if (curriculumData.grade8) {
      curriculumContext += `\n**GRADE 8 CURRICULUM (Ready Classroom Mathematics Grade 8):**\n`;
      gradeDescriptions.push("Grade 8: Functions, Transformations, HS Prep");
      gradeFocus.push("linear functions, transformations, and high school preparation");
      for (const [volumeName, volume] of Object.entries(curriculumData.grade8.volumes as any)) {
        curriculumContext += `\n${volumeName}:\n`;
        for (const unit of (volume as any).units) {
          curriculumContext += `  Unit ${unit.unit_number}: ${unit.title}\n`;
          for (const lesson of unit.lessons) {
            curriculumContext += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
            totalLessonsAvailable++;
          }
        }
      }
    }
    
    if (curriculumData.algebra1) {
      curriculumContext += `\n**ALGEBRA 1 CURRICULUM (Ready Classroom Mathematics Algebra 1):**\n`;
      gradeDescriptions.push("Algebra 1: Advanced Algebra, College Readiness");
      gradeFocus.push("advanced algebraic concepts and college preparation");
      for (const [volumeName, volume] of Object.entries(curriculumData.algebra1.volumes as any)) {
        curriculumContext += `\n${volumeName}:\n`;
        for (const unit of (volume as any).units) {
          curriculumContext += `  Unit ${unit.unit_number}: ${unit.title}\n`;
          for (const lesson of unit.lessons) {
            curriculumContext += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
            totalLessonsAvailable++;
          }
        }
      }
    }

    // Calculate total weeks for the timeframe
    const totalWeeks = this.calculateWeeks(request.timeframe);
    
    // Dynamic pathway description based on selected grades
    const pathwayDescription = this.generatePathwayDescription(grades, gradeDescriptions, gradeFocus);
    const selectionStrategy = this.generateSelectionStrategy(grades, totalLessonsAvailable);
    const gradeIndicators = this.generateGradeIndicators(grades);
    
    return `Create a comprehensive accelerated mathematics pathway for grades ${grades.join('+')} over ${request.timeframe}.

**CRITICAL REQUIREMENT: MUST GENERATE EXACTLY ${totalWeeks} WEEKS OF CURRICULUM**

${pathwayDescription}

**CURRICULUM DATA TO USE:**${curriculumContext}

**TOTAL LESSONS AVAILABLE: ${totalLessonsAvailable}** (across ${grades.length} grade levels: ${gradeDescriptions.join(', ')})

**MANDATORY REQUIREMENTS:**
- **MUST CREATE ${totalWeeks} WEEKS** of weekly curriculum entries
- **TIMEFRAME**: ${request.timeframe} (${totalWeeks} weeks total)
- **WEEKLY SCHEDULE**: Must include weeks 1 through ${totalWeeks} in your JSON response

**DYNAMIC PATHWAY REQUIREMENTS:**
${selectionStrategy}

**GRADE-SPECIFIC CONSIDERATIONS:**
- **Include Grade Indicators**: ${gradeIndicators}
- **Focus Areas**: ${gradeFocus.join(', ')}
- **Pathway Type**: Super-accelerated (${grades.length}-grade combination)
- **Student Population**: ${request.studentPopulation}
- **Schedule**: ${request.scheduleConstraints?.daysPerWeek || 5} days/week, ${request.scheduleConstraints?.minutesPerClass || 50} min/class

**RESPONSE FORMAT:** Return ONLY valid JSON - no markdown blocks, no explanations. Start with { and end with }.

**CRITICAL: Your weeklySchedule array MUST contain exactly ${totalWeeks} week objects (weeks 1-${totalWeeks})** 

**JSON Structure (field names must match exactly):**

{
  "pathway": {
    "name": "Accelerated Grade ${grades.join('+')} Mathematics Pathway",
    "description": "Comprehensive description of the accelerated pathway combining these grade levels",
    "targetOutcome": "Clear learning outcomes and objectives for students",
    "duration": "${request.timeframe}"
  },
  "analysisResults": {
    "choicesAnalyzed": {
      "gradesCombined": ${JSON.stringify(grades)},
      "pathwayType": "accelerated",
      "emphasis": "foundational",
      "studentPopulation": "${request.studentPopulation}"
    },
    "scopeAndSequenceMatch": "Detailed analysis of how curriculum aligns with standards progression",
    "standardsCoverage": {
      "majorWork": ["List of major standards covered (e.g., 8.EE.7, A-REI.3)"],
      "supportingWork": ["List of supporting standards"],
      "additionalWork": ["List of additional standards"],
      "crossGradeConnections": ["How standards connect across grade levels"]
    },
    "prerequisiteCheck": {
      "prerequisitesRequired": ["Required prerequisite skills for this pathway"],
      "prerequisitesMet": ["Prerequisites addressed by this pathway"],
      "potentialGaps": ["Potential learning gaps to monitor and address"]
    }
  },
  "lessonByLessonBreakdown": [
    {
      "lessonNumber": 1,
      "title": "EXACT lesson title from curriculum data above",
      "textbookSource": "Grade 8 Ready Classroom Mathematics" OR "Algebra 1 Ready Classroom Mathematics", 
      "volume": "Volume 1" OR "Volume 2",
      "unit": "EXACT unit title from curriculum data",
      "unitNumber": 1,
      "grade": "8" OR "9",
      "week": 1,
      "standards": ["8.NS.1", "8.NS.2"],
      "sessions": 2,
      "majorWork": true,
      "originalCode": "G8 U1 L1"
    }
  ],
  "progressionMap": [
    {
      "stage": 1,
      "name": "Foundation Building",
      "weeks": [1, 2, 3, 4],
      "focus": "Core foundational concepts",
      "milestones": ["Key learning milestones for this stage"],
      "assessments": ["Major assessments in this stage"]
    }
  ],
  "assessmentStrategy": {
    "formativeApproaches": ["Daily formative assessment methods"],
    "summativeSchedule": [
      {
        "week": 4,
        "type": "Unit Test",
        "standards": ["8.NS.1-2"],
        "description": "Assessment description and format"
      }
    ],
    "diagnosticCheckpoints": [6, 12, 18, 24, 30],
    "portfolioComponents": ["Portfolio requirements and components"],
    "masteryIndicators": ["How students demonstrate mastery"]
  },
  "teachingSupport": {
    "pacingRecommendations": ["Specific pacing guidance and flexibility options"],
    "professionalDevelopment": ["PD needs and recommendations"],
    "resources": {
      "instructional": ["Required teaching resources"],
      "assessment": ["Assessment tools and rubrics"],
      "digital": ["Digital tools and platforms"]
    },
    "parentCommunication": ["Parent communication strategies and templates"]
  }
}

**CRITICAL REQUIREMENTS:**
- Use EXACTLY the field names shown above (pathway, not pathway_overview)
- Generate comprehensive content for 25-35 lessons covering the full ${request.timeframe}
- Include detailed lesson breakdowns with proper standards alignment
- Provide practical, teacher-ready implementation guidance
- Return ONLY valid JSON with no extra text or formatting`;
  }

  async generateStandardPacingGuide(request: PacingGuideRequest): Promise<PacingGuideResponse> {
    console.group('🧠 [AI Service] Generating Pacing Guide');
    console.log('📝 [AI Service] Request received:', JSON.stringify(request, null, 2));
    
    try {
      // Determine effective grade configuration
      console.log('🔍 [AI Service] Parsing grade configuration...');
      const gradeConfig = this.parseGradeConfiguration(request);
      console.log('📊 [AI Service] Grade config:', gradeConfig);
      
      // Build comprehensive curriculum context for all selected grades
      console.log('📚 [AI Service] Building curriculum contexts for grades:', gradeConfig.selectedGrades);
      const contexts = await Promise.all(
        gradeConfig.selectedGrades.map(grade => 
          this.curriculumService.buildCurriculumContext(grade)
        )
      );
      
      console.log('📖 [AI Service] Contexts built, count:', contexts.length);
      
      // Debug each context to see what curriculum data we have
      contexts.forEach((context, index) => {
        console.log(`📋 [AI Service] Context ${index + 1} (Grade ${gradeConfig.selectedGrades[index]}):`, {
          gradeLevel: context.gradeLevel,
          totalLessons: context.totalLessons,
          totalInstructionalDays: context.totalInstructionalDays,
          unitStructureCount: context.unitStructure.length,
          unitTitles: context.unitStructure.map(unit => unit.unitTitle),
          majorStandardsCount: context.majorStandards.length,
          availableStandardsCount: context.availableStandards.length
        });
      });
      
      // Merge contexts and analyze cross-grade dependencies
      console.log('🔗 [AI Service] Merging curriculum contexts...');
      const mergedContext = this.mergeCurriculumContexts(contexts, gradeConfig);
      console.log('📋 [AI Service] Merged context:', {
        totalLessons: mergedContext.totalLessons,
        totalInstructionalDays: mergedContext.totalInstructionalDays,
        unitStructureCount: mergedContext.unitStructure.length,
        majorStandardsCount: mergedContext.majorStandards.length,
        allUnitTitles: mergedContext.unitStructure.map(unit => unit.unitTitle)
      });
      
      // Generate AI recommendations with advanced pathway logic
      console.log('💡 [AI Service] Generating advanced recommendations...');
      const recommendations = await this.generateAdvancedRecommendations(gradeConfig, request);
      console.log('✨ [AI Service] Recommendations generated, count:', recommendations?.length || 0);

      // Create sophisticated prompt for multi-grade analysis
      console.log('📝 [AI Service] Building advanced prompt...');
      const prompt = this.buildAdvancedPrompt(mergedContext, gradeConfig, request);
      console.log('🎯 [AI Service] Prompt built, length:', prompt.length, 'characters');

      // Generate pacing guide with enhanced AI reasoning
      console.log('🤖 [AI Service] Calling OpenAI API...');
      let completion;
      try {
        completion = await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert mathematics curriculum specialist with deep knowledge of grade 6-8 mathematics standards, pacing, and differentiation strategies. You create practical, research-based pacing guides that teachers can implement effectively. You excel at analyzing multi-grade combinations and creating pedagogically sound accelerated pathways."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_completion_tokens: 16000   // GPT-4o maximum limit for comprehensive responses
        });
      } catch (apiError) {
        console.error('❌ [AI Service] OpenAI API Error:', apiError);
        throw new Error(`OpenAI API Error: ${apiError instanceof Error ? apiError.message : 'Unknown error'}`);
      }

      // Parse the AI response into structured data
      console.log('📨 [AI Service] OpenAI response received');
      console.log('📊 [AI Service] OpenAI completion details:', {
        id: completion.id,
        model: completion.model,
        choices: completion.choices?.length || 0,
        usage: completion.usage,
        choice0: completion.choices?.[0] ? {
          index: completion.choices[0].index,
          finish_reason: completion.choices[0].finish_reason,
          content_length: completion.choices[0].message?.content?.length || 0
        } : null
      });
      
      const aiResponse = completion.choices[0]?.message?.content;
      
      if (!aiResponse) {
        console.error('❌ [AI Service] No response content from OpenAI:', {
          completion: completion,
          choice: completion.choices?.[0],
          message: completion.choices?.[0]?.message
        });
        throw new Error(`No response from AI service. Completion ID: ${completion.id}, Finish reason: ${completion.choices?.[0]?.finish_reason || 'unknown'}`);
      }
      
      // Check if response was truncated due to length limit
      if (completion.choices?.[0]?.finish_reason === 'length') {
        console.warn('⚠️ [AI Service] Response was truncated due to token limit, but continuing with partial content');
        console.log('📏 [AI Service] Truncated response length:', aiResponse.length);
      }
      
      console.log('📝 [AI Service] AI response length:', aiResponse.length, 'characters');
      console.log('🔍 [AI Service] AI response preview:', aiResponse.substring(0, 200) + '...');

      console.log('🔧 [AI Service] Parsing AI response...');
      const pacingGuide = await this.parseAIResponse(aiResponse, mergedContext, request);
      
      console.log('✅ [AI Service] Pacing guide parsed successfully');
      console.log('📊 [AI Service] Final guide structure:', {
        hasOverview: !!pacingGuide.overview,
        weeklyScheduleCount: pacingGuide.weeklySchedule?.length || 0,
        hasAssessmentPlan: !!pacingGuide.assessmentPlan,
        differentiationCount: pacingGuide.differentiationStrategies?.length || 0
      });

      const result = {
        success: true,
        pacingGuide
      };
      
      console.log('🎉 [AI Service] Returning successful result');
      console.groupEnd();
      return result;

    } catch (error) {
      console.error('💥 [AI Service] Error generating pacing guide:', error);
      console.groupEnd();
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private buildDetailedPrompt(context: CurriculumContext, request: PacingGuideRequest): string {
    const basePrompt = this.curriculumService.generatePacingPrompt(
      context,
      request.timeframe,
      request.studentPopulation,
      request.priorities || []
    );

    const constraintsSection = request.scheduleConstraints ? `
SCHEDULE CONSTRAINTS:
- Days per week: ${request.scheduleConstraints.daysPerWeek}
- Minutes per class: ${request.scheduleConstraints.minutesPerClass}
- Special events: ${request.scheduleConstraints.specialEvents?.join(', ') || 'None specified'}
    ` : '';

    const differentiationSection = request.differentiationNeeds?.length ? `
DIFFERENTIATION REQUIREMENTS:
${request.differentiationNeeds.map(need => `- ${need}`).join('\n')}
    ` : '';

    return `${basePrompt}

${constraintsSection}

${differentiationSection}

RESPONSE FORMAT:
Please structure your response as a simple JSON object with this EXACT structure:

IMPORTANT: Each lesson takes 3-5 days to complete, so each week should contain 1-2 lessons maximum.

\`\`\`json
{
  "overview": {
    "gradeLevel": "${context.gradeLevel}",
    "timeframe": "${request.timeframe}",
    "totalWeeks": number,
    "lessonsPerWeek": 1.5,
    "description": "Brief description of the curriculum"
  },
  "weeklySchedule": [
    {
      "week": number,
      "unit": "Unit name",
      "lessons": ["lesson1", "lesson2"],
      "lessonDuration": "3-5 days per lesson",
      "focusStandards": ["standard1", "standard2"],
      "learningObjectives": ["objective1", "objective2"]
    }
  ]
}
\`\`\`

Generate exactly ${this.calculateWeeks(request.timeframe)} weeks of curriculum content.`;
  }

  private async parseAIResponse(
    aiResponse: string,
    context: CurriculumContext,
    request: PacingGuideRequest
  ): Promise<GeneratedPacingGuide> {
    console.group('🔧 [JSON Parser] Starting AI Response Parsing');
    
    try {
      console.log('� [JSON Parser] AI Response analysis:', {
        totalLength: aiResponse.length,
        startsWithJson: aiResponse.trim().startsWith('{'),
        startsWithCodeBlock: aiResponse.trim().startsWith('```'),
        endsWithJson: aiResponse.trim().endsWith('}'),
        endsWithCodeBlock: aiResponse.trim().endsWith('```'),
        containsJsonKeyword: aiResponse.includes('```json')
      });
      
      console.log('� [JSON Parser] Response preview (first 500 chars):');
      console.log(aiResponse.substring(0, 500));
      console.log('🔍 [JSON Parser] Response ending (last 300 chars):');
      console.log(aiResponse.substring(Math.max(0, aiResponse.length - 300)));
      
      // Analyze JSON structure
      const openBraces = (aiResponse.match(/{/g) || []).length;
      const closeBraces = (aiResponse.match(/}/g) || []).length;
      const openBrackets = (aiResponse.match(/\[/g) || []).length;
      const closeBrackets = (aiResponse.match(/\]/g) || []).length;
      
      console.log('🔍 [JSON Parser] Structure analysis:', {
        openBraces,
        closeBraces,
        braceBalance: openBraces - closeBraces,
        openBrackets,
        closeBrackets,
        bracketBalance: openBrackets - closeBrackets
      });
      
      // Try multiple JSON extraction methods
      let parsedResponse: any = null;
      let extractionMethod = '';
      let rawJsonString = '';
      
      // Method 1: Look for JSON blocks wrapped in ```json
      console.log('🔄 [JSON Parser] Attempting Method 1: Code block extraction');
      const jsonBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        console.log('✅ [JSON Parser] Found JSON code block');
        rawJsonString = jsonBlockMatch[1].trim();
        extractionMethod = 'Code Block';
        
        console.log('📝 [JSON Parser] Extracted JSON length:', rawJsonString.length);
        console.log('🔍 [JSON Parser] Extracted JSON preview:', rawJsonString.substring(0, 200));
        
        try {
          parsedResponse = JSON.parse(rawJsonString);
          console.log('✅ [JSON Parser] Successfully parsed JSON from code block');
        } catch (blockParseError) {
          console.error('❌ [JSON Parser] Failed to parse code block JSON:', blockParseError);
          console.log('🔍 [JSON Parser] Problematic JSON section:', rawJsonString.substring(0, 500));
        }
      } else {
        console.log('❌ [JSON Parser] No JSON code block found');
      }
      
      // Method 2: Look for any JSON object if method 1 failed
      if (!parsedResponse) {
        console.log('🔄 [JSON Parser] Attempting Method 2: Direct JSON object extraction');
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('✅ [JSON Parser] Found JSON object pattern');
          rawJsonString = jsonMatch[0];
          extractionMethod = 'Direct Object';
          
          console.log('📝 [JSON Parser] Direct JSON length:', rawJsonString.length);
          console.log('🔍 [JSON Parser] Direct JSON preview:', rawJsonString.substring(0, 200));
          
          try {
            parsedResponse = JSON.parse(rawJsonString);
            console.log('✅ [JSON Parser] Successfully parsed direct JSON object');
          } catch (directParseError) {
            console.error('❌ [JSON Parser] Failed to parse direct JSON:', directParseError);
            console.log('🔍 [JSON Parser] Problematic JSON section:', rawJsonString.substring(0, 500));
          }
        } else {
          console.log('❌ [JSON Parser] No direct JSON object found');
        }
      }
      
      // Method 3: Try parsing the entire response if previous methods failed
      if (!parsedResponse) {
        console.log('🔄 [JSON Parser] Attempting Method 3: Full response parsing');
        rawJsonString = aiResponse.trim();
        extractionMethod = 'Full Response';
        
        try {
          parsedResponse = JSON.parse(rawJsonString);
          console.log('✅ [JSON Parser] Successfully parsed entire response as JSON');
        } catch (fullParseError) {
          console.error('❌ [JSON Parser] Failed to parse full response:', fullParseError);
          console.log('🔍 [JSON Parser] Error position (if available):', fullParseError instanceof SyntaxError ? fullParseError.message : 'No position info');
          
          // Try to identify the problematic section
          const lines = rawJsonString.split('\n');
          console.log('📊 [JSON Parser] Response has', lines.length, 'lines');
          
          if (fullParseError instanceof SyntaxError && fullParseError.message.includes('position')) {
            const match = fullParseError.message.match(/position (\d+)/);
            if (match) {
              const errorPos = parseInt(match[1]);
              const errorContext = rawJsonString.substring(Math.max(0, errorPos - 50), errorPos + 50);
              console.log('🎯 [JSON Parser] Error context around position', errorPos + ':', errorContext);
            }
          }
          
          // Show problematic lines
          console.log('🔍 [JSON Parser] First 10 lines of response:');
          lines.slice(0, 10).forEach((line, index) => {
            console.log(`Line ${index + 1}: ${line}`);
          });
          
          if (lines.length > 10) {
            console.log('🔍 [JSON Parser] Last 5 lines of response:');
            lines.slice(-5).forEach((line, index) => {
              console.log(`Line ${lines.length - 5 + index + 1}: ${line}`);
            });
          }
        }
      }
      
      // Final validation
      if (!parsedResponse) {
        console.error('💥 [JSON Parser] All parsing methods failed');
        console.error('🔍 [JSON Parser] Full response for debugging:');
        console.error(aiResponse);
        throw new Error('No valid JSON found in AI response. Response preview: ' + aiResponse.substring(0, 200));
      }
      
      console.log('🎉 [JSON Parser] Successfully extracted JSON using method:', extractionMethod);
      console.log('📊 [JSON Parser] Parsed response structure:', {
        topLevelKeys: Object.keys(parsedResponse || {}),
        hasOverview: !!parsedResponse.overview,
        hasWeeklySchedule: !!parsedResponse.weeklySchedule,
        weeklyScheduleLength: parsedResponse.weeklySchedule?.length || 0,
        hasAssessmentPlan: !!parsedResponse.assessmentPlan,
        hasDifferentiationStrategies: !!parsedResponse.differentiationStrategies,
        hasFlexibilityOptions: !!parsedResponse.flexibilityOptions,
        hasStandardsAlignment: !!parsedResponse.standardsAlignment
      });
      
      // Validate essential structure
      if (!parsedResponse.overview) {
        console.warn('⚠️ [JSON Parser] Missing overview section');
      }
      
      if (!parsedResponse.weeklySchedule || !Array.isArray(parsedResponse.weeklySchedule)) {
        console.error('❌ [JSON Parser] Missing or invalid weeklySchedule array');
        throw new Error('Invalid pacing guide structure: missing weeklySchedule array');
      }
      
      if (parsedResponse.weeklySchedule.length === 0) {
        console.error('❌ [JSON Parser] Empty weeklySchedule array');
        throw new Error('Invalid pacing guide structure: weeklySchedule array is empty');
      }
      
      console.log('✅ [JSON Parser] JSON structure validation passed');
      
      // Ensure grade level is set if not provided by AI
      if (parsedResponse.overview && !parsedResponse.overview.gradeLevel) {
        console.log('🔧 [JSON Parser] Adding missing gradeLevel to overview');
        parsedResponse.overview.gradeLevel = context.gradeLevel;
      }
      
      console.groupEnd();
      
      return parsedResponse as GeneratedPacingGuide;
      
    } catch (error) {
      console.error('💥 [JSON Parser] Critical parsing error:', error);
      console.error('🔍 [JSON Parser] Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      console.groupEnd();
      throw error;
    }
  }



  private generateFallbackPacingGuide(
    context: CurriculumContext, 
    request: PacingGuideRequest
  ): GeneratedPacingGuide {
    console.log('🔧 [AI Service] Generating fallback pacing guide...');
    const totalWeeks = this.calculateWeeks(request.timeframe);
    // Realistic lesson count: 1-2 lessons per week since each lesson takes 3-5 days
    const lessonsPerWeek = 1.5;
    const totalLessonsNeeded = Math.ceil(totalWeeks * lessonsPerWeek);
    
    console.log('📊 [AI Service] Fallback calculations:', {
      totalWeeks,
      lessonsPerWeek,
      totalLessonsNeeded,
      availableLessons: context.totalLessons,
      unitCount: context.unitStructure.length
    });

    return {
      overview: {
        gradeLevel: context.gradeLevel,
        timeframe: request.timeframe,
        totalWeeks,
        lessonsPerWeek,
        totalLessons: totalLessonsNeeded
      },
      weeklySchedule: Array.from({ length: totalWeeks }, (_, weekIndex) => {
        const unitIndex = Math.floor((weekIndex * lessonsPerWeek) / 3); // Roughly 3 weeks per unit
        const unit = context.unitStructure[unitIndex % context.unitStructure.length];
        
        return {
          week: weekIndex + 1,
          unit: unit.unitTitle,
          lessons: [`Week ${weekIndex + 1} lessons from ${unit.unitTitle}`],
          lessonDuration: "3-5 days per lesson",
          focusStandards: unit.standards.slice(0, 3),
          learningObjectives: [`Master key concepts in ${unit.unitTitle}`],
          assessmentType: (weekIndex + 1) % 3 === 0 ? 'summative' : 'formative' as const
        };
      }),
      assessmentPlan: {
        formativeFrequency: 'Weekly',
        summativeSchedule: [
          {
            week: Math.floor(totalWeeks / 3),
            type: 'Unit Assessment',
            standards: context.majorStandards.slice(0, 3).flatMap(s => s.standards),
            description: 'Comprehensive unit assessment'
          }
        ],
        diagnosticCheckpoints: [1, Math.floor(totalWeeks / 2), totalWeeks],
        portfolioComponents: ['Problem solving work', 'Mathematical reasoning']
      },
      differentiationStrategies: [
        {
          studentGroup: request.studentPopulation,
          modifications: ['Flexible pacing', 'Multiple representations'],
          resources: ['Manipulatives', 'Technology tools'],
          assessmentAdjustments: ['Extended time', 'Alternative formats']
        }
      ],
      flexibilityOptions: [
        {
          scenario: 'School closure or delay',
          adjustments: ['Combine related lessons', 'Prioritize major standards'],
          impactAnalysis: 'Minimal impact with strategic lesson combining'
        }
      ],
      standardsAlignment: context.majorStandards.map(standard => ({
        standard: standard.standards[0] || 'Unknown',
        weeksCovered: [1, 2],
        depth: 'development' as const,
        connections: ['Prior grade concepts', 'Future applications']
      }))
    };
  }

  private calculateWeeks(timeframe: string): number {
    const lowerTimeframe = timeframe.toLowerCase();
    
    if (lowerTimeframe.includes('semester')) return 18;
    if (lowerTimeframe.includes('quarter')) return 9;
    if (lowerTimeframe.includes('trimester')) return 12;
    if (lowerTimeframe.includes('year')) return 36;
    
    const weekMatch = timeframe.match(/(\d+)\s*week/i);
    return weekMatch ? parseInt(weekMatch[1]) : 18;
  }

  // Helper methods for advanced grade combination support
  private parseGradeConfiguration(request: PacingGuideRequest) {
    if (request.gradeCombination && request.gradeCombination.selectedGrades.length > 0) {
      return {
        selectedGrades: request.gradeCombination.selectedGrades,
        pathwayType: request.gradeCombination.pathwayType || 'sequential',
        skipGrades: request.gradeCombination.skipGrades || [],
        emphasis: request.gradeCombination.emphasis || 'balanced'
      };
    }
    
    // Fallback to single grade
    return {
      selectedGrades: [request.gradeLevel],
      pathwayType: 'sequential' as const,
      skipGrades: [],
      emphasis: 'balanced' as const
    };
  }

  private mergeCurriculumContexts(contexts: CurriculumContext[], gradeConfig: any): CurriculumContext {
    if (contexts.length === 1) {
      return contexts[0];
    }

    // Merge multiple grade contexts into a comprehensive view
    const mergedStandards = contexts.flatMap(ctx => ctx.availableStandards);
    const mergedMajorStandards = contexts.flatMap(ctx => ctx.majorStandards);
    const mergedSupportingStandards = contexts.flatMap(ctx => ctx.supportingStandards);
    const mergedAdditionalStandards = contexts.flatMap(ctx => ctx.additionalStandards);
    const mergedUnitStructure = contexts.flatMap(ctx => ctx.unitStructure);

    return {
      gradeLevel: gradeConfig.selectedGrades.join('+'),
      selectedGrades: gradeConfig.selectedGrades,
      availableStandards: mergedStandards,
      majorStandards: mergedMajorStandards,
      supportingStandards: mergedSupportingStandards,
      additionalStandards: mergedAdditionalStandards,
      unitStructure: mergedUnitStructure,
      totalLessons: contexts.reduce((sum, ctx) => sum + ctx.totalLessons, 0),
      totalInstructionalDays: contexts.reduce((sum, ctx) => sum + ctx.totalInstructionalDays, 0),
      lessonMetadata: contexts.flatMap(ctx => ctx.lessonMetadata || []),
      crossGradeSequence: contexts.length > 1 ? contexts.find(ctx => ctx.crossGradeSequence)?.crossGradeSequence : undefined
    };
  }

  private async generateAdvancedRecommendations(gradeConfig: any, request: PacingGuideRequest) {
    // For now, use the first grade for basic recommendations
    // TODO: Implement sophisticated multi-grade recommendation logic
    const primaryGrade = gradeConfig.selectedGrades[0];
    return await this.curriculumService.generatePacingRecommendations(
      primaryGrade,
      request.timeframe,
      request.studentPopulation,
      request.priorities || []
    );
  }

  private buildAdvancedPrompt(context: CurriculumContext, gradeConfig: any, request: PacingGuideRequest): string {
    const isMultiGrade = gradeConfig.selectedGrades.length > 1;
    
    // Load actual curriculum data
    const curriculumData = this.loadCurriculumData(gradeConfig.selectedGrades);
    
    // Build curriculum context from actual textbook data
    let curriculumContext = '';
    if (curriculumData.grade8) {
      curriculumContext += `\n**GRADE 8 TEXTBOOK (Ready Classroom Mathematics Grade 8):**\n`;
      for (const [volumeName, volume] of Object.entries(curriculumData.grade8.volumes as any)) {
        curriculumContext += `\n${volumeName}:\n`;
        for (const unit of (volume as any).units) {
          curriculumContext += `  Unit ${unit.unit_number}: ${unit.title}\n`;
          for (const lesson of unit.lessons) {
            curriculumContext += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
          }
        }
      }
    }
    
    if (curriculumData.algebra1) {
      curriculumContext += `\n**ALGEBRA 1 TEXTBOOK (Ready Classroom Mathematics Algebra 1):**\n`;
      for (const [volumeName, volume] of Object.entries(curriculumData.algebra1.volumes as any)) {
        curriculumContext += `\n${volumeName}:\n`;
        for (const unit of (volume as any).units) {
          curriculumContext += `  Unit ${unit.unit_number}: ${unit.title}\n`;
          for (const lesson of unit.lessons) {
            curriculumContext += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
          }
        }
      }
    }
    
    // Handle chunked generation for large requests
    const totalWeeks = this.calculateWeeks(request.timeframe);
    const isChunked = request.chunkInfo?.isChunk || false;
    const chunkNumber = request.chunkInfo?.chunkNumber || 1;
    const totalChunks = request.chunkInfo?.totalChunks || 1;
    
    let weekRange = '';
    let chunkInstructions = '';
    
    if (isChunked) {
      const weeksPerChunk = Math.ceil(totalWeeks / totalChunks);
      const startWeek = (chunkNumber - 1) * weeksPerChunk + 1;
      const endWeek = Math.min(chunkNumber * weeksPerChunk, totalWeeks);
      weekRange = `WEEKS ${startWeek}-${endWeek}`;
      
      chunkInstructions = `
**CHUNKED GENERATION - THIS IS CHUNK ${chunkNumber} OF ${totalChunks}:**
- Generate ONLY weeks ${startWeek} through ${endWeek} (${endWeek - startWeek + 1} weeks)
- This is part of a larger ${totalWeeks}-week curriculum
${chunkNumber === 1 ? '- Start with foundational concepts from Grade 8' : ''}
${chunkNumber === totalChunks ? '- End with advanced Algebra 1 concepts' : ''}
- Ensure logical progression within this chunk
- Use appropriate curriculum sequencing for weeks ${startWeek}-${endWeek}
`;
    } else {
      weekRange = `ALL ${totalWeeks} WEEKS`;
      chunkInstructions = `
**FULL GENERATION:**
- Generate complete ${totalWeeks}-week curriculum
- Cover full year progression from Grade 8 through Algebra 1
`;
    }

    if (isMultiGrade) {
      return `
Create a ${gradeConfig.pathwayType} pacing guide for ${gradeConfig.selectedGrades.join(' + ')} mathematics.

${chunkInstructions}

**CURRICULUM DATA:**${curriculumContext}

**CRITICAL PACING PRINCIPLES:**
1. **No Lesson Duplication**: Each specific lesson should appear exactly once in the entire sequence
2. **Realistic Duration**: Each lesson requires 3-5 instructional days to complete properly
3. **Logical Prerequisites**: Ensure foundational concepts precede advanced applications
4. **Smooth Transitions**: Avoid abrupt topic switches - create natural bridges between units
5. **Grade 8 First**: Establish solid foundations from Grade 8 before progressing to Algebra 1

**SEQUENCE STRATEGY:**
- Start with essential Grade 8 number systems and geometry foundations
- Progress through Grade 8 linear relationships and equations  
- Transition to Algebra 1 functions and advanced applications
- Each lesson should build naturally on previous lessons

**REQUIREMENTS:**
- Use exact unit/lesson titles from curriculum data above
- Include textbook source and page numbers  
- Create logical progression for ${weekRange}
- Focus on essential standards alignment
- CRITICAL: Each lesson takes 3-5 days to complete (NOT 1 day)
- CRITICAL: Generate exactly ${totalWeeks} weeks of curriculum
- Each week should contain 1-2 lessons maximum (since lessons are 3-5 days each)
- Avoid duplicating lessons - each lesson should appear only once in the sequence
- Prioritize essential Grade 8 foundations before advancing to Algebra 1
- Create smooth transitions between topics, not abrupt subject switches

**JSON OUTPUT REQUIRED:**
Return ONLY valid JSON in this exact format:

\`\`\`json
{
  "overview": {
    "gradeLevel": "${context.gradeLevel}",
    "timeframe": "${request.timeframe}",
    "totalWeeks": ${isChunked ? `${request.chunkInfo?.totalWeeks || totalWeeks}` : totalWeeks},
    ${isChunked ? `"chunkInfo": {
      "chunkNumber": ${chunkNumber},
      "totalChunks": ${totalChunks},
      "weeksInThisChunk": ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks))},
      "isChunked": true
    },` : ''}
    "lessonsPerWeek": 1.5,
    "description": "Brief description${isChunked ? ` (Chunk ${chunkNumber} of ${totalChunks})` : ''}"
  },
  "weeklySchedule": [
${isChunked ? `    // CRITICAL: Generate ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks))} individual weeks (weeks ${(chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks) + 1} through ${Math.min(chunkNumber * Math.ceil(totalWeeks / totalChunks), totalWeeks)}) ONLY - Each week contains 1-2 lessons (lessons are 3-5 days each)` : `    // CRITICAL: Generate ALL ${totalWeeks} individual weeks (weeks 1 through ${totalWeeks}) - Each week contains 1-2 lessons (lessons are 3-5 days each)`}
    {
      "week": ${isChunked ? (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks) + 1 : 1},
      "unit": "EXACT unit title from curriculum data",
      "textbookSource": "Grade 8 Ready Classroom Mathematics",
      "volume": "Volume 1",
      "unitNumber": 1,
      "lessons": [
        "Grade 8, Unit 1, Lesson 1: Exact lesson title (Page #)",
        "Grade 8, Unit 1, Lesson 2: Next lesson title (Page #)"
      ],
      "lessonDuration": "3-5 days per lesson",
      "focusStandards": ["8.G.A.1"],
      "learningObjectives": ["Clear objective"]
    }${isChunked ? `,
    // Continue for ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks)) - 1} more weeks in this chunk` : `,
    // Continue for all ${totalWeeks - 1} more weeks`}
  ]
}
\`\`\`

${isChunked ? `**GENERATE EXACTLY ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks))} INDIVIDUAL WEEKS FOR CHUNK ${chunkNumber}**
- Each week = 1-2 lessons (each lesson takes 3-5 days)
- Focus on logical progression without duplication
- Do NOT repeat lessons from earlier weeks` : `**GENERATE ALL ${totalWeeks} INDIVIDUAL WEEKS**
- Each week = 1-2 lessons (each lesson takes 3-5 days)
- Focus on logical progression without duplication
- Do NOT repeat lessons from earlier weeks`}

CRITICAL: Return ONLY the JSON object. No additional text before or after.
      `;
    }

    // Fallback to original prompt for single grades
    return this.buildDetailedPrompt(context, request);
  }

  private async buildDetailedLessonPrompt(request: PacingGuideRequest, acceleratedPathway: any[], context: CurriculumContext): Promise<string> {
    const grades = request.gradeCombination?.selectedGrades || [request.gradeLevel];
    const totalWeeks = this.calculateWeeks(request.timeframe);
    
    console.log('🔍 [AI Service] Building detailed prompt with:', {
      gradesCount: grades.length,
      acceleratedPathwayLessons: acceleratedPathway.length,
      totalWeeks: totalWeeks,
      sampleLesson: acceleratedPathway[0]
    });
    
    const prompt = `Create a comprehensive accelerated mathematics pathway for grades ${grades.join('+')} over ${request.timeframe}.

**CRITICAL REQUIREMENT: MUST GENERATE EXACTLY ${totalWeeks} WEEKS OF CURRICULUM**

**Requirements:**
- **MANDATORY**: Create ${totalWeeks} weeks of content (weeks 1-${totalWeeks})
- **TIMEFRAME**: ${request.timeframe} (${totalWeeks} weeks total)
- Student Population: ${request.studentPopulation}
- Schedule: ${request.scheduleConstraints?.daysPerWeek || 5} days/week, ${request.scheduleConstraints?.minutesPerClass || 50} min/class
- Total Available Lessons: ${acceleratedPathway.length}
- Differentiation Needs: ${request.differentiationNeeds?.join(', ') || 'Standard'}
- Priorities: ${request.priorities?.join(', ') || 'Standards alignment'}

**Sample Lesson Topics:**
${acceleratedPathway.slice(0, 8).map(lesson => `${lesson.lessonNumber}. ${lesson.title} (Grade ${lesson.grade})`).join('\n')}

**IMPORTANT: Your lessonByLessonBreakdown must contain ${totalWeeks} WEEKS of curriculum content, NOT ${totalWeeks} individual lessons**
**Each week should contain approximately 4-5 lessons for a total of ${totalWeeks * 4} individual lessons across all weeks**

Create a detailed JSON response with this EXACT structure (field names must match exactly):

{
  "pathway": {
    "name": "Accelerated Grade ${grades.join('+')} Mathematics Pathway",
    "description": "Comprehensive description of the accelerated pathway combining these grade levels",
    "targetOutcome": "Clear learning outcomes and objectives for students",
    "duration": "${request.timeframe}"
  },
  "analysisResults": {
    "choicesAnalyzed": {
      "gradesCombined": ${JSON.stringify(grades)},
      "pathwayType": "accelerated",
      "emphasis": "foundational",
      "studentPopulation": "${request.studentPopulation}"
    },
    "scopeAndSequenceMatch": "Detailed analysis of how curriculum aligns with standards progression",
    "standardsCoverage": {
      "majorWork": ["List of major standards covered (e.g., 8.EE.7, A-REI.3)"],
      "supportingWork": ["List of supporting standards"],
      "additionalWork": ["List of additional standards"],
      "crossGradeConnections": ["How standards connect across grade levels"]
    },
    "prerequisiteCheck": {
      "prerequisitesRequired": ["Required prerequisite skills for this pathway"],
      "prerequisitesMet": ["Prerequisites addressed by this pathway"],
      "potentialGaps": ["Potential learning gaps to monitor and address"]
    }
  },
  "lessonByLessonBreakdown": [
    {
      "lessonNumber": 1,
      "title": "Specific lesson title from curriculum",
      "unit": "Unit name (e.g., Number Systems)",
      "grade": "8",
      "duration": { "sessions": 2, "totalMinutes": 100 },
      "standards": {
        "primary": ["8.NS.1", "8.NS.2"],
        "supporting": ["8.EE.1"],
        "mathematical_practices": ["MP1", "MP3", "MP6"]
      },
      "learningObjectives": ["Clear, measurable learning objectives"],
      "keyVocabulary": ["Key mathematical terms"],
      "materials": ["Required instructional materials"],
      "lessonStructure": [
        {
          "phase": "Opening",
          "duration": 10,
          "activities": ["Warm-up activities and agenda review"]
        },
        {
          "phase": "Instruction",
          "duration": 25,
          "activities": ["Direct instruction and guided practice"]
        },
        {
          "phase": "Practice",
          "duration": 10,
          "activities": ["Independent or partner practice"]
        },
        {
          "phase": "Closure",
          "duration": 5,
          "activities": ["Exit ticket and summary"]
        }
      ],
      "differentiation": {
        "supports": ["Strategies for struggling learners"],
        "extensions": ["Advanced activities for ready learners"],
        "accommodations": ["Specific accommodations needed"]
      },
      "assessment": {
        "formative": ["Formative assessment strategies"],
        "summative": "Unit test or performance assessment",
        "exitTicket": "Specific exit ticket question"
      },
      "homework": "Homework assignment details",
      "connectionToNext": "How this lesson connects to the next"
    }
  ],
  "progressionMap": [
    {
      "stage": 1,
      "name": "Foundation Building",
      "weeks": [1, 2, 3, 4],
      "focus": "Core foundational concepts",
      "milestones": ["Key learning milestones for this stage"],
      "assessments": ["Major assessments in this stage"]
    }
  ],
  "assessmentStrategy": {
    "formativeApproaches": ["Daily formative assessment methods"],
    "summativeSchedule": [
      {
        "week": 4,
        "type": "Unit Test",
        "standards": ["8.NS.1-2"],
        "description": "Assessment description and format"
      }
    ],
    "diagnosticCheckpoints": [6, 12, 18, 24, 30],
    "portfolioComponents": ["Portfolio requirements and components"],
    "masteryIndicators": ["How students demonstrate mastery"]
  },
  "teachingSupport": {
    "pacingRecommendations": ["Specific pacing guidance and flexibility options"],
    "professionalDevelopment": ["PD needs and recommendations"],
    "resources": {
      "instructional": ["Required teaching resources"],
      "assessment": ["Assessment tools and rubrics"],
      "digital": ["Digital tools and platforms"]
    },
    "parentCommunication": ["Parent communication strategies and templates"]
  }
}

CRITICAL: Generate comprehensive content for 10-15 key lessons covering the most essential concepts for the full ${request.timeframe}. Focus on major work standards and foundational skills. Include detailed lesson breakdowns with proper standards alignment, differentiation strategies, and practical implementation guidance that teachers can use immediately. Each lesson should represent approximately 2-3 weeks of instruction when expanded by teachers.`;

    console.log('📏 [AI Service] Prompt length:', prompt.length, 'characters');
    return prompt;
  }

  // DISABLED - Parse AI response into DetailedLessonGuide format
  /*
      "supportingWork": ["List of supporting standards"],
      "additionalWork": ["List of additional standards"],
      "crossGradeConnections": ["Connections between grades"],
      "algebraReadinessIndicators": ["Key indicators for Algebra readiness"]
    },
    "prerequisiteCheck": {
      "prerequisitesRequired": ["Required prerequisite skills"],
      "prerequisitesMet": ["Prerequisites met by this pathway"],
      "potentialGaps": ["Potential learning gaps"],
      "interventionSuggestions": ["Suggested interventions"]
    }
  },
  "lessonByLessonBreakdown": [
    {
      "lessonNumber": 1,
      "title": "Lesson title from accelerated pathway",
      "unit": "Unit name",
      "grade": "7 or 8",
      "duration": {
        "sessions": 2,
        "totalMinutes": 90
      },
      "standards": {
        "primary": ["Primary standards"],
        "supporting": ["Supporting standards"],
        "mathematical_practices": ["Mathematical practices"]
      },
      "learningObjectives": ["Clear learning objectives"],
      "keyVocabulary": ["Important vocabulary terms"],
      "materials": ["Required materials"],
      "lessonStructure": [
        {
          "phase": "Warm-Up",
          "timeMinutes": 10,
          "description": "Phase description",
          "teacherActions": ["Teacher actions"],
          "studentActions": ["Student actions"],
          "keyQuestions": ["Essential questions"]
        }
      ],
      "differentiation": {
        "supports": ["Support strategies"],
        "extensions": ["Extension activities"],
        "accommodations": ["Accommodations"]
      },
      "assessment": {
        "formative": ["Formative assessments"],
        "exitTicket": "Exit ticket question"
      },
      "homework": "Homework assignment",
      "connectionToNext": "Connection to next lesson",
      "realWorldApplication": "Real-world application"
    }
  ],
  "progressionMap": [
    {
      "stage": "Stage name",
      "weeks": [1, 2, 3],
      "focus": "Stage focus",
      "milestones": ["Key milestones"],
      "assessmentPoints": ["Assessment points"]
    }
  ],
  "assessmentFramework": {
    "formativeAssessments": [
      {
        "type": "Assessment type",
        "frequency": "How often",
        "format": "Assessment format",
        "duration": "Time required",
        "purpose": "Assessment purpose",
        "gradingCriteria": ["Grading criteria"]
      }
    ],
    "diagnosticCheckpoints": [
      {
        "timing": "When administered",
        "focus": "Focus area",
        "assessmentMethod": "Method used",
        "interventionTriggers": ["When to intervene"]
      }
    ],
    "portfolioElements": ["Portfolio components"],
    "masteryIndicators": ["How to measure mastery"]
  },
  "teachingSupport": {
    "pedagogicalApproach": "Overall teaching philosophy",
    "classroomManagement": ["Management strategies"],
    "parentCommunication": ["Communication strategies"],
    "professionalDevelopment": ["PD recommendations"],
    "resources": {
      "required": ["Essential resources"],
      "recommended": ["Recommended resources"],
      "digital": ["Digital tools and platforms"]
    }
  }
}
\`\`\`

## SPECIAL FOCUS AREAS

Since this is specifically for accelerated 8th grade students preparing for Algebra II or Geometry:

1. Emphasize algebraic thinking and linear relationships
2. Ensure strong foundation in coordinate geometry
3. Build robust understanding of functions
4. Develop facility with systems of equations
5. Strengthen proportional reasoning
6. Prepare for polynomial operations through exponent work

Generate a comprehensive, implementable guide that teachers can use immediately to deliver this accelerated pathway effectively.\`;
  }

  private async parseDetailedLessonResponse(aiResponse: string, request: PacingGuideRequest, acceleratedPathway: any[]): Promise<DetailedLessonGuide> {
    try {
      console.log('🔍 [AI Service] Parsing detailed lesson response...');
   - Prerequisite checking

4. **Generate Detailed Lesson Plans**: For each lesson in the accelerated pathway, create comprehensive lesson plans including:
   - Learning objectives
   - Key vocabulary
   - Lesson structure (Warm-Up, Explore, Develop, Refine phases)
   - Differentiation strategies
   - Assessment methods
   - Real-world applications

## OUTPUT FORMAT

Please provide a detailed JSON response with the following structure:

\`\`\`json
{
  "pathway": {
    "name": "Accelerated 8th Grade to Algebra I Pathway",
    "description": "Description of the pathway approach",
    "targetOutcome": "Students prepared for Algebra II or Geometry",
    "duration": "Academic year timeframe"
  },
  "analysisResults": {
    "choicesAnalyzed": ${JSON.stringify(choicesAnalysis)},
    "scopeAndSequenceMatch": "Detailed analysis of how choices align with accelerated pathway",
    "standardsCoverage": {
      "majorWork": ["List of major work standards"],
      "supportingWork": ["List of supporting standards"],
      "additionalWork": ["List of additional standards"],
      "crossGradeConnections": ["Connections between grades"],
      "algebraReadinessIndicators": ["Key indicators for Algebra readiness"]
    },
    "prerequisiteCheck": {
      "prerequisitesRequired": ["Required prerequisite skills"],
      "prerequisitesMet": ["Prerequisites met by this pathway"],
      "potentialGaps": ["Potential learning gaps"],
      "interventionSuggestions": ["Suggested interventions"]
    }
  },
  "lessonByLessonBreakdown": [
    {
      "lessonNumber": 1,
      "title": "Lesson title from accelerated pathway",
      "unit": "Unit name",
      "grade": "7 or 8",
      "duration": {
        "sessions": 2,
        "totalMinutes": 90
      },
      "standards": {
        "primary": ["Primary standards"],
        "supporting": ["Supporting standards"],
        "mathematical_practices": ["Relevant mathematical practices"]
      },
      "learningObjectives": ["Specific, measurable objectives"],
      "keyVocabulary": ["Essential vocabulary terms"],
      "materials": ["Required materials and resources"],
      "lessonStructure": [
        {
          "phase": "Warm-Up",
          "timeMinutes": 10,
          "description": "Detailed phase description",
          "teacherActions": ["Specific teacher actions"],
          "studentActions": ["Expected student actions"],
          "keyQuestions": ["Essential questions for this phase"]
        }
      ],
      "differentiation": {
        "supports": ["Support strategies for struggling learners"],
        "extensions": ["Extension activities for advanced learners"],
        "accommodations": ["Specific accommodations"]
      },
      "assessment": {
        "formative": ["Formative assessment strategies"],
        "summative": "Summative assessment if applicable",
        "exitTicket": "Exit ticket question"
      },
      "homework": "Homework assignment description",
      "connectionToNext": "How this lesson connects to the next",
      "realWorldApplication": "Real-world application or context"
    }
  ],
  "progressionMap": [
    {
      "stage": "Foundation Building",
      "weeks": [1, 2, 3],
      "focus": "Core concepts establishment",
      "milestones": ["Key milestones"],
      "assessmentPoints": ["Assessment timing"]
    }
  ],
  "assessmentStrategy": {
    "overallApproach": "Comprehensive assessment philosophy",
    "formativeStrategies": ["Daily formative strategies"],
    "summativeAssessments": [
      {
        "name": "Assessment name",
        "timing": "When administered",
        "standards": ["Standards assessed"],
        "format": "Assessment format",
        "duration": "Time required",
        "purpose": "Assessment purpose",
        "gradingCriteria": ["Grading criteria"]
      }
    ],
    "diagnosticCheckpoints": [
      {
        "timing": "When administered",
        "focus": "Focus area",
        "assessmentMethod": "Method used",
        "interventionTriggers": ["When to intervene"]
      }
    ],
    "portfolioElements": ["Portfolio components"],
    "masteryIndicators": ["How to measure mastery"]
  },
  "teachingSupport": {
    "pedagogicalApproach": "Overall teaching philosophy",
    "classroomManagement": ["Management strategies"],
    "parentCommunication": ["Communication strategies"],
    "professionalDevelopment": ["PD recommendations"],
    "resources": {
      "required": ["Essential resources"],
      "recommended": ["Recommended resources"],
      "digital": ["Digital tools and platforms"]
    }
  }
}

## SPECIAL FOCUS AREAS

Since this is specifically for accelerated 8th grade students preparing for Algebra II or Geometry:

1. Emphasize algebraic thinking and linear relationships
2. Ensure strong foundation in coordinate geometry
3. Build robust understanding of functions
4. Develop facility with systems of equations
5. Strengthen proportional reasoning
6. Prepare for polynomial operations through exponent work

Generate a comprehensive, implementable guide that teachers can use immediately to deliver this accelerated pathway effectively.`;
  }
  */

  private async parseDetailedLessonResponse(aiResponse: string, request: PacingGuideRequest, acceleratedPathway: any[]): Promise<DetailedLessonGuide> {
    try {
      console.log('🔍 [AI Service] Parsing detailed lesson response...');
      
      // Extract JSON from AI response
      let parsedResponse: any = null;
      
      const jsonBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        parsedResponse = JSON.parse(jsonBlockMatch[1]);
      } else {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          parsedResponse = JSON.parse(aiResponse);
        }
      }
      
      console.log('📊 [AI Service] Parsed detailed response structure:', Object.keys(parsedResponse || {}));
      
      // Structure the detailed lesson guide
      const detailedGuide: DetailedLessonGuide = {
        pathway: parsedResponse.pathway || {
          name: "Accelerated 8th Grade to Algebra I Pathway",
          description: "Comprehensive accelerated pathway combining Grade 7-8 content to prepare students for advanced mathematics",
          targetOutcome: "Students prepared for Algebra II or Geometry",
          duration: request.timeframe
        },
        analysisResults: parsedResponse.analysisResults || {
          choicesAnalyzed: {
            gradeLevel: request.gradeLevel,
            gradeCombination: request.gradeCombination,
            timeframe: request.timeframe,
            studentPopulation: request.studentPopulation,
            priorities: request.priorities
          },
          scopeAndSequenceMatch: "Analysis pending",
          standardsCoverage: {
            majorWork: [],
            supportingWork: [],
            additionalWork: [],
            crossGradeConnections: [],
            algebraReadinessIndicators: []
          },
          prerequisiteCheck: {
            prerequisitesRequired: [],
            prerequisitesMet: [],
            potentialGaps: [],
            interventionSuggestions: []
          }
        },
        lessonByLessonBreakdown: parsedResponse.lessonByLessonBreakdown || acceleratedPathway.map((lesson, index) => ({
          lessonNumber: lesson.lessonNumber || index + 1,
          title: lesson.title,
          unit: lesson.unit,
          grade: lesson.grade,
          duration: {
            sessions: lesson.sessions || 2,
            totalMinutes: (lesson.sessions || 2) * 45
          },
          standards: {
            primary: lesson.standards || [],
            supporting: [],
            mathematical_practices: []
          },
          learningObjectives: [
            `Students will understand ${lesson.title.toLowerCase()}`,
            `Students will apply concepts in real-world contexts`
          ],
          keyVocabulary: [],
          materials: ["Student textbook", "Interactive whiteboard", "Manipulatives"],
          lessonStructure: [
            {
              phase: "Warm-Up",
              timeMinutes: 10,
              description: "Review prior knowledge and prepare for new learning",
              teacherActions: ["Present warm-up problem", "Facilitate discussion"],
              studentActions: ["Complete warm-up", "Share thinking"],
              keyQuestions: ["What do you remember about...?"]
            },
            {
              phase: "Explore",
              timeMinutes: 15,
              description: "Initial exploration of new concept",
              teacherActions: ["Present exploration task", "Observe student work"],
              studentActions: ["Work on exploration", "Discuss findings"],
              keyQuestions: ["What patterns do you notice?"]
            },
            {
              phase: "Develop",
              timeMinutes: 15,
              description: "Formalize the mathematical concept",
              teacherActions: ["Facilitate concept development", "Connect to prior learning"],
              studentActions: ["Participate in discussion", "Take notes"],
              keyQuestions: ["How does this connect to what we know?"]
            },
            {
              phase: "Refine",
              timeMinutes: 5,
              description: "Clarify and consolidate understanding",
              teacherActions: ["Address misconceptions", "Summarize key points"],
              studentActions: ["Ask questions", "Reflect on learning"],
              keyQuestions: ["What is the most important thing to remember?"]
            }
          ],
          differentiation: {
            supports: ["Visual aids", "Peer support", "Modified problems"],
            extensions: ["Challenge problems", "Mathematical connections"],
            accommodations: ["Extended time", "Alternative formats"]
          },
          assessment: {
            formative: ["Exit ticket", "Observation", "Quick check"],
            exitTicket: "Write one thing you learned and one question you have"
          },
          homework: "Practice problems from textbook",
          connectionToNext: `This lesson prepares students for the next lesson on ${acceleratedPathway[index + 1]?.title || 'advanced concepts'}`,
          realWorldApplication: "Real-world application will be determined based on lesson content"
        })),
        progressionMap: parsedResponse.progressionMap || [
          {
            stage: "Foundation Building",
            weeks: [1, 2, 3, 4, 5, 6],
            focus: "Core concepts and number sense",
            milestones: ["Master rational number operations", "Understand proportional relationships"],
            assessmentPoints: ["Week 3: Formative check", "Week 6: Unit assessment"]
          },
          {
            stage: "Algebraic Thinking",
            weeks: [7, 8, 9, 10, 11, 12],
            focus: "Expressions, equations, and linear relationships",
            milestones: ["Solve linear equations", "Graph linear functions"],
            assessmentPoints: ["Week 9: Mid-unit check", "Week 12: Unit assessment"]
          },
          {
            stage: "Advanced Applications",
            weeks: [13, 14, 15, 16, 17, 18],
            focus: "Systems, functions, and coordinate geometry",
            milestones: ["Solve systems of equations", "Analyze functions"],
            assessmentPoints: ["Week 15: Progress check", "Week 18: Comprehensive assessment"]
          }
        ],
        assessmentStrategy: parsedResponse.assessmentStrategy || {
          overallApproach: "Balanced formative and summative assessment with emphasis on mathematical practices",
          formativeStrategies: ["Daily exit tickets", "Think-pair-share", "Observation protocols"],
          summativeAssessments: [
            {
              name: "Unit 1 Assessment: Number Sense and Proportional Relationships",
              timing: "Week 6",
              standards: ["7.RP", "7.NS"],
              format: "Mixed format with multiple choice and constructed response",
              duration: "50 minutes",
              purpose: "Measure understanding of foundational concepts",
              gradingCriteria: ["Accuracy", "Mathematical reasoning", "Communication"]
            }
          ],
          diagnosticCheckpoints: [
            {
              timing: "Week 1",
              focus: "Prerequisite skills",
              assessmentMethod: "Diagnostic pre-assessment",
              interventionTriggers: ["Score below 70%", "Gaps in foundational skills"]
            }
          ],
          portfolioElements: ["Problem-solving reflections", "Mathematical connections", "Growth documentation"],
          masteryIndicators: ["Consistent accuracy", "Flexible thinking", "Clear communication"]
        },
        teachingSupport: parsedResponse.teachingSupport || {
          pedagogicalApproach: "Constructivist approach with emphasis on mathematical discourse and real-world connections",
          classroomManagement: ["Clear expectations", "Collaborative grouping", "Mathematical talk protocols"],
          parentCommunication: ["Weekly progress updates", "Home support suggestions", "Conference opportunities"],
          professionalDevelopment: ["Mathematical practices workshop", "Differentiation strategies", "Assessment design"],
          resources: {
            required: ["Student textbooks", "Teacher edition", "Manipulatives", "Graphing technology"],
            recommended: ["Online practice platform", "Mathematical modeling tasks", "Assessment bank"],
            digital: ["Desmos graphing calculator", "Khan Academy", "IXL Math"]
          }
        }
      };
      
      console.log('✅ [AI Service] Detailed lesson guide structured successfully');
      return detailedGuide;
      
    } catch (error) {
      console.error('❌ [AI Service] Error parsing detailed response:', error);
      throw new Error(`Failed to parse detailed lesson response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect() {
    await this.curriculumService.disconnect();
  }

  private generatePathwayDescription(grades: string[], gradeDescriptions: string[], gradeFocus: string[]): string {
    const gradeCount = grades.length;
    
    if (gradeCount === 1) {
      return `**SINGLE GRADE PATHWAY:** Focus on ${gradeDescriptions[0]} with emphasis on ${gradeFocus[0]}.`;
    } else if (gradeCount === 2) {
      return `**DUAL GRADE ACCELERATED PATHWAY:** This combines ${gradeDescriptions.join(' and ')} to create an accelerated learning experience bridging ${gradeFocus.join(' and ')}.`;
    } else if (gradeCount === 3) {
      return `**TRI-GRADE SUPER-ACCELERATED PATHWAY:** This ambitious pathway spans ${gradeDescriptions.join(', ')} to create a highly compressed curriculum covering ${gradeFocus.join(', ')}.`;
    } else {
      return `**ULTRA-ACCELERATED "BABY EINSTEIN ASGARD" PATHWAY:** This ultimate pathway combines ALL ${gradeCount} grade levels (${gradeDescriptions.join(', ')}) for genius-level students ready to master ${gradeFocus.join(', ')} in a single year.`;
    }
  }

  private generateSelectionStrategy(grades: string[], totalLessonsAvailable: number): string {
    const gradeCount = grades.length;
    const hasEarlyGrades = grades.includes('6') || grades.includes('7');
    const hasLateGrades = grades.includes('8') || grades.includes('9');
    
    let strategy = `- **ANALYZE ALL ${totalLessonsAvailable}+ LESSONS** from ${gradeCount} grade levels above\n`;
    strategy += `- **SELECT THE OPTIMAL 36 LESSONS** that provide maximum standards coverage\n`;
    
    if (gradeCount === 1) {
      strategy += `- **SINGLE GRADE FOCUS:** Select the most essential lessons that build core competencies\n`;
    } else if (gradeCount === 2) {
      strategy += `- **DUAL GRADE OPTIMIZATION:** Balance foundational and advanced concepts for smooth progression\n`;
    } else if (gradeCount >= 3) {
      strategy += `- **MULTI-GRADE CURATION:** Identify overlapping concepts and select the most advanced version\n`;
      strategy += `- **SKIP REDUNDANT CONTENT:** Eliminate lessons that repeat concepts across grade levels\n`;
    }
    
    if (hasEarlyGrades && hasLateGrades) {
      strategy += `- **BRIDGE EARLY TO ADVANCED:** Ensure foundational concepts support advanced mathematics\n`;
    }
    
    if (grades.includes('9')) {
      strategy += `- **ALGEBRA 1 PREPARATION:** Prioritize lessons that prepare for college-level mathematics\n`;
    }
    
    return strategy;
  }

  /**
   * CRITICAL: Generate dual-grade accelerated pacing guide with enforced 50/50 split
   * This method ensures equal representation by creating condensed 18-week curricula for each grade
   */
  async generateDualGradeAcceleratedPacingGuide(request: PacingGuideRequest): Promise<PacingGuideResponse> {
    console.group('🚀 [Dual-Grade Accelerated] Starting Dual-Grade Accelerated Generation');
    
    try {
      const totalWeeks = this.calculateWeeks(request.timeframe);
      const gradeConfig = this.parseGradeConfiguration(request);
      const grades = gradeConfig.selectedGrades;
      
      if (grades.length !== 2) {
        throw new Error('Dual-grade generation requires exactly 2 grades');
      }
      
      console.log('🎯 [Dual-Grade Accelerated] Configuration:', {
        totalWeeks,
        grade1: grades[0],
        grade2: grades[1],
        weeksPerGrade: 18,
        pathwayType: gradeConfig.pathwayType,
        emphasis: gradeConfig.emphasis
      });
      
      // Generate condensed 18-week curriculum for each grade
      const grade1Curriculum = await this.generateCondensedGradeCurriculum(grades[0], 18, gradeConfig);
      const grade2Curriculum = await this.generateCondensedGradeCurriculum(grades[1], 18, gradeConfig);
      
      console.log('📊 [Dual-Grade Accelerated] Individual curricula generated:', {
        grade1Weeks: grade1Curriculum.weeklySchedule.length,
        grade2Weeks: grade2Curriculum.weeklySchedule.length,
        grade1FirstWeek: grade1Curriculum.weeklySchedule[0]?.unit,
        grade2FirstWeek: grade2Curriculum.weeklySchedule[0]?.unit
      });
      
      // Strategic interweaving of the two curricula
      const interweavedCurriculum = this.strategicallyInterweaveGrades(
        grade1Curriculum, 
        grade2Curriculum, 
        totalWeeks,
        gradeConfig
      );
      
      console.log('🔗 [Dual-Grade Accelerated] Curricula interweaved successfully');
      
      // Generate comprehensive explanation
      const explanation = this.generateDualGradeExplanation(
        grade1Curriculum, 
        grade2Curriculum, 
        interweavedCurriculum,
        gradeConfig
      );
      
      const response: PacingGuideResponse = {
        success: true,
        pacingGuide: {
          ...interweavedCurriculum,
          description: `Dual-Grade Accelerated ${grades.join('+')} curriculum with enforced 50/50 distribution`,
          explanation: explanation
        },
        metadata: {
          model: this.selectedModel || 'gpt-4o',
          prompt: 'Dual-Grade Accelerated Generation',
          response: `Generated ${totalWeeks}-week interweaved curriculum`,
          tokens: { input: 0, output: 0, total: 0 },
          generationTime: Date.now()
        }
      };
      
      console.log('🎉 [Dual-Grade Accelerated] Generation complete!');
      console.groupEnd();
      return response;
      
    } catch (error) {
      console.error('💥 [Dual-Grade Accelerated] Generation failed:', error);
      console.groupEnd();
      throw error;
    }
  }

  /**
   * Generate condensed 18-week curriculum for a single grade
   */
  private async generateCondensedGradeCurriculum(
    grade: string, 
    targetWeeks: number, 
    gradeConfig: any
  ): Promise<any> {
    console.log(`📚 [Condensed ${grade}] Generating ${targetWeeks}-week condensed curriculum for Grade ${grade}`);
    
    // Build curriculum context for this specific grade
    const context = await this.curriculumService.buildCurriculumContext(grade);
    
    // Create a condensed request for this grade only
    const condensedRequest = {
      gradeLevel: grade,
      timeframe: `${targetWeeks} weeks`,
      gradeCombination: {
        selectedGrades: [grade],
        pathwayType: 'accelerated',
        emphasis: gradeConfig.emphasis || 'foundational'
      },
      studentPopulation: 'accelerated',
      scheduleConstraints: {
        daysPerWeek: 5,
        minutesPerClass: 50
      }
    };
    
    // Generate condensed curriculum using AI
    const prompt = this.buildCondensedGradePrompt(grade, targetWeeks, context, gradeConfig);
    
    console.log(`🤖 [Condensed ${grade}] Calling AI for condensed Grade ${grade} curriculum...`);
    const aiResponse = await this.callOpenAI(prompt);
    
    const parsedResponse = this.parseAIResponse(aiResponse);
    
    console.log(`✅ [Condensed ${grade}] Generated ${parsedResponse.weeklySchedule?.length || 0} weeks for Grade ${grade}`);
    
    return parsedResponse;
  }

  /**
   * Build specialized prompt for condensed grade curriculum
   */
  private buildCondensedGradePrompt(
    grade: string, 
    targetWeeks: number, 
    context: any, 
    gradeConfig: any
  ): string {
    return `
🎯 CONDENSED GRADE ${grade} CURRICULUM GENERATION

**CRITICAL MISSION:** Create a ${targetWeeks}-week accelerated curriculum for Grade ${grade} that represents the ESSENTIAL high-impact lessons from a full-year curriculum.

**CONDENSATION RULES:**
- Select ONLY the most critical, gateway lessons that unlock advanced concepts
- Focus on major work standards and foundational concepts
- Eliminate review, practice-only, and supporting standard lessons
- Each lesson should take 2-3 days instead of 5 (use Develop-only sessions)
- Prioritize lessons with strong connections to the next grade level

**GRADE ${grade} CURRICULUM DATA:**
${this.getCurriculumData(grade)}

**SELECTION CRITERIA:**
- Major Work Standards: ALWAYS include
- Foundational Concepts: Include if they bridge to advanced topics
- Gateway Lessons: Include lessons that unlock multiple future concepts
- Supporting Standards: Include ONLY if essential for major work
- Review/Practice: EXCLUDE unless absolutely critical

**OUTPUT REQUIREMENTS:**
Generate EXACTLY ${targetWeeks} weeks of condensed curriculum.
Each week should contain 1-2 high-impact lessons.
Focus on progression and conceptual understanding.

Return JSON format:
{
  "overview": {
    "gradeLevel": "${grade}",
    "timeframe": "${targetWeeks} weeks",
    "condensationLevel": "high",
    "totalWeeks": ${targetWeeks}
  },
  "weeklySchedule": [
    {
      "week": 1,
      "unit": "Unit Name",
      "lessons": ["Lesson 1", "Lesson 2"],
      "focusStandards": ["Standard.Code"],
      "assessmentType": null,
      "lessonDuration": "3-5 days per lesson",
      "learningObjectives": ["Objective 1"]
    }
    // ... exactly ${targetWeeks} week objects with this structure
  ]
}

CRITICAL: Return ONLY the JSON object. No additional text.
    `.trim();
  }

  /**
   * Strategically interweave two grade-level curricula
   */
  private strategicallyInterweaveGrades(
    grade1Curriculum: any,
    grade2Curriculum: any,
    totalWeeks: number,
    gradeConfig: any
  ): any {
    console.log('🔗 [Interweaving] Starting strategic interweaving of curricula');
    
    const interweavedSchedule: any[] = [];
    const grade1Weeks = grade1Curriculum.weeklySchedule || [];
    const grade2Weeks = grade2Curriculum.weeklySchedule || [];
    
    // Interweaving strategy: alternate between grades with logical progression
    const interweavingPatterns = {
      // Start with foundational grade 1 concepts, then introduce grade 2
      foundationalFirst: [1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2],
      // More balanced throughout
      balanced: [1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2],
      // Build up to advanced grade 2 concepts
      advancedBuildup: [1, 1, 2, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2]
    };
    
    const pattern = interweavingPatterns.foundationalFirst;
    let grade1Index = 0;
    let grade2Index = 0;
    
    for (let week = 1; week <= totalWeeks; week++) {
      const weekIndex = (week - 1) % pattern.length;
      const useGrade = pattern[weekIndex];
      
      let weekData;
      if (useGrade === 1 && grade1Index < grade1Weeks.length) {
        weekData = { ...grade1Weeks[grade1Index] };
        grade1Index++;
      } else if (useGrade === 2 && grade2Index < grade2Weeks.length) {
        weekData = { ...grade2Weeks[grade2Index] };
        grade2Index++;
      } else {
        // Fallback: use whichever grade has remaining content
        if (grade1Index < grade1Weeks.length) {
          weekData = { ...grade1Weeks[grade1Index] };
          grade1Index++;
        } else if (grade2Index < grade2Weeks.length) {
          weekData = { ...grade2Weeks[grade2Index] };
          grade2Index++;
        }
      }
      
      if (weekData) {
        // Ensure the week object has the proper structure that frontend expects
        const standardizedWeek = {
          week: week,
          unit: weekData.unit || weekData.lessons?.[0] || `Week ${week} Content`,
          lessons: weekData.lessons || [],
          focusStandards: weekData.focusStandards || weekData.standards || [],
          assessmentType: weekData.assessmentType || null,
          lessonDuration: weekData.lessonDuration || "3-5 days per lesson",
          learningObjectives: weekData.learningObjectives || []
        };
        
        interweavedSchedule.push(standardizedWeek);
      }
    }
    
    console.log('📊 [Interweaving] Final distribution:', {
      totalWeeks: interweavedSchedule.length,
      grade1WeeksUsed: grade1Index,
      grade2WeeksUsed: grade2Index,
      grade1Remaining: grade1Weeks.length - grade1Index,
      grade2Remaining: grade2Weeks.length - grade2Index
    });
    
    return {
      overview: {
        gradeLevel: `${gradeConfig.selectedGrades.join('+')}`,
        timeframe: 'year',
        totalWeeks: totalWeeks,
        lessonsPerWeek: 1.5,
        description: `Strategically interweaved dual-grade accelerated curriculum`,
        interweavingStrategy: 'foundationalFirst'
      },
      weeklySchedule: interweavedSchedule,
      assessmentPlan: this.generateDualGradeAssessmentPlan(totalWeeks),
      differentiationStrategies: [],
      flexibilityOptions: []
    };
  }

  /**
   * Generate explanation for dual-grade approach
   */
  private generateDualGradeExplanation(
    grade1Curriculum: any,
    grade2Curriculum: any,
    finalCurriculum: any,
    gradeConfig: any
  ): string {
    const grade1Count = grade1Curriculum.weeklySchedule?.length || 0;
    const grade2Count = grade2Curriculum.weeklySchedule?.length || 0;
    const finalWeeks = finalCurriculum.weeklySchedule?.length || 0;
    
    return `This dual-grade accelerated curriculum was derived by creating condensed 18-week curricula for both Grade ${gradeConfig.selectedGrades[0]} (${grade1Count} essential lessons) and Grade ${gradeConfig.selectedGrades[1]} (${grade2Count} essential lessons), then strategically interweaving them into a ${finalWeeks}-week progression.

The AI employed "foundational-first" interweaving, beginning with core Grade ${gradeConfig.selectedGrades[0]} concepts before introducing Grade ${gradeConfig.selectedGrades[1]} content. Each grade's curriculum was condensed using "Develop-only" session structures, focusing exclusively on gateway lessons and major work standards. This approach ensures students experience essential concepts from both grade levels while maintaining mathematical coherence and proper prerequisite relationships.

The condensation process eliminated review sessions, practice-only lessons, and redundant supporting standards, retaining only high-impact content that bridges between grade levels and prepares students for advanced mathematical thinking.`;
  }

  /**
   * Generate assessment plan for dual-grade curriculum
   */
  private generateDualGradeAssessmentPlan(totalWeeks: number): any {
    return {
      summativeAssessments: [
        {
          week: Math.ceil(totalWeeks * 0.25),
          type: "Unit Assessment",
          description: "First quarter assessment combining early concepts from both grades"
        },
        {
          week: Math.ceil(totalWeeks * 0.5),
          type: "Midterm Assessment", 
          description: "Comprehensive assessment of foundational and intermediate concepts"
        },
        {
          week: Math.ceil(totalWeeks * 0.75),
          type: "Unit Assessment",
          description: "Third quarter assessment focusing on advanced concept integration"
        },
        {
          week: totalWeeks - 1,
          type: "Final Assessment",
          description: "Comprehensive final demonstrating mastery of dual-grade content"
        }
      ],
      formativeAssessments: [
        "Weekly exit tickets",
        "Bi-weekly concept checks", 
        "Monthly progress monitoring"
      ]
    };
  }

  /**
   * Get curriculum data for a specific grade - Updated for better path resolution
   */
  private getCurriculumData(grade: string): string {
    try {
      // First try to load from files
      let curriculumPath: string;
      
      if (grade === '6') {
        // Grade 6 curriculum not available yet
        return `Grade ${grade} curriculum data - focus on essential standards and high-impact lessons.`;
      } else if (grade === '7') {
        curriculumPath = path.resolve(process.cwd(), 'GRADE7_COMPLETE_CURRICULUM_STRUCTURE.json');
      } else if (grade === '8') {
        curriculumPath = path.resolve(process.cwd(), 'GRADE8_COMPLETE_CURRICULUM_STRUCTURE.json');
      } else if (grade === '9') {
        curriculumPath = path.resolve(process.cwd(), 'ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE.json');
      } else {
        return `Grade ${grade} curriculum data - focus on essential standards and high-impact lessons.`;
      }

      console.log(`📚 [Curriculum] Attempting to load: ${curriculumPath}`);
      console.log(`📚 [Curriculum] process.cwd(): ${process.cwd()}`);
      console.log(`📚 [Curriculum] __dirname: ${__dirname}`);

      if (fs.existsSync(curriculumPath)) {
        const curriculumData = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));
        
        // Format the curriculum data for the AI prompt with actual textbook information
        let formattedData = `**${curriculumData.title} (${curriculumData.curriculum_publisher})**\n`;
        formattedData += `Total Pages: ${curriculumData.total_pages} | Total Lessons: ${curriculumData.total_lessons}\n\n`;
        
        const bookName = grade === '9' ? 'Algebra 1 Book' : `Grade ${grade} Book`;
        
        if (curriculumData.volumes) {
          Object.values(curriculumData.volumes).forEach((volume: any) => {
            formattedData += `${volume.volume_name}:\n`;
            volume.units.forEach((unit: any) => {
              formattedData += `  Unit ${unit.unit_number}: ${unit.title}\n`;
              if (unit.lessons) {
                unit.lessons.forEach((lesson: any) => {
                  formattedData += `    Lesson ${lesson.lesson_number}: ${lesson.title} (${bookName}, Page ${lesson.start_page})\n`;
                });
              }
            });
            formattedData += `\n`;
          });
        }
        
        formattedData += `\n**CRITICAL INSTRUCTION:** You MUST use the exact lesson titles and page numbers shown above. `;
        formattedData += `Example format: "Lesson 1: Understand Rigid Transformations and Their Properties (${bookName}, Page 15)"\n`;
        formattedData += `Do NOT make up page numbers. Use ONLY the page numbers provided in this curriculum structure.\n`;
        formattedData += `ALWAYS specify which textbook: "Grade 8 Book" or "Algebra 1 Book"`;
        
        console.log(`📚 [Curriculum] Successfully loaded Grade ${grade} curriculum data (${formattedData.length} characters)`);
        return formattedData;
      } else {
        console.warn(`📚 [Curriculum] File not found: ${curriculumPath}`);
        
        // Fallback to hardcoded curriculum data
        if (grade === '8') {
          console.log(`📚 [Curriculum] Using hardcoded Grade 8 curriculum data`);
          return `**Ready Classroom Mathematics Grade 8 (Curriculum Associates)**
Total Pages: 1008 | Total Lessons: 32

Volume 1:
  Unit 1: Geometric Figures: Rigid Transformations and Congruence
    Lesson 1: Understand Rigid Transformations and Their Properties (Grade 8 Book, Page 15)
    Lesson 2: Work with Single Rigid Transformations in the Coordinate Plane (Grade 8 Book, Page 28)
    Lesson 3: Work with Sequences of Transformations and Congruence (Grade 8 Book, Page 55)
    Lesson 4: Understand Similarity in Terms of Transformations (Grade 8 Book, Page 69)

  Unit 2: Geometric Figures: Dilations, Similarity, and Introducing Slope
    Lesson 5: Understand Similarity in Terms of Transformations (Grade 8 Book, Page 97)
    Lesson 6: Understand and Apply the Pythagorean Theorem (Grade 8 Book, Page 111)
    Lesson 7: Find Volume of Cylinders, Cones, and Spheres (Grade 8 Book, Page 125)
    Lesson 8: Solve Problems Involving Angle Relationships (Grade 8 Book, Page 139)

Volume 2:
  Unit 3: Linear Relationships: Expressions and Equations
    Lesson 9: Understand Properties of Integer Exponents (Grade 8 Book, Page 153)
    Lesson 10: Use Powers of 10 to Estimate Quantities (Grade 8 Book, Page 167)
    Lesson 11: Understand Scientific Notation (Grade 8 Book, Page 181)
    Lesson 12: Operate with Numbers in Scientific Notation (Grade 8 Book, Page 195)

  Unit 4: Linear Relationships: Functions
    Lesson 13: Understand Proportional Relationships (Grade 8 Book, Page 209)
    Lesson 14: Understand Linear Relationships (Grade 8 Book, Page 223)
    Lesson 15: More Linear Relationships (Grade 8 Book, Page 237)
    Lesson 16: Construct Functions to Model Linear Relationships (Grade 8 Book, Page 251)

**CRITICAL INSTRUCTION:** You MUST use the exact lesson titles and page numbers shown above. 
Example format: "Lesson 1: Understand Rigid Transformations and Their Properties (Grade 8 Book, Page 15)"
Do NOT make up page numbers. Use ONLY the page numbers provided in this curriculum structure.
ALWAYS specify which textbook: "Grade 8 Book" or "Algebra 1 Book"`;
        } else if (grade === '9') {
          console.log(`📚 [Curriculum] Using hardcoded Algebra 1 curriculum data`);
          return `**Ready Classroom Mathematics Algebra 1 (Curriculum Associates)**
Total Pages: 1354 | Total Lessons: 28

Volume 1:
  Unit 1: Expressions, Equations, and Inequalities
    Lesson 1: Represent Quantities and Relationships (Algebra 1 Book, Page 13)
    Lesson 2: Reason About Solving Equations (Algebra 1 Book, Page 26)
    Lesson 3: Linear Equations in Two Variables (Algebra 1 Book, Page 158)
    Lesson 4: Systems of Linear Equations in Two Variables (Algebra 1 Book, Page 172)

  Unit 2: Linear Functions
    Lesson 5: Understand Functions (Algebra 1 Book, Page 39)
    Lesson 6: More About Functions (Algebra 1 Book, Page 53)
    Lesson 7: Linear Functions (Algebra 1 Book, Page 67)
    Lesson 8: Analyze Linear Functions (Algebra 1 Book, Page 81)

Volume 2:
  Unit 3: Systems of Linear Equations and Inequalities
    Lesson 9: Systems of Linear Equations in Two Variables (Algebra 1 Book, Page 186)
    Lesson 10: Solve Problems with Systems of Linear Equations (Algebra 1 Book, Page 200)
    Lesson 11: Linear Inequalities in Two Variables (Algebra 1 Book, Page 214)
    Lesson 12: Systems of Linear Inequalities (Algebra 1 Book, Page 228)

  Unit 4: Exponents and Exponential Functions
    Lesson 13: Understand Rational Exponents and Radicals (Algebra 1 Book, Page 242)
    Lesson 14: Understand Exponential Functions (Algebra 1 Book, Page 256)
    Lesson 15: Compare Linear and Exponential Functions (Algebra 1 Book, Page 270)
    Lesson 16: Analyze Exponential Functions (Algebra 1 Book, Page 284)

**CRITICAL INSTRUCTION:** You MUST use the exact lesson titles and page numbers shown above. 
Example format: "Lesson 1: Represent Quantities and Relationships (Algebra 1 Book, Page 13)"
Do NOT make up page numbers. Use ONLY the page numbers provided in this curriculum structure.
ALWAYS specify which textbook: "Grade 8 Book" or "Algebra 1 Book"`;
        }
        
        // Try alternative paths
        const altPath1 = path.resolve(process.cwd(), 'MathCurriculumA', `${grade === '9' ? 'ALGEBRA1' : `GRADE${grade}`}_COMPLETE_CURRICULUM_STRUCTURE.json`);
        const altPath2 = path.resolve(__dirname, '../..', `${grade === '9' ? 'ALGEBRA1' : `GRADE${grade}`}_COMPLETE_CURRICULUM_STRUCTURE.json`);
        
        console.log(`📚 [Curriculum] Trying alternative path 1: ${altPath1}`);
        if (fs.existsSync(altPath1)) {
          const curriculumData = JSON.parse(fs.readFileSync(altPath1, 'utf8'));
          console.log(`📚 [Curriculum] Found curriculum at alternative path 1`);
          // Same formatting logic as above...
          let formattedData = `**${curriculumData.title} (${curriculumData.curriculum_publisher})**\n`;
          formattedData += `Total Pages: ${curriculumData.total_pages} | Total Lessons: ${curriculumData.total_lessons}\n\n`;
          
          if (curriculumData.volumes) {
            Object.values(curriculumData.volumes).forEach((volume: any) => {
              formattedData += `${volume.volume_name}:\n`;
              volume.units.forEach((unit: any) => {
                formattedData += `  Unit ${unit.unit_number}: ${unit.title}\n`;
                if (unit.lessons) {
                  unit.lessons.forEach((lesson: any) => {
                    formattedData += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
                  });
                }
              });
              formattedData += `\n`;
            });
          }
          
          formattedData += `\n**CRITICAL INSTRUCTION:** You MUST use the exact lesson titles and page numbers shown above. `;
          formattedData += `Example format: "Lesson 1: Understand Rigid Transformations and Their Properties (Page 15)"\n`;
          formattedData += `Do NOT make up page numbers. Use ONLY the page numbers provided in this curriculum structure.`;
          
          return formattedData;
        }
        
        console.log(`📚 [Curriculum] Trying alternative path 2: ${altPath2}`);
        if (fs.existsSync(altPath2)) {
          const curriculumData = JSON.parse(fs.readFileSync(altPath2, 'utf8'));
          console.log(`📚 [Curriculum] Found curriculum at alternative path 2`);
          // Same formatting logic...
          let formattedData = `**${curriculumData.title} (${curriculumData.curriculum_publisher})**\n`;
          formattedData += `Total Pages: ${curriculumData.total_pages} | Total Lessons: ${curriculumData.total_lessons}\n\n`;
          
          if (curriculumData.volumes) {
            Object.values(curriculumData.volumes).forEach((volume: any) => {
              formattedData += `${volume.volume_name}:\n`;
              volume.units.forEach((unit: any) => {
                formattedData += `  Unit ${unit.unit_number}: ${unit.title}\n`;
                if (unit.lessons) {
                  unit.lessons.forEach((lesson: any) => {
                    formattedData += `    Lesson ${lesson.lesson_number}: ${lesson.title} (Page ${lesson.start_page})\n`;
                  });
                }
              });
              formattedData += `\n`;
            });
          }
          
          formattedData += `\n**CRITICAL INSTRUCTION:** You MUST use the exact lesson titles and page numbers shown above. `;
          formattedData += `Example format: "Lesson 1: Understand Rigid Transformations and Their Properties (Page 15)"\n`;
          formattedData += `Do NOT make up page numbers. Use ONLY the page numbers provided in this curriculum structure.`;
          
          return formattedData;
        }
        
        return `Grade ${grade} curriculum data - focus on essential standards and high-impact lessons.`;
      }
    } catch (error) {
      console.error(`📚 [Curriculum] Error loading Grade ${grade} data:`, error);
      return `Grade ${grade} curriculum data - focus on essential standards and high-impact lessons.`;
    }
  }

  private generateGradeIndicators(grades: string[]): string {
    const indicators = [];
    
    if (grades.includes('6')) indicators.push('G6');
    if (grades.includes('7')) indicators.push('G7');
    if (grades.includes('8')) indicators.push('G8');
    if (grades.includes('9')) indicators.push('A1 (Algebra 1)');
    
    return indicators.join(', ');
  }
}
