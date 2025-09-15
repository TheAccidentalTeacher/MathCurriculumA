'use client';

import React from 'react';

interface Simple3DFallbackProps {
  shape: string;
  dimensions: any;
  color: string;
  volume: string;
  surfaceArea: string;
}

export default function Simple3DFallback({ shape, dimensions, color, volume, surfaceArea }: Simple3DFallbackProps) {
  console.log('🛑 Simple3DFallback RENDERED instead of 3D!', {
    shape,
    dimensions,
    color,
    volume,
    surfaceArea
  });

  const getShapeIcon = () => {
    switch (shape) {
      case 'cube': return '🧊';
      case 'sphere': return '⚽';
      case 'cylinder': return '🥫';
      case 'cone': return '🎯';
      default: return '📦';
    }
  };

  const getShapeDescription = () => {
    switch (shape) {
      case 'cube':
        return `Width: ${dimensions.width || 2}, Height: ${dimensions.height || 2}, Depth: ${dimensions.depth || 2}`;
      case 'sphere':
        return `Radius: ${dimensions.radius || 1}`;
      case 'cylinder':
        return `Radius: ${dimensions.radius || 1}, Height: ${dimensions.height || 2}`;
      case 'cone':
        return `Radius: ${dimensions.radius || 1}, Height: ${dimensions.height || 2}`;
      default:
        return 'Various dimensions';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">
            {getShapeIcon()} 3D {shape.charAt(0).toUpperCase() + shape.slice(1)} Explorer
          </h3>
          <div className="text-xs text-orange-600 font-medium">2D Mode</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">Volume:</span> {volume} cubic units
          </div>
          <div>
            <span className="font-medium">Surface Area:</span> {surfaceArea} square units
          </div>
        </div>
      </div>

      {/* Visual representation */}
      <div className="h-96 flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
        <div className="text-center">
          <div className="text-8xl mb-4">{getShapeIcon()}</div>
          <div className="text-lg font-semibold" style={{ color: color }}>
            {shape.charAt(0).toUpperCase() + shape.slice(1)}
          </div>
          <div className="text-sm text-gray-600 mt-2 max-w-xs">
            {getShapeDescription()}
          </div>
          <div className="text-xs text-orange-600 mt-4 max-w-xs">
            3D rendering unavailable - showing 2D representation
          </div>
        </div>
      </div>

      {/* Controls info */}
      <div className="bg-gray-50 px-4 py-2 border-t">
        <div className="text-xs text-gray-600">
          📊 <strong>Educational Mode:</strong> Volume and surface area calculations available • 3D visualization temporarily disabled
        </div>
      </div>
    </div>
  );
}
