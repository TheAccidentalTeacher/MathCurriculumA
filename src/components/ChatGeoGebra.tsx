'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import GeoGebraWidget from './GeoGebraWidget';

interface ChatGeoGebraProps {
  commands: string[];
  title?: string;
  description?: string;
  appName?: 'graphing' | 'geometry' | '3d' | 'classic' | 'suite' | 'scientific' | 'evaluator';
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
  const [dimensions, setDimensions] = useState({ width: 480, height: height });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === 'undefined') return;
      
      const containerWidth = containerRef.current?.parentElement?.offsetWidth || window.innerWidth;
      const maxChatWidth = Math.min(containerWidth - 40, 600);
      const width = Math.max(320, Math.min(maxChatWidth, 480));
      const adjustedHeight = isExpanded ? Math.min(height + 100, 450) : Math.min(height, 300);
      
      setDimensions({ width, height: adjustedHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height, isExpanded]);

  return (
    <div 
      ref={containerRef}
      className={`relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden max-w-full ${className}`}
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
      <div className="relative bg-gray-50">
        <div 
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{ 
            maxHeight: isExpanded ? dimensions.height + 50 : dimensions.height,
            width: '100%'
          }}
        >
          <div 
            className="flex justify-center items-center p-2"
            style={{ minHeight: dimensions.height }}
          >
            <div style={{ width: dimensions.width, height: dimensions.height }}>
              <GeoGebraWidget
                appName={appName}
                commands={commands}
                width={dimensions.width}
                height={dimensions.height}
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
          </div>
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