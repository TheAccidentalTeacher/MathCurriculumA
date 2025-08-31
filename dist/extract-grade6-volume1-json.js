"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade6Volume1JsonExtractor = void 0;
// Extract RCM06_NA_SW_V1.pdf to JSON format (Grade 6 Volume 1)
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdf = require('pdf-parse');
class Grade6Volume1JsonExtractor {
    async extractPDFToJson(filePath) {
        console.log(`🔍 Starting Grade 6 Volume 1 JSON extraction: ${path.basename(filePath)}`);
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
            document_id: "RCM06_NA_SW_V1",
            title: "Ready Classroom Mathematics Grade 6 Volume 1",
            grade_level: "6",
            volume: "V1",
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
    extractPages(fullText, totalPages) {
        const lines = fullText.split('\n');
        const pages = [];
        let currentPageContent = [];
        let currentPageNumber = 1;
        let lineIndex = 0;
        // Initialize first page
        let currentPage = {
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
                };
                currentPageContent = [];
            }
            else {
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
    isPageBreak(line, allLines, index) {
        // Various patterns that indicate page breaks
        const pageBreakPatterns = [
            /^\d{1,4}$/, // Just a number
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
    extractPageNumber(line) {
        const match = line.match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
    }
    createTextPreview(text) {
        return text.substring(0, 200).replace(/\s+/g, ' ').trim();
    }
    findLessonIndicators(text) {
        const indicators = [];
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
    identifyVisualElements(text) {
        const elements = [];
        const visualPatterns = [
            /figure\s+\d+/gi,
            /diagram/gi,
            /graph/gi,
            /chart/gi,
            /table/gi,
            /number line/gi,
            /coordinate plane/gi,
            /fraction bar/gi,
            /model/gi
        ];
        for (const pattern of visualPatterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                elements.push(match[0]);
            }
        }
        return [...new Set(elements)]; // Remove duplicates
    }
    identifyMathConcepts(text) {
        const concepts = [];
        const mathPatterns = [
            /fraction/gi,
            /decimal/gi,
            /percent/gi,
            /ratio/gi,
            /proportion/gi,
            /area/gi,
            /volume/gi,
            /perimeter/gi,
            /coordinate/gi,
            /negative number/gi,
            /absolute value/gi,
            /expression/gi,
            /equation/gi,
            /variable/gi,
            /geometry/gi
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
        const pdfPath = path.join(__dirname, '../PDF files/RCM06_NA_SW_V1.pdf');
        const outputDir = path.join(__dirname, '../webapp_pages/RCM06_NA_SW_V1');
        const dataDir = path.join(outputDir, 'data');
        console.log(`\n🚀 Processing Grade 6 Volume 1 to JSON...`);
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
            fs.writeFileSync(path.join(dataDir, 'document.json'), JSON.stringify(documentData, null, 2));
            // Save extraction summary
            const summary = {
                extraction_date: new Date().toISOString(),
                document_id: "RCM06_NA_SW_V1",
                total_pages: extractedData.pages.length,
                total_characters: extractedData.fullText.length,
                lessons_found: extractedData.pages.filter(p => p.lesson_indicators.length > 0).length,
                pages_with_visual_elements: extractedData.pages.filter(p => p.visual_elements.length > 0).length,
                unique_math_concepts: [...new Set(extractedData.pages.flatMap(p => p.mathematical_concepts))].length
            };
            fs.writeFileSync(path.join(dataDir, 'extraction_summary.json'), JSON.stringify(summary, null, 2));
            console.log(`\n📊 Extraction Summary:`);
            console.log(`   📁 Output directory: ${outputDir}`);
            console.log(`   📄 Total Characters: ${extractedData.fullText.length.toLocaleString()}`);
            console.log(`   📖 Total Pages: ${extractedData.pages.length}`);
            console.log(`   📚 Lessons Found: ${summary.lessons_found}`);
            console.log(`   🖼️ Pages with Visual Elements: ${summary.pages_with_visual_elements}`);
            console.log(`   🧮 Unique Math Concepts: ${summary.unique_math_concepts}`);
        }
        catch (error) {
            console.error('❌ Error during extraction:', error);
            throw error;
        }
    }
}
exports.Grade6Volume1JsonExtractor = Grade6Volume1JsonExtractor;
// Main execution
async function main() {
    const extractor = new Grade6Volume1JsonExtractor();
    await extractor.saveToJsonFiles();
    console.log(`\n🎉 Grade 6 Volume 1 JSON extraction completed successfully!`);
}
// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}
