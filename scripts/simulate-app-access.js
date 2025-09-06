#!/usr/bin/env node

/**
 * Simple application test to demonstrate the curriculum data is now accessible
 * This simulates how the main Next.js application would access the data
 */

const Database = require('better-sqlite3');

function simulateAppDataAccess() {
  console.log('🎯 Simulating application data access...');
  
  const db = new Database('./prisma/curriculum.db');
  
  try {
    // Simulate API endpoint: GET /api/documents
    const documents = db.prepare(`
      SELECT id, title, grade_level, volume, page_count
      FROM documents 
      ORDER BY grade_level, volume
    `).all();
    
    console.log('\n📚 Available Documents (API: /api/documents):');
    documents.forEach(doc => {
      console.log(`   ${doc.id}: ${doc.title} (${doc.page_count} pages)`);
    });
    
    // Simulate API endpoint: GET /api/documents/[id]/units
    const docId = documents[2].id; // Grade 7 V1
    const units = db.prepare(`
      SELECT u.id, u.unit_number, u.title, u.theme,
             COUNT(l.id) as lesson_count
      FROM units u
      LEFT JOIN lessons l ON u.id = l.unit_id
      WHERE u.document_id = ?
      GROUP BY u.id
      ORDER BY CAST(u.unit_number AS INTEGER)
    `).all(docId);
    
    console.log(`\n📂 Units for ${documents[2].title} (API: /api/documents/${docId}/units):`);
    units.forEach(unit => {
      console.log(`   Unit ${unit.unit_number}: ${unit.title} (${unit.lesson_count} lessons)`);
    });
    
    // Simulate API endpoint: GET /api/units/[id]/lessons
    const unitId = units[0].id; // General lessons unit which has content
    const lessons = db.prepare(`
      SELECT l.id, l.lesson_number, l.title, l.focus_type, l.instructional_days,
             COUNT(s.id) as session_count
      FROM lessons l
      LEFT JOIN sessions s ON l.id = s.lesson_id
      WHERE l.unit_id = ?
      GROUP BY l.id
      ORDER BY CAST(l.lesson_number AS INTEGER)
      LIMIT 5
    `).all(unitId);
    
    console.log(`\n📝 Lessons in Unit (API: /api/units/${unitId}/lessons):`);
    lessons.forEach(lesson => {
      console.log(`   Lesson ${lesson.lesson_number}: ${lesson.title.substring(0, 60)}...`);
      console.log(`      Focus: ${lesson.focus_type || 'Unknown'} | Days: ${lesson.instructional_days || 2} | Sessions: ${lesson.session_count}`);
    });
    
    // Simulate API endpoint: GET /api/lessons/[id]/sessions
    if (lessons.length > 0) {
      const lessonId = lessons[0].id;
      const sessions = db.prepare(`
        SELECT s.id, s.session_number, s.title, s.session_type, 
               LENGTH(s.content) as content_length,
               COUNT(DISTINCT a.id) as activity_count,
               COUNT(DISTINCT p.id) as problem_count
        FROM sessions s
        LEFT JOIN activities a ON s.id = a.session_id
        LEFT JOIN problems p ON s.id = p.session_id
        WHERE s.lesson_id = ?
        GROUP BY s.id
        ORDER BY CAST(s.session_number AS INTEGER)
        LIMIT 3
      `).all(lessonId);
      
      console.log(`\n⏱️ Sessions for Lesson (API: /api/lessons/${lessonId}/sessions):`);
      sessions.forEach(session => {
        console.log(`   Session ${session.session_number}: ${(session.title || 'Untitled').substring(0, 40)}...`);
        console.log(`      Type: ${session.session_type} | Content: ${session.content_length} chars | Activities: ${session.activity_count} | Problems: ${session.problem_count}`);
      });
    } else {
      console.log('\n⏱️ No lessons found in this unit.');
    }
    
    console.log('\n✅ Application simulation complete!');
    console.log('🎉 The curriculum data is now fully accessible through standard database queries!');
    console.log('💡 The Next.js application can now display rich curriculum content.');
    
  } finally {
    db.close();
  }
}

simulateAppDataAccess();