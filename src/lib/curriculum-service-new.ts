import { db } from '@/lib/db';

export interface SearchFilters {
  grade?: string;
  subject?: string;
  filename?: string;
}

export interface DocumentSummary {
  id: string;
  filename: string;
  title: string;
  grade_level: string | null;
  subject: string | null;
  contentPreview: string;
  created_at: Date;
}

export class CurriculumService {
  
  async getAllDocuments(): Promise<DocumentSummary[]> {
    const documents = await db.document.findMany({
      orderBy: { grade_level: 'asc' },
      select: {
        id: true,
        filename: true,
        title: true,
        grade_level: true,
        subject: true,
        content: true,
        created_at: true
      }
    });

    return documents.map(doc => ({
      ...doc,
      contentPreview: doc.content.slice(0, 200) + '...'
    }));
  }

  async getDocumentById(id: string) {
    return await db.document.findUnique({
      where: { id }
    });
  }

  async searchContent(query: string, filters?: SearchFilters) {
    const whereConditions: any = {};
    
    if (query) {
      whereConditions.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { filename: { contains: query, mode: 'insensitive' } }
      ];
    }

    if (filters?.grade) {
      whereConditions.grade_level = { contains: filters.grade };
    }

    if (filters?.subject) {
      whereConditions.subject = { contains: filters.subject, mode: 'insensitive' };
    }

    if (filters?.filename) {
      whereConditions.filename = { contains: filters.filename, mode: 'insensitive' };
    }

    return await db.document.findMany({
      where: whereConditions,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        filename: true,
        title: true,
        grade_level: true,
        subject: true,
        content: true,
        created_at: true
      }
    });
  }

  async getStats() {
    const documentCount = await db.document.count();
    
    const gradeDistribution = await db.document.groupBy({
      by: ['grade_level'],
      _count: {
        grade_level: true
      },
      orderBy: {
        grade_level: 'asc'
      }
    });

    const subjectDistribution = await db.document.groupBy({
      by: ['subject'],
      _count: {
        subject: true
      }
    });

    return {
      totalDocuments: documentCount,
      gradeDistribution,
      subjectDistribution
    };
  }

  // Helper method to extract content snippets around search terms
  extractSnippets(content: string, query: string, maxSnippets: number = 3): string[] {
    if (!query) return [];
    
    const words = query.toLowerCase().split(' ');
    const snippets: string[] = [];
    const sentences = content.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const sentenceLower = sentence.toLowerCase();
      const hasMatch = words.some(word => sentenceLower.includes(word));
      
      if (hasMatch && snippets.length < maxSnippets) {
        snippets.push(sentence.trim());
      }
    }
    
    return snippets;
  }
}

export const curriculumService = new CurriculumService();
