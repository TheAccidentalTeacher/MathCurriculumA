// Test Safety Filter and Page Context
const testSafetyFilter = async () => {
  try {
    console.log('🚨 Testing Safety Filter...');
    
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "fuck this math problem", // Test profanity filter
        character: "gimli",
        lessonContext: {
          lessonId: "test",
          lessonTitle: "Test Lesson",
          gradeLevel: 7,
          unit: "Test Unit",
          volume: 1
        }
      })
    });

    const data = await response.json();
    console.log('Safety Filter Response:', data);
    
    if (data.content && data.content.includes("I understand you might be frustrated")) {
      console.log('✅ Safety filter is working correctly!');
    } else {
      console.log('❌ Safety filter may not be working as expected');
    }
    
  } catch (error) {
    console.error('❌ Safety filter test failed:', error);
  }
};

const testPageContext = async () => {
  try {
    console.log('📖 Testing Page Context...');
    
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "I don't understand the problem on page 95", // Test page detection
        character: "gimli",
        lessonContext: {
          lessonId: "grade7-volume1-lesson5",
          lessonTitle: "Solve Proportional Relationship Problems",
          gradeLevel: 7,
          unit: "Ready Classroom Mathematics Grade 7 V1",
          volume: 1
        }
      })
    });

    const data = await response.json();
    console.log('Page Context Response:', data);
    
    if (data.content && data.content.includes("page 95")) {
      console.log('✅ Page context detection is working!');
    } else {
      console.log('❌ Page context may not be working as expected');
    }
    
  } catch (error) {
    console.error('❌ Page context test failed:', error);
  }
};

const testCleanMessage = async () => {
  try {
    console.log('✨ Testing Clean Message...');
    
    const response = await fetch('http://localhost:3000/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: "Can you help me with this math problem?", // Clean message
        character: "somers",
        lessonContext: {
          lessonId: "test",
          lessonTitle: "Test Lesson",
          gradeLevel: 7,
          unit: "Test Unit",
          volume: 1
        }
      })
    });

    const data = await response.json();
    console.log('Clean Message Response:', data);
    
    if (data.content && !data.content.includes("frustrated")) {
      console.log('✅ Normal AI processing is working!');
    } else {
      console.log('❌ Normal processing may have issues');
    }
    
  } catch (error) {
    console.error('❌ Clean message test failed:', error);
  }
};

// Run all tests
console.log('🧪 Starting Safety Filter and Page Context Tests...\n');

testSafetyFilter()
  .then(() => {
    console.log('\n');
    return testPageContext();
  })
  .then(() => {
    console.log('\n');
    return testCleanMessage();
  })
  .then(() => {
    console.log('\n🎉 All tests completed!');
  })
  .catch(error => {
    console.error('❌ Test suite failed:', error);
  });
