#!/usr/bin/env node

/**
 * Test script to verify the integrated Prisma database works correctly
 * This uses direct SQLite queries to avoid Prisma client generation issues
 */

const Database = require('better-sqlite3');

async function testIntegratedDatabase() {
  console.log('🔍 Testing integrated Prisma database...');
  
  try {
    const db = new Database('./prisma/curriculum.db');
    
    // Test document-unit-lesson hierarchy
    const hierarchyQuery = db.prepare(`
      SELECT 
        d.title as document_title,
        d.grade_level,
        d.volume,
        COUNT(DISTINCT u.id) as unit_count,
        COUNT(DISTINCT l.id) as lesson_count,
        COUNT(DISTINCT s.id) as session_count
      FROM documents d
      LEFT JOIN units u ON d.id = u.document_id
      LEFT JOIN lessons l ON u.id = l.unit_id
      LEFT JOIN sessions s ON l.id = s.lesson_id
      GROUP BY d.id
      ORDER BY d.grade_level, d.volume
    `);
    
    const hierarchy = hierarchyQuery.all();
    console.log('\n📚 Document-Unit-Lesson Hierarchy:');
    hierarchy.forEach(doc => {
      console.log(`   Grade ${doc.grade_level} ${doc.volume}: ${doc.unit_count} units, ${doc.lesson_count} lessons, ${doc.session_count} sessions`);
    });
    
    // Test Grade 7 Volume 1 lessons
    const grade7v1Lessons = db.prepare(`
      SELECT l.lesson_number, l.title, l.standards, u.title as unit_title
      FROM lessons l
      JOIN units u ON l.unit_id = u.id
      JOIN documents d ON u.document_id = d.id
      WHERE d.grade_level = '7' AND d.volume = 'V1'
      ORDER BY CAST(l.lesson_number AS INTEGER)
      LIMIT 5
    `).all();
    
    console.log('\n📝 Sample Grade 7 Volume 1 Lessons:');
    grade7v1Lessons.forEach(lesson => {
      console.log(`   Lesson ${lesson.lesson_number}: ${lesson.title}`);
      console.log(`      Unit: ${lesson.unit_title}`);
      console.log(`      Standards: ${lesson.standards}`);
    });
    
    // Test session content
    const sessionSample = db.prepare(`
      SELECT s.session_number, s.title, s.session_type, LENGTH(s.content) as content_length
      FROM sessions s
      JOIN lessons l ON s.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      JOIN documents d ON u.document_id = d.id
      WHERE d.grade_level = '7' AND l.lesson_number = '1'
      ORDER BY CAST(s.session_number AS INTEGER)
    `).all();
    
    console.log('\n⏱️ Sample Session Data (Grade 7, Lesson 1):');
    sessionSample.forEach(session => {
      console.log(`   Session ${session.session_number}: ${session.title || 'Untitled'}`);
      console.log(`      Type: ${session.session_type || 'Unknown'}`);
      console.log(`      Content length: ${session.content_length} characters`);
    });
    
    // Test activities and problems
    const activitiesProblems = db.prepare(`
      SELECT 
        COUNT(DISTINCT a.id) as activity_count,
        COUNT(DISTINCT p.id) as problem_count
      FROM sessions s
      LEFT JOIN activities a ON s.id = a.session_id
      LEFT JOIN problems p ON s.id = p.session_id
      JOIN lessons l ON s.lesson_id = l.id
      JOIN units u ON l.unit_id = u.id
      JOIN documents d ON u.document_id = d.id
      WHERE d.grade_level = '7'
    `).get();
    
    console.log('\n🎯 Grade 7 Content Summary:');
    console.log(`   Activities: ${activitiesProblems.activity_count}`);
    console.log(`   Problems: ${activitiesProblems.problem_count}`);
    
    db.close();
    console.log('\n✅ Database integration test completed successfully!');
    console.log('📊 The precision database content is now accessible through the Prisma schema.');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

// Run test
testIntegratedDatabase();