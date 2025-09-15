'use client';

import React, { useState } from 'react';
import ThreeGeometryVisualizer from '../../components/ThreeGeometryVisualizer';

export default function Test3DFixPage() {
  const [activeShape, setActiveShape] = useState<'cube' | 'sphere' | 'cylinder' | 'cone'>('cube');
  
  const shapes = [
    {
      key: 'cube',
      name: 'Cube',
      props: {
        shape: 'cube' as const,
        dimensions: { width: 3, height: 3, depth: 3 },
        color: '#4f46e5',
        animation: 'rotate' as const
      }
    },
    {
      key: 'sphere',
      name: 'Sphere', 
      props: {
        shape: 'sphere' as const,
        dimensions: { radius: 2 },
        color: '#059669',
        animation: 'bounce' as const
      }
    },
    {
      key: 'cylinder',
      name: 'Cylinder',
      props: {
        shape: 'cylinder' as const,
        dimensions: { radius: 1.5, height: 3 },
        color: '#dc2626',
        animation: 'none' as const
      }
    },
    {
      key: 'cone',
      name: 'Cone',
      props: {
        shape: 'cone' as const,
        dimensions: { radius: 1.5, height: 3 },
        color: '#7c3aed',
        animation: 'rotate' as const
      }
    }
  ];

  const currentShape = shapes.find(s => s.key === activeShape);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">3D Visualizer Fix Test</h1>
      
      {/* Shape Selector */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Shape to Test:</h2>
        <div className="flex gap-4">
          {shapes.map((shape) => (
            <button
              key={shape.key}
              onClick={() => setActiveShape(shape.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeShape === shape.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {shape.name}
            </button>
          ))}
        </div>
      </div>

      {/* Single 3D Visualizer */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{currentShape?.name} Test</h2>
        <div className="max-w-2xl">
          {currentShape && (
            <ThreeGeometryVisualizer
              {...currentShape.props}
              showMeasurements={true}
              showAxes={true}
              interactive={true}
            />
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Fix Status</h3>
        <ul className="text-green-700 space-y-1">
          <li>✅ Added WebGL context manager to prevent context exhaustion</li>
          <li>✅ Limited simultaneous 3D contexts (max 4)</li>
          <li>✅ Reduced GPU load with optimized settings</li>
          <li>✅ Single shape display to avoid "Context Lost" errors</li>
        </ul>
        <p className="text-green-700 mt-2">
          <strong>Test:</strong> Switch between shapes. Each should load properly without WebGL context loss.
        </p>
      </div>
    </div>
  );
}
