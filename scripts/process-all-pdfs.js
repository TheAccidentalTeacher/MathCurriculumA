#!/usr/bin/env node

/**
 * Railway production script to process all PDFs with advanced extraction
 * This script can be run on Railway to update the database with full-fidelity content
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PDF_FILES = [
  'pdfs/RCM07_NA_SW_V1.pdf',
  'pdfs/RCM07_NA_SW_V2.pdf', 
  'pdfs/RCM08_NA_SW_V1.pdf',
  'pdfs/RCM08_NA_SW_V2.pdf'
];

async function processPDF(pdfPath) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 Processing ${pdfPath}...`);
    
    const command = `node dist/advanced-pdf-extractor.js "${pdfPath}"`;
    
    exec(command, { cwd: process.cwd() }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Failed to process ${pdfPath}:`, error);
        reject(error);
        return;
      }
      
      if (stderr) {
        console.warn(`⚠️ Warning for ${pdfPath}:`, stderr);
      }
      
      console.log(`✅ Completed ${pdfPath}`);
      console.log(stdout);
      resolve();
    });
  });
}

async function processAllPDFs() {
  console.log('🔄 Starting advanced PDF processing for all documents...\n');
  
  // Check if compiled extractor exists
  if (!fs.existsSync('dist/advanced-pdf-extractor.js')) {
    console.error('❌ Advanced PDF extractor not found. Please compile it first:');
    console.error('npx tsc scripts/advanced-pdf-extractor.ts --outDir dist --moduleResolution node --target es2020 --module commonjs --esModuleInterop');
    process.exit(1);
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const pdfFile of PDF_FILES) {
    if (!fs.existsSync(pdfFile)) {
      console.warn(`⚠️ File not found: ${pdfFile} - skipping`);
      continue;
    }
    
    try {
      await processPDF(pdfFile);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to process ${pdfFile}:`, error.message);
      errorCount++;
    }
    
    console.log(''); // Add spacing between files
  }
  
  console.log('📊 PROCESSING COMPLETE:');
  console.log(`✅ Successfully processed: ${successCount} files`);
  console.log(`❌ Failed to process: ${errorCount} files`);
  
  if (errorCount > 0) {
    console.log('\n🔧 To fix errors, check:');
    console.log('- PDF files exist in pdfs/ directory');
    console.log('- Database connection is working (DATABASE_URL)');
    console.log('- Advanced extractor is compiled');
    process.exit(1);
  }
  
  console.log('\n🎉 All PDFs processed successfully with full content fidelity!');
}

// Run if called directly
if (require.main === module) {
  processAllPDFs().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { processAllPDFs, processPDF };
