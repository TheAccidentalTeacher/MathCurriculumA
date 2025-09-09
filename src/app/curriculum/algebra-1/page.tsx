'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Algebra1Curriculum() {
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  const toggleLesson = (lessonNumber: number) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonNumber)) {
      newExpanded.delete(lessonNumber);
    } else {
      newExpanded.add(lessonNumber);
    }
    setExpandedLessons(newExpanded);
  };

  const units = [
    {
      unit: 'Unit 1',
      title: 'Expressions, Equations, and Inequalities',
      pages: '15-140',
      duration: '24 days',
      domain: 'Seeing Structure in Expressions & Creating Equations',
      stemSpotlight: 'Mathematical Modeling',
      standards: ['A-SSE.A.1', 'A-SSE.A.2', 'A-CED.A.1', 'A-CED.A.3', 'A-REI.A.1', 'A-REI.B.3'],
      lessons: [
        {
          number: 1,
          title: 'Analyze and Use Properties of Real Numbers',
          pages: '1-30',
          standards: ['A-SSE.A.1', 'A-SSE.A.2'],
          objectives: ['Apply properties of real numbers in algebraic contexts', 'Analyze and classify real numbers'],
          vocabulary: ['commutative', 'associative', 'distributive', 'identity'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Number system exploration', 'Algebraic expression investigations', 'Property discovery activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of real number properties and algebraic expressions',
              activities: ['Property applications', 'Expression simplification', 'Algebraic manipulation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply expression evaluation and simplification techniques',
              activities: ['Multi-step evaluations', 'Complex expressions', 'Error analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex expression and property problems',
              activities: ['Advanced properties', 'Real-world applications', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 2,
          title: 'Write and Evaluate Algebraic Expressions',
          pages: '21-50',
          standards: ['A-SSE.A.1', 'A-SSE.A.2'],
          objectives: ['Write and evaluate algebraic expressions', 'Simplify complex algebraic expressions'],
          vocabulary: ['variable', 'coefficient', 'constant', 'term'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Number system exploration', 'Algebraic expression investigations', 'Property discovery activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of real number properties and algebraic expressions',
              activities: ['Property applications', 'Expression simplification', 'Algebraic manipulation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply expression evaluation and simplification techniques',
              activities: ['Multi-step evaluations', 'Complex expressions', 'Error analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex expression and property problems',
              activities: ['Advanced properties', 'Real-world applications', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 3,
          title: 'Solve Linear Equations',
          pages: '41-70',
          standards: ['A-SSE.A.1', 'A-SSE.A.2'],
          objectives: ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems'],
          vocabulary: ['solution', 'equivalent', 'inverse operations', 'linear'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Equation balance exploration', 'Inequality reasoning', 'Real-world problem contexts']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build equation and inequality solving strategies',
              activities: ['Equation solving procedures', 'Inequality reasoning', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Multi-step equations', 'Complex inequalities', 'Graphical solutions']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex multi-step problems',
              activities: ['Advanced problem solving', 'Real-world applications', 'Mathematical modeling']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 4,
          title: 'Solve Linear Inequalities',
          pages: '61-90',
          standards: ['A-SSE.A.1', 'A-SSE.A.2'],
          objectives: ['Understand and apply concepts related to solve linear inequalities', 'Solve problems using appropriate algebraic strategies'],
          vocabulary: ['algebraic thinking', 'mathematical reasoning', 'problem solving', 'modeling'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Algebraic concept exploration', 'Pattern investigation', 'Mathematical reasoning']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build foundational algebraic understanding',
              activities: ['Concept development', 'Skill building', 'Guided practice']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic concepts and procedures',
              activities: ['Application practice', 'Problem solving', 'Multiple methods']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex algebraic problems',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 2',
      title: 'Functions and Linear Relationships',
      pages: '141-280',
      duration: '30 days',
      domain: 'Interpreting Functions & Building Functions',
      stemSpotlight: 'Data Science Applications',
      standards: ['F-IF.A.1', 'F-IF.A.2', 'F-IF.B.4', 'F-IF.B.6', 'F-IF.C.7', 'F-BF.A.1'],
      lessons: [
        {
          number: 5,
          title: 'Understand Relations and Functions',
          pages: '81-110',
          standards: ['F-IF.A.1', 'F-IF.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 6,
          title: 'Understand Linear Functions',
          pages: '101-130',
          standards: ['F-IF.A.1', 'F-IF.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 7,
          title: 'Write Linear Functions',
          pages: '121-150',
          standards: ['F-IF.A.1', 'F-IF.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 8,
          title: 'Graph Linear Functions',
          pages: '141-170',
          standards: ['F-IF.A.1', 'F-IF.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 9,
          title: 'Solve Problems Using Linear Functions',
          pages: '161-190',
          standards: ['F-IF.A.1', 'F-IF.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 3',
      title: 'Systems of Linear Equations',
      pages: '281-380',
      duration: '24 days',
      domain: 'Reasoning with Equations and Inequalities',
      stemSpotlight: 'Engineering Optimization',
      standards: ['A-REI.C.5', 'A-REI.C.6', 'A-REI.D.11', 'A-CED.A.2', 'A-CED.A.3'],
      lessons: [
        {
          number: 10,
          title: 'Understand Systems of Linear Equations',
          pages: '181-210',
          standards: ['A-REI.C.5', 'A-REI.C.6'],
          objectives: ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems'],
          vocabulary: ['solution', 'equivalent', 'inverse operations', 'linear'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Equation balance exploration', 'Inequality reasoning', 'Real-world problem contexts']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build equation and inequality solving strategies',
              activities: ['Equation solving procedures', 'Inequality reasoning', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Multi-step equations', 'Complex inequalities', 'Graphical solutions']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex multi-step problems',
              activities: ['Advanced problem solving', 'Real-world applications', 'Mathematical modeling']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 11,
          title: 'Solve Systems by Graphing',
          pages: '201-230',
          standards: ['A-REI.C.5', 'A-REI.C.6'],
          objectives: ['Solve systems of linear equations', 'Apply systems to model real-world situations'],
          vocabulary: ['intersection', 'substitution', 'elimination', 'solution set'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 12,
          title: 'Solve Systems by Substitution',
          pages: '221-250',
          standards: ['A-REI.C.5', 'A-REI.C.6'],
          objectives: ['Solve systems of linear equations', 'Apply systems to model real-world situations'],
          vocabulary: ['intersection', 'substitution', 'elimination', 'solution set'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Multiple constraint exploration', 'Intersection investigations', 'Real-world system modeling']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of systems and solution methods',
              activities: ['System setup and interpretation', 'Graphical solutions', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply systematic solving procedures',
              activities: ['Algebraic solution methods', 'Substitution and elimination', 'System analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex system applications',
              activities: ['Complex systems', 'Real-world applications', 'Optimization problems']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 13,
          title: 'Solve Systems by Linear Combination',
          pages: '241-270',
          standards: ['A-REI.C.5', 'A-REI.C.6'],
          objectives: ['Solve systems of linear equations', 'Apply systems to model real-world situations'],
          vocabulary: ['intersection', 'substitution', 'elimination', 'solution set'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Multiple constraint exploration', 'Intersection investigations', 'Real-world system modeling']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of systems and solution methods',
              activities: ['System setup and interpretation', 'Graphical solutions', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply systematic solving procedures',
              activities: ['Algebraic solution methods', 'Substitution and elimination', 'System analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex system applications',
              activities: ['Complex systems', 'Real-world applications', 'Optimization problems']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 4',
      title: 'Sequences and Exponential Functions',
      pages: '1-150',
      duration: '30 days',
      domain: 'Linear, Quadratic, and Exponential Models',
      stemSpotlight: 'Population Dynamics & Growth',
      standards: ['F-IF.A.3', 'F-IF.B.4', 'F-IF.C.7', 'F-IF.C.8', 'F-LE.A.1', 'F-LE.A.2', 'F-LE.B.5'],
      lessons: [
        {
          number: 14,
          title: 'Understand Sequences',
          pages: '261-290',
          standards: ['F-IF.A.3', 'F-IF.B.4'],
          objectives: ['Understand and apply concepts related to understand sequences', 'Solve problems using appropriate algebraic strategies'],
          vocabulary: ['algebraic thinking', 'mathematical reasoning', 'problem solving', 'modeling'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Growth pattern exploration', 'Sequence investigations', 'Exponential vs linear comparisons']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of exponential growth and sequences',
              activities: ['Sequence patterns', 'Exponential properties', 'Function comparisons']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply exponential modeling and analysis',
              activities: ['Exponential modeling', 'Growth and decay', 'Equation solving']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex exponential and sequence problems',
              activities: ['Complex modeling', 'Real-world applications', 'Advanced exponential concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 15,
          title: 'Understand Exponential Functions',
          pages: '281-310',
          standards: ['F-IF.A.3', 'F-IF.B.4'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 16,
          title: 'Compare Linear and Exponential Functions',
          pages: '301-330',
          standards: ['F-IF.A.3', 'F-IF.B.4'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 17,
          title: 'Solve Exponential Equations',
          pages: '321-350',
          standards: ['F-IF.A.3', 'F-IF.B.4'],
          objectives: ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems'],
          vocabulary: ['solution', 'equivalent', 'inverse operations', 'linear'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Growth pattern exploration', 'Sequence investigations', 'Exponential vs linear comparisons']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of exponential growth and sequences',
              activities: ['Sequence patterns', 'Exponential properties', 'Function comparisons']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply exponential modeling and analysis',
              activities: ['Exponential modeling', 'Growth and decay', 'Equation solving']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex exponential and sequence problems',
              activities: ['Complex modeling', 'Real-world applications', 'Advanced exponential concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 18,
          title: 'Use Exponential Functions to Model Situations',
          pages: '341-370',
          standards: ['F-IF.A.3', 'F-IF.B.4'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 5',
      title: 'Polynomials and Quadratic Functions',
      pages: '151-270',
      duration: '24 days',
      domain: 'Arithmetic with Polynomials and Rational Expressions',
      stemSpotlight: 'Physics & Projectile Motion',
      standards: ['A-APR.A.1', 'A-SSE.A.2', 'A-SSE.B.3', 'F-IF.B.4', 'F-IF.C.7', 'F-IF.C.8'],
      lessons: [
        {
          number: 19,
          title: 'Add and Subtract Polynomials',
          pages: '361-390',
          standards: ['A-APR.A.1', 'A-SSE.A.2'],
          objectives: ['Perform operations with polynomials', 'Apply polynomial concepts to solve problems'],
          vocabulary: ['degree', 'leading coefficient', 'monomial', 'binomial'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Polynomial structure exploration', 'Factoring investigations', 'Quadratic pattern discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build polynomial and quadratic understanding',
              activities: ['Polynomial operations', 'Quadratic properties', 'Factoring techniques']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic operations and factoring',
              activities: ['Advanced operations', 'Quadratic solving', 'Function analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex polynomial and quadratic problems',
              activities: ['Complex problems', 'Real-world applications', 'Advanced quadratic concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 20,
          title: 'Multiply Polynomials',
          pages: '381-410',
          standards: ['A-APR.A.1', 'A-SSE.A.2'],
          objectives: ['Perform operations with polynomials', 'Apply polynomial concepts to solve problems'],
          vocabulary: ['degree', 'leading coefficient', 'monomial', 'binomial'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Polynomial structure exploration', 'Factoring investigations', 'Quadratic pattern discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build polynomial and quadratic understanding',
              activities: ['Polynomial operations', 'Quadratic properties', 'Factoring techniques']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic operations and factoring',
              activities: ['Advanced operations', 'Quadratic solving', 'Function analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex polynomial and quadratic problems',
              activities: ['Complex problems', 'Real-world applications', 'Advanced quadratic concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 21,
          title: 'Understand Quadratic Functions',
          pages: '401-430',
          standards: ['A-APR.A.1', 'A-SSE.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 22,
          title: 'Solve Problems Using Quadratic Functions',
          pages: '421-450',
          standards: ['A-APR.A.1', 'A-SSE.A.2'],
          objectives: ['Understand and analyze function relationships', 'Apply function concepts to solve problems'],
          vocabulary: ['domain', 'range', 'input', 'output'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 6',
      title: 'Quadratic Equations and Functions',
      pages: '271-380',
      duration: '18 days',
      domain: 'Reasoning with Equations and Inequalities',
      stemSpotlight: 'Optimization Problems',
      standards: ['A-REI.B.4', 'A-REI.D.11', 'F-IF.C.8', 'F-BF.B.3'],
      lessons: [
        {
          number: 23,
          title: 'Solve Quadratic Equations by Graphing',
          pages: '441-470',
          standards: ['A-REI.B.4', 'A-REI.D.11'],
          objectives: ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems'],
          vocabulary: ['solution', 'equivalent', 'inverse operations', 'linear'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build function concepts and representations',
              activities: ['Function notation and evaluation', 'Domain and range', 'Function representations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function analysis and graphing techniques',
              activities: ['Function analysis', 'Graphing techniques', 'Function transformations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems and applications',
              activities: ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 24,
          title: 'Solve Quadratic Equations by Factoring',
          pages: '461-490',
          standards: ['A-REI.B.4', 'A-REI.D.11'],
          objectives: ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems'],
          vocabulary: ['solution', 'equivalent', 'inverse operations', 'linear'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Polynomial structure exploration', 'Factoring investigations', 'Quadratic pattern discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build polynomial and quadratic understanding',
              activities: ['Polynomial operations', 'Quadratic properties', 'Factoring techniques']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic operations and factoring',
              activities: ['Advanced operations', 'Quadratic solving', 'Function analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex polynomial and quadratic problems',
              activities: ['Complex problems', 'Real-world applications', 'Advanced quadratic concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 25,
          title: 'Solve Quadratic Equations Using the Quadratic Formula',
          pages: '481-510',
          standards: ['A-REI.B.4', 'A-REI.D.11'],
          objectives: ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems'],
          vocabulary: ['solution', 'equivalent', 'inverse operations', 'linear'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Polynomial structure exploration', 'Factoring investigations', 'Quadratic pattern discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build polynomial and quadratic understanding',
              activities: ['Polynomial operations', 'Quadratic properties', 'Factoring techniques']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic operations and factoring',
              activities: ['Advanced operations', 'Quadratic solving', 'Function analysis']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex polynomial and quadratic problems',
              activities: ['Complex problems', 'Real-world applications', 'Advanced quadratic concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 7',
      title: 'Statistics and Data Analysis',
      pages: '381-478',
      duration: '18 days',
      domain: 'Interpreting Categorical and Quantitative Data',
      stemSpotlight: 'Statistical Analysis',
      standards: ['S-ID.B.6', 'S-ID.C.7', 'S-ID.C.8', 'S-ID.C.9'],
      lessons: [
        {
          number: 26,
          title: 'Analyze Data Distributions',
          pages: '501-530',
          standards: ['S-ID.B.6', 'S-ID.C.7'],
          objectives: ['Understand and apply concepts related to analyze data distributions', 'Solve problems using appropriate algebraic strategies'],
          vocabulary: ['algebraic thinking', 'mathematical reasoning', 'problem solving', 'modeling'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Data collection and exploration', 'Distribution investigations', 'Statistical reasoning']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build statistical reasoning and data analysis skills',
              activities: ['Data organization', 'Statistical measures', 'Graph construction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply statistical methods and interpretation',
              activities: ['Data analysis', 'Model interpretation', 'Statistical reasoning']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex data analysis problems',
              activities: ['Advanced analysis', 'Inference making', 'Statistical applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 27,
          title: 'Interpret Linear Models',
          pages: '521-550',
          standards: ['S-ID.B.6', 'S-ID.C.7'],
          objectives: ['Understand and apply concepts related to interpret linear models', 'Solve problems using appropriate algebraic strategies'],
          vocabulary: ['algebraic thinking', 'mathematical reasoning', 'problem solving', 'modeling'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Growth pattern exploration', 'Sequence investigations', 'Exponential vs linear comparisons']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of exponential growth and sequences',
              activities: ['Sequence patterns', 'Exponential properties', 'Function comparisons']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply exponential modeling and analysis',
              activities: ['Exponential modeling', 'Growth and decay', 'Equation solving']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex exponential and sequence problems',
              activities: ['Complex modeling', 'Real-world applications', 'Advanced exponential concepts']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 28,
          title: 'Make Inferences and Justify Conclusions',
          pages: '541-570',
          standards: ['S-ID.B.6', 'S-ID.C.7'],
          objectives: ['Understand and apply concepts related to make inferences and justify conclusions', 'Solve problems using appropriate algebraic strategies'],
          vocabulary: ['algebraic thinking', 'mathematical reasoning', 'problem solving', 'modeling'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new algebraic concepts',
              activities: ['Data collection and exploration', 'Distribution investigations', 'Statistical reasoning']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build statistical reasoning and data analysis skills',
              activities: ['Data organization', 'Statistical measures', 'Graph construction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply statistical methods and interpretation',
              activities: ['Data analysis', 'Model interpretation', 'Statistical reasoning']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex data analysis problems',
              activities: ['Advanced analysis', 'Inference making', 'Statistical applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen algebraic skills and make connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-red-600 hover:text-red-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Algebra 1 Mathematics</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-7" className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Grade 7</Link>
              <Link href="/curriculum/grade-8" className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Grade 8</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-800 mb-2">
              Ready Classroom Mathematics Algebra 1
            </h1>
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • College and Career Readiness
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1354</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{units.length}</div>
              <div className="text-sm text-gray-600">Units</div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-rose-600">168</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Standards Coverage:</span> Common Core Algebra 1
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Session Structure:</span> 5-day Explore→Develop→Develop→Develop→Refine
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Assessment:</span> Continuous formative and summative evaluation
            </div>
          </div>
        </div>

        {/* Units Grid */}
        <div className="space-y-6">
          {units.map((unit, unitIndex) => (
            <div key={unitIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Unit Header */}
              <div className="bg-red-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{unit.unit}: {unit.title}</h2>
                    <p className="text-red-100 mb-2">Domain: {unit.domain}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {unit.standards.map((standard, idx) => (
                        <span key={idx} className="bg-red-500 px-2 py-1 rounded">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-red-100">
                    <div>Pages {unit.pages}</div>
                    <div>{unit.duration}</div>
                    <div className="text-xs mt-1">STEM: {unit.stemSpotlight}</div>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="p-6">
                <div className="space-y-4">
                  {unit.lessons.map((lesson) => (
                    <div key={lesson.number} className="border border-gray-200 rounded-lg">
                      {/* Lesson Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleLesson(lesson.number)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              Lesson {lesson.number}: {lesson.title}
                            </h3>
                            <div className="mt-1 text-sm text-gray-600">
                              Pages {lesson.pages} • Standards: {lesson.standards.join(', ')}
                            </div>
                          </div>
                          <div className="text-red-600">
                            {expandedLessons.has(lesson.number) ? '−' : '+'}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Lesson Content */}
                      {expandedLessons.has(lesson.number) && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          {/* Lesson Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Learning Objectives</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {lesson.objectives.map((obj, idx) => (
                                  <li key={idx}>• {obj}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Key Vocabulary</h4>
                              <div className="flex flex-wrap gap-2">
                                {lesson.vocabulary.map((term, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 5-Day Session Structure */}
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3">5-Day Session Structure</h4>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                              {lesson.sessions.map((session) => (
                                <div key={session.day} className={`p-3 rounded-lg border-l-4 ${{
                                  'Explore': 'bg-cyan-50 border-cyan-400',
                                  'Develop': 'bg-blue-50 border-blue-400',
                                  'Refine': 'bg-green-50 border-green-400'
                                }[session.type]}`}>
                                  <div className="font-medium text-sm text-gray-800">
                                    Day {session.day}: {session.type}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 mb-2">
                                    {session.focus}
                                  </div>
                                  <div className="space-y-1">
                                    {session.activities.map((activity, idx) => (
                                      <div key={idx} className="text-xs text-gray-500">
                                        • {activity}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Assessment Methods */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-800 mb-2">Assessment Methods</h4>
                            <div className="flex flex-wrap gap-2">
                              {lesson.assessments.map((assessment, idx) => (
                                <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                                  {assessment}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-red-800 mb-2">
            Algebra 1 Mathematics Complete
          </h3>
          <p className="text-gray-600">
            {totalLessons} lessons across {units.length} units • 1354 pages of comprehensive instruction
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Each lesson follows the proven 5-day structure: Explore concepts, Develop understanding through guided practice, and Refine skills for mastery.
          </p>
        </div>
      </div>
    </div>
  );
}
