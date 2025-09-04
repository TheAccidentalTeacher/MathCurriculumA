'use client';

import { ChatCubeVisualizer } from '../../components/ChatGeoGebra';

export default function MinimalTest() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Minimal Geometry Test</h1>
      <p className="mb-4">If you see a GeoGebra widget below, the components are working:</p>
      
      <div className="border-2 border-blue-500 p-4 rounded">
        <ChatCubeVisualizer cubeCount={4} showDecomposition={true} />
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        If this page loads but shows no interactive widget, there's likely a GeoGebra loading issue.
      </p>
    </div>
  );
}
