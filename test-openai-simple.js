// Simple OpenAI API test with the same configuration as the lesson service
const OpenAI = require('openai');

console.log('🔑 Testing OpenAI API with lesson service configuration...');

// Use the same configuration as LessonContentService
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testSimpleChat() {
  try {
    console.log('Testing basic chat completion...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: "What is 2 + 2? Answer briefly."
        }
      ],
      max_tokens: 50,
      temperature: 0.1
    });

    const responseText = response.choices[0]?.message?.content;
    console.log('✅ Basic chat test successful!');
    console.log('Response:', responseText);
    
    return true;
  } catch (error) {
    console.error('❌ Basic chat test failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

async function testVisionAPI() {
  try {
    console.log('Testing Vision API with a simple test...');
    
    // Create a simple test image (a small PNG with some text)
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Describe this image briefly."
            },
            {
              type: "image_url",
              image_url: {
                url: testImage
              }
            }
          ]
        }
      ],
      max_tokens: 100,
      temperature: 0.1
    });

    const responseText = response.choices[0]?.message?.content;
    console.log('✅ Vision API test successful!');
    console.log('Response:', responseText);
    
    return true;
  } catch (error) {
    console.error('❌ Vision API test failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error type:', error.type);
    return false;
  }
}

async function runTests() {
  console.log('Environment check:');
  console.log('- OpenAI API Key present:', !!process.env.OPENAI_API_KEY);
  console.log('- Key length:', process.env.OPENAI_API_KEY?.length || 0);
  
  const basicTest = await testSimpleChat();
  if (basicTest) {
    await testVisionAPI();
  }
}

runTests().catch(console.error);
