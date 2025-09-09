'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Grade8Curriculum() {
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
      title: 'Rigid Transformations and Congruence',
      pages: '15-112',
      duration: '20 days',
      domain: 'Geometry',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
      lessons: [
        {
          number: 1,
          title: 'Translations',
          pages: '1-20',
          standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
          objectives: ['Understand and apply concepts related to translations', 'Solve problems using appropriate strategies'],
          vocabulary: ['translations'],
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
          number: 2,
          title: 'Reflections',
          pages: '16-35',
          standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
          objectives: ['Understand and apply concepts related to reflections', 'Solve problems using appropriate strategies'],
          vocabulary: ['reflections'],
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
          number: 3,
          title: 'Rotations',
          pages: '31-50',
          standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
          objectives: ['Understand and apply concepts related to rotations', 'Solve problems using appropriate strategies'],
          vocabulary: ['rotations'],
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
          number: 4,
          title: 'Describe Transformation Sequences',
          pages: '46-65',
          standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
          objectives: ['Understand and apply concepts related to describe transformation sequences', 'Solve problems using appropriate strategies'],
          vocabulary: ['describe', 'transformation', 'sequences'],
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
          number: 5,
          title: 'Understand Dilations',
          pages: '61-80',
          standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
          objectives: ['Understand and apply concepts related to understand dilations', 'Solve problems using appropriate strategies'],
          vocabulary: ['dilations'],
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
          number: 6,
          title: 'Describe Dilations',
          pages: '76-95',
          standards: ['8.G.A.1', '8.G.A.2', '8.G.A.3'],
          objectives: ['Understand and apply concepts related to describe dilations', 'Solve problems using appropriate strategies'],
          vocabulary: ['describe', 'dilations'],
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
      unit: 'Unit 2',
      title: 'Dilations, Similarity, and Introducing Slope',
      pages: '113-200',
      duration: '20 days',
      domain: 'Geometry',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
      lessons: [
        {
          number: 7,
          title: 'Understand Similar Figures',
          pages: '91-110',
          standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
          objectives: ['Understand and apply concepts related to understand similar figures', 'Solve problems using appropriate strategies'],
          vocabulary: ['similar', 'figures'],
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
          number: 8,
          title: 'Angles',
          pages: '106-125',
          standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
          objectives: ['Understand and apply concepts related to angles', 'Solve problems using appropriate strategies'],
          vocabulary: ['angles'],
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
          number: 9,
          title: 'Proportional Relationships and Slope',
          pages: '121-140',
          standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
          objectives: ['Understand and apply concepts related to proportional relationships and slope', 'Solve problems using appropriate strategies'],
          vocabulary: ['proportional', 'relationships', 'slope'],
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
          title: 'Understand Slope',
          pages: '136-155',
          standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
          objectives: ['Understand and apply concepts related to understand slope', 'Solve problems using appropriate strategies'],
          vocabulary: ['slope'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Slope-Intercept Form',
          pages: '151-170',
          standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
          objectives: ['Understand and apply concepts related to slope-intercept form', 'Solve problems using appropriate strategies'],
          vocabulary: ['slope-intercept'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Analyze Linear Functions',
          pages: '166-185',
          standards: ['8.G.A.3', '8.G.A.4', '8.G.A.5'],
          objectives: ['Understand and apply concepts related to analyze linear functions', 'Solve problems using appropriate strategies'],
          vocabulary: ['analyze', 'linear', 'functions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
      title: 'Linear Relationships',
      pages: '201-330',
      duration: '25 days',
      domain: 'Functions',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
      lessons: [
        {
          number: 13,
          title: 'Construct Linear Functions for Real-World Problems',
          pages: '181-200',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
          objectives: ['Understand and apply concepts related to construct linear functions for real-world problems', 'Solve problems using appropriate strategies'],
          vocabulary: ['construct', 'linear', 'functions', 'real-world'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Understand Systems of Linear Equations',
          pages: '196-215',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
          objectives: ['Understand and apply concepts related to understand systems of linear equations', 'Solve problems using appropriate strategies'],
          vocabulary: ['systems', 'linear', 'equations'],
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
          number: 15,
          title: 'Solve Systems by Graphing',
          pages: '211-230',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
          objectives: ['Understand and apply concepts related to solve systems by graphing', 'Solve problems using appropriate strategies'],
          vocabulary: ['systems', 'graphing'],
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
          title: 'Solve Systems by Substitution',
          pages: '226-245',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
          objectives: ['Understand and apply concepts related to solve systems by substitution', 'Solve problems using appropriate strategies'],
          vocabulary: ['systems', 'substitution'],
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
          title: 'Solve Systems by Elimination',
          pages: '241-260',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
          objectives: ['Understand and apply concepts related to solve systems by elimination', 'Solve problems using appropriate strategies'],
          vocabulary: ['systems', 'elimination'],
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
          number: 18,
          title: 'Solve Problems with Systems of Linear Equations',
          pages: '256-275',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5'],
          objectives: ['Understand and apply concepts related to solve problems with systems of linear equations', 'Solve problems using appropriate strategies'],
          vocabulary: ['problems', 'systems', 'linear', 'equations'],
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
      unit: 'Unit 4',
      title: 'Linear Equations and Linear Systems',
      pages: '331-450',
      duration: '25 days',
      domain: 'Expressions and Equations',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['8.EE.C.7', '8.EE.C.8'],
      lessons: [
        {
          number: 19,
          title: 'Understand Functions',
          pages: '271-290',
          standards: ['8.EE.C.7', '8.EE.C.8'],
          objectives: ['Understand and apply concepts related to understand functions', 'Solve problems using appropriate strategies'],
          vocabulary: ['functions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Compare Functions',
          pages: '286-305',
          standards: ['8.EE.C.7', '8.EE.C.8'],
          objectives: ['Understand and apply concepts related to compare functions', 'Solve problems using appropriate strategies'],
          vocabulary: ['compare', 'functions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Use Functions to Model Linear Relationships',
          pages: '301-320',
          standards: ['8.EE.C.7', '8.EE.C.8'],
          objectives: ['Understand and apply concepts related to use functions to model linear relationships', 'Solve problems using appropriate strategies'],
          vocabulary: ['functions', 'model', 'linear', 'relationships'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Understand Integer Exponents',
          pages: '316-335',
          standards: ['8.EE.C.7', '8.EE.C.8'],
          objectives: ['Understand and apply concepts related to understand integer exponents', 'Solve problems using appropriate strategies'],
          vocabulary: ['integer', 'exponents'],
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
        },
        {
          number: 23,
          title: 'Understand Scientific Notation',
          pages: '331-350',
          standards: ['8.EE.C.7', '8.EE.C.8'],
          objectives: ['Understand and apply concepts related to understand scientific notation', 'Solve problems using appropriate strategies'],
          vocabulary: ['scientific', 'notation'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Number magnitude exploration', 'Exponent investigations', 'Real-world applications']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of scientific notation and exponents',
              activities: ['Notation conversion', 'Magnitude comparison', 'Basic operations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply scientific notation in calculations',
              activities: ['Calculation procedures', 'Problem solving', 'Real-world contexts']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex scientific notation problems',
              activities: ['Complex calculations', 'Error analysis', 'Applications']
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
          title: 'Compute with Scientific Notation',
          pages: '346-365',
          standards: ['8.EE.C.7', '8.EE.C.8'],
          objectives: ['Understand and apply concepts related to compute with scientific notation', 'Solve problems using appropriate strategies'],
          vocabulary: ['compute', 'scientific', 'notation'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Number magnitude exploration', 'Exponent investigations', 'Real-world applications']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of scientific notation and exponents',
              activities: ['Notation conversion', 'Magnitude comparison', 'Basic operations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply scientific notation in calculations',
              activities: ['Calculation procedures', 'Problem solving', 'Real-world contexts']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex scientific notation problems',
              activities: ['Complex calculations', 'Error analysis', 'Applications']
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
      title: 'Functions',
      pages: '451-530',
      duration: '15 days',
      domain: 'Functions',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
      lessons: [
        {
          number: 25,
          title: 'Understand Square Roots and Cube Roots',
          pages: '361-380',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
          objectives: ['Understand and apply concepts related to understand square roots and cube roots', 'Solve problems using appropriate strategies'],
          vocabulary: ['square', 'roots', 'roots'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Number magnitude exploration', 'Exponent investigations', 'Real-world applications']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of scientific notation and exponents',
              activities: ['Notation conversion', 'Magnitude comparison', 'Basic operations']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply scientific notation in calculations',
              activities: ['Calculation procedures', 'Problem solving', 'Real-world contexts']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex scientific notation problems',
              activities: ['Complex calculations', 'Error analysis', 'Applications']
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
          title: 'Understand the Pythagorean Theorem',
          pages: '376-395',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
          objectives: ['Understand and apply concepts related to understand the pythagorean theorem', 'Solve problems using appropriate strategies'],
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
        },
        {
          number: 27,
          title: 'Apply the Pythagorean Theorem',
          pages: '391-410',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
          objectives: ['Understand and apply concepts related to apply the pythagorean theorem', 'Solve problems using appropriate strategies'],
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
        },
        {
          number: 28,
          title: 'Find Volume of Cylinders',
          pages: '406-425',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
          objectives: ['Understand and apply concepts related to find volume of cylinders', 'Solve problems using appropriate strategies'],
          vocabulary: ['volume', 'cylinders'],
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
          title: 'Scatter Plots',
          pages: '421-440',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
          objectives: ['Understand and apply concepts related to scatter plots', 'Solve problems using appropriate strategies'],
          vocabulary: ['scatter', 'plots'],
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
          number: 30,
          title: 'Analyze Linear Associations',
          pages: '436-455',
          standards: ['8.F.A.1', '8.F.A.2', '8.F.A.3'],
          objectives: ['Understand and apply concepts related to analyze linear associations', 'Solve problems using appropriate strategies'],
          vocabulary: ['analyze', 'linear', 'associations'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
      title: 'Scientific Notation and Irrational Numbers',
      pages: '1-150',
      duration: '30 days',
      domain: 'Expressions and Equations',
      stemSpotlight: 'Mathematical Innovation',
      standards: ['8.EE.A.1', '8.EE.A.2', '8.EE.A.3', '8.EE.A.4', '8.NS.A.1', '8.NS.A.2'],
      lessons: [
        {
          number: 31,
          title: 'Use Linear Models to Make Predictions',
          pages: '451-470',
          standards: ['8.EE.A.1', '8.EE.A.2', '8.EE.A.3', '8.EE.A.4', '8.NS.A.1', '8.NS.A.2'],
          objectives: ['Understand and apply concepts related to use linear models to make predictions', 'Solve problems using appropriate strategies'],
          vocabulary: ['linear', 'models', 'predictions'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Function pattern exploration', 'Graph investigations', 'Input-output relationships']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of function concepts',
              activities: ['Function notation', 'Graph construction', 'Table analysis']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply function representations and analysis',
              activities: ['Function analysis', 'Rate of change', 'Linear relationships']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Solve complex function problems',
              activities: ['Complex functions', 'Real-world modeling', 'Function comparisons']
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
          title: 'Analyze Two-Way Tables',
          pages: '466-485',
          standards: ['8.EE.A.1', '8.EE.A.2', '8.EE.A.3', '8.EE.A.4', '8.NS.A.1', '8.NS.A.2'],
          objectives: ['Understand and apply concepts related to analyze two-way tables', 'Solve problems using appropriate strategies'],
          vocabulary: ['analyze', 'two-way', 'tables'],
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
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-purple-600 hover:text-purple-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Grade 8 Mathematics</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-7" className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Grade 7</Link>
              <Link href="/curriculum/algebra-1" className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Algebra 1</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">
              Ready Classroom Mathematics Grade 8
            </h1>
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • Mathematical Proficiency
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">876</div>
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
              <span className="font-medium">Standards Coverage:</span> Common Core Mathematics Grade 8
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
              <div className="bg-purple-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{unit.unit}: {unit.title}</h2>
                    <p className="text-purple-100 mb-2">Domain: {unit.domain}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {unit.standards.map((standard, idx) => (
                        <span key={idx} className="bg-purple-500 px-2 py-1 rounded">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-purple-100">
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
                          <div className="text-purple-600">
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
          <h3 className="text-xl font-bold text-purple-800 mb-2">
            Grade 8 Mathematics Complete
          </h3>
          <p className="text-gray-600">
            {totalLessons} lessons across {units.length} units • {876} pages of comprehensive instruction
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Each lesson follows the proven 5-day structure: Explore concepts, Develop understanding through guided practice, and Refine skills for mastery.
          </p>
        </div>
      </div>
    </div>
  );
}
