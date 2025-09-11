'use client';

import React from 'react';

interface SimpleSVGVisualizerProps {
  shape: string;
  dimensions?: number[];
  showMeasurements?: boolean;
  showFormulas?: boolean;
  className?: string;
}

export default function SimpleSVGVisualizer({ 
  shape, 
  dimensions = [],
  showMeasurements = true,
  showFormulas = true,
  className = '' 
}: SimpleSVGVisualizerProps) {
  
  const renderShape = () => {
    const shapeType = shape.toLowerCase();
    
    switch (shapeType) {
      case 'triangle':
        return renderTriangle(dimensions);
      case 'square':
        return renderSquare(dimensions[0] || 100);
      case 'rectangle':
        return renderRectangle(dimensions[0] || 120, dimensions[1] || 80);
      case 'circle':
        return renderCircle(dimensions[0] || 50);
      case 'pentagon':
        return renderRegularPolygon(5, dimensions[0] || 50);
      case 'hexagon':
        return renderRegularPolygon(6, dimensions[0] || 50);
      case 'octagon':
        return renderRegularPolygon(8, dimensions[0] || 50);
      default:
        return renderGenericShape(shapeType);
    }
  };

  const renderTriangle = (dims: number[]) => {
    const [a = 80, b = 80, c = 80] = dims;
    // Create an equilateral triangle for simplicity
    const height = (Math.sqrt(3) / 2) * a;
    
    return (
      <g>
        <polygon
          points={`150,50 ${150 - a/2},${50 + height} ${150 + a/2},${50 + height}`}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
        />
        {showMeasurements && (
          <>
            <text x="150" y="40" textAnchor="middle" className="text-sm fill-gray-700">
              Triangle
            </text>
            <text x="150" y={50 + height + 20} textAnchor="middle" className="text-xs fill-gray-600">
              Base: {a}
            </text>
          </>
        )}
      </g>
    );
  };

  const renderSquare = (side: number) => {
    const adjustedSide = Math.min(side, 100); // Keep it reasonable for display
    const x = 150 - adjustedSide/2;
    const y = 75 - adjustedSide/2;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={adjustedSide}
          height={adjustedSide}
          fill="rgba(34, 197, 94, 0.3)"
          stroke="rgb(34, 197, 94)"
          strokeWidth="2"
        />
        {showMeasurements && (
          <>
            <text x="150" y="30" textAnchor="middle" className="text-sm fill-gray-700">
              Square
            </text>
            <text x="150" y="170" textAnchor="middle" className="text-xs fill-gray-600">
              Side: {side}
            </text>
          </>
        )}
      </g>
    );
  };

  const renderRectangle = (width: number, height: number) => {
    const adjustedWidth = Math.min(width, 120);
    const adjustedHeight = Math.min(height, 80);
    const x = 150 - adjustedWidth/2;
    const y = 75 - adjustedHeight/2;
    
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={adjustedWidth}
          height={adjustedHeight}
          fill="rgba(168, 85, 247, 0.3)"
          stroke="rgb(168, 85, 247)"
          strokeWidth="2"
        />
        {showMeasurements && (
          <>
            <text x="150" y="25" textAnchor="middle" className="text-sm fill-gray-700">
              Rectangle
            </text>
            <text x="150" y="170" textAnchor="middle" className="text-xs fill-gray-600">
              {width} × {height}
            </text>
          </>
        )}
      </g>
    );
  };

  const renderCircle = (radius: number) => {
    const adjustedRadius = Math.min(radius, 60);
    
    return (
      <g>
        <circle
          cx="150"
          cy="75"
          r={adjustedRadius}
          fill="rgba(239, 68, 68, 0.3)"
          stroke="rgb(239, 68, 68)"
          strokeWidth="2"
        />
        {showMeasurements && (
          <>
            <text x="150" y="20" textAnchor="middle" className="text-sm fill-gray-700">
              Circle
            </text>
            <text x="150" y="160" textAnchor="middle" className="text-xs fill-gray-600">
              Radius: {radius}
            </text>
            {/* Show radius line */}
            <line
              x1="150"
              y1="75"
              x2={150 + adjustedRadius}
              y2="75"
              stroke="rgb(239, 68, 68)"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text x={150 + adjustedRadius/2} y="70" textAnchor="middle" className="text-xs fill-gray-600">
              r
            </text>
          </>
        )}
      </g>
    );
  };

  const renderRegularPolygon = (sides: number, radius: number) => {
    const adjustedRadius = Math.min(radius, 60);
    const centerX = 150;
    const centerY = 75;
    
    const points = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2; // Start from top
      const x = centerX + adjustedRadius * Math.cos(angle);
      const y = centerY + adjustedRadius * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    
    const colors = ['rgba(34, 197, 94, 0.3)', 'rgba(59, 130, 246, 0.3)', 'rgba(168, 85, 247, 0.3)'];
    const strokeColors = ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(168, 85, 247)'];
    const colorIndex = sides % colors.length;
    
    return (
      <g>
        <polygon
          points={points.join(' ')}
          fill={colors[colorIndex]}
          stroke={strokeColors[colorIndex]}
          strokeWidth="2"
        />
        {showMeasurements && (
          <>
            <text x="150" y="20" textAnchor="middle" className="text-sm fill-gray-700">
              {sides === 5 ? 'Pentagon' : sides === 6 ? 'Hexagon' : sides === 8 ? 'Octagon' : `${sides}-gon`}
            </text>
            <text x="150" y="160" textAnchor="middle" className="text-xs fill-gray-600">
              {sides} sides, radius: {radius}
            </text>
          </>
        )}
      </g>
    );
  };

  const renderGenericShape = (shapeType: string) => {
    return (
      <g>
        <rect
          x="50"
          y="50"
          width="200"
          height="50"
          fill="rgba(156, 163, 175, 0.3)"
          stroke="rgb(156, 163, 175)"
          strokeWidth="2"
          rx="5"
        />
        <text x="150" y="80" textAnchor="middle" className="text-sm fill-gray-700">
          {shapeType.replace('_', ' ')}
        </text>
      </g>
    );
  };

  const getFormulas = () => {
    const shapeType = shape.toLowerCase();
    
    switch (shapeType) {
      case 'triangle':
        return ['Area = ½ × base × height', 'Perimeter = a + b + c'];
      case 'square':
        return [`Area = side²`, 'Perimeter = 4 × side'];
      case 'rectangle':
        return ['Area = length × width', 'Perimeter = 2(l + w)'];
      case 'circle':
        return ['Area = πr²', 'Circumference = 2πr'];
      case 'pentagon':
      case 'hexagon':
      case 'octagon':
        return ['Area = ½ × perimeter × apothem', 'Perimeter = number of sides × side length'];
      default:
        return [];
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex flex-col items-center">
        <svg width="300" height="150" viewBox="0 0 300 150" className="border border-gray-100 rounded">
          {renderShape()}
        </svg>
        
        {showFormulas && getFormulas().length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            <div className="font-medium text-gray-700 mb-1">Formulas:</div>
            {getFormulas().map((formula, index) => (
              <div key={index} className="text-xs">{formula}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Pre-configured shape components
export function SimpleTriangle(props: { sides?: number[]; showMeasurements?: boolean; showFormulas?: boolean }) {
  return <SimpleSVGVisualizer shape="triangle" dimensions={props.sides} {...props} />;
}

export function SimpleSquare(props: { side?: number; showMeasurements?: boolean; showFormulas?: boolean }) {
  return <SimpleSVGVisualizer shape="square" dimensions={[props.side || 100]} {...props} />;
}

export function SimpleRectangle(props: { width?: number; height?: number; showMeasurements?: boolean; showFormulas?: boolean }) {
  return <SimpleSVGVisualizer shape="rectangle" dimensions={[props.width || 120, props.height || 80]} {...props} />;
}

export function SimpleCircle(props: { radius?: number; showMeasurements?: boolean; showFormulas?: boolean }) {
  return <SimpleSVGVisualizer shape="circle" dimensions={[props.radius || 50]} {...props} />;
}
