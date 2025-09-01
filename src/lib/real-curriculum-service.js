const Database = require('better-sqlite3');
const path = require('path');

class RealCurriculumService {
  constructor() {
    const dbPath = path.join(process.cwd(), 'curriculum.db');
    this.db = new Database(dbPath);
    
    // Prepare frequently used statements
    this.getDocumentsStmt = this.db.prepare('SELECT * FROM documents ORDER BY grade');
    this.getSectionsStmt = this.db.prepare('SELECT * FROM sections ORDER BY document_id, start_page');
  }
  
  getAllDocuments() {
    return this.getDocumentsStmt.all();
  }
  
  getAllLessons() {
    // Get sections that are actual lessons (contain LESSON keyword and lesson numbers)
    const sections = this.db.prepare(`
      SELECT 
        s.*,
        d.grade,
        d.title as document_title
      FROM sections s
      JOIN documents d ON s.document_id = d.id
      WHERE s.title LIKE '%LESSON%' 
      AND (s.title LIKE '%LESSON 1%' OR s.title LIKE '%LESSON 2%' OR s.title LIKE '%LESSON 3%' 
           OR s.title LIKE '%LESSON 4%' OR s.title LIKE '%LESSON 5%' OR s.title LIKE '%LESSON 6%'
           OR s.title LIKE '%LESSON 7%' OR s.title LIKE '%LESSON 8%' OR s.title LIKE '%LESSON 9%'
           OR s.title LIKE '%LESSON 10%' OR s.title LIKE '%LESSON 11%' OR s.title LIKE '%LESSON 12%'
           OR s.title LIKE '%LESSON 13%' OR s.title LIKE '%LESSON 14%' OR s.title LIKE '%LESSON 15%'
           OR s.title LIKE '%LESSON 16%' OR s.title LIKE '%LESSON 17%' OR s.title LIKE '%LESSON 18%'
           OR s.title LIKE '%LESSON 19%' OR s.title LIKE '%LESSON 20%')
      ORDER BY d.grade, s.start_page
    `).all();
    
    return sections.map(section => this.enrichLessonData(section));
  }
  
  getLessonsByGrade(grades) {
    if (!Array.isArray(grades)) grades = [grades];
    const placeholders = grades.map(() => '?').join(',');
    
    const sections = this.db.prepare(`
      SELECT 
        s.*,
        d.grade,
        d.title as document_title
      FROM sections s
      JOIN documents d ON s.document_id = d.id
      WHERE d.grade IN (${placeholders})
      AND s.title LIKE '%LESSON%' 
      AND (s.title LIKE '%LESSON 1%' OR s.title LIKE '%LESSON 2%' OR s.title LIKE '%LESSON 3%' 
           OR s.title LIKE '%LESSON 4%' OR s.title LIKE '%LESSON 5%' OR s.title LIKE '%LESSON 6%'
           OR s.title LIKE '%LESSON 7%' OR s.title LIKE '%LESSON 8%' OR s.title LIKE '%LESSON 9%'
           OR s.title LIKE '%LESSON 10%' OR s.title LIKE '%LESSON 11%' OR s.title LIKE '%LESSON 12%'
           OR s.title LIKE '%LESSON 13%' OR s.title LIKE '%LESSON 14%' OR s.title LIKE '%LESSON 15%'
           OR s.title LIKE '%LESSON 16%' OR s.title LIKE '%LESSON 17%' OR s.title LIKE '%LESSON 18%'
           OR s.title LIKE '%LESSON 19%' OR s.title LIKE '%LESSON 20%')
      ORDER BY d.grade, s.start_page
    `).all(...grades);
    
    return sections.map(section => this.enrichLessonData(section));
  }
  
  enrichLessonData(section) {
    // Extract lesson number from title - it's embedded in the text
    const lessonMatch = section.title.match(/LESSON\s+(\d+)/i);
    const lessonNumber = lessonMatch ? parseInt(lessonMatch[1]) : null;
    
    // Clean up lesson title by extracting the main lesson name
    let cleanTitle = section.title;
    if (lessonMatch && lessonNumber) {
      // Try to extract lesson title after lesson number
      const titleMatch = section.title.match(/LESSON\s+\d+\s+(.+?)(?:\d+|©|\||$)/i);
      if (titleMatch && titleMatch[1]) {
        cleanTitle = titleMatch[1].trim();
      }
    }
    
    // Estimate days based on content complexity (3-5 days per lesson typical)
    const estimatedDays = lessonNumber ? Math.min(5, Math.max(3, Math.floor(lessonNumber / 3) + 3)) : 3;
    
    // Determine if this is major work based on keywords
    const majorWorkKeywords = [
      'ratio', 'proportion', 'linear', 'equation', 'expression', 'function',
      'algebra', 'statistics', 'probability', 'percent', 'scale', 'similar'
    ];
    const titleLower = cleanTitle.toLowerCase();
    const majorWork = majorWorkKeywords.some(keyword => titleLower.includes(keyword));
    
    // Determine difficulty/prerequisites
    const advancedKeywords = ['solve', 'analyze', 'apply', 'construct', 'prove', 'model'];
    const isAdvanced = advancedKeywords.some(keyword => titleLower.includes(keyword));
    
    return {
      id: section.id,
      title: cleanTitle,
      originalTitle: section.title,
      grade: section.grade,
      lessonNumber,
      startPage: section.start_page,
      endPage: section.end_page,
      content: section.content,
      estimatedDays,
      majorWork,
      isAdvanced,
      documentTitle: section.document_title,
      tags: this.generateTags(cleanTitle)
    };
  }
  
  generateTags(title) {
    const tags = [];
    const titleLower = title.toLowerCase();
    
    // Math domain tags
    if (titleLower.includes('ratio') || titleLower.includes('proportion')) tags.push('ratios-proportions');
    if (titleLower.includes('linear') || titleLower.includes('equation')) tags.push('linear-equations');
    if (titleLower.includes('expression')) tags.push('expressions');
    if (titleLower.includes('function')) tags.push('functions');
    if (titleLower.includes('geometry')) tags.push('geometry');
    if (titleLower.includes('statistics') || titleLower.includes('data')) tags.push('statistics');
    if (titleLower.includes('probability')) tags.push('probability');
    
    // Skill level tags
    if (titleLower.includes('introduce') || titleLower.includes('basic')) tags.push('foundational');
    if (titleLower.includes('apply') || titleLower.includes('solve')) tags.push('application');
    if (titleLower.includes('analyze') || titleLower.includes('construct')) tags.push('advanced');
    
    return tags;
  }
  
  generateCustomPathway(options = {}) {
    const {
      gradeRange = [7, 8],
      targetPopulation = 'accelerated',
      totalDays = 160,
      majorWorkFocus = 85, // percentage
      includePrerequisites = false
    } = options;
    
    // Get lessons for specified grades
    let allLessons = this.getLessonsByGrade(gradeRange);
    
    // Filter based on target population
    if (targetPopulation === 'accelerated') {
      // For accelerated students, prioritize major work and advanced lessons
      allLessons = allLessons.filter(lesson => 
        lesson.majorWork || lesson.isAdvanced
      );
    }
    
    // Sort by importance: major work first, then by grade and lesson number
    allLessons.sort((a, b) => {
      if (a.majorWork !== b.majorWork) return b.majorWork - a.majorWork; // Major work first
      if (a.grade !== b.grade) return a.grade - b.grade; // Lower grades first
      if (a.lessonNumber && b.lessonNumber) return a.lessonNumber - b.lessonNumber;
      return a.startPage - b.startPage; // Page order fallback
    });
    
    // Select lessons to fit within totalDays constraint
    const selectedLessons = [];
    let currentDays = 0;
    let majorWorkDays = 0;
    
    for (const lesson of allLessons) {
      if (currentDays + lesson.estimatedDays <= totalDays) {
        selectedLessons.push({
          ...lesson,
          sequenceNumber: selectedLessons.length + 1,
          pathway: targetPopulation,
          totalDaysAtThisPoint: currentDays + lesson.estimatedDays
        });
        
        currentDays += lesson.estimatedDays;
        if (lesson.majorWork) {
          majorWorkDays += lesson.estimatedDays;
        }
        
        // Check if we've met our major work focus
        const majorWorkPercentage = (majorWorkDays / currentDays) * 100;
        if (currentDays >= totalDays * 0.9 && majorWorkPercentage >= majorWorkFocus) {
          break;
        }
      }
    }
    
    return selectedLessons;
  }
  
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = { RealCurriculumService };
