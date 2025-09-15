'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Interface for the component props
interface ThreeGeometryProps {
  shape: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid' | 'triangular_prism' | 'custom';
  dimensions?: { width?: number; height?: number; depth?: number; radius?: number; };
  color?: string;
  wireframe?: boolean;
  showMeasurements?: boolean;
  showAxes?: boolean;
  interactive?: boolean;
  animation?: 'rotate' | 'bounce' | 'none';
  onShapeClick?: () => void;
  className?: string;
}

// Dynamic import with no SSR and a proper loading fallback
const ThreeGeometryVisualizer = dynamic(
  () => import('./ThreeGeometryVisualizer'),
  {
    ssr: false,
    loading: () => (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-800">
              🎲 3D Shape Explorer
            </h3>
            <div className="text-xs text-blue-600 font-medium">Loading...</div>
          </div>
        </div>
        <div className="flex items-center justify-center h-96 bg-gray-100">
          <div className="text-gray-500">Initializing 3D visualization...</div>
        </div>
      </div>
    )
  }
);

// Wrapper component that handles the dynamic loading
export default function ThreeGeometryVisualizerWrapper(props: ThreeGeometryProps) {
  return <ThreeGeometryVisualizer {...props} />;
}
