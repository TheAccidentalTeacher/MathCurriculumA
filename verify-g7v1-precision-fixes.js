console.log('🔥 GRADE 7 VOLUME 1 - PRECISION RE-VERIFICATION');
console.log('Verifying systematic corrections based on actual PDF analysis');
console.log('='.repeat(80));

// Import the corrected data
const { ACCELERATED_PATHWAY } = require('./src/lib/accelerated-pathway.ts');

// Extract Grade 7 Volume 1 lessons
const g7v1Lessons = ACCELERATED_PATHWAY.flatMap(unit => 
  unit.lessons.filter(lesson => lesson.grade === 7 && lesson.volume === 1)
);

console.log('\n📋 CORRECTED GRADE 7 VOLUME 1 LESSONS:');
console.log('-'.repeat(80));
console.log('#'.padStart(3) + ' ' + 'Lesson'.padEnd(45) + ' ' + 'Page'.padStart(5) + ' ' + 'Sessions'.padStart(8) + ' ' + 'Status');
console.log('-'.repeat(80));

// Expected correct pages from PDF analysis
const correctPages = {
  1: 16, 2: 44, 3: 60, 4: 72, 5: 94, 6: 110, 7: 150, 8: 162, 9: 184, 
  10: 196, 11: 236, 12: 248, 13: 270, 14: 292, 15: 326, 16: 348, 
  17: 360, 18: 372, 19: 394
};

let allCorrect = true;
g7v1Lessons.forEach(lesson => {
  const expected = correctPages[lesson.lessonNumber];
  const actual = lesson.startPage;
  const status = actual === expected ? '✅ CORRECT' : `❌ ERROR (expected ${expected})`;
  
  if (actual !== expected) {
    allCorrect = false;
  }
  
  console.log(`${lesson.lessonNumber.toString().padStart(2)}: ${lesson.title.substring(0,44).padEnd(44)} ${actual.toString().padStart(3)} ${lesson.sessions.toString().padStart(6)} ${status}`);
});

console.log();
console.log(`📊 VERIFICATION SUMMARY:`);
console.log(`Total lessons: ${g7v1Lessons.length}`);
console.log(`Expected lessons: 19`);
console.log(`Status: ${allCorrect ? '✅ ALL CORRECTIONS VERIFIED' : '❌ ERRORS DETECTED'}`);

if (allCorrect && g7v1Lessons.length === 19) {
  console.log('\n🎉 GRADE 7 VOLUME 1 PRECISION FIX - 100% COMPLETE!');
  console.log('All 19 lessons now have correct PDF page mappings');
} else {
  console.log('\n⚠️  Additional corrections needed');
}
