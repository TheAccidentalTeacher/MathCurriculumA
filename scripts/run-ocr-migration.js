const { PrismaClient } = require('@prisma/client');
const { readFile } = require('fs/promises');
const { join } = require('path');

const db = new PrismaClient();

async function runOCRMigration() {
  try {
    console.log('🔄 Running OCR database migration...');
    
    // Read the SQL migration file
    const migrationPath = join(process.cwd(), 'prisma', 'migrations', 'ocr_extension.sql');
    const migrationSQL = await readFile(migrationPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await db.$executeRawUnsafe(statement + ';');
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.log(`Statement: ${statement.substring(0, 100)}...`);
          }
        }
      }
    }
    
    console.log('🎉 OCR database migration completed!');
    
    // Test the new tables
    console.log('🔍 Testing new tables...');
    
    const jobsTableTest = await db.$queryRaw`
      SELECT COUNT(*) as count FROM ocr_processing_jobs
    `;
    console.log(`✅ ocr_processing_jobs table: ${jobsTableTest[0].count} rows`);
    
    const pagesTableTest = await db.$queryRaw`
      SELECT COUNT(*) as count FROM ocr_page_results  
    `;
    console.log(`✅ ocr_page_results table: ${pagesTableTest[0].count} rows`);
    
    console.log('✅ All OCR tables are ready!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Run the migration
runOCRMigration();
