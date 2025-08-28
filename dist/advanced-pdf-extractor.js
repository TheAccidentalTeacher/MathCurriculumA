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
exports.AdvancedPDFExtractor = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pdf = require('pdf-parse');
const client_1 = require("@prisma/client");
class AdvancedPDFExtractor {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async extractPDF(filePath) {
        console.log(`🔍 Starting advanced extraction: ${filePath}`);
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdf(dataBuffer);
        // Extract ALL text - no truncation
        const fullText = pdfData.text;
        console.log(`📄 Extracted ${fullText.length.toLocaleString()} characters of text`);
        // Identify visual elements from text patterns
        const visualElements = this.identifyVisualElements(fullText);
        console.log(`🖼️ Identified ${visualElements.length} visual elements`);
        // Extract structured sections with visual context
        const sections = this.extractStructuredSections(fullText, visualElements);
        console.log(`📚 Extracted ${sections.length} structured sections`);
        const metadata = {
            title: this.extractTitle(fullText),
            grade: this.extractGrade(path.basename(filePath)),
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
        // Mathematical diagrams and figures
        if (lineLower.includes('figure') || lineLower.includes('diagram')) {
            return {
                type: 'diagram',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        // Number lines (very common in math textbooks)
        if (lineLower.includes('number line') || this.isNumberLinePattern(line)) {
            return {
                type: 'number_line',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        // Coordinate grids and planes
        if (lineLower.includes('coordinate') && (lineLower.includes('plane') || lineLower.includes('grid'))) {
            return {
                type: 'coordinate_grid',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        // Geometric shapes
        if (this.containsGeometricTerms(lineLower)) {
            return {
                type: 'geometric_shape',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        // Tables (look for tabular data patterns)
        if (this.isTablePattern(line)) {
            return {
                type: 'table',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        // Charts and graphs
        if (lineLower.includes('chart') || lineLower.includes('graph') || this.isChartPattern(line)) {
            return {
                type: 'chart',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        // Images (referenced in text)
        if (lineLower.includes('image') || lineLower.includes('picture') || lineLower.includes('shown')) {
            return {
                type: 'image',
                description: line,
                page,
                context: this.getContext(allLines, index),
            };
        }
        return null;
    }
    isNumberLinePattern(line) {
        // Detect patterns that suggest number lines
        const patterns = [
            /[\-\+]?\d+\s+[\-\+]?\d+\s+[\-\+]?\d+/, // Sequential numbers
            /\|\s*\|\s*\|\s*\|/, // Tick marks
            /\-{3,}/, // Long dashes (number line representation)
            /\d+\s*←.*→\s*\d+/, // Arrows with numbers
        ];
        return patterns.some(pattern => pattern.test(line));
    }
    containsGeometricTerms(line) {
        const geometricTerms = [
            'triangle', 'square', 'rectangle', 'circle', 'polygon',
            'prism', 'cylinder', 'sphere', 'cone', 'cube',
            'angle', 'vertex', 'edge', 'face', 'radius', 'diameter',
            'perimeter', 'area', 'volume', 'height', 'width', 'length'
        ];
        return geometricTerms.some(term => line.includes(term));
    }
    isTablePattern(line) {
        // Detect table-like structures
        return (line.includes('|') && line.split('|').length > 2 || // Pipe-separated
            /\t.*\t.*\t/.test(line) || // Tab-separated
            /\s{4,}\w+\s{4,}\w+/.test(line) // Space-separated columns
        );
    }
    isChartPattern(line) {
        return (line.includes('x-axis') || line.includes('y-axis') ||
            line.includes('data') || line.includes('frequency') ||
            /\d+%/.test(line) // Percentages often indicate charts
        );
    }
    getContext(lines, index) {
        const start = Math.max(0, index - 2);
        const end = Math.min(lines.length, index + 3);
        return lines.slice(start, end).join(' ').trim();
    }
    extractStructuredSections(text, visualElements) {
        const sections = [];
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        let currentPage = 1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // Track pages
            if (this.isPageBreak(line)) {
                const pageNum = parseInt(line);
                if (pageNum > currentPage)
                    currentPage = pageNum;
                continue;
            }
            // Identify section headers
            const sectionType = this.identifySection(line);
            if (sectionType) {
                const content = this.extractSectionContent(lines, i + 1);
                const sectionVisualElements = visualElements.filter(ve => ve.page === currentPage || ve.context.includes(line.substring(0, 50)));
                sections.push({
                    title: line,
                    content,
                    type: sectionType,
                    page: currentPage,
                    visualElements: sectionVisualElements
                });
            }
        }
        return sections;
    }
    identifySection(line) {
        const lineLower = line.toLowerCase();
        if (lineLower.includes('unit') && /\d+/.test(line))
            return 'unit';
        if (lineLower.includes('lesson') || /^\d+\.\d+/.test(line))
            return 'lesson';
        if (lineLower.includes('session'))
            return 'session';
        if (lineLower.includes('activity') || lineLower.includes('try it'))
            return 'activity';
        if (/^\d+\.\s/.test(line) && line.length < 100)
            return 'problem';
        return null;
    }
    extractSectionContent(lines, startIndex) {
        const content = [];
        for (let i = startIndex; i < Math.min(startIndex + 100, lines.length); i++) {
            const line = lines[i];
            // Stop at next section
            if (this.identifySection(line))
                break;
            // Skip page breaks and very short lines
            if (this.isPageBreak(line) || line.length < 3)
                continue;
            content.push(line);
        }
        return content.join(' ').trim();
    }
    isPageBreak(line) {
        return /^\d+$/.test(line) && parseInt(line) > 0 && parseInt(line) < 1000;
    }
    extractTitle(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        for (const line of lines.slice(0, 20)) {
            if (line.includes('Mathematics') || line.includes('Ready')) {
                return line;
            }
        }
        return 'Mathematics Document';
    }
    extractGrade(filename) {
        const gradeMatch = filename.match(/RCM0?(\d+)/i);
        return gradeMatch ? `Grade ${gradeMatch[1]}` : 'Unknown Grade';
    }
    async storeAdvancedContent(filePath) {
        const extraction = await this.extractPDF(filePath);
        const filename = path.basename(filePath);
        console.log(`💾 Storing ${extraction.metadata.totalCharacters.toLocaleString()} characters of content`);
        console.log(`📊 ${extraction.sections.length} sections, ${extraction.visualElements.length} visual elements`);
        // Store document with FULL content - no truncation
        const document = await this.prisma.document.upsert({
            where: { filename },
            update: {
                title: extraction.metadata.title,
                grade_level: extraction.metadata.grade,
                subject: 'Mathematics',
                content: extraction.fullText, // FULL text, not truncated
                page_count: extraction.metadata.totalPages
            },
            create: {
                filename,
                title: extraction.metadata.title,
                grade_level: extraction.metadata.grade,
                subject: 'Mathematics',
                content: extraction.fullText, // FULL text, not truncated
                page_count: extraction.metadata.totalPages
            }
        });
        console.log(`✅ Stored document: ${document.title}`);
        console.log(`📄 Full content: ${extraction.metadata.totalCharacters.toLocaleString()} characters`);
        console.log(`📚 Sections: ${extraction.metadata.extractedSections}`);
        console.log(`🖼️ Visual elements: ${extraction.metadata.extractedVisualElements}`);
        return document.id;
    }
    async cleanup() {
        await this.prisma.$disconnect();
    }
}
exports.AdvancedPDFExtractor = AdvancedPDFExtractor;
// CLI usage
if (require.main === module) {
    const extractor = new AdvancedPDFExtractor();
    const pdfPath = process.argv[2];
    if (!pdfPath) {
        console.error('Usage: npx tsx advanced-pdf-extractor.ts <path-to-pdf>');
        process.exit(1);
    }
    if (!fs.existsSync(pdfPath)) {
        console.error(`File not found: ${pdfPath}`);
        process.exit(1);
    }
    extractor.storeAdvancedContent(pdfPath)
        .then((documentId) => {
        console.log(`\n🎉 SUCCESS! Advanced extraction completed.`);
        console.log(`📋 Document ID: ${documentId}`);
        console.log(`🔍 Full content preserved with visual elements identified`);
    })
        .catch((error) => {
        console.error('❌ Advanced extraction failed:', error);
        process.exit(1);
    })
        .finally(() => {
        extractor.cleanup();
    });
}
