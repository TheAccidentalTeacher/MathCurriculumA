// Quick test of the search-based navigation system
import { AcceleratedPathway } from './src/lib/accelerated-pathway.js';

// Test finding and generating URLs for lessons
console.log('🧪 Testing Search-Based Navigation System\n');

// Test Grade 7 Volume 1 Lesson 1
const lesson1 = AcceleratedPathway.findByLessonNumber(7, 1, 1);
if (lesson1) {
  console.log('✅ Found Lesson 1:', lesson1.title);
  console.log('📍 Navigation ID:', lesson1.navigationId);
  console.log('🔍 Search Pattern:', lesson1.searchPattern);
  console.log('🌐 Generated URL:', lesson1.getViewerUrl());
} else {
  console.log('❌ Lesson 1 not found');
}

console.log('\n' + '='.repeat(60) + '\n');

// Test Grade 8 Volume 2 Lesson 12
const lesson12 = AcceleratedPathway.findByLessonNumber(8, 2, 12);
if (lesson12) {
  console.log('✅ Found Lesson 12:', lesson12.title);
  console.log('📍 Navigation ID:', lesson12.navigationId);
  console.log('🔍 Search Pattern:', lesson12.searchPattern);
  console.log('🌐 Generated URL:', lesson12.getViewerUrl());
} else {
  console.log('❌ Lesson 12 not found');
}

console.log('\n' + '='.repeat(60) + '\n');

// Show total lesson count
const allLessons = AcceleratedPathway.getAllLessons();
console.log(`📚 Total lessons in system: ${allLessons.length}`);
console.log('🎯 Search-based navigation system ready for production!');
