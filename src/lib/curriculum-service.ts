import { db } from '@/lib/db';

export interface SearchFilters {
  grade?: number;
  subject?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  topicType?: 'concept' | 'example' | 'exercise' | 'assessment';
  sectionType?: 'chapter' | 'unit' | 'lesson' | 'appendix' | 'introduction';
}

export class CurriculumService {
  
  async getAllDocuments() {
    return await db.document.findMany({
      orderBy: { grade_level: 'asc' },
      include: {
        sections: {
          take: 3, // Preview of first 3 sections
          orderBy: { order_index: 'asc' }
        }
      }
    });
  }

  async getDocumentById(id: string) {
    return await db.document.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order_index: 'asc' },
          include: {
            topics: {
              orderBy: { order_index: 'asc' }
            }
          }
        }
      }
    });
  }

  async getSectionById(id: string) {
    return await db.section.findUnique({
      where: { id },
      include: {
        document: true,
        topics: {
          orderBy: { order_index: 'asc' },
          include: {
            keywords: {
              include: {
                keyword: true
              }
            }
          }
        }
      }
    });
  }

  async searchContent(query: string, filters: SearchFilters = {}) {
    const whereClause: any = {};
    
    // Build search conditions
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { sections: { some: { 
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ]
        }}},
        { sections: { some: { topics: { some: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ]
        }}}}},
      ];
    }

    // Apply filters
    if (filters.grade) {
      whereClause.grade_level = filters.grade.toString();
    }
    
    if (filters.subject) {
      whereClause.subject = { contains: filters.subject, mode: 'insensitive' };
    }

    const documents = await db.document.findMany({
      where: whereClause,
      include: {
        sections: {
          where: filters.sectionType ? { section_type: filters.sectionType } : undefined,
          include: {
            topics: {
              where: {
                ...(filters.difficulty && { difficulty: filters.difficulty }),
                ...(filters.topicType && { topic_type: filters.topicType })
              },
              take: 5 // Limit topics per section for search results
            }
          },
          take: 10 // Limit sections per document
        }
      },
      take: 20 // Limit documents
    });

    // Flatten results for easier display
    const results: any[] = [];
    documents.forEach(doc => {
      doc.sections.forEach(section => {
        section.topics.forEach(topic => {
          results.push({
            documentId: doc.id,
            documentTitle: doc.title,
            documentGrade: doc.grade_level,
            sectionId: section.id,
            sectionTitle: section.title,
            sectionType: section.section_type,
            topicId: topic.id,
            topicTitle: topic.title,
            topicContent: topic.content.substring(0, 500) + '...', // Truncate for display
            topicType: topic.topic_type,
            difficulty: topic.difficulty,
          });
        });
      });
    });

    return results;
  }

  async getKeywords(limit = 50) {
    return await db.keyword.findMany({
      include: {
        topics: {
          include: {
            topic: {
              include: {
                section: {
                  include: {
                    document: true
                  }
                }
              }
            }
          }
        }
      },
      take: limit,
      orderBy: { word: 'asc' }
    });
  }

  async getTopicsByKeyword(keyword: string) {
    const results = await db.topic.findMany({
      where: {
        keywords: {
          some: {
            keyword: {
              word: { contains: keyword, mode: 'insensitive' }
            }
          }
        }
      },
      include: {
        section: {
          include: {
            document: true
          }
        },
        keywords: {
          include: {
            keyword: true
          }
        }
      },
      take: 20
    });

    return results.map(topic => ({
      topicId: topic.id,
      topicTitle: topic.title,
      topicContent: topic.content,
      topicType: topic.topic_type,
      difficulty: topic.difficulty,
      sectionTitle: topic.section.title,
      documentTitle: topic.section.document.title,
      documentGrade: topic.section.document.grade_level,
    }));
  }

  async getStats() {
    const [docCount, sectionCount, topicCount, keywordCount] = await Promise.all([
      db.document.count(),
      db.section.count(),
      db.topic.count(),
      db.keyword.count(),
    ]);

    return {
      documents: docCount,
      sections: sectionCount,
      topics: topicCount,
      keywords: keywordCount,
    };
  }
}
