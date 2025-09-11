const Database = require('better-sqlite3');

console.log('🔍 Checking Database Schema\n');

const db = new Database('./curriculum_precise.db');

// Check table structure
console.log('📊 Table Information:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

// Check lessons table structure
console.log('\n🎯 Lessons Table Schema:');
const lessonSchema = db.prepare("PRAGMA table_info(lessons)").all();
console.table(lessonSchema);

// Check documents table structure  
console.log('\n📚 Documents Table Schema:');
const documentSchema = db.prepare("PRAGMA table_info(documents)").all();
console.table(documentSchema);

// Check a few lesson samples
console.log('\n📖 Sample Lessons:');
const sampleLessons = db.prepare(`
  SELECT l.*, d.grade, d.volume
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = 7 
  LIMIT 10
`).all();
console.table(sampleLessons);

db.close();
