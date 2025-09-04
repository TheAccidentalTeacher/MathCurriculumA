'use client';

import React, { useState, useCallback } from 'react';
import { 
  GeneratedPacingGuide, 
  WeeklySchedule, 
  DifferentiationStrategy,
  FlexibilityOption,
  StandardsAlignment 
} from '@/lib/enhanced-ai-service';

interface PacingGuideResultsProps {
  pacingGuide: GeneratedPacingGuide;
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
  onModify?: () => void;
}

type ViewMode = 'overview' | 'weekly' | 'assessments' | 'differentiation' | 'standards';

export function PacingGuideResults({ 
  pacingGuide, 
  onExport, 
  onModify 
}: PacingGuideResultsProps) {
  const [activeView, setActiveView] = useState<ViewMode>('overview');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<string>('');

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
    const labels = {
      overview: 'Overview',
      weekly: 'Weekly Schedule',
      assessments: 'Assessment Plan',
      differentiation: 'Differentiation',
      standards: 'Standards Alignment'
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
              Grade {pacingGuide.overview.gradeLevel} Pacing Guide
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {pacingGuide.overview.timeframe} • {pacingGuide.overview.totalWeeks} weeks • {pacingGuide.overview.lessonsPerWeek} lessons/week
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
          {(['overview', 'weekly', 'assessments', 'differentiation', 'standards'] as ViewMode[]).map((view) => (
            <button
              key={view}
              onClick={() => handleViewChange(view)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                activeView === view
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-selected={activeView === view}
              role="tab"
            >
              {getViewLabel(view)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Views */}
      <div role="tabpanel" aria-labelledby={`${activeView}-tab`}>
        {activeView === 'overview' && (
          <OverviewView pacingGuide={pacingGuide} />
        )}

        {activeView === 'weekly' && (
          <WeeklyScheduleView 
            schedule={pacingGuide.weeklySchedule}
            selectedWeek={selectedWeek}
            onWeekSelect={handleWeekSelect}
          />
        )}

        {activeView === 'assessments' && (
          <AssessmentPlanView assessmentPlan={pacingGuide.assessmentPlan} />
        )}

        {activeView === 'differentiation' && (
          <DifferentiationView 
            strategies={pacingGuide.differentiationStrategies}
            flexibilityOptions={pacingGuide.flexibilityOptions}
          />
        )}

        {activeView === 'standards' && (
          <StandardsAlignmentView alignment={pacingGuide.standardsAlignment} />
        )}
      </div>
    </div>
  );
}

// Overview Component
function OverviewView({ pacingGuide }: { pacingGuide: GeneratedPacingGuide }) {
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
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Summary</h3>
        <div className="bg-gray-50 p-6 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            This pacing guide covers <strong>{pacingGuide.overview.totalLessons} lessons</strong> over{' '}
            <strong>{pacingGuide.overview.totalWeeks} weeks</strong> for Grade {pacingGuide.overview.gradeLevel} mathematics.
            The schedule includes <strong>{pacingGuide.assessmentPlan.summativeSchedule.length} major assessments</strong> and{' '}
            <strong>{pacingGuide.differentiationStrategies.length} differentiation strategies</strong> to support diverse learners.
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
                  {week.lessons.length} lesson{week.lessons.length !== 1 ? 's' : ''} • {week.focusStandards.length} standard{week.focusStandards.length !== 1 ? 's' : ''}
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
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {week.lessons.map((lesson, index) => (
                      <li key={index}>{lesson}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {week.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {week.focusStandards.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-medium text-gray-900 mb-2">Focus Standards</h5>
                  <div className="flex flex-wrap gap-2">
                    {week.focusStandards.map((standard, index) => (
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

// Assessment Plan Component
function AssessmentPlanView({ assessmentPlan }: { assessmentPlan: any }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Assessment Overview</h3>
        <div className="bg-blue-50 p-6 rounded-lg">
          <p className="text-blue-900">
            <strong>Formative Assessment Frequency:</strong> {assessmentPlan.formativeFrequency}
          </p>
        </div>
      </div>

      {assessmentPlan.summativeSchedule.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Summative Assessments</h4>
          <div className="space-y-4">
            {assessmentPlan.summativeSchedule.map((assessment: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-lg font-medium text-gray-900">{assessment.type}</h5>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Week {assessment.week}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{assessment.description}</p>
                <div>
                  <h6 className="text-sm font-medium text-gray-900 mb-2">Standards Assessed:</h6>
                  <div className="flex flex-wrap gap-2">
                    {assessment.standards.map((standard: string, idx: number) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {standard}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {assessmentPlan.diagnosticCheckpoints.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Diagnostic Checkpoints</h4>
          <div className="flex flex-wrap gap-2">
            {assessmentPlan.diagnosticCheckpoints.map((week: number, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
              >
                Week {week}
              </span>
            ))}
          </div>
        </div>
      )}
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
          {strategies.map((strategy, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">{strategy.studentGroup}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Modifications</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {strategy.modifications.map((mod, idx) => (
                      <li key={idx}>{mod}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Resources</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {strategy.resources.map((resource, idx) => (
                      <li key={idx}>{resource}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Assessment Adjustments</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {strategy.assessmentAdjustments.map((adjustment, idx) => (
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
            {flexibilityOptions.map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-2">{option.scenario}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Adjustments</h5>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {option.adjustments.map((adjustment, idx) => (
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

// Standards Alignment Component
function StandardsAlignmentView({ alignment }: { alignment: StandardsAlignment[] }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Standards Alignment</h3>
      <div className="space-y-4">
        {alignment.map((item, index) => (
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
                  {item.weeksCovered.map((week, idx) => (
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
                  {item.connections.map((connection, idx) => (
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
