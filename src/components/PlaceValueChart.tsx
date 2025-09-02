'use client';

import React, { useState } from 'react';

interface PlaceValueChartProps {
  number?: number;
  showPowersOf10?: boolean;
  interactive?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function PlaceValueChart({
  number = 3500,
  showPowersOf10 = true,
  interactive = true,
  width = 600,
  height = 300,
  className = ''
}: PlaceValueChartProps) {
  const [currentNumber, setCurrentNumber] = useState(number);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  // Convert number to place value breakdown
  const getPlaceValueBreakdown = (num: number) => {
    const str = num.toString();
    const breakdown = [];
    const length = str.length;

    for (let i = 0; i < length; i++) {
      const digit = parseInt(str[i]);
      const power = length - i - 1;
      const placeValue = Math.pow(10, power);
      const contribution = digit * placeValue;

      breakdown.push({
        digit,
        power,
        placeValue,
        contribution,
        position: i,
        label: getPlaceLabel(power)
      });
    }
    return breakdown;
  };

  const getPlaceLabel = (power: number): string => {
    const labels: { [key: number]: string } = {
      0: 'Ones',
      1: 'Tens', 
      2: 'Hundreds',
      3: 'Thousands',
      4: 'Ten Thousands',
      5: 'Hundred Thousands',
      6: 'Millions'
    };
    return labels[power] || `10^${power}`;
  };

  const breakdown = getPlaceValueBreakdown(currentNumber);

  const handleDigitChange = (position: number, newDigit: string) => {
    if (!interactive) return;
    
    const digit = parseInt(newDigit) || 0;
    if (digit < 0 || digit > 9) return;

    const numStr = currentNumber.toString().padStart(breakdown.length, '0');
    const newNumStr = numStr.substring(0, position) + digit + numStr.substring(position + 1);
    setCurrentNumber(parseInt(newNumStr) || 0);
  };

  return (
    <div className={`place-value-chart bg-white rounded-lg shadow-lg p-6 ${className}`} style={{ width, height }}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🔢 Place Value Chart
        </h3>
        <div className="text-lg text-gray-700">
          Number: <span className="font-mono font-bold text-blue-600">{currentNumber.toLocaleString()}</span>
        </div>
      </div>

      {/* Place value columns */}
      <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${breakdown.length}, 1fr)` }}>
        {breakdown.map((place, index) => (
          <div
            key={index}
            className={`place-column border-2 rounded-lg p-3 transition-all ${
              hoveredColumn === index 
                ? 'bg-blue-50 border-blue-300 transform scale-105' 
                : 'bg-gray-50 border-gray-300'
            }`}
            onMouseEnter={() => setHoveredColumn(index)}
            onMouseLeave={() => setHoveredColumn(null)}
          >
            {/* Place label */}
            <div className="text-xs font-semibold text-gray-600 mb-2 text-center">
              {place.label}
            </div>

            {/* Power of 10 notation */}
            {showPowersOf10 && (
              <div className="text-xs text-blue-600 mb-2 text-center font-mono">
                10<sup>{place.power}</sup>
              </div>
            )}

            {/* Digit input/display */}
            <div className="text-center mb-2">
              {interactive ? (
                <input
                  type="number"
                  min="0"
                  max="9"
                  value={place.digit}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center text-2xl font-bold bg-blue-100 border-2 border-blue-300 rounded-lg">
                  {place.digit}
                </div>
              )}
            </div>

            {/* Place value */}
            <div className="text-xs text-gray-500 text-center">
              = {place.placeValue.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Mathematical breakdown */}
      <div className="mathematical-breakdown bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-3">Mathematical Breakdown:</h4>
        <div className="text-lg font-mono text-blue-700">
          {breakdown.map((place, index) => (
            <span key={index}>
              {place.digit > 0 && (
                <>
                  {index > 0 && breakdown.slice(0, index).some(p => p.digit > 0) ? ' + ' : ''}
                  {place.digit} × 10<sup>{place.power}</sup>
                </>
              )}
            </span>
          ))}
          {' = '}
          <span className="text-blue-900 font-bold">{currentNumber.toLocaleString()}</span>
        </div>

        {/* Expanded form */}
        <div className="mt-3 text-sm text-gray-700">
          <strong>Expanded Form:</strong>
          <div className="font-mono mt-1">
            {breakdown
              .filter(place => place.digit > 0)
              .map(place => `${place.contribution.toLocaleString()}`)
              .join(' + ')}
            {' = '}
            {currentNumber.toLocaleString()}
          </div>
        </div>
      </div>

      {hoveredColumn !== null && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <div className="text-sm">
            <strong>Column Details:</strong>
            <br />
            Position: {breakdown[hoveredColumn].label} (10<sup>{breakdown[hoveredColumn].power}</sup>)
            <br />
            Digit: {breakdown[hoveredColumn].digit}
            <br />
            Value: {breakdown[hoveredColumn].digit} × {breakdown[hoveredColumn].placeValue.toLocaleString()} = {breakdown[hoveredColumn].contribution.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function for powers of 10 visualization
export function createPowersOf10Chart(number: number, options?: Partial<PlaceValueChartProps>) {
  return (
    <PlaceValueChart
      number={number}
      showPowersOf10={true}
      interactive={true}
      {...options}
    />
  );
}
