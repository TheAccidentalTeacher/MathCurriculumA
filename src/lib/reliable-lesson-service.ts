import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

// Use the main curriculum database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./curriculum.db'
    }
  }
});

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

/**
 * Reliable Lesson Service using database boundaries + image assets
 * This replaces the unreliable text-parsing approach
 */
export class ReliableLessonService {
  private static documentCache = new Map<string, any>();

  /**
   * Get lesson data using database boundaries for reliability
   */
  static async getLessonData(documentId: string, lessonNumber: number): Promise<LessonData> {
    try {
      // Get lesson from database with proper boundaries
      const dbLesson = await this.getLessonFromDB(documentId, lessonNumber);
      
      // Get document pages data for images
      const documentData = this.getDocumentData(documentId);
      
      // Get all pages within the lesson boundaries
      const lessonPages = this.getPagesByRange(
        documentData.pages, 
        dbLesson.page_start || 1, 
        dbLesson.page_end || 1
      );

      // Parse sessions from the page content within boundaries
      const sessions = this.parseSessionsWithinBoundaries(lessonPages, lessonNumber);
      
      return {
        lessonNumber,
        lessonTitle: dbLesson.title,
        documentId,
        volumeName: this.getVolumeName(documentId),
        startPage: dbLesson.page_start || 1,
        endPage: dbLesson.page_end || 1,
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
      
    } catch (error) {
      console.error(`Failed to get lesson data for ${documentId} lesson ${lessonNumber}:`, error);
      throw new Error(`Lesson ${lessonNumber} not found`);
    }
  }

  /**
   * Get lesson from database with proper page boundaries
   */
  private static async getLessonFromDB(documentId: string, lessonNumber: number) {
    // Find the document first
    const document = await prisma.document.findFirst({
      where: { filename: documentId }
    });

    if (!document) {
      throw new Error(`Document ${documentId} not found in database`);
    }

    // Find the lesson with its page boundaries
    const lesson = await prisma.lesson.findFirst({
      where: {
        lesson_number: lessonNumber.toString(),
        unit: {
          document_id: document.id
        }
      },
      include: {
        unit: {
          include: {
            document: true
          }
        }
      }
    });

    if (!lesson) {
      throw new Error(`Lesson ${lessonNumber} not found in database`);
    }

    // If no page boundaries in DB, we'll need to fall back to detection
    if (!lesson.page_start || !lesson.page_end) {
      console.warn(`Lesson ${lessonNumber} missing page boundaries, attempting detection...`);
      return this.detectLessonBoundaries(documentId, lessonNumber, lesson);
    }

    return {
      title: lesson.title,
      page_start: lesson.page_start,
      page_end: lesson.page_end,
      lesson_number: parseInt(lesson.lesson_number)
    };
  }

  /**
   * Fallback: Detect lesson boundaries if not in database
   */
  private static async detectLessonBoundaries(documentId: string, lessonNumber: number, lesson: any) {
    console.log(`🔍 Detecting boundaries for ${documentId} Lesson ${lessonNumber}`);
    
    const documentData = this.getDocumentData(documentId);
    
    // Find lesson start
    let startPage = null;
    let endPage = null;
    
    const lessonPattern = new RegExp(`LESSON\\s+${lessonNumber}(?!\\d)`, 'i');
    const nextLessonPattern = new RegExp(`LESSON\\s+${lessonNumber + 1}(?!\\d)`, 'i');
    
    for (let i = 0; i < documentData.pages.length; i++) {
      const page = documentData.pages[i];
      const textPreview = page.text_preview || '';
      
      // Found lesson start
      if (!startPage && lessonPattern.test(textPreview)) {
        startPage = page.page_number;
        console.log(`   📍 Found lesson start: page ${startPage}`);
      }
      
      // Found next lesson (end of current)
      if (startPage && nextLessonPattern.test(textPreview)) {
        endPage = page.page_number - 1;
        console.log(`   🏁 Found lesson end: page ${endPage}`);
        break;
      }
    }
    
    // If no end found, use reasonable default or document end
    if (startPage && !endPage) {
      endPage = Math.min(startPage + 25, documentData.pages[documentData.pages.length - 1].page_number);
      console.log(`   ⚠️ No clear end found, using page ${endPage}`);
    }
    
    if (!startPage) {
      throw new Error(`Could not detect start page for lesson ${lessonNumber}`);
    }

    return {
      title: lesson.title,
      page_start: startPage,
      page_end: endPage,
      lesson_number: lessonNumber
    };
  }

  /**
   * Get pages within a specific range
   */
  private static getPagesByRange(pages: any[], startPage: number, endPage: number): any[] {
    return pages.filter(page => 
      page.page_number >= startPage && page.page_number <= endPage
    ).sort((a, b) => a.page_number - b.page_number);
  }

  /**
   * Parse sessions within known lesson boundaries
   */
  private static parseSessionsWithinBoundaries(lessonPages: any[], lessonNumber: number): LessonSession[] {
    const sessions: LessonSession[] = [];
    let currentSession: LessonSession | null = null;
    let introPages: any[] = [];

    console.log(`📚 Parsing sessions for ${lessonPages.length} pages (${lessonPages[0]?.page_number}-${lessonPages[lessonPages.length-1]?.page_number})`);

    for (const page of lessonPages) {
      const textPreview = page.text_preview || '';
      
      // Look for explicit session markers
      const sessionMatch = textPreview.match(/LESSON\s+\d+\s*\|\s*SESSION\s+(\d+)/i);
      
      if (sessionMatch) {
        const sessionNum = parseInt(sessionMatch[1]);
        
        console.log(`   🎯 Found SESSION ${sessionNum} on page ${page.page_number}`);
        
        // Handle intro pages before first session
        if (sessionNum === 1 && introPages.length > 0) {
          const introSession = this.createIntroSession(introPages);
          sessions.push(introSession);
          console.log(`   📝 Created intro session: ${introPages.length} pages`);
          introPages = [];
        }
        
        // Close previous session
        if (currentSession) {
          currentSession.endPage = page.page_number - 1;
          currentSession.totalPages = currentSession.pages.length;
          console.log(`   ✅ Closed ${currentSession.sessionName}: ${currentSession.totalPages} pages`);
        }

        // Start new session
        currentSession = {
          sessionNumber: sessionNum,
          sessionName: this.getSessionName(sessionNum),
          sessionType: this.getSessionType(sessionNum),
          startPage: page.page_number,
          endPage: page.page_number,
          pages: [],
          totalPages: 0
        };
        sessions.push(currentSession);
      }

      // Add page to appropriate collection
      if (currentSession) {
        currentSession.pages.push(this.createLessonPage(page));
        currentSession.endPage = page.page_number;
      } else {
        introPages.push(page);
      }
    }

    // Finalize last session
    if (currentSession) {
      currentSession.totalPages = currentSession.pages.length;
      console.log(`   ✅ Finalized ${currentSession.sessionName}: ${currentSession.totalPages} pages`);
    }

    // Handle case where no sessions found - create introduction
    if (sessions.length === 0 && lessonPages.length > 0) {
      console.log(`   ⚠️ No sessions found, creating single introduction session`);
      const introSession = this.createIntroSession(lessonPages);
      sessions.push(introSession);
    }

    // Handle remaining intro pages if we have sessions but intro content
    if (introPages.length > 0 && sessions.length > 0) {
      const introSession = this.createIntroSession(introPages);
      sessions.unshift(introSession); // Add at beginning
      console.log(`   📝 Added intro session at beginning: ${introPages.length} pages`);
    }

    console.log(`📊 Final result: ${sessions.length} sessions, ${lessonPages.length} total pages`);
    sessions.forEach(s => console.log(`   ${s.sessionNumber}: ${s.sessionName} (${s.totalPages} pages, ${s.startPage}-${s.endPage})`));

    return sessions;
  }

  private static createIntroSession(pages: any[]): LessonSession {
    return {
      sessionNumber: 0,
      sessionName: 'Introduction',
      sessionType: 'introduction',
      startPage: pages[0].page_number,
      endPage: pages[pages.length - 1].page_number,
      pages: pages.map(p => this.createLessonPage(p)),
      totalPages: pages.length
    };
  }

  private static createLessonPage(page: any): LessonPage {
    return {
      pageNumber: page.page_number,
      filename: page.filename,
      imagePath: page.image_path,
      textPreview: page.text_preview || '',
      wordCount: page.word_count || 0,
      hasSignificantContent: page.has_significant_content || false
    };
  }

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

  private static getVolumeName(documentId: string): string {
    const volumeMap: Record<string, string> = {
      'RCM07_NA_SW_V1': 'Grade 7 - Volume 1',
      'RCM07_NA_SW_V2': 'Grade 7 - Volume 2', 
      'RCM08_NA_SW_V1': 'Grade 8 - Volume 1',
      'RCM08_NA_SW_V2': 'Grade 8 - Volume 2'
    };
    return volumeMap[documentId] || 'Unknown Volume';
  }

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
}
