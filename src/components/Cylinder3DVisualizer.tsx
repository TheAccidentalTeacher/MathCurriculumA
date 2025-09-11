'use client';

import React from 'react';

interface Cylinder3DVisualizerProps {
  radius?: number;
  height?: number;
  showVolume?: boolean;
  showFormula?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function Cylinder3DVisualizer({ 
  radius = 2, 
  height = 5,
  showVolume = true,
  showFormula = true,
  interactive = true,
  className = '' 
}: Cylinder3DVisualizerProps) {
  
  const volume = Math.PI * Math.pow(radius, 2) * height;
  const surfaceArea = 2 * Math.PI * radius * (radius + height);
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">3D Cylinder Visualizer</h3>
        <p className="text-sm text-gray-600">Interactive 3D cylinder with radius {radius} and height {height} units (Volume = {volume.toFixed(2)} cubic units)</p>
      </div>
      
      {/* CSS 3D Cylinder */}
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
            {/* Cylinder body */}
            <div 
              className="absolute transition-transform duration-500 hover:scale-105"
              style={{
                width: '80px',
                height: '120px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'linear-gradient(to right, #4ade80, #22c55e, #16a34a)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset -10px 0 20px rgba(0,0,0,0.2)',
                border: '2px solid #15803d',
                borderRadius: '0 0 0 0'
              }}
            >
              {/* Top ellipse */}
              <div 
                className="absolute"
                style={{
                  width: '84px',
                  height: '20px',
                  left: '50%',
                  top: '-2px',
                  transform: 'translateX(-50%)',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, #65f573, #4ade80)',
                  border: '2px solid #15803d',
                  boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.2)'
                }}
              />
              
              {/* Bottom ellipse */}
              <div 
                className="absolute"
                style={{
                  width: '84px',
                  height: '20px',
                  left: '50%',
                  bottom: '-2px',
                  transform: 'translateX(-50%)',
                  borderRadius: '50%',
                  background: 'radial-gradient(ellipse, #22c55e, #16a34a)',
                  border: '2px solid #15803d',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.4)'
                }}
              />
              
              {/* Highlight for 3D effect */}
              <div 
                className="absolute"
                style={{
                  width: '15px',
                  height: '100px',
                  left: '20%',
                  top: '10px',
                  background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), rgba(255,255,255,0.2))',
                  borderRadius: '50px'
                }}
              />
            </div>
            
            {/* Shadow */}
            <div 
              className="absolute"
              style={{
                width: '120px',
                height: '25px',
                left: '50%',
                bottom: '10px',
                transform: 'translateX(-50%)',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.2)',
                filter: 'blur(8px)'
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Information Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {showVolume && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Volume</h4>
            <p className="text-green-700 text-lg font-mono">{volume.toFixed(2)} cubic units</p>
            <p className="text-green-600 text-sm">Surface Area: {surfaceArea.toFixed(2)} square units</p>
          </div>
        )}
        
        {showFormula && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Formulas</h4>
            <p className="text-blue-700 text-sm font-mono mb-1">Volume = πr²h</p>
            <p className="text-blue-700 text-sm font-mono">Surface Area = 2πr(r + h)</p>
            <p className="text-blue-600 text-xs mt-2">Where r = {radius}, h = {height}</p>
          </div>
        )}
      </div>
      
      {interactive && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">💡 Hover over the cylinder to interact!</p>
        </div>
      )}
    </div>
  );
}
