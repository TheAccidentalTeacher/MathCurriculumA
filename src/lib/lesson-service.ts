import { readFileSync } from 'fs';
import { join } from 'path';

export interface LessonPage {
  pageNumber: number;
  filename: string;
  imagePath: string;
  textPreview: string;
  wordCount: number;
  hasSignificantContent: boolean;
}

export interface LessonSession {
  sessionNumber: number;
  sessionName: string;
  sessionType: 'introduction' | 'explore' | 'develop' | 'refine' | 'apply' | 'practice' | 'session';
  startPage: number;
  endPage: number;
  pages: LessonPage[];
  totalPages: number;
}

export interface LessonData {
  lessonNumber: number;
  lessonTitle: string;
  documentId: string;
  volumeName: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  sessions: LessonSession[];
  allPages: LessonPage[];
}

export class LessonService {
  private static documentCache = new Map<string, any>();

  /**
   * Get the extracted document data for a specific document
   */
  private static getDocumentData(documentId: string): any {
    if (this.documentCache.has(documentId)) {
      return this.documentCache.get(documentId);
    }

    try {
      const documentPath = join(process.cwd(), 'webapp_pages', documentId, 'data', 'document.json');
      const documentData = JSON.parse(readFileSync(documentPath, 'utf-8'));
      this.documentCache.set(documentId, documentData);
      return documentData;
    } catch (error) {
      console.error(`Failed to load document data for ${documentId}:`, error);
      throw new Error(`Document ${documentId} not found`);
    }
  }

  /**
   * Extract lesson data from document pages
   */
  static async getLessonData(documentId: string, lessonNumber: number): Promise<LessonData> {
    const documentData = this.getDocumentData(documentId);
    
    // Find all pages that belong to this lesson
    const lessonPages = this.findLessonPages(documentData.pages, lessonNumber);
    
    if (lessonPages.length === 0) {
      throw new Error(`Lesson ${lessonNumber} not found in document ${documentId}`);
    }

    // Extract lesson title from first page
    const lessonTitle = this.extractLessonTitle(lessonPages[0]);
    
    // Parse sessions within the lesson
    const sessions = this.parseLessonSessions(lessonPages, lessonNumber);
    
    // Calculate lesson boundaries
    const startPage = Math.min(...lessonPages.map(p => p.page_number));
    const endPage = Math.max(...lessonPages.map(p => p.page_number));

    return {
      lessonNumber,
      lessonTitle,
      documentId,
      volumeName: this.getVolumeName(documentId),
      startPage,
      endPage,
      totalPages: lessonPages.length,
      sessions,
      allPages: lessonPages.map(page => ({
        pageNumber: page.page_number,
        filename: page.filename,
        imagePath: page.image_path,
        textPreview: page.text_preview || '',
        wordCount: page.word_count || 0,
        hasSignificantContent: page.has_significant_content || false
      }))
    };
  }

  /**
   * Find all pages that contain content for a specific lesson
   */
  private static findLessonPages(pages: any[], lessonNumber: number): any[] {
    const lessonPattern = new RegExp(`LESSON\\s+${lessonNumber}(?!\\d)`, 'i');
    const lessonPages: any[] = [];
    let inLesson = false;
    let nextLessonPattern: RegExp | null = null;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const textPreview = page.text_preview || '';

      // Check if this page starts our target lesson
      if (lessonPattern.test(textPreview)) {
        inLesson = true;
        nextLessonPattern = new RegExp(`LESSON\\s+${lessonNumber + 1}(?!\\d)`, 'i');
        lessonPages.push(page);
        continue;
      }

      // Check if we've hit the next lesson
      if (inLesson && nextLessonPattern && nextLessonPattern.test(textPreview)) {
        break;
      }

      // If we're in the lesson, add pages that have significant content
      if (inLesson) {
        // Add pages that contain session markers or significant lesson content
        if (this.isLessonContentPage(textPreview, lessonNumber)) {
          lessonPages.push(page);
        }
      }
    }

    return lessonPages;
  }

  /**
   * Determine if a page contains lesson content
   */
  private static isLessonContentPage(textPreview: string, lessonNumber: number): boolean {
    // Session markers
    if (/SESSION\s+\d+/i.test(textPreview)) return true;
    
    // Lesson-specific content patterns
    if (new RegExp(`LESSON\\s+${lessonNumber}`, 'i').test(textPreview)) return true;
    
    // Common lesson content indicators
    const lessonIndicators = [
      'Explore', 'Develop', 'Refine', 'Apply', 'Practice',
      'Try It', 'Connect It', 'Look Back',
      'Prepare for', 'Previously, you learned',
      '➤Complete', '➤Use what you learned'
    ];

    return lessonIndicators.some(indicator => 
      textPreview.includes(indicator)
    );
  }

  /**
   * Parse sessions within a lesson
   */
  private static parseLessonSessions(lessonPages: any[], lessonNumber: number): LessonSession[] {
    const sessions: LessonSession[] = [];
    let currentSession: LessonSession | null = null;
    let introPages: any[] = [];

    for (const page of lessonPages) {
      const textPreview = page.text_preview || '';
      
      // Look for session markers
      const sessionMatch = textPreview.match(/LESSON\s+\d+\s*\|\s*SESSION\s+(\d+)/i);
      if (sessionMatch) {
        const sessionNum = parseInt(sessionMatch[1]);
        
        // If we have intro pages before the first session, create an Introduction session
        if (sessionNum === 1 && introPages.length > 0) {
          const introSession: LessonSession = {
            sessionNumber: 0,
            sessionName: 'Introduction',
            sessionType: 'introduction',
            startPage: introPages[0].page_number,
            endPage: introPages[introPages.length - 1].page_number,
            pages: introPages.map(p => ({
              pageNumber: p.page_number,
              filename: p.filename,
              imagePath: p.image_path,
              textPreview: p.text_preview,
              wordCount: p.word_count || 0,
              hasSignificantContent: p.has_significant_content || false
            })),
            totalPages: introPages.length
          };
          sessions.push(introSession);
          introPages = [];
        }
        
        // If we have a current session, close it
        if (currentSession) {
          currentSession.endPage = page.page_number - 1;
          currentSession.totalPages = currentSession.pages.length;
        }

        // Start new session
        currentSession = {
          sessionNumber: sessionNum,
          sessionName: this.getSessionName(sessionNum),
          sessionType: this.getSessionType(sessionNum),
          startPage: page.page_number,
          endPage: page.page_number, // Will be updated as we find more pages
          pages: [],
          totalPages: 0
        };
        sessions.push(currentSession);
      }

      // Add page to current session if we have one, or to intro pages if not
      if (currentSession) {
        currentSession.pages.push({
          pageNumber: page.page_number,
          filename: page.filename,
          imagePath: page.image_path,
          textPreview: page.text_preview || '',
          wordCount: page.word_count || 0,
          hasSignificantContent: page.has_significant_content || false
        });
        currentSession.endPage = page.page_number;
      } else {
        // No session found yet, this might be intro content
        introPages.push(page);
      }
    }

    // Handle any remaining intro pages (if no sessions were found)
    if (introPages.length > 0 && sessions.length === 0) {
      const introSession: LessonSession = {
        sessionNumber: 0,
        sessionName: 'Introduction',
        sessionType: 'introduction',
        startPage: introPages[0].page_number,
        endPage: introPages[introPages.length - 1].page_number,
        pages: introPages.map(p => ({
          pageNumber: p.page_number,
          filename: p.filename,
          imagePath: p.image_path,
          textPreview: p.text_preview,
          wordCount: p.word_count || 0,
          hasSignificantContent: p.has_significant_content || false
        })),
        totalPages: introPages.length
      };
      sessions.push(introSession);
    }

    // Finalize the last session
    if (currentSession) {
      currentSession.totalPages = currentSession.pages.length;
    }

    // If no sessions were found, create a default session
    if (sessions.length === 0 && lessonPages.length > 0) {
      sessions.push({
        sessionNumber: 1,
        sessionName: 'Complete Lesson',
        sessionType: 'session',
        startPage: lessonPages[0].page_number,
        endPage: lessonPages[lessonPages.length - 1].page_number,
        pages: lessonPages.map(page => ({
          pageNumber: page.page_number,
          filename: page.filename,
          imagePath: page.image_path,
          textPreview: page.text_preview || '',
          wordCount: page.word_count || 0,
          hasSignificantContent: page.has_significant_content || false
        })),
        totalPages: lessonPages.length
      });
    }

    return sessions;
  }

  /**
   * Get a human-readable session name
   */
  private static getSessionName(sessionNumber: number): string {
    const sessionNames: Record<number, string> = {
      1: 'Explore',
      2: 'Develop', 
      3: 'Refine',
      4: 'Apply',
      5: 'Practice'
    };
    return sessionNames[sessionNumber] || `Session ${sessionNumber}`;
  }

  /**
   * Get the session type for styling/behavior
   */
  private static getSessionType(sessionNumber: number): LessonSession['sessionType'] {
    const sessionTypes: Record<number, LessonSession['sessionType']> = {
      1: 'explore',
      2: 'develop',
      3: 'refine', 
      4: 'apply',
      5: 'practice'
    };
    return sessionTypes[sessionNumber] || 'session';
  }

  /**
   * Extract lesson title from page content
   */
  private static extractLessonTitle(page: any): string {
    const textPreview = page.text_preview || '';
    
    // Try to extract title from lesson header pattern
    const titleMatch = textPreview.match(/LESSON\s+\d+\s+(.+?)(?:\s+LESSON|\s+➤|\s+What|$)/i);
    if (titleMatch) {
      return titleMatch[1].trim();
    }

    // Fallback patterns
    const fallbackPatterns = [
      /LESSON\s+\d+[:\-\s]+(.+)/i,
      /^(.+?)\s+LESSON/i
    ];

    for (const pattern of fallbackPatterns) {
      const match = textPreview.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }

    return 'Lesson Content';
  }

  /**
   * Get volume name from document ID
   */
  private static getVolumeName(documentId: string): string {
    const volumeNames: Record<string, string> = {
      'RCM07_NA_SW_V1': 'Grade 7 - Volume 1',
      'RCM07_NA_SW_V2': 'Grade 7 - Volume 2', 
      'RCM08_NA_SW_V1': 'Grade 8 - Volume 1',
      'RCM08_NA_SW_V2': 'Grade 8 - Volume 2'
    };
    return volumeNames[documentId] || documentId;
  }

  /**
   * Get all lessons available in a document
   */
  static async getAvailableLessons(documentId: string): Promise<Array<{lessonNumber: number, title: string, startPage: number}>> {
    const documentData = this.getDocumentData(documentId);
    const lessons: Array<{lessonNumber: number, title: string, startPage: number}> = [];
    
    for (const page of documentData.pages) {
      const textPreview = page.text_preview || '';
      const lessonMatch = textPreview.match(/LESSON\s+(\d+)/i);
      
      if (lessonMatch) {
        const lessonNumber = parseInt(lessonMatch[1]);
        
        // Avoid duplicates
        if (!lessons.find(l => l.lessonNumber === lessonNumber)) {
          lessons.push({
            lessonNumber,
            title: this.extractLessonTitle(page),
            startPage: page.page_number
          });
        }
      }
    }
    
    return lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }
}
