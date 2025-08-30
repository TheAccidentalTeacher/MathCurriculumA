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
  navigationId: string; // New: unique identifier for search-based navigation
  searchPattern: string; // New: primary search pattern (e.g., "LESSON 9 | UNDERSTAND SUBTRACTION")
  fallbackPattern?: string; // New: backup search pattern
  estimatedPage?: number; // Optional: rough page estimate for quick jumps
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

// Accelerated pathway lesson sequence - CORRECTED to match official scope and sequence
export const ACCELERATED_PATHWAY: AcceleratedUnit[] = [
  {
    id: "unit-a",
    title: "Unit A: Proportional Relationships: Ratios, Rates, and Circles",
    description: "Foundation concepts for proportional reasoning, essential for algebraic thinking",
    estimatedDays: 17,
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
        navigationId: "lesson-1",
        searchPattern: "LESSON 1 | SOLVE PROBLEMS INVOLVING SCALE",
        fallbackPattern: "Solve Problems Involving Scale",
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
        navigationId: "lesson-2",
        searchPattern: "LESSON 2 | FIND UNIT RATES INVOLVING RATIOS OF FRACTIONS",
        fallbackPattern: "Find Unit Rates Involving Ratios of Fractions",
        sessions: 2,
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
        navigationId: "lesson-3",
        searchPattern: "LESSON 3 | UNDERSTAND PROPORTIONAL RELATIONSHIPS",
        fallbackPattern: "Understand Proportional Relationships",
        sessions: 2,
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
        navigationId: "lesson-4",
        searchPattern: "LESSON 4 | REPRESENT PROPORTIONAL RELATIONSHIPS",
        fallbackPattern: "Represent Proportional Relationships",
        sessions: 3,
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
        navigationId: "lesson-5",
        searchPattern: "LESSON 5 | SOLVE PROPORTIONAL RELATIONSHIP PROBLEMS",
        fallbackPattern: "Solve Proportional Relationship Problems",
        sessions: 2,
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
        navigationId: "lesson-6",
        searchPattern: "LESSON 6 | SOLVE AREA AND CIRCUMFERENCE PROBLEMS INVOLVING CIRCLES",
        fallbackPattern: "Solve Area and Circumference Problems Involving Circles",
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U1 L6"
      }
    ]
  },
  {
    id: "unit-b",
    title: "Unit B: Numbers and Operations: Operations with Rational Numbers",
    description: "Essential number sense for algebraic manipulation",
    estimatedDays: 17,
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
        navigationId: "lesson-7",
        searchPattern: "LESSON 7 | UNDERSTAND ADDITION WITH NEGATIVE INTEGERS",
        fallbackPattern: "Understand Addition with Negative Integers",
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
        navigationId: "lesson-8",
        searchPattern: "LESSON 8 | ADD WITH NEGATIVE NUMBERS",
        fallbackPattern: "Add with Negative Numbers",
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
        navigationId: "lesson-9",
        searchPattern: "LESSON 9 | UNDERSTAND SUBTRACTION WITH NEGATIVE INTEGERS",
        fallbackPattern: "Understand Subtraction with Negative Integers",
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
        navigationId: "lesson-10",
        searchPattern: "LESSON 10 | ADD AND SUBTRACT POSITIVE AND NEGATIVE NUMBERS",
        fallbackPattern: "Add and Subtract Positive and Negative Numbers",
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U2 L10"
      },
      {
        id: "g7-u3-l11",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 3,
        lesson: "Understand Multiplication with Negative Integers",
        lessonNumber: 11,
        title: "Understand Multiplication with Negative Integers",
        volume: 1,
        navigationId: "lesson-11",
        searchPattern: "LESSON 11 | UNDERSTAND MULTIPLICATION WITH NEGATIVE INTEGERS",
        fallbackPattern: "Understand Multiplication with Negative Integers",
        sessions: 1,
        majorWork: true,
        originalCode: "G7 U3 L11"
      },
      {
        id: "g7-u3-l12",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 3,
        lesson: "Multiply and Divide with Negative Numbers",
        lessonNumber: 12,
        title: "Multiply and Divide with Negative Numbers",
        volume: 1,
        navigationId: "lesson-12",
        searchPattern: "LESSON 12 | MULTIPLY AND DIVIDE WITH NEGATIVE NUMBERS",
        fallbackPattern: "Multiply and Divide with Negative Numbers",
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U3 L12"
      },
      {
        id: "g7-u3-l13",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 3,
        lesson: "Express Rational Numbers as Terminating or Repeating Decimals",
        lessonNumber: 13,
        title: "Express Rational Numbers as Terminating or Repeating Decimals",
        volume: 1,
        navigationId: "lesson-13",
        searchPattern: "LESSON 13 | EXPRESS RATIONAL NUMBERS AS TERMINATING OR REPEATING DECIMALS",
        fallbackPattern: "Express Rational Numbers as Terminating or Repeating Decimals",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U3 L13"
      }
    ]
  },
  {
    id: "unit-c",
    title: "Unit C: Expressions and Equations: Applications of Rational Numbers",
    description: "Bridge to algebraic reasoning and equation solving",
    estimatedDays: 14,
    lessons: [
      {
        id: "g7-u3-l14",
        grade: 7,
        unit: "Operations with Rational Numbers",
        unitNumber: 3,
        lesson: "Use the Four Operations with Negative Numbers",
        lessonNumber: 14,
        title: "Use the Four Operations with Negative Numbers",
        volume: 1,
        navigationId: "lesson-14",
        searchPattern: "LESSON 14 | USE THE FOUR OPERATIONS WITH NEGATIVE NUMBERS",
        fallbackPattern: "Use the Four Operations with Negative Numbers",
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U3 L14"
      },
      {
        id: "g7-u4-l15",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 4,
        lesson: "Write Equivalent Expressions Involving Rational Numbers",
        lessonNumber: 15,
        title: "Write Equivalent Expressions Involving Rational Numbers",
        volume: 1,
        navigationId: "lesson-15",
        searchPattern: "LESSON 15 | WRITE EQUIVALENT EXPRESSIONS INVOLVING RATIONAL NUMBERS",
        fallbackPattern: "Write Equivalent Expressions Involving Rational Numbers",
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U4 L15"
      },
      {
        id: "g7-u4-l16",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 4,
        lesson: "Understand Reasons for Rewriting Expressions",
        lessonNumber: 16,
        title: "Understand Reasons for Rewriting Expressions",
        volume: 1,
        navigationId: "lesson-16",
        searchPattern: "LESSON 16 | UNDERSTAND REASONS FOR REWRITING EXPRESSIONS",
        fallbackPattern: "Understand Reasons for Rewriting Expressions",
        sessions: 1,
        majorWork: true,
        originalCode: "G7 U4 L16"
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
        navigationId: "lesson-17",
        searchPattern: "LESSON 17 | UNDERSTAND MULTI-STEP EQUATIONS",
        fallbackPattern: "Understand Multi-Step Equations",
        sessions: 1,
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
        navigationId: "lesson-18",
        searchPattern: "LESSON 18 | WRITE AND SOLVE MULTI-STEP EQUATIONS",
        fallbackPattern: "Write and Solve Multi-Step Equations",
        sessions: 2,
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
        navigationId: "lesson-19",
        searchPattern: "LESSON 19 | WRITE AND SOLVE INEQUALITIES",
        fallbackPattern: "Write and Solve Inequalities",
        sessions: 2,
        majorWork: true,
        originalCode: "G7 U4 L19"
      },
      {
        id: "g7-u5-l20",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 5,
        lesson: "Solve Problems Involving Percents",
        lessonNumber: 20,
        title: "Solve Problems Involving Percents",
        volume: 2,
        navigationId: "lesson-20",
        searchPattern: "LESSON 20 | SOLVE PROBLEMS INVOLVING PERCENTS",
        fallbackPattern: "Solve Problems Involving Percents",
        sessions: 4,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U5 L20"
      },
      {
        id: "g7-u5-l21",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 5,
        lesson: "Solve Problems Involving Percent Change and Percent Error",
        lessonNumber: 21,
        title: "Solve Problems Involving Percent Change and Percent Error",
        volume: 2,
        navigationId: "lesson-21",
        searchPattern: "LESSON 21 | SOLVE PROBLEMS INVOLVING PERCENT CHANGE AND PERCENT ERROR",
        fallbackPattern: "Solve Problems Involving Percent Change and Percent Error",
        sessions: 3,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U5 L21"
      },
      {
        id: "g7-u6-l22",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Understand Random Sampling",
        lessonNumber: 22,
        title: "Understand Random Sampling",
        volume: 2,
        navigationId: "lesson-22",
        searchPattern: "LESSON 22 | UNDERSTAND RANDOM SAMPLING",
        fallbackPattern: "Understand Random Sampling",
        sessions: 1,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U6 L22"
      },
      {
        id: "g7-u6-l23",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Reason About Random Samples",
        lessonNumber: 23,
        title: "Reason About Random Samples",
        volume: 2,
        navigationId: "lesson-23",
        searchPattern: "LESSON 23 | REASON ABOUT RANDOM SAMPLES",
        fallbackPattern: "Reason About Random Samples",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U6 L23"
      },
      {
        id: "g7-u6-l24",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Compare Populations",
        lessonNumber: 24,
        title: "Compare Populations",
        volume: 2,
        navigationId: "lesson-24",
        searchPattern: "LESSON 24 | COMPARE POPULATIONS",
        fallbackPattern: "Compare Populations",
        sessions: 3,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U6 L24"
      }
    ]
  },
  {
    id: "unit-d",
    title: "Unit D: Algebraic Thinking: Solving Equations and Inequalities",
    description: "Core algebraic skills for equation and inequality solving",
    estimatedDays: 14,
    lessons: [
      {
        id: "g7-u4-l17",
        grade: 7,
        unit: "Expressions and Equations",
        unitNumber: 4,
        lesson: "Understand Multi-Step Equations",
        lessonNumber: 17,
        title: "Understand Multi-Step Equations",
        volume: 1,
        navigationId: "lesson-17",
        searchPattern: "LESSON 17 | UNIT D: ALGEBRAIC THINKING: SOLVING EQUATIONS AND INEQUALITIES",
        fallbackPattern: "Unit D: Algebraic Thinking: Solving Equations and Inequalities",
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
        navigationId: "lesson-18",
        searchPattern: "LESSON 18 | WRITE AND SOLVE MULTI-STEP EQUATIONS",
        fallbackPattern: "Write and Solve Multi-Step Equations",
        sessions: 3,
        majorWork: true,
        originalCode: "G7 U4 L18"
      },
      {
        id: "g8-u3-l10",
        grade: 8,
        unit: "Linear Equations",
        unitNumber: 3,
        lesson: "Solve Linear Equations in One Variable",
        lessonNumber: 10,
        title: "Solve Linear Equations in One Variable",
        volume: 1,
        navigationId: "lesson-10",
        searchPattern: "LESSON 10 | SOLVE LINEAR EQUATIONS IN ONE VARIABLE",
        fallbackPattern: "Solve Linear Equations in One Variable",
        sessions: 2,
        majorWork: true,
        originalCode: "G8 U3 L10"
      },
      {
        id: "g8-u3-l11",
        grade: 8,
        unit: "Linear Equations",
        unitNumber: 3,
        lesson: "Determine the Number of Solutions to One-Variable Equations",
        lessonNumber: 11,
        title: "Determine the Number of Solutions to One-Variable Equations",
        volume: 1,
        navigationId: "lesson-11",
        searchPattern: "LESSON 11 | DETERMINE THE NUMBER OF SOLUTIONS TO ONE-VARIABLE EQUATIONS",
        fallbackPattern: "Determine the Number of Solutions to One-Variable Equations",
        sessions: 2,
        majorWork: true,
        originalCode: "G8 U3 L11"
      }
    ]
  },
  {
    id: "unit-e",
    title: "Unit E: Geometry: Angles, Triangles, and Rigid Transformations",
    description: "Spatial reasoning and geometric transformations",
    estimatedDays: 11,
    lessons: [
      {
        id: "g7-u6-l28",
        grade: 7,
        unit: "Geometry",
        unitNumber: 6,
        lesson: "Find Unknown Angle Measures",
        lessonNumber: 28,
        title: "Find Unknown Angle Measures",
        volume: 2,
        navigationId: "lesson-28",
        searchPattern: "LESSON 28 | UNIT E: GEOMETRY: ANGLES, TRIANGLES, AND RIGID TRANSFORMATIONS",
        fallbackPattern: "Unit E: Geometry: Angles, Triangles, and Rigid Transformations",
        sessions: 3,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U6 L28"
      },
      {
        id: "g7-u6-l29",
        grade: 7,
        unit: "Geometry",
        unitNumber: 6,
        lesson: "Draw Plane Figures with Given Conditions",
        lessonNumber: 29,
        title: "Draw Plane Figures with Given Conditions",
        volume: 2,
        navigationId: "lesson-29",
        searchPattern: "LESSON 29 | DRAW PLANE FIGURES WITH GIVEN CONDITIONS",
        fallbackPattern: "Draw Plane Figures with Given Conditions",
        sessions: 3,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U6 L29"
      },
      {
        id: "g8-u1-l1",
        grade: 8,
        unit: "Rigid Transformations",
        unitNumber: 1,
        lesson: "Understand Rigid Transformations and Their Properties",
        lessonNumber: 1,
        title: "Understand Rigid Transformations and Their Properties",
        volume: 1,
        navigationId: "lesson-1",
        searchPattern: "LESSON 1 | UNDERSTAND RIGID TRANSFORMATIONS AND THEIR PROPERTIES",
        fallbackPattern: "Understand Rigid Transformations and Their Properties",
        sessions: 2,
        majorWork: true,
        originalCode: "G8 U1 L1"
      },
      {
        id: "g8-u1-l2",
        grade: 8,
        unit: "Rigid Transformations",
        unitNumber: 1,
        lesson: "Work with Single Rigid Transformations in the Coordinate Plane",
        lessonNumber: 2,
        title: "Work with Single Rigid Transformations in the Coordinate Plane",
        volume: 1,
        navigationId: "lesson-2",
        searchPattern: "LESSON 2 | WORK WITH SINGLE RIGID TRANSFORMATIONS IN THE COORDINATE PLANE",
        fallbackPattern: "Work with Single Rigid Transformations in the Coordinate Plane",
        sessions: 4,
        majorWork: true,
        originalCode: "G8 U1 L2"
      },
      {
        id: "g8-u1-l3",
        grade: 8,
        unit: "Rigid Transformations",
        unitNumber: 1,
        lesson: "Work with Sequences of Transformations and Congruence",
        lessonNumber: 3,
        title: "Work with Sequences of Transformations and Congruence",
        volume: 1,
        navigationId: "lesson-3",
        searchPattern: "LESSON 3 | WORK WITH SEQUENCES OF TRANSFORMATIONS AND CONGRUENCE",
        fallbackPattern: "Work with Sequences of Transformations and Congruence",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U1 L3"
      }
    ]
  },
  {
    id: "unit-f",
    title: "Unit F: Proportional Relationships: Dilations, Similar Triangles, and Slope",
    description: "Advanced proportional reasoning with coordinate geometry",
    estimatedDays: 18,
    lessons: [
      {
        id: "g8-u2-l4",
        grade: 8,
        unit: "Dilations and Similarity",
        unitNumber: 2,
        lesson: "Understand Dilations and Similarity",
        lessonNumber: 4,
        title: "Understand Dilations and Similarity",
        volume: 1,
        navigationId: "lesson-4",
        searchPattern: "LESSON 4 | UNIT F: PROPORTIONAL RELATIONSHIPS: DILATIONS, SIMILAR TRIANGLES, AND SLOPE",
        fallbackPattern: "Unit F: Proportional Relationships: Dilations, Similar Triangles, and Slope",
        sessions: 1,
        majorWork: true,
        originalCode: "G8 U2 L4"
      },
      {
        id: "g8-u2-l5",
        grade: 8,
        unit: "Dilations and Similarity",
        unitNumber: 2,
        lesson: "Perform and Describe Transformations Involving Dilations",
        lessonNumber: 5,
        title: "Perform and Describe Transformations Involving Dilations",
        volume: 1,
        navigationId: "lesson-5",
        searchPattern: "LESSON 5 | PERFORM AND DESCRIBE TRANSFORMATIONS INVOLVING DILATIONS",
        fallbackPattern: "Perform and Describe Transformations Involving Dilations",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U2 L5"
      },
      {
        id: "g8-u2-l6",
        grade: 8,
        unit: "Dilations and Similarity",
        unitNumber: 2,
        lesson: "Describe Angle Relationships",
        lessonNumber: 6,
        title: "Describe Angle Relationships",
        volume: 1,
        navigationId: "lesson-6",
        searchPattern: "LESSON 6 | DESCRIBE ANGLE RELATIONSHIPS",
        fallbackPattern: "Describe Angle Relationships",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U2 L6"
      },
      {
        id: "g8-u2-l7",
        grade: 8,
        unit: "Dilations and Similarity",
        unitNumber: 2,
        lesson: "Describe Angle Relationships in Triangles",
        lessonNumber: 7,
        title: "Describe Angle Relationships in Triangles",
        volume: 1,
        navigationId: "lesson-7",
        searchPattern: "LESSON 7 | DESCRIBE ANGLE RELATIONSHIPS IN TRIANGLES",
        fallbackPattern: "Describe Angle Relationships in Triangles",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U2 L7"
      },
      {
        id: "g8-u2-l8",
        grade: 8,
        unit: "Linear Relationships",
        unitNumber: 2,
        lesson: "Graph Proportional Relationships and Define Slope",
        lessonNumber: 8,
        title: "Graph Proportional Relationships and Define Slope",
        volume: 1,
        navigationId: "lesson-8",
        searchPattern: "LESSON 8 | GRAPH PROPORTIONAL RELATIONSHIPS AND DEFINE SLOPE",
        fallbackPattern: "Graph Proportional Relationships and Define Slope",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U2 L8"
      },
      {
        id: "g8-u2-l9",
        grade: 8,
        unit: "Linear Relationships",
        unitNumber: 2,
        lesson: "Derive and Graph Linear Equations of the Form y = mx + b",
        lessonNumber: 9,
        title: "Derive and Graph Linear Equations of the Form y = mx + b",
        volume: 1,
        navigationId: "lesson-9",
        searchPattern: "LESSON 9 | DERIVE AND GRAPH LINEAR EQUATIONS OF THE FORM Y = MX + B",
        fallbackPattern: "Derive and Graph Linear Equations of the Form y = mx + b",
        sessions: 4,
        majorWork: true,
        originalCode: "G8 U2 L9"
      }
    ]
  },
  {
    id: "unit-g",
    title: "Unit G: Integer Exponents: Properties and Scientific Notation",
    description: "Essential exponent properties for algebraic manipulation",
    estimatedDays: 13,
    lessons: [
      {
        id: "g8-u5-l19",
        grade: 8,
        unit: "Integer Exponents",
        unitNumber: 5,
        lesson: "Apply Exponent Properties for Positive Integer Exponents",
        lessonNumber: 19,
        title: "Apply Exponent Properties for Positive Integer Exponents",
        volume: 2,
        navigationId: "lesson-19",
        searchPattern: "LESSON 19 | UNIT G: INTEGER EXPONENTS: PROPERTIES AND SCIENTIFIC NOTATION",
        fallbackPattern: "Unit G: Integer Exponents: Properties and Scientific Notation",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U5 L19"
      },
      {
        id: "g8-u5-l20",
        grade: 8,
        unit: "Integer Exponents",
        unitNumber: 5,
        lesson: "Apply Exponent Properties for All Integer Exponents",
        lessonNumber: 20,
        title: "Apply Exponent Properties for All Integer Exponents",
        volume: 2,
        navigationId: "lesson-20",
        searchPattern: "LESSON 20 | APPLY EXPONENT PROPERTIES FOR ALL INTEGER EXPONENTS",
        fallbackPattern: "Apply Exponent Properties for All Integer Exponents",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U5 L20"
      },
      {
        id: "g8-u5-l21",
        grade: 8,
        unit: "Integer Exponents",
        unitNumber: 5,
        lesson: "Express Numbers Using Integer Powers of 10",
        lessonNumber: 21,
        title: "Express Numbers Using Integer Powers of 10",
        volume: 2,
        navigationId: "lesson-21",
        searchPattern: "LESSON 21 | EXPRESS NUMBERS USING INTEGER POWERS OF 10",
        fallbackPattern: "Express Numbers Using Integer Powers of 10",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U5 L21"
      },
      {
        id: "g8-u5-l22",
        grade: 8,
        unit: "Integer Exponents",
        unitNumber: 5,
        lesson: "Work with Scientific Notation",
        lessonNumber: 22,
        title: "Work with Scientific Notation",
        volume: 2,
        navigationId: "lesson-22",
        searchPattern: "LESSON 22 | WORK WITH SCIENTIFIC NOTATION",
        fallbackPattern: "Work with Scientific Notation",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U5 L22"
      }
    ]
  },
  {
    id: "unit-h",
    title: "Unit H: Real Numbers: Roots, Rational Numbers, and Irrational Numbers",
    description: "Advanced number system concepts",
    estimatedDays: 8,
    lessons: [
      {
        id: "g8-u6-l23",
        grade: 8,
        unit: "Real Numbers",
        unitNumber: 6,
        lesson: "Find Square Roots and Cube Roots to Solve Problems",
        lessonNumber: 23,
        title: "Find Square Roots and Cube Roots to Solve Problems",
        volume: 2,
        navigationId: "lesson-23",
        searchPattern: "LESSON 23 | UNIT H: REAL NUMBERS: ROOTS, RATIONAL NUMBERS, AND IRRATIONAL NUMBERS",
        fallbackPattern: "Unit H: Real Numbers: Roots, Rational Numbers, and Irrational Numbers",
        sessions: 3,
        majorWork: true,
        originalCode: "G8 U6 L23"
      },
      {
        id: "g8-u6-l24",
        grade: 8,
        unit: "Real Numbers",
        unitNumber: 6,
        lesson: "Express Rational Numbers as Fractions and Decimals",
        lessonNumber: 24,
        title: "Express Rational Numbers as Fractions and Decimals",
        volume: 2,
        navigationId: "lesson-24",
        searchPattern: "LESSON 24 | EXPRESS RATIONAL NUMBERS AS FRACTIONS AND DECIMALS",
        fallbackPattern: "Express Rational Numbers as Fractions and Decimals",
        sessions: 2,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G8 U6 L24"
      },
      {
        id: "g8-u6-l25",
        grade: 8,
        unit: "Real Numbers",
        unitNumber: 6,
        lesson: "Find Rational Approximations of Irrational Numbers",
        lessonNumber: 25,
        title: "Find Rational Approximations of Irrational Numbers",
        volume: 2,
        navigationId: "lesson-25",
        searchPattern: "LESSON 25 | FIND RATIONAL APPROXIMATIONS OF IRRATIONAL NUMBERS",
        fallbackPattern: "Find Rational Approximations of Irrational Numbers",
        sessions: 3,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G8 U6 L25"
      },
      {
        id: "g8-u6-l26",
        grade: 8,
        unit: "Real Numbers",
        unitNumber: 6,
        lesson: "Understand the Pythagorean Theorem and Its Converse",
        lessonNumber: 26,
        title: "Understand the Pythagorean Theorem and Its Converse",
        volume: 2,
        navigationId: "lesson-26",
        searchPattern: "LESSON 26 | UNDERSTAND THE PYTHAGOREAN THEOREM AND ITS CONVERSE",
        fallbackPattern: "Understand the Pythagorean Theorem and Its Converse",
        sessions: 1,
        majorWork: false, // Supporting work per scope
        originalCode: "G8 U6 L26"
      },
      {
        id: "g8-u6-l27",
        grade: 8,
        unit: "Real Numbers",
        unitNumber: 6,
        lesson: "Apply the Pythagorean Theorem",
        lessonNumber: 27,
        title: "Apply the Pythagorean Theorem",
        volume: 2,
        navigationId: "lesson-27",
        searchPattern: "LESSON 27 | APPLY THE PYTHAGOREAN THEOREM",
        fallbackPattern: "Apply the Pythagorean Theorem",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G8 U6 L27"
      }
    ]
  },
  {
    id: "unit-i",
    title: "Unit I: Geometry: Two- and Three-Dimensional Figures",
    description: "Advanced geometry and measurement concepts",
    estimatedDays: 10,
    lessons: [
      {
        id: "g7-u6-l25",
        grade: 7,
        unit: "Geometry and Measurement",
        unitNumber: 6,
        lesson: "Solve Problems Involving Area and Surface Area",
        lessonNumber: 25,
        title: "Solve Problems Involving Area and Surface Area",
        volume: 2,
        navigationId: "lesson-25",
        searchPattern: "LESSON 25 | UNIT I: GEOMETRY: TWO- AND THREE-DIMENSIONAL FIGURES",
        fallbackPattern: "Unit I: Geometry: Two- and Three-Dimensional Figures",
        sessions: 3,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U6 L25"
      },
      {
        id: "g7-u6-l26",
        grade: 7,
        unit: "Geometry and Measurement",
        unitNumber: 6,
        lesson: "Solve Problems Involving Volume",
        lessonNumber: 26,
        title: "Solve Problems Involving Volume",
        volume: 2,
        navigationId: "lesson-26",
        searchPattern: "LESSON 26 | SOLVE PROBLEMS INVOLVING VOLUME",
        fallbackPattern: "Solve Problems Involving Volume",
        sessions: 3,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U6 L26"
      },
      {
        id: "g7-u6-l27",
        grade: 7,
        unit: "Geometry and Measurement",
        unitNumber: 6,
        lesson: "Describe Plane Sections of Three-Dimensional Figures",
        lessonNumber: 27,
        title: "Describe Plane Sections of Three-Dimensional Figures",
        volume: 2,
        navigationId: "lesson-27",
        searchPattern: "LESSON 27 | DESCRIBE PLANE SECTIONS OF THREE-DIMENSIONAL FIGURES",
        fallbackPattern: "Describe Plane Sections of Three-Dimensional Figures",
        sessions: 2,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U6 L27"
      },
      {
        id: "g7-u8-l28",
        grade: 7,
        unit: "Geometry",
        unitNumber: 8,
        lesson: "Find Unknown Angle Measures",
        lessonNumber: 28,
        title: "Find Unknown Angle Measures",
        volume: 2,
        navigationId: "lesson-28",
        searchPattern: "LESSON 28 | FIND UNKNOWN ANGLE MEASURES",
        fallbackPattern: "Find Unknown Angle Measures",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U8 L28"
      },
      {
        id: "g7-u8-l29",
        grade: 7,
        unit: "Geometry",
        unitNumber: 8,
        lesson: "Draw Plane Figures with Given Conditions",
        lessonNumber: 29,
        title: "Draw Plane Figures with Given Conditions",
        volume: 2,
        navigationId: "lesson-29",
        searchPattern: "LESSON 29 | DRAW PLANE FIGURES WITH GIVEN CONDITIONS",
        fallbackPattern: "Draw Plane Figures with Given Conditions",
        sessions: 3,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U8 L29"
      },
      {
        id: "g7-u9-l30",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 9,
        lesson: "Understand Probability",
        lessonNumber: 30,
        title: "Understand Probability",
        volume: 2,
        navigationId: "lesson-30",
        searchPattern: "LESSON 30 | UNDERSTAND PROBABILITY",
        fallbackPattern: "Understand Probability",
        sessions: 1,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U9 L30"
      },
      {
        id: "g7-u9-l31",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 9,
        lesson: "Solve Problems Involving Experimental Probability",
        lessonNumber: 31,
        title: "Solve Problems Involving Experimental Probability",
        volume: 2,
        navigationId: "lesson-31",
        searchPattern: "LESSON 31 | SOLVE PROBLEMS INVOLVING EXPERIMENTAL PROBABILITY",
        fallbackPattern: "Solve Problems Involving Experimental Probability",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U9 L31"
      },
      {
        id: "g7-u9-l32",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 9,
        lesson: "Solve Problems Involving Probability Models",
        lessonNumber: 32,
        title: "Solve Problems Involving Probability Models",
        volume: 2,
        navigationId: "lesson-32",
        searchPattern: "LESSON 32 | SOLVE PROBLEMS INVOLVING PROBABILITY MODELS",
        fallbackPattern: "Solve Problems Involving Probability Models",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U9 L32"
      },
      {
        id: "g7-u9-l33",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 9,
        lesson: "Solve Problems Involving Compound Events",
        lessonNumber: 33,
        title: "Solve Problems Involving Compound Events",
        volume: 2,
        navigationId: "lesson-33",
        searchPattern: "LESSON 33 | SOLVE PROBLEMS INVOLVING COMPOUND EVENTS",
        fallbackPattern: "Solve Problems Involving Compound Events",
        sessions: 3,
        majorWork: false, // Supporting work per scope
        originalCode: "G7 U9 L33"
      },
      {
        id: "g8-u6-l28",
        grade: 8,
        unit: "Volume and Surface Area",
        unitNumber: 6,
        lesson: "Solve Problems with Volumes of Cylinders, Cones, and Spheres",
        lessonNumber: 28,
        title: "Solve Problems with Volumes of Cylinders, Cones, and Spheres",
        volume: 2,
        navigationId: "lesson-28",
        searchPattern: "LESSON 28 | SOLVE PROBLEMS WITH VOLUMES OF CYLINDERS, CONES, AND SPHERES",
        fallbackPattern: "Solve Problems with Volumes of Cylinders, Cones, and Spheres",
        sessions: 2,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G8 U6 L28"
      },
      {
        id: "g8-u7-l29",
        grade: 8,
        unit: "Statistics and Data Analysis",
        unitNumber: 7,
        lesson: "Analyze Scatter Plots and Fit a Linear Model to Data",
        lessonNumber: 29,
        title: "Analyze Scatter Plots and Fit a Linear Model to Data",
        volume: 2,
        navigationId: "lesson-29",
        searchPattern: "LESSON 29 | ANALYZE SCATTER PLOTS AND FIT A LINEAR MODEL TO DATA",
        fallbackPattern: "Analyze Scatter Plots and Fit a Linear Model to Data",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G8 U7 L29"
      },
      {
        id: "g8-u7-l30",
        grade: 8,
        unit: "Statistics and Data Analysis",
        unitNumber: 7,
        lesson: "Write and Analyze an Equation for Fitting a Linear Model",
        lessonNumber: 30,
        title: "Write and Analyze an Equation for Fitting a Linear Model",
        volume: 2,
        navigationId: "lesson-30",
        searchPattern: "LESSON 30 | WRITE AND ANALYZE AN EQUATION FOR FITTING A LINEAR MODEL",
        fallbackPattern: "Write and Analyze an Equation for Fitting a Linear Model",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G8 U7 L30"
      },
      {
        id: "g8-u8-l31",
        grade: 8,
        unit: "Statistics and Probability",
        unitNumber: 8,
        lesson: "Understand Two-Way Tables",
        lessonNumber: 31,
        title: "Understand Two-Way Tables",
        volume: 2,
        navigationId: "lesson-31",
        searchPattern: "LESSON 31 | UNDERSTAND TWO-WAY TABLES",
        fallbackPattern: "Understand Two-Way Tables",
        sessions: 1,
        majorWork: false, // Supporting work per scope
        originalCode: "G8 U8 L31"
      },
      {
        id: "g8-u8-l32",
        grade: 8,
        unit: "Statistics and Probability",
        unitNumber: 8,
        lesson: "Construct and Interpret Two-Way Tables",
        lessonNumber: 32,
        title: "Construct and Interpret Two-Way Tables",
        volume: 2,
        navigationId: "lesson-32",
        searchPattern: "LESSON 32 | CONSTRUCT AND INTERPRET TWO-WAY TABLES",
        fallbackPattern: "Construct and Interpret Two-Way Tables",
        sessions: 2,
        majorWork: false, // Supporting work per scope
        originalCode: "G8 U8 L32"
      }
    ]
  },
  {
    id: "unit-j",
    title: "Unit J: Statistics and Probability: Sampling and Probability",
    description: "Statistical reasoning and probability concepts",
    estimatedDays: 16,
    lessons: [
      {
        id: "g7-u5-l22",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 5,
        lesson: "Understand Random Sampling",
        lessonNumber: 22,
        title: "Understand Random Sampling",
        volume: 2,
        navigationId: "lesson-22",
        searchPattern: "LESSON 22 | UNIT J: STATISTICS AND PROBABILITY: SAMPLING AND PROBABILITY",
        fallbackPattern: "Unit J: Statistics and Probability: Sampling and Probability",
        sessions: 1,
        majorWork: false, // Supporting work - "Just Exp/Dev"
        originalCode: "G7 U5 L22"
      },
      {
        id: "g7-u5-l23",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 5,
        lesson: "Reason About Random Samples",
        lessonNumber: 23,
        title: "Reason About Random Samples",
        volume: 2,
        navigationId: "lesson-23",
        searchPattern: "LESSON 23 | REASON ABOUT RANDOM SAMPLES",
        fallbackPattern: "Reason About Random Samples",
        sessions: 2,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U5 L23"
      },
      {
        id: "g7-u5-l24",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 5,
        lesson: "Compare Populations",
        lessonNumber: 24,
        title: "Compare Populations",
        volume: 2,
        navigationId: "lesson-24",
        searchPattern: "LESSON 24 | COMPARE POPULATIONS",
        fallbackPattern: "Compare Populations",
        sessions: 3,
        majorWork: false, // Supporting work - "Just Develop"
        originalCode: "G7 U5 L24"
      },
      {
        id: "g7-u6-l30",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Understand Probability",
        lessonNumber: 30,
        title: "Understand Probability",
        volume: 2,
        navigationId: "lesson-30",
        searchPattern: "LESSON 30 | UNDERSTAND PROBABILITY",
        fallbackPattern: "Understand Probability",
        sessions: 1,
        majorWork: false, // Supporting work - "Explore/Dev only"
        originalCode: "G7 U6 L30"
      },
      {
        id: "g7-u6-l31",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Solve Problems Involving Experimental Probability",
        lessonNumber: 31,
        title: "Solve Problems Involving Experimental Probability",
        volume: 2,
        navigationId: "lesson-31",
        searchPattern: "LESSON 31 | SOLVE PROBLEMS INVOLVING EXPERIMENTAL PROBABILITY",
        fallbackPattern: "Solve Problems Involving Experimental Probability",
        sessions: 3,
        majorWork: false, // Supporting work - "Develop Only"
        originalCode: "G7 U6 L31"
      },
      {
        id: "g7-u6-l32",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Solve Problems Involving Probability Models",
        lessonNumber: 32,
        title: "Solve Problems Involving Probability Models",
        volume: 2,
        navigationId: "lesson-32",
        searchPattern: "LESSON 32 | SOLVE PROBLEMS INVOLVING PROBABILITY MODELS",
        fallbackPattern: "Solve Problems Involving Probability Models",
        sessions: 3,
        majorWork: false, // Supporting work - "Develop Only"
        originalCode: "G7 U6 L32"
      },
      {
        id: "g7-u6-l33",
        grade: 7,
        unit: "Statistics and Probability",
        unitNumber: 6,
        lesson: "Solve Problems Involving Compound Events",
        lessonNumber: 33,
        title: "Solve Problems Involving Compound Events",
        volume: 2,
        navigationId: "lesson-33",
        searchPattern: "LESSON 33 | SOLVE PROBLEMS INVOLVING COMPOUND EVENTS",
        fallbackPattern: "Solve Problems Involving Compound Events",
        sessions: 3,
        majorWork: false, // Supporting work - "Develop Only"
        originalCode: "G7 U6 L33"
      }
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
    
    const basePath = volumeMap[lesson.grade]?.[lesson.volume];
    if (!basePath) {
      throw new Error(`Invalid grade/volume combination: Grade ${lesson.grade}, Volume ${lesson.volume}`);
    }
    
    // New search-based navigation system
    // Instead of unreliable page numbers, we'll search for the lesson pattern
    const searchParams = new URLSearchParams({
      navigationId: lesson.navigationId,
      searchPattern: lesson.searchPattern,
      lessonNumber: lesson.lessonNumber.toString(),
      ...(lesson.fallbackPattern && { fallbackPattern: lesson.fallbackPattern }),
      ...(lesson.estimatedPage && { estimatedPage: lesson.estimatedPage.toString() })
    });
    
    return `${basePath}?${searchParams.toString()}`;
  }
  
  getEstimatedDuration(): number {
    return ACCELERATED_PATHWAY.reduce((total, unit) => total + unit.estimatedDays, 0);
  }
  
  getTotalSessions(): number {
    return this.getAllLessons().reduce((total, lesson) => total + lesson.sessions, 0);
  }
  
  getProgressData() {
    const totalLessons = this.getAllLessons().length;
    const majorWorkLessons = this.getMajorWorkLessons().length;
    const grade7Lessons = this.getLessonsByGrade(7).length;
    const grade8Lessons = this.getLessonsByGrade(8).length;
    const totalSessions = this.getTotalSessions();
    
    return {
      totalLessons,
      majorWorkLessons,
      supportingWorkLessons: totalLessons - majorWorkLessons,
      grade7Lessons,
      grade8Lessons,
      estimatedDays: this.getEstimatedDuration(),
      totalSessions
    };
  }
}

export const acceleratedPathway = new AcceleratedPathwayService();
