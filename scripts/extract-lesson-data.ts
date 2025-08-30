// Script to help extract lesson page ranges from the curriculum data
// This will help us populate the accelerated pathway with accurate page numbers

import fs from 'fs';
import path from 'path';

interface PageData {
  page_number: number;
  text_preview: string;
  page_type: string;
}

interface LessonPageRange {
  lessonTitle: string;
  startPage: number;
  endPage: number;
  grade: number;
  volume: number;
  sessions: number;
}

class LessonExtractor {
  private volumes = [
    { grade: 7, volume: 1, path: '/workspaces/MathCurriculumA/webapp_pages/RCM07_NA_SW_V1/data/document.json' },
    { grade: 7, volume: 2, path: '/workspaces/MathCurriculumA/webapp_pages/RCM07_NA_SW_V2/data/document.json' },
    { grade: 8, volume: 1, path: '/workspaces/MathCurriculumA/webapp_pages/RCM08_NA_SW_V1/data/document.json' },
    { grade: 8, volume: 2, path: '/workspaces/MathCurriculumA/webapp_pages/RCM08_NA_SW_V2/data/document.json' }
  ];

  extractLessonsFromVolume(volumePath: string, grade: number, volume: number): LessonPageRange[] {
    try {
      const data = JSON.parse(fs.readFileSync(volumePath, 'utf-8'));
      const pages: PageData[] = data.pages;
      
      const lessons: LessonPageRange[] = [];
      let currentLesson: Partial<LessonPageRange> | null = null;
      
      for (const page of pages) {
        const text = page.text_preview;
        
        // Look for lesson starts (more comprehensive pattern)
        const lessonMatch = text.match(/LESSON (\d+)\s+([^|]+?)(?:\s+LESSON|\s+SESSION|\s*$)/i);
        if (lessonMatch && page.page_type === 'lesson') {
          // If we have a previous lesson, finalize it
          if (currentLesson && currentLesson.startPage) {
            lessons.push({
              ...currentLesson,
              endPage: page.page_number - 1
            } as LessonPageRange);
          }
          
          // Start new lesson
          currentLesson = {
            lessonTitle: lessonMatch[2].trim(),
            startPage: page.page_number,
            grade,
            volume,
            sessions: 1 // We'll count sessions as we go
          };
        }
        
        // Count sessions within current lesson
        if (currentLesson && text.includes('SESSION') && text.match(/SESSION\s+(\d+)/)) {
          const sessionMatch = text.match(/SESSION\s+(\d+)/);
          if (sessionMatch) {
            const sessionNum = parseInt(sessionMatch[1]);
            if (currentLesson.sessions !== undefined) {
              currentLesson.sessions = Math.max(currentLesson.sessions, sessionNum);
            }
          }
        }
      }
      
      // Finalize the last lesson
      if (currentLesson && currentLesson.startPage) {
        lessons.push({
          ...currentLesson,
          endPage: pages[pages.length - 1].page_number
        } as LessonPageRange);
      }
      
      return lessons;
    } catch (error) {
      console.error(`Error processing volume ${grade}-${volume}:`, error);
      return [];
    }
  }

  extractAllLessons(): Record<string, LessonPageRange[]> {
    const allLessons: Record<string, LessonPageRange[]> = {};
    
    for (const volume of this.volumes) {
      const key = `G${volume.grade}V${volume.volume}`;
      if (fs.existsSync(volume.path)) {
        allLessons[key] = this.extractLessonsFromVolume(volume.path, volume.grade, volume.volume);
        console.log(`Extracted ${allLessons[key].length} lessons from ${key}`);
      } else {
        console.log(`Volume data not found: ${volume.path}`);
      }
    }
    
    return allLessons;
  }

  generateAcceleratedPathwayData(): string {
    const allLessons = this.extractAllLessons();
    
    // Generate TypeScript code for the accelerated pathway
    let output = `// Auto-generated lesson data from curriculum extraction\n`;
    output += `// Generated on ${new Date().toISOString()}\n\n`;
    
    for (const [volumeKey, lessons] of Object.entries(allLessons)) {
      output += `// ${volumeKey} Lessons:\n`;
      lessons.forEach((lesson, index) => {
        output += `// ${index + 1}. ${lesson.lessonTitle} (Pages ${lesson.startPage}-${lesson.endPage}, ${lesson.sessions} sessions)\n`;
      });
      output += `\n`;
    }
    
    return output;
  }
}

// Run the extraction
const extractor = new LessonExtractor();
console.log(extractor.generateAcceleratedPathwayData());
