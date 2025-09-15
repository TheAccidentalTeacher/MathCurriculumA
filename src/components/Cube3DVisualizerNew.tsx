'use client';

import React from 'react';

interface Cube3DVisualizerProps {
  sideLength?: number;
  showVolume?: boolean;
  showFormula?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function Cube3DVisualizer({ 
  sideLength = 4, 
  showVolume = true,
  showFormula = true,
  interactive = true,
  className = '' 
}: Cube3DVisualizerProps) {
  
  const volume = Math.pow(sideLength, 3);
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">3D Cube Visualizer</h3>
        <p className="text-sm text-gray-600">Interactive 3D cube with side length {sideLength} units (Volume = {volume} cubic units)</p>
      </div>
      
      {/* Simple CSS 3D Cube */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative" style={{ 
          width: '200px', 
          height: '200px',
          perspective: '800px'
        }}>
          <div 
            className="absolute inset-0 transition-transform duration-1000 hover:rotate-y-12 hover:rotate-x-12"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(-15deg) rotateY(15deg)'
            }}
          >
            {/* Front face */}
            <div className="absolute w-32 h-32 bg-blue-400 border-2 border-blue-600 flex items-center justify-center text-white font-bold"
                 style={{ transform: 'translateZ(64px)' }}>
              Front
            </div>
            
            {/* Back face */}
            <div className="absolute w-32 h-32 bg-blue-500 border-2 border-blue-700 flex items-center justify-center text-white font-bold"
                 style={{ transform: 'translateZ(-64px) rotateY(180deg)' }}>
              Back
            </div>
            
            {/* Right face */}
            <div className="absolute w-32 h-32 bg-blue-300 border-2 border-blue-500 flex items-center justify-center text-white font-bold"
                 style={{ transform: 'rotateY(90deg) translateZ(64px)' }}>
              Right
            </div>
            
            {/* Left face */}
            <div className="absolute w-32 h-32 bg-blue-600 border-2 border-blue-800 flex items-center justify-center text-white font-bold"
                 style={{ transform: 'rotateY(-90deg) translateZ(64px)' }}>
              Left
            </div>
            
            {/* Top face */}
            <div className="absolute w-32 h-32 bg-blue-200 border-2 border-blue-400 flex items-center justify-center text-white font-bold"
                 style={{ transform: 'rotateX(90deg) translateZ(64px)' }}>
              Top
            </div>
            
            {/* Bottom face */}
            <div className="absolute w-32 h-32 bg-blue-700 border-2 border-blue-900 flex items-center justify-center text-white font-bold"
                 style={{ transform: 'rotateX(-90deg) translateZ(64px)' }}>
              Bottom
            </div>
          </div>
        </div>
      </div>

      {/* Volume Calculation */}
      {showVolume && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-800 mb-2">Volume Calculation:</h4>
          <p className="text-blue-700">V = side × side × side = {sideLength} × {sideLength} × {sideLength} = <span className="font-bold">{volume} cubic units</span></p>
        </div>
      )}

      {/* Formula */}
      {showFormula && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">💡 Tip:</h4>
          <p className="text-gray-700">Use your mouse to hover over the cube and explore its 3D structure!</p>
          {showFormula && <p className="text-sm text-gray-600 mt-2"><strong>Formula:</strong> V = s³</p>}
        </div>
      )}

      {/* Interactive features */}
      {interactive && (
        <div className="text-center">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-green-50 p-3 rounded">
              <div className="font-semibold text-green-800">Side Length</div>
              <div className="text-green-600">{sideLength} units</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="font-semibold text-purple-800">Volume</div>
              <div className="text-purple-600">{volume} cubic units</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
