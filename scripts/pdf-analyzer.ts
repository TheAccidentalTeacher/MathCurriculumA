import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { PrismaClient } from '@prisma/client';

// Enhanced PDF content analyzer for Ready Classroom Mathematics
// Focuses on text extraction and content structure without external OCR dependencies

interface PDFSection {
  title: string;
  content: string;
  page: number;
  type: 'unit' | 'lesson' | 'session' | 'activity' | 'problem';
  level: number;
}

interface VisualReference {
  description: string;
  page: number;
  context: string;
  type: string;
}

class PDFContentAnalyzer {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async analyzePDF(filePath: string): Promise<{
    sections: PDFSection[];
    visualReferences: VisualReference[];
    metadata: any;
  }> {
    console.log(`Analyzing PDF: ${filePath}`);
    
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    
    const sections = this.extractSections(pdfData.text);
    const visualReferences = this.findVisualReferences(pdfData.text);
    
    return {
      sections,
      visualReferences,
      metadata: {
        title: this.extractTitle(pdfData.text),
        totalPages: pdfData.numpages,
        grade: this.extractGrade(filePath),
        subject: this.extractSubject(filePath)
      }
    };
  }

  private extractSections(text: string): PDFSection[] {
    const sections: PDFSection[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentPage = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track page numbers (common pattern in PDFs)
      if (this.isPageBreak(line)) {
        currentPage++;
        continue;
      }
      
      // Identify section headers
      const sectionInfo = this.identifySection(line, lines, i);
      if (sectionInfo) {
        const content = this.extractSectionContent(lines, i + 1, 50); // Next 50 lines or until next section
        
        sections.push({
          title: sectionInfo.title,
          content,
          page: currentPage,
          type: sectionInfo.type,
          level: sectionInfo.level
        });
      }
    }
    
    return sections;
  }

  private identifySection(line: string, allLines: string[], index: number): { title: string; type: PDFSection['type']; level: number } | null {
    // Unit headers (typically all caps, short)
    if (line.match(/^UNIT\s+\d+/i)) {
      return { title: line, type: 'unit', level: 1 };
    }
    
    // Lesson headers
    if (line.match(/^LESSON\s+\d+/i) || line.match(/^\d+\.\d+\s+/)) {
      return { title: line, type: 'lesson', level: 2 };
    }
    
    // Session headers (often include "Session" or are numbered within lessons)
    if (line.match(/SESSION\s+\d+/i) || line.match(/^Session\s/i)) {
      return { title: line, type: 'session', level: 3 };
    }
    
    // Activity headers
    if (line.match(/^Activity\s/i) || line.match(/^TRY\s+IT/i)) {
      return { title: line, type: 'activity', level: 4 };
    }
    
    // Problem headers (numbered problems)
    if (line.match(/^\d+\.\s/) && line.length < 100) {
      return { title: line, type: 'problem', level: 5 };
    }
    
    return null;
  }

  private extractSectionContent(lines: string[], startIndex: number, maxLines: number): string {
    const content: string[] = [];
    
    for (let i = startIndex; i < Math.min(startIndex + maxLines, lines.length); i++) {
      const line = lines[i];
      
      // Stop if we hit another section header
      if (this.identifySection(line, lines, i)) {
        break;
      }
      
      // Skip page breaks and very short lines
      if (this.isPageBreak(line) || line.length < 3) {
        continue;
      }
      
      content.push(line);
    }
    
    return content.join(' ').trim();
  }

  private findVisualReferences(text: string): VisualReference[] {
    const references: VisualReference[] = [];
    const lines = text.split('\n');
    
    let currentPage = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (this.isPageBreak(line)) {
        currentPage++;
        continue;
      }
      
      // Look for visual element references
      const visualRef = this.identifyVisualReference(line, lines, i);
      if (visualRef) {
        references.push({
          ...visualRef,
          page: currentPage
        });
      }
    }
    
    return references;
  }

  private identifyVisualReference(line: string, allLines: string[], index: number): Omit<VisualReference, 'page'> | null {
    const lineLower = line.toLowerCase();
    
    // Common visual reference patterns in math textbooks
    const patterns = [
      { pattern: /figure\s+\d+/i, type: 'figure' },
      { pattern: /diagram/i, type: 'diagram' },
      { pattern: /chart/i, type: 'chart' },
      { pattern: /graph/i, type: 'graph' },
      { pattern: /table\s+\d+/i, type: 'table' },
      { pattern: /shown\s+(below|above)/i, type: 'illustration' },
      { pattern: /(rectangle|triangle|circle|square)/i, type: 'geometric_shape' },
      { pattern: /number\s+line/i, type: 'number_line' },
      { pattern: /coordinate\s+(plane|grid)/i, type: 'coordinate_system' }
    ];
    
    for (const { pattern, type } of patterns) {
      if (pattern.test(line)) {
        // Get surrounding context
        const contextStart = Math.max(0, index - 2);
        const contextEnd = Math.min(allLines.length, index + 3);
        const context = allLines.slice(contextStart, contextEnd).join(' ');
        
        return {
          description: line,
          context,
          type
        };
      }
    }
    
    return null;
  }

  private isPageBreak(line: string): boolean {
    // Common page break patterns
    return /^\d+$/.test(line) || // Just a number
           line.includes('---') ||  // Separator line
           line.length === 0;       // Empty line
  }

  private extractTitle(text: string): string {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Usually the first substantial line is the title
    for (const line of lines.slice(0, 10)) {
      if (line.length > 10 && line.length < 100) {
        return line;
      }
    }
    
    return 'Unknown Document';
  }

  private extractGrade(filename: string): string {
    // Extract grade from filename patterns like "RCM07" or "RCM08"
    const gradeMatch = filename.match(/RCM0?(\d+)/i);
    if (gradeMatch) {
      return `Grade ${gradeMatch[1]}`;
    }
    
    return 'Unknown Grade';
  }

  private extractSubject(filename: string): string {
    // Ready Classroom Mathematics is always math
    return 'Mathematics';
  }

  async processAndStore(filePath: string, documentId?: string): Promise<string> {
    const analysis = await this.analyzePDF(filePath);
    const filename = path.basename(filePath);
    
    // Create or update document record
    const document = await this.prisma.document.upsert({
      where: { id: documentId || filename },
      update: {
        title: analysis.metadata.title,
        grade_level: analysis.metadata.grade,
        subject: analysis.metadata.subject,
        page_count: analysis.metadata.totalPages
      },
      create: {
        id: documentId || filename,
        title: analysis.metadata.title,
        filename,
        grade_level: analysis.metadata.grade,
        subject: analysis.metadata.subject,
        page_count: analysis.metadata.totalPages,
        content: analysis.sections.map(s => s.content).join('\n\n')
      }
    });

    // Store sections hierarchically
    await this.storeSections(document.id, analysis.sections);
    
    // Store visual references
    await this.storeVisualReferences(document.id, analysis.visualReferences);
    
    console.log(`Processed ${filename}: ${analysis.sections.length} sections, ${analysis.visualReferences.length} visual references`);
    
    return document.id;
  }

  private async storeSections(documentId: string, sections: PDFSection[]) {
    // Group sections by hierarchy
    const units = sections.filter(s => s.type === 'unit');
    const lessons = sections.filter(s => s.type === 'lesson');
    const sessions = sections.filter(s => s.type === 'session');
    const activities = sections.filter(s => s.type === 'activity');
    const problems = sections.filter(s => s.type === 'problem');

    // Store units first
    for (const unit of units) {
      await this.prisma.unit.create({
        data: {
          document_id: documentId,
          unit_number: this.extractUnitNumber(unit.title),
          title: unit.title,
          page_start: unit.page,
          order_index: units.indexOf(unit)
        }
      });
    }

    // Store lessons - simplified version
    for (const lesson of lessons) {
      await this.prisma.lesson.create({
        data: {
          unit_id: documentId, // Simplified - would need proper parent relationship
          lesson_number: this.extractLessonNumber(lesson.title),
          title: lesson.title,
          page_start: lesson.page,
          order_index: lessons.indexOf(lesson)
        }
      });
    }

    // Store sessions, activities, problems would follow similar pattern
    console.log(`Stored ${units.length} units, ${lessons.length} lessons`);
  }

  private async storeVisualReferences(documentId: string, references: VisualReference[]) {
    for (const ref of references) {
      await this.prisma.visualElement.create({
        data: {
          documentId,
          sessionId: null, // Would need to determine parent session
          elementType: ref.type,
          description: ref.description,
          altText: ref.description,
          pageNumber: ref.page
        }
      });
    }
  }

  private generateContentHash(sections: PDFSection[]): string {
    const content = sections.map(s => s.content).join('');
    // Simple hash - in production, use a proper hashing library
    return Buffer.from(content).toString('base64').slice(0, 32);
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

// Export for use in other scripts
export { PDFContentAnalyzer, PDFSection, VisualReference };

// CLI usage
if (require.main === module) {
  const analyzer = new PDFContentAnalyzer();
  
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx tsx pdf-analyzer.ts <path-to-pdf>');
    process.exit(1);
  }
  
  analyzer.processAndStore(pdfPath)
    .then((documentId) => {
      console.log(`Successfully processed PDF. Document ID: ${documentId}`);
    })
    .catch((error) => {
      console.error('Error processing PDF:', error);
    })
    .finally(() => {
      analyzer.cleanup();
    });
}
