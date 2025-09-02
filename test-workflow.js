// Test script for comprehensive Virtual Tutor debugging workflow
// This will test the complete flow from lesson click to AI response generation

async function testLessonWorkflow() {
  console.log('🚀 Starting comprehensive Virtual Tutor workflow test...');
  
  const documentId = 'RCM08_NA_SW_V1';
  const lessonNumber = 2;
  
  try {
    // Step 1: Test lesson data loading
    console.log('\n📖 Step 1: Testing lesson data loading...');
    const lessonResponse = await fetch(`http://localhost:3002/api/lessons/${documentId}/${lessonNumber}`);
    const lessonData = await lessonResponse.json();
    
    console.log('Lesson API Response:', {
      status: lessonResponse.status,
      success: lessonData.success,
      hasLesson: !!lessonData.lesson,
      sessionCount: lessonData.lesson?.sessions?.length || 0
    });
    
    // Step 2: Test content preparation API
    console.log('\n🧠 Step 2: Testing content preparation API...');
    const prepareResponse = await fetch(`http://localhost:3002/api/lessons/${documentId}/${lessonNumber}/prepare`, {
      method: 'POST'
    });
    const prepareData = await prepareResponse.json();
    
    console.log('Content Preparation Response:', {
      status: prepareResponse.status,
      success: prepareData.success,
      cached: prepareData.cached,
      hasAnalysis: !!prepareData.analysis,
      processingTime: prepareData.processingTime || 'N/A'
    });
    
    // Step 3: Test AI chat endpoint
    console.log('\n🤖 Step 3: Testing AI chat endpoint...');
    const chatResponse = await fetch('http://localhost:3002/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Hello, can you help me understand this lesson?',
        character: 'professor',
        context: {
          lessonAnalysis: prepareData.analysis
        }
      })
    });
    
    const chatData = await chatResponse.json();
    console.log('AI Chat Response:', {
      status: chatResponse.status,
      success: chatData.success,
      hasResponse: !!chatData.response,
      responseLength: chatData.response?.length || 0,
      error: chatData.error
    });
    
    // Step 4: Test cache status
    console.log('\n💾 Step 4: Testing cache status...');
    const cacheResponse = await fetch(`http://localhost:3002/api/lessons/${documentId}/${lessonNumber}/prepare`);
    const cacheData = await cacheResponse.json();
    
    console.log('Cache Status Response:', {
      status: cacheResponse.status,
      cached: cacheData.cached,
      totalCached: cacheData.cacheInfo?.totalCached,
      cacheKey: cacheData.cacheInfo?.cacheKey
    });
    
    console.log('\n✅ Workflow test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Workflow test failed:', error);
  }
}

// Run the test
testLessonWorkflow();
