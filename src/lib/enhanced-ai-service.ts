import OpenAI from 'openai';
import { AICurriculumContextService, CurriculumContext, PacingRecommendation } from './ai-curriculum-context';
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
  priorities: string[];
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
  recommendations?: PacingRecommendation[];
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
  unit: string;
  grade: string;
  duration: {
    sessions: number;
    totalMinutes: number;
  };
  standards: {
    primary: string[];
    supporting: string[];
    mathematical_practices: string[];
  };
  learningObjectives: string[];
  keyVocabulary: string[];
  materials: string[];
  lessonStructure: LessonPhase[];
  differentiation: {
    supports: string[];
    extensions: string[];
    accommodations: string[];
  };
  assessment: {
    formative: string[];
    summative?: string;
    exitTicket: string;
  };
  homework: string;
  connectionToNext: string;
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

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.curriculumService = new AICurriculumContextService();
  }

  /**
   * Load actual curriculum structures from JSON files
   */
  private loadCurriculumData(grades: string[]): any {
    const curriculumData: any = {};
    
    try {
      for (const grade of grades) {
        if (grade === '8') {
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
      // Check if this is a request for detailed lesson-by-lesson generation
      const isDetailedRequest = request.priorities?.includes('Detailed lesson-by-lesson guide (AI-generated)') || 
                               request.priorities?.includes('detailed-lesson-guide') || 
                               request.studentPopulation?.toLowerCase().includes('accelerated') ||
                               request.gradeCombination?.pathwayType === 'accelerated';
      
      console.log('🎯 [Main Generator] Generation path analysis:', {
        isDetailedRequest,
        isMultiGrade: request.gradeCombination?.selectedGrades?.length > 1,
        totalWeeks: this.calculateWeeks(request.timeframe),
        selectedGrades: request.gradeCombination?.selectedGrades,
        pathwayType: request.gradeCombination?.pathwayType
      });
      
      if (isDetailedRequest) {
        console.log('🎯 [Main Generator] ➡️ Routing to DETAILED LESSON GUIDE generation');
        console.groupEnd();
        return await this.generateDetailedLessonGuide(request);
      }
      
      // Check if this is a multi-grade combination that needs chunked generation
      const isMultiGrade = request.gradeCombination?.selectedGrades?.length > 1;
      const totalWeeks = this.calculateWeeks(request.timeframe);
      
      if (isMultiGrade && totalWeeks >= 30) {
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
      console.log('🤖 [AI Service] Calling OpenAI API for detailed analysis...');
      let completion;
      try {
        completion = await this.openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a mathematics curriculum specialist. Create practical, implementable pacing guides efficiently. Focus on clear structure and essential information."
            },
            {
              role: "user", 
              content: detailedPrompt
            }
          ],
          max_completion_tokens: 16000,   // GPT-4o maximum limit for comprehensive responses
          temperature: 0.1               // Lower temperature for faster, more focused responses
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
        parsedResponse = JSON.parse(aiResponse);
        console.log('📊 [AI Service] Successfully parsed AI response');
      } catch (parseError) {
        console.error('❌ [AI Service] Failed to parse AI response as JSON:', parseError);
        console.log('🔍 [AI Service] Raw response preview:', aiResponse.substring(0, 500));
        throw new Error('AI returned invalid JSON format');
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
        max_completion_tokens: 12000,   // Reduced token limit for chunk stability
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
      const gradeConfig = this.determineGradeConfig(request);
      const mergedContext = await this.curriculumService.getMergedCurriculumContext(gradeConfig.selectedGrades);
      
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
          isChunked: true, 
          chunkNumber: 1, 
          totalChunks: 2, 
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
          isChunked: true, 
          chunkNumber: 2, 
          totalChunks: 2, 
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
          description: (chunk1Guide.overview.description || '').replace(/(Chunk \d+ of \d+)/g, '').trim() + ' (Complete 36-week curriculum)'
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
    if (curriculumData.grade8) {
      curriculumContext += `\n**GRADE 8 CURRICULUM (Ready Classroom Mathematics Grade 8):**\n`;
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
      curriculumContext += `\n**ALGEBRA 1 CURRICULUM (Ready Classroom Mathematics Algebra 1):**\n`;
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
    
    return `Create a comprehensive accelerated mathematics pathway for grades ${grades.join('+')} over ${request.timeframe}.

**CURRICULUM DATA TO USE:**${curriculumContext}

**CRITICAL REQUIREMENTS:**
- **USE ONLY THE EXACT UNIT AND LESSON TITLES** from the curriculum data above
- **SPECIFY THE TEXTBOOK SOURCE** (Grade 8 book vs Algebra 1 book) for each lesson
- **INCLUDE ACTUAL PAGE NUMBERS** from the curriculum data
- **MAP TO REAL UNIT STRUCTURES** from the Ready Classroom Mathematics series
- Student Population: ${request.studentPopulation}
- Schedule: ${request.scheduleConstraints?.daysPerWeek || 5} days/week, ${request.scheduleConstraints?.minutesPerClass || 50} min/class
- Total Available Lessons: ${lessonCount}
- Differentiation Needs: ${request.differentiationNeeds?.join(', ') || 'Standard'}
- Priorities: ${request.priorities?.join(', ') || 'Standards alignment'}

**CRITICAL: Generate a JSON response with this EXACT structure (field names must match exactly):**

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
      "unit": "EXACT unit title from curriculum data (e.g., 'Geometric Figures: Rigid Transformations and Congruence')",
      "unitNumber": 1,
      "pageNumber": "ACTUAL page number from curriculum data",
      "grade": "8" OR "9",
      "duration": { "sessions": 2, "totalMinutes": 100 },
      "standards": {
        "primary": ["8.NS.1", "8.NS.2"],
        "supporting": ["8.EE.1"],
        "mathematical_practices": ["MP1", "MP3", "MP6"]
      },
      "learningObjectives": ["Clear, measurable learning objectives based on lesson content"],
      "keyVocabulary": ["Key mathematical terms from the specific lesson"],
      "materials": ["Ready Classroom Mathematics textbook page references"],
      "lessonStructure": [
        {
          "phase": "Opening",
          "duration": 10,
          "activities": ["Warm-up activities based on lesson content"]
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
      "homework": "Homework assignment from textbook pages",
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
        pacingGuide,
        recommendations
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
      request.priorities
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
Please structure your response as a detailed JSON object with the following structure:
{
  "overview": {
    "totalWeeks": number,
    "lessonsPerWeek": number,
    "paceDescription": "string"
  },
  "weeklySchedule": [
    {
      "week": number,
      "unit": "string",
      "lessons": ["lesson1", "lesson2"],
      "focusStandards": ["standard1", "standard2"],
      "learningObjectives": ["objective1", "objective2"],
      "assessmentType": "formative|summative|diagnostic",
      "differentiationNotes": "string"
    }
  ],
  "assessmentPlan": {
    "formativeFrequency": "string",
    "summativeSchedule": [
      {
        "week": number,
        "type": "string",
        "standards": ["standard1"],
        "description": "string"
      }
    ],
    "diagnosticCheckpoints": [week_numbers],
    "portfolioComponents": ["component1", "component2"]
  },
  "differentiationStrategies": [
    {
      "studentGroup": "string",
      "modifications": ["mod1", "mod2"],
      "resources": ["resource1", "resource2"],
      "assessmentAdjustments": ["adj1", "adj2"]
    }
  ],
  "flexibilityOptions": [
    {
      "scenario": "string",
      "adjustments": ["adj1", "adj2"],
      "impactAnalysis": "string"
    }
  ],
  "standardsAlignment": [
    {
      "standard": "string",
      "weeksCovered": [week_numbers],
      "depth": "introduction|development|mastery",
      "connections": ["connection1", "connection2"]
    }
  ]
}

Ensure the pacing guide is realistic, pedagogically sound, and addresses the specific needs of the ${request.studentPopulation} student population.`;
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
        weeklyScheduleLength: parsedResponse.weeklySchedule?.length || 0,
        weeklyScheduleSample: parsedResponse.weeklySchedule?.slice(0, 2) || [],
        hasAssessmentPlan: !!parsedResponse.assessmentPlan,
        hasDifferentiationStrategies: !!parsedResponse.differentiationStrategies,
        differentiationCount: parsedResponse.differentiationStrategies?.length || 0
      });
      console.log('🔍 [AI Service] Detailed parsed response analysis:');
      
      if (parsedResponse.weeklySchedule) {
        console.log('  📅 Weekly Schedule:', {
          totalWeeks: parsedResponse.weeklySchedule.length,
          firstWeek: parsedResponse.weeklySchedule[0] || 'undefined',
          sampleWeekStructure: parsedResponse.weeklySchedule[0] ? Object.keys(parsedResponse.weeklySchedule[0]) : 'none'
        });
        
        if (parsedResponse.weeklySchedule[0]) {
          console.log('  📝 First week details:', {
            lessons: parsedResponse.weeklySchedule[0].lessons || 'undefined',
            lessonsCount: (parsedResponse.weeklySchedule[0].lessons || []).length,
            focusStandards: parsedResponse.weeklySchedule[0].focusStandards || 'undefined',
            learningObjectives: parsedResponse.weeklySchedule[0].learningObjectives || 'undefined'
          });
        }
      } else {
        console.error('❌ [AI Service] No weeklySchedule in parsed response!');
      }
      
      if (parsedResponse.overview) {
        console.log('  📋 Overview:', parsedResponse.overview);
      } else {
        console.error('❌ [AI Service] No overview in parsed response!');
      }
      console.log('🔍 [AI Service] Parsed response content analysis:');
      console.log('  Overview present:', !!parsedResponse.overview);
      console.log('  WeeklySchedule present:', !!parsedResponse.weeklySchedule);
      console.log('  WeeklySchedule type:', typeof parsedResponse.weeklySchedule);
      console.log('  WeeklySchedule length:', parsedResponse.weeklySchedule?.length || 'undefined');
      console.log('  WeeklySchedule sample:', JSON.stringify(parsedResponse.weeklySchedule?.slice(0, 2), null, 2));
      console.log('  AssessmentPlan present:', !!parsedResponse.assessmentPlan);
      console.log('  DifferentiationStrategies present:', !!parsedResponse.differentiationStrategies);
      
      // Build the structured pacing guide
      console.log('🏗️ [AI Service] Building structured pacing guide...');
      const pacingGuide: GeneratedPacingGuide = {
        overview: {
          gradeLevel: request.gradeLevel,
          timeframe: request.timeframe,
          totalWeeks: parsedResponse.overview?.totalWeeks || this.calculateWeeks(request.timeframe),
          lessonsPerWeek: parsedResponse.overview?.lessonsPerWeek || 4,
          totalLessons: context.totalLessons
        },
        weeklySchedule: parsedResponse.weeklySchedule || [],
        assessmentPlan: parsedResponse.assessmentPlan || {
          formativeFrequency: 'Weekly',
          summativeSchedule: [],
          diagnosticCheckpoints: [],
          portfolioComponents: []
        },
        differentiationStrategies: parsedResponse.differentiationStrategies || [],
        flexibilityOptions: parsedResponse.flexibilityOptions || [],
        standardsAlignment: parsedResponse.standardsAlignment || []
      };
      
      console.log('📋 [AI Service] Built pacing guide structure:');
      console.log('  Overview:', pacingGuide.overview);
      console.log('  Weekly schedule entries:', pacingGuide.weeklySchedule.length);
      console.log('  Assessment plan:', !!pacingGuide.assessmentPlan);
      console.log('  Differentiation strategies:', pacingGuide.differentiationStrategies.length);
      console.log('  Flexibility options:', pacingGuide.flexibilityOptions.length);
      console.log('  Standards alignment:', pacingGuide.standardsAlignment.length);
      
      return pacingGuide;
    } catch (error) {
      console.error('💥 [AI Service] Error parsing AI response:', error);
      console.log('🛟 [AI Service] Generating fallback pacing guide...');
      // Return a fallback pacing guide
      return this.generateFallbackPacingGuide(context, request);
    }
  }

  private generateFallbackPacingGuide(
    context: CurriculumContext, 
    request: PacingGuideRequest
  ): GeneratedPacingGuide {
    console.log('🔧 [AI Service] Generating fallback pacing guide...');
    const totalWeeks = this.calculateWeeks(request.timeframe);
    const lessonsPerWeek = Math.ceil(context.totalLessons / totalWeeks);
    
    console.log('📊 [AI Service] Fallback calculations:', {
      totalWeeks,
      lessonsPerWeek,
      totalLessons: context.totalLessons,
      unitCount: context.unitStructure.length
    });

    return {
      overview: {
        gradeLevel: request.gradeLevel,
        timeframe: request.timeframe,
        totalWeeks,
        lessonsPerWeek,
        totalLessons: context.totalLessons
      },
      weeklySchedule: context.unitStructure.map((unit, index) => ({
        week: index + 1,
        unit: unit.unitTitle,
        lessons: [`Lessons 1-${Math.min(lessonsPerWeek, unit.lessonCount)}`],
        focusStandards: unit.standards.slice(0, 3),
        learningObjectives: [`Master key concepts in ${unit.unitTitle}`],
        assessmentType: index % 3 === 2 ? 'summative' : 'formative' as const
      })),
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
      availableStandards: mergedStandards,
      majorStandards: mergedMajorStandards,
      supportingStandards: mergedSupportingStandards,
      additionalStandards: mergedAdditionalStandards,
      unitStructure: mergedUnitStructure,
      totalLessons: contexts.reduce((sum, ctx) => sum + ctx.totalLessons, 0),
      totalInstructionalDays: contexts.reduce((sum, ctx) => sum + ctx.totalInstructionalDays, 0)
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
      request.priorities
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
    const isChunked = request.chunkInfo?.isChunked || false;
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

**REQUIREMENTS:**
- Use exact unit/lesson titles from curriculum data above
- Include textbook source and page numbers  
- Create logical progression for ${weekRange}
- Focus on essential standards alignment

**JSON OUTPUT REQUIRED:**
Return ONLY valid JSON in this exact format:

\`\`\`json
{
  "overview": {
    "totalWeeks": ${isChunked ? `${request.chunkInfo?.totalWeeks || totalWeeks}` : totalWeeks},
    ${isChunked ? `"chunkInfo": {
      "chunkNumber": ${chunkNumber},
      "totalChunks": ${totalChunks},
      "weeksInThisChunk": ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks))},
      "isChunked": true
    },` : ''}
    "lessonsPerWeek": 4,
    "description": "Brief description${isChunked ? ` (Chunk ${chunkNumber} of ${totalChunks})` : ''}"
  },
  "weeklySchedule": [
${isChunked ? `    // Generate weeks ${(chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks) + 1} through ${Math.min(chunkNumber * Math.ceil(totalWeeks / totalChunks), totalWeeks)} ONLY` : '    // Generate all weeks 1 through ' + totalWeeks}
    {
      "week": ${isChunked ? (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks) + 1 : 1},
      "unit": "EXACT unit title from curriculum data",
      "textbookSource": "Grade 8 Ready Classroom Mathematics",
      "volume": "Volume 1",
      "unitNumber": 1,
      "lessons": [
        "Grade 8, Unit 1, Lesson 1: Exact lesson title (Page #)"
      ],
      "focusStandards": ["8.G.A.1"],
      "learningObjectives": ["Clear objective"],
      "assessmentType": "formative"
    }${isChunked ? `,
    // Continue for ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks)) - 1} more weeks in this chunk` : `,
    // Continue for all ${totalWeeks - 1} more weeks`}
  ],
  "assessmentPlan": {
    "formativeFrequency": "Weekly",
    "summativeSchedule": [],
    "diagnosticCheckpoints": [],
    "portfolioComponents": []
  },
  "differentiationStrategies": [],
  "flexibilityOptions": [],
  "standardsAlignment": []
}
\`\`\`

${isChunked ? `**GENERATE EXACTLY ${Math.min(Math.ceil(totalWeeks / totalChunks), totalWeeks - (chunkNumber - 1) * Math.ceil(totalWeeks / totalChunks))} WEEKS FOR CHUNK ${chunkNumber}**` : `**GENERATE ALL ${totalWeeks} WEEKS**`}

CRITICAL: Return ONLY the JSON object. No additional text before or after.
      `;
    }

    // Fallback to original prompt for single grades
    return this.buildDetailedPrompt(context, request);
  }

  private async buildDetailedLessonPrompt(request: PacingGuideRequest, acceleratedPathway: any[], context: CurriculumContext): Promise<string> {
    const grades = request.gradeCombination?.selectedGrades || [request.gradeLevel];
    
    console.log('🔍 [AI Service] Building detailed prompt with:', {
      gradesCount: grades.length,
      acceleratedPathwayLessons: acceleratedPathway.length,
      sampleLesson: acceleratedPathway[0]
    });
    
    const prompt = `Create a comprehensive accelerated mathematics pathway for grades ${grades.join('+')} over ${request.timeframe}.

**Requirements:**
- Student Population: ${request.studentPopulation}
- Schedule: ${request.scheduleConstraints?.daysPerWeek || 5} days/week, ${request.scheduleConstraints?.minutesPerClass || 50} min/class
- Total Available Lessons: ${acceleratedPathway.length}
- Differentiation Needs: ${request.differentiationNeeds?.join(', ') || 'Standard'}
- Priorities: ${request.priorities?.join(', ') || 'Standards alignment'}

**Sample Lesson Topics:**
${acceleratedPathway.slice(0, 8).map(lesson => `${lesson.lessonNumber}. ${lesson.title} (Grade ${lesson.grade})`).join('\n')}

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

CRITICAL: Generate comprehensive content for 25-35 lessons covering the full ${request.timeframe}. Include detailed lesson breakdowns with proper standards alignment, differentiation strategies, and practical implementation guidance that teachers can use immediately.`;

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
}
