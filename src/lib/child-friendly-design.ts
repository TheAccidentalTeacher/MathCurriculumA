/**
 * Child-Friendly Design System for 11-year-old users
 * Based on research for touchpad users, slow typists, and attention challenges
 */

export const CHILD_FRIENDLY_DESIGN = {
  // Touch targets optimized for children with touchpads
  TOUCH_TARGETS: {
    minSize: '48px',        // Apple minimum
    preferredSize: '60px',   // Better for children
    largeSize: '72px',      // For primary actions
    spacing: '12px',        // Between interactive elements
    safeZone: '16px',       // Around important buttons
  },

  // Typography for young readers
  TYPOGRAPHY: {
    minTextSize: '16px',    // Minimum readable size
    bodyText: '18px',       // Comfortable reading
    buttonText: '20px',     // Larger for UI elements
    headingText: '24px',    // Clear hierarchy
    lineHeight: '1.5',      // Generous line spacing
  },

  // Colors for accessibility and engagement
  COLORS: {
    primary: '#2563eb',     // High contrast blue
    success: '#16a34a',     // Clear green for positive feedback
    warning: '#d97706',     // Attention-getting orange
    error: '#dc2626',       // Clear red for errors
    background: '#f8fafc',  // Soft, easy on eyes
    text: '#1e293b',        // High contrast dark text
  },

  // Animation timing for children's cognitive processing
  ANIMATIONS: {
    fast: '150ms',          // Quick feedback
    normal: '250ms',        // Standard transitions
    slow: '400ms',          // Give time to process
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Playful easing
  },

  // Safety and wellness
  SAFETY: {
    sessionMaxMinutes: 30,     // Maximum continuous session
    breakReminderMinutes: 20,  // Suggest breaks
    idleTimeoutMinutes: 10,    // Auto-pause when idle
    offTopicWarningCount: 3,   // Before redirect
    blockedTopics: [
      'personal information', 'social media', 'games', 'entertainment',
      'politics', 'violence', 'inappropriate content', 'homework answers'
    ]
  }
} as const;

export const MATH_TOPICS = [
  'fractions', 'decimals', 'percentages', 'addition', 
  'subtraction', 'multiplication', 'division', 'word problems',
  'geometry', 'measurement', 'data', 'patterns'
] as const;

export const QUICK_QUESTIONS = [
  "What does this mean?",
  "How do I solve this?", 
  "Can you explain this step?",
  "I don't understand this part",
  "Can you show me an example?",
  "Is this the right answer?"
] as const;

export const ENCOURAGEMENT_PHRASES = [
  "Great question! Let me help you with that.",
  "You're thinking really well about this!",
  "That shows you're paying attention!",
  "Good job asking for help when you need it!",
  "Let's figure this out together!",
  "You're on the right track!"
] as const;
