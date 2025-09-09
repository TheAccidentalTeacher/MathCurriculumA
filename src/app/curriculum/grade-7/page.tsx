'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Grade7Curriculum() {
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
      title: 'Ratios and Proportional Relationships',
      pages: '15-140',
      duration: '25 days',
      domain: 'Ratios and Proportional Relationships',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
      lessons: [
        {
          number: 1,
          title: 'Solve Ratio and Rate Problems',
          pages: '1-20',
          standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
          objectives: ['Understand and apply concepts related to solve ratio and rate problems', 'Solve problems using appropriate strategies'],
          vocabulary: ['ratio', 'problems'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 2,
          title: 'Solve Percent Problems',
          pages: '16-35',
          standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
          objectives: ['Understand and apply concepts related to solve percent problems', 'Solve problems using appropriate strategies'],
          vocabulary: ['percent', 'problems'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 3,
          title: 'Solve Multistep Percent Problems',
          pages: '31-50',
          standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
          objectives: ['Understand and apply concepts related to solve multistep percent problems', 'Solve problems using appropriate strategies'],
          vocabulary: ['multistep', 'percent', 'problems'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 4,
          title: 'Analyze Proportional Relationships',
          pages: '46-65',
          standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
          objectives: ['Understand and apply concepts related to analyze proportional relationships', 'Solve problems using appropriate strategies'],
          vocabulary: ['analyze', 'proportional', 'relationships'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 5,
          title: 'Solve Proportional Reasoning Problems',
          pages: '61-80',
          standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
          objectives: ['Understand and apply concepts related to solve proportional reasoning problems', 'Solve problems using appropriate strategies'],
          vocabulary: ['proportional', 'reasoning', 'problems'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 6,
          title: 'Understand Addition and Subtraction on the Number Line',
          pages: '76-95',
          standards: ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3'],
          objectives: ['Understand and apply concepts related to understand addition and subtraction on the number line', 'Solve problems using appropriate strategies'],
          vocabulary: ['addition', 'subtraction', 'number'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Number line exploration', 'Integer investigations', 'Pattern recognition']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build number sense and operation understanding',
              activities: ['Operation algorithms', 'Number properties', 'Computational fluency']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply computational strategies',
              activities: ['Multi-step calculations', 'Order of operations', 'Estimation strategies']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex number problems',
              activities: ['Complex problems', 'Error analysis', 'Multiple representations']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 2',
      title: 'Operations with Rational Numbers',
      pages: '141-250',
      duration: '25 days',
      domain: 'The Number System',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
      lessons: [
        {
          number: 7,
          title: 'Add and Subtract Rational Numbers',
          pages: '91-110',
          standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
          objectives: ['Understand and apply concepts related to add and subtract rational numbers', 'Solve problems using appropriate strategies'],
          vocabulary: ['subtract', 'rational', 'numbers'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 8,
          title: 'Understand Multiplication and Division of Rational Numbers',
          pages: '106-125',
          standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
          objectives: ['Understand and apply concepts related to understand multiplication and division of rational numbers', 'Solve problems using appropriate strategies'],
          vocabulary: ['multiplication', 'division', 'rational', 'numbers'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 9,
          title: 'Multiply and Divide Rational Numbers',
          pages: '121-140',
          standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
          objectives: ['Understand and apply concepts related to multiply and divide rational numbers', 'Solve problems using appropriate strategies'],
          vocabulary: ['multiply', 'divide', 'rational', 'numbers'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 10,
          title: 'Solve Problems with Rational Numbers',
          pages: '136-155',
          standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
          objectives: ['Understand and apply concepts related to solve problems with rational numbers', 'Solve problems using appropriate strategies'],
          vocabulary: ['problems', 'rational', 'numbers'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 11,
          title: 'Generate Equivalent Expressions',
          pages: '151-170',
          standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
          objectives: ['Understand and apply concepts related to generate equivalent expressions', 'Solve problems using appropriate strategies'],
          vocabulary: ['generate', 'equivalent', 'expressions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 12,
          title: 'Add and Subtract Linear Expressions',
          pages: '166-185',
          standards: ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3'],
          objectives: ['Understand and apply concepts related to add and subtract linear expressions', 'Solve problems using appropriate strategies'],
          vocabulary: ['subtract', 'linear', 'expressions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Expression building', 'Equation exploration', 'Variable relationship discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build algebraic thinking and representation',
              activities: ['Variable representation', 'Expression building', 'Equation setup']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Algebraic manipulation', 'Solution procedures', 'Property applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex algebraic problems',
              activities: ['Complex equations', 'Multi-step problems', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 3',
      title: 'Expressions and Equations',
      pages: '251-400',
      duration: '30 days',
      domain: 'Expressions and Equations',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
      lessons: [
        {
          number: 13,
          title: 'Factor Linear Expressions',
          pages: '181-200',
          standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
          objectives: ['Understand and apply concepts related to factor linear expressions', 'Solve problems using appropriate strategies'],
          vocabulary: ['factor', 'linear', 'expressions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Expression building', 'Equation exploration', 'Variable relationship discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build algebraic thinking and representation',
              activities: ['Variable representation', 'Expression building', 'Equation setup']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Algebraic manipulation', 'Solution procedures', 'Property applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex algebraic problems',
              activities: ['Complex equations', 'Multi-step problems', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 14,
          title: 'Solve Equations Using Properties of Operations',
          pages: '196-215',
          standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
          objectives: ['Understand and apply concepts related to solve equations using properties of operations', 'Solve problems using appropriate strategies'],
          vocabulary: ['equations', 'properties', 'operations'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of ratio and proportion concepts',
              activities: ['Ratio tables', 'Proportion setup', 'Unit rate calculations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply proportional reasoning strategies',
              activities: ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex ratio and rate problems',
              activities: ['Complex proportions', 'Multi-step problems', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 15,
          title: 'Solve Equations with Variables on Both Sides',
          pages: '211-230',
          standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
          objectives: ['Understand and apply concepts related to solve equations with variables on both sides', 'Solve problems using appropriate strategies'],
          vocabulary: ['equations', 'variables', 'sides'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Expression building', 'Equation exploration', 'Variable relationship discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build algebraic thinking and representation',
              activities: ['Variable representation', 'Expression building', 'Equation setup']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Algebraic manipulation', 'Solution procedures', 'Property applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex algebraic problems',
              activities: ['Complex equations', 'Multi-step problems', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 16,
          title: 'Solve Multistep Problems with Equations and Inequalities',
          pages: '226-245',
          standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
          objectives: ['Understand and apply concepts related to solve multistep problems with equations and inequalities', 'Solve problems using appropriate strategies'],
          vocabulary: ['multistep', 'problems', 'equations', 'inequalities'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Expression building', 'Equation exploration', 'Variable relationship discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build algebraic thinking and representation',
              activities: ['Variable representation', 'Expression building', 'Equation setup']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Algebraic manipulation', 'Solution procedures', 'Property applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex algebraic problems',
              activities: ['Complex equations', 'Multi-step problems', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 17,
          title: 'Scale Drawings',
          pages: '241-260',
          standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
          objectives: ['Understand and apply concepts related to scale drawings', 'Solve problems using appropriate strategies'],
          vocabulary: ['scale', 'drawings'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Concept exploration', 'Pattern investigation', 'Prior knowledge activation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build foundational understanding',
              activities: ['Concept development', 'Skill building', 'Guided practice']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply concepts and procedures',
              activities: ['Application practice', 'Problem solving', 'Multiple methods']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex problems',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 18,
          title: 'Understand and Apply the Pythagorean Theorem',
          pages: '256-275',
          standards: ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4'],
          objectives: ['Understand and apply concepts related to understand and apply the pythagorean theorem', 'Solve problems using appropriate strategies'],
          vocabulary: ['pythagorean', 'theorem'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Concept exploration', 'Pattern investigation', 'Prior knowledge activation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build foundational understanding',
              activities: ['Concept development', 'Skill building', 'Guided practice']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply concepts and procedures',
              activities: ['Application practice', 'Problem solving', 'Multiple methods']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex problems',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 4',
      title: 'Geometry and Measurement',
      pages: '1-150',
      duration: '30 days',
      domain: 'Geometry',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
      lessons: [
        {
          number: 19,
          title: 'Apply the Pythagorean Theorem in Real-World Problems',
          pages: '271-290',
          standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
          objectives: ['Understand and apply concepts related to apply the pythagorean theorem in real-world problems', 'Solve problems using appropriate strategies'],
          vocabulary: ['pythagorean', 'theorem', 'real-world', 'problems'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Concept exploration', 'Pattern investigation', 'Prior knowledge activation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build foundational understanding',
              activities: ['Concept development', 'Skill building', 'Guided practice']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply concepts and procedures',
              activities: ['Application practice', 'Problem solving', 'Multiple methods']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex problems',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 20,
          title: 'Find Area and Circumference of a Circle',
          pages: '286-305',
          standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
          objectives: ['Understand and apply concepts related to find area and circumference of a circle', 'Solve problems using appropriate strategies'],
          vocabulary: ['circumference', 'circle'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 21,
          title: 'Find Areas of Circles',
          pages: '301-320',
          standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
          objectives: ['Understand and apply concepts related to find areas of circles', 'Solve problems using appropriate strategies'],
          vocabulary: ['areas', 'circles'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 22,
          title: 'Solve Problems Involving Circles',
          pages: '316-335',
          standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
          objectives: ['Understand and apply concepts related to solve problems involving circles', 'Solve problems using appropriate strategies'],
          vocabulary: ['problems', 'involving', 'circles'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Expression building', 'Equation exploration', 'Variable relationship discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build algebraic thinking and representation',
              activities: ['Variable representation', 'Expression building', 'Equation setup']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply algebraic procedures and properties',
              activities: ['Algebraic manipulation', 'Solution procedures', 'Property applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex algebraic problems',
              activities: ['Complex equations', 'Multi-step problems', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 23,
          title: 'Angle Relationships',
          pages: '331-350',
          standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
          objectives: ['Understand and apply concepts related to angle relationships', 'Solve problems using appropriate strategies'],
          vocabulary: ['angle', 'relationships'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 24,
          title: 'Draw Geometric Shapes',
          pages: '346-365',
          standards: ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6'],
          objectives: ['Understand and apply concepts related to draw geometric shapes', 'Solve problems using appropriate strategies'],
          vocabulary: ['geometric', 'shapes'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Concept exploration', 'Pattern investigation', 'Prior knowledge activation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build foundational understanding',
              activities: ['Concept development', 'Skill building', 'Guided practice']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply concepts and procedures',
              activities: ['Application practice', 'Problem solving', 'Multiple methods']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex problems',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 5',
      title: 'Angle Relationships',
      pages: '151-225',
      duration: '15 days',
      domain: 'Geometry',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['7.G.B.5'],
      lessons: [
        {
          number: 25,
          title: 'Find Unknown Angle Measures',
          pages: '361-380',
          standards: ['7.G.B.5'],
          objectives: ['Understand and apply concepts related to find unknown angle measures', 'Solve problems using appropriate strategies'],
          vocabulary: ['unknown', 'angle', 'measures'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 26,
          title: 'Find Volume and Surface Area of Right Prisms',
          pages: '376-395',
          standards: ['7.G.B.5'],
          objectives: ['Understand and apply concepts related to find volume and surface area of right prisms', 'Solve problems using appropriate strategies'],
          vocabulary: ['volume', 'surface', 'right', 'prisms'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 27,
          title: 'Find Volume and Surface Area of Pyramids',
          pages: '391-410',
          standards: ['7.G.B.5'],
          objectives: ['Understand and apply concepts related to find volume and surface area of pyramids', 'Solve problems using appropriate strategies'],
          vocabulary: ['volume', 'surface', 'pyramids'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 28,
          title: 'Find Volume and Surface Area of Cylinders',
          pages: '406-425',
          standards: ['7.G.B.5'],
          objectives: ['Understand and apply concepts related to find volume and surface area of cylinders', 'Solve problems using appropriate strategies'],
          vocabulary: ['volume', 'surface', 'cylinders'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 29,
          title: 'Find Volume and Surface Area of Cones',
          pages: '421-440',
          standards: ['7.G.B.5'],
          objectives: ['Understand and apply concepts related to find volume and surface area of cones', 'Solve problems using appropriate strategies'],
          vocabulary: ['volume', 'surface', 'cones'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 30,
          title: 'Find Volume and Surface Area of Spheres',
          pages: '436-455',
          standards: ['7.G.B.5'],
          objectives: ['Understand and apply concepts related to find volume and surface area of spheres', 'Solve problems using appropriate strategies'],
          vocabulary: ['volume', 'surface', 'spheres'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Shape investigations', 'Transformation exploration', 'Measurement activities']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build geometric understanding and visualization',
              activities: ['Shape properties', 'Measurement techniques', 'Geometric relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply geometric properties and relationships',
              activities: ['Formula applications', 'Geometric reasoning', 'Coordinate geometry']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex geometric problems',
              activities: ['Complex figures', 'Proof reasoning', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 6',
      title: 'Surface Area and Volume',
      pages: '226-330',
      duration: '25 days',
      domain: 'Geometry',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['7.G.B.6'],
      lessons: [
        {
          number: 31,
          title: 'Understand Statistical Questions and Data Distributions',
          pages: '451-470',
          standards: ['7.G.B.6'],
          objectives: ['Understand and apply concepts related to understand statistical questions and data distributions', 'Solve problems using appropriate strategies'],
          vocabulary: ['statistical', 'questions', 'distributions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Data collection', 'Distribution exploration', 'Sample investigations']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build statistical reasoning and data analysis',
              activities: ['Data organization', 'Graph construction', 'Measure calculation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply statistical methods and interpretation',
              activities: ['Distribution analysis', 'Statistical reasoning', 'Interpretation']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex data problems',
              activities: ['Complex data sets', 'Statistical inference', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 32,
          title: 'Analyze Data Distributions',
          pages: '466-485',
          standards: ['7.G.B.6'],
          objectives: ['Understand and apply concepts related to analyze data distributions', 'Solve problems using appropriate strategies'],
          vocabulary: ['analyze', 'distributions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Data collection', 'Distribution exploration', 'Sample investigations']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build statistical reasoning and data analysis',
              activities: ['Data organization', 'Graph construction', 'Measure calculation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply statistical methods and interpretation',
              activities: ['Distribution analysis', 'Statistical reasoning', 'Interpretation']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex data problems',
              activities: ['Complex data sets', 'Statistical inference', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 33,
          title: 'Find Probability of Simple and Compound Events',
          pages: '481-500',
          standards: ['7.G.B.6'],
          objectives: ['Understand and apply concepts related to find probability of simple and compound events', 'Solve problems using appropriate strategies'],
          vocabulary: ['probability', 'simple', 'compound', 'events'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Data collection', 'Distribution exploration', 'Sample investigations']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build statistical reasoning and data analysis',
              activities: ['Data organization', 'Graph construction', 'Measure calculation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply statistical methods and interpretation',
              activities: ['Distribution analysis', 'Statistical reasoning', 'Interpretation']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex data problems',
              activities: ['Complex data sets', 'Statistical inference', 'Real-world applications']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-green-600 hover:text-green-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Grade 7 Mathematics</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-8" className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Grade 8</Link>
              <Link href="/curriculum/algebra-1" className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Algebra 1</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              Ready Classroom Mathematics Grade 7
            </h1>
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • Mathematical Proficiency
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">944</div>
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
              <div className="text-2xl font-bold text-rose-600">170</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Standards Coverage:</span> Common Core Mathematics Grade 7
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
              <div className="bg-green-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{unit.unit}: {unit.title}</h2>
                    <p className="text-green-100 mb-2">Domain: {unit.domain}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {unit.standards.map((standard, idx) => (
                        <span key={idx} className="bg-green-500 px-2 py-1 rounded">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-green-100">
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
                          <div className="text-green-600">
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
          <h3 className="text-xl font-bold text-green-800 mb-2">
            Grade 7 Mathematics Complete
          </h3>
          <p className="text-gray-600">
            {totalLessons} lessons across {units.length} units • {944} pages of comprehensive instruction
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Each lesson follows the proven 5-day structure: Explore concepts, Develop understanding through guided practice, and Refine skills for mastery.
          </p>
        </div>
      </div>
    </div>
  );
}
