'use client';

import { ChatCubeVisualizer } from '@/components/ChatGeoGebra';

export default function CubeDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🧊 Cube Visualization Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">
            Virtual Tutor Cube Widget
          </h2>
          <p className="text-gray-600 mb-6">
            This is what students see when the virtual tutor shows cube visualizations:
          </p>
          
          <ChatCubeVisualizer cubeCount={1} showDecomposition={true} />
          
          <div className="mt-6 p-4 bg-blue-50 rounded border-l-4 border-blue-400">
            <h3 className="font-bold text-blue-800">Expected Behavior:</h3>
            <ul className="mt-2 text-blue-700 list-disc list-inside">
              <li>Should show an interactive 3D cube</li>
              <li>Students should be able to rotate the view by clicking and dragging</li>
              <li>Should display coordinate axes and volume information</li>
              <li>Widget should be responsive and expandable</li>
            </ul>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded border-l-4 border-yellow-400">
            <h3 className="font-bold text-yellow-800">If you see a blank screen:</h3>
            <ul className="mt-2 text-yellow-700 list-disc list-inside">
              <li>The GeoGebra API is loading but the 3D commands are not working</li>
              <li>Check browser console for GeoGebra errors</li>
              <li>This is the same issue reported in the "Cube Visualization" widget</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-green-600">
            How This Gets Triggered
          </h2>
          <p className="text-gray-600 mb-4">
            When students ask about 3D shapes, the virtual tutor processes messages containing <code className="bg-gray-100 px-2 py-1 rounded">[CUBE:1,true]</code> markers and renders this widget.
          </p>
          <p className="text-gray-600">
            Example lessons that use cube visualizations:
          </p>
          <ul className="mt-2 text-gray-600 list-disc list-inside">
            <li>Lesson 27: Describe Plane Sections of Three-Dimensional Figures</li>
            <li>Grade 8: Find Square Roots and Cube Roots to Solve Problems</li>
            <li>Volume and surface area explorations</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
