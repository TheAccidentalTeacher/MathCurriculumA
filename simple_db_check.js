const fs = require('fs');

// Check if database exists
const dbPath = '/workspaces/MathCurriculumA/curriculum_precise.db';
const dbExists = fs.existsSync(dbPath);
console.log('🔍 Database Analysis Report\n');
console.log(`Database exists: ${dbExists}`);

if (dbExists) {
  const stats = fs.statSync(dbPath);
  console.log(`Database size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  
  try {
    // Try to load better-sqlite3 if available
    const Database = require('better-sqlite3');
    const db = new Database(dbPath, { readonly: true });
    
    // Get table list
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log(`\n📊 Tables: ${tables.map(t => t.name).join(', ')}`);
    
    // Check lessons table
    const lessonCount = db.prepare("SELECT COUNT(*) as count FROM lessons").get();
    console.log(`📚 Total lessons: ${lessonCount.count}`);
    
    // Get sample lesson
    const sampleLesson = db.prepare("SELECT * FROM lessons LIMIT 1").get();
    console.log(`🎯 Sample lesson structure:`, Object.keys(sampleLesson || {}));
    
    // Check grade/volume distribution
    const gradeVolume = db.prepare(`
      SELECT d.grade, d.volume, COUNT(l.id) as lesson_count
      FROM documents d 
      LEFT JOIN lessons l ON l.document_id = d.id 
      GROUP BY d.grade, d.volume
      ORDER BY d.grade, d.volume
    `).all();
    
    console.log('\n📈 Grade/Volume Distribution:');
    gradeVolume.forEach(row => {
      console.log(`  Grade ${row.grade} ${row.volume}: ${row.lesson_count} lessons`);
    });
    
    // Sample lessons with readable titles
    const samples = db.prepare(`
      SELECT l.lesson_number, l.title, d.grade, d.volume
      FROM lessons l 
      JOIN documents d ON l.document_id = d.id
      WHERE d.grade = '7' AND d.volume = 'V1'
      ORDER BY l.lesson_number
      LIMIT 5
    `).all();
    
    console.log('\n🎯 Sample Grade 7 Volume 1 Lessons:');
    samples.forEach(lesson => {
      console.log(`  Lesson ${lesson.lesson_number}: ${lesson.title.substring(0, 60)}...`);
    });
    
    db.close();
  } catch (error) {
    console.log(`❌ SQLite error: ${error.message}`);
  }
} else {
  console.log('❌ Database not found');
}

console.log('\n✅ Analysis complete');
