// Enhanced LessonContentService with persistent cache prevention
// This prevents duplicate API calls and database work

export class LessonContentService {
  private static cache = new Map<string, LessonAnalysis>();
  private static dbPath = path.join(process.cwd(), 'vision_cache.db');

  /**
   * BULLETPROOF CACHE SYSTEM - Prevents duplicate API calls
   */
  static async analyzeCompleteVisualLesson(
    documentId: string, 
    lessonNumber: number
  ): Promise<LessonAnalysis> {
    const cacheKey = `lesson_vision_analysis_${documentId}_${lessonNumber}`;
    console.log(`🔍 [LessonContentService] Checking cache for ${cacheKey}`);
    
    // LAYER 1: Check in-memory cache (fastest - microseconds)
    const memoryCache = this.cache.get(cacheKey);
    if (memoryCache) {
      console.log(`⚡ [Cache] MEMORY HIT - returning instant result for ${cacheKey}`);
      return memoryCache;
    }

    // LAYER 2: Check persistent database cache (fast - milliseconds)
    const dbCache = await this.loadFromPersistentCache(cacheKey);
    if (dbCache) {
      console.log(`💾 [Cache] DATABASE HIT - loading from persistent cache for ${cacheKey}`);
      // Cache in memory for next time
      this.cache.set(cacheKey, dbCache);
      return dbCache;
    }

    // LAYER 3: Only call API if NO cache exists (expensive - 10-30 seconds)
    console.log(`🔥 [Cache] CACHE MISS - calling OpenAI API for ${cacheKey} (this should be rare!)`);
    console.log(`💰 [Cost] This API call costs ~$0.01-0.05`);
    
    try {
      // Perform expensive OpenAI Vision analysis
      const result = await this.performVisionAnalysis(documentId, lessonNumber);
      
      // SAVE TO BOTH CACHES immediately
      await this.saveToBothCaches(cacheKey, result);
      
      console.log(`✅ [Cache] Analysis complete and saved to persistent cache`);
      return result;
      
    } catch (error) {
      console.error(`❌ [API] Vision analysis failed:`, error);
      throw error;
    }
  }

  /**
   * Load from persistent database cache
   */
  private static async loadFromPersistentCache(cacheKey: string): Promise<LessonAnalysis | null> {
    try {
      const Database = require('better-sqlite3');
      const db = new Database(this.dbPath, { readonly: true });
      
      const stmt = db.prepare(`
        SELECT analysis_data, created_at 
        FROM vision_analysis_cache 
        WHERE cache_key = ?
      `);
      
      const row = stmt.get(cacheKey);
      db.close();
      
      if (row) {
        console.log(`📊 [Cache] Found persistent cache entry from ${row.created_at}`);
        return JSON.parse(row.analysis_data);
      }
      
      return null;
    } catch (error) {
      console.warn(`⚠️ [Cache] Error loading from persistent cache:`, error);
      return null;
    }
  }

  /**
   * Save to both memory and persistent cache
   */
  private static async saveToBothCaches(cacheKey: string, analysis: LessonAnalysis): Promise<void> {
    // Save to memory cache
    this.cache.set(cacheKey, analysis);
    
    // Save to persistent database cache
    try {
      const Database = require('better-sqlite3');
      const db = new Database(this.dbPath);
      
      // Create table if it doesn't exist
      db.exec(`
        CREATE TABLE IF NOT EXISTS vision_analysis_cache (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          cache_key TEXT UNIQUE NOT NULL,
          document_id TEXT NOT NULL,
          lesson_number INTEGER NOT NULL,
          analysis_data TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          api_cost_estimate DECIMAL(10,4) DEFAULT 0.02
        )
      `);
      
      // Insert or replace cache entry
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO vision_analysis_cache 
        (cache_key, document_id, lesson_number, analysis_data)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run(
        cacheKey,
        analysis.lessonId.split('-')[0], 
        parseInt(analysis.lessonId.split('-')[1]),
        JSON.stringify(analysis)
      );
      
      db.close();
      console.log(`💾 [Cache] Saved to persistent database: ${cacheKey}`);
      
    } catch (error) {
      console.error(`❌ [Cache] Error saving to persistent cache:`, error);
      // Continue anyway - we still have memory cache
    }
  }

  /**
   * Check if lesson analysis exists in ANY cache layer
   */
  static async isLessonCached(documentId: string, lessonNumber: number): Promise<boolean> {
    const cacheKey = `lesson_vision_analysis_${documentId}_${lessonNumber}`;
    
    // Check memory first
    if (this.cache.has(cacheKey)) {
      return true;
    }
    
    // Check persistent cache
    const dbCache = await this.loadFromPersistentCache(cacheKey);
    return dbCache !== null;
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    memoryEntries: number;
    persistentEntries: number;
    totalSavedApiCalls: number;
    estimatedSavings: number;
  }> {
    try {
      const Database = require('better-sqlite3');
      const db = new Database(this.dbPath, { readonly: true });
      
      const stmt = db.prepare('SELECT COUNT(*) as count, SUM(api_cost_estimate) as savings FROM vision_analysis_cache');
      const result = stmt.get();
      db.close();
      
      return {
        memoryEntries: this.cache.size,
        persistentEntries: result.count || 0,
        totalSavedApiCalls: result.count || 0,
        estimatedSavings: result.savings || 0
      };
    } catch (error) {
      return {
        memoryEntries: this.cache.size,
        persistentEntries: 0,
        totalSavedApiCalls: 0,
        estimatedSavings: 0
      };
    }
  }
}
