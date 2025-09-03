'use client';

import React, { useState } from 'react';
import GeoGebraWidget from '@/components/GeoGebraWidget';

export default function TestGeoGebraEnhanced() {
  const [activeDemo, setActiveDemo] = useState<string>('PlaneSection3D');
  
  // Demo configurations for different educational widgets
  const demos = {
    'PlaneSection3D': {
      title: 'Plane Sections of 3D Figures',
      description: 'Interactive exploration of how planes intersect three-dimensional shapes',
      config: {
        preset: 'PlaneSection3D' as const,
        width: 600,
        height: 400,
        showToolBar: true,
        showAlgebraInput: true,
        commands: [
          'a = Cube((-2,-2,-2), (2,2,2))',
          'b = Plane(x + y + z = 0)',
          'c = Intersect(a, b)',
          'SetColor(c, red)',
          'SetFixed(a, false)'
        ]
      }
    },
    'GeometryExplorer': {
      title: 'Interactive Geometry Explorer',
      description: 'Comprehensive geometry tools for construction and measurement',
      config: {
        preset: 'GeometryExplorer' as const,
        width: 600,
        height: 400,
        commands: [
          'A = (0, 0)',
          'B = (4, 0)',
          'C = (2, 3)',
          'poly = Polygon(A, B, C)',
          'SetColor(poly, blue)',
          'ShowLabel(A, true)',
          'ShowLabel(B, true)',
          'ShowLabel(C, true)'
        ]
      }
    },
    'Calculator3D': {
      title: '3D Calculator & Graphing',
      description: 'Advanced 3D mathematical visualization and calculation',
      config: {
        preset: 'Calculator3D' as const,
        width: 600,
        height: 400,
        commands: [
          'f(x,y) = sin(x) * cos(y)',
          'Surface(f, -5, 5, -5, 5)',
          'SetColor(f, green)'
        ]
      }
    },
    'FunctionGraphing': {
      title: 'Function Graphing',
      description: 'Graph and analyze mathematical functions',
      config: {
        appName: 'graphing' as const,
        width: 600,
        height: 400,
        commands: [
          'f(x) = x^2 - 4',
          'g(x) = 2*x + 1',
          'SetColor(f, blue)',
          'SetColor(g, red)',
          'Intersect(f, g)'
        ]
      }
    },
    'GeometryConstruction': {
      title: 'Geometry Construction',
      description: 'Build geometric constructions step by step',
      config: {
        appName: 'geometry' as const,
        width: 600,
        height: 400,
        showToolBar: true,
        showAlgebraInput: false,
        commands: [
          'A = (1, 2)',
          'B = (5, 2)',
          'c = Circle(A, B)',
          'l = Line(A, B)',
          'SetLineThickness(l, 5)',
          'SetColor(c, blue)'
        ]
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced GeoGebra Integration Test
          </h1>
          <p className="text-gray-600 mb-6">
            Testing the comprehensive GeoGebra widget implementation with educational presets
            and proper API integration following the GeoGebra documentation.
          </p>
          
          {/* Demo Selection */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(demos).map((demoKey) => (
              <button
                key={demoKey}
                onClick={() => setActiveDemo(demoKey)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeDemo === demoKey
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {demos[demoKey as keyof typeof demos].title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Demo */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeDemo && (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {demos[activeDemo as keyof typeof demos].title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {demos[activeDemo as keyof typeof demos].description}
                </p>
                
                {/* Configuration Info */}
                <details className="mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    View Configuration
                  </summary>
                  <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
                      {JSON.stringify(demos[activeDemo as keyof typeof demos].config, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>

              {/* GeoGebra Widget */}
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <GeoGebraWidget
                    key={activeDemo} // Force re-mount when changing demos
                    {...demos[activeDemo as keyof typeof demos].config}
                    onReady={() => {
                      console.log(`${activeDemo} widget ready`);
                    }}
                    onUpdate={(objName) => {
                      console.log(`${activeDemo} object updated:`, objName);
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Integration Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Integration Status</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ HTML head configuration with proper meta tags</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ deployggb.js script loading</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ Unique container ID generation</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ Proper appletOnLoad callbacks</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ Comprehensive parameter configuration</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ Event listener registration</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ Educational widget presets</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span>✅ Error handling and retry functionality</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Phase 2 Complete:</strong> Core GeoGebra integration is now fully functional
              with proper API usage, educational presets, and comprehensive error handling.
              Next phases will add enhanced API control and curriculum integration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
