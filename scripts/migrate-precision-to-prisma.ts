#!/usr/bin/env tsx

/**
 * Migration script to transfer data from precision database to Prisma database
 * This addresses the issue where curriculum data is extracted but not integrated
 * into the main application database.
 */

import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';

interface PrecisionDocument {
  id: number;
  filename: string;
  grade: number;
  volume: string;
  total_pages: number;
  extraction_date: string;
  extraction_quality_score: number;
}

interface PrecisionLesson {
  id: number;
  document_id: number;
  lesson_number: number;
  title: string;
  unit_theme: string;
  start_page: number;
  end_page: number;
  standards: string;
  is_major_work: boolean;
  estimated_days: number;
  content_quality_score: number;
}

interface PrecisionSession {
  id: number;
  lesson_id: number;
  session_number: number;
  title: string;
  session_type: string;
  content: string;
  start_page: number;
  activities_count: number;
  problems_count: number;
}

interface PrecisionActivity {
  id: number;
  session_id: number;
  activity_type: string;
  content: string;
  page_number: number;
}

interface PrecisionProblem {
  id: number;
  session_id: number;
  problem_number: number;
  problem_text: string;
  page_number: number;
}

class PrecisionToPrismaMigrator {
  private precisionDb: Database.Database;
  private prismaDb: Database.Database;
  private documentMap = new Map<number, string>(); // precision_id -> prisma_id
  private unitMap = new Map<string, string>(); // unit_key -> prisma_id
  private lessonMap = new Map<number, string>(); // precision_id -> prisma_id
  private sessionMap = new Map<number, string>(); // precision_id -> prisma_id

  constructor() {
    this.precisionDb = new Database('./curriculum_precise.db');
    this.prismaDb = new Database('./prisma/curriculum.db');
  }

  async migrate() {
    console.log('🚀 Starting precision database to Prisma migration...');

    try {
      // Clear existing data
      await this.clearPrismaData();

      // Migrate documents and create units
      await this.migrateDocuments();

      // Migrate lessons
      await this.migrateLessons();

      // Migrate sessions
      await this.migrateSessions();

      // Migrate activities
      await this.migrateActivities();

      // Migrate problems
      await this.migrateProblems();

      console.log('✅ Migration completed successfully!');
      await this.printSummary();

    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    } finally {
      this.precisionDb.close();
      this.prismaDb.close();
    }
  }

  private clearPrismaData() {
    console.log('🧹 Clearing existing Prisma data...');
    
    const tables = ['problems', 'activities', 'sessions', 'lessons', 'units', 'documents'];
    for (const table of tables) {
      const deleteStmt = this.prismaDb.prepare(`DELETE FROM ${table}`);
      deleteStmt.run();
    }
  }

  private migrateDocuments() {
    console.log('📚 Migrating documents...');

    const documents = this.precisionDb.prepare(`
      SELECT * FROM documents ORDER BY grade, volume
    `).all() as PrecisionDocument[];

    for (const doc of documents) {
      const prismaDocId = randomUUID();
      this.documentMap.set(doc.id, prismaDocId);

      // Insert document
      this.prismaDb.prepare(`
        INSERT INTO documents (id, filename, title, grade_level, volume, subject, publisher, content, page_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `).run(
        prismaDocId,
        doc.filename,
        `Ready Classroom Mathematics Grade ${doc.grade} Volume ${doc.volume}`,
        doc.grade.toString(),
        doc.volume,
        'Mathematics',
        'Ready Classroom Mathematics',
        'Curriculum content extracted from PDF',
        doc.total_pages
      );

      // Create units based on unique unit themes for this document
      const unitThemes = this.precisionDb.prepare(`
        SELECT DISTINCT unit_theme, MIN(lesson_number) as first_lesson
        FROM lessons 
        WHERE document_id = ? AND unit_theme IS NOT NULL AND unit_theme != ''
        ORDER BY first_lesson
      `).all(doc.id) as Array<{unit_theme: string, first_lesson: number}>;

      let unitNumber = 1;
      for (const theme of unitThemes) {
        const unitId = randomUUID();
        const unitKey = `${doc.id}_${theme.unit_theme}`;
        this.unitMap.set(unitKey, unitId);

        this.prismaDb.prepare(`
          INSERT INTO units (id, document_id, unit_number, title, theme, order_index, created_at)
          VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `).run(
          unitId,
          prismaDocId,
          unitNumber.toString(),
          theme.unit_theme || `Unit ${unitNumber}`,
          theme.unit_theme,
          unitNumber
        );

        unitNumber++;
      }

      // Create a default unit for lessons without unit_theme
      const defaultUnitId = randomUUID();
      const defaultUnitKey = `${doc.id}_default`;
      this.unitMap.set(defaultUnitKey, defaultUnitId);

      this.prismaDb.prepare(`
        INSERT INTO units (id, document_id, unit_number, title, theme, order_index, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        defaultUnitId,
        prismaDocId,
        '0',
        'General Lessons',
        null,
        0
      );
    }

    console.log(`✅ Migrated ${documents.length} documents`);
  }

  private migrateLessons() {
    console.log('📝 Migrating lessons...');

    const lessons = this.precisionDb.prepare(`
      SELECT * FROM lessons ORDER BY document_id, lesson_number
    `).all() as PrecisionLesson[];

    for (const lesson of lessons) {
      const prismaLessonId = randomUUID();
      this.lessonMap.set(lesson.id, prismaLessonId);

      // Determine which unit this lesson belongs to
      const unitKey = lesson.unit_theme && lesson.unit_theme.trim() 
        ? `${lesson.document_id}_${lesson.unit_theme}`
        : `${lesson.document_id}_default`;
      
      const unitId = this.unitMap.get(unitKey);
      if (!unitId) {
        throw new Error(`No unit found for lesson ${lesson.id} with key ${unitKey}`);
      }

      this.prismaDb.prepare(`
        INSERT INTO lessons (id, unit_id, lesson_number, title, standards, focus_type, instructional_days, page_start, page_end, order_index, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        prismaLessonId,
        unitId,
        lesson.lesson_number.toString(),
        lesson.title,
        lesson.standards || '[]',
        lesson.is_major_work ? 'major' : 'supporting',
        lesson.estimated_days || 2,
        lesson.start_page,
        lesson.end_page,
        lesson.lesson_number
      );
    }

    console.log(`✅ Migrated ${lessons.length} lessons`);
  }

  private migrateSessions() {
    console.log('⏱️ Migrating sessions...');

    const sessions = this.precisionDb.prepare(`
      SELECT * FROM sessions ORDER BY lesson_id, session_number
    `).all() as PrecisionSession[];

    for (const session of sessions) {
      const prismaSessionId = randomUUID();
      this.sessionMap.set(session.id, prismaSessionId);

      const lessonId = this.lessonMap.get(session.lesson_id);
      if (!lessonId) {
        throw new Error(`No lesson found for session ${session.id}`);
      }

      this.prismaDb.prepare(`
        INSERT INTO sessions (id, lesson_id, session_number, title, session_type, content, page_start, order_index, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        prismaSessionId,
        lessonId,
        session.session_number.toString(),
        session.title,
        session.session_type,
        session.content,
        session.start_page,
        session.session_number
      );
    }

    console.log(`✅ Migrated ${sessions.length} sessions`);
  }

  private migrateActivities() {
    console.log('🎯 Migrating activities...');

    const activities = this.precisionDb.prepare(`
      SELECT * FROM activities ORDER BY session_id, id
    `).all() as PrecisionActivity[];

    let count = 0;
    for (const activity of activities) {
      const sessionId = this.sessionMap.get(activity.session_id);
      if (!sessionId) {
        console.warn(`No session found for activity ${activity.id}, skipping`);
        continue;
      }

      this.prismaDb.prepare(`
        INSERT INTO activities (id, session_id, activity_type, title, content, order_index, created_at)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        randomUUID(),
        sessionId,
        activity.activity_type,
        null, // No title in precision schema
        activity.content,
        count % 100 // Simple ordering
      );

      count++;
    }

    console.log(`✅ Migrated ${count} activities`);
  }

  private migrateProblems() {
    console.log('🧮 Migrating problems...');

    const problems = this.precisionDb.prepare(`
      SELECT * FROM problems ORDER BY session_id, problem_number
    `).all() as PrecisionProblem[];

    let count = 0;
    for (const problem of problems) {
      const sessionId = this.sessionMap.get(problem.session_id);
      if (!sessionId) {
        console.warn(`No session found for problem ${problem.id}, skipping`);
        continue;
      }

      this.prismaDb.prepare(`
        INSERT INTO problems (id, session_id, problem_number, content, order_index, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `).run(
        randomUUID(),
        sessionId,
        problem.problem_number?.toString() || '',
        problem.problem_text,
        count % 100 // Simple ordering
      );

      count++;
    }

    console.log(`✅ Migrated ${count} problems`);
  }

  private async printSummary() {
    console.log('\n📊 Migration Summary:');
    
    const stats = [
      { table: 'documents', count: this.prismaDb.prepare('SELECT COUNT(*) as count FROM documents').get() },
      { table: 'units', count: this.prismaDb.prepare('SELECT COUNT(*) as count FROM units').get() },
      { table: 'lessons', count: this.prismaDb.prepare('SELECT COUNT(*) as count FROM lessons').get() },
      { table: 'sessions', count: this.prismaDb.prepare('SELECT COUNT(*) as count FROM sessions').get() },
      { table: 'activities', count: this.prismaDb.prepare('SELECT COUNT(*) as count FROM activities').get() },
      { table: 'problems', count: this.prismaDb.prepare('SELECT COUNT(*) as count FROM problems').get() }
    ];

    for (const stat of stats) {
      console.log(`   ${stat.table}: ${(stat.count as any).count}`);
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new PrecisionToPrismaMigrator();
  migrator.migrate().catch(console.error);
}

export { PrecisionToPrismaMigrator };