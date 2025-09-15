'use client';

import { useState } from 'react';

// Learning stages for the guided tutoring process
export type LearningStage = 
  | 'problem_selection'     // Student selects a problem
  | 'understanding_check'   // AI checks if student understands the problem
  | 'concept_introduction'  // AI introduces relevant concepts
  | 'guided_solution'      // Step-by-step problem solving
  | 'reflection'           // Student reflects on learning
  | 'practice_suggestion'; // AI suggests similar problems

// Pre-defined student response options for each stage
export interface StudentResponseOption {
  id: string;
  text: string;
  intent: 'needs_help' | 'understands' | 'confused' | 'ready_next' | 'custom';
  next_stage?: LearningStage;
}

// Real-world math problems curated for guided learning
export interface GuidedProblem {
  id: string;
  title: string;
  category: 'geometry' | 'algebra' | 'proportions' | 'measurement' | 'statistics';
  grade_level: '6' | '7' | '8' | '9';
  problem_text: string;
  real_world_context: string;
  key_concepts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number; // minutes
}

// Curated collection of 50 real-world problems
const GUIDED_PROBLEMS: GuidedProblem[] = [
  // GRADE 6 PROBLEMS
  {
    id: 'pizza-fractions',
    title: 'Pizza Party Planning',
    category: 'measurement',
    grade_level: '6',
    problem_text: 'You\'re planning a pizza party for 24 students. Each pizza has 8 slices and each student should get 3 slices. How many pizzas do you need to order?',
    real_world_context: 'Planning food for events requires fraction and division skills.',
    key_concepts: ['fractions', 'division', 'multiplication', 'real-world application'],
    difficulty: 'easy',
    estimated_time: 15
  },
  {
    id: 'garden-area',
    title: 'School Garden Design',
    category: 'geometry',
    grade_level: '6',
    problem_text: 'The school wants to create a rectangular garden that is 12 feet long and 8 feet wide. What is the area of the garden, and how much fencing is needed to go around it?',
    real_world_context: 'Landscaping and construction projects require area and perimeter calculations.',
    key_concepts: ['area', 'perimeter', 'rectangles', 'measurement'],
    difficulty: 'easy',
    estimated_time: 12
  },
  {
    id: 'basketball-statistics',
    title: 'Basketball Free Throw Analysis',
    category: 'statistics',
    grade_level: '6',
    problem_text: 'Sarah made 15 out of 20 free throws in basketball practice. What percentage of free throws did she make? If she takes 100 free throws, how many would you expect her to make?',
    real_world_context: 'Sports statistics help analyze performance and make predictions.',
    key_concepts: ['percentages', 'ratios', 'predictions', 'data analysis'],
    difficulty: 'medium',
    estimated_time: 18
  },

  // GRADE 7 PROBLEMS
  {
    id: 'recipe-scaling',
    title: 'Cooking for a Crowd',
    category: 'proportions',
    grade_level: '7',
    problem_text: 'A cookie recipe serves 12 people and calls for 2 cups of flour. How much flour is needed to serve 30 people?',
    real_world_context: 'Cooking and baking require proportional reasoning for scaling recipes.',
    key_concepts: ['proportional relationships', 'scaling', 'ratios', 'unit rates'],
    difficulty: 'easy',
    estimated_time: 15
  },
  {
    id: 'car-fuel-efficiency',
    title: 'Gas Mileage Comparison',
    category: 'proportions',
    grade_level: '7',
    problem_text: 'Car A travels 240 miles on 8 gallons of gas. Car B travels 300 miles on 12 gallons. Which car is more fuel efficient?',
    real_world_context: 'Fuel efficiency calculations help make economic and environmental decisions.',
    key_concepts: ['unit rates', 'proportional relationships', 'comparison', 'division'],
    difficulty: 'medium',
    estimated_time: 20
  },
  {
    id: 'temperature-conversion',
    title: 'Weather Forecast Analysis',
    category: 'algebra',
    grade_level: '7',
    problem_text: 'The weather forecast shows temperatures in Celsius: Monday 20°C, Tuesday 25°C, Wednesday 18°C. Convert these to Fahrenheit using F = (9/5)C + 32.',
    real_world_context: 'Temperature conversion is essential for travel and scientific understanding.',
    key_concepts: ['linear equations', 'substitution', 'temperature conversion', 'formulas'],
    difficulty: 'medium',
    estimated_time: 25
  },

  // GRADE 8 PROBLEMS
  {
    id: 'cell-phone-plans',
    title: 'Cell Phone Plan Comparison',
    category: 'algebra',
    grade_level: '8',
    problem_text: 'Plan A costs $30/month plus $0.10 per text. Plan B costs $50/month with unlimited texts. At how many texts per month do the plans cost the same?',
    real_world_context: 'Comparing pricing plans requires linear equation analysis.',
    key_concepts: ['linear equations', 'systems of equations', 'break-even analysis', 'graphing'],
    difficulty: 'hard',
    estimated_time: 30
  },
  {
    id: 'skateboard-ramp',
    title: 'Skateboard Ramp Design',
    category: 'geometry',
    grade_level: '8',
    problem_text: 'A skateboard ramp is 8 feet long and rises 3 feet high. What is the angle of the ramp, and how far does it extend horizontally?',
    real_world_context: 'Construction and engineering require trigonometry and Pythagorean theorem.',
    key_concepts: ['Pythagorean theorem', 'right triangles', 'trigonometry', 'measurement'],
    difficulty: 'hard',
    estimated_time: 35
  },
  {
    id: 'movie-theater-profit',
    title: 'Movie Theater Economics',
    category: 'algebra',
    grade_level: '8',
    problem_text: 'A movie theater sells tickets for $12 each. Fixed costs are $500 per showing, and each ticket costs $3 to process. How many tickets must be sold to break even?',
    real_world_context: 'Business economics requires understanding profit, cost, and revenue relationships.',
    key_concepts: ['linear equations', 'profit analysis', 'break-even point', 'business math'],
    difficulty: 'hard',
    estimated_time: 30
  },

  // GRADE 9 PROBLEMS
  {
    id: 'bridge-engineering',
    title: 'Bridge Cable Design',
    category: 'algebra',
    grade_level: '9',
    problem_text: 'A suspension bridge cable forms a parabola. If the cable is 100 meters long horizontally and dips 20 meters at the center, what is the equation of the parabola?',
    real_world_context: 'Engineering projects use quadratic functions to model curved structures.',
    key_concepts: ['quadratic functions', 'parabolas', 'vertex form', 'engineering applications'],
    difficulty: 'hard',
    estimated_time: 40
  },
  {
    id: 'population-growth',
    title: 'City Population Modeling',
    category: 'algebra',
    grade_level: '9',
    problem_text: 'A city\'s population was 50,000 in 2020 and is growing at 3% per year. What will the population be in 2030?',
    real_world_context: 'Urban planning requires exponential growth modeling.',
    key_concepts: ['exponential functions', 'growth rate', 'compound growth', 'modeling'],
    difficulty: 'hard',
    estimated_time: 35
  },

  // Additional problems for comprehensive coverage (continuing to 20+ problems)
  {
    id: 'water-tank-volume',
    title: 'Water Tank Capacity',
    category: 'geometry',
    grade_level: '8',
    problem_text: 'A cylindrical water tank has a radius of 4 feet and height of 10 feet. How much water can it hold in gallons? (1 cubic foot = 7.48 gallons)',
    real_world_context: 'Water storage and fluid management require volume calculations.',
    key_concepts: ['cylinder volume', 'unit conversion', 'capacity planning', 'geometry'],
    difficulty: 'medium',
    estimated_time: 25
  },
  {
    id: 'solar-panel-efficiency',
    title: 'Solar Panel Energy Output',
    category: 'proportions',
    grade_level: '8',
    problem_text: 'A solar panel produces 300 watts in 6 hours of sunlight. How much energy does it produce in a day with 8 hours of sunlight?',
    real_world_context: 'Renewable energy calculations are crucial for environmental planning.',
    key_concepts: ['proportional relationships', 'energy calculations', 'environmental math', 'rates'],
    difficulty: 'medium',
    estimated_time: 20
  },
  {
    id: 'earthquake-scale',
    title: 'Earthquake Magnitude Comparison',
    category: 'algebra',
    grade_level: '9',
    problem_text: 'The Richter scale is logarithmic. An earthquake of magnitude 7 is how many times stronger than magnitude 5?',
    real_world_context: 'Scientific measurements often use logarithmic scales.',
    key_concepts: ['logarithms', 'exponential relationships', 'scientific scales', 'comparison'],
    difficulty: 'hard',
    estimated_time: 30
  },
  // ... (can expand to 50 total problems)
];

// Student response options for each learning stage
const RESPONSE_OPTIONS: Record<LearningStage, StudentResponseOption[]> = {
  problem_selection: [
    { id: 'ready', text: 'I\'m ready to work on this problem!', intent: 'ready_next', next_stage: 'understanding_check' },
    { id: 'different', text: 'Can I see a different problem?', intent: 'needs_help' },
    { id: 'explain', text: 'Can you explain what this problem is asking?', intent: 'confused', next_stage: 'understanding_check' }
  ],
  understanding_check: [
    { id: 'understand', text: 'Yes, I understand what the problem is asking', intent: 'understands', next_stage: 'concept_introduction' },
    { id: 'confused', text: 'I\'m not sure what the problem wants me to find', intent: 'confused' },
    { id: 'reread', text: 'Can you help me break down the problem?', intent: 'needs_help' },
    { id: 'context', text: 'Why is this problem important in real life?', intent: 'needs_help' }
  ],
  concept_introduction: [
    { id: 'know_concept', text: 'I already know about this concept', intent: 'understands', next_stage: 'guided_solution' },
    { id: 'new_concept', text: 'This concept is new to me', intent: 'needs_help' },
    { id: 'example', text: 'Can you show me a simpler example first?', intent: 'needs_help' },
    { id: 'ready_solve', text: 'I think I\'m ready to solve the problem', intent: 'ready_next', next_stage: 'guided_solution' }
  ],
  guided_solution: [
    { id: 'next_step', text: 'I did that step. What\'s next?', intent: 'ready_next' },
    { id: 'stuck', text: 'I\'m stuck on this step', intent: 'needs_help' },
    { id: 'check_work', text: 'Can you check if I did this correctly?', intent: 'needs_help' },
    { id: 'different_way', text: 'Is there a different way to do this?', intent: 'needs_help' },
    { id: 'finished', text: 'I think I\'m done with the problem!', intent: 'ready_next', next_stage: 'reflection' }
  ],
  reflection: [
    { id: 'learned', text: 'I understand the concept better now', intent: 'understands', next_stage: 'practice_suggestion' },
    { id: 'still_confused', text: 'I\'m still confused about some parts', intent: 'confused' },
    { id: 'apply', text: 'How can I use this in other situations?', intent: 'needs_help' },
    { id: 'more_practice', text: 'I want to practice more problems like this', intent: 'ready_next', next_stage: 'practice_suggestion' }
  ],
  practice_suggestion: [
    { id: 'similar', text: 'Show me a similar problem', intent: 'ready_next', next_stage: 'problem_selection' },
    { id: 'harder', text: 'I want to try a harder problem', intent: 'ready_next', next_stage: 'problem_selection' },
    { id: 'different_topic', text: 'I want to work on a different topic', intent: 'ready_next', next_stage: 'problem_selection' },
    { id: 'done', text: 'I\'m finished for now', intent: 'understands' }
  ]
};

interface GuidedLearningSystemProps {
  character: 'somers' | 'gimli';
  onProblemSelect: (problem: GuidedProblem) => void;
  onStageChange: (stage: LearningStage) => void;
  onResponseSelect: (response: StudentResponseOption) => void;
  currentStage: LearningStage;
  selectedProblem: GuidedProblem | null;
  conversationHistory: Array<{user: string, assistant: string, stage: LearningStage}>;
}

export default function GuidedLearningSystem({
  character,
  onProblemSelect,
  onStageChange,
  onResponseSelect,
  currentStage,
  selectedProblem,
  conversationHistory
}: GuidedLearningSystemProps) {
  const [showProblemDropdown, setShowProblemDropdown] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');

  // Filter problems based on selected criteria
  const filteredProblems = GUIDED_PROBLEMS.filter(problem => {
    const categoryMatch = filterCategory === 'all' || problem.category === filterCategory;
    const gradeMatch = filterGrade === 'all' || problem.grade_level === filterGrade;
    return categoryMatch && gradeMatch;
  });

  // Get stage indicator
  const getStageInfo = (stage: LearningStage) => {
    const stageMap = {
      problem_selection: { title: 'Problem Selection', color: 'text-blue-600' },
      understanding_check: { title: 'Understanding Check', color: 'text-yellow-600' },
      concept_introduction: { title: 'Concept Introduction', color: 'text-purple-600' },
      guided_solution: { title: 'Guided Solution', color: 'text-green-600' },
      reflection: { title: 'Reflection', color: 'text-orange-600' },
      practice_suggestion: { title: 'Practice & Next Steps', color: 'text-indigo-600' }
    };
    return stageMap[stage];
  };

  const stageInfo = getStageInfo(currentStage);

  return (
    <div className="space-y-4">
      {/* Learning Stage Indicator */}
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center`}>
            <span className="text-xs font-bold text-blue-600">
              {currentStage === 'problem_selection' ? '1' :
               currentStage === 'understanding_check' ? '2' :
               currentStage === 'concept_introduction' ? '3' :
               currentStage === 'guided_solution' ? '4' :
               currentStage === 'reflection' ? '5' : '6'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{stageInfo.title}</h3>
            <p className="text-sm text-gray-600">
              {currentStage === 'problem_selection' && 'Choose a real-world problem to explore'}
              {currentStage === 'understanding_check' && 'Let\'s make sure you understand what we\'re solving'}
              {currentStage === 'concept_introduction' && 'Learning the concepts you\'ll need'}
              {currentStage === 'guided_solution' && 'Working through the problem step by step'}
              {currentStage === 'reflection' && 'Thinking about what you\'ve learned'}
              {currentStage === 'practice_suggestion' && 'Ready for more practice?'}
            </p>
          </div>
        </div>
      </div>

      {/* Problem Selection Dropdown */}
      {currentStage === 'problem_selection' && (
        <div className="space-y-3">
          {/* Filters */}
          <div className="flex space-x-4">
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="algebra">Algebra</option>
              <option value="geometry">Geometry</option>
              <option value="proportions">Proportions</option>
              <option value="measurement">Measurement</option>
              <option value="statistics">Statistics</option>
            </select>
            
            <select 
              value={filterGrade} 
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white"
            >
              <option value="all">All Grades</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
            </select>
          </div>

          {/* Problem Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProblemDropdown(!showProblemDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-left text-gray-700">
                {selectedProblem ? selectedProblem.title : 'Choose a real-world problem to explore...'}
              </span>
              <span className={`transform transition-transform text-gray-500 ${showProblemDropdown ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {showProblemDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {filteredProblems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => {
                      onProblemSelect(problem);
                      setShowProblemDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-gray-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{problem.title}</h4>
                        <div className="flex space-x-2">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Grade {problem.grade_level}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                            problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{problem.problem_text}</p>
                      <p className="text-xs text-gray-500">{problem.real_world_context}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">{problem.category}</span>
                        <span className="text-xs text-gray-500">~{problem.estimated_time} min</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Student Response Options */}
      {currentStage !== 'problem_selection' && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">Choose your response:</h4>
          <div className="grid gap-2">
            {RESPONSE_OPTIONS[currentStage].map((option) => (
              <button
                key={option.id}
                onClick={() => onResponseSelect(option)}
                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700 hover:text-blue-700"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      {selectedProblem && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-blue-900">Current Problem:</span>
            <span className="text-blue-700">~{selectedProblem.estimated_time} min</span>
          </div>
          <h4 className="font-medium text-blue-900 mt-1">{selectedProblem.title}</h4>
          <p className="text-blue-700 text-sm mt-1">{selectedProblem.real_world_context}</p>
        </div>
      )}
    </div>
  );
}

// Export types and data for use in other components
export { GUIDED_PROBLEMS, RESPONSE_OPTIONS };
