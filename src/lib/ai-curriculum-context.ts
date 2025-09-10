import { StandardsService, StandardsMapping } from './standards-service';
import { PrecisionCurriculumService } from './precision-curriculum-service';

// Supported AI models for pacing guide generation
export type AIModel = 'gpt-4o' | 'gpt-5' | 'gpt-4-turbo' | 'gpt-3.5-turbo';

// Model configuration with output constraints
export interface ModelConfiguration {
  name: AIModel;
  maxTokens: number;
  temperature?: number; // Optional - GPT-5 doesn't support custom temperature
  description: string;
  recommended: boolean;
  costTier: 'low' | 'medium' | 'high' | 'premium';
}

// Pathway configuration for different learning approaches
export interface PathwayConfiguration {
  type: 'sequential' | 'accelerated' | 'intervention' | 'combined' | 'custom';
  pathwayType: 'sequential' | 'accelerated' | 'intervention' | 'combined' | 'custom';
  emphasis: 'major' | 'foundational' | 'balanced' | 'advanced';
  skipGrades: string[];
  crossGradeSequencing: boolean;
  compressionLevel: 'none' | 'low' | 'moderate' | 'high';
  customSequence?: string[];
  // Legacy compatibility
  selectedGrades?: string[];
  combinedUnits?: any[];
}

// Lesson modification for dual-grade accelerated pathways
export interface LessonModification {
  type: 'session_compression' | 'prerequisite_bridging' | 'progression_enhancement' | 'accelerated_pacing' | 'skip' | 'condense' | 'extend' | 'combine' | 'split' | 'enhance';
  description: string;
  rationale: string;
  impact?: string; // Optional for backward compatibility
}

// Available model configurations
export const AVAILABLE_MODELS: Record<AIModel, ModelConfiguration> = {
  'gpt-4o': {
    name: 'gpt-4o',
    maxTokens: 16000,
    temperature: 0.1,
    description: 'Fast, efficient, optimal for most pacing guides',
    recommended: true,
    costTier: 'medium'
  },
  'gpt-5': {
    name: 'gpt-5',
    maxTokens: 8000, // Controlled output to prevent massive responses
    description: 'Most advanced model with enhanced reasoning (uses default temperature)',
    recommended: false, // Experimental
    costTier: 'premium'
  },
  'gpt-4-turbo': {
    name: 'gpt-4-turbo',
    maxTokens: 12000,
    temperature: 0.1,
    description: 'Balanced performance and capability',
    recommended: false,
    costTier: 'high'
  },
  'gpt-3.5-turbo': {
    name: 'gpt-3.5-turbo',
    maxTokens: 8000,
    temperature: 0.2,
    description: 'Cost-effective for simple pacing guides',
    recommended: false,
    costTier: 'low'
  }
};

// Enhanced lesson metadata interfaces for sophisticated pacing logic
export interface LessonMetadata {
  lessonId: string;
  lessonNumber: number;
  title: string;
  unit: string;
  unitNumber: number;
  gradeLevel: string;
  standards: string[];
  focusType: 'major' | 'supporting' | 'additional';
  instructionalDays: number;
  isFoundational: boolean;
  isMajorWork: boolean;
  hasPrerequisites: boolean;
  prerequisites: string[];
  sessionStructure: SessionStructureMetadata;
  pacingFlags: PacingFlags;
  difficultyLevel: 'introductory' | 'developing' | 'mastery' | 'extension';
  crossGradeConnections: string[];
}

export interface SessionStructureAssignment {
  lessonId: string;
  assignedStructure: SessionStructureMetadata;
  rationale: string;
  estimatedDays: number;
  sessionTypes: string[];
  compressionLevel: 'none' | 'low' | 'moderate' | 'high';
  differentiationNotes: string[];
  // Legacy properties for compatibility
  structure?: SessionDay[];
  totalDays?: number;
  customizations?: SessionCustomization[];
}

export interface SessionMetadata {
  day: number;
  type: string;
  focus: string;
  activities: string[];
  materials: string[];
  duration: number;
  objectives: string[];
}

export interface SessionDay {
  day: number;
  sessionType: 'explore' | 'develop' | 'refine' | 'apply' | 'practice' | 'assessment';
  focus: string;
  duration: number; // in minutes
  activities: string[];
  isCore: boolean;
  canSkip: boolean;
}

export interface PacingFlags {
  majorEmphasis: boolean;
  developOnly: boolean;
  exploreOnly: boolean;
  refineOnly: boolean;
  acceleratedReady: boolean;
  interventionFocus: boolean;
  combinable: boolean;
  standalone: boolean;
  reviewRequired: boolean;
  extensionAvailable: boolean;
}

export interface ConstraintsConfiguration {
  timeframe: string;
  totalWeeks: number;
  daysPerWeek: number;
  minutesPerClass: number;
  specialEvents: SpecialEvent[];
  testingWindows: TestingWindow[];
  holidays: Holiday[];
}

export interface SpecialEvent {
  name: string;
  startDate: string;
  endDate: string;
  impact: 'no-new-content' | 'review-only' | 'assessment-only' | 'normal';
}

export interface TestingWindow {
  name: string;
  startDate: string;
  endDate: string;
  affectedGrades: string[];
  preparationWeeks: number;
}

export interface Holiday {
  name: string;
  date: string;
  daysOff: number;
}

export interface LessonSelection {
  lessonId: string;
  lesson: LessonMetadata;
  included: boolean;
  priority: 'critical' | 'important' | 'supplemental' | 'optional';
  rationale: string;
  estimatedDays: number;
  prerequisites: string[];
  standards: string[];
}

export interface DifferentiationConfiguration {
  needs: string[];
  supportLevels: {
    advanced: boolean;
    onLevel: boolean;
    intervention: boolean;
    ell: boolean;
    specialNeeds: boolean;
  };
  accommodations: string[];
}

export interface CurriculumContext {
  gradeLevel: string;
  selectedGrades: string[];
  availableStandards: StandardsMapping[];
  majorStandards: StandardsMapping[];
  supportingStandards: StandardsMapping[];
  additionalStandards: StandardsMapping[];
  totalLessons: number;
  totalInstructionalDays: number;
  unitStructure: UnitStructure[];
  lessonMetadata: LessonMetadata[];
  crossGradeSequence?: CrossGradeSequence;
}

export interface UnitStructure {
  unitTitle: string;
  unitNumber: number;
  lessonCount: number;
  instructionalDays: number;
  focusDistribution: {
    major: number;
    supporting: number;
    additional: number;
  };
  standards: string[];
  lessons: LessonMetadata[];
  pacingRecommendations: UnitPacingRecommendation;
}

export interface SessionStructureMetadata {
  defaultStructure: SessionDay[];
  totalDays: number;
  sessions: SessionMetadata[];
  flexibilityOptions: string[];
  compressionApplied?: boolean;
}

export interface UnitPacingRecommendation {
  standardWeeks: number;
  acceleratedWeeks: number;
  interventionWeeks: number;
  criticalLessons: string[];
  optionalLessons: string[];
  prerequisites: string[];
}

export interface CrossGradeSequence {
  gradeProgression: string[];
  transitionPoints: TransitionPoint[];
  cumulativeStandards: string[];
  assessmentStrategy: CrossGradeAssessment;
}

export interface TransitionPoint {
  fromGrade: string;
  toGrade: string;
  bridgingLessons: string[];
  prerequisites: string[];
  assessmentCheckpoint: boolean;
}

export interface CrossGradeAssessment {
  formativeCheckpoints: number;
  summativeAssessments: string[];
  prerequisiteValidation: string[];
  progressMonitoring: string[];
}

export interface EnhancedPacingRecommendation {
  timeframe: string;
  lessonsPerWeek: number;
  focusAreas: string[];
  sequencing: string;
  assessmentSchedule: string;
  differentiation: string;
  pathway: PathwayConfiguration;
  constraints: ConstraintsConfiguration;
  selectedLessons: LessonSelection[];
  sessionPlan: SessionPlan[];
  rationale: PacingRationale;
}

export interface LessonSelection {
  lessonId: string;
  included: boolean;
  reason: string;
  modifications: LessonModification[];
  sessionStructure: SessionStructureAssignment;
}

export interface SessionCustomization {
  day: number;
  originalType: string;
  newType: string;
  reason: string;
}

export interface SessionPlan {
  week: number;
  lessons: WeeklyLessonPlan[];
  assessments: WeeklyAssessment[];
  specialEvents: string[];
  differentiationFocus: string[];
}

export interface WeeklyLessonPlan {
  lessonId: string;
  lessonTitle: string;
  daysAllocated: number;
  sessionSchedule: DailySession[];
  standards: string[];
  objectives: string[];
}

export interface DailySession {
  day: number;
  sessionType: string;
  focus: string;
  duration: number;
  activities: string[];
  materials: string[];
  differentiation: string[];
}

export interface WeeklyAssessment {
  type: 'formative' | 'summative' | 'diagnostic';
  standards: string[];
  timing: string;
  format: string;
}

export interface PacingRationale {
  lessonSelectionLogic: string;
  sessionStructureDecisions: string[];
  pathwayJustification: string;
  constraintHandling: string;
  differentiationStrategy: string;
  assessmentPlacement: string;
  scopeSequenceExplanation: string; // NEW: 100-250 word explanation of combined scope/sequence derivation
}

export class AICurriculumContextService {
  private standardsService: StandardsService;
  private precisionService: PrecisionCurriculumService;
  private selectedModel: AIModel;
  private modelConfig: ModelConfiguration;

  constructor(model: AIModel = 'gpt-4o') {
    this.standardsService = new StandardsService();
    this.precisionService = new PrecisionCurriculumService();
    this.selectedModel = model;
    this.modelConfig = AVAILABLE_MODELS[model];
    
    console.log(`🤖 [AI Context] Initialized with model: ${model} (${this.modelConfig.description})`);
  }

  /**
   * Get current model configuration
   */
  getModelInfo(): ModelConfiguration {
    return this.modelConfig;
  }

  /**
   * Switch to a different AI model
   */
  setModel(model: AIModel): void {
    this.selectedModel = model;
    this.modelConfig = AVAILABLE_MODELS[model];
    console.log(`🔄 [AI Context] Switched to model: ${model} (${this.modelConfig.description})`);
  }

  /**
   * Get all available models with their configurations
   */
  static getAvailableModels(): Record<AIModel, ModelConfiguration> {
    return AVAILABLE_MODELS;
  }

  /**
   * Enhanced curriculum context builder with lesson-level metadata
   */
  async buildCurriculumContext(gradeLevel: string, selectedGrades?: string[]): Promise<CurriculumContext> {
    try {
      const grades = selectedGrades || [gradeLevel];
      console.log(`🏗️ [CurriculumContext] Building context for grades: ${grades.join(', ')}`);

      // Get standards data for all selected grades
      const allStandardsData = await Promise.all(
        grades.map(async (grade) => {
          const [available, major, supporting, additional] = await Promise.all([
            this.standardsService.getStandardsForGrade(grade),
            this.standardsService.getStandardsByFocus(grade, 'major'),
            this.standardsService.getStandardsByFocus(grade, 'supporting'),
            this.standardsService.getStandardsByFocus(grade, 'additional')
          ]);
          return { grade, available, major, supporting, additional };
        })
      );

      // Merge standards from all grades
      const availableStandards = allStandardsData.flatMap(data => data.available);
      const majorStandards = allStandardsData.flatMap(data => data.major);
      const supportingStandards = allStandardsData.flatMap(data => data.supporting);
      const additionalStandards = allStandardsData.flatMap(data => data.additional);

      // Build enhanced lesson metadata
      const lessonMetadata = await this.buildLessonMetadata(grades);
      
      // Analyze unit structure with enhanced data
      const unitStructure = await this.analyzeEnhancedUnitStructure(availableStandards, lessonMetadata);
      
      // Calculate totals
      const totalInstructionalDays = lessonMetadata.reduce((sum, lesson) => sum + lesson.instructionalDays, 0);

      // Build cross-grade sequence if multiple grades
      const crossGradeSequence = grades.length > 1 ? 
        await this.buildCrossGradeSequence(grades, lessonMetadata) : undefined;

      return {
        gradeLevel: grades.length === 1 ? gradeLevel : `${grades[0]}-${grades[grades.length - 1]}`,
        selectedGrades: grades,
        availableStandards,
        majorStandards,
        supportingStandards,
        additionalStandards,
        totalLessons: lessonMetadata.length,
        totalInstructionalDays,
        unitStructure,
        lessonMetadata,
        crossGradeSequence
      };
    } catch (error) {
      console.error('Error building curriculum context:', error);
      throw new Error('Failed to build curriculum context');
    }
  }

  /**
   * Build detailed lesson metadata from precision curriculum service
   */
  private async buildLessonMetadata(grades: string[]): Promise<LessonMetadata[]> {
    const metadata: LessonMetadata[] = [];

    for (const grade of grades) {
      try {
        // Get lessons from precision service
        const lessons = this.precisionService.getLessonsByGrades([parseInt(grade)]);
        
        for (const lesson of lessons) {
          const lessonDetail = this.precisionService.getLessonDetails(lesson.lesson_id);
          
          const lessonMetadata: LessonMetadata = {
            lessonId: lesson.lesson_id.toString(),
            lessonNumber: lesson.lesson_number || 1,
            title: lesson.title || 'Untitled Lesson',
            unit: lesson.unit_theme || 'Unit 1',
            unitNumber: 1, // Unit number not available in PrecisionLessonData
            gradeLevel: grade,
            standards: lesson.standards || [],
            focusType: this.determineFocusType(lesson.title || ''),
            instructionalDays: lesson.estimated_days || this.estimateInstructionalDays(lesson),
            isFoundational: this.isFoundationalLesson(lesson),
            isMajorWork: lesson.is_major_work || this.isMajorWorkLesson(lesson),
            hasPrerequisites: this.hasPrerequisites(lesson),
            prerequisites: lesson.prerequisites || this.extractPrerequisites(lesson),
            sessionStructure: this.buildDefaultSessionStructure(lesson),
            pacingFlags: this.analyzePacingFlags(lesson),
            difficultyLevel: this.determineDifficultyLevel(lesson),
            crossGradeConnections: this.findCrossGradeConnections(lesson, grades)
          };

          metadata.push(lessonMetadata);
        }
      } catch (error) {
        console.warn(`Failed to get lessons for grade ${grade}:`, error);
      }
    }

    return metadata.sort((a, b) => {
      // Sort by grade, then unit, then lesson number
      if (a.gradeLevel !== b.gradeLevel) {
        return a.gradeLevel.localeCompare(b.gradeLevel);
      }
      if (a.unitNumber !== b.unitNumber) {
        return a.unitNumber - b.unitNumber;
      }
      return a.lessonNumber - b.lessonNumber;
    });
  }

  /**
   * Enhanced unit structure analysis with lesson metadata
   */
  private async analyzeEnhancedUnitStructure(
    standards: StandardsMapping[], 
    lessonMetadata: LessonMetadata[]
  ): Promise<UnitStructure[]> {
    const unitMap = new Map<string, {standards: StandardsMapping[], lessons: LessonMetadata[]}>();
    
    // Group standards and lessons by unit
    standards.forEach(standard => {
      const key = `${standard.gradeLevel}-${standard.unit}`;
      if (!unitMap.has(key)) {
        unitMap.set(key, { standards: [], lessons: [] });
      }
      unitMap.get(key)!.standards.push(standard);
    });

    lessonMetadata.forEach(lesson => {
      const key = `${lesson.gradeLevel}-${lesson.unit}`;
      if (!unitMap.has(key)) {
        unitMap.set(key, { standards: [], lessons: [] });
      }
      unitMap.get(key)!.lessons.push(lesson);
    });

    // Build enhanced unit structures
    return Array.from(unitMap.entries()).map(([unitKey, unitData]) => {
      const [gradeLevel, unitTitle] = unitKey.split('-', 2);
      const unitStandards = unitData.standards;
      const unitLessons = unitData.lessons;

      // Extract unit number from first lesson or parse from title
      const unitNumber = unitLessons.length > 0 ? unitLessons[0].unitNumber : 
        this.extractUnitNumber(unitTitle);

      const focusDistribution = {
        major: unitStandards.filter(s => s.focusType === 'major').length,
        supporting: unitStandards.filter(s => s.focusType === 'supporting').length,
        additional: unitStandards.filter(s => s.focusType === 'additional').length
      };

      const allStandards = unitStandards
        .flatMap(s => s.standards)
        .filter((value, index, self) => self.indexOf(value) === index);

      const instructionalDays = unitLessons.reduce((sum, lesson) => sum + lesson.instructionalDays, 0);

      const pacingRecommendations: UnitPacingRecommendation = {
        standardWeeks: Math.ceil(instructionalDays / 5),
        acceleratedWeeks: Math.ceil(instructionalDays / 6),
        interventionWeeks: Math.ceil(instructionalDays / 4),
        criticalLessons: unitLessons.filter(l => l.isMajorWork).map(l => l.lessonId),
        optionalLessons: unitLessons.filter(l => l.focusType === 'additional').map(l => l.lessonId),
        prerequisites: unitLessons.flatMap(l => l.prerequisites)
      };

      return {
        unitTitle,
        unitNumber,
        lessonCount: unitLessons.length,
        instructionalDays,
        focusDistribution,
        standards: allStandards,
        lessons: unitLessons,
        pacingRecommendations
      };
    }).sort((a, b) => a.unitNumber - b.unitNumber);
  }

  /**
   * Advanced lesson selection logic based on pathway and constraints
   */
  async selectLessonsForPacing(
    context: CurriculumContext,
    pathway: PathwayConfiguration,
    constraints: ConstraintsConfiguration,
    differentiation: DifferentiationConfiguration
  ): Promise<LessonSelection[]> {
    const selections: LessonSelection[] = [];

    for (const lesson of context.lessonMetadata) {
      const selection = await this.evaluateLessonForInclusion(
        lesson, pathway, constraints, differentiation, context
      );
      selections.push(selection);
    }

    return this.optimizeSelectionSequence(selections, pathway, constraints);
  }

  /**
   * Generate comprehensive pacing recommendations with advanced logic
   */
  async generateAdvancedPacingRecommendations(
    gradeLevel: string | string[],
    pathway: PathwayConfiguration,
    constraints: ConstraintsConfiguration,
    differentiation: DifferentiationConfiguration
  ): Promise<EnhancedPacingRecommendation[]> {
    const grades = Array.isArray(gradeLevel) ? gradeLevel : [gradeLevel];
    const context = await this.buildCurriculumContext(grades[0], grades);
    
    // Advanced lesson selection
    const selectedLessons = await this.selectLessonsForPacing(
      context, pathway, constraints, differentiation
    );

    // Session structure assignment
    const sessionAssignments = this.generateSessionStructureAssignments(
      selectedLessons, pathway
    );

    // Weekly planning
    const sessionPlan = this.generateWeeklySessionPlan(
      selectedLessons, sessionAssignments, constraints
    );

    // Calculate pacing metrics
    const totalSelectedLessons = selectedLessons.filter(s => s.included).length;
    const lessonsPerWeek = Math.ceil(totalSelectedLessons / constraints.totalWeeks);

    const recommendation: EnhancedPacingRecommendation = {
      timeframe: `${constraints.totalWeeks} weeks`,
      lessonsPerWeek,
      focusAreas: this.determineFocusAreas(pathway, selectedLessons),
      sequencing: this.determineSequencingStrategy(pathway),
      assessmentSchedule: this.generateAssessmentSchedule(constraints, sessionPlan),
      differentiation: this.generateDifferentiationStrategy(differentiation),
      pathway,
      constraints,
      selectedLessons,
      sessionPlan,
      rationale: this.generatePacingRationale(pathway, selectedLessons, constraints)
    };

    return [recommendation];
  }

  /**
   * Generate session structure assignments with 5-day lesson condensation
   */
  private generateSessionStructureAssignments(
    selectedLessons: LessonSelection[], 
    pathway: PathwayConfiguration
  ): SessionStructureAssignment[] {
    const assignments: SessionStructureAssignment[] = [];

    selectedLessons.forEach(lessonSelection => {
      if (!lessonSelection.included) return;

      const lesson = lessonSelection.lesson;
      let sessionStructure: SessionStructureAssignment;

      // Determine session structure based on pathway type
      switch (pathway.type) {
        case 'accelerated':
          sessionStructure = this.createAcceleratedSessionStructure(lesson, pathway);
          break;
        case 'intervention':
          sessionStructure = this.createInterventionSessionStructure(lesson, pathway);
          break;
        case 'combined':
          sessionStructure = this.createCombinedSessionStructure(lesson, pathway);
          break;
        default:
          sessionStructure = this.createStandardSessionStructure(lesson, pathway);
      }

      assignments.push(sessionStructure);
    });

    return assignments;
  }

  /**
   * Create accelerated session structure with optional condensation
   */
  private createAcceleratedSessionStructure(
    lesson: LessonMetadata, 
    pathway: PathwayConfiguration
  ): SessionStructureAssignment {
    const baseStructure = this.buildDefaultSessionStructure(lesson);
    
    // For accelerated pathways, we can condense by focusing on key sessions
    const condensedStructure = this.condenseSessionStructure(baseStructure, 'accelerated');
    
    return {
      lessonId: lesson.lessonId,
      assignedStructure: condensedStructure,
      rationale: this.generateSessionRationale('accelerated', lesson),
      estimatedDays: condensedStructure.totalDays,
      sessionTypes: condensedStructure.sessions.map(s => s.type),
      compressionLevel: pathway.emphasis === 'major' ? 'moderate' : 'high',
      differentiationNotes: [
        'Focus on Develop sessions for core concept mastery',
        'Optional Explore sessions for advanced students',
        'Condensed Refine sessions with targeted practice'
      ]
    };
  }

  /**
   * Condense 5-day lesson structure based on pathway needs
   */
  private condenseSessionStructure(
    baseStructure: SessionStructureMetadata,
    pathwayType: string
  ): SessionStructureMetadata {
    const originalSessions = baseStructure.sessions;
    let condensedSessions: SessionMetadata[];

    switch (pathwayType) {
      case 'accelerated':
        // Focus on Develop sessions (Day 2-3), optional Explore (Day 1), minimal Refine (Day 4-5)
        condensedSessions = [
          originalSessions[0], // Day 1: Explore (optional/brief)
          originalSessions[1], // Day 2: Develop (core)
          originalSessions[2], // Day 3: Develop (core)
          this.createCondensedRefineSession(originalSessions[3], originalSessions[4]) // Combined Day 4-5
        ];
        break;
      
      case 'intensive':
        // Ultra-condensed: Just Day 2-3 Develop sessions
        condensedSessions = [
          originalSessions[1], // Day 2: Develop (core)
          originalSessions[2]  // Day 3: Develop (core)
        ];
        break;
      
      default:
        condensedSessions = originalSessions; // Keep full 5-day structure
    }

    return {
      ...baseStructure,
      sessions: condensedSessions,
      totalDays: condensedSessions.length,
      compressionApplied: pathwayType !== 'standard'
    };
  }

  /**
   * Create a condensed refine session combining Day 4 and Day 5 activities
   */
  private createCondensedRefineSession(day4: SessionMetadata, day5: SessionMetadata): SessionMetadata {
    return {
      day: 4,
      type: 'Condensed Refine',
      focus: 'Essential Practice & Assessment',
      activities: [
        ...day4.activities.slice(0, 2), // Top 2 from Day 4
        ...day5.activities.slice(0, 2)  // Top 2 from Day 5
      ],
      materials: [...new Set([...day4.materials, ...day5.materials])], // Unique materials
      duration: Math.min(day4.duration + day5.duration, 50), // Single class period
      objectives: [
        'Apply key concepts with focused practice',
        'Demonstrate lesson mastery',
        'Prepare for next lesson progression'
      ]
    };
  }

  /**
   * Generate session assignment rationale
   */
  private generateSessionRationale(pathwayType: string, lesson: LessonMetadata): string {
    const rationales: { [key: string]: string } = {
      'accelerated': `Condensed 5-day structure to focus on core Develop sessions. ${lesson.isMajorWork ? 'Major Work standard requires full development.' : 'Supporting standard allows efficient progression.'} Estimated ${lesson.instructionalDays} days reduced to maximize learning velocity.`,
      
      'intervention': `Extended 5-day structure with additional support sessions. ${lesson.isFoundational ? 'Foundational concept needs reinforcement.' : 'Building prerequisites through structured scaffolding.'} Focus on mastery before progression.`,
      
      'combined': `Flexible 5-day structure accommodating multiple learning needs. Core Develop sessions for all students with differentiated Explore and Refine options based on readiness.`,
      
      'standard': `Full 5-day lesson structure: Explore → Develop → Develop → Refine → Refine. Balanced approach ensuring conceptual understanding and procedural fluency.`
    };

    return rationales[pathwayType] || rationales['standard'];
  }

  /**
   * Create intervention session structure with extended support
   */
  private createInterventionSessionStructure(
    lesson: LessonMetadata, 
    pathway: PathwayConfiguration
  ): SessionStructureAssignment {
    const baseStructure = this.buildDefaultSessionStructure(lesson);
    
    // For intervention pathways, extend with additional support sessions
    const extendedStructure = this.extendSessionStructure(baseStructure, 'intervention');
    
    return {
      lessonId: lesson.lessonId,
      assignedStructure: extendedStructure,
      rationale: this.generateSessionRationale('intervention', lesson),
      estimatedDays: extendedStructure.totalDays,
      sessionTypes: extendedStructure.sessions.map(s => s.type),
      compressionLevel: 'none',
      differentiationNotes: [
        'Extended Explore sessions for prerequisite building',
        'Multiple Develop sessions with scaffolding',
        'Extended Refine sessions with additional practice'
      ]
    };
  }

  /**
   * Create combined session structure for mixed groups
   */
  private createCombinedSessionStructure(
    lesson: LessonMetadata, 
    pathway: PathwayConfiguration
  ): SessionStructureAssignment {
    const baseStructure = this.buildDefaultSessionStructure(lesson);
    
    return {
      lessonId: lesson.lessonId,
      assignedStructure: baseStructure,
      rationale: this.generateSessionRationale('combined', lesson),
      estimatedDays: baseStructure.totalDays,
      sessionTypes: baseStructure.sessions.map(s => s.type),
      compressionLevel: 'low',
      differentiationNotes: [
        'Full 5-day structure with differentiation within sessions',
        'Flexible grouping based on readiness',
        'Optional extension activities for advanced learners'
      ]
    };
  }

  /**
   * Create standard session structure
   */
  private createStandardSessionStructure(
    lesson: LessonMetadata, 
    pathway: PathwayConfiguration
  ): SessionStructureAssignment {
    const baseStructure = this.buildDefaultSessionStructure(lesson);
    
    return {
      lessonId: lesson.lessonId,
      assignedStructure: baseStructure,
      rationale: this.generateSessionRationale('standard', lesson),
      estimatedDays: baseStructure.totalDays,
      sessionTypes: baseStructure.sessions.map(s => s.type),
      compressionLevel: 'none',
      differentiationNotes: [
        'Standard 5-day lesson progression',
        'Balanced approach to conceptual and procedural learning',
        'Regular formative assessment throughout'
      ]
    };
  }

  /**
   * Extend session structure for intervention pathways
   */
  private extendSessionStructure(
    baseStructure: SessionStructureMetadata,
    pathwayType: string
  ): SessionStructureMetadata {
    const originalSessions = baseStructure.sessions;
    let extendedSessions: SessionMetadata[];

    // Add prerequisite review session and extend practice
    extendedSessions = [
      this.createPrerequisiteReviewSession(),
      ...originalSessions,
      this.createExtendedPracticeSession()
    ];

    return {
      ...baseStructure,
      sessions: extendedSessions,
      totalDays: extendedSessions.length,
      compressionApplied: false
    };
  }

  /**
   * Create prerequisite review session
   */
  private createPrerequisiteReviewSession(): SessionMetadata {
    return {
      day: 0,
      type: 'Prerequisite Review',
      focus: 'Foundation Building',
      activities: [
        'Review prior knowledge',
        'Assess readiness',
        'Fill knowledge gaps',
        'Connect to new learning'
      ],
      materials: ['Review worksheets', 'Diagnostic assessments'],
      duration: 50,
      objectives: [
        'Activate prior knowledge',
        'Identify and address gaps',
        'Build confidence for new learning'
      ]
    };
  }

  /**
   * Create extended practice session
   */
  private createExtendedPracticeSession(): SessionMetadata {
    return {
      day: 6,
      type: 'Extended Practice',
      focus: 'Mastery Reinforcement',
      activities: [
        'Additional guided practice',
        'Peer collaboration',
        'Error analysis',
        'Mastery check'
      ],
      materials: ['Practice sets', 'Collaboration tools'],
      duration: 50,
      objectives: [
        'Reinforce key concepts',
        'Build procedural fluency',
        'Demonstrate mastery'
      ]
    };
  }
  private async buildCrossGradeSequence(
    grades: string[], 
    lessonMetadata: LessonMetadata[]
  ): Promise<CrossGradeSequence> {
    // Implementation for cross-grade sequence analysis
    return {
      gradeProgression: grades,
      transitionPoints: [],
      cumulativeStandards: [],
      assessmentStrategy: {
        formativeCheckpoints: Math.ceil(grades.length * 2),
        summativeAssessments: [`Mid-Year Assessment`, `End-Year Assessment`],
        prerequisiteValidation: [`Grade ${grades[0]} Readiness`, `Grade ${grades[grades.length-1]} Readiness`],
        progressMonitoring: [`Monthly Progress Check`, `Standards Mastery Check`]
      }
    };
  }

  private async evaluateLessonForInclusion(
    lesson: LessonMetadata,
    pathway: PathwayConfiguration,
    constraints: ConstraintsConfiguration,
    differentiation: DifferentiationConfiguration,
    context: CurriculumContext
  ): Promise<LessonSelection> {
    let included = true;
    let reason = 'Standard inclusion';
    const modifications: LessonModification[] = [];

    // ENHANCED DUAL-GRADE ACCELERATED PATHWAY LOGIC
    const isMultiGrade = context.selectedGrades.length > 1;
    const isDualGradeAccelerated = pathway.pathwayType === 'accelerated' && isMultiGrade;

    if (isDualGradeAccelerated) {
      // For dual-grade accelerated pathways, we need sophisticated selection
      const selectionResult = this.evaluateDualGradeAcceleratedLesson(
        lesson, pathway, context
      );
      included = selectionResult.included;
      reason = selectionResult.reason;
      modifications.push(...selectionResult.modifications);
    } else {
      // Apply standard pathway logic for single-grade or non-accelerated pathways
      switch (pathway.pathwayType) {
        case 'accelerated':
          if (!lesson.pacingFlags.acceleratedReady && lesson.focusType === 'additional') {
            included = false;
            reason = 'Skipped for accelerated pathway - additional standard';
          }
          break;
        case 'intervention':
          if (!lesson.isFoundational && !lesson.isMajorWork) {
            included = false;
            reason = 'Skipped for intervention - not foundational or major work';
          }
          break;
      }

      // Apply emphasis logic
      switch (pathway.emphasis) {
        case 'major':
          if (lesson.focusType !== 'major') {
            included = false;
            reason = 'Skipped - not a major standard';
          }
          break;
        case 'foundational':
          if (!lesson.isFoundational) {
            included = false;
            reason = 'Skipped - not foundational';
          }
          break;
      }
    }

    return {
      lessonId: lesson.lessonId,
      lesson: lesson,
      included,
      priority: included ? 'important' : 'optional',
      rationale: reason,
      estimatedDays: lesson.instructionalDays,
      prerequisites: lesson.prerequisites || [],
      standards: lesson.standards,
      reason: reason,
      modifications: modifications,
      sessionStructure: this.assignSessionStructure(lesson, pathway)
    };
  }

  /**
   * CRITICAL: Evaluate lessons for dual-grade accelerated pathways
   * This creates pedagogically sound integration of two grade levels
   */
  private evaluateDualGradeAcceleratedLesson(
    lesson: LessonMetadata,
    pathway: PathwayConfiguration,
    context: CurriculumContext
  ): { included: boolean; reason: string; modifications: LessonModification[] } {
    const modifications: LessonModification[] = [];
    
    // Determine if this lesson represents a "high point" from either grade
    const isHighPointLesson = this.isHighPointLesson(lesson, pathway, context);
    
    // Check for prerequisite relationships with other grade level
    const hasPrerequisiteAlignment = this.hasPrerequisiteAlignment(lesson, context);
    
    // Check for concept progression value
    const hasProgressionValue = this.hasConceptProgressionValue(lesson, context);
    
    // High-point lessons are always included
    if (isHighPointLesson) {
      return {
        included: true,
        reason: `High-point lesson from ${lesson.gradeLevel} - essential for accelerated dual-grade progression`,
        modifications: [{
          type: 'session_compression',
          description: 'Focus on Develop sessions for efficient learning progression',
          rationale: 'Accelerated pathway requires condensed high-impact sessions'
        }]
      };
    }
    
    // Include if it has strong prerequisite alignment
    if (hasPrerequisiteAlignment && lesson.isMajorWork) {
      return {
        included: true,
        reason: `Major work lesson with strong prerequisite alignment across grade levels`,
        modifications: [{
          type: 'prerequisite_bridging',
          description: 'Enhanced connections to other grade level concepts',
          rationale: 'Bridges concepts between grade levels for accelerated learners'
        }]
      };
    }
    
    // Include if it has high concept progression value
    if (hasProgressionValue && (lesson.isMajorWork || lesson.isFoundational)) {
      return {
        included: true,
        reason: `Essential for concept progression across dual-grade accelerated pathway`,
        modifications: [{
          type: 'progression_enhancement',
          description: 'Emphasized concept connections to next grade level',
          rationale: 'Critical stepping stone for accelerated grade progression'
        }]
      };
    }
    
    // For supporting/additional standards, be more selective
    if (lesson.focusType === 'additional' || lesson.focusType === 'supporting') {
      return {
        included: false,
        reason: `Additional/supporting standard skipped in dual-grade accelerated pathway to focus on high-impact lessons`,
        modifications: []
      };
    }
    
    // Default: include foundational and major work, exclude others
    const shouldInclude = lesson.isFoundational || lesson.isMajorWork;
    return {
      included: shouldInclude,
      reason: shouldInclude 
        ? `Foundational/major work lesson included for dual-grade accelerated pathway`
        : `Excluded to maintain focus on essential dual-grade progression`,
      modifications: shouldInclude ? [{
        type: 'accelerated_pacing',
        description: 'Condensed pacing for dual-grade coverage',
        rationale: 'Accelerated pathway requires efficient lesson progression'
      }] : []
    };
  }

  /**
   * Determine if a lesson represents a "high point" essential for dual-grade accelerated learning
   */
  private isHighPointLesson(
    lesson: LessonMetadata,
    pathway: PathwayConfiguration,
    context: CurriculumContext
  ): boolean {
    // High-point criteria for dual-grade accelerated pathways
    
    // Always include major work standards
    if (lesson.isMajorWork && lesson.focusType === 'major') {
      return true;
    }
    
    // Include foundational lessons that bridge to next grade level
    if (lesson.isFoundational && lesson.crossGradeConnections.length > 0) {
      return true;
    }
    
    // Include lessons that are gateways to advanced concepts
    const isGatewayLesson = this.isGatewayLesson(lesson, context);
    if (isGatewayLesson) {
      return true;
    }
    
    // Include critical lessons that need major emphasis
    if (lesson.pacingFlags.majorEmphasis && lesson.isMajorWork) {
      return true;
    }
    
    return false;
  }

  /**
   * Check if lesson has strong prerequisite alignment with other grade level
   */
  private hasPrerequisiteAlignment(lesson: LessonMetadata, context: CurriculumContext): boolean {
    // Check if this lesson's concepts appear as prerequisites in other grade level
    const otherGradeLessons = context.lessonMetadata.filter(l => l.gradeLevel !== lesson.gradeLevel);
    
    return otherGradeLessons.some(otherLesson => 
      otherLesson.prerequisites.some(prereq => 
        lesson.standards.some(standard => 
          prereq.includes(standard) || standard.includes(prereq)
        )
      )
    );
  }

  /**
   * Check if lesson has high concept progression value for dual-grade pathway
   */
  private hasConceptProgressionValue(lesson: LessonMetadata, context: CurriculumContext): boolean {
    // Check cross-grade connections
    if (lesson.crossGradeConnections.length > 0) {
      return true;
    }
    
    // Check if lesson concepts appear in higher grade standards
    const higherGradeLessons = context.lessonMetadata.filter(l => 
      l.gradeLevel > lesson.gradeLevel || 
      (l.gradeLevel.includes('Algebra') && !lesson.gradeLevel.includes('Algebra'))
    );
    
    return higherGradeLessons.some(higherLesson =>
      lesson.standards.some(standard => 
        higherLesson.standards.some(higherStandard =>
          this.areRelatedStandards(standard, higherStandard)
        )
      )
    );
  }

  /**
   * Determine if lesson is a gateway to advanced concepts
   */
  private isGatewayLesson(lesson: LessonMetadata, context: CurriculumContext): boolean {
    // Gateway lessons are those that unlock multiple future concepts
    const gatewayKeywords = [
      'linear', 'equation', 'function', 'variable', 'expression', 
      'graph', 'coordinate', 'proportion', 'ratio', 'transformation',
      'algebra', 'solve', 'system'
    ];
    
    const lessonTitle = (lesson.title || '').toLowerCase();
    const lessonContent = lessonTitle; // Use title as content for now
    
    return gatewayKeywords.some(keyword => 
      lessonTitle.includes(keyword) || lessonContent.includes(keyword)
    );
  }

  /**
   * Check if two standards are conceptually related
   */
  private areRelatedStandards(standard1: string, standard2: string): boolean {
    // Simple heuristic - check for common domain codes or similar patterns
    const domain1 = standard1.split('.')[0];
    const domain2 = standard2.split('.')[0];
    
    // Same domain family (e.g., 8.F and A.F for functions)
    if (domain1.includes(domain2.slice(-1)) || domain2.includes(domain1.slice(-1))) {
      return true;
    }
    
    // Common mathematical concept patterns
    const conceptKeywords = ['EE', 'F', 'G', 'A', 'N'];
    return conceptKeywords.some(concept => 
      standard1.includes(concept) && standard2.includes(concept)
    );
  }

  private assignSessionStructure(
    lesson: LessonMetadata, 
    pathway: PathwayConfiguration
  ): SessionStructureAssignment {
    const baseStructure = this.buildDefaultSessionStructure(lesson);
    
    // For now, create a basic assignment
    return {
      lessonId: lesson.lessonId,
      assignedStructure: baseStructure,
      rationale: `Session structure assigned based on ${pathway.pathwayType} pathway`,
      estimatedDays: baseStructure.totalDays,
      sessionTypes: baseStructure.sessions.map(s => s.type),
      compressionLevel: pathway.compressionLevel || 'none',
      differentiationNotes: ['Standard session assignment'],
      // Legacy compatibility
      structure: baseStructure.defaultStructure,
      totalDays: baseStructure.totalDays,
      customizations: []
    };
  }
  /**
   * Generate sophisticated AI prompts with enhanced curriculum context
   */
  generateAdvancedPacingPrompt(
    context: CurriculumContext,
    pathway: PathwayConfiguration,
    constraints: ConstraintsConfiguration,
    differentiation: DifferentiationConfiguration
  ): string {
    const isMultiGrade = context.selectedGrades.length > 1;
    const isDualGradeAccelerated = pathway.pathwayType === 'accelerated' && isMultiGrade;
    
    return `
You are an expert mathematics curriculum specialist creating an advanced pacing guide.

${isDualGradeAccelerated ? `
🎯 CRITICAL DIRECTIVE: DUAL-GRADE ACCELERATED PATHWAY
This is a DUAL-GRADE ACCELERATED pathway covering ${context.selectedGrades.join(' + ')} in one year.
Students must experience the HIGH-POINTS from BOTH grade levels, not a sequential progression.
Your task is to create a pedagogically sound INTEGRATED curriculum that weaves together essential concepts from both years.

KEY PRINCIPLES FOR DUAL-GRADE ACCELERATED:
1. **High-Point Selection**: Choose only the most essential, gateway lessons from each grade level
2. **Concept Integration**: Identify where Grade ${context.selectedGrades[0]} concepts naturally lead to Grade ${context.selectedGrades[1]} concepts
3. **Session Compression**: Use "Develop-only" sessions frequently to maintain learning velocity
4. **Prerequisite Bridging**: Ensure Grade ${context.selectedGrades[0]} lessons properly prepare for Grade ${context.selectedGrades[1]} concepts
5. **Balanced Distribution**: Aim for roughly 60% Grade ${context.selectedGrades[0]} / 40% Grade ${context.selectedGrades[1]} content throughout the year
6. **Strategic Weaving**: Don't do all Grade ${context.selectedGrades[0]} first - interweave concepts where pedagogically sound

DUAL-GRADE LESSON SELECTION CRITERIA:
- Grade ${context.selectedGrades[0]} Lessons: Focus on gateway concepts that unlock Grade ${context.selectedGrades[1]} understanding
- Grade ${context.selectedGrades[1]} Lessons: Select foundational lessons that build on Grade ${context.selectedGrades[0]} high-points
- Cross-Grade Connections: Prioritize lessons with explicit connections between grade levels
- Session Structure: Many weeks should use condensed "Develop" sessions (2-3 days instead of 5)
` : ''}

CURRICULUM ANALYSIS:
- Grade Levels: ${context.selectedGrades.join(', ')}
- Total Lessons Available: ${context.totalLessons}
- Total Instructional Days: ${context.totalInstructionalDays}
- Major Work Lessons: ${context.lessonMetadata.filter(l => l.isMajorWork).length}
- Foundational Lessons: ${context.lessonMetadata.filter(l => l.isFoundational).length}
- Cross-Grade Connections: ${isMultiGrade ? 'Yes' : 'No'}

PATHWAY CONFIGURATION:
- Type: ${pathway.pathwayType}
- Emphasis: ${pathway.emphasis}
- Selected Grades: ${pathway.selectedGrades?.join(', ') || 'Not specified'}
${pathway.skipGrades.length > 0 ? `- Skipped Grades: ${pathway.skipGrades.join(', ')}` : ''}

CONSTRAINTS:
- Timeframe: ${constraints.timeframe} (${constraints.totalWeeks} weeks)
- Schedule: ${constraints.daysPerWeek} days/week, ${constraints.minutesPerClass} minutes/class
- Special Events: ${constraints.specialEvents.length} events
- Testing Windows: ${constraints.testingWindows.length} windows

DIFFERENTIATION NEEDS:
${differentiation.needs.map(need => `- ${need}`).join('\n')}

DETAILED UNIT ANALYSIS:
${context.unitStructure.map(unit => `
Unit ${unit.unitNumber}: ${unit.unitTitle}
- Lessons: ${unit.lessonCount} (${unit.instructionalDays} days)
- Focus: ${unit.focusDistribution.major} major, ${unit.focusDistribution.supporting} supporting, ${unit.focusDistribution.additional} additional
- Critical Lessons: ${unit.pacingRecommendations.criticalLessons.length}
- Optional Lessons: ${unit.pacingRecommendations.optionalLessons.length}
- Pacing: ${unit.pacingRecommendations.standardWeeks} weeks standard, ${unit.pacingRecommendations.acceleratedWeeks} accelerated
`).join('')}

LESSON SELECTION LOGIC:
Apply the following rules for lesson inclusion:

1. **Pathway Type Rules:**
   ${isDualGradeAccelerated ? `
   - **DUAL-GRADE ACCELERATED**: Create integrated progression hitting high-points from both grade levels
     * Week 1-8: Foundation concepts from Grade ${context.selectedGrades[0]} with Gateway concepts
     * Week 9-18: Interweave Grade ${context.selectedGrades[0]} advanced topics with Grade ${context.selectedGrades[1]} foundational
     * Week 19-28: Emphasize Grade ${context.selectedGrades[1]} major work with Grade ${context.selectedGrades[0]} connections
     * Week 29-36: Advanced Grade ${context.selectedGrades[1]} concepts with review integration
   ` : `
   - Sequential: Include all lessons in original order
   - Accelerated: Skip optional lessons, condense review sessions
   - Intervention: Focus on foundational and major work only
   - Combined: Merge prerequisite sequences across grades
   - Custom: Apply AI-optimized selection based on standards relationships
   `}

2. **Emphasis Rules:**
   - Balanced: Include all lesson types proportionally
   - Major: Focus on major work standards only
   - Foundational: Prioritize prerequisite and foundational lessons
   - Advanced: Include extension and enrichment opportunities

3. **Session Structure Assignment:**
   ${isDualGradeAccelerated ? `
   - **ACCELERATED COMPRESSION**: Use "Develop-only" sessions frequently (2-3 days instead of 5)
   - **High-Impact Lessons**: Major work standards get full 5-day structure
   - **Gateway Concepts**: Essential prerequisites get 4-day structure (Explore + 2 Develop + Refine)
   - **Supporting Standards**: 2-day condensed structure (Develop + Refine only)
   - **Review/Practice**: 1-day focused sessions when needed
   ` : `
   - Default: 5-day structure (Explore, Develop×3, Refine)
   - Major Emphasis Flag: All sessions become "Develop"
   - Develop Only Flag: Skip Explore and Refine phases
   - Accelerated: Combine Explore+Develop, reduce to 3-4 days
   - Intervention: Extend to 6-7 days with additional practice
   `}

4. **Constraint Handling:**
   - Special Events: No new content during events
   - Testing Windows: Review and practice only
   - Time Limits: Prioritize by standards importance

${isDualGradeAccelerated ? `
🎯 DUAL-GRADE SUCCESS METRICS:
- Ensure roughly 50-60% Grade ${context.selectedGrades[0]} content, 40-50% Grade ${context.selectedGrades[1]} content
- Every Grade ${context.selectedGrades[1]} lesson should build on a Grade ${context.selectedGrades[0]} foundation covered earlier
- Use condensed sessions extensively to maintain learning velocity
- Create smooth conceptual bridges between grade levels
- Prioritize major work standards from both grade levels
` : ''}

REQUIRED OUTPUT:
Generate a detailed pacing plan that includes:
1. Week-by-week lesson selection with rationale
2. Session structure assignments for each lesson
3. Assessment placement aligned with constraints
4. Differentiation strategies per lesson
5. Prerequisite validation checkpoints
6. Flexibility recommendations for calendar adjustments
7. **SCOPE & SEQUENCE EXPLANATION** (100-250 words): A comprehensive explanation of how you derived the combined scope and sequence, including:
   ${isDualGradeAccelerated ? `
   - How you integrated lessons from both grade levels
   - Your rationale for the grade distribution and sequencing
   - Explanation of session compression decisions
   - How you ensured prerequisite relationships and conceptual bridges
   ` : `
   - Your lesson selection criteria and rationale
   - How you determined the optimal sequence and pacing
   - Your approach to session structure assignments
   - How you balanced coverage with depth of understanding
   `}

${isDualGradeAccelerated ? 'Focus on creating a seamless dual-grade progression that maximizes learning velocity while maintaining pedagogical soundness. Include the detailed explanation of your derivation process.' : 'Focus on creating a realistic, implementable guide that teachers can use immediately. Include a clear explanation of your scope and sequence decisions.'}
    `.trim();
  }

  // Additional helper methods
  private determineFocusType(title: string): 'major' | 'supporting' | 'additional' {
    // Enhanced logic to determine lesson focus type
    const majorKeywords = ['equation', 'function', 'ratio', 'proportion', 'linear', 'algebra'];
    const supportingKeywords = ['geometry', 'measurement', 'data', 'statistics'];
    
    const lowerTitle = title.toLowerCase();
    
    if (majorKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'major';
    } else if (supportingKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return 'supporting';
    }
    return 'additional';
  }

  private estimateInstructionalDays(lesson: any): number {
    // Enhanced estimation based on lesson complexity
    const basedays = 3; // Default 3-day structure
    const title = lesson.title || '';
    
    if (title.toLowerCase().includes('explore') || title.toLowerCase().includes('introduce')) {
      return 5; // Full 5-day structure for intro lessons
    }
    if (title.toLowerCase().includes('practice') || title.toLowerCase().includes('review')) {
      return 2; // Shorter for practice lessons
    }
    return basedays;
  }

  private isFoundationalLesson(lesson: any): boolean {
    const title = (lesson.title || '').toLowerCase();
    const foundationalKeywords = ['basic', 'introduction', 'foundation', 'prerequisite', 'readiness'];
    return foundationalKeywords.some(keyword => title.includes(keyword));
  }

  private isMajorWorkLesson(lesson: any): boolean {
    return this.determineFocusType(lesson.title || '') === 'major';
  }

  private hasPrerequisites(lesson: any): boolean {
    const lessonNumber = lesson.lessonNumber || 1;
    return lessonNumber > 1; // Simple heuristic
  }

  private extractPrerequisites(lesson: any): string[] {
    // Extract prerequisite lessons based on lesson metadata
    return []; // Placeholder
  }

  private buildDefaultSessionStructure(lesson: any): SessionStructureMetadata {
    const defaultStructure: SessionDay[] = [
      { day: 1, sessionType: 'explore', focus: 'Concept Introduction', duration: 50, activities: ['Problem Solving'], isCore: true, canSkip: false },
      { day: 2, sessionType: 'develop', focus: 'Skill Building', duration: 50, activities: ['Guided Practice'], isCore: true, canSkip: false },
      { day: 3, sessionType: 'develop', focus: 'Application', duration: 50, activities: ['Practice Problems'], isCore: true, canSkip: false },
      { day: 4, sessionType: 'develop', focus: 'Extension', duration: 50, activities: ['Complex Problems'], isCore: false, canSkip: true },
      { day: 5, sessionType: 'refine', focus: 'Mastery', duration: 50, activities: ['Assessment', 'Review'], isCore: true, canSkip: false }
    ];

    return {
      defaultStructure,
      totalDays: 5,
      sessions: defaultStructure.map(day => ({
        day: day.day,
        type: day.sessionType,
        focus: day.focus,
        activities: day.activities || [],
        materials: [],
        duration: day.duration,
        objectives: []
      })),
      flexibilityOptions: ['Can compress to 3 days', 'Can extend to 7 days', 'Can modify session types'],
      compressionApplied: false
    };
  }

  private analyzePacingFlags(lesson: any): PacingFlags {
    // Analyze lesson for pacing flags based on content
    return {
      majorEmphasis: this.isMajorWorkLesson(lesson),
      developOnly: false,
      exploreOnly: false,
      refineOnly: false,
      acceleratedReady: true,
      interventionFocus: this.isFoundationalLesson(lesson),
      combinable: true,
      standalone: false,
      reviewRequired: false,
      extensionAvailable: !this.isFoundationalLesson(lesson)
    };
  }

  private determineDifficultyLevel(lesson: any): 'introductory' | 'developing' | 'mastery' | 'extension' {
    const title = (lesson.title || '').toLowerCase();
    
    if (title.includes('introduce') || title.includes('explore')) return 'introductory';
    if (title.includes('apply') || title.includes('extend')) return 'extension';
    if (title.includes('master') || title.includes('assess')) return 'mastery';
    return 'developing';
  }

  private findCrossGradeConnections(lesson: any, grades: string[]): string[] {
    // Find connections to other grade levels
    return grades.filter(grade => grade !== lesson.gradeLevel);
  }

  private extractUnitNumber(unitTitle: string): number {
    const match = unitTitle.match(/unit\s*(\d+)/i);
    return match ? parseInt(match[1]) : 1;
  }

  private optimizeSelectionSequence(
    selections: LessonSelection[],
    pathway: PathwayConfiguration,
    constraints: ConstraintsConfiguration
  ): LessonSelection[] {
    // Optimize the sequence based on prerequisites and pathway
    return selections.sort((a, b) => {
      // Sort by inclusion status first
      if (a.included !== b.included) {
        return a.included ? -1 : 1;
      }
      // Then by lesson order
      return a.lessonId.localeCompare(b.lessonId);
    });
  }

  private getDefaultSessionStructure(): SessionDay[] {
    return [
      { day: 1, sessionType: 'explore', focus: 'Discovery', duration: 50, activities: [], isCore: true, canSkip: false },
      { day: 2, sessionType: 'develop', focus: 'Building', duration: 50, activities: [], isCore: true, canSkip: false },
      { day: 3, sessionType: 'develop', focus: 'Practice', duration: 50, activities: [], isCore: true, canSkip: false },
      { day: 4, sessionType: 'develop', focus: 'Application', duration: 50, activities: [], isCore: true, canSkip: true },
      { day: 5, sessionType: 'refine', focus: 'Mastery', duration: 50, activities: [], isCore: true, canSkip: false }
    ];
  }

  private applyAcceleratedStructure(structure: SessionDay[]): SessionDay[] {
    // Compress to 3-4 days for accelerated pathway
    return [
      { ...structure[0], sessionType: 'develop', focus: 'Rapid Introduction' },
      { ...structure[1], focus: 'Intensive Practice' },
      { ...structure[2], focus: 'Application & Assessment' }
    ];
  }

  private generateWeeklySessionPlan(
    selectedLessons: LessonSelection[],
    sessionAssignments: SessionStructureAssignment[],
    constraints: ConstraintsConfiguration
  ): SessionPlan[] {
    // Generate week-by-week session planning
    const plans: SessionPlan[] = [];
    
    for (let week = 1; week <= constraints.totalWeeks; week++) {
      plans.push({
        week,
        lessons: [],
        assessments: [],
        specialEvents: constraints.specialEvents
          .filter(event => this.isEventInWeek(event, week))
          .map(event => event.name),
        differentiationFocus: []
      });
    }
    
    return plans;
  }

  private isEventInWeek(event: SpecialEvent, week: number): boolean {
    // Simple heuristic - would need actual date calculations
    return false;
  }

  private determineFocusAreas(pathway: PathwayConfiguration, lessons: LessonSelection[]): string[] {
    const areas = [];
    
    switch (pathway.emphasis) {
      case 'major':
        areas.push('Major Work Standards', 'Algebraic Reasoning');
        break;
      case 'foundational':
        areas.push('Number Systems', 'Basic Operations', 'Prerequisite Skills');
        break;
      case 'balanced':
        areas.push('Comprehensive Coverage', 'Standards Balance');
        break;
      case 'advanced':
        areas.push('Advanced Applications', 'Extension Activities');
        break;
    }
    
    return areas;
  }

  private determineSequencingStrategy(pathway: PathwayConfiguration): string {
    switch (pathway.pathwayType) {
      case 'sequential': return 'Standard grade-level progression';
      case 'accelerated': return 'Compressed timeline with prerequisite acceleration';
      case 'intervention': return 'Foundational focus with extensive review';
      case 'combined': return 'Integrated multi-grade scope and sequence';
      case 'custom': return 'AI-optimized pathway based on mathematical relationships';
      default: return 'Standard progression';
    }
  }

  private generateAssessmentSchedule(
    constraints: ConstraintsConfiguration,
    sessionPlan: SessionPlan[]
  ): string {
    return `Formative assessments weekly, summative assessments every ${Math.ceil(constraints.totalWeeks / 4)} weeks`;
  }

  private generateDifferentiationStrategy(differentiation: DifferentiationConfiguration): string {
    return `Differentiation for: ${differentiation.needs.join(', ')}`;
  }

  private generatePacingRationale(
    pathway: PathwayConfiguration,
    lessons: LessonSelection[],
    constraints: ConstraintsConfiguration
  ): PacingRationale {
    const includedLessons = lessons.filter(l => l.included);
    const isDualGradeAccelerated = pathway.pathwayType === 'accelerated' && 
      pathway.selectedGrades && pathway.selectedGrades.length > 1;

    // Generate comprehensive scope and sequence explanation
    const scopeSequenceExplanation = this.generateScopeSequenceExplanation(
      pathway, includedLessons, constraints, Boolean(isDualGradeAccelerated)
    );

    return {
      lessonSelectionLogic: `Selected ${includedLessons.length} of ${lessons.length} lessons based on ${pathway.pathwayType} pathway and ${pathway.emphasis} emphasis`,
      sessionStructureDecisions: ['Applied 5-day structure to core lessons', 'Compressed structure for review lessons'],
      pathwayJustification: `${pathway.pathwayType} pathway chosen to optimize learning progression`,
      constraintHandling: `Adjusted pacing for ${constraints.totalWeeks} weeks with ${constraints.specialEvents.length} special events`,
      differentiationStrategy: 'Multi-level activities and flexible grouping',
      assessmentPlacement: 'Aligned with natural lesson completion points',
      scopeSequenceExplanation: scopeSequenceExplanation
    };
  }

  /**
   * Generate comprehensive 100-250 word explanation of scope and sequence derivation
   */
  private generateScopeSequenceExplanation(
    pathway: PathwayConfiguration,
    lessons: LessonSelection[],
    constraints: ConstraintsConfiguration,
    isDualGradeAccelerated: boolean
  ): string {
    if (isDualGradeAccelerated) {
      const gradeBreakdown = this.analyzeDualGradeDistribution(lessons);
      const compressionStats = this.analyzeSessionCompression(lessons);
      
      return `This dual-grade accelerated scope and sequence integrates ${pathway.selectedGrades?.join(' and ')} mathematics to create a pedagogically sound progression covering essential concepts from both grade levels in ${constraints.totalWeeks} weeks. The AI analyzed ${lessons.length} available lessons and selected ${lessons.filter(l => l.included).length} high-impact lessons based on prerequisite relationships, cross-grade connections, and gateway concept identification. 

The distribution emphasizes ${gradeBreakdown.primaryGrade}% ${pathway.selectedGrades?.[0]} content (foundational and gateway concepts) and ${gradeBreakdown.secondaryGrade}% ${pathway.selectedGrades?.[1]} content (advanced applications). Session compression is applied strategically: ${compressionStats.fullStructure} lessons use complete 5-day structures for major work standards, while ${compressionStats.compressed} lessons utilize condensed "Develop-only" sessions (2-3 days) to maintain learning velocity. 

The sequence prioritizes conceptual bridging, ensuring each ${pathway.selectedGrades?.[1]} lesson builds upon previously covered ${pathway.selectedGrades?.[0]} foundations. This approach allows accelerated learners to master essential skills from both grade levels while maintaining mathematical coherence and progression depth.`;
    } else {
      const focusDistribution = this.analyzeFocusDistribution(lessons);
      
      return `This ${pathway.pathwayType} scope and sequence was derived by analyzing ${lessons.length} available lessons and applying ${pathway.emphasis} emphasis criteria to select ${lessons.filter(l => l.included).length} lessons over ${constraints.totalWeeks} weeks. The AI prioritized ${focusDistribution.major} major work standards, ${focusDistribution.supporting} supporting standards, and ${focusDistribution.additional} additional standards based on learning progression and time constraints.

Lesson sequencing follows natural mathematical dependencies, with foundational concepts introducing more complex applications. Session structures adapt to content complexity: conceptually dense lessons receive full 5-day exploration-development-refinement cycles, while review and practice lessons use compressed 2-3 day formats. The pacing balances curriculum coverage with depth of understanding, ensuring students master essential skills while maintaining engagement through varied instructional approaches and appropriate challenge levels.`;
    }
  }

  /**
   * Analyze grade distribution for dual-grade pathways
   */
  private analyzeDualGradeDistribution(lessons: LessonSelection[]): {
    primaryGrade: number;
    secondaryGrade: number;
  } {
    const includedLessons = lessons.filter(l => l.included);
    if (includedLessons.length === 0) return { primaryGrade: 50, secondaryGrade: 50 };

    const gradeCount = includedLessons.reduce((acc, lesson) => {
      const grade = lesson.lesson.gradeLevel;
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const grades = Object.keys(gradeCount).sort();
    const total = includedLessons.length;
    
    return {
      primaryGrade: Math.round((gradeCount[grades[0]] || 0) / total * 100),
      secondaryGrade: Math.round((gradeCount[grades[1]] || 0) / total * 100)
    };
  }

  /**
   * Analyze session compression statistics
   */
  private analyzeSessionCompression(lessons: LessonSelection[]): {
    fullStructure: number;
    compressed: number;
  } {
    const includedLessons = lessons.filter(l => l.included);
    let fullStructure = 0;
    let compressed = 0;

    includedLessons.forEach(lesson => {
      const estimatedDays = lesson.estimatedDays;
      if (estimatedDays >= 5) {
        fullStructure++;
      } else {
        compressed++;
      }
    });

    return { fullStructure, compressed };
  }

  /**
   * Analyze focus area distribution
   */
  private analyzeFocusDistribution(lessons: LessonSelection[]): {
    major: number;
    supporting: number;
    additional: number;
  } {
    const includedLessons = lessons.filter(l => l.included);
    let major = 0, supporting = 0, additional = 0;

    includedLessons.forEach(lesson => {
      switch (lesson.lesson.focusType) {
        case 'major': major++; break;
        case 'supporting': supporting++; break;
        case 'additional': additional++; break;
      }
    });

    return { major, supporting, additional };
  }

  async generatePacingRecommendations(
    gradeLevel: string,
    timeframe: string,
    studentPopulation: string,
    priorities: string[]
  ): Promise<EnhancedPacingRecommendation[]> {
    const context = await this.buildCurriculumContext(gradeLevel);
    
    // Build pathway configuration from legacy parameters
    const pathway: PathwayConfiguration = {
      type: 'sequential',
      pathwayType: 'sequential',
      emphasis: 'balanced',
      skipGrades: [],
      crossGradeSequencing: false,
      compressionLevel: 'none'
    };

    const constraints: ConstraintsConfiguration = {
      timeframe,
      totalWeeks: this.parseTimeframeToWeeks(timeframe),
      daysPerWeek: 5,
      minutesPerClass: 50,
      specialEvents: [],
      testingWindows: [],
      holidays: []
    };

    const differentiation: DifferentiationConfiguration = {
      needs: [],
      supportLevels: {
        advanced: studentPopulation.toLowerCase().includes('advanced'),
        onLevel: true,
        intervention: studentPopulation.toLowerCase().includes('intervention'),
        ell: false,
        specialNeeds: false
      },
      accommodations: []
    };

    return this.generateAdvancedPacingRecommendations(gradeLevel, pathway, constraints, differentiation);
  }

  private parseTimeframeToWeeks(timeframe: string): number {
    const lowerTimeframe = timeframe.toLowerCase();
    
    if (lowerTimeframe.includes('semester')) {
      return 18;
    } else if (lowerTimeframe.includes('quarter')) {
      return 9;
    } else if (lowerTimeframe.includes('trimester')) {
      return 12;
    } else if (lowerTimeframe.includes('year')) {
      return 36;
    } else {
      const weekMatch = timeframe.match(/(\d+)\s*week/i);
      return weekMatch ? parseInt(weekMatch[1]) : 18;
    }
  }

  /**
   * Generate AI prompt for pacing guide creation with model-specific constraints
   */
  generatePacingPrompt(
    context: CurriculumContext,
    timeframe: string,
    studentPopulation: string,
    priorities: string[]
  ): string {
    const modelInfo = `Using ${this.selectedModel} (max ${this.modelConfig.maxTokens} tokens)`;
    
    // Build output size constraints based on model
    const outputConstraints = this.getOutputConstraints();
    
    return `${modelInfo}

CURRICULUM CONTEXT:
- Grade Level: ${context.gradeLevel}
- Selected Grades: ${context.selectedGrades?.join(', ') || context.gradeLevel}
- Total Lessons: ${context.totalLessons}
- Total Instructional Days: ${context.totalInstructionalDays}
- Cross-Grade Sequence: ${context.crossGradeSequence ? 'Yes' : 'No'}

LESSON METADATA (${context.lessonMetadata.length} lessons):
${context.lessonMetadata.slice(0, 10).map(lesson => 
  `• ${lesson.title} (${lesson.instructionalDays} days, ${lesson.focusType}, ${lesson.isMajorWork ? 'Major Work' : 'Supporting'})`
).join('\n')}

UNIT STRUCTURE:
${context.unitStructure.map(unit => 
  `• ${unit.unitTitle}: ${unit.lessonCount} lessons, ${unit.instructionalDays} days`
).join('\n')}

PACING REQUIREMENTS:
- Timeframe: ${timeframe}
- Student Population: ${studentPopulation}
- Priorities: ${priorities.join(', ')}

${outputConstraints}

Create a comprehensive yet focused pacing guide that maximizes instructional effectiveness within the specified constraints.`;
  }

  /**
   * Get output constraints based on selected model
   */
  private getOutputConstraints(): string {
    switch (this.selectedModel) {
      case 'gpt-5':
        return `OUTPUT CONSTRAINTS (GPT-5):
- Maximum ${this.modelConfig.maxTokens} tokens
- Focus on high-level strategic recommendations
- Emphasize reasoning and sophisticated sequencing
- Provide detailed rationale for complex decisions
- Minimize repetitive content`;
        
      case 'gpt-4o':
        return `OUTPUT CONSTRAINTS (GPT-4o):
- Maximum ${this.modelConfig.maxTokens} tokens
- Balance detail with efficiency
- Include practical implementation guidance
- Structured JSON format required`;
        
      case 'gpt-4-turbo':
        return `OUTPUT CONSTRAINTS (GPT-4-Turbo):
- Maximum ${this.modelConfig.maxTokens} tokens
- Comprehensive but organized output
- Include detailed session structures`;
        
      case 'gpt-3.5-turbo':
        return `OUTPUT CONSTRAINTS (GPT-3.5-Turbo):
- Maximum ${this.modelConfig.maxTokens} tokens
- Concise, focused recommendations
- Essential information only
- Clear, simple structure`;
        
      default:
        return `OUTPUT CONSTRAINTS:
- Maximum ${this.modelConfig.maxTokens} tokens
- Focused, practical recommendations`;
    }
  }

  async disconnect() {
    await this.standardsService.disconnect();
  }
}
