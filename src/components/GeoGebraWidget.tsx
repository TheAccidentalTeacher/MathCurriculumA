'use client';

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';

// GeoGebra API interface for programmatic control
export interface GeoGebraAPI {
  executeCommand: (command: string) => boolean;
  setValue: (objName: string, value: any) => boolean;
  getValue: (objName: string) => any;
  getObjectNames: () => string[];
  getObjectType: (objName: string) => string | null;
  setVisible: (objName: string, visible: boolean) => boolean;
  setColor: (objName: string, red: number, green: number, blue: number) => boolean;
  undo: () => boolean;
  redo: () => boolean;
  reset: () => boolean;
  getXML: () => string | null;
  setXML: (xml: string) => boolean;
  isReady: () => boolean;
}

interface GeoGebraWidgetProps {
  // Basic configuration
  appName?: 'graphing' | 'geometry' | '3d' | 'classic' | 'suite' | 'scientific' | 'evaluator';
  width?: number;
  height?: number;
  
  // Content configuration
  ggbBase64?: string;
  commands?: string[];
  material_id?: string;
  filename?: string;
  
  // UI Control
  showToolBar?: boolean;
  showMenuBar?: boolean;
  showAlgebraInput?: boolean;
  showResetIcon?: boolean;
  showZoomButtons?: boolean;
  showFullscreenButton?: boolean;
  
  // Interaction settings
  enableRightClick?: boolean;
  enableLabelDrags?: boolean;
  enableShiftDragZoom?: boolean;
  enableFileFeatures?: boolean;
  preventFocus?: boolean;
  
  // Visual settings
  borderColor?: string;
  borderRadius?: number;
  scale?: number;
  transparentGraphics?: boolean;
  
  // Advanced settings
  customToolBar?: string;
  perspective?: string;
  language?: string;
  rounding?: string;
  randomize?: boolean;
  
  // Callback functions
  onReady?: (api: any) => void;
  onUpdate?: (objName: string) => void;
  onAdd?: (objName: string) => void;
  onRemove?: (objName: string) => void;
  onClick?: (objName: string) => void;
  
  // Styling
  className?: string;
  id?: string;
}

// Generate unique ID for each widget instance
const generateUniqueId = () => `ggb-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Global GeoGebra API interface
declare global {
  interface Window {
    GGBApplet: any;
    [key: string]: any; // Allow dynamic applet storage
  }
}

const GeoGebraWidget = forwardRef<GeoGebraAPI, GeoGebraWidgetProps>(({
  appName = 'geometry',
  width = 600,
  height = 400,
  ggbBase64,
  commands = [],
  material_id,
  filename,
  showToolBar = false,
  showMenuBar = false,
  showAlgebraInput = false,
  showResetIcon = false,
  showZoomButtons = false,
  showFullscreenButton = false,
  enableRightClick = true,
  enableLabelDrags = true,
  enableShiftDragZoom = true,
  enableFileFeatures = false,
  preventFocus = false,
  borderColor = '#CCCCCC',
  borderRadius = 0,
  scale = 1,
  transparentGraphics = false,
  customToolBar,
  perspective,
  language = 'en',
  rounding,
  randomize = true,
  onReady,
  onUpdate,
  onAdd,
  onRemove,
  onClick,
  className = '',
  id
}, ref) => {
  // State management
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const initTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appletApi, setAppletApi] = useState<any>(null);
  
  // Generate stable unique ID
  const [widgetId] = useState(() => id || generateUniqueId());

  // Debug logging helper
  const addDebug = useCallback((message: string) => {
    console.log(`🔧 [${widgetId}] ${message}`);
  }, [widgetId]);

  // Initialize GeoGebra applet
  const initializeApplet = useCallback(() => {
    if (!mountedRef.current || !containerRef.current) {
      addDebug('Skipping initialization - component unmounted or container missing');
      return;
    }

    if (typeof window === 'undefined' || !window.GGBApplet) {
      addDebug('GGBApplet not available, retrying...');
      // Retry after a short delay
      initTimeoutRef.current = setTimeout(initializeApplet, 200);
      return;
    }

    addDebug('Starting applet initialization');
    setIsLoading(true);
    setError(null);

    try {
      // Configure applet parameters
      const parameters = {
        id: widgetId,
        appName: appName,
        width: width,
        height: height,
        showToolBar: showToolBar,
        showMenuBar: showMenuBar,
        showAlgebraInput: showAlgebraInput,
        showResetIcon: showResetIcon,
        showZoomButtons: showZoomButtons,
        showFullscreenButton: showFullscreenButton,
        enableRightClick: enableRightClick,
        enableLabelDrags: enableLabelDrags,
        enableShiftDragZoom: enableShiftDragZoom,
        enableFileFeatures: enableFileFeatures,
        preventFocus: preventFocus,
        borderColor: borderColor,
        borderRadius: borderRadius,
        scale: scale,
        transparentGraphics: transparentGraphics,
        language: language,
        randomize: randomize,
        useBrowserForJS: true,
        showLogging: process.env.NODE_ENV === 'development',
        errorDialogsActive: false, // Suppress error dialogs
        allowSymbolTable: true,
        
        // Content loading
        ...(ggbBase64 && { ggbBase64 }),
        ...(material_id && { material_id }),
        ...(filename && { filename }),
        ...(customToolBar && { customToolBar }),
        ...(perspective && { perspective }),
        ...(rounding && { rounding }),

        // Critical: appletOnLoad callback
        appletOnLoad: function(api: any) {
          if (!mountedRef.current) {
            addDebug('Component unmounted during load, aborting');
            try {
              api?.remove();
            } catch (e) {
              // Ignore cleanup errors
            }
            return;
          }

          addDebug('AppletOnLoad callback triggered');

          try {
            // Validate API
            if (!api || typeof api.evalCommand !== 'function') {
              throw new Error('Invalid GeoGebra API received');
            }

            // Store API reference
            window[widgetId] = api;
            setAppletApi(api);
            setIsLoaded(true);
            setIsLoading(false);
            
            addDebug('Applet loaded and API stored');

            // Execute commands if provided
            if (commands && commands.length > 0) {
              addDebug(`Executing ${commands.length} commands`);
              
              setTimeout(() => {
                if (!mountedRef.current || !window[widgetId]) {
                  addDebug('Component unmounted before command execution');
                  return;
                }

                commands.forEach((command, index) => {
                  setTimeout(() => {
                    if (mountedRef.current && window[widgetId]) {
                      try {
                        window[widgetId].evalCommand(command);
                        addDebug(`Executed command: ${command}`);
                      } catch (err) {
                        // Handle common GeoGebra errors gracefully
                        const errorMessage = err instanceof Error ? err.message : String(err);
                        if (errorMessage.includes('Illegal assignment') || 
                            errorMessage.includes('Fixed objects may not be changed')) {
                          addDebug(`Skipping restricted command: ${command} (${errorMessage})`);
                        } else {
                          console.error(`Command execution failed: ${command}`, err);
                        }
                      }
                    }
                  }, index * 100);
                });
              }, 500);
            }

            // Register event listeners
            if (onUpdate && mountedRef.current) {
              api.registerUpdateListener((objName: string) => {
                if (mountedRef.current) onUpdate(objName);
              });
            }

            if (onAdd && mountedRef.current) {
              api.registerAddListener((objName: string) => {
                if (mountedRef.current) onAdd(objName);
              });
            }

            if (onRemove && mountedRef.current) {
              api.registerRemoveListener((objName: string) => {
                if (mountedRef.current) onRemove(objName);
              });
            }

            if (onClick && mountedRef.current) {
              api.registerClickListener((objName: string) => {
                if (mountedRef.current) onClick(objName);
              });
            }

            // Call onReady callback
            if (onReady && mountedRef.current) {
              onReady(api);
            }

            addDebug('Initialization complete');

          } catch (callbackError) {
            addDebug(`Callback error: ${callbackError}`);
            setError(`Initialization failed: ${callbackError}`);
            setIsLoading(false);
          }
        }
      };

      // Create and inject applet
      const applet = new window.GGBApplet(parameters, true);
      
      // Clear container and inject
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        applet.inject(widgetId);
        addDebug('Applet injection initiated');
      }

      // Set timeout for initialization failure
      initTimeoutRef.current = setTimeout(() => {
        if (!isLoaded && mountedRef.current) {
          addDebug('Initialization timeout - appletOnLoad never called');
          setError('Initialization timeout: GeoGebra failed to load');
          setIsLoading(false);
        }
      }, 10000);

    } catch (initError) {
      addDebug(`Initialization error: ${initError}`);
      setError(`Failed to initialize: ${initError}`);
      setIsLoading(false);
    }
  }, [
    widgetId, appName, width, height, showToolBar, showMenuBar, showAlgebraInput,
    showResetIcon, showZoomButtons, showFullscreenButton, enableRightClick,
    enableLabelDrags, enableShiftDragZoom, enableFileFeatures, preventFocus,
    borderColor, borderRadius, scale, transparentGraphics, language, randomize,
    ggbBase64, material_id, filename, customToolBar, perspective, rounding,
    commands, onReady, onUpdate, onAdd, onRemove, onClick, isLoaded, addDebug
  ]);

  // Expose API methods through ref
  useImperativeHandle(ref, () => ({
    executeCommand: (command: string) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          return appletApi.evalCommand(command);
        } catch (error) {
          console.error('Command execution failed:', error);
          return false;
        }
      }
      return false;
    },
    setValue: (objName: string, value: any) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          return appletApi.setValue(objName, value);
        } catch (error) {
          console.error('setValue failed:', error);
          return false;
        }
      }
      return false;
    },
    getValue: (objName: string) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          return appletApi.getValue(objName);
        } catch (error) {
          console.error('getValue failed:', error);
          return undefined;
        }
      }
      return undefined;
    },
    getObjectNames: () => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          return appletApi.getAllObjectNames();
        } catch (error) {
          console.error('getObjectNames failed:', error);
          return [];
        }
      }
      return [];
    },
    getObjectType: (objName: string) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          return appletApi.getObjectType(objName);
        } catch (error) {
          console.error('getObjectType failed:', error);
          return null;
        }
      }
      return null;
    },
    setVisible: (objName: string, visible: boolean) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          appletApi.setVisible(objName, visible);
          return true;
        } catch (error) {
          console.error('setVisible failed:', error);
          return false;
        }
      }
      return false;
    },
    setColor: (objName: string, red: number, green: number, blue: number) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          appletApi.setColor(objName, red, green, blue);
          return true;
        } catch (error) {
          console.error('setColor failed:', error);
          return false;
        }
      }
      return false;
    },
    undo: () => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          appletApi.undo();
          return true;
        } catch (error) {
          console.error('undo failed:', error);
          return false;
        }
      }
      return false;
    },
    redo: () => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          appletApi.redo();
          return true;
        } catch (error) {
          console.error('redo failed:', error);
          return false;
        }
      }
      return false;
    },
    reset: () => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          appletApi.reset();
          return true;
        } catch (error) {
          console.error('reset failed:', error);
          return false;
        }
      }
      return false;
    },
    getXML: () => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          return appletApi.getXML();
        } catch (error) {
          console.error('getXML failed:', error);
          return null;
        }
      }
      return null;
    },
    setXML: (xml: string) => {
      if (appletApi && isLoaded && mountedRef.current) {
        try {
          appletApi.setXML(xml);
          return true;
        } catch (error) {
          console.error('setXML failed:', error);
          return false;
        }
      }
      return false;
    },
    isReady: () => {
      return isLoaded && appletApi !== null;
    }
  }), [appletApi, isLoaded]);

  // Cleanup function
  const cleanup = useCallback(() => {
    addDebug('Starting cleanup');
    
    // Clear timeout
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
      initTimeoutRef.current = undefined;
    }
    
    // Remove applet if it exists
    if (typeof window !== 'undefined') {
      const applet = window[widgetId];
      if (applet && typeof applet.remove === 'function') {
        try {
          applet.remove();
          addDebug('Applet removed successfully');
        } catch (err) {
          console.warn(`Failed to remove applet ${widgetId}:`, err);
        }
      }
      
      // Clean up window reference
      if (window[widgetId]) {
        delete window[widgetId];
        addDebug('Window reference cleaned');
      }
    }
    
    // Reset state
    setIsLoaded(false);
    setIsLoading(false);
    setAppletApi(null);
    setError(null);
  }, [widgetId, addDebug]);

  // Initialize on mount
  useEffect(() => {
    mountedRef.current = true;
    initializeApplet();
    
    return () => {
      mountedRef.current = false;
      cleanup();
    };
  }, []); // Empty dependency array - only run on mount/unmount

  // Handle error state
  if (error) {
    return (
      <div className={`p-4 border border-red-300 rounded-lg bg-red-50 text-red-700 ${className}`} style={{ width, height }}>
        <div className="flex items-center mb-2">
          <span className="mr-2 text-red-500">⚠️</span>
          <span className="font-medium">GeoGebra Error</span>
        </div>
        <p className="text-sm mb-3">{error}</p>
        <button 
          onClick={() => {
            setError(null);
            initializeApplet();
          }} 
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className={`geogebra-container relative ${className}`} style={{ width, height }}>
      <div 
        id={widgetId}
        ref={containerRef}
        className="geogebra-applet w-full h-full"
        style={{ width, height }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <div className="text-sm text-gray-700 font-medium">Loading GeoGebra...</div>
            <div className="text-xs text-gray-500 mt-1">ID: {widgetId}</div>
          </div>
        </div>
      )}
      
      {/* Debug panel - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs p-2 rounded max-w-xs">
          <div className="font-bold mb-1">Debug ({widgetId.split('-').pop()})</div>
          <div className="mb-1">
            Status: {isLoaded ? '✅ Ready' : isLoading ? '⏳ Loading' : '❌ Inactive'}
          </div>
          <div className="mb-1">
            GGBApplet: {typeof window !== 'undefined' && window.GGBApplet ? '✅' : '❌'}
          </div>
        </div>
      )}
    </div>
  );
});

GeoGebraWidget.displayName = 'GeoGebraWidget';

// Pre-configured widget variants
export function PlaneSection3D(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="3d"
      showToolBar={true}
      showZoomButtons={true}
      showResetIcon={true}
      enableRightClick={true}
      commands={[
        'A = (0, 0, 0)',
        'B = (4, 0, 0)',
        'cube = Cube[A, B]',
        'SetColor(cube, "blue")'
      ]}
      width={800}
      height={600}
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
      showResetIcon={true}
      enableRightClick={true}
      enableLabelDrags={true}
      customToolBar="0 1 2 3 4 5 6 7 | 8 9 10 11 12 13 14 15 16 17 18 19"
      width={700}
      height={500}
      {...props}
    />
  );
}

export function ShapeExplorer(props: Partial<GeoGebraWidgetProps>) {
  return (
    <GeoGebraWidget
      appName="geometry"
      showToolBar={true}
      showAlgebraInput={true}
      showResetIcon={true}
      enableRightClick={true}
      enableLabelDrags={true}
      customToolBar="0 1 2 3 4 5 6 7 | 8 9 10 11 12 13 14 15 16 17 18 19"
      width={700}
      height={500}
      {...props}
    />
  );
}

// Utility functions
export function createGeoGebraFromDescription(description: string): string[] {
  const commands: string[] = [];
  
  if (description.includes('cube')) {
    commands.push('A = (0, 0, 0)');
    commands.push('B = (2, 0, 0)');
    commands.push('cube = Cube[A, B]');
  }
  
  if (description.includes('sphere')) {
    const radiusMatch = description.match(/radius\s+(\d+)/);
    if (radiusMatch) {
      commands.push(`sphere = Sphere((0, 0, 0), ${radiusMatch[1]})`);
    } else {
      commands.push('sphere = Sphere((0, 0, 0), 2)');
    }
  }
  
  if (description.includes('cylinder')) {
    commands.push('A = (0, 0, 0)');
    commands.push('B = (0, 0, 3)');
    commands.push('cylinder = Cylinder(A, B, 1.5)');
  }
  
  return commands;
}

export function createInteractiveLesson(lessonType: string, props: Partial<GeoGebraWidgetProps> = {}) {
  switch (lessonType.toLowerCase()) {
    case 'plane sections':
    case 'cross sections':
    case '3d sections':
      return <PlaneSection3D {...props} />;
      
    case 'geometry':
    case 'shapes':
      return <GeometryExplorer {...props} />;
      
    case 'basic shapes':
      return <ShapeExplorer {...props} />;
      
    default:
      return <GeoGebraWidget {...props} />;
  }
}

export default GeoGebraWidget;
