'use client';

import React from 'react';

interface Sphere3DVisualizerProps {
  radius?: number;
  showVolume?: boolean;
  showFormula?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function Sphere3DVisualizer({ 
  radius = 3, 
  showVolume = true,
  showFormula = true,
  interactive = true,
  className = '' 
}: Sphere3DVisualizerProps) {
  
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  const surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">3D Sphere Visualizer</h3>
        <p className="text-sm text-gray-600">Interactive 3D sphere with radius {radius} units (Volume = {volume.toFixed(2)} cubic units)</p>
      </div>
      
      {/* CSS 3D Sphere */}
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
            {/* Main sphere using gradient and border-radius */}
            <div 
              className="absolute transition-transform duration-500 hover:scale-110"
              style={{
                width: '120px',
                height: '120px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #ff6b6b, #ee5a5a, #dc4444)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset -10px -10px 20px rgba(0,0,0,0.2)',
                border: '2px solid #cc3333'
              }}
            >
              {/* Highlight for 3D effect */}
              <div 
                className="absolute"
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8), rgba(255,255,255,0.3))',
                  top: '25%',
                  left: '25%'
                }}
              />
            </div>
            
            {/* Shadow */}
            <div 
              className="absolute"
              style={{
                width: '140px',
                height: '20px',
                left: '50%',
                bottom: '-10px',
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">Volume</h4>
            <p className="text-red-700 text-lg font-mono">{volume.toFixed(2)} cubic units</p>
            <p className="text-red-600 text-sm">Surface Area: {surfaceArea.toFixed(2)} square units</p>
          </div>
        )}
        
        {showFormula && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Formulas</h4>
            <p className="text-blue-700 text-sm font-mono mb-1">Volume = ⁴⁄₃πr³</p>
            <p className="text-blue-700 text-sm font-mono">Surface Area = 4πr²</p>
            <p className="text-blue-600 text-xs mt-2">Where r = {radius}</p>
          </div>
        )}
      </div>
      
      {interactive && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">💡 Hover over the sphere to interact!</p>
        </div>
      )}
    </div>
  );
}
