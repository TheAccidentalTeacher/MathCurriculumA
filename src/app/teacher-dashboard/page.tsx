// src/app/teacher-dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';

interface LessonStatus {
  documentId: string;
  lessonNumber: number;
  title: string;
  visionAnalysis: 'ready' | 'loading' | 'not-ready';
  practiceQuestions: 'ready' | 'loading' | 'not-ready';
  kidFriendlyQuestions: 'ready' | 'loading' | 'not-ready';
  lastUpdated?: string;
}

interface CurriculumConfig {
  documentId: string;
  name: string;
  lessons: number[];
}

const CURRICULA: CurriculumConfig[] = [
  {
    documentId: 'RCM07_NA_SW_V1',
    name: 'Grade 7 Math - Volume 1',
    lessons: Array.from({length: 20}, (_, i) => i + 1)
  }
  // Add more curricula as needed
];

export default function TeacherDashboard() {
  const [lessons, setLessons] = useState<LessonStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadLessonStatuses();
  }, []);

  const loadLessonStatuses = async () => {
    try {
      const allLessons: LessonStatus[] = [];
      
      for (const curriculum of CURRICULA) {
        for (const lessonNumber of curriculum.lessons.slice(0, 5)) { // First 5 lessons for demo
          const status = await checkLessonStatus(curriculum.documentId, lessonNumber);
          allLessons.push({
            documentId: curriculum.documentId,
            lessonNumber,
            title: `${curriculum.name} - Lesson ${lessonNumber}`,
            ...status
          });
        }
      }
      
      setLessons(allLessons);
    } catch (error) {
      console.error('Error loading lesson statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLessonStatus = async (documentId: string, lessonNumber: number) => {
    try {
      // For now, return not-ready - we'll check cache in a future update
      return {
        visionAnalysis: 'not-ready' as const,
        practiceQuestions: 'not-ready' as const,
        kidFriendlyQuestions: 'not-ready' as const
      };
    } catch (error) {
      console.error('Error checking lesson status:', error);
      return {
        visionAnalysis: 'not-ready' as const,
        practiceQuestions: 'not-ready' as const,
        kidFriendlyQuestions: 'not-ready' as const
      };
    }
  };

  const warmLesson = async (documentId: string, lessonNumber: number, type: string) => {
    // Update UI to show loading
    setLessons(prev => prev.map(lesson => 
      lesson.documentId === documentId && lesson.lessonNumber === lessonNumber
        ? { ...lesson, [type]: 'loading' }
        : lesson
    ));

    try {
      let endpoint = '';
      let method = 'GET';
      
      switch (type) {
        case 'visionAnalysis':
          endpoint = `/api/lessons/${documentId}/${lessonNumber}/vision-analysis`;
          method = 'POST';
          break;
        case 'practiceQuestions':
          endpoint = `/api/lessons/${documentId}/${lessonNumber}/generate-questions`;
          method = 'POST';
          break;
        case 'kidFriendlyQuestions':
          endpoint = `/api/lessons/${documentId}/${lessonNumber}/kid-friendly-questions`;
          method = 'GET';
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        ...(method === 'POST' && { body: JSON.stringify({}) })
      });

      if (response.ok) {
        // Update status to ready
        setLessons(prev => prev.map(lesson => 
          lesson.documentId === documentId && lesson.lessonNumber === lessonNumber
            ? { 
                ...lesson, 
                [type]: 'ready',
                lastUpdated: new Date().toLocaleTimeString()
              }
            : lesson
        ));
      } else {
        throw new Error(`Failed to warm ${type}`);
      }
    } catch (error) {
      console.error(`Error warming ${type}:`, error);
      // Reset to not-ready on error
      setLessons(prev => prev.map(lesson => 
        lesson.documentId === documentId && lesson.lessonNumber === lessonNumber
          ? { ...lesson, [type]: 'not-ready' }
          : lesson
      ));
    }
  };

  const warmAllForLesson = async (documentId: string, lessonNumber: number) => {
    console.log(`🔥 Preparing all content for ${documentId} Lesson ${lessonNumber}`);
    await Promise.all([
      warmLesson(documentId, lessonNumber, 'visionAnalysis'),
      warmLesson(documentId, lessonNumber, 'practiceQuestions'),
      warmLesson(documentId, lessonNumber, 'kidFriendlyQuestions')
    ]);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'loading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return '✅ Ready';
      case 'loading':
        return '⏳ Loading...';
      default:
        return '❌ Not Ready';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg">Loading lesson statuses...</p>
        </div>
      </div>
    );
  }

  const readyCount = lessons.filter(l => 
    l.visionAnalysis === 'ready' && 
    l.practiceQuestions === 'ready' && 
    l.kidFriendlyQuestions === 'ready'
  ).length;

  const loadingCount = lessons.filter(l => 
    l.visionAnalysis === 'loading' || 
    l.practiceQuestions === 'loading' || 
    l.kidFriendlyQuestions === 'loading'
  ).length;

  const notReadyCount = lessons.filter(l => 
    l.visionAnalysis === 'not-ready' || 
    l.practiceQuestions === 'not-ready' || 
    l.kidFriendlyQuestions === 'not-ready'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📚 Teacher Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Prepare your lessons for the day. Warm up content so students get instant responses.
          </p>
          <div className="mt-4 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
            📅 {selectedDate}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Ready Lessons</p>
                <p className="text-3xl font-bold text-green-600">{readyCount}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{loadingCount}</p>
              </div>
              <div className="text-4xl">⏳</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Need Prep</p>
                <p className="text-3xl font-bold text-red-600">{notReadyCount}</p>
              </div>
              <div className="text-4xl">❌</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Lessons</p>
                <p className="text-3xl font-bold text-gray-600">{lessons.length}</p>
              </div>
              <div className="text-4xl">📖</div>
            </div>
          </div>
        </div>

        {/* Today's Lessons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🌅 Today's Lesson Prep
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {lessons.map((lesson) => (
                <div key={`${lesson.documentId}-${lesson.lessonNumber}`} 
                     className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{lesson.title}</h3>
                      {lesson.lastUpdated && (
                        <p className="text-sm text-gray-500 mt-1">
                          Last updated: {lesson.lastUpdated}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => warmAllForLesson(lesson.documentId, lesson.lessonNumber)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      disabled={
                        lesson.visionAnalysis === 'loading' ||
                        lesson.practiceQuestions === 'loading' ||
                        lesson.kidFriendlyQuestions === 'loading'
                      }
                    >
                      🚀 Prepare All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700">🔍 Vision Analysis</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusStyle(lesson.visionAnalysis)}`}>
                          {getStatusText(lesson.visionAnalysis)}
                        </span>
                      </div>
                      <button
                        onClick={() => warmLesson(lesson.documentId, lesson.lessonNumber, 'visionAnalysis')}
                        disabled={lesson.visionAnalysis === 'loading'}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
                      >
                        {lesson.visionAnalysis === 'ready' ? 'Ready ✅' : lesson.visionAnalysis === 'loading' ? 'Loading...' : 'Prepare'}
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700">📝 Practice Questions</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusStyle(lesson.practiceQuestions)}`}>
                          {getStatusText(lesson.practiceQuestions)}
                        </span>
                      </div>
                      <button
                        onClick={() => warmLesson(lesson.documentId, lesson.lessonNumber, 'practiceQuestions')}
                        disabled={lesson.practiceQuestions === 'loading'}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
                      >
                        {lesson.practiceQuestions === 'ready' ? 'Ready ✅' : lesson.practiceQuestions === 'loading' ? 'Loading...' : 'Prepare'}
                      </button>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-700">🧒 Kid-Friendly Q&A</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusStyle(lesson.kidFriendlyQuestions)}`}>
                          {getStatusText(lesson.kidFriendlyQuestions)}
                        </span>
                      </div>
                      <button
                        onClick={() => warmLesson(lesson.documentId, lesson.lessonNumber, 'kidFriendlyQuestions')}
                        disabled={lesson.kidFriendlyQuestions === 'loading'}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded transition-colors"
                      >
                        {lesson.kidFriendlyQuestions === 'ready' ? 'Ready ✅' : lesson.kidFriendlyQuestions === 'loading' ? 'Loading...' : 'Prepare'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cost Savings Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              💡 Cost Savings Summary
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-bold text-green-700 text-lg mb-3">✅ With Your Daily Preparation</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">•</span>
                    <span>Teacher preps 5 lessons: ~$0.15</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">•</span>
                    <span>15 students get instant responses: $0.00</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <span className="text-green-600">•</span>
                    <span>Total cost per day: $0.15</span>
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-bold text-red-700 text-lg mb-3">❌ Without Preparation</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">•</span>
                    <span>Each student triggers generation: ~$0.03</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">•</span>
                    <span>15 students × 5 lessons = 75 calls</span>
                  </li>
                  <li className="flex items-center gap-2 font-semibold">
                    <span className="text-red-600">•</span>
                    <span>Total cost per day: $2.25</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-lg font-bold text-yellow-800 text-center">
                💰 Daily savings: $2.10 | Monthly savings: ~$42 | Student experience: Instant! ⚡
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}