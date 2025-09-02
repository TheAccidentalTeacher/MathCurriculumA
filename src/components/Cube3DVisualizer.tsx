'use client';

import React from 'react';
import GeoGebraWidget from './GeoGebraWidget';

interface Cube3DVisualizerProps {
  sideLength?: number;
  showVolume?: boolean;
  showFormula?: boolean;
  interactive?: boolean;
  className?: string;
}

export default function Cube3DVisualizer({ 
  sideLength = 4, 
  showVolume = true,
  showFormula = true,
  interactive = true,
  className = '' 
}: Cube3DVisualizerProps) {
  
  const volume = Math.pow(sideLength, 3);
  
  const commands = [
    // Create the cube
    `A = (0, 0, 0)`,
    `B = (${sideLength}, 0, 0)`,
    `C = (${sideLength}, ${sideLength}, 0)`,
    `D = (0, ${sideLength}, 0)`,
    `E = (0, 0, ${sideLength})`,
    `F = (${sideLength}, 0, ${sideLength})`,
    `G = (${sideLength}, ${sideLength}, ${sideLength})`,
    `H = (0, ${sideLength}, ${sideLength})`,
    
    // Create the cube faces
    `face1 = Polygon(A, B, C, D)`,
    `face2 = Polygon(E, F, G, H)`,
    `face3 = Polygon(A, B, F, E)`,
    `face4 = Polygon(B, C, G, F)`,
    `face5 = Polygon(C, D, H, G)`,
    `face6 = Polygon(D, A, E, H)`,
    
    // Make faces semi-transparent
    `SetColor(face1, "blue")`,
    `SetColor(face2, "blue")`,
    `SetColor(face3, "lightblue")`,
    `SetColor(face4, "lightblue")`,
    `SetColor(face5, "lightblue")`,
    `SetColor(face6, "lightblue")`,
    
    // Add transparency
    `SetFilling(face1, 0.3)`,
    `SetFilling(face2, 0.3)`,
    `SetFilling(face3, 0.3)`,
    `SetFilling(face4, 0.3)`,
    `SetFilling(face5, 0.3)`,
    `SetFilling(face6, 0.3)`,
    
    // Add edge lines for better visualization
    `Segment(A, B)`,
    `Segment(B, C)`,
    `Segment(C, D)`,
    `Segment(D, A)`,
    `Segment(E, F)`,
    `Segment(F, G)`,
    `Segment(G, H)`,
    `Segment(H, E)`,
    `Segment(A, E)`,
    `Segment(B, F)`,
    `Segment(C, G)`,
    `Segment(D, H)`,
    
    // Add labels if interactive
    ...(interactive ? [
      `SetCaption(A, "A(0,0,0)")`,
      `SetCaption(G, "G(${sideLength},${sideLength},${sideLength})")`,
      `ShowLabel(A, true)`,
      `ShowLabel(G, true)`
    ] : []),
    
    // Add volume text
    ...(showVolume ? [
      `Text("Volume = ${sideLength}³ = ${volume} cubic units", (${sideLength/2}, ${sideLength + 1}, 0))`
    ] : []),
    
    // Add formula text
    ...(showFormula ? [
      `Text("Formula: V = s³", (${sideLength/2}, ${sideLength + 2}, 0))`
    ] : [])
  ];

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800">3D Cube Visualizer</h3>
        <p className="text-sm text-gray-600">
          Interactive 3D cube with side length {sideLength} units (Volume = {volume} cubic units)
        </p>
      </div>
      
      <GeoGebraWidget
        appName="3d"
        commands={commands}
        width={600}
        height={500}
        showAlgebraInput={interactive}
        showToolBar={interactive}
        showMenuBar={false}
        enableRightClick={interactive}
        onReady={() => console.log('3D Cube visualizer loaded')}
      />
      
      {showVolume && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800">Volume Calculation:</h4>
          <p className="text-blue-700">
            V = side × side × side = {sideLength} × {sideLength} × {sideLength} = <strong>{volume} cubic units</strong>
          </p>
        </div>
      )}
      
      {interactive && (
        <div className="mt-3 text-sm text-gray-600">
          <p>💡 <strong>Tip:</strong> Use your mouse to rotate and explore the 3D cube!</p>
        </div>
      )}
    </div>
  );
}

// Pre-configured cube visualizers for common use cases
export function CubeVolumeExplorer() {
  return <Cube3DVisualizer sideLength={4} showVolume={true} showFormula={true} interactive={true} />;
}

export function SimpleCubeModel(props: { sideLength?: number }) {
  return <Cube3DVisualizer sideLength={props.sideLength || 3} showVolume={false} showFormula={false} interactive={false} />;
}

export function InteractiveCubeLab() {
  return <Cube3DVisualizer sideLength={5} showVolume={true} showFormula={true} interactive={true} />;
}
