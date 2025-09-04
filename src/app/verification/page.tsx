'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChatCubeVisualizer } from '../../components/ChatGeoGebra';
import GeometryVisualizer, { CubeExplorer, SphereExplorer, CylinderExplorer } from '../../components/GeometryVisualizer';

export default function VisualizationVerification() {
  const [testResult, setTestResult] = useState<string>('Testing...');
  const [visualizations, setVisualizations] = useState<string[]>([]);

  // Test content - matches what virtual tutor generates
  const testContent = "Let's explore plane sections! Here's a [CUBE:4] and a [SHAPE:cylinder,2,5] and a [SHAPE:sphere,3].";

  // Memoize the processed components to prevent infinite re-renders
  const processedComponents = useMemo(() => {
    const results: string[] = [];
    const regex = /(\[CUBE:[^\]]+\]|\[SHAPE:[^\]]+\])/g;
    const parts = testContent.split(regex);
    
    console.log('🔍 Processing:', testContent);
    console.log('Parts:', parts);
    
    const components = parts.map((part, index) => {
      // Process CUBE markers
      const cubeMatch = part.match(/\[CUBE:([^\]]+)\]/);
      if (cubeMatch) {
        results.push(`✅ CUBE marker processed: ${part}`);
        const cubeParams = cubeMatch[1].split(',');
        const cubeCount = parseInt(cubeParams[0]) || 8;
        
        return (
          <div key={index} className="my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="mb-3 flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700">CUBE VISUALIZATION RENDERED</span>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm min-h-[350px]">
              <ChatCubeVisualizer cubeCount={cubeCount} showDecomposition={true} />
            </div>
            <div className="mt-2 text-xs text-blue-600">
              Original marker: <code className="bg-white px-1">{part}</code>
            </div>
          </div>
        );
      }
      
      // Process SHAPE markers
      const shapeMatch = part.match(/\[SHAPE:([^,\]]+)(?:,([^,\]]+))*(?:,([^,\]]+))*(?:,([^,\]]+))?\]/);
      if (shapeMatch) {
        const shapeName = shapeMatch[1].toLowerCase();
        const dimensions = [shapeMatch[2], shapeMatch[3], shapeMatch[4]]
          .filter(Boolean)
          .map(d => parseFloat(d!));
        
        results.push(`✅ SHAPE marker processed: ${part} -> ${shapeName} with dimensions [${dimensions.join(',')}]`);
        
        if (shapeName === 'cylinder') {
          return (
            <div key={index} className="my-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="mb-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">CYLINDER VISUALIZATION RENDERED</span>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm min-h-[400px]">
                <CylinderExplorer radius={dimensions[0]} height={dimensions[1]} />
              </div>
              <div className="mt-2 text-xs text-green-600">
                Original marker: <code className="bg-white px-1">{part}</code>
              </div>
            </div>
          );
        }
        
        if (shapeName === 'sphere') {
          return (
            <div key={index} className="my-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="mb-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-700">SPHERE VISUALIZATION RENDERED</span>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm min-h-[400px]">
                <SphereExplorer radius={dimensions[0]} />
              </div>
              <div className="mt-2 text-xs text-red-600">
                Original marker: <code className="bg-white px-1">{part}</code>
              </div>
            </div>
          );
        }
        
        if (shapeName === 'cube') {
          return (
            <div key={index} className="my-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="mb-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-700">SHAPE-CUBE VISUALIZATION RENDERED</span>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm min-h-[400px]">
                <CubeExplorer side={dimensions[0]} />
              </div>
              <div className="mt-2 text-xs text-purple-600">
                Original marker: <code className="bg-white px-1">{part}</code>
              </div>
            </div>
          );
        }
        
        // Fallback for other shapes
        return (
          <div key={index} className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="mb-3 flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-700">GEOMETRY VISUALIZER RENDERED</span>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-sm min-h-[400px]">
              <GeometryVisualizer shape={shapeName} dimensions={dimensions} />
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              Original marker: <code className="bg-white px-1">{part}</code>
            </div>
          </div>
        );
      }
      
      // Return text content
      return part ? <span key={index}>{part}</span> : null;
    });
    
    // Update visualizations state only once
    setVisualizations(results);
    return components;
  }, [testContent]); // Dependency on testContent

  useEffect(() => {
    // Check if GeoGebra script loads properly
    const checkGeoGebra = () => {
      if (typeof window !== 'undefined') {
        const hasGeoGebra = !!window.GGBApplet;
        const hasScript = !!document.querySelector('script[src*="deployggb.js"]');
        
        setTestResult(`GeoGebra Available: ${hasGeoGebra} | Script Loaded: ${hasScript}`);
        
        if (!hasScript) {
          console.log('Loading GeoGebra script...');
          const script = document.createElement('script');
          script.src = 'https://www.geogebra.org/apps/deployggb.js';
          script.onload = () => {
            console.log('✅ GeoGebra loaded');
            setTestResult('✅ GeoGebra script loaded successfully');
          };
          script.onerror = () => {
            console.error('❌ GeoGebra failed to load');
            setTestResult('❌ GeoGebra script failed to load');
          };
          document.head.appendChild(script);
        }
      }
    };
    
    const timer = setTimeout(checkGeoGebra, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">🎯 Geometry Visualization Verification</h1>
      
      <div className="bg-blue-50 p-4 rounded border border-blue-300">
        <h2 className="text-xl font-semibold mb-2">🔬 System Status</h2>
        <div className="text-sm font-mono">{testResult}</div>
      </div>
      
      <div className="bg-green-50 p-4 rounded border border-green-300">
        <h2 className="text-xl font-semibold mb-2">📝 Test Virtual Tutor Response</h2>
        <div className="text-sm bg-white p-2 rounded font-mono mb-3">
          {testContent}
        </div>
        <h3 className="font-semibold mb-2">Processing Results:</h3>
        <div className="space-y-1">
          {visualizations.map((result, i) => (
            <div key={i} className="text-sm text-green-700">• {result}</div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🎨 Rendered Visualizations</h2>
        <div className="text-sm text-gray-600 mb-4">
          If the fix is working, you should see three distinct visualizations below with clear visual indicators.
        </div>
        {processedComponents}
      </div>
      
      <div className="bg-yellow-50 p-4 rounded border border-yellow-300">
        <h2 className="text-xl font-semibold mb-2">✅ Success Criteria</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Three visualization boxes should appear above</li>
          <li>Each should have colored headers (blue, green, red)</li>
          <li>GeoGebra widgets should load inside white containers</li>
          <li>Minimum heights should prevent invisible widgets</li>
          <li>Original markers should be shown below each visualization</li>
        </ul>
      </div>
    </div>
  );
}
