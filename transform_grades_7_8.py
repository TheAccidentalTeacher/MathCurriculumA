#!/usr/bin/env python3
"""
Transform Grade 7 and 8 curriculum pages to match Grade 6 structure
Adds 5-day session structure and interactive UI components
"""

import re
import os

def extract_lessons_from_grade(file_path):
    """Extract lesson information from existing grade files"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all lesson arrays
    lesson_pattern = r"lessons: \[(.*?)\]"
    lesson_matches = re.findall(lesson_pattern, content, re.DOTALL)
    
    all_lessons = []
    lesson_number = 1
    
    for match in lesson_matches:
        # Split by commas and clean up
        lessons = [lesson.strip().strip("'\"") for lesson in match.split(',')]
        lessons = [lesson for lesson in lessons if lesson and 'Lesson' in lesson]
        
        for lesson in lessons:
            # Extract lesson title (remove "Lesson X: " prefix)
            title_match = re.search(r'Lesson \d+: (.+)', lesson)
            if title_match:
                title = title_match.group(1)
                all_lessons.append({
                    'number': lesson_number,
                    'title': title,
                    'original': lesson
                })
                lesson_number += 1
    
    return all_lessons

def get_grade_7_standards_and_content():
    """Define Grade 7 specific content"""
    return {
        'units': [
            {
                'unit': 'Unit 1',
                'title': 'Ratios and Proportional Relationships',
                'pages': '15-140',
                'duration': '25 days',
                'domain': 'Ratios and Proportional Relationships',
                'standards': ['7.RP.A.1', '7.RP.A.2', '7.RP.A.3']
            },
            {
                'unit': 'Unit 2', 
                'title': 'Operations with Rational Numbers',
                'pages': '141-250',
                'duration': '25 days',
                'domain': 'The Number System',
                'standards': ['7.NS.A.1', '7.NS.A.2', '7.NS.A.3']
            },
            {
                'unit': 'Unit 3',
                'title': 'Expressions and Equations', 
                'pages': '251-400',
                'duration': '30 days',
                'domain': 'Expressions and Equations',
                'standards': ['7.EE.A.1', '7.EE.A.2', '7.EE.B.3', '7.EE.B.4']
            },
            {
                'unit': 'Unit 4',
                'title': 'Geometry and Measurement',
                'pages': '1-150', 
                'duration': '30 days',
                'domain': 'Geometry',
                'standards': ['7.G.A.1', '7.G.A.2', '7.G.A.3', '7.G.B.4', '7.G.B.6']
            },
            {
                'unit': 'Unit 5',
                'title': 'Angle Relationships',
                'pages': '151-225',
                'duration': '15 days',
                'domain': 'Geometry', 
                'standards': ['7.G.B.5']
            },
            {
                'unit': 'Unit 6',
                'title': 'Surface Area and Volume',
                'pages': '226-330',
                'duration': '25 days',
                'domain': 'Geometry',
                'standards': ['7.G.B.6']
            },
            {
                'unit': 'Unit 7',
                'title': 'Statistics and Probability',
                'pages': '331-424',
                'duration': '20 days',
                'domain': 'Statistics and Probability',
                'standards': ['7.SP.A.1', '7.SP.A.2', '7.SP.B.3', '7.SP.B.4', '7.SP.C.5', '7.SP.C.6', '7.SP.C.7', '7.SP.C.8']
            }
        ]
    }

def get_grade_8_standards_and_content():
    """Define Grade 8 specific content"""
    return {
        'units': [
            {
                'unit': 'Unit 1',
                'title': 'Rigid Transformations and Congruence',
                'pages': '15-112',
                'duration': '20 days',
                'domain': 'Geometry',
                'standards': ['8.G.A.1', '8.G.A.2', '8.G.A.3']
            },
            {
                'unit': 'Unit 2',
                'title': 'Dilations, Similarity, and Introducing Slope',
                'pages': '113-200',
                'duration': '20 days', 
                'domain': 'Geometry',
                'standards': ['8.G.A.3', '8.G.A.4', '8.G.A.5']
            },
            {
                'unit': 'Unit 3',
                'title': 'Linear Relationships',
                'pages': '201-330',
                'duration': '25 days',
                'domain': 'Functions',
                'standards': ['8.F.A.1', '8.F.A.2', '8.F.A.3', '8.F.B.4', '8.F.B.5']
            },
            {
                'unit': 'Unit 4',
                'title': 'Linear Equations and Linear Systems',
                'pages': '331-450',
                'duration': '25 days',
                'domain': 'Expressions and Equations',
                'standards': ['8.EE.C.7', '8.EE.C.8']
            },
            {
                'unit': 'Unit 5',
                'title': 'Functions',
                'pages': '451-530',
                'duration': '15 days',
                'domain': 'Functions',
                'standards': ['8.F.A.1', '8.F.A.2', '8.F.A.3']
            },
            {
                'unit': 'Unit 6',
                'title': 'Scientific Notation and Irrational Numbers',
                'pages': '1-150',
                'duration': '30 days',
                'domain': 'Expressions and Equations',
                'standards': ['8.EE.A.1', '8.EE.A.2', '8.EE.A.3', '8.EE.A.4', '8.NS.A.1', '8.NS.A.2']
            },
            {
                'unit': 'Unit 7',
                'title': 'Volume and Square Roots',
                'pages': '151-270',
                'duration': '20 days',
                'domain': 'Geometry',
                'standards': ['8.G.C.9', '8.NS.A.2']
            },
            {
                'unit': 'Unit 8',
                'title': 'Data Analysis and Linear Association',
                'pages': '271-350',
                'duration': '15 days',
                'domain': 'Statistics and Probability',
                'standards': ['8.SP.A.1', '8.SP.A.2', '8.SP.A.3', '8.SP.A.4']
            }
        ]
    }

def generate_sessions_for_lesson(lesson_title, lesson_number, grade):
    """Generate 5-day session structure for each lesson based on content"""
    
    # Determine content focus for customized activities
    content_type = determine_content_type(lesson_title)
    
    sessions = [
        {
            'day': 1,
            'type': 'Explore',
            'focus': 'Connect prior knowledge and introduce new lesson content',
            'activities': get_explore_activities(content_type, lesson_title)
        },
        {
            'day': 2,
            'type': 'Develop',
            'focus': get_develop_focus(content_type, 1),
            'activities': get_develop_activities(content_type, 1, lesson_title)
        },
        {
            'day': 3,
            'type': 'Develop',
            'focus': get_develop_focus(content_type, 2),
            'activities': get_develop_activities(content_type, 2, lesson_title)
        },
        {
            'day': 4,
            'type': 'Develop',
            'focus': get_develop_focus(content_type, 3),
            'activities': get_develop_activities(content_type, 3, lesson_title)
        },
        {
            'day': 5,
            'type': 'Refine',
            'focus': 'Strengthen skills and connections',
            'activities': get_refine_activities(content_type, lesson_title)
        }
    ]
    
    return sessions

def determine_content_type(lesson_title):
    """Determine the mathematical content type for customized activities"""
    title_lower = lesson_title.lower()
    
    if any(word in title_lower for word in ['ratio', 'rate', 'proportion', 'percent']):
        return 'ratios_proportions'
    elif any(word in title_lower for word in ['rational', 'integer', 'fraction', 'decimal', 'number']):
        return 'number_operations'
    elif any(word in title_lower for word in ['expression', 'equation', 'inequality', 'variable', 'solve', 'algebra']):
        return 'algebra'
    elif any(word in title_lower for word in ['function', 'linear', 'slope', 'graph']):
        return 'functions'
    elif any(word in title_lower for word in ['geometry', 'angle', 'triangle', 'circle', 'area', 'volume', 'surface', 'transformation', 'congruence', 'similarity']):
        return 'geometry'
    elif any(word in title_lower for word in ['statistics', 'probability', 'data', 'distribution', 'sample']):
        return 'statistics'
    elif any(word in title_lower for word in ['scientific notation', 'exponent', 'square root', 'irrational']):
        return 'scientific_notation'
    else:
        return 'general'

def get_explore_activities(content_type, lesson_title):
    """Get exploration activities based on content type"""
    activities_map = {
        'ratios_proportions': ['Ratio investigations', 'Proportional reasoning tasks', 'Real-world rate problems'],
        'number_operations': ['Number line exploration', 'Integer investigations', 'Pattern recognition'],
        'algebra': ['Expression building', 'Equation exploration', 'Variable relationship discovery'],
        'functions': ['Function pattern exploration', 'Graph investigations', 'Input-output relationships'],
        'geometry': ['Shape investigations', 'Transformation exploration', 'Measurement activities'],
        'statistics': ['Data collection', 'Distribution exploration', 'Sample investigations'],
        'scientific_notation': ['Number magnitude exploration', 'Exponent investigations', 'Real-world applications'],
        'general': ['Concept exploration', 'Pattern investigation', 'Prior knowledge activation']
    }
    return activities_map.get(content_type, activities_map['general'])

def get_develop_focus(content_type, day_number):
    """Get development focus for each day"""
    focus_map = {
        'ratios_proportions': [
            'Build understanding of ratio and proportion concepts',
            'Apply proportional reasoning strategies',
            'Solve complex ratio and rate problems'
        ],
        'number_operations': [
            'Build number sense and operation understanding',
            'Apply computational strategies',
            'Solve complex number problems'
        ],
        'algebra': [
            'Build algebraic thinking and representation',
            'Apply algebraic procedures and properties',
            'Solve complex algebraic problems'
        ],
        'functions': [
            'Build understanding of function concepts',
            'Apply function representations and analysis',
            'Solve complex function problems'
        ],
        'geometry': [
            'Build geometric understanding and visualization',
            'Apply geometric properties and relationships',
            'Solve complex geometric problems'
        ],
        'statistics': [
            'Build statistical reasoning and data analysis',
            'Apply statistical methods and interpretation',
            'Solve complex data problems'
        ],
        'scientific_notation': [
            'Build understanding of scientific notation and exponents',
            'Apply scientific notation in calculations',
            'Solve complex scientific notation problems'
        ],
        'general': [
            'Build foundational understanding',
            'Apply concepts and procedures',
            'Solve complex problems'
        ]
    }
    focuses = focus_map.get(content_type, focus_map['general'])
    return focuses[day_number - 1] if day_number <= len(focuses) else focuses[-1]

def get_develop_activities(content_type, day_number, lesson_title):
    """Get development activities for each day"""
    activities_map = {
        'ratios_proportions': [
            ['Ratio tables', 'Proportion setup', 'Unit rate calculations'],
            ['Cross multiplication', 'Scaling strategies', 'Equivalent ratios'],
            ['Complex proportions', 'Multi-step problems', 'Error analysis']
        ],
        'number_operations': [
            ['Operation algorithms', 'Number properties', 'Computational fluency'],
            ['Multi-step calculations', 'Order of operations', 'Estimation strategies'],
            ['Complex problems', 'Error analysis', 'Multiple representations']
        ],
        'algebra': [
            ['Variable representation', 'Expression building', 'Equation setup'],
            ['Algebraic manipulation', 'Solution procedures', 'Property applications'],
            ['Complex equations', 'Multi-step problems', 'Mathematical reasoning']
        ],
        'functions': [
            ['Function notation', 'Graph construction', 'Table analysis'],
            ['Function analysis', 'Rate of change', 'Linear relationships'],
            ['Complex functions', 'Real-world modeling', 'Function comparisons']
        ],
        'geometry': [
            ['Shape properties', 'Measurement techniques', 'Geometric relationships'],
            ['Formula applications', 'Geometric reasoning', 'Coordinate geometry'],
            ['Complex figures', 'Proof reasoning', 'Real-world applications']
        ],
        'statistics': [
            ['Data organization', 'Graph construction', 'Measure calculation'],
            ['Distribution analysis', 'Statistical reasoning', 'Interpretation'],
            ['Complex data sets', 'Statistical inference', 'Real-world applications']
        ],
        'scientific_notation': [
            ['Notation conversion', 'Magnitude comparison', 'Basic operations'],
            ['Calculation procedures', 'Problem solving', 'Real-world contexts'],
            ['Complex calculations', 'Error analysis', 'Applications']
        ],
        'general': [
            ['Concept development', 'Skill building', 'Guided practice'],
            ['Application practice', 'Problem solving', 'Multiple methods'],
            ['Complex problems', 'Error analysis', 'Mathematical reasoning']
        ]
    }
    activities = activities_map.get(content_type, activities_map['general'])
    return activities[day_number - 1] if day_number <= len(activities) else activities[-1]

def get_refine_activities(content_type, lesson_title):
    """Get refinement activities"""
    return ['Practice and fluency', 'Lesson reflection', 'Assessment preparation']

def generate_lesson_object(lesson_info, unit_info, grade):
    """Generate complete lesson object with sessions"""
    lesson_number = lesson_info['number']
    lesson_title = lesson_info['title']
    
    # Generate appropriate standards and pages based on grade and content
    standards = generate_standards_for_lesson(lesson_title, grade, unit_info)
    pages = f"{lesson_number * 15 - 14}-{lesson_number * 15 + 5}"  # Approximate page ranges
    
    lesson_obj = {
        'number': lesson_number,
        'title': lesson_title,
        'pages': pages,
        'standards': standards,
        'objectives': generate_objectives_for_lesson(lesson_title),
        'vocabulary': generate_vocabulary_for_lesson(lesson_title),
        'assessments': ['Lesson Quiz', 'Practice Problems', 'Exit Ticket'],
        'sessions': generate_sessions_for_lesson(lesson_title, lesson_number, grade)
    }
    
    return lesson_obj

def generate_standards_for_lesson(lesson_title, grade, unit_info):
    """Generate appropriate standards based on lesson content and grade"""
    # This is a simplified version - in practice, you'd have a more sophisticated mapping
    if unit_info:
        return unit_info.get('standards', [f'{grade}.MP.1'])  # Mathematical Practices as fallback
    return [f'{grade}.MP.1']

def generate_objectives_for_lesson(lesson_title):
    """Generate learning objectives based on lesson title"""
    # Simplified objective generation
    return [f'Understand and apply concepts related to {lesson_title.lower()}', 'Solve problems using appropriate strategies']

def generate_vocabulary_for_lesson(lesson_title):
    """Generate vocabulary terms based on lesson content"""
    # Basic vocabulary extraction from title
    words = lesson_title.lower().split()
    vocab_words = [word for word in words if len(word) > 4 and word not in ['with', 'using', 'solve', 'understand', 'apply']]
    return vocab_words[:4] if vocab_words else ['mathematical reasoning']

def transform_grade_file(input_path, output_path, grade_num):
    """Transform a grade file to match Grade 6 structure"""
    
    print(f"🔄 Processing Grade {grade_num}...")
    
    # Extract existing lessons
    lessons = extract_lessons_from_grade(input_path)
    print(f"   Found {len(lessons)} lessons")
    
    # Get grade-specific content
    if grade_num == 7:
        grade_content = get_grade_7_standards_and_content()
        grade_color = 'green'
        total_pages = 944
        nav_links = '''
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-8" className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200">Grade 8</Link>
              <Link href="/curriculum/algebra-1" className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Algebra 1</Link>'''
    else:  # Grade 8
        grade_content = get_grade_8_standards_and_content()
        grade_color = 'purple'
        total_pages = 876
        nav_links = '''
              <Link href="/curriculum/grade-6" className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">Grade 6</Link>
              <Link href="/curriculum/grade-7" className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">Grade 7</Link>
              <Link href="/curriculum/algebra-1" className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">Algebra 1</Link>'''
    
    # Build units with lessons
    units_with_lessons = []
    lesson_index = 0
    
    for unit_info in grade_content['units']:
        # Calculate lessons per unit (distribute evenly)
        lessons_in_unit = []
        unit_lesson_count = min(6, len(lessons) - lesson_index)  # Max 6 lessons per unit
        
        for i in range(unit_lesson_count):
            if lesson_index < len(lessons):
                lesson_obj = generate_lesson_object(lessons[lesson_index], unit_info, grade_num)
                lessons_in_unit.append(lesson_obj)
                lesson_index += 1
        
        if lessons_in_unit:  # Only add unit if it has lessons
            unit_with_lessons = unit_info.copy()
            unit_with_lessons['lessons'] = lessons_in_unit
            units_with_lessons.append(unit_with_lessons)
    
    # Generate the new file content
    new_content = f"""'use client';

import Link from 'next/link';
import {{ useState }} from 'react';

export default function Grade{grade_num}Curriculum() {{
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
      stemSpotlight: 'Mathematical Innovation',
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
    <div className="min-h-screen bg-gradient-to-br from-""" + grade_color + """-50 to-""" + grade_color + """-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/curriculum" className="text-""" + grade_color + """-600 hover:text-""" + grade_color + """-800 font-medium">
                ← Back to Curriculum
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-800">Grade """ + str(grade_num) + """ Mathematics</h1>
            </div>
            <div className="flex space-x-2">""" + nav_links + """
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-""" + grade_color + """-800 mb-2">
              Ready Classroom Mathematics Grade """ + str(grade_num) + """
            </h1>
            <p className="text-lg text-gray-600">
              Complete Scope and Sequence • Mathematical Proficiency
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-""" + grade_color + """-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-""" + grade_color + """-600">""" + str(total_pages) + """</div>
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
              <div className="text-2xl font-bold text-rose-600">170</div>
              <div className="text-sm text-gray-600">School Days</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded">
              <span className="font-medium">Standards Coverage:</span> Common Core Mathematics Grade """ + str(grade_num) + """
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
              <div className="bg-""" + grade_color + """-600 text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{unit.unit}: {unit.title}</h2>
                    <p className="text-""" + grade_color + """-100 mb-2">Domain: {unit.domain}</p>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {unit.standards.map((standard, idx) => (
                        <span key={idx} className="bg-""" + grade_color + """-500 px-2 py-1 rounded">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right text-""" + grade_color + """-100">
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
                          <div className="text-""" + grade_color + """-600">
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
          <h3 className="text-xl font-bold text-""" + grade_color + """-800 mb-2">
            Grade """ + str(grade_num) + """ Mathematics Complete
          </h3>
          <p className="text-gray-600">
            {totalLessons} lessons across {units.length} units • {""" + str(total_pages) + """} pages of comprehensive instruction
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Each lesson follows the proven 5-day structure: Explore concepts, Develop understanding through guided practice, and Refine skills for mastery.
          </p>
        </div>
      </div>
    </div>
  );
}}
"""
    
    # Write the new file
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Grade {grade_num} transformation complete!")
    print(f"   Created {len(lessons)} lessons across {len(units_with_lessons)} units")
    return len(lessons)

def main():
    """Main execution function"""
    print("🚀 Starting Grade 7 and 8 transformation...")
    
    # Define file paths
    grade_7_input = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\src\app\curriculum\grade-7\page.tsx"
    grade_8_input = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\src\app\curriculum\grade-8\page.tsx"
    
    grade_7_output = grade_7_input  # Overwrite existing files
    grade_8_output = grade_8_input
    
    # Transform Grade 7
    grade_7_lessons = transform_grade_file(grade_7_input, grade_7_output, 7)
    
    # Transform Grade 8
    grade_8_lessons = transform_grade_file(grade_8_input, grade_8_output, 8)
    
    print(f"🎉 Transformation complete!")
    print(f"   Grade 7: {grade_7_lessons} lessons with 5-day structure")
    print(f"   Grade 8: {grade_8_lessons} lessons with 5-day structure")
    print(f"   All grades now have identical interactive structure!")

if __name__ == "__main__":
    main()
