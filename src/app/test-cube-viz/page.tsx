'use client';

import { useState } from 'react';
import ChatGeoGebra from '@/components/ChatGeoGebra';
import Cube3DVisualizer from '@/components/Cube3DVisualizer';

export default function TestCubeVisualizationPage() {
  const [testMode, setTestMode] = useState<'chat-cube' | 'cube-visualizer' | 'cube-commands'>('chat-cube');

  const cubeCommands = [
    'A = (0, 0, 0)',
    'B = (2, 0, 0)', 
    'C = (2, 2, 0)',
    'D = (0, 2, 0)',
    'E = (0, 0, 2)',
    'F = (2, 0, 2)',
    'G = (2, 2, 2)',
    'H = (0, 2, 2)',
    'Polygon(A, B, C, D)',
    'Polygon(E, F, G, H)',
    'Segment(A, E)',
    'Segment(B, F)',
    'Segment(C, G)', 
    'Segment(D, H)',
    'SetCaption(A, "Vertex A")',
    'SetCaption(G, "Vertex G (opposite)")'
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🧊 Cube Visualization Test</h1>
        
        {/* Test Mode Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Visualization Mode:</label>
          <div className="flex space-x-4">
            {[
              { key: 'chat-cube', label: 'Chat-Optimized Cube' },
              { key: 'cube-visualizer', label: 'Cube Visualizer Component' },
              { key: 'cube-commands', label: 'Custom Cube Commands' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTestMode(key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  testMode === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {testMode === 'chat-cube' && 'Chat-Optimized Cube (Same as Virtual Tutor)'}
            {testMode === 'cube-visualizer' && 'Dedicated Cube Visualizer'}
            {testMode === 'cube-commands' && 'Custom Cube with Commands'}
          </h2>
          
          {testMode === 'chat-cube' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <h3 className="font-semibold text-blue-800 mb-2">📐 Interactive Math Activity</h3>
                <p className="text-blue-700 text-sm mb-3">This is exactly what appears in the Virtual Tutor chat when someone asks about cubes:</p>
                <ChatGeoGebra
                  appName="3d"
                  commands={[
                    'Cube((0,0,0), (2,0,0))',
                    'SetColor(cube1, "blue")',
                    'ShowLabel(cube1, true)'
                  ]}
                  title="3D Cube Explorer"
                  description="Interactive cube for understanding 3D geometry and volume concepts"
                />
              </div>
            </div>
          )}

          {testMode === 'cube-visualizer' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <h3 className="font-semibold text-green-800 mb-2">🧊 Dedicated Cube Component</h3>
                <p className="text-green-700 text-sm mb-3">This uses the specialized Cube3DVisualizer component:</p>
                <Cube3DVisualizer
                  sideLength={3}
                  showVolume={true}
                  showFormula={true}
                  interactive={true}
                />
              </div>
            </div>
          )}

          {testMode === 'cube-commands' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded">
                <h3 className="font-semibold text-purple-800 mb-2">⚡ Custom Cube Commands</h3>
                <p className="text-purple-700 text-sm mb-3">This shows a cube built with individual vertex commands:</p>
                <ChatGeoGebra
                  appName="3d"
                  commands={cubeCommands}
                  title="Custom Cube Construction"
                  description="Step-by-step cube construction showing all vertices and edges"
                />
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gray-800 text-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 Testing Instructions:</h3>
          <div className="text-sm space-y-1">
            <p>• <strong>Chat-Optimized Cube:</strong> This is what users see in Virtual Tutor chat</p>
            <p>• <strong>Cube Visualizer:</strong> Specialized component for cube-specific features</p>  
            <p>• <strong>Custom Commands:</strong> Manual cube construction with all vertices</p>
            <p>• All widgets should load within 5-10 seconds without hanging</p>
            <p>• They should be contained within their boxes (no popups/new windows)</p>
            <p>• Interactive controls should work smoothly</p>
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debug Info:</h3>
          <div className="text-sm text-yellow-700">
            <p>• GeoGebra API Status: {typeof window !== 'undefined' && (window as any).GGBApplet ? '✅ Loaded' : '⏳ Loading'}</p>
            <p>• Current Mode: <code className="bg-yellow-100 px-1 rounded">{testMode}</code></p>
            <p>• Check browser console for detailed logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
