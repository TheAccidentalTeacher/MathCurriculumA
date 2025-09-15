# Cache Warming Scripts

These scripts help you pre-generate all lesson content so students get instant responses.

## Quick Start

### 1. Install Dependencies
```bash
npm install node-fetch
```

### 2. Start Your Server
```bash
npm run dev  # or your production server
```

### 3. Run Cache Warming
```bash
node scripts/warm-cache.js
```

## Configuration

Edit `scripts/warm-cache.js` to configure:

```javascript
const CONFIG = {
  baseUrl: 'http://localhost:3000', // Your server URL
  curricula: [
    {
      documentId: 'RCM07_NA_SW_V1',
      name: 'Grade 7 Math - Volume 1', 
      lessons: Array.from({length: 20}, (_, i) => i + 1) // Lessons 1-20
    }
    // Add more curricula...
  ]
};
```

## What Gets Pre-Generated

For each lesson, the script warms:
1. **Vision Analysis** - AI analysis of lesson pages
2. **Practice Questions** - Student practice problems  
3. **Kid-Friendly Questions** - Questions for virtual tutor

## Expected Output

```
🔥 CACHE WARMING STARTED
=================================================
📅 9/15/2025, 8:00:00 AM
🎯 Target: http://localhost:3000
📊 Total operations to perform: 60

📚 Processing: Grade 7 Math - Volume 1 (RCM07_NA_SW_V1)
📖 Lessons: 20

🔄 Warming Lesson 1...
  🤖 GENERATED Vision Analysis: 15234ms
  🤖 GENERATED Practice Questions: 21456ms  
  💾 CACHED Kid-Friendly Questions: 245ms
✅ Lesson 1 complete

🔄 Warming Lesson 2...
  💾 CACHED Vision Analysis: 12ms
  🤖 GENERATED Practice Questions: 18967ms
  🤖 GENERATED Kid-Friendly Questions: 4521ms
✅ Lesson 2 complete

=================================================
🎉 CACHE WARMING COMPLETE
⏱️  Total time: 12m 34s
✅ Generated: 38
💾 Already cached: 22  
❌ Errors: 0
📊 Total operations: 60

🎯 All content successfully warmed!
🚀 Students will experience lightning-fast responses!

💡 COST SAVINGS:
   • First run: ~$1.14 (one-time generation)
   • Student sessions: $0.00 (all cached responses)
   • 15 students × 20 lessons = 300 free API calls saved!
```

## Daily Workflow

1. **Morning** (before students arrive):
   ```bash
   node scripts/warm-cache.js
   ```

2. **During class**: Students get instant responses from cache

3. **New lessons**: Run the script again to warm new content

## Cost Optimization

- **Without warming**: 15 students × 20 lessons × $0.03 = **$9.00**
- **With warming**: 1 run × 20 lessons × $0.03 = **$0.60**
- **Savings**: **$8.40 per day** + instant student experience!

## Troubleshooting

### Server Not Running
```
❌ Server not accessible. Make sure your app is running:
   npm run dev  (for development)
```

### API Errors
The script will retry failed requests 3 times with 5-second delays.

### Partial Failures
If some lessons fail, you can re-run the script - it will skip already cached content.

## Advanced Usage

### Production Deployment
Update the baseUrl in CONFIG:
```javascript
baseUrl: 'https://your-app.vercel.app'
```

### Multiple Curricula
Add more curricula to the CONFIG:
```javascript
curricula: [
  {
    documentId: 'RCM07_NA_SW_V1',
    name: 'Grade 7 Math - Volume 1',
    lessons: Array.from({length: 20}, (_, i) => i + 1)
  },
  {
    documentId: 'RCM08_NA_SW_V1', 
    name: 'Grade 8 Math - Volume 1',
    lessons: Array.from({length: 15}, (_, i) => i + 1)
  }
]
```

### Automation
Set up a cron job or scheduled task to run this daily:
```bash
# Run every day at 7 AM
0 7 * * * cd /path/to/your/app && node scripts/warm-cache.js
```