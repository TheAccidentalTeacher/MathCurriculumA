// test-cache-implementation.js
// Simple test to verify our persistent cache is working

console.log('🧪 Testing Persistent Cache Implementation');

async function testCacheSystem() {
  console.log('\n📊 1. Testing Cache Status API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/cache/status');
    const data = await response.json();
    console.log('✅ Cache Status:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Cache Status failed:', error.message);
  }

  console.log('\n🔥 2. Testing Vision Analysis (should create cache entry)...');
  
  try {
    const response = await fetch('http://localhost:3000/api/lessons/RCM08_NA_SW_V1/2/vision-analysis', {
      method: 'POST'
    });
    const data = await response.json();
    console.log('✅ Vision Analysis Result:');
    console.log('  - Success:', data.success);
    console.log('  - Processing Time:', data.processingTimeMs + 'ms');
    console.log('  - Page Count:', data.pageCount);
    console.log('  - Features:', JSON.stringify(data.features, null, 4));
  } catch (error) {
    console.error('❌ Vision Analysis failed:', error.message);
  }

  console.log('\n💾 3. Checking Cache Status After Analysis...');
  
  try {
    const response = await fetch('http://localhost:3000/api/cache/status');
    const data = await response.json();
    console.log('✅ Updated Cache Status:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Updated Cache Status failed:', error.message);
  }

  console.log('\n⚡ 4. Testing Cache Hit (should be instant)...');
  
  try {
    const startTime = Date.now();
    const response = await fetch('http://localhost:3000/api/lessons/RCM08_NA_SW_V1/2/vision-analysis', {
      method: 'GET'
    });
    const endTime = Date.now();
    const data = await response.json();
    
    console.log('✅ Cache Hit Test:');
    console.log('  - Success:', data.success);
    console.log('  - Response Time:', (endTime - startTime) + 'ms (should be <100ms)');
    console.log('  - Cached:', data.cached);
    console.log('  - Features:', JSON.stringify(data.features, null, 4));
  } catch (error) {
    console.error('❌ Cache Hit Test failed:', error.message);
  }
}

testCacheSystem();
