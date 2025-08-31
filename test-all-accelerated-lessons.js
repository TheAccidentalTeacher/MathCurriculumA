// Test all accelerated pathway lessons to ensure no more 404s
import { DatabaseFreeLessonService } from './src/lib/database-free-lesson-service.js';

const testLessons = [
  // Grade 7 Volume 1 (lessons 1-19)
  ...Array.from({length: 19}, (_, i) => ({ grade: 7, volume: 1, lessonNumber: i + 1 })),
  // Grade 7 Volume 2 (lessons 20-33) 
  ...Array.from({length: 14}, (_, i) => ({ grade: 7, volume: 2, lessonNumber: i + 20 })),
  // Grade 8 Volume 1 (lessons 1-18)
  ...Array.from({length: 18}, (_, i) => ({ grade: 8, volume: 1, lessonNumber: i + 1 })),
  // Grade 8 Volume 2 (lessons 19-32)
  ...Array.from({length: 14}, (_, i) => ({ grade: 8, volume: 2, lessonNumber: i + 19 }))
];

console.log('Testing all accelerated pathway lessons...\n');

let foundCount = 0;
let missingCount = 0;
const missingLessons = [];

testLessons.forEach(lesson => {
  try {
    const lessonData = DatabaseFreeLessonService.getLesson(lesson.grade, lesson.volume, lesson.lessonNumber);
    if (lessonData) {
      foundCount++;
      console.log(`✅ Grade ${lesson.grade} Vol ${lesson.volume} Lesson ${lesson.lessonNumber}: ${lessonData.title} (pages ${lessonData.startPage}-${lessonData.endPage})`);
    } else {
      missingCount++;
      missingLessons.push(lesson);
      console.log(`❌ Grade ${lesson.grade} Vol ${lesson.volume} Lesson ${lesson.lessonNumber}: NOT FOUND`);
    }
  } catch (error) {
    missingCount++;
    missingLessons.push(lesson);
    console.log(`❌ Grade ${lesson.grade} Vol ${lesson.volume} Lesson ${lesson.lessonNumber}: ERROR - ${error.message}`);
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Total lessons tested: ${testLessons.length}`);
console.log(`Found: ${foundCount}`);
console.log(`Missing: ${missingCount}`);

if (missingLessons.length > 0) {
  console.log(`\nMissing lessons:`);
  missingLessons.forEach(lesson => {
    console.log(`  - Grade ${lesson.grade} Vol ${lesson.volume} Lesson ${lesson.lessonNumber}`);
  });
} else {
  console.log(`\n🎉 ALL ACCELERATED PATHWAY LESSONS ARE NOW ACCESSIBLE!`);
}
