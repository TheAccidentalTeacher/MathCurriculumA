import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

interface DocumentPage {
  page_number: number;
  filename: string;
  text_preview: string;
  keywords: string[];
  page_type: string;
  word_count: number;
  has_significant_content: boolean;
}

interface DocumentData {
  id: string;
  title: string;
  filename: string;
  total_pages: number;
  pages: DocumentPage[];
}

interface SearchResult {
  page_number: number;
  score: number;
  text_preview: string;
  match_type: 'exact' | 'partial' | 'keyword';
}

/**
 * Professional document search service using extracted text data
 * Searches through pre-extracted page content for lesson navigation
 */
export class DocumentSearchService {
  private static documentCache: Map<string, DocumentData> = new Map();
  
  /**
   * Load document data from extracted JSON files
   */
  private static async loadDocumentData(documentId: string): Promise<DocumentData | null> {
    // Check cache first
    if (this.documentCache.has(documentId)) {
      return this.documentCache.get(documentId)!;
    }
    
    const documentMap: { [key: string]: string } = {
      'RCM07_NA_SW_V1': 'RCM07_NA_SW_V1',
      'rcm07-na-sw-v1': 'RCM07_NA_SW_V1',
      'RCM07_NA_SW_V2': 'RCM07_NA_SW_V2',
      'rcm07-na-sw-v2': 'RCM07_NA_SW_V2',
      'RCM08_NA_SW_V1': 'RCM08_NA_SW_V1',
      'rcm08-na-sw-v1': 'RCM08_NA_SW_V1',
      'RCM08_NA_SW_V2': 'RCM08_NA_SW_V2',
      'rcm08-na-sw-v2': 'RCM08_NA_SW_V2',
    };
    
    const folderName = documentMap[documentId];
    if (!folderName) {
      return null;
    }
    
    try {
      const dataPath = path.join(process.cwd(), 'webapp_pages', folderName, 'data', 'document.json');
      const jsonContent = await readFile(dataPath, 'utf-8');
      const documentData: DocumentData = JSON.parse(jsonContent);
      
      // Cache the loaded data
      this.documentCache.set(documentId, documentData);
      
      return documentData;
    } catch (error) {
      console.error(`Failed to load document data for ${documentId}:`, error);
      return null;
    }
  }
  
  /**
   * Search for lessons using multiple strategies for maximum accuracy
   */
  static async searchForLesson(
    documentId: string, 
    searchPattern: string, 
    fallbackPattern?: string
  ): Promise<number | null> {
    const documentData = await this.loadDocumentData(documentId);
    if (!documentData) {
      console.error(`Document data not found for: ${documentId}`);
      return null;
    }
    
    const results: SearchResult[] = [];
    
    // Strategy 1: Exact pattern match (highest priority)
    const exactMatches = this.findExactMatches(documentData.pages, searchPattern);
    results.push(...exactMatches);
    
    // Strategy 2: Fallback pattern if no exact matches
    if (results.length === 0 && fallbackPattern) {
      const fallbackMatches = this.findExactMatches(documentData.pages, fallbackPattern);
      results.push(...fallbackMatches);
    }
    
    // Strategy 3: Partial word matching for lesson content
    if (results.length === 0) {
      const partialMatches = this.findPartialMatches(documentData.pages, searchPattern);
      results.push(...partialMatches);
    }
    
    // Strategy 4: Keyword-based matching
    if (results.length === 0 && fallbackPattern) {
      const keywordMatches = this.findKeywordMatches(documentData.pages, fallbackPattern);
      results.push(...keywordMatches);
    }
    
    // Return the best match (highest score)
    if (results.length > 0) {
      const bestMatch = results.sort((a, b) => b.score - a.score)[0];
      console.log(`✅ Found lesson at page ${bestMatch.page_number} (${bestMatch.match_type} match, score: ${bestMatch.score})`);
      console.log(`   Preview: ${bestMatch.text_preview.substring(0, 100)}...`);
      return bestMatch.page_number;
    }
    
    console.warn(`❌ No matches found for: "${searchPattern}" (fallback: "${fallbackPattern}")`);
    return null;
  }
  
  /**
   * Find exact string matches in text content
   */
  private static findExactMatches(pages: DocumentPage[], searchPattern: string): SearchResult[] {
    return pages
      .filter(page => 
        page.has_significant_content && 
        page.text_preview.toLowerCase().includes(searchPattern.toLowerCase())
      )
      .map(page => ({
        page_number: page.page_number,
        score: this.calculateExactMatchScore(page, searchPattern),
        text_preview: page.text_preview,
        match_type: 'exact' as const
      }));
  }
  
  /**
   * Find partial word matches for more flexible searching
   */
  private static findPartialMatches(pages: DocumentPage[], searchPattern: string): SearchResult[] {
    const searchWords = searchPattern.toLowerCase().split(/\s+/);
    
    return pages
      .filter(page => page.has_significant_content)
      .map(page => {
        const pageText = page.text_preview.toLowerCase();
        const matchingWords = searchWords.filter(word => pageText.includes(word));
        
        if (matchingWords.length > 0) {
          return {
            page_number: page.page_number,
            score: (matchingWords.length / searchWords.length) * 80, // Lower than exact matches
            text_preview: page.text_preview,
            match_type: 'partial' as const
          };
        }
        return null;
      })
      .filter(Boolean) as SearchResult[];
  }
  
  /**
   * Find keyword-based matches
   */
  private static findKeywordMatches(pages: DocumentPage[], pattern: string): SearchResult[] {
    const searchKeywords = pattern.toLowerCase().split(/\s+/);
    
    return pages
      .filter(page => 
        page.has_significant_content && 
        page.keywords.some(keyword => 
          searchKeywords.some(search => keyword.toLowerCase().includes(search))
        )
      )
      .map(page => ({
        page_number: page.page_number,
        score: 60, // Lower priority than text matches
        text_preview: page.text_preview,
        match_type: 'keyword' as const
      }));
  }
  
  /**
   * Calculate exact match score based on match quality and page characteristics
   */
  private static calculateExactMatchScore(page: DocumentPage, searchPattern: string): number {
    let score = 100; // Base score for exact match
    
    // Boost score for lesson-starting pages (likely to contain lesson titles)
    if (page.text_preview.toLowerCase().includes('lesson')) {
      score += 20;
    }
    
    // Boost score for pages with substantial content
    if (page.word_count > 50) {
      score += 10;
    }
    
    // Boost score if the search pattern appears multiple times
    const occurrences = (page.text_preview.toLowerCase().match(new RegExp(searchPattern.toLowerCase(), 'g')) || []).length;
    if (occurrences > 1) {
      score += occurrences * 5;
    }
    
    return score;
  }
  
  /**
   * Get document metadata
   */
  static async getDocumentInfo(documentId: string): Promise<Partial<DocumentData> | null> {
    const documentData = await this.loadDocumentData(documentId);
    if (!documentData) {
      return null;
    }
    
    return {
      id: documentData.id,
      title: documentData.title,
      filename: documentData.filename,
      total_pages: documentData.total_pages
    };
  }
}
