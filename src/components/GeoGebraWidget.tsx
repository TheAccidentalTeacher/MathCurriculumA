'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

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
    ggbOnInit?: (name: string) => void;
  }
}

// Global registry to track applets and prevent conflicts
const appletRegistry = new Map<string, any>();
let scriptLoadPromise: Promise<void> | null = null;

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
  const appletId = useRef(`ggb_${Math.random().toString(36).substr(2, 9)}`);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const loadGeoGebraScript = useCallback((): Promise<void> => {
    if (scriptLoadPromise) {
      return scriptLoadPromise;
    }

    if (window.GGBApplet) {
      return Promise.resolve();
    }

    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.geogebra.org/apps/deployggb.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load GeoGebra API'));
      document.head.appendChild(script);
    });

    return scriptLoadPromise;
  }, []);

  const initializeApplet = useCallback(async () => {
    if (!appletRef.current || error) return;

    try {
      await loadGeoGebraScript();
      
      if (!window.GGBApplet) {
        throw new Error('GeoGebra API not available after script load');
      }

      const containerId = appletId.current;
      appletRef.current.id = containerId;

      // Clear any existing content
      appletRef.current.innerHTML = '';

      const parameters = {
        id: containerId,
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
        useBrowserForJS: true,
        allowStyleBar: false,
        preventFocus: false,
        // Load content if provided
        ...(ggbBase64 && { ggbBase64 }),
        ...(material_id && { material_id })
      };

      // Create unique callback function for this applet
      const callbackName = `ggbInit_${containerId}`;
      (window as any)[callbackName] = () => {
        try {
          const api = appletRegistry.get(containerId);
          if (api) {
            // Execute commands after initialization
            commands.forEach(command => {
              try {
                api.evalCommand(command);
              } catch (cmdError) {
                console.warn(`GeoGebra command failed: ${command}`, cmdError);
              }
            });

            // Set up update listener
            if (onUpdate) {
              api.registerUpdateListener((objName: string) => {
                onUpdate(objName);
              });
            }

            setIsLoaded(true);
            onReady?.();

            // Cleanup the global callback
            delete (window as any)[callbackName];
          }
        } catch (err) {
          console.error('GeoGebra callback error:', err);
          setError('Failed to initialize GeoGebra applet');
        }
      };

      // Add callback to parameters
      (parameters as any).appletOnLoad = callbackName;

      const ggbApp = new window.GGBApplet(parameters, true);
      
      // Register the applet API for later use
      const originalInject = ggbApp.inject;
      ggbApp.inject = function(container: string | HTMLElement) {
        const result = originalInject.call(this, container);
        
        // Store API reference after injection
        setTimeout(() => {
          try {
            const api = ggbApp.getAPI();
            if (api) {
              appletRegistry.set(containerId, api);
            }
          } catch (err) {
            console.warn('Failed to get GeoGebra API:', err);
          }
        }, 100);
        
        return result;
      };

      // Inject the applet
      ggbApp.inject(containerId);

      // Store cleanup function
      cleanupRef.current = () => {
        appletRegistry.delete(containerId);
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName];
        }
      };

    } catch (err) {
      console.error('GeoGebra initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize GeoGebra');
    }
  }, [appName, width, height, ggbBase64, material_id, commands, onReady, onUpdate, loadGeoGebraScript, error]);

  useEffect(() => {
    // Clear any previous error state
    setError(null);
    setIsLoaded(false);

    // Set timeout for initialization
    initTimeoutRef.current = setTimeout(() => {
      if (!isLoaded && !error) {
        setError('GeoGebra initialization timeout');
      }
    }, 15000);

    // Initialize the applet
    initializeApplet();

    return () => {
      // Cleanup timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // Cleanup applet
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [initializeApplet, isLoaded, error]);

  // Public API for external control
  const executeCommand = useCallback((command: string) => {
    const api = appletRegistry.get(appletId.current);
    if (api && isLoaded) {
      api.evalCommand(command);
    }
  }, [isLoaded]);

  const setValue = useCallback((objName: string, value: any) => {
    const api = appletRegistry.get(appletId.current);
    if (api && isLoaded) {
      api.setValue(objName, value);
    }
  }, [isLoaded]);

  const getValue = useCallback((objName: string) => {
    const api = appletRegistry.get(appletId.current);
    if (api && isLoaded) {
      return api.getValue(objName);
    }
    return null;
  }, [isLoaded]);

  if (error) {
    return (
      <div className={`p-4 border border-red-300 rounded-lg bg-red-50 ${className}`}>
        <div className="flex items-center text-red-700 mb-2">
          <span className="mr-2">⚠️</span>
          <span>GeoGebra Error: {error}</span>
        </div>
        
        {/* Fallback content */}
        <div className="mt-3 p-3 bg-white border rounded text-sm text-gray-600">
          <strong>Fallback Content:</strong> 
          {commands.length > 0 && (
            <div className="mt-2">
              <strong>Mathematical Commands:</strong>
              <ul className="list-disc list-inside mt-1">
                {commands.map((command, idx) => (
                  <li key={idx} className="font-mono text-xs">{command}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => {
            setError(null);
            setIsLoaded(false);
          }} 
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Try Again
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
