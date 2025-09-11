'use client';

import React from 'react';
import PlotlyGrapher, { LinearFunctionGrapher, QuadraticFunctionGrapher, TrigFunctionGrapher } from './PlotlyGrapher';
import ThreeGeometryVisualizer, { CubeExplorer, SphereExplorer, CylinderExplorer, GeometryComparison } from './ThreeGeometryVisualizer';

interface ProfessionalMathVisualizerProps {
  type: 'function' | 'geometry-2d' | 'geometry-3d' | 'comparison' | 'custom';
  content?: string;
  config?: any;
  className?: string;
  onInteraction?: (data: any) => void;
}

export default function ProfessionalMathVisualizer({
  type,
  content = '',
  config = {},
  className = '',
  onInteraction
}: ProfessionalMathVisualizerProps) {
  
  // Intelligent visualization selection based on mathematical content
  const selectVisualization = () => {
    switch (type) {
      case 'function':
        return renderFunctionVisualizer();
      
      case 'geometry-2d':
        return renderGeometry2D();
      
      case 'geometry-3d':
        return renderGeometry3D();
      
      case 'comparison':
        return renderComparison();
      
      case 'custom':
        return renderCustomVisualization();
      
      default:
        return renderDefault();
    }
  };

  const renderFunctionVisualizer = () => {
    // Analyze content to determine function type
    if (content.includes('linear') || content.includes('slope') || /\dx\s*\+/.test(content)) {
      return <LinearFunctionGrapher className={className} onPointClick={onInteraction} {...config} />;
    }
    
    if (content.includes('quadratic') || content.includes('parabola') || /x\^2|x²/.test(content)) {
      return <QuadraticFunctionGrapher className={className} onPointClick={onInteraction} {...config} />;
    }
    
    if (content.includes('sin') || content.includes('cos') || content.includes('tan') || content.includes('trigonometric')) {
      return <TrigFunctionGrapher className={className} onPointClick={onInteraction} {...config} />;
    }

    // Default function grapher
    return <PlotlyGrapher className={className} onPointClick={onInteraction} {...config} />;
  };

  const renderGeometry2D = () => {
    // For now, use Plotly for 2D geometry (can be enhanced with D3.js later)
    const geometryFunctions = ['circle: sqrt(1 - x^2)', 'circle: -sqrt(1 - x^2)'];
    return (
      <PlotlyGrapher
        functions={geometryFunctions}
        title="2D Geometry Explorer"
        xRange={[-2, 2]}
        yRange={[-2, 2]}
        className={className}
        onPointClick={onInteraction}
        {...config}
      />
    );
  };

  const renderGeometry3D = () => {
    // Analyze content to determine 3D shape
    if (content.includes('cube') || content.includes('rectangular prism')) {
      return <CubeExplorer className={className} onShapeClick={onInteraction} {...config} />;
    }
    
    if (content.includes('sphere') || content.includes('ball')) {
      return <SphereExplorer className={className} onShapeClick={onInteraction} {...config} />;
    }
    
    if (content.includes('cylinder') || content.includes('tube')) {
      return <CylinderExplorer className={className} onShapeClick={onInteraction} {...config} />;
    }

    // Default 3D shape
    return <ThreeGeometryVisualizer className={className} onShapeClick={onInteraction} {...config} />;
  };

  const renderComparison = () => {
    if (content.includes('geometry') || content.includes('shape')) {
      return <GeometryComparison />;
    }
    
    // Function comparison
    return (
      <PlotlyGrapher
        functions={['x^2', 'x^3', '2*x']}
        title="Function Comparison"
        className={className}
        onPointClick={onInteraction}
        {...config}
      />
    );
  };

  const renderCustomVisualization = () => {
    // Parse custom configuration
    if (config.visualizationType === 'plotly') {
      return <PlotlyGrapher className={className} onPointClick={onInteraction} {...config} />;
    }
    
    if (config.visualizationType === 'three') {
      return <ThreeGeometryVisualizer className={className} onShapeClick={onInteraction} {...config} />;
    }

    return renderDefault();
  };

  const renderDefault = () => {
    return (
      <div className={`border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">🔧</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Professional Math Visualizer</h3>
          <p className="text-gray-600 mb-4">
            Advanced mathematical visualization tools are now available
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl mb-2">📈</div>
              <h4 className="font-medium">Function Graphing</h4>
              <p className="text-sm text-gray-600">Interactive Plotly.js graphing with zoom, pan, and mathematical analysis</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl mb-2">🎲</div>
              <h4 className="font-medium">3D Geometry</h4>
              <p className="text-sm text-gray-600">Professional Three.js 3D visualizations with measurements and interactivity</p>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-green-600 font-medium">
            ✅ Professional Grade • ✅ Production Ready • ✅ Battle Tested
          </div>
        </div>
      </div>
    );
  };

  return selectVisualization();
}

// Smart visualization selector based on content analysis
export function createMathVisualization(content: string, context: string = '') {
  // Function keywords
  const functionKeywords = ['function', 'graph', 'equation', 'linear', 'quadratic', 'polynomial', 'trigonometric'];
  
  // 3D geometry keywords
  const geometry3DKeywords = ['cube', 'sphere', 'cylinder', 'cone', 'pyramid', 'prism', 'volume', 'surface area', '3d', 'three-dimensional'];
  
  // 2D geometry keywords
  const geometry2DKeywords = ['circle', 'triangle', 'rectangle', 'polygon', 'area', 'perimeter', '2d', 'two-dimensional'];
  
  const lowerContent = content.toLowerCase();
  
  if (functionKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { type: 'function' as const, content, config: {} };
  }
  
  if (geometry3DKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { type: 'geometry-3d' as const, content, config: {} };
  }
  
  if (geometry2DKeywords.some(keyword => lowerContent.includes(keyword))) {
    return { type: 'geometry-2d' as const, content, config: {} };
  }
  
  // Default to function visualization
  return { type: 'function' as const, content, config: {} };
}

// Pre-configured educational components
export function MiddleSchoolFunctionExplorer() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Middle School Function Explorer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LinearFunctionGrapher />
        <QuadraticFunctionGrapher />
      </div>
    </div>
  );
}

export function GeometryWorkshop() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">3D Geometry Workshop</h2>
      <GeometryComparison />
    </div>
  );
}

export function MathVisualizationDashboard() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Professional Math Visualization Suite</h1>
        <p className="text-gray-600">Interactive mathematical tools for grades 6-8</p>
      </div>
      
      <MiddleSchoolFunctionExplorer />
      <GeometryWorkshop />
    </div>
  );
}
