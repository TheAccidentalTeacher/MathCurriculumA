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
        title: "Area, Algebraic Expressions, and Exponents",
        description: "Build foundational skills in geometry and algebra",
        totalLessons: 6,
        estimatedDays: 24,
        majorWorkCount: 6,
        lessons: [
          { number: 1, title: "Find the Area of a Parallelogram", sessions: 4, startPage: 3, endPage: 18, isMajorWork: true },
          { number: 2, title: "Find the Area of Triangles and Other Polygons", sessions: 4, startPage: 19, endPage: 40, isMajorWork: true },
          { number: 3, title: "Use Nets to Find Surface Area", sessions: 4, startPage: 41, endPage: 62, isMajorWork: true },
          { number: 4, title: "Work with Algebraic Expressions", sessions: 4, startPage: 63, endPage: 84, isMajorWork: true },
          { number: 5, title: "Write and Evaluate Expressions with Exponents", sessions: 4, startPage: 85, endPage: 106, isMajorWork: true },
          { number: 6, title: "Find Greatest Common Factor and Least Common Multiple", sessions: 4, startPage: 107, endPage: 128, isMajorWork: true }
        ]
      },
      {
        number: 2,
        title: "Decimals and Fractions",
        description: "Base-Ten Operations, Division with Fractions, and Volume",
        totalLessons: 5,
        estimatedDays: 22,
        majorWorkCount: 5,
        lessons: [
          { number: 7, title: "Add, Subtract, and Multiply Multi-Digit Decimals", sessions: 4, startPage: 145, endPage: 166, isMajorWork: true },
          { number: 8, title: "Divide Whole Numbers and Multi-Digit Decimals", sessions: 4, startPage: 167, endPage: 194, isMajorWork: true },
          { number: 9, title: "Understand Division with Fractions", sessions: 3, startPage: 195, endPage: 206, isMajorWork: true },
          { number: 10, title: "Divide Fractions", sessions: 4, startPage: 207, endPage: 228, isMajorWork: true },
          { number: 11, title: "Solve Volume Problems with Fractions", sessions: 4, startPage: 229, endPage: 250, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 3,
        title: "Ratio Reasoning",
        description: "Ratio Concepts and Equivalent Ratios",
        totalLessons: 3,
        estimatedDays: 15,
        majorWorkCount: 3,
        lessons: [
          { number: 12, title: "Understand Ratio Concepts", sessions: 3, startPage: 267, endPage: 278, isMajorWork: true },
          { number: 13, title: "Find Equivalent Ratios", sessions: 4, startPage: 279, endPage: 306, isMajorWork: true },
          { number: 14, title: "Use Part-to-Part and Part-to-Whole Ratios", sessions: 4, startPage: 307, endPage: 328, isMajorWork: true }
        ]
      },
      {
        number: 4,
        title: "Rate Reasoning",
        description: "Unit Rates and Percent",
        totalLessons: 3,
        estimatedDays: 15,
        majorWorkCount: 3,
        lessons: [
          { number: 15, title: "Understand Rate Concepts", sessions: 3, startPage: 345, endPage: 366, isMajorWork: true },
          { number: 16, title: "Solve Unit Rate Problems", sessions: 4, startPage: 367, endPage: 388, isMajorWork: true },
          { number: 17, title: "Solve Percent Problems", sessions: 4, startPage: 389, endPage: 408, isMajorWork: true }
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
        totalLessons: 6,
        estimatedDays: 18,
        majorWorkCount: 6,
        lessons: [
          { number: 1, title: "Solve Problems Involving Scale", sessions: 4, startPage: 15, endPage: 42, isMajorWork: true },
          { number: 2, title: "Find Unit Rates Involving Ratios of Fractions", sessions: 2, startPage: 43, endPage: 58, isMajorWork: true },
          { number: 3, title: "Understand Proportional Relationships", sessions: 2, startPage: 59, endPage: 70, isMajorWork: true },
          { number: 4, title: "Represent Proportional Relationships", sessions: 3, startPage: 71, endPage: 92, isMajorWork: true },
          { number: 5, title: "Solve Proportional Relationship Problems", sessions: 2, startPage: 93, endPage: 108, isMajorWork: true },
          { number: 6, title: "Solve Area and Circumference Problems Involving Circles", sessions: 3, startPage: 109, endPage: 148, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 2,
        title: "The Number System",
        description: "Operations with rational numbers",
        totalLessons: 8,
        estimatedDays: 25,
        majorWorkCount: 8,
        lessons: [
          { number: 7, title: "Understand Addition with Negative Integers", sessions: 2, startPage: 149, endPage: 160, isMajorWork: true },
          { number: 8, title: "Add with Negative Numbers", sessions: 3, startPage: 161, endPage: 182, isMajorWork: true },
          { number: 9, title: "Understand Subtraction with Negative Integers", sessions: 2, startPage: 183, endPage: 198, isMajorWork: true },
          { number: 10, title: "Add and Subtract with Negative Numbers", sessions: 3, startPage: 199, endPage: 220, isMajorWork: true },
          { number: 11, title: "Understand Multiplication with Negative Integers", sessions: 2, startPage: 221, endPage: 236, isMajorWork: true },
          { number: 12, title: "Multiply and Divide with Negative Numbers", sessions: 4, startPage: 237, endPage: 264, isMajorWork: true },
          { number: 13, title: "Add, Subtract, Multiply, and Divide with Rational Numbers", sessions: 3, startPage: 265, endPage: 290, isMajorWork: true },
          { number: 14, title: "Solve Problems with Rational Numbers", sessions: 4, startPage: 291, endPage: 324, isMajorWork: true }
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
        totalLessons: 6,
        estimatedDays: 18,
        majorWorkCount: 4,
        lessons: [
          { number: 1, title: "Understand Translations", sessions: 3, startPage: 15, endPage: 32, isMajorWork: false },
          { number: 2, title: "Understand Reflections", sessions: 3, startPage: 33, endPage: 50, isMajorWork: false },
          { number: 3, title: "Understand Rotations", sessions: 3, startPage: 51, endPage: 68, isMajorWork: false },
          { number: 4, title: "Understand Congruent Figures", sessions: 3, startPage: 69, endPage: 86, isMajorWork: false },
          { number: 5, title: "Describe Sequences of Transformations", sessions: 3, startPage: 87, endPage: 104, isMajorWork: false },
          { number: 6, title: "Understand Similarity", sessions: 3, startPage: 105, endPage: 148, isMajorWork: false }
        ]
      }
    ],
    volume2: [
      {
        number: 2,
        title: "Linear Relationships",
        description: "Linear functions and slope",
        totalLessons: 8,
        estimatedDays: 32,
        majorWorkCount: 8,
        lessons: [
          { number: 7, title: "Understand Linear Relationships Using Graphs", sessions: 4, startPage: 149, endPage: 170, isMajorWork: true },
          { number: 8, title: "Understand Linear Relationships Using Tables", sessions: 4, startPage: 171, endPage: 192, isMajorWork: true },
          { number: 9, title: "Understand Linear Relationships Using Equations", sessions: 4, startPage: 193, endPage: 214, isMajorWork: true },
          { number: 10, title: "Understand Slope", sessions: 4, startPage: 215, endPage: 236, isMajorWork: true },
          { number: 11, title: "Understand y-intercept", sessions: 4, startPage: 237, endPage: 258, isMajorWork: true },
          { number: 12, title: "Write Linear Equations", sessions: 4, startPage: 259, endPage: 280, isMajorWork: true },
          { number: 13, title: "Solve Linear Equations", sessions: 4, startPage: 281, endPage: 302, isMajorWork: true },
          { number: 14, title: "Solve Systems of Linear Equations", sessions: 4, startPage: 303, endPage: 324, isMajorWork: true }
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
        title: "Linear Equations in One Variable",
        description: "Solving linear equations and inequalities",
        totalLessons: 12,
        estimatedDays: 36,
        majorWorkCount: 12,
        lessons: [
          { number: 1, title: "Solve Linear Equations in One Variable", sessions: 3, startPage: 15, endPage: 36, isMajorWork: true },
          { number: 2, title: "Analyze and Solve Linear Equations", sessions: 3, startPage: 37, endPage: 58, isMajorWork: true },
          { number: 3, title: "Write and Solve Multi-Step Linear Equations", sessions: 3, startPage: 59, endPage: 80, isMajorWork: true },
          { number: 4, title: "Solve Linear Equations with Rational Coefficients", sessions: 3, startPage: 81, endPage: 102, isMajorWork: true },
          { number: 5, title: "Rearrange Formulas to Highlight a Quantity of Interest", sessions: 3, startPage: 103, endPage: 124, isMajorWork: true },
          { number: 6, title: "Understand Solutions to Linear Equations in One Variable", sessions: 3, startPage: 125, endPage: 146, isMajorWork: true },
          { number: 7, title: "Linear Equations in Two Variables", sessions: 3, startPage: 147, endPage: 168, isMajorWork: true },
          { number: 8, title: "Write Equations of Lines", sessions: 3, startPage: 169, endPage: 190, isMajorWork: true },
          { number: 9, title: "Linear Inequalities in One Variable", sessions: 3, startPage: 191, endPage: 212, isMajorWork: true },
          { number: 10, title: "Solve Linear Inequalities in One Variable", sessions: 3, startPage: 213, endPage: 234, isMajorWork: true },
          { number: 11, title: "Solve Compound Inequalities", sessions: 3, startPage: 235, endPage: 256, isMajorWork: true },
          { number: 12, title: "Graph Linear Inequalities in Two Variables", sessions: 3, startPage: 257, endPage: 278, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 2,
        title: "Quadratic Functions and Equations",
        description: "Quadratic functions, factoring, and equations",
        totalLessons: 16,
        estimatedDays: 48,
        majorWorkCount: 16,
        lessons: [
          { number: 13, title: "Understand Quadratic Functions", sessions: 3, startPage: 15, endPage: 36, isMajorWork: true },
          { number: 14, title: "Graph Quadratic Functions", sessions: 3, startPage: 37, endPage: 58, isMajorWork: true },
          { number: 15, title: "Transform Quadratic Functions", sessions: 3, startPage: 59, endPage: 80, isMajorWork: true },
          { number: 16, title: "Factor Quadratic Expressions", sessions: 3, startPage: 81, endPage: 102, isMajorWork: true },
          { number: 17, title: "Solve Quadratic Equations by Factoring", sessions: 3, startPage: 103, endPage: 124, isMajorWork: true },
          { number: 18, title: "Solve Quadratic Equations by Taking Square Roots", sessions: 3, startPage: 125, endPage: 146, isMajorWork: true },
          { number: 19, title: "Complete the Square", sessions: 3, startPage: 147, endPage: 168, isMajorWork: true },
          { number: 20, title: "Use the Quadratic Formula", sessions: 3, startPage: 169, endPage: 190, isMajorWork: true },
          { number: 21, title: "Choose Methods for Solving Quadratic Equations", sessions: 3, startPage: 191, endPage: 212, isMajorWork: true },
          { number: 22, title: "Model with Quadratic Functions", sessions: 3, startPage: 213, endPage: 234, isMajorWork: true },
          { number: 23, title: "Compare Linear and Quadratic Functions", sessions: 3, startPage: 235, endPage: 256, isMajorWork: true },
          { number: 24, title: "Work with Rational Exponents", sessions: 3, startPage: 257, endPage: 278, isMajorWork: true },
          { number: 25, title: "Exponential Functions", sessions: 3, startPage: 279, endPage: 300, isMajorWork: true },
          { number: 26, title: "Model with Exponential Functions", sessions: 3, startPage: 301, endPage: 322, isMajorWork: true },
          { number: 27, title: "Statistics and Data Analysis", sessions: 3, startPage: 323, endPage: 344, isMajorWork: true },
          { number: 28, title: "Two-Way Frequency Tables", sessions: 3, startPage: 345, endPage: 366, isMajorWork: true }
        ]
      }
    ]
  }
];

export function LessonNavigationGrid() {
  const [expandedGrades, setExpandedGrades] = useState<Set<number>>(new Set([6]));
  const [expandedVolumes, setExpandedVolumes] = useState<Set<string>>(new Set());
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set());

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
    
    return `/viewer/${gradeMap[grade]}?lesson=${lessonNumber}&page=${startPage}`;
  };

  return (
    <div className="space-y-6">
      {GRADE_DATA.map((grade) => (
        <div key={grade.level} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          {/* Grade Header */}
          <button
            onClick={() => toggleGrade(grade.level)}
            className="w-full flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-4">
              {expandedGrades.has(grade.level) ? (
                <span className="text-white text-xl">▼</span>
              ) : (
                <span className="text-white text-xl">▶</span>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                  {grade.title}
                </h2>
                <p className="text-purple-200">
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
                  className="flex items-center space-x-3 text-left group mb-3"
                >
                  {expandedVolumes.has(`grade${grade.level}-v1`) ? (
                    <span className="text-purple-200">▼</span>
                  ) : (
                    <span className="text-purple-200">▶</span>
                  )}
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-200">
                    Volume 1
                  </h3>
                </button>

                {expandedVolumes.has(`grade${grade.level}-v1`) && (
                  <div className="ml-8 space-y-3">
                    {grade.volume1.map((unit) => (
                      <div key={unit.number} className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <button
                          onClick={() => toggleUnit(`grade${grade.level}-v1-unit${unit.number}`)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedUnits.has(`grade${grade.level}-v1-unit${unit.number}`) ? (
                              <span className="text-purple-300">▼</span>
                            ) : (
                              <span className="text-purple-300">▶</span>
                            )}
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-purple-200">
                                Unit {unit.number}: {unit.title}
                              </h4>
                              <p className="text-sm text-purple-300">{unit.description}</p>
                              <p className="text-xs text-purple-400">
                                {unit.totalLessons} lessons • {unit.estimatedDays} days estimated • {unit.majorWorkCount} major work
                              </p>
                            </div>
                          </div>
                        </button>

                        {expandedUnits.has(`grade${grade.level}-v1-unit${unit.number}`) && (
                          <div className="mt-4 space-y-2">
                            {unit.lessons.map((lesson) => (
                              <div key={lesson.number} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors group">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 text-white text-sm font-bold rounded-full">
                                      {lesson.number}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      grade.level === 6 ? 'bg-blue-500/20 text-blue-300' :
                                      grade.level === 7 ? 'bg-green-500/20 text-green-300' :
                                      grade.level === 8 ? 'bg-orange-500/20 text-orange-300' :
                                      'bg-red-500/20 text-red-300'
                                    }`}>
                                      G{grade.level}
                                    </span>
                                    {lesson.isMajorWork && (
                                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full font-medium">
                                        MW
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-white group-hover:text-purple-200">
                                      {lesson.title}
                                    </h5>
                                    <p className="text-xs text-purple-400">
                                      G{grade.level} U{unit.number} L{lesson.number} • {lesson.sessions} sessions • Pages {lesson.startPage}-{lesson.endPage}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={getLessonViewerUrl(grade.level, 1, lesson.number, lesson.startPage)}
                                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
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
                  className="flex items-center space-x-3 text-left group mb-3"
                >
                  {expandedVolumes.has(`grade${grade.level}-v2`) ? (
                    <span className="text-purple-200">▼</span>
                  ) : (
                    <span className="text-purple-200">▶</span>
                  )}
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-200">
                    Volume 2
                  </h3>
                </button>

                {expandedVolumes.has(`grade${grade.level}-v2`) && (
                  <div className="ml-8 space-y-3">
                    {grade.volume2.map((unit) => (
                      <div key={unit.number} className="border border-white/10 rounded-lg p-4 bg-white/5">
                        <button
                          onClick={() => toggleUnit(`grade${grade.level}-v2-unit${unit.number}`)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedUnits.has(`grade${grade.level}-v2-unit${unit.number}`) ? (
                              <span className="text-purple-300">▼</span>
                            ) : (
                              <span className="text-purple-300">▶</span>
                            )}
                            <div>
                              <h4 className="font-semibold text-white group-hover:text-purple-200">
                                Unit {unit.number}: {unit.title}
                              </h4>
                              <p className="text-sm text-purple-300">{unit.description}</p>
                              <p className="text-xs text-purple-400">
                                {unit.totalLessons} lessons • {unit.estimatedDays} days estimated • {unit.majorWorkCount} major work
                              </p>
                            </div>
                          </div>
                        </button>

                        {expandedUnits.has(`grade${grade.level}-v2-unit${unit.number}`) && (
                          <div className="mt-4 space-y-2">
                            {unit.lessons.map((lesson) => (
                              <div key={lesson.number} className="flex items-center justify-between bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors group">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-600 text-white text-sm font-bold rounded-full">
                                      {lesson.number}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-3">
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      grade.level === 6 ? 'bg-blue-500/20 text-blue-300' :
                                      grade.level === 7 ? 'bg-green-500/20 text-green-300' :
                                      grade.level === 8 ? 'bg-orange-500/20 text-orange-300' :
                                      'bg-red-500/20 text-red-300'
                                    }`}>
                                      G{grade.level}
                                    </span>
                                    {lesson.isMajorWork && (
                                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full font-medium">
                                        MW
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-white group-hover:text-purple-200">
                                      {lesson.title}
                                    </h5>
                                    <p className="text-xs text-purple-400">
                                      G{grade.level} U{unit.number} L{lesson.number} • {lesson.sessions} sessions • Pages {lesson.startPage}-{lesson.endPage}
                                    </p>
                                  </div>
                                </div>
                                <Link
                                  href={getLessonViewerUrl(grade.level, 2, lesson.number, lesson.startPage)}
                                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
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
