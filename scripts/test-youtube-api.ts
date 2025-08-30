/**
 * YouTube API Test Script
 * 
 * This script tests the YouTube API integration with your Khan Academy video search.
 * Run this on Railway to verify your API key is working correctly.
 */

import { YouTubeService } from '../src/lib/youtube-service';

interface TestCase {
  lessonTitle: string;
  grade: 7 | 8;
  expectedConcepts: string[];
}

const testCases: TestCase[] = [
  {
    lessonTitle: "LESSON 1 | Solve Problems Involving Scale",
    grade: 7,
    expectedConcepts: ['scale', 'proportions', 'ratios']
  },
  {
    lessonTitle: "LESSON 5 | Compare Proportional Relationships",  
    grade: 7,
    expectedConcepts: ['proportional relationships', 'compare', 'ratios']
  },
  {
    lessonTitle: "LESSON 12 | Solve Problems with Rational Numbers",
    grade: 7,
    expectedConcepts: ['rational numbers', 'fractions', 'decimals']
  },
  {
    lessonTitle: "LESSON 3 | Write and Solve One-Step Equations",
    grade: 8,
    expectedConcepts: ['equations', 'solving', 'algebra']
  },
  {
    lessonTitle: "LESSON 18 | Understand Functions",
    grade: 8,
    expectedConcepts: ['functions', 'relationships', 'algebra']
  }
];

async function testYouTubeAPI() {
  console.log('🧪 Testing YouTube API Integration');
  console.log('==================================');

  // Check if API key is available
  if (!process.env.YOUTUBE_API_KEY) {
    console.log('❌ YOUTUBE_API_KEY not found in environment variables');
    console.log('   Make sure to set it in your Railway deployment variables');
    return;
  }

  console.log('✅ YouTube API key found');
  console.log(`🔑 Key preview: ${process.env.YOUTUBE_API_KEY.substring(0, 10)}...`);

  let successCount = 0;
  let totalVideos = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n🔍 Test ${i + 1}/${testCases.length}: Grade ${testCase.grade}`);
    console.log(`   "${testCase.lessonTitle}"`);

    try {
      const startTime = Date.now();
      
      const videos = await YouTubeService.searchKhanAcademyVideos({
        lessonTitle: testCase.lessonTitle,
        grade: testCase.grade,
        maxResults: 2
      });

      const duration = Date.now() - startTime;
      
      if (videos.length > 0) {
        successCount++;
        totalVideos += videos.length;
        
        console.log(`   ✅ Found ${videos.length} videos (${duration}ms)`);
        
        videos.forEach((video, index) => {
          console.log(`      ${index + 1}. ${video.title}`);
          console.log(`         Duration: ${video.duration} | Views: ${video.viewCount ? parseInt(video.viewCount).toLocaleString() : 'N/A'}`);
          console.log(`         URL: ${video.url}`);
        });
      } else {
        console.log(`   ⚠️  No videos found (${duration}ms)`);
      }

      // Rate limiting
      if (i < testCases.length - 1) {
        console.log('   ⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (error) {
      console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  console.log('\n📊 TEST SUMMARY');
  console.log('===============');
  console.log(`✅ Successful searches: ${successCount}/${testCases.length}`);
  console.log(`📹 Total videos found: ${totalVideos}`);
  console.log(`📈 Average videos per search: ${totalVideos / testCases.length}`);

  if (successCount === testCases.length) {
    console.log('\n🎉 All tests passed! YouTube API integration is working perfectly.');
  } else if (successCount > 0) {
    console.log('\n⚠️  Some tests failed. Check your API key permissions and quota.');
  } else {
    console.log('\n❌ All tests failed. Check your YouTube API key configuration.');
  }
}

async function testSpecificLesson(lessonTitle: string, grade: 7 | 8 = 7) {
  console.log(`\n🎯 Testing specific lesson:`);
  console.log(`   Grade ${grade}: "${lessonTitle}"`);

  try {
    const videos = await YouTubeService.searchKhanAcademyVideos({
      lessonTitle,
      grade,
      maxResults: 5
    });

    if (videos.length > 0) {
      console.log(`\n✅ Found ${videos.length} Khan Academy videos:`);
      
      videos.forEach((video, index) => {
        console.log(`\n${index + 1}. ${video.title}`);
        console.log(`   Duration: ${video.duration}`);
        console.log(`   Views: ${video.viewCount ? parseInt(video.viewCount).toLocaleString() : 'N/A'}`);
        console.log(`   Published: ${new Date(video.publishedAt).toLocaleDateString()}`);
        console.log(`   URL: ${video.url}`);
        
        if (video.description) {
          const shortDesc = video.description.substring(0, 150);
          console.log(`   Description: ${shortDesc}${video.description.length > 150 ? '...' : ''}`);
        }
      });
    } else {
      console.log('   ❌ No videos found');
    }

  } catch (error) {
    console.log(`   ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length >= 2 && args[0] === 'test-lesson') {
    const lessonTitle = args[1];
    const grade = args[2] ? parseInt(args[2]) as 7 | 8 : 7;
    await testSpecificLesson(lessonTitle, grade);
  } else {
    await testYouTubeAPI();
  }
}

if (require.main === module) {
  main();
}

export { testYouTubeAPI, testSpecificLesson };
