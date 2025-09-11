'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface SmartGeoGebraFrameProps {
  shape: string;
  lesson?: string;
  concept?: string;
  width?: number;
  height?: number;
  className?: string;
}

// Smart mapping of lesson concepts to specific GeoGebra activities
const getGeoGebraConfig = (shape: string, lesson?: string, concept?: string) => {
  const shapeKey = shape.toLowerCase();
  
  // Special handling for plane sections lesson
  if (lesson?.includes('plane sections') || lesson?.includes('three-dimensional') || concept?.includes('plane sections')) {
    switch (shapeKey) {
      case 'cube':
        return {
          appName: '3d',
          commands: [
            'A = (0, 0, 0)', 'B = (4, 0, 0)', 'C = (4, 4, 0)', 'D = (0, 4, 0)',
            'E = (0, 0, 4)', 'F = (4, 0, 4)', 'G = (4, 4, 4)', 'H = (0, 4, 4)',
            'cube = Cube[A, G]',
            'SetColor(cube, "blue")', 'SetFilling(cube, 0.3)',
            // Interactive plane
            'h = Slider(0, 4, 0.1, 2, 120, false, true, false, false)',
            'plane = Plane((2, 2, h), (1, 0, 0), (0, 1, 0))',
            'SetColor(plane, "red")', 'SetFilling(plane, 0.4)',
            'section = Intersect(cube, plane)',
            'SetColor(section, "green")', 'SetLineThickness(section, 3)'
          ]
        };
      case 'sphere':
        return {
          appName: '3d',
          commands: [
            'center = (0, 0, 0)', 'sphere = Sphere(center, 3)',
            'SetColor(sphere, "red")', 'SetFilling(sphere, 0.4)',
            // Interactive plane
            'h = Slider(-3, 3, 0.1, 0, 120, false, true, false, false)',
            'plane = Plane((0, 0, h), (1, 0, 0), (0, 1, 0))',
            'SetColor(plane, "blue")', 'SetFilling(plane, 0.3)',
            'section = Intersect(sphere, plane)',
            'SetColor(section, "orange")', 'SetLineThickness(section, 4)'
          ]
        };
      case 'cylinder':
        return {
          appName: '3d',
          commands: [
            'base = Circle((0, 0, 0), 2)', 'cylinder = Cylinder(base, 5)',
            'SetColor(cylinder, "green")', 'SetFilling(cylinder, 0.4)',
            // Interactive plane
            'h = Slider(0, 5, 0.1, 2.5, 120, false, true, false, false)',
            'plane = Plane((0, 0, h), (1, 0, 0), (0, 1, 0))',
            'SetColor(plane, "purple")', 'SetFilling(plane, 0.3)',
            'section = Intersect(cylinder, plane)',
            'SetColor(section, "yellow")', 'SetLineThickness(section, 4)'
          ]
        };
      case 'cone':
        return {
          appName: '3d',
          commands: [
            'base = Circle((0, 0, 0), 3)', 'apex = (0, 0, 5)',
            'cone = Cone(base, apex)',
            'SetColor(cone, "orange")', 'SetFilling(cone, 0.4)',
            // Interactive plane
            'h = Slider(0, 5, 0.1, 2.5, 120, false, true, false, false)',
            'plane = Plane((0, 0, h), (1, 0, 0), (0, 1, 0))',
            'SetColor(plane, "cyan")', 'SetFilling(plane, 0.3)',
            'section = Intersect(cone, plane)',
            'SetColor(section, "magenta")', 'SetLineThickness(section, 4)'
          ]
        };
      case 'rectangular_prism':
        return {
          appName: '3d',
          commands: [
            'A = (0, 0, 0)', 'B = (6, 0, 0)', 'C = (6, 4, 0)', 'D = (0, 4, 0)',
            'E = (0, 0, 3)', 'F = (6, 0, 3)', 'G = (6, 4, 3)', 'H = (0, 4, 3)',
            'prism = Cube[A, G]',
            'SetColor(prism, "purple")', 'SetFilling(prism, 0.3)',
            // Interactive plane
            'h = Slider(0, 4, 0.1, 2, 120, false, true, false, false)',
            'plane = Plane((3, 2, h), (1, 0, 0), (0, 1, 0))',
            'SetColor(plane, "lime")', 'SetFilling(plane, 0.4)',
            'section = Intersect(prism, plane)',
            'SetColor(section, "red")', 'SetLineThickness(section, 3)'
          ]
        };
    }
  }
  
  // Default shape configurations for other lessons
  switch (shapeKey) {
    case 'cube':
      return {
        appName: '3d',
        commands: [
          'A = (0, 0, 0)', 'cube = Cube[A, 4]',
          'SetColor(cube, "blue")', 'SetFilling(cube, 0.3)',
          'Text("Volume = side³", (0, 0, -1))'
        ]
      };
    case 'sphere':
      return {
        appName: '3d',
        commands: [
          'center = (0, 0, 0)', 'sphere = Sphere(center, 3)',
          'SetColor(sphere, "red")', 'SetFilling(sphere, 0.4)',
          'Text("Volume = (4/3)πr³", (0, 0, -4))'
        ]
      };
    case 'cylinder':
      return {
        appName: '3d',
        commands: [
          'base = Circle((0, 0, 0), 2)', 'cylinder = Cylinder(base, 5)',
          'SetColor(cylinder, "green")', 'SetFilling(cylinder, 0.4)',
          'Text("Volume = πr²h", (0, 0, -1))'
        ]
      };
    case 'cone':
      return {
        appName: '3d',
        commands: [
          'base = Circle((0, 0, 0), 3)', 'apex = (0, 0, 5)',
          'cone = Cone(base, apex)',
          'SetColor(cone, "orange")', 'SetFilling(cone, 0.4)',
          'Text("Volume = (1/3)πr²h", (0, 0, -1))'
        ]
      };
    default:
      return {
        appName: 'geometry',
        commands: [`Text("${shape} visualization", (0, 0))`]
      };
  }
};

export default function SmartGeoGebraFrame({ 
  shape, 
  lesson, 
  concept, 
  width = 800, 
  height = 600, 
  className = '' 
}: SmartGeoGebraFrameProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFrame, setShowFrame] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const config = getGeoGebraConfig(shape, lesson, concept);

  // Create GeoGebra HTML content for the iframe
  const createGeoGebraHTML = useCallback(() => {
    const commands = config.commands.join('"; api.evalCommand("');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>GeoGebra - ${shape}</title>
    <script src="https://www.geogebra.org/apps/deployggb.js"></script>
    <style>
        body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
        .container { display: flex; flex-direction: column; align-items: center; }
        .title { margin-bottom: 10px; font-size: 14px; color: #666; }
        #ggbApplet { border: 1px solid #ccc; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="title">${shape.charAt(0).toUpperCase() + shape.slice(1)} - ${lesson || 'Interactive Visualization'}</div>
        <div id="ggbApplet"></div>
    </div>
    
    <script>
        const parameters = {
            id: "ggbApplet",
            appName: "${config.appName}",
            width: ${width - 40},
            height: ${height - 60},
            showToolBar: true,
            showAlgebraInput: false,
            showResetIcon: true,
            enableRightClick: true,
            enableShiftDragZoom: true,
            useBrowserForJS: true,
            showLogging: false,
            appletOnLoad: function(api) {
                console.log("${shape} visualizer loaded");
                
                // Execute commands with proper timing
                setTimeout(() => {
                    try {
                        api.evalCommand("${commands}");
                    } catch (error) {
                        console.error("Command execution error:", error);
                    }
                }, 500);
                
                // Notify parent that applet is ready
                if (parent && parent.postMessage) {
                    parent.postMessage({ type: 'geogebra_loaded', shape: '${shape}' }, '*');
                }
            }
        };
        
        const ggbApp = new GGBApplet(parameters, true);
        ggbApp.inject('ggbApplet');
    </script>
</body>
</html>`;
  }, [shape, lesson, concept, config, width, height]);

  const loadApplet = useCallback(() => {
    if (isLoading || isLoaded) return;
    
    setIsLoading(true);
    setShowFrame(true);
    
    // Set a timeout to mark as loaded even if we don't get the message
    timeoutRef.current = setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
    }, 3000);
  }, [isLoading, isLoaded]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'geogebra_loaded' && event.data?.shape === shape) {
        setIsLoaded(true);
        setIsLoading(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shape]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-800">
            📐 {shape.charAt(0).toUpperCase() + shape.slice(1)} Visualization
          </h3>
          <div className="flex items-center gap-2">
            {!showFrame && (
              <button
                onClick={loadApplet}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Load Interactive Model
              </button>
            )}
            {isLoading && (
              <div className="text-xs text-gray-500">Loading...</div>
            )}
            {isLoaded && (
              <div className="text-xs text-green-600">✓ Ready</div>
            )}
          </div>
        </div>
      </div>
      
      {showFrame ? (
        <iframe
          ref={frameRef}
          srcDoc={createGeoGebraHTML()}
          width={width}
          height={height}
          style={{ border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-same-origin"
          title={`${shape} GeoGebra Visualization`}
        />
      ) : (
        <div 
          className="flex items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
          style={{ width, height }}
          onClick={loadApplet}
        >
          <div className="text-center">
            <div className="text-4xl mb-2">📐</div>
            <div className="text-gray-600 font-medium">Click to Load {shape.charAt(0).toUpperCase() + shape.slice(1)}</div>
            <div className="text-xs text-gray-500 mt-1">Interactive 3D Model</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured components for common shapes
export const PlaneSection3D = ({ shape }: { shape: string }) => (
  <SmartGeoGebraFrame 
    shape={shape} 
    lesson="plane sections of three-dimensional figures"
    concept="cross-sections"
    width={800}
    height={600}
  />
);

export const Volume3D = ({ shape }: { shape: string }) => (
  <SmartGeoGebraFrame 
    shape={shape} 
    lesson="volume calculations"
    concept="3d volume"
    width={700}
    height={500}
  />
);
