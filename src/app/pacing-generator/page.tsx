'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AccessiblePacingForm } from '@/components/pacing/AccessiblePacingForm';
import { PacingGuideResults } from '@/components/pacing/PacingGuideResults';
import { 
  PacingGuideRequest, 
  PacingGuideResponse, 
  GeneratedPacingGuide,
  DetailedLessonGuide
} from '@/lib/enhanced-ai-service';

export default function PacingGeneratorPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [availableGrades, setAvailableGrades] = useState<string[]>(['6', '7', '8', '9']);
  const [pacingGuide, setPacingGuide] = useState<GeneratedPacingGuide | null>(null);
  const [detailedLessonGuide, setDetailedLessonGuide] = useState<DetailedLessonGuide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<string>('');

  // Load available grades on component mount
  useEffect(() => {
    const loadAvailableGrades = async () => {
      try {
        // This would normally fetch from an API that queries the database
        // For now, we'll use the hardcoded grades
        setAvailableGrades(['6', '7', '8', '9']);
        setAnnouncements('Available grades loaded');
      } catch (error) {
        console.error('Error loading available grades:', error);
        setError('Failed to load available grades');
      }
    };

    loadAvailableGrades();
  }, []);

  const handleFormSubmit = useCallback(async (request: PacingGuideRequest) => {
    console.group('🎯 Pacing Guide Generation Started');
    console.log('📝 Request payload:', JSON.stringify(request, null, 2));
    console.log('🔍 Grade configuration:', {
      simple: request.gradeLevel,
      advanced: request.gradeCombination,
      isMultiGrade: (request.gradeCombination?.selectedGrades?.length || 0) > 1
    });
    
    setIsLoading(true);
    setError(null);
    setAnnouncements('Generating your pacing guide...');

    try {
      console.log('🌐 Sending API request to /api/pacing/generate');
      const response = await fetch('/api/pacing/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('📡 API Response status:', response.status, response.statusText);
      
      const data: PacingGuideResponse = await response.json();
      console.log('📊 API Response data:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('❌ API Error:', data.error);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.success || (!data.pacingGuide && !data.detailedLessonGuide)) {
        console.error('❌ Generation failed:', data.error);
        throw new Error(data.error || 'Failed to generate pacing guide');
      }

      console.log('✅ Pacing guide generated successfully!');
      
      if (data.detailedLessonGuide) {
        console.log('� Detailed lesson guide generated:');
        console.log('  🎯 Pathway:', data.detailedLessonGuide.pathway.name);
        console.log('  � Analysis:', Object.keys(data.detailedLessonGuide.analysisResults));
        console.log('  � Lessons:', data.detailedLessonGuide.lessonByLessonBreakdown.length);
        console.log('  � Progression stages:', data.detailedLessonGuide.progressionMap.length);
        
        setDetailedLessonGuide(data.detailedLessonGuide);
        setPacingGuide(null);
      } else if (data.pacingGuide) {
        console.log('� Standard pacing guide generated:');
        console.log('  📖 Overview:', JSON.stringify(data.pacingGuide.overview, null, 2));
        console.log('  📅 Weekly Schedule Count:', data.pacingGuide.weeklySchedule?.length || 0);
        console.log('  � Assessment Plan:', JSON.stringify(data.pacingGuide.assessmentPlan, null, 2));
        
        // Check for empty content issues
        if (!data.pacingGuide.weeklySchedule || data.pacingGuide.weeklySchedule.length === 0) {
          console.error('🚨 CRITICAL PROBLEM: weeklySchedule is empty or undefined!');
        } else {
          console.log('✅ Weekly schedule contains', data.pacingGuide.weeklySchedule.length, 'weeks of content');
        }
        
        setPacingGuide(data.pacingGuide);
        setDetailedLessonGuide(null);
      }
      setCurrentStep('results');
      setAnnouncements('Pacing guide generated successfully');
      
    } catch (error) {
      console.error('💥 Error generating pacing guide:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      setAnnouncements(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      console.groupEnd();
    }
  }, []);

  const handleModifyRequest = useCallback(() => {
    setCurrentStep('form');
    setPacingGuide(null);
    setDetailedLessonGuide(null);
    setError(null);
    setAnnouncements('Returned to form to modify parameters');
  }, []);

  const handleExport = useCallback(async (format: 'pdf' | 'csv' | 'json') => {
    if (!pacingGuide) return;

    setAnnouncements(`Preparing ${format.toUpperCase()} export...`);

    try {
      switch (format) {
        case 'json':
          // Download as JSON
          const jsonBlob = new Blob([JSON.stringify(pacingGuide, null, 2)], {
            type: 'application/json'
          });
          const jsonUrl = URL.createObjectURL(jsonBlob);
          const jsonLink = document.createElement('a');
          jsonLink.href = jsonUrl;
          jsonLink.download = `pacing-guide-grade-${pacingGuide.overview.gradeLevel}.json`;
          jsonLink.click();
          URL.revokeObjectURL(jsonUrl);
          setAnnouncements('JSON file downloaded');
          break;

        case 'csv':
          // Convert weekly schedule to optimized CSV for Excel/Google Sheets
          
          // Helper function to escape CSV content
          const escapeCSV = (text: string) => {
            if (!text) return '';
            return `"${text.replace(/"/g, '""')}"`;
          };

          // Create summary header rows
          const summaryRows = [
            ['PACING GUIDE SUMMARY', '', '', '', '', '', '', ''],
            ['Grade Level:', pacingGuide.overview.gradeLevel, '', '', '', '', '', ''],
            ['Timeframe:', pacingGuide.overview.timeframe, '', '', '', '', '', ''],
            ['Total Weeks:', pacingGuide.overview.totalWeeks?.toString() || 'N/A', '', '', '', '', '', ''],
            ['Generated:', new Date().toLocaleDateString(), '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''], // Empty row for spacing
          ];

          // Add explanation section if available
          if (pacingGuide.explanation) {
            summaryRows.push(
              ['CURRICULUM DESIGN EXPLANATION', '', '', '', '', '', '', ''],
              ['', '', '', '', '', '', '', '']
            );
            
            // Split explanation into readable chunks for CSV
            const explanationChunks = pacingGuide.explanation.match(/.{1,100}(\s|$)/g) || [pacingGuide.explanation];
            explanationChunks.forEach(chunk => {
              summaryRows.push([chunk.trim(), '', '', '', '', '', '', '']);
            });
            
            summaryRows.push(['', '', '', '', '', '', '', '']); // Empty row for spacing
          }

          // Optimized headers for better spreadsheet layout
          const csvHeaders = [
            'Week', 
            'Unit/Topic', 
            'Lesson Title', 
            'Session Flow', 
            'Duration', 
            'Complexity', 
            'Key Standards', 
            'Assessment'
          ];
          
          // Transform data for better spreadsheet compatibility
          const csvRows: string[][] = [];
          
          pacingGuide.weeklySchedule.forEach(week => {
            if (week.sessionDetails && week.sessionDetails.length > 0) {
              // If there are session details, create separate rows for each lesson
              week.sessionDetails.forEach((session, index) => {
                csvRows.push([
                  index === 0 ? week.week.toString() : '', // Only show week number on first row
                  index === 0 ? week.unit : '', // Only show unit on first row
                  session.lesson || week.lessons[index] || 'N/A',
                  session.sessions ? session.sessions.join(' → ') : 'N/A',
                  session.duration || 'N/A',
                  session.complexity || 'medium',
                  index === 0 ? week.focusStandards.slice(0, 2).join('; ') : '', // Limit standards for readability
                  index === 0 ? (week.assessmentType || 'None') : ''
                ]);
              });
            } else {
              // Fallback for weeks without session details
              week.lessons.forEach((lesson, index) => {
                csvRows.push([
                  index === 0 ? week.week.toString() : '',
                  index === 0 ? week.unit : '',
                  lesson,
                  'Standard lesson format',
                  '1 day',
                  'medium',
                  index === 0 ? week.focusStandards.slice(0, 2).join('; ') : '',
                  index === 0 ? (week.assessmentType || 'None') : ''
                ]);
              });
            }
          });

          // Combine all content
          const allRows = [
            ...summaryRows,
            csvHeaders,
            ...csvRows
          ];
          
          // Create properly formatted CSV content with BOM for Excel compatibility
          const csvContent = '\uFEFF' + allRows
            .map(row => row.map(cell => escapeCSV(cell?.toString() || '')).join(','))
            .join('\r\n');
          
          // Create and download the file
          const csvBlob = new Blob([csvContent], { 
            type: 'text/csv;charset=utf-8;' 
          });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement('a');
          csvLink.href = csvUrl;
          csvLink.download = `pacing-guide-grade-${pacingGuide.overview.gradeLevel}-detailed.csv`;
          csvLink.click();
          URL.revokeObjectURL(csvUrl);
          setAnnouncements('Enhanced CSV file downloaded - optimized for Excel and Google Sheets printing');
          break;

        case 'pdf':
          // Create a blob-based HTML document for better compatibility
          const htmlContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <title>Grade ${pacingGuide.overview.gradeLevel} Pacing Guide</title>
                <meta charset="UTF-8">
                <style>
                  body { 
                    font-family: Arial, sans-serif; 
                    margin: 20px; 
                    line-height: 1.4;
                    color: #333;
                  }
                  .header { 
                    border-bottom: 2px solid #000; 
                    padding-bottom: 15px; 
                    margin-bottom: 25px; 
                    text-align: center;
                  }
                  .header h1 { margin: 0 0 10px 0; font-size: 24px; }
                  .header p { margin: 0; color: #666; font-size: 14px; }
                  .week { 
                    border: 1px solid #ddd; 
                    margin-bottom: 15px; 
                    padding: 15px; 
                    border-radius: 4px;
                    background: #fafafa;
                  }
                  .week-title { 
                    font-weight: bold; 
                    margin-bottom: 10px; 
                    font-size: 16px;
                    color: #2563eb;
                  }
                  .section { margin-bottom: 8px; }
                  .section strong { color: #374151; }
                  ul { margin: 5px 0; padding-left: 20px; }
                  li { margin-bottom: 3px; }
                  .explanation { 
                    background: #f8fafc; 
                    border: 1px solid #e2e8f0;
                    padding: 20px; 
                    margin: 20px 0; 
                    border-radius: 6px;
                    line-height: 1.6;
                  }
                  .explanation h3 { 
                    margin: 0 0 12px 0; 
                    color: #1e40af; 
                    font-size: 16px;
                  }
                  .explanation p { 
                    margin: 0; 
                    color: #475569; 
                    font-size: 13px;
                  }
                  .session-detail { 
                    background: #e0f2fe; 
                    padding: 8px; 
                    margin: 5px 0; 
                    border-radius: 3px;
                    font-size: 13px;
                  }
                  @media print { 
                    body { margin: 15px; font-size: 12px; }
                    .week { 
                      page-break-inside: avoid; 
                      border: 1px solid #333;
                      background: #fff;
                      margin-bottom: 10px;
                    }
                    .header { page-break-after: avoid; }
                    .session-detail { background: #f5f5f5; }
                  }
                </style>
              </head>
              <body>
                <div class="header">
                  <h1>Grade ${pacingGuide.overview.gradeLevel} Mathematics Pacing Guide</h1>
                  <p>${pacingGuide.overview.timeframe} • ${pacingGuide.overview.totalWeeks} weeks • ${pacingGuide.overview.lessonsPerWeek} lessons/week</p>
                  <p>Generated: ${new Date().toLocaleDateString()}</p>
                </div>
                
                ${pacingGuide.explanation ? `
                  <div class="explanation">
                    <h3>Curriculum Design Rationale</h3>
                    <p>${pacingGuide.explanation}</p>
                  </div>
                ` : ''}
                
                ${pacingGuide.weeklySchedule.map(week => `
                  <div class="week">
                    <div class="week-title">Week ${week.week}: ${week.unit}</div>
                    
                    <div class="section">
                      <strong>Lessons:</strong>
                      <ul>${week.lessons.map(lesson => `<li>${lesson}</li>`).join('')}</ul>
                    </div>
                    
                    ${week.sessionDetails && week.sessionDetails.length > 0 ? `
                      <div class="section">
                        <strong>Session Details:</strong>
                        ${week.sessionDetails.map(session => `
                          <div class="session-detail">
                            <strong>${session.lesson}:</strong> 
                            ${session.sessions ? session.sessions.join(' → ') : 'Sessions not specified'} 
                            (${session.duration || 'Duration not specified'}, 
                            ${session.complexity || 'medium'} complexity)
                          </div>
                        `).join('')}
                      </div>
                    ` : ''}
                    
                    <div class="section">
                      <strong>Focus Standards:</strong> ${week.focusStandards.join(', ')}
                    </div>
                    
                    ${week.assessmentType ? `
                      <div class="section">
                        <strong>Assessment:</strong> ${week.assessmentType}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </body>
            </html>
          `;

          // Create blob and open in new window for printing
          const blob = new Blob([htmlContent], { type: 'text/html' });
          const url = URL.createObjectURL(blob);
          
          try {
            const printWindow = window.open(url, '_blank');
            if (printWindow) {
              // Wait for content to load then trigger print
              printWindow.onload = () => {
                setTimeout(() => {
                  printWindow.print();
                  // Clean up the URL after printing
                  setTimeout(() => {
                    printWindow.close();
                    URL.revokeObjectURL(url);
                  }, 1000);
                }, 500);
              };
              setAnnouncements('PDF print dialog opened - content optimized for printing');
            } else {
              URL.revokeObjectURL(url);
              setAnnouncements('Unable to open print window. Please check popup blockers.');
            }
          } catch (error) {
            URL.revokeObjectURL(url);
            console.error('Print error:', error);
            setAnnouncements('Print failed. You can use CSV export as an alternative.');
          }
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      setAnnouncements('Export failed. Please try again.');
    }
  }, [pacingGuide, detailedLessonGuide]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            🤖 Dynamic Pacing Guide Generator
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Create customized mathematics pacing guides with curriculum intelligence
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center space-x-8">
              <li className={`flex items-center ${currentStep === 'form' ? 'text-blue-600' : 'text-green-600'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === 'form' 
                    ? 'border-blue-600 bg-white' 
                    : 'border-green-600 bg-green-600 text-white'
                }`}>
                  {currentStep === 'results' ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    '1'
                  )}
                </div>
                <span className="ml-2 text-sm font-medium">Configure</span>
              </li>
              
              <div className={`flex-auto border-t-2 ${currentStep === 'results' ? 'border-green-600' : 'border-gray-300'}`} />
              
              <li className={`flex items-center ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-500'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep === 'results' 
                    ? 'border-blue-600 bg-white' 
                    : 'border-gray-300 bg-white'
                }`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Review Results</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Generating Pacing Guide
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setError(null);
                        setAnnouncements('Error dismissed');
                      }}
                      className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {currentStep === 'form' && (
          <AccessiblePacingForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            availableGrades={availableGrades}
          />
        )}

        {currentStep === 'results' && (pacingGuide || detailedLessonGuide) && (
          <PacingGuideResults
            pacingGuide={pacingGuide || undefined}
            detailedLessonGuide={detailedLessonGuide || undefined}
            onExport={handleExport}
            onModify={handleModifyRequest}
          />
        )}
      </div>
    </div>
  );
}
