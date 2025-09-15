const Database = require('better-sqlite3');
const db = new Database('./curriculum_precise.db', { readonly: true });

console.log('All tables:');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(tables);

console.log('\nSample lessons:');
const lessons = db.prepare('SELECT * FROM lessons LIMIT 3').all();
console.log(lessons);

console.log('\nSample documents:');
const documents = db.prepare('SELECT * FROM documents LIMIT 3').all();
console.log(documents);

db.close();
