'use client';

import Link from 'next/link';

export default function Grade8Curriculum() {
  const units = [
    {
      unit: 'Unit 1',
      title: 'Rigid Transformations and Congruence',
      lessons: ['Lesson 1: Translations', 'Lesson 2: Reflections', 'Lesson 3: Rotations', 'Lesson 4: Describe Transformation Sequences'],
      pages: '15-112',
      duration: '20 days'
    },
    {
      unit: 'Unit 2',
      title: 'Dilations, Similarity, and Introducing Slope',
      lessons: ['Lesson 5: Understand Dilations', 'Lesson 6: Describe Dilations', 'Lesson 7: Understand Similar Figures', 'Lesson 8: Angles, Lines, and Transversals'],
      pages: '113-200',
      duration: '20 days'
    },
    {
      unit: 'Unit 3',
      title: 'Linear Relationships',
      lessons: ['Lesson 9: Proportional Relationships and Slope', 'Lesson 10: Understand Slope', 'Lesson 11: Slope-Intercept Form', 'Lesson 12: Analyze Linear Functions', 'Lesson 13: Construct Linear Functions for Real-World Problems'],
      pages: '201-330',
      duration: '25 days'
    },
    {
      unit: 'Unit 4', 
      title: 'Linear Equations and Linear Systems',
      lessons: ['Lesson 14: Understand Systems of Linear Equations', 'Lesson 15: Solve Systems by Graphing', 'Lesson 16: Solve Systems by Substitution', 'Lesson 17: Solve Systems by Elimination', 'Lesson 18: Solve Problems with Systems of Linear Equations'],
      pages: '331-450',
      duration: '25 days'
    },
    {
      unit: 'Unit 5',
      title: 'Functions',
      lessons: ['Lesson 19: Understand Functions', 'Lesson 20: Compare Functions', 'Lesson 21: Use Functions to Model Linear Relationships'],
      pages: '451-530',
      duration: '15 days'
    },
    {
      unit: 'Unit 6',
      title: 'Scientific Notation and Irrational Numbers', 
      lessons: ['Lesson 22: Understand Integer Exponents', 'Lesson 23: Understand Scientific Notation', 'Lesson 24: Compute with Scientific Notation', 'Lesson 25: Understand Square Roots and Cube Roots', 'Lesson 26: Understand the Pythagorean Theorem', 'Lesson 27: Apply the Pythagorean Theorem'],
      pages: '1-150',
      duration: '30 days'
    },
    {
      unit: 'Unit 7',
      title: 'Pythagorean Theorem and Volume',
      lessons: ['Lesson 28: Find Volume of Cylinders, Cones, and Spheres'],
      pages: '151-185',
      duration: '10 days'
    },
    {
      unit: 'Unit 8',
      title: 'Statistics',
      lessons: ['Lesson 29: Scatter Plots', 'Lesson 30: Analyze Linear Associations', 'Lesson 31: Use Linear Models to Make Predictions'],
      pages: '186-270',
      duration: '15 days'
    },
    {
      unit: 'Unit 9',
      title: 'Statistics and Data Analysis',
      lessons: ['Lesson 32: Analyze Two-Way Tables'],
      pages: '271-300',
      duration: '10 days'
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
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
              Complete Scope and Sequence • High School Readiness
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">1,008</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">9</div>
              <div className="text-sm text-gray-600">Units</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">170</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mathematical Focus Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl mr-3">🔄</span>
              <span className="font-medium">Geometric Transformations</span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-3">📈</span>
              <span className="font-medium">Linear Relationships</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <span className="font-medium">Functions</span>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl mr-3">🔢</span>
              <span className="font-medium">Exponents & Scientific Notation</span>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <span className="text-2xl mr-3">√</span>
              <span className="font-medium">Real Number System</span>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl mr-3">📋</span>
              <span className="font-medium">Data Analysis</span>
            </div>
          </div>
        </div>

        {/* Standards Alignment */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Common Core Standards Alignment</h2>
          <div className="flex flex-wrap gap-2">
            {['8.G', '8.EE', '8.F', '8.NS', '8.SP'].map(standard => (
              <span key={standard} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                {standard}
              </span>
            ))}
          </div>
        </div>

        {/* Unit Breakdown */}
        <div className="space-y-6">
          {units.map((unit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-purple-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{unit.unit}: {unit.title}</h3>
                  <div className="text-sm bg-purple-500 px-3 py-1 rounded">
                    {unit.duration}
                  </div>
                </div>
                <p className="text-purple-100 mt-1">Pages {unit.pages}</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Lessons ({unit.lessons.length})</h4>
                <div className="grid gap-2">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
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
            <div className="p-4 border border-purple-200 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">Traditional Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">180-day school year</p>
              <div className="text-2xl font-bold text-gray-800">170 days</div>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">Accelerated Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">160-day intensive</p>
              <div className="text-2xl font-bold text-gray-800">150 days</div>
            </div>
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">Block Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">90-minute periods</p>
              <div className="text-2xl font-bold text-gray-800">85 days</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/pacing-generator"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate Custom Pacing Guide
          </Link>
          <Link
            href="/curriculum/algebra-1"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Continue to Algebra 1 →
          </Link>
        </div>
      </div>
    </div>
  );
}
