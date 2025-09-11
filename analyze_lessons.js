const Database = require('better-sqlite3');

console.log('🔍 Analyzing Precision Database Structure\n');

const db = new Database('./curriculum_precise.db');

// Check document structure
console.log('📚 Document Structure:');
const documents = db.prepare("SELECT * FROM documents LIMIT 5").all();
console.log(documents);

// Check lesson counts by grade/volume
console.log('\n📊 Lesson Counts by Grade/Volume:');
const counts = db.prepare(`
  SELECT d.grade, d.volume, COUNT(l.id) as lesson_count, 
         COUNT(DISTINCT l.lesson_number) as unique_lessons
  FROM documents d 
  LEFT JOIN lessons l ON d.id = l.document_id 
  GROUP BY d.grade, d.volume 
  ORDER BY d.grade, d.volume
`).all();
console.table(counts);

// Check sample lessons for Grade 7
console.log('\n🎯 Sample Grade 7 Lessons:');
const sampleLessons = db.prepare(`
  SELECT l.lesson_number, l.title, l.unit_number, d.grade, d.volume
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = '7' 
  ORDER BY d.volume, l.lesson_number 
  LIMIT 15
`).all();
console.table(sampleLessons);

// Check if we have lesson numbers that look reasonable (1-30 range)
console.log('\n🔢 Lesson Number Distribution:');
const lessonNumbers = db.prepare(`
  SELECT DISTINCT l.lesson_number, COUNT(*) as occurrences
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE l.lesson_number BETWEEN 1 AND 50
  GROUP BY l.lesson_number
  ORDER BY l.lesson_number
  LIMIT 20
`).all();
console.table(lessonNumbers);

db.close();
