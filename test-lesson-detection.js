const fs = require('fs');

// Load Grade 7 Volume 1 data
const data = JSON.parse(fs.readFileSync('webapp_pages/RCM07_NA_SW_V1/data/document.json', 'utf-8'));

let lessonCount = 0;
const lessons = new Set();

console.log(`Total pages in document: ${data.pages.length}`);

for (let i = 0; i < Math.min(100, data.pages.length); i++) {
  const page = data.pages[i];
  const text = page.text_preview || '';
  
  const match = text.match(/LESSON\s+(\d+)(?!\d)/i);
  if (match) {
    const lessonNum = parseInt(match[1]);
    lessons.add(lessonNum);
    console.log(`Page ${page.page_number}: Found LESSON ${lessonNum}`);
    console.log(`  Preview: ${text.substring(0, 100)}...`);
    if (lessonCount++ >= 10) break;
  }
}

console.log(`\nUnique lessons found: ${lessons.size}`);
console.log(`Lesson numbers: ${Array.from(lessons).sort((a,b) => a-b).join(', ')}`);
