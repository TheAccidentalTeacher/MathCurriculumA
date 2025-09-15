'use client';

import { useState, useEffect } from 'react';

// Types for curriculum-aware guided learning
export type LearningContext = 'lesson_specific' | 'general_exploration';
export type LearningStage = 
  | 'topic_selection'       // Choose topic from curriculum scope
  | 'problem_exploration'   // Explore problems within that topic
  | 'guided_solution'      // Step-by-step solving
  | 'concept_connection'   // Connect to broader curriculum
  | 'practice_extension';  // Suggest next steps

export interface CurriculumTopic {
  id: string;
  grade: string;
  unit: number;
  lesson: number;
  title: string;
  standards: string[];
  key_concepts: string[];
  prerequisites: string[];
  related_lessons: string[];
  difficulty_level: 'foundation' | 'developing' | 'mastery';
}

export type ExplorationMode = 'lesson_specific' | 'general_exploration';

export interface LessonContext {
  grade: string;
  unit: number;
  lesson: number;
  title: string;
  current_page?: number;
  lesson_images?: string[];
  session_type?: 'Explore' | 'Develop' | 'Refine';
}

export interface CurriculumAwareGuidedLearningProps {
  character: string;
  lessonContext?: LessonContext; // If accessed from specific lesson
  onTopicSelect: (topic: CurriculumTopic) => void;
  onStageChange: (stage: LearningStage) => void;
  onProblemSelect: (problem: string) => void;
  currentStage: LearningStage;
  selectedTopic?: CurriculumTopic;
}

export function CurriculumAwareGuidedLearning({
  character,
  lessonContext,
  onTopicSelect,
  onStageChange,
  onProblemSelect,
  currentStage,
  selectedTopic
}: CurriculumAwareGuidedLearningProps) {
  const [availableTopics, setAvailableTopics] = useState<CurriculumTopic[]>([]);
  const [filteredTopics, setFilteredTopics] = useState<CurriculumTopic[]>([]);
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [filterUnit, setFilterUnit] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lessonSpecificProblems, setLessonSpecificProblems] = useState<string[]>([]);

  const learningContext: LearningContext = lessonContext ? 'lesson_specific' : 'general_exploration';

  // Stage information for curriculum-aware learning
  const STAGE_INFO = {
    topic_selection: {
      title: 'Topic Selection',
      description: learningContext === 'lesson_specific' 
        ? `Working with ${lessonContext?.title || 'current lesson'} concepts`
        : 'Choose a topic from the curriculum scope and sequence',
      icon: '📚'
    },
    problem_exploration: {
      title: 'Problem Exploration',
      description: 'Explore problems and questions related to this topic',
      icon: '🔍'
    },
    guided_solution: {
      title: 'Guided Solution',
      description: 'Work through step-by-step problem solving',
      icon: '🎯'
    },
    concept_connection: {
      title: 'Concept Connection',
      description: 'Connect this learning to broader mathematical concepts',
      icon: '🔗'
    },
    practice_extension: {
      title: 'Practice & Extension',
      description: 'Suggested practice problems and next learning steps',
      icon: '📈'
    }
  };

  // Load curriculum topics from database
  useEffect(() => {
    loadCurriculumTopics();
  }, []);

  // Handle lesson context
  useEffect(() => {
    if (lessonContext) {
      loadLessonSpecificContent();
    }
  }, [lessonContext]);

  // Filter topics based on grade/unit selection
  useEffect(() => {
    let filtered = availableTopics;
    
    if (filterGrade !== 'all') {
      filtered = filtered.filter(topic => topic.grade === filterGrade);
    }
    
    if (filterUnit !== 'all') {
      filtered = filtered.filter(topic => topic.unit.toString() === filterUnit);
    }
    
    setFilteredTopics(filtered);
  }, [availableTopics, filterGrade, filterUnit]);

  const loadCurriculumTopics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/curriculum/topics');
      const data = await response.json();
      
      if (data.success) {
        setAvailableTopics(data.topics);
      }
    } catch (error) {
      console.error('Error loading curriculum topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLessonSpecificContent = async () => {
    if (!lessonContext) return;
    
    try {
      const params = new URLSearchParams({
        grade: lessonContext.grade,
        lesson: lessonContext.lesson.toString()
      });
      
      const response = await fetch(`/api/curriculum/lesson-analysis?${params}`);
      
      const data = await response.json();
      if (data.success) {
        setLessonSpecificProblems(data.analysis?.content_analysis?.problem_types || []);
        // Auto-select the current lesson's topic based on analysis
        const currentTopic: CurriculumTopic = {
          id: data.analysis?.lesson_id || `grade-${lessonContext.grade}-lesson-${lessonContext.lesson}`,
          grade: lessonContext.grade,
          unit: data.analysis?.unit || lessonContext.unit,
          lesson: lessonContext.lesson,
          title: data.analysis?.title || lessonContext.title,
          standards: data.analysis?.standards || [],
          key_concepts: data.analysis?.key_concepts || [],
          prerequisites: data.analysis?.prerequisite_skills || [],
          related_lessons: [],
          difficulty_level: 'developing'
        };
        onTopicSelect(currentTopic);
      }
    } catch (error) {
      console.error('Error loading lesson-specific content:', error);
    }
  };

  const getGradeOptions = () => {
    const grades = [...new Set(availableTopics.map(topic => topic.grade))].sort();
    return grades;
  };

  const getUnitOptions = () => {
    const relevantTopics = filterGrade === 'all' 
      ? availableTopics 
      : availableTopics.filter(topic => topic.grade === filterGrade);
    
    const units = [...new Set(relevantTopics.map(topic => topic.unit))].sort((a, b) => a - b);
    return units;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading curriculum data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Context Banner */}
      <div className={`p-4 rounded-lg border-l-4 ${
        learningContext === 'lesson_specific' 
          ? 'bg-blue-50 border-blue-500'
          : 'bg-green-50 border-green-500'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            learningContext === 'lesson_specific' 
              ? 'bg-blue-100'
              : 'bg-green-100'
          }`}>
            <span className="text-lg">
              {learningContext === 'lesson_specific' ? '📖' : '🌟'}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {learningContext === 'lesson_specific' 
                ? `Lesson-Specific Help: ${lessonContext?.title}`
                : 'General Curriculum Exploration'
              }
            </h3>
            <p className="text-sm text-gray-600">
              {learningContext === 'lesson_specific'
                ? `Grade ${lessonContext?.grade}, Unit ${lessonContext?.unit}, Lesson ${lessonContext?.lesson}`
                : 'Explore any topic from the complete curriculum scope and sequence'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Current Stage Indicator */}
      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">
              {Object.keys(STAGE_INFO).indexOf(currentStage) + 1}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {STAGE_INFO[currentStage].icon} {STAGE_INFO[currentStage].title}
            </h3>
            <p className="text-sm text-gray-600">
              {STAGE_INFO[currentStage].description}
            </p>
          </div>
        </div>
      </div>

      {/* Topic Selection Interface */}
      {currentStage === 'topic_selection' && (
        <div className="space-y-4">
          {learningContext === 'general_exploration' && (
            <>
              <h4 className="font-medium text-gray-700">Filter by Curriculum Scope:</h4>
              <div className="flex space-x-4">
                <select 
                  value={filterGrade} 
                  onChange={(e) => setFilterGrade(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white"
                >
                  <option value="all">All Grades</option>
                  {getGradeOptions().map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
                
                <select 
                  value={filterUnit} 
                  onChange={(e) => setFilterUnit(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white"
                >
                  <option value="all">All Units</option>
                  {getUnitOptions().map(unit => (
                    <option key={unit} value={unit.toString()}>Unit {unit}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">
              {learningContext === 'lesson_specific' 
                ? 'Current lesson topic:'
                : 'Choose a topic to explore:'
              }
            </h4>
            
            {learningContext === 'lesson_specific' && lessonContext ? (
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{lessonContext.title}</h5>
                    <p className="text-sm text-gray-600">
                      Grade {lessonContext.grade} • Unit {lessonContext.unit} • Lesson {lessonContext.lesson}
                    </p>
                  </div>
                  <button
                    onClick={() => onStageChange('problem_exploration')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Explore This Topic
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-3 max-h-96 overflow-y-auto">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onTopicSelect(topic);
                      onStageChange('problem_exploration');
                    }}
                    className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{topic.title}</h5>
                        <div className="flex space-x-2">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Grade {topic.grade}
                          </span>
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            Unit {topic.unit}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            topic.difficulty_level === 'foundation' ? 'bg-green-100 text-green-800' :
                            topic.difficulty_level === 'developing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {topic.difficulty_level}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Standards: {topic.standards.join(', ')}
                      </p>
                      <p className="text-xs text-gray-500">
                        Key concepts: {topic.key_concepts.join(', ')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Problem Exploration Interface */}
      {currentStage === 'problem_exploration' && selectedTopic && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Exploring: {selectedTopic.title}</h4>
            <p className="text-sm text-blue-700">
              Grade {selectedTopic.grade} • Unit {selectedTopic.unit} • Lesson {selectedTopic.lesson}
            </p>
          </div>

          {learningContext === 'lesson_specific' && lessonSpecificProblems.length > 0 && (
            <div className="space-y-3">
              <h5 className="font-medium text-gray-700">Problems from this lesson:</h5>
              {lessonSpecificProblems.map((problem, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onProblemSelect(problem);
                    onStageChange('guided_solution');
                  }}
                  className="w-full p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
                >
                  {problem}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Or choose a type of help:</h5>
            <div className="grid gap-2">
              <button
                onClick={() => onStageChange('guided_solution')}
                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
              >
                💡 I need help understanding a concept from this topic
              </button>
              <button
                onClick={() => onStageChange('guided_solution')}
                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
              >
                🔧 I want to practice problems from this topic
              </button>
              <button
                onClick={() => onStageChange('concept_connection')}
                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
              >
                🔗 How does this connect to other math topics?
              </button>
              <button
                onClick={() => onStageChange('guided_solution')}
                className="p-3 text-left bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm text-gray-700"
              >
                📝 I have a specific question about this lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            const stages = Object.keys(STAGE_INFO) as LearningStage[];
            const currentIndex = stages.indexOf(currentStage);
            if (currentIndex > 0) {
              onStageChange(stages[currentIndex - 1]);
            }
          }}
          disabled={currentStage === 'topic_selection'}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        
        <div className="text-xs text-gray-500">
          {learningContext === 'lesson_specific' ? 'Lesson-Specific Mode' : 'General Exploration Mode'}
        </div>
        
        <button
          onClick={() => onStageChange('topic_selection')}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}

export default CurriculumAwareGuidedLearning;
