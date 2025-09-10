import fs from 'fs';
import path from 'path';

export interface SessionData {
  session_number: number;
  session_type: 'Explore' | 'Develop' | 'Refine';
  title: string;
  start_page: number;
  end_page: number;
  page_span: number;
  content_focus: string;
  activities: string[];
  inferred_type: boolean;
  estimated_duration: string;
}

export interface LessonData {
  lesson_number: number;
  title: string;
  start_page: number;
  standards_focus: string[];
  key_concepts: string[];
  sessions?: SessionData[];
  total_sessions?: number;
  session_validation?: {
    complete: boolean;
    missing_sessions: number[];
    sequence_valid: boolean;
  };
}

export interface UnitData {
  unit_number: number;
  title: string;
  description: string;
  lessons: LessonData[];
}

export interface VolumeData {
  volume_name: string;
  units: UnitData[];
}

export interface EnhancedCurriculumStructure {
  grade: number;
  title: string;
  curriculum_publisher: string;
  curriculum_type: string;
  total_pages?: number;
  total_lessons?: number;
  total_units?: number;
  volumes: { [key: string]: VolumeData };
  session_extraction_metadata?: {
    extraction_engine: string;
    extraction_stats: any;
    lessons_with_sessions: number;
    total_sessions_extracted: number;
  };
}

export class EnhancedCurriculumService {
  
  /**
   * Load enhanced curriculum structure with session data
   */
  static async loadEnhancedCurriculum(grade: number, volume: 'V1' | 'V2'): Promise<EnhancedCurriculumStructure | null> {
    try {
      const gradeMap: { [key: number]: string } = {
        6: 'GRADE6',
        7: 'GRADE7', 
        8: 'GRADE8',
        9: 'ALGEBRA1'
      };
      
      const gradeName = gradeMap[grade];
      if (!gradeName) return null;
      
      const filename = `${gradeName}_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_${volume}.json`;
      const filePath = path.join(process.cwd(), filename);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`Enhanced curriculum file not found: ${filename}`);
        return null;
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const curriculumData: EnhancedCurriculumStructure = JSON.parse(fileContent);
      
      return curriculumData;
      
    } catch (error) {
      console.error(`Error loading enhanced curriculum for Grade ${grade} ${volume}:`, error);
      return null;
    }
  }
  
  /**
   * Get all available enhanced curriculum structures
   */
  static async getAllEnhancedCurricula(): Promise<{ [key: string]: EnhancedCurriculumStructure }> {
    const curricula: { [key: string]: EnhancedCurriculumStructure } = {};
    
    const grades = [6, 7, 8, 9];
    const volumes: ('V1' | 'V2')[] = ['V1', 'V2'];
    
    for (const grade of grades) {
      for (const volume of volumes) {
        const curriculum = await this.loadEnhancedCurriculum(grade, volume);
        if (curriculum) {
          const key = `Grade${grade}_${volume}`;
          curricula[key] = curriculum;
        }
      }
    }
    
    return curricula;
  }
  
  /**
   * Get session statistics across all curricula
   */
  static async getSessionStatistics() {
    const curricula = await this.getAllEnhancedCurricula();
    
    let totalSessions = 0;
    let totalLessons = 0;
    let completeLessons = 0;
    let gradeStats: { [key: string]: any } = {};
    
    for (const [key, curriculum] of Object.entries(curricula)) {
      const metadata = curriculum.session_extraction_metadata;
      if (metadata) {
        totalSessions += metadata.total_sessions_extracted;
        totalLessons += metadata.lessons_with_sessions;
        
        // Count complete lessons
        for (const [volumeName, volume] of Object.entries(curriculum.volumes)) {
          for (const unit of volume.units) {
            for (const lesson of unit.lessons) {
              if (lesson.session_validation?.complete) {
                completeLessons++;
              }
            }
          }
        }
        
        // Store grade-specific stats
        const grade = curriculum.grade;
        if (!gradeStats[grade]) {
          gradeStats[grade] = {
            sessions: 0,
            lessons: 0,
            complete_lessons: 0,
            volumes: 0
          };
        }
        
        gradeStats[grade].sessions += metadata.total_sessions_extracted;
        gradeStats[grade].lessons += metadata.lessons_with_sessions;
        gradeStats[grade].volumes += 1;
      }
    }
    
    return {
      totalSessions,
      totalLessons,
      completeLessons,
      completionRate: totalLessons > 0 ? (completeLessons / totalLessons) * 100 : 0,
      gradeStats,
      curriculaCount: Object.keys(curricula).length
    };
  }
  
  /**
   * Search for specific sessions by content or type
   */
  static async searchSessions(query: string, grade?: number, sessionType?: string): Promise<any[]> {
    const curricula = await this.getAllEnhancedCurricula();
    const results: any[] = [];
    
    for (const [key, curriculum] of Object.entries(curricula)) {
      if (grade && curriculum.grade !== grade) continue;
      
      for (const [volumeName, volume] of Object.entries(curriculum.volumes)) {
        for (const unit of volume.units) {
          for (const lesson of unit.lessons) {
            if (lesson.sessions) {
              for (const session of lesson.sessions) {
                const matchesQuery = !query || 
                  session.title.toLowerCase().includes(query.toLowerCase()) ||
                  session.content_focus.toLowerCase().includes(query.toLowerCase());
                
                const matchesType = !sessionType || session.session_type === sessionType;
                
                if (matchesQuery && matchesType) {
                  results.push({
                    grade: curriculum.grade,
                    volume: volumeName,
                    unit: unit.title,
                    lesson: lesson.title,
                    lesson_number: lesson.lesson_number,
                    session: session,
                    context: {
                      unit_number: unit.unit_number,
                      standards_focus: lesson.standards_focus,
                      key_concepts: lesson.key_concepts
                    }
                  });
                }
              }
            }
          }
        }
      }
    }
    
    return results;
  }
  
  /**
   * Get session recommendations based on standards or concepts
   */
  static async getSessionRecommendations(standards: string[], concepts: string[] = []): Promise<any[]> {
    const curricula = await this.getAllEnhancedCurricula();
    const recommendations: any[] = [];
    
    for (const [key, curriculum] of Object.entries(curricula)) {
      for (const [volumeName, volume] of Object.entries(curriculum.volumes)) {
        for (const unit of volume.units) {
          for (const lesson of unit.lessons) {
            // Check if lesson matches any of the requested standards
            const hasMatchingStandard = standards.some(standard => 
              lesson.standards_focus.includes(standard)
            );
            
            // Check if lesson matches any concepts
            const hasMatchingConcept = concepts.length === 0 || concepts.some(concept =>
              lesson.key_concepts.some(lessonConcept => 
                lessonConcept.toLowerCase().includes(concept.toLowerCase())
              )
            );
            
            if (hasMatchingStandard || hasMatchingConcept) {
              recommendations.push({
                grade: curriculum.grade,
                volume: volumeName,
                unit: unit.title,
                lesson: lesson,
                match_type: hasMatchingStandard ? 'standard' : 'concept',
                relevance_score: this.calculateRelevanceScore(lesson, standards, concepts)
              });
            }
          }
        }
      }
    }
    
    // Sort by relevance score
    return recommendations.sort((a, b) => b.relevance_score - a.relevance_score);
  }
  
  private static calculateRelevanceScore(lesson: LessonData, standards: string[], concepts: string[]): number {
    let score = 0;
    
    // Score based on standards match
    const standardMatches = standards.filter(standard => 
      lesson.standards_focus.includes(standard)
    ).length;
    score += standardMatches * 10;
    
    // Score based on concept match
    const conceptMatches = concepts.filter(concept =>
      lesson.key_concepts.some(lessonConcept => 
        lessonConcept.toLowerCase().includes(concept.toLowerCase())
      )
    ).length;
    score += conceptMatches * 5;
    
    // Bonus for complete sessions
    if (lesson.session_validation?.complete) {
      score += 3;
    }
    
    // Bonus for having sessions at all
    if (lesson.sessions && lesson.sessions.length > 0) {
      score += 2;
    }
    
    return score;
  }
}
