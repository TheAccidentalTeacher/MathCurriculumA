#!/usr/bin/env tsx
// Quick script to check what documents are in the database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');
    
    const documents = await prisma.document.findMany({
      select: {
        id: true,
        filename: true,
        title: true,
        grade_level: true,
        volume: true,
        subject: true,
        created_at: true,
        content: true
      },
      orderBy: [
        { grade_level: 'asc' },
        { volume: 'asc' }
      ]
    });

    console.log(`📚 Found ${documents.length} documents:\n`);
    
    for (const doc of documents) {
      console.log(`• ${doc.filename}`);
      console.log(`  ID: ${doc.id}`);
      console.log(`  Title: ${doc.title}`);
      console.log(`  Grade: ${doc.grade_level || 'N/A'}`);
      console.log(`  Volume: ${doc.volume || 'N/A'}`);
      console.log(`  Subject: ${doc.subject || 'N/A'}`);
      console.log(`  Content length: ${doc.content.length.toLocaleString()} characters`);
      console.log(`  Created: ${doc.created_at.toISOString()}`);
      console.log(`  Content preview: ${doc.content.substring(0, 100)}...`);
      console.log('');
    }

    // Check for Volume 2 specifically
    const volume2 = documents.find(d => d.filename === 'RCM07_NA_SW_V2.pdf');
    if (volume2) {
      console.log('✅ Volume 2 found in database');
      console.log(`   Content: ${volume2.content.length} characters`);
      if (volume2.content.length < 10000) {
        console.log('⚠️  Volume 2 content seems too short - may need re-extraction');
      }
    } else {
      console.log('❌ Volume 2 NOT found in database');
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
