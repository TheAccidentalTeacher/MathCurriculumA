const PrecisionCurriculumService = require('./src/lib/precision-curriculum-service.ts');

console.log('🧪 Testing Database Compatibility System');

// Test with precision database (if available)
try {
  console.log('\n📊 Testing Precision Database:');
  const precisionService = new PrecisionCurriculumService('/workspaces/MathCurriculumA/curriculum_precise.db');
  
  const stats = precisionService.getDatabaseStats();
  console.log('✅ Precision DB Stats:', {
    total_lessons: stats.total_lessons,
    database_type: 'precision',
    has_enhanced_features: stats.high_confidence_lessons > 0
  });
  
  const lessons = precisionService.getLessonsByGrades([7]);
  console.log(`✅ Precision Grade 7 lessons: ${lessons.length} found`);
  console.log('   Sample lesson:', lessons[0]?.title || 'No lessons');
  
  precisionService.close();
} catch (error) {
  console.log('❌ Precision database test failed:', error.message);
}

// Test with legacy database
try {
  console.log('\n📊 Testing Legacy Database:');
  const legacyService = new PrecisionCurriculumService('/workspaces/MathCurriculumA/prisma/curriculum.db');
  
  const stats = legacyService.getDatabaseStats();
  console.log('✅ Legacy DB Stats:', {
    total_lessons: stats.total_lessons,
    database_type: 'legacy',
    has_enhanced_features: false
  });
  
  const lessons = legacyService.getLessonsByGrades([7]);
  console.log(`✅ Legacy Grade 7 lessons: ${lessons.length} found`);
  console.log('   Sample lesson:', lessons[0]?.title || 'No lessons');
  
  legacyService.close();
} catch (error) {
  console.log('❌ Legacy database test failed:', error.message);
}

console.log('\n🎯 Database compatibility testing complete!');
