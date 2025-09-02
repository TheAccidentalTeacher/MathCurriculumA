'use client';

import React, { useState } from 'react';

interface PowersOf10NumberLineProps {
  range?: [number, number]; // Exponent range, e.g., [-3, 6]
  currentNumber?: number;
  interactive?: boolean;
  showLabels?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function PowersOf10NumberLine({
  range = [-3, 6],
  currentNumber = 3500,
  interactive = true,
  showLabels = true,
  width = 800,
  height = 200,
  className = ''
}: PowersOf10NumberLineProps) {
  const [selectedNumber, setSelectedNumber] = useState(currentNumber);
  const [hoveredPower, setHoveredPower] = useState<number | null>(null);

  // Generate powers of 10 in the range
  const powers = [];
  for (let i = range[0]; i <= range[1]; i++) {
    powers.push({
      exponent: i,
      value: Math.pow(10, i),
      position: ((i - range[0]) / (range[1] - range[0])) * 100
    });
  }

  // Find closest power of 10 for current number
  const getClosestPower = (num: number) => {
    if (num === 0) return 0;
    const logValue = Math.log10(Math.abs(num));
    const lowerPower = Math.floor(logValue);
    const upperPower = lowerPower + 1;
    
    const lowerValue = Math.pow(10, lowerPower);
    const upperValue = Math.pow(10, upperPower);
    
    return Math.abs(num - lowerValue) < Math.abs(num - upperValue) ? lowerPower : upperPower;
  };

  // Calculate position on number line for any number
  const getNumberPosition = (num: number) => {
    if (num <= 0) return 0;
    
    const logValue = Math.log10(num);
    if (logValue < range[0]) return 0;
    if (logValue > range[1]) return 100;
    
    return ((logValue - range[0]) / (range[1] - range[0])) * 100;
  };

  const closestPower = getClosestPower(selectedNumber);
  const numberPosition = getNumberPosition(selectedNumber);

  const handleNumberChange = (newNumber: string) => {
    if (!interactive) return;
    const num = parseFloat(newNumber) || 0;
    setSelectedNumber(Math.abs(num)); // Keep positive for logarithmic scale
  };

  const handlePowerClick = (exponent: number) => {
    if (!interactive) return;
    setSelectedNumber(Math.pow(10, exponent));
  };

  return (
    <div className={`powers-numberline bg-white rounded-lg shadow-lg p-6 ${className}`} style={{ width, height }}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          📏 Powers of 10 Number Line
        </h3>
        {interactive && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Number:
            </label>
            <input
              type="number"
              value={selectedNumber}
              onChange={(e) => handleNumberChange(e.target.value)}
              min="0"
              step="any"
              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              placeholder="Enter a positive number"
            />
            <div className="text-sm text-gray-600">
              ≈ 10<sup>{closestPower}</sup>
            </div>
          </div>
        )}
      </div>

      {/* Number Line */}
      <div className="numberline-container relative bg-gray-50 rounded-lg p-4 mb-4" style={{ height: '120px' }}>
        {/* Base line */}
        <div className="absolute top-16 left-8 right-8 h-0.5 bg-gray-400"></div>

        {/* Power markers */}
        {powers.map((power) => (
          <div
            key={power.exponent}
            className="absolute top-12 transform -translate-x-1/2 cursor-pointer"
            style={{ left: `${8 + (power.position * 0.84)}%` }}
            onMouseEnter={() => setHoveredPower(power.exponent)}
            onMouseLeave={() => setHoveredPower(null)}
            onClick={() => handlePowerClick(power.exponent)}
          >
            {/* Tick mark */}
            <div className={`w-0.5 h-8 mx-auto mb-1 ${
              power.exponent === closestPower 
                ? 'bg-blue-600' 
                : hoveredPower === power.exponent 
                  ? 'bg-gray-600' 
                  : 'bg-gray-400'
            }`}></div>
            
            {/* Power label */}
            {showLabels && (
              <div className={`text-xs font-mono text-center ${
                power.exponent === closestPower 
                  ? 'text-blue-600 font-bold' 
                  : hoveredPower === power.exponent 
                    ? 'text-gray-800' 
                    : 'text-gray-600'
              }`}>
                10<sup>{power.exponent}</sup>
              </div>
            )}
            
            {/* Value label */}
            <div className={`text-xs text-center mt-1 ${
              power.exponent === closestPower 
                ? 'text-blue-600 font-bold' 
                : hoveredPower === power.exponent 
                  ? 'text-gray-800' 
                  : 'text-gray-500'
            }`}>
              {power.value >= 1 ? power.value.toLocaleString() : power.value}
            </div>
          </div>
        ))}

        {/* Current number marker */}
        {selectedNumber > 0 && (
          <div
            className="absolute top-8 transform -translate-x-1/2"
            style={{ left: `${8 + (numberPosition * 0.84)}%` }}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="text-xs font-bold text-red-600 text-center mt-1 whitespace-nowrap">
              {selectedNumber.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Number Analysis */}
      <div className="analysis bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-3">Number Analysis:</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>Selected Number:</strong>
            <div className="font-mono text-lg text-blue-600">{selectedNumber.toLocaleString()}</div>
          </div>
          <div>
            <strong>Closest Power of 10:</strong>
            <div className="font-mono text-lg text-green-600">10<sup>{closestPower}</sup> = {Math.pow(10, closestPower).toLocaleString()}</div>
          </div>
          <div>
            <strong>Between:</strong>
            <div className="text-gray-700">
              10<sup>{closestPower - 1}</sup> and 10<sup>{closestPower + 1}</sup>
            </div>
          </div>
        </div>

        {/* Scientific notation representation */}
        <div className="mt-4 pt-4 border-t border-blue-200">
          <strong className="text-blue-800">Scientific Notation:</strong>
          <div className="font-mono text-lg mt-1">
            {selectedNumber > 0 && (
              <span>
                {(selectedNumber / Math.pow(10, Math.floor(Math.log10(selectedNumber)))).toFixed(2)} × 10
                <sup>{Math.floor(Math.log10(selectedNumber))}</sup>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive examples */}
      {interactive && (
        <div className="examples mt-4 p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Try These Examples:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 10, 100, 1000, 10000, 0.1, 0.01, 0.001].map((example) => (
              <button
                key={example}
                onClick={() => setSelectedNumber(example)}
                className="p-2 bg-white border border-green-300 rounded hover:bg-green-100 transition-colors text-sm"
              >
                {example < 1 ? example : example.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      )}

      {hoveredPower !== null && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="text-sm">
            <strong>10<sup>{hoveredPower}</sup> = {Math.pow(10, hoveredPower).toLocaleString()}</strong>
            <br />
            This represents {hoveredPower >= 0 ? 'a 1 followed by' : 'a decimal point followed by'} {Math.abs(hoveredPower)} {Math.abs(hoveredPower) === 1 ? 'zero' : 'zeros'}{hoveredPower < 0 ? ' then a 1' : ''}.
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function for creating powers of 10 examples
export function createPowersOf10NumberLine(number: number, options?: Partial<PowersOf10NumberLineProps>) {
  return (
    <PowersOf10NumberLine
      currentNumber={number}
      interactive={true}
      showLabels={true}
      {...options}
    />
  );
}
