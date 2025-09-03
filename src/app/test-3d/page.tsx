'use client';

import { useState } from 'react';
import GeoGebraWidget from '@/components/GeoGebraWidget';
import { ChatCubeVisualizer } from '@/components/ChatGeoGebra';

export default function Test3DPage() {
  const [testMode, setTestMode] = useState<'basic' | 'cube' | 'chat'>('basic');

  // Test different 3D approaches
  const basicCubeCommands = [
    'SetActiveView(1)',
    'cube = Cube((0,0,0), (1,1,1))',
    'SetColor(cube, "blue")',
  ];

  const advancedCubeCommands = [
    // Ensure 3D view is active
    'SetActiveView(1)',
    
    // Create cube vertices
    'A = (0, 0, 0)',
    'B = (1, 0, 0)', 
    'C = (1, 1, 0)',
    'D = (0, 1, 0)',
    'E = (0, 0, 1)',
    'F = (1, 0, 1)',
    'G = (1, 1, 1)', 
    'H = (0, 1, 1)',
    
    // Create cube
    'cube = Cube(A, B, C, D, E, F, G, H)',
    'SetColor(cube, "lightblue")',
    'SetFilling(cube, 0.3)',
  ];

  const simpleCubeCommands = [
    // Most basic approach
    'cube = Cube((0,0,0), (1,0,0), (0,1,0), (0,0,1))',
    'SetColor(cube, "red")',
  ];

  const getCurrentCommands = () => {
    switch(testMode) {
      case 'basic': return basicCubeCommands;
      case 'cube': return advancedCubeCommands;
      default: return simpleCubeCommands;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">3D GeoGebra Test</h1>
        
        {/* Test Mode Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Test Mode:</label>
          <div className="flex space-x-4">
            {[
              { key: 'basic', label: 'Basic Cube' },
              { key: 'cube', label: 'Advanced Cube' },
              { key: 'chat', label: 'Chat Component' }
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

        {/* 3D Widget Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">3D Cube Visualization Test</h2>
          
          {testMode === 'chat' ? (
            <ChatCubeVisualizer cubeCount={1} showDecomposition={false} />
          ) : (
            <div>
              <GeoGebraWidget
                appName="3d"
                commands={getCurrentCommands()}
                width={700}
                height={500}
                showAlgebraInput={true}
                showToolBar={true}
                onReady={() => console.log(`3D ${testMode} widget ready!`)}
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <h3 className="font-semibold mb-2">Commands being executed:</h3>
                <div className="space-y-1">
                  {getCurrentCommands().map((command, index) => (
                    <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                      {command}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Debug Information */}
        <div className="mt-8 bg-gray-800 text-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p className="text-sm">
            • Current test mode: <span className="font-mono">{testMode}</span><br/>
            • App type: <span className="font-mono">3d</span><br/>
            • Commands count: <span className="font-mono">{getCurrentCommands().length}</span><br/>
            • GeoGebra API loaded: <span className="font-mono">{typeof window !== 'undefined' && (window as any).GGBApplet ? 'Yes' : 'No'}</span><br/>
            • Check browser console for detailed logs<br/>
            • Expected: Interactive 3D cube that can be rotated
          </p>
        </div>
      </div>
    </div>
  );
}
