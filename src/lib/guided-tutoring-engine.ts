// Enhanced AI prompt system for guided learning
import type { LearningStage, GuidedProblem, StudentResponseOption } from '../components/virtualtutor/GuidedLearningSystem';

export interface GuidedConversationContext {
  stage: LearningStage;
  selectedProblem: GuidedProblem | null;
  conversationHistory: Array<{
    user: string;
    assistant: string;
    stage: LearningStage;
    timestamp: Date;
  }>;
  studentProgress: {
    conceptsUnderstood: string[];
    strugglingWith: string[];
    currentStep: number;
    totalSteps: number;
  };
}

export function buildGuidedTutoringPrompt(
  character: 'somers' | 'gimli',
  context: GuidedConversationContext,
  userMessage: string,
  studentResponse?: StudentResponseOption
): string {
  const characterPersonality = character === 'somers' 
    ? {
        name: 'Mr. Somers',
        style: 'Professional, encouraging, and methodical. Use clear explanations and educational language.',
        greeting: 'Hello! I\'m Mr. Somers, your math teacher.',
      }
    : {
        name: 'Gimli',
        style: 'Friendly, enthusiastic, and supportive. Use encouraging language with some playful metaphors.',
        greeting: 'Woof! I\'m Gimli, your friendly math companion!',
      };

  const basePrompt = `
You are ${characterPersonality.name}, an AI tutor designed to guide students through math problems using an iterative, step-by-step approach. 

CRITICAL GUIDED LEARNING RULES:
1. NEVER give direct answers or complete solutions
2. Guide the student through each step, requiring their input before proceeding
3. Ask clarifying questions to check understanding
4. Adapt your teaching to the student's responses
5. Celebrate small victories and provide encouragement
6. If a student struggles, break concepts into smaller pieces

MATHEMATICAL NOTATION RULES:
- ALWAYS use LaTeX formatting: \\( \\) for inline math, \\[ \\] for display math
- NEVER use parentheses for mathematical expressions
- Wrong: (y = 2x + 3) → Correct: \\(y = 2x + 3\\)

CURRENT LEARNING CONTEXT:
- Learning Stage: ${context.stage}
- Selected Problem: ${context.selectedProblem?.title || 'None selected'}
- Student's Current Understanding: ${context.studentProgress.conceptsUnderstood.join(', ') || 'Assessment needed'}
- Areas of Struggle: ${context.studentProgress.strugglingWith.join(', ') || 'None identified yet'}

${getStageSpecificPrompt(context.stage, context.selectedProblem, context.studentProgress)}

CONVERSATION HISTORY:
${formatConversationHistory(context.conversationHistory)}

STUDENT'S LATEST MESSAGE: "${userMessage}"
${studentResponse ? `STUDENT'S SELECTED RESPONSE: "${studentResponse.text}" (Intent: ${studentResponse.intent})` : ''}

RESPONSE GUIDELINES:
${getResponseGuidelines(context.stage, character)}

Remember: ${characterPersonality.style}
`;

  return basePrompt;
}

function getStageSpecificPrompt(stage: LearningStage, problem: GuidedProblem | null, progress: any): string {
  switch (stage) {
    case 'problem_selection':
      return `
STAGE: Problem Selection
- Help the student choose an appropriate problem
- Explain why certain problems might be good fits
- Don't overwhelm them with too many choices at once
      `;

    case 'understanding_check':
      return `
STAGE: Understanding Check
PROBLEM: ${problem?.problem_text || 'No problem selected'}
REAL-WORLD CONTEXT: ${problem?.real_world_context || 'N/A'}

YOUR TASKS:
1. Help the student understand what the problem is asking
2. Break down complex language into simpler terms
3. Identify key information and what needs to be found
4. Check if they understand the real-world context
5. DON'T solve anything yet - just ensure comprehension

Ask questions like:
- "What is this problem asking you to find?"
- "What information are you given?"
- "What does this situation remind you of in real life?"
      `;

    case 'concept_introduction':
      return `
STAGE: Concept Introduction
PROBLEM CONCEPTS: ${problem?.key_concepts.join(', ') || 'N/A'}

YOUR TASKS:
1. Introduce the mathematical concepts needed
2. Use simple examples first
3. Connect to things they already know
4. Check understanding before moving forward
5. Use visual or concrete examples when possible

TEACHING APPROACH:
- Start with the simplest concept first
- Use analogies they can relate to
- Ask them to explain concepts back to you
- Provide encouragement and positive feedback
      `;

    case 'guided_solution':
      return `
STAGE: Guided Solution
CURRENT STEP: ${progress.currentStep}/${progress.totalSteps}

YOUR TASKS:
1. Guide them through ONE small step at a time
2. Wait for their input before giving the next step
3. If they're stuck, provide hints, not answers
4. Check their work and provide feedback
5. Ask "What should we do next?" to keep them engaged

STEP-BY-STEP APPROACH:
- Break the problem into the smallest possible steps
- Have them tell you what they think the next step should be
- Provide hints like "What operation do you think we need here?"
- Celebrate correct thinking and gently redirect mistakes
      `;

    case 'reflection':
      return `
STAGE: Reflection
YOUR TASKS:
1. Help them think about what they learned
2. Connect the problem to the broader concepts
3. Ask them to explain the solution process
4. Identify what was challenging and why
5. Reinforce their understanding

REFLECTION QUESTIONS:
- "What was the key concept in this problem?"
- "How did we approach solving this?"
- "What part was most challenging for you?"
- "How might you use this in real life?"
      `;

    case 'practice_suggestion':
      return `
STAGE: Practice Suggestion
YOUR TASKS:
1. Suggest similar problems for practice
2. Offer slightly harder challenges if they're ready
3. Connect to other mathematical topics
4. Provide encouragement and next steps
5. Let them choose their learning path

Be supportive and help them build confidence for future learning.
      `;

    default:
      return '';
  }
}

function getResponseGuidelines(stage: LearningStage, character: 'somers' | 'gimli'): string {
  const commonGuidelines = `
- Keep responses concise but encouraging
- Ask engaging questions
- Use LaTeX for all mathematical expressions
- Adapt to the student's level and responses
- Provide specific, actionable guidance
  `;

  const characterSpecific = character === 'somers' 
    ? 'Use professional teacher language, be clear and methodical'
    : 'Use friendly, enthusiastic language with occasional playful metaphors';

  return commonGuidelines + '\n- ' + characterSpecific;
}

function formatConversationHistory(history: GuidedConversationContext['conversationHistory']): string {
  if (history.length === 0) return 'No previous conversation.';
  
  return history.slice(-5).map((exchange, index) => `
Exchange ${index + 1} (Stage: ${exchange.stage}):
Student: ${exchange.user}
Assistant: ${exchange.assistant}
  `).join('\n');
}

export function analyzeStudentIntent(message: string, stage: LearningStage): {
  intent: 'needs_help' | 'understands' | 'confused' | 'ready_next' | 'custom';
  confidence: number;
  suggestedResponse: string;
} {
  const lowercaseMessage = message.toLowerCase();
  
  // Keywords for different intents
  const helpKeywords = ['help', 'stuck', 'don\'t understand', 'confused', 'hard', 'difficult'];
  const understandsKeywords = ['got it', 'understand', 'yes', 'clear', 'makes sense'];
  const readyKeywords = ['next', 'ready', 'done', 'finished', 'move on'];
  const confusedKeywords = ['what', 'huh', 'confused', 'lost', 'don\'t get it'];

  // Analyze intent based on keywords
  const helpScore = helpKeywords.filter(keyword => lowercaseMessage.includes(keyword)).length;
  const understandsScore = understandsKeywords.filter(keyword => lowercaseMessage.includes(keyword)).length;
  const readyScore = readyKeywords.filter(keyword => lowercaseMessage.includes(keyword)).length;
  const confusedScore = confusedKeywords.filter(keyword => lowercaseMessage.includes(keyword)).length;

  // Determine primary intent
  const scores = {
    needs_help: helpScore,
    understands: understandsScore,
    ready_next: readyScore,
    confused: confusedScore
  };

  const maxScore = Math.max(...Object.values(scores));
  const intent = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) as keyof typeof scores || 'custom';
  
  const confidence = maxScore > 0 ? Math.min(maxScore * 0.3 + 0.4, 1.0) : 0.3;

  return {
    intent,
    confidence,
    suggestedResponse: generateSuggestedResponse(intent, stage)
  };
}

function generateSuggestedResponse(intent: string, stage: LearningStage): string {
  const responses: Record<string, Record<string, string>> = {
    needs_help: {
      understanding_check: "I'm not sure what this problem is asking for",
      concept_introduction: "Can you explain this concept more simply?",
      guided_solution: "I'm stuck on this step",
      reflection: "I'm still confused about some parts"
    },
    understands: {
      understanding_check: "Yes, I understand what the problem is asking",
      concept_introduction: "I think I understand this concept",
      guided_solution: "I did that step correctly",
      reflection: "I understand the concept better now"
    },
    ready_next: {
      understanding_check: "I'm ready to learn the concepts",
      concept_introduction: "I'm ready to solve the problem",
      guided_solution: "What's the next step?",
      reflection: "I want to try another problem"
    },
    confused: {
      understanding_check: "Can you help me break down this problem?",
      concept_introduction: "This concept is new to me",
      guided_solution: "I don't know how to do this step",
      reflection: "I'm still not sure about this"
    }
  };

  return responses[intent]?.[stage] || "Can you help me with this?";
}

export function trackStudentProgress(
  conversationHistory: GuidedConversationContext['conversationHistory'],
  currentStage: LearningStage
): GuidedConversationContext['studentProgress'] {
  const conceptsUnderstood: string[] = [];
  const strugglingWith: string[] = [];
  
  // Analyze conversation history for understanding patterns
  conversationHistory.forEach(exchange => {
    const userMessage = exchange.user.toLowerCase();
    
    if (userMessage.includes('understand') || userMessage.includes('got it')) {
      // Extract potential concepts they understand
      if (exchange.stage === 'concept_introduction') {
        conceptsUnderstood.push('basic concepts');
      }
    }
    
    if (userMessage.includes('confused') || userMessage.includes('stuck') || userMessage.includes('help')) {
      // Track what they're struggling with
      if (exchange.stage === 'guided_solution') {
        strugglingWith.push('problem-solving steps');
      }
    }
  });

  // Calculate progress based on stage
  const stageProgress: Record<LearningStage, number> = {
    problem_selection: 1,
    understanding_check: 2,
    concept_introduction: 3,
    guided_solution: 4,
    reflection: 5,
    practice_suggestion: 6
  };

  return {
    conceptsUnderstood: [...new Set(conceptsUnderstood)], // Remove duplicates
    strugglingWith: [...new Set(strugglingWith)], // Remove duplicates
    currentStep: stageProgress[currentStage] || 1,
    totalSteps: 6
  };
}

export function getNextStageRecommendation(
  currentStage: LearningStage,
  studentResponse: StudentResponseOption,
  conversationHistory: GuidedConversationContext['conversationHistory']
): { nextStage: LearningStage; reason: string } {
  // Use the predefined next stage if available
  if (studentResponse.next_stage) {
    return {
      nextStage: studentResponse.next_stage,
      reason: `Student indicated: ${studentResponse.text}`
    };
  }

  // Default stage progression logic
  const stageFlow: Record<LearningStage, LearningStage> = {
    problem_selection: 'understanding_check',
    understanding_check: 'concept_introduction',
    concept_introduction: 'guided_solution',
    guided_solution: 'reflection',
    reflection: 'practice_suggestion',
    practice_suggestion: 'problem_selection'
  };

  // Check if student needs to repeat current stage
  if (studentResponse.intent === 'confused' || studentResponse.intent === 'needs_help') {
    return {
      nextStage: currentStage,
      reason: 'Student needs more support at current stage'
    };
  }

  return {
    nextStage: stageFlow[currentStage],
    reason: 'Natural progression based on student readiness'
  };
}
