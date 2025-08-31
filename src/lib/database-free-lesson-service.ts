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

/**
 * Database-free Lesson Service using document.json files for definitive lesson boundaries
 * This completely bypasses the broken text-parsing approach
 */
export class DatabaseFreeLessonService {
  private static documentCache = new Map<string, any>();
  private static lessonBoundaries: Record<string, Record<number, { start: number; end: number; title: string }>> = {
    'RCM07_NA_SW_V1': {
      1: { start: 127, end: 150, title: 'Solve Problems Involving Scale' },
      2: { start: 151, end: 172, title: 'Scale Drawings' },
      3: { start: 173, end: 194, title: 'Scale Factor and Scale Drawings' },
      4: { start: 195, end: 216, title: 'Solve Problems with Proportional Relationships' },
      5: { start: 217, end: 238, title: 'Understand and Use Rates' },
      6: { start: 239, end: 260, title: 'Understand and Calculate Unit Price' },
      7: { start: 261, end: 284, title: 'Circumference and Area of a Circle' },
      8: { start: 285, end: 308, title: 'Finding the Area of Composite Shapes' },
      9: { start: 309, end: 330, title: 'Understand Angle Relationships' },
      10: { start: 331, end: 352, title: 'Solve for Unknown Angle Measures' },
      11: { start: 353, end: 376, title: 'Draw Shapes with Given Conditions' },
      12: { start: 377, end: 398, title: 'Two-Dimensional Shapes and Three-Dimensional Solids' },
      13: { start: 399, end: 420, title: 'Surface Area of Solids' },
      14: { start: 421, end: 442, title: 'Volume of Solids' },
      15: { start: 443, end: 466, title: 'Solve Problems Involving Volume' },
      16: { start: 467, end: 488, title: 'Probability Models' },
      17: { start: 489, end: 504, title: 'Develop Probability Models' },
      18: { start: 371, end: 392, title: 'Write and Solve Multi-Step Equations' },  // Actual boundaries from search
      19: { start: 450, end: 470, title: 'Sample Spaces for Compound Events' },
      20: { start: 480, end: 504, title: 'Understand Sampling' }
    }
  };

  /**
   * Get lesson data using pre-defined boundaries and document assets
   */
  static async getLessonData(documentId: string, lessonNumber: number): Promise<LessonData> {
    try {
      console.log(`🔍 Getting lesson ${lessonNumber} from ${documentId} using pre-defined boundaries`);
      
      // Get lesson boundaries
      const boundaries = this.lessonBoundaries[documentId]?.[lessonNumber];
      if (!boundaries) {
        throw new Error(`No boundaries defined for ${documentId} lesson ${lessonNumber}`);
      }

      // Get document data for images
      const documentData = this.getDocumentData(documentId);
      
      // Get all pages within the lesson boundaries
      const lessonPages = this.getPagesByRange(
        documentData.pages,
        boundaries.start,
        boundaries.end
      );

      console.log(`📄 Found ${lessonPages.length} pages for lesson ${lessonNumber} (${boundaries.start}-${boundaries.end})`);

      // Parse sessions from the page content within boundaries
      const sessions = this.parseSessionsWithinBoundaries(lessonPages, lessonNumber);
      
      return {
        lessonNumber,
        lessonTitle: boundaries.title,
        documentId,
        volumeName: this.getVolumeName(documentId),
        startPage: boundaries.start,
        endPage: boundaries.end,
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
