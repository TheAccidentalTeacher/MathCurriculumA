'use client';

import { useState } from 'react';
import GeoGebraWidget, { PowersOf10GeoGebra, GeometryExplorer, FunctionGrapher } from '@/components/GeoGebraWidget';

export default function TestGeoGebraPage() {
  const [testMode, setTestMode] = useState<'basic' | 'powers10' | 'geometry' | 'function'>('basic');

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
          <h2 className="text-xl font-semibold mb-4">
            {testMode === 'basic' && 'Basic GeoGebra Widget'}
            {testMode === 'powers10' && 'Powers of 10 Activity'}
            {testMode === 'geometry' && 'Geometry Explorer'}
            {testMode === 'function' && 'Function Grapher'}
          </h2>
          
          {testMode === 'basic' && (
            <GeoGebraWidget
              appName="graphing"
              commands={[
                'f(x) = x^2',
                'g(x) = 2*x + 1',
                'A = (0, 0)',
                'B = (2, 4)'
              ]}
              width={700}
              height={500}
              showAlgebraInput={true}
              showToolBar={true}
              onReady={() => console.log('Basic GeoGebra widget ready!')}
            />
          )}

          {testMode === 'powers10' && (
            <PowersOf10GeoGebra
              width={700}
              height={400}
              onReady={() => console.log('Powers of 10 widget ready!')}
            />
          )}

          {testMode === 'geometry' && (
            <GeometryExplorer
              width={700}
              height={500}
              onReady={() => console.log('Geometry explorer ready!')}
            />
          )}

          {testMode === 'function' && (
            <FunctionGrapher
              width={700}
              height={500}
              commands={[
                'f(x) = sin(x)',
                'g(x) = cos(x)',
                'h(x) = tan(x/2)'
              ]}
              onReady={() => console.log('Function grapher ready!')}
            />
          )}
        </div>

        {/* Debug Information */}
        <div className="mt-8 bg-gray-800 text-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <p className="text-sm">
            • Current test mode: <span className="font-mono">{testMode}</span><br/>
            • GeoGebra API loaded: <span className="font-mono">{typeof window !== 'undefined' && (window as any).GGBApplet ? 'Yes' : 'No'}</span><br/>
            • Check browser console for detailed logs
          </p>
        </div>
      </div>
    </div>
  );
}
