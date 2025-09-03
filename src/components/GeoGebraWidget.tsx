'use client';

import React, { useEffect, useRef, useState } from 'react';

interface GeoGebraWidgetProps {
  // Basic configuration
  appName?: 'graphing' | 'geometry' | 'calculator' | '3d' | 'cas' | 'suite';
  width?: number;
  height?: number;
  
  // Content configuration
  ggbBase64?: string; // Pre-built GeoGebra file
  commands?: string[]; // GeoGebra commands to execute
  material_id?: string; // Public GeoGebra material ID
  
  // Interactive features
  enableRightClick?: boolean;
  enableLabelDrags?: boolean;
  enableShiftDragZoom?: boolean;
  showToolBar?: boolean;
  showMenuBar?: boolean;
  showAlgebraInput?: boolean;
  showResetIcon?: boolean;
  
  // Callback functions
  onReady?: () => void;
  onUpdate?: (objName: string) => void;
  
  // Styling
  className?: string;
}

declare global {
  interface Window {
    GGBApplet: any;
  }
}

export default function GeoGebraWidget({
  appName = 'graphing',
  width = 500,
  height = 400,
  ggbBase64,
  commands = [],
  material_id,
  enableRightClick = true,
  enableLabelDrags = true,
  enableShiftDragZoom = true,
  showToolBar = false,
  showMenuBar = false,
  showAlgebraInput = true,
  showResetIcon = true,
  onReady,
  onUpdate,
  className = ''
}: GeoGebraWidgetProps) {
  const appletRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [applet, setApplet] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load GeoGebra API if not already loaded
    const loadGeoGebra = () => {
      if (window.GGBApplet) {
        initializeApplet();
        return;
      }

      // Create script tag to load GeoGebra API
      const script = document.createElement('script');
      script.src = 'https://www.geogebra.org/apps/deployggb.js';
      script.onload = initializeApplet;
      script.onerror = () => setError('Failed to load GeoGebra API');
      document.head.appendChild(script);
    };

    const initializeApplet = () => {
      if (!appletRef.current || !window.GGBApplet) return;

      try {
        const parameters = {
          appName: appName,
          width: width,
          height: height,
          showToolBar: showToolBar,
          showMenuBar: showMenuBar,
          showAlgebraInput: showAlgebraInput,
          showResetIcon: showResetIcon,
          enableRightClick: enableRightClick,
          enableLabelDrags: enableLabelDrags,
          enableShiftDragZoom: enableShiftDragZoom,
          useBrowserForJS: false,
          // Load content if provided
          ...(ggbBase64 && { ggbBase64 }),
          ...(material_id && { material_id })
        };

        const ggbApp = new window.GGBApplet(parameters, true);
        
        // Set up callback for when applet is ready
        ggbApp.setHTML5Codebase('https://www.geogebra.org/apps/5.0/web3d/');
        
        // Inject applet into container
        ggbApp.inject(appletRef.current);
        
        // Wait for applet to be ready
        const checkReady = () => {
          try {
            const api = ggbApp.getAPI();
            if (api) {
              setApplet(api);
              setIsLoaded(true);
              
              // Execute any provided commands
              commands.forEach(command => {
                api.evalCommand(command);
              });
              
              // Set up update listener
              if (onUpdate) {
                api.registerUpdateListener((objName: string) => {
                  onUpdate(objName);
                });
              }
              
              onReady?.();
            } else {
              setTimeout(checkReady, 100);
            }
          } catch (err) {
            setTimeout(checkReady, 100);
          }
        };
        
        setTimeout(checkReady, 500);
        
      } catch (err) {
        setError('Failed to initialize GeoGebra applet');
        console.error('GeoGebra initialization error:', err);
      }
    };

    loadGeoGebra();
  }, [appName, width, height, ggbBase64, material_id, commands]);

  // Public API for external control
  const executeCommand = (command: string) => {
    if (applet && isLoaded) {
      applet.evalCommand(command);
    }
  };

  const setValue = (objName: string, value: any) => {
    if (applet && isLoaded) {
      applet.setValue(objName, value);
    }
  };

  const getValue = (objName: string) => {
    if (applet && isLoaded) {
      return applet.getValue(objName);
    }
    return null;
  };

  if (error) {
    return (
      <div className={`p-4 border border-red-300 rounded-lg bg-red-50 ${className}`}>
        <div className="flex items-center text-red-700">
          <span className="mr-2">⚠️</span>
          <span>GeoGebra Error: {error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`geogebra-container ${className}`}>
      <div 
        ref={appletRef} 
        className="geogebra-applet"
        style={{ width: width, height: height }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading GeoGebra...</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured GeoGebra widgets for common use cases

export function PowersOf10GeoGebra(props: Partial<GeoGebraWidgetProps>) {
  const commands = [
    'A = (0, 0)',
    'B = (1, 0)', 
    'C = (10, 0)',
    'D = (100, 0)',
    'E = (1000, 0)',
    'SetCaption(A, "10^0 = 1")',
    'SetCaption(B, "10^1 = 10")',
    'SetCaption(C, "10^2 = 100")',
    'SetCaption(D, "10^3 = 1000")',
    'ShowLabel(A, true)',
    'ShowLabel(B, true)',
    'ShowLabel(C, true)',
    'ShowLabel(D, true)'
  ];

  return (
    <GeoGebraWidget
      appName="graphing"
      commands={commands}
      showAlgebraInput={false}
      showToolBar={false}
      width={600}
      height={300}
      {...props}
    />
  );
}

export function GeometryExplorer(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="geometry"
      showToolBar={true}
      showAlgebraInput={true}
      enableRightClick={true}
      enableLabelDrags={true}
      width={600}
      height={400}
      {...props}
    />
  );
}

export function FunctionGrapher(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="graphing"
      showAlgebraInput={true}
      showToolBar={true}
      width={500}
      height={400}
      {...props}
    />
  );
}

export function Calculator3D(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="3d"
      showToolBar={true}
      showAlgebraInput={true}
      width={600}
      height={500}
      {...props}
    />
  );
}

// Utility function to create GeoGebra content from text descriptions
export function createGeoGebraFromDescription(description: string): string[] {
  const commands: string[] = [];
  
  // Parse common mathematical descriptions
  if (description.includes('linear function') || description.includes('y =')) {
    const functionMatch = description.match(/y\s*=\s*([^,\n]+)/);
    if (functionMatch) {
      commands.push(`f(x) = ${functionMatch[1].trim()}`);
    }
  }
  
  if (description.includes('point') && description.includes('(')) {
    const pointMatches = description.match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/g);
    if (pointMatches) {
      pointMatches.forEach((point, index) => {
        commands.push(`P${index + 1} = ${point}`);
      });
    }
  }
  
  if (description.includes('circle')) {
    const radiusMatch = description.match(/radius\s+(\d+)/);
    if (radiusMatch) {
      commands.push(`Circle((0,0), ${radiusMatch[1]})`);
    }
  }
  
  return commands;
}
