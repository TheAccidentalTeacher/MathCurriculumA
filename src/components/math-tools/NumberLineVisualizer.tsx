'use client';

import React, { useState } from 'react';

interface NumberLineVisualizerProps {
  min?: number;
  max?: number;
  step?: number;
  highlightNumbers?: number[];
  showFractions?: boolean;
  showNegatives?: boolean;
  className?: string;
  title?: string;
}

export default function NumberLineVisualizer({
  min = 0,
  max = 10,
  step = 1,
  highlightNumbers = [],
  showFractions = false,
  showNegatives = false,
  className = '',
  title = 'Number Line'
}: NumberLineVisualizerProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Generate tick marks
  const ticks: number[] = [];
  for (let i = min; i <= max; i += step) {
    ticks.push(i);
    if (showFractions && step >= 1) {
      // Add half-steps for fractions
      if (i + step/2 <= max) {
        ticks.push(i + step/2);
      }
    }
  }

  const getTickPosition = (value: number) => {
    const range = max - min;
    const position = ((value - min) / range) * 100;
    return Math.max(0, Math.min(100, position));
  };

  return (
    <div className={`number-line-visualizer bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          📏 {title}
        </h3>
        {selectedNumber !== null && (
          <div className="text-center p-2 bg-white rounded border">
            <span className="text-lg font-bold text-purple-600">Selected: {selectedNumber}</span>
            {showFractions && selectedNumber % 1 !== 0 && (
              <div className="text-sm text-gray-600">
                Fraction form: {selectedNumber % 1 === 0.5 ? `${Math.floor(selectedNumber)} ½` : selectedNumber}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative mb-6">
        {/* Main line */}
        <div className="relative h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-4">
          {/* Arrow heads */}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-r-[8px] border-transparent border-r-purple-400"></div>
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[8px] border-transparent border-l-pink-400"></div>
        </div>

        {/* Tick marks and labels */}
        {ticks.map((tick, index) => {
          const position = getTickPosition(tick);
          const isHighlighted = highlightNumbers.includes(tick);
          const isSelected = selectedNumber === tick;
          const isFraction = tick % 1 !== 0;
          
          return (
            <div key={index} className="absolute" style={{ left: `calc(${position}% + 16px)` }}>
              {/* Tick mark */}
              <div 
                className={`
                  w-1 bg-gray-700 transform -translate-x-1/2 cursor-pointer transition-all
                  ${isFraction ? 'h-4 -mt-1' : 'h-6 -mt-2'}
                  ${isHighlighted ? 'bg-red-500 w-2' : ''}
                  ${isSelected ? 'bg-blue-500 w-2' : ''}
                  hover:bg-blue-400 hover:w-2
                `}
                onClick={() => setSelectedNumber(tick)}
              />
              
              {/* Label */}
              <div 
                className={`
                  absolute top-6 transform -translate-x-1/2 text-center cursor-pointer
                  ${isFraction ? 'text-xs' : 'text-sm'}
                  ${isHighlighted ? 'text-red-600 font-bold' : 'text-gray-700'}
                  ${isSelected ? 'text-blue-600 font-bold' : ''}
                  hover:text-blue-500
                `}
                onClick={() => setSelectedNumber(tick)}
              >
                {isFraction ? 
                  (tick % 1 === 0.5 ? `${Math.floor(tick)}½` : tick) : 
                  tick}
              </div>
              
              {/* Highlight circle */}
              {isHighlighted && (
                <div className="absolute -top-3 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {highlightNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => setSelectedNumber(num)}
            className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
          >
            Jump to {num}
          </button>
        ))}
        <button
          onClick={() => setSelectedNumber(null)}
          className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 <strong>Tip:</strong> Click on any number to select it and see details!
      </div>
    </div>
  );
}

// Utility functions for different number line types
export function createIntegerNumberLine(min: number, max: number, highlights: number[] = []) {
  return (
    <NumberLineVisualizer 
      min={min} 
      max={max} 
      step={1} 
      highlightNumbers={highlights}
      title="Integer Number Line"
    />
  );
}

export function createFractionNumberLine(min: number, max: number, highlights: number[] = []) {
  return (
    <NumberLineVisualizer 
      min={min} 
      max={max} 
      step={0.5} 
      highlightNumbers={highlights}
      showFractions={true}
      title="Fraction Number Line"
    />
  );
}

export function createNegativeNumberLine(min: number = -10, max: number = 10, highlights: number[] = []) {
  return (
    <NumberLineVisualizer 
      min={min} 
      max={max} 
      step={1} 
      highlightNumbers={highlights}
      showNegatives={true}
      title="Integer Number Line (with Negatives)"
    />
  );
}
