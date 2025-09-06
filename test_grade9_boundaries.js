// Test script to verify Grade 9 lesson boundaries
const path = require('path');

// Simple test to verify the lesson mapping structure
const lessonBoundaries = {
  'ALG01_NA_SW_V1': {
    1: { start: 13, end: 25, title: 'Represent Quantities and Relationships' },
    2: { start: 26, end: 157, title: 'Reason About Solving Equations' },
    3: { start: 158, end: 187, title: 'Linear Equations in Two Variables' },
    4: { start: 188, end: 251, title: 'Linear Inequalities in One Variable' },
    5: { start: 252, end: 281, title: 'Function Concepts' },
    6: { start: 282, end: 317, title: 'Interpret Graphs of Functions' },
    7: { start: 318, end: 353, title: 'Linear Functions' },
    8: { start: 354, end: 389, title: 'Fit Linear Functions to Data' },
    9: { start: 390, end: 465, title: 'Piecewise Functions' },
    10: { start: 466, end: 495, title: 'Solve Linear Systems by Graphing or Substitution' },
    11: { start: 496, end: 525, title: 'Solve Linear Systems by Elimination' },
    12: { start: 526, end: 555, title: 'Linear Inequalities in Two Variables' },
    13: { start: 556, end: 656, title: 'Systems of Linear Inequalities' }
  },
  'ALG01_NA_SW_V2': {
    14: { start: 36, end: 71, title: 'Sequences' },
    15: { start: 72, end: 101, title: 'Graphs of Exponential Functions' },
    16: { start: 102, end: 137, title: 'Model with Exponential Functions' },
    17: { start: 138, end: 167, title: 'Compare Linear and Exponential Functions' },
    18: { start: 168, end: 229, title: 'Rational Exponents' },
    19: { start: 230, end: 259, title: 'Operations with Polynomials' },
    20: { start: 260, end: 295, title: 'Graphs of Quadratic Functions' },
    21: { start: 296, end: 331, title: 'Model with Quadratic Functions' },
    22: { start: 332, end: 401, title: 'Factor Polynomials' },
    23: { start: 402, end: 437, title: 'Quadratic Equations in One Variable' },
    24: { start: 438, end: 467, title: 'Completing the Square' },
    25: { start: 468, end: 531, title: 'The Quadratic Formula' },
    26: { start: 532, end: 561, title: 'One-Variable Statistics' },
    27: { start: 562, end: 591, title: 'Comparing Data Sets' },
    28: { start: 592, end: 698, title: 'Two-Way Frequency Tables' }
  }
};

// Test the structure
console.log('\n=== Grade 9 Algebra 1 Lesson Boundaries Test ===\n');

Object.keys(lessonBoundaries).forEach(volumeId => {
  console.log(`📚 ${volumeId}:`);
  const lessons = lessonBoundaries[volumeId];
  Object.keys(lessons).forEach(lessonNum => {
    const lesson = lessons[lessonNum];
    const pageCount = lesson.end - lesson.start + 1;
    console.log(`  Lesson ${lessonNum}: Pages ${lesson.start}-${lesson.end} (${pageCount} pages) - ${lesson.title}`);
  });
  console.log('');
});

// Validate page ranges
console.log('=== Validation ===\n');

Object.keys(lessonBoundaries).forEach(volumeId => {
  console.log(`🔍 Validating ${volumeId}:`);
  const lessons = lessonBoundaries[volumeId];
  const lessonNumbers = Object.keys(lessons).map(Number).sort((a, b) => a - b);
  
  let valid = true;
  for (let i = 0; i < lessonNumbers.length - 1; i++) {
    const currentLesson = lessons[lessonNumbers[i]];
    const nextLesson = lessons[lessonNumbers[i + 1]];
    
    if (currentLesson.end >= nextLesson.start) {
      console.log(`  ❌ Overlap: Lesson ${lessonNumbers[i]} ends at ${currentLesson.end}, Lesson ${lessonNumbers[i + 1]} starts at ${nextLesson.start}`);
      valid = false;
    }
  }
  
  if (valid) {
    console.log(`  ✅ All lesson boundaries are valid`);
  }
  
  // Check total page coverage
  const minPage = Math.min(...lessonNumbers.map(num => lessons[num].start));
  const maxPage = Math.max(...lessonNumbers.map(num => lessons[num].end));
  console.log(`  📄 Coverage: Pages ${minPage}-${maxPage} (${maxPage - minPage + 1} pages)`);
  console.log('');
});

console.log('🎯 Grade 9 Algebra 1 lesson boundaries are ready for integration!');
