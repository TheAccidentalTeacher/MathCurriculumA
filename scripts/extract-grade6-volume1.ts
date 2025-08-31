// Extract RCM06_NA_SW_V1.pdf (Grade 6 Volume 1) for production deployment
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Grade6Volume1Extractor {
  async extractPDF(filePath: string) {
    console.log(`🔍 Starting Grade 6 Volume 1 extraction: ${path.basename(filePath)}`);
    
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
      title: "Ready Classroom Mathematics Grade 6",
      grade: "Grade 6",
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

  private identifyVisualElements(text: string): any[] {
    const elements: any[] = [];
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
    
    // Grade 6 specific mathematical diagrams and figures
    if (lineLower.includes('figure') || lineLower.includes('diagram')) {
      return {
        type: 'diagram',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Grade 6 mathematical concepts
    if (this.isGrade6MathPattern(line)) {
      return {
        type: 'grade6_math',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Number lines (common in Grade 6)
    if (lineLower.includes('number line') || this.isNumberLinePattern(line)) {
      return {
        type: 'number_line',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Fraction models and representations
    if (this.isFractionPattern(line)) {
      return {
        type: 'fraction_model',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    // Geometric shapes (appropriate for Grade 6)
    if (this.containsGrade6GeometricTerms(lineLower)) {
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

    // Ratio and proportion models
    if (this.isRatioPattern(line)) {
      return {
        type: 'ratio_model',
        description: line,
        page,
        context: this.getContext(allLines, index),
      };
    }

    return null;
  }

  private isGrade6MathPattern(line: string): boolean {
    const grade6Patterns = [
      /fraction/i,
      /decimal/i,
      /percent/i,
      /ratio/i,
      /proportion/i,
      /area/i,
      /volume/i,
      /coordinate/i,
      /negative\s+number/i,
      /absolute\s+value/i,
      /expression/i,
      /equation/i,
      /variable/i
    ];
    
    return grade6Patterns.some(pattern => pattern.test(line));
  }

  private isNumberLinePattern(line: string): boolean {
    const numberLinePatterns = [
      /number\s+line/i,
      /←.*→/,
      /\-\d+.*\d+/,
      /negative.*positive/i
    ];
    
    return numberLinePatterns.some(pattern => pattern.test(line));
  }

  private isFractionPattern(line: string): boolean {
    const fractionPatterns = [
      /\d+\/\d+/,
      /fraction/i,
      /numerator/i,
      /denominator/i,
      /mixed\s+number/i,
      /improper\s+fraction/i,
      /equivalent\s+fraction/i
    ];
    
    return fractionPatterns.some(pattern => pattern.test(line));
  }

  private isRatioPattern(line: string): boolean {
    const ratioPatterns = [
      /ratio/i,
      /proportion/i,
      /\d+:\d+/,
      /rate/i,
      /unit\s+rate/i,
      /per/i
    ];
    
    return ratioPatterns.some(pattern => pattern.test(line));
  }

  private containsGrade6GeometricTerms(line: string): boolean {
    const geometricTerms = [
      'triangle', 'square', 'rectangle', 'circle', 'polygon',
      'parallelogram', 'trapezoid', 'rhombus',
      'angle', 'vertex', 'edge', 'face', 'radius', 'diameter',
      'perimeter', 'area', 'height', 'width', 'length',
      'coordinate plane', 'quadrant', 'origin', 'x-axis', 'y-axis'
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

  private extractStructuredSections(fullText: string, visualElements: any[]): any[] {
    const sections: any[] = [];
    const lines = fullText.split('\n');
    let currentSection: any = null;
    let currentContent: string[] = [];
    let pageNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (this.isPageBreak(line)) {
        pageNumber = parseInt(line);
        continue;
      }

      // Detect Grade 6 specific units
      if (this.isGrade6UnitHeader(line)) {
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

  private isGrade6UnitHeader(line: string): boolean {
    const unitPatterns = [
      /^UNIT\s+\d+/i,
      /^Unit\s+\d+/i,
      /Ratios\s+and\s+Proportional\s+Relationships/i,
      /The\s+Number\s+System/i,
      /Expressions\s+and\s+Equations/i,
      /Geometry/i,
      /Statistics\s+and\s+Probability/i,
      /Fractions/i,
      /Decimals/i,
      /Percents/i,
      /Area\s+and\s+Volume/i
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
    const pdfPath = path.join(__dirname, '../PDF files/RCM06_NA_SW_V1.pdf');
    
    console.log(`\n🚀 Processing Grade 6 Volume 1...`);
    console.log(`📁 File path: ${pdfPath}`);

    try {
      const extractedData = await this.extractPDF(pdfPath);
      
      console.log(`\n💾 Saving to database...`);

      // Check if document already exists
      const existingDoc = await prisma.document.findUnique({
        where: { filename: 'RCM06_NA_SW_V1.pdf' }
      });

      if (existingDoc) {
        console.log(`📖 Document already exists, updating...`);
        
        const updatedDocument = await prisma.document.update({
          where: { filename: 'RCM06_NA_SW_V1.pdf' },
          data: {
            content: extractedData.fullText,
            grade_level: '6',
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
            filename: 'RCM06_NA_SW_V1.pdf',
            title: 'Ready Classroom Mathematics Grade 6 Volume 1',
            grade_level: '6',
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
  const extractor = new Grade6Volume1Extractor();
  await extractor.saveToDatabaseAsDocument();
  console.log(`\n🎉 Grade 6 Volume 1 extraction completed successfully!`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
