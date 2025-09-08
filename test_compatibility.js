// Simple database compatibility test
const Database = require('better-sqlite3');

console.log('🧪 Testing Database Compatibility System');

function testDatabase(path, name) {
  try {
    console.log(`\n📊 Testing ${name} Database:`);
    const db = new Database(path);
    
    // Check if it's a precision database by looking for lesson_summaries_gpt5 table
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const tableNames = tables.map(t => t.name);
    const isPrecisionDb = tableNames.includes('lesson_summaries_gpt5');
    
    console.log(`✅ Database type: ${isPrecisionDb ? 'precision' : 'legacy'}`);
    console.log('   Tables:', tableNames.join(', '));
    
    if (isPrecisionDb) {
      // Test precision database
      const lessonCount = db.prepare("SELECT COUNT(*) as count FROM lessons").get();
      const sessionCount = db.prepare("SELECT COUNT(*) as count FROM sessions").get();
      console.log(`✅ Precision DB Stats: ${lessonCount.count} lessons, ${sessionCount.count} sessions`);
      
      const grade7Lessons = db.prepare(`
        SELECT l.title, d.grade 
        FROM lessons l 
        JOIN documents d ON l.document_id = d.id 
        WHERE d.grade = '7' 
        LIMIT 3
      `).all();
      console.log(`✅ Found ${grade7Lessons.length} Grade 7 lessons`);
      grade7Lessons.forEach(lesson => console.log(`   - ${lesson.title}`));
    } else {
      // Test prisma database
      const documentCount = db.prepare("SELECT COUNT(*) as count FROM documents").get();
      const lessonCount = db.prepare("SELECT COUNT(*) as count FROM lessons").get();
      const unitCount = db.prepare("SELECT COUNT(*) as count FROM units").get();
      console.log(`✅ Prisma DB Stats: ${documentCount.count} documents, ${unitCount.count} units, ${lessonCount.count} lessons`);
      
      const grade7Lessons = db.prepare(`
        SELECT l.title, d.grade_level 
        FROM lessons l 
        JOIN units u ON l.unit_id = u.id
        JOIN documents d ON u.document_id = d.id 
        WHERE d.grade_level = '7' 
        LIMIT 3
      `).all();
      console.log(`✅ Found ${grade7Lessons.length} Grade 7 lessons`);
      grade7Lessons.forEach(lesson => console.log(`   - ${lesson.title}`));
    }
    
    db.close();
    return true;
  } catch (error) {
    console.log(`❌ ${name} database test failed:`, error.message);
    return false;
  }
}

// Test both databases
testDatabase('./curriculum_precise.db', 'Precision');
testDatabase('./prisma/curriculum.db', 'Legacy');

console.log('\n🎯 Database compatibility testing complete!');
