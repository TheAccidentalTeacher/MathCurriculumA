'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Cone, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeGeometryProps {
  shape: 'cube' | 'sphere' | 'cylinder' | 'cone' | 'pyramid' | 'custom';
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

// 🧊 Cube Grid Lines Component - Like a Rubik's cube for educational counting
function CubeGridLines({ width, height, depth }: { width: number; height: number; depth: number }) {
  const lines = [];
  
  // Grid lines for width (X-direction)
  for (let i = 1; i < width; i++) {
    const x = -width/2 + i;
    // Front to back lines
    lines.push(
      <Line
        key={`x-${i}-front`}
        points={[[x, -height/2, depth/2], [x, height/2, depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
    lines.push(
      <Line
        key={`x-${i}-back`}
        points={[[x, -height/2, -depth/2], [x, height/2, -depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
    // Top to bottom lines
    lines.push(
      <Line
        key={`x-${i}-top`}
        points={[[x, height/2, -depth/2], [x, height/2, depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
    lines.push(
      <Line
        key={`x-${i}-bottom`}
        points={[[x, -height/2, -depth/2], [x, -height/2, depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
  }
  
  // Grid lines for height (Y-direction)
  for (let i = 1; i < height; i++) {
    const y = -height/2 + i;
    // Left to right lines
    lines.push(
      <Line
        key={`y-${i}-front`}
        points={[[-width/2, y, depth/2], [width/2, y, depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
    lines.push(
      <Line
        key={`y-${i}-back`}
        points={[[-width/2, y, -depth/2], [width/2, y, -depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
    // Front to back lines
    lines.push(
      <Line
        key={`y-${i}-left`}
        points={[[-width/2, y, -depth/2], [-width/2, y, depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
    lines.push(
      <Line
        key={`y-${i}-right`}
        points={[[width/2, y, -depth/2], [width/2, y, depth/2]]}
        color="#000000"
        lineWidth={2}
      />
    );
  }
  
  // Grid lines for depth (Z-direction)
  for (let i = 1; i < depth; i++) {
    const z = -depth/2 + i;
    // Left to right lines
    lines.push(
      <Line
        key={`z-${i}-top`}
        points={[[-width/2, height/2, z], [width/2, height/2, z]]}
        color="#000000"
        lineWidth={2}
      />
    );
    lines.push(
      <Line
        key={`z-${i}-bottom`}
        points={[[-width/2, -height/2, z], [width/2, -height/2, z]]}
        color="#000000"
        lineWidth={2}
      />
    );
    // Top to bottom lines
    lines.push(
      <Line
        key={`z-${i}-left`}
        points={[[-width/2, -height/2, z], [-width/2, height/2, z]]}
        color="#000000"
        lineWidth={2}
      />
    );
    lines.push(
      <Line
        key={`z-${i}-right`}
        points={[[width/2, -height/2, z], [width/2, height/2, z]]}
        color="#000000"
        lineWidth={2}
      />
    );
  }
  
  return <group>{lines}</group>;
}

// Animated shape component
function AnimatedShape({ 
  shape, 
  dimensions, 
  color = '#4f46e5', 
  wireframe = false, 
  animation = 'none',
  onShapeClick 
}: {
  shape: string;
  dimensions: any;
  color: string;
  wireframe: boolean;
  animation: string;
  onShapeClick?: () => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;

    switch (animation) {
      case 'rotate':
        meshRef.current.rotation.y += 0.01;
        break;
      case 'bounce':
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
        break;
    }

    // Hover effect
    if (hovered) {
      meshRef.current.scale.setScalar(1.1);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const renderShape = () => {
    // 🎨 Different materials for different shapes
    const baseMaterial = (
      <meshStandardMaterial 
        color={hovered ? '#818cf8' : color} 
        wireframe={wireframe}
        transparent
        opacity={shape === 'cube' ? 0.7 : (wireframe ? 0.8 : 1)}
      />
    );

    // ⚽ Enhanced sphere material for better 3D appearance
    const sphereMaterial = (
      <meshPhongMaterial 
        color={hovered ? '#60a5fa' : (color === '#4f46e5' ? '#3b82f6' : color)}
        shininess={100}
        transparent={false}
        opacity={1}
        wireframe={wireframe}
      />
    );

    switch (shape) {
      case 'cube':
        console.log('🧊 Rendering cube with dimensions:', {
          width: dimensions.width || 2,
          height: dimensions.height || 2,
          depth: dimensions.depth || 2,
          args: [dimensions.width || 2, dimensions.height || 2, dimensions.depth || 2]
        });
        return (
          <group ref={meshRef}>
            <Box 
              args={[dimensions.width || 2, dimensions.height || 2, dimensions.depth || 2]}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              {baseMaterial}
            </Box>
            {/* 🧊 Add grid lines for educational counting */}
            <CubeGridLines 
              width={dimensions.width || 2}
              height={dimensions.height || 2}
              depth={dimensions.depth || 2}
            />
          </group>
        );
      
      case 'sphere':
        console.log('⚽ Rendering sphere with enhanced 3D appearance:', {
          radius: dimensions.radius || 1,
          segments: 64 // Higher detail for smoother sphere
        });
        return (
          <group ref={meshRef}>
            <Sphere 
              args={[dimensions.radius || 1, 64, 64]} // Higher segments for smoother appearance
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              {sphereMaterial}
            </Sphere>
            {/* Add subtle wireframe overlay for better 3D perception */}
            <Sphere 
              args={[dimensions.radius || 1, 16, 16]}
            >
              <meshBasicMaterial 
                color="#1e40af" 
                wireframe={true} 
                transparent={true} 
                opacity={0.2}
              />
            </Sphere>
          </group>
        );
      
      case 'cylinder':
        return (
          <group ref={meshRef}>
            <Cylinder 
              args={[dimensions.radius || 1, dimensions.radius || 1, dimensions.height || 2, 32]}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              {baseMaterial}
            </Cylinder>
          </group>
        );
      
      case 'cone':
        return (
          <group ref={meshRef}>
            <Cone 
              args={[dimensions.radius || 1, dimensions.height || 2, 32]}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              {baseMaterial}
            </Cone>
          </group>
        );
      
      default:
        return (
          <group ref={meshRef}>
            <Box 
              args={[1, 1, 1]}
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              {baseMaterial}
            </Box>
          </group>
        );
    }
  };

  return renderShape();
}

// Coordinate axes component
function CoordinateAxes() {
  const axisLength = 3;
  
  return (
    <group>
      {/* X-axis (red) */}
      <Line
        points={[[-axisLength, 0, 0], [axisLength, 0, 0]]}
        color="red"
        lineWidth={2}
      />
      <Text
        position={[axisLength + 0.2, 0, 0]}
        fontSize={0.3}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        X
      </Text>
      
      {/* Y-axis (green) */}
      <Line
        points={[[0, -axisLength, 0], [0, axisLength, 0]]}
        color="green"
        lineWidth={2}
      />
      <Text
        position={[0, axisLength + 0.2, 0]}
        fontSize={0.3}
        color="green"
        anchorX="center"
        anchorY="middle"
      >
        Y
      </Text>
      
      {/* Z-axis (blue) */}
      <Line
        points={[[0, 0, -axisLength], [0, 0, axisLength]]}
        color="blue"
        lineWidth={2}
      />
      <Text
        position={[0, 0, axisLength + 0.2]}
        fontSize={0.3}
        color="blue"
        anchorX="center"
        anchorY="middle"
      >
        Z
      </Text>
    </group>
  );
}

// Measurement labels component
function MeasurementLabels({ shape, dimensions }: { shape: string; dimensions: any }) {
  const renderMeasurements = () => {
    switch (shape) {
      case 'cube':
        return (
          <group>
            <Html position={[dimensions.width/2 + 0.5, 0, 0]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                W: {dimensions.width || 2}
              </div>
            </Html>
            <Html position={[0, dimensions.height/2 + 0.5, 0]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                H: {dimensions.height || 2}
              </div>
            </Html>
            <Html position={[0, 0, dimensions.depth/2 + 0.5]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                D: {dimensions.depth || 2}
              </div>
            </Html>
          </group>
        );
      
      case 'sphere':
        return (
          <Html position={[dimensions.radius + 0.5, 0, 0]}>
            <div className="bg-white px-2 py-1 text-xs border rounded shadow">
              R: {dimensions.radius || 1}
            </div>
          </Html>
        );
      
      case 'cylinder':
        return (
          <group>
            <Html position={[dimensions.radius + 0.5, 0, 0]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                R: {dimensions.radius || 1}
              </div>
            </Html>
            <Html position={[0, dimensions.height/2 + 0.5, 0]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                H: {dimensions.height || 2}
              </div>
            </Html>
          </group>
        );
      
      default:
        return null;
    }
  };

  return renderMeasurements();
}

export default function ThreeGeometryVisualizer({
  shape = 'cube',
  dimensions = { width: 2, height: 2, depth: 2, radius: 1 },
  color = '#4f46e5',
  wireframe = false,
  showMeasurements = true,
  showAxes = true,
  interactive = true,
  animation = 'none',
  onShapeClick,
  className = ''
}: ThreeGeometryProps) {
  const [error, setError] = useState<string | null>(null);

  // 🐛 DEBUG: Log received props
  console.log('🎯 ThreeGeometryVisualizer received props:', {
    shape,
    dimensions,
    color,
    wireframe,
    showMeasurements,
    showAxes,
    interactive,
    animation
  });

  // Calculate volume and surface area
  const calculateProperties = () => {
    switch (shape) {
      case 'cube':
        const volume = (dimensions.width || 2) * (dimensions.height || 2) * (dimensions.depth || 2);
        const surfaceArea = 2 * ((dimensions.width || 2) * (dimensions.height || 2) + 
                                 (dimensions.width || 2) * (dimensions.depth || 2) + 
                                 (dimensions.height || 2) * (dimensions.depth || 2));
        return { volume: volume.toFixed(2), surfaceArea: surfaceArea.toFixed(2) };
      
      case 'sphere':
        const r = dimensions.radius || 1;
        const sphereVolume = (4/3) * Math.PI * Math.pow(r, 3);
        const sphereSurfaceArea = 4 * Math.PI * Math.pow(r, 2);
        return { volume: sphereVolume.toFixed(2), surfaceArea: sphereSurfaceArea.toFixed(2) };
      
      case 'cylinder':
        const cR = dimensions.radius || 1;
        const h = dimensions.height || 2;
        const cylinderVolume = Math.PI * Math.pow(cR, 2) * h;
        const cylinderSurfaceArea = 2 * Math.PI * cR * (cR + h);
        return { volume: cylinderVolume.toFixed(2), surfaceArea: cylinderSurfaceArea.toFixed(2) };
      
      default:
        return { volume: '0', surfaceArea: '0' };
    }
  };

  const properties = calculateProperties();

  if (error) {
    return (
      <div className={`border border-red-300 rounded-lg p-4 ${className}`}>
        <div className="text-red-600 font-medium">3D Visualization Error</div>
        <div className="text-sm text-red-500 mt-1">{error}</div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Header with shape info */}
      <div className="bg-gray-50 px-4 py-2 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800">
            🎲 3D {shape.charAt(0).toUpperCase() + shape.slice(1)} Explorer
          </h3>
          <div className="text-xs text-green-600 font-medium">Professional Grade</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
          <div>
            <span className="font-medium">Volume:</span> {properties.volume} cubic units
          </div>
          <div>
            <span className="font-medium">Surface Area:</span> {properties.surfaceArea} square units
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div style={{ width: '100%', height: '400px' }}>
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}
        >
          {/* Enhanced lighting for better 3D appearance */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />
          {/* Additional light specifically for sphere shading */}
          <directionalLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />

          {/* Coordinate axes */}
          {showAxes && <CoordinateAxes />}

          {/* Main shape */}
          <AnimatedShape
            shape={shape}
            dimensions={dimensions}
            color={color}
            wireframe={wireframe}
            animation={animation}
            onShapeClick={onShapeClick}
          />

          {/* Measurement labels */}
          {showMeasurements && (
            <MeasurementLabels shape={shape} dimensions={dimensions} />
          )}

          {/* Camera controls */}
          {interactive && (
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              autoRotate={false}
              autoRotateSpeed={1}
              enableDamping={true}
              dampingFactor={0.05}
              screenSpacePanning={false}
              minDistance={3}
              maxDistance={20}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}
        </Canvas>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 px-4 py-2 border-t">
        <div className="text-xs text-gray-600">
          {interactive ? (
            <>
              🖱️ <strong>Interactive:</strong> Click and drag to rotate • Scroll to zoom • Right-click and drag to pan
            </>
          ) : (
            'Static view - interactivity disabled'
          )}
        </div>
      </div>
    </div>
  );
}

// Pre-configured components for common shapes
export function CubeExplorer(props: Partial<ThreeGeometryProps>) {
  return (
    <ThreeGeometryVisualizer
      shape="cube"
      dimensions={{ width: 2, height: 2, depth: 2 }}
      color="#3b82f6"
      animation="none"
      {...props}
    />
  );
}

export function SphereExplorer(props: Partial<ThreeGeometryProps>) {
  return (
    <ThreeGeometryVisualizer
      shape="sphere"
      dimensions={{ radius: 1.5 }}
      color="#10b981"
      animation="bounce"
      {...props}
    />
  );
}

export function CylinderExplorer(props: Partial<ThreeGeometryProps>) {
  return (
    <ThreeGeometryVisualizer
      shape="cylinder"
      dimensions={{ radius: 1, height: 3 }}
      color="#f59e0b"
      {...props}
    />
  );
}

export function GeometryComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <CubeExplorer />
      <SphereExplorer />
      <CylinderExplorer />
    </div>
  );
}
