// inspect-db.ts - Quick script to check what's in our database
import Database from 'better-sqlite3';

const db = new Database('curriculum.db');

console.log('=== DATABASE INSPECTION ===\n');

// Check documents
const docs = db.prepare('SELECT COUNT(*) as count FROM documents').get();
console.log(`Documents: ${docs.count}`);

if (docs.count > 0) {
  const docDetails = db.prepare('SELECT id, filename, title FROM documents').all();
  docDetails.forEach((doc: any) => {
    console.log(`  - ${doc.filename}: "${doc.title}"`);
  });
}

// Check sections
const sections = db.prepare('SELECT COUNT(*) as count FROM sections').get();
console.log(`\nSections: ${sections.count}`);

// Check topics
const topics = db.prepare('SELECT COUNT(*) as count FROM topics').get();
console.log(`Topics: ${topics.count}`);

// Check keywords
const keywords = db.prepare('SELECT COUNT(*) as count FROM keywords').get();
console.log(`Keywords: ${keywords.count}`);

// Sample some content
if (topics.count > 0) {
  console.log('\n=== SAMPLE TOPICS ===');
  const sampleTopics = db.prepare(`
    SELECT t.title, LENGTH(t.content) as content_length, s.title as section_title, d.filename
    FROM topics t 
    JOIN sections s ON t.section_id = s.id 
    JOIN documents d ON s.document_id = d.id 
    LIMIT 5
  `).all();
  
  sampleTopics.forEach(topic => {
    console.log(`${topic.filename} > ${topic.section_title} > ${topic.title}`);
    console.log(`  Content length: ${topic.content_length} chars`);
  });
}

// Check total content size
const totalContent = db.prepare(`
  SELECT SUM(LENGTH(content)) as total_chars 
  FROM topics WHERE content IS NOT NULL
`).get();
console.log(`\nTotal content characters: ${totalContent.total_chars}`);

db.close();
