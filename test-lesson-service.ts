import { LessonService } from './src/lib/lesson-service';

async function testLessonService() {
  try {
    console.log('Testing Lesson Service with Lesson 27...');
    
    const lessonData = await LessonService.getLessonData('RCM07_NA_SW_V1', 27);
    
    console.log('✅ Lesson Data Retrieved:');
    console.log({
      lessonNumber: lessonData.lessonNumber,
      lessonTitle: lessonData.lessonTitle,
      startPage: lessonData.startPage,
      endPage: lessonData.endPage,
      totalPages: lessonData.totalPages,
      sessionsCount: lessonData.sessions.length,
      sessions: lessonData.sessions.map(s => ({
        sessionNumber: s.sessionNumber,
        sessionName: s.sessionName,
        sessionType: s.sessionType,
        startPage: s.startPage,
        endPage: s.endPage,
        totalPages: s.totalPages
      }))
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testLessonService();
