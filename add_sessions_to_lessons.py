#!/usr/bin/env python3
"""
Script to add 5-day session structure to all Grade 6 lessons that don't already have it.
"""

import re
import os

def add_sessions_to_lesson(lesson_number, lesson_title):
    """Generate session structure for a lesson based on its title."""
    
    # Base session template
    sessions = [
        {
            "day": 1,
            "type": "Explore", 
            "focus": f"Connect prior knowledge and introduce {lesson_title.lower()} concepts",
            "activities": ["Concept exploration", "Pattern investigation", "Initial discovery"]
        },
        {
            "day": 2,
            "type": "Develop",
            "focus": f"Build understanding of {lesson_title.lower()} fundamentals", 
            "activities": ["Core concept development", "Guided practice", "Method instruction"]
        },
        {
            "day": 3,
            "type": "Develop",
            "focus": f"Apply {lesson_title.lower()} to problem solving",
            "activities": ["Problem solving", "Real-world applications", "Multiple representations"]
        },
        {
            "day": 4,
            "type": "Develop", 
            "focus": f"Extend {lesson_title.lower()} understanding and reasoning",
            "activities": ["Complex problems", "Error analysis", "Mathematical reasoning"]
        },
        {
            "day": 5,
            "type": "Refine",
            "focus": "Strengthen skills and make connections",
            "activities": ["Practice and fluency", "Reflection", "Assessment preparation"]
        }
    ]
    
    # Customize based on lesson content
    if "decimal" in lesson_title.lower():
        sessions[0]["activities"] = ["Decimal place value exploration", "Pattern investigation", "Real-world decimal contexts"]
        sessions[1]["activities"] = ["Algorithm development", "Place value alignment", "Estimation strategies"]
        sessions[2]["activities"] = ["Multi-step decimal problems", "Real-world applications", "Calculator verification"]
    elif "fraction" in lesson_title.lower():
        sessions[0]["activities"] = ["Fraction model exploration", "Equivalent fraction patterns", "Visual representations"]
        sessions[1]["activities"] = ["Algorithm development", "Common denominator methods", "Cross multiplication"]
        sessions[2]["activities"] = ["Word problem solving", "Mixed number applications", "Real-world fractions"]
    elif "ratio" in lesson_title.lower():
        sessions[0]["activities"] = ["Ratio relationship exploration", "Proportional reasoning", "Rate discovery"]
        sessions[1]["activities"] = ["Ratio table construction", "Equivalent ratio methods", "Scaling strategies"]
        sessions[2]["activities"] = ["Real-world ratio problems", "Unit rate applications", "Proportion solving"]
    elif "percent" in lesson_title.lower():
        sessions[0]["activities"] = ["Percent meaning exploration", "Ratio to percent connections", "Visual models"]
        sessions[1]["activities"] = ["Percent calculation methods", "Decimal-percent conversion", "Benchmark percents"]
        sessions[2]["activities"] = ["Real-world percent problems", "Tax and discount applications", "Percent change"]
    elif "equation" in lesson_title.lower() or "expression" in lesson_title.lower():
        sessions[0]["activities"] = ["Variable exploration", "Expression building", "Equation meaning"]
        sessions[1]["activities"] = ["Equation solving methods", "Inverse operations", "Solution verification"]
        sessions[2]["activities"] = ["Word problem translation", "Multi-step equations", "Real-world modeling"]
    elif "coordinate" in lesson_title.lower() or "graph" in lesson_title.lower():
        sessions[0]["activities"] = ["Coordinate plane exploration", "Point plotting", "Quadrant identification"]
        sessions[1]["activities"] = ["Graphing techniques", "Scale and axis understanding", "Coordinate relationships"]
        sessions[2]["activities"] = ["Real-world graphing", "Distance problems", "Coordinate applications"]
    elif "data" in lesson_title.lower() or "statistic" in lesson_title.lower():
        sessions[0]["activities"] = ["Data collection exploration", "Statistical question investigation", "Distribution observation"]
        sessions[1]["activities"] = ["Data display construction", "Measure calculation", "Graph interpretation"]
        sessions[2]["activities"] = ["Real-world data analysis", "Comparison tasks", "Statistical reasoning"]
    
    return sessions

def format_sessions_code(sessions):
    """Convert sessions list to TypeScript code."""
    code = "          sessions: [\n"
    for session in sessions:
        code += "            {\n"
        code += f"              day: {session['day']},\n"
        code += f"              type: '{session['type']}',\n"
        code += f"              focus: '{session['focus']}',\n"
        code += "              activities: ["
        activities_str = ", ".join([f"'{activity}'" for activity in session['activities']])
        code += activities_str + "]\n"
        code += "            },\n"
    code += "          ]"
    return code

def main():
    file_path = r"C:\Users\scoso\MathCurriculum\MathCurriculumA\src\app\curriculum\grade-6\page.tsx"
    
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all lesson objects that don't have sessions
    lesson_pattern = r'{\s*number:\s*(\d+),\s*title:\s*[\'"]([^\'\"]+)[\'"],.*?assessments:\s*\[[^\]]+\]\s*}'
    
    lessons_to_update = []
    
    for match in re.finditer(lesson_pattern, content, re.DOTALL):
        lesson_num = int(match.group(1))
        lesson_title = match.group(2)
        lesson_block = match.group(0)
        
        # Check if this lesson already has sessions
        if 'sessions:' not in lesson_block:
            lessons_to_update.append((lesson_num, lesson_title, match))
    
    print(f"Found {len(lessons_to_update)} lessons that need session structure:")
    for lesson_num, title, _ in lessons_to_update:
        print(f"  Lesson {lesson_num}: {title}")
    
    # Process lessons in reverse order to avoid index shifting
    updated_content = content
    for lesson_num, lesson_title, match in reversed(lessons_to_update):
        print(f"\nProcessing Lesson {lesson_num}: {lesson_title}")
        
        # Generate sessions for this lesson
        sessions = add_sessions_to_lesson(lesson_num, lesson_title)
        sessions_code = format_sessions_code(sessions)
        
        # Replace the lesson block with one that includes sessions
        old_block = match.group(0)
        # Insert sessions before the closing brace
        new_block = old_block[:-1] + ",\n" + sessions_code + "\n        }"
        
        updated_content = updated_content.replace(old_block, new_block)
        print(f"  ✓ Added sessions to Lesson {lesson_num}")
    
    # Write the updated content back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)
    
    print(f"\n✅ Successfully updated {len(lessons_to_update)} lessons with session structure!")
    print("All Grade 6 lessons now have the 5-day Explore→Develop→Develop→Develop→Refine structure.")

if __name__ == "__main__":
    main()
