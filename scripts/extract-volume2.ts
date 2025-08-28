// Extract RCM07_NA_SW_V2.pdf specifically for production deployment
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Volume2Extractor {
  async extractPDF(filePath: string) {
    console.log(`🔍 Starting Volume 2 extraction: ${path.basename(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const fullText = pdfData.text;
    console.log(`📄 Extracted ${fullText.length.toLocaleString()} characters of text`);
    
    const visualElements = this.identifyVisualElements(fullText);
    console.log(`🖼️ Identified ${visualElements.length} visual elements`);
    
    const sections = this.extractStructuredSections(fullText, visualElements);
    console.log(`📚 Extracted ${sections.length} structured sections`);
    
    const metadata = {
      title: "Mathematics",
      grade: "Grade 7",
      totalPages: pdfData.numpages,
      totalCharacters: fullText.length,
      extractedSections: sections.length,
      extractedVisualElements: visualElements.length
    };

    return {
      fullText,
      sections,
      visualElements,
      metadata
    };
  }

  private identifyVisualElements(text: string) {
    const elements = [];
    const lines = text.split('\n');
    let currentPage = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^\d+$/)) {
        const pageNum = parseInt(line);
        if (pageNum > currentPage) currentPage = pageNum;
        continue;
      }

      // Detect math diagrams, tables, coordinate grids, etc.
      if (this.containsMathVisual(line)) {
        elements.push({
          type: this.classifyVisualElement(line),
          description: line.substring(0, 100),
          page: currentPage,
          context: this.getContext(lines, i)
        });
      }
    }

    return elements;
  }

  private extractStructuredSections(text: string, visualElements: any[]) {
    const sections = [];
    const lines = text.split('\n');
    let currentSection = null;
    let currentPage = 1;
    let sectionContent = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track page numbers
      if (line.match(/^\d+$/)) {
        const pageNum = parseInt(line);
        if (pageNum > currentPage) currentPage = pageNum;
        continue;
      }

      // Detect section headers
      if (this.isSectionHeader(line)) {
        // Save previous section
        if (currentSection && sectionContent.trim()) {
          sections.push({
            ...currentSection,
            content: sectionContent.trim(),
            visualElements: visualElements.filter(ve => ve.page === currentPage)
          });
        }

        // Start new section
        currentSection = {
          title: line,
          type: this.classifySectionType(line),
          page: currentPage
        };
        sectionContent = '';
      } else {
        sectionContent += line + '\n';
      }
    }

    // Don't forget the last section
    if (currentSection && sectionContent.trim()) {
      sections.push({
        ...currentSection,
        content: sectionContent.trim(),
        visualElements: visualElements.filter(ve => ve.page === currentPage)
      });
    }

    return sections;
  }

  private containsMathVisual(line: string): boolean {
    const visualPatterns = [
      /coordinate/i, /grid/i, /graph/i, /chart/i, /table/i,
      /diagram/i, /figure/i, /image/i, /picture/i,
      /number line/i, /axis/i, /plot/i, /equation/i
    ];
    return visualPatterns.some(pattern => pattern.test(line));
  }

  private classifyVisualElement(line: string): string {
    if (line.match(/coordinate|grid/i)) return 'coordinate_grid';
    if (line.match(/graph|chart/i)) return 'chart';
    if (line.match(/table/i)) return 'table';
    if (line.match(/number line/i)) return 'number_line';
    if (line.match(/diagram/i)) return 'diagram';
    return 'image';
  }

  private getContext(lines: string[], index: number): string {
    const start = Math.max(0, index - 2);
    const end = Math.min(lines.length, index + 3);
    return lines.slice(start, end).join(' ');
  }

  private isSectionHeader(line: string): boolean {
    return line.length > 0 && line.length < 100 && (
      line.match(/^(UNIT|LESSON|Session|Activity|Example|Practice)/i) ||
      line.match(/^\d+\.\d+/) ||
      line.match(/^Chapter \d+/i) ||
      line.match(/^[A-Z][^.]*[^.]$/) && line.split(' ').length <= 8
    );
  }

  private classifySectionType(title: string): string {
    if (title.match(/unit/i)) return 'unit';
    if (title.match(/lesson/i)) return 'lesson';
    if (title.match(/session/i)) return 'session';
    if (title.match(/activity|practice/i)) return 'activity';
    if (title.match(/example/i)) return 'problem';
    return 'lesson';
  }

  async storeInDatabase(extractedContent: any, fileName: string) {
    console.log(`💾 Storing content from ${fileName}`);
    
    // Check if document already exists
    const existingDoc = await prisma.document.findFirst({
      where: { filename: fileName }
    });

    if (existingDoc) {
      console.log(`📄 Document ${fileName} already exists. Updating...`);
      
      // Update the existing document with full content
      await prisma.document.update({
        where: { id: existingDoc.id },
        data: {
          content: extractedContent.fullText,
          title: extractedContent.metadata.title,
          grade_level: "7",
          volume: "V2",
          subject: "Mathematics",
          publisher: "Ready Classroom Mathematics",
          page_count: extractedContent.metadata.totalPages
        }
      });

      console.log(`✅ Updated document: ${extractedContent.metadata.title} Volume 2`);
      return existingDoc.id;
    } else {
      // Create new document
      const document = await prisma.document.create({
        data: {
          filename: fileName,
          title: extractedContent.metadata.title,
          grade_level: "7",
          volume: "V2", 
          subject: "Mathematics",
          publisher: "Ready Classroom Mathematics",
          content: extractedContent.fullText,
          page_count: extractedContent.metadata.totalPages
        }
      });

      console.log(`✅ Created new document: ${extractedContent.metadata.title} Volume 2`);
      console.log(`📄 Document ID: ${document.id}`);
      return document.id;
    }
  }
}

async function main() {
  const extractor = new Volume2Extractor();
  
  try {
    // Look for the PDF file in common locations
    const possiblePaths = [
      './RCM07_NA_SW_V2.pdf',
      './pdfs/RCM07_NA_SW_V2.pdf',
      path.join(__dirname, '../RCM07_NA_SW_V2.pdf'),
      path.join(__dirname, '../pdfs/RCM07_NA_SW_V2.pdf')
    ];

    let pdfPath: string | null = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        pdfPath = testPath;
        break;
      }
    }

    if (!pdfPath) {
      console.error('❌ RCM07_NA_SW_V2.pdf not found in any expected location');
      console.log('🔍 Checked locations:', possiblePaths);
      process.exit(1);
    }

    console.log(`📍 Found PDF at: ${pdfPath}`);
    
    const extractedContent = await extractor.extractPDF(pdfPath);
    const documentId = await extractor.storeInDatabase(extractedContent, 'RCM07_NA_SW_V2.pdf');
    
    console.log(`🎉 SUCCESS! Volume 2 extraction completed.`);
    console.log(`📋 Document ID: ${documentId}`);
    console.log(`📄 Full content: ${extractedContent.fullText.length.toLocaleString()} characters`);
    console.log(`📚 Sections: ${extractedContent.sections.length}`);
    console.log(`🖼️ Visual elements: ${extractedContent.visualElements.length}`);
    
  } catch (error) {
    console.error('❌ Extraction failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
