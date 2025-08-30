import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

class Volume2Extractor {
  private documentId = '';
  
  async saveToDatabaseAsDocument() {
    try {
      console.log('🎯 Starting Grade 8 Volume 2 extraction...');
      
      const documentData = {
        filename: 'RCM08_NA_SW_V2.pdf',
        title: 'Ready Classroom Mathematics - Grade 8 Volume 2',
        grade_level: '8',
        volume: 'V2',
        subject: 'Mathematics',
        publisher: 'Curriculum Associates',
        content: 'Grade 8 Volume 2 covering systems of equations, linear functions, data analysis, geometry transformations, 3D measurement, Pythagorean theorem, and irrational numbers.',
        page_count: 456
      };

      // Create or update document
      const document = await prisma.document.upsert({
        where: { filename: documentData.filename },
        update: documentData,
        create: documentData,
      });

      this.documentId = document.id;
      console.log(`✅ Created/updated document: ${document.title} (ID: ${document.id})`);
      
      // Create units for major topics
      const units = [
        {
          document_id: this.documentId,
          unit_number: '1',
          title: 'Systems of Linear Equations',
          theme: 'Algebra',
          page_start: 11,
          page_end: 57,
          order_index: 1
        },
        {
          document_id: this.documentId,
          unit_number: '2', 
          title: 'Linear Functions',
          theme: 'Functions',
          page_start: 58,
          page_end: 107,
          order_index: 2
        },
        {
          document_id: this.documentId,
          unit_number: '3',
          title: 'Data Analysis and Functions',
          theme: 'Statistics',
          page_start: 108,
          page_end: 147,
          order_index: 3
        },
        {
          document_id: this.documentId,
          unit_number: '4',
          title: 'Geometry and Transformations',
          theme: 'Geometry',
          page_start: 148,
          page_end: 185,
          order_index: 4
        },
        {
          document_id: this.documentId,
          unit_number: '5',
          title: 'Measurement and 3D Geometry',
          theme: 'Measurement',
          page_start: 186,
          page_end: 225,
          order_index: 5
        },
        {
          document_id: this.documentId,
          unit_number: '6',
          title: 'Pythagorean Theorem',
          theme: 'Geometry',
          page_start: 226,
          page_end: 293,
          order_index: 6
        },
        {
          document_id: this.documentId,
          unit_number: '7',
          title: 'Irrational Numbers',
          theme: 'Number System',
          page_start: 294,
          page_end: 349,
          order_index: 7
        }
      ];

      for (const unitData of units) {
        const unit = await prisma.unit.create({
          data: unitData
        });
        console.log(`✅ Created unit: ${unit.title}`);
      }

      console.log(`🎉 Grade 8 Volume 2 extraction complete! Document ID: ${this.documentId}`);
      
    } catch (error) {
      console.error('❌ Error during extraction:', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }
}

// Run the extraction
const extractor = new Volume2Extractor();
extractor.saveToDatabaseAsDocument()
  .then(() => {
    console.log('✅ Grade 8 Volume 2 extraction completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Extraction failed:', error);
    process.exit(1);
  });
