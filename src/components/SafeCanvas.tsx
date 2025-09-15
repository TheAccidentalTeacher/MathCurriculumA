'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Cone, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

// Global WebGL context manager to prevent context exhaustion
class WebGLContextManager {
  private static activeContexts: number = 0;
  private static maxContexts: number = 8; // Increased limit for better UX
  private static queue: Array<() => void> = [];

  static canCreateContext(): boolean {
    return this.activeContexts < this.maxContexts;
  }

  static requestContext(callback: () => void) {
    if (this.canCreateContext()) {
      this.activeContexts++;
      console.log(`🎮 WebGL context granted (${this.activeContexts}/${this.maxContexts})`);
      callback();
    } else {
      console.log(`⏳ WebGL context queued (${this.queue.length} waiting)`);
      this.queue.push(callback);
    }
  }

  static releaseContext() {
    this.activeContexts = Math.max(0, this.activeContexts - 1);
    console.log(`🔄 WebGL context released (${this.activeContexts}/${this.maxContexts})`);
    
    if (this.queue.length > 0) {
      const nextCallback = this.queue.shift();
      if (nextCallback) {
        this.activeContexts++;
        console.log(`🎮 WebGL context granted from queue (${this.activeContexts}/${this.maxContexts})`);
        nextCallback();
      }
    }
  }

  static getActiveCount(): number {
    return this.activeContexts;
  }

  static getQueueLength(): number {
    return this.queue.length;
  }
}

// Safe Canvas component that handles initialization properly
interface SafeCanvasProps {
  children: React.ReactNode;
  camera?: any;
  style?: React.CSSProperties;
  onError?: (error: Error) => void;
  gl?: any;
  dpr?: [number, number];
  onCreated?: (state: any) => void;
}

function SafeCanvas({ children, camera, style, onError, gl, dpr, onCreated }: SafeCanvasProps) {
  const [canvasReady, setCanvasReady] = useState(false);
  const [contextAvailable, setContextAvailable] = useState(false);
  const [webglError, setWebglError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRequestedRef = useRef(false);

  useEffect(() => {
    // Request WebGL context
    if (!contextRequestedRef.current) {
      contextRequestedRef.current = true;
      
      // Check WebGL support first
      try {
        const canvas = document.createElement('canvas');
        const webglContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!webglContext) {
          console.error('❌ WebGL not supported in this browser');
          setWebglError('WebGL not supported in this browser');
          if (onError) onError(new Error('WebGL not supported'));
          return;
        }
        
        console.log('✅ WebGL support confirmed, requesting context...');
        
        WebGLContextManager.requestContext(() => {
          console.log('🎮 WebGL context granted, setting up Canvas...');
          setContextAvailable(true);
          
          // Ensure DOM is fully ready
          const timer = setTimeout(() => {
            if (containerRef.current) {
              console.log('🎨 DOM ready, Canvas initialization starting...');
              setCanvasReady(true);
            } else {
              console.error('❌ Container ref not available');
              setWebglError('Container not ready');
            }
          }, 100); // Increased delay to ensure stability

          return () => clearTimeout(timer);
        });
      } catch (error) {
        console.error('❌ WebGL context setup failed:', error);
        setWebglError(`WebGL setup failed: ${error}`);
        if (onError) onError(error as Error);
      }
    }

    // Cleanup function to release context
    return () => {
      if (contextAvailable) {
        console.log('🧹 Cleaning up WebGL context...');
        WebGLContextManager.releaseContext();
      }
    };
  }, [contextAvailable, onError]);

  if (webglError) {
    return (
      <div ref={containerRef} style={style} className="flex items-center justify-center">
        <div className="text-red-500">
          WebGL Error: {webglError}
        </div>
      </div>
    );
  }

  if (!contextAvailable) {
    return (
      <div ref={containerRef} style={style} className="flex items-center justify-center">
        <div className="text-gray-500">
          Waiting for WebGL context... ({WebGLContextManager.getActiveCount()}/{8} active, {WebGLContextManager.getQueueLength()} queued)
        </div>
      </div>
    );
  }

  if (!canvasReady) {
    return (
      <div ref={containerRef} style={style} className="flex items-center justify-center">
        <div className="text-gray-500">Initializing WebGL...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading 3D...</div>}>
        <Canvas
          camera={camera}
          style={style}
          onError={(error: any) => {
            console.error('Canvas error:', error);
            if (onError) onError(new Error(error.message || 'Canvas error'));
          }}
          gl={{ 
            ...gl,
            preserveDrawingBuffer: true,
            antialias: false, // Disable antialias to reduce GPU load
            alpha: false,
            powerPreference: 'default', // Use default instead of high-performance
            failIfMajorPerformanceCaveat: false
          }}
          dpr={[1, 1]} // Force lower DPR to reduce GPU load
          onCreated={(state) => {
            // Additional safety checks
            try {
              if (state && state.gl && state.gl.domElement) {
                // Fix: Check if getParameter exists before calling it
                let contextInfo = 'unknown';
                if (typeof state.gl.getParameter === 'function') {
                  try {
                    contextInfo = state.gl.getParameter(state.gl.VERSION) || 'no-version';
                  } catch (e) {
                    contextInfo = 'version-error';
                  }
                }
                
                console.log('✅ Canvas created successfully', {
                  activeContexts: WebGLContextManager.getActiveCount(),
                  contextId: contextInfo,
                  glType: typeof state.gl,
                  hasGetParameter: typeof state.gl.getParameter === 'function'
                });
                if (onCreated) onCreated(state);
              }
            } catch (error) {
              console.warn('⚠️ Canvas creation callback error:', error);
              if (onError) onError(error as Error);
            }
          }}
        >
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}

export default SafeCanvas;
