'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Grade6Curriculum() {
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
          assessments: ['Lesson Quiz', 'Practice Problems', 'Exit Ticket']
        },
        {
          number: 2,
          title: 'Find the Area of Triangles and Other Polygons',
          pages: '19-40',
          standards: ['6.G.A.1'],
          objectives: ['Calculate areas of triangles and composite figures', 'Decompose complex shapes'],
          vocabulary: ['triangle', 'polygon', 'composite figure', 'decomposition'],
          assessments: ['Lesson Quiz', 'Problem Set', 'Performance Task']
        },
        {
          number: 3,
          title: 'Use Nets to Find Surface Area',
          pages: '41-62',
          standards: ['6.G.A.4'],
          objectives: ['Represent 3D figures using nets', 'Calculate surface area from nets'],
          vocabulary: ['net', 'surface area', 'prism', 'pyramid'],
          assessments: ['Construction Activity', 'Lesson Quiz', 'Exit Ticket']
        },
        {
          number: 4,
          title: 'Work with Algebraic Expressions',
          pages: '63-84',
          standards: ['6.EE.A.2'],
          objectives: ['Write and interpret algebraic expressions', 'Identify parts of expressions'],
          vocabulary: ['variable', 'expression', 'term', 'coefficient'],
          assessments: ['Expression Writing Task', 'Lesson Quiz', 'Peer Review']
        },
        {
          number: 5,
          title: 'Write and Evaluate Expressions with Exponents',
          pages: '85-106',
          standards: ['6.EE.A.1'],
          objectives: ['Understand exponential notation', 'Evaluate expressions with exponents'],
          vocabulary: ['exponent', 'base', 'power', 'exponential form'],
          assessments: ['Computation Practice', 'Lesson Quiz', 'Exit Ticket']
        },
        {
          number: 6,
          title: 'Find Greatest Common Factor and Least Common Multiple',
          pages: '107-128',
          standards: ['6.NS.B.4'],
          objectives: ['Find GCF and LCM of whole numbers', 'Apply GCF to factor expressions'],
          vocabulary: ['factor', 'multiple', 'GCF', 'LCM', 'prime factorization'],
          assessments: ['Factor Tree Activity', 'Lesson Quiz', 'Problem Solving']
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
          assessments: ['Computation Fluency Check', 'Lesson Quiz', 'Word Problems']
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
        },
        {
          number: 10,
          title: 'Divide Fractions',
          pages: '207-228',
          standards: ['6.NS.A.1'],
          objectives: ['Use standard algorithm for fraction division', 'Solve fraction division problems'],
          vocabulary: ['reciprocal', 'invert and multiply', 'common denominator'],
          assessments: ['Algorithm Practice', 'Lesson Quiz', 'Problem Set']
        },
        {
          number: 11,
          title: 'Solve Volume Problems with Fractions',
          pages: '229-250',
          standards: ['6.G.A.2'],
          objectives: ['Apply volume formulas with fractional dimensions', 'Solve real-world volume problems'],
          vocabulary: ['volume', 'cubic units', 'rectangular prism', 'fractional dimensions'],
          assessments: ['3D Modeling Activity', 'Lesson Quiz', 'Performance Task']
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
        },
        {
          number: 13,
          title: 'Generate and Identify Equivalent Ratios',
          pages: '279-300',
          standards: ['6.RP.A.3'],
          objectives: ['Create equivalent ratios using multiplication and division', 'Recognize equivalent ratios'],
          vocabulary: ['equivalent ratios', 'scaling', 'proportion', 'multiplicative reasoning'],
          assessments: ['Equivalent Ratio Tables', 'Lesson Quiz', 'Pattern Recognition']
        },
        {
          number: 14,
          title: 'Solve Problems with Ratio Reasoning',
          pages: '301-322',
          standards: ['6.RP.A.3'],
          objectives: ['Apply ratio reasoning to solve problems', 'Use ratio tables and diagrams'],
          vocabulary: ['ratio table', 'diagram', 'scaling up', 'scaling down'],
          assessments: ['Problem Solving Task', 'Lesson Quiz', 'Real-World Applications']
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
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • Foundation Building Year
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
              <div className="text-2xl font-bold text-purple-600">6</div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <span className="font-medium">Statistics</span>
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
                            <p className="text-sm text-gray-600">Pages {lesson.pages}</p>
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
                          <div className="grid md:grid-cols-2 gap-6">
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
          <Link
            href="/pacing-generator"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate Custom Pacing Guide
          </Link>
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
