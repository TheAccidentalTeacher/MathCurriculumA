// Debug script to test cube parsing logic

function testCubeParsing() {
  console.log('🔍 Testing cube parsing logic...\n');

  // Test the regex pattern
  const testParts = [
    '[SHAPE:cube,5]',
    '[SHAPE:cube,5,5,5]', 
    '[SHAPE:box,5]',
    '[SMART_3D:cube,5]'
  ];

  testParts.forEach(part => {
    console.log(`Testing: ${part}`);
    
    // Test SHAPE pattern
    const shapeMatch = part.match(/\[SHAPE:([^,\]]+),?([^\]]*)\]/);
    if (shapeMatch) {
      const shapeName = shapeMatch[1].toLowerCase().trim();
      const parameters = shapeMatch[2] || '';
      
      console.log(`  Shape name: ${shapeName}`);
      console.log(`  Parameters: "${parameters}"`);
      
      let dimensions = { width: 2, height: 2, depth: 2, radius: 1 };
      if (parameters) {
        const paramMatch = parameters.match(/(\d+\.?\d*)/g);
        console.log(`  Param match:`, paramMatch);
        
        if (paramMatch) {
          if (shapeName.includes('cube')) {
            // For cubes, use the same dimension for all sides
            const sideLength = parseFloat(paramMatch[0]) || 2;
            dimensions.width = sideLength;
            dimensions.height = sideLength;
            dimensions.depth = sideLength;
          } else {
            dimensions.width = parseFloat(paramMatch[0]) || 2;
            dimensions.height = parseFloat(paramMatch[1]) || 2;
            dimensions.depth = parseFloat(paramMatch[2]) || 2;
          }
        }
      }
      
      console.log(`  Final dimensions:`, dimensions);
    }
    
    // Test SMART_3D pattern
    const smart3DMatch = part.match(/\[SMART_3D:([^,]+),?([^\]]*)\]/);
    if (smart3DMatch) {
      const shape = smart3DMatch[1].toLowerCase().trim();
      const dimensionStr = smart3DMatch[2] || '';
      
      console.log(`  3D Shape: ${shape}`);
      console.log(`  3D Dimensions: "${dimensionStr}"`);
      
      let dimensions = { width: 2, height: 2, depth: 2, radius: 1 };
      if (dimensionStr) {
        const dimMatch = dimensionStr.match(/(\d+\.?\d*)/g);
        if (dimMatch) {
          if (shape === 'cube') {
            const sideLength = parseFloat(dimMatch[0]) || 2;
            dimensions.width = sideLength;
            dimensions.height = sideLength;
            dimensions.depth = sideLength;
          }
        }
      }
      
      console.log(`  Final 3D dimensions:`, dimensions);
    }
    
    console.log('');
  });
}

testCubeParsing();
