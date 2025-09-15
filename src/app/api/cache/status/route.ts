// src/app/api/cache/status/route.ts
// API endpoint to monitor vision analysis cache performance

import { NextRequest, NextResponse } from 'next/server';
import { LessonContentService } from '@/lib/lesson-content-service';

/**
 * GET: Get comprehensive cache statistics
 */
export async function GET(request: NextRequest) {
  try {
    console.log(`📊 [Cache API] Getting cache statistics...`);

    const stats = await LessonContentService.getCacheStats();
    const memoryStatus = LessonContentService.getCacheStatus();

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      cache: {
        memory: {
          entries: stats.memoryEntries,
          keys: memoryStatus.keys.slice(0, 10), // Show first 10 keys
          totalKeys: memoryStatus.keys.length
        },
        persistent: {
          entries: stats.persistentEntries,
          estimatedSavings: `$${stats.estimatedSavings.toFixed(2)}`,
          totalApiCallsSaved: stats.totalSavedApiCalls
        },
        performance: {
          hitRate: stats.memoryEntries > 0 ? ((stats.persistentEntries / (stats.persistentEntries + stats.memoryEntries)) * 100).toFixed(1) + '%' : '0%',
          costSavings: stats.estimatedSavings > 0 ? `Saved ~$${stats.estimatedSavings.toFixed(2)} in API calls` : 'No savings yet'
        }
      },
      message: `Cache contains ${stats.persistentEntries} persistent entries and ${stats.memoryEntries} memory entries`
    };

    console.log(`✅ [Cache API] Cache statistics retrieved successfully`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ [Cache API] Error getting cache statistics:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get cache statistics',
      fallback: 'Cache may not be initialized yet'
    }, { status: 500 });
  }
}

/**
 * DELETE: Clear all cache (memory and persistent)
 */
export async function DELETE(request: NextRequest) {
  try {
    console.log(`🗑️ [Cache API] Clearing all cache...`);

    // Clear memory cache
    LessonContentService.clearCache();

    // Clear persistent cache (recreate database)
    const Database = require('better-sqlite3');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'vision_cache.db');
    
    try {
      const db = new Database(dbPath);
      db.exec('DROP TABLE IF EXISTS vision_analysis_cache');
      db.close();
    } catch (dbError) {
      console.warn(`⚠️ [Cache API] Error clearing persistent cache:`, dbError);
    }

    console.log(`✅ [Cache API] All cache cleared successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'All cache (memory and persistent) cleared successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ [Cache API] Error clearing cache:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to clear cache'
    }, { status: 500 });
  }
}
