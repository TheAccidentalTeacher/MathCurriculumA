'use client';

import { ChatCubeVisualizer } from '@/components/ChatGeoGebra';
import GeoGebraWidget from '@/components/GeoGebraWidget';

export default function Test3DSimplePage() {
  // Test 1: Most basic GeoGebra 3D cube
  const minimalCube = [
    'cube1 = Cube((0, 0, 0), 1)',
    'SetColor(cube1, blue)',
  ];

  // Test 2: Cube with proper 3D syntax
  const properCube = [
    'cube1 = Cube((0, 0, 0), (1, 1, 1))',
    'SetColor(cube1, "lightblue")',
    'SetFilling(cube1, 0.6)',
  ];

  // Test 3: Try point-based cube
  const pointCube = [
    'A = (0, 0, 0)',
    'B = (1, 1, 1)', 
    'cube1 = Cube(A, B)',
    'SetColor(cube1, "green")',
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🧊 Simple 3D Cube Tests</h1>
        
        <div className="grid gap-8">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-blue-600">Test 1: Minimal Cube - Cube((0,0,0), 1)</h2>
            <GeoGebraWidget
              commands={minimalCube}
              appName="3d"
              width={500}
              height={400}
              showToolBar={true}
              showAlgebraInput={true}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-green-600">Test 2: Proper Cube - Cube((0,0,0), (1,1,1))</h2>
            <GeoGebraWidget
              commands={properCube}
              appName="3d"
              width={500}
              height={400}
              showToolBar={true}
              showAlgebraInput={true}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-purple-600">Test 3: Point-based - Cube(A, B)</h2>
            <GeoGebraWidget
              commands={pointCube}
              appName="3d"
              width={500}
              height={400}
              showToolBar={true}
              showAlgebraInput={true}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 text-orange-600">Test 4: ChatCubeVisualizer Component</h2>
            <ChatCubeVisualizer />
          </div>

        </div>
        
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-bold text-blue-800">Debugging Notes:</h3>
          <ul className="mt-2 text-blue-700 text-sm list-disc list-inside">
            <li>Each test uses different GeoGebra 3D cube command syntax</li>
            <li>Look for actual 3D cubes, not just "Ready" status</li>
            <li>Try rotating the 3D views by clicking and dragging</li>
            <li>Check browser console for any GeoGebra errors</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
