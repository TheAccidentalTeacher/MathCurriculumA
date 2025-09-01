import { PrismaClient } from '@prisma/client';

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
    
    // Get a sample of lessons across all grades
    const sampleLessons = await prisma.lesson.findMany({
      take: 10,
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
    
    console.log('\n📝 Sample lessons:');
    sampleLessons.forEach(lesson => {
      console.log(`   • Grade ${lesson.unit.document.grade_level} - ${lesson.title} (${lesson.sessions.length} sessions)`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
