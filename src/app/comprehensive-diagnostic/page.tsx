'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChatCubeVisualizer } from '../../components/ChatGeoGebra';
import GeometryVisualizer, { CubeExplorer } from '../../components/GeometryVisualizer';

export default function ComprehensiveDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [testContent] = useState("Here's a cube [CUBE:4] and a cylinder [SHAPE:cylinder,2,5]!");

  const addDiagnostic = (message: string) => {
    setDiagnostics(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addDiagnostic('Component mounted');
    
    // Check for GeoGebra global
    const checkGeoGebra = () => {
      if (typeof window !== 'undefined') {
        addDiagnostic(`Window.GGBApplet exists: ${!!window.GGBApplet}`);
        
        // Try to load GeoGebra script manually
        const existingScript = document.querySelector('script[src*="deployggb.js"]');
        addDiagnostic(`GeoGebra script exists: ${!!existingScript}`);
        
        if (!existingScript) {
          addDiagnostic('Loading GeoGebra script...');
          const script = document.createElement('script');
          script.src = 'https://www.geogebra.org/apps/deployggb.js';
          script.onload = () => addDiagnostic('✅ GeoGebra script loaded');
          script.onerror = () => addDiagnostic('❌ GeoGebra script failed to load');
          document.head.appendChild(script);
        }
      }
    };
    
    checkGeoGebra();
    
    // Test marker parsing
    const regex = /(\[CUBE:[^\]]+\]|\[SHAPE:[^\]]+\])/g;
    const parts = testContent.split(regex);
    addDiagnostic(`Marker parsing test: Found ${parts.length} parts`);
    parts.forEach((part, i) => {
      if (part.includes('[CUBE:') || part.includes('[SHAPE:')) {
        addDiagnostic(`  Marker ${i}: ${part}`);
      }
    });
  }, [testContent]);

  // Memoize the processed content to prevent infinite re-renders
  const processedContent = useMemo(() => {
    const regex = /(\[CUBE:[^\]]+\]|\[SHAPE:[^\]]+\])/g;
    const parts = testContent.split(regex);
    
    return parts.map((part, index) => {
      if (part.match(/\[CUBE:([^\]]+)\]/)) {
        return (
          <div key={index} className="my-4 p-4 border-2 border-blue-500 bg-blue-50 rounded">
            <div className="mb-2 text-sm font-bold text-blue-700">
              🔍 CUBE MARKER DETECTED: {part}
            </div>
            <div className="border border-gray-300 rounded p-2 bg-white">
              <ChatCubeVisualizer cubeCount={4} showDecomposition={true} />
            </div>
          </div>
        );
      }
      
      const shapeMatch = part.match(/\[SHAPE:([^,\]]+)(?:,([^,\]]+))*(?:,([^,\]]+))?\]/);
      if (shapeMatch) {
        const shapeName = shapeMatch[1];
        const param1 = shapeMatch[2];
        const param2 = shapeMatch[3];
        
        return (
          <div key={index} className="my-4 p-4 border-2 border-green-500 bg-green-50 rounded">
            <div className="mb-2 text-sm font-bold text-green-700">
              🔍 SHAPE MARKER DETECTED: {part}
            </div>
            <div className="mb-2 text-xs text-gray-600">
              Shape: {shapeName}, Param1: {param1}, Param2: {param2}
            </div>
            <div className="border border-gray-300 rounded p-2 bg-white">
              {shapeName === 'cube' ? (
                <CubeExplorer side={parseFloat(param1) || 4} />
              ) : (
                <GeometryVisualizer 
                  shape={shapeName} 
                  dimensions={[param1, param2].filter(Boolean).map(p => parseFloat(p!))} 
                />
              )}
            </div>
          </div>
        );
      }
      
      return <span key={index}>{part}</span>;
    });
  }, [testContent]); // Dependency on testContent

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">🔬 Comprehensive Geometry Diagnostic</h1>
      
      {/* Diagnostic Log */}
      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
        <h3 className="text-white font-bold mb-2">🔍 Diagnostic Log:</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {diagnostics.map((msg, i) => (
            <div key={i}>{msg}</div>
          ))}
        </div>
      </div>

      {/* Test Content */}
      <div className="bg-yellow-50 p-4 rounded border-2 border-yellow-300">
        <h3 className="font-bold text-yellow-800 mb-2">📝 Test Content:</h3>
        <div className="font-mono text-sm">{testContent}</div>
      </div>

      {/* Processed Results */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">🎯 Processed Marker Results:</h3>
        <div className="space-y-4">
          {processedContent}
        </div>
      </div>

      {/* Manual Component Test */}
      <div className="bg-purple-50 p-4 rounded border-2 border-purple-300">
        <h3 className="font-bold text-purple-800 mb-4">🧪 Manual Component Test:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">ChatCubeVisualizer:</h4>
            <ChatCubeVisualizer cubeCount={4} showDecomposition={true} />
          </div>
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">CubeExplorer:</h4>
            <CubeExplorer side={4} />
          </div>
        </div>
      </div>

      {/* CSS Debugging */}
      <div className="bg-red-50 p-4 rounded border-2 border-red-300">
        <h3 className="font-bold text-red-800 mb-2">🎨 CSS Debugging:</h3>
        <div className="text-sm space-y-1">
          <div>Container width: <span className="font-mono bg-white px-1">auto</span></div>
          <div>Viewport width: <span className="font-mono bg-white px-1">{typeof window !== 'undefined' ? window.innerWidth : 'SSR'}</span></div>
        </div>
      </div>
    </div>
  );
}
