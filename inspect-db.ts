// inspect-db.ts - Quick script to check what's in our PostgreSQL database using Prisma
import { db } from './src/lib/db';

async function inspectDatabase() {
  console.log('=== DATABASE INSPECTION ===\n');

  try {
    // Check documents
    const docCount = await db.document.count();
    console.log(`Documents: ${docCount}`);

    if (docCount > 0) {
      const docs = await db.document.findMany({
        select: { id: true, filename: true, title: true }
      });
      docs.forEach(doc => {
        console.log(`  - ${doc.filename}: "${doc.title}"`);
      });
    }

    // Check sections
    const sectionCount = await db.section.count();
    console.log(`\nSections: ${sectionCount}`);

    // Check topics
    const topicCount = await db.topic.count();
    console.log(`Topics: ${topicCount}`);

    // Check keywords
    const keywordCount = await db.keyword.count();
    console.log(`Keywords: ${keywordCount}`);

  } catch (error) {
    console.error('Database inspection failed:', error);
  } finally {
    await db.$disconnect();
  }
}

inspectDatabase().catch(console.error);
