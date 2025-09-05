'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { AccessiblePacingForm } from '@/components/pacing/AccessiblePacingForm';
import { PacingGuideResults } from '@/components/pacing/PacingGuideResults';
import { 
  PacingGuideRequest, 
  PacingGuideResponse, 
  GeneratedPacingGuide 
} from '@/lib/enhanced-ai-service';

export default function PacingGeneratorPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'results'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [availableGrades, setAvailableGrades] = useState<string[]>(['6', '7', '8']);
  const [pacingGuide, setPacingGuide] = useState<GeneratedPacingGuide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [announcements, setAnnouncements] = useState<string>('');

  // Load available grades on component mount
  useEffect(() => {
    const loadAvailableGrades = async () => {
      try {
        // This would normally fetch from an API that queries the database
        // For now, we'll use the hardcoded grades
        setAvailableGrades(['6', '7', '8']);
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
      console.log('📊 API Response data:', data);

      if (!response.ok) {
        console.error('❌ API Error:', data.error);
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.success || !data.pacingGuide) {
        console.error('❌ Generation failed:', data.error);
        throw new Error(data.error || 'Failed to generate pacing guide');
      }

      console.log('✅ Pacing guide generated successfully!');
      console.log('📋 Generated guide structure:', {
        overview: data.pacingGuide.overview,
        weeklyScheduleLength: data.pacingGuide.weeklySchedule?.length || 0,
        assessmentPlan: !!data.pacingGuide.assessmentPlan,
        differentiationStrategiesCount: data.pacingGuide.differentiationStrategies?.length || 0,
        flexibilityOptionsCount: data.pacingGuide.flexibilityOptions?.length || 0,
        standardsAlignmentCount: data.pacingGuide.standardsAlignment?.length || 0
      });

      setPacingGuide(data.pacingGuide);
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
          // Convert weekly schedule to CSV
          const csvHeaders = ['Week', 'Unit', 'Lessons', 'Standards', 'Assessment Type'];
          const csvRows = pacingGuide.weeklySchedule.map(week => [
            week.week.toString(),
            week.unit,
            week.lessons.join('; '),
            week.focusStandards.join('; '),
            week.assessmentType || 'None'
          ]);
          
          const csvContent = [csvHeaders, ...csvRows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
          
          const csvBlob = new Blob([csvContent], { type: 'text/csv' });
          const csvUrl = URL.createObjectURL(csvBlob);
          const csvLink = document.createElement('a');
          csvLink.href = csvUrl;
          csvLink.download = `pacing-guide-grade-${pacingGuide.overview.gradeLevel}.csv`;
          csvLink.click();
          URL.revokeObjectURL(csvUrl);
          setAnnouncements('CSV file downloaded');
          break;

        case 'pdf':
          // For PDF, we would typically use a service or library
          // For now, we'll create a simple HTML print version
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Grade ${pacingGuide.overview.gradeLevel} Pacing Guide</title>
                  <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                    .week { border: 1px solid #ccc; margin-bottom: 10px; padding: 10px; }
                    .week-title { font-weight: bold; margin-bottom: 5px; }
                    ul { margin: 5px 0; padding-left: 20px; }
                    @media print { 
                      body { margin: 0; }
                      .week { page-break-inside: avoid; }
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <h1>Grade ${pacingGuide.overview.gradeLevel} Mathematics Pacing Guide</h1>
                    <p>${pacingGuide.overview.timeframe} • ${pacingGuide.overview.totalWeeks} weeks • ${pacingGuide.overview.lessonsPerWeek} lessons/week</p>
                  </div>
                  ${pacingGuide.weeklySchedule.map(week => `
                    <div class="week">
                      <div class="week-title">Week ${week.week}: ${week.unit}</div>
                      <div><strong>Lessons:</strong></div>
                      <ul>${week.lessons.map(lesson => `<li>${lesson}</li>`).join('')}</ul>
                      <div><strong>Focus Standards:</strong> ${week.focusStandards.join(', ')}</div>
                      ${week.assessmentType ? `<div><strong>Assessment:</strong> ${week.assessmentType}</div>` : ''}
                    </div>
                  `).join('')}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.print();
          }
          setAnnouncements('PDF print dialog opened');
          break;
      }
    } catch (error) {
      console.error('Export error:', error);
      setAnnouncements('Export failed. Please try again.');
    }
  }, [pacingGuide]);

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

        {currentStep === 'results' && pacingGuide && (
          <PacingGuideResults
            pacingGuide={pacingGuide}
            onExport={handleExport}
            onModify={handleModifyRequest}
          />
        )}
      </div>
    </div>
  );
}
