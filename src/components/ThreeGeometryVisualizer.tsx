'use client';

import React, { useRef, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Cone, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import Simple3DFallback from './Simple3DFallback';

// Error Boundary for Canvas
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

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
    // Safety checks to prevent null reference errors
    if (!meshRef.current || !state) return;

    try {
      switch (animation) {
        case 'rotate':
          // Disable automatic rotation - let user control rotation with OrbitControls
          // meshRef.current.rotation.y += 0.01;
          break;
        case 'bounce':
          if (state.clock) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
          }
          break;
      }

      // Hover effect with safety check
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    } catch (error) {
      console.warn('⚠️ Animation frame error:', error);
      // Continue gracefully without breaking the component
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
          segments: 32 // Reduced for better performance
        });
        return (
          <group ref={meshRef}>
            <Sphere 
              args={[dimensions.radius || 1, 32, 16]} // Reduced segments for performance
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              {sphereMaterial}
            </Sphere>
            {/* Add subtle wireframe overlay for better 3D perception */}
            <Sphere 
              args={[dimensions.radius || 1, 16, 8]} // Reduced wireframe segments
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
      
      case 'pyramid':
        console.log('🔺 Rendering pyramid with dimensions:', {
          baseSize: dimensions.width || dimensions.baseSize || 2,
          height: dimensions.height || 2,
          args: 'Creating square pyramid with triangular faces'
        });
        
        // Create a square pyramid using custom geometry
        const baseSize = dimensions.width || dimensions.baseSize || 2;
        const pyramidHeight = dimensions.height || 2;
        const halfBase = baseSize / 2;
        
        // Define vertices for a square pyramid
        const vertices = new Float32Array([
          // Base vertices (square)
          -halfBase, 0, -halfBase,  // 0: back-left
          halfBase, 0, -halfBase,   // 1: back-right
          halfBase, 0, halfBase,    // 2: front-right
          -halfBase, 0, halfBase,   // 3: front-left
          
          // Apex vertex
          0, pyramidHeight, 0       // 4: top
        ]);
        
        // Define faces (triangles)
        const indices = new Uint16Array([
          // Base (square) - two triangles
          0, 1, 2,  // First triangle
          0, 2, 3,  // Second triangle
          
          // Side faces (triangular)
          0, 4, 1,  // Back face
          1, 4, 2,  // Right face
          2, 4, 3,  // Front face
          3, 4, 0   // Left face
        ]);
        
        return (
          <group ref={meshRef}>
            <mesh
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={vertices.length / 3}
                  array={vertices}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="index"
                  count={indices.length}
                  array={indices}
                  itemSize={1}
                />
              </bufferGeometry>
              {baseMaterial}
            </mesh>
            
            {/* Add wireframe outline for better visualization */}
            <mesh>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={vertices.length / 3}
                  array={vertices}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="index"
                  count={indices.length}
                  array={indices}
                  itemSize={1}
                />
              </bufferGeometry>
              <meshBasicMaterial 
                color="#1e40af" 
                wireframe={true} 
                transparent={true} 
                opacity={0.4}
              />
            </mesh>
          </group>
        );
      
      case 'triangular_prism':
        console.log('🔺 Rendering triangular prism with dimensions:', {
          baseWidth: dimensions.width || 2,
          height: dimensions.height || 3,
          depth: dimensions.depth || 1,
          args: 'Creating triangular prism with triangular cross-section'
        });
        
        // Create a triangular prism using custom geometry
        const prismBaseWidth = dimensions.width || 2;
        const prismHeight = dimensions.height || 3;
        const prismDepth = dimensions.depth || 1;
        const halfWidth = prismBaseWidth / 2;
        const halfDepth = prismDepth / 2;
        
        // Define vertices for a triangular prism
        const prismVertices = new Float32Array([
          // Front triangle (Z = halfDepth)
          -halfWidth, 0, halfDepth,        // 0: bottom-left front
          halfWidth, 0, halfDepth,         // 1: bottom-right front
          0, prismHeight, halfDepth,       // 2: top front
          
          // Back triangle (Z = -halfDepth)
          -halfWidth, 0, -halfDepth,       // 3: bottom-left back
          halfWidth, 0, -halfDepth,        // 4: bottom-right back
          0, prismHeight, -halfDepth       // 5: top back
        ]);
        
        // Define faces (triangles)
        const prismIndices = new Uint16Array([
          // Front triangle
          0, 1, 2,
          
          // Back triangle
          3, 5, 4,
          
          // Bottom rectangle (two triangles)
          0, 4, 1,  // First triangle
          0, 3, 4,  // Second triangle
          
          // Left side rectangle (two triangles)
          0, 2, 5,  // First triangle
          0, 5, 3,  // Second triangle
          
          // Right side rectangle (two triangles)
          1, 4, 5,  // First triangle
          1, 5, 2   // Second triangle
        ]);
        
        return (
          <group ref={meshRef}>
            <mesh
              onPointerOver={() => setHovered(true)}
              onPointerOut={() => setHovered(false)}
              onClick={onShapeClick}
            >
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={prismVertices.length / 3}
                  array={prismVertices}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="index"
                  count={prismIndices.length}
                  array={prismIndices}
                  itemSize={1}
                />
              </bufferGeometry>
              {baseMaterial}
            </mesh>
            
            {/* Add wireframe outline for better visualization */}
            <mesh>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={prismVertices.length / 3}
                  array={prismVertices}
                  itemSize={3}
                />
                <bufferAttribute
                  attach="index"
                  count={prismIndices.length}
                  array={prismIndices}
                  itemSize={1}
                />
              </bufferGeometry>
              <meshBasicMaterial 
                color="#059669" 
                wireframe={true} 
                transparent={true} 
                opacity={0.4}
              />
            </mesh>
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
      
      case 'cone':
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
      
      case 'pyramid':
        const baseSize = dimensions.width || dimensions.baseSize || 2;
        const pyramidHeight = dimensions.height || 2;
        return (
          <group>
            <Html position={[baseSize/2 + 0.5, 0, 0]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                Base: {baseSize}×{baseSize}
              </div>
            </Html>
            <Html position={[0, pyramidHeight/2 + 0.5, 0]}>
              <div className="bg-white px-2 py-1 text-xs border rounded shadow">
                H: {pyramidHeight}
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
  // SIMPLIFIED: Single state for client-side readiness (WORKING VERSION)
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple client-side detection with WebGL context loss handling
  useEffect(() => {
    setMounted(true);
    
    // Handle WebGL context loss/restore
    const handleContextLoss = (event: Event) => {
      console.log('🔄 WebGL context lost, preventing default behavior');
      event.preventDefault();
      setError('WebGL context lost - refresh page to restore 3D rendering');
    };
    
    const handleContextRestore = () => {
      console.log('✅ WebGL context restored');
      setError(null);
      // Force re-render by toggling mounted state
      setMounted(false);
      setTimeout(() => setMounted(true), 100);
    };
    
    // Listen for WebGL context events on canvas elements
    const handleCanvasContextLoss = (canvas: HTMLCanvasElement) => {
      canvas.addEventListener('webglcontextlost', handleContextLoss);
      canvas.addEventListener('webglcontextrestored', handleContextRestore);
      
      return () => {
        canvas.removeEventListener('webglcontextlost', handleContextLoss);
        canvas.removeEventListener('webglcontextrestored', handleContextRestore);
      };
    };
    
    // Monitor for canvas elements being added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLCanvasElement) {
            handleCanvasContextLoss(node);
          } else if (node instanceof Element) {
            const canvases = node.querySelectorAll('canvas');
            canvases.forEach(handleCanvasContextLoss);
          }
        });
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Handle existing canvases
    document.querySelectorAll('canvas').forEach(handleCanvasContextLoss);
    
    return () => {
      observer.disconnect();
    };
  }, []);

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

  // Error boundary for Canvas with context loss recovery
  const handleCanvasError = (error: Error) => {
    console.error('❌ ThreeGeometryVisualizer Canvas Error:', error);
    
    // Check if this is a WebGL context loss error
    if (error.message.includes('context') || error.message.includes('WebGL')) {
      console.log('🔄 Detected WebGL context error - attempting recovery');
      setError('WebGL context issue - attempting automatic recovery...');
      
      // Attempt recovery after a short delay
      setTimeout(() => {
        setError(null);
        setMounted(false);
        setTimeout(() => setMounted(true), 200);
      }, 1000);
    } else {
      setError(`3D rendering failed: ${error.message}`);
    }
  };

  // Calculate volume and surface area
  const calculateProperties = () => {
    try {
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
        
        case 'cone':
          const coneR = dimensions.radius || 1;
          const coneH = dimensions.height || 2;
          const coneVolume = (1/3) * Math.PI * Math.pow(coneR, 2) * coneH;
          const slantHeight = Math.sqrt(Math.pow(coneR, 2) + Math.pow(coneH, 2));
          const coneSurfaceArea = Math.PI * coneR * (coneR + slantHeight);
          return { volume: coneVolume.toFixed(2), surfaceArea: coneSurfaceArea.toFixed(2) };
        
        case 'pyramid':
          const baseSize = dimensions.width || dimensions.baseSize || 2;
          const pyramidH = dimensions.height || 2;
          // Square pyramid formulas
          const pyramidVolume = (1/3) * Math.pow(baseSize, 2) * pyramidH;
          // Surface area = base area + 4 triangular faces
          const baseArea = Math.pow(baseSize, 2);
          const slantHeight2 = Math.sqrt(Math.pow(pyramidH, 2) + Math.pow(baseSize/2, 2));
          const triangularFaceArea = (1/2) * baseSize * slantHeight2;
          const pyramidSurfaceArea = baseArea + (4 * triangularFaceArea);
          return { volume: pyramidVolume.toFixed(2), surfaceArea: pyramidSurfaceArea.toFixed(2) };
        
        case 'triangular_prism':
          const prismBaseWidth = dimensions.width || 2;
          const prismHeight = dimensions.height || 3;
          const prismDepth = dimensions.depth || 1;
          // Triangular prism formulas
          // Volume = (1/2 * base * height) * depth
          const triangularBaseArea = (1/2) * prismBaseWidth * prismHeight;
          const prismVolume = triangularBaseArea * prismDepth;
          // Surface area = 2 triangular faces + 3 rectangular faces
          const triangularFaces = 2 * triangularBaseArea;
          const bottomRect = prismBaseWidth * prismDepth;
          const sideHeight = Math.sqrt(Math.pow(prismHeight, 2) + Math.pow(prismBaseWidth/2, 2));
          const leftRect = sideHeight * prismDepth;
          const rightRect = sideHeight * prismDepth;
          const prismSurfaceArea = triangularFaces + bottomRect + leftRect + rightRect;
          return { volume: prismVolume.toFixed(2), surfaceArea: prismSurfaceArea.toFixed(2) };
        
        default:
          return { volume: '0', surfaceArea: '0' };
      }
    } catch (err) {
      console.error('❌ Error calculating properties:', err);
      return { volume: '0', surfaceArea: '0' };
    }
  };

  const properties = calculateProperties();

  if (error) {
    const isContextError = error.includes('WebGL') || error.includes('context');
    
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <div className="bg-red-50 px-4 py-2 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-red-800">
              🚫 3D Visualization Error
            </h3>
            {isContextError && (
              <button
                onClick={() => {
                  setError(null);
                  setMounted(false);
                  setTimeout(() => setMounted(true), 100);
                }}
                className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                🔄 Retry
              </button>
            )}
          </div>
          <div className="text-sm text-red-600 mb-2">{error}</div>
          {isContextError && (
            <div className="text-xs text-red-500">
              WebGL context lost - this can happen when switching tabs or with GPU driver issues.
            </div>
          )}
        </div>
        <div className="flex items-center justify-center h-96 bg-red-50">
          <Simple3DFallback
            shape={shape}
            dimensions={dimensions}
            color={color}
            volume={properties.volume}
            surfaceArea={properties.surfaceArea}
          />
        </div>
      </div>
    );
  }

  // Don't render Canvas on server side
  if (!mounted) {
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <div className="bg-gray-50 px-4 py-2 border-b">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-800">
              🎲 3D {shape.charAt(0).toUpperCase() + shape.slice(1)} Explorer
            </h3>
            <div className="text-xs text-blue-600 font-medium">Loading...</div>
          </div>
        </div>
        <div className="flex items-center justify-center h-96 bg-gray-100">
          <div className="text-gray-500">Preparing 3D visualization...</div>
        </div>
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

      {/* 3D Canvas with Error Boundary */}
      <div style={{ width: '100%', height: '400px' }}>
        <ErrorBoundary
          fallback={
            <Simple3DFallback
              shape={shape}
              dimensions={dimensions}
              color={color}
              volume={properties.volume}
              surfaceArea={properties.surfaceArea}
            />
          }
        >
          <Canvas
            camera={{ position: [5, 5, 5], fov: 50 }}
            style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}
            onError={handleCanvasError}
            gl={{ 
              preserveDrawingBuffer: true,
              powerPreference: 'default', // Use default instead of high-performance to reduce context loss
              antialias: false, // Disable to reduce GPU load
              alpha: true, // Enable transparency to show background
              stencil: false, // Disable stencil buffer to save memory
              depth: true, // Keep depth buffer for 3D rendering
              failIfMajorPerformanceCaveat: false // Allow software rendering as fallback
            }}
            dpr={[1, 1.5]} // Limit device pixel ratio to reduce GPU load
            onCreated={(state) => {
              // Add context loss handling to the Three.js renderer
              try {
                console.log('✅ Canvas onCreated called, state:', {
                  hasGl: !!state.gl,
                  glType: typeof state.gl,
                  hasGetExtension: state.gl && typeof state.gl.getExtension === 'function',
                  glConstructor: state.gl && state.gl.constructor.name
                });
                
                // Validate that we have a proper WebGL context
                if (!state.gl) {
                  console.error('❌ No WebGL context in onCreated');
                  return;
                }
                
                if (typeof state.gl.getExtension !== 'function') {
                  console.error('❌ WebGL context missing getExtension method');
                  return;
                }
                
                // Validate canvas element
                const canvas = state.gl.domElement;
                if (!canvas) {
                  console.error('❌ No canvas element found in WebGL context');
                  return;
                }
                
                console.log('✅ WebGL context validated successfully');
                
                // Set transparent background
                state.scene.background = null;
                
                // Get context loss extension for debugging
                const loseContext = state.gl.getExtension('WEBGL_lose_context');
                if (loseContext) {
                  console.log('✅ WEBGL_lose_context extension available');
                } else {
                  console.warn('⚠️ WEBGL_lose_context extension not available');
                }
              } catch (error) {
                console.error('❌ Error in onCreated callback:', error);
              }
            }}
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
        </ErrorBoundary>
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

export function PyramidExplorer(props: Partial<ThreeGeometryProps>) {
  return (
    <ThreeGeometryVisualizer
      shape="pyramid"
      dimensions={{ width: 4, height: 6 }} // Square base side 4, height 6
      color="#8b5cf6"
      animation="none"
      {...props}
    />
  );
}

export function TriangularPrismExplorer(props: Partial<ThreeGeometryProps>) {
  return (
    <ThreeGeometryVisualizer
      shape="triangular_prism"
      dimensions={{ width: 3, height: 4, depth: 2 }} // Base width 3, height 4, depth 2
      color="#059669"
      animation="none"
      {...props}
    />
  );
}

export function GeometryComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <CubeExplorer />
      <SphereExplorer />
      <CylinderExplorer />
      <PyramidExplorer />
    </div>
  );
}
