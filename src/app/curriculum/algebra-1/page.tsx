'use client';

import Link from 'next/link';

export default function Algebra1Curriculum() {
  const units = [
    {
      unit: 'Unit 1',
      title: 'Expressions, Equations, and Inequalities',
      lessons: ['Lesson 1: Analyze and Use Properties of Real Numbers', 'Lesson 2: Write and Evaluate Algebraic Expressions', 'Lesson 3: Solve Linear Equations', 'Lesson 4: Solve Linear Inequalities'],
      pages: '15-140',
      duration: '24 days'
    },
    {
      unit: 'Unit 2',
      title: 'Functions and Linear Relationships',
      lessons: ['Lesson 5: Understand Relations and Functions', 'Lesson 6: Understand Linear Functions', 'Lesson 7: Write Linear Functions', 'Lesson 8: Graph Linear Functions', 'Lesson 9: Solve Problems Using Linear Functions'],
      pages: '141-280',
      duration: '30 days'
    },
    {
      unit: 'Unit 3',
      title: 'Systems of Linear Equations',
      lessons: ['Lesson 10: Understand Systems of Linear Equations', 'Lesson 11: Solve Systems by Graphing', 'Lesson 12: Solve Systems by Substitution', 'Lesson 13: Solve Systems by Linear Combination'],
      pages: '281-380',
      duration: '24 days'
    },
    {
      unit: 'Unit 4',
      title: 'Sequences and Exponential Functions',
      lessons: ['Lesson 14: Understand Sequences', 'Lesson 15: Understand Exponential Functions', 'Lesson 16: Compare Linear and Exponential Functions', 'Lesson 17: Solve Exponential Equations', 'Lesson 18: Use Exponential Functions to Model Situations'],
      pages: '1-150',
      duration: '30 days'
    },
    {
      unit: 'Unit 5',
      title: 'Polynomials and Quadratic Functions',
      lessons: ['Lesson 19: Add and Subtract Polynomials', 'Lesson 20: Multiply Polynomials', 'Lesson 21: Understand Quadratic Functions', 'Lesson 22: Solve Problems Using Quadratic Functions'],
      pages: '151-270',
      duration: '24 days'
    },
    {
      unit: 'Unit 6',
      title: 'Quadratic Equations and Functions',
      lessons: ['Lesson 23: Solve Quadratic Equations by Graphing', 'Lesson 24: Solve Quadratic Equations by Factoring', 'Lesson 25: Solve Quadratic Equations Using the Quadratic Formula'],
      pages: '271-380',
      duration: '18 days'
    },
    {
      unit: 'Unit 7',
      title: 'Statistics and Data Analysis',
      lessons: ['Lesson 26: Analyze Data Distributions', 'Lesson 27: Interpret Linear Models', 'Lesson 28: Make Inferences and Justify Conclusions'],
      pages: '381-478',
      duration: '18 days'
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
              <div className="text-2xl font-bold text-red-600">1,354</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">7</div>
              <div className="text-sm text-gray-600">Units</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">168</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mathematical Focus Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <span className="text-2xl mr-3">📝</span>
              <span className="font-medium">Expressions & Equations</span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <span className="font-medium">Functions & Linear Relationships</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-2xl mr-3">⚖️</span>
              <span className="font-medium">Systems of Linear Equations</span>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl mr-3">📈</span>
              <span className="font-medium">Exponential Functions</span>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl mr-3">🔲</span>
              <span className="font-medium">Polynomials & Quadratics</span>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl mr-3">📋</span>
              <span className="font-medium">Statistics & Data Analysis</span>
            </div>
          </div>
        </div>

        {/* Standards Alignment */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Common Core Standards Alignment</h2>
          <div className="flex flex-wrap gap-2">
            {['A-SSE', 'A-APR', 'A-CED', 'A-REI', 'F-IF', 'F-BF', 'F-LE', 'S-ID'].map(standard => (
              <span key={standard} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                {standard}
              </span>
            ))}
          </div>
        </div>

        {/* College Readiness Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">🎓 College and Career Readiness Focus</h2>
            <p className="text-red-100">
              Algebra 1 provides the foundation for advanced high school mathematics including Geometry, 
              Algebra 2, Pre-Calculus, and college-level coursework.
            </p>
          </div>
        </div>

        {/* Unit Breakdown */}
        <div className="space-y-6">
          {units.map((unit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-red-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{unit.unit}: {unit.title}</h3>
                  <div className="text-sm bg-red-500 px-3 py-1 rounded">
                    {unit.duration}
                  </div>
                </div>
                <p className="text-red-100 mt-1">Pages {unit.pages}</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Lessons ({unit.lessons.length})</h4>
                <div className="grid gap-2">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
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
            <div className="p-4 border border-red-200 rounded-lg">
              <h3 className="font-bold text-red-600 mb-2">Traditional Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">180-day school year</p>
              <div className="text-2xl font-bold text-gray-800">168 days</div>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">Accelerated Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">160-day intensive</p>
              <div className="text-2xl font-bold text-gray-800">148 days</div>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">Block Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">90-minute periods</p>
              <div className="text-2xl font-bold text-gray-800">84 days</div>
            </div>
          </div>
        </div>

        {/* Next Steps Banner */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Advanced Mathematics Pathway</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">📐</div>
              <h3 className="font-bold text-blue-600 mb-1">Geometry</h3>
              <p className="text-sm text-gray-600">Coordinate geometry, proofs, transformations</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold text-green-600 mb-1">Algebra 2</h3>
              <p className="text-sm text-gray-600">Advanced functions, complex numbers</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-bold text-purple-600 mb-1">Pre-Calculus</h3>
              <p className="text-sm text-gray-600">Trigonometry, advanced modeling</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/pacing-generator"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Generate Custom Pacing Guide
          </Link>
          <Link
            href="/curriculum/complete-analysis"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Complete Analysis
          </Link>
        </div>
      </div>
    </div>
  );
}
