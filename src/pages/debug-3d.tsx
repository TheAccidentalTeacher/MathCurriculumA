import React from 'react';
import ThreeGeometryVisualizer from '../components/ThreeGeometryVisualizer';

export default function Debug3D() {
  React.useEffect(() => {
    // Add global debugging
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).THREE_DEBUG) {
        console.log('🔍 Current THREE_DEBUG state:', (window as any).THREE_DEBUG);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">3D Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Sphere Test</h2>
            <ThreeGeometryVisualizer
              shape="sphere"
              dimensions={{ radius: 1.5 }}
              color="#059669"
              showMeasurements={true}
              showAxes={true}
              interactive={true}
              animation="bounce"
            />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4">Cube Test</h2>
            <ThreeGeometryVisualizer
              shape="cube"
              dimensions={{ width: 2, height: 2, depth: 2 }}
              color="#4f46e5"
              showMeasurements={true}
              showAxes={true}
              interactive={true}
              animation="rotate"
            />
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold mb-2">Debug Information</h3>
          <p className="text-sm text-gray-600">Check the browser console for detailed debugging output.</p>
          <p className="text-sm text-gray-600">If you see "Simple3DFallback" components instead of 3D visualizations, there's an issue with the WebGL context or client-side rendering.</p>
          
          <div className="mt-4">
            <button 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  console.log('🔍 Manual debug check:', {
                    windowDefined: typeof window !== 'undefined',
                    documentDefined: typeof document !== 'undefined',
                    webGLSupported: (() => {
                      try {
                        const canvas = document.createElement('canvas');
                        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
                      } catch (e) {
                        return false;
                      }
                    })(),
                    THREE_DEBUG: (window as any).THREE_DEBUG
                  });
                }
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Manual Debug Check
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
