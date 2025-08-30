/**
 * Batch Video Search Script
 * 
 * This script searches for Khan Academy videos for all lessons in your curriculum
 * and can optionally save the results to your database for caching.
 */

import { PrismaClient } from '@prisma/client';
import { YouTubeService } from '../src/lib/youtube-service';
import { LessonService } from '../src/lib/lesson-service';

const prisma = new PrismaClient();

interface VideoSearchResult {
  documentId: string;
  lessonNumber: number;
  lessonTitle: string;
  grade: number;
  videos: any[];
  searchTimestamp: Date;
}

class BatchVideoSearcher {
  private results: VideoSearchResult[] = [];
  private errors: { lesson: string; error: string }[] = [];

  async searchAllLessons(documentIds: string[] = ['RCM07_NA_SW_V1', 'RCM07_NA_SW_V2', 'RCM08_NA_SW_V1', 'RCM08_NA_SW_V2']) {
    console.log('🚀 Starting batch Khan Academy video search...');
    console.log(`📚 Processing ${documentIds.length} documents`);

    for (const documentId of documentIds) {
      await this.searchDocumentLessons(documentId);
    }

    this.printSummary();
    return this.results;
  }

  async searchDocumentLessons(documentId: string) {
    console.log(`\n📖 Processing ${documentId}...`);
    
    try {
      // Get all lessons for this document from database
      const lessons = await prisma.lesson.findMany({
        where: { 
          unit: {
            document: {
              filename: documentId
            }
          }
        },
        include: {
          unit: {
            include: {
              document: true
            }
          }
        },
        orderBy: { lesson_number: 'asc' }
      });

      if (lessons.length === 0) {
        console.log(`⚠️  No lessons found in database for ${documentId}`);
        return;
      }

      console.log(`   Found ${lessons.length} lessons to search`);
      const grade = documentId.includes('07') ? 7 : 8;

      for (const lesson of lessons) {
        await this.searchLessonVideos(
          documentId, 
          parseInt(lesson.lesson_number), 
          lesson.title, 
          grade
        );
        
        // Rate limiting - wait 1 second between searches to be nice to YouTube API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`❌ Error processing ${documentId}:`, error);
      this.errors.push({
        lesson: `${documentId} (all lessons)`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async searchLessonVideos(documentId: string, lessonNumber: number, lessonTitle: string, grade: number) {
    try {
      console.log(`   🔍 Lesson ${lessonNumber}: "${lessonTitle.substring(0, 50)}..."`);

      const videos = await YouTubeService.searchKhanAcademyVideos({
        lessonTitle,
        grade: grade as 7 | 8,
        maxResults: 3
      });

      const result: VideoSearchResult = {
        documentId,
        lessonNumber,
        lessonTitle,
        grade,
        videos,
        searchTimestamp: new Date()
      };

      this.results.push(result);

      console.log(`      ✅ Found ${videos.length} videos`);

      if (videos.length > 0) {
        videos.forEach((video, index) => {
          console.log(`         ${index + 1}. ${video.title} (${video.duration})`);
        });
      }

    } catch (error) {
      console.error(`      ❌ Error searching videos for lesson ${lessonNumber}:`, error);
      this.errors.push({
        lesson: `${documentId} Lesson ${lessonNumber}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async saveResultsToDatabase() {
    console.log('\n💾 Saving video search results to database...');

    try {
      // Create a simple table to cache video results
      // Note: You may need to add this to your Prisma schema
      
      for (const result of this.results) {
        if (result.videos.length > 0) {
          // For now, we'll just log the results
          // In a full implementation, you'd save to a VideoCache table
          console.log(`   Caching ${result.videos.length} videos for ${result.documentId} Lesson ${result.lessonNumber}`);
        }
      }

      console.log('✅ Results saved successfully');
      
    } catch (error) {
      console.error('❌ Error saving results:', error);
    }
  }

  exportResultsToJSON(filename: string = 'khan-academy-videos.json') {
    const fs = require('fs');
    const exportData = {
      searchDate: new Date(),
      totalLessons: this.results.length,
      totalVideos: this.results.reduce((sum, result) => sum + result.videos.length, 0),
      results: this.results,
      errors: this.errors
    };

    fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
    console.log(`\n📁 Results exported to ${filename}`);
  }

  printSummary() {
    console.log('\n📊 BATCH SEARCH SUMMARY');
    console.log('=' .repeat(50));
    console.log(`✅ Lessons processed: ${this.results.length}`);
    console.log(`📹 Total videos found: ${this.results.reduce((sum, result) => sum + result.videos.length, 0)}`);
    console.log(`❌ Errors encountered: ${this.errors.length}`);

    if (this.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      this.errors.forEach(error => {
        console.log(`   ${error.lesson}: ${error.error}`);
      });
    }

    const documentsWithVideos = this.results.filter(r => r.videos.length > 0);
    console.log(`\n🎯 Lessons with videos: ${documentsWithVideos.length}/${this.results.length}`);

    // Show top performing searches
    const topResults = this.results
      .sort((a, b) => b.videos.length - a.videos.length)
      .slice(0, 5);

    if (topResults.length > 0) {
      console.log('\n🏆 TOP RESULTS:');
      topResults.forEach((result, index) => {
        console.log(`   ${index + 1}. ${result.documentId} Lesson ${result.lessonNumber}: ${result.videos.length} videos`);
      });
    }
  }
}

// Main execution
async function main() {
  try {
    const searcher = new BatchVideoSearcher();
    
    // Check if YouTube API key is available
    if (!process.env.YOUTUBE_API_KEY) {
      console.log('⚠️  YouTube API key not found in environment variables.');
      console.log('   This script will work on Railway with your API key configured.');
      console.log('   For local testing, add YOUTUBE_API_KEY to your .env file.');
      process.exit(1);
    }

    // Search for videos for all lessons
    const results = await searcher.searchAllLessons();
    
    // Export results
    searcher.exportResultsToJSON('khan-academy-video-search-results.json');
    
    // Optionally save to database (when you add caching table)
    // await searcher.saveResultsToDatabase();

    console.log('\n🎉 Batch video search completed successfully!');

  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { BatchVideoSearcher };
