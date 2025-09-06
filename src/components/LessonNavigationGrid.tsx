'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Lesson {
  number: number;
  title: string;
  sessions: number;
  startPage: number;
  endPage: number;
  isMajorWork?: boolean;
  standards?: string[];
}

interface Unit {
  number: number;
  title: string;
  description: string;
  lessons: Lesson[];
  totalLessons: number;
  estimatedDays: number;
  majorWorkCount: number;
}

interface Grade {
  level: number;
  title: string;
  volume1: Unit[];
  volume2: Unit[];
}

// Comprehensive lesson data for all grades
const GRADE_DATA: Grade[] = [
  {
    level: 6,
    title: "Grade 6 Mathematics",
    volume1: [
      {
        number: 1,
        title: "Area and Surface Area",
        description: "Area of parallelograms, triangles, and surface area",
        totalLessons: 7,
        estimatedDays: 28,
        majorWorkCount: 7,
        lessons: [
          { number: 1, title: "Find the Area of a Parallelogram", sessions: 3, startPage: 3, endPage: 18, isMajorWork: true },
          { number: 2, title: "Find the Area of Triangles", sessions: 3, startPage: 19, endPage: 30, isMajorWork: true },
          { number: 3, title: "Find the Area of Polygons", sessions: 3, startPage: 31, endPage: 40, isMajorWork: true },
          { number: 4, title: "Use Nets to Find Surface Area", sessions: 3, startPage: 41, endPage: 52, isMajorWork: true },
          { number: 5, title: "Find Surface Area of Prisms", sessions: 3, startPage: 53, endPage: 62, isMajorWork: true },
          { number: 6, title: "Find Surface Area of Pyramids", sessions: 4, startPage: 63, endPage: 76, isMajorWork: true },
          { number: 7, title: "Solve Surface Area Problems", sessions: 4, startPage: 77, endPage: 90, isMajorWork: true }
        ]
      },
      {
        number: 2,
        title: "Algebraic Expressions",
        description: "Writing and evaluating algebraic expressions",
        totalLessons: 6,
        estimatedDays: 24,
        majorWorkCount: 6,
        lessons: [
          { number: 8, title: "Work with Algebraic Expressions", sessions: 3, startPage: 91, endPage: 102, isMajorWork: true },
          { number: 9, title: "Write Equivalent Expressions", sessions: 3, startPage: 103, endPage: 114, isMajorWork: true },
          { number: 10, title: "Evaluate Expressions", sessions: 3, startPage: 115, endPage: 126, isMajorWork: true },
          { number: 11, title: "Write and Evaluate Expressions with Exponents", sessions: 4, startPage: 127, endPage: 140, isMajorWork: true },
          { number: 12, title: "Find Greatest Common Factor", sessions: 3, startPage: 141, endPage: 152, isMajorWork: true },
          { number: 13, title: "Find Least Common Multiple", sessions: 3, startPage: 153, endPage: 164, isMajorWork: true }
        ]
      },
      {
        number: 3,
        title: "Operations with Decimals",
        description: "Adding, subtracting, multiplying, and dividing decimals",
        totalLessons: 7,
        estimatedDays: 28,
        majorWorkCount: 7,
        lessons: [
          { number: 14, title: "Add and Subtract Multi-Digit Decimals", sessions: 3, startPage: 165, endPage: 176, isMajorWork: true },
          { number: 15, title: "Multiply Multi-Digit Decimals", sessions: 3, startPage: 177, endPage: 188, isMajorWork: true },
          { number: 16, title: "Divide Whole Numbers", sessions: 3, startPage: 189, endPage: 200, isMajorWork: true },
          { number: 17, title: "Divide Multi-Digit Decimals", sessions: 4, startPage: 201, endPage: 214, isMajorWork: true },
          { number: 18, title: "Solve Decimal Problems", sessions: 3, startPage: 215, endPage: 226, isMajorWork: true },
          { number: 19, title: "Estimate with Decimals", sessions: 3, startPage: 227, endPage: 238, isMajorWork: true },
          { number: 20, title: "Apply Decimal Operations", sessions: 4, startPage: 239, endPage: 252, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 4,
        title: "Operations with Fractions",
        description: "Division with fractions and volume problems",
        totalLessons: 7,
        estimatedDays: 28,
        majorWorkCount: 7,
        lessons: [
          { number: 21, title: "Understand Division with Fractions", sessions: 3, startPage: 253, endPage: 264, isMajorWork: true },
          { number: 22, title: "Divide Fractions by Whole Numbers", sessions: 3, startPage: 265, endPage: 276, isMajorWork: true },
          { number: 23, title: "Divide Whole Numbers by Fractions", sessions: 3, startPage: 277, endPage: 288, isMajorWork: true },
          { number: 24, title: "Divide Fractions by Fractions", sessions: 4, startPage: 289, endPage: 302, isMajorWork: true },
          { number: 25, title: "Solve Problems with Fraction Division", sessions: 3, startPage: 303, endPage: 314, isMajorWork: true },
          { number: 26, title: "Find Volume with Fractions", sessions: 3, startPage: 315, endPage: 326, isMajorWork: true },
          { number: 27, title: "Solve Volume Problems with Fractions", sessions: 4, startPage: 327, endPage: 340, isMajorWork: true }
        ]
      },
      {
        number: 5,
        title: "Ratios and Rates",
        description: "Ratio concepts, equivalent ratios, and rates",
        totalLessons: 6,
        estimatedDays: 24,
        majorWorkCount: 6,
        lessons: [
          { number: 28, title: "Understand Ratio Concepts", sessions: 3, startPage: 341, endPage: 352, isMajorWork: true },
          { number: 29, title: "Find Equivalent Ratios", sessions: 4, startPage: 353, endPage: 366, isMajorWork: true },
          { number: 30, title: "Use Part-to-Part and Part-to-Whole Ratios", sessions: 3, startPage: 367, endPage: 378, isMajorWork: true },
          { number: 31, title: "Understand Rate Concepts", sessions: 3, startPage: 379, endPage: 390, isMajorWork: true },
          { number: 32, title: "Solve Unit Rate Problems", sessions: 4, startPage: 391, endPage: 404, isMajorWork: true },
          { number: 33, title: "Solve Percent Problems", sessions: 4, startPage: 405, endPage: 418, isMajorWork: true }
        ]
      }
    ]
  },
  {
    level: 7,
    title: "Grade 7 Mathematics",
    volume1: [
      {
        number: 1,
        title: "Ratio and Proportional Relationships",
        description: "Scale, unit rates, and proportional reasoning",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 1, title: "Solve Problems Involving Scale", sessions: 3, startPage: 17, endPage: 32, isMajorWork: true },
          { number: 2, title: "Find Unit Rates Involving Ratios of Fractions", sessions: 4, startPage: 45, endPage: 60, isMajorWork: true },
          { number: 3, title: "Understand Proportional Relationships", sessions: 4, startPage: 61, endPage: 72, isMajorWork: true },
          { number: 4, title: "Represent Proportional Relationships", sessions: 5, startPage: 73, endPage: 94, isMajorWork: true },
          { number: 5, title: "Solve Proportional Relationship Problems", sessions: 4, startPage: 95, endPage: 110, isMajorWork: true }
        ]
      },
      {
        number: 2,
        title: "The Number System",
        description: "Operations with rational numbers",
        totalLessons: 4,
        estimatedDays: 16,
        majorWorkCount: 4,
        lessons: [
          { number: 6, title: "Understand Addition with Negative Integers", sessions: 3, startPage: 149, endPage: 160, isMajorWork: true },
          { number: 7, title: "Add and Subtract with Negative Numbers", sessions: 4, startPage: 161, endPage: 220, isMajorWork: true },
          { number: 8, title: "Multiply and Divide with Negative Numbers", sessions: 5, startPage: 221, endPage: 264, isMajorWork: true },
          { number: 9, title: "Solve Problems with Rational Numbers", sessions: 4, startPage: 265, endPage: 324, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 3,
        title: "Expressions and Equations",
        description: "Algebraic expressions and linear equations",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 10, title: "Write and Simplify Algebraic Expressions", sessions: 3, startPage: 1, endPage: 12, isMajorWork: true },
          { number: 11, title: "Expand and Factor Expressions", sessions: 4, startPage: 13, endPage: 26, isMajorWork: true },
          { number: 12, title: "Add and Subtract Linear Expressions", sessions: 3, startPage: 27, endPage: 38, isMajorWork: true },
          { number: 13, title: "Write and Solve Linear Equations", sessions: 4, startPage: 39, endPage: 52, isMajorWork: true },
          { number: 14, title: "Solve Multi-Step Linear Equations", sessions: 4, startPage: 53, endPage: 66, isMajorWork: true }
        ]
      },
      {
        number: 4,
        title: "Geometry",
        description: "Angle relationships and geometric constructions",
        totalLessons: 4,
        estimatedDays: 16,
        majorWorkCount: 4,
        lessons: [
          { number: 15, title: "Understand Angle Relationships", sessions: 3, startPage: 67, endPage: 78, isMajorWork: true },
          { number: 16, title: "Draw Geometric Shapes", sessions: 3, startPage: 79, endPage: 90, isMajorWork: true },
          { number: 17, title: "Find Circumference and Area of Circles", sessions: 4, startPage: 91, endPage: 104, isMajorWork: true },
          { number: 18, title: "Understand and Calculate Volume", sessions: 4, startPage: 105, endPage: 118, isMajorWork: true }
        ]
      },
      {
        number: 5,
        title: "Statistics and Probability",
        description: "Data analysis and probability concepts",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 19, title: "Understand Statistical Questions", sessions: 3, startPage: 119, endPage: 130, isMajorWork: true },
          { number: 20, title: "Display Data in Dot Plots and Histograms", sessions: 4, startPage: 131, endPage: 144, isMajorWork: true },
          { number: 21, title: "Display Data in Box Plots", sessions: 3, startPage: 145, endPage: 156, isMajorWork: true },
          { number: 22, title: "Compare Statistical Measures", sessions: 4, startPage: 157, endPage: 170, isMajorWork: true },
          { number: 23, title: "Use Sampling to Draw Inferences", sessions: 4, startPage: 171, endPage: 184, isMajorWork: true }
        ]
      },
      {
        number: 6,
        title: "Probability",
        description: "Probability models and compound events",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 24, title: "Understand Probability", sessions: 3, startPage: 185, endPage: 196, isMajorWork: true },
          { number: 25, title: "Develop Probability Models", sessions: 3, startPage: 197, endPage: 208, isMajorWork: true },
          { number: 26, title: "Find Probability of Compound Events", sessions: 4, startPage: 209, endPage: 222, isMajorWork: true },
          { number: 27, title: "Simulate Compound Events", sessions: 4, startPage: 223, endPage: 236, isMajorWork: true },
          { number: 28, title: "Find Probability Using Sample Spaces", sessions: 4, startPage: 237, endPage: 250, isMajorWork: true }
        ]
      },
      {
        number: 7,
        title: "Advanced Probability",
        description: "Complex probability applications",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 29, title: "Calculate Conditional Probability", sessions: 4, startPage: 251, endPage: 264, isMajorWork: true },
          { number: 30, title: "Analyze Two-Way Tables", sessions: 4, startPage: 265, endPage: 278, isMajorWork: true },
          { number: 31, title: "Design and Conduct Surveys", sessions: 3, startPage: 279, endPage: 290, isMajorWork: true },
          { number: 32, title: "Understand Experimental Design", sessions: 4, startPage: 291, endPage: 304, isMajorWork: true },
          { number: 33, title: "Draw Conclusions from Data", sessions: 4, startPage: 305, endPage: 318, isMajorWork: true }
        ]
      }
    ]
  },
  {
    level: 8,
    title: "Grade 8 Mathematics",
    volume1: [
      {
        number: 1,
        title: "Rigid Transformations and Congruence", 
        description: "Transformations, rotations, reflections, and translations",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 1, title: "Understand Rigid Transformations and Their Properties", sessions: 3, startPage: 17, endPage: 28, isMajorWork: true },
          { number: 2, title: "Work with Single Rigid Transformations", sessions: 4, startPage: 29, endPage: 44, isMajorWork: true },
          { number: 3, title: "Work with Sequences of Transformations", sessions: 3, startPage: 45, endPage: 66, isMajorWork: true },
          { number: 4, title: "Understand Congruence", sessions: 4, startPage: 67, endPage: 96, isMajorWork: true },
          { number: 5, title: "Understand Dilations and Similarity", sessions: 3, startPage: 97, endPage: 120, isMajorWork: false }
        ]
      },
      {
        number: 2,
        title: "Dilations, Similarity, and Slope",
        description: "Similarity transformations and coordinate geometry",
        totalLessons: 4,
        estimatedDays: 16,
        majorWorkCount: 4,
        lessons: [
          { number: 6, title: "Understand Similarity", sessions: 3, startPage: 121, endPage: 136, isMajorWork: true },
          { number: 7, title: "Understand Slope", sessions: 4, startPage: 137, endPage: 156, isMajorWork: true },
          { number: 8, title: "Derive Linear Equations", sessions: 4, startPage: 157, endPage: 176, isMajorWork: true },
          { number: 9, title: "Linear Relationships", sessions: 3, startPage: 177, endPage: 194, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 3,
        title: "Exponents and Scientific Notation",
        description: "Properties of exponents and scientific notation",
        totalLessons: 5,
        estimatedDays: 20,
        majorWorkCount: 5,
        lessons: [
          { number: 10, title: "Apply Exponent Properties for Integer Exponents", sessions: 4, startPage: 17, endPage: 60, isMajorWork: true },
          { number: 11, title: "Express Numbers Using Integer Powers of 10", sessions: 4, startPage: 61, endPage: 82, isMajorWork: true },
          { number: 12, title: "Work with Scientific Notation", sessions: 5, startPage: 83, endPage: 128, isMajorWork: true },
          { number: 13, title: "Compare and Calculate with Scientific Notation", sessions: 3, startPage: 129, endPage: 146, isMajorWork: true },
          { number: 14, title: "Solve Problems with Scientific Notation", sessions: 4, startPage: 147, endPage: 166, isMajorWork: true }
        ]
      },
      {
        number: 4,
        title: "Roots and Irrational Numbers",
        description: "Square roots, cube roots, and rational approximations",
        totalLessons: 4,
        estimatedDays: 16,
        majorWorkCount: 4,
        lessons: [
          { number: 15, title: "Find Square Roots and Cube Roots", sessions: 4, startPage: 167, endPage: 188, isMajorWork: true },
          { number: 16, title: "Express Rational Numbers as Decimals", sessions: 3, startPage: 189, endPage: 206, isMajorWork: true },
          { number: 17, title: "Find Rational Approximations of Irrational Numbers", sessions: 4, startPage: 207, endPage: 226, isMajorWork: true },
          { number: 18, title: "Solve Problems with Irrational Numbers", sessions: 3, startPage: 227, endPage: 244, isMajorWork: true }
        ]
      },
      {
        number: 5,
        title: "The Pythagorean Theorem",
        description: "Pythagorean theorem and its applications",
        totalLessons: 4,
        estimatedDays: 16,
        majorWorkCount: 4,
        lessons: [
          { number: 19, title: "Understand the Pythagorean Theorem", sessions: 3, startPage: 245, endPage: 262, isMajorWork: true },
          { number: 20, title: "Apply the Pythagorean Theorem", sessions: 4, startPage: 263, endPage: 284, isMajorWork: true },
          { number: 21, title: "Use the Pythagorean Theorem in 3D", sessions: 4, startPage: 285, endPage: 306, isMajorWork: true },
          { number: 22, title: "Find Distance Using the Pythagorean Theorem", sessions: 3, startPage: 307, endPage: 324, isMajorWork: true }
        ]
      },
      {
        number: 6,
        title: "Volume and Surface Area",
        description: "Volumes of cylinders, cones, and spheres",
        totalLessons: 4,
        estimatedDays: 16,
        majorWorkCount: 4,
        lessons: [
          { number: 23, title: "Find Volume of Cylinders", sessions: 3, startPage: 325, endPage: 342, isMajorWork: true },
          { number: 24, title: "Find Volume of Cones", sessions: 3, startPage: 343, endPage: 360, isMajorWork: true },
          { number: 25, title: "Find Volume of Spheres", sessions: 4, startPage: 361, endPage: 382, isMajorWork: true },
          { number: 26, title: "Solve Volume Problems", sessions: 4, startPage: 383, endPage: 404, isMajorWork: true }
        ]
      },
      {
        number: 7,
        title: "Statistics and Data Analysis",
        description: "Scatter plots, linear models, and two-way tables",
        totalLessons: 6,
        estimatedDays: 24,
        majorWorkCount: 6,
        lessons: [
          { number: 27, title: "Analyze Scatter Plots", sessions: 3, startPage: 405, endPage: 422, isMajorWork: true },
          { number: 28, title: "Fit Linear Models to Data", sessions: 4, startPage: 423, endPage: 444, isMajorWork: true },
          { number: 29, title: "Write Equations for Linear Models", sessions: 3, startPage: 445, endPage: 462, isMajorWork: true },
          { number: 30, title: "Understand Two-Way Tables", sessions: 3, startPage: 463, endPage: 480, isMajorWork: true },
          { number: 31, title: "Construct and Interpret Two-Way Tables", sessions: 4, startPage: 481, endPage: 502, isMajorWork: true },
          { number: 32, title: "Analyze Associations in Two-Way Tables", sessions: 4, startPage: 503, endPage: 524, isMajorWork: true }
        ]
      }
    ]
  },
  {
    level: 9,
    title: "Algebra 1",
    volume1: [
      {
        number: 1,
        title: "Expressions and Equations",
        description: "Algebraic expressions, linear equations, and systems",
        totalLessons: 4,
        estimatedDays: 20,
        majorWorkCount: 4,
        lessons: [
          { number: 1, title: "Linear and Exponential Functions", sessions: 7, startPage: 1, endPage: 29, isMajorWork: true },
          { number: 2, title: "Piecewise Functions", sessions: 5, startPage: 30, endPage: 48, isMajorWork: true },
          { number: 3, title: "Arithmetic and Geometric Sequences", sessions: 6, startPage: 49, endPage: 72, isMajorWork: true },
          { number: 4, title: "Linear Functions and their Properties", sessions: 8, startPage: 73, endPage: 104, isMajorWork: true }
        ]
      },
      {
        number: 2,
        title: "Linear Functions",
        description: "Graphing linear functions and analyzing relationships",
        totalLessons: 4,
        estimatedDays: 20,
        majorWorkCount: 4,
        lessons: [
          { number: 5, title: "Solving Linear Equations in One Variable", sessions: 6, startPage: 105, endPage: 130, isMajorWork: true },
          { number: 6, title: "Writing Expressions and Equations to Solve Problems", sessions: 7, startPage: 131, endPage: 158, isMajorWork: true },
          { number: 7, title: "Linear Inequalities in One Variable", sessions: 5, startPage: 159, endPage: 179, isMajorWork: true },
          { number: 8, title: "Compound Inequalities", sessions: 4, startPage: 180, endPage: 195, isMajorWork: true }
        ]
      },
      {
        number: 3,
        title: "Systems of Linear Equations",
        description: "Solving systems using various methods",
        totalLessons: 3,
        estimatedDays: 15,
        majorWorkCount: 3,
        lessons: [
          { number: 9, title: "Systems of Linear Equations in Two Variables", sessions: 8, startPage: 196, endPage: 230, isMajorWork: true },
          { number: 10, title: "Systems of Linear Inequalities in Two Variables", sessions: 6, startPage: 231, endPage: 256, isMajorWork: true },
          { number: 11, title: "Linear Programming", sessions: 5, startPage: 257, endPage: 277, isMajorWork: true }
        ]
      },
      {
        number: 4,
        title: "Functions and Modeling",
        description: "Function notation, domain, range, and modeling",
        totalLessons: 3,
        estimatedDays: 15,
        majorWorkCount: 3,
        lessons: [
          { number: 12, title: "Functions and Function Notation", sessions: 7, startPage: 278, endPage: 308, isMajorWork: true },
          { number: 13, title: "Interpreting Functions", sessions: 6, startPage: 309, endPage: 335, isMajorWork: true },
          { number: 14, title: "Building Functions", sessions: 8, startPage: 336, endPage: 372, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 5,
        title: "Exponential Functions",
        description: "Exponential growth, decay, and applications",
        totalLessons: 4,
        estimatedDays: 20,
        majorWorkCount: 4,
        lessons: [
          { number: 15, title: "Introduction to Exponential Functions", sessions: 6, startPage: 1, endPage: 26, isMajorWork: true },
          { number: 16, title: "Exponential Growth and Decay", sessions: 7, startPage: 27, endPage: 56, isMajorWork: true },
          { number: 17, title: "Geometric Sequences and Exponential Functions", sessions: 5, startPage: 57, endPage: 77, isMajorWork: true },
          { number: 18, title: "Exponential Models", sessions: 8, startPage: 78, endPage: 114, isMajorWork: true }
        ]
      },
      {
        number: 6,
        title: "Quadratic Functions",
        description: "Quadratic equations, graphing, and applications",
        totalLessons: 6,
        estimatedDays: 30,
        majorWorkCount: 6,
        lessons: [
          { number: 19, title: "Introduction to Quadratic Functions", sessions: 6, startPage: 115, endPage: 142, isMajorWork: true },
          { number: 20, title: "Solving Quadratic Equations", sessions: 8, startPage: 143, endPage: 178, isMajorWork: true },
          { number: 21, title: "Quadratic Formula and Discriminant", sessions: 7, startPage: 179, endPage: 212, isMajorWork: true },
          { number: 22, title: "Graphing Quadratic Functions", sessions: 6, startPage: 213, endPage: 244, isMajorWork: true },
          { number: 23, title: "Quadratic Models and Applications", sessions: 5, startPage: 245, endPage: 270, isMajorWork: true },
          { number: 24, title: "Completing the Square and Vertex Form", sessions: 6, startPage: 271, endPage: 300, isMajorWork: true }
        ]
      },
      {
        number: 7,
        title: "Statistics and Data Analysis",
        description: "Data analysis, regression, and statistical inference",
        totalLessons: 4,
        estimatedDays: 20,
        majorWorkCount: 4,
        lessons: [
          { number: 25, title: "Interpreting Categorical and Quantitative Data", sessions: 7, startPage: 301, endPage: 334, isMajorWork: true },
          { number: 26, title: "Linear Regression and Correlation", sessions: 8, startPage: 335, endPage: 372, isMajorWork: true },
          { number: 27, title: "Residuals and Goodness of Fit", sessions: 6, startPage: 373, endPage: 404, isMajorWork: true },
          { number: 28, title: "Two-Way Frequency Tables", sessions: 5, startPage: 405, endPage: 430, isMajorWork: true }
        ]
      }
    ]
  }
];

export function LessonNavigationGrid() {
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set([6, 7, 8]));
  const [expandedVolumes, setExpandedVolumes] = useState<Set<string>>(new Set(['grade6-v1', 'grade7-v1', 'grade8-v1']));
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(['grade6-v1-unit1', 'grade7-v1-unit1', 'grade8-v1-unit1']));

  const toggleGrade = (grade: number) => {
    const newExpanded = new Set(expandedGrades);
    if (newExpanded.has(grade)) {
      newExpanded.delete(grade);
    } else {
      newExpanded.add(grade);
    }
    setExpandedGrades(newExpanded);
  };

  const toggleVolume = (key: string) => {
    const newExpanded = new Set(expandedVolumes);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedVolumes(newExpanded);
  };

  const toggleUnit = (key: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedUnits(newExpanded);
  };

  const getLessonViewerUrl = (grade: number, volume: number, lessonNumber: number, startPage: number) => {
    const gradeMap: Record<number, string> = {
      6: `grade6-volume${volume}`,
      7: `grade7-volume${volume}`,
      8: `grade8-volume${volume}`,
      9: `algebra1-volume${volume}`
    };
    
    return `/viewer/${gradeMap[grade]}?lessonNumber=${lessonNumber}&page=${startPage}`;
  };

  return (
    <div className="space-y-6">
      {GRADE_DATA.map((grade) => (
        <div key={grade.level} className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-6 border border-purple-300/30 shadow-lg">
          {/* Grade Header */}
          <button
            onClick={() => toggleGrade(grade.level)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-4">
              {expandedGrades.has(grade.level) ? (
                <span className="text-yellow-300 text-xl font-bold">▼</span>
              ) : (
                <span className="text-yellow-300 text-xl font-bold">▶</span>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors">
                  {grade.title}
                </h2>
                <p className="text-gray-200 font-medium">
                  {grade.volume1.reduce((sum, unit) => sum + unit.totalLessons, 0) + 
                   grade.volume2.reduce((sum, unit) => sum + unit.totalLessons, 0)} lessons total
                </p>
              </div>
            </div>
          </button>

          {/* Grade Content */}
          {expandedGrades.has(grade.level) && (
            <div className="mt-6 space-y-4">
              {/* Volume 1 */}
              <div className="ml-4">
                <button
                  onClick={() => toggleVolume(`grade${grade.level}-v1`)}
                  className="flex items-center space-x-3 text-left group mb-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {expandedVolumes.has(`grade${grade.level}-v1`) ? (
                    <span className="text-blue-300 font-bold">▼</span>
                  ) : (
                    <span className="text-blue-300 font-bold">▶</span>
                  )}
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-200">
                    Volume 1
                  </h3>
                </button>

                {expandedVolumes.has(`grade${grade.level}-v1`) && (
                  <div className="ml-8 space-y-3">
                    {grade.volume1.map((unit) => (
                      <div key={unit.number} className="border border-purple-400/30 rounded-lg p-4 bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
                        <button
                          onClick={() => toggleUnit(`grade${grade.level}-v1-unit${unit.number}`)}
                          className="w-full flex items-center justify-between text-left group p-2 rounded hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedUnits.has(`grade${grade.level}-v1-unit${unit.number}`) ? (
                              <span className="text-green-300 font-bold">▼</span>
                            ) : (
                              <span className="text-green-300 font-bold">▶</span>
                            )}
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-green-200">
                                Unit {unit.number}: {unit.title}
                              </h4>
                              <p className="text-sm text-gray-200">{unit.description}</p>
                              <p className="text-xs text-gray-300 font-medium">
                                {unit.totalLessons} lessons • {unit.estimatedDays} days estimated • {unit.majorWorkCount} major work
                              </p>
                            </div>
                          </div>
                        </button>

                        {expandedUnits.has(`grade${grade.level}-v1-unit${unit.number}`) && (
                          <div className="mt-4 space-y-2">
                            {unit.lessons.map((lesson) => (
                              <div key={lesson.number} className="flex items-center justify-between bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-lg p-3 hover:from-gray-700/80 hover:to-gray-600/80 transition-all duration-200 group border border-gray-600/40">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full">
                                      {lesson.number}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                      grade.level === 6 ? 'bg-blue-600/80 text-blue-100' :
                                      grade.level === 7 ? 'bg-green-600/80 text-green-100' :
                                      grade.level === 8 ? 'bg-orange-600/80 text-orange-100' :
                                      'bg-red-600/80 text-red-100'
                                    }`}>
                                      G{grade.level}
                                    </span>
                                    {lesson.isMajorWork && (
                                      <span className="text-xs px-2 py-1 bg-yellow-600/80 text-yellow-100 rounded-full font-bold">
                                        MW
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-white group-hover:text-blue-200">
                                      {lesson.title}
                                    </h5>
                                    <p className="text-xs text-gray-300 font-medium">
                                      G{grade.level} U{unit.number} L{lesson.number} • {lesson.sessions} sessions • Pages {lesson.startPage}-{lesson.endPage}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={getLessonViewerUrl(grade.level, 1, lesson.number, lesson.startPage)}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  View →
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume 2 */}
              <div className="ml-4">
                <button
                  onClick={() => toggleVolume(`grade${grade.level}-v2`)}
                  className="flex items-center space-x-3 text-left group mb-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {expandedVolumes.has(`grade${grade.level}-v2`) ? (
                    <span className="text-blue-300 font-bold">▼</span>
                  ) : (
                    <span className="text-blue-300 font-bold">▶</span>
                  )}
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-200">
                    Volume 2
                  </h3>
                </button>

                {expandedVolumes.has(`grade${grade.level}-v2`) && (
                  <div className="ml-8 space-y-3">
                    {grade.volume2.map((unit) => (
                      <div key={unit.number} className="border border-purple-400/30 rounded-lg p-4 bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
                        <button
                          onClick={() => toggleUnit(`grade${grade.level}-v2-unit${unit.number}`)}
                          className="w-full flex items-center justify-between text-left group p-2 rounded hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedUnits.has(`grade${grade.level}-v2-unit${unit.number}`) ? (
                              <span className="text-green-300 font-bold">▼</span>
                            ) : (
                              <span className="text-green-300 font-bold">▶</span>
                            )}
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-green-200">
                                Unit {unit.number}: {unit.title}
                              </h4>
                              <p className="text-sm text-gray-200">{unit.description}</p>
                              <p className="text-xs text-gray-300 font-medium">
                                {unit.totalLessons} lessons • {unit.estimatedDays} days estimated • {unit.majorWorkCount} major work
                              </p>
                            </div>
                          </div>
                        </button>

                        {expandedUnits.has(`grade${grade.level}-v2-unit${unit.number}`) && (
                          <div className="mt-4 space-y-2">
                            {unit.lessons.map((lesson) => (
                              <div key={lesson.number} className="flex items-center justify-between bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-lg p-3 hover:from-gray-700/80 hover:to-gray-600/80 transition-all duration-200 group border border-gray-600/40">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-full">
                                      {lesson.number}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                      grade.level === 6 ? 'bg-blue-600/80 text-blue-100' :
                                      grade.level === 7 ? 'bg-green-600/80 text-green-100' :
                                      grade.level === 8 ? 'bg-orange-600/80 text-orange-100' :
                                      'bg-red-600/80 text-red-100'
                                    }`}>
                                      G{grade.level}
                                    </span>
                                    {lesson.isMajorWork && (
                                      <span className="text-xs px-2 py-1 bg-yellow-600/80 text-yellow-100 rounded-full font-bold">
                                        MW
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-white group-hover:text-blue-200">
                                      {lesson.title}
                                    </h5>
                                    <p className="text-xs text-gray-300 font-medium">
                                      G{grade.level} U{unit.number} L{lesson.number} • {lesson.sessions} sessions • Pages {lesson.startPage}-{lesson.endPage}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={getLessonViewerUrl(grade.level, 2, lesson.number, lesson.startPage)}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                  View →
                                </Link>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
