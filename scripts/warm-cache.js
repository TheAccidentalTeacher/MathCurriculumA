// scripts/warm-cache.js
// Pre-generate all lesson content for optimal student experience
// Run this script every morning before students arrive

const fetch = require('node-fetch');

// Configuration - Update these for your curriculum
const CONFIG = {
  baseUrl: 'http://localhost:3000', // Change to your production URL when deployed
  curricula: [
    {
      documentId: 'RCM07_NA_SW_V1',
      name: 'Grade 7 Math - Volume 1',
      lessons: Array.from({length: 20}, (_, i) => i + 1) // Lessons 1-20, adjust as needed
    },
    // Add more curricula here as needed
    // {
    //   documentId: 'RCM08_NA_SW_V1', 
    //   name: 'Grade 8 Math - Volume 1',
    //   lessons: Array.from({length: 15}, (_, i) => i + 1)
    // }
  ],
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds between retries
  batchDelay: 2000, // 2 seconds between lessons to avoid overwhelming the server
};

class CacheWarmer {
  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.skippedCount = 0;
    this.totalOperations = 0;
    this.startTime = Date.now();
  }

  async warmAllContent() {
    console.log('🔥 CACHE WARMING STARTED');
    console.log('='.repeat(50));
    console.log(`📅 ${new Date().toLocaleString()}`);
    console.log(`🎯 Target: ${CONFIG.baseUrl}`);
    console.log('='.repeat(50));

    // Calculate total operations
    this.totalOperations = CONFIG.curricula.reduce((total, curriculum) => {
      return total + (curriculum.lessons.length * 3); // 3 operations per lesson
    }, 0);

    console.log(`📊 Total operations to perform: ${this.totalOperations}`);
    console.log('');

    for (const curriculum of CONFIG.curricula) {
      await this.warmCurriculum(curriculum);
    }

    this.printSummary();
  }

  async warmCurriculum(curriculum) {
    console.log(`📚 Processing: ${curriculum.name} (${curriculum.documentId})`);
    console.log(`📖 Lessons: ${curriculum.lessons.length}`);
    console.log('');

    for (const lessonNumber of curriculum.lessons) {
      await this.warmLesson(curriculum.documentId, lessonNumber);
      
      // Small delay between lessons to be gentle on the server
      if (CONFIG.batchDelay > 0) {
        await this.delay(CONFIG.batchDelay);
      }
    }
  }

  async warmLesson(documentId, lessonNumber) {
    const lessonId = `${documentId}-${lessonNumber}`;
    console.log(`🔄 Warming Lesson ${lessonNumber}...`);

    // 1. Warm vision analysis
    await this.warmEndpoint(
      'Vision Analysis',
      `${CONFIG.baseUrl}/api/lessons/${documentId}/${lessonNumber}/vision-analysis`,
      'POST'
    );

    // 2. Warm practice questions
    await this.warmEndpoint(
      'Practice Questions',
      `${CONFIG.baseUrl}/api/lessons/${documentId}/${lessonNumber}/generate-questions`,
      'POST'
    );

    // 3. Warm kid-friendly questions
    await this.warmEndpoint(
      'Kid-Friendly Questions',
      `${CONFIG.baseUrl}/api/lessons/${documentId}/${lessonNumber}/kid-friendly-questions`,
      'GET'
    );

    console.log(`✅ Lesson ${lessonNumber} complete\n`);
  }

  async warmEndpoint(operationType, url, method = 'GET') {
    for (let attempt = 1; attempt <= CONFIG.retryAttempts; attempt++) {
      try {
        const startTime = Date.now();
        
        const response = await fetch(url, {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          // Add body for POST requests if needed
          ...(method === 'POST' && { body: JSON.stringify({}) })
        });

        const duration = Date.now() - startTime;

        if (response.ok) {
          const data = await response.json();
          
          // Determine if content was cached or generated
          const wasCached = this.detectCachedResponse(data, response);
          const status = wasCached ? '💾 CACHED' : '🤖 GENERATED';
          
          console.log(`  ${status} ${operationType}: ${duration}ms`);
          
          if (wasCached) {
            this.skippedCount++;
          } else {
            this.successCount++;
          }
          
          return data;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.log(`  ❌ ${operationType} (Attempt ${attempt}): ${error.message}`);
        
        if (attempt === CONFIG.retryAttempts) {
          console.log(`  💥 FAILED after ${CONFIG.retryAttempts} attempts`);
          this.errorCount++;
          return null;
        }
        
        if (attempt < CONFIG.retryAttempts) {
          console.log(`  ⏳ Retrying in ${CONFIG.retryDelay/1000}s...`);
          await this.delay(CONFIG.retryDelay);
        }
      }
    }
  }

  detectCachedResponse(data, response) {
    // Look for cache indicators in the response
    // This is based on your current API structure
    if (data.fromCache === true) return true;
    if (data.cached === true) return true;
    
    // For questions responses, if we get results very quickly, likely cached
    if (data.questions && response.status === 200) {
      // If response was super fast, probably cached
      return false; // We'll rely on the logs to tell us
    }
    
    return false;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  printSummary() {
    const totalTime = Date.now() - this.startTime;
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    
    console.log('='.repeat(50));
    console.log('🎉 CACHE WARMING COMPLETE');
    console.log('='.repeat(50));
    console.log(`⏱️  Total time: ${minutes}m ${seconds}s`);
    console.log(`✅ Generated: ${this.successCount}`);
    console.log(`💾 Already cached: ${this.skippedCount}`);
    console.log(`❌ Errors: ${this.errorCount}`);
    console.log(`📊 Total operations: ${this.totalOperations}`);
    console.log('');
    
    if (this.errorCount === 0) {
      console.log('🎯 All content successfully warmed!');
      console.log('🚀 Students will experience lightning-fast responses!');
    } else {
      console.log(`⚠️  ${this.errorCount} operations failed. Check the logs above.`);
    }
    
    console.log('');
    console.log('💡 COST SAVINGS:');
    console.log(`   • First run: ~$${(this.successCount * 0.03).toFixed(2)} (one-time generation)`);
    console.log(`   • Student sessions: $0.00 (all cached responses)`);
    console.log(`   • 15 students × 20 lessons = 300 free API calls saved!`);
    console.log('='.repeat(50));
  }

  // Method to check if server is ready
  async checkServerHealth() {
    try {
      const response = await fetch(`${CONFIG.baseUrl}/api/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Main execution
async function main() {
  const warmer = new CacheWarmer();
  
  // Check if server is running
  console.log('🔍 Checking if server is running...');
  const isServerReady = await warmer.checkServerHealth();
  
  if (!isServerReady) {
    console.log('❌ Server not accessible. Make sure your app is running:');
    console.log('   npm run dev  (for development)');
    console.log('   or your production server is up');
    process.exit(1);
  }
  
  console.log('✅ Server is ready!\n');
  
  await warmer.warmAllContent();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Cache warming interrupted');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Cache warming failed:', error);
    process.exit(1);
  });
}

module.exports = { CacheWarmer, CONFIG };