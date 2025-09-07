/**
 * Pacing Curriculum Integration
 * 
 * This service integrates with the existing lesson system using the same structure as
 * DatabaseFreeLessonService to provide curriculum data for the pacing generator.
 * 
 * Uses the same lesson boundaries and document structure as the working lesson viewer.
 */

import path from 'path';
import fs from 'fs';

export interface CurriculumDocument {
  id: string;
  title: string;
  grade: string;
  volume: string;
  totalLessons: number;
  totalPages: number;
}

export interface LessonInfo {
  lessonNumber: number;
  title: string;
  startPage: number;
  endPage: number;
  sessionCount?: number;
}

export interface UnitStructure {
  unitTitle: string;
  lessons: LessonInfo[];
  gradeLevel: string;
  totalLessons: number;
}

export class PacingCurriculumIntegration {
  // Use the same lesson boundaries as DatabaseFreeLessonService
  private static lessonBoundaries: { [documentId: string]: { [lessonNumber: number]: { start: number; end: number; title: string } } } = {
    'RCM07_NA_SW_V1': {
      1: { start: 15, end: 36, title: 'Write and Evaluate Numerical Expressions' },
      2: { start: 37, end: 58, title: 'Write Algebraic Expressions and Understand the Meanings of Variables' },
      3: { start: 59, end: 80, title: 'Analyze and Write Equivalent Expressions' },
      4: { start: 81, end: 102, title: 'Identify and Represent Proportional Relationships' },
      5: { start: 103, end: 130, title: 'Solve Ratio and Rate Problems' },
      6: { start: 131, end: 160, title: 'Understand and Solve Proportions' },
      7: { start: 161, end: 182, title: 'Add with Negative Numbers' },
      8: { start: 183, end: 194, title: 'Understand Subtraction with Negative Integers' },
      9: { start: 195, end: 234, title: 'Add and Subtract Positive and Negative Numbers' },
      10: { start: 235, end: 246, title: 'Understand Multiplication with Negative Integers' },
      11: { start: 247, end: 268, title: 'Multiply and Divide with Negative Numbers' },
      12: { start: 269, end: 290, title: 'Express Rational Numbers as Terminating or Repeating Decimals' },
      13: { start: 291, end: 324, title: 'Use the Four Operations with Negative Numbers' },
      14: { start: 325, end: 346, title: 'Write Equivalent Expressions Involving Rational Numbers' },
      15: { start: 347, end: 358, title: 'Understand Reasons for Rewriting Expressions' },
      16: { start: 359, end: 370, title: 'Understand Multi-Step Equations' },
      17: { start: 371, end: 392, title: 'Write and Solve Multi-Step Equations' },
      18: { start: 393, end: 504, title: 'Write and Solve Inequalities' }
    },
    'RCM07_NA_SW_V2': {
      19: { start: 15, end: 42, title: 'Solve Problems Involving Percents' },
      20: { start: 43, end: 64, title: 'Solve Problems Involving Percent Change and Percent Error' },
      21: { start: 65, end: 76, title: 'Understand Random Sampling' },
      22: { start: 77, end: 98, title: 'Reason About Random Samples' },
      23: { start: 99, end: 138, title: 'Compare Populations' },
      24: { start: 139, end: 166, title: 'Solve Problems Involving Area and Surface Area' },
      25: { start: 167, end: 188, title: 'Solve Problems Involving Volume' },
      26: { start: 189, end: 204, title: 'Describe Plane Sections of Three-Dimensional Figures' },
      27: { start: 205, end: 226, title: 'Find Unknown Angle Measures' },
      28: { start: 227, end: 272, title: 'Draw Plane Figures with Given Conditions' },
      29: { start: 273, end: 284, title: 'Understand Probability' },
      30: { start: 285, end: 306, title: 'Solve Problems Involving Experimental Probability' },
      31: { start: 307, end: 328, title: 'Solve Problems Involving Probability Models' },
      32: { start: 329, end: 440, title: 'Solve Problems Involving Compound Events' }
    },
    'RCM08_NA_SW_V1': {
      1: { start: 15, end: 26, title: 'Understand Rigid Transformations and Their Properties' },
      2: { start: 27, end: 54, title: 'Work with Single Rigid Transformations in the Coordinate Plane' },
      3: { start: 55, end: 94, title: 'Work with Sequences of Transformations and Congruence' },
      4: { start: 95, end: 106, title: 'Understand Dilations and Similarity' },
      5: { start: 107, end: 128, title: 'Perform and Describe Transformations Involving Dilations' },
      6: { start: 129, end: 150, title: 'Describe Angle Relationships' },
      7: { start: 151, end: 190, title: 'Describe Angle Relationships in Triangles' },
      8: { start: 191, end: 212, title: 'Graph Proportional Relationships and Define Slope' },
      9: { start: 213, end: 240, title: 'Derive and Graph Linear Equations of the Form y = mx + b' },
      10: { start: 241, end: 262, title: 'Solve Linear Equations in One Variable' },
      11: { start: 263, end: 284, title: 'Determine the Number of Solutions to One-Variable Equations' },
      12: { start: 285, end: 296, title: 'Understand Systems of Linear Equations in Two Variables' },
      13: { start: 297, end: 324, title: 'Solve Systems of Linear Equations Algebraically' },
      14: { start: 325, end: 364, title: 'Represent and Solve Problems with Systems of Linear Equations' },
      15: { start: 365, end: 376, title: 'Understand Functions' },
      16: { start: 377, end: 404, title: 'Use Functions to Model Linear Relationships' },
      17: { start: 405, end: 426, title: 'Compare Different Representations of Functions' },
      18: { start: 427, end: 552, title: 'Analyze Functional Relationships Qualitatively' }
    },
    'RCM08_NA_SW_V2': {
      19: { start: 15, end: 36, title: 'Apply Exponent Properties for Positive Integer Exponents' },
      20: { start: 37, end: 58, title: 'Apply Exponent Properties for All Integer Exponents' },
      21: { start: 59, end: 80, title: 'Express Numbers Using Integer Powers of 10' },
      22: { start: 81, end: 126, title: 'Work with Scientific Notation' },
      23: { start: 127, end: 148, title: 'Find Square Roots and Cube Roots to Solve Problems' },
      24: { start: 149, end: 164, title: 'Express Rational Numbers as Fractions and Decimals' },
      25: { start: 165, end: 186, title: 'Find Rational Approximations of Irrational Numbers' },
      26: { start: 187, end: 198, title: 'Understand the Pythagorean Theorem and Its Converse' },
      27: { start: 199, end: 226, title: 'Apply the Pythagorean Theorem' },
      28: { start: 227, end: 266, title: 'Solve Problems with Volumes of Cylinders, Cones, and Spheres' },
      29: { start: 267, end: 294, title: 'Analyze Scatter Plots and Fit a Linear Model to Data' },
      30: { start: 295, end: 316, title: 'Write and Analyze an Equation for Fitting a Linear Model' },
      31: { start: 317, end: 328, title: 'Understand Two-Way Tables' },
      32: { start: 329, end: 456, title: 'Construct and Interpret Two-Way Tables' }
    },
    
    // Grade 9 - Algebra I / High School content (placeholder structure)
    'RCM09_ALG_SW_V1': {
      1: { start: 15, end: 36, title: 'Linear Equations in One Variable' },
      2: { start: 37, end: 58, title: 'Linear Inequalities in One Variable' },
      3: { start: 59, end: 80, title: 'Two-Variable Linear Equations and Their Graphs' },
      4: { start: 81, end: 102, title: 'More Two-Variable Linear Equations and Their Graphs' },
      5: { start: 103, end: 124, title: 'Linear Inequalities in Two Variables' },
      6: { start: 125, end: 146, title: 'Systems of Linear Equations in Two Variables' },
      7: { start: 147, end: 168, title: 'Exponents and Exponential Functions' },
      8: { start: 169, end: 190, title: 'Polynomials and Factoring' },
      9: { start: 191, end: 212, title: 'Quadratic Functions and Equations' },
      10: { start: 213, end: 234, title: 'Radical Expressions and Equations' },
      11: { start: 235, end: 256, title: 'Rational Expressions and Functions' },
      12: { start: 257, end: 278, title: 'Data Analysis and Statistics' },
      13: { start: 279, end: 300, title: 'Probability and Combinatorics' },
      14: { start: 301, end: 322, title: 'Sequences and Series' },
      15: { start: 323, end: 344, title: 'Exponential and Logarithmic Functions' },
      16: { start: 345, end: 366, title: 'Trigonometric Functions Introduction' },
      17: { start: 367, end: 388, title: 'Polynomial Functions and Graphs' },
      18: { start: 389, end: 410, title: 'Advanced Function Analysis' },
      19: { start: 411, end: 432, title: 'Conic Sections' },
      20: { start: 433, end: 454, title: 'Mathematical Modeling and Applications' }
    }
  };

  private webappPagesPath: string;

  constructor() {
    this.webappPagesPath = path.join(process.cwd(), 'webapp_pages');
  }

  /**
   * Get all available curriculum documents (same as what lesson system uses)
   */
  async getDocuments(): Promise<CurriculumDocument[]> {
    const documents: CurriculumDocument[] = [];
    
    // Process each document that has lesson boundaries defined
    for (const [documentId, lessons] of Object.entries(PacingCurriculumIntegration.lessonBoundaries)) {
      const gradeMatch = documentId.match(/RCM(\d+)/);
      const volumeMatch = documentId.match(/V(\d+)$/);
      
      if (gradeMatch && volumeMatch) {
        const rawGrade = gradeMatch[1];
        const grade = rawGrade.replace(/^0+/, '') || '0'; // "07" -> "7", "08" -> "8"
        const volume = `V${volumeMatch[1]}`;
        const lessonCount = Object.keys(lessons).length;
        
        // Calculate total pages from lesson boundaries
        const maxPage = Math.max(...Object.values(lessons).map(l => l.end));
        
        documents.push({
          id: documentId,
          title: `Ready Classroom Mathematics Grade ${grade} ${volume}`,
          grade,
          volume,
          totalLessons: lessonCount,
          totalPages: maxPage
        });
      }
    }
    
    return documents.sort((a, b) => a.grade.localeCompare(b.grade) || a.volume.localeCompare(b.volume));
  }

  /**
   * Get documents for a specific grade
   */
  async getDocumentsForGrade(grade: string): Promise<CurriculumDocument[]> {
    const documents = await this.getDocuments();
    return documents.filter(doc => doc.grade === grade);
  }

  /**
   * Get lesson structure for a document using predefined boundaries
   */
  async getDocumentLessons(documentId: string): Promise<LessonInfo[]> {
    const boundaries = PacingCurriculumIntegration.lessonBoundaries[documentId];
    if (!boundaries) {
      console.log(`No lesson boundaries found for document ${documentId}`);
      return [];
    }

    const lessons: LessonInfo[] = [];
    
    for (const [lessonNumStr, boundary] of Object.entries(boundaries)) {
      const lessonNumber = parseInt(lessonNumStr);
      
      lessons.push({
        lessonNumber,
        title: boundary.title,
        startPage: boundary.start,
        endPage: boundary.end,
        sessionCount: 1 // Default to 1, could be enhanced with actual session counting
      });
    }

    return lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }

  /**
   * Get comprehensive curriculum data for a grade (for AI context)
   */
  async getCurriculumDataForGrade(grade: string): Promise<{
    documents: CurriculumDocument[];
    totalLessons: number;
    units: UnitStructure[];
    availableTopics: string[];
  }> {
    console.log(`🔍 [PacingCurriculumIntegration] Getting curriculum data for grade ${grade}`);
    
    const documents = await this.getDocumentsForGrade(grade);
    let totalLessons = 0;
    let units: UnitStructure[] = [];
    let availableTopics: string[] = [];

    console.log(`📚 [PacingCurriculumIntegration] Found ${documents.length} documents for grade ${grade}`);

    for (const document of documents) {
      const lessons = await this.getDocumentLessons(document.id);
      totalLessons += lessons.length;
      
      // Create a unit structure for each volume
      const unit: UnitStructure = {
        unitTitle: document.title,
        lessons,
        gradeLevel: grade,
        totalLessons: lessons.length
      };
      
      units.push(unit);
      
      // Extract topics from lesson titles
      lessons.forEach(lesson => {
        availableTopics.push(lesson.title);
        
        // Extract key mathematical concepts from titles
        const concepts = this.extractMathematicalConcepts(lesson.title);
        availableTopics.push(...concepts);
      });
    }

    // Remove duplicates and filter out empty topics
    availableTopics = [...new Set(availableTopics)].filter(topic => topic && topic.trim().length > 0);

    console.log(`📊 [PacingCurriculumIntegration] Grade ${grade} summary:`, {
      documents: documents.length,
      totalLessons,
      units: units.length,
      availableTopics: availableTopics.length
    });

    return {
      documents,
      totalLessons,
      units,
      availableTopics
    };
  }

  /**
   * Extract mathematical concepts from lesson titles
   */
  private extractMathematicalConcepts(title: string): string[] {
    const concepts: string[] = [];
    
    // Common mathematical terms and concepts
    const mathTerms = [
      'expressions', 'equations', 'variables', 'proportional', 'ratios', 'rates',
      'negative numbers', 'integers', 'rational numbers', 'decimals', 'fractions',
      'inequalities', 'percents', 'probability', 'statistics', 'sampling',
      'area', 'volume', 'surface area', 'geometry', 'transformations',
      'functions', 'linear', 'slope', 'systems', 'exponents', 'square roots',
      'pythagorean theorem', 'scatter plots', 'two-way tables'
    ];

    const lowerTitle = title.toLowerCase();
    
    for (const term of mathTerms) {
      if (lowerTitle.includes(term)) {
        concepts.push(term);
      }
    }

    return concepts;
  }

  /**
   * Get grade mapping for document IDs
   */
  static getGradeFromDocumentId(documentId: string): string | null {
    const match = documentId.match(/RCM(\d+)/);
    return match ? match[1] : null;
  }

  /**
   * Get all available grades
   */
  async getAllGrades(): Promise<string[]> {
    const documents = await this.getDocuments();
    const grades = [...new Set(documents.map(doc => doc.grade))];
    return grades.sort();
  }
}
