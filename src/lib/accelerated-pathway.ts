// Accelerated Pathway: Grade 7/8 Combined Sequence for Algebra 1 Preparation
// Based on the scope and sequence document analysis

export interface LessonReference {
  id: string;
  grade: 7 | 8;
  unit: string;
  unitNumber: number;
  lesson: string;
  lessonNumber: number;
  title: string;
  volume: 1 | 2;
  startPage: number;
  endPage?: number;
  sessions: number;
  majorWork: boolean; // true = Major Work, false = Supporting/Additional Work
  originalCode: string; // e.g., "G7 U1 L1"
}

export interface AcceleratedUnit {
  id: string;
  title: string;
  description: string;
  lessons: LessonReference[];
  estimatedDays: number;
}

// Accelerated pathway lesson sequence based on scope and sequence analysis
export const ACCELERATED_PATHWAY: AcceleratedUnit[] = [
  {
    id: "unit-a",
    title: "Unit A: Proportional Relationships: Ratios, Rates, and Circles",
    description: "Foundation concepts for proportional reasoning, essential for algebraic thinking",
    estimatedDays: 25,
    lessons: [
      {
        id: "g7-u1-l1",
        grade: 7,
        unit: "Proportional Relationships: Ratios, Rates, and Circles",
        unitNumber: 1,
        lesson: "Solve Problems Involving Scale",
        lessonNumber: 1,
        title: "Solve Problems Involving Scale",
        volume: 1,
        startPage: 19,
        endPage: 34,
        sessions: 4,
        majorWork: true,
        originalCode: "G7 U1 L1"
      },
      {
        id: "g7-u1-l2",
        grade: 7,
        unit: "Proportional Relationships: Ratios, Rates, and Circles",
        unitNumber: 1,
        lesson: "Find Unit Rates Involving Ratios of Fractions",
        lessonNumber: 2,
        title: "Find Unit Rates Involving Ratios of Fractions",
        volume: 1,
        startPage: 45,
        endPage: 58,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U1 L2"
      },
      {
        id: "g7-u1-l3",
        grade: 7,
        unit: "Proportional Relationships: Ratios, Rates, and Circles",
        unitNumber: 1,
        lesson: "Understand Proportional Relationships",
        lessonNumber: 3,
        title: "Understand Proportional Relationships",
        volume: 1,
        startPage: 63,
        endPage: 78,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U1 L3"
      },
      {
        id: "g7-u1-l4",
        grade: 7,
        unit: "Proportional Relationships: Ratios, Rates, and Circles",
        unitNumber: 1,
        lesson: "Represent Proportional Relationships",
        lessonNumber: 4,
        title: "Represent Proportional Relationships",
        volume: 1,
        startPage: 73,
        endPage: 94,
        sessions: 4,
        majorWork: true,
        originalCode: "G7 U1 L4"
      },
      {
        id: "g7-u1-l5",
        grade: 7,
        unit: "Proportional Relationships: Ratios, Rates, and Circles",
        unitNumber: 1,
        lesson: "Solve Proportional Relationship Problems",
        lessonNumber: 5,
        title: "Solve Proportional Relationship Problems",
        volume: 1,
        startPage: 95,
        endPage: 110,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U1 L5"
      },
      {
        id: "g7-u1-l6",
        grade: 7,
        unit: "Proportional Relationships: Ratios, Rates, and Circles",
        unitNumber: 1,
        lesson: "Solve Area and Circumference Problems Involving Circles",
        lessonNumber: 6,
        title: "Solve Area and Circumference Problems Involving Circles",
        volume: 1,
        startPage: 111,
        endPage: 130,
        sessions: 3,
        majorWork: false, // Supporting work
        originalCode: "G7 U1 L6"
      }
    ]
  },
  {
    id: "unit-b",
    title: "Unit B: Numbers and Operations: Operations with Rational Numbers",
    description: "Essential number sense for algebraic manipulation",
    estimatedDays: 30,
    lessons: [
      {
        id: "g7-u2-l7",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Understand Addition with Negative Integers",
        lessonNumber: 7,
        title: "Understand Addition with Negative Integers",
        volume: 1,
        startPage: 151,
        endPage: 160,
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U2 L7"
      },
      {
        id: "g7-u2-l8",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Add with Negative Numbers",
        lessonNumber: 8,
        title: "Add with Negative Numbers",
        volume: 1,
        startPage: 161,
        endPage: 183,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U2 L8"
      },
      {
        id: "g7-u2-l9",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Understand Subtraction with Negative Integers",
        lessonNumber: 9,
        title: "Understand Subtraction with Negative Integers",
        volume: 1,
        startPage: 184,
        endPage: 196,
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U2 L9"
      },
      {
        id: "g7-u2-l10",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Add and Subtract Positive and Negative Numbers",
        lessonNumber: 10,
        title: "Add and Subtract Positive and Negative Numbers",
        volume: 1,
        startPage: 197,
        endPage: 220,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U2 L10"
      },
      {
        id: "g7-u2-l11",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Understand Multiplication with Negative Integers",
        lessonNumber: 11,
        title: "Understand Multiplication with Negative Integers",
        volume: 1,
        startPage: 237,
        endPage: 248,
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U2 L11"
      },
      {
        id: "g7-u2-l12",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Multiply and Divide with Negative Numbers",
        lessonNumber: 12,
        title: "Multiply and Divide with Negative Numbers",
        volume: 1,
        startPage: 249,
        endPage: 270,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U2 L12"
      },
      {
        id: "g7-u2-l13",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Express Rational Numbers as Terminating or Repeating Decimals",
        lessonNumber: 13,
        title: "Express Rational Numbers as Terminating or Repeating Decimals",
        volume: 1,
        startPage: 271,
        endPage: 292,
        sessions: 3,
        majorWork: false, // Supporting work
        originalCode: "G7 U2 L13"
      },
      {
        id: "g7-u2-l14",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 2,
        lesson: "Use the Four Operations with Negative Numbers",
        lessonNumber: 14,
        title: "Use the Four Operations with Negative Numbers",
        volume: 1,
        startPage: 293,
        endPage: 310,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U2 L14"
      }
    ]
  },
  {
    id: "unit-c",
    title: "Unit C: Expressions and Equations: Algebraic Thinking",
    description: "Bridge to algebraic reasoning and equation solving",
    estimatedDays: 35,
    lessons: [
      // Grade 7 foundational content
      {
        id: "g7-u3-l15",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 3,
        lesson: "Write Equivalent Expressions Involving Rational Numbers",
        lessonNumber: 15,
        title: "Write Equivalent Expressions Involving Rational Numbers",
        volume: 1,
        startPage: 327,
        endPage: 348,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U3 L15"
      },
      {
        id: "g7-u3-l16",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 3,
        lesson: "Understand Reasons for Rewriting Expressions",
        lessonNumber: 16,
        title: "Understand Reasons for Rewriting Expressions",
        volume: 1,
        startPage: 349,
        endPage: 360,
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U3 L16"
      },
      {
        id: "g7-u4-l17",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 4,
        lesson: "Understand Multi-Step Equations",
        lessonNumber: 17,
        title: "Understand Multi-Step Equations",
        volume: 1,
        startPage: 361,
        endPage: 372,
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U4 L17"
      },
      {
        id: "g7-u4-l18",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 4,
        lesson: "Write and Solve Multi-Step Equations",
        lessonNumber: 18,
        title: "Write and Solve Multi-Step Equations",
        volume: 1,
        startPage: 373,
        endPage: 394,
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U4 L18"
      },
      {
        id: "g7-u4-l19",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 4,
        lesson: "Write and Solve Inequalities",
        lessonNumber: 19,
        title: "Write and Solve Inequalities",
        volume: 1,
        startPage: 395,
        endPage: 420,
        sessions: 4,
        majorWork: true,
        originalCode: "G7 U4 L19"
      }
      // Grade 8 advanced content will be integrated here
    ]
  }
];

// Helper functions for working with the accelerated pathway
export class AcceleratedPathwayService {
  
  getAllLessons(): LessonReference[] {
    return ACCELERATED_PATHWAY.flatMap(unit => unit.lessons);
  }
  
  getLessonById(id: string): LessonReference | undefined {
    return this.getAllLessons().find(lesson => lesson.id === id);
  }
  
  getLessonsByGrade(grade: 7 | 8): LessonReference[] {
    return this.getAllLessons().filter(lesson => lesson.grade === grade);
  }
  
  getMajorWorkLessons(): LessonReference[] {
    return this.getAllLessons().filter(lesson => lesson.majorWork);
  }
  
  getSupportingWorkLessons(): LessonReference[] {
    return this.getAllLessons().filter(lesson => !lesson.majorWork);
  }
  
  getViewerUrl(lesson: LessonReference): string {
    const volumeMap = {
      7: { 1: '/viewer/volume1', 2: '/viewer/volume2' },
      8: { 1: '/viewer/grade8-volume1', 2: '/viewer/grade8-volume2' }
    };
    
    const basePath = volumeMap[lesson.grade][lesson.volume];
    return `${basePath}?page=${lesson.startPage}`;
  }
  
  getEstimatedDuration(): number {
    return ACCELERATED_PATHWAY.reduce((total, unit) => total + unit.estimatedDays, 0);
  }
  
  getProgressData() {
    const totalLessons = this.getAllLessons().length;
    const majorWorkLessons = this.getMajorWorkLessons().length;
    const grade7Lessons = this.getLessonsByGrade(7).length;
    const grade8Lessons = this.getLessonsByGrade(8).length;
    
    return {
      totalLessons,
      majorWorkLessons,
      supportingWorkLessons: totalLessons - majorWorkLessons,
      grade7Lessons,
      grade8Lessons,
      estimatedDays: this.getEstimatedDuration()
    };
  }
}

export const acceleratedPathway = new AcceleratedPathwayService();
