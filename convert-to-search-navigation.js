// Script to convert lesson data from page-based to search-based navigation
const fs = require('fs');

console.log('🔧 Converting accelerated pathway to search-based navigation...');

// Read the current file
const filePath = 'src/lib/accelerated-pathway.ts';
let content = fs.readFileSync(filePath, 'utf8');

console.log('📋 Conversion rules:');
console.log('- Remove startPage/endPage properties');
console.log('- Add navigationId, searchPattern, fallbackPattern, estimatedPage');
console.log('- Generate search patterns from lesson titles');

// Function to convert lesson title to search pattern
function generateSearchPattern(lessonNumber, title) {
  // Convert title to uppercase and create LESSON X | TITLE format
  const upperTitle = title.toUpperCase();
  return `LESSON ${lessonNumber} | ${upperTitle}`;
}

// Function to convert lesson title to navigation ID
function generateNavigationId(lessonNumber) {
  return `lesson-${lessonNumber}`;
}

// Function to convert a lesson object
function convertLessonObject(match, lessonContent) {
  // Extract lesson number and title from the lesson object
  const lessonNumberMatch = lessonContent.match(/lessonNumber:\s*(\d+)/);
  const titleMatch = lessonContent.match(/title:\s*"([^"]+)"/);
  const startPageMatch = lessonContent.match(/startPage:\s*(\d+)/);
  
  if (!lessonNumberMatch || !titleMatch) {
    console.log('⚠️  Could not extract lesson info from:', lessonContent.substring(0, 100));
    return match; // Return unchanged if we can't parse it
  }
  
  const lessonNumber = lessonNumberMatch[1];
  const title = titleMatch[1];
  const startPage = startPageMatch ? startPageMatch[1] : null;
  
  const navigationId = generateNavigationId(lessonNumber);
  const searchPattern = generateSearchPattern(lessonNumber, title);
  const fallbackPattern = title;
  
  // Replace the lesson object with new structure
  let newLessonContent = lessonContent
    // Remove startPage and endPage
    .replace(/\s*startPage:\s*\d+,?\s*/g, '')
    .replace(/\s*endPage:\s*\d+,?\s*/g, '')
    // Add new properties after volume
    .replace(
      /(volume:\s*[12],?\s*)/,
      `$1
        navigationId: "${navigationId}",
        searchPattern: "${searchPattern}",
        fallbackPattern: "${fallbackPattern}",${startPage ? `\n        estimatedPage: ${startPage},` : ''}
        `
    );
  
  console.log(`✓ L${lessonNumber}: ${title.substring(0, 40)}...`);
  return newLessonContent;
}

// Find all lesson objects and convert them
const lessonPattern = /(\{\s*id:\s*"[^"]+",[\s\S]*?originalCode:\s*"[^"]+"\s*\})/g;
let convertedCount = 0;

content = content.replace(lessonPattern, (match) => {
  const converted = convertLessonObject(match, match);
  if (converted !== match) {
    convertedCount++;
  }
  return converted;
});

// Write the converted content back to file
fs.writeFileSync(filePath, content);

console.log(`\n🎉 Conversion complete!`);
console.log(`✅ Converted ${convertedCount} lessons to search-based navigation`);
console.log(`📁 Updated: ${filePath}`);
console.log(`\n🔍 New navigation system features:`);
console.log(`- navigationId: Unique identifier for each lesson`);
console.log(`- searchPattern: Primary search text (LESSON X | TITLE format)`);  
console.log(`- fallbackPattern: Backup search text (just the title)`);
console.log(`- estimatedPage: Optional rough page for quick jumps`);
console.log(`\n📝 Next steps:`);
console.log(`1. Update PDF viewer to use search-based navigation`);
console.log(`2. Test navigation with a few lessons`);
console.log(`3. Remove old page-based logic completely`);
