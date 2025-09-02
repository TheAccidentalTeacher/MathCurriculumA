'use client';

import React, { useState } from 'react';

interface FractionVisualizerProps {
  numerator: number;
  denominator: number;
  showEquivalent?: boolean;
  showDecimal?: boolean;
  showPercent?: boolean;
  visualType?: 'circles' | 'rectangles' | 'bars';
  className?: string;
}

export default function FractionVisualizer({
  numerator,
  denominator,
  showEquivalent = true,
  showDecimal = true,
  showPercent = true,
  visualType = 'circles',
  className = ''
}: FractionVisualizerProps) {
  const [hoveredPart, setHoveredPart] = useState<number | null>(null);

  // Calculate values
  const decimal = numerator / denominator;
  const percent = (decimal * 100).toFixed(1);
  
  // Simplify fraction
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const commonDivisor = gcd(Math.abs(numerator), Math.abs(denominator));
  const simplifiedNum = numerator / commonDivisor;
  const simplifiedDen = denominator / commonDivisor;

  const renderCircleVisual = () => {
    const numCircles = Math.ceil(numerator / denominator);
    const circles = [];
    
    for (let circleIndex = 0; circleIndex < Math.max(1, numCircles); circleIndex++) {
      const partsInThisCircle = Math.min(denominator, Math.max(0, numerator - circleIndex * denominator));
      
      circles.push(
        <div key={circleIndex} className="relative">
          <svg width="120" height="120" className="transform rotate-90">
            <circle 
              cx="60" 
              cy="60" 
              r="50" 
              fill="none" 
              stroke="#e5e7eb" 
              strokeWidth="2"
            />
            {Array.from({ length: denominator }, (_, i) => {
              const angle = (360 / denominator) * i;
              const nextAngle = (360 / denominator) * (i + 1);
              const isFilled = i < partsInThisCircle;
              
              const startX = 60 + 50 * Math.cos((angle * Math.PI) / 180);
              const startY = 60 + 50 * Math.sin((angle * Math.PI) / 180);
              const endX = 60 + 50 * Math.cos((nextAngle * Math.PI) / 180);
              const endY = 60 + 50 * Math.sin((nextAngle * Math.PI) / 180);
              
              const largeArcFlag = (nextAngle - angle) > 180 ? 1 : 0;
              
              return (
                <g key={i}>
                  {/* Dividing lines */}
                  <line x1="60" y1="60" x2={startX} y2={startY} stroke="#d1d5db" strokeWidth="1" />
                  
                  {/* Filled sections */}
                  {isFilled && (
                    <path
                      d={`M 60,60 L ${startX},${startY} A 50,50 0 ${largeArcFlag},1 ${endX},${endY} Z`}
                      fill={hoveredPart === i ? "#f59e0b" : "#3b82f6"}
                      opacity="0.7"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredPart(i)}
                      onMouseLeave={() => setHoveredPart(null)}
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
            {circleIndex + 1}
          </div>
        </div>
      );
    }
    
    return <div className="flex gap-4 justify-center flex-wrap">{circles}</div>;
  };

  const renderRectangleVisual = () => {
    const rows = Math.ceil(Math.sqrt(denominator));
    const cols = Math.ceil(denominator / rows);
    
    return (
      <div className="flex justify-center">
        <div 
          className="grid gap-1 p-4 border-2 border-gray-300 rounded-lg bg-white"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: denominator }, (_, i) => (
            <div
              key={i}
              className={`
                w-8 h-8 border border-gray-300 flex items-center justify-center text-xs font-bold
                transition-all duration-200 cursor-pointer
                ${i < numerator 
                  ? (hoveredPart === i ? 'bg-yellow-400' : 'bg-blue-400 text-white') 
                  : 'bg-gray-100 hover:bg-gray-200'
                }
              `}
              onMouseEnter={() => setHoveredPart(i)}
              onMouseLeave={() => setHoveredPart(null)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBarVisual = () => {
    return (
      <div className="flex justify-center">
        <div className="relative w-80 h-12 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
          {/* Denominator divisions */}
          {Array.from({ length: denominator - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-gray-400"
              style={{ left: `${((i + 1) / denominator) * 100}%` }}
            />
          ))}
          
          {/* Filled portion */}
          <div 
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-300"
            style={{ width: `${(numerator / denominator) * 100}%` }}
          />
          
          {/* Section labels */}
          {Array.from({ length: denominator }, (_, i) => (
            <div
              key={i}
              className={`
                absolute top-1/2 transform -translate-y-1/2 text-xs font-bold transition-all duration-200
                ${i < numerator ? 'text-white' : 'text-gray-600'}
              `}
              style={{ 
                left: `${(i / denominator) * 100 + (100 / denominator) / 2}%`,
                transform: 'translateX(-50%) translateY(-50%)'
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderVisual = () => {
    switch (visualType) {
      case 'circles': return renderCircleVisual();
      case 'rectangles': return renderRectangleVisual();
      case 'bars': return renderBarVisual();
      default: return renderCircleVisual();
    }
  };

  return (
    <div className={`fraction-visualizer bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🧮 Fraction Visualizer
        </h3>
        <div className="text-center">
          <span className="text-4xl font-bold text-blue-600">
            <sup>{numerator}</sup>⁄<sub>{denominator}</sub>
          </span>
          {showEquivalent && simplifiedNum !== numerator && (
            <span className="ml-4 text-2xl text-green-600">
              = <sup>{simplifiedNum}</sup>⁄<sub>{simplifiedDen}</sub>
            </span>
          )}
        </div>
      </div>

      <div className="mb-6">
        {renderVisual()}
      </div>

      {/* Visual type selector */}
      <div className="flex justify-center gap-2 mb-4">
        {(['circles', 'rectangles', 'bars'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {}}
            className={`
              px-3 py-1 rounded-full text-sm transition-colors capitalize
              ${visualType === type 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }
            `}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Additional representations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        {showDecimal && (
          <div className="p-3 bg-white rounded border">
            <div className="text-sm text-gray-600">Decimal</div>
            <div className="text-xl font-bold text-purple-600">{decimal.toFixed(3)}</div>
          </div>
        )}
        
        {showPercent && (
          <div className="p-3 bg-white rounded border">
            <div className="text-sm text-gray-600">Percent</div>
            <div className="text-xl font-bold text-orange-600">{percent}%</div>
          </div>
        )}
        
        <div className="p-3 bg-white rounded border">
          <div className="text-sm text-gray-600">Parts</div>
          <div className="text-xl font-bold text-green-600">
            {numerator} of {denominator}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 <strong>Tip:</strong> Hover over parts to highlight them!
      </div>
    </div>
  );
}

// Utility functions for common fractions
export function createFractionVisual(numerator: number, denominator: number, type: 'circles' | 'rectangles' | 'bars' = 'circles') {
  return (
    <FractionVisualizer
      numerator={numerator}
      denominator={denominator}
      visualType={type}
      showEquivalent={true}
      showDecimal={true}
      showPercent={true}
    />
  );
}
