'use client';

import React from 'react';
// DISABLED: GeoGebra integration removed by user request
// import GeoGebraWidget from './GeoGebraWidget';

interface PowersOf10ActivityProps {
  activityType: 'place-value' | 'number-line' | 'scientific-notation' | 'decomposition';
  number?: number;
  className?: string;
}

export default function PowersOf10Activity({ 
  activityType, 
  number = 3500, 
  className = '' 
}: PowersOf10ActivityProps) {
  
  const getActivityConfig = () => {
    switch (activityType) {
      case 'place-value':
        return getPlaceValueActivity(number);
      case 'number-line':
        return getNumberLineActivity(number);
      case 'scientific-notation':
        return getScientificNotationActivity(number);
      case 'decomposition':
        return getDecompositionActivity(number);
      default:
        return getPlaceValueActivity(number);
    }
  };

  const config = getActivityConfig();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">{config.title}</h3>
        <p className="text-sm text-gray-600">{config.description}</p>
      </div>
      
      {/* DISABLED: GeoGebra integration removed by user request */}
      <div 
        className="w-full bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
        style={{ width: config.width || 600, height: config.height || 400 }}
      >
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium">Powers of 10 Visualization Disabled</div>
          <div className="text-sm mt-2">GeoGebra integration has been removed</div>
        </div>
      </div>
    </div>
  );
}

function getPlaceValueActivity(number: number) {
  const digits = number.toString().split('').reverse();
  const commands: string[] = [];
  
  // Create place value chart
  let xPos = 0;
  digits.forEach((digit, index) => {
    const placeValue = Math.pow(10, index);
    const yPos = 2;
    
    // Draw the place value column
    commands.push(`Text("${placeValue}", (${xPos}, ${yPos + 1}), true)`);
    commands.push(`Text("${digit}", (${xPos}, ${yPos}), true)`);
    
    // Draw visual representation if digit > 0
    if (parseInt(digit) > 0) {
      for (let i = 0; i < parseInt(digit); i++) {
        commands.push(`Point((${xPos}, ${yPos - 0.5 - (i * 0.3)}), true)`);
      }
    }
    
    xPos += 2;
  });
  
  // Add title and explanation
  commands.push(`Text("Place Value Chart for ${number}", (${xPos/2}, 4), true)`);
  commands.push(`Text("${number} = ${digits.reverse().map((d, i) => `${d} × 10^${digits.length - 1 - i}`).join(' + ')}", (${xPos/2}, -2), true)`);

  return {
    title: `Place Value Analysis of ${number}`,
    description: 'Interactive place value chart showing how each digit contributes to the total value',
    commands,
    width: Math.max(600, xPos * 50),
    height: 400
  };
}

function getNumberLineActivity(number: number) {
  const commands: string[] = [];
  
  // Create logarithmic number line for powers of 10
  const powers = [0, 1, 2, 3, 4, 5];
  powers.forEach((power, index) => {
    const value = Math.pow(10, power);
    const xPos = index * 2;
    
    // Mark the power of 10
    commands.push(`Point((${xPos}, 0))`);
    commands.push(`Text("10^${power} = ${value}", (${xPos}, -1), true)`);
    
    // Highlight where our number fits
    if (value <= number && Math.pow(10, power + 1) > number) {
      commands.push(`Text("${number} is here", (${xPos + 0.5}, 1), true)`);
      commands.push(`Point((${xPos + 0.5}, 0.5), true)`);
    }
  });
  
  // Draw the number line
  commands.push(`Segment((-1, 0), (11, 0))`);
  commands.push(`Text("Powers of 10 Number Line", (5, 2), true)`);

  return {
    title: `Number Line for ${number}`,
    description: 'See where your number fits on the powers of 10 scale',
    commands,
    width: 700,
    height: 300
  };
}

function getScientificNotationActivity(number: number) {
  const commands: string[] = [];
  
  // Convert to scientific notation
  const exp = Math.floor(Math.log10(number));
  const coefficient = number / Math.pow(10, exp);
  
  // Visual representation
  commands.push(`Text("Standard Form: ${number}", (0, 4), true)`);
  commands.push(`Text("Scientific Notation: ${coefficient.toFixed(2)} × 10^${exp}", (0, 3), true)`);
  
  // Interactive sliders for building scientific notation
  commands.push(`a = Slider(1, 9.99, 0.01, 1, 200, 0, true, true, false)`);
  commands.push(`n = Slider(0, 5, 1, 1, 200, 0, true, true, false)`);
  commands.push(`result = a * 10^n`);
  commands.push(`Text("Your number: " + result, (0, 1), true)`);
  
  // Target indicator
  commands.push(`Text("Target: ${number}", (0, 0), true)`);

  return {
    title: `Scientific Notation for ${number}`,
    description: 'Learn to express numbers in scientific notation with interactive sliders',
    commands,
    width: 600,
    height: 400
  };
}

function getDecompositionActivity(number: number) {
  const commands: string[] = [];
  const digits = number.toString().split('');
  
  // Break down the number
  let breakdown: string[] = [];
  digits.forEach((digit, index) => {
    if (digit !== '0') {
      const placeValue = Math.pow(10, digits.length - 1 - index);
      const contribution = parseInt(digit) * placeValue;
      breakdown.push(`${digit} × 10^${digits.length - 1 - index} = ${contribution}`);
    }
  });
  
  // Display breakdown
  commands.push(`Text("Breaking down ${number}:", (0, 5), true)`);
  breakdown.forEach((line, index) => {
    commands.push(`Text("${line}", (0, 4 - index * 0.8), true)`);
  });
  
  commands.push(`Text("Sum: ${breakdown.map(b => b.split(' = ')[1]).join(' + ')} = ${number}", (0, 1), true)`);

  return {
    title: `Decomposing ${number}`,
    description: 'See how the number breaks down into powers of 10',
    commands,
    width: 600,
    height: 400
  };
}

// Pre-built activities for common curriculum topics
export function PowersOf10Explorer() {
  return <PowersOf10Activity activityType="place-value" number={3500} />;
}

export function ScientificNotationBuilder() {
  return <PowersOf10Activity activityType="scientific-notation" number={3500} />;
}

export function NumberLineExplorer() {
  return <PowersOf10Activity activityType="number-line" number={3500} />;
}
