'use client';

import Link from 'next/link';

export default function Grade6Curriculum() {
  const units = [
    {
      unit: 'Unit 1',
      title: 'Area and Volume',
      lessons: ['Lesson 1: Understand Area and Perimeter', 'Lesson 2: Nets and Surface Area', 'Lesson 3: Volume', 'Lesson 4: Solve Volume Problems', 'Lesson 5: Area in the Coordinate Plane'],
      pages: '15-112',
      duration: '24 days'
    },
    {
      unit: 'Unit 2', 
      title: 'Decimals',
      lessons: ['Lesson 6: Understand Decimal Notation', 'Lesson 7: Compare and Order Decimals', 'Lesson 8: Round Decimals', 'Lesson 9: Add and Subtract Decimals', 'Lesson 10: Multiply Decimals', 'Lesson 11: Divide Decimals'],
      pages: '113-244',
      duration: '30 days'
    },
    {
      unit: 'Unit 3',
      title: 'Fractions and Mixed Numbers',
      lessons: ['Lesson 12: Add and Subtract Fractions', 'Lesson 13: Add and Subtract Mixed Numbers', 'Lesson 14: Multiplication as Scaling', 'Lesson 15: Multiply Fractions', 'Lesson 16: Understand Division with Fractions', 'Lesson 17: Divide Fractions', 'Lesson 18: Divide Mixed Numbers'],
      pages: '245-404',
      duration: '35 days'
    },
    {
      unit: 'Unit 4',
      title: 'Ratios',
      lessons: ['Lesson 19: Understand Ratios', 'Lesson 20: Equivalent Ratios', 'Lesson 21: Solve Problems with Ratios', 'Lesson 22: Understand Unit Rate', 'Lesson 23: Solve Unit Rate Problems', 'Lesson 24: Ratio Reasoning: Convert Measurements'],
      pages: '1-132',
      duration: '30 days'
    },
    {
      unit: 'Unit 5',
      title: 'Rates',
      lessons: ['Lesson 25: Understand Percent', 'Lesson 26: Relate Fractions, Decimals, and Percents', 'Lesson 27: Find the Percent of a Number', 'Lesson 28: Find the Whole from a Percent'],
      pages: '133-232',
      duration: '24 days'
    },
    {
      unit: 'Unit 6',
      title: 'Expressions and Equations',
      lessons: ['Lesson 29: Algebraic Expressions', 'Lesson 30: Equivalent Expressions', 'Lesson 31: Reason About and Solve Equations', 'Lesson 32: Solve Inequalities', 'Lesson 33: Dependent and Independent Variables'],
      pages: '233-334',
      duration: '30 days'
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

        {/* Unit Breakdown */}
        <div className="space-y-6">
          {units.map((unit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{unit.unit}: {unit.title}</h3>
                  <div className="text-sm bg-blue-500 px-3 py-1 rounded">
                    {unit.duration}
                  </div>
                </div>
                <p className="text-blue-100 mt-1">Pages {unit.pages}</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Lessons ({unit.lessons.length})</h4>
                <div className="grid gap-2">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                        {lesson.match(/Lesson (\d+)/)?.[1] || lessonIndex + 1}
                      </span>
                      <span className="text-gray-700">{lesson}</span>
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
