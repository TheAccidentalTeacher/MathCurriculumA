const Database = require('better-sqlite3');

console.log('🎯 COMPREHENSIVE CURRICULUM VISUALIZATION ANALYSIS\n');

const db = new Database('./curriculum_precise.db');

// Complete curriculum overview
console.log('📊 COMPLETE CURRICULUM SCOPE:');
const overview = db.prepare(`
  SELECT d.grade, d.volume, COUNT(DISTINCT l.lesson_number) as lessons, 
         COUNT(DISTINCT l.unit_theme) as units,
         d.total_pages
  FROM documents d 
  LEFT JOIN lessons l ON d.id = l.document_id 
  GROUP BY d.grade, d.volume 
  ORDER BY d.grade, d.volume
`).all();
console.table(overview);

// Mathematical topics requiring visualization by grade
console.log('\n🔍 MATHEMATICAL TOPICS REQUIRING VISUALIZATION:\n');

// Grade 6 Analysis
console.log('═══ GRADE 6 MATHEMATICS ═══');
const grade6Topics = db.prepare(`
  SELECT DISTINCT l.title, l.unit_theme, l.lesson_number
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = 6 
  ORDER BY l.lesson_number
  LIMIT 15
`).all();

const grade6Viz = grade6Topics.map(lesson => {
  const title = lesson.title.toLowerCase();
  let vizNeeded = [];
  
  if (title.includes('ratio') || title.includes('rate')) vizNeeded.push('Ratio/Rate Visualizations');
  if (title.includes('fraction') || title.includes('decimal')) vizNeeded.push('Number Line/Fraction Models');
  if (title.includes('expression') || title.includes('equation')) vizNeeded.push('Algebraic Expression Visualizer');
  if (title.includes('area') || title.includes('volume') || title.includes('surface')) vizNeeded.push('3D Geometry & Measurement');
  if (title.includes('coordinate') || title.includes('plot')) vizNeeded.push('Coordinate Plane Graphing');
  if (title.includes('percent')) vizNeeded.push('Percentage/Proportion Visualizations');
  
  return { lesson: lesson.lesson_number, title: lesson.title.substring(0, 50) + '...', visualizations: vizNeeded };
}).filter(item => item.visualizations.length > 0);

console.table(grade6Viz);

// Grade 7 Analysis  
console.log('\n═══ GRADE 7 MATHEMATICS ═══');
const grade7Topics = db.prepare(`
  SELECT DISTINCT l.title, l.unit_theme, l.lesson_number
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = 7 
  ORDER BY l.lesson_number
  LIMIT 15
`).all();

const grade7Viz = grade7Topics.map(lesson => {
  const title = lesson.title.toLowerCase();
  let vizNeeded = [];
  
  if (title.includes('proportion') || title.includes('scale')) vizNeeded.push('Proportional Reasoning Visualizer');
  if (title.includes('equation') || title.includes('expression')) vizNeeded.push('Algebraic Equation Solver/Grapher');
  if (title.includes('angle') || title.includes('triangle') || title.includes('circle')) vizNeeded.push('Dynamic Geometry Tools');
  if (title.includes('area') || title.includes('circumference')) vizNeeded.push('Area/Perimeter Calculators');
  if (title.includes('probability') || title.includes('sample')) vizNeeded.push('Statistical/Probability Simulations');
  if (title.includes('inequality') || title.includes('graph')) vizNeeded.push('Coordinate Graphing & Inequalities');
  
  return { lesson: lesson.lesson_number, title: lesson.title.substring(0, 50) + '...', visualizations: vizNeeded };
}).filter(item => item.visualizations.length > 0);

console.table(grade7Viz);

// Grade 8 Analysis
console.log('\n═══ GRADE 8 MATHEMATICS ═══');
const grade8Topics = db.prepare(`
  SELECT DISTINCT l.title, l.unit_theme, l.lesson_number
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = 8 
  ORDER BY l.lesson_number
  LIMIT 15
`).all();

const grade8Viz = grade8Topics.map(lesson => {
  const title = lesson.title.toLowerCase();
  let vizNeeded = [];
  
  if (title.includes('transformation') || title.includes('rotation') || title.includes('reflection')) vizNeeded.push('Transformation Visualizer');
  if (title.includes('function') || title.includes('linear')) vizNeeded.push('Function Graphing Tools');
  if (title.includes('system') || title.includes('equation')) vizNeeded.push('System of Equations Solver');
  if (title.includes('exponent') || title.includes('scientific notation')) vizNeeded.push('Exponential/Scientific Notation Tools');
  if (title.includes('volume') || title.includes('surface') || title.includes('cone') || title.includes('cylinder')) vizNeeded.push('3D Volume/Surface Area Tools');
  if (title.includes('scatter') || title.includes('correlation')) vizNeeded.push('Statistical Analysis Tools');
  
  return { lesson: lesson.lesson_number, title: lesson.title.substring(0, 50) + '...', visualizations: vizNeeded };
}).filter(item => item.visualizations.length > 0);

console.table(grade8Viz);

// Grade 9 (Algebra 1) Analysis
console.log('\n═══ GRADE 9 (ALGEBRA 1) ═══');
const grade9Topics = db.prepare(`
  SELECT DISTINCT l.title, l.unit_theme, l.lesson_number
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = 9 
  ORDER BY l.lesson_number
  LIMIT 15
`).all();

const grade9Viz = grade9Topics.map(lesson => {
  const title = lesson.title.toLowerCase();
  let vizNeeded = [];
  
  if (title.includes('quadratic') || title.includes('parabola')) vizNeeded.push('Quadratic Function Grapher');
  if (title.includes('exponential') || title.includes('growth')) vizNeeded.push('Exponential Function Visualizer');
  if (title.includes('system') || title.includes('linear')) vizNeeded.push('Linear Systems Visualizer');
  if (title.includes('factor') || title.includes('polynomial')) vizNeeded.push('Polynomial Factoring Tools');
  if (title.includes('radical') || title.includes('square root')) vizNeeded.push('Radical Expression Tools');
  if (title.includes('regression') || title.includes('data')) vizNeeded.push('Data Analysis & Regression Tools');
  
  return { lesson: lesson.lesson_number, title: lesson.title.substring(0, 50) + '...', visualizations: vizNeeded };
}).filter(item => item.visualizations.length > 0);

console.table(grade9Viz);

// Summary of visualization needs
console.log('\n🎯 COMPREHENSIVE VISUALIZATION REQUIREMENTS SUMMARY:');
const allVisualizationTypes = new Set();

[...grade6Viz, ...grade7Viz, ...grade8Viz, ...grade9Viz].forEach(item => {
  item.visualizations.forEach(viz => allVisualizationTypes.add(viz));
});

console.log('\n✅ REQUIRED VISUALIZATION CATEGORIES:');
Array.from(allVisualizationTypes).sort().forEach((viz, index) => {
  console.log(`${index + 1}. ${viz}`);
});

// Total scope statistics
console.log('\n📈 CURRICULUM SCALE:');
const totalStats = db.prepare(`
  SELECT 
    COUNT(DISTINCT d.grade) as total_grades,
    COUNT(DISTINCT l.lesson_number) as total_unique_lessons,
    COUNT(l.id) as total_lesson_instances,
    SUM(d.total_pages) as total_pages
  FROM documents d 
  LEFT JOIN lessons l ON d.id = l.document_id
`).get();

console.table(totalStats);

db.close();
