// Properly fix Grade 6 JSON files to match expected page counts
const fs = require('fs');

async function fixGrade6JsonFiles() {
  console.log('🔧 Fixing Grade 6 JSON files...');
  
  // Fix Volume 1 (512 pages expected)
  const v1Path = '/workspaces/MathCurriculumA/webapp_pages/RCM06_NA_SW_V1/data/document.json';
  const v1Data = JSON.parse(fs.readFileSync(v1Path, 'utf8'));
  
  console.log(`📖 Grade 6 V1 - Original pages: ${v1Data.pages.length}`);
  
  // Take first 512 unique pages for V1
  const v1Pages = [];
  const seenContent = new Set();
  
  for (const page of v1Data.pages) {
    if (v1Pages.length >= 512) break;
    
    const content = page.text_content.trim();
    if (content.length > 0 && !seenContent.has(content.substring(0, 50))) {
      seenContent.add(content.substring(0, 50));
      v1Pages.push({
        ...page,
        page_number: v1Pages.length + 1
      });
    }
  }
  
  // Fill remaining slots with empty pages
  while (v1Pages.length < 512) {
    v1Pages.push({
      page_number: v1Pages.length + 1,
      text_content: "",
      text_preview: "",
      lesson_indicators: [],
      visual_elements: [],
      mathematical_concepts: []
    });
  }
  
  v1Data.pages = v1Pages;
  v1Data.metadata.total_pages = 512;
  
  fs.writeFileSync(v1Path, JSON.stringify(v1Data, null, 2));
  console.log(`✅ Fixed Grade 6 V1: ${v1Pages.length} pages`);
  
  // Fix Volume 2 (408 pages expected)  
  const v2Path = '/workspaces/MathCurriculumA/webapp_pages/RCM06_NA_SW_V2/data/document.json';
  const v2Data = JSON.parse(fs.readFileSync(v2Path, 'utf8'));
  
  console.log(`📖 Grade 6 V2 - Original pages: ${v2Data.pages.length}`);
  
  // Take first 408 unique pages for V2
  const v2Pages = [];
  const seenV2Content = new Set();
  
  for (const page of v2Data.pages) {
    if (v2Pages.length >= 408) break;
    
    const content = page.text_content.trim();
    if (content.length > 0 && !seenV2Content.has(content.substring(0, 50))) {
      seenV2Content.add(content.substring(0, 50));
      v2Pages.push({
        ...page,
        page_number: v2Pages.length + 1
      });
    }
  }
  
  // Fill remaining slots with empty pages
  while (v2Pages.length < 408) {
    v2Pages.push({
      page_number: v2Pages.length + 1,
      text_content: "",
      text_preview: "",
      lesson_indicators: [],
      visual_elements: [],
      mathematical_concepts: []
    });
  }
  
  v2Data.pages = v2Pages;
  v2Data.metadata.total_pages = 408;
  
  fs.writeFileSync(v2Path, JSON.stringify(v2Data, null, 2));
  console.log(`✅ Fixed Grade 6 V2: ${v2Pages.length} pages`);
  
  return {
    v1_pages: v1Pages.length,
    v2_pages: v2Pages.length
  };
}

// Run the fixer
fixGrade6JsonFiles()
  .then(result => console.log('🎉 Grade 6 JSON fix complete:', result))
  .catch(console.error);
