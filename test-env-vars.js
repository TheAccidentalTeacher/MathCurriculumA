// Test environment variables loading
require('dotenv').config({ path: '.env.local' });

console.log('🔧 Environment Variables Test:');
console.log('================================');

const envVars = [
  'YOUTUBE_API_KEY',
  'OPENAI_API_KEY', 
  'AZURE_AI_FOUNDRY_KEY',
  'GIPHY_API_KEY',
  'PEXELS_API_KEY',
  'REDDIT_CLIENT_ID',
  'SERPAPI_KEY'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ LOADED' : '❌ MISSING'}`);
  if (value) {
    console.log(`  Preview: ${value.substring(0, 10)}...${value.substring(value.length - 4)}`);
  }
});

console.log('================================');
console.log('🎯 Summary:', envVars.filter(v => process.env[v]).length, 'of', envVars.length, 'variables loaded');
