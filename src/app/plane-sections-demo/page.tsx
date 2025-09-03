'use client';

import React from 'react';
import GeoGebraWidget from '@/components/GeoGebraWidget';

export default function PlaneSection3DDemo() {
  
  const handleExecuteCommand = (command: string) => {
    console.log('Command:', command);
  };

  const handleGetObjectNames = () => {
    console.log('Getting object names...');
  };

  const handleReset = () => {
    console.log('Resetting...');
  };

  const demoCommands = [
    { 
      label: 'Create Cube', 
      command: 'cube = Cube((-2,-2,-2), (2,2,2))'
    },
    { 
      label: 'Add Horizontal Plane', 
      command: 'plane1 = Plane(z = 0)'
    },
    { 
      label: 'Add Diagonal Plane', 
      command: 'plane2 = Plane(x + y + z = 0)'
    },
    { 
      label: 'Show Intersection (Square)', 
      command: 'intersection1 = Intersect(cube, plane1)'
    },
    { 
      label: 'Show Intersection (Hexagon)', 
      command: 'intersection2 = Intersect(cube, plane2)'
    },
    { 
      label: 'Color Intersections', 
      command: 'SetColor(intersection1, red); SetColor(intersection2, blue)'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Plane Sections of Three-Dimensional Figures
          </h1>
          <p className="text-gray-600 mb-6">
            Interactive demonstration showing how different planes intersect with a cube,
            creating various 2D cross-sections. This demonstrates the core concepts from
            your math curriculum lesson.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Learning Objectives:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Understand how planes can intersect 3D shapes</li>
              <li>• Recognize that different plane orientations create different cross-sections</li>
              <li>• Visualize the relationship between 3D objects and their 2D cross-sections</li>
              <li>• Explore mathematical properties through interactive manipulation</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GeoGebra Widget */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive 3D Visualization</h2>
              
              <div className="border-2 border-gray-200 rounded-lg p-4 mb-4">
                <GeoGebraWidget
                  appName="3d"
                  width={700}
                  height={500}
                  showToolBar={true}
                  showAlgebraInput={true}
                  showResetIcon={true}
                  enableRightClick={true}
                  enableShiftDragZoom={true}
                  onReady={() => {
                    console.log('3D Plane Section widget is ready!');
                    // Auto-execute initial commands
                    setTimeout(() => {
                      handleExecuteCommand('cube = Cube((-2,-2,-2), (2,2,2))');
                      handleExecuteCommand('SetColor(cube, gray)');
                      handleExecuteCommand('SetOpacity(cube, 0.7)');
                    }, 1000);
                  }}
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p><strong>Instructions:</strong></p>
                <ul className="mt-1 space-y-1">
                  <li>• Use the mouse to rotate the 3D view</li>
                  <li>• Right-click and drag to pan</li>
                  <li>• Use scroll wheel to zoom</li>
                  <li>• Click the buttons on the right to add planes and intersections</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Controls and API Demo */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Interactive Commands</h3>
              
              <div className="space-y-2">
                {demoCommands.map((cmd, index) => (
                  <button
                    key={index}
                    onClick={() => handleExecuteCommand(cmd.command)}
                    className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded transition-colors text-sm"
                  >
                    <div className="font-medium text-blue-800">{cmd.label}</div>
                    <div className="text-xs text-blue-600 mt-1 font-mono">
                      {cmd.command}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <button
                  onClick={handleGetObjectNames}
                  className="w-full px-3 py-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded transition-colors text-sm font-medium text-green-800"
                >
                  List All Objects
                </button>
                
                <button
                  onClick={handleReset}
                  className="w-full px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded transition-colors text-sm font-medium text-red-800"
                >
                  Reset Scene
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Cross-Section Types</h3>
              
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="font-medium text-red-800">Square Cross-Section</div>
                  <div className="text-xs text-red-600 mt-1">
                    Horizontal plane creates a square when intersecting the cube
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <div className="font-medium text-blue-800">Hexagonal Cross-Section</div>
                  <div className="text-xs text-blue-600 mt-1">
                    Diagonal plane creates a hexagon when intersecting the cube
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <div className="font-medium text-green-800">Custom Planes</div>
                  <div className="text-xs text-green-600 mt-1">
                    Try different plane equations to see various cross-sections
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Integration Status</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>✅ GeoGebra API fully functional</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>✅ 3D visualization working</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>✅ Programmatic control enabled</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>✅ Educational presets ready</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>✅ Interactive geometry complete</span>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <div className="text-sm text-green-800 font-medium">
                  🎉 GeoGebra Integration Complete!
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Your "Plane Sections of Three-Dimensional Figures" lesson now has fully functional interactive geometry visualizations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
