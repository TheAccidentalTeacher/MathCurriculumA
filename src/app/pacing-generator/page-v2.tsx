'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Download, FileSpreadsheet, BookOpen, Clock, Target } from 'lucide-react';

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

export default function PacingGeneratorV2() {
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
    // TODO: Implement PDF export
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Advanced Pacing Guide Generator
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Create customized Grade 6-7-8 accelerated pathways using real curriculum data
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Parameters Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Pathway Parameters
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Configure your accelerated mathematics pathway
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Target Population */}
                <div className="space-y-3">
                  <Label htmlFor="targetPopulation" className="text-base font-medium text-white">
                    Target Student Population
                  </Label>
                  <Select 
                    value={formData.targetPopulation} 
                    onValueChange={(value) => setFormData({...formData, targetPopulation: value})}
                  >
                    <SelectTrigger id="targetPopulation" className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose target population" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="accelerated-algebra-prep" className="text-white">
                        🚀 Advanced: Grade 6-7-8 → Algebra 1 by 7th Grade
                      </SelectItem>
                      <SelectItem value="accelerated" className="text-white">
                        ⚡ Accelerated: High-Achieving Students
                      </SelectItem>
                      <SelectItem value="standard" className="text-white">
                        📚 Standard: Grade-Level Appropriate
                      </SelectItem>
                      <SelectItem value="intensive" className="text-white">
                        🎯 Intensive: Extra Support Needed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-slate-400 bg-slate-700/50 p-3 rounded-lg">
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
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    Grade Range
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={JSON.stringify(formData.gradeRange) === JSON.stringify([6, 7, 8]) ? "default" : "outline"}
                      onClick={() => setFormData({...formData, gradeRange: [6, 7, 8]})}
                      className="text-sm"
                    >
                      Grades 6-7-8
                    </Button>
                    <Button
                      variant={JSON.stringify(formData.gradeRange) === JSON.stringify([7, 8]) ? "default" : "outline"}
                      onClick={() => setFormData({...formData, gradeRange: [7, 8]})}
                      className="text-sm"
                    >
                      Grades 7-8
                    </Button>
                    <Button
                      variant={JSON.stringify(formData.gradeRange) === JSON.stringify([6, 7]) ? "default" : "outline"}
                      onClick={() => setFormData({...formData, gradeRange: [6, 7]})}
                      className="text-sm"
                    >
                      Grades 6-7
                    </Button>
                    <Button
                      variant={JSON.stringify(formData.gradeRange) === JSON.stringify([8]) ? "default" : "outline"}
                      onClick={() => setFormData({...formData, gradeRange: [8]})}
                      className="text-sm"
                    >
                      Grade 8 Only
                    </Button>
                  </div>
                  {JSON.stringify(formData.gradeRange) === JSON.stringify([6, 7, 8]) && (
                    <div className="text-sm text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      Note: Grade 6 data may be limited in current database
                    </div>
                  )}
                </div>

                {/* Total Days */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    Total Instructional Days: {formData.totalDays}
                  </Label>
                  <input
                    type="range"
                    min="120"
                    max="200"
                    step="10"
                    value={formData.totalDays}
                    onChange={(e) => setFormData({...formData, totalDays: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>120 (Compressed)</span>
                    <span>200 (Extended)</span>
                  </div>
                </div>

                {/* Major Work Focus */}
                <div className="space-y-3">
                  <Label className="text-base font-medium text-white">
                    Major Work Focus: {formData.majorWorkFocus}%
                  </Label>
                  <input
                    type="range"
                    min="65"
                    max="95"
                    step="5"
                    value={formData.majorWorkFocus}
                    onChange={(e) => setFormData({...formData, majorWorkFocus: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>65% (Balanced)</span>
                    <span>95% (Major Only)</span>
                  </div>
                </div>

                {/* Prerequisites */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="prerequisites"
                      checked={formData.includePrerequisites}
                      onChange={(e) => setFormData({...formData, includePrerequisites: e.target.checked})}
                      className="rounded border-slate-600 bg-slate-700"
                    />
                    <Label htmlFor="prerequisites" className="text-white">
                      Include Prerequisite Support
                    </Label>
                  </div>
                  <p className="text-sm text-slate-400">
                    Add additional time for reviewing prerequisite skills
                  </p>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Generate Pacing Guide
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {error && (
              <Card className="bg-red-900/50 border-red-500 mb-6">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-200">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {results && (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Pacing Guide Summary</CardTitle>
                    <CardDescription className="text-slate-300">
                      Generated on {new Date(results.metadata.generatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
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
                    
                    <div className="flex gap-2 mb-4">
                      <Button onClick={handleDownloadCSV} variant="outline" size="sm">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Export CSV
                      </Button>
                      <Button onClick={handleDownloadPDF} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                      </Button>
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
                  </CardContent>
                </Card>

                {/* Lessons List */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Lesson Sequence</CardTitle>
                    <CardDescription className="text-slate-300">
                      Optimized sequence for {results.metadata.targetPopulation} students
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                #{lesson.sequenceNumber}
                              </Badge>
                              <Badge variant={lesson.majorWork ? "default" : "outline"} className="text-xs">
                                Grade {lesson.grade}
                              </Badge>
                              {lesson.lessonNumber && (
                                <Badge variant="outline" className="text-xs">
                                  Lesson {lesson.lessonNumber}
                                </Badge>
                              )}
                              {lesson.majorWork && (
                                <Badge className="text-xs bg-purple-600">
                                  Major Work
                                </Badge>
                              )}
                              {lesson.isAdvanced && (
                                <Badge className="text-xs bg-amber-600">
                                  Advanced
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-medium text-white mb-1">{lesson.title}</h3>
                            {lesson.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {lesson.tags.map(tag => (
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
                  </CardContent>
                </Card>
              </div>
            )}

            {!results && !loading && (
              <Card className="bg-slate-800 border-slate-700 h-96 flex items-center justify-center">
                <CardContent>
                  <div className="text-center text-slate-400">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Configure your parameters and click "Generate Pacing Guide" to begin</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
