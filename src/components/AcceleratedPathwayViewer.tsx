"use client";

import Link from "next/link";
import { useState } from "react";
import { ACCELERATED_PATHWAY, AcceleratedUnit, LessonReference, acceleratedPathway } from "@/lib/accelerated-pathway";

export function AcceleratedPathwayViewer() {
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set(["unit-a"])); // Start with Unit A expanded
  const [showOnlyMajorWork, setShowOnlyMajorWork] = useState(false);

  const toggleUnit = (unitId: string) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(unitId)) {
      newExpanded.delete(unitId);
    } else {
      newExpanded.add(unitId);
    }
    setExpandedUnits(newExpanded);
  };

  const filteredUnits = ACCELERATED_PATHWAY.map(unit => ({
    ...unit,
    lessons: showOnlyMajorWork ? unit.lessons.filter(l => l.majorWork) : unit.lessons
  }));

  const progressData = acceleratedPathway.getProgressData();

  return (
    <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-purple-200">🔀 Accelerated Pathway: Combined Grade 7/8</h2>
          <p className="text-slate-300 text-sm">
            Lessons shuffled according to the accelerated scope and sequence for Algebra 1 preparation.
          </p>
        </div>
        <div className="text-sm text-purple-200 text-right">
          <div>{progressData.totalLessons} Total Lessons</div>
          <div>{progressData.estimatedDays} Estimated Days</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4 p-3 bg-purple-800/30 rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowOnlyMajorWork(!showOnlyMajorWork)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              showOnlyMajorWork 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-700/50 text-purple-200 hover:bg-purple-600'
            }`}
          >
            {showOnlyMajorWork ? 'Show All Work' : 'Major Work Only'}
          </button>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">G7</span>
            <span className="text-purple-300">{progressData.grade7Lessons} lessons</span>
            <span className="bg-green-500 text-green-900 px-2 py-1 rounded text-xs font-bold">G8</span>
            <span className="text-purple-300">{progressData.grade8Lessons} lessons</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setExpandedUnits(new Set(ACCELERATED_PATHWAY.map(u => u.id)))}
            className="text-xs px-2 py-1 bg-purple-700/50 hover:bg-purple-600 rounded text-purple-200"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedUnits(new Set())}
            className="text-xs px-2 py-1 bg-purple-700/50 hover:bg-purple-600 rounded text-purple-200"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Units */}
      <div className="space-y-4">
        {filteredUnits.map((unit) => (
          <div key={unit.id} className="bg-purple-800/30 rounded-lg border border-purple-700/50">
            <button
              onClick={() => toggleUnit(unit.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-700/20 transition-colors rounded-lg"
            >
              <div>
                <h3 className="text-lg font-medium text-purple-200">{unit.title}</h3>
                <p className="text-sm text-slate-400">{unit.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-purple-300">
                  <span>{unit.lessons.length} lessons</span>
                  <span>{unit.estimatedDays} days estimated</span>
                  <span>{unit.lessons.filter(l => l.majorWork).length} major work</span>
                </div>
              </div>
              <span className={`text-purple-300 transition-transform ${expandedUnits.has(unit.id) ? 'rotate-90' : ''}`}>
                ▶
              </span>
            </button>

            {expandedUnits.has(unit.id) && (
              <div className="px-4 pb-4">
                <div className="space-y-2">
                  {unit.lessons.map((lesson, index) => (
                    <LessonCard key={lesson.id} lesson={lesson} index={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Development Status */}
      <div className="mt-6 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-purple-300">
          <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-bold">G7</span> Grade 7 Content
          <span className="bg-green-500 text-green-900 px-2 py-1 rounded text-xs font-bold">G8</span> Grade 8 Content
          <span className="bg-black text-white px-2 py-1 rounded text-xs font-bold">MW</span> Major Work
          <span className="bg-slate-600 text-slate-200 px-2 py-1 rounded text-xs font-bold">SW</span> Supporting Work
        </div>
        <span className="text-purple-300">🚧 <strong>Under Development</strong></span>
      </div>
    </div>
  );
}

function LessonCard({ lesson, index }: { lesson: LessonReference; index: number }) {
  const viewerUrl = acceleratedPathway.getViewerUrl(lesson);

  return (
    <div className="flex items-center justify-between bg-purple-700/40 rounded p-3 hover:bg-purple-700/60 transition-colors">
      <div className="flex items-center gap-3">
        <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-mono">
          {index + 1}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          lesson.grade === 7 
            ? 'bg-yellow-500 text-yellow-900' 
            : 'bg-green-500 text-green-900'
        }`}>
          G{lesson.grade}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold ${
          lesson.majorWork
            ? 'bg-black text-white'
            : 'bg-slate-600 text-slate-200'
        }`}>
          {lesson.majorWork ? 'MW' : 'SW'}
        </span>
        <div className="min-w-0">
          <div className="font-medium text-purple-100 truncate">{lesson.title}</div>
          <div className="text-xs text-purple-300">
            {lesson.originalCode} • {lesson.sessions} sessions • Pages {lesson.startPage}
            {lesson.endPage && `-${lesson.endPage}`}
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 flex-shrink-0">
        <Link 
          href={viewerUrl}
          className="px-3 py-1 bg-purple-600 hover:bg-purple-500 rounded text-sm transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
