import { db, schema } from '@/lib/db';
import { eq, like, or, desc, asc } from 'drizzle-orm';

export interface SearchFilters {
  grade?: number;
  subject?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  topicType?: 'concept' | 'example' | 'exercise' | 'assessment';
  sectionType?: 'chapter' | 'unit' | 'lesson' | 'appendix' | 'introduction';
}

export class CurriculumService {
  
  async getAllDocuments() {
    return await db.select().from(schema.documents).orderBy(asc(schema.documents.grade));
  }

  async getDocumentById(id: number) {
    const [doc] = await db.select()
      .from(schema.documents)
      .where(eq(schema.documents.id, id));
    
    if (!doc) return null;

    const sections = await db.select()
      .from(schema.sections)
      .where(eq(schema.sections.documentId, id))
      .orderBy(asc(schema.sections.id));

    return { ...doc, sections };
  }

  async getSectionById(id: number) {
    const [section] = await db.select()
      .from(schema.sections)
      .where(eq(schema.sections.id, id));
    
    if (!section) return null;

    const topics = await db.select()
      .from(schema.topics)
      .where(eq(schema.topics.sectionId, id))
      .orderBy(asc(schema.topics.id));

    return { ...section, topics };
  }

  async searchContent(query: string, filters: SearchFilters = {}) {
    const searchTerm = `%${query.toLowerCase()}%`;
    
    // Build the where conditions
    let whereConditions: any[] = [];
    
    if (query) {
      whereConditions.push(
        or(
          like(schema.documents.title, searchTerm),
          like(schema.sections.title, searchTerm),
          like(schema.sections.content, searchTerm),
          like(schema.topics.title, searchTerm),
          like(schema.topics.content, searchTerm)
        )
      );
    }

    if (filters.grade) {
      whereConditions.push(eq(schema.documents.grade, filters.grade));
    }

    if (filters.subject) {
      whereConditions.push(eq(schema.documents.subject, filters.subject));
    }

    if (filters.difficulty) {
      whereConditions.push(eq(schema.topics.difficulty, filters.difficulty));
    }

    if (filters.topicType) {
      whereConditions.push(eq(schema.topics.topicType, filters.topicType));
    }

    if (filters.sectionType) {
      whereConditions.push(eq(schema.sections.sectionType, filters.sectionType));
    }

    // Search across documents, sections, and topics
    const results = await db.select({
      documentId: schema.documents.id,
      documentTitle: schema.documents.title,
      documentGrade: schema.documents.grade,
      sectionId: schema.sections.id,
      sectionTitle: schema.sections.title,
      sectionType: schema.sections.sectionType,
      topicId: schema.topics.id,
      topicTitle: schema.topics.title,
      topicContent: schema.topics.content,
      topicType: schema.topics.topicType,
      difficulty: schema.topics.difficulty,
    })
    .from(schema.documents)
    .leftJoin(schema.sections, eq(schema.sections.documentId, schema.documents.id))
    .leftJoin(schema.topics, eq(schema.topics.sectionId, schema.sections.id))
    .where(whereConditions.length > 0 ? whereConditions.reduce((a, b) => 
      whereConditions.indexOf(a) === 0 ? a : or(a, b)
    ) : undefined)
    .limit(50);

    return results;
  }

  async getKeywords(limit = 50) {
    return await db.select()
      .from(schema.keywords)
      .orderBy(desc(schema.keywords.frequency))
      .limit(limit);
  }

  async getTopicsByKeyword(keyword: string) {
    const results = await db.select({
      topicId: schema.topics.id,
      topicTitle: schema.topics.title,
      topicContent: schema.topics.content,
      topicType: schema.topics.topicType,
      difficulty: schema.topics.difficulty,
      sectionTitle: schema.sections.title,
      documentTitle: schema.documents.title,
      documentGrade: schema.documents.grade,
    })
    .from(schema.topics)
    .leftJoin(schema.topicKeywords, eq(schema.topicKeywords.topicId, schema.topics.id))
    .leftJoin(schema.keywords, eq(schema.keywords.id, schema.topicKeywords.keywordId))
    .leftJoin(schema.sections, eq(schema.sections.id, schema.topics.sectionId))
    .leftJoin(schema.documents, eq(schema.documents.id, schema.sections.documentId))
    .where(eq(schema.keywords.keyword, keyword))
    .limit(20);

    return results;
  }

  async getStats() {
    const [docCount] = await db.select({
      count: schema.documents.id
    }).from(schema.documents);

    const [sectionCount] = await db.select({
      count: schema.sections.id
    }).from(schema.sections);

    const [topicCount] = await db.select({
      count: schema.topics.id
    }).from(schema.topics);

    const [keywordCount] = await db.select({
      count: schema.keywords.id
    }).from(schema.keywords);

    return {
      documents: docCount?.count || 0,
      sections: sectionCount?.count || 0,
      topics: topicCount?.count || 0,
      keywords: keywordCount?.count || 0,
    };
  }
}
