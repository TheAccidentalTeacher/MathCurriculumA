// Quick database analysis to understand the lesson structure
const PrecisionCurriculumService = require('./src/lib/precision-curriculum-service.ts');

async function analyzeLessons() {
  try {
    console.log('🔍 Analyzing Precision Database Lessons\n');
    
    const service = new PrecisionCurriculumService();
    
    // Get all lessons
    const allLessons = service.getAllLessons();
    console.log(`📚 Total lessons found: ${allLessons.length}\n`);
    
    // Group by grade and volume
    const byGradeVolume = {};
    allLessons.forEach(lesson => {
      const key = `G${lesson.grade}${lesson.volume}`;
      if (!byGradeVolume[key]) byGradeVolume[key] = [];
      byGradeVolume[key].push(lesson);
    });
    
    console.log('📊 Lesson distribution by Grade/Volume:');
    Object.keys(byGradeVolume).sort().forEach(key => {
      const lessons = byGradeVolume[key];
      const uniqueLessonNumbers = [...new Set(lessons.map(l => l.lesson_number))].sort();
      console.log(`${key}: ${lessons.length} total, Lesson numbers: ${uniqueLessonNumbers.slice(0, 10).join(', ')}${uniqueLessonNumbers.length > 10 ? '...' : ''}`);
    });
    
    // Sample Grade 7 Volume 1 lessons
    console.log('\n🎯 Sample Grade 7 Volume 1 lessons:');
    const g7v1 = allLessons.filter(l => l.grade === 7 && l.volume === 'V1').slice(0, 10);
    g7v1.forEach(lesson => {
      console.log(`Lesson ${lesson.lesson_number}: ${lesson.title.substring(0, 80)}...`);
    });
    
    service.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyzeLessons();
