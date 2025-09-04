'use client';

import React from 'react';
import GeometryVisualizer, { CubeExplorer, SphereExplorer, CylinderExplorer } from '../../components/GeometryVisualizer';
import { ChatCubeVisualizer } from '../../components/ChatGeoGebra';

export default function DebugGeometry() {
  // Simulate the exact same marker processing logic from ChatInterface
  const testContent = "Let's explore these 3D shapes: [CUBE:4] and [SHAPE:cylinder,2,5] and [SHAPE:sphere,3]!";
  
  const processMarkers = (content: string) => {
    // Split by the regex pattern used in ChatInterface
    const regex = /(\[CUBE:[^\]]+\]|\[SHAPE:[^\]]+\])/g;
    const parts = content.split(regex);
    
    console.log('Processing markers:', parts);
    
    return parts.map((part, index) => {
      // Process cube markers
      const chatCubeMatch = part.match(/\[CUBE:([^\]]+)\]/);
      if (chatCubeMatch) {
        const cubeParams = chatCubeMatch[1].split(',');
        const cubeCount = parseInt(cubeParams[0]) || 8;
        const showDecomposition = cubeParams[1] !== 'false';
        
        console.log('Rendering ChatCubeVisualizer:', { cubeCount, showDecomposition });
        
        return (
          <div key={index} className="my-4 border-2 border-blue-500 p-4 rounded">
            <h3 className="font-bold text-blue-600">CUBE MARKER PROCESSED</h3>
            <ChatCubeVisualizer 
              cubeCount={cubeCount}
              showDecomposition={showDecomposition}
            />
          </div>
        );
      }
      
      // Process shape markers
      const shapeMatch = part.match(/\[SHAPE:([^,\]]+)(?:,([^,\]]+))*(?:,([^,\]]+))*(?:,([^,\]]+))?\]/);
      if (shapeMatch) {
        const shapeName = shapeMatch[1].toLowerCase();
        const dimensions = [shapeMatch[2], shapeMatch[3], shapeMatch[4]]
          .filter(Boolean)
          .map(d => parseFloat(d!));
        
        console.log('Processing shape:', { shapeName, dimensions });
        
        if (shapeName === 'cube') {
          return (
            <div key={index} className="my-4 border-2 border-green-500 p-4 rounded">
              <h3 className="font-bold text-green-600">SHAPE:CUBE MARKER PROCESSED</h3>
              <CubeExplorer side={dimensions[0]} />
            </div>
          );
        }
        
        if (shapeName === 'sphere') {
          return (
            <div key={index} className="my-4 border-2 border-red-500 p-4 rounded">
              <h3 className="font-bold text-red-600">SHAPE:SPHERE MARKER PROCESSED</h3>
              <SphereExplorer radius={dimensions[0]} />
            </div>
          );
        }
        
        if (shapeName === 'cylinder') {
          return (
            <div key={index} className="my-4 border-2 border-purple-500 p-4 rounded">
              <h3 className="font-bold text-purple-600">SHAPE:CYLINDER MARKER PROCESSED</h3>
              <CylinderExplorer radius={dimensions[0]} height={dimensions[1]} />
            </div>
          );
        }
        
        // Fallback - use GeometryVisualizer
        return (
          <div key={index} className="my-4 border-2 border-yellow-500 p-4 rounded">
            <h3 className="font-bold text-yellow-600">FALLBACK GEOMETRY VISUALIZER</h3>
            <GeometryVisualizer shape={shapeName} dimensions={dimensions} />
          </div>
        );
      }
      
      // Return plain text
      if (part && !part.match(/\[(CUBE|SHAPE):/)) {
        return <span key={index}>{part}</span>;
      }
      
      return null;
    });
  };
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Geometry Marker Processing</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-4">Test Content:</h2>
        <code className="text-sm">{testContent}</code>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Processed Markers:</h2>
        {processMarkers(testContent)}
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Manual Test - Direct Components:</h2>
        
        <div className="space-y-6">
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">ChatCubeVisualizer (used by [CUBE:4])</h3>
            <ChatCubeVisualizer cubeCount={4} showDecomposition={true} />
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">CubeExplorer (used by [SHAPE:cube,4])</h3>
            <CubeExplorer side={4} />
          </div>
          
          <div className="border p-4 rounded">
            <h3 className="font-bold mb-2">CylinderExplorer (used by [SHAPE:cylinder,2,5])</h3>
            <CylinderExplorer radius={2} height={5} />
          </div>
        </div>
      </div>
    </div>
  );
}
