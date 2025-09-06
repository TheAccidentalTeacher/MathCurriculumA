import { readFileSync } from 'fs';
import { join } from 'path';

export interface LessonPage {
  pageNumber: number;
  filename: string;
  imagePath: string;
  textPreview: string;
  wordCount: number;
  hasSignificantContent: boolean;
}

export interface LessonSession {
  sessionNumber: number;
  sessionName: string;
  sessionType: 'introduction' | 'explore' | 'develop' | 'refine' | 'apply' | 'practice' | 'session';
  startPage: number;
  endPage: number;
  pages: LessonPage[];
  totalPages: number;
}

export interface LessonData {
  lessonNumber: number;
  lessonTitle: string;
  documentId: string;
  volumeName: string;
  startPage: number;
  endPage: number;
  totalPages: number;
  sessions: LessonSession[];
  allPages: LessonPage[];
}

/**
 * Database-free Lesson Service using document.json files for definitive lesson boundaries
 * This completely bypasses the broken text-parsing approach
 */
export class DatabaseFreeLessonService {
  private static documentCache = new Map<string, any>();
  private static lessonBoundaries: Record<string, Record<number, { start: number; end: number; title: string }>> = {
    'RCM06_NA_SW_V1': {
      1: { start: 15, end: 30, title: 'Find the Area of a Parallelogram' },
      2: { start: 31, end: 52, title: 'Find the Area of Triangles and Other Polygons' },
      3: { start: 53, end: 74, title: 'Use Nets to Find Surface Area' },
      4: { start: 75, end: 96, title: 'Work with Algebraic Expressions' },
      5: { start: 97, end: 118, title: 'Write and Evaluate Expressions with Exponents' },
      6: { start: 119, end: 140, title: 'Find Greatest Common Factor and Least Common Multiple' },
      7: { start: 157, end: 178, title: 'Add, Subtract, and Multiply Multi-Digit Decimals' },
      8: { start: 179, end: 206, title: 'Divide Whole Numbers and Multi-Digit Decimals' },
      9: { start: 207, end: 218, title: 'Understand Division with Fractions' },
      10: { start: 219, end: 240, title: 'Divide Fractions' },
      11: { start: 241, end: 262, title: 'Solve Volume Problems with Fractions' },
      12: { start: 279, end: 290, title: 'Understand Ratio Concepts' },
      13: { start: 291, end: 318, title: 'Find Equivalent Ratios' },
      14: { start: 319, end: 340, title: 'Use Part-to-Part and Part-to-Whole Ratios' },
    },
    'RCM06_NA_SW_V2': {
      19: { start: 19, end: 46, title: 'Write and Identify Equivalent Expressions' },
      20: { start: 47, end: 58, title: 'Understand Solutions of Equations' },
      21: { start: 59, end: 86, title: 'Write and Solve One-Variable Equations' },
      22: { start: 87, end: 108, title: 'Analyze Two-Variable Relationships' },
      23: { start: 125, end: 136, title: 'Understand Positive and Negative Numbers' },
      24: { start: 137, end: 152, title: 'Order Positive and Negative Numbers' },
      25: { start: 153, end: 164, title: 'Understand Absolute Value' },
      26: { start: 165, end: 192, title: 'Write and Graph One-Variable Inequalities' },
      27: { start: 193, end: 204, title: 'Understand the Four-Quadrant Coordinate Plane' },
      28: { start: 205, end: 226, title: 'Solve Problems in the Coordinate Plane' },
      29: { start: 243, end: 254, title: 'Understand Statistical Questions and Data Distributions' },
      30: { start: 255, end: 276, title: 'Use Dot Plots and Histograms to Describe Data Distributions' },
      31: { start: 277, end: 298, title: 'Interpret Median and Interquartile Range in Box Plots' },
      32: { start: 299, end: 320, title: 'Interpret Mean and Mean Absolute Deviation' },
      33: { start: 321, end: 336, title: 'Use Measures of Center and Variability to Summarize Data' },
    
    },
    'RCM07_NA_SW_V1': {
      1: { start: 15, end: 42, title: 'Solve Problems Involving Scale' },
      2: { start: 43, end: 58, title: 'Find Unit Rates Involving Ratios of Fractions' },
      3: { start: 59, end: 70, title: 'Understand Proportional Relationships' },
      4: { start: 71, end: 92, title: 'Represent Proportional Relationships' },
      5: { start: 93, end: 108, title: 'Solve Proportional Relationship Problems' },
      6: { start: 109, end: 148, title: 'Solve Area and Circumference Problems Involving Circles' },
      7: { start: 149, end: 160, title: 'Understand Addition with Negative Integers' },
      8: { start: 161, end: 182, title: 'Add with Negative Numbers' },
      9: { start: 183, end: 194, title: 'Understand Subtraction with Negative Integers' },
      10: { start: 195, end: 234, title: 'Add and Subtract Positive and Negative Numbers' },
      11: { start: 235, end: 246, title: 'Understand Multiplication with Negative Integers' },
      12: { start: 247, end: 268, title: 'Multiply and Divide with Negative Numbers' },
      13: { start: 269, end: 290, title: 'Express Rational Numbers as Terminating or Repeating Decimals' },
      14: { start: 291, end: 324, title: 'Use the Four Operations with Negative Numbers' },
      15: { start: 325, end: 346, title: 'Write Equivalent Expressions Involving Rational Numbers' },
      16: { start: 347, end: 358, title: 'Understand Reasons for Rewriting Expressions' },
      17: { start: 359, end: 370, title: 'Understand Multi-Step Equations' },
      18: { start: 371, end: 392, title: 'Write and Solve Multi-Step Equations' },
      19: { start: 393, end: 504, title: 'Write and Solve Inequalities' }
    },
    'RCM07_NA_SW_V2': {
      20: { start: 15, end: 42, title: 'Solve Problems Involving Percents' },
      21: { start: 43, end: 64, title: 'Solve Problems Involving Percent Change and Percent Error' },
      22: { start: 65, end: 76, title: 'Understand Random Sampling' },
      23: { start: 77, end: 98, title: 'Reason About Random Samples' },
      24: { start: 99, end: 138, title: 'Compare Populations' },
      25: { start: 139, end: 166, title: 'Solve Problems Involving Area and Surface Area' },
      26: { start: 167, end: 188, title: 'Solve Problems Involving Volume' },
      27: { start: 189, end: 204, title: 'Describe Plane Sections of Three-Dimensional Figures' },
      28: { start: 205, end: 226, title: 'Find Unknown Angle Measures' },
      29: { start: 227, end: 272, title: 'Draw Plane Figures with Given Conditions' },
      30: { start: 273, end: 284, title: 'Understand Probability' },
      31: { start: 285, end: 306, title: 'Solve Problems Involving Experimental Probability' },
      32: { start: 307, end: 328, title: 'Solve Problems Involving Probability Models' },
      33: { start: 329, end: 440, title: 'Solve Problems Involving Compound Events' }
    },
    'RCM08_NA_SW_V1': {
      1: { start: 15, end: 26, title: 'Understand Rigid Transformations and Their Properties' },
      2: { start: 27, end: 54, title: 'Work with Single Rigid Transformations in the Coordinate Plane' },
      3: { start: 55, end: 94, title: 'Work with Sequences of Transformations and Congruence' },
      4: { start: 95, end: 106, title: 'Understand Dilations and Similarity' },
      5: { start: 107, end: 128, title: 'Perform and Describe Transformations Involving Dilations' },
      6: { start: 129, end: 150, title: 'Describe Angle Relationships' },
      7: { start: 151, end: 190, title: 'Describe Angle Relationships in Triangles' },
      8: { start: 191, end: 212, title: 'Graph Proportional Relationships and Define Slope' },
      9: { start: 213, end: 240, title: 'Derive and Graph Linear Equations of the Form y = mx + b' },
      10: { start: 241, end: 262, title: 'Solve Linear Equations in One Variable' },
      11: { start: 263, end: 284, title: 'Determine the Number of Solutions to One-Variable Equations' },
      12: { start: 285, end: 296, title: 'Understand Systems of Linear Equations in Two Variables' },
      13: { start: 297, end: 324, title: 'Solve Systems of Linear Equations Algebraically' },
      14: { start: 325, end: 364, title: 'Represent and Solve Problems with Systems of Linear Equations' },
      15: { start: 365, end: 376, title: 'Understand Functions' },
      16: { start: 377, end: 404, title: 'Use Functions to Model Linear Relationships' },
      17: { start: 405, end: 426, title: 'Compare Different Representations of Functions' },
      18: { start: 427, end: 552, title: 'Analyze Functional Relationships Qualitatively' }
    },
    'RCM08_NA_SW_V2': {
      19: { start: 15, end: 36, title: 'Apply Exponent Properties for Positive Integer Exponents' },
      20: { start: 37, end: 58, title: 'Apply Exponent Properties for All Integer Exponents' },
      21: { start: 59, end: 80, title: 'Express Numbers Using Integer Powers of 10' },
      22: { start: 81, end: 126, title: 'Work with Scientific Notation' },
      23: { start: 127, end: 148, title: 'Find Square Roots and Cube Roots to Solve Problems' },
      24: { start: 149, end: 164, title: 'Express Rational Numbers as Fractions and Decimals' },
      25: { start: 165, end: 186, title: 'Find Rational Approximations of Irrational Numbers' },
      26: { start: 187, end: 198, title: 'Understand the Pythagorean Theorem and Its Converse' },
      27: { start: 199, end: 226, title: 'Apply the Pythagorean Theorem' },
      28: { start: 227, end: 266, title: 'Solve Problems with Volumes of Cylinders, Cones, and Spheres' },
      29: { start: 267, end: 294, title: 'Analyze Scatter Plots and Fit a Linear Model to Data' },
      30: { start: 295, end: 316, title: 'Write and Analyze an Equation for Fitting a Linear Model' },
      31: { start: 317, end: 328, title: 'Understand Two-Way Tables' },
      32: { start: 329, end: 456, title: 'Construct and Interpret Two-Way Tables' }
    }
  };

  /**
   * Get lesson data using pre-defined boundaries and document assets
   */
  static async getLessonData(documentId: string, lessonNumber: number): Promise<LessonData> {
    try {
      console.log(`🔍 Getting lesson ${lessonNumber} from ${documentId} using pre-defined boundaries`);
      
      // Get lesson boundaries
      const boundaries = this.lessonBoundaries[documentId]?.[lessonNumber];
      if (!boundaries) {
        throw new Error(`No boundaries defined for ${documentId} lesson ${lessonNumber}`);
      }

      // Get document data for images
      const documentData = this.getDocumentData(documentId);
      
      // Get all pages within the lesson boundaries
      const lessonPages = this.getPagesByRange(
        documentData.pages,
        boundaries.start,
        boundaries.end
      );

      console.log(`📄 Found ${lessonPages.length} pages for lesson ${lessonNumber} (${boundaries.start}-${boundaries.end})`);

      // Parse sessions from the page content within boundaries
      const sessions = this.parseSessionsWithinBoundaries(lessonPages, lessonNumber);
      
      return {
        lessonNumber,
        lessonTitle: boundaries.title,
        documentId,
        volumeName: this.getVolumeName(documentId),
        startPage: boundaries.start,
        endPage: boundaries.end,
        totalPages: lessonPages.length,
        sessions,
        allPages: lessonPages.map(page => ({
          pageNumber: page.page_number,
          filename: page.filename,
          imagePath: page.image_path,
          textPreview: page.text_preview || '',
          wordCount: page.word_count || 0,
          hasSignificantContent: page.has_significant_content || false
        }))
      };
      
    } catch (error) {
      console.error(`Failed to get lesson data for ${documentId} lesson ${lessonNumber}:`, error);
      throw new Error(`Lesson ${lessonNumber} not found`);
    }
  }

  /**
   * Get pages within a specific range
   */
  private static getPagesByRange(pages: any[], startPage: number, endPage: number): any[] {
    return pages.filter(page => 
      page.page_number >= startPage && page.page_number <= endPage
    ).sort((a, b) => a.page_number - b.page_number);
  }

  /**
   * Parse sessions within known lesson boundaries - SIMPLIFIED to show entire lesson as one block
   */
  private static parseSessionsWithinBoundaries(lessonPages: any[], lessonNumber: number): LessonSession[] {
    console.log(`📚 Creating single unified session for ${lessonPages.length} pages (${lessonPages[0]?.page_number}-${lessonPages[lessonPages.length-1]?.page_number})`);

    if (lessonPages.length === 0) {
      return [];
    }

    // Create one single session containing all lesson pages
    const unifiedSession: LessonSession = {
      sessionNumber: 1,
      sessionName: `Complete Lesson ${lessonNumber}`,
      sessionType: 'session',
      startPage: lessonPages[0].page_number,
      endPage: lessonPages[lessonPages.length - 1].page_number,
      pages: lessonPages.map(page => this.createLessonPage(page)),
      totalPages: lessonPages.length
    };

    console.log(`📊 Created unified session: ${unifiedSession.totalPages} pages (${unifiedSession.startPage}-${unifiedSession.endPage})`);

    return [unifiedSession];
  }

  private static createIntroSession(pages: any[]): LessonSession {
    return {
      sessionNumber: 0,
      sessionName: 'Introduction',
      sessionType: 'introduction',
      startPage: pages[0].page_number,
      endPage: pages[pages.length - 1].page_number,
      pages: pages.map(p => this.createLessonPage(p)),
      totalPages: pages.length
    };
  }

  private static createLessonPage(page: any): LessonPage {
    return {
      pageNumber: page.page_number,
      filename: page.filename,
      imagePath: page.image_path,
      textPreview: page.text_preview || '',
      wordCount: page.word_count || 0,
      hasSignificantContent: page.has_significant_content || false
    };
  }

  private static getDocumentData(documentId: string): any {
    if (this.documentCache.has(documentId)) {
      return this.documentCache.get(documentId);
    }

    try {
      const documentPath = join(process.cwd(), 'webapp_pages', documentId, 'data', 'document.json');
      const documentData = JSON.parse(readFileSync(documentPath, 'utf-8'));
      this.documentCache.set(documentId, documentData);
      return documentData;
    } catch (error) {
      console.error(`Failed to load document data for ${documentId}:`, error);
      throw new Error(`Document ${documentId} not found`);
    }
  }

  private static getVolumeName(documentId: string): string {
    const volumeMap: Record<string, string> = {
      'RCM06_NA_SW_V1': 'Grade 6 - Volume 1',
      'RCM06_NA_SW_V2': 'Grade 6 - Volume 2',
      'RCM07_NA_SW_V1': 'Grade 7 - Volume 1',
      'RCM07_NA_SW_V2': 'Grade 7 - Volume 2', 
      'RCM08_NA_SW_V1': 'Grade 8 - Volume 1',
      'RCM08_NA_SW_V2': 'Grade 8 - Volume 2'
    };
    return volumeMap[documentId] || 'Unknown Volume';
  }


}
