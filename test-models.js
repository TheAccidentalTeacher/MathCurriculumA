// Test script to demonstrate multi-model AI functionality
// Run with: node test-models.js

import { EnhancedAIService } from './src/lib/enhanced-ai-service.js';
import { AVAILABLE_MODELS } from './src/lib/ai-curriculum-context.js';

async function testMultipleModels() {
  console.log('🧪 Testing Multi-Model AI Functionality\n');
  
  // Display available models
  console.log('📋 Available Models:');
  Object.entries(AVAILABLE_MODELS).forEach(([model, config]) => {
    const recommended = config.recommended ? '⭐ RECOMMENDED' : '';
    console.log(`  • ${model}: ${config.description} (${config.costTier} cost, ${config.maxTokens} tokens) ${recommended}`);
  });
  console.log('');

  // Test payload for Grade 8+9 accelerated pathway
  const testPayload = {
    gradeLevel: '8+9',
    gradeCombination: {
      selectedGrades: ['8', '9'],
      pathwayType: 'accelerated',
      skipGrades: [],
      emphasis: 'foundational'
    },
    timeframe: 'year',
    studentPopulation: 'general',
    priorities: ['Major standards focus'],
    scheduleConstraints: {
      daysPerWeek: 5,
      minutesPerClass: 50,
      specialEvents: []
    },
    differentiationNeeds: ['Advanced learners']
  };

  // Test each model (but only run GPT-4o for now to avoid costs)
  const modelsToTest = ['gpt-4o']; // Add 'gpt-5' when ready to test
  
  for (const modelName of modelsToTest) {
    console.log(`🤖 Testing with ${modelName}...`);
    console.log('─'.repeat(50));
    
    try {
      // Create service with specific model
      const aiService = new EnhancedAIService(modelName);
      
      // Display model info
      const modelInfo = aiService.getModelInfo();
      console.log(`📊 Model: ${modelInfo.current.name}`);
      console.log(`📝 Description: ${modelInfo.current.description}`);
      console.log(`🎛️ Max Tokens: ${modelInfo.current.maxTokens}`);
      console.log(`🌡️ Temperature: ${modelInfo.current.temperature}`);
      console.log(`💰 Cost Tier: ${modelInfo.current.costTier}`);
      console.log('');
      
      // Test context building (without actual AI call)
      console.log('🏗️ Testing curriculum context building...');
      const context = await aiService.curriculumService.buildCurriculumContext('8', ['8', '9']);
      console.log(`✅ Context built: ${context.totalLessons} lessons, ${context.totalInstructionalDays} days`);
      
      // Test prompt generation
      console.log('📝 Testing prompt generation...');
      const prompt = aiService.curriculumService.generatePacingPrompt(
        context,
        testPayload.timeframe,
        testPayload.studentPopulation,
        testPayload.priorities
      );
      console.log(`✅ Prompt generated: ${prompt.length} characters`);
      console.log(`🎯 Model-specific constraints included for ${modelName}`);
      
      console.log('🎉 Model test completed successfully!\n');
      
    } catch (error) {
      console.error(`❌ Error testing ${modelName}:`, error.message);
      console.log('');
    }
  }
  
  console.log('🏁 Multi-model testing complete!');
  console.log('');
  console.log('💡 To test GPT-5:');
  console.log('   1. Add "gpt-5" to modelsToTest array');
  console.log('   2. Ensure you have GPT-5 API access');
  console.log('   3. Run the test');
  console.log('');
  console.log('🔄 To switch models in production:');
  console.log('   const aiService = new EnhancedAIService("gpt-5");');
  console.log('   // or');
  console.log('   aiService.setModel("gpt-5");');
}

// Run the test
testMultipleModels().catch(console.error);
