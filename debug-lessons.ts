import { LessonService } from './src/lib/lesson-service';

async function debugLessons() {
  try {
    console.log('Debugging Available Lessons...');
    
    const lessons = await LessonService.getAvailableLessons('RCM07_NA_SW_V1');
    
    console.log('✅ Available Lessons:');
    console.log(lessons.slice(0, 10)); // First 10 lessons
    
    // Check specifically for lesson 27
    const lesson27 = lessons.find(l => l.lessonNumber === 27);
    if (lesson27) {
      console.log('Found Lesson 27:', lesson27);
    } else {
      console.log('❌ Lesson 27 not found in available lessons');
      console.log('Lesson numbers found:', lessons.map(l => l.lessonNumber).sort((a, b) => a - b));
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  }
}

debugLessons();
