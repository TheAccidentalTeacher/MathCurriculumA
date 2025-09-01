// Test the pacing generator API with volume selection
async function testPacingGenerator() {
  try {
    console.log('Testing pacing generator API with volume selection...');
    
    const response = await fetch('http://localhost:3001/api/pacing-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gradeRange: [7],
        volumes: ['V1'], // Only Grade 7 Volume 1
        targetPopulation: 'general',
        totalDays: 180,
        majorWorkFocus: 70,
        includePrerequisites: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ API Response received!`);
    console.log(`📚 Total lessons returned: ${data.lessons?.length || 0}`);
    
    if (data.lessons && data.lessons.length > 0) {
      console.log('\n🎯 First 5 lessons:');
      data.lessons.slice(0, 5).forEach((lesson, i) => {
        console.log(`${i + 1}. ${lesson.title} (Grade ${lesson.grade}, ${lesson.estimatedDays || 'N/A'} days)`);
      });
      
      // Test with all volumes
      console.log('\n\n🔄 Testing with all volumes...');
      const responseAll = await fetch('http://localhost:3001/api/pacing-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeRange: [7],
          // No volumes specified = all volumes
          targetPopulation: 'general',
          totalDays: 180,
          majorWorkFocus: 70,
          includePrerequisites: false
        })
      });
      
      const dataAll = await responseAll.json();
      console.log(`📚 All volumes - Total lessons: ${dataAll.lessons?.length || 0}`);
      
      console.log(`\n🎉 Volume filtering working! V1 only: ${data.lessons.length}, All volumes: ${dataAll.lessons?.length || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPacingGenerator();
