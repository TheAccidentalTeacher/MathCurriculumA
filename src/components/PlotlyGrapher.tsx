'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { PlotData, Layout, Config } from 'plotly.js';

// Dynamic import to prevent SSR issues with Plotly
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 animate-pulse rounded flex items-center justify-center">
    <div className="text-gray-500">Loading Professional Grapher...</div>
  </div>
});

interface PlotlyGrapherProps {
  functions?: string[];
  title?: string;
  width?: number;
  height?: number;
  xRange?: [number, number];
  yRange?: [number, number];
  showGrid?: boolean;
  showAxis?: boolean;
  interactive?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
  onPointClick?: (x: number, y: number) => void;
}

interface MathFunction {
  expression: string;
  color: string;
  name: string;
  visible: boolean;
}

export default function PlotlyGrapher({
  functions = ['x^2', 'x + 1'],
  title = 'Interactive Function Grapher',
  width = 700,
  height = 500,
  xRange = [-10, 10],
  yRange = [-10, 10],
  showGrid = true,
  showAxis = true,
  interactive = true,
  theme = 'light',
  className = '',
  onPointClick
}: PlotlyGrapherProps) {
  const [mathFunctions, setMathFunctions] = useState<MathFunction[]>([]);
  const [error, setError] = useState<string | null>(null);

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'];

  // Parse and validate mathematical functions
  useEffect(() => {
    try {
      const parsedFunctions = functions.map((func, index) => {
        // Create clean, student-friendly names
        let displayName = `y = ${func}`;
        
        // For single functions, just use the simple form
        if (functions.length === 1) {
          displayName = `y = ${func}`;
        } else {
          // For multiple functions, use colors or simple labels
          const labels = ['y', 'y₂', 'y₃', 'y₄', 'y₅', 'y₆'];
          displayName = `${labels[index] || `y${index + 1}`} = ${func}`;
        }
        
        return {
          expression: func,
          color: colors[index % colors.length],
          name: displayName,
          visible: true
        };
      });
      setMathFunctions(parsedFunctions);
      setError(null);
    } catch (err) {
      setError(`Error parsing functions: ${err}`);
    }
  }, [functions]);

  // Generate plot data for each function
  const plotData: PlotData[] = useMemo(() => {
    if (!mathFunctions.length) return [];

    return mathFunctions
      .filter(func => func.visible)
      .map((func) => {
        const xValues: number[] = [];
        const yValues: number[] = [];
        
        // Generate points for the function
        const numPoints = 200;
        const step = (xRange[1] - xRange[0]) / numPoints;
        
        for (let i = 0; i <= numPoints; i++) {
          const x = xRange[0] + i * step;
          try {
            // Simple mathematical expression evaluator
            const y = evaluateFunction(func.expression, x);
            if (isFinite(y)) {
              xValues.push(x);
              yValues.push(y);
            }
          } catch (err) {
            // Skip invalid points
          }
        }

        return {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          name: func.name,
          line: {
            color: func.color,
            width: 2
          },
          hovertemplate: '<b>%{fullData.name}</b><br>' +
                        'x: %{x:.2f}<br>' +
                        'y: %{y:.2f}<extra></extra>'
        } as PlotData;
      });
  }, [mathFunctions, xRange, yRange]);

  // Layout configuration
  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 16, color: theme === 'dark' ? '#ffffff' : '#000000' }
    },
    xaxis: {
      title: { text: 'x' },
      range: xRange,
      showgrid: showGrid,
      showline: showAxis,
      zeroline: true,
      zerolinecolor: '#888888',
      zerolinewidth: 1,
      gridcolor: theme === 'dark' ? '#444444' : '#e0e0e0',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    },
    yaxis: {
      title: { text: 'y' },
      range: yRange,
      showgrid: showGrid,
      showline: showAxis,
      zeroline: true,
      zerolinecolor: '#888888',
      zerolinewidth: 1,
      gridcolor: theme === 'dark' ? '#444444' : '#e0e0e0',
      color: theme === 'dark' ? '#ffffff' : '#000000'
    },
    plot_bgcolor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    paper_bgcolor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
    font: {
      color: theme === 'dark' ? '#ffffff' : '#000000'
    },
    margin: { l: 60, r: 30, t: 50, b: 50 },
    showlegend: true,
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#cccccc',
      borderwidth: 1
    },
    dragmode: 'pan'  // Enable click-and-drag to pan instead of select-zoom
  };

  // Configuration for interactivity
  const config: Partial<Config> = {
    displayModeBar: interactive,
    modeBarButtonsToRemove: interactive ? [] : ['toImage', 'sendDataToCloud'],
    displaylogo: false,
    responsive: true,
    scrollZoom: true,  // Enable mouse wheel zoom in/out
    doubleClick: 'reset',  // Double-click to reset zoom
    editable: false  // Keep plot editing disabled for cleaner UI
  };

  // Handle point clicks
  const handleClick = (event: any) => {
    if (onPointClick && event.points && event.points[0]) {
      const point = event.points[0];
      onPointClick(point.x, point.y);
    }
  };

  // Simple mathematical expression evaluator
  function evaluateFunction(expression: string, x: number): number {
    // Replace common mathematical notation
    let expr = expression
      .replace(/\^/g, '**')           // x^2 -> x**2
      .replace(/(\d+)x/g, '$1*x')     // 2x -> 2*x, 3x -> 3*x
      .replace(/x(\d+)/g, 'x*$1')     // x2 -> x*2
      .replace(/\)(\d+)/g, ')*$1')    // )2 -> )*2  
      .replace(/(\d+)\(/g, '$1*(')    // 2( -> 2*(
      .replace(/x/g, `(${x})`)        // Replace x with actual value
      .replace(/sin/g, 'Math.sin')    // sin -> Math.sin
      .replace(/cos/g, 'Math.cos')    // cos -> Math.cos
      .replace(/tan/g, 'Math.tan')    // tan -> Math.tan
      .replace(/log/g, 'Math.log10')  // log -> Math.log10
      .replace(/ln/g, 'Math.log')     // ln -> Math.log
      .replace(/sqrt/g, 'Math.sqrt')  // sqrt -> Math.sqrt
      .replace(/abs/g, 'Math.abs')    // abs -> Math.abs
      .replace(/pi/g, 'Math.PI')      // pi -> Math.PI
      .replace(/e/g, 'Math.E');       // e -> Math.E

    // Use Function constructor for safe evaluation
    try {
      return new Function('return ' + expr)();
    } catch (err) {
      throw new Error(`Invalid expression: ${expression}`);
    }
  }

  // Function visibility controls
  const toggleFunction = (index: number) => {
    setMathFunctions(prev => 
      prev.map((func, i) => 
        i === index ? { ...func, visible: !func.visible } : func
      )
    );
  };

  if (error) {
    return (
      <div className={`border border-red-300 rounded-lg p-4 ${className}`}>
        <div className="text-red-600 font-medium">Graphing Error</div>
        <div className="text-sm text-red-500 mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Header with function controls */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">📈 {title}</h3>
          <div className="text-xs text-green-600 font-medium">Professional Grade</div>
        </div>
        
        {/* Function toggles */}
        <div className="flex flex-wrap gap-2">
          {mathFunctions.map((func, index) => (
            <button
              key={index}
              onClick={() => toggleFunction(index)}
              className={`px-2 py-1 text-xs rounded border transition-colors ${
                func.visible 
                  ? 'bg-white border-gray-300 text-gray-700' 
                  : 'bg-gray-200 border-gray-300 text-gray-500'
              }`}
              style={{ 
                borderLeftColor: func.color,
                borderLeftWidth: '3px'
              }}
            >
              {func.name}
            </button>
          ))}
        </div>
      </div>

      {/* Plotly graph */}
      <div style={{ width, height }}>
        <Plot
          data={plotData}
          layout={layout}
          config={config}
          onClick={handleClick}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler={true}
        />
      </div>
    </div>
  );
}

// Pre-configured components for common use cases
export function LinearFunctionGrapher(props: Partial<PlotlyGrapherProps>) {
  return (
    <PlotlyGrapher
      functions={['2*x + 1', '-0.5*x + 3', 'x']}
      title="Linear Functions Explorer"
      xRange={[-5, 5]}
      yRange={[-5, 10]}
      {...props}
    />
  );
}

export function QuadraticFunctionGrapher(props: Partial<PlotlyGrapherProps>) {
  return (
    <PlotlyGrapher
      functions={['x^2', '-x^2 + 4', '0.5*x^2 - 2']}
      title="Quadratic Functions Explorer"
      xRange={[-5, 5]}
      yRange={[-5, 10]}
      {...props}
    />
  );
}

export function TrigFunctionGrapher(props: Partial<PlotlyGrapherProps>) {
  return (
    <PlotlyGrapher
      functions={['sin(x)', 'cos(x)', 'tan(x)']}
      title="Trigonometric Functions"
      xRange={[-2 * Math.PI, 2 * Math.PI]}
      yRange={[-3, 3]}
      {...props}
    />
  );
}
