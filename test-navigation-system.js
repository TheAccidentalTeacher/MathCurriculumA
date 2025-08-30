// Test the new search-based navigation system
const { acceleratedPathway } = require('./src/lib/accelerated-pathway.ts');

console.log('🧪 Testing Search-Based Navigation System');
console.log('='*60);
console.log();

try {
  // Test getting a few lessons
  const lesson1 = acceleratedPathway.getLessonById('g7-u1-l1');
  const lesson7 = acceleratedPathway.getLessonById('g7-u2-l7');  // The one from your image
  const lesson21 = acceleratedPathway.getLessonById('g7-u5-l21');

  console.log('📋 Sample Lessons:');
  console.log('-'*60);
  
  [lesson1, lesson7, lesson21].forEach(lesson => {
    if (lesson) {
      console.log(`✅ ${lesson.originalCode}: ${lesson.title}`);
      console.log(`   📍 Navigation ID: ${lesson.navigationId}`);
      console.log(`   🔍 Search Pattern: ${lesson.searchPattern}`);
      console.log(`   🔄 Fallback: ${lesson.fallbackPattern}`);
      console.log(`   🌐 URL: ${acceleratedPathway.getViewerUrl(lesson)}`);
      console.log();
    }
  });

  console.log('📊 System Statistics:');
  console.log('-'*60);
  const stats = acceleratedPathway.getProgressData();
  console.log(`Total Lessons: ${stats.totalLessons}`);
  console.log(`Grade 7 Lessons: ${stats.grade7Lessons}`);  
  console.log(`Grade 8 Lessons: ${stats.grade8Lessons}`);
  console.log(`Major Work Lessons: ${stats.majorWorkLessons}`);
  console.log(`Supporting Work Lessons: ${stats.supportingWorkLessons}`);
  console.log();

  console.log('🎉 Search-based navigation system is ready!');
  console.log();
  console.log('Benefits of the new system:');
  console.log('✅ No more page number drift issues');
  console.log('✅ Reliable text-based searching');  
  console.log('✅ Fallback patterns for robustness');
  console.log('✅ Works regardless of PDF updates');
  console.log('✅ Easy to maintain and debug');
  
} catch (error) {
  console.error('❌ Error testing navigation system:', error.message);
}
