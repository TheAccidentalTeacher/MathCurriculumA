/**
 * Curriculum Database Integration
 * 
 * This service integrates with the existing curriculum database structure:
 * - curriculum.db: Main document index
 * - webapp_pages/[document]/data/document.db: Individual lesson databases
 * 
 * Provides a unified interface for the pacing generator to access curriculum data.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export interface CurriculumDocument {
  id: string;
  filename: string;
  title: string;
  grade: number;
  subject?: string;
  publisher?: string;
  version?: string;
  totalPages: number;
  lessonsPath?: string;
}

export interface LessonData {
  lessonNumber: number;
  title: string;
  pageNumber: number;
  content: string;
  keywords: string[];
  pageType: string;
}

export interface UnitStructure {
  unitTitle: string;
  lessons: LessonData[];
  totalPages: number;
}

export class CurriculumDatabaseIntegration {
  private mainDbPath: string;
  private webappPagesPath: string;

  constructor() {
    this.mainDbPath = path.join(process.cwd(), 'curriculum.db');
    this.webappPagesPath = path.join(process.cwd(), 'webapp_pages');
  }

  /**
   * Get all available curriculum documents
   */
  async getDocuments(): Promise<CurriculumDocument[]> {
    const db = new Database(this.mainDbPath, { readonly: true });
    
    try {
      const rows = db.prepare(`
        SELECT 
          id,
          filename,
          title,
          grade,
          subject,
          publisher,
          version,
          total_pages as totalPages
        FROM documents 
        ORDER BY grade, filename
      `).all() as any[];

      return rows.map(row => ({
        ...row,
        id: row.id.toString(),
        lessonsPath: this.getLessonsPath(row.filename)
      }));
    } finally {
      db.close();
    }
  }

  /**
   * Get documents for a specific grade
   */
  async getDocumentsForGrade(grade: string): Promise<CurriculumDocument[]> {
    const gradeNumber = parseInt(grade);
    if (isNaN(gradeNumber)) return [];

    const documents = await this.getDocuments();
    return documents.filter(doc => doc.grade === gradeNumber);
  }

  /**
   * Get lesson structure for a document
   */
  async getDocumentLessons(documentId: string): Promise<UnitStructure[]> {
    const documents = await this.getDocuments();
    const document = documents.find(doc => doc.id === documentId);
    
    if (!document || !document.lessonsPath) {
      console.log(`No lessons path found for document ${documentId}`);
      return [];
    }

    const lessonDbPath = path.join(document.lessonsPath, 'data', 'document.db');
    
    if (!fs.existsSync(lessonDbPath)) {
      console.log(`Lesson database not found: ${lessonDbPath}`);
      return [];
    }

    // Check if database file is empty
    const stats = fs.statSync(lessonDbPath);
    if (stats.size === 0) {
      console.log(`Database file is empty: ${lessonDbPath}`);
      
      // Try to fall back to JSON file
      const jsonPath = path.join(document.lessonsPath!, 'data', 'document.json');
      if (fs.existsSync(jsonPath)) {
        console.log(`Falling back to JSON file: ${jsonPath}`);
        return this.getDocumentLessonsFromJson(jsonPath, document);
      }
      
      return [];
    }

    const db = new Database(lessonDbPath, { readonly: true });
    
    try {
      // Get all pages with content
      const pages = db.prepare(`
        SELECT 
          page_number as pageNumber,
          filename,
          page_type as pageType,
          text_preview as content,
          keywords
        FROM pages 
        WHERE has_content = 1 
        ORDER BY page_number
      `).all() as any[];

      // Extract actual lessons by finding lesson start pages
      const lessons = this.extractActualLessons(pages);

      // Group lessons into units (for now, create one unit per document)
      return [{
        unitTitle: `${document.title} Content`,
        lessons,
        totalPages: pages.length
      }];

    } finally {
      db.close();
    }
  }

  /**
   * Extract actual lessons from pages by detecting lesson boundaries
   */
  private extractActualLessons(pages: any[]): LessonData[] {
    const lessons: LessonData[] = [];
    const lessonPattern = /LESSON\s+(\d+)[:\s]+([^.\n]+)/i;
    const unitPattern = /UNIT\s+(\d+)[:\s]+([^.\n]+)/i;

    let currentLesson: Partial<LessonData> | null = null;
    let lessonContent: string[] = [];

    for (const page of pages) {
      const content = page.content || '';
      
      // Check for new lesson start
      const lessonMatch = content.match(lessonPattern);
      if (lessonMatch) {
        // Save previous lesson if exists
        if (currentLesson) {
          lessons.push({
            lessonNumber: currentLesson.lessonNumber!,
            title: currentLesson.title!,
            pageNumber: currentLesson.pageNumber!,
            content: lessonContent.join('\n\n'),
            keywords: currentLesson.keywords || [],
            pageType: currentLesson.pageType || 'lesson'
          });
        }

        // Start new lesson
        currentLesson = {
          lessonNumber: parseInt(lessonMatch[1]),
          title: `Lesson ${lessonMatch[1]}: ${lessonMatch[2].trim()}`,
          pageNumber: page.pageNumber,
          keywords: page.keywords ? page.keywords.split(',').map((k: string) => k.trim()) : [],
          pageType: 'lesson'
        };
        lessonContent = [content];
      } else if (currentLesson) {
        // Add content to current lesson
        lessonContent.push(content);
        
        // Update keywords
        if (page.keywords) {
          const pageKeywords = page.keywords.split(',').map((k: string) => k.trim());
          currentLesson.keywords = [...(currentLesson.keywords || []), ...pageKeywords];
        }
      }

      // Check for unit markers (but don't count as lessons)
      const unitMatch = content.match(unitPattern);
      if (unitMatch) {
        // Could use this for better unit organization in the future
        console.log(`Found unit: ${unitMatch[1]} - ${unitMatch[2]}`);
      }
    }

    // Don't forget the last lesson
    if (currentLesson) {
      lessons.push({
        lessonNumber: currentLesson.lessonNumber!,
        title: currentLesson.title!,
        pageNumber: currentLesson.pageNumber!,
        content: lessonContent.join('\n\n'),
        keywords: [...new Set(currentLesson.keywords || [])], // Remove duplicates
        pageType: currentLesson.pageType || 'lesson'
      });
    }

    console.log(`Extracted ${lessons.length} actual lessons from ${pages.length} pages`);
    return lessons.sort((a, b) => a.lessonNumber - b.lessonNumber);
  }

  /**
   * Get comprehensive curriculum data for a grade (for AI context)
   */
  async getCurriculumDataForGrade(grade: string): Promise<{
    documents: CurriculumDocument[];
    totalLessons: number;
    units: UnitStructure[];
    availableTopics: string[];
  }> {
    const documents = await this.getDocumentsForGrade(grade);
    let totalLessons = 0;
    let units: UnitStructure[] = [];
    let availableTopics: string[] = [];

    for (const document of documents) {
      const documentUnits = await this.getDocumentLessons(document.id);
      units.push(...documentUnits);
      
      for (const unit of documentUnits) {
        totalLessons += unit.lessons.length;
        
        // Extract topics from lesson titles and keywords
        unit.lessons.forEach(lesson => {
          availableTopics.push(lesson.title);
          availableTopics.push(...lesson.keywords);
        });
      }
    }

    // Remove duplicates and filter out empty topics
    availableTopics = [...new Set(availableTopics)].filter(topic => topic && topic.trim().length > 0);

    return {
      documents,
      totalLessons,
      units,
      availableTopics
    };
  }

  /**
   * Helper: Get the webapp_pages path for a document
   */
  private getLessonsPath(filename: string): string | undefined {
    // Convert RCM07_NA_SW_V1.pdf -> RCM07_NA_SW_V1
    const baseName = filename.replace('.pdf', '');
    const lessonsPath = path.join(this.webappPagesPath, baseName);
    
    if (fs.existsSync(lessonsPath)) {
      return lessonsPath;
    }
    
    return undefined;
  }

  /**
   * Helper: Extract lesson title from content
   */
  private extractLessonTitle(content: string): string | null {
    if (!content) return null;
    
    // Look for common lesson title patterns
    const patterns = [
      /Lesson\s+\d+[:\-\s]+([^.\n]+)/i,
      /Unit\s+\d+[:\-\s]+([^.\n]+)/i,
      /Chapter\s+\d+[:\-\s]+([^.\n]+)/i,
      /^([^.\n]{10,50})/  // First line if reasonable length
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return null;
  }
}
