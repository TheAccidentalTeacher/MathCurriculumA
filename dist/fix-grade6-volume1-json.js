"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade6Volume1JsonFixer = void 0;
// Fix Grade 6 Volume 1 JSON to ensure sequential page numbers
const fs = require("fs");
class Grade6Volume1JsonFixer {
    async fixPageNumbering() {
        console.log('🔧 Fixing Grade 6 Volume 1 page numbering...');
        const filePath = '/workspaces/MathCurriculumA/webapp_pages/RCM06_NA_SW_V1/data/document.json';
        // Read the existing file
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);
        console.log(`📖 Original page count: ${data.pages.length}`);
        // Group pages by content and remove duplicates
        const uniquePages = new Map();
        const processedPages = [];
        for (let i = 0; i < data.pages.length; i++) {
            const page = data.pages[i];
            const contentKey = page.text_content.substring(0, 100); // Use first 100 chars as key
            if (!uniquePages.has(contentKey) && page.text_content.trim().length > 0) {
                uniquePages.set(contentKey, page);
                processedPages.push(page);
            }
        }
        console.log(`📚 After deduplication: ${processedPages.length} pages`);
        // Reassign sequential page numbers
        for (let i = 0; i < processedPages.length; i++) {
            processedPages[i].page_number = i + 1;
        }
        // Ensure we have 512 pages (pad with empty pages if needed)
        const targetPages = 512;
        while (processedPages.length < targetPages) {
            processedPages.push({
                page_number: processedPages.length + 1,
                text_content: "",
                text_preview: "",
                lesson_indicators: [],
                visual_elements: [],
                mathematical_concepts: []
            });
        }
        // Update metadata
        data.metadata.total_pages = targetPages;
        data.pages = processedPages;
        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Fixed Grade 6 Volume 1: ${processedPages.length} sequential pages`);
        return {
            totalPages: processedPages.length,
            uniquePages: uniquePages.size,
            metadata: data.metadata
        };
    }
}
exports.Grade6Volume1JsonFixer = Grade6Volume1JsonFixer;
// Run the fixer
async function main() {
    const fixer = new Grade6Volume1JsonFixer();
    const result = await fixer.fixPageNumbering();
    console.log('🎉 Grade 6 Volume 1 fix complete:', result);
}
if (require.main === module) {
    main().catch(console.error);
}
