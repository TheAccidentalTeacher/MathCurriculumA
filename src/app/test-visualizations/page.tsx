'use client';

import React from 'react';
import SimpleSVGVisualizer, { SimpleTriangle, SimpleSquare, SimpleRectangle, SimpleCircle } from '../../components/SimpleSVGVisualizer';

export default function TestVisualizationsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Shape Visualization Test</h1>
      <p className="text-gray-600 mb-8">Testing our new SVG-based shape visualizations</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic shapes */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Triangle</h3>
          <SimpleTriangle sides={[80, 80, 80]} showMeasurements={true} showFormulas={true} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Square</h3>
          <SimpleSquare side={80} showMeasurements={true} showFormulas={true} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Rectangle</h3>
          <SimpleRectangle width={100} height={60} showMeasurements={true} showFormulas={true} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Circle</h3>
          <SimpleCircle radius={40} showMeasurements={true} showFormulas={true} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Pentagon</h3>
          <SimpleSVGVisualizer shape="pentagon" dimensions={[50]} showMeasurements={true} showFormulas={true} />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Hexagon</h3>
          <SimpleSVGVisualizer shape="hexagon" dimensions={[45]} showMeasurements={true} showFormulas={true} />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test in AI Chat Context</h2>
        <p className="text-gray-600 mb-4">This simulates how shapes appear in the AI tutor responses:</p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-gray-800 mb-4">
            <p><strong>Mr. Somers:</strong> Let's learn about triangles! A triangle has three sides and three angles.</p>
          </div>
          
          <SimpleTriangle sides={[60, 60, 60]} showMeasurements={true} showFormulas={false} />
          
          <div className="text-gray-800 mt-4">
            <p>The area of a triangle is calculated using the formula: Area = ½ × base × height</p>
          </div>
        </div>
      </div>
    </div>
  );
}
