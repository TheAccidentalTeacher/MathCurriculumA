'use client';

import React, { useState } from 'react';

interface CalculatorProps {
  allowedOperations?: ('add' | 'subtract' | 'multiply' | 'divide' | 'power' | 'sqrt')[];
  showSteps?: boolean;
  mathMode?: boolean;
  className?: string;
}

export default function MathCalculator({
  allowedOperations = ['add', 'subtract', 'multiply', 'divide'],
  showSteps = true,
  mathMode = true,
  className = ''
}: CalculatorProps) {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  const operationSymbols = {
    add: '+',
    subtract: '−',
    multiply: '×',
    divide: '÷',
    power: '^',
    sqrt: '√'
  };

  const clear = () => {
    setExpression('');
    setResult('');
    setSteps([]);
  };

  const deleteLast = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const addToExpression = (value: string) => {
    setExpression(prev => prev + value);
  };

  const calculate = () => {
    try {
      // Convert display symbols to JavaScript operators
      let jsExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/\^/g, '**');

      // Handle square root
      jsExpression = jsExpression.replace(/√(\d+)/g, 'Math.sqrt($1)');

      const calculatedResult = Function('"use strict"; return (' + jsExpression + ')')();
      const resultStr = calculatedResult.toString();
      
      setResult(resultStr);
      setHistory(prev => [...prev, `${expression} = ${resultStr}`].slice(-5));
      
      if (showSteps) {
        const stepList = generateSteps(expression, calculatedResult);
        setSteps(stepList);
      }
    } catch (error) {
      setResult('Error');
      setSteps(['Invalid expression']);
    }
  };

  const generateSteps = (expr: string, result: number): string[] => {
    const steps = [`Original: ${expr}`];
    
    // Simple step generation (can be enhanced)
    if (expr.includes('+')) {
      steps.push('Performing addition...');
    }
    if (expr.includes('−') || expr.includes('-')) {
      steps.push('Performing subtraction...');
    }
    if (expr.includes('×')) {
      steps.push('Performing multiplication...');
    }
    if (expr.includes('÷')) {
      steps.push('Performing division...');
    }
    
    steps.push(`Result: ${result}`);
    return steps;
  };

  const NumberButton = ({ value, className: buttonClassName = '' }: { value: string; className?: string }) => (
    <button
      onClick={() => addToExpression(value)}
      className={`p-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold text-lg transition-colors ${buttonClassName}`}
    >
      {value}
    </button>
  );

  const OperationButton = ({ operation, symbol }: { operation: string; symbol: string }) => (
    <button
      onClick={() => addToExpression(symbol)}
      className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold text-lg transition-colors"
      disabled={!allowedOperations.includes(operation as any)}
    >
      {symbol}
    </button>
  );

  return (
    <div className={`math-calculator bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto ${className}`}>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          🧮 Math Calculator
        </h3>
        
        {/* Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-right text-gray-600 text-sm min-h-[1.25rem]">
            {expression || '0'}
          </div>
          <div className="text-right text-2xl font-bold text-blue-600 min-h-[2rem]">
            {result}
          </div>
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {/* Row 1 */}
        <button 
          onClick={clear}
          className="col-span-2 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-colors"
        >
          Clear
        </button>
        <button 
          onClick={deleteLast}
          className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold transition-colors"
        >
          ⌫
        </button>
        <OperationButton operation="divide" symbol="÷" />

        {/* Row 2 */}
        <NumberButton value="7" />
        <NumberButton value="8" />
        <NumberButton value="9" />
        <OperationButton operation="multiply" symbol="×" />

        {/* Row 3 */}
        <NumberButton value="4" />
        <NumberButton value="5" />
        <NumberButton value="6" />
        <OperationButton operation="subtract" symbol="−" />

        {/* Row 4 */}
        <NumberButton value="1" />
        <NumberButton value="2" />
        <NumberButton value="3" />
        <OperationButton operation="add" symbol="+" />

        {/* Row 5 */}
        <NumberButton value="0" className="col-span-2" />
        <NumberButton value="." />
        <button
          onClick={calculate}
          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-lg transition-colors"
        >
          =
        </button>
      </div>

      {/* Advanced operations */}
      {(allowedOperations.includes('power') || allowedOperations.includes('sqrt')) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {allowedOperations.includes('power') && (
            <OperationButton operation="power" symbol="^" />
          )}
          {allowedOperations.includes('sqrt') && (
            <button
              onClick={() => addToExpression('√')}
              className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-colors"
            >
              √
            </button>
          )}
        </div>
      )}

      {/* Steps */}
      {showSteps && steps.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">Steps:</h4>
          <div className="bg-gray-50 rounded-lg p-3">
            {steps.map((step, index) => (
              <div key={index} className="text-sm text-gray-600">
                {index + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Recent:</h4>
          <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="text-xs text-gray-600 cursor-pointer hover:text-blue-600"
                onClick={() => setExpression(item.split(' = ')[0])}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized calculator types
export function BasicCalculator() {
  return (
    <MathCalculator 
      allowedOperations={['add', 'subtract', 'multiply', 'divide']}
      showSteps={true}
    />
  );
}

export function ScientificCalculator() {
  return (
    <MathCalculator 
      allowedOperations={['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt']}
      showSteps={true}
      mathMode={true}
    />
  );
}
