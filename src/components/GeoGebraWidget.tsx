'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface GeoGebraWidgetProps {
  // Basic configuration
  appName?: 'graphing' | 'geometry' | '3d' | 'calculator' | 'suite' | 'cas' | 'classic';
  width?: number;
  height?: number;
  
  // Content configuration  
  ggbBase64?: string;
  commands?: string[];
  material_id?: string;
  filename?: string;
  
  // Interactive features (following official GeoGebra parameters)
  enableRightClick?: boolean;
  enableLabelDrags?: boolean; 
  enableShiftDragZoom?: boolean;
  showToolBar?: boolean;
  showMenuBar?: boolean;
  showAlgebraInput?: boolean;
  showResetIcon?: boolean;
  showToolBarHelp?: boolean;
  showZoomButtons?: boolean;
  allowStyleBar?: boolean;
  
  // Styling
  className?: string;
  
  // Callbacks
  onReady?: (api: GeoGebraAPI) => void;
  onError?: (error: string) => void;
}

// Define GeoGebra API interface
interface GeoGebraAPI {
  evalCommand: (command: string) => void;
  getValue: (objName: string) => number;
  setVisible: (objName: string, visible: boolean) => void;
  setValue: (objName: string, value: number) => void;
  getXML: () => string;
  setXML: (xml: string) => void;
  registerAddListener: (callback: (name: string) => void) => void;
  registerUpdateListener: (callback: (name: string) => void) => void;
  registerClickListener: (callback: (name: string) => void) => void;
  getObjectNumber: () => number;
  getObjectName: (i: number) => string;
  remove?: () => void; // Optional method for cleanup
}

// Declare GeoGebra global types
declare global {
  interface Window {
    GGBApplet: new (parameters: Record<string, unknown>, version?: string) => {
      inject: (id: string) => void;
      setHTML5Codebase: (url: string) => void;
    };
  }
}

// Global applet registry to prevent conflicts
const appletRegistry = new Map<string, GeoGebraAPI>();
let scriptPromise: Promise<void> | null = null;

// Load the official GeoGebra deployggb.js script
const loadGeoGebraScript = (): Promise<void> => {
  // Return existing promise if already loading
  if (scriptPromise) {
    return scriptPromise;
  }

  // Check if already loaded
  if (window.GGBApplet) {
    return Promise.resolve();
  }

  // Create new loading promise
  scriptPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="deployggb.js"]');
    if (existingScript) {
      const checkGlobal = () => {
        if (window.GGBApplet) {
          resolve();
        } else {
          setTimeout(checkGlobal, 100);
        }
      };
      checkGlobal();
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = 'https://www.geogebra.org/apps/deployggb.js';
    script.async = true;
    
    script.onload = () => {
      // Wait for GGBApplet to be available
      const checkGGBApplet = () => {
        if (window.GGBApplet) {
          console.log('✅ GeoGebra script loaded successfully');
          resolve();
        } else {
          setTimeout(checkGGBApplet, 50);
        }
      };
      checkGGBApplet();
    };
    
    script.onerror = () => {
      scriptPromise = null; // Reset so we can try again
      reject(new Error('Failed to load GeoGebra script'));
    };
    
    document.head.appendChild(script);
  });

  return scriptPromise;
};

export default function GeoGebraWidget({
  appName = 'graphing',
  width = 500,
  height = 400,
  ggbBase64,
  commands = [],
  material_id,
  filename,
  enableRightClick = true,
  enableLabelDrags = true,
  enableShiftDragZoom = true,
  showToolBar = false,
  showMenuBar = false,
  showAlgebraInput = false,
  showResetIcon = false,
  showToolBarHelp = false,
  showZoomButtons = false,
  allowStyleBar = false,
  className = '',
  onReady,
  onError
}: GeoGebraWidgetProps) {

  
  const containerRef = useRef<HTMLDivElement>(null);
  const appletIdRef = useRef(`ggb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const appletRef = useRef<GeoGebraAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const appletId = appletIdRef.current;

  // Cleanup function
  const cleanup = useCallback(() => {
    try {
      if (appletRef.current) {
        // Try to remove the applet properly
        if (typeof appletRef.current.remove === 'function') {
          appletRef.current.remove();
        }
        appletRef.current = null;
      }
      
      // Remove from registry
      if (appletRegistry.has(appletId)) {
        appletRegistry.delete(appletId);
      }
      
      // Clear container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      
      console.log(`🧹 Cleaned up GeoGebra applet: ${appletId}`);
    } catch (error) {
      console.warn('Cleanup error:', error);
    }
  }, [appletId]);

  const initializeApplet = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Load GeoGebra script first
      await loadGeoGebraScript();
      
      if (!window.GGBApplet) {
        throw new Error('GGBApplet not available after script load');
      }

      if (!containerRef.current) {
        throw new Error('Container element not available');
      }

      // Clean up any existing applet
      cleanup();

      // Create applet parameters following official GeoGebra documentation
      const params: Record<string, unknown> = {
        appName: appName,
        width: width,
        height: height,
        showToolBar: showToolBar,
        showMenuBar: showMenuBar, 
        showAlgebraInput: showAlgebraInput,
        showResetIcon: showResetIcon,
        showToolBarHelp: showToolBarHelp,
        showZoomButtons: showZoomButtons,
        allowStyleBar: allowStyleBar,
        enableRightClick: enableRightClick,
        enableLabelDrags: enableLabelDrags,
        enableShiftDragZoom: enableShiftDragZoom,
        useBrowserForJS: true,
        preventFocus: false,
        // Official appletOnLoad callback
        appletOnLoad: (api: GeoGebraAPI) => {
          console.log(`✅ GeoGebra applet loaded: ${appletId}`);
          
          // Validate API
          if (!api || typeof api.evalCommand !== 'function') {
            const errorMsg = 'Invalid GeoGebra API object';
            console.error(errorMsg);
            setError(errorMsg);
            onError?.(errorMsg);
            return;
          }

          // Store API reference
          appletRef.current = api;
          appletRegistry.set(appletId, api);
          
          // Execute any provided commands
          if (commands && commands.length > 0) {
            try {
              commands.forEach(command => {
                api.evalCommand(command);
              });
            } catch (cmdError) {
              console.warn('Error executing commands:', cmdError);
            }
          }

          setIsLoading(false);
          onReady?.(api);
        }
      };

      // Add content parameters if provided
      if (ggbBase64) {
        params.ggbBase64 = ggbBase64;
      } else if (material_id) {
        params.material_id = material_id;
      } else if (filename) {
        params.filename = filename;
      }

      console.log(`🚀 Creating GeoGebra applet: ${appletId}`, params);

      // Create applet using official pattern
      const applet = new window.GGBApplet(params, '5.0');
      
      // Create container element with unique ID
      const appletDiv = document.createElement('div');
      appletDiv.id = appletId;
      appletDiv.style.width = `${width}px`;
      appletDiv.style.height = `${height}px`;
      
      containerRef.current.appendChild(appletDiv);
      
      // Inject applet using official method
      applet.inject(appletId);
      
      // Set timeout to handle loading failures
      setTimeout(() => {
        if (isLoading && !appletRef.current && !error) {
          const timeoutError = 'GeoGebra applet loading timeout';
          console.error(timeoutError);
          setError(timeoutError);
          onError?.(timeoutError);
          setIsLoading(false);
        }
      }, 10000);

    } catch (initError) {
      const errorMessage = initError instanceof Error ? initError.message : 'Failed to initialize GeoGebra applet';
      console.error('GeoGebra initialization error:', initError);
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  }, [appletId, appName, width, height, ggbBase64, material_id, filename, commands, showToolBar, showMenuBar, showAlgebraInput, showResetIcon, showToolBarHelp, showZoomButtons, allowStyleBar, enableRightClick, enableLabelDrags, enableShiftDragZoom, onReady, onError]);

  // Initialize applet on mount and when dependencies change
  useEffect(() => {
    initializeApplet();
    
    return cleanup; // Cleanup on unmount
  }, [initializeApplet, cleanup]);

  // Retry handler
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
    }
  };

  // Public API methods
  const executeCommand = (command: string) => {
    if (appletRef.current && !isLoading) {
      try {
        appletRef.current.evalCommand(command);
      } catch (error) {
        console.warn('Command execution error:', error);
      }
    }
  };

  const getAppletAPI = () => {
    return appletRef.current;
  };

  // Expose methods for parent components
  React.useImperativeHandle(undefined, () => ({
    executeCommand,
    getAPI: getAppletAPI,
    retry: handleRetry
  }));

  // Error state rendering
  if (error) {
    return (
      <div className={`p-4 border border-red-300 rounded-lg bg-red-50 ${className}`}>
        <div className="flex items-center text-red-700 mb-2">
          <span className="mr-2">⚠️</span>
          <span className="font-medium">GeoGebra Error</span>
        </div>
        <div className="text-sm text-red-600 mb-3">{error}</div>
        
        {/* Show fallback content */}
        {commands.length > 0 && (
          <div className="mb-3 p-3 bg-white border rounded text-xs">
            <div className="font-medium mb-1">Mathematical Content:</div>
            {commands.map((command, idx) => (
              <div key={idx} className="font-mono text-gray-700">{command}</div>
            ))}
          </div>
        )}
        
        {retryCount < 3 && (
          <button 
            onClick={handleRetry}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Retry ({retryCount + 1}/3)
          </button>
        )}
      </div>
    );
  }

  // Main render
  return (
    <div className={`geogebra-widget relative ${className}`}>
      <div 
        ref={containerRef}
        className="geogebra-container"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-600">Loading GeoGebra...</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pre-configured widgets for common use cases

export function GraphingCalculator(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="graphing"
      showAlgebraInput={true}
      showToolBar={true}
      width={600}
      height={400}
      {...props}
    />
  );
}

export function GeometryTool(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="geometry"
      showToolBar={true}
      enableRightClick={true}
      enableLabelDrags={true}
      width={600}
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

// Utility function to create commands from descriptions
export function createCommandsFromDescription(description: string): string[] {
  const commands: string[] = [];
  
  // Basic parsing for common mathematical content
  if (description.includes('cube') || description.includes('3D')) {
    commands.push('a = 2');
    commands.push('Cube((-a/2,-a/2,-a/2), (a/2,a/2,a/2))');
  }
  
  if (description.includes('sphere')) {
    commands.push('Sphere((0,0,0), 2)');
  }
  
  if (description.includes('linear') && description.includes('function')) {
    commands.push('f(x) = 2x + 1');
  }
  
  return commands;
}
