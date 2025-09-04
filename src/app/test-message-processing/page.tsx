'use client';

import { useState } from 'react';

// Simulate the exact processing from ChatInterface
const simulateMessageProcessing = (content: string) => {
  console.group('🔍 Simulating ChatInterface Processing');
  console.log('Content:', content);
  
  // Use the same regex from ChatInterface
  const parts = content.split(/(\[GRAPH:[^\]]+\]|\[PLACEVALUE:[^\]]+\]|\[SCIENTIFIC:[^\]]+\]|\[POWERLINE:[^\]]+\]|\[GEOGEBRA:[^\]]+\]|\[GEOMETRY:[^\]]+\]|\[SHAPE:[^\]]+\]|\[POWERS10:[^\]]+\]|\[CUBE:[^\]]+\]|\[3D:[^\]]+\])/g);
  
  console.log('Split into', parts.length, 'parts');
  parts.forEach((part, i) => {
    if (part.includes('[')) {
      console.log(`Part ${i} (MARKER):`, part);
    }
  });
  
  console.groupEnd();
  
  return parts;
};

export default function TestMessageProcessing() {
  const [testMessages] = useState([
    "Let's explore a 3D cube [CUBE:4] to understand volume!",
    "Here are different 3D shapes: [SHAPE:cylinder,2,5] and [SHAPE:sphere,3]!",
    "Compare these shapes: [SHAPE:cube,4] vs [SHAPE:rectangular_prism,3,4,5]",
    "This lesson covers plane sections of a [CUBE:6] and a [SHAPE:cone,3,5]."
  ]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">🧪 Message Processing Test</h1>
      
      <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
        <h2 className="text-xl font-semibold mb-3">Test Messages (Virtual Tutor Responses)</h2>
        <p className="text-sm text-yellow-700 mb-4">
          These simulate what the virtual tutor would generate. Open browser dev console to see processing logs.
        </p>
        
        {testMessages.map((message, i) => (
          <div key={i} className="mb-6 p-4 bg-white rounded border">
            <div className="mb-2">
              <strong className="text-blue-600">Test #{i + 1}:</strong>
            </div>
            <div className="mb-2 text-sm font-mono bg-gray-100 p-2 rounded">
              {message}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Parts: {simulateMessageProcessing(message).length}
            </div>
            <button
              onClick={() => simulateMessageProcessing(message)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Process in Console
            </button>
          </div>
        ))}
      </div>
      
      <div className="bg-green-50 p-4 rounded border border-green-300">
        <h2 className="text-xl font-semibold mb-3">✅ Expected Behavior</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li><code>[CUBE:4]</code> should render ChatCubeVisualizer with blue styling</li>
          <li><code>[SHAPE:cylinder,2,5]</code> should render CylinderExplorer with green styling</li>
          <li><code>[SHAPE:sphere,3]</code> should render SphereExplorer with red styling</li>
          <li><code>[SHAPE:cube,4]</code> should render CubeExplorer with purple styling</li>
          <li>Each should have clear visual indicators and minimum heights</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 p-4 rounded border border-blue-300">
        <h2 className="text-xl font-semibold mb-3">🔧 Debugging Tips</h2>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Check browser console for geometry processing logs</li>
          <li>Look for "ChatInterface Geometry Processing" log groups</li>
          <li>Verify GeoGebra script loading messages</li>
          <li>Check for any JavaScript errors in Components tab</li>
        </ul>
      </div>
    </div>
  );
}
