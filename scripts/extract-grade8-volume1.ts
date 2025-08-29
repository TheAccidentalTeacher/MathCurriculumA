// Extract RCM08_NA_SW_V1.pdf (Grade 8 Volume 1) for production deployment
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Grade8Volume1Extractor {
  async extractPDF(filePath: string) {
    console.log(`🔍 Starting Grade 8 Volume 1 extraction: ${path.basename(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const fullText = pdfData.text;
    console.log(`📄 Extracted ${fullText.length.toLocaleString()} characters of text`);
    console.log(`📖 Total pages: ${pdfData.numpages}`);
    
    const visualElements = this.identifyVisualElements(fullText);
    console.log(`🖼️ Identified ${visualElements.length} visual elements`);
    
    const sections = this.extractStructuredSections(fullText, visualElements);
    console.log(`📚 Extracted ${sections.length} structured sections`);
    
    const metadata = {
      title: "Ready Classroom Mathematics Grade 8",
      grade: "Grade 8",
      volume: "V1",
      subject: "Mathematics",
      publisher: "Ready Classroom Mathematics",
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
      
      // Track page numbers
      if (this.isPageBreak(line)) {
        const pageNum = parseInt(line);
        if (pageNum > currentPage) currentPage = pageNum;
        continue;
      }

      // Detect visual elements by pattern
      const visualElement = this.detectVisualElement(line, lines, i, currentPage);
      if (visualElement) {
        elements.push(visualElement);
      }
    }

    return elements;
  }

  private detectVisualElement(line: string, allLines: string[], index: number, page: number) {
    const lineLower = line.toLowerCase();
    
    // Grade 8 specific mathematical diagrams and figures
    if (lineLower.includes('figure') || lineLower.includes('diagram')) {
      return {
        type: 'diagram',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Advanced mathematical concepts for Grade 8
    if (this.isAdvancedMathPattern(line)) {
      return {
        type: 'advanced_math',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Coordinate grids (common in Grade 8 algebra)
    if (lineLower.includes('coordinate') && (lineLower.includes('plane') || lineLower.includes('grid'))) {
      return {
        type: 'coordinate_grid',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Function graphs and algebra
    if (lineLower.includes('function') || lineLower.includes('equation') || this.isAlgebraPattern(line)) {
      return {
        type: 'algebra',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Geometric shapes (advanced for Grade 8)
    if (this.containsGeometricTerms(lineLower)) {
      return {
        type: 'geometric_shape',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Tables and data analysis
    if (this.isTablePattern(line)) {
      return {
        type: 'table',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    return null;
  }

  private isAdvancedMathPattern(line: string): boolean {
    const advancedPatterns = [
      /linear\s+equation/i,
      /slope/i,
      /y-intercept/i,
      /system\s+of\s+equations/i,
      /exponent/i,
      /scientific\s+notation/i,
      /square\s+root/i,
      /pythagorean/i,
      /congruent/i,
      /similar/i,
      /transformation/i
    ];
    
    return advancedPatterns.some(pattern => pattern.test(line));
  }

  private isAlgebraPattern(line: string): boolean {
    const algebraPatterns = [
      /[xy]\s*[=]/,
      /[xy]\s*\+\s*\d/,
      /[xy]\s*-\s*\d/,
      /\d[xy]/,
      /f\(x\)/i,
      /slope/i
    ];
    
    return algebraPatterns.some(pattern => pattern.test(line));
  }

  private containsGeometricTerms(line: string): boolean {
    const geometricTerms = [
      'triangle', 'square', 'rectangle', 'circle', 'polygon',
      'prism', 'cylinder', 'sphere', 'cone', 'cube',
      'angle', 'vertex', 'edge', 'face', 'radius', 'diameter',
      'perimeter', 'area', 'volume', 'height', 'width', 'length',
      'congruent', 'similar', 'transformation', 'rotation', 'reflection', 'translation'
    ];
    
    return geometricTerms.some(term => line.includes(term));
  }

  private isTablePattern(line: string): boolean {
    return /\|\s*.*\s*\|/.test(line) || 
           /\t.*\t/.test(line) || 
           line.includes('Table') ||
           /\d+\s+\d+\s+\d+/.test(line);
  }

  private isPageBreak(line: string): boolean {
    return /^\d{1,4}$/.test(line.trim()) && parseInt(line) > 0;
  }

  private getContext(allLines: string[], index: number): string {
    const start = Math.max(0, index - 2);
    const end = Math.min(allLines.length, index + 3);
    return allLines.slice(start, end).join(' ').trim();
  }

  private extractStructuredSections(fullText: string, visualElements: any[]) {
    const sections = [];
    const lines = fullText.split('\n');
    let currentSection = null;
    let currentContent = [];
    let pageNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (this.isPageBreak(line)) {
        pageNumber = parseInt(line);
        continue;
      }

      // Detect Grade 8 specific units
      if (this.isGrade8UnitHeader(line)) {
        if (currentSection) {
          sections.push({
            title: currentSection.title,
            content: currentContent.join('\n'),
            type: currentSection.type,
            page: currentSection.page,
            visualElements: visualElements.filter(ve => ve.page === currentSection.page)
          });
        }

        currentSection = {
          title: line,
          type: 'unit',
          page: pageNumber
        };
        currentContent = [];
      }
      // Detect lessons
      else if (this.isLessonHeader(line)) {
        if (currentSection) {
          sections.push({
            title: currentSection.title,
            content: currentContent.join('\n'),
            type: currentSection.type,
            page: currentSection.page,
            visualElements: visualElements.filter(ve => ve.page === currentSection.page)
          });
        }

        currentSection = {
          title: line,
          type: 'lesson',
          page: pageNumber
        };
        currentContent = [];
      }
      // Regular content
      else if (line.length > 0) {
        currentContent.push(line);
      }
    }

    // Add the last section
    if (currentSection) {
      sections.push({
        title: currentSection.title,
        content: currentContent.join('\n'),
        type: currentSection.type,
        page: currentSection.page,
        visualElements: visualElements.filter(ve => ve.page === currentSection.page)
      });
    }

    return sections;
  }

  private isGrade8UnitHeader(line: string): boolean {
    const unitPatterns = [
      /^UNIT\s+\d+/i,
      /^Unit\s+\d+/i,
      /Linear\s+Equations/i,
      /Functions/i,
      /Transformations/i,
      /Congruence/i,
      /Similarity/i,
      /Pythagorean/i,
      /Volume\s+and\s+Surface/i,
      /Statistics/i,
      /Bivariate\s+Data/i
    ];

    return unitPatterns.some(pattern => pattern.test(line));
  }

  private isLessonHeader(line: string): boolean {
    const lessonPatterns = [
      /^Lesson\s+\d+/i,
      /^LESSON\s+\d+/i,
      /^\d+\.\d+\s+/,
      /Learn\s+About/i,
      /Try\s+It/i,
      /Practice/i
    ];

    return lessonPatterns.some(pattern => pattern.test(line));
  }

  async saveToDatabaseAsDocument() {
    const pdfPath = path.join(__dirname, '../PDF files/RCM08_NA_SW_V1.pdf');
    
    console.log(`\n🚀 Processing Grade 8 Volume 1...`);
    console.log(`📁 File path: ${pdfPath}`);

    try {
      const extractedData = await this.extractPDF(pdfPath);
      
      console.log(`\n💾 Saving to database...`);

      // Check if document already exists
      const existingDoc = await prisma.document.findUnique({
        where: { filename: 'RCM08_NA_SW_V1.pdf' }
      });

      if (existingDoc) {
        console.log(`📖 Document already exists, updating...`);
        
        const updatedDocument = await prisma.document.update({
          where: { filename: 'RCM08_NA_SW_V1.pdf' },
          data: {
            content: extractedData.fullText,
            grade_level: '8',
            volume: 'V1',
            subject: 'Mathematics',
            publisher: 'Ready Classroom Mathematics',
            page_count: extractedData.metadata.totalPages,
            updated_at: new Date(),
          },
        });

        console.log(`✅ Document updated: ${updatedDocument.id}`);
      } else {
        const savedDocument = await prisma.document.create({
          data: {
            filename: 'RCM08_NA_SW_V1.pdf',
            title: 'Ready Classroom Mathematics Grade 8 Volume 1',
            grade_level: '8',
            volume: 'V1',
            subject: 'Mathematics',
            publisher: 'Ready Classroom Mathematics',
            content: extractedData.fullText,
            page_count: extractedData.metadata.totalPages,
          },
        });

        console.log(`✅ Document saved: ${savedDocument.id}`);
      }

      console.log(`\n📊 Extraction Summary:`);
      console.log(`   📄 Total Characters: ${extractedData.metadata.totalCharacters.toLocaleString()}`);
      console.log(`   📖 Total Pages: ${extractedData.metadata.totalPages}`);
      console.log(`   📚 Sections Extracted: ${extractedData.metadata.extractedSections}`);
      console.log(`   🖼️ Visual Elements: ${extractedData.metadata.extractedVisualElements}`);
      
    } catch (error) {
      console.error('❌ Error during extraction:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

// Main execution
async function main() {
  const extractor = new Grade8Volume1Extractor();
  await extractor.saveToDatabaseAsDocument();
  console.log(`\n🎉 Grade 8 Volume 1 extraction completed successfully!`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
