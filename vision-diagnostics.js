// Test the exact vision analysis flow that's failing
console.log('Testing vision analysis for RCM08_NA_SW_V1 - Lesson 2');

const path = require('path');
const fs = require('fs');

// Check if the image files exist
function checkImagePaths() {
  console.log('\n📁 Checking image paths for RCM08_NA_SW_V1...');
  
  const documentId = 'RCM08_NA_SW_V1';
  const pageNumber = 1; // Test with first page
  
  // Use the same logic as getPageImagePath
  const pageNumberStr = pageNumber.toString().padStart(3, '0');
  const possiblePaths = [
    path.join(process.cwd(), 'webapp_pages', documentId, 'pages', `page_${pageNumberStr}.png`),
    path.join(process.cwd(), 'public', 'documents', documentId, 'pages', `${pageNumber}.png`),
    path.join(process.cwd(), 'public', 'documents', documentId, 'pages', `page_${pageNumber}.png`),
    path.join(process.cwd(), 'public', 'images', documentId, `${pageNumber}.png`),
  ];

  console.log('Checking paths:');
  for (const imagePath of possiblePaths) {
    try {
      if (fs.existsSync(imagePath)) {
        console.log(`✅ Found: ${imagePath}`);
        const stats = fs.statSync(imagePath);
        console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
        return imagePath;
      } else {
        console.log(`❌ Not found: ${imagePath}`);
      }
    } catch (error) {
      console.log(`❌ Error checking: ${imagePath} - ${error.message}`);
    }
  }
  
  return null;
}

// Check lesson page range
function checkLessonPageRange() {
  console.log('\n📖 Checking lesson page range...');
  
  try {
    // Check if curriculum database exists
    const dbPath = path.join(process.cwd(), 'curriculum.db');
    if (fs.existsSync(dbPath)) {
      console.log('✅ Database found at:', dbPath);
      const stats = fs.statSync(dbPath);
      console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
    } else {
      console.log('❌ Database not found at:', dbPath);
    }
  } catch (error) {
    console.log('❌ Error checking database:', error.message);
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('\n🔑 Checking environment...');
  
  const openaiKey = process.env.OPENAI_API_KEY;
  console.log('OpenAI API Key:', openaiKey ? `${openaiKey.substring(0, 7)}...${openaiKey.substring(openaiKey.length - 4)}` : 'NOT FOUND');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('Current working directory:', process.cwd());
}

// Run all checks
function runDiagnostics() {
  console.log('🔍 Vision Analysis Diagnostics for RCM08_NA_SW_V1 - Lesson 2\n');
  
  checkEnvironment();
  checkImagePaths();
  checkLessonPageRange();
  
  console.log('\n📊 Summary:');
  console.log('- This diagnostic helps identify why vision analysis is returning 0 concepts');
  console.log('- The 0.5 confidence suggests fallback analysis is being used');
  console.log('- Check above for missing images or API key issues');
}

runDiagnostics();
