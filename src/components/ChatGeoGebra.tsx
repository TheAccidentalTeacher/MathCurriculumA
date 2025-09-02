'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import GeoGebraWidget from './GeoGebraWidget';

interface ChatGeoGebraProps {
  commands: string[];
  title?: string;
  description?: string;
  appName?: 'graphing' | 'geometry' | 'calculator' | '3d' | 'cas';
  height?: number;
  className?: string;
}

export default function ChatGeoGebra({
  commands,
  title = "Interactive Math Activity",
  description,
  appName = "graphing",
  height = 300,
  className = ""
}: ChatGeoGebraProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Ensure the widget stays within chat bounds
  const chatOptimizedWidth = Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 100 : 500);
  const chatOptimizedHeight = isExpanded ? Math.min(height + 100, 400) : height;

  return (
    <div 
      ref={containerRef}
      className={`relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden ${className}`}
    >
      {/* Header with expand/collapse */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              📐
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
              {description && (
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isReady && (
              <div className="flex items-center space-x-1 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Ready</span>
              </div>
            )}
            
            <button
              onClick={toggleExpanded}
              className="p-1 hover:bg-blue-100 rounded transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <svg 
                className={`w-4 h-4 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* GeoGebra Widget Container */}
      <div className="relative">
        <div 
          className="transition-all duration-300 ease-in-out"
          style={{ 
            maxHeight: isExpanded ? chatOptimizedHeight + 50 : chatOptimizedHeight,
            overflow: 'hidden'
          }}
        >
          <GeoGebraWidget
            appName={appName}
            commands={commands}
            width={chatOptimizedWidth}
            height={chatOptimizedHeight}
            showAlgebraInput={isExpanded}
            showToolBar={isExpanded}
            showMenuBar={false}
            showResetIcon={true}
            enableRightClick={isExpanded}
            enableLabelDrags={true}
            enableShiftDragZoom={isExpanded}
            onReady={handleReady}
            className="border-none"
          />
        </div>

        {/* Overlay when collapsed to prevent interaction issues */}
        {!isExpanded && (
          <div 
            className="absolute inset-0 bg-transparent cursor-pointer z-10"
            onClick={toggleExpanded}
            title="Click to expand and interact"
          />
        )}
      </div>

      {/* Commands Footer (only show when expanded) */}
      {isExpanded && commands.length > 0 && (
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <details className="group">
            <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
              <span className="font-medium">Mathematical Commands</span>
              <span className="ml-2 group-open:hidden">({commands.length} commands)</span>
            </summary>
            <div className="mt-2 space-y-1">
              {commands.map((command, idx) => (
                <div 
                  key={idx} 
                  className="font-mono text-xs text-gray-700 bg-white px-2 py-1 rounded border"
                >
                  {command}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Compact mode indicator */}
      {!isExpanded && (
        <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium shadow-lg">
          Click to interact
        </div>
      )}
    </div>
  );
}

// Specialized components for common math activities

export function ChatCubeVisualizer({ 
  cubeCount = 8, 
  showDecomposition = true 
}: { 
  cubeCount?: number; 
  showDecomposition?: boolean; 
}) {
  const commands = [
    // Create 3D cube representation
    `cube = Cube((0,0,0), (1,1,1))`,
    `SetColor(cube, "blue")`,
    `SetCaption(cube, "Unit Cube")`,
    
    // Show cube breakdown if requested
    ...(showDecomposition ? [
      `point1 = (0,0,0)`,
      `point2 = (1,0,0)`,
      `point3 = (1,1,0)`,
      `point4 = (0,1,0)`,
      `base = Polygon(point1, point2, point3, point4)`,
      `SetCaption(base, "Base: 1×1 = 1 square unit")`,
    ] : []),
    
    // Add text showing cube count
    `text1 = Text("Volume = ${cubeCount} cubic units", (2, 1))`,
    `text2 = Text("Each cube = 1×1×1 = 1 cubic unit", (2, 0.5))`,
  ];

  return (
    <ChatGeoGebra
      commands={commands}
      title="🧊 3D Cube Visualization"
      description={`Exploring ${cubeCount} unit cubes and their volume`}
      appName="3d"
      height={320}
    />
  );
}

export function ChatGraphingActivity({ 
  functions = ["f(x) = x^2"], 
  points = [] 
}: { 
  functions?: string[]; 
  points?: string[]; 
}) {
  const commands = [
    ...functions,
    ...points,
    // Add grid and axis labels for better visibility in chat
    `ShowGrid(true)`,
    `ShowAxes(true)`,
  ];

  return (
    <ChatGeoGebra
      commands={commands}
      title="📊 Function Graphing"
      description="Interactive function visualization"
      appName="graphing"
      height={280}
    />
  );
}

export function ChatGeometryExplorer({ 
  shapes = [] 
}: { 
  shapes?: string[]; 
}) {
  const defaultCommands = [
    'A = (0, 0)',
    'B = (3, 0)',
    'C = (1.5, 2.6)',
    'triangle = Polygon(A, B, C)',
    'SetColor(triangle, "lightblue")',
    'ShowLabel(A, true)',
    'ShowLabel(B, true)',
    'ShowLabel(C, true)',
  ];

  return (
    <ChatGeoGebra
      commands={shapes.length > 0 ? shapes : defaultCommands}
      title="📐 Geometry Explorer"
      description="Interactive geometric shapes and measurements"
      appName="geometry"
      height={300}
    />
  );
}
