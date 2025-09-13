'use client';

import React, { useState } from 'react';

interface NumberLineVisualizerProps {
  min?: number;
  max?: number;
  step?: number;
  highlightNumbers?: number[];
  fractionLabels?: Record<number, string>;
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
  fractionLabels = {},
  showFractions = false,
  showNegatives = false,
  className = '',
  title = 'Number Line'
}: NumberLineVisualizerProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  // Generate clean tick marks - only integers and highlighted numbers
  const ticks: number[] = [];
  
  // Add integer tick marks
  for (let i = Math.ceil(min); i <= Math.floor(max); i++) {
    ticks.push(i);
  }
  
  // Add highlighted numbers (these are our main fractions)
  highlightNumbers.forEach(num => {
    if (!ticks.includes(num) && num >= min && num <= max) {
      ticks.push(num);
    }
  });
  
  // Sort all ticks
  ticks.sort((a, b) => a - b);

  const getTickPosition = (value: number) => {
    const range = max - min;
    const position = ((value - min) / range) * 100;
    return Math.max(5, Math.min(95, position)); // Keep away from edges
  };

  return (
    <div className={`number-line-visualizer relative overflow-hidden ${className}`}>
      {/* Modern Card Design */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              📏
            </div>
            {title}
          </h3>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Selection Display */}
          {selectedNumber !== null && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border-l-4 border-indigo-500">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
                <span className="text-2xl font-bold text-indigo-700">
                  Selected: {fractionLabels[selectedNumber] || selectedNumber}
                </span>
                {fractionLabels[selectedNumber] && (
                  <span className="text-lg text-indigo-600 bg-white px-3 py-1 rounded-full">
                    = {selectedNumber}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* NUMBER LINE AREA */}
          <div className="relative mb-8" style={{ height: '140px' }}>
            {/* Background Track */}
            <div className="absolute top-16 left-8 right-8">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full shadow-inner">
                {/* Inner track with gradient */}
                <div className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full shadow-lg"></div>
              </div>
              
              {/* Directional arrows */}
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[12px] border-transparent border-r-indigo-400 drop-shadow"></div>
              </div>
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-l-[12px] border-transparent border-l-pink-400 drop-shadow"></div>
              </div>
            </div>

            {/* TICK MARKS & LABELS */}
            {ticks.map((tick, index) => {
              const position = getTickPosition(tick);
              const isHighlighted = highlightNumbers.includes(tick);
              const isSelected = selectedNumber === tick;
              const isInteger = tick % 1 === 0;
              
              return (
                <div key={index} className="absolute" style={{ left: `${position}%` }}>
                  {/* Tick mark - elegant design */}
                  <div 
                    className={`
                      transform -translate-x-1/2 cursor-pointer transition-all duration-300 rounded-full
                      ${isInteger 
                        ? 'w-2 h-16 bg-gray-700 top-8' 
                        : 'w-1.5 h-12 bg-gray-500 top-10'
                      }
                      ${isHighlighted 
                        ? 'bg-gradient-to-b from-red-400 to-red-600 w-3 shadow-lg scale-110' 
                        : ''
                      }
                      ${isSelected 
                        ? 'bg-gradient-to-b from-blue-400 to-blue-600 w-3 shadow-lg scale-110' 
                        : ''
                      }
                      hover:scale-125 hover:shadow-xl hover:bg-gradient-to-b hover:from-indigo-400 hover:to-indigo-600
                    `}
                    style={{ position: 'absolute' }}
                    onClick={() => setSelectedNumber(tick)}
                  />
                  
                  {/* Label - modern typography */}
                  <div 
                    className={`
                      absolute transform -translate-x-1/2 text-center cursor-pointer
                      transition-all duration-300 select-none min-w-[2.5rem]
                      ${isInteger ? 'top-28 text-lg font-bold' : 'top-26 text-base font-semibold'}
                      ${isHighlighted 
                        ? 'text-red-600 font-bold text-xl bg-red-50 px-3 py-2 rounded-xl border-2 border-red-200 shadow-lg scale-110' 
                        : 'text-gray-700'
                      }
                      ${isSelected 
                        ? 'text-blue-600 font-bold text-xl bg-blue-50 px-3 py-2 rounded-xl border-2 border-blue-200 shadow-lg scale-110' 
                        : ''
                      }
                      hover:text-indigo-600 hover:font-bold hover:bg-indigo-50 hover:px-3 hover:py-2 
                      hover:rounded-xl hover:shadow-lg hover:scale-110
                    `}
                    style={{ top: isInteger ? '112px' : '118px' }}
                    onClick={() => setSelectedNumber(tick)}
                  >
                    {fractionLabels[tick] || tick}
                  </div>
                  
                  {/* Highlight indicator - floating badge */}
                  {isHighlighted && (
                    <div className="absolute top-1 transform -translate-x-1/2 z-10">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* CONTROL BUTTONS - Modern Design */}
          <div className="flex flex-wrap gap-3 justify-center">
            {highlightNumbers.map((num, index) => (
              <button
                key={index}
                onClick={() => setSelectedNumber(num)}
                className="group px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-lg font-semibold 
                          hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl 
                          transform hover:scale-105 hover:-translate-y-1 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full group-hover:animate-pulse"></div>
                  Jump to {fractionLabels[num] || num}
                </span>
              </button>
            ))}
            <button
              onClick={() => setSelectedNumber(null)}
              className="px-5 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl text-lg font-semibold 
                        hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl 
                        transform hover:scale-105 active:scale-95"
            >
              Clear
            </button>
          </div>

          {/* HELPFUL TIP */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-l-4 border-amber-400">
            <div className="flex items-center gap-3 text-amber-800">
              <div className="text-2xl">💡</div>
              <div>
                <strong className="font-semibold">Interactive Tip:</strong> Click on any number to select it and see details!
              </div>
            </div>
          </div>
        </div>
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
