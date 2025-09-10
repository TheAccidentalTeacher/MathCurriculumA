'use client';

import { SessionBreakdownService, SessionDetail, LessonWithSessions } from '@/lib/session-breakdown-service';
import { useState } from 'react';

export default function SessionBreakdownTest() {
  const [selectedLesson, setSelectedLesson] = useState<LessonWithSessions | null>(null);
  
  // Get adapted curriculum with session breakdowns
  const adaptedCurriculum = SessionBreakdownService.adaptExistingCurriculum();
  const grade6Data = adaptedCurriculum['6'] || [];

  const handleLessonSelect = (lesson: LessonWithSessions) => {
    setSelectedLesson(lesson);
  };

  const getSessionTypeColor = (sessionType: string) => {
    switch (sessionType) {
      case 'explore':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'develop':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'refine':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Session Breakdown Test - Phase 2 Logic Applied
          </h1>
          <p className="text-gray-600">
            Testing the 5-day session structure applied to existing curriculum lessons
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Units and Lessons */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Grade 6 Units & Lessons</h2>
            
            {grade6Data.map((unit) => (
              <div key={unit.unitNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Unit {unit.unitNumber}: {unit.unitTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{unit.unitDescription}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Total Days: {unit.totalDays} | Lessons: {unit.lessons.length}
                  </p>
                </div>
                
                <div className="p-4 space-y-2">
                  {unit.lessons.map((lesson) => (
                    <button
                      key={lesson.lessonNumber}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedLesson?.lessonNumber === lesson.lessonNumber
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            Lesson {lesson.lessonNumber}: {lesson.lessonTitle}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Pages {lesson.startPage}-{lesson.endPage} | {lesson.totalSessions} Sessions
                          </p>
                        </div>
                        {lesson.isMajorWork && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Major Work
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Panel: Session Breakdown */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Session Breakdown</h2>
            
            {selectedLesson ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Lesson {selectedLesson.lessonNumber}: {selectedLesson.lessonTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedLesson.totalSessions} Sessions | Pages {selectedLesson.startPage}-{selectedLesson.endPage}
                  </p>
                </div>
                
                <div className="p-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">5-Day Session Structure</h4>
                  
                  <div className="space-y-4">
                    {selectedLesson.sessions.map((session) => (
                      <div
                        key={session.sessionNumber}
                        className={`p-4 rounded-lg border-2 ${getSessionTypeColor(session.sessionType)}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold">
                            Day {session.dayNumber}: {session.sessionName}
                          </h5>
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {session.sessionType}
                          </span>
                        </div>
                        
                        <p className="text-sm mb-3 font-medium">
                          Focus: {session.focus}
                        </p>
                        
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Activities:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {session.activities.map((activity, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-gray-400 mr-2">•</span>
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          Estimated Time: {session.estimatedMinutes} minutes
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Select a lesson to see its 5-day session breakdown
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Session Pattern Explanation */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ready Classroom Mathematics Session Pattern
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-blue-800 mb-2">Explore Session</h4>
              <p className="text-sm text-gray-600">
                Prior knowledge activation, concept introduction, hands-on exploration
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-green-600">2-4</span>
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Develop Sessions</h4>
              <p className="text-sm text-gray-600">
                Build conceptual understanding, develop procedural skills, guided practice
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl font-bold text-purple-600">5</span>
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">Refine Session</h4>
              <p className="text-sm text-gray-600">
                Review key concepts, reinforce understanding, extend learning
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
