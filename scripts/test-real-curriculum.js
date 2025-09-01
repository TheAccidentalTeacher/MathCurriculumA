const { RealCurriculumService } = require('../src/lib/real-curriculum-service.js');

async function testRealCurriculumService() {
  try {
    console.log('🔍 Testing Real Curriculum Service...');
    
    const service = new RealCurriculumService();
    
    // Get all documents
    const documents = service.getAllDocuments();
    console.log(`📚 Found ${documents.length} documents:`);
    documents.forEach(doc => {
      console.log(`   • Grade ${doc.grade}: ${doc.title} (${doc.total_pages} pages)`);
    });
    
    // Get all lessons
    const allLessons = service.getAllLessons();
    console.log(`\n📝 Found ${allLessons.length} lessons total`);
    
    // Group by grade
    const lessonsByGrade = {};
    allLessons.forEach(lesson => {
      if (!lessonsByGrade[lesson.grade]) lessonsByGrade[lesson.grade] = [];
      lessonsByGrade[lesson.grade].push(lesson);
    });
    
    Object.keys(lessonsByGrade).sort().forEach(grade => {
      const lessons = lessonsByGrade[grade];
      const majorWork = lessons.filter(l => l.majorWork).length;
      console.log(`\n   Grade ${grade}: ${lessons.length} lessons (${majorWork} major work)`);
      
      // Show first 5 lessons as examples
      lessons.slice(0, 5).forEach(lesson => {
        console.log(`     • L${lesson.lessonNumber}: ${lesson.title.substring(0, 50)}... (${lesson.estimatedDays} days, ${lesson.majorWork ? 'Major' : 'Supporting'})`);
      });
    });
    
    // Test accelerated pathway generation
    console.log('\n🚀 Testing Accelerated Pathway Generation:');
    const acceleratedLessons = service.generateCustomPathway({
      gradeRange: [7, 8],
      targetPopulation: 'accelerated',
      totalDays: 160,
      majorWorkFocus: 85,
      includePrerequisites: false
    });
    
    console.log(`   Generated ${acceleratedLessons.length} lessons for accelerated pathway`);
    const totalDays = acceleratedLessons.reduce((sum, lesson) => sum + lesson.estimatedDays, 0);
    console.log(`   Total estimated days: ${totalDays}`);
    
    // Show sample accelerated lessons
    console.log('\n   Sample accelerated lessons:');
    acceleratedLessons.slice(0, 8).forEach(lesson => {
      console.log(`     • G${lesson.grade} L${lesson.lessonNumber}: ${lesson.title.substring(0, 40)}... (${lesson.estimatedDays} days)`);
    });
    
    // Test Grade 6-7-8 combined pathway
    console.log('\n📈 Testing Grade 6-7-8 Combined Pathway:');
    const combinedLessons = service.generateCustomPathway({
      gradeRange: [6, 7, 8],
      targetPopulation: 'accelerated',
      totalDays: 200,
      majorWorkFocus: 90,
      includePrerequisites: true
    });
    
    console.log(`   Generated ${combinedLessons.length} lessons for Grade 6-7-8 pathway`);
    const combinedTotalDays = combinedLessons.reduce((sum, lesson) => sum + lesson.estimatedDays, 0);
    console.log(`   Total estimated days: ${combinedTotalDays}`);
    
    service.close();
    console.log('\n✅ Real Curriculum Service test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRealCurriculumService();
