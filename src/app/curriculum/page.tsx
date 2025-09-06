'use client';

import Link from 'next/link';

export default function CurriculumHome() {
  const gradeData = [
    {
      grade: 'Grade 6',
      slug: 'grade-6',
      pages: 894,
      lessons: 33,
      units: 6,
      description: 'Ratios, Fractions, Basic Algebra',
      color: 'bg-blue-500'
    },
    {
      grade: 'Grade 7',
      slug: 'grade-7',
      pages: 944,
      lessons: 33,
      units: 7,
      description: 'Proportional Reasoning, Operations',
      color: 'bg-green-500'
    },
    {
      grade: 'Grade 8',
      slug: 'grade-8',
      pages: 1008,
      lessons: 32,
      units: 9,
      description: 'Functions, Transformations, HS Prep',
      color: 'bg-purple-500'
    },
    {
      grade: 'Algebra 1',
      slug: 'algebra-1',
      pages: 1354,
      lessons: 28,
      units: 7,
      description: 'Advanced Algebra, College Readiness',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ready Classroom Mathematics
          </h1>
          <h2 className="text-2xl text-gray-600 mb-2">
            Complete Secondary Curriculum (Grades 6-9)
          </h2>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Comprehensive scope and sequence analysis for the complete secondary mathematics program. 
            Navigate to any grade level to view detailed curriculum breakdown, pacing guides, and standards alignment.
          </p>
        </div>

        {/* Statistics Banner */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">4,200</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">126</div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">29</div>
              <div className="text-sm text-gray-600">Total Units</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">4</div>
              <div className="text-sm text-gray-600">Grade Levels</div>
            </div>
          </div>
        </div>

        {/* Grade Level Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {gradeData.map((grade) => (
            <Link
              key={grade.slug}
              href={`/curriculum/${grade.slug}`}
              className="block group"
            >
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className={`${grade.color} h-2 rounded-t-lg`}></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {grade.grade}
                  </h3>
                  <p className="text-gray-600 mb-4">{grade.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Pages:</span>
                      <span className="font-semibold">{grade.pages.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lessons:</span>
                      <span className="font-semibold">{grade.lessons}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Units:</span>
                      <span className="font-semibold">{grade.units}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-blue-600 group-hover:text-blue-800 font-medium">
                      View Scope & Sequence →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/curriculum/complete-analysis"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">📊</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Complete Analysis</div>
                <div className="text-sm text-gray-600">All grades comparison</div>
              </div>
            </Link>
            
            <Link
              href="/pacing-generator"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">⏰</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Pacing Generator</div>
                <div className="text-sm text-gray-600">Create custom schedules</div>
              </div>
            </Link>
            
            <Link
              href="/"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                <span className="text-white text-xl">🏠</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Main Platform</div>
                <div className="text-sm text-gray-600">Return to home</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
