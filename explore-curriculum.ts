import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exploreCurriculum() {
  try {
    console.log('=== DOCUMENTS ===');
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
    
    documents.forEach(doc => {
      console.log(`📚 ${doc.title} (${doc.grade_level} ${doc.volume})`);
      console.log(`   📄 ${doc.page_count} pages`);
      console.log(`   📂 ${doc.units.length} units`);
      
      doc.units.forEach(unit => {
        console.log(`   🎯 Unit ${unit.unit_number}: ${unit.title}`);
        console.log(`      📖 ${unit.lessons.length} lessons`);
        
        unit.lessons.forEach(lesson => {
          console.log(`      📝 L${lesson.lesson_number}: ${lesson.title}`);
          if (lesson.sessions.length > 0) {
            lesson.sessions.forEach(session => {
              console.log(`         🔸 Session ${session.session_number}: ${session.session_type || 'unknown'} - ${session.title || 'No title'}`);
            });
          }
        });
      });
      console.log('');
    });
    
    // Look at some specific page images to understand structure
    console.log('=== PAGE IMAGES SAMPLE ===');
    const pageImages = await prisma.pageImage.findMany({
      take: 20,
      orderBy: { page_number: 'asc' },
      include: { document: true }
    });
    
    pageImages.forEach(page => {
      console.log(`📄 ${page.document.title} - Page ${page.page_number}: ${page.page_type} (${page.word_count} words)`);
      if (page.text_preview) {
        console.log(`   Preview: ${page.text_preview.substring(0, 100)}...`);
      }
    });
    
  } catch (error) {
    console.error('Error exploring curriculum:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exploreCurriculum();
