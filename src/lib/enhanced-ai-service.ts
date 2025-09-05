import OpenAI from 'openai';
import { AICurriculumContextService, CurriculumContext, PacingRecommendation } from './ai-curriculum-context';

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
  recommendations?: PacingRecommendation[];
  error?: string;
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
    try {
      // Determine effective grade configuration
      const gradeConfig = this.parseGradeConfiguration(request);
      
      // Build comprehensive curriculum context for all selected grades
      const contexts = await Promise.all(
        gradeConfig.selectedGrades.map(grade => 
          this.curriculumService.buildCurriculumContext(grade)
        )
      );
      
      // Merge contexts and analyze cross-grade dependencies
      const mergedContext = this.mergeCurriculumContexts(contexts, gradeConfig);
      
      // Generate AI recommendations with advanced pathway logic
      const recommendations = await this.generateAdvancedRecommendations(gradeConfig, request);

      // Create sophisticated prompt for multi-grade analysis
      const prompt = this.buildAdvancedPrompt(mergedContext, gradeConfig, request);

      // Generate pacing guide with enhanced AI reasoning
      const completion = await this.openai.chat.completions.create({
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
        temperature: 0.7,
        max_tokens: 4000
      });

      // Parse the AI response into structured data
      const aiResponse = completion.choices[0]?.message?.content;
      if (!aiResponse) {
        throw new Error('No response from AI service');
      }

      const pacingGuide = await this.parseAIResponse(aiResponse, mergedContext, request);

      return {
        success: true,
        pacingGuide,
        recommendations
      };

    } catch (error) {
      console.error('Error generating pacing guide:', error);
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
      // Extract JSON from the AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);
      
      // Build the structured pacing guide
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

      return pacingGuide;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return a fallback pacing guide
      return this.generateFallbackPacingGuide(context, request);
    }
  }

  private generateFallbackPacingGuide(
    context: CurriculumContext, 
    request: PacingGuideRequest
  ): GeneratedPacingGuide {
    const totalWeeks = this.calculateWeeks(request.timeframe);
    const lessonsPerWeek = Math.ceil(context.totalLessons / totalWeeks);

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
PRIORITIES: ${request.priorities.join(', ')}

SCHEDULE CONSTRAINTS:
- ${request.scheduleConstraints?.daysPerWeek || 5} days per week
- ${request.scheduleConstraints?.minutesPerClass || 50} minutes per class

Please create a detailed pacing guide that:
- Maps prerequisite relationships across grades
- Sequences topics for optimal learning progression
- Provides realistic timeline estimates
- Includes differentiation strategies
- Identifies potential acceleration opportunities
- Suggests assessment checkpoints

Return the response in JSON format with the same structure as single-grade pacing guides.
      `;
    }

    // Fallback to original prompt for single grades
    return this.buildDetailedPrompt(context, request);
  }

  async disconnect() {
    await this.curriculumService.disconnect();
  }
}
