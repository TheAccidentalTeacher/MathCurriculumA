// Test script to debug API issues
const testQuery = {
  query: "How do dilations work?",
  lessonAnalysis: {
    topics: ['transformations', 'dilations'],
    mathConcepts: ['coordinate geometry'],
    suggestedTools: ['TransformationGrapher'],
    difficulty: 'middle',
    content: 'This lesson covers dilations and transformations on the coordinate plane.'
  }
};

console.log('Testing analyze-query API...');
console.log('Request body:', JSON.stringify(testQuery, null, 2));

// Test locally first
fetch('http://localhost:3000/api/ai/analyze-query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testQuery)
})
.then(response => {
  console.log('Response status:', response.status);
  return response.text();
})
.then(text => {
  console.log('Response text:', text);
  try {
    const json = JSON.parse(text);
    console.log('Parsed JSON:', json);
  } catch (e) {
    console.log('Failed to parse JSON:', e.message);
  }
})
.catch(error => {
  console.error('Fetch error:', error);
});
