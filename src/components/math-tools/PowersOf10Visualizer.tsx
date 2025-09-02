'use client';

import React, { useState } from 'react';

interface PowersOf10VisualizerProps {
  number: number;
  className?: string;
  showAnimation?: boolean;
}

interface PowerBreakdown {
  digit: number;
  power: number;
  value: number;
  place: string;
}

export default function PowersOf10Visualizer({ 
  number, 
  className = '', 
  showAnimation = true 
}: PowersOf10VisualizerProps) {
  const [showExpanded, setShowExpanded] = useState(false);
  
  // Break down number into powers of 10
  const breakdownNumber = (num: number): PowerBreakdown[] => {
    const str = num.toString();
    const breakdown: PowerBreakdown[] = [];
    const places = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
    
    for (let i = 0; i < str.length; i++) {
      const digit = parseInt(str[i]);
      if (digit !== 0) {
        const power = str.length - i - 1;
        const value = digit * Math.pow(10, power);
        breakdown.push({
          digit,
          power,
          value,
          place: places[power] || `10^${power} place`
        });
      }
    }
    
    return breakdown;
  };

  const breakdown = breakdownNumber(number);

  return (
    <div className={`powers-of-10-visualizer bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🔢 Powers of 10 Breakdown
        </h3>
        <div className="text-center">
          <span className="text-3xl font-bold text-indigo-600">{number.toLocaleString()}</span>
        </div>
      </div>

      {/* Visual Blocks Representation */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Visual Block Model:</h4>
        <div className="grid gap-3">
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              {/* Visual blocks */}
              <div className="flex gap-1">
                {Array.from({ length: item.digit }, (_, i) => (
                  <div 
                    key={i} 
                    className={`
                      w-12 h-8 rounded border-2 border-indigo-300 flex items-center justify-center text-xs font-bold
                      ${item.power >= 3 ? 'bg-red-200 text-red-800' : 
                        item.power === 2 ? 'bg-yellow-200 text-yellow-800' : 
                        item.power === 1 ? 'bg-green-200 text-green-800' : 
                        'bg-blue-200 text-blue-800'}
                      ${showAnimation ? 'animate-pulse' : ''}
                    `}
                    title={`${item.place} block`}
                  >
                    10^{item.power}
                  </div>
                ))}
              </div>
              
              {/* Explanation */}
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-bold text-gray-800">{item.digit}</span> × 
                  <span className="font-bold text-indigo-600"> 10^{item.power}</span> = 
                  <span className="font-bold text-green-600"> {item.value.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {item.digit} {item.place} block{item.digit !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Form Toggle */}
      <div className="border-t pt-4">
        <button 
          onClick={() => setShowExpanded(!showExpanded)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition-colors"
        >
          {showExpanded ? 'Hide' : 'Show'} Expanded Form
        </button>
        
        {showExpanded && (
          <div className="mt-4 p-4 bg-white rounded border">
            <h4 className="font-semibold text-gray-700 mb-2">Expanded Form:</h4>
            <div className="text-lg text-center">
              <span className="font-bold text-indigo-600">{number.toLocaleString()}</span>
              <span className="mx-3">=</span>
              {breakdown.map((item, index) => (
                <span key={index}>
                  <span className="text-gray-800">{item.digit}</span>
                  <span className="text-indigo-600"> × 10^{item.power}</span>
                  {index < breakdown.length - 1 && <span className="text-gray-500"> + </span>}
                </span>
              ))}
            </div>
            
            <div className="text-sm text-center mt-2 text-gray-600">
              {breakdown.map((item, index) => (
                <span key={index}>
                  {item.value.toLocaleString()}
                  {index < breakdown.length - 1 && <span> + </span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 <strong>Tip:</strong> Each color represents a different power of 10!
      </div>
    </div>
  );
}

// Utility function to create powers of 10 visualizer from AI prompt
export function createPowersOf10Visual(numberStr: string) {
  const number = parseInt(numberStr.replace(/[,\s]/g, ''));
  if (isNaN(number)) return null;
  
  return <PowersOf10Visualizer number={number} showAnimation={true} />;
}
