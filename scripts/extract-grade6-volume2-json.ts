// Extract RCM06_NA_SW_V2.pdf to JSON format (Grade 6 Volume 2)
import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');

export class Grade6Volume2JsonExtractor {
  async extractPDFToJson(filePath: string) {
    console.log(`🔍 Starting Grade 6 Volume 2 JSON extraction: ${path.basename(filePath)}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF file not found: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer, {
      version: 'v1.10.100',
      max: 0, // Extract all pages
    });

    const fullText = pdfData.text;
    console.log(`📄 Extracted ${fullText.length.toLocaleString()} characters of text`);
    console.log(`📖 Total pages: ${pdfData.numpages}`);
    
    // Create page-by-page extraction
    const pages = this.extractPages(fullText, pdfData.numpages);
    console.log(`📚 Processed ${pages.length} individual pages`);
    
    const metadata = {
      document_id: "RCM06_NA_SW_V2",
      title: "Ready Classroom Mathematics Grade 6 Volume 2",
      grade_level: "6",
      volume: "V2",
      subject: "Mathematics",
      publisher: "Ready Classroom Mathematics",
      extraction_date: new Date().toISOString(),
      total_pages: pdfData.numpages,
      total_characters: fullText.length,
      version: "1.0.0"
    };

    return {
      pages,
      metadata,
      fullText
    };
  }

  private extractPages(fullText: string, totalPages: number) {
    const lines = fullText.split('\n');
    const pages: any[] = [];
    let currentPageContent: string[] = [];
    let currentPageNumber = 1;
    let lineIndex = 0;

    // Initialize first page
    let currentPage: any = {
      page_number: currentPageNumber,
      text_content: "",
      text_preview: "",
      lesson_indicators: [],
      visual_elements: [],
      mathematical_concepts: []
    };

    for (const line of lines) {
      const trimmedLine = line.trim();
      lineIndex++;

      // Check if this line indicates a page break
      if (this.isPageBreak(trimmedLine, lines, lineIndex)) {
        // Finalize current page
        if (currentPageContent.length > 0) {
          const pageText = currentPageContent.join('\n');
          currentPage.text_content = pageText;
          currentPage.text_preview = this.createTextPreview(pageText);
          currentPage.lesson_indicators = this.findLessonIndicators(pageText);
          currentPage.visual_elements = this.identifyVisualElements(pageText);
          currentPage.mathematical_concepts = this.identifyMathConcepts(pageText);
          
          pages.push(currentPage);
        }

        // Start new page
        const newPageNum = this.extractPageNumber(trimmedLine) || currentPageNumber + 1;
        currentPageNumber = newPageNum;
        currentPage = {
          page_number: currentPageNumber,
          text_content: "",
          text_preview: "",
          lesson_indicators: [],
          visual_elements: [],
          mathematical_concepts: []
        } as any;
        currentPageContent = [];
      } else {
        // Add content to current page
        if (trimmedLine.length > 0) {
          currentPageContent.push(trimmedLine);
        }
      }
    }

    // Add the last page
    if (currentPageContent.length > 0) {
      const pageText = currentPageContent.join('\n');
      currentPage.text_content = pageText;
      currentPage.text_preview = this.createTextPreview(pageText);
      currentPage.lesson_indicators = this.findLessonIndicators(pageText);
      currentPage.visual_elements = this.identifyVisualElements(pageText);
      currentPage.mathematical_concepts = this.identifyMathConcepts(pageText);
      
      pages.push(currentPage);
    }

    // Fill in missing page numbers if needed
    if (pages.length < totalPages) {
      console.log(`📝 Adjusting page count: found ${pages.length}, expected ${totalPages}`);
      while (pages.length < totalPages) {
        pages.push({
          page_number: pages.length + 1,
          text_content: "",
          text_preview: "",
          lesson_indicators: [],
          visual_elements: [],
          mathematical_concepts: []
        });
      }
    }

    return pages;
  }

  private isPageBreak(line: string, allLines: string[], index: number): boolean {
    // Various patterns that indicate page breaks
    const pageBreakPatterns = [
      /^\d{1,4}$/,  // Just a number
      /^Page\s+\d+/i,
      /^\d+\s*$/,
    ];

    if (pageBreakPatterns.some(pattern => pattern.test(line))) {
      return true;
    }

    // Look for patterns that suggest this is a new page
    const nextLine = allLines[index] || '';
    const prevLine = allLines[index - 2] || '';
    
    // If current line is a number and next line starts content
    if (/^\d{1,3}$/.test(line) && nextLine.length > 10) {
      return true;
    }

    return false;
  }

  private extractPageNumber(line: string): number | null {
    const match = line.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  private createTextPreview(text: string): string {
    return text.substring(0, 200).replace(/\s+/g, ' ').trim();
  }

  private findLessonIndicators(text: string): string[] {
    const indicators: string[] = [];
    const lessonPatterns = [
      /LESSON\s+(\d+)[|\s]*([^\n\r]*)/gi,
      /Lesson\s+(\d+)[:\-\s]*([^\n\r]*)/gi,
      /^\s*(\d+\.\d+)\s+([^\n\r]*)/gm
    ];

    for (const pattern of lessonPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        indicators.push(match[0].trim());
      }
    }

    return indicators;
  }

  private identifyVisualElements(text: string): string[] {
    const elements: string[] = [];
    const visualPatterns = [
      /figure\s+\d+/gi,
      /diagram/gi,
      /graph/gi,
      /chart/gi,
      /table/gi,
      /number line/gi,
      /coordinate plane/gi,
      /fraction bar/gi,
      /model/gi,
      /histogram/gi,
      /box plot/gi,
      /scatter plot/gi,
      /dot plot/gi
    ];

    for (const pattern of visualPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        elements.push(match[0]);
      }
    }

    return [...new Set(elements)]; // Remove duplicates
  }

  private identifyMathConcepts(text: string): string[] {
    const concepts: string[] = [];
    const mathPatterns = [
      // Grade 6 Volume 2 concepts
      /ratio/gi,
      /proportion/gi,
      /percent/gi,
      /rate/gi,
      /coordinate/gi,
      /integer/gi,
      /negative number/gi,
      /absolute value/gi,
      /inequality/gi,
      /expression/gi,
      /equation/gi,
      /variable/gi,
      /statistics/gi,
      /data/gi,
      /mean/gi,
      /median/gi,
      /mode/gi,
      /range/gi,
      /distribution/gi,
      /histogram/gi,
      /box plot/gi,
      /quartile/gi
    ];

    for (const pattern of mathPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        concepts.push(match[0].toLowerCase());
      }
    }

    return [...new Set(concepts)]; // Remove duplicates
  }

  async saveToJsonFiles() {
    const pdfPath = path.join(__dirname, '../PDF files/RCM06_NA_SW_V2.pdf');
    const outputDir = path.join(__dirname, '../webapp_pages/RCM06_NA_SW_V2');
    const dataDir = path.join(outputDir, 'data');
    
    console.log(`\n🚀 Processing Grade 6 Volume 2 to JSON...`);
    console.log(`📁 PDF path: ${pdfPath}`);
    console.log(`📁 Output directory: ${outputDir}`);

    try {
      // Create output directories
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Extract the data
      const extractedData = await this.extractPDFToJson(pdfPath);
      
      console.log(`\n💾 Saving JSON files...`);

      // Save main document.json
      const documentData = {
        metadata: extractedData.metadata,
        pages: extractedData.pages
      };

      fs.writeFileSync(
        path.join(dataDir, 'document.json'),
        JSON.stringify(documentData, null, 2)
      );

      // Save extraction summary
      const summary = {
        extraction_date: new Date().toISOString(),
        document_id: "RCM06_NA_SW_V2",
        total_pages: extractedData.pages.length,
        total_characters: extractedData.fullText.length,
        lessons_found: extractedData.pages.filter(p => p.lesson_indicators.length > 0).length,
        pages_with_visual_elements: extractedData.pages.filter(p => p.visual_elements.length > 0).length,
        unique_math_concepts: [...new Set(extractedData.pages.flatMap(p => p.mathematical_concepts))].length
      };

      fs.writeFileSync(
        path.join(dataDir, 'extraction_summary.json'),
        JSON.stringify(summary, null, 2)
      );

      console.log(`\n📊 Extraction Summary:`);
      console.log(`   📁 Output directory: ${outputDir}`);
      console.log(`   📄 Total Characters: ${extractedData.fullText.length.toLocaleString()}`);
      console.log(`   📖 Total Pages: ${extractedData.pages.length}`);
      console.log(`   📚 Lessons Found: ${summary.lessons_found}`);
      console.log(`   🖼️ Pages with Visual Elements: ${summary.pages_with_visual_elements}`);
      console.log(`   🧮 Unique Math Concepts: ${summary.unique_math_concepts}`);
      
    } catch (error) {
      console.error('❌ Error during extraction:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const extractor = new Grade6Volume2JsonExtractor();
  await extractor.saveToJsonFiles();
  console.log(`\n🎉 Grade 6 Volume 2 JSON extraction completed successfully!`);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}
