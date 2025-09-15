'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';

interface SimpleThreeVisualizerProps {
  shape: 'cube' | 'sphere' | 'cylinder' | 'cone';
  dimensions?: any;
  color?: string;
  className?: string;
}

// Simple animated shape without complex context management
function SimpleShape({ shape, dimensions, color }: { shape: string; dimensions: any; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && state) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  switch (shape) {
    case 'cube':
      return (
        <Box 
          ref={meshRef}
          args={[dimensions?.width || 2, dimensions?.height || 2, dimensions?.depth || 2]}
        >
          <meshStandardMaterial color={color} />
        </Box>
      );
    case 'sphere':
      return (
        <Sphere 
          ref={meshRef}
          args={[dimensions?.radius || 1.5, 16, 16]}
        >
          <meshStandardMaterial color={color} />
        </Sphere>
      );
    case 'cylinder':
      return (
        <Cylinder 
          ref={meshRef}
          args={[dimensions?.radius || 1, dimensions?.radius || 1, dimensions?.height || 2, 16]}
        >
          <meshStandardMaterial color={color} />
        </Cylinder>
      );
    case 'cone':
      return (
        <Cone 
          ref={meshRef}
          args={[dimensions?.radius || 1, dimensions?.height || 2, 16]}
        >
          <meshStandardMaterial color={color} />
        </Cone>
      );
    default:
      return null;
  }
}

export default function SimpleThreeVisualizer({ 
  shape, 
  dimensions = {}, 
  color = '#4f46e5',
  className = ''
}: SimpleThreeVisualizerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <div className="bg-blue-50 px-4 py-2 border-b">
          <h3 className="font-medium text-gray-800">
            🎲 3D {shape.charAt(0).toUpperCase() + shape.slice(1)} Explorer
          </h3>
        </div>
        <div className="h-96 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading 3D visualization...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="bg-blue-50 px-4 py-2 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800">
            🎲 3D {shape.charAt(0).toUpperCase() + shape.slice(1)} Explorer
          </h3>
          <div className="text-xs text-green-600 font-medium">Live 3D</div>
        </div>
      </div>

      <div style={{ width: '100%', height: '400px' }}>
        <Suspense fallback={
          <div className="flex items-center justify-center h-full bg-gray-100">
            <div className="text-gray-500">Starting 3D engine...</div>
          </div>
        }>
          <Canvas
            camera={{ position: [4, 4, 4], fov: 50 }}
            style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}
            gl={{ 
              antialias: false,
              alpha: false,
              powerPreference: 'default'
            }}
            dpr={[1, 1]}
          >
            {/* Simple lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            
            {/* The shape */}
            <SimpleShape shape={shape} dimensions={dimensions} color={color} />
            
            {/* Simple controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={false}
            />
          </Canvas>
        </Suspense>
      </div>

      <div className="bg-blue-50 px-4 py-2 border-t">
        <div className="text-xs text-gray-600">
          🖱️ Click and drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}
