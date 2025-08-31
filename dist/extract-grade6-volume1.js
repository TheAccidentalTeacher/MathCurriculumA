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
exports.Grade6Volume1Extractor = void 0;
// Extract RCM06_NA_SW_V1.pdf (Grade 6 Volume 1) for production deployment
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdf = require('pdf-parse');
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class Grade6Volume1Extractor {
    async extractPDF(filePath) {
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
    identifyVisualElements(text) {
        const elements = [];
        const lines = text.split('\n');
        let currentPage = 1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Track page numbers
            if (this.isPageBreak(line)) {
                const pageNum = parseInt(line);
                if (pageNum > currentPage)
                    currentPage = pageNum;
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
    detectVisualElement(line, allLines, index, page) {
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
    isGrade6MathPattern(line) {
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
    isNumberLinePattern(line) {
        const numberLinePatterns = [
            /number\s+line/i,
            /←.*→/,
            /\-\d+.*\d+/,
            /negative.*positive/i
        ];
        return numberLinePatterns.some(pattern => pattern.test(line));
    }
    isFractionPattern(line) {
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
    isRatioPattern(line) {
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
    containsGrade6GeometricTerms(line) {
        const geometricTerms = [
            'triangle', 'square', 'rectangle', 'circle', 'polygon',
            'parallelogram', 'trapezoid', 'rhombus',
            'angle', 'vertex', 'edge', 'face', 'radius', 'diameter',
            'perimeter', 'area', 'height', 'width', 'length',
            'coordinate plane', 'quadrant', 'origin', 'x-axis', 'y-axis'
        ];
        return geometricTerms.some(term => line.includes(term));
    }
    isTablePattern(line) {
        return /\|\s*.*\s*\|/.test(line) ||
            /\t.*\t/.test(line) ||
            line.includes('Table') ||
            /\d+\s+\d+\s+\d+/.test(line);
    }
    isPageBreak(line) {
        return /^\d{1,4}$/.test(line.trim()) && parseInt(line) > 0;
    }
    getContext(allLines, index) {
        const start = Math.max(0, index - 2);
        const end = Math.min(allLines.length, index + 3);
        return allLines.slice(start, end).join(' ').trim();
    }
    extractStructuredSections(fullText, visualElements) {
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
    isGrade6UnitHeader(line) {
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
    isLessonHeader(line) {
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
            }
            else {
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
        }
        catch (error) {
            console.error('❌ Error during extraction:', error);
            throw error;
        }
        finally {
            await prisma.$disconnect();
        }
    }
}
exports.Grade6Volume1Extractor = Grade6Volume1Extractor;
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
