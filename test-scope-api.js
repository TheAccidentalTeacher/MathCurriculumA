// Test the dynamic scope and sequence API
console.log('🧪 Testing Dynamic Scope & Sequence API...');

async function testScopeSequenceAPI() {
  try {
    console.log('📡 Fetching scope data for all grades...');
    const response = await fetch('http://localhost:3000/api/scope-sequence');
    const data = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('📊 API Response Data:', JSON.stringify(data, null, 2));
    
    if (data.success && data.data?.allGrades) {
      console.log('\n🎯 Grade Summary:');
      data.data.allGrades.forEach(grade => {
        console.log(`  ${grade.displayName}: ${grade.totalLessons} lessons, ${grade.estimatedDays} days`);
      });
    }
    
    if (data.data?.acceleratedPathways) {
      console.log('\n🚀 Accelerated Pathways:');
      data.data.acceleratedPathways.forEach(pathway => {
        console.log(`  ${pathway.pathway}: ${pathway.totalLessons} lessons, ${pathway.estimatedDays} days`);
      });
    }
    
  } catch (error) {
    console.error('❌ API Test Error:', error);
  }
}

// Test specific grade
async function testGradeSpecific(grade) {
  try {
    console.log(`\n📚 Testing Grade ${grade}...`);
    const response = await fetch(`http://localhost:3000/api/scope-sequence?grade=${grade}`);
    const data = await response.json();
    
    console.log(`✅ Grade ${grade} Response:`, JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error(`❌ Grade ${grade} Test Error:`, error);
  }
}

// Run tests
testScopeSequenceAPI()
  .then(() => testGradeSpecific('8'))
  .then(() => testGradeSpecific('9'))
  .then(() => console.log('🎉 All tests completed!'));
