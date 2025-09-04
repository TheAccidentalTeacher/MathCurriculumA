import { StandardsService, StandardsMapping } from './standards-service';

export interface CurriculumContext {
  gradeLevel: string;
  availableStandards: StandardsMapping[];
  majorStandards: StandardsMapping[];
  supportingStandards: StandardsMapping[];
  additionalStandards: StandardsMapping[];
  totalLessons: number;
  totalInstructionalDays: number;
  unitStructure: UnitStructure[];
}

export interface UnitStructure {
  unitTitle: string;
  lessonCount: number;
  instructionalDays: number;
  focusDistribution: {
    major: number;
    supporting: number;
    additional: number;
  };
  standards: string[];
}

export interface PacingRecommendation {
  timeframe: string;
  lessonsPerWeek: number;
  focusAreas: string[];
  sequencing: string;
  assessmentSchedule: string;
  differentiation: string;
}

export class AICurriculumContextService {
  private standardsService: StandardsService;

  constructor() {
    this.standardsService = new StandardsService();
  }

  async buildCurriculumContext(gradeLevel: string): Promise<CurriculumContext> {
    try {
      const [
        availableStandards,
        majorStandards,
        supportingStandards,
        additionalStandards
      ] = await Promise.all([
        this.standardsService.getStandardsForGrade(gradeLevel),
        this.standardsService.getStandardsByFocus(gradeLevel, 'major'),
        this.standardsService.getStandardsByFocus(gradeLevel, 'supporting'),
        this.standardsService.getStandardsByFocus(gradeLevel, 'additional')
      ]);

      const unitStructure = this.analyzeUnitStructure(availableStandards);
      const totalInstructionalDays = availableStandards
        .reduce((sum, standard) => sum + (standard.instructionalDays || 0), 0);

      return {
        gradeLevel,
        availableStandards,
        majorStandards,
        supportingStandards,
        additionalStandards,
        totalLessons: availableStandards.length,
        totalInstructionalDays,
        unitStructure
      };
    } catch (error) {
      console.error('Error building curriculum context:', error);
      throw new Error('Failed to build curriculum context');
    }
  }

  private analyzeUnitStructure(standards: StandardsMapping[]): UnitStructure[] {
    const unitMap = new Map<string, StandardsMapping[]>();
    
    // Group standards by unit
    standards.forEach(standard => {
      if (!unitMap.has(standard.unit)) {
        unitMap.set(standard.unit, []);
      }
      unitMap.get(standard.unit)!.push(standard);
    });

    // Build unit structure analysis
    return Array.from(unitMap.entries()).map(([unitTitle, unitStandards]) => {
      const focusDistribution = {
        major: unitStandards.filter(s => s.focusType === 'major').length,
        supporting: unitStandards.filter(s => s.focusType === 'supporting').length,
        additional: unitStandards.filter(s => s.focusType === 'additional').length
      };

      const allStandards = unitStandards
        .flatMap(s => s.standards)
        .filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

      const instructionalDays = unitStandards
        .reduce((sum, s) => sum + (s.instructionalDays || 0), 0);

      return {
        unitTitle,
        lessonCount: unitStandards.length,
        instructionalDays,
        focusDistribution,
        standards: allStandards
      };
    });
  }

  generatePacingPrompt(
    context: CurriculumContext,
    timeframe: string,
    studentPopulation: string,
    priorities: string[]
  ): string {
    const priorityText = priorities.length > 0 ? priorities.join(', ') : 'balanced coverage';
    
    return `
You are an expert mathematics curriculum specialist creating a pacing guide for Grade ${context.gradeLevel} mathematics.

CURRICULUM CONTEXT:
- Total Lessons: ${context.totalLessons}
- Total Instructional Days: ${context.totalInstructionalDays}
- Major Standards Focus: ${context.majorStandards.length} lessons
- Supporting Standards: ${context.supportingStandards.length} lessons
- Additional Standards: ${context.additionalStandards.length} lessons

UNIT STRUCTURE:
${context.unitStructure.map(unit => 
  `- ${unit.unitTitle}: ${unit.lessonCount} lessons, ${unit.instructionalDays} days
    Focus: ${unit.focusDistribution.major} major, ${unit.focusDistribution.supporting} supporting, ${unit.focusDistribution.additional} additional`
).join('\n')}

PACING REQUIREMENTS:
- Timeframe: ${timeframe}
- Student Population: ${studentPopulation}
- Priority Areas: ${priorityText}

Please create a comprehensive pacing guide that includes:
1. Weekly lesson distribution
2. Unit sequencing with rationale
3. Assessment placement recommendations
4. Differentiation strategies for the specified student population
5. Flexibility recommendations for various calendar scenarios
6. Standards alignment verification

Focus on creating a realistic, teacher-friendly guide that balances curriculum coverage with deep learning opportunities.
    `.trim();
  }

  async generatePacingRecommendations(
    gradeLevel: string,
    timeframe: string,
    studentPopulation: string,
    priorities: string[]
  ): Promise<PacingRecommendation[]> {
    const context = await this.buildCurriculumContext(gradeLevel);
    
    // Calculate basic pacing metrics
    const weeksAvailable = this.parseTimeframeToWeeks(timeframe);
    const lessonsPerWeek = Math.ceil(context.totalLessons / weeksAvailable);
    
    // Generate recommendations based on student population
    const recommendations: PacingRecommendation[] = [];
    
    if (studentPopulation.toLowerCase().includes('accelerated') || 
        studentPopulation.toLowerCase().includes('advanced')) {
      recommendations.push({
        timeframe: `${weeksAvailable} weeks (accelerated)`,
        lessonsPerWeek: lessonsPerWeek + 1,
        focusAreas: ['Major standards with extension activities', 'Problem-solving emphasis'],
        sequencing: 'Fast-paced with enrichment opportunities',
        assessmentSchedule: 'Frequent formative, strategic summative',
        differentiation: 'Extension activities, advanced problem sets'
      });
    } else if (studentPopulation.toLowerCase().includes('intervention') ||
               studentPopulation.toLowerCase().includes('support')) {
      recommendations.push({
        timeframe: `${weeksAvailable + 4} weeks (with intervention time)`,
        lessonsPerWeek: Math.max(3, lessonsPerWeek - 1),
        focusAreas: ['Major standards with foundational support', 'Skill building'],
        sequencing: 'Spiral approach with frequent review',
        assessmentSchedule: 'More formative, fewer high-stakes assessments',
        differentiation: 'Scaffolded instruction, peer support'
      });
    } else {
      recommendations.push({
        timeframe: `${weeksAvailable} weeks (standard pace)`,
        lessonsPerWeek,
        focusAreas: ['Balanced coverage of all standards', 'Application focus'],
        sequencing: 'Sequential with strategic spiraling',
        assessmentSchedule: 'Regular formative and summative balance',
        differentiation: 'Mixed-ability grouping, varied instruction'
      });
    }

    return recommendations;
  }

  private parseTimeframeToWeeks(timeframe: string): number {
    const lowerTimeframe = timeframe.toLowerCase();
    
    if (lowerTimeframe.includes('semester')) {
      return 18; // Standard semester
    } else if (lowerTimeframe.includes('quarter')) {
      return 9;  // Standard quarter
    } else if (lowerTimeframe.includes('trimester')) {
      return 12; // Standard trimester
    } else if (lowerTimeframe.includes('year')) {
      return 36; // Full academic year
    } else {
      // Try to extract number of weeks
      const weekMatch = timeframe.match(/(\d+)\s*week/i);
      return weekMatch ? parseInt(weekMatch[1]) : 18; // Default to semester
    }
  }

  async disconnect() {
    await this.standardsService.disconnect();
  }
}
