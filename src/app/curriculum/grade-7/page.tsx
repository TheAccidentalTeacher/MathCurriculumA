'use client';

import Link from 'next/link';

export default function Grade7Curriculum() {
  const units = [
    {
      unit: 'Unit 1',
      title: 'Ratios and Proportional Relationships',
      lessons: ['Lesson 1: Solve Ratio and Rate Problems', 'Lesson 2: Solve Percent Problems', 'Lesson 3: Solve Multistep Percent Problems', 'Lesson 4: Analyze Proportional Relationships', 'Lesson 5: Solve Proportional Reasoning Problems'],
      pages: '15-140',
      duration: '25 days'
    },
    {
      unit: 'Unit 2',
      title: 'Operations with Rational Numbers',
      lessons: ['Lesson 6: Understand Addition and Subtraction on the Number Line', 'Lesson 7: Add and Subtract Rational Numbers', 'Lesson 8: Understand Multiplication and Division of Rational Numbers', 'Lesson 9: Multiply and Divide Rational Numbers', 'Lesson 10: Solve Problems with Rational Numbers'],
      pages: '141-250',
      duration: '25 days'
    },
    {
      unit: 'Unit 3', 
      title: 'Expressions and Equations',
      lessons: ['Lesson 11: Generate Equivalent Expressions', 'Lesson 12: Add and Subtract Linear Expressions', 'Lesson 13: Factor Linear Expressions', 'Lesson 14: Solve Equations Using Properties of Operations', 'Lesson 15: Solve Equations with Variables on Both Sides', 'Lesson 16: Solve Multistep Problems with Equations and Inequalities'],
      pages: '251-400',
      duration: '30 days'
    },
    {
      unit: 'Unit 4',
      title: 'Geometry and Measurement',
      lessons: ['Lesson 17: Scale Drawings', 'Lesson 18: Understand and Apply the Pythagorean Theorem', 'Lesson 19: Apply the Pythagorean Theorem in Real-World Problems', 'Lesson 20: Find Area and Circumference of a Circle', 'Lesson 21: Find Areas of Circles', 'Lesson 22: Solve Problems Involving Circles'],
      pages: '1-150',
      duration: '30 days'
    },
    {
      unit: 'Unit 5',
      title: 'Angle Relationships',
      lessons: ['Lesson 23: Angle Relationships', 'Lesson 24: Draw Geometric Shapes', 'Lesson 25: Find Unknown Angle Measures'],
      pages: '151-225',
      duration: '15 days'
    },
    {
      unit: 'Unit 6',
      title: 'Surface Area and Volume', 
      lessons: ['Lesson 26: Find Volume and Surface Area of Right Prisms', 'Lesson 27: Find Volume and Surface Area of Pyramids', 'Lesson 28: Find Volume and Surface Area of Cylinders', 'Lesson 29: Find Volume and Surface Area of Cones', 'Lesson 30: Find Volume and Surface Area of Spheres'],
      pages: '226-330',
      duration: '25 days'
    },
    {
      unit: 'Unit 7',
      title: 'Statistics and Probability',
      lessons: ['Lesson 31: Understand Statistical Questions and Data Distributions', 'Lesson 32: Analyze Data Distributions', 'Lesson 33: Find Probability of Simple and Compound Events'],
      pages: '331-424',
      duration: '20 days'
    }
  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
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
              Complete Scope and Sequence • Proportional Reasoning Mastery
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
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">7</div>
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
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-2xl mr-3">📐</span>
              <span className="font-medium">Proportional Relationships</span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-3">🔢</span>
              <span className="font-medium">Rational Number Operations</span>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl mr-3">📝</span>
              <span className="font-medium">Expressions and Equations</span>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl mr-3">📏</span>
              <span className="font-medium">Geometry</span>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <span className="font-medium">Statistics and Probability</span>
            </div>
          </div>
        </div>

        {/* Standards Alignment */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Common Core Standards Alignment</h2>
          <div className="flex flex-wrap gap-2">
            {['7.RP', '7.NS', '7.EE', '7.G', '7.SP'].map(standard => (
              <span key={standard} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                {standard}
              </span>
            ))}
          </div>
        </div>

        {/* Unit Breakdown */}
        <div className="space-y-6">
          {units.map((unit, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{unit.unit}: {unit.title}</h3>
                  <div className="text-sm bg-green-500 px-3 py-1 rounded">
                    {unit.duration}
                  </div>
                </div>
                <p className="text-green-100 mt-1">Pages {unit.pages}</p>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Lessons ({unit.lessons.length})</h4>
                <div className="grid gap-2">
                  {unit.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
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
            <div className="p-4 border border-green-200 rounded-lg">
              <h3 className="font-bold text-green-600 mb-2">Traditional Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">180-day school year</p>
              <div className="text-2xl font-bold text-gray-800">170 days</div>
            </div>
            <div className="p-4 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-600 mb-2">Accelerated Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">160-day intensive</p>
              <div className="text-2xl font-bold text-gray-800">150 days</div>
            </div>
            <div className="p-4 border border-purple-200 rounded-lg">
              <h3 className="font-bold text-purple-600 mb-2">Block Schedule</h3>
              <p className="text-sm text-gray-600 mb-2">90-minute periods</p>
              <div className="text-2xl font-bold text-gray-800">85 days</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/pacing-generator"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Custom Pacing Guide
          </Link>
          <Link
            href="/curriculum/grade-8"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Continue to Grade 8 →
          </Link>
        </div>
      </div>
    </div>
  );
}
