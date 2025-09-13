'use client';

import React from 'react';

interface VisualizationContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  compact?: boolean;
}

export default function VisualizationContainer({
  children,
  title,
  description,
  className = '',
  compact = false
}: VisualizationContainerProps) {
  return (
    <div className={`visualization-container my-6 ${className}`}>
      {/* Header if title provided */}
      {title && (
        <div className="mb-4">
          <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 mt-1 ml-6">{description}</p>
          )}
        </div>
      )}

      {/* Content area with modern styling */}
      <div className={`
        bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden
        ${compact ? 'p-4' : 'p-6'}
        hover:shadow-xl transition-all duration-300
        ${!compact ? 'transform hover:scale-[1.01]' : ''}
      `}>
        {children}
      </div>
    </div>
  );
}

// Specialized wrapper for multiple visualizations
export function MultiVisualizationContainer({
  children,
  title = "Interactive Visualizations",
  className = ''
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <div className={`multi-visualization-container my-8 ${className}`}>
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-6 shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">📊</span>
            </div>
            {title}
          </h3>
        </div>
        
        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
