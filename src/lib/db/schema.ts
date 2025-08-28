// Database schema for structured curriculum data
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  filename: text("filename").notNull().unique(),
  title: text("title"),
  grade: integer("grade"),
  subject: text("subject"),
  publisher: text("publisher"),
  version: text("version"),
  totalPages: integer("total_pages"),
  extractedAt: integer("extracted_at", { mode: "timestamp" }).notNull(),
  rawText: text("raw_text"),
  metadata: text("metadata", { mode: "json" }),
});

export const sections = sqliteTable("sections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: integer("document_id").notNull().references(() => documents.id),
  title: text("title").notNull(),
  sectionNumber: text("section_number"),
  startPage: integer("start_page"),
  endPage: integer("end_page"),
  content: text("content"),
  sectionType: text("section_type"), // chapter, unit, lesson, appendix
});

export const topics = sqliteTable("topics", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sectionId: integer("section_id").notNull().references(() => sections.id),
  title: text("title").notNull(),
  description: text("description"),
  pageNumber: integer("page_number"),
  content: text("content"),
  difficulty: text("difficulty"), // basic, intermediate, advanced
  topicType: text("topic_type"), // concept, example, exercise, assessment
});

export const keywords = sqliteTable("keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  keyword: text("keyword").notNull(),
  frequency: integer("frequency").default(1),
});

export const documentKeywords = sqliteTable("document_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  documentId: integer("document_id").notNull().references(() => documents.id),
  keywordId: integer("keyword_id").notNull().references(() => keywords.id),
  frequency: integer("frequency").default(1),
});

export const topicKeywords = sqliteTable("topic_keywords", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  topicId: integer("topic_id").notNull().references(() => topics.id),
  keywordId: integer("keyword_id").notNull().references(() => keywords.id),
  frequency: integer("frequency").default(1),
});

// Relations
export const documentsRelations = relations(documents, ({ many }) => ({
  sections: many(sections),
  keywords: many(documentKeywords),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  document: one(documents, {
    fields: [sections.documentId],
    references: [documents.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  section: one(sections, {
    fields: [topics.sectionId],
    references: [sections.id],
  }),
  keywords: many(topicKeywords),
}));

export const keywordsRelations = relations(keywords, ({ many }) => ({
  documents: many(documentKeywords),
  topics: many(topicKeywords),
}));
