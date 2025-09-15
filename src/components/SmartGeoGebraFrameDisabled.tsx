'use client';

import React from 'react';

interface SmartGeoGebraFrameProps {
  shape: string;
  lesson?: string;
  concept?: string;
  width?: number;
  height?: number;
  className?: string;
}

// DISABLED: GeoGebra integration removed by user request
export default function SmartGeoGebraFrame({ 
  shape, 
  lesson, 
  concept, 
  width = 800, 
  height = 600, 
  className = '' 
}: SmartGeoGebraFrameProps) {

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800">
            📐 {shape.charAt(0).toUpperCase() + shape.slice(1)} Visualization
          </h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-500">Disabled</div>
          </div>
        </div>
      </div>
      
      <div 
        className="flex items-center justify-center bg-gray-100"
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🚫</div>
          <div className="font-medium">GeoGebra Visualization Disabled</div>
          <div className="text-xs mt-1">Integration has been removed</div>
          {lesson && <div className="text-xs mt-1">Lesson: {lesson}</div>}
        </div>
      </div>
    </div>
  );
}

// Pre-configured components for common shapes (also disabled)
export const PlaneSection3D = ({ shape }: { shape: string }) => (
  <SmartGeoGebraFrame 
    shape={shape} 
    lesson="plane sections of three-dimensional figures"
    concept="cross-sections"
    width={800}
    height={600}
  />
);

export const Volume3D = ({ shape }: { shape: string }) => (
  <SmartGeoGebraFrame 
    shape={shape} 
    lesson="volume calculations"
    concept="3d volume"
    width={700}
    height={500}
  />
);
