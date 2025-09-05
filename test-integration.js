const path = require('path');

// Simulate the lessonBoundaries logic
const lessonBoundaries = {
  'RCM07_NA_SW_V1': { 1: { start: 15, end: 36, title: 'Test Lesson' } },
  'RCM07_NA_SW_V2': { 19: { start: 15, end: 42, title: 'Test Lesson 2' } },
  'RCM08_NA_SW_V1': { 1: { start: 15, end: 26, title: 'Test Lesson 3' } },
  'RCM08_NA_SW_V2': { 19: { start: 15, end: 36, title: 'Test Lesson 4' } }
};

console.log('Testing document extraction...');

const documents = [];

// Process each document that has lesson boundaries defined
for (const [documentId, lessons] of Object.entries(lessonBoundaries)) {
  const gradeMatch = documentId.match(/RCM(\d+)/);
  const volumeMatch = documentId.match(/V(\d+)$/);
  
  console.log(`Document: ${documentId}`);
  console.log(`  Grade match: ${gradeMatch}`);
  console.log(`  Volume match: ${volumeMatch}`);
  
  if (gradeMatch && volumeMatch) {
    const grade = gradeMatch[1];
    const volume = `V${volumeMatch[1]}`;
    const lessonCount = Object.keys(lessons).length;
    
    console.log(`  Extracted grade: '${grade}', volume: '${volume}', lessons: ${lessonCount}`);
    
    documents.push({
      id: documentId,
      title: `Ready Classroom Mathematics Grade ${grade} ${volume}`,
      grade,
      volume,
      totalLessons: lessonCount,
      totalPages: 100
    });
  }
}

console.log('\nFinal documents:');
documents.forEach(doc => {
  console.log(`- Grade: '${doc.grade}' | ID: ${doc.id} | Title: ${doc.title}`);
});

console.log('\nTesting grade filter for grade "7":');
const grade7Docs = documents.filter(doc => doc.grade === '7');
console.log(`Found ${grade7Docs.length} documents for grade 7`);
grade7Docs.forEach(doc => console.log(`  - ${doc.id}`));
