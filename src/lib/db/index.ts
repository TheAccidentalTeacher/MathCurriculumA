import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";

const dbPath = path.join(process.cwd(), "curriculum.db");
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Initialize database with schema
export function initDB() {
  try {
    // Run migrations if they exist
    migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Creating database schema...");
    // If no migrations exist, create tables manually
    createTables();
  }
}

function createTables() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      title TEXT,
      grade INTEGER,
      subject TEXT,
      publisher TEXT,
      version TEXT,
      total_pages INTEGER,
      extracted_at INTEGER NOT NULL,
      raw_text TEXT,
      metadata TEXT
    );

    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id INTEGER NOT NULL REFERENCES documents(id),
      title TEXT NOT NULL,
      section_number TEXT,
      start_page INTEGER,
      end_page INTEGER,
      content TEXT,
      section_type TEXT
    );

    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL REFERENCES sections(id),
      title TEXT NOT NULL,
      description TEXT,
      page_number INTEGER,
      content TEXT,
      difficulty TEXT,
      topic_type TEXT
    );

    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      frequency INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS document_keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_id INTEGER NOT NULL REFERENCES documents(id),
      keyword_id INTEGER NOT NULL REFERENCES keywords(id),
      frequency INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS topic_keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL REFERENCES topics(id),
      keyword_id INTEGER NOT NULL REFERENCES keywords(id),
      frequency INTEGER DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_documents_grade ON documents(grade);
    CREATE INDEX IF NOT EXISTS idx_documents_subject ON documents(subject);
    CREATE INDEX IF NOT EXISTS idx_sections_document_id ON sections(document_id);
    CREATE INDEX IF NOT EXISTS idx_topics_section_id ON topics(section_id);
    CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON keywords(keyword);
  `);
  console.log("Database schema created successfully");
}

export { schema };
