#!/usr/bin/env node

// Simple OCR test script
const { OCRService } = require('./src/lib/ocr-service.ts');

async function testOCR() {
  console.log('🧪 Testing Phase 2 OCR Implementation');
  console.log('=====================================');
  
  try {
    // Test 1: Check available volumes
    console.log('\n1️⃣ Testing available volumes...');
    const volumes = await OCRService.getAvailableVolumes();
    console.log(`✅ Found ${volumes.length} volumes:`, volumes);
    
    if (volumes.length === 0) {
      console.log('❌ No volumes found. Check webapp_pages directory.');
      return;
    }
    
    // Test 2: Test OCR with first volume
    console.log('\n2️⃣ Testing OCR processing...');
    const testResult = await OCRService.testOCR(volumes[0]);
    
    if (testResult) {
      console.log('✅ OCR test successful!');
      console.log(`   📄 Page: ${testResult.pageNumber}`);
      console.log(`   📝 Text: ${testResult.extractedText.length} chars`);
      console.log(`   📐 Formulas: ${testResult.mathematicalFormulas.length}`);
      console.log(`   📊 Tables: ${testResult.tables.length}`);
      console.log(`   🎯 Confidence: ${(testResult.confidence * 100).toFixed(1)}%`);
      console.log(`   ⏱️  Time: ${testResult.processingTimeMs}ms`);
      
      // Show text preview
      if (testResult.extractedText.length > 0) {
        console.log('\n📝 Text Preview:');
        console.log(testResult.extractedText.substring(0, 200) + '...');
      }
      
      // Show formula samples
      if (testResult.mathematicalFormulas.length > 0) {
        console.log('\n📐 Formula Samples:');
        testResult.mathematicalFormulas.slice(0, 3).forEach((formula, i) => {
          console.log(`   ${i + 1}. ${formula}`);
        });
      }
      
    } else {
      console.log('❌ OCR test failed');
    }
    
    console.log('\n🎉 Phase 2 OCR test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('Azure AI Foundry')) {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check Azure AI Foundry keys are set correctly');
      console.log('   2. Verify endpoint URL is correct');
      console.log('   3. Ensure Document Intelligence service is enabled');
    }
  }
}

if (require.main === module) {
  testOCR().catch(console.error);
}

module.exports = { testOCR };
