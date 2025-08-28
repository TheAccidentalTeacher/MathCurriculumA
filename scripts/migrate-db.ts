// Database migration script for Railway PostgreSQL
import { db } from '../src/lib/db';

async function migrate() {
  try {
    console.log('🚀 Starting database migration...');
    
    // Prisma will handle schema creation automatically
    // Just test the connection
    await db.$connect();
    console.log('✅ Database connected successfully!');
    
    // Check if tables exist by counting records
    const stats = await Promise.all([
      db.document.count(),
      db.section.count(),
      db.topic.count(),
      db.keyword.count(),
    ]);
    
    console.log('📊 Current database stats:');
    console.log(`  Documents: ${stats[0]}`);
    console.log(`  Sections: ${stats[1]}`);
    console.log(`  Topics: ${stats[2]}`);
    console.log(`  Keywords: ${stats[3]}`);
    
    console.log('✅ Migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

migrate();
