const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Get all documents
    const documents = await prisma.document.findMany({
      include: {
        units: {
          include: {
            lessons: {
              include: {
                sessions: true
              }
            }
          }
        }
      }
    });
    
    console.log('📚 Documents found:', documents.length);
    
    for (const doc of documents) {
      console.log(`\n📖 ${doc.title} (Grade ${doc.grade_level} ${doc.volume})`);
      console.log(`   📄 ${doc.page_count} pages`);
      console.log(`   📂 ${doc.units.length} units`);
      
      let totalLessons = 0;
      let totalSessions = 0;
      
      doc.units.forEach(unit => {
        totalLessons += unit.lessons.length;
        unit.lessons.forEach(lesson => {
          totalSessions += lesson.sessions.length;
        });
      });
      
      console.log(`   📝 ${totalLessons} lessons`);
      console.log(`   ⏱️ ${totalSessions} sessions`);
    }
    
    console.log('\n✅ Database connection successful!');
    
    // Get a sample of lessons across all grades to understand what we have
    const sampleLessons = await prisma.lesson.findMany({
      take: 20,
      include: {
        unit: {
          include: {
            document: true
          }
        },
        sessions: true
      },
      orderBy: {
        order_index: 'asc'
      }
    });
    
    console.log('\n📝 Sample lessons by grade:');
    const lessonsByGrade = {};
    sampleLessons.forEach(lesson => {
      const grade = lesson.unit.document.grade_level;
      if (!lessonsByGrade[grade]) lessonsByGrade[grade] = [];
      lessonsByGrade[grade].push({
        title: lesson.title,
        sessions: lesson.sessions.length,
        unit: lesson.unit.title,
        focus: lesson.focus_type,
        days: lesson.instructional_days
      });
    });
    
    Object.keys(lessonsByGrade).sort().forEach(grade => {
      console.log(`\n   Grade ${grade}:`);
      lessonsByGrade[grade].slice(0, 5).forEach(lesson => {
        console.log(`     • ${lesson.title} (${lesson.sessions} sessions, ${lesson.days} days, ${lesson.focus})`);
      });
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
