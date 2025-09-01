const fs = require('fs');
const path = require('path');

const sourcePath = '/workspaces/MathCurriculumA/virtualtutor/download (25).png';
const targetPath = '/workspaces/MathCurriculumA/public/virtualtutor/gimli.png';

try {
  fs.copyFileSync(sourcePath, targetPath);
  console.log('✅ Gimli image copied successfully');
  
  // Verify the file exists
  if (fs.existsSync(targetPath)) {
    console.log('✅ File confirmed to exist at:', targetPath);
  } else {
    console.log('❌ File not found after copy');
  }
} catch (error) {
  console.error('❌ Error copying file:', error.message);
}
