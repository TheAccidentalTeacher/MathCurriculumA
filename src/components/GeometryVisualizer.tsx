'use client';

import React from 'react';
// DISABLED: GeoGebra integration removed by user request
// import GeoGebraWidget from './GeoGebraWidget';

interface GeometryVisualizerProps {
  shape: string;
  dimensions?: number[];
  showMeasurements?: boolean;
  showFormulas?: boolean;
  interactive?: boolean;
  transformations?: string[];
  className?: string;
}

export default function GeometryVisualizer({ 
  shape, 
  dimensions = [],
  showMeasurements = true,
  showFormulas = true,
  interactive = true,
  transformations = [],
  className = '' 
}: GeometryVisualizerProps) {
  
  const getGeometryCommands = () => {
    const shapeType = shape.toLowerCase();
    
    switch (shapeType) {
      // 2D Polygons
      case 'triangle':
        return getTriangleCommands(dimensions);
      case 'square':
        return getSquareCommands(dimensions[0] || 4);
      case 'rectangle':
        return getRectangleCommands(dimensions[0] || 5, dimensions[1] || 3);
      case 'circle':
        return getCircleCommands(dimensions[0] || 3);
      case 'pentagon':
        return getRegularPolygonCommands(5, dimensions[0] || 3);
      case 'hexagon':
        return getRegularPolygonCommands(6, dimensions[0] || 3);
      case 'octagon':
        return getRegularPolygonCommands(8, dimensions[0] || 3);
      case 'parallelogram':
        return getParallelogramCommands(dimensions);
      case 'trapezoid':
        return getTrapezoidCommands(dimensions);
      case 'rhombus':
        return getRhombusCommands(dimensions[0] || 4);
        
      // 3D Shapes
      case 'cube':
        return getCubeCommands(dimensions[0] || 4);
      case 'rectangular_prism':
      case 'box':
        return getRectangularPrismCommands(dimensions[0] || 4, dimensions[1] || 3, dimensions[2] || 2);
      case 'sphere':
        return getSphereCommands(dimensions[0] || 3);
      case 'cylinder':
        return getCylinderCommands(dimensions[0] || 2, dimensions[1] || 4);
      case 'cone':
        return getConeCommands(dimensions[0] || 2, dimensions[1] || 4);
      case 'pyramid':
        return getPyramidCommands(dimensions[0] || 3, dimensions[1] || 4);
      case 'triangular_prism':
        return getTriangularPrismCommands(dimensions);
        
      default:
        return ['Text("Shape ' + shape + ' not recognized", (0, 0))'];
    }
  };

  // 2D Shape Commands
  const getTriangleCommands = (dims: number[]) => {
    const [a = 3, b = 4, c = 5] = dims;
    const commands = [
      'A = (0, 0)',
      'B = (' + a + ', 0)',
      'C = (' + (a/2) + ', ' + Math.sqrt(Math.max(0, b*b - (a/2)*(a/2))) + ')',
      'triangle = Polygon(A, B, C)',
      'SetColor(triangle, "blue")',
      'SetFilling(triangle, 0.3)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("a = ' + a + '", (' + (a/2) + ', -0.5))',
        'Text("b = ' + b + '", (' + (a + 0.5) + ', ' + (Math.sqrt(Math.max(0, b*b - (a/2)*(a/2)))/2) + '))',
        'Text("c = ' + c + '", (' + (a/4 - 0.5) + ', ' + (Math.sqrt(Math.max(0, b*b - (a/2)*(a/2)))/2) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Area = ½ × base × height", (0, -1.5))',
        'Text("Perimeter = a + b + c", (0, -2))'
      );
    }
    
    return commands;
  };

  const getSquareCommands = (side: number) => {
    const area = side * side;
    const perimeter = side * 4;
    const commands = [
      'A = (0, 0)',
      'B = (' + side + ', 0)',
      'C = (' + side + ', ' + side + ')',
      'D = (0, ' + side + ')',
      'square = Polygon(A, B, C, D)',
      'SetColor(square, "green")',
      'SetFilling(square, 0.3)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("s = ' + side + '", (' + (side/2) + ', -0.5))',
        'Text("Area = ' + area + '", (' + (side/2) + ', ' + (side + 0.5) + '))',
        'Text("Perimeter = ' + perimeter + '", (' + (side/2) + ', ' + (side + 1) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Area = s²", (' + (side + 0.5) + ', ' + (side/2) + '))',
        'Text("Perimeter = 4s", (' + (side + 0.5) + ', ' + (side/2 - 0.5) + '))'
      );
    }
    
    return commands;
  };

  const getRectangleCommands = (length: number, width: number) => {
    const area = length * width;
    const perimeter = 2 * (length + width);
    const commands = [
      'A = (0, 0)',
      'B = (' + length + ', 0)',
      'C = (' + length + ', ' + width + ')',
      'D = (0, ' + width + ')',
      'rectangle = Polygon(A, B, C, D)',
      'SetColor(rectangle, "red")',
      'SetFilling(rectangle, 0.3)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("l = ' + length + '", (' + (length/2) + ', -0.5))',
        'Text("w = ' + width + '", (-0.5, ' + (width/2) + '))',
        'Text("Area = ' + area + '", (' + (length/2) + ', ' + (width + 0.5) + '))',
        'Text("Perimeter = ' + perimeter + '", (' + (length/2) + ', ' + (width + 1) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Area = l × w", (' + (length + 0.5) + ', ' + (width/2) + '))',
        'Text("Perimeter = 2(l + w)", (' + (length + 0.5) + ', ' + (width/2 - 0.5) + '))'
      );
    }
    
    return commands;
  };

  const getCircleCommands = (radius: number) => {
    const area = Math.PI * radius * radius;
    const circumference = 2 * Math.PI * radius;
    const commands = [
      'center = (0, 0)',
      'circle = Circle(center, ' + radius + ')',
      'SetColor(circle, "purple")',
      'SetFilling(circle, 0.3)',
      'Point(center)',
      'Segment(center, (' + radius + ', 0))'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("r = ' + radius + '", (' + (radius/2) + ', 0.2))',
        'Text("Area ≈ ' + area.toFixed(2) + '", (0, -' + (radius + 1) + '))',
        'Text("Circumference ≈ ' + circumference.toFixed(2) + '", (0, -' + (radius + 1.5) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Area = πr²", (' + (radius + 1) + ', 0))',
        'Text("Circumference = 2πr", (' + (radius + 1) + ', -0.5))'
      );
    }
    
    return commands;
  };

  const getRegularPolygonCommands = (sides: number, radius: number) => {
    const commands = ['center = (0, 0)'];
    const points: string[] = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = (2 * Math.PI * i) / sides;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const pointName = String.fromCharCode(65 + i); // A, B, C, ...
      commands.push(pointName + ' = (' + x.toFixed(2) + ', ' + y.toFixed(2) + ')');
      points.push(pointName);
    }
    
    commands.push('polygon = Polygon(' + points.join(', ') + ')',
      'SetColor(polygon, "orange")',
      'SetFilling(polygon, 0.3)');
    
    if (showMeasurements) {
      const sideLength = 2 * radius * Math.sin(Math.PI / sides);
      const area = (sides * radius * radius * Math.sin(2 * Math.PI / sides)) / 2;
      
      commands.push(
        'Text("' + sides + '-sided polygon", (0, -' + (radius + 1) + '))',
        'Text("Side ≈ ' + sideLength.toFixed(2) + '", (0, -' + (radius + 1.5) + '))',
        'Text("Area ≈ ' + area.toFixed(2) + '", (0, -' + (radius + 2) + '))'
      );
    }
    
    return commands;
  };

  // 3D Shape Commands  
  const getCubeCommands = (side: number) => {
    const volume = side * side * side;
    const surfaceArea = 6 * side * side;
    
    const commands = [
      // Create vertices
      'A = Point((0, 0, 0))',
      'B = Point((' + side + ', 0, 0))',
      'C = Point((' + side + ', ' + side + ', 0))',
      'D = Point((0, ' + side + ', 0))',
      'E = Point((0, 0, ' + side + '))',
      'F = Point((' + side + ', 0, ' + side + '))',
      'G = Point((' + side + ', ' + side + ', ' + side + '))',
      'H = Point((0, ' + side + ', ' + side + '))',
      
      // Create faces
      'face1 = Polygon(A, B, C, D)',
      'face2 = Polygon(E, F, G, H)',
      'face3 = Polygon(A, B, F, E)',
      'face4 = Polygon(B, C, G, F)',
      'face5 = Polygon(C, D, H, G)',
      'face6 = Polygon(D, A, E, H)',
      
      // Set colors and transparency
      'SetColor(face1, "blue")',
      'SetColor(face2, "blue")',
      'SetColor(face3, "lightblue")',
      'SetColor(face4, "lightblue")',
      'SetColor(face5, "lightblue")',
      'SetColor(face6, "lightblue")',
      'SetFilling(face1, 0.3)',
      'SetFilling(face2, 0.3)',
      'SetFilling(face3, 0.3)',
      'SetFilling(face4, 0.3)',
      'SetFilling(face5, 0.3)',
      'SetFilling(face6, 0.3)'
    ];
      
    if (showMeasurements) {
      commands.push(
        'Text("Volume = ' + volume + '", (' + (side/2) + ', ' + (side/2) + ', ' + (side + 1) + '))',
        'Text("Surface Area = ' + surfaceArea + '", (' + (side/2) + ', ' + (side/2) + ', ' + (side + 1.5) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Volume = s³", (' + (side + 1) + ', ' + (side/2) + ', ' + (side/2) + '))',
        'Text("Surface Area = 6s²", (' + (side + 1) + ', ' + (side/2) + ', ' + (side/2 - 0.5) + '))'
      );
    }
    
    return commands;
  };

  const getSphereCommands = (radius: number) => {
    const volume = (4/3) * Math.PI * radius * radius * radius;
    const surfaceArea = 4 * Math.PI * radius * radius;
    
    const commands = [
      'center = (0, 0, 0)',
      'sphere = Sphere(center, ' + radius + ')',
      'SetColor(sphere, "red")',
      'SetFilling(sphere, 0.4)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("Volume ≈ ' + volume.toFixed(2) + '", (0, 0, ' + (radius + 1) + '))',
        'Text("Surface Area ≈ ' + surfaceArea.toFixed(2) + '", (0, 0, ' + (radius + 1.5) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Volume = ⁴⁄₃πr³", (' + (radius + 1) + ', 0, 0))',
        'Text("Surface Area = 4πr²", (' + (radius + 1) + ', 0, -0.5))'
      );
    }
    
    return commands;
  };

  const getCylinderCommands = (radius: number, height: number) => {
    const volume = Math.PI * radius * radius * height;
    const surfaceArea = 2 * Math.PI * radius * (radius + height);
    
    const commands = [
      'base = Circle((0, 0, 0), ' + radius + ')',
      'top = Circle((0, 0, ' + height + '), ' + radius + ')',
      'cylinder = Cylinder(base, ' + height + ')',
      'SetColor(cylinder, "green")',
      'SetFilling(cylinder, 0.4)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("Volume ≈ ' + volume.toFixed(2) + '", (0, ' + (radius + 1) + ', ' + (height/2) + '))',
        'Text("Surface Area ≈ ' + surfaceArea.toFixed(2) + '", (0, ' + (radius + 1) + ', ' + (height/2 - 0.5) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Volume = πr²h", (' + (radius + 1) + ', 0, ' + (height/2) + '))',
        'Text("Surface Area = 2πr(r + h)", (' + (radius + 1) + ', 0, ' + (height/2 - 0.5) + '))'
      );
    }
    
    return commands;
  };

  const getConeCommands = (radius: number, height: number) => {
    const volume = (1/3) * Math.PI * radius * radius * height;
    const slantHeight = Math.sqrt(radius * radius + height * height);
    const surfaceArea = Math.PI * radius * (radius + slantHeight);
    
    const commands = [
      'base = Circle((0, 0, 0), ' + radius + ')',
      'apex = Point((0, 0, ' + height + '))',
      'cone = Cone(base, apex)',
      'SetColor(cone, "orange")',
      'SetFilling(cone, 0.4)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("Volume ≈ ' + volume.toFixed(2) + '", (0, ' + (radius + 1) + ', ' + (height/2) + '))',
        'Text("Surface Area ≈ ' + surfaceArea.toFixed(2) + '", (0, ' + (radius + 1) + ', ' + (height/2 - 0.5) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Volume = ⅓πr²h", (' + (radius + 1) + ', 0, ' + (height/2) + '))',
        'Text("Surface Area = πr(r + l)", (' + (radius + 1) + ', 0, ' + (height/2 - 0.5) + '))'
      );
    }
    
    return commands;
  };

  const getPyramidCommands = (baseSize: number, height: number) => {
    const volume = (1/3) * baseSize * baseSize * height;
    const halfBase = baseSize / 2;
    
    const commands = [
      // Square base
      'A = Point((-' + halfBase + ', -' + halfBase + ', 0))',
      'B = Point((' + halfBase + ', -' + halfBase + ', 0))',
      'C = Point((' + halfBase + ', ' + halfBase + ', 0))',
      'D = Point((-' + halfBase + ', ' + halfBase + ', 0))',
      'E = Point((0, 0, ' + height + '))', // Apex
      
      // Create faces
      'base = Polygon(A, B, C, D)',
      'face1 = Polygon(A, B, E)',
      'face2 = Polygon(B, C, E)',
      'face3 = Polygon(C, D, E)',
      'face4 = Polygon(D, A, E)',
      
      // Set colors
      'SetColor(base, "purple")',
      'SetColor(face1, "lightpurple")',
      'SetColor(face2, "lightpurple")',
      'SetColor(face3, "lightpurple")',
      'SetColor(face4, "lightpurple")',
      'SetFilling(base, 0.3)',
      'SetFilling(face1, 0.3)',
      'SetFilling(face2, 0.3)',
      'SetFilling(face3, 0.3)',
      'SetFilling(face4, 0.3)'
    ];
      
    if (showMeasurements) {
      commands.push(
        'Text("Volume ≈ ' + volume.toFixed(2) + '", (0, ' + (baseSize/2 + 1) + ', ' + (height/2) + '))'
      );
    }
    
    if (showFormulas) {
      commands.push(
        'Text("Volume = ⅓Bh", (' + (baseSize/2 + 1) + ', 0, ' + (height/2) + '))'
      );
    }
    
    return commands;
  };

  // Additional helper functions for complex shapes...
  const getParallelogramCommands = (dims: number[]) => {
    const [base = 5, height = 3, slant = 2] = dims;
    const commands = [
      'A = (0, 0)',
      'B = (' + base + ', 0)',
      'C = (' + (base + slant) + ', ' + height + ')',
      'D = (' + slant + ', ' + height + ')',
      'parallelogram = Polygon(A, B, C, D)',
      'SetColor(parallelogram, "yellow")',
      'SetFilling(parallelogram, 0.3)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("Area = ' + (base * height) + '", (' + (base/2) + ', ' + (height + 0.5) + '))',
        'Text("base = ' + base + '", (' + (base/2) + ', -0.5))',
        'Text("height = ' + height + '", (-0.5, ' + (height/2) + '))'
      );
    }
    
    return commands;
  };

  const getTrapezoidCommands = (dims: number[]) => {
    const [base1 = 6, base2 = 4, height = 3] = dims;
    const area = ((base1 + base2) * height) / 2;
    const commands = [
      'A = (0, 0)',
      'B = (' + base1 + ', 0)',
      'C = (' + ((base1 + base2)/2 + base2/2) + ', ' + height + ')',
      'D = (' + ((base1 - base2)/2) + ', ' + height + ')',
      'trapezoid = Polygon(A, B, C, D)',
      'SetColor(trapezoid, "pink")',
      'SetFilling(trapezoid, 0.3)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("Area = ' + area + '", (' + (base1/2) + ', ' + (height + 0.5) + '))',
        'Text("b₁ = ' + base1 + '", (' + (base1/2) + ', -0.5))',
        'Text("b₂ = ' + base2 + '", (' + (base1/2) + ', ' + (height + 1) + '))',
        'Text("h = ' + height + '", (-0.7, ' + (height/2) + '))'
      );
    }
    
    return commands;
  };

  const getRhombusCommands = (side: number) => {
    const height = side * Math.sin(Math.PI/3); // 60 degree angle
    const cos60 = side * Math.cos(Math.PI/3);
    const commands = [
      'A = (0, 0)',
      'B = (' + side + ', 0)',
      'C = (' + (side + cos60) + ', ' + height + ')',
      'D = (' + cos60 + ', ' + height + ')',
      'rhombus = Polygon(A, B, C, D)',
      'SetColor(rhombus, "cyan")',
      'SetFilling(rhombus, 0.3)'
    ];
    
    if (showMeasurements) {
      commands.push(
        'Text("All sides = ' + side + '", (' + (side/2) + ', -0.5))'
      );
    }
    
    return commands;
  };

  const getRectangularPrismCommands = (length: number, width: number, height: number) => {
    const volume = length * width * height;
    const surfaceArea = 2 * (length * width + width * height + height * length);
    
    const commands = [
      // Create vertices
      'A = (0, 0, 0)',
      'B = (' + length + ', 0, 0)',
      'C = (' + length + ', ' + width + ', 0)',
      'D = (0, ' + width + ', 0)',
      'E = (0, 0, ' + height + ')',
      'F = (' + length + ', 0, ' + height + ')',
      'G = (' + length + ', ' + width + ', ' + height + ')',
      'H = (0, ' + width + ', ' + height + ')',
      
      // Create faces
      'bottom = Polygon(A, B, C, D)',
      'top = Polygon(E, F, G, H)',
      'front = Polygon(A, B, F, E)',
      'back = Polygon(D, C, G, H)',
      'left = Polygon(A, D, H, E)',
      'right = Polygon(B, C, G, F)',
      
      // Set colors and transparency
      'SetColor(bottom, "blue")',
      'SetColor(top, "blue")',
      'SetColor(front, "lightblue")',
      'SetColor(back, "lightblue")',
      'SetColor(left, "lightblue")',
      'SetColor(right, "lightblue")',
      'SetFilling(bottom, 0.3)',
      'SetFilling(top, 0.3)',
      'SetFilling(front, 0.3)',
      'SetFilling(back, 0.3)',
      'SetFilling(left, 0.3)',
      'SetFilling(right, 0.3)'
    ];
      
    if (showMeasurements) {
      commands.push(
        'Text("Volume = ' + volume + '", (' + (length/2) + ', ' + (width/2) + ', ' + (height + 1) + '))',
        'Text("Surface Area = ' + surfaceArea + '", (' + (length/2) + ', ' + (width/2) + ', ' + (height + 1.5) + '))'
      );
    }
    
    return commands;
  };

  const getTriangularPrismCommands = (dims: number[]) => {
    const [base = 3, height = 4, depth = 2] = dims;
    const volume = 0.5 * base * height * depth;
    
    const commands = [
      // Front triangle
      'A = (0, 0, 0)',
      'B = (' + base + ', 0, 0)',
      'C = (' + (base/2) + ', ' + height + ', 0)',
      'front = Polygon(A, B, C)',
      
      // Back triangle  
      'D = (0, 0, ' + depth + ')',
      'E = (' + base + ', 0, ' + depth + ')',
      'F = (' + (base/2) + ', ' + height + ', ' + depth + ')',
      'back = Polygon(D, E, F)',
      
      // Connecting faces
      'bottom = Polygon(A, B, E, D)',
      'side1 = Polygon(B, C, F, E)',
      'side2 = Polygon(C, A, D, F)',
      
      // Set colors
      'SetColor(front, "green")',
      'SetColor(back, "green")',
      'SetColor(bottom, "lightgreen")',
      'SetColor(side1, "lightgreen")',
      'SetColor(side2, "lightgreen")',
      'SetFilling(front, 0.3)',
      'SetFilling(back, 0.3)',
      'SetFilling(bottom, 0.3)',
      'SetFilling(side1, 0.3)',
      'SetFilling(side2, 0.3)'
    ];
      
    if (showMeasurements) {
      commands.push(
        'Text("Volume = ' + volume + '", (' + (base/2) + ', ' + (height/2) + ', ' + (depth + 1) + '))'
      );
    }
    
    return commands;
  };

  const commands = getGeometryCommands();
  const is3D = ['cube', 'rectangular_prism', 'box', 'sphere', 'cylinder', 'cone', 'pyramid', 'triangular_prism'].includes(shape.toLowerCase());
  
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 capitalize">
          {shape.replace('_', ' ')} Visualizer
        </h3>
        <p className="text-sm text-gray-600">
          Interactive {is3D ? '3D' : '2D'} {shape.replace('_', ' ')} with measurements and formulas
        </p>
      </div>
      
      {/* DISABLED: GeoGebra widget removed by user request */}
      <div className="w-full h-96 bg-gray-100 border rounded flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🚫</div>
          <p className="text-gray-600 font-medium">GeoGebra Visualization Disabled</p>
          <p className="text-sm text-gray-500">Shape: {shape.replace('_', ' ')}</p>
        </div>
      </div>
      
      {interactive && (
        <div className="mt-3 text-sm text-gray-600">
          <p>💡 <strong>Tip:</strong> {is3D ? 'Use your mouse to rotate and explore the 3D shape!' : 'Click and drag to explore the 2D shape!'}</p>
        </div>
      )}
    </div>
  );
}

// Pre-configured geometry visualizers for common middle school shapes
export function TriangleExplorer(props: { sides?: number[]; interactive?: boolean }) {
  return <GeometryVisualizer shape="triangle" dimensions={props.sides} interactive={props.interactive ?? true} />;
}

export function CircleExplorer(props: { radius?: number; interactive?: boolean }) {
  return <GeometryVisualizer shape="circle" dimensions={[props.radius || 3]} interactive={props.interactive ?? true} />;
}

export function CubeExplorer(props: { side?: number; interactive?: boolean }) {
  return <GeometryVisualizer shape="cube" dimensions={[props.side || 4]} interactive={props.interactive ?? true} />;
}

export function SphereExplorer(props: { radius?: number; interactive?: boolean }) {
  return <GeometryVisualizer shape="sphere" dimensions={[props.radius || 3]} interactive={props.interactive ?? true} />;
}

export function CylinderExplorer(props: { radius?: number; height?: number; interactive?: boolean }) {
  return <GeometryVisualizer shape="cylinder" dimensions={[props.radius || 2, props.height || 4]} interactive={props.interactive ?? true} />;
}
