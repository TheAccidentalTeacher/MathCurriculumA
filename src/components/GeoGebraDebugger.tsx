'use client';

import React from 'react';
import GeoGebraWidget from './GeoGebraWidget';

export default function GeoGebraDebugger() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">GeoGebra Debug Test</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Test 1: Basic 2D Geometry</h3>
        <GeoGebraWidget
          appName="geometry"
          commands={[
            'A = (0, 0)',
            'B = (3, 0)',
            'C = (1.5, 2.6)',
            'triangle = Polygon(A, B, C)',
            'SetColor(triangle, "blue")'
          ]}
          width={400}
          height={300}
          showToolBar={true}
          onReady={() => console.log('2D Geometry loaded successfully')}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Test 2: Simple 3D (Cube)</h3>
        <GeoGebraWidget
          appName="3d"
          commands={[
            'A = (0, 0, 0)',
            'B = (2, 0, 0)',
            'C = (2, 2, 0)',
            'D = (0, 2, 0)',
            'square = Polygon(A, B, C, D)'
          ]}
          width={400}
          height={300}
          showToolBar={true}
          onReady={() => console.log('3D Geometry loaded successfully')}
        />
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Test 3: Basic Graphing</h3>
        <GeoGebraWidget
          appName="graphing"
          commands={[
            'f(x) = x^2',
            'SetColor(f, "red")'
          ]}
          width={400}
          height={300}
          showToolBar={true}
          onReady={() => console.log('Graphing loaded successfully')}
        />
      </div>
    </div>
  );
}
