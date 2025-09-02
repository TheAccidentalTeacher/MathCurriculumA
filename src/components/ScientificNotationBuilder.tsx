'use client';

import React, { useState } from 'react';

interface ScientificNotationBuilderProps {
  initialNumber?: number;
  interactive?: boolean;
  showSteps?: boolean;
  width?: number;
  height?: number;
  className?: string;
}

export default function ScientificNotationBuilder({
  initialNumber = 3500,
  interactive = true,
  showSteps = true,
  width = 700,
  height = 400,
  className = ''
}: ScientificNotationBuilderProps) {
  const [number, setNumber] = useState(initialNumber);
  const [coefficient, setCoefficient] = useState(3.5);
  const [exponent, setExponent] = useState(3);

  // Convert standard number to scientific notation
  const toScientificNotation = (num: number) => {
    if (num === 0) return { coefficient: 0, exponent: 0 };
    
    const absNum = Math.abs(num);
    const exp = Math.floor(Math.log10(absNum));
    const coeff = absNum / Math.pow(10, exp);
    
    return {
      coefficient: num < 0 ? -coeff : coeff,
      exponent: exp
    };
  };

  // Convert scientific notation to standard number
  const fromScientificNotation = (coeff: number, exp: number) => {
    return coeff * Math.pow(10, exp);
  };

  const scientificForm = toScientificNotation(number);

  const handleNumberChange = (newNumber: string) => {
    if (!interactive) return;
    const num = parseFloat(newNumber) || 0;
    setNumber(num);
    const { coefficient: coeff, exponent: exp } = toScientificNotation(num);
    setCoefficient(coeff);
    setExponent(exp);
  };

  const handleCoefficientChange = (newCoeff: string) => {
    if (!interactive) return;
    const coeff = parseFloat(newCoeff) || 0;
    setCoefficient(coeff);
    const newNumber = fromScientificNotation(coeff, exponent);
    setNumber(newNumber);
  };

  const handleExponentChange = (newExp: string) => {
    if (!interactive) return;
    const exp = parseInt(newExp) || 0;
    setExponent(exp);
    const newNumber = fromScientificNotation(coefficient, exp);
    setNumber(newNumber);
  };

  const renderSteps = () => {
    if (!showSteps) return null;

    const steps = [];
    const absNum = Math.abs(number);
    
    if (absNum >= 1) {
      // Moving decimal point left
      steps.push({
        step: 1,
        description: "Start with the original number",
        value: number.toString(),
        highlight: "original"
      });
      
      steps.push({
        step: 2,
        description: `Move decimal point ${scientificForm.exponent} places left`,
        value: `${absNum} → ${scientificForm.coefficient}`,
        highlight: "coefficient"
      });
      
      steps.push({
        step: 3,
        description: `The exponent is +${scientificForm.exponent} (moved left)`,
        value: `10^${scientificForm.exponent}`,
        highlight: "exponent"
      });
    } else if (absNum < 1 && absNum > 0) {
      // Moving decimal point right
      steps.push({
        step: 1,
        description: "Start with the original number",
        value: number.toString(),
        highlight: "original"
      });
      
      steps.push({
        step: 2,
        description: `Move decimal point ${Math.abs(scientificForm.exponent)} places right`,
        value: `${absNum} → ${scientificForm.coefficient}`,
        highlight: "coefficient"
      });
      
      steps.push({
        step: 3,
        description: `The exponent is ${scientificForm.exponent} (moved right)`,
        value: `10^${scientificForm.exponent}`,
        highlight: "exponent"
      });
    }

    return (
      <div className="steps-container bg-green-50 p-4 rounded-lg mt-4">
        <h4 className="font-semibold text-green-800 mb-3">Step-by-Step Conversion:</h4>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-2 text-sm">
            <div className="w-8 h-8 bg-green-200 text-green-800 rounded-full flex items-center justify-center font-bold mr-3">
              {step.step}
            </div>
            <div className="flex-1">
              <div className="text-gray-700">{step.description}</div>
              <div className={`font-mono mt-1 ${
                step.highlight === 'coefficient' ? 'text-blue-600 font-bold' :
                step.highlight === 'exponent' ? 'text-red-600 font-bold' :
                'text-gray-800'
              }`}>
                {step.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`scientific-notation-builder bg-white rounded-lg shadow-lg p-6 ${className}`} style={{ width, height }}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🔬 Scientific Notation Builder
        </h3>
        <p className="text-gray-600 text-sm">
          Convert between standard form and scientific notation
        </p>
      </div>

      {/* Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Standard Form */}
        <div className="standard-form">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Standard Form:
          </label>
          <input
            type="number"
            value={number}
            onChange={(e) => handleNumberChange(e.target.value)}
            disabled={!interactive}
            className="w-full p-3 text-lg font-mono border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            placeholder="Enter a number"
          />
          <div className="mt-2 text-sm text-gray-500">
            {number.toLocaleString()}
          </div>
        </div>

        {/* Scientific Notation */}
        <div className="scientific-form">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scientific Notation:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              min="1"
              max="9.99"
              value={coefficient.toFixed(2)}
              onChange={(e) => handleCoefficientChange(e.target.value)}
              disabled={!interactive}
              className="flex-1 p-3 text-lg font-mono border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <span className="text-lg font-bold">×</span>
            <span className="text-lg font-mono">10</span>
            <input
              type="number"
              value={exponent}
              onChange={(e) => handleExponentChange(e.target.value)}
              disabled={!interactive}
              className="w-20 p-3 text-lg font-mono border-2 border-red-300 rounded-lg focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Representation */}
      <div className="visual-representation bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-gray-800 mb-3">Visual Breakdown:</h4>
        
        <div className="text-center text-2xl font-mono mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
            {coefficient.toFixed(2)}
          </span>
          <span className="mx-2">×</span>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded">
            10<sup>{exponent}</sup>
          </span>
          <span className="mx-2">=</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
            {number.toLocaleString()}
          </span>
        </div>

        {/* Powers of 10 scale */}
        <div className="powers-scale mt-4">
          <div className="text-sm font-medium text-gray-700 mb-2">Powers of 10 Scale:</div>
          <div className="flex justify-center items-center gap-1 overflow-x-auto">
            {[-3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((power) => (
              <div
                key={power}
                className={`flex flex-col items-center p-2 rounded text-xs ${
                  power === exponent 
                    ? 'bg-red-200 text-red-800 font-bold' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className="font-mono">10<sup>{power}</sup></div>
                <div className="mt-1">{Math.pow(10, power).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {renderSteps()}

      {/* Examples */}
      <div className="examples mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-3">Quick Examples:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[
            { standard: 5000, scientific: "5.00 × 10³" },
            { standard: 0.003, scientific: "3.00 × 10⁻³" },
            { standard: 45000, scientific: "4.50 × 10⁴" },
            { standard: 0.00007, scientific: "7.00 × 10⁻⁵" }
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => handleNumberChange(example.standard.toString())}
              className="p-2 bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors"
              disabled={!interactive}
            >
              <div className="font-mono text-xs">{example.standard}</div>
              <div className="text-xs text-gray-600 mt-1">{example.scientific}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Utility function for creating scientific notation examples
export function createScientificNotationExample(number: number, options?: Partial<ScientificNotationBuilderProps>) {
  return (
    <ScientificNotationBuilder
      initialNumber={number}
      interactive={true}
      showSteps={true}
      {...options}
    />
  );
}
