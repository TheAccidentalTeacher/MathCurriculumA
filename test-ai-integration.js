// Quick AI API Test Script
const BASE_URL = 'http://localhost:3000';

async function testAIService() {
  console.log('🤖 Testing Phase 3 AI Integration...\n');
  
  try {
    // Test service status
    console.log('1. Testing AI service status...');
    const statusResponse = await fetch(`${BASE_URL}/api/ai/chat`);
    const statusData = await statusResponse.json();
    
    console.log('   ✅ Service Status:', statusData.status);
    console.log('   📊 Available Models:', statusData.capabilities?.models?.length || 0);
    console.log('   🎭 Characters:', statusData.capabilities?.characters?.join(', ') || 'None');
    
    // Test AI chat
    console.log('\n2. Testing AI chat endpoint...');
    const chatResponse = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Hello! Can you help me understand fractions?",
        character: "somers",
        lessonContext: {
          topic: "Fractions",
          grade: "7",
          unit: "Unit 1"
        }
      })
    });
    
    const chatData = await chatResponse.json();
    
    if (chatData.success) {
      console.log('   ✅ Chat Response Received');
      console.log('   🤖 AI Model Used:', chatData.model);
      console.log('   💰 Cost:', chatData.metrics?.costFormatted || 'Unknown');
      console.log('   📝 Response Preview:', chatData.response.substring(0, 100) + '...');
    } else {
      console.log('   ❌ Chat Failed:', chatData.error);
      
      if (chatData.error?.includes('OPENAI_API_KEY')) {
        console.log('   💡 Solution: Add OPENAI_API_KEY to your environment variables');
      }
    }
    
    // Test AI quick test endpoint
    console.log('\n3. Testing AI test endpoint...');
    const testResponse = await fetch(`${BASE_URL}/api/ai/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o'
      })
    });
    
    const testData = await testResponse.json();
    
    if (testData.success) {
      console.log('   ✅ AI Test Successful');
      console.log('   🧠 Model:', testData.model);
      console.log('   🔢 Tokens:', testData.metrics?.tokens);
      console.log('   💰 Cost:', testData.metrics?.costFormatted);
    } else {
      console.log('   ❌ AI Test Failed:', testData.error);
    }
    
    console.log('\n🎉 Phase 3 AI Integration Test Complete!');
    console.log('✅ If you see successful responses above, your OpenAI integration is working');
    console.log('❌ If you see API key errors, configure OPENAI_API_KEY in Railway');
    
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    console.log('💡 Make sure the development server is running on port 3000');
  }
}

// Run the test
testAIService();
