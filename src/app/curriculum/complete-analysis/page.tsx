'use client';

import Link from 'next/link';

export default function CompleteAnalysis() {
  const gradeData = [
    {
      grade: 'Grade 6',
      pages: 894,
      lessons: 33,
      units: 6,
      color: 'blue',
      focus: ['Ratios and Rates', 'Fractions and Decimals', 'Rational Numbers', 'Expressions and Equations', 'Area and Volume', 'Statistics']
    },
    {
      grade: 'Grade 7', 
      pages: 944,
      lessons: 33,
      units: 7,
      color: 'green',
      focus: ['Proportional Relationships', 'Rational Number Operations', 'Expressions and Equations', 'Geometry', 'Statistics and Probability']
    },
    {
      grade: 'Grade 8',
      pages: 1008,
      lessons: 32,
      units: 9,
      color: 'purple',
      focus: ['Geometric Transformations', 'Linear Relationships and Systems', 'Functions', 'Exponents and Scientific Notation', 'Real Number System', 'Data Analysis']
    },
    {
      grade: 'Algebra 1',
      pages: 1354,
      lessons: 28,
      units: 7,
      color: 'red',
      focus: ['Expressions, Equations, and Inequalities', 'Functions and Linear Relationships', 'Systems of Linear Equations', 'Sequences and Exponential Functions', 'Polynomials and Quadratic Functions', 'Statistics and Data Analysis']
    }
  ];

  const totalPages = gradeData.reduce((sum, grade) => sum + grade.pages, 0);
  const totalLessons = gradeData.reduce((sum, grade) => sum + grade.lessons, 0);
  const totalUnits = gradeData.reduce((sum, grade) => sum + grade.units, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-blue-600 hover:text-blue-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Complete Curriculum Analysis</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Ready Classroom Mathematics
          </h1>
          <h2 className="text-2xl text-gray-600 mb-4">
            Complete Secondary Curriculum Analysis (Grades 6-9)
          </h2>
          <p className="text-lg text-gray-500 max-w-4xl mx-auto">
            Comprehensive scope and sequence analysis spanning middle school through high school entry. 
            This complete program provides seamless mathematical progression and college readiness preparation.
          </p>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Executive Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{totalPages.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Pages Analyzed</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{totalLessons}</div>
              <div className="text-sm text-gray-600 mt-1">Total Lessons</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{totalUnits}</div>
              <div className="text-sm text-gray-600 mt-1">Total Units</div>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">4</div>
              <div className="text-sm text-gray-600 mt-1">Grade Levels</div>
            </div>
          </div>
        </div>

        {/* Curriculum Progression */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mathematical Progression Pathway</h2>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {gradeData.map((grade, index) => (
                <div key={index} className="relative">
                  <div className={`bg-${grade.color}-500 text-white p-6 rounded-lg text-center shadow-lg relative z-10`}>
                    <h3 className="text-xl font-bold mb-2">{grade.grade}</h3>
                    <div className="space-y-1 text-sm">
                      <div>{grade.pages.toLocaleString()} pages</div>
                      <div>{grade.lessons} lessons</div>
                      <div>{grade.units} units</div>
                    </div>
                  </div>
                  {index < gradeData.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 z-20 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">→</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6 bg-gray-50 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Detailed Curriculum Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pages</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lessons</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Focus Areas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {gradeData.map((grade, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 bg-${grade.color}-500 rounded-full mr-3`}></div>
                        <div className="font-medium text-gray-900">{grade.grade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.pages.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.lessons}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {grade.units}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {grade.focus.slice(0, 2).map((area, areaIndex) => (
                          <span key={areaIndex} className={`px-2 py-1 text-xs bg-${grade.color}-100 text-${grade.color}-800 rounded-full`}>
                            {area}
                          </span>
                        ))}
                        {grade.focus.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            +{grade.focus.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/curriculum/${grade.grade.toLowerCase().replace(' ', '-')}`}
                        className={`text-${grade.color}-600 hover:text-${grade.color}-900`}
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Focus Areas Evolution */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Mathematical Concept Evolution</h2>
          <div className="space-y-6">
            {gradeData.map((grade, index) => (
              <div key={index} className="border-l-4 border-gray-200 pl-6">
                <h3 className={`text-lg font-bold text-${grade.color}-600 mb-2`}>{grade.grade} Focus Areas</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {grade.focus.map((area, areaIndex) => (
                    <div key={areaIndex} className={`p-3 bg-${grade.color}-50 rounded-lg border border-${grade.color}-200`}>
                      <span className="text-sm font-medium text-gray-700">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Implementation Support */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Documentation Available</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-sm font-medium">✅ Grade 6 Complete Analysis</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 text-sm font-medium">✅ Grade 7 Complete Analysis</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600 text-sm font-medium">✅ Grade 8 Complete Analysis</span>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-600 text-sm font-medium">✅ Algebra 1 Complete Analysis</span>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm font-medium">✅ Executive Summary Report</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Implementation Features</h2>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 text-sm font-medium">📅 Multiple Pacing Options</span>
              </div>
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 text-sm font-medium">🎯 Standards Alignment</span>
              </div>
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-600 text-sm font-medium">📊 Assessment Frameworks</span>
              </div>
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-orange-600 text-sm font-medium">🔄 Differentiation Support</span>
              </div>
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <span className="text-red-600 text-sm font-medium">🎓 College Readiness Focus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Take Action</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/pacing-generator"
              className="flex flex-col items-center p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xl">⏰</span>
              </div>
              <h3 className="font-bold text-blue-600 mb-1">Pacing Generator</h3>
              <p className="text-sm text-gray-600">Create custom schedules</p>
            </Link>

            <Link
              href="/curriculum/grade-6"
              className="flex flex-col items-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xl">📚</span>
              </div>
              <h3 className="font-bold text-green-600 mb-1">Start with Grade 6</h3>
              <p className="text-sm text-gray-600">Begin the journey</p>
            </Link>

            <Link
              href="/curriculum/algebra-1"
              className="flex flex-col items-center p-6 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center"
            >
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xl">🎓</span>
              </div>
              <h3 className="font-bold text-red-600 mb-1">Algebra 1 Focus</h3>
              <p className="text-sm text-gray-600">College readiness</p>
            </Link>

            <Link
              href="/"
              className="flex flex-col items-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white text-xl">🏠</span>
              </div>
              <h3 className="font-bold text-purple-600 mb-1">Main Platform</h3>
              <p className="text-sm text-gray-600">Return home</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
