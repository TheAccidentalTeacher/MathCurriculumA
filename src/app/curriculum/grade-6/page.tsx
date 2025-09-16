'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTeacherMode } from '@/contexts/TeacherModeContext';

export default function Grade6Curriculum() {
  const { isTeacherMode } = useTeacherMode();
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
      title: 'Area, Algebraic Expressions, and Exponents',
      pages: '1-140',
      duration: '30 days',
      domain: 'Expressions and Equations',
      stemSpotlight: 'Tetsuya "Ted" Fujita',
      standards: ['6.G.A.1', '6.G.A.4', '6.EE.A.1', '6.EE.A.2', '6.EE.A.3', '6.NS.B.4'],
      lessons: [
        {
          number: 1,
          title: 'Find the Area of a Parallelogram',
          pages: '3-18',
          standards: ['6.G.A.1'],
          objectives: ['Apply area formulas to parallelograms', 'Understand area as a measure of region coverage'],
          vocabulary: ['parallelogram', 'base', 'height', 'area formula'],
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce new lesson content',
              activities: ['Area investigations', 'Shape decomposition', 'Pattern recognition']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of parallelogram area formula',
              activities: ['Formula derivation', 'Base and height identification', 'Guided practice']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply parallelogram area concepts',
              activities: ['Problem solving', 'Multiple representations', 'Real-world applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understanding to complex parallelograms',
              activities: ['Complex figures', 'Error analysis', 'Mathematical reasoning']
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
          title: 'Find the Area of Triangles and Other Polygons',
          pages: '19-40',
          standards: ['6.G.A.1'],
          objectives: ['Calculate areas of triangles and composite figures', 'Decompose complex shapes'],
          vocabulary: ['triangle', 'polygon', 'composite figure', 'decomposition'],
          assessments: ['Lesson Quiz', 'Problem Set', 'Performance Task'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce triangle area concepts',
              activities: ['Shape exploration', 'Area comparisons', 'Pattern investigation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of triangle area formula',
              activities: ['Formula development', 'Base-height relationships', 'Multiple examples']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply triangle area to composite figures',
              activities: ['Complex polygons', 'Decomposition strategies', 'Real-world problems']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend to irregular polygons and problem solving',
              activities: ['Irregular shapes', 'Multiple methods', 'Error analysis']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 3,
          title: 'Use Nets to Find Surface Area',
          pages: '41-62',
          standards: ['6.G.A.4'],
          objectives: ['Represent 3D figures using nets', 'Calculate surface area from nets'],
          vocabulary: ['net', 'surface area', 'prism', 'pyramid'],
          assessments: ['Construction Activity', 'Lesson Quiz', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and explore 3D to 2D relationships',
              activities: ['3D shape investigation', 'Net exploration', 'Pattern discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of nets and surface area',
              activities: ['Net construction', 'Surface area calculation', 'Multiple examples']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply surface area concepts to various shapes',
              activities: ['Complex nets', 'Problem solving', 'Real-world applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend to irregular shapes and problem solving',
              activities: ['Composite figures', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 4,
          title: 'Work with Algebraic Expressions',
          pages: '63-84',
          standards: ['6.EE.A.2'],
          objectives: ['Write and interpret algebraic expressions', 'Identify parts of expressions'],
          vocabulary: ['variable', 'expression', 'term', 'coefficient'],
          assessments: ['Expression Writing Task', 'Lesson Quiz', 'Peer Review'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce variables',
              activities: ['Pattern investigation', 'Variable exploration', 'Expression discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of algebraic expressions',
              activities: ['Expression writing', 'Variable substitution', 'Term identification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply expression concepts to word problems',
              activities: ['Word problem translation', 'Multiple representations', 'Real-world contexts']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend to complex expressions and reasoning',
              activities: ['Multi-step expressions', 'Error analysis', 'Mathematical justification']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 5,
          title: 'Write and Evaluate Expressions with Exponents',
          pages: '85-106',
          standards: ['6.EE.A.1'],
          objectives: ['Understand exponential notation', 'Evaluate expressions with exponents'],
          vocabulary: ['exponent', 'base', 'power', 'exponential form'],
          assessments: ['Computation Practice', 'Lesson Quiz', 'Exit Ticket'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce exponent notation',
              activities: ['Repeated multiplication patterns', 'Exponent exploration', 'Notation discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of exponent rules',
              activities: ['Base and exponent identification', 'Power evaluation', 'Pattern recognition']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply exponent concepts to problem solving',
              activities: ['Multi-step problems', 'Real-world applications', 'Order of operations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend to complex expressions with exponents',
              activities: ['Complex expressions', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 6,
          title: 'Find Greatest Common Factor and Least Common Multiple',
          pages: '107-128',
          standards: ['6.NS.B.4'],
          objectives: ['Find GCF and LCM of whole numbers', 'Apply GCF to factor expressions'],
          vocabulary: ['factor', 'multiple', 'GCF', 'LCM', 'prime factorization'],
          assessments: ['Factor Tree Activity', 'Lesson Quiz', 'Problem Solving'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and explore factor relationships',
              activities: ['Factor investigation', 'Multiple patterns', 'Relationship discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of GCF and LCM',
              activities: ['Factor listing', 'GCF methods', 'LCM strategies']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply GCF and LCM to problem solving',
              activities: ['Real-world problems', 'Multiple methods', 'Application tasks']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend to complex problems and reasoning',
              activities: ['Multi-step problems', 'Error analysis', 'Mathematical justification']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            }
          ]
        }
      ]
    },
    {
      unit: 'Unit 2',
      title: 'Base-Ten Operations, Division with Fractions, and Volume',
      pages: '143-262',
      duration: '25 days',
      domain: 'Decimals and Fractions',
      stemSpotlight: 'Isabella Aiona Abbott',
      standards: ['6.NS.A.1', '6.NS.B.2', '6.NS.B.3', '6.G.A.2'],
      lessons: [
        {
          number: 7,
          title: 'Add, Subtract, and Multiply Multi-Digit Decimals',
          pages: '145-166',
          standards: ['6.NS.B.3'],
          objectives: ['Perform operations with decimals', 'Apply decimal operations to real-world problems'],
          vocabulary: ['decimal', 'place value', 'algorithm', 'estimation'],
          assessments: ['Computation Fluency Check', 'Lesson Quiz', 'Word Problems'],
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and explore decimal operations',
              activities: ['Decimal place value exploration', 'Pattern investigation', 'Real-world decimal contexts']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of decimal algorithms',
              activities: ['Algorithm development', 'Place value alignment', 'Estimation strategies']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply decimal operations to problem solving',
              activities: ['Multi-step decimal problems', 'Real-world applications', 'Calculator verification']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend to complex decimal calculations',
              activities: ['Complex expressions', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            }
          ]
        },
        {
          number: 8,
          title: 'Divide Whole Numbers and Multi-Digit Decimals',
          pages: '167-194',
          standards: ['6.NS.B.2'],
          objectives: ['Use standard algorithm for division', 'Understand decimal division'],
          vocabulary: ['dividend', 'divisor', 'quotient', 'remainder'],
          assessments: ['Algorithm Practice', 'Lesson Quiz', 'Real-World Applications']
        },
        {
          number: 9,
          title: 'Understand Division with Fractions',
          pages: '195-206',
          standards: ['6.NS.A.1'],
          objectives: ['Interpret fraction division using visual models', 'Connect to multiplication'],
          vocabulary: ['unit fraction', 'visual model', 'repeated subtraction'],
          assessments: ['Visual Model Task', 'Conceptual Understanding Check']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand division with fractions concepts',
              activities: ['Fraction model exploration', 'Equivalent fraction patterns', 'Visual representations']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand division with fractions fundamentals',
              activities: ['Algorithm development', 'Common denominator methods', 'Cross multiplication']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand division with fractions to problem solving',
              activities: ['Word problem solving', 'Mixed number applications', 'Real-world fractions']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand division with fractions understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 10,
          title: 'Divide Fractions',
          pages: '207-228',
          standards: ['6.NS.A.1'],
          objectives: ['Use standard algorithm for fraction division', 'Solve fraction division problems'],
          vocabulary: ['reciprocal', 'invert and multiply', 'common denominator'],
          assessments: ['Algorithm Practice', 'Lesson Quiz', 'Problem Set']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce divide fractions concepts',
              activities: ['Fraction model exploration', 'Equivalent fraction patterns', 'Visual representations']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of divide fractions fundamentals',
              activities: ['Algorithm development', 'Common denominator methods', 'Cross multiplication']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply divide fractions to problem solving',
              activities: ['Word problem solving', 'Mixed number applications', 'Real-world fractions']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend divide fractions understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 11,
          title: 'Solve Volume Problems with Fractions',
          pages: '229-250',
          standards: ['6.G.A.2'],
          objectives: ['Apply volume formulas with fractional dimensions', 'Solve real-world volume problems'],
          vocabulary: ['volume', 'cubic units', 'rectangular prism', 'fractional dimensions'],
          assessments: ['3D Modeling Activity', 'Lesson Quiz', 'Performance Task']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce solve volume problems with fractions concepts',
              activities: ['Fraction model exploration', 'Equivalent fraction patterns', 'Visual representations']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of solve volume problems with fractions fundamentals',
              activities: ['Algorithm development', 'Common denominator methods', 'Cross multiplication']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply solve volume problems with fractions to problem solving',
              activities: ['Word problem solving', 'Mixed number applications', 'Real-world fractions']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend solve volume problems with fractions understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        }
      ]
    },
    // Continue with other units...
    {
      unit: 'Unit 3',
      title: 'Ratio Concepts and Equivalent Ratios',
      pages: '265-340',
      duration: '15 days',
      domain: 'Ratio Reasoning',
      stemSpotlight: 'Lewis Latimer',
      standards: ['6.RP.A.1', '6.RP.A.3'],
      lessons: [
        {
          number: 12,
          title: 'Understand Ratio Concepts',
          pages: '267-278',
          standards: ['6.RP.A.1'],
          objectives: ['Understand ratio as a comparison', 'Use ratio language to describe relationships'],
          vocabulary: ['ratio', 'relationship', 'comparison', 'part-to-part', 'part-to-whole'],
          assessments: ['Ratio Identification Task', 'Lesson Quiz', 'Exit Ticket']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand ratio concepts concepts',
              activities: ['Ratio relationship exploration', 'Proportional reasoning', 'Rate discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand ratio concepts fundamentals',
              activities: ['Ratio table construction', 'Equivalent ratio methods', 'Scaling strategies']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand ratio concepts to problem solving',
              activities: ['Real-world ratio problems', 'Unit rate applications', 'Proportion solving']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand ratio concepts understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 13,
          title: 'Generate and Identify Equivalent Ratios',
          pages: '279-300',
          standards: ['6.RP.A.3'],
          objectives: ['Create equivalent ratios using multiplication and division', 'Recognize equivalent ratios'],
          vocabulary: ['equivalent ratios', 'scaling', 'proportion', 'multiplicative reasoning'],
          assessments: ['Equivalent Ratio Tables', 'Lesson Quiz', 'Pattern Recognition']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce generate and identify equivalent ratios concepts',
              activities: ['Ratio relationship exploration', 'Proportional reasoning', 'Rate discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of generate and identify equivalent ratios fundamentals',
              activities: ['Ratio table construction', 'Equivalent ratio methods', 'Scaling strategies']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply generate and identify equivalent ratios to problem solving',
              activities: ['Real-world ratio problems', 'Unit rate applications', 'Proportion solving']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend generate and identify equivalent ratios understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 14,
          title: 'Solve Problems with Ratio Reasoning',
          pages: '301-322',
          standards: ['6.RP.A.3'],
          objectives: ['Apply ratio reasoning to solve problems', 'Use ratio tables and diagrams'],
          vocabulary: ['ratio table', 'diagram', 'scaling up', 'scaling down'],
          assessments: ['Problem Solving Task', 'Lesson Quiz', 'Real-World Applications']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce solve problems with ratio reasoning concepts',
              activities: ['Ratio relationship exploration', 'Proportional reasoning', 'Rate discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of solve problems with ratio reasoning fundamentals',
              activities: ['Ratio table construction', 'Equivalent ratio methods', 'Scaling strategies']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply solve problems with ratio reasoning to problem solving',
              activities: ['Real-world ratio problems', 'Unit rate applications', 'Proportion solving']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend solve problems with ratio reasoning understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        }
      ]
    },
    {
      unit: 'Unit 4',
      title: 'Unit Rates and Percent',
      pages: '343-430',
      duration: '22 Days',
      domain: 'Ratio Reasoning',
      stemSpotlight: 'Tessa Lau - Robotics Engineer',
      standards: ['6.RP.A.2', '6.RP.A.3'],
      lessons: [
        {
          number: 15,
          title: 'Understand Rate Concepts',
          pages: '345-356',
          standards: ['6.RP.A.2'],
          objectives: ['Understand the concept of a unit rate', 'Use rate language in context'],
          vocabulary: ['rate', 'unit rate', 'constant speed', 'rate reasoning'],
          assessments: ['Concept Development', 'Lesson Quiz', 'Rate Analysis']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand rate concepts concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand rate concepts fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand rate concepts to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand rate concepts understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 16,
          title: 'Use Unit Rates to Solve Problems',
          pages: '357-384',
          standards: ['6.RP.A.3'],
          objectives: ['Solve problems using unit rates', 'Apply rate reasoning to real-world situations'],
          vocabulary: ['unit rate', 'rate table', 'constant rate', 'rate comparison'],
          assessments: ['Problem Solving Task', 'Lesson Quiz', 'Unit Rate Applications']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce use unit rates to solve problems concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of use unit rates to solve problems fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply use unit rates to solve problems to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend use unit rates to solve problems understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 17,
          title: 'Understand Percents',
          pages: '385-396',
          standards: ['6.RP.A.3'],
          objectives: ['Understand percent as rate per 100', 'Convert between percents and decimals'],
          vocabulary: ['percent', 'per hundred', 'percentage', 'decimal form'],
          assessments: ['Concept Check', 'Lesson Quiz', 'Percent Recognition']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand percents concepts',
              activities: ['Percent meaning exploration', 'Ratio to percent connections', 'Visual models']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand percents fundamentals',
              activities: ['Percent calculation methods', 'Decimal-percent conversion', 'Benchmark percents']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand percents to problem solving',
              activities: ['Real-world percent problems', 'Tax and discount applications', 'Percent change']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand percents understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 18,
          title: 'Use Percents to Solve Problems',
          pages: '397-418',
          standards: ['6.RP.A.3'],
          objectives: ['Solve problems involving percents', 'Find percent of a number'],
          vocabulary: ['percent of', 'whole', 'part', 'percent calculation'],
          assessments: ['Problem Solving Task', 'Lesson Quiz', 'Real-World Percents']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce use percents to solve problems concepts',
              activities: ['Percent meaning exploration', 'Ratio to percent connections', 'Visual models']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of use percents to solve problems fundamentals',
              activities: ['Percent calculation methods', 'Decimal-percent conversion', 'Benchmark percents']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply use percents to solve problems to problem solving',
              activities: ['Real-world percent problems', 'Tax and discount applications', 'Percent change']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend use percents to solve problems understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        }
      ]
    },
    {
      unit: 'Unit 5',
      title: 'Equivalent Expressions and Equations with Variables',
      pages: '433-538',
      duration: '26 Days',
      domain: 'Algebraic Thinking',
      stemSpotlight: 'Diana Trujillo - Aerospace Engineer',
      standards: ['6.EE.A.2', '6.EE.A.3', '6.EE.A.4', '6.EE.B.5', '6.EE.B.6', '6.EE.B.7', '6.EE.C.9'],
      lessons: [
        {
          number: 19,
          title: 'Write and Identify Equivalent Expressions',
          pages: '435-456',
          standards: ['6.EE.A.3', '6.EE.A.4'],
          objectives: ['Generate equivalent expressions', 'Identify equivalent expressions'],
          vocabulary: ['equivalent expressions', 'distributive property', 'combining like terms', 'factoring'],
          assessments: ['Expression Analysis', 'Lesson Quiz', 'Equivalence Tasks']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce write and identify equivalent expressions concepts',
              activities: ['Variable exploration', 'Expression building', 'Equation meaning']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of write and identify equivalent expressions fundamentals',
              activities: ['Equation solving methods', 'Inverse operations', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply write and identify equivalent expressions to problem solving',
              activities: ['Word problem translation', 'Multi-step equations', 'Real-world modeling']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend write and identify equivalent expressions understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 20,
          title: 'Understand Solutions to Equations',
          pages: '457-478',
          standards: ['6.EE.B.5'],
          objectives: ['Understand what it means to solve an equation', 'Check solutions to equations'],
          vocabulary: ['equation', 'solution', 'substitute', 'verify'],
          assessments: ['Solution Check', 'Lesson Quiz', 'Equation Understanding']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand solutions to equations concepts',
              activities: ['Variable exploration', 'Expression building', 'Equation meaning']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand solutions to equations fundamentals',
              activities: ['Equation solving methods', 'Inverse operations', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand solutions to equations to problem solving',
              activities: ['Word problem translation', 'Multi-step equations', 'Real-world modeling']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand solutions to equations understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 21,
          title: 'Write and Solve One-Variable Equations',
          pages: '479-506',
          standards: ['6.EE.B.6', '6.EE.B.7'],
          objectives: ['Write equations from word problems', 'Solve one-variable equations'],
          vocabulary: ['variable', 'equation solving', 'inverse operations', 'algebraic manipulation'],
          assessments: ['Problem Solving Task', 'Lesson Quiz', 'Equation Applications']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce write and solve one-variable equations concepts',
              activities: ['Variable exploration', 'Expression building', 'Equation meaning']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of write and solve one-variable equations fundamentals',
              activities: ['Equation solving methods', 'Inverse operations', 'Solution verification']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply write and solve one-variable equations to problem solving',
              activities: ['Word problem translation', 'Multi-step equations', 'Real-world modeling']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend write and solve one-variable equations understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 22,
          title: 'Understand Relationships Between Variables',
          pages: '507-528',
          standards: ['6.EE.C.9'],
          objectives: ['Identify dependent and independent variables', 'Analyze variable relationships'],
          vocabulary: ['dependent variable', 'independent variable', 'relationship', 'function table'],
          assessments: ['Variable Analysis', 'Lesson Quiz', 'Relationship Tasks']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand relationships between variables concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand relationships between variables fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand relationships between variables to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand relationships between variables understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        }
      ]
    },
    {
      unit: 'Unit 6',
      title: 'Absolute Value, Inequalities, and the Coordinate Plane',
      pages: '539-654',
      duration: '29 Days',
      domain: 'Positive and Negative Numbers',
      stemSpotlight: 'John McCarthy - Computer Scientist',
      standards: ['6.NS.C.5', '6.NS.C.6', '6.NS.C.7', '6.NS.C.8', '6.EE.B.8'],
      lessons: [
        {
          number: 23,
          title: 'Understand Positive and Negative Numbers',
          pages: '541-552',
          standards: ['6.NS.C.5'],
          objectives: ['Understand positive and negative numbers', 'Use integers to represent real-world situations'],
          vocabulary: ['positive numbers', 'negative numbers', 'integers', 'opposite directions'],
          assessments: ['Number Understanding', 'Lesson Quiz', 'Integer Applications']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand positive and negative numbers concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand positive and negative numbers fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand positive and negative numbers to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand positive and negative numbers understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 24,
          title: 'Order Positive and Negative Numbers',
          pages: '553-568',
          standards: ['6.NS.C.7'],
          objectives: ['Compare and order integers', 'Use number lines with negative numbers'],
          vocabulary: ['ordering', 'comparing integers', 'number line', 'greater than', 'less than'],
          assessments: ['Ordering Task', 'Lesson Quiz', 'Number Line Work']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce order positive and negative numbers concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of order positive and negative numbers fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply order positive and negative numbers to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend order positive and negative numbers understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 25,
          title: 'Understand Absolute Value',
          pages: '569-580',
          standards: ['6.NS.C.7'],
          objectives: ['Understand absolute value concept', 'Find absolute value of numbers'],
          vocabulary: ['absolute value', 'distance from zero', 'magnitude', 'absolute value notation'],
          assessments: ['Concept Check', 'Lesson Quiz', 'Absolute Value Tasks']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand absolute value concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand absolute value fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand absolute value to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand absolute value understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 26,
          title: 'Write and Graph One-Variable Inequalities',
          pages: '581-608',
          standards: ['6.EE.B.8'],
          objectives: ['Write inequalities from word problems', 'Graph inequalities on number lines'],
          vocabulary: ['inequality', 'greater than', 'less than', 'inequality symbols', 'number line graphs'],
          assessments: ['Inequality Writing', 'Lesson Quiz', 'Graphing Tasks']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce write and graph one-variable inequalities concepts',
              activities: ['Coordinate plane exploration', 'Point plotting', 'Quadrant identification']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of write and graph one-variable inequalities fundamentals',
              activities: ['Graphing techniques', 'Scale and axis understanding', 'Coordinate relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply write and graph one-variable inequalities to problem solving',
              activities: ['Real-world graphing', 'Distance problems', 'Coordinate applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend write and graph one-variable inequalities understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 27,
          title: 'Understand the Four-Quadrant Coordinate Plane',
          pages: '609-620',
          standards: ['6.NS.C.6'],
          objectives: ['Understand the coordinate plane with four quadrants', 'Plot points with negative coordinates'],
          vocabulary: ['coordinate plane', 'quadrants', 'x-axis', 'y-axis', 'ordered pairs'],
          assessments: ['Coordinate Understanding', 'Lesson Quiz', 'Point Plotting']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand the four-quadrant coordinate plane concepts',
              activities: ['Coordinate plane exploration', 'Point plotting', 'Quadrant identification']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand the four-quadrant coordinate plane fundamentals',
              activities: ['Graphing techniques', 'Scale and axis understanding', 'Coordinate relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand the four-quadrant coordinate plane to problem solving',
              activities: ['Real-world graphing', 'Distance problems', 'Coordinate applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand the four-quadrant coordinate plane understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 28,
          title: 'Solve Problems in the Coordinate Plane',
          pages: '621-642',
          standards: ['6.NS.C.8'],
          objectives: ['Find distances in the coordinate plane', 'Solve real-world problems using coordinates'],
          vocabulary: ['distance formula', 'coordinate geometry', 'reflection', 'polygon vertices'],
          assessments: ['Problem Solving Task', 'Lesson Quiz', 'Coordinate Applications']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce solve problems in the coordinate plane concepts',
              activities: ['Coordinate plane exploration', 'Point plotting', 'Quadrant identification']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of solve problems in the coordinate plane fundamentals',
              activities: ['Graphing techniques', 'Scale and axis understanding', 'Coordinate relationships']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply solve problems in the coordinate plane to problem solving',
              activities: ['Real-world graphing', 'Distance problems', 'Coordinate applications']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend solve problems in the coordinate plane understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        }
      ]
    },
    {
      unit: 'Unit 7',
      title: 'Statistical Thinking',
      pages: '655-894',
      duration: '25 Days',
      domain: 'Data Distributions and Measures of Center and Variability',
      stemSpotlight: 'Katherine Johnson - Mathematician',
      standards: ['6.SP.A.1', '6.SP.A.2', '6.SP.B.4', '6.SP.B.5.c', '6.SP.B.5.d'],
      lessons: [
        {
          number: 29,
          title: 'Understand Statistical Questions and Data Distributions',
          pages: '659-670',
          standards: ['6.SP.A.1'],
          objectives: ['Distinguish statistical from non-statistical questions', 'Understand data distributions'],
          vocabulary: ['statistical question', 'data distribution', 'variability', 'data set'],
          assessments: ['Concept Check', 'Lesson Quiz', 'Statistical Reasoning']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce understand statistical questions and data distributions concepts',
              activities: ['Data collection exploration', 'Statistical question investigation', 'Distribution observation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of understand statistical questions and data distributions fundamentals',
              activities: ['Data display construction', 'Measure calculation', 'Graph interpretation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply understand statistical questions and data distributions to problem solving',
              activities: ['Real-world data analysis', 'Comparison tasks', 'Statistical reasoning']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend understand statistical questions and data distributions understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 30,
          title: 'Use Dot Plots and Histograms to Describe Data Distributions',
          pages: '671-692',
          standards: ['6.SP.A.2', '6.SP.B.4'],
          objectives: ['Create and interpret dot plots', 'Create and interpret histograms', 'Describe distribution shape'],
          vocabulary: ['dot plot', 'histogram', 'frequency', 'distribution shape', 'bins'],
          assessments: ['Graphing Task', 'Lesson Quiz', 'Data Display Analysis']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce use dot plots and histograms to describe data distributions concepts',
              activities: ['Data collection exploration', 'Statistical question investigation', 'Distribution observation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of use dot plots and histograms to describe data distributions fundamentals',
              activities: ['Data display construction', 'Measure calculation', 'Graph interpretation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply use dot plots and histograms to describe data distributions to problem solving',
              activities: ['Real-world data analysis', 'Comparison tasks', 'Statistical reasoning']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend use dot plots and histograms to describe data distributions understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 31,
          title: 'Interpret Median and Interquartile Range in Box Plots',
          pages: '693-714',
          standards: ['6.SP.B.4', '6.SP.B.5.c'],
          objectives: ['Calculate median and quartiles', 'Create and interpret box plots', 'Understand interquartile range'],
          vocabulary: ['median', 'quartiles', 'box plot', 'interquartile range', 'outliers'],
          assessments: ['Box Plot Construction', 'Lesson Quiz', 'Data Analysis Tasks']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce interpret median and interquartile range in box plots concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of interpret median and interquartile range in box plots fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply interpret median and interquartile range in box plots to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend interpret median and interquartile range in box plots understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 32,
          title: 'Interpret Mean and Mean Absolute Deviation',
          pages: '715-736',
          standards: ['6.SP.B.5.c', '6.SP.B.5.d'],
          objectives: ['Calculate and interpret mean', 'Understand mean absolute deviation', 'Compare measures of center'],
          vocabulary: ['mean', 'mean absolute deviation', 'deviation', 'measures of center'],
          assessments: ['Calculation Tasks', 'Lesson Quiz', 'Statistical Reasoning']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce interpret mean and mean absolute deviation concepts',
              activities: ['Concept exploration', 'Pattern investigation', 'Initial discovery']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of interpret mean and mean absolute deviation fundamentals',
              activities: ['Core concept development', 'Guided practice', 'Method instruction']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply interpret mean and mean absolute deviation to problem solving',
              activities: ['Problem solving', 'Real-world applications', 'Multiple representations']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend interpret mean and mean absolute deviation understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        },
        {
          number: 33,
          title: 'Use Measures of Center and Variability to Summarize Data',
          pages: '737-752',
          standards: ['6.SP.B.5.c', '6.SP.B.5.d'],
          objectives: ['Choose appropriate measures of center', 'Summarize data sets effectively', 'Analyze variability'],
          vocabulary: ['measures of center', 'measures of variability', 'data summary', 'statistical analysis'],
          assessments: ['Data Summary Project', 'Lesson Quiz', 'Real-World Statistics']
        ,
          sessions: [
            {
              day: 1,
              type: 'Explore',
              focus: 'Connect prior knowledge and introduce use measures of center and variability to summarize data concepts',
              activities: ['Data collection exploration', 'Statistical question investigation', 'Distribution observation']
            },
            {
              day: 2,
              type: 'Develop',
              focus: 'Build understanding of use measures of center and variability to summarize data fundamentals',
              activities: ['Data display construction', 'Measure calculation', 'Graph interpretation']
            },
            {
              day: 3,
              type: 'Develop',
              focus: 'Apply use measures of center and variability to summarize data to problem solving',
              activities: ['Real-world data analysis', 'Comparison tasks', 'Statistical reasoning']
            },
            {
              day: 4,
              type: 'Develop',
              focus: 'Extend use measures of center and variability to summarize data understanding and reasoning',
              activities: ['Complex problems', 'Error analysis', 'Mathematical reasoning']
            },
            {
              day: 5,
              type: 'Refine',
              focus: 'Strengthen skills and make connections',
              activities: ['Practice and fluency', 'Reflection', 'Assessment preparation']
            },
          ]
        }
      ]
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Grade 6 Mathematics</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/curriculum/grade-7" className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Grade 7</Link>
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
            <h1 className="text-3xl font-bold text-blue-800 mb-2">
              Ready Classroom Mathematics Grade 6
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Complete Scope and Sequence • Foundation Building Year
            </p>
            <p className="text-sm text-gray-500 italic">
              Each lesson follows a 5-day structure: Explore → Develop → Develop → Develop → Refine
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">894</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7</div>
              <div className="text-sm text-gray-600">Units</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">173</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mathematical Focus Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-3">📐</span>
              <span className="font-medium">Ratios and Rates</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-2xl mr-3">🔢</span>
              <span className="font-medium">Fractions and Decimals</span>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl mr-3">➕</span>
              <span className="font-medium">Rational Numbers</span>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl mr-3">📝</span>
              <span className="font-medium">Expressions and Equations</span>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <span className="text-2xl mr-3">📏</span>
              <span className="font-medium">Area and Volume</span>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <span className="font-medium">Statistics and Data</span>
            </div>
            <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
              <span className="text-2xl mr-3">🧮</span>
              <span className="font-medium">Coordinate Plane</span>
            </div>
            <div className="flex items-center p-3 bg-pink-50 rounded-lg">
              <span className="text-2xl mr-3">📈</span>
              <span className="font-medium">Data Analysis</span>
            </div>
          </div>
        </div>

        {/* Standards Alignment */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Common Core Standards Alignment</h2>
          <div className="flex flex-wrap gap-2">
            {['6.RP', '6.NS', '6.EE', '6.G', '6.SP'].map(standard => (
              <span key={standard} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {standard}
              </span>
            ))}
          </div>
        </div>

        {/* Unit Breakdown with Detailed Lessons */}
        <div className="space-y-6">
          {units.map((unit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{unit.unit}: {unit.title}</h3>
                    <p className="text-blue-100 mt-2">
                      <strong>Domain:</strong> {unit.domain} • <strong>Pages:</strong> {unit.pages} • <strong>Duration:</strong> {unit.duration}
                    </p>
                    <p className="text-blue-100 mt-1">
                      <strong>STEM Spotlight:</strong> {unit.stemSpotlight}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unit.standards.map((standard, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-500 text-blue-100 text-xs rounded">
                      {standard}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Lessons ({unit.lessons.length})</h4>
                <div className="space-y-3">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Lesson Header - Clickable */}
                      <button
                        onClick={() => toggleLesson(lesson.number)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div className="flex items-center">
                          <span className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                            {lesson.number}
                          </span>
                          <div>
                            <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                            <p className="text-sm text-gray-600">Pages {lesson.pages} • 5-Day Structure</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex flex-wrap gap-1">
                            {lesson.standards.map((standard, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                                {standard}
                              </span>
                            ))}
                          </div>
                          <span className={`transform transition-transform ${expandedLessons.has(lesson.number) ? 'rotate-180' : ''}`}>
                            ⌄
                          </span>
                        </div>
                      </button>

                      {/* Expanded Lesson Details */}
                      {expandedLessons.has(lesson.number) && (
                        <div className="p-4 bg-white border-t">
                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Learning Objectives */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">🎯 Learning Objectives</h6>
                              <ul className="space-y-1">
                                {lesson.objectives.map((objective, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                                    <span className="text-green-500 mr-2">•</span>
                                    {objective}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Key Vocabulary */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">📚 Key Vocabulary</h6>
                              <div className="flex flex-wrap gap-1">
                                {lesson.vocabulary.map((term, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Assessment Types */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">📝 Assessments</h6>
                              <div className="space-y-1">
                                {lesson.assessments.map((assessment, idx) => (
                                  <div key={idx} className="flex items-center text-sm text-gray-700">
                                    <span className="text-purple-500 mr-2">✓</span>
                                    {assessment}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Standards Detail */}
                            <div>
                              <h6 className="font-semibold text-gray-800 mb-2">📋 Standards Covered</h6>
                              <div className="space-y-1">
                                {lesson.standards.map((standard, idx) => (
                                  <div key={idx} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                                    <strong>{standard}</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Session Structure - 5 Day Pattern */}
                          {lesson.sessions && (
                            <div className="border-t pt-4">
                              <h6 className="font-semibold text-gray-800 mb-3">📅 5-Day Lesson Structure</h6>
                              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                                {lesson.sessions.map((session, idx) => (
                                  <div key={idx} className={`p-3 rounded-lg border ${
                                    session.type === 'Explore' ? 'bg-cyan-50 border-cyan-200' :
                                    session.type === 'Develop' ? 'bg-blue-50 border-blue-200' :
                                    'bg-green-50 border-green-200'
                                  }`}>
                                    <div className="text-center mb-2">
                                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                                        session.type === 'Explore' ? 'bg-cyan-100 text-cyan-700' :
                                        session.type === 'Develop' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                      }`}>
                                        Day {session.day}
                                      </div>
                                      <div className={`text-sm font-bold mt-1 ${
                                        session.type === 'Explore' ? 'text-cyan-600' :
                                        session.type === 'Develop' ? 'text-blue-600' :
                                        'text-green-600'
                                      }`}>
                                        {session.type}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mb-2 text-center">
                                      {session.focus}
                                    </div>
                                    <div className="space-y-1">
                                      {session.activities.map((activity, actIdx) => (
                                        <div key={actIdx} className="text-xs text-gray-700 flex items-start">
                                          <span className="text-gray-400 mr-1">•</span>
                                          {activity}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pacing Options */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pacing Guide Options</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">Traditional Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">180-day school year</p>
              <div className="text-2xl font-bold text-gray-800">173 days</div>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">Accelerated Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">160-day intensive</p>
              <div className="text-2xl font-bold text-gray-800">153 days</div>
            </div>
            <div className="p-4 border border-purple-200 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">Block Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">90-minute periods</p>
              <div className="text-2xl font-bold text-gray-800">87 days</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          {isTeacherMode && (
            <Link
              href="/pacing-generator"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate Custom Pacing Guide
            </Link>
          )}
          <Link
            href="/curriculum/grade-7"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Continue to Grade 7 →
          </Link>
        </div>
      </div>
    </div>
  );
}
