import GeometryVisualizer, { CubeExplorer } from '../components/GeometryVisualizer';
import { ChatCubeVisualizer } from '../components/ChatGeoGebra';

export default function TestGeometry() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Geometry Visualization Test</h1>
      
      <div className="border-2 border-blue-500 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. ChatCubeVisualizer (Used by Virtual Tutor)</h2>
        <ChatCubeVisualizer cubeCount={4} showDecomposition={true} />
      </div>
      
      <div className="border-2 border-green-500 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">2. CubeExplorer Component</h2>
        <CubeExplorer side={4} />
      </div>
      
      <div className="border-2 border-purple-500 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">3. GeometryVisualizer - Cube</h2>
        <GeometryVisualizer shape="cube" dimensions={[4]} />
      </div>
      
      <div className="border-2 border-red-500 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">4. GeometryVisualizer - Cylinder</h2>
        <GeometryVisualizer shape="cylinder" dimensions={[2, 5]} />
      </div>
      
      <div className="border-2 border-yellow-500 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">5. GeometryVisualizer - Sphere</h2>
        <GeometryVisualizer shape="sphere" dimensions={[3]} />
      </div>
    </div>
  );
}
