import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { db, initDB, schema } from '../src/lib/db';
import { eq } from 'drizzle-orm';

const pdfsDir = path.join(process.cwd(), 'pdfs');

interface ExtractedDocument {
  filename: string;
  title: string;
  grade?: number;
  subject: string;
  publisher?: string;
  version?: string;
  totalPages: number;
  rawText: string;
  sections: ExtractedSection[];
  keywords: string[];
}

interface ExtractedSection {
  title: string;
  sectionNumber?: string;
  startPage?: number;
  endPage?: number;
  content: string;
  sectionType: 'chapter' | 'unit' | 'lesson' | 'appendix' | 'introduction';
  topics: ExtractedTopic[];
}

interface ExtractedTopic {
  title: string;
  description?: string;
  pageNumber?: number;
  content: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  topicType: 'concept' | 'example' | 'exercise' | 'assessment';
  keywords: string[];
}

class CurriculumExtractor {
  private mathKeywords = [
    'algebra', 'geometry', 'statistics', 'probability', 'calculus',
    'equation', 'function', 'variable', 'coefficient', 'polynomial',
    'fraction', 'decimal', 'percentage', 'ratio', 'proportion',
    'area', 'volume', 'perimeter', 'circumference', 'angle',
    'triangle', 'square', 'rectangle', 'circle', 'polygon',
    'graph', 'coordinate', 'slope', 'intercept', 'linear',
    'quadratic', 'exponential', 'logarithm', 'trigonometry',
    'mean', 'median', 'mode', 'range', 'deviation'
  ];

  parseFilename(filename: string) {
    const match = filename.match(/^([A-Z]+)(\d+)_([A-Z]+)_([A-Z]+)_V(\d+)\.pdf$/i);
    if (match) {
      const [, series, grade, region, type, version] = match;
      return {
        series,
        grade: parseInt(grade),
        region,
        type,
        version: `V${version}`,
        subject: 'Mathematics'
      };
    }
    return null;
  }

  extractKeywords(text: string): string[] {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const keywordCounts: { [key: string]: number } = {};
    
    // Count occurrences of math keywords
    this.mathKeywords.forEach(keyword => {
      const count = words.filter(word => word === keyword).length;
      if (count > 0) {
        keywordCounts[keyword] = count;
      }
    });

    // Also extract potential new keywords (capitalized words that appear frequently)
    const capitalizedWords = text.match(/\b[A-Z][a-z]+\b/g) || [];
    capitalizedWords.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (!this.mathKeywords.includes(lowerWord)) {
        keywordCounts[lowerWord] = (keywordCounts[lowerWord] || 0) + 1;
      }
    });

    // Return keywords that appear at least twice
    return Object.entries(keywordCounts)
      .filter(([_, count]) => count >= 2)
      .map(([keyword, _]) => keyword);
  }

  extractSections(text: string): ExtractedSection[] {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const sections: ExtractedSection[] = [];
    let currentSection: ExtractedSection | null = null;
    let currentContent: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for section headers (various patterns)
      const chapterMatch = line.match(/^(Chapter|Unit|Lesson|Section)\s+(\d+)[:.]?\s*(.+)$/i);
      const numberMatch = line.match(/^(\d+)\.?\s+(.+)$/);
      const headerMatch = line.match(/^([A-Z][A-Za-z\s]{10,50})$/);

      if (chapterMatch || (numberMatch && line.length < 100) || 
          (headerMatch && this.looksLikeHeader(line, lines, i))) {
        
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.join('\n');
          currentSection.topics = this.extractTopics(currentSection.content);
          sections.push(currentSection);
        }

        // Start new section
        let title = '';
        let sectionNumber = '';
        let sectionType: ExtractedSection['sectionType'] = 'lesson';

        if (chapterMatch) {
          sectionType = chapterMatch[1].toLowerCase() as ExtractedSection['sectionType'];
          sectionNumber = chapterMatch[2];
          title = chapterMatch[3];
        } else if (numberMatch) {
          sectionNumber = numberMatch[1];
          title = numberMatch[2];
        } else if (headerMatch) {
          title = headerMatch[1];
          if (title.toLowerCase().includes('introduction')) sectionType = 'introduction';
          else if (title.toLowerCase().includes('appendix')) sectionType = 'appendix';
        }

        currentSection = {
          title: title.trim(),
          sectionNumber,
          content: '',
          sectionType,
          topics: []
        };
        currentContent = [];
      } else {
        // Add content to current section
        currentContent.push(line);
      }
    }

    // Don't forget the last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n');
      currentSection.topics = this.extractTopics(currentSection.content);
      sections.push(currentSection);
    }

    return sections.filter(section => section.content.length > 50);
  }

  private looksLikeHeader(line: string, lines: string[], index: number): boolean {
    // Check if line is likely a header based on context
    if (line.length > 50 || line.length < 10) return false;
    if (index === 0) return true;
    
    const nextLine = lines[index + 1];
    const prevLine = lines[index - 1];
    
    // Header often followed by longer content
    if (nextLine && nextLine.length > line.length * 1.5) return true;
    // Header often preceded by short line or nothing
    if (!prevLine || prevLine.length < line.length * 0.8) return true;
    
    return false;
  }

  extractTopics(sectionContent: string): ExtractedTopic[] {
    const topics: ExtractedTopic[] = [];
    const paragraphs = sectionContent.split('\n\n');

    paragraphs.forEach((paragraph, index) => {
      if (paragraph.trim().length < 50) return;

      let topicType: ExtractedTopic['topicType'] = 'concept';
      let difficulty: ExtractedTopic['difficulty'] | undefined;

      // Determine topic type
      if (paragraph.toLowerCase().includes('example') || 
          paragraph.toLowerCase().includes('solve') ||
          paragraph.match(/\d+\.\s/)) {
        topicType = 'example';
      } else if (paragraph.toLowerCase().includes('exercise') ||
                 paragraph.toLowerCase().includes('practice') ||
                 paragraph.toLowerCase().includes('problem')) {
        topicType = 'exercise';
      } else if (paragraph.toLowerCase().includes('test') ||
                 paragraph.toLowerCase().includes('quiz') ||
                 paragraph.toLowerCase().includes('assessment')) {
        topicType = 'assessment';
      }

      // Determine difficulty
      if (paragraph.toLowerCase().includes('basic') || 
          paragraph.toLowerCase().includes('introduction')) {
        difficulty = 'basic';
      } else if (paragraph.toLowerCase().includes('advanced') ||
                 paragraph.toLowerCase().includes('challenging')) {
        difficulty = 'advanced';
      } else {
        difficulty = 'intermediate';
      }

      // Extract title (first sentence or line)
      const firstSentence = paragraph.split(/[.!?]/)[0];
      const title = firstSentence.length > 100 ? 
                   firstSentence.substring(0, 100) + '...' : 
                   firstSentence;

      topics.push({
        title: title.trim(),
        content: paragraph.trim(),
        topicType,
        difficulty,
        keywords: this.extractKeywords(paragraph)
      });
    });

    return topics;
  }

  async extractFromPDF(filePath: string): Promise<ExtractedDocument> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const filename = path.basename(filePath);
    
    const fileInfo = this.parseFilename(filename);
    const sections = this.extractSections(pdfData.text);
    const keywords = this.extractKeywords(pdfData.text);

    // Extract title from first few lines or use filename
    const lines = pdfData.text.split('\n').slice(0, 10);
    let title = filename.replace('.pdf', '');
    for (const line of lines) {
      if (line.trim().length > 10 && line.trim().length < 100) {
        title = line.trim();
        break;
      }
    }

    return {
      filename,
      title,
      grade: fileInfo?.grade,
      subject: fileInfo?.subject || 'Mathematics',
      publisher: fileInfo?.series,
      version: fileInfo?.version,
      totalPages: pdfData.numpages,
      rawText: pdfData.text,
      sections,
      keywords
    };
  }

  async saveToDatabase(extracted: ExtractedDocument) {
    try {
      // Check if document already exists
      const existing = await db.select()
        .from(schema.documents)
        .where(eq(schema.documents.filename, extracted.filename));

      if (existing.length > 0) {
        console.log(`Document ${extracted.filename} already exists, skipping...`);
        return;
      }

      // Insert document
      const [doc] = await db.insert(schema.documents).values({
        filename: extracted.filename,
        title: extracted.title,
        grade: extracted.grade,
        subject: extracted.subject,
        publisher: extracted.publisher,
        version: extracted.version,
        totalPages: extracted.totalPages,
        extractedAt: new Date(),
        rawText: extracted.rawText,
        metadata: JSON.stringify({
          sectionsCount: extracted.sections.length,
          keywordsCount: extracted.keywords.length
        })
      }).returning();

      console.log(`Inserted document: ${extracted.title}`);

      // Insert sections and topics
      for (const section of extracted.sections) {
        const [sectionRecord] = await db.insert(schema.sections).values({
          documentId: doc.id,
          title: section.title,
          sectionNumber: section.sectionNumber,
          startPage: section.startPage,
          endPage: section.endPage,
          content: section.content,
          sectionType: section.sectionType
        }).returning();

        console.log(`  - Added section: ${section.title}`);

        // Insert topics for this section
        for (const topic of section.topics) {
          const [topicRecord] = await db.insert(schema.topics).values({
            sectionId: sectionRecord.id,
            title: topic.title,
            description: topic.description,
            pageNumber: topic.pageNumber,
            content: topic.content,
            difficulty: topic.difficulty,
            topicType: topic.topicType
          }).returning();

          // Insert topic keywords
          for (const keyword of topic.keywords) {
            await this.insertKeyword(keyword, undefined, topicRecord.id);
          }
        }
      }

      // Insert document-level keywords
      for (const keyword of extracted.keywords) {
        await this.insertKeyword(keyword, doc.id, undefined);
      }

    } catch (error) {
      console.error(`Error saving document ${extracted.filename}:`, error);
      throw error;
    }
  }

  private async insertKeyword(keywordText: string, documentId?: number, topicId?: number) {
    try {
      // Find or create keyword
      let keyword = await db.select()
        .from(schema.keywords)
        .where(eq(schema.keywords.keyword, keywordText));

      if (keyword.length === 0) {
        [keyword[0]] = await db.insert(schema.keywords).values({
          keyword: keywordText,
          frequency: 1
        }).returning();
      } else {
        // Update frequency
        await db.update(schema.keywords)
          .set({ frequency: (keyword[0]?.frequency || 0) + 1 })
          .where(eq(schema.keywords.id, keyword[0].id));
      }

      // Link to document or topic
      if (documentId) {
        await db.insert(schema.documentKeywords).values({
          documentId,
          keywordId: keyword[0].id,
          frequency: 1
        }).onConflictDoNothing();
      }

      if (topicId) {
        await db.insert(schema.topicKeywords).values({
          topicId,
          keywordId: keyword[0].id,
          frequency: 1
        }).onConflictDoNothing();
      }
    } catch (error: any) {
      console.log(`Warning: Could not insert keyword "${keywordText}":`, error?.message || error);
    }
  }
}

async function main() {
  console.log('Initializing database...');
  initDB();

  if (!fs.existsSync(pdfsDir)) {
    console.log('PDFs directory does not exist');
    return;
  }

  const files = fs.readdirSync(pdfsDir).filter(f => f.endsWith('.pdf'));
  if (files.length === 0) {
    console.log('No PDF files found');
    return;
  }

  const extractor = new CurriculumExtractor();

  console.log(`Processing ${files.length} PDF files...`);
  for (const file of files) {
    const fullPath = path.join(pdfsDir, file);
    console.log(`\nExtracting: ${file}`);
    
    try {
      const extracted = await extractor.extractFromPDF(fullPath);
      console.log(`  - Title: ${extracted.title}`);
      console.log(`  - Grade: ${extracted.grade || 'Unknown'}`);
      console.log(`  - Pages: ${extracted.totalPages}`);
      console.log(`  - Sections: ${extracted.sections.length}`);
      console.log(`  - Keywords: ${extracted.keywords.length}`);
      
      await extractor.saveToDatabase(extracted);
      console.log(`✓ Successfully processed ${file}`);
    } catch (error: any) {
      console.error(`✗ Error processing ${file}:`, error?.message || error);
    }
  }

  console.log('\n🎉 PDF extraction and database import complete!');
}

main().catch(console.error);
