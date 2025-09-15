import { NextRequest, NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

interface LessonAnalysis {
  lesson_id: string;
  title: string;
  grade: string;
  unit: number;
  lesson_number: number;
  standards: string[];
  key_concepts: string[];
  learning_objectives: string[];
  png_files: string[];
  session_count: number;
  estimated_duration: string;
  prerequisite_skills: string[];
  assessment_types: string[];
  content_analysis: {
    primary_topics: string[];
    difficulty_indicators: string[];
    visual_elements: string[];
    problem_types: string[];
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const unit = searchParams.get('unit');
    const lesson = searchParams.get('lesson');

    if (!grade || !unit || !lesson) {
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: grade, unit, lesson'
      }, { status: 400 });
    }

    const dbPath = path.join(process.cwd(), 'curriculum_precise.db');
    const db = new Database(dbPath, { readonly: true });

    // Get lesson details
    const lessonQuery = `
      SELECT 
        l.id,
        l.lesson_number,
        l.title,
        l.unit_theme,
        l.standards,
        l.start_page,
        l.end_page,
        l.estimated_days,
        d.grade,
        d.volume,
        d.filename
      FROM lessons l
      JOIN documents d ON l.document_id = d.id
      WHERE d.grade = ? 
        AND l.lesson_number = ?
      LIMIT 1
    `;

    const lessonData = db.prepare(lessonQuery).get(grade, lesson) as any;

    if (!lessonData) {
      db.close();
      return NextResponse.json({
        success: false,
        error: `Lesson not found: Grade ${grade}, Lesson ${lesson}`
      }, { status: 404 });
    }

    // Get session count for this lesson
    const sessionQuery = `
      SELECT COUNT(*) as session_count 
      FROM sessions 
      WHERE lesson_id = ?
    `;
    const sessionResult = db.prepare(sessionQuery).get(lessonData.id) as any;
    const sessionCount = sessionResult?.session_count || 0;

    // Look for PNG files in the lesson directory
    const pngFiles = await findLessonPngFiles(grade, unit, lesson);

    // Parse JSON fields safely
    let standards: string[] = [];
    let key_concepts: string[] = [];
    let learning_objectives: string[] = [];

    try {
      if (lessonData.standards && lessonData.standards !== 'null') {
        standards = JSON.parse(lessonData.standards);
      }
    } catch (e) {
      standards = [];
    }

    // Extract concepts from title since they're not in DB
    key_concepts = extractConceptsFromTitle(lessonData.title);
    learning_objectives = [`Understand ${lessonData.title}`];
    
    // Extract unit number from title or estimate
    const unitNumber = extractUnitFromTitle(lessonData.title) || Math.ceil(parseInt(lesson) / 6);

    // Analyze content based on title and available data
    const contentAnalysis = analyzeContent(lessonData.title, pngFiles, key_concepts);

    const analysis: LessonAnalysis = {
      lesson_id: `grade-${grade}-unit-${unitNumber}-lesson-${lesson}`,
      title: lessonData.title,
      grade: grade.toString(),
      unit: unitNumber,
      lesson_number: parseInt(lesson),
      standards,
      key_concepts,
      learning_objectives,
      png_files: pngFiles,
      session_count: sessionCount,
      estimated_duration: lessonData.estimated_days ? `${lessonData.estimated_days} days` : estimateDuration(sessionCount, pngFiles.length),
      prerequisite_skills: [], // Not available in current schema
      assessment_types: inferAssessmentTypes(lessonData.title, pngFiles),
      content_analysis: contentAnalysis
    };

    db.close();

    return NextResponse.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error('Error analyzing lesson:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze lesson'
    }, { status: 500 });
  }
}

async function findLessonPngFiles(grade: string, unit: string, lesson: string): Promise<string[]> {
  const pngFiles: string[] = [];
  
  // Common paths where PNG files might be located
  const possiblePaths = [
    path.join(process.cwd(), 'public', 'curriculum', `grade${grade}`, `unit${unit}`, `lesson${lesson}`),
    path.join(process.cwd(), 'curriculum_images', `grade${grade}`, `unit${unit}`, `lesson${lesson}`),
    path.join(process.cwd(), 'assets', 'lessons', `grade${grade}`, `unit${unit}`, `lesson${lesson}`),
    path.join(process.cwd(), 'static', 'images', `grade${grade}`, `unit${unit}`, `lesson${lesson}`)
  ];

  for (const dirPath of possiblePaths) {
    try {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        const pngs = files
          .filter(file => file.toLowerCase().endsWith('.png'))
          .map(file => path.join(dirPath, file));
        pngFiles.push(...pngs);
      }
    } catch (error) {
      // Directory doesn't exist or can't be read, continue
      continue;
    }
  }

  return pngFiles;
}

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

function analyzeContent(title: string, pngFiles: string[], keyConcepts: string[]) {
  const titleLower = title.toLowerCase();
  
  // Analyze primary topics
  const topicKeywords = {
    'number_operations': ['add', 'subtract', 'multiply', 'divide', 'operation', 'arithmetic'],
    'fractions': ['fraction', 'numerator', 'denominator', 'mixed number'],
    'decimals': ['decimal', 'decimal point', 'place value'],
    'geometry': ['angle', 'triangle', 'rectangle', 'circle', 'polygon', 'area', 'perimeter', 'volume'],
    'algebra': ['variable', 'equation', 'expression', 'solve', 'unknown'],
    'ratios_proportions': ['ratio', 'proportion', 'rate', 'percent', 'percentage'],
    'statistics': ['data', 'graph', 'chart', 'mean', 'median', 'mode', 'statistics'],
    'measurement': ['measure', 'length', 'width', 'height', 'weight', 'capacity']
  };

  const primary_topics: string[] = [];
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => titleLower.includes(keyword))) {
      primary_topics.push(topic);
    }
  });

  // Analyze difficulty indicators
  const difficulty_indicators: string[] = [];
  if (titleLower.includes('introduction') || titleLower.includes('basic')) {
    difficulty_indicators.push('introductory');
  }
  if (titleLower.includes('advanced') || titleLower.includes('complex')) {
    difficulty_indicators.push('advanced');
  }
  if (titleLower.includes('problem solving') || titleLower.includes('application')) {
    difficulty_indicators.push('application');
  }
  if (titleLower.includes('review') || titleLower.includes('practice')) {
    difficulty_indicators.push('review');
  }

  // Analyze visual elements based on PNG files
  const visual_elements: string[] = [];
  if (pngFiles.length > 0) {
    visual_elements.push('images');
    if (pngFiles.some(file => file.includes('diagram'))) {
      visual_elements.push('diagrams');
    }
    if (pngFiles.some(file => file.includes('graph'))) {
      visual_elements.push('graphs');
    }
    if (pngFiles.some(file => file.includes('chart'))) {
      visual_elements.push('charts');
    }
  }

  // Infer problem types
  const problem_types: string[] = [];
  if (titleLower.includes('word problem') || titleLower.includes('story problem')) {
    problem_types.push('word_problems');
  }
  if (titleLower.includes('calculation') || titleLower.includes('compute')) {
    problem_types.push('computational');
  }
  if (titleLower.includes('reasoning') || titleLower.includes('explain')) {
    problem_types.push('reasoning');
  }
  if (titleLower.includes('model') || titleLower.includes('represent')) {
    problem_types.push('modeling');
  }

  return {
    primary_topics,
    difficulty_indicators,
    visual_elements,
    problem_types
  };
}

function estimateDuration(sessionCount: number, imageCount: number): string {
  let baseDuration = 45; // Base 45 minutes per lesson
  
  if (sessionCount > 0) {
    baseDuration = sessionCount * 20; // 20 minutes per session
  }
  
  // Add time for image analysis
  if (imageCount > 3) {
    baseDuration += Math.min(imageCount * 5, 30); // Max 30 extra minutes
  }
  
  if (baseDuration < 30) return '30-45 minutes';
  if (baseDuration < 60) return '45-60 minutes';
  if (baseDuration < 90) return '60-90 minutes';
  return '90+ minutes';
}

function inferAssessmentTypes(title: string, pngFiles: string[]): string[] {
  const titleLower = title.toLowerCase();
  const assessmentTypes: string[] = [];
  
  if (titleLower.includes('quiz') || titleLower.includes('test')) {
    assessmentTypes.push('quiz');
  }
  if (titleLower.includes('project') || titleLower.includes('investigation')) {
    assessmentTypes.push('project');
  }
  if (titleLower.includes('practice') || titleLower.includes('exercise')) {
    assessmentTypes.push('practice');
  }
  if (titleLower.includes('discussion') || titleLower.includes('explain')) {
    assessmentTypes.push('discussion');
  }
  
  // Default assessment types based on content
  if (assessmentTypes.length === 0) {
    assessmentTypes.push('formative_assessment');
    if (pngFiles.length > 2) {
      assessmentTypes.push('visual_analysis');
    }
  }
  
  return assessmentTypes;
}
