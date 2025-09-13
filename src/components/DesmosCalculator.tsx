import React, { useEffect, useRef, useState } from 'react';

// Extend Window interface to include Desmos
declare global {
  interface Window {
    Desmos: {
      GraphingCalculator: (element: HTMLElement, options?: any) => any;
      Colors: any;
      Styles: any;
    };
  }
}

interface DesmosCalculatorProps {
  expressions?: string[];
  width?: string | number;
  height?: string | number;
  options?: any;
  className?: string;
  onReady?: (calculator: any) => void;
}

export const DesmosCalculator: React.FC<DesmosCalculatorProps> = ({
  expressions = [],
  width = '100%',
  height = 400,
  options = {},
  className = '',
  onReady
}) => {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const desmosCalculator = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (calculatorRef.current && window.Desmos && !desmosCalculator.current) {
      try {
        // Default options optimized for education
        const defaultOptions = {
          expressions: true,
          settingsMenu: false,
          zoomButtons: true,
          expressionsTopbar: false,
          pointsOfInterest: true,
          trace: true,
          border: true,
          lockViewport: false,
          fontSize: 16,
          degreeMode: false,
          showGrid: true,
          showXAxis: true,
          showYAxis: true,
          xAxisNumbers: true,
          yAxisNumbers: true,
          ...options
        };

        // Create calculator instance
        desmosCalculator.current = window.Desmos.GraphingCalculator(
          calculatorRef.current,
          defaultOptions
        );

        setIsReady(true);
        onReady?.(desmosCalculator.current);

        // Add expressions
        expressions.forEach((latex, index) => {
          if (latex && latex.trim()) {
            desmosCalculator.current.setExpression({
              id: `expr-${index}`,
              latex: latex.trim(),
              color: index === 0 ? '#2d70b3' : undefined // Blue for first expression
            });
          }
        });

      } catch (error) {
        console.error('Failed to initialize Desmos calculator:', error);
      }
    }

    return () => {
      if (desmosCalculator.current) {
        try {
          desmosCalculator.current.destroy();
          desmosCalculator.current = null;
        } catch (error) {
          console.error('Error destroying Desmos calculator:', error);
        }
      }
    };
  }, [expressions, options, onReady]);

  // Update expressions when they change
  useEffect(() => {
    if (isReady && desmosCalculator.current) {
      // Clear existing expressions
      const currentExpressions = desmosCalculator.current.getExpressions();
      currentExpressions.forEach((expr: any) => {
        if (expr.id && expr.id.startsWith('expr-')) {
          desmosCalculator.current.removeExpression({ id: expr.id });
        }
      });

      // Add new expressions
      expressions.forEach((latex, index) => {
        if (latex && latex.trim()) {
          desmosCalculator.current.setExpression({
            id: `expr-${index}`,
            latex: latex.trim(),
            color: index === 0 ? '#2d70b3' : undefined
          });
        }
      });
    }
  }, [expressions, isReady]);

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  };

  return (
    <div className={`desmos-calculator-container ${className}`}>
      <div
        ref={calculatorRef}
        style={containerStyle}
        className="desmos-calculator"
      />
      {!isReady && window.Desmos && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-gray-600">Loading Desmos Calculator...</div>
        </div>
      )}
      {!window.Desmos && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            Desmos API is loading. Please wait a moment...
          </p>
        </div>
      )}
    </div>
  );
};

// Utility function to parse common math expressions for Desmos
export const parseMathExpression = (expression: string): string => {
  if (!expression) return '';
  
  // Convert common patterns to Desmos-compatible LaTeX
  return expression
    .replace(/\^([^{])/g, '^{$1}') // Ensure exponents are wrapped in braces
    .replace(/\*\*/g, '^') // Convert ** to ^
    .replace(/sqrt\(/g, '\\sqrt{') // Convert sqrt( to \sqrt{
    .replace(/sin\(/g, '\\sin(') // Ensure trig functions have backslash
    .replace(/cos\(/g, '\\cos(')
    .replace(/tan\(/g, '\\tan(')
    .replace(/log\(/g, '\\log(')
    .replace(/ln\(/g, '\\ln(')
    .replace(/pi/g, '\\pi') // Convert pi to \pi
    .replace(/infty/g, '\\infty'); // Convert infinity
};

// Helper component for quick function graphing
interface QuickGraphProps {
  functions: string[];
  title?: string;
  width?: number;
  height?: number;
}

export const QuickGraph: React.FC<QuickGraphProps> = ({
  functions,
  title,
  width = 600,
  height = 400
}) => {
  const parsedFunctions = functions.map(parseMathExpression);

  return (
    <div className="quick-graph">
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      )}
      <DesmosCalculator
        expressions={parsedFunctions}
        width={width}
        height={height}
        options={{
          expressions: false, // Hide expressions list for cleaner look
          settingsMenu: false,
          zoomButtons: true
        }}
      />
    </div>
  );
};

export default DesmosCalculator;
