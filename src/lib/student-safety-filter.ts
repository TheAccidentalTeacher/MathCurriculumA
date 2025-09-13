/**
 * Student Safety Filter - Content filtering for middle school students
 * Protects against inappropriate language, sexual content, and other harmful material
 */

export interface SafetyFilterResult {
  isAppropriate: boolean;
  category?: 'profanity' | 'sexual' | 'violence' | 'harassment' | 'self-harm' | 'drug-alcohol' | 'clean';
  severity?: 'low' | 'medium' | 'high';
  filteredMessage?: string;
  teacherAlert?: boolean;
  guidance?: string;
}

export class StudentSafetyFilter {
  // Profanity patterns (expandable list)
  private static readonly PROFANITY_PATTERNS = [
    // Common expletives
    /\b(fuck|fucking|fucked|fucker|shit|damn|hell|bitch|asshole|ass|crap|piss)\b/gi,
    // Variations and substitutions
    /\b(f\*ck|f\*\*k|sh\*t|d\*mn|b\*tch|a\*\*|cr\*p)\b/gi,
    // Creative spellings
    /\b(fuk|fack|shyt|dam)\b/gi
  ];

  // Sexual content patterns
  private static readonly SEXUAL_PATTERNS = [
    /\b(sex|sexual|penis|vagina|breast|boob|dick|cock|pussy|horny|masturbat|orgasm|porn)\b/gi,
    /\b(nude|naked|strip|seduce|arousal|erection|climax)\b/gi
  ];

  // Violence patterns
  private static readonly VIOLENCE_PATTERNS = [
    /\b(kill|murder|stab|shoot|gun|weapon|violence|fight|hurt|pain|blood|die|death)\b/gi,
    /\b(suicide|self\s*harm|cut\s*myself|end\s*it\s*all)\b/gi
  ];

  // Drug/alcohol patterns
  private static readonly SUBSTANCE_PATTERNS = [
    /\b(drunk|alcohol|beer|wine|weed|marijuana|drug|cocaine|pills|smoke|vape)\b/gi
  ];

  // Harassment patterns
  private static readonly HARASSMENT_PATTERNS = [
    /\b(stupid|idiot|loser|dumb|retard|gay|faggot|slut|whore)\b/gi,
    /\b(ugly|fat|skinny|worthless|pathetic|kill\s*yourself)\b/gi
  ];

  /**
   * Filter student input for inappropriate content
   */
  static filterStudentInput(message: string): SafetyFilterResult {
    const lowercaseMessage = message.toLowerCase();

    // Check for profanity
    for (const pattern of this.PROFANITY_PATTERNS) {
      if (pattern.test(message)) {
        return {
          isAppropriate: false,
          category: 'profanity',
          severity: 'medium',
          filteredMessage: this.cleanProfanity(message),
          teacherAlert: false,
          guidance: "I understand you might be frustrated! Let's focus on the math problem. Can you tell me specifically which part is confusing you?"
        };
      }
    }

    // Check for sexual content
    for (const pattern of this.SEXUAL_PATTERNS) {
      if (pattern.test(message)) {
        return {
          isAppropriate: false,
          category: 'sexual',
          severity: 'high',
          teacherAlert: true,
          guidance: "That's not appropriate for our math lesson. Let's keep our conversation focused on learning. What math topic would you like help with?"
        };
      }
    }

    // Check for violence/self-harm
    for (const pattern of this.VIOLENCE_PATTERNS) {
      if (pattern.test(message)) {
        const isSelfHarm = /\b(suicide|self\s*harm|cut\s*myself|end\s*it\s*all|kill\s*myself)\b/gi.test(message);
        return {
          isAppropriate: false,
          category: isSelfHarm ? 'self-harm' : 'violence',
          severity: 'high',
          teacherAlert: true,
          guidance: isSelfHarm 
            ? "I'm concerned about you. Please talk to a trusted adult, teacher, or counselor. You can also call the Crisis Text Line by texting HOME to 741741. Now, let's work on some math together."
            : "Let's keep our conversation positive and focused on learning. What math concept would you like to explore?"
        };
      }
    }

    // Check for harassment
    for (const pattern of this.HARASSMENT_PATTERNS) {
      if (pattern.test(message)) {
        return {
          isAppropriate: false,
          category: 'harassment',
          severity: 'medium',
          teacherAlert: true,
          guidance: "That language isn't kind or helpful. Let's treat each other with respect. How can I help you with your math work today?"
        };
      }
    }

    // Check for substance references
    for (const pattern of this.SUBSTANCE_PATTERNS) {
      if (pattern.test(message)) {
        return {
          isAppropriate: false,
          category: 'drug-alcohol',
          severity: 'medium',
          teacherAlert: true,
          guidance: "That's not something we discuss in math class. Let's focus on your schoolwork. What math problem can I help you with?"
        };
      }
    }

    return {
      isAppropriate: true,
      category: 'clean'
    };
  }

  /**
   * Clean profanity by replacing with asterisks
   */
  private static cleanProfanity(message: string): string {
    let cleaned = message;
    for (const pattern of this.PROFANITY_PATTERNS) {
      cleaned = cleaned.replace(pattern, (match) => 
        match.charAt(0) + '*'.repeat(match.length - 1)
      );
    }
    return cleaned;
  }

  /**
   * Extract page numbers from student messages
   */
  static extractPageNumbers(message: string): number[] {
    const pagePatterns = [
      /page\s+(\d+)/gi,
      /pg\s*\.?\s*(\d+)/gi,
      /p\s*\.?\s*(\d+)/gi,
      /on\s+(\d+)/gi
    ];

    const pageNumbers: number[] = [];
    
    for (const pattern of pagePatterns) {
      let match;
      while ((match = pattern.exec(message)) !== null) {
        const pageNum = parseInt(match[1], 10);
        if (pageNum > 0 && pageNum < 1000) { // Reasonable page range
          pageNumbers.push(pageNum);
        }
      }
    }

    return [...new Set(pageNumbers)]; // Remove duplicates
  }

  /**
   * Detect if student is asking for page-specific help
   */
  static isPageSpecificRequest(message: string): boolean {
    const pageRequestPatterns = [
      /page\s+\d+/gi,
      /on\s+page/gi,
      /problem\s+on\s+\d+/gi,
      /exercise\s+\d+/gi,
      /question\s+\d+/gi,
      /this\s+page/gi,
      /current\s+page/gi
    ];

    return pageRequestPatterns.some(pattern => pattern.test(message));
  }

  /**
   * Generate teacher alert message
   */
  static generateTeacherAlert(studentName: string, message: string, category: string, severity: string): string {
    return `🚨 STUDENT SAFETY ALERT
Student: ${studentName}
Category: ${category}
Severity: ${severity}
Original Message: "${message}"
Time: ${new Date().toLocaleString()}
Action: Student was redirected to appropriate guidance.`;
  }
}
