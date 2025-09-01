'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PacingRequest {
  gradeRange: number[];
  targetPopulation: string;
  totalDays: number;
  majorWorkFocus: number;
  includePrerequisites: boolean;
}

interface PacingResponse {
  lessons: Array<{
    id: number;
    title: string;
    grade: number;
    lessonNumber: number;
    estimatedDays: number;
    majorWork: boolean;
    isAdvanced: boolean;
    sequenceNumber: number;
    tags: string[];
    totalDaysAtThisPoint: number;
  }>;
  summary: {
    totalLessons: number;
    totalDays: number;
    majorWorkLessons: number;
    majorWorkDays: number;
    majorWorkPercentage: number;
    supportingWorkLessons: number;
    supportingWorkDays: number;
    gradeDistribution: Array<{
      grade: number;
      lessons: number;
      days: number;
    }>;
  };
  metadata: {
    targetPopulation: string;
    requestedDays: number;
    requestedMajorWorkFocus: number;
    gradeRange: number[];
    generatedAt: string;
  };
}

export default function PacingGeneratorPage() {
  const [formData, setFormData] = useState<PacingRequest>({
    gradeRange: [7, 8],
    targetPopulation: 'accelerated',
    totalDays: 160,
    majorWorkFocus: 85,
    includePrerequisites: false
  });

  const [results, setResults] = useState<PacingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/pacing-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate pacing guide');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF export functionality coming soon!');
  };

  const handleDownloadCSV = () => {
    if (!results) return;
    
    const csvContent = [
      ['Sequence', 'Grade', 'Lesson #', 'Title', 'Days', 'Major Work', 'Advanced', 'Cumulative Days'].join(','),
      ...results.lessons.map(lesson => [
        lesson.sequenceNumber,
        lesson.grade,
        lesson.lessonNumber || '',
        `"${lesson.title}"`,
        lesson.estimatedDays,
        lesson.majorWork ? 'Yes' : 'No',
        lesson.isAdvanced ? 'Yes' : 'No',
        lesson.totalDaysAtThisPoint
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pacing-guide-${formData.targetPopulation}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="text-2xl">⬅️</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">
              🎯 Advanced Pacing Guide Generator
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Create customized Grade 6-7-8 accelerated pathways using real curriculum data. 
              Perfect for planning advanced student pathways to Algebra 1 by 7th grade.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">🎛️</span>
              Pathway Parameters
            </h2>

            <div className="space-y-6">
              
              {/* Target Population */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Target Student Population
                </label>
                <select
                  value={formData.targetPopulation}
                  onChange={(e) => setFormData({...formData, targetPopulation: e.target.value})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="accelerated-algebra-prep">🚀 Advanced: Grade 6-7-8 → Algebra 1 by 7th Grade</option>
                  <option value="accelerated">⚡ Accelerated: High-Achieving Students</option>
                  <option value="standard">📚 Standard: Grade-Level Appropriate</option>
                  <option value="intensive">🎯 Intensive: Extra Support Needed</option>
                </select>
                <div className="text-sm text-slate-400 mt-2 p-3 bg-slate-700/50 rounded-lg">
                  {formData.targetPopulation === 'accelerated-algebra-prep' && 
                    "🎓 For gifted students: Compress Grade 6-8 content to prepare for Algebra 1 in 7th grade. Focus on conceptual understanding and algebraic thinking."}
                  {formData.targetPopulation === 'accelerated' && 
                    "⭐ For high-achieving students: Faster pacing with deeper exploration of mathematical concepts and connections."}
                  {formData.targetPopulation === 'standard' && 
                    "📖 Regular pacing following typical grade-level expectations and district timelines."}
                  {formData.targetPopulation === 'intensive' && 
                    "💪 For students needing additional time and scaffolding to master grade-level content."}
                </div>
              </div>

              {/* Grade Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Grade Selection
                </label>
                <div className="space-y-3">
                  {/* Individual Grade Checkboxes */}
                  <div className="grid grid-cols-3 gap-3">
                    {[6, 7, 8].map(grade => (
                      <label key={grade} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.gradeRange.includes(grade)}
                          onChange={(e) => {
                            const newGrades = e.target.checked 
                              ? [...formData.gradeRange, grade].sort((a, b) => a - b)
                              : formData.gradeRange.filter(g => g !== grade);
                            setFormData({...formData, gradeRange: newGrades});
                          }}
                          className="w-4 h-4 text-purple-600 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                        />
                        <span className="text-sm font-medium text-white">Grade {grade}</span>
                      </label>
                    ))}
                  </div>
                  
                  {/* Quick Select Buttons */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gradeRange: [6, 7, 8]})}
                      className="p-2 text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg font-medium transition-all"
                    >
                      Select All (6-7-8)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gradeRange: [7, 8]})}
                      className="p-2 text-sm bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg font-medium transition-all"
                    >
                      Middle School (7-8)
                    </button>
                  </div>
                </div>
                
                {/* Selected Grades Display */}
                <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                  <div className="text-sm text-slate-300">
                    <strong>Selected Grades:</strong> {formData.gradeRange.length > 0 ? formData.gradeRange.join(', ') : 'None'}
                  </div>
                </div>
                
                {formData.gradeRange.includes(6) && (
                  <div className="text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20 mt-2">
                    ⚠️ Note: Grade 6 data may be limited in current database
                  </div>
                )}
                
                {formData.gradeRange.length === 0 && (
                  <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 mt-2">
                    ⚠️ Please select at least one grade level
                  </div>
                )}
              </div>

              {/* Total Days */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Total Instructional Days: {formData.totalDays}
                </label>
                <input
                  type="range"
                  min="120"
                  max="200"
                  step="10"
                  value={formData.totalDays}
                  onChange={(e) => setFormData({...formData, totalDays: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>120 (Compressed)</span>
                  <span>200 (Extended)</span>
                </div>
              </div>

              {/* Major Work Focus */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Major Work Focus: {formData.majorWorkFocus}%
                </label>
                <input
                  type="range"
                  min="65"
                  max="95"
                  step="5"
                  value={formData.majorWorkFocus}
                  onChange={(e) => setFormData({...formData, majorWorkFocus: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>65% (Balanced)</span>
                  <span>95% (Major Only)</span>
                </div>
              </div>

              {/* Prerequisites */}
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">Include Prerequisite Support</div>
                  <div className="text-sm text-slate-400">Add additional time for reviewing prerequisite skills</div>
                </div>
                <button
                  onClick={() => setFormData({...formData, includePrerequisites: !formData.includePrerequisites})}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    formData.includePrerequisites ? 'bg-purple-600' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    formData.includePrerequisites ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || formData.gradeRange.length === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Analyzing Curriculum...</span>
                  </div>
                ) : formData.gradeRange.length === 0 ? (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">⚠️</span>
                    <span>Please Select Grade Levels First</span>
                    <span className="text-2xl">⚠️</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-2xl">🚀</span>
                    <span>Generate Custom Pacing Guide</span>
                    <span className="text-2xl">⚡</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">📊</span>
              Generated Pacing Guide
            </h2>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-200">
                  <span className="text-xl">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {!results && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-slate-400 text-lg">
                  Configure your parameters and click "Generate" to create your custom pacing guide
                </p>
              </div>
            )}

            {results && (
              <div className="space-y-6">
                
                {/* Summary Card */}
                <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-lg p-4 border border-purple-700/50">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4">
                    📈 Pathway Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{results.summary.totalLessons}</div>
                      <div className="text-sm text-slate-400">Total Lessons</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{results.summary.totalDays}</div>
                      <div className="text-sm text-slate-400">Total Days</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{results.summary.majorWorkPercentage}%</div>
                      <div className="text-sm text-slate-400">Major Work</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-400">{results.summary.gradeDistribution.length}</div>
                      <div className="text-sm text-slate-400">Grade Levels</div>
                    </div>
                  </div>
                  
                  {/* Export Buttons */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleDownloadCSV}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <span>📊</span>
                      Export CSV
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <span>📄</span>
                      Export PDF
                    </button>
                  </div>

                  {/* Grade Distribution */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Grade Distribution:</h4>
                    {results.summary.gradeDistribution.map(grade => (
                      <div key={grade.grade} className="flex justify-between items-center bg-slate-700/50 p-2 rounded">
                        <span className="text-slate-300">Grade {grade.grade}</span>
                        <span className="text-slate-300">{grade.lessons} lessons • {grade.days} days</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons List */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">📝 Lesson Sequence</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results.lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                              #{lesson.sequenceNumber}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-600 text-white">
                              Grade {lesson.grade}
                            </span>
                            {lesson.lessonNumber && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-600 text-white">
                                Lesson {lesson.lessonNumber}
                              </span>
                            )}
                            {lesson.majorWork && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                                Major Work
                              </span>
                            )}
                            {lesson.isAdvanced && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-600 text-white">
                                Advanced
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-white mb-1">{lesson.title}</h3>
                          {lesson.tags && lesson.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {lesson.tags.map((tag: string) => (
                                <span 
                                  key={tag}
                                  className="text-xs px-2 py-1 bg-slate-600 text-slate-300 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-medium text-blue-400">{lesson.estimatedDays} days</div>
                          <div className="text-sm text-slate-400">Day {lesson.totalDaysAtThisPoint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-blue-800/30 border border-blue-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-blue-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            How the Advanced Pacing Generator Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">1. Real Curriculum Analysis</h3>
              <p className="text-slate-300">
                Analyzes actual lesson content from the curriculum database, extracting major work classifications and lesson sequences
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">2. Intelligent Filtering</h3>
              <p className="text-slate-300">
                Filters lessons based on your target population and grade range, prioritizing major work for accelerated students
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">3. Custom Pathway Creation</h3>
              <p className="text-slate-300">
                Generates a sequential pathway with realistic day estimates, formatted for easy implementation in your classroom
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
