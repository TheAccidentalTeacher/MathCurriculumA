import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

interface CurriculumTopic {
  id: string;
  grade: string;
  unit: number;
  lesson: number;
  title: string;
  standards: string[];
  key_concepts: string[];
  prerequisites: string[];
  related_lessons: string[];
  difficulty_level: 'foundation' | 'developing' | 'mastery';
}

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'curriculum_precise.db');
    const db = new Database(dbPath, { readonly: true });

    // Query to get all lessons with their metadata
    const lessonsQuery = `
      SELECT 
        l.id,
        l.lesson_number,
        l.title,
        l.unit_theme,
        l.standards,
        d.grade,
        d.volume,
        l.start_page,
        l.end_page,
        l.estimated_days
      FROM lessons l
      JOIN documents d ON l.document_id = d.id
      WHERE l.title IS NOT NULL 
        AND l.title != ''
        AND l.lesson_number BETWEEN 1 AND 50
      ORDER BY d.grade, l.lesson_number
    `;

    const rawLessons = db.prepare(lessonsQuery).all() as any[];

    // Transform the raw data into CurriculumTopic format
    const topics: CurriculumTopic[] = rawLessons.map((lesson) => {
      // Parse JSON fields safely
      let standards: string[] = [];
      let key_concepts: string[] = [];
      let prerequisites: string[] = [];

      try {
        if (lesson.standards && lesson.standards !== 'null') {
          standards = JSON.parse(lesson.standards);
        }
      } catch (e) {
        // If JSON parsing fails, try to extract standards from title
        standards = extractStandardsFromTitle(lesson.title);
      }

      // Extract key concepts from title since they're not in the DB
      key_concepts = extractConceptsFromTitle(lesson.title);

      // Extract unit number from lesson title or position
      const unitNumber = extractUnitFromTitle(lesson.title) || Math.ceil(lesson.lesson_number / 6);

      // Determine difficulty level based on lesson position and standards
      const difficulty_level = determineDifficultyLevel(
        lesson.lesson_number,
        unitNumber,
        standards
      );

      return {
        id: `grade-${lesson.grade}-unit-${unitNumber}-lesson-${lesson.lesson_number}`,
        grade: lesson.grade.toString(),
        unit: unitNumber,
        lesson: lesson.lesson_number,
        title: lesson.title,
        standards,
        key_concepts,
        prerequisites,
        related_lessons: [], // TODO: Implement relationship detection
        difficulty_level
      };
    });

    db.close();

    return NextResponse.json({
      success: true,
      topics,
      total: topics.length
    });

  } catch (error) {
    console.error('Error fetching curriculum topics:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch curriculum topics'
    }, { status: 500 });
  }
}

// Helper functions
function extractUnitFromTitle(title: string): number | null {
  // Try to extract unit number from title
  const unitMatch = title.match(/unit\s*(\d+)/i);
  if (unitMatch) {
    return parseInt(unitMatch[1]);
  }
  
  // Try to extract from "U1", "U2" patterns
  const uMatch = title.match(/U(\d+)/i);
  if (uMatch) {
    return parseInt(uMatch[1]);
  }
  
  return null;
}

function extractStandardsFromTitle(title: string): string[] {
  const standards: string[] = [];
  
  // Common Grade 6-8 standards patterns
  const standardPatterns = [
    /6\.RP\.\d+/g,  // Grade 6 Ratios and Proportional Relationships
    /6\.NS\.\d+/g,  // Grade 6 Number System
    /6\.EE\.\d+/g,  // Grade 6 Expressions and Equations
    /6\.G\.\d+/g,   // Grade 6 Geometry
    /6\.SP\.\d+/g,  // Grade 6 Statistics and Probability
    /7\.RP\.\d+/g,  // Grade 7 Ratios and Proportional Relationships
    /7\.NS\.\d+/g,  // Grade 7 Number System
    /7\.EE\.\d+/g,  // Grade 7 Expressions and Equations
    /7\.G\.\d+/g,   // Grade 7 Geometry
    /7\.SP\.\d+/g,  // Grade 7 Statistics and Probability
    /8\.NS\.\d+/g,  // Grade 8 Number System
    /8\.EE\.\d+/g,  // Grade 8 Expressions and Equations
    /8\.F\.\d+/g,   // Grade 8 Functions
    /8\.G\.\d+/g,   // Grade 8 Geometry
    /8\.SP\.\d+/g   // Grade 8 Statistics and Probability
  ];

  standardPatterns.forEach(pattern => {
    const matches = title.match(pattern);
    if (matches) {
      standards.push(...matches);
    }
  });

  // If no explicit standards found, infer from content
  if (standards.length === 0) {
    standards.push(...inferStandardsFromContent(title));
  }

  return [...new Set(standards)]; // Remove duplicates
}

function extractConceptsFromTitle(title: string): string[] {
  const concepts: string[] = [];
  
  // Common mathematical concepts
  const conceptKeywords = [
    'fraction', 'decimal', 'percent', 'ratio', 'proportion', 'rate',
    'area', 'volume', 'perimeter', 'circumference', 'angle', 'triangle',
    'rectangle', 'circle', 'polygon', 'coordinate', 'graph', 'plot',
    'equation', 'expression', 'variable', 'constant', 'coefficient',
    'function', 'linear', 'slope', 'intercept', 'system',
    'probability', 'statistics', 'mean', 'median', 'mode', 'range',
    'data', 'sample', 'population', 'distribution'
  ];

  const titleLower = title.toLowerCase();
  conceptKeywords.forEach(concept => {
    if (titleLower.includes(concept)) {
      concepts.push(concept);
    }
  });

  return concepts;
}

function inferStandardsFromContent(title: string): string[] {
  const titleLower = title.toLowerCase();
  const standards: string[] = [];

  // Map content keywords to likely standards
  if (titleLower.includes('ratio') || titleLower.includes('proportion') || titleLower.includes('rate')) {
    standards.push('6.RP.1', '6.RP.2', '6.RP.3');
  }
  
  if (titleLower.includes('fraction') || titleLower.includes('decimal')) {
    standards.push('6.NS.1', '6.NS.2', '6.NS.3');
  }
  
  if (titleLower.includes('area') || titleLower.includes('volume') || titleLower.includes('geometry')) {
    standards.push('6.G.1', '6.G.2', '6.G.4');
  }
  
  if (titleLower.includes('expression') || titleLower.includes('equation')) {
    standards.push('6.EE.1', '6.EE.2', '6.EE.3');
  }
  
  if (titleLower.includes('data') || titleLower.includes('statistics')) {
    standards.push('6.SP.1', '6.SP.2', '6.SP.3');
  }

  return standards;
}

function determineDifficultyLevel(
  lessonNumber: number, 
  unitNumber: number, 
  standards: string[]
): 'foundation' | 'developing' | 'mastery' {
  // Early lessons in a unit are typically foundational
  if (lessonNumber <= 3) {
    return 'foundation';
  }
  
  // Later lessons are typically mastery
  if (lessonNumber >= 8) {
    return 'mastery';
  }
  
  // Check if standards indicate advanced concepts
  const advancedKeywords = ['system', 'function', 'coordinate', 'transformation'];
  const hasAdvancedConcepts = standards.some(standard => 
    advancedKeywords.some(keyword => standard.toLowerCase().includes(keyword))
  );
  
  if (hasAdvancedConcepts) {
    return 'mastery';
  }
  
  return 'developing';
}
