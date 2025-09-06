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
        totalLessons: 19,
        estimatedDays: 38,
        majorWorkCount: 19,
        lessons: [
          { number: 1, title: "Solve Problems Involving Scale", sessions: 1, startPage: 17, endPage: 20, isMajorWork: true },
          { number: 2, title: "Solve Problems Involving Scale - Using Scale to Find Distances", sessions: 1, startPage: 21, endPage: 21, isMajorWork: true },
          { number: 3, title: "Solve Problems Involving Scale - Explore different ways", sessions: 1, startPage: 22, endPage: 26, isMajorWork: true },
          { number: 4, title: "Solve Problems Involving Scale - Blueprint problem", sessions: 1, startPage: 27, endPage: 32, isMajorWork: true },
          { number: 5, title: "Solve Problems Involving Scale - Architect drawing", sessions: 1, startPage: 33, endPage: 33, isMajorWork: true },
          { number: 6, title: "Solve Problems Involving Scale - Different scale drawing", sessions: 1, startPage: 34, endPage: 44, isMajorWork: true },
          { number: 7, title: "Find Unit Rates Involving Ratios of Fractions", sessions: 1, startPage: 45, endPage: 48, isMajorWork: true },
          { number: 8, title: "Find Unit Rates - Solving Problems with Two Fractions", sessions: 1, startPage: 49, endPage: 49, isMajorWork: true },
          { number: 9, title: "Find Unit Rates Involving Ratios of Fractions", sessions: 3, startPage: 50, endPage: 60, isMajorWork: true },
          { number: 10, title: "Understand Proportional Relationships", sessions: 1, startPage: 61, endPage: 64, isMajorWork: true },
          { number: 11, title: "Understand Proportional Relationships - Develop Understanding", sessions: 3, startPage: 65, endPage: 72, isMajorWork: true },
          { number: 12, title: "Represent Proportional Relationships", sessions: 1, startPage: 73, endPage: 76, isMajorWork: true },
          { number: 13, title: "Represent Proportional Relationships - Interpreting Graphs", sessions: 1, startPage: 77, endPage: 77, isMajorWork: true },
          { number: 14, title: "Represent Proportional Relationships", sessions: 2, startPage: 78, endPage: 82, isMajorWork: true },
          { number: 15, title: "Represent Proportional Relationships - Recognizing Graphs", sessions: 1, startPage: 83, endPage: 83, isMajorWork: true },
          { number: 16, title: "Represent Proportional Relationships", sessions: 4, startPage: 84, endPage: 94, isMajorWork: true },
          { number: 17, title: "Solve Proportional Relationship Problems", sessions: 1, startPage: 95, endPage: 98, isMajorWork: true },
          { number: 18, title: "Solve Proportional Relationship Problems - Francisca and Elizabeth", sessions: 1, startPage: 99, endPage: 99, isMajorWork: true },
          { number: 19, title: "Solve Proportional Relationship Problems - Explore different ways", sessions: 3, startPage: 100, endPage: 110, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 1,
        title: "Statistics and Probability",
        description: "Statistical measures, displays, and probability concepts",
        totalLessons: 64,
        estimatedDays: 125,
        majorWorkCount: 64,
        lessons: [
          { number: 1, title: "Solve Problems Involving Percents", sessions: 4, startPage: 1, endPage: 4, isMajorWork: true },
          { number: 2, title: "Understand Statistical Questions", sessions: 3, startPage: 5, endPage: 7, isMajorWork: true },
          { number: 3, title: "Understand and Create Dot Plots", sessions: 4, startPage: 8, endPage: 11, isMajorWork: true },
          { number: 4, title: "Understand and Create Histograms", sessions: 4, startPage: 12, endPage: 15, isMajorWork: true },
          { number: 5, title: "Understand and Create Box Plots", sessions: 4, startPage: 16, endPage: 19, isMajorWork: true },
          { number: 6, title: "Choose Appropriate Statistical Displays", sessions: 3, startPage: 20, endPage: 22, isMajorWork: true },
          { number: 7, title: "Understand Statistical Measures", sessions: 4, startPage: 23, endPage: 26, isMajorWork: true },
          { number: 8, title: "Compare Statistical Measures and Displays", sessions: 4, startPage: 27, endPage: 30, isMajorWork: true },
          { number: 9, title: "Understand Random Sampling", sessions: 3, startPage: 31, endPage: 33, isMajorWork: true },
          { number: 10, title: "Understand Representative Samples", sessions: 4, startPage: 34, endPage: 37, isMajorWork: true },
          { number: 11, title: "Compare Multiple Populations", sessions: 4, startPage: 38, endPage: 41, isMajorWork: true },
          { number: 12, title: "Understand Probability", sessions: 3, startPage: 42, endPage: 44, isMajorWork: true },
          { number: 13, title: "Understand Theoretical and Experimental Probability", sessions: 4, startPage: 45, endPage: 48, isMajorWork: true },
          { number: 14, title: "Use Models to Find Probability", sessions: 4, startPage: 49, endPage: 52, isMajorWork: true },
          { number: 15, title: "Understand Compound Events", sessions: 3, startPage: 53, endPage: 55, isMajorWork: true },
          { number: 16, title: "Find Probability of Compound Events", sessions: 4, startPage: 56, endPage: 59, isMajorWork: true },
          { number: 17, title: "Use Tree Diagrams", sessions: 4, startPage: 60, endPage: 63, isMajorWork: true },
          { number: 18, title: "Simulate Compound Events", sessions: 4, startPage: 64, endPage: 67, isMajorWork: true },
          { number: 19, title: "Find Relative Frequency", sessions: 3, startPage: 68, endPage: 70, isMajorWork: true },
          { number: 20, title: "Understand Dependent and Independent Events", sessions: 4, startPage: 71, endPage: 74, isMajorWork: true },
          { number: 21, title: "Find Probability of Dependent Events", sessions: 4, startPage: 75, endPage: 78, isMajorWork: true },
          { number: 22, title: "Find Probability of Independent Events", sessions: 4, startPage: 79, endPage: 82, isMajorWork: true },
          { number: 23, title: "Compare Theoretical and Experimental Probability", sessions: 3, startPage: 83, endPage: 85, isMajorWork: true },
          { number: 24, title: "Use Probability to Make Predictions", sessions: 4, startPage: 86, endPage: 89, isMajorWork: true },
          { number: 25, title: "Understand Complementary Events", sessions: 3, startPage: 90, endPage: 92, isMajorWork: true },
          { number: 26, title: "Find Probability Using Complement", sessions: 4, startPage: 93, endPage: 96, isMajorWork: true },
          { number: 27, title: "Understand Mutually Exclusive Events", sessions: 3, startPage: 97, endPage: 99, isMajorWork: true },
          { number: 28, title: "Find Probability of Mutually Exclusive Events", sessions: 4, startPage: 100, endPage: 103, isMajorWork: true },
          { number: 29, title: "Use Addition Rule for Probability", sessions: 4, startPage: 104, endPage: 107, isMajorWork: true },
          { number: 30, title: "Solve Problems Using Probability", sessions: 4, startPage: 108, endPage: 111, isMajorWork: true },
          { number: 31, title: "Understand Conditional Probability", sessions: 4, startPage: 112, endPage: 115, isMajorWork: true },
          { number: 32, title: "Find Conditional Probability", sessions: 4, startPage: 116, endPage: 119, isMajorWork: true },
          { number: 33, title: "Use Two-Way Tables", sessions: 4, startPage: 120, endPage: 123, isMajorWork: true },
          { number: 34, title: "Find Conditional Probability from Two-Way Tables", sessions: 4, startPage: 124, endPage: 127, isMajorWork: true },
          { number: 35, title: "Understand Association in Two-Way Tables", sessions: 3, startPage: 128, endPage: 130, isMajorWork: true },
          { number: 36, title: "Analyze Two-Way Tables", sessions: 4, startPage: 131, endPage: 134, isMajorWork: true },
          { number: 37, title: "Compare Conditional Probabilities", sessions: 4, startPage: 135, endPage: 138, isMajorWork: true },
          { number: 38, title: "Make Inferences from Two-Way Tables", sessions: 4, startPage: 139, endPage: 142, isMajorWork: true },
          { number: 39, title: "Understand Sampling Methods", sessions: 3, startPage: 143, endPage: 145, isMajorWork: true },
          { number: 40, title: "Compare Sampling Methods", sessions: 4, startPage: 146, endPage: 149, isMajorWork: true },
          { number: 41, title: "Understand Bias in Sampling", sessions: 4, startPage: 150, endPage: 153, isMajorWork: true },
          { number: 42, title: "Identify Sources of Bias", sessions: 3, startPage: 154, endPage: 156, isMajorWork: true },
          { number: 43, title: "Design Fair Surveys", sessions: 4, startPage: 157, endPage: 160, isMajorWork: true },
          { number: 44, title: "Analyze Survey Results", sessions: 4, startPage: 161, endPage: 164, isMajorWork: true },
          { number: 45, title: "Make Inferences from Samples", sessions: 4, startPage: 165, endPage: 168, isMajorWork: true },
          { number: 46, title: "Compare Sample Statistics", sessions: 4, startPage: 169, endPage: 172, isMajorWork: true },
          { number: 47, title: "Understand Margin of Error", sessions: 3, startPage: 173, endPage: 175, isMajorWork: true },
          { number: 48, title: "Use Margin of Error in Inferences", sessions: 4, startPage: 176, endPage: 179, isMajorWork: true },
          { number: 49, title: "Design Experiments", sessions: 4, startPage: 180, endPage: 183, isMajorWork: true },
          { number: 50, title: "Understand Control Groups", sessions: 3, startPage: 184, endPage: 186, isMajorWork: true },
          { number: 51, title: "Identify Variables in Experiments", sessions: 4, startPage: 187, endPage: 190, isMajorWork: true },
          { number: 52, title: "Understand Randomization", sessions: 4, startPage: 191, endPage: 194, isMajorWork: true },
          { number: 53, title: "Analyze Experimental Results", sessions: 4, startPage: 195, endPage: 198, isMajorWork: true },
          { number: 54, title: "Compare Observational Studies and Experiments", sessions: 3, startPage: 199, endPage: 201, isMajorWork: true },
          { number: 55, title: "Make Causal Inferences", sessions: 4, startPage: 202, endPage: 205, isMajorWork: true },
          { number: 56, title: "Understand Confounding Variables", sessions: 4, startPage: 206, endPage: 209, isMajorWork: true },
          { number: 57, title: "Design Controlled Experiments", sessions: 4, startPage: 210, endPage: 213, isMajorWork: true },
          { number: 58, title: "Replicate Experiments", sessions: 3, startPage: 214, endPage: 216, isMajorWork: true },
          { number: 59, title: "Analyze Replicated Data", sessions: 4, startPage: 217, endPage: 220, isMajorWork: true },
          { number: 60, title: "Understand Statistical Significance", sessions: 4, startPage: 221, endPage: 224, isMajorWork: true },
          { number: 61, title: "Test Statistical Hypotheses", sessions: 4, startPage: 225, endPage: 228, isMajorWork: true },
          { number: 62, title: "Make Statistical Conclusions", sessions: 4, startPage: 229, endPage: 232, isMajorWork: true },
          { number: 63, title: "Communicate Statistical Results", sessions: 3, startPage: 233, endPage: 235, isMajorWork: true },
          { number: 64, title: "Solve Problems Involving Compound Events", sessions: 4, startPage: 236, endPage: 239, isMajorWork: true }
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
        totalLessons: 15,
        estimatedDays: 30,
        majorWorkCount: 12,
        lessons: [
          { number: 1, title: "Understand Rigid Transformations and Their Properties", sessions: 1, startPage: 17, endPage: 20, isMajorWork: true },
          { number: 2, title: "Understand Rigid Transformations - Develop Understanding", sessions: 3, startPage: 21, endPage: 28, isMajorWork: true },
          { number: 3, title: "Work with Single Rigid Transformations in the Coordinate Plane", sessions: 1, startPage: 29, endPage: 32, isMajorWork: true },
          { number: 4, title: "Single Rigid Transformations - Performing a Reflection", sessions: 1, startPage: 33, endPage: 33, isMajorWork: true },
          { number: 5, title: "Work with Single Rigid Transformations", sessions: 2, startPage: 34, endPage: 38, isMajorWork: true },
          { number: 6, title: "Work with Single Rigid Transformations", sessions: 3, startPage: 39, endPage: 39, isMajorWork: true },
          { number: 7, title: "Work with Single Rigid Transformations", sessions: 3, startPage: 40, endPage: 44, isMajorWork: true },
          { number: 8, title: "Work with Single Rigid Transformations", sessions: 4, startPage: 45, endPage: 45, isMajorWork: true },
          { number: 9, title: "Work with Single Rigid Transformations", sessions: 5, startPage: 46, endPage: 56, isMajorWork: true },
          { number: 10, title: "Work with Sequences of Transformations and Congruence", sessions: 1, startPage: 57, endPage: 60, isMajorWork: true },
          { number: 11, title: "Sequences of Transformations and Congruence", sessions: 2, startPage: 61, endPage: 61, isMajorWork: true },
          { number: 12, title: "Sequences of Transformations and Congruence", sessions: 2, startPage: 62, endPage: 66, isMajorWork: true },
          { number: 13, title: "Sequences of Transformations - Edita and her brother game", sessions: 1, startPage: 67, endPage: 67, isMajorWork: false },
          { number: 14, title: "Work with Sequences of Transformations and Congruence", sessions: 4, startPage: 68, endPage: 96, isMajorWork: true },
          { number: 15, title: "Understand Dilations and Similarity", sessions: 1, startPage: 97, endPage: 100, isMajorWork: false }
        ]
      }
    ],
    volume2: [
      {
        number: 1,
        title: "Exponents and Scientific Notation",
        description: "Properties of exponents, scientific notation, and powers of 10",
        totalLessons: 61,
        estimatedDays: 122,
        majorWorkCount: 61,
        lessons: [
          { number: 1, title: "Apply Exponent Properties for Positive Integer Exponents", sessions: 1, startPage: 17, endPage: 20, isMajorWork: true },
          { number: 2, title: "Apply Exponent Properties for Positive Integer Exponents", sessions: 1, startPage: 21, endPage: 21, isMajorWork: true },
          { number: 3, title: "Apply Exponent Properties for Positive Integer Exponents", sessions: 1, startPage: 22, endPage: 26, isMajorWork: true },
          { number: 4, title: "Apply Exponent Properties for Positive Integer Exponents", sessions: 1, startPage: 27, endPage: 38, isMajorWork: true },
          { number: 5, title: "Apply Exponent Properties for All Integer Exponents", sessions: 1, startPage: 39, endPage: 42, isMajorWork: true },
          { number: 6, title: "Apply Exponent Properties for All Integer Exponents", sessions: 2, startPage: 43, endPage: 48, isMajorWork: true },
          { number: 7, title: "Apply Exponent Properties for All Integer Exponents", sessions: 1, startPage: 49, endPage: 49, isMajorWork: true },
          { number: 8, title: "Apply Exponent Properties for All Integer Exponents", sessions: 4, startPage: 50, endPage: 60, isMajorWork: true },
          { number: 9, title: "Express Numbers Using Integer Powers of 10", sessions: 1, startPage: 61, endPage: 64, isMajorWork: true },
          { number: 10, title: "Express Numbers Using Integer Powers of 10", sessions: 1, startPage: 65, endPage: 65, isMajorWork: true },
          { number: 11, title: "Express Numbers Using Integer Powers of 10", sessions: 2, startPage: 66, endPage: 70, isMajorWork: true },
          { number: 12, title: "Express Numbers Using Integer Powers of 10", sessions: 1, startPage: 71, endPage: 71, isMajorWork: true },
          { number: 13, title: "Express Numbers Using Integer Powers of 10", sessions: 4, startPage: 72, endPage: 82, isMajorWork: true },
          { number: 14, title: "Work with Scientific Notation", sessions: 1, startPage: 83, endPage: 86, isMajorWork: true },
          { number: 15, title: "Work with Scientific Notation", sessions: 1, startPage: 87, endPage: 87, isMajorWork: true },
          { number: 16, title: "Work with Scientific Notation", sessions: 1, startPage: 88, endPage: 92, isMajorWork: true },
          { number: 17, title: "Work with Scientific Notation", sessions: 1, startPage: 93, endPage: 98, isMajorWork: true },
          { number: 18, title: "Work with Scientific Notation", sessions: 1, startPage: 99, endPage: 99, isMajorWork: true },
          { number: 19, title: "Work with Scientific Notation", sessions: 4, startPage: 100, endPage: 128, isMajorWork: true },
          { number: 20, title: "Find Square Roots and Cube Roots to Solve Problems", sessions: 1, startPage: 129, endPage: 132, isMajorWork: true },
          { number: 21, title: "Find Square Roots and Cube Roots to Solve Problems", sessions: 1, startPage: 133, endPage: 133, isMajorWork: true },
          { number: 22, title: "Find Square Roots and Cube Roots to Solve Problems", sessions: 2, startPage: 134, endPage: 138, isMajorWork: true },
          { number: 23, title: "Find Square Roots and Cube Roots to Solve Problems", sessions: 4, startPage: 139, endPage: 150, isMajorWork: true },
          { number: 24, title: "Express Rational Numbers as Fractions and Decimals", sessions: 1, startPage: 151, endPage: 154, isMajorWork: true },
          { number: 25, title: "Express Rational Numbers as Fractions and Decimals", sessions: 1, startPage: 155, endPage: 155, isMajorWork: true },
          { number: 26, title: "Express Rational Numbers as Fractions and Decimals", sessions: 3, startPage: 156, endPage: 166, isMajorWork: true },
          { number: 27, title: "Find Rational Approximations of Irrational Numbers", sessions: 1, startPage: 167, endPage: 170, isMajorWork: true },
          { number: 28, title: "Find Rational Approximations of Irrational Numbers", sessions: 1, startPage: 171, endPage: 171, isMajorWork: true },
          { number: 29, title: "Find Rational Approximations of Irrational Numbers", sessions: 2, startPage: 172, endPage: 176, isMajorWork: true },
          { number: 30, title: "Find Rational Approximations of Irrational Numbers", sessions: 1, startPage: 177, endPage: 177, isMajorWork: true },
          { number: 31, title: "Find Rational Approximations of Irrational Numbers", sessions: 4, startPage: 178, endPage: 188, isMajorWork: true },
          { number: 32, title: "Understand the Pythagorean Theorem and Its Converse", sessions: 1, startPage: 189, endPage: 192, isMajorWork: true },
          { number: 33, title: "Understand the Pythagorean Theorem and Its Converse", sessions: 1, startPage: 193, endPage: 200, isMajorWork: true },
          { number: 34, title: "Apply the Pythagorean Theorem", sessions: 1, startPage: 201, endPage: 204, isMajorWork: true },
          { number: 35, title: "Apply the Pythagorean Theorem", sessions: 2, startPage: 205, endPage: 205, isMajorWork: true },
          { number: 36, title: "Apply the Pythagorean Theorem", sessions: 2, startPage: 206, endPage: 210, isMajorWork: true },
          { number: 37, title: "Apply the Pythagorean Theorem", sessions: 1, startPage: 211, endPage: 211, isMajorWork: true },
          { number: 38, title: "Apply the Pythagorean Theorem", sessions: 3, startPage: 212, endPage: 216, isMajorWork: true },
          { number: 39, title: "Apply the Pythagorean Theorem", sessions: 1, startPage: 217, endPage: 217, isMajorWork: true },
          { number: 40, title: "Apply the Pythagorean Theorem", sessions: 5, startPage: 218, endPage: 228, isMajorWork: true },
          { number: 41, title: "Solve Problems with Volumes of Cylinders, Cones, and Spheres", sessions: 1, startPage: 229, endPage: 232, isMajorWork: true },
          { number: 42, title: "Solve Problems with Volumes of Cylinders, Cones, and Spheres", sessions: 1, startPage: 233, endPage: 238, isMajorWork: true },
          { number: 43, title: "Solve Problems with Volumes of Cylinders, Cones, and Spheres", sessions: 4, startPage: 239, endPage: 268, isMajorWork: true },
          { number: 44, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 1, startPage: 269, endPage: 272, isMajorWork: true },
          { number: 45, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 1, startPage: 273, endPage: 273, isMajorWork: true },
          { number: 46, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 2, startPage: 274, endPage: 278, isMajorWork: true },
          { number: 47, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 1, startPage: 279, endPage: 279, isMajorWork: true },
          { number: 48, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 1, startPage: 280, endPage: 284, isMajorWork: true },
          { number: 49, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 1, startPage: 285, endPage: 285, isMajorWork: true },
          { number: 50, title: "Analyze Scatter Plots and Fit a Linear Model to Data", sessions: 1, startPage: 286, endPage: 296, isMajorWork: true },
          { number: 51, title: "Write and Analyze an Equation for Fitting a Linear Model to Data", sessions: 1, startPage: 297, endPage: 300, isMajorWork: true },
          { number: 52, title: "Write and Analyze an Equation for Fitting a Linear Model to Data", sessions: 2, startPage: 301, endPage: 306, isMajorWork: true },
          { number: 53, title: "Write and Analyze an Equation for Fitting a Linear Model to Data", sessions: 1, startPage: 307, endPage: 307, isMajorWork: true },
          { number: 54, title: "Write and Analyze an Equation for Fitting a Linear Model to Data", sessions: 3, startPage: 308, endPage: 318, isMajorWork: true },
          { number: 55, title: "Understand Two-Way Tables", sessions: 1, startPage: 319, endPage: 322, isMajorWork: true },
          { number: 56, title: "Understand Two-Way Tables", sessions: 1, startPage: 323, endPage: 330, isMajorWork: true },
          { number: 57, title: "Construct and Interpret Two-Way Tables", sessions: 1, startPage: 331, endPage: 334, isMajorWork: true },
          { number: 58, title: "Construct and Interpret Two-Way Tables", sessions: 1, startPage: 335, endPage: 335, isMajorWork: true },
          { number: 59, title: "Construct and Interpret Two-Way Tables", sessions: 2, startPage: 336, endPage: 340, isMajorWork: true },
          { number: 60, title: "Construct and Interpret Two-Way Tables", sessions: 1, startPage: 341, endPage: 341, isMajorWork: true },
          { number: 61, title: "Construct and Interpret Two-Way Tables", sessions: 4, startPage: 342, endPage: 456, isMajorWork: true }
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
        title: "Linear Equations and Inequalities",
        description: "Linear equations, inequalities, and systems of equations",
        totalLessons: 13,
        estimatedDays: 52,
        majorWorkCount: 13,
        lessons: [
          { number: 1, title: "Represent Quantities and Relationships", sessions: 1, startPage: 13, endPage: 25, isMajorWork: true },
          { number: 2, title: "Reason About Solving Equations", sessions: 5, startPage: 26, endPage: 157, isMajorWork: true },
          { number: 3, title: "Linear Equations in Two Variables", sessions: 4, startPage: 158, endPage: 187, isMajorWork: true },
          { number: 4, title: "Linear Inequalities in One Variable", sessions: 4, startPage: 188, endPage: 251, isMajorWork: true },
          { number: 5, title: "Function Concepts", sessions: 4, startPage: 252, endPage: 281, isMajorWork: true },
          { number: 6, title: "Interpret Graphs of Functions", sessions: 5, startPage: 282, endPage: 317, isMajorWork: true },
          { number: 7, title: "Linear Functions", sessions: 5, startPage: 318, endPage: 353, isMajorWork: true },
          { number: 8, title: "Fit Linear Functions to Data", sessions: 5, startPage: 354, endPage: 389, isMajorWork: true },
          { number: 9, title: "Piecewise Functions", sessions: 6, startPage: 390, endPage: 465, isMajorWork: true },
          { number: 10, title: "Solve Linear Systems by Graphing or Substitution", sessions: 4, startPage: 466, endPage: 495, isMajorWork: true },
          { number: 11, title: "Solve Linear Systems by Elimination", sessions: 4, startPage: 496, endPage: 525, isMajorWork: true },
          { number: 12, title: "Linear Inequalities in Two Variables", sessions: 4, startPage: 526, endPage: 555, isMajorWork: true },
          { number: 13, title: "Systems of Linear Inequalities", sessions: 3, startPage: 556, endPage: 656, isMajorWork: true }
        ]
      }
    ],
    volume2: [
      {
        number: 2,
        title: "Exponential and Quadratic Functions",
        description: "Sequences, exponential functions, polynomials, and quadratic equations",
        totalLessons: 15,
        estimatedDays: 66,
        majorWorkCount: 15,
        lessons: [
          { number: 14, title: "Sequences", sessions: 5, startPage: 36, endPage: 71, isMajorWork: true },
          { number: 15, title: "Graphs of Exponential Functions", sessions: 4, startPage: 72, endPage: 101, isMajorWork: true },
          { number: 16, title: "Model with Exponential Functions", sessions: 5, startPage: 102, endPage: 137, isMajorWork: true },
          { number: 17, title: "Compare Linear and Exponential Functions", sessions: 4, startPage: 138, endPage: 167, isMajorWork: true },
          { number: 18, title: "Rational Exponents", sessions: 4, startPage: 168, endPage: 229, isMajorWork: true },
          { number: 19, title: "Operations with Polynomials", sessions: 4, startPage: 230, endPage: 259, isMajorWork: true },
          { number: 20, title: "Graphs of Quadratic Functions", sessions: 5, startPage: 260, endPage: 295, isMajorWork: true },
          { number: 21, title: "Model with Quadratic Functions", sessions: 5, startPage: 296, endPage: 331, isMajorWork: true },
          { number: 22, title: "Factor Polynomials", sessions: 5, startPage: 332, endPage: 401, isMajorWork: true },
          { number: 23, title: "Quadratic Equations in One Variable", sessions: 5, startPage: 402, endPage: 437, isMajorWork: true },
          { number: 24, title: "Completing the Square", sessions: 4, startPage: 438, endPage: 467, isMajorWork: true },
          { number: 25, title: "The Quadratic Formula", sessions: 4, startPage: 468, endPage: 531, isMajorWork: true },
          { number: 26, title: "One-Variable Statistics", sessions: 4, startPage: 532, endPage: 561, isMajorWork: true },
          { number: 27, title: "Comparing Data Sets", sessions: 4, startPage: 562, endPage: 591, isMajorWork: true },
          { number: 28, title: "Two-Way Frequency Tables", sessions: 4, startPage: 592, endPage: 698, isMajorWork: true }
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
