'use client';

import { useState } from 'react';
import GeoGebraWidget from '@/components/GeoGebraWidget';

export default function TestGeoGebraPage() {
  const [testMode, setTestMode] = useState<'basic' | 'powers10' | 'geometry' | 'function'>('basic');

  // Pre-configured commands for different test modes
  const testConfigs = {
    basic: {
      appName: 'graphing' as const,
      commands: [
        'f(x) = x^2',
        'g(x) = 2*x + 1',
        'A = (0, 0)',
        'B = (2, 4)'
      ],
      title: 'Basic Graphing Calculator'
    },
    powers10: {
      appName: 'graphing' as const,
      commands: [
        'A = (0, 1)',
        'B = (1, 10)', 
        'C = (2, 100)',
        'D = (3, 1000)',
        'E = (4, 10000)',
        'ShowLabel(A, true)',
        'ShowLabel(B, true)',
        'ShowLabel(C, true)',
        'ShowLabel(D, true)',
        'ShowLabel(E, true)',
        'SetCaption(A, "10^0 = 1")',
        'SetCaption(B, "10^1 = 10")',
        'SetCaption(C, "10^2 = 100")',
        'SetCaption(D, "10^3 = 1000")',
        'SetCaption(E, "10^4 = 10000")'
      ],
      title: 'Powers of 10 Visualization'
    },
    geometry: {
      appName: 'geometry' as const,
      commands: [
        'A = (1, 1)',
        'B = (4, 1)',
        'C = (4, 3)',
        'Triangle(A, B, C)',
        'Circle(A, 2)'
      ],
      title: 'Geometry Explorer'
    },
    function: {
      appName: 'graphing' as const,
      commands: [
        'f(x) = sin(x)',
        'g(x) = cos(x)',
        'h(x) = tan(x/2)'
      ],
      title: 'Function Grapher'
    }
  };

  const currentConfig = testConfigs[testMode];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">GeoGebra Widget Test</h1>
        
        {/* Test Mode Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Test Mode:</label>
          <div className="flex space-x-4">
            {[
              { key: 'basic', label: 'Basic Graphing' },
              { key: 'powers10', label: 'Powers of 10' },
              { key: 'geometry', label: 'Geometry Explorer' },
              { key: 'function', label: 'Function Grapher' }
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

        {/* GeoGebra Widget Display */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">{currentConfig.title}</h2>
          
          <GeoGebraWidget
            appName={currentConfig.appName}
            commands={currentConfig.commands}
            width={700}
            height={500}
            showAlgebraInput={true}
            showToolBar={true}
            onReady={() => console.log(`${currentConfig.title} widget ready!`)}
          />
        </div>

        {/* Commands Display */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-4 text-blue-900">Commands Being Executed:</h3>
          <div className="grid grid-cols-1 gap-2">
            {currentConfig.commands.map((command, index) => (
              <div key={index} className="font-mono text-sm bg-white p-2 rounded border">
                {command}
              </div>
            ))}
          </div>
        </div>

        {/* Debug Information */}
        <div className="mt-8 bg-gray-800 text-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p className="text-sm">
            • Current test mode: <span className="font-mono">{testMode}</span><br/>
            • App type: <span className="font-mono">{currentConfig.appName}</span><br/>
            • Commands count: <span className="font-mono">{currentConfig.commands.length}</span><br/>
            • GeoGebra API loaded: <span className="font-mono">{typeof window !== 'undefined' && (window as any).GGBApplet ? 'Yes' : 'No'}</span><br/>
            • Check browser console for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}
