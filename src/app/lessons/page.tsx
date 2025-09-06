import { Suspense } from 'react';
import { LessonNavigationGrid } from '../../components/LessonNavigationGrid';

export default async function LessonsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Lesson Navigation
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Navigate through all lessons across all grade levels - from Grade 6 foundations through Algebra 1
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-semibold text-blue-600">Grade 6</h3>
              <p className="text-sm text-gray-600">Foundation concepts</p>
              <p className="text-xs text-gray-500">~81 lessons</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-semibold text-green-600">Grade 7</h3>
              <p className="text-sm text-gray-600">Building skills</p>
              <p className="text-xs text-gray-500">~134 lessons</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-semibold text-purple-600">Grade 8</h3>
              <p className="text-sm text-gray-600">Advanced concepts</p>
              <p className="text-xs text-gray-500">~144 lessons</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-semibold text-red-600">Algebra 1</h3>
              <p className="text-sm text-gray-600">High school ready</p>
              <p className="text-xs text-gray-500">~550 lessons</p>
            </div>
          </div>
        </div>

        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <LessonNavigationGrid />
        </Suspense>
      </div>
    </div>
  );
}
