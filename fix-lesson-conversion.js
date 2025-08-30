// Fixed script to properly convert lesson data
const fs = require('fs');

console.log('🔧 FIXED: Converting accelerated pathway to search-based navigation...');

// Read the current file
const filePath = 'src/lib/accelerated-pathway.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Function to clean up and convert lesson objects properly
function fixLessonObject(match) {
  let lessonContent = match;
  
  // Extract key information
  const lessonNumberMatch = lessonContent.match(/lessonNumber:\s*(\d+)/);
  const titleMatch = lessonContent.match(/title:\s*"([^"]+)"/);
  
  if (!lessonNumberMatch || !titleMatch) {
    return match; // Return unchanged if we can't parse it
  }
  
  const lessonNumber = lessonNumberMatch[1];
  const title = titleMatch[1];
  
  // Remove any duplicate navigationId, searchPattern, fallbackPattern entries
  lessonContent = lessonContent.replace(/\s*navigationId:\s*"[^"]*",?\s*/g, '');
  lessonContent = lessonContent.replace(/\s*searchPattern:\s*"[^"]*",?\s*/g, '');
  lessonContent = lessonContent.replace(/\s*fallbackPattern:\s*"[^"]*",?\s*/g, '');
  lessonContent = lessonContent.replace(/\s*estimatedPage:\s*\d+,?\s*/g, '');
  
  // Remove old startPage/endPage if they still exist
  lessonContent = lessonContent.replace(/\s*startPage:\s*\d+,?\s*/g, '');
  lessonContent = lessonContent.replace(/\s*endPage:\s*\d+,?\s*/g, '');
  
  // Generate proper search pattern from title only
  const searchPattern = `LESSON ${lessonNumber} | ${title.toUpperCase()}`;
  const navigationId = `lesson-${lessonNumber}`;
  
  // Add the new properties after volume
  lessonContent = lessonContent.replace(
    /(volume:\s*[12],?\s*)/,
    `$1
        navigationId: "${navigationId}",
        searchPattern: "${searchPattern}",
        fallbackPattern: "${title}",
        `
  );
  
  console.log(`✓ L${lessonNumber}: ${title.substring(0, 50)}...`);
  return lessonContent;
}

// Find and fix all lesson objects
const lessonPattern = /(\{\s*id:\s*"[^"]+",[\s\S]*?originalCode:\s*"[^"]+"\s*\})/g;
let fixedCount = 0;

content = content.replace(lessonPattern, (match) => {
  const fixed = fixLessonObject(match);
  if (fixed !== match) {
    fixedCount++;
  }
  return fixed;
});

// Write the fixed content back to file
fs.writeFileSync(filePath, content);

console.log(`\n🎉 Fix complete!`);
console.log(`✅ Fixed ${fixedCount} lesson objects`);
console.log(`🧹 Removed duplicates and inconsistencies`);
console.log(`📁 Updated: ${filePath}`);
