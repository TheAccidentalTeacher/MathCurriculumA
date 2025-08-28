import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectDatabase() {
  console.log('📊 Database Inspection Report');
  console.log('=============================\n');

  // Count documents
  const documentCount = await prisma.document.count();
  console.log(`📚 Total Documents: ${documentCount}`);

  // List all documents
  const documents = await prisma.document.findMany({
    select: {
      id: true,
      filename: true,
      title: true,
      grade_level: true,
      subject: true,
      created_at: true
    },
    orderBy: {
      filename: 'asc'
    }
  });

  console.log('\n📋 Document Details:');
  console.log('===================');
  
  for (const doc of documents) {
    console.log(`\n• ${doc.filename}`);
    console.log(`  ID: ${doc.id}`);
    console.log(`  Title: ${doc.title}`);
    console.log(`  Grade: ${doc.grade_level}`);
    console.log(`  Subject: ${doc.subject}`);
    console.log(`  Created: ${doc.created_at.toISOString().split('T')[0]}`);
  }

  // Check for content sample
  const sampleDocument = await prisma.document.findFirst({
    select: {
      filename: true,
      content: true
    }
  });

  if (sampleDocument) {
    console.log(`\n📄 Content Sample from ${sampleDocument.filename}:`);
    console.log('==========================================');
    const preview = sampleDocument.content.slice(0, 200) + '...';
    console.log(preview);
  }

  console.log('\n✅ Database inspection complete!');
}

inspectDatabase()
  .catch((error) => {
    console.error('❌ Error inspecting database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
