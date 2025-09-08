'use client';

import React, { useState, useCallback, useRef } from 'react';
import { PacingGuideRequest } from '@/lib/enhanced-ai-service';

interface AccessiblePacingFormProps {
  onSubmit: (request: PacingGuideRequest) => Promise<void>;
  isLoading: boolean;
  availableGrades: string[];
}

export function AccessiblePacingForm({ 
  onSubmit, 
  isLoading, 
  availableGrades 
}: AccessiblePacingFormProps) {
  const [formData, setFormData] = useState<PacingGuideRequest>({
    gradeLevel: '',
    gradeCombination: {
      selectedGrades: [],
      pathwayType: 'sequential',
      skipGrades: [],
      emphasis: 'balanced'
    },
    timeframe: 'year',
    studentPopulation: '',
    scheduleConstraints: {
      daysPerWeek: 5,
      minutesPerClass: 50,
      specialEvents: []
    },
    differentiationNeeds: []
  });

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [announcements, setAnnouncements] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate grade selection (either simple or advanced mode)
    if (!formData.gradeLevel && (!formData.gradeCombination?.selectedGrades || formData.gradeCombination.selectedGrades.length === 0)) {
      newErrors.gradeLevel = 'Please select at least one grade level';
    }

    // Advanced validation for multi-grade combinations
    if (isAdvancedMode && formData.gradeCombination?.selectedGrades) {
      const selectedGrades = formData.gradeCombination.selectedGrades;
      
      if (selectedGrades.length > 4) {
        newErrors.gradeLevel = 'Please select no more than 4 grade levels for optimal pacing';
      }
      
      if (selectedGrades.length > 1) {
        // Check for pedagogically challenging combinations
        const gradeNumbers = selectedGrades.map(g => parseInt(g)).sort();
        const maxGap = Math.max(...gradeNumbers) - Math.min(...gradeNumbers);
        
        if (maxGap > 3) {
          newErrors.gradeLevel = 'Grade combinations with gaps larger than 3 years may require additional considerations';
        }
      }
    }

    if (!formData.timeframe) {
      newErrors.timeframe = 'Please specify the timeframe';
    }

    if (!formData.studentPopulation) {
      newErrors.studentPopulation = 'Please describe the student population';
    }

    if (formData.scheduleConstraints?.daysPerWeek && 
        (formData.scheduleConstraints.daysPerWeek < 1 || formData.scheduleConstraints.daysPerWeek > 7)) {
      newErrors.daysPerWeek = 'Days per week must be between 1 and 7';
    }

    if (formData.scheduleConstraints?.minutesPerClass && 
        formData.scheduleConstraints.minutesPerClass < 10) {
      newErrors.minutesPerClass = 'Class time must be at least 10 minutes';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setAnnouncements(`Form has ${Object.keys(newErrors).length} error${Object.keys(newErrors).length > 1 ? 's' : ''}. Please review and correct.`);
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = formRef.current?.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
      errorElement?.focus();
      return;
    }

    setAnnouncements('Generating pacing guide...');
    
    try {
      await onSubmit(formData);
      setAnnouncements('Pacing guide generated successfully');
    } catch (error) {
      setAnnouncements('Error generating pacing guide. Please try again.');
    }
  }, [formData, validateForm, onSubmit, errors]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parentField, childField] = field.split('.');
        const parentValue = prev[parentField as keyof PacingGuideRequest] as Record<string, any>;
        return {
          ...prev,
          [parentField]: {
            ...(parentValue || {}),
            [childField]: value
          }
        };
      }
      return { ...prev, [field]: value };
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleDifferentiationChange = useCallback((need: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      differentiationNeeds: checked 
        ? [...(prev.differentiationNeeds || []), need]
        : (prev.differentiationNeeds || []).filter(n => n !== need)
    }));
  }, []);

  const differentiationOptions = [
    'English Language Learners',
    'Students with disabilities',
    'Gifted and talented',
    'Below grade level',
    'Intervention support',
    'Advanced learners'
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg text-gray-900">
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="sr-only"
      >
        {announcements}
      </div>

      <form 
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-8"
        noValidate
        aria-label="Dynamic Pacing Guide Generator Form"
      >
        <div className="form-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create Your Pacing Guide
          </h2>
          <p className="text-gray-600 mb-8">
            Generate a customized mathematics pacing guide based on your curriculum standards and student needs.
          </p>
        </div>

        {/* Basic Information */}
        <fieldset className="space-y-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </legend>

          {/* Grade Selection - Enhanced with Multi-Grade Support */}
          <div className="form-group">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-gray-700">
                Grade Level Configuration *
              </label>
              <button
                type="button"
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-pressed={isAdvancedMode}
              >
                {isAdvancedMode ? 'Simple Mode' : 'Advanced Combinations'}
              </button>
            </div>

            {!isAdvancedMode ? (
              // Simple single grade selection
              <div>
                <label htmlFor="gradeLevel" className="block text-sm text-gray-600 mb-2">
                  Single Grade Level
                </label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => {
                    handleFieldChange('gradeLevel', e.target.value);
                    // Clear advanced settings when using simple mode
                    handleFieldChange('gradeCombination', {
                      selectedGrades: [e.target.value],
                      pathwayType: 'sequential',
                      skipGrades: [],
                      emphasis: 'balanced'
                    });
                  }}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.gradeLevel ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-required="true"
                  aria-invalid={!!errors.gradeLevel}
                  aria-describedby={errors.gradeLevel ? 'gradeLevel-error' : undefined}
                >
                  <option value="">Select a grade level</option>
                  {availableGrades.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>
            ) : (
              // Advanced multi-grade combination interface
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Select Grade Levels to Combine
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {availableGrades.map(grade => (
                      <label key={grade} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.gradeCombination?.selectedGrades?.includes(grade) || false}
                          onChange={(e) => {
                            const currentGrades = formData.gradeCombination?.selectedGrades || [];
                            const newGrades = e.target.checked
                              ? [...currentGrades, grade]
                              : currentGrades.filter(g => g !== grade);
                            
                            handleFieldChange('gradeCombination', {
                              ...formData.gradeCombination,
                              selectedGrades: newGrades
                            });
                            
                            // Update the legacy gradeLevel field for backwards compatibility
                            handleFieldChange('gradeLevel', newGrades.join('+'));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Grade {grade}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="pathwayType" className="block text-sm text-gray-600 mb-2">
                    Pathway Type
                  </label>
                  <select
                    id="pathwayType"
                    value={formData.gradeCombination?.pathwayType || 'sequential'}
                    onChange={(e) => handleFieldChange('gradeCombination', {
                      ...formData.gradeCombination,
                      pathwayType: e.target.value as 'sequential' | 'accelerated' | 'combined' | 'custom'
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="sequential">Sequential (Normal Progression)</option>
                    <option value="accelerated">Accelerated (Compressed Timeline)</option>
                    <option value="combined">Combined (Merged Scope & Sequence)</option>
                    <option value="custom">Custom (AI-Optimized Pathway)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="emphasis" className="block text-sm text-gray-600 mb-2">
                    Curriculum Emphasis
                  </label>
                  <select
                    id="emphasis"
                    value={formData.gradeCombination?.emphasis || 'balanced'}
                    onChange={(e) => handleFieldChange('gradeCombination', {
                      ...formData.gradeCombination,
                      emphasis: e.target.value as 'balanced' | 'foundational' | 'advanced'
                    })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="balanced">Balanced Coverage</option>
                    <option value="foundational">Foundational Focus (Ensure Prerequisites)</option>
                    <option value="advanced">Advanced Focus (Challenge & Acceleration)</option>
                  </select>
                </div>

                {formData.gradeCombination?.selectedGrades && formData.gradeCombination.selectedGrades.length > 0 && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-700">
                      🎯 <strong>Selected Pathway:</strong> {formData.gradeCombination.selectedGrades.join(' + ')} | 
                      {formData.gradeCombination.pathwayType} | {formData.gradeCombination.emphasis}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      AI will analyze prerequisites and create an optimal sequence for this grade combination.
                    </p>
                  </div>
                )}
              </div>
            )}

            {errors.gradeLevel && (
              <p id="gradeLevel-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.gradeLevel}
              </p>
            )}
          </div>

          <div className="form-group">
            <label 
              htmlFor="timeframe" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Timeframe *
            </label>
            <select
              id="timeframe"
              name="timeframe"
              value={formData.timeframe}
              onChange={(e) => handleFieldChange('timeframe', e.target.value)}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.timeframe ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-required="true"
              aria-invalid={!!errors.timeframe}
              aria-describedby={errors.timeframe ? 'timeframe-error' : undefined}
            >
              <option value="">Select timeframe</option>
              <option value="quarter">Quarter (9 weeks)</option>
              <option value="semester">Semester (18 weeks)</option>
              <option value="trimester">Trimester (12 weeks)</option>
              <option value="year">Full Year (36 weeks)</option>
            </select>
            {errors.timeframe && (
              <p id="timeframe-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.timeframe}
              </p>
            )}
          </div>

          <div className="form-group">
            <label 
              htmlFor="studentPopulation" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Student Population *
            </label>
            <textarea
              id="studentPopulation"
              name="studentPopulation"
              value={formData.studentPopulation}
              onChange={(e) => handleFieldChange('studentPopulation', e.target.value)}
              rows={3}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.studentPopulation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your student population (e.g., 'General education students with mixed ability levels', 'Accelerated program', 'Intervention support needed')"
              aria-required="true"
              aria-invalid={!!errors.studentPopulation}
              aria-describedby={errors.studentPopulation ? 'studentPopulation-error' : 'studentPopulation-help'}
            />
            <p id="studentPopulation-help" className="mt-1 text-sm text-gray-500">
              Include information about ability levels, special programs, or support needs.
            </p>
            {errors.studentPopulation && (
              <p id="studentPopulation-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.studentPopulation}
              </p>
            )}
          </div>
        </fieldset>

        {/* Schedule Constraints */}
        <fieldset className="space-y-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">
            Schedule Constraints
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label 
                htmlFor="daysPerWeek" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Days per Week
              </label>
              <input
                type="number"
                id="daysPerWeek"
                name="daysPerWeek"
                min="1"
                max="7"
                value={formData.scheduleConstraints?.daysPerWeek || 5}
                onChange={(e) => handleFieldChange('scheduleConstraints.daysPerWeek', parseInt(e.target.value))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.daysPerWeek ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.daysPerWeek}
                aria-describedby={errors.daysPerWeek ? 'daysPerWeek-error' : undefined}
              />
              {errors.daysPerWeek && (
                <p id="daysPerWeek-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.daysPerWeek}
                </p>
              )}
            </div>

            <div className="form-group">
              <label 
                htmlFor="minutesPerClass" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Minutes per Class
              </label>
              <input
                type="number"
                id="minutesPerClass"
                name="minutesPerClass"
                min="10"
                max="180"
                value={formData.scheduleConstraints?.minutesPerClass || 50}
                onChange={(e) => handleFieldChange('scheduleConstraints.minutesPerClass', parseInt(e.target.value))}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.minutesPerClass ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.minutesPerClass}
                aria-describedby={errors.minutesPerClass ? 'minutesPerClass-error' : undefined}
              />
              {errors.minutesPerClass && (
                <p id="minutesPerClass-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.minutesPerClass}
                </p>
              )}
            </div>
          </div>
        </fieldset>

        {/* Differentiation Needs */}
        <fieldset className="space-y-6">
          <legend className="text-lg font-semibold text-gray-900 mb-4">
            Differentiation Needs (Optional)
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {differentiationOptions.map((need) => (
              <label key={need} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(formData.differentiationNeeds || []).includes(need)}
                  onChange={(e) => handleDifferentiationChange(need, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{need}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
            aria-describedby="submit-help"
          >
            {isLoading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Pacing Guide...
              </>
            ) : (
              'Generate Pacing Guide'
            )}
          </button>
          <p id="submit-help" className="mt-2 text-sm text-gray-500 text-center">
            This will generate a customized pacing guide based on your curriculum and requirements.
          </p>
        </div>
      </form>
    </div>
  );
}
