'use client';

import React, { useState, useCallback } from 'react';
import { 
  GeneratedPacingGuide, 
  DetailedLessonGuide,
  WeeklySchedule, 
  DifferentiationStrategy,
  FlexibilityOption,
  StandardsAlignment,
  DetailedLesson,
  ProgressionStage
} from '@/lib/enhanced-ai-service';

interface PacingGuideResultsProps {
  pacingGuide?: GeneratedPacingGuide;
  detailedLessonGuide?: DetailedLessonGuide;
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
  onModify?: () => void;
}

type ViewMode = 'overview' | 'weekly' | 'assessments' | 'differentiation' | 'standards' | 'detailed-lessons' | 'progression' | 'lesson-plans';

export function PacingGuideResults({ 
  pacingGuide, 
  detailedLessonGuide,
  onExport, 
  onModify 
}: PacingGuideResultsProps) {
  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<string>('');

  // Force simple mode - we want basic tabs only
  const isDetailedGuide = false;  // Always use simple mode
  const currentGuide = pacingGuide || null;

  if (!currentGuide) {
    return <div className="text-center p-8">No pacing guide data available</div>;
  }

  const handleViewChange = useCallback((view: ViewMode) => {
    setActiveView(view);
    setAnnouncements(`Switched to ${view} view`);
  }, []);

  const handleWeekSelect = useCallback((week: number) => {
    setSelectedWeek(selectedWeek === week ? null : week);
    setAnnouncements(selectedWeek === week ? 'Week details closed' : `Week ${week} details opened`);
  }, [selectedWeek]);

  const handleExport = useCallback((format: 'pdf' | 'csv' | 'json') => {
    onExport?.(format);
    setAnnouncements(`Exporting pacing guide as ${format.toUpperCase()}`);
  }, [onExport]);

  const getViewLabel = (view: ViewMode): string => {
    const labels: Record<ViewMode, string> = {
      overview: 'Overview',
      weekly: 'Weekly Schedule',
      assessments: 'Assessment Plan',
      differentiation: 'Differentiation',
      standards: 'Standards Alignment',
      'detailed-lessons': 'Detailed Lessons',
      'progression': 'Progression Map',
      'lesson-plans': 'Lesson Plans'
    };
    return labels[view];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg text-gray-900">
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcements}
      </div>

      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Grade {currentGuide.overview.gradeLevel} Pacing Guide
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {currentGuide.overview.timeframe} • {currentGuide.overview.totalWeeks} weeks • {currentGuide.overview.lessonsPerWeek} lessons/week
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={() => handleExport('pdf')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Export pacing guide as PDF"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Export pacing guide as Excel/Google Sheets CSV"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
            {onModify && (
              <button
                onClick={onModify}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Modify pacing guide parameters"
              >
                Modify
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Pacing guide navigation">
          {['overview', 'weekly', 'progression'].map((view) => (
            <button
              key={view}
              onClick={() => handleViewChange(view as ViewMode)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeView === view
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeView === view}
              role="tab"
            >
              {getViewLabel(view as ViewMode)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Views */}
      <div role="tabpanel" aria-labelledby={`${activeView}-tab`}>
        {activeView === 'overview' && (
          <OverviewView 
            pacingGuide={currentGuide} 
          />
        )}

        {activeView === 'weekly' && (
          <WeeklyScheduleView 
            schedule={currentGuide.weeklySchedule}
            selectedWeek={selectedWeek}
            onWeekSelect={handleWeekSelect}
          />
        )}

        {activeView === 'progression' && (
          <ProgressionMapView progressionMap={[
            {
              stage: "1",
              weeks: Array.from({length: currentGuide.overview.totalWeeks}, (_, i) => i + 1),
              focus: "Complete mathematics curriculum",
              milestones: ["Weekly assessments", "Unit completions"],
              assessmentPoints: ["Formative assessments", "Unit tests"]
            }
          ]} />
        )}
      </div>
    </div>
  );
}

// Overview Component
function OverviewView({ 
  pacingGuide
}: { 
  pacingGuide: GeneratedPacingGuide;
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Lessons</h3>
          <p className="text-3xl font-bold text-blue-600">{pacingGuide.overview.totalLessons}</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Weeks</h3>
          <p className="text-3xl font-bold text-green-600">{pacingGuide.overview.totalWeeks}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Lessons/Week</h3>
          <p className="text-3xl font-bold text-purple-600">{pacingGuide.overview.lessonsPerWeek}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Curriculum Summary
        </h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            This pacing guide covers <strong>{pacingGuide.overview.totalWeeks} weeks</strong> of Grade {pacingGuide.overview.gradeLevel} mathematics curriculum.
            The schedule includes <strong>{pacingGuide.overview.lessonsPerWeek} lessons per week</strong> with comprehensive coverage of essential mathematical concepts.
          </p>
        </div>
      </div>
    </div>
  );
}

// Weekly Schedule Component
function WeeklyScheduleView({ 
  schedule, 
  selectedWeek, 
  onWeekSelect 
}: { 
  schedule: WeeklySchedule[];
  selectedWeek: number | null;
  onWeekSelect: (week: number) => void;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Schedule</h3>
      {schedule.map((week) => (
        <div key={week.week} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onWeekSelect(week.week)}
            className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
            aria-expanded={selectedWeek === week.week}
            aria-controls={`week-${week.week}-details`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Week {week.week}: {week.unit}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {(week.lessons || []).length} lesson{(week.lessons || []).length !== 1 ? 's' : ''} • {(week.focusStandards || []).length} standard{(week.focusStandards || []).length !== 1 ? 's' : ''}
                  {week.assessmentType && (
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      week.assessmentType === 'summative' 
                        ? 'bg-red-100 text-red-800'
                        : week.assessmentType === 'formative'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {week.assessmentType}
                    </span>
                  )}
                </p>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform ${
                  selectedWeek === week.week ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          {selectedWeek === week.week && (
            <div id={`week-${week.week}-details`} className="px-6 py-4 bg-white border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Lessons</h5>
                  <div className="space-y-3">
                    {(week.lessons || []).map((lesson, index) => {
                      const sessionDetail = (week as any).sessionDetails?.[index];
                      return (
                        <div key={index} className="bg-gray-50 p-3 rounded-md">
                          <div className="text-sm text-gray-900 font-medium">{lesson}</div>
                          {sessionDetail && (
                            <div className="mt-2 text-xs text-gray-600">
                              <div className="flex items-center space-x-4">
                                <span className="font-medium">
                                  Sessions: {sessionDetail.sessions?.join(' → ') || 'N/A'}
                                </span>
                                <span>
                                  Duration: {sessionDetail.duration || 'N/A'}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  sessionDetail.complexity === 'high' ? 'bg-red-100 text-red-800' :
                                  sessionDetail.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {sessionDetail.complexity || 'medium'} complexity
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(week.learningObjectives || []).map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {(week.focusStandards || []).length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Focus Standards</h5>
                  <div className="flex flex-wrap gap-2">
                    {(week.focusStandards || []).map((standard, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {week.differentiationNotes && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Differentiation Notes</h5>
                  <p className="text-sm text-gray-700">{week.differentiationNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Differentiation Component
function DifferentiationView({ 
  strategies, 
  flexibilityOptions 
}: { 
  strategies: DifferentiationStrategy[];
  flexibilityOptions: FlexibilityOption[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Differentiation Strategies</h3>
        <div className="space-y-6">
          {(strategies || []).map((strategy, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">{strategy.studentGroup}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Modifications</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(strategy.modifications || []).map((mod, idx) => (
                      <li key={idx}>{mod}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Resources</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(strategy.resources || []).map((resource, idx) => (
                      <li key={idx}>{resource}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Assessment Adjustments</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {(strategy.assessmentAdjustments || []).map((adjustment, idx) => (
                      <li key={idx}>{adjustment}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {flexibilityOptions.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Flexibility Options</h3>
          <div className="space-y-4">
            {(flexibilityOptions || []).map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{option.scenario}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Adjustments</h5>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {(option.adjustments || []).map((adjustment, idx) => (
                        <li key={idx}>{adjustment}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Impact Analysis</h5>
                    <p className="text-sm text-gray-700">{option.impactAnalysis}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Detailed Lessons Component
function DetailedLessonsView({ 
  lessonGuide, 
  selectedLesson, 
  onLessonSelect 
}: { 
  lessonGuide: DetailedLessonGuide;
  selectedLesson: number | null;
  onLessonSelect: (lesson: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Detailed Lesson Analysis</h3>
        <span className="text-sm text-gray-500">
          {lessonGuide.lessonByLessonBreakdown.length} lessons total
        </span>
      </div>

      {/* Analysis Results Summary */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-blue-900 mb-3">Analysis Results</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-blue-800">Scope & Sequence Match:</p>
            <p className="text-sm text-blue-700">{lessonGuide.analysisResults.scopeAndSequenceMatch}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Prerequisite Check:</p>
            <p className="text-sm text-blue-700">
              {lessonGuide.analysisResults.prerequisiteCheck.prerequisitesMet.length} prerequisites met
            </p>
          </div>
        </div>
      </div>

      {/* Standards Coverage */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h4 className="text-lg font-medium text-green-900 mb-3">Standards Coverage</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">
              {lessonGuide.analysisResults.standardsCoverage.majorWork.length}
            </p>
            <p className="text-sm text-green-800">Major Work</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {lessonGuide.analysisResults.standardsCoverage.supportingWork.length}
            </p>
            <p className="text-sm text-green-800">Supporting</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {lessonGuide.analysisResults.standardsCoverage.additionalWork.length}
            </p>
            <p className="text-sm text-green-800">Additional</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {lessonGuide.analysisResults.standardsCoverage.crossGradeConnections?.length || 0}
            </p>
            <p className="text-sm text-green-800">Cross-Grade Connections</p>
          </div>
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(lessonGuide.lessonByLessonBreakdown || []).map((lesson) => (
          <div 
            key={lesson.lessonNumber}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedLesson === lesson.lessonNumber 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onLessonSelect(lesson.lessonNumber)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">Lesson {lesson.lessonNumber}</h4>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                Grade {lesson.grade}
              </span>
            </div>
            <h5 className="text-sm font-medium text-gray-800 mb-2">{lesson.title}</h5>
            <p className="text-xs text-gray-600 mb-2">{lesson.unit}</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{
                (lesson as any).sessions?.length || 
                (lesson as any).estimatedDays || 
                (lesson as any).duration?.sessions || 
                1
              } sessions</span>
              <span>{
                (lesson as any).estimatedDays || 
                Math.round(((lesson as any).duration?.totalMinutes || 50) / 50) || 
                1
              } days</span>
            </div>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {(
                  (lesson as any).standards?.primary || 
                  (lesson as any).standards || 
                  []
                ).slice(0, 2).map((standard: string, idx: number) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded"
                  >
                    {standard}
                  </span>
                ))}
                {(
                  (lesson as any).standards?.primary || 
                  (lesson as any).standards || 
                  []
                ).length > 2 && (
                  <span className="text-xs text-gray-500">+{
                    ((lesson as any).standards?.primary || (lesson as any).standards || []).length - 2
                  }</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progression Map Component
function ProgressionMapView({ progressionMap }: { progressionMap: ProgressionStage[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Learning Progression Map</h3>
      
      <div className="space-y-6">
        {progressionMap.map((stage, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">{stage.stage}</h4>
              <span className="text-sm text-gray-500">
                {stage.weeks && stage.weeks.length > 0 ? (
                  `Weeks ${Math.min(...stage.weeks)} - ${Math.max(...stage.weeks)}`
                ) : (
                  'No weeks specified'
                )}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{stage.focus}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Key Milestones</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {(stage.milestones || []).map((milestone, idx) => (
                    <li key={idx}>{milestone}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Assessment Points</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {(stage.assessmentPoints || []).map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Lesson Plans Component
function LessonPlansView({ 
  lessons, 
  selectedLesson, 
  onLessonSelect 
}: { 
  lessons: DetailedLesson[];
  selectedLesson: number | null;
  onLessonSelect: (lesson: number) => void;
}) {
  const currentLesson = selectedLesson ? lessons.find(l => l.lessonNumber === selectedLesson) : lessons[0];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Detailed Lesson Plans</h3>
        <select 
          value={currentLesson?.lessonNumber || ''} 
          onChange={(e) => onLessonSelect(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {lessons.map((lesson) => (
            <option key={lesson.lessonNumber} value={lesson.lessonNumber}>
              Lesson {lesson.lessonNumber}: {lesson.title}
            </option>
          ))}
        </select>
      </div>

      {currentLesson && (
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Lesson Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Lesson {currentLesson.lessonNumber}: {currentLesson.title}
                </h4>
                <p className="text-sm text-gray-600">{currentLesson.unit} • Grade {currentLesson.grade}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {(currentLesson as any).duration?.sessions || (currentLesson as any).estimatedDays || 1} sessions
                </p>
                <p className="text-sm text-gray-600">
                  {(currentLesson as any).duration?.totalMinutes || ((currentLesson as any).estimatedDays || 1) * 50} minutes total
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Standards */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-3">Standards Alignment</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Primary Standards</p>
                  <div className="space-y-1">
                    {((currentLesson as any).standards?.primary || []).map((standard: string, idx: number) => (
                      <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Supporting Standards</p>
                  <div className="space-y-1">
                    {((currentLesson as any).standards?.supporting || []).map((standard: string, idx: number) => (
                      <span key={idx} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1">
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Mathematical Practices</p>
                  <div className="space-y-1">
                    {((currentLesson as any).standards?.mathematicalPractices || (currentLesson as any).standards?.mathematical_practices || []).map((practice: string, idx: number) => (
                      <span key={idx} className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-1">
                        {practice}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-3">Learning Objectives</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {(currentLesson.learningObjectives || []).map((objective, idx) => (
                  <li key={idx}>{objective}</li>
                ))}
              </ul>
            </div>

            {/* Lesson Structure */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-3">Lesson Structure</h5>
              <div className="space-y-4">
                {(currentLesson.lessonStructure || []).map((phase, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h6 className="font-medium text-gray-900">{phase.phase}</h6>
                      <span className="text-sm text-gray-500">{phase.timeMinutes} minutes</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{phase.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Teacher Actions</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                          {phase.teacherActions.map((action, actionIdx) => (
                            <li key={actionIdx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Student Actions</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                          {phase.studentActions.map((action, actionIdx) => (
                            <li key={actionIdx}>{action}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Key Questions</p>
                        <ul className="list-disc list-inside text-gray-600 space-y-0.5">
                          {phase.keyQuestions.map((question, questionIdx) => (
                            <li key={questionIdx}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment and Homework */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-lg font-medium text-gray-900 mb-3">Assessment</h5>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Formative Strategies</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {(currentLesson.assessment?.formative || []).map((strategy, idx) => (
                        <li key={idx}>{strategy}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Exit Ticket</p>
                    <p className="text-sm text-gray-600">{currentLesson.assessment?.exitTicket || 'No exit ticket specified'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h5 className="text-lg font-medium text-gray-900 mb-3">Homework & Connection</h5>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Homework</p>
                    <p className="text-sm text-gray-600">{currentLesson.homework}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Connection to Next</p>
                    <p className="text-sm text-gray-600">{currentLesson.connectionToNext}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-World Application */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-3">Real-World Application</h5>
              <p className="text-gray-700">{currentLesson.realWorldApplication}</p>
            </div>

            {/* Differentiation */}
            <div>
              <h5 className="text-lg font-medium text-gray-900 mb-3">Differentiation</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Supports</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                    {(currentLesson.differentiation?.supports || []).map((support, idx) => (
                      <li key={idx}>{support}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Extensions</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                    {(currentLesson.differentiation?.extensions || []).map((extension, idx) => (
                      <li key={idx}>{extension}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Accommodations</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-0.5">
                    {(currentLesson.differentiation?.accommodations || []).map((accommodation, idx) => (
                      <li key={idx}>{accommodation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Update AssessmentPlanView to handle detailed strategy
function AssessmentPlanView({ 
  assessmentPlan, 
  detailedStrategy 
}: { 
  assessmentPlan: any;
  detailedStrategy?: any;
}) {
  const strategy = detailedStrategy || assessmentPlan;
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Assessment Strategy</h3>
      
      {detailedStrategy && (
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-blue-900 mb-3">Overall Approach</h4>
          <p className="text-blue-800">{strategy.overallApproach}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Formative Assessment</h4>
          <p className="text-sm text-gray-600 mb-3">
            Frequency: {strategy.formativeFrequency || 'Weekly'}
          </p>
          {detailedStrategy && (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {strategy.formativeStrategies?.map((strategy: string, idx: number) => (
                <li key={idx}>{strategy}</li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Summative Assessment</h4>
          <div className="space-y-3">
            {(strategy.summativeSchedule || strategy.summativeAssessments || []).map((assessment: any, idx: number) => (
              <div key={idx} className="border border-gray-200 rounded p-3">
                <h5 className="font-medium text-gray-900">{assessment.name || assessment.type}</h5>
                <p className="text-sm text-gray-600">{assessment.timing || `Week ${assessment.week}`}</p>
                {assessment.description && (
                  <p className="text-sm text-gray-700 mt-1">{assessment.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {detailedStrategy && (
        <>
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Diagnostic Checkpoints</h4>
            <div className="space-y-3">
              {strategy.diagnosticCheckpoints?.map((checkpoint: any, idx: number) => (
                <div key={idx} className="border border-gray-200 rounded p-3">
                  <h5 className="font-medium text-gray-900">{checkpoint.timing}</h5>
                  <p className="text-sm text-gray-600">{checkpoint.focus}</p>
                  <p className="text-sm text-gray-700">{checkpoint.assessmentMethod}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Mastery Indicators</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {strategy.masteryIndicators?.map((indicator: string, idx: number) => (
                <li key={idx}>{indicator}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

// Standards Alignment Component
function StandardsAlignmentView({ alignment }: { alignment: StandardsAlignment[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Standards Alignment</h3>
      <div className="space-y-4">
        {(alignment || []).map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">{item.standard}</h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                item.depth === 'mastery' 
                  ? 'bg-green-100 text-green-800'
                  : item.depth === 'development'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.depth}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Weeks Covered</h5>
                <div className="flex flex-wrap gap-1">
                  {(item.weeksCovered || []).map((week, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {week}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-900 mb-2">Connections</h5>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {(item.connections || []).map((connection, idx) => (
                    <li key={idx}>{connection}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
