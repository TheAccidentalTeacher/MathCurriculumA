'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface PacingParameters {
  targetPopulation: 'accelerated' | 'standard' | 'scaffolded' | 'remedial' | 'custom';
  totalDays: number;
  majorWorkEmphasis: number; // percentage 0-100
  assessmentFrequency: 'daily' | 'weekly' | 'bi-weekly' | 'unit-based';
  prerequisiteSupport: boolean;
  gradeRange: '7' | '8' | '7-8-combined' | 'custom';
  pacingStyle: 'compressed' | 'standard' | 'extended' | 'flexible';
  customParameters?: {
    skipSupportingWork?: boolean;
    focusAreas?: string[];
    modifiedSequence?: boolean;
  };
}

interface PacingGuide {
  metadata: {
    title: string;
    gradeRange: string;
    totalDays: number;
    createdDate: string;
    targetPopulation: string;
    parameters: PacingParameters;
  };
  units: Array<{
    unitId: string;
    title: string;
    estimatedDays: number;
    lessons: Array<{
      lessonNumber: number;
      title: string;
      sessions: number;
      majorWork: boolean;
      modifications?: string[];
      prerequisites?: string[];
    }>;
  }>;
  recommendations: string[];
  assessmentSchedule: Array<{
    week: number;
    type: string;
    content: string;
  }>;
  dailySchedule: Array<{
    day: number;
    unit: string;
    lesson: string;
    focus: string;
  }>;
}

export default function PacingGeneratorPage() {
  const [parameters, setParameters] = useState<PacingParameters>({
    targetPopulation: 'standard',
    totalDays: 165,
    majorWorkEmphasis: 70,
    assessmentFrequency: 'weekly',
    prerequisiteSupport: false,
    gradeRange: '7-8-combined',
    pacingStyle: 'standard'
  });

  const [generatedGuide, setGeneratedGuide] = useState<PacingGuide | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleParameterChange = (key: keyof PacingParameters, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generatePacingGuide = async () => {
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/pacing-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parameters)
      });

      if (!response.ok) {
        throw new Error('Failed to generate pacing guide');
      }

      const generatedGuide = await response.json();
      setGeneratedGuide(generatedGuide);
    } catch (error) {
      console.error('Error generating pacing guide:', error);
      alert('Failed to generate pacing guide. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export will be implemented in the next phase');
  };

  const exportToCSV = () => {
    // TODO: Implement CSV export
    alert('CSV export will be implemented in the next phase');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
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
              🎯 Adaptive Pacing Guide Generator
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Create custom pacing guides tailored to your students' needs. Analyze curriculum content, 
              adjust timing, and generate professional-grade instructional plans for any learning scenario.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Panel */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <span className="text-3xl">⚙️</span>
              Pacing Parameters
            </h2>

            <div className="space-y-6">
              
              {/* Target Population */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Target Population
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['accelerated', 'standard', 'scaffolded', 'remedial'] as const).map(pop => (
                    <button
                      key={pop}
                      onClick={() => handleParameterChange('targetPopulation', pop)}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        parameters.targetPopulation === pop
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {pop.charAt(0).toUpperCase() + pop.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Days */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Total Instructional Days: {parameters.totalDays}
                </label>
                <input
                  type="range"
                  min="120"
                  max="200"
                  value={parameters.totalDays}
                  onChange={(e) => handleParameterChange('totalDays', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>120 days</span>
                  <span>200 days</span>
                </div>
              </div>

              {/* Major Work Emphasis */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Major Work Emphasis: {parameters.majorWorkEmphasis}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={parameters.majorWorkEmphasis}
                  onChange={(e) => handleParameterChange('majorWorkEmphasis', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>50% time</span>
                  <span>100% time</span>
                </div>
              </div>

              {/* Grade Range */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Grade Range
                </label>
                <select
                  value={parameters.gradeRange}
                  onChange={(e) => handleParameterChange('gradeRange', e.target.value)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="7">Grade 7 Only</option>
                  <option value="8">Grade 8 Only</option>
                  <option value="7-8-combined">Grade 7/8 Combined (Accelerated)</option>
                  <option value="custom">Custom Selection</option>
                </select>
              </div>

              {/* Assessment Frequency */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-3">
                  Assessment Frequency
                </label>
                <select
                  value={parameters.assessmentFrequency}
                  onChange={(e) => handleParameterChange('assessmentFrequency', e.target.value as any)}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="daily">Daily Check-ins</option>
                  <option value="weekly">Weekly Assessments</option>
                  <option value="bi-weekly">Bi-weekly Reviews</option>
                  <option value="unit-based">Unit-based Testing</option>
                </select>
              </div>

              {/* Prerequisite Support */}
              <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="text-white font-medium">Include Prerequisite Support</div>
                  <div className="text-sm text-slate-400">Add extra days for remediation</div>
                </div>
                <button
                  onClick={() => handleParameterChange('prerequisiteSupport', !parameters.prerequisiteSupport)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    parameters.prerequisiteSupport ? 'bg-purple-600' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                    parameters.prerequisiteSupport ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Advanced Options</span>
                <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>
                  ⬇️
                </span>
              </button>

              {/* Advanced Options Panel */}
              {showAdvanced && (
                <div className="space-y-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">
                      Pacing Style
                    </label>
                    <select
                      value={parameters.pacingStyle}
                      onChange={(e) => handleParameterChange('pacingStyle', e.target.value as any)}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="compressed">Compressed (2 sessions/lesson)</option>
                      <option value="standard">Standard (3 sessions/lesson)</option>
                      <option value="extended">Extended (4+ sessions/lesson)</option>
                      <option value="flexible">Flexible (varies by lesson)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generatePacingGuide}
                disabled={isGenerating}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Analyzing Curriculum...</span>
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

            {!generatedGuide ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-slate-400 text-lg">
                  Configure your parameters and click "Generate" to create your custom pacing guide
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Metadata */}
                <div className="bg-purple-800/30 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-purple-200 mb-2">
                    {generatedGuide.metadata.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Grade Range:</span>
                      <span className="text-white ml-2">{generatedGuide.metadata.gradeRange}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Total Days:</span>
                      <span className="text-white ml-2">{generatedGuide.metadata.totalDays}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Created:</span>
                      <span className="text-white ml-2">{generatedGuide.metadata.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Population:</span>
                      <span className="text-white ml-2">{generatedGuide.metadata.targetPopulation}</span>
                    </div>
                  </div>
                </div>

                {/* Units Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Unit Breakdown</h3>
                  {generatedGuide.units.map((unit, index) => (
                    <div key={unit.unitId} className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-white">{unit.title}</h4>
                        <span className="text-sm text-green-400 font-mono">
                          {unit.estimatedDays} days
                        </span>
                      </div>
                      <div className="text-sm text-slate-300">
                        {unit.lessons.length} lessons • 
                        {unit.lessons.filter(l => l.majorWork).length} major work
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                  <ul className="space-y-2">
                    {generatedGuide.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Export Options */}
                <div className="flex gap-4">
                  <button
                    onClick={exportToPDF}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📄</span>
                    Export PDF
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>📊</span>
                    Export CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-blue-800/30 border border-blue-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-blue-200 mb-4 flex items-center gap-2">
            <span className="text-2xl">ℹ️</span>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">1. Curriculum Analysis</h3>
              <p className="text-slate-300">
                Deep analysis of all Grade 7/8 content, standards alignment, and lesson structure
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">2. Parameter Processing</h3>
              <p className="text-slate-300">
                Your inputs are processed to determine optimal content selection and pacing
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-200 mb-2">3. Guide Generation</h3>
              <p className="text-slate-300">
                Professional pacing guide created with lesson modifications and timing recommendations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
