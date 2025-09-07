import OpenAI from 'openai';
import { AICurriculumContextService, CurriculumContext, PacingRecommendation } from './ai-curriculum-context';
import { dynamicScopeSequenceService, DynamicPacingConfig } from './dynamic-scope-sequence';

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

  async generatePacingGuide(request: PacingGuideRequest): Promise<PacingGuideResponse> {
    console.group('🧠 [AI Service] Generating Pacing Guide');
    console.log('📝 [AI Service] Request received:', JSON.stringify(request, null, 2));
    
    try {
      // Check if this is a request for detailed lesson-by-lesson generation
      const isDetailedRequest = request.priorities?.includes('Detailed lesson-by-lesson guide (AI-generated)') || 
                               request.priorities?.includes('detailed-lesson-guide') || 
                               request.studentPopulation?.toLowerCase().includes('accelerated') ||
                               request.gradeCombination?.pathwayType === 'accelerated';
      
      if (isDetailedRequest) {
        console.log('🎯 [AI Service] Detected detailed lesson guide request');
        return await this.generateDetailedLessonGuide(request);
      }
      
      // Standard pacing guide generation (existing logic)
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
      // Import the accelerated pathway data
      const { ACCELERATED_PATHWAY } = await import('./accelerated-pathway');
      console.log('📖 [AI Service] Loaded accelerated pathway data, unit count:', ACCELERATED_PATHWAY.length);
      
      // Flatten the pathway to get all lessons
      const allLessons = ACCELERATED_PATHWAY.flatMap(unit => unit.lessons);
      console.log('📊 [AI Service] Total lessons in pathway:', allLessons.length);
      
      // Determine effective grade configuration
      const gradeConfig = this.parseGradeConfiguration(request);
      console.log('📊 [AI Service] Grade config:', gradeConfig);
      
      // Build comprehensive curriculum context
      const contexts = await Promise.all(
        gradeConfig.selectedGrades.map(grade => 
          this.curriculumService.buildCurriculumContext(grade)
        )
      );
      const mergedContext = this.mergeCurriculumContexts(contexts, gradeConfig);
      
      // Create enhanced prompt for detailed analysis
      const detailedPrompt = await this.buildDetailedLessonPrompt(request, allLessons, mergedContext);
      console.log('📝 [AI Service] Built detailed prompt, length:', detailedPrompt.length);
      
      // Call OpenAI with GPT-5 for comprehensive analysis
      console.log('🤖 [AI Service] Calling OpenAI API for detailed analysis...');
      let completion;
      try {
        completion = await this.openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            {
              role: "system",
              content: "You are an expert mathematics curriculum specialist and instructional designer with deep expertise in accelerated pathways, Grade 7-8 combined sequences, and Algebra I preparation. You excel at creating detailed lesson-by-lesson guides that analyze curriculum choices against scope and sequence, standards alignment, and pedagogical progression. You provide comprehensive, actionable lesson plans with all pertinent information for implementation."
            },
            {
              role: "user", 
              content: detailedPrompt
            }
          ],
          max_completion_tokens: 6000   // More tokens for detailed response
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
      
      console.log('📨 [AI Service] Received detailed response, length:', aiResponse.length);
      
      // Parse the detailed response
      const detailedGuide = await this.parseDetailedLessonResponse(aiResponse, request, allLessons);
      
      console.log('✅ [AI Service] Detailed lesson guide generated successfully');
      console.groupEnd();
      
      return {
        success: true,
        detailedLessonGuide: detailedGuide
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
          model: "gpt-5",
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
          max_completion_tokens: 4000
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
    try {
      console.log('🔍 AI Response length:', aiResponse.length);
      console.log('📝 AI Response preview:', aiResponse.substring(0, 500) + '...');
      
      // Try multiple JSON extraction methods
      let parsedResponse: any = null;
      
      // Method 1: Look for JSON blocks wrapped in ```json
      const jsonBlockMatch = aiResponse.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonBlockMatch) {
        console.log('✅ Found JSON block format');
        parsedResponse = JSON.parse(jsonBlockMatch[1]);
      } else {
        // Method 2: Look for any JSON object
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('✅ Found JSON object format');
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          // Method 3: Try parsing the entire response
          try {
            console.log('🔄 Attempting to parse entire response as JSON');
            parsedResponse = JSON.parse(aiResponse);
          } catch (e) {
            console.error('❌ Failed to parse AI response as JSON:', e);
            throw new Error('No valid JSON found in AI response. Response: ' + aiResponse.substring(0, 200));
          }
        }
      }
      
      console.log('📊 Parsed response structure:', Object.keys(parsedResponse || {}));
      console.log('🔍 [AI Service] Parsed response content:', {
        hasOverview: !!parsedResponse.overview,
        hasWeeklySchedule: !!parsedResponse.weeklySchedule,
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
    
    if (isMultiGrade) {
      return `
Create a comprehensive ${gradeConfig.pathwayType} pacing guide for ${gradeConfig.selectedGrades.join(' + ')} mathematics curriculum.

GRADE COMBINATION ANALYSIS:
- Selected Grades: ${gradeConfig.selectedGrades.join(', ')}
- Pathway Type: ${gradeConfig.pathwayType}
- Emphasis: ${gradeConfig.emphasis}
- Total Unit Structures: ${context.unitStructure.length}
- Total Lessons: ${context.totalLessons}
- Total Instructional Days: ${context.totalInstructionalDays}

PEDAGOGICAL REQUIREMENTS:
1. Analyze prerequisite relationships between grade levels
2. Identify essential foundational concepts that cannot be skipped
3. Create logical progression that builds mathematical understanding
4. Balance content coverage with sufficient practice time
5. Consider cognitive load and developmental appropriateness

TIMEFRAME: ${request.timeframe}
STUDENT POPULATION: ${request.studentPopulation}
PRIORITIES: ${request.priorities ? request.priorities.join(', ') : 'Not specified'}

SCHEDULE CONSTRAINTS:
- ${request.scheduleConstraints?.daysPerWeek || 5} days per week
- ${request.scheduleConstraints?.minutesPerClass || 50} minutes per class

REQUIRED OUTPUT FORMAT:
Return your response as a valid JSON object with this exact structure:

\`\`\`json
{
  "overview": {
    "totalWeeks": 36,
    "lessonsPerWeek": 4,
    "description": "Brief description of the combined pathway approach"
  },
  "weeklySchedule": [
    {
      "week": 1,
      "unit": "Unit Name (e.g., 'Ratios and Proportional Relationships')",
      "lessons": ["Unit 1, Lesson 1", "Unit 1, Lesson 2", "Unit 1, Lesson 3", "Unit 1, Lesson 4"],
      "focusStandards": ["6.RP.A.1", "6.RP.A.2"],
      "learningObjectives": ["Understand ratio concepts", "Use ratio language to describe relationships"],
      "assessmentType": "formative",
      "differentiationNotes": "Optional notes for differentiation"
    }
  ],
  "assessmentPlan": {
    "formativeFrequency": "Weekly",
    "summativeSchedule": [
      {
        "week": 8,
        "type": "Unit Assessment",
        "standards": ["6.RP.A.1", "6.RP.A.2", "6.RP.A.3"],
        "description": "Assessment covering ratio and proportion concepts"
      }
    ],
    "diagnosticCheckpoints": [4, 12, 24],
    "portfolioComponents": ["Problem solving samples", "Reflection pieces"]
  },
  "differentiationStrategies": [
    {
      "studentGroup": "Students with Disabilities",
      "modifications": ["Extended time", "Visual supports"],
      "resources": ["Manipulatives", "Graphic organizers"],
      "assessmentAdjustments": ["Alternative formats", "Oral responses"]
    }
  ],
  "flexibilityOptions": [
    {
      "scenario": "If students struggle with ratios",
      "adjustments": ["Add concrete examples", "Use manipulatives"],
      "impactAnalysis": "May need 1-2 extra days"
    }
  ],
  "standardsAlignment": [
    {
      "standard": "6.RP.A.1 - Understand the concept of ratio",
      "weeksCovered": [1, 2],
      "connections": ["Links to fraction concepts", "Foundation for proportions"]
    }
  ]
}
\`\`\`

Create at least 20 weeks of detailed weekly schedule covering the essential concepts from both grades with proper prerequisite sequencing.

CRITICAL REQUIREMENTS:
- Focus on PACING and SEQUENCE, not detailed lesson content
- Each week should reference existing curriculum units and lessons (e.g., "Unit 3, Lesson 2")
- Lessons array should contain lesson REFERENCES, not detailed content
- Each week MUST have 2-4 learning objectives that describe WHAT students will learn
- Each week MUST have 2-3 focus standards using standard codes (e.g., "6.RP.A.1")
- Use "assessmentType": "formative", "summative", or "diagnostic" 
- Standards should use actual standard codes when possible
- This is a PACING GUIDE - focus on timing, sequence, and organization

PACING REQUIREMENTS:
- Generate exactly ${this.calculateWeeks(request.timeframe)} weeks
- Sequence topics for optimal learning progression
- Provide realistic timeline estimates
- Include differentiation strategies
- Identify potential acceleration opportunities
- Suggest assessment checkpoints

ABSOLUTELY CRITICAL: Your JSON response must contain a "weeklySchedule" array with actual lesson content. Empty arrays will cause system failure.

Return the response in JSON format with the same structure as single-grade pacing guides.
      `;
    }

    // Fallback to original prompt for single grades
    return this.buildDetailedPrompt(context, request);
  }

  private async buildDetailedLessonPrompt(request: PacingGuideRequest, acceleratedPathway: any[], context: CurriculumContext): Promise<string> {
    const choicesAnalysis = {
      gradeLevel: request.gradeLevel,
      gradeCombination: request.gradeCombination,
      timeframe: request.timeframe,
      studentPopulation: request.studentPopulation,
      priorities: request.priorities,
      scheduleConstraints: request.scheduleConstraints,
      differentiationNeeds: request.differentiationNeeds
    };

    // Get dynamic scope and sequence data for the selected grades
    const grades = request.gradeCombination?.selectedGrades || [request.gradeLevel];
    const scopeDataPromises = grades.map(grade => dynamicScopeSequenceService.getScopeSequenceForGrade(grade));
    const scopeData = await Promise.all(scopeDataPromises);
    
    // Get dynamic pacing configurations
    const pacingConfigPromises = grades.map(grade => dynamicScopeSequenceService.getDynamicPacingConfig(grade));
    const pacingConfigs = await Promise.all(pacingConfigPromises);
    
    // Get accelerated pathway configurations if applicable
    const acceleratedConfigs = await dynamicScopeSequenceService.getAcceleratedPathwayConfigs();
    
    const relevantPathways = acceleratedConfigs.filter(config => 
      grades.every(grade => config.grades.includes(grade))
    );

    return `You are tasked with creating a comprehensive lesson-by-lesson guide for an accelerated mathematics pathway. This is a sophisticated analysis that requires you to examine all user choices, compare them to the appropriate scope and sequence, analyze standards coverage, and generate detailed lesson plans.

## USER CHOICES ANALYSIS
${JSON.stringify(choicesAnalysis, null, 2)}

## DYNAMIC SCOPE & SEQUENCE DATA
The following scope and sequence data is generated dynamically from the actual curriculum structure:

${scopeData.map(scope => `
### ${scope.displayName} (Grade ${scope.grade})
- **Total Lessons**: ${scope.totalLessons}
- **Total Units**: ${scope.totalUnits}
- **Estimated Days**: ${scope.estimatedDays}
- **Documents Available**: ${scope.documents.map(doc => `${doc.title} (${doc.lessons} lessons)`).join(', ')}

**Unit Breakdown**:
${scope.units.map(unit => `
  ${unit.unitNumber}. ${unit.unitTitle}
     - Lessons: ${unit.lessonCount}
     - Estimated Days: ${unit.estimatedDays}
     - Key Topics: ${unit.topics.slice(0, 3).join(', ')}${unit.topics.length > 3 ? '...' : ''}
`).join('')}
`).join('\n')}

## DYNAMIC PACING CONFIGURATIONS
${pacingConfigs.map(config => `
### Grade ${config.grade} Pacing Options
- **Total Lessons**: ${config.totalLessons}
- **Total Sessions**: ${config.totalSessions}
- **Average Sessions per Lesson**: ${config.averageSessionsPerLesson}
- **Estimated Days**: ${config.estimatedDays}
- **Pacing Options**:
  - Standard: ${config.pacing.standard} lessons/week
  - Accelerated: ${config.pacing.accelerated} lessons/week  
  - Intensive: ${config.pacing.intensive} lessons/week
`).join('\n')}

## AVAILABLE ACCELERATED PATHWAYS
${relevantPathways.length > 0 ? relevantPathways.map(pathway => `
### ${pathway.pathway}
- **Grades**: ${pathway.grades.join(' + ')}
- **Total Lessons**: ${pathway.totalLessons}
- **Estimated Days**: ${pathway.estimatedDays}
- **Description**: ${pathway.description}
`).join('\n') : 'No specific accelerated pathways found for this grade combination.'}

## ACCELERATED PATHWAY CURRICULUM DATA
The following is the complete accelerated pathway curriculum with ${acceleratedPathway.length} lessons:

${acceleratedPathway.slice(0, 10).map(lesson => `
**Lesson ${lesson.lessonNumber}: ${lesson.title}**
- Grade: ${lesson.grade}
- Unit: ${lesson.unit}
- Sessions: ${lesson.sessions}
- Major Work: ${lesson.majorWork ? 'Yes' : 'No'}
- Original Code: ${lesson.originalCode}
`).join('\n')}
${acceleratedPathway.length > 10 ? `\n... and ${acceleratedPathway.length - 10} more lessons` : ''}

## CURRICULUM CONTEXT
Total Lessons Available: ${context.totalLessons}
Major Standards Focus: ${context.majorStandards.map(s => Array.isArray(s.standards) ? s.standards.join(', ') : s.standards).join('; ')}
Available Standards: ${context.availableStandards.map(s => Array.isArray(s.standards) ? s.standards.join(', ') : s.standards).join('; ')}

Unit Structure:
${context.unitStructure.map(unit => `
- ${unit.unitTitle}: ${unit.lessonCount} lessons
  Standards: ${Array.isArray(unit.standards) ? unit.standards.join(', ') : (unit.standards || 'None')}
  Focus Distribution: Major(${unit.focusDistribution?.major || 0}%), Supporting(${unit.focusDistribution?.supporting || 0}%), Additional(${unit.focusDistribution?.additional || 0}%)
`).join('')}

## ANALYSIS REQUIREMENTS

1. **Analyze User Choices**: Examine the grade combination, timeframe, student population, and priorities to understand the specific pathway needs.

2. **Dynamic Scope and Sequence Validation**: Compare the user's choices against the dynamically generated scope and sequence data to ensure pedagogical soundness and appropriate progression.

3. **Standards Coverage Analysis**: Using the dynamic curriculum data, analyze which standards are covered, identify any gaps, and ensure proper prerequisite relationships.

4. **Detailed Lesson Progression**: Create a lesson-by-lesson breakdown that follows the dynamic pacing recommendations and scope/sequence structure.

5. **Assessment Strategy**: Design assessment approaches that align with the dynamic scope and sequence timing and natural unit boundaries.

## REQUIRED OUTPUT FORMAT

Return a comprehensive JSON object with this exact structure:

\`\`\`json
{
  "pathway": {
    "name": "Grade 8-9 Accelerated Mathematics Pathway",
    "description": "Detailed description of the accelerated pathway",
    "targetOutcome": "Learning goals and outcomes",
    "duration": "${request.timeframe || 'Academic Year'}"
  },
  "analysisResults": {
    "choicesAnalyzed": {
      "alignment": "How user choices align with curriculum",
      "feasibility": "Assessment of timing and scope feasibility", 
      "recommendations": "Specific recommendations for optimization"
    },
    "scopeAndSequenceMatch": "Analysis of how this pathway fits within scope and sequence",
    "standardsCoverage": {
      "standardsAddressed": ["List of standards covered"],
      "prerequisiteAlignment": "How prerequisites are met",
      "progressionLogic": "Explanation of learning progression",
      "gapAnalysis": ["Any identified gaps or concerns"]
    },
    "prerequisiteCheck": {
      "prerequisitesRequired": ["Required prior knowledge"],
      "prerequisitesMet": ["Prerequisites satisfied by pathway"],
      "potentialGaps": ["Areas that may need reinforcement"],
      "interventionSuggestions": ["Suggested interventions for gaps"]
    }
  },
  "lessonByLessonBreakdown": [
    {
      "sequenceNumber": 1,
      "gradeLevel": 8,
      "unitTitle": "Unit Name",
      "lessonTitle": "Specific Lesson Title",
      "sessions": 3,
      "learningObjectives": ["Objective 1", "Objective 2"],
      "standardsAddressed": ["Standard codes"],
      "keyMathematicalPractices": ["Practice 1", "Practice 2"],
      "assessmentOpportunities": ["Quick check", "Exit ticket"],
      "differentiationNotes": "Notes for different learners",
      "prerequisiteSkills": ["Required prior skills"],
      "vocabularyFocus": ["Key terms"],
      "connectionsToPriorLearning": "How this connects to previous lessons",
      "connectionsToFutureLearning": "How this prepares for future lessons"
    }
  ],
  "progressionMap": [
    {
      "stage": "Foundation Building",
      "weeks": [1, 2, 3, 4],
      "focus": "Essential prerequisite skills and concepts",
      "milestones": ["Milestone 1", "Milestone 2"],
      "assessmentPoints": ["Week 2 check", "Week 4 assessment"]
    }
  ],
  "assessmentStrategy": {
    "overallApproach": "Comprehensive assessment philosophy",
    "formativeStrategies": ["Daily strategies", "Weekly checks"],
    "summativeAssessments": [
      {
        "name": "Unit 1 Assessment",
        "timing": "End of Week 6",
        "standards": ["Standards assessed"],
        "format": "Traditional, Performance, Portfolio",
        "duration": "50 minutes",
        "purpose": "Measure unit mastery",
        "gradingCriteria": ["Accuracy", "Reasoning", "Communication"]
      }
    ],
    "diagnosticCheckpoints": [
      {
        "timing": "Week 1",
        "focus": "Prerequisite skills",
        "assessmentMethod": "Diagnostic pre-assessment",
        "interventionTriggers": ["Score below 70%"]
      }
    ],
    "portfolioElements": ["Portfolio components"],
    "masteryIndicators": ["Indicators of mastery"]
  },
  "teachingSupport": {
    "pedagogicalApproach": "Teaching philosophy and methods",
    "classroomManagement": ["Management strategies"],
    "parentCommunication": ["Communication strategies"],
    "professionalDevelopment": ["PD recommendations"],
    "resources": {
      "required": ["Essential resources"],
      "recommended": ["Helpful additions"],
      "digital": ["Technology tools"]
    }
  }
}
\`\`\`

Focus on creating a practical, implementable guide that teachers can use immediately. The lesson-by-lesson breakdown should include at least 20-30 lessons covering the essential pathway content with proper sequencing based on the dynamic scope and sequence data provided.

## ANALYSIS REQUIREMENTS

3. **Standards Coverage Analysis**: Map all lessons to standards and identify:
   - Major work vs. supporting/additional work
   - Cross-grade connections  
   - Algebra I readiness indicators
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
