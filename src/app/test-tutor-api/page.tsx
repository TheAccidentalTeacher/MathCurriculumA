import { processVirtualTutorMessage } from '../../lib/ai-tutor-service';

export default async function TestTutorAPI() {
  // Simulate what happens when a user asks about 3D shapes
  const testMessage = "Can you show me a cube and explain its volume?";
  
  try {
    const response = await processVirtualTutorMessage({
      message: testMessage,
      lessonContext: {
        grade: "7",
        subject: "mathematics", 
        topic: "geometry",
        unit: "3D shapes and volume"
      },
      character: 'somers'
    });
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Virtual Tutor API Test</h1>
        <div className="bg-gray-100 p-4 rounded mb-4">
          <strong>Test Message:</strong> {testMessage}
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <strong>Response:</strong>
          <pre className="whitespace-pre-wrap mt-2">{response}</pre>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Virtual Tutor API Test</h1>
        <div className="bg-red-100 p-4 rounded">
          <strong>Error:</strong> {String(error)}
        </div>
      </div>
    );
  }
}
