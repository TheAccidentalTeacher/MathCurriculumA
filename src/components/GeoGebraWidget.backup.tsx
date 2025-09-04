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
const generateUniqueId = () => `ggb-element-${Math.random().toString(36).substr(2, 9)}`;

// Global GeoGebra API interface
declare global {
  interface Window {
    GGBApplet: any;
    ggbApplet: any;
  }
}

// Global context manager to limit concurrent GeoGebra instances
class GeoGebraContextManager {
  private static instance: GeoGebraContextManager;
  private activeInstances = new Set<string>();
  private pendingQueue: Array<{ id: string; initFn: () => void; priority: number }> = [];
  private readonly maxConcurrentInstances = 3; // Reduced from 5 to prevent overlap
  private isProcessingQueue = false;
  
  static getInstance(): GeoGebraContextManager {
    if (!GeoGebraContextManager.instance) {
      GeoGebraContextManager.instance = new GeoGebraContextManager();
    }
    return GeoGebraContextManager.instance;
  }
  
  canCreateInstance(): boolean {
    return this.activeInstances.size < this.maxConcurrentInstances;
  }
  
  registerInstance(id: string): void {
    this.activeInstances.add(id);
    console.log(`GeoGebra instances: ${this.activeInstances.size}/${this.maxConcurrentInstances} active, ${this.pendingQueue.length} queued`);
  }
  
  unregisterInstance(id: string): void {
    this.activeInstances.delete(id);
    console.log(`GeoGebra instances: ${this.activeInstances.size}/${this.maxConcurrentInstances} active, ${this.pendingQueue.length} queued`);
    
    // Process next in queue
    this.processQueue();
  }
  
  queueForInitialization(id: string, initFn: () => void, priority: number = 0): void {
    if (this.canCreateInstance()) {
      // Can initialize immediately
      initFn();
    } else {
      // Add to queue
      this.pendingQueue.push({ id, initFn, priority });
      // Sort by priority (higher priority first)
      this.pendingQueue.sort((a, b) => b.priority - a.priority);
      console.log(`Queued GeoGebra instance ${id} (priority: ${priority})`);
    }
  }
  
  private processQueue(): void {
    if (this.isProcessingQueue || this.pendingQueue.length === 0 || !this.canCreateInstance()) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    // Process next item in queue after a short delay to prevent rapid-fire creation
    setTimeout(() => {
      const next = this.pendingQueue.shift();
      if (next && this.canCreateInstance()) {
        console.log(`Processing queued GeoGebra instance ${next.id}`);
        next.initFn();
      }
      this.isProcessingQueue = false;
      
      // Continue processing if there are more items
      if (this.pendingQueue.length > 0 && this.canCreateInstance()) {
        this.processQueue();
      }
    }, 500); // 500ms delay between queue processing
  }
  
  getActiveCount(): number {
    return this.activeInstances.size;
  }
  
  getQueueLength(): number {
    return this.pendingQueue.length;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);
  const contextManager = useRef(GeoGebraContextManager.getInstance());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [applet, setApplet] = useState<any>(null);
  const [ggbApi, setGgbApi] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [containerId] = useState(() => id || generateUniqueId());

  // Cleanup function with improved lifecycle management
  const cleanup = useCallback(() => {
    isMountedRef.current = false;
    
    if (ggbApi && isLoaded) {
      try {
        // Unregister all listeners first
        if (onUpdate) {
          try {
            ggbApi.unregisterUpdateListener();
          } catch (err) {
            console.warn('Error unregistering update listener:', err);
          }
        }
        if (onAdd) {
          try {
            ggbApi.unregisterAddListener();
          } catch (err) {
            console.warn('Error unregistering add listener:', err);
          }
        }
        if (onRemove) {
          try {
            ggbApi.unregisterRemoveListener();
          } catch (err) {
            console.warn('Error unregistering remove listener:', err);
          }
        }
        if (onClick) {
          try {
            ggbApi.unregisterClickListener();
          } catch (err) {
            console.warn('Error unregistering click listener:', err);
          }
        }
        
        // Reset state before removing applet
        setIsLoaded(false);
        setGgbApi(null);
        setApplet(null);
        
        // Remove the applet
        try {
          ggbApi.remove();
        } catch (err) {
          console.warn('Error removing GeoGebra applet:', err);
        }

        // Clean up window reference (based on research)
        try {
          if (typeof window !== 'undefined' && (window as any)[containerId]) {
            delete (window as any)[containerId];
            console.log(`Cleaned up window reference: ${containerId}`);
          }
        } catch (err) {
          console.warn('Error cleaning up window reference:', err);
        }
      } catch (err) {
        console.warn('Error during GeoGebra cleanup:', err);
      }
    }
    
    // Unregister from context manager
    contextManager.current.unregisterInstance(containerId);
    
    // Reset all state
    setIsLoaded(false);
    setIsLoading(false);
    setGgbApi(null);
    setApplet(null);
    setError(null);
  }, [ggbApi, isLoaded, onUpdate, onAdd, onRemove, onClick, containerId]);

  // Initialize GeoGebra applet with context management and queuing
  const initializeGeoGebra = useCallback(async () => {
    if (!containerRef.current || !window.GGBApplet || !isMountedRef.current) {
      return;
    }

    // Use the queue system to prevent simultaneous initialization
    contextManager.current.queueForInitialization(containerId, () => {
      if (!containerRef.current || !window.GGBApplet || !isMountedRef.current) {
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Register with context manager
        contextManager.current.registerInstance(containerId);

        // Configure applet parameters according to GeoGebra API documentation
        const parameters = {
          id: containerId,
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
          showLogging: false,
          
          // Content loading
          ...(ggbBase64 && { ggbBase64 }),
          ...(material_id && { material_id }),
          ...(filename && { filename }),
          ...(customToolBar && { customToolBar }),
          ...(perspective && { perspective }),
          ...(rounding && { rounding }),

          // Critical: appletOnLoad callback for proper initialization
          appletOnLoad: function(api: any) {
            // Double-check component is still mounted
            if (!isMountedRef.current) {
              console.log('Component unmounted during applet load, aborting...');
              try {
                api?.remove();
              } catch (e) {
                // Ignore cleanup errors
              }
              return;
            }

            console.log(`GeoGebra applet loaded successfully with ID: ${containerId}`);
            
            try {
              // Double-check that the API is valid and has required methods
              if (!api || typeof api.evalCommand !== 'function') {
                console.error('Invalid GeoGebra API received in appletOnLoad');
                setError('Invalid GeoGebra API');
                return;
              }

              // Store API in window with unique ID to prevent conflicts (based on research)
              if (typeof window !== 'undefined') {
                (window as any)[containerId] = api;
              }

              setGgbApi(api);
              setApplet(api);
              setIsLoaded(true);
              setIsLoading(false);

              // Execute any provided commands after initialization with proper timing
              if (commands && commands.length > 0) {
                // Wait longer to ensure the applet is fully ready and stable
                setTimeout(() => {
                  // Check if still mounted before executing commands
                  if (!isMountedRef.current) {
                    console.log('Component unmounted before command execution, skipping...');
                    return;
                  }

                  // Verify API is still valid before executing commands
                  if (!api || typeof api.evalCommand !== 'function') {
                    console.warn('API became invalid before command execution');
                    return;
                  }

                  // Execute commands with delays between them to prevent conflicts
                  commands.forEach((command, index) => {
                    setTimeout(() => {
                      try {
                        // Final check before each command execution
                        if (isMountedRef.current && api && typeof api.evalCommand === 'function') {
                          console.log(`Executing command ${index + 1}/${commands.length}: ${command}`);
                          api.evalCommand(command);
                        } else {
                          console.warn(`Skipping command ${index + 1}, component unmounted or API invalid`);
                        }
                      } catch (error) {
                        console.error(`Error executing command "${command}":`, error);
                      }
                    }, index * 250); // Increased delay between commands to 250ms
                  });
                }, 1000); // Increased initial delay to 1000ms for better stability
              }

              // Register event listeners only if still mounted
              if (isMountedRef.current) {
                if (onUpdate) {
                  api.registerUpdateListener((objName: string) => {
                    if (isMountedRef.current) onUpdate(objName);
                  });
                }

                if (onAdd) {
                  api.registerAddListener((objName: string) => {
                    if (isMountedRef.current) onAdd(objName);
                  });
                }

                if (onRemove) {
                  api.registerRemoveListener((objName: string) => {
                    if (isMountedRef.current) onRemove(objName);
                  });
                }

                if (onClick) {
                  api.registerClickListener((objName: string) => {
                    if (isMountedRef.current) onClick(objName);
                  });
                }

                // Call the onReady callback
                onReady?.(api);
              }

            } catch (callbackError) {
              console.error('Error in appletOnLoad callback:', callbackError);
              setError('Failed to initialize applet callbacks');
              setIsLoading(false);
            }
          }
        };

        // Create and inject the applet
        const ggbApp = new window.GGBApplet(parameters, true);
        
        // Clear the container and inject the applet
        if (containerRef.current && isMountedRef.current) {
          containerRef.current.innerHTML = '';
          ggbApp.inject(containerId);
        }

      } catch (initError) {
        console.error('GeoGebra initialization error:', initError);
        setError(`Failed to initialize GeoGebra: ${initError instanceof Error ? initError.message : 'Unknown error'}`);
        setIsLoading(false);
        // Unregister on error
        contextManager.current.unregisterInstance(containerId);
      }
    }, 1); // Priority 1 (higher priority for earlier initialization)
  }, [
    containerId, appName, width, height, showToolBar, showMenuBar, showAlgebraInput,
    showResetIcon, showZoomButtons, showFullscreenButton, enableRightClick,
    enableLabelDrags, enableShiftDragZoom, enableFileFeatures, preventFocus,
    borderColor, borderRadius, scale, transparentGraphics, language, randomize,
    ggbBase64, material_id, filename, customToolBar, perspective, rounding,
    commands, onReady, onUpdate, onAdd, onRemove, onClick
  ]);

  // Set mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Effect to load GeoGebra and initialize applet
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loadAndInitialize = () => {
      if (typeof window !== 'undefined' && isMountedRef.current) {
        if (window.GGBApplet) {
          // GeoGebra is already loaded
          initializeGeoGebra();
        } else {
          // Wait for GeoGebra to load from the script tag in layout.tsx
          const checkGeoGebra = () => {
            if (window.GGBApplet && isMountedRef.current) {
              initializeGeoGebra();
            } else if (isMountedRef.current) {
              timeoutId = setTimeout(checkGeoGebra, 100);
            }
          };
          timeoutId = setTimeout(checkGeoGebra, 100);
        }
      }
    };

    loadAndInitialize();

    // Cleanup on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      cleanup();
    };
  }, [initializeGeoGebra, cleanup]);

  // Programmatic API methods (exposed through ref)
  const executeCommand = useCallback((command: string) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        // Double-check that the API is still valid
        if (typeof ggbApi.evalCommand === 'function') {
          ggbApi.evalCommand(command);
          return true;
        } else {
          console.warn('GeoGebra API is no longer valid for command:', command);
          return false;
        }
      } catch (error) {
        console.error('Failed to execute GeoGebra command:', command, error);
        return false;
      }
    }
    if (!isMountedRef.current) {
      console.warn('Component unmounted, skipping command:', command);
    } else {
      console.warn('GeoGebra not ready for command:', command);
    }
    return false;
  }, [ggbApi, isLoaded]);

  const setValue = useCallback((objName: string, value: any) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.setValue(objName, value);
        return true;
      } catch (error) {
        console.error('Failed to set value in GeoGebra:', objName, value, error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  const getValue = useCallback((objName: string) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        return ggbApi.getValue(objName);
      } catch (error) {
        console.error('Failed to get value from GeoGebra:', objName, error);
        return null;
      }
    }
    return null;
  }, [ggbApi, isLoaded]);

  const getObjectNames = useCallback(() => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        return ggbApi.getAllObjectNames();
      } catch (error) {
        console.error('Failed to get object names from GeoGebra:', error);
        return [];
      }
    }
    return [];
  }, [ggbApi, isLoaded]);

  // Enhanced API methods for educational use
  const getObjectType = useCallback((objName: string) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        return ggbApi.getObjectType(objName);
      } catch (error) {
        console.error('Failed to get object type from GeoGebra:', objName, error);
        return null;
      }
    }
    return null;
  }, [ggbApi, isLoaded]);

  const setVisible = useCallback((objName: string, visible: boolean) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.setVisible(objName, visible);
        return true;
      } catch (error) {
        console.error('Failed to set visibility in GeoGebra:', objName, visible, error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  const setColor = useCallback((objName: string, red: number, green: number, blue: number) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.setColor(objName, red, green, blue);
        return true;
      } catch (error) {
        console.error('Failed to set color in GeoGebra:', objName, red, green, blue, error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  const undo = useCallback(() => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.undo();
        return true;
      } catch (error) {
        console.error('Failed to undo in GeoGebra:', error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  const redo = useCallback(() => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.redo();
        return true;
      } catch (error) {
        console.error('Failed to redo in GeoGebra:', error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  const reset = useCallback(() => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.reset();
        return true;
      } catch (error) {
        console.error('Failed to reset GeoGebra:', error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  const getXML = useCallback(() => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        return ggbApi.getXML();
      } catch (error) {
        console.error('Failed to get XML from GeoGebra:', error);
        return null;
      }
    }
    return null;
  }, [ggbApi, isLoaded]);

  const setXML = useCallback((xml: string) => {
    if (ggbApi && isLoaded && isMountedRef.current) {
      try {
        ggbApi.setXML(xml);
        return true;
      } catch (error) {
        console.error('Failed to set XML in GeoGebra:', xml, error);
        return false;
      }
    }
    return false;
  }, [ggbApi, isLoaded]);

  // Expose API methods through ref
  useImperativeHandle(ref, () => ({
    executeCommand,
    setValue,
    getValue,
    getObjectNames,
    getObjectType,
    setVisible,
    setColor,
    undo,
    redo,
    reset,
    getXML,
    setXML,
    isReady: () => isLoaded && ggbApi !== null && isMountedRef.current
  }), [executeCommand, setValue, getValue, getObjectNames, getObjectType, setVisible, setColor, undo, redo, reset, getXML, setXML, isLoaded, ggbApi]);

  // Error state
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
            initializeGeoGebra();
          }} 
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`geogebra-container relative ${className}`} style={{ width, height }}>
      <div 
        id={containerId}
        ref={containerRef}
        className="geogebra-applet w-full h-full"
        style={{ width, height }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <div className="text-sm text-gray-700 font-medium">Loading GeoGebra...</div>
            <div className="text-xs text-gray-500 mt-1">Initializing interactive geometry</div>
          </div>
        </div>
      )}
    </div>
  );
});

GeoGebraWidget.displayName = 'GeoGebraWidget';

export default GeoGebraWidget;

// Pre-configured GeoGebra widgets for common educational use cases

export function PowersOf10GeoGebra(props: Partial<GeoGebraWidgetProps>) {
  const commands = [
    'A = Point({0, 0})',
    'B = Point({1, 0})', 
    'C = Point({10, 0})',
    'D = Point({100, 0})',
    'E = Point({1000, 0})',
    'SetCaption(A, "10^0 = 1")',
    'SetCaption(B, "10^1 = 10")',
    'SetCaption(C, "10^2 = 100")',
    'SetCaption(D, "10^3 = 1000")',
    'SetLabelVisible(A, true)',
    'SetLabelVisible(B, true)',
    'SetLabelVisible(C, true)',
    'SetLabelVisible(D, true)',
    'ZoomIn(-2, 1200, -100, 100)'
  ];

  return (
    <GeoGebraWidget
      appName="graphing"
      commands={commands}
      showAlgebraInput={false}
      showToolBar={false}
      showResetIcon={true}
      width={700}
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
      showResetIcon={true}
      enableRightClick={true}
      enableLabelDrags={true}
      enableShiftDragZoom={true}
      width={700}
      height={500}
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
      showResetIcon={true}
      enableRightClick={true}
      width={600}
      height={450}
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
      showResetIcon={true}
      enableRightClick={true}
      enableShiftDragZoom={true}
      width={700}
      height={600}
      {...props}
    />
  );
}

// Specialized widget for plane sections of 3D figures - perfect for the lesson
export function PlaneSection3D(props: Partial<GeoGebraWidgetProps>) {
  const commands = [
    // Create a cube
    'A = (0, 0, 0)',
    'B = (2, 0, 0)',
    'C = (2, 2, 0)',
    'D = (0, 2, 0)',
    'E = (0, 0, 2)',
    'F = (2, 0, 2)',
    'G = (2, 2, 2)',
    'H = (0, 2, 2)',
    'cube = Cube[A, B]',
    
    // Create an adjustable cutting plane
    'plane = Plane((1, 1, 0.5), (1, 0, 1), (0, 1, 1))',
    'SetColor(plane, 255, 100, 100)',
    'SetCaption(plane, "Cutting Plane")',
    
    // Create the intersection (cross-section)
    'intersection = Intersect(cube, plane)',
    'SetColor(intersection, 0, 150, 255)',
    'SetLineThickness(intersection, 5)',
    
    // Add slider for plane position
    'h = Slider(0, 2, 0.01, 1, 100, false, true, false, false)',
    'SetCaption(h, "Plane Height")',
    
    // Make plane move with slider
    'plane2 = Plane((1, 1, h), (1, 0, 1), (0, 1, 1))',
    'intersection2 = Intersect(cube, plane2)'
  ];

  return (
    <GeoGebraWidget
      appName="3d"
      commands={commands}
      showToolBar={true}
      showAlgebraInput={false}
      showResetIcon={true}
      enableRightClick={true}
      enableShiftDragZoom={true}
      width={800}
      height={600}
      {...props}
    />
  );
}

// Widget for exploring different geometric shapes
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
        const letter = String.fromCharCode(65 + index); // A, B, C, etc.
        commands.push(`${letter} = ${point}`);
      });
    }
  }
  
  if (description.includes('circle')) {
    const radiusMatch = description.match(/radius\s+(\d+)/);
    const centerMatch = description.match(/center\s*\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
    
    if (radiusMatch && centerMatch) {
      commands.push(`Circle((${centerMatch[1]}, ${centerMatch[2]}), ${radiusMatch[1]})`);
    } else if (radiusMatch) {
      commands.push(`Circle((0, 0), ${radiusMatch[1]})`);
    } else {
      commands.push('Circle((0, 0), 3)');
    }
  }
  
  if (description.includes('triangle')) {
    commands.push('A = (0, 0)');
    commands.push('B = (3, 0)');
    commands.push('C = (1.5, 2.6)');
    commands.push('triangle = Triangle(A, B, C)');
  }
  
  if (description.includes('rectangle') || description.includes('square')) {
    commands.push('A = (0, 0)');
    commands.push('B = (4, 0)');
    commands.push('C = (4, 3)');
    commands.push('D = (0, 3)');
    commands.push('rectangle = Polygon(A, B, C, D)');
  }
  
  // 3D shapes
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

// Helper function to create interactive lessons
export function createInteractiveLesson(lessonType: string, props: Partial<GeoGebraWidgetProps> = {}) {
  switch (lessonType.toLowerCase()) {
    case 'plane sections':
    case 'cross sections':
    case '3d sections':
      return <PlaneSection3D {...props} />;
      
    case 'geometry':
    case 'shapes':
      return <GeometryExplorer {...props} />;
      
    case 'graphing':
    case 'functions':
      return <FunctionGrapher {...props} />;
      
    case '3d':
    case 'three dimensional':
      return <Calculator3D {...props} />;
      
    case 'exploration':
    case 'interactive':
      return <ShapeExplorer {...props} />;
      
    default:
      return <GeoGebraWidget {...props} />;
  }
}
