'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

interface TransformationVisualizerProps {
  type: 'reflection' | 'rotation' | 'translation';
  shape?: 'triangle' | 'square' | 'polygon';
  axis?: 'x' | 'y' | 'vertical' | 'horizontal';
  angle?: number;
  showAnimation?: boolean;
  className?: string;
}

// Animated shape component that shows transformation
function AnimatedTransformation({ 
  type, 
  shape = 'triangle', 
  axis = 'vertical', 
  showAnimation = true 
}: TransformationVisualizerProps) {
  const originalRef = useRef<THREE.Mesh>(null);
  const transformedRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state) => {
    if (showAnimation) {
      const time = state.clock.getElapsedTime();
      const animationProgress = (Math.sin(time * 0.5) + 1) / 2; // 0 to 1
      setProgress(animationProgress);
    }
  });

  // Create shape geometry
  const createShapeGeometry = () => {
    if (shape === 'triangle') {
      const geometry = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        -1, -0.5, 0,  // bottom left
        1, -0.5, 0,   // bottom right
        0, 1, 0       // top
      ]);
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex([0, 1, 2]);
      return geometry;
    } else {
      // Default to square
      return new THREE.PlaneGeometry(1.5, 1.5);
    }
  };

  const geometry = createShapeGeometry();

  // Calculate transformation matrix
  const getTransformationMatrix = () => {
    if (type === 'reflection') {
      if (axis === 'vertical' || axis === 'y') {
        return new THREE.Matrix4().makeScale(-1, 1, 1); // Reflect across Y-axis
      } else {
        return new THREE.Matrix4().makeScale(1, -1, 1); // Reflect across X-axis
      }
    }
    return new THREE.Matrix4(); // Identity for now
  };

  const transformMatrix = getTransformationMatrix();

  return (
    <group>
      {/* Original shape */}
      <mesh ref={originalRef} geometry={geometry} position={[-2, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} />
      </mesh>

      {/* Transformation axis/plane */}
      {type === 'reflection' && (
        <Line
          points={[[0, -3, 0], [0, 3, 0]]}
          color="#ef4444"
          lineWidth={3}
        />
      )}

      {/* Transformed shape */}
      <mesh 
        ref={transformedRef} 
        geometry={geometry} 
        position={[2, 0, 0]}
        matrix={transformMatrix}
        matrixAutoUpdate={false}
      >
        <meshStandardMaterial color="#10b981" transparent opacity={0.8} />
      </mesh>

      {/* Labels */}
      <Text
        position={[-2, -1.5, 0]}
        fontSize={0.3}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        Original
      </Text>

      <Text
        position={[2, -1.5, 0]}
        fontSize={0.3}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
      >
        Reflected
      </Text>

      {axis === 'vertical' && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.25}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          Line of Reflection
        </Text>
      )}
    </group>
  );
}

// Coordinate axes component
function CoordinateAxes() {
  return (
    <group>
      {/* X-axis */}
      <Line
        points={[[-4, 0, 0], [4, 0, 0]]}
        color="#64748b"
        lineWidth={1}
      />
      <Text
        position={[4.2, 0, 0]}
        fontSize={0.2}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        x
      </Text>
      
      {/* Y-axis */}
      <Line
        points={[[0, -3, 0], [0, 3, 0]]}
        color="#64748b"
        lineWidth={1}
      />
      <Text
        position={[0, 3.2, 0]}
        fontSize={0.2}
        color="#64748b"
        anchorX="center"
        anchorY="middle"
      >
        y
      </Text>
    </group>
  );
}

export default function TransformationVisualizer({ 
  type = 'reflection',
  shape = 'triangle',
  axis = 'vertical',
  angle = 90,
  showAnimation = true,
  className = ''
}: TransformationVisualizerProps) {
  const [error, setError] = useState<string | null>(null);

  const handleCanvasError = (error: Error) => {
    console.error('❌ TransformationVisualizer Canvas Error:', error);
    setError(`Transformation visualization failed: ${error.message}`);
  };

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="text-red-700 font-medium">Visualization Error</div>
        <div className="text-red-600 text-sm mt-1">{error}</div>
        <div className="text-red-500 text-xs mt-2">
          This appears to be a browser compatibility issue. Try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden ${className}`}>
      <div className="w-full h-full">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          onError={handleCanvasError}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          
          <CoordinateAxes />
          <AnimatedTransformation 
            type={type}
            shape={shape}
            axis={axis}
            showAnimation={showAnimation}
          />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={15}
            minDistance={3}
          />
        </Canvas>
      </div>
      
      {/* Information panel */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium text-gray-800">
          🔄 {type.charAt(0).toUpperCase() + type.slice(1)} Transformation
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {type === 'reflection' && `Reflection across ${axis} axis`}
          {type === 'rotation' && `Rotation by ${angle}°`}
          {type === 'translation' && 'Translation (movement)'}
        </div>
        <div className="text-xs text-blue-600 mt-2">
          📱 Interactive: Drag to rotate • Scroll to zoom
        </div>
      </div>
    </div>
  );
}

// Pre-built components for common transformations
export function ReflectionExplorer({ axis = 'vertical' }: { axis?: 'vertical' | 'horizontal' }) {
  return (
    <TransformationVisualizer
      type="reflection"
      shape="triangle"
      axis={axis}
      showAnimation={true}
    />
  );
}

export function RotationExplorer({ angle = 90 }: { angle?: number }) {
  return (
    <TransformationVisualizer
      type="rotation"
      shape="square"
      angle={angle}
      showAnimation={true}
    />
  );
}

export function TranslationExplorer() {
  return (
    <TransformationVisualizer
      type="translation"
      shape="triangle"
      showAnimation={true}
    />
  );
}
