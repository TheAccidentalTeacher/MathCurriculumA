'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface GraphConfig {
  type: 'linear' | 'coordinate' | 'scatter' | 'quadratic' | 'system';
  title?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  gridlines?: boolean;
  showAxes?: boolean;
}

interface MathGrapherProps {
  // For linear functions: y = mx + b
  slope?: number;
  yIntercept?: number;
  
  // For coordinate points
  points?: Point[];
  
  // For multiple functions
  functions?: {
    expression: string;
    color?: string;
    label?: string;
    slope?: number;
    yIntercept?: number;
  }[];
  
  // Graph configuration
  config?: GraphConfig;
  
  // Display properties
  width?: number;
  height?: number;
  className?: string;
}

export default function MathGrapher({
  slope,
  yIntercept,
  points = [],
  functions = [],
  config = { type: 'linear' },
  width = 500,
  height = 400,
  className = ''
}: MathGrapherProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});

  useEffect(() => {
    generateGraphData();
  }, [slope, yIntercept, points, functions, config]);

  const generateGraphData = () => {
    const traces: any[] = [];
    
    // Set default ranges
    const xRange = config.xRange || [-10, 10];
    const yRange = config.yRange || [-10, 10];
    
    // Generate x values for plotting
    const xValues: number[] = [];
    for (let x = xRange[0]; x <= xRange[1]; x += 0.1) {
      xValues.push(x);
    }

    // Handle single linear function
    if (slope !== undefined && yIntercept !== undefined) {
      const yValues = xValues.map(x => slope * x + yIntercept);
      traces.push({
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name: `y = ${slope}x + ${yIntercept}`,
        line: { color: '#2563eb', width: 3 }
      });
    }

    // Handle multiple functions
    functions.forEach((func, index) => {
      if (func.slope !== undefined && func.yIntercept !== undefined) {
        const yValues = xValues.map(x => func.slope! * x + func.yIntercept!);
        const colors = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];
        traces.push({
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          name: func.label || func.expression || `y = ${func.slope}x + ${func.yIntercept}`,
          line: { color: func.color || colors[index % colors.length], width: 3 }
        });
      }
    });

    // Handle coordinate points
    if (points.length > 0) {
      const pointTrace = {
        x: points.map(p => p.x),
        y: points.map(p => p.y),
        type: 'scatter',
        mode: 'markers+text',
        name: 'Points',
        text: points.map(p => p.label || `(${p.x}, ${p.y})`),
        textposition: 'top center',
        marker: {
          color: '#dc2626',
          size: 10,
          symbol: 'circle'
        }
      };
      traces.push(pointTrace);
    }

    // Set up layout
    const graphLayout = {
      title: {
        text: config.title || 'Mathematical Graph',
        font: { size: 18 }
      },
      xaxis: {
        title: 'x',
        range: xRange,
        showgrid: config.gridlines !== false,
        zeroline: true,
        zerolinewidth: 2,
        zerolinecolor: '#000000'
      },
      yaxis: {
        title: 'y',
        range: yRange,
        showgrid: config.gridlines !== false,
        zeroline: true,
        zerolinewidth: 2,
        zerolinecolor: '#000000'
      },
      showlegend: traces.length > 1,
      width: width,
      height: height,
      margin: { l: 50, r: 50, t: 50, b: 50 },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#ffffff'
    };

    setPlotData(traces);
    setLayout(graphLayout);
  };

  // Function to parse common math expressions
  const parseExpression = (expr: string) => {
    // Simple parser for y = mx + b format
    const linearMatch = expr.match(/y\s*=\s*([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?/);
    if (linearMatch) {
      const slope = parseFloat(linearMatch[1] || '1');
      const yIntercept = parseFloat((linearMatch[2] || '0').replace(/\s/g, ''));
      return { slope, yIntercept };
    }
    return null;
  };

  return (
    <div className={`math-grapher bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          📊 Interactive Math Graph
        </h3>
        {slope !== undefined && yIntercept !== undefined && (
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Function:</span> y = {slope}x + {yIntercept}
            <br />
            <span className="font-medium">Slope:</span> {slope} 
            {slope === 1 ? ' (rises 1 unit up for every 1 unit right)' : 
             slope === -1 ? ' (drops 1 unit down for every 1 unit right)' :
             slope > 0 ? ` (rises ${slope} units up for every 1 unit right)` :
             ` (drops ${Math.abs(slope)} units down for every 1 unit right)`}
            <br />
            <span className="font-medium">Y-intercept:</span> {yIntercept} (crosses y-axis at (0, {yIntercept}))
          </div>
        )}
      </div>
      
      <div className="graph-container">
        <Plot
          data={plotData}
          layout={layout}
          config={{
            displayModeBar: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
            responsive: true
          }}
        />
      </div>

      <div className="mt-3 text-xs text-gray-500">
        💡 <strong>Tip:</strong> You can zoom, pan, and hover over points to explore the graph!
      </div>
    </div>
  );
}

// Utility function to create a linear function graph from equation string
export function createLinearGraph(equation: string, options?: Partial<MathGrapherProps>) {
  const match = equation.match(/y\s*=\s*([+-]?\d*\.?\d*)\s*x\s*([+-]\s*\d+\.?\d*)?/);
  if (match) {
    const slope = parseFloat(match[1] || '1');
    const yIntercept = parseFloat((match[2] || '0').replace(/\s/g, ''));
    
    return (
      <MathGrapher
        slope={slope}
        yIntercept={yIntercept}
        config={{ type: 'linear', title: `Graph of ${equation}` }}
        {...options}
      />
    );
  }
  return null;
}

// Utility function to create coordinate point graphs
export function createPointGraph(points: Point[], title?: string, options?: Partial<MathGrapherProps>) {
  return (
    <MathGrapher
      points={points}
      config={{ type: 'coordinate', title: title || 'Coordinate Points' }}
      {...options}
    />
  );
}

// Utility function for transformation examples
export function createTransformationGraph(
  originalPoints: Point[], 
  transformedPoints: Point[], 
  title?: string,
  options?: Partial<MathGrapherProps>
) {
  const allPoints = [
    ...originalPoints.map(p => ({ ...p, label: `${p.label || ''}(original)` })),
    ...transformedPoints.map(p => ({ ...p, label: `${p.label || ''}(transformed)` }))
  ];
  
  return (
    <MathGrapher
      points={allPoints}
      config={{ 
        type: 'coordinate', 
        title: title || 'Transformation Comparison',
        xRange: [-15, 15],
        yRange: [-15, 15]
      }}
      {...options}
    />
  );
}
