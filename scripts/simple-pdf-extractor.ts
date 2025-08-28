import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { PrismaClient } from '@prisma/client';

// Simple PDF extractor for Ready Classroom Mathematics
// Focuses on basic text extraction and document storage

export interface ExtractedSection {
  title: string;
  content: string;
  page: number;
  type: 'unit' | 'lesson' | 'session' | 'activity' | 'problem';
}

export class SimplePDFExtractor {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async extractPDF(filePath: string): Promise<{
    title: string;
    content: string;
    totalPages: number;
    grade: string;
    sections: ExtractedSection[];
  }> {
    console.log(`Extracting PDF: ${filePath}`);
    
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    
    const title = this.extractTitle(pdfData.text);
    const grade = this.extractGrade(path.basename(filePath));
    const sections = this.extractBasicSections(pdfData.text);
    
    return {
      title,
      content: pdfData.text,
      totalPages: pdfData.numpages,
      grade,
      sections
    };
  }

  private extractTitle(text: string): string {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Look for "Ready Classroom Mathematics" or similar
    for (const line of lines.slice(0, 20)) {
      if (line.includes('Ready') || line.includes('Mathematics') || line.includes('Student')) {
        return line;
      }
    }
    
    // Fall back to first substantial line
    for (const line of lines.slice(0, 10)) {
      if (line.length > 10 && line.length < 100) {
        return line;
      }
    }
    
    return 'Mathematics Document';
  }

  private extractGrade(filename: string): string {
    const gradeMatch = filename.match(/RCM0?(\d+)/i);
    if (gradeMatch) {
      return `Grade ${gradeMatch[1]}`;
    }
    return 'Unknown Grade';
  }

  private extractBasicSections(text: string): ExtractedSection[] {
    const sections: ExtractedSection[] = [];
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    let currentPage = 1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Simple page tracking
      if (/^\d+$/.test(line) && parseInt(line) > currentPage) {
        currentPage = parseInt(line);
        continue;
      }
      
      // Look for section headers
      const sectionType = this.identifySimpleSection(line);
      if (sectionType) {
        const content = this.extractNextContent(lines, i + 1);
        
        sections.push({
          title: line,
          content: content,
          page: currentPage,
          type: sectionType
        });
      }
    }
    
    return sections;
  }

  private identifySimpleSection(line: string): ExtractedSection['type'] | null {
    const lineLower = line.toLowerCase();
    
    if (lineLower.includes('unit') && /\d+/.test(line)) {
      return 'unit';
    }
    
    if (lineLower.includes('lesson') || /^\d+\.\d+/.test(line)) {
      return 'lesson';
    }
    
    if (lineLower.includes('session')) {
      return 'session';
    }
    
    if (lineLower.includes('activity') || lineLower.includes('try it')) {
      return 'activity';
    }
    
    if (/^\d+\.\s/.test(line) && line.length < 100) {
      return 'problem';
    }
    
    return null;
  }

  private extractNextContent(lines: string[], startIndex: number): string {
    const content: string[] = [];
    
    for (let i = startIndex; i < Math.min(startIndex + 20, lines.length); i++) {
      const line = lines[i];
      
      // Stop at next section
      if (this.identifySimpleSection(line)) {
        break;
      }
      
      // Skip very short lines and page numbers
      if (line.length < 5 || /^\d+$/.test(line)) {
        continue;
      }
      
      content.push(line);
    }
    
    return content.join(' ').trim();
  }

  async storeDocument(filePath: string): Promise<string> {
    const extraction = await this.extractPDF(filePath);
    const filename = path.basename(filePath);
    
    // Store document
    const document = await this.prisma.document.upsert({
      where: { filename },
      update: {
        title: extraction.title,
        grade_level: extraction.grade,
        subject: 'Mathematics',
        content: extraction.content
      },
      create: {
        filename,
        title: extraction.title,
        grade_level: extraction.grade,
        subject: 'Mathematics',
        content: extraction.content
      }
    });

    console.log(`Stored document: ${document.title}`);
    console.log(`- Filename: ${filename}`);
    console.log(`- Grade: ${extraction.grade}`);
    console.log(`- Pages: ${extraction.totalPages}`);
    console.log(`- Sections found: ${extraction.sections.length}`);
    
    return document.id;
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

// CLI usage
if (require.main === module) {
  const extractor = new SimplePDFExtractor();
  
  const pdfPath = process.argv[2];
  if (!pdfPath) {
    console.error('Usage: npx tsx simple-pdf-extractor.ts <path-to-pdf>');
    process.exit(1);
  }
  
  if (!fs.existsSync(pdfPath)) {
    console.error(`File not found: ${pdfPath}`);
    process.exit(1);
  }
  
  extractor.storeDocument(pdfPath)
    .then((documentId) => {
      console.log(`\n✅ Successfully processed PDF. Document ID: ${documentId}`);
    })
    .catch((error) => {
      console.error('❌ Error processing PDF:', error);
      process.exit(1);
    })
    .finally(() => {
      extractor.cleanup();
    });
}
