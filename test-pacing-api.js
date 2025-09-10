// Test script for pacing guide API
const testPayload = {
  "gradeLevel": "8+9",
  "gradeCombination": {
    "selectedGrades": ["8", "9"],
    "pathwayType": "accelerated",
    "skipGrades": [],
    "emphasis": "foundational"
  },
  "timeframe": "year",
  "studentPopulation": "general",
  "priorities": ["Major standards focus"],
  "scheduleConstraints": {
    "daysPerWeek": 5,
    "minutesPerClass": 50,
    "specialEvents": []
  },
  "differentiationNeeds": ["Advanced learners"]
};

async function testAPI() {
  console.log('🎯 Testing Pacing Guide API...');
  console.log('📝 Request payload:', JSON.stringify(testPayload, null, 2));
  
  try {
    const response = await fetch('http://localhost:3003/api/pacing/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📊 Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ API Test PASSED - Pacing guide generated successfully!');
      if (data.pacingGuide && data.pacingGuide.weeks) {
        console.log(`📚 Generated ${data.pacingGuide.weeks.length} weeks of content`);
      }
    } else {
      console.log('❌ API Test FAILED:', data.error);
    }
    
  } catch (error) {
    console.error('💥 Error testing API:', error);
  }
}

testAPI();
