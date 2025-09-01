const Database = require('better-sqlite3');

// Open the precision database
const db = new Database('./curriculum_precise.db', { readonly: true });

console.log('Testing lesson filtering and counts...\n');

// Test 1: Count all lessons before filtering
const allLessonsQuery = db.prepare(`
  SELECT COUNT(*) as count
  FROM lesson_summaries_gpt5 ls
  JOIN documents d ON ls.document_id = d.id
  WHERE ls.grade = 7
`);
const allCount = allLessonsQuery.get();
console.log(`Total Grade 7 entries in database: ${allCount.count}`);

// Test 2: Count filtered lessons for Grade 7 Volume 1
const filteredQuery = db.prepare(`
  SELECT COUNT(*) as count
  FROM lesson_summaries_gpt5 ls
  JOIN documents d ON ls.document_id = d.id
  WHERE ls.grade = 7 
    AND d.volume = 'V1'
    AND (
      ls.title LIKE 'LESSON %'
      OR ls.title LIKE '%LESSON %'
      OR (ls.lesson_number BETWEEN 1 AND 50 AND ls.title NOT LIKE '%page%' AND ls.title NOT LIKE '%session%')
    )
    AND LENGTH(ls.title) > 10
    AND ls.extraction_confidence > 0.3
`);
const filteredCount = filteredQuery.get();
console.log(`Filtered Grade 7 Volume 1 lessons: ${filteredCount.count}`);

// Test 3: Show sample filtered lessons
const sampleQuery = db.prepare(`
  SELECT ls.title, ls.lesson_number, ls.extraction_confidence, d.volume
  FROM lesson_summaries_gpt5 ls
  JOIN documents d ON ls.document_id = d.id
  WHERE ls.grade = 7 
    AND d.volume = 'V1'
    AND (
      ls.title LIKE 'LESSON %'
      OR ls.title LIKE '%LESSON %'
      OR (ls.lesson_number BETWEEN 1 AND 50 AND ls.title NOT LIKE '%page%' AND ls.title NOT LIKE '%session%')
    )
    AND LENGTH(ls.title) > 10
    AND ls.extraction_confidence > 0.3
  ORDER BY ls.lesson_number
  LIMIT 10
`);

const samples = sampleQuery.all();
console.log('\nSample filtered lessons:');
samples.forEach(lesson => {
  console.log(`- Lesson ${lesson.lesson_number}: ${lesson.title} (confidence: ${lesson.extraction_confidence})`);
});

// Test 4: Check all volumes
const volumeQuery = db.prepare(`
  SELECT d.volume, COUNT(*) as count
  FROM lesson_summaries_gpt5 ls
  JOIN documents d ON ls.document_id = d.id
  WHERE ls.grade IN (7, 8)
    AND (
      ls.title LIKE 'LESSON %'
      OR ls.title LIKE '%LESSON %'
      OR (ls.lesson_number BETWEEN 1 AND 50 AND ls.title NOT LIKE '%page%' AND ls.title NOT LIKE '%session%')
    )
    AND LENGTH(ls.title) > 10
    AND ls.extraction_confidence > 0.3
  GROUP BY d.volume
  ORDER BY d.volume
`);

const volumeCounts = volumeQuery.all();
console.log('\nFiltered lesson counts by volume:');
volumeCounts.forEach(vol => {
  console.log(`- ${vol.volume}: ${vol.count} lessons`);
});

db.close();
