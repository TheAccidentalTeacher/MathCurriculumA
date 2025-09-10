#!/usr/bin/env python3
"""
Transform Algebra 1 curriculum page to match Grade 6-8 interactive structure
Adds 5-day session structure and clickable lesson expansion
"""

import re
import os

def extract_algebra_lessons():
    """Extract lesson information from the current Algebra 1 structure"""
    lessons = [
        {'number': 1, 'title': 'Analyze and Use Properties of Real Numbers', 'unit': 1},
        {'number': 2, 'title': 'Write and Evaluate Algebraic Expressions', 'unit': 1},
        {'number': 3, 'title': 'Solve Linear Equations', 'unit': 1},
        {'number': 4, 'title': 'Solve Linear Inequalities', 'unit': 1},
        {'number': 5, 'title': 'Understand Relations and Functions', 'unit': 2},
        {'number': 6, 'title': 'Understand Linear Functions', 'unit': 2},
        {'number': 7, 'title': 'Write Linear Functions', 'unit': 2},
        {'number': 8, 'title': 'Graph Linear Functions', 'unit': 2},
        {'number': 9, 'title': 'Solve Problems Using Linear Functions', 'unit': 2},
        {'number': 10, 'title': 'Understand Systems of Linear Equations', 'unit': 3},
        {'number': 11, 'title': 'Solve Systems by Graphing', 'unit': 3},
        {'number': 12, 'title': 'Solve Systems by Substitution', 'unit': 3},
        {'number': 13, 'title': 'Solve Systems by Linear Combination', 'unit': 3},
        {'number': 14, 'title': 'Understand Sequences', 'unit': 4},
        {'number': 15, 'title': 'Understand Exponential Functions', 'unit': 4},
        {'number': 16, 'title': 'Compare Linear and Exponential Functions', 'unit': 4},
        {'number': 17, 'title': 'Solve Exponential Equations', 'unit': 4},
        {'number': 18, 'title': 'Use Exponential Functions to Model Situations', 'unit': 4},
        {'number': 19, 'title': 'Add and Subtract Polynomials', 'unit': 5},
        {'number': 20, 'title': 'Multiply Polynomials', 'unit': 5},
        {'number': 21, 'title': 'Understand Quadratic Functions', 'unit': 5},
        {'number': 22, 'title': 'Solve Problems Using Quadratic Functions', 'unit': 5},
        {'number': 23, 'title': 'Solve Quadratic Equations by Graphing', 'unit': 6},
        {'number': 24, 'title': 'Solve Quadratic Equations by Factoring', 'unit': 6},
        {'number': 25, 'title': 'Solve Quadratic Equations Using the Quadratic Formula', 'unit': 6},
        {'number': 26, 'title': 'Analyze Data Distributions', 'unit': 7},
        {'number': 27, 'title': 'Interpret Linear Models', 'unit': 7},
        {'number': 28, 'title': 'Make Inferences and Justify Conclusions', 'unit': 7}
    ]
    return lessons

def get_algebra_units_structure():
    """Define Algebra 1 unit structure with standards"""
    return [
        {
            'unit': 'Unit 1',
            'title': 'Expressions, Equations, and Inequalities',
            'pages': '15-140',
            'duration': '24 days',
            'domain': 'Seeing Structure in Expressions & Creating Equations',
            'standards': ['A-SSE.A.1', 'A-SSE.A.2', 'A-CED.A.1', 'A-CED.A.3', 'A-REI.A.1', 'A-REI.B.3'],
            'stemSpotlight': 'Mathematical Modeling'
        },
        {
            'unit': 'Unit 2',
            'title': 'Functions and Linear Relationships',
            'pages': '141-280',
            'duration': '30 days',
            'domain': 'Interpreting Functions & Building Functions',
            'standards': ['F-IF.A.1', 'F-IF.A.2', 'F-IF.B.4', 'F-IF.B.6', 'F-IF.C.7', 'F-BF.A.1'],
            'stemSpotlight': 'Data Science Applications'
        },
        {
            'unit': 'Unit 3',
            'title': 'Systems of Linear Equations',
            'pages': '281-380',
            'duration': '24 days',
            'domain': 'Reasoning with Equations and Inequalities',
            'standards': ['A-REI.C.5', 'A-REI.C.6', 'A-REI.D.11', 'A-CED.A.2', 'A-CED.A.3'],
            'stemSpotlight': 'Engineering Optimization'
        },
        {
            'unit': 'Unit 4',
            'title': 'Sequences and Exponential Functions',
            'pages': '1-150',
            'duration': '30 days',
            'domain': 'Linear, Quadratic, and Exponential Models',
            'standards': ['F-IF.A.3', 'F-IF.B.4', 'F-IF.C.7', 'F-IF.C.8', 'F-LE.A.1', 'F-LE.A.2', 'F-LE.B.5'],
            'stemSpotlight': 'Population Dynamics & Growth'
        },
        {
            'unit': 'Unit 5',
            'title': 'Polynomials and Quadratic Functions',
            'pages': '151-270',
            'duration': '24 days',
            'domain': 'Arithmetic with Polynomials and Rational Expressions',
            'standards': ['A-APR.A.1', 'A-SSE.A.2', 'A-SSE.B.3', 'F-IF.B.4', 'F-IF.C.7', 'F-IF.C.8'],
            'stemSpotlight': 'Physics & Projectile Motion'
        },
        {
            'unit': 'Unit 6',
            'title': 'Quadratic Equations and Functions',
            'pages': '271-380',
            'duration': '18 days',
            'domain': 'Reasoning with Equations and Inequalities',
            'standards': ['A-REI.B.4', 'A-REI.D.11', 'F-IF.C.8', 'F-BF.B.3'],
            'stemSpotlight': 'Optimization Problems'
        },
        {
            'unit': 'Unit 7',
            'title': 'Statistics and Data Analysis',
            'pages': '381-478',
            'duration': '18 days',
            'domain': 'Interpreting Categorical and Quantitative Data',
            'standards': ['S-ID.B.6', 'S-ID.C.7', 'S-ID.C.8', 'S-ID.C.9'],
            'stemSpotlight': 'Statistical Analysis'
        }
    ]

def determine_algebra_content_type(lesson_title):
    """Determine the mathematical content type for Algebra 1 lessons"""
    title_lower = lesson_title.lower()
    
    if any(word in title_lower for word in ['properties', 'real numbers', 'expression', 'evaluate']):
        return 'expressions_properties'
    elif any(word in title_lower for word in ['linear equation', 'solve equation', 'inequality']):
        return 'equations_inequalities'
    elif any(word in title_lower for word in ['function', 'relation', 'linear function', 'graph']):
        return 'functions'
    elif any(word in title_lower for word in ['system', 'substitution', 'elimination', 'combination']):
        return 'systems'
    elif any(word in title_lower for word in ['sequence', 'exponential', 'model']):
        return 'exponential_sequences'
    elif any(word in title_lower for word in ['polynomial', 'quadratic', 'multiply', 'factor']):
        return 'polynomials_quadratics'
    elif any(word in title_lower for word in ['statistics', 'data', 'distribution', 'inference']):
        return 'statistics'
    else:
        return 'general_algebra'

def get_algebra_explore_activities(content_type, lesson_title):
    """Get exploration activities for Algebra 1 content"""
    activities_map = {
        'expressions_properties': ['Number system exploration', 'Algebraic expression investigations', 'Property discovery activities'],
        'equations_inequalities': ['Equation balance exploration', 'Inequality reasoning', 'Real-world problem contexts'],
        'functions': ['Function relationship discovery', 'Input-output investigations', 'Graphical pattern analysis'],
        'systems': ['Multiple constraint exploration', 'Intersection investigations', 'Real-world system modeling'],
        'exponential_sequences': ['Growth pattern exploration', 'Sequence investigations', 'Exponential vs linear comparisons'],
        'polynomials_quadratics': ['Polynomial structure exploration', 'Factoring investigations', 'Quadratic pattern discovery'],
        'statistics': ['Data collection and exploration', 'Distribution investigations', 'Statistical reasoning'],
        'general_algebra': ['Algebraic concept exploration', 'Pattern investigation', 'Mathematical reasoning']
    }
    return activities_map.get(content_type, activities_map['general_algebra'])

def get_algebra_develop_focus(content_type, day_number):
    """Get development focus for Algebra 1 content"""
    focus_map = {
        'expressions_properties': [
            'Build understanding of real number properties and algebraic expressions',
            'Apply expression evaluation and simplification techniques',
            'Solve complex expression and property problems'
        ],
        'equations_inequalities': [
            'Build equation and inequality solving strategies',
            'Apply algebraic procedures and properties',
            'Solve complex multi-step problems'
        ],
        'functions': [
            'Build function concepts and representations',
            'Apply function analysis and graphing techniques',
            'Solve complex function problems and applications'
        ],
        'systems': [
            'Build understanding of systems and solution methods',
            'Apply systematic solving procedures',
            'Solve complex system applications'
        ],
        'exponential_sequences': [
            'Build understanding of exponential growth and sequences',
            'Apply exponential modeling and analysis',
            'Solve complex exponential and sequence problems'
        ],
        'polynomials_quadratics': [
            'Build polynomial and quadratic understanding',
            'Apply algebraic operations and factoring',
            'Solve complex polynomial and quadratic problems'
        ],
        'statistics': [
            'Build statistical reasoning and data analysis skills',
            'Apply statistical methods and interpretation',
            'Solve complex data analysis problems'
        ],
        'general_algebra': [
            'Build foundational algebraic understanding',
            'Apply algebraic concepts and procedures',
            'Solve complex algebraic problems'
        ]
    }
    focuses = focus_map.get(content_type, focus_map['general_algebra'])
    return focuses[day_number - 1] if day_number <= len(focuses) else focuses[-1]

def get_algebra_develop_activities(content_type, day_number, lesson_title):
    """Get development activities for Algebra 1 content"""
    activities_map = {
        'expressions_properties': [
            ['Property applications', 'Expression simplification', 'Algebraic manipulation'],
            ['Multi-step evaluations', 'Complex expressions', 'Error analysis'],
            ['Advanced properties', 'Real-world applications', 'Mathematical reasoning']
        ],
        'equations_inequalities': [
            ['Equation solving procedures', 'Inequality reasoning', 'Solution verification'],
            ['Multi-step equations', 'Complex inequalities', 'Graphical solutions'],
            ['Advanced problem solving', 'Real-world applications', 'Mathematical modeling']
        ],
        'functions': [
            ['Function notation and evaluation', 'Domain and range', 'Function representations'],
            ['Function analysis', 'Graphing techniques', 'Function transformations'],
            ['Advanced function concepts', 'Real-world modeling', 'Function comparisons']
        ],
        'systems': [
            ['System setup and interpretation', 'Graphical solutions', 'Solution verification'],
            ['Algebraic solution methods', 'Substitution and elimination', 'System analysis'],
            ['Complex systems', 'Real-world applications', 'Optimization problems']
        ],
        'exponential_sequences': [
            ['Sequence patterns', 'Exponential properties', 'Function comparisons'],
            ['Exponential modeling', 'Growth and decay', 'Equation solving'],
            ['Complex modeling', 'Real-world applications', 'Advanced exponential concepts']
        ],
        'polynomials_quadratics': [
            ['Polynomial operations', 'Quadratic properties', 'Factoring techniques'],
            ['Advanced operations', 'Quadratic solving', 'Function analysis'],
            ['Complex problems', 'Real-world applications', 'Advanced quadratic concepts']
        ],
        'statistics': [
            ['Data organization', 'Statistical measures', 'Graph construction'],
            ['Data analysis', 'Model interpretation', 'Statistical reasoning'],
            ['Advanced analysis', 'Inference making', 'Statistical applications']
        ],
        'general_algebra': [
            ['Concept development', 'Skill building', 'Guided practice'],
            ['Application practice', 'Problem solving', 'Multiple methods'],
            ['Complex problems', 'Error analysis', 'Mathematical reasoning']
        ]
    }
    activities = activities_map.get(content_type, activities_map['general_algebra'])
    return activities[day_number - 1] if day_number <= len(activities) else activities[-1]

def generate_algebra_sessions(lesson_title, lesson_number):
    """Generate 5-day session structure for Algebra 1 lessons"""
    content_type = determine_algebra_content_type(lesson_title)
    
    sessions = [
        {
            'day': 1,
            'type': 'Explore',
            'focus': 'Connect prior knowledge and introduce new algebraic concepts',
            'activities': get_algebra_explore_activities(content_type, lesson_title)
        },
        {
            'day': 2,
            'type': 'Develop',
            'focus': get_algebra_develop_focus(content_type, 1),
            'activities': get_algebra_develop_activities(content_type, 1, lesson_title)
        },
        {
            'day': 3,
            'type': 'Develop',
            'focus': get_algebra_develop_focus(content_type, 2),
            'activities': get_algebra_develop_activities(content_type, 2, lesson_title)
        },
        {
            'day': 4,
            'type': 'Develop',
            'focus': get_algebra_develop_focus(content_type, 3),
            'activities': get_algebra_develop_activities(content_type, 3, lesson_title)
        },
        {
            'day': 5,
            'type': 'Refine',
            'focus': 'Strengthen algebraic skills and make connections',
            'activities': ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']
        }
    ]
    
    return sessions

def generate_algebra_objectives(lesson_title):
    """Generate learning objectives for Algebra 1 lessons"""
    if 'properties' in lesson_title.lower():
        return ['Apply properties of real numbers in algebraic contexts', 'Analyze and classify real numbers']
    elif 'expression' in lesson_title.lower():
        return ['Write and evaluate algebraic expressions', 'Simplify complex algebraic expressions']
    elif 'equation' in lesson_title.lower():
        return ['Solve linear equations using algebraic properties', 'Apply equation solving to real-world problems']
    elif 'function' in lesson_title.lower():
        return ['Understand and analyze function relationships', 'Apply function concepts to solve problems']
    elif 'system' in lesson_title.lower():
        return ['Solve systems of linear equations', 'Apply systems to model real-world situations']
    elif 'exponential' in lesson_title.lower():
        return ['Understand exponential growth and decay', 'Model situations using exponential functions']
    elif 'polynomial' in lesson_title.lower():
        return ['Perform operations with polynomials', 'Apply polynomial concepts to solve problems']
    elif 'quadratic' in lesson_title.lower():
        return ['Solve quadratic equations using multiple methods', 'Analyze quadratic functions and their properties']
    else:
        return [f'Understand and apply concepts related to {lesson_title.lower()}', 'Solve problems using appropriate algebraic strategies']

def generate_algebra_vocabulary(lesson_title):
    """Generate vocabulary terms for Algebra 1 lessons"""
    title_lower = lesson_title.lower()
    vocab_map = {
        'properties': ['commutative', 'associative', 'distributive', 'identity'],
        'expression': ['variable', 'coefficient', 'constant', 'term'],
        'equation': ['solution', 'equivalent', 'inverse operations', 'linear'],
        'function': ['domain', 'range', 'input', 'output'],
        'system': ['intersection', 'substitution', 'elimination', 'solution set'],
        'exponential': ['base', 'exponent', 'growth rate', 'decay'],
        'polynomial': ['degree', 'leading coefficient', 'monomial', 'binomial'],
        'quadratic': ['parabola', 'vertex', 'axis of symmetry', 'discriminant'],
        'statistics': ['correlation', 'regression', 'distribution', 'inference']
    }
    
    for key, vocab in vocab_map.items():
        if key in title_lower:
            return vocab
    
    # Default vocabulary
    return ['algebraic thinking', 'mathematical reasoning', 'problem solving', 'modeling']

def generate_lesson_object_algebra(lesson_info, unit_info):
    """Generate complete lesson object for Algebra 1"""
    lesson_number = lesson_info['number']
    lesson_title = lesson_info['title']
    
    pages = f"{lesson_number * 20 - 19}-{lesson_number * 20 + 10}"  # Algebra page ranges
    
    lesson_obj = {
        'number': lesson_number,
        'title': lesson_title,
        'pages': pages,
        'standards': unit_info.get('standards', ['A-REI.A.1'])[:2],  # Limit to 2 standards per lesson
        'objectives': generate_algebra_objectives(lesson_title),
        'vocabulary': generate_algebra_vocabulary(lesson_title),
        'assessments': ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
        'sessions': generate_algebra_sessions(lesson_title, lesson_number)
    }
    
    return lesson_obj

def transform_algebra_file():
    """Transform Algebra 1 file to interactive format"""
    
    print("🔄 Processing Algebra 1...")
    
    # Extract lessons and units
    lessons = extract_algebra_lessons()
    units_structure = get_algebra_units_structure()
    
    print(f"   Found {len(lessons)} lessons across {len(units_structure)} units")
    
    # Build units with lessons
    units_with_lessons = []
    
    for unit_info in units_structure:
        unit_number = int(unit_info['unit'].split()[1])
        unit_lessons = [lesson for lesson in lessons if lesson['unit'] == unit_number]
        
        lessons_with_sessions = []
        for lesson_info in unit_lessons:
            lesson_obj = generate_lesson_object_algebra(lesson_info, unit_info)
            lessons_with_sessions.append(lesson_obj)
        
        unit_with_lessons = unit_info.copy()
        unit_with_lessons['lessons'] = lessons_with_sessions
        units_with_lessons.append(unit_with_lessons)
    
    # Generate the new file content
    new_content = f"""'use client';

import Link from 'next/link';
import {{ useState }} from 'react';

export default function Algebra1Curriculum() {{
  const [expandedLessons, setExpandedLessons] = useState<Set<number>>(new Set());

  const toggleLesson = (lessonNumber: number) => {{
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonNumber)) {{
      newExpanded.delete(lessonNumber);
    }} else {{
      newExpanded.add(lessonNumber);
    }}
    setExpandedLessons(newExpanded);
  }};

  const units = [
"""
    
    # Add units array
    for i, unit in enumerate(units_with_lessons):
        new_content += f"""    {{
      unit: '{unit['unit']}',
      title: '{unit['title']}',
      pages: '{unit['pages']}',
      duration: '{unit['duration']}',
      domain: '{unit['domain']}',
      stemSpotlight: '{unit['stemSpotlight']}',
      standards: {str(unit['standards']).replace("'", "'")},
      lessons: [
"""
        
        # Add lessons for this unit
        for j, lesson in enumerate(unit['lessons']):
            new_content += f"""        {{
          number: {lesson['number']},
          title: '{lesson['title']}',
          pages: '{lesson['pages']}',
          standards: {str(lesson['standards']).replace("'", "'")},
          objectives: {str(lesson['objectives']).replace("'", "'")},
          vocabulary: {str(lesson['vocabulary']).replace("'", "'")},
          assessments: {str(lesson['assessments']).replace("'", "'")},
          sessions: [
"""
            
            # Add sessions for this lesson
            for k, session in enumerate(lesson['sessions']):
                new_content += f"""            {{
              day: {session['day']},
              type: '{session['type']}',
              focus: '{session['focus']}',
              activities: {str(session['activities']).replace("'", "'")}
            }}"""
                if k < len(lesson['sessions']) - 1:
                    new_content += ","
                new_content += "\n"
            
            new_content += "          ]\n        }"
            if j < len(unit['lessons']) - 1:
                new_content += ","
            new_content += "\n"
        
        new_content += "      ]\n    }"
        if i < len(units_with_lessons) - 1:
            new_content += ","
        new_content += "\n"
    
    new_content += """  ];

  const totalLessons = units.reduce((sum, unit) => sum + unit.lessons.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-red-600 hover:text-red-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Algebra 1 Mathematics</h1>
            </div>
            <div className="flex space-x-2">
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-7" className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Grade 7</Link>
              <Link href="/curriculum/grade-8" className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Grade 8</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-800 mb-2">
              Ready Classroom Mathematics Algebra 1
            </h1>
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • College and Career Readiness
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">1354</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
              <div className="text-sm text-gray-600">Lessons</div>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{units.length}</div>
              <div className="text-sm text-gray-600">Units</div>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-rose-600">168</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Standards Coverage:</span> Common Core Algebra 1
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Session Structure:</span> 5-day Explore→Develop→Develop→Develop→Refine
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Assessment:</span> Continuous formative and summative evaluation
            </div>
          </div>
        </div>

        {/* Units Grid */}
        <div className="space-y-6">
          {units.map((unit, unitIndex) => (
            <div key={unitIndex} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Unit Header */}
              <div className="bg-red-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{unit.unit}: {unit.title}</h2>
                    <p className="text-red-100 mb-2">Domain: {unit.domain}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {unit.standards.map((standard, idx) => (
                        <span key={idx} className="bg-red-500 px-2 py-1 rounded">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-red-100">
                    <div>Pages {unit.pages}</div>
                    <div>{unit.duration}</div>
                    <div className="text-xs mt-1">STEM: {unit.stemSpotlight}</div>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="p-6">
                <div className="space-y-4">
                  {unit.lessons.map((lesson) => (
                    <div key={lesson.number} className="border border-gray-200 rounded-lg">
                      {/* Lesson Header */}
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleLesson(lesson.number)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              Lesson {lesson.number}: {lesson.title}
                            </h3>
                            <div className="mt-1 text-sm text-gray-600">
                              Pages {lesson.pages} • Standards: {lesson.standards.join(', ')}
                            </div>
                          </div>
                          <div className="text-red-600">
                            {expandedLessons.has(lesson.number) ? '−' : '+'}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Lesson Content */}
                      {expandedLessons.has(lesson.number) && (
                        <div className="border-t border-gray-200 p-4 bg-gray-50">
                          {/* Lesson Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Learning Objectives</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {lesson.objectives.map((obj, idx) => (
                                  <li key={idx}>• {obj}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Key Vocabulary</h4>
                              <div className="flex flex-wrap gap-2">
                                {lesson.vocabulary.map((term, idx) => (
                                  <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {term}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* 5-Day Session Structure */}
                          <div>
                            <h4 className="font-medium text-gray-800 mb-3">5-Day Session Structure</h4>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                              {lesson.sessions.map((session) => (
                                <div key={session.day} className={`p-3 rounded-lg border-l-4 ${{
                                  'Explore': 'bg-cyan-50 border-cyan-400',
                                  'Develop': 'bg-blue-50 border-blue-400',
                                  'Refine': 'bg-green-50 border-green-400'
                                }[session.type]}`}>
                                  <div className="font-medium text-sm text-gray-800">
                                    Day {session.day}: {session.type}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1 mb-2">
                                    {session.focus}
                                  </div>
                                  <div className="space-y-1">
                                    {session.activities.map((activity, idx) => (
                                      <div key={idx} className="text-xs text-gray-500">
                                        • {activity}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Assessment Methods */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h4 className="font-medium text-gray-800 mb-2">Assessment Methods</h4>
                            <div className="flex flex-wrap gap-2">
                              {lesson.assessments.map((assessment, idx) => (
                                <span key={idx} className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
                                  {assessment}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 text-center">
          <h3 className="text-xl font-bold text-red-800 mb-2">
            Algebra 1 Mathematics Complete
          </h3>
          <p className="text-gray-600">
            {totalLessons} lessons across {units.length} units • 1354 pages of comprehensive instruction
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Each lesson follows the proven 5-day structure: Explore concepts, Develop understanding through guided practice, and Refine skills for mastery.
          </p>
        </div>
      </div>
    </div>
  );
}
"""
    
    # Write the file
    output_path = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\src\app\curriculum\algebra-1\page.tsx"
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✅ Algebra 1 transformation complete!")
    print(f"   Created {len(lessons)} lessons across {len(units_with_lessons)} units")
    print("   Added 5-day interactive session structure")
    return len(lessons)

def main():
    """Main execution function"""
    print("🚀 Starting Algebra 1 transformation...")
    
    algebra_lessons = transform_algebra_file()
    
    print(f"🎉 Transformation complete!")
    print(f"   Algebra 1: {algebra_lessons} lessons with 5-day structure")
    print(f"   All lessons now clickable with interactive session details!")

if __name__ == "__main__":
    main()
