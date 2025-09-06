#!/usr/bin/env python3
"""
Script to fix Grade 6 lesson boundaries by applying the 12-page offset.

We know that:
- Textbook page 41 = PNG file page_053.png
- Offset = 12 pages (PNG numbers are 12 ahead of textbook numbers)

This script will update all Grade 6 lesson boundaries in database-free-lesson-service.ts
"""

import re

def fix_grade6_lesson_boundaries():
    """Fix Grade 6 lesson boundaries by applying the 12-page offset."""
    
    # Read the current database-free-lesson-service.ts file
    service_file = 'src/lib/database-free-lesson-service.ts'
    
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("🔍 Current Grade 6 lesson boundaries:")
    
    # Initialize variables
    fixed_lessons_v1 = []
    fixed_lessons_v2 = []
    
    # Find Grade 6 Volume 1 section
    v1_pattern = r'(RCM06_NA_SW_V1.*?\{)(.*?)(\}\s*as\s*LessonBoundaries)'
    v1_match = re.search(v1_pattern, content, re.DOTALL)
    
    if v1_match:
        v1_boundaries = v1_match.group(2)
        print("\nGrade 6 Volume 1 boundaries found:")
        
        # Extract lesson numbers and page ranges (Grade 6 uses 'start' and 'end')
        lesson_pattern = r'(\d+):\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*[\'"]([^\'"]*)[\'"]'
        lessons = re.findall(lesson_pattern, v1_boundaries)
        
        for lesson_num, start_page, end_page, title in lessons:
            # Apply the 12-page offset
            new_start = int(start_page) + 12
            new_end = int(end_page) + 12
            
            print(f"  Lesson {lesson_num} ({title}): {start_page}-{end_page} → {new_start}-{new_end}")
            fixed_lessons_v1.append((lesson_num, new_start, new_end, title))
    
    # Find Grade 6 Volume 2 section
    v2_pattern = r'(RCM06_NA_SW_V2.*?\{)(.*?)(\}\s*as\s*LessonBoundaries)'
    v2_match = re.search(v2_pattern, content, re.DOTALL)
    
    if v2_match:
        v2_boundaries = v2_match.group(2)
        print("\nGrade 6 Volume 2 boundaries found:")
        
        # Extract lesson numbers and page ranges (Grade 6 uses 'start' and 'end')
        lessons = re.findall(lesson_pattern, v2_boundaries)
        
        for lesson_num, start_page, end_page, title in lessons:
            # Apply the 12-page offset
            new_start = int(start_page) + 12
            new_end = int(end_page) + 12
            
            print(f"  Lesson {lesson_num} ({title}): {start_page}-{end_page} → {new_start}-{new_end}")
            fixed_lessons_v2.append((lesson_num, new_start, new_end, title))
    
    # Generate new lesson boundaries
    print("\n🔧 Generating fixed lesson boundaries...")
    
    # Generate new V1 boundaries
    new_v1_content = ""
    for lesson_num, start_page, end_page, title in fixed_lessons_v1:
        new_v1_content += f"      {lesson_num}: {{ start: {start_page}, end: {end_page}, title: '{title}' }},\n"
    
    # Generate new V2 boundaries  
    new_v2_content = ""
    for lesson_num, start_page, end_page, title in fixed_lessons_v2:
        new_v2_content += f"      {lesson_num}: {{ start: {start_page}, end: {end_page}, title: '{title}' }},\n"
    
    # Replace in the content
    if v1_match:
        new_v1_section = v1_match.group(1) + "\n" + new_v1_content + "  " + v1_match.group(3)
        content = content.replace(v1_match.group(0), new_v1_section)
        print(f"✅ Updated Grade 6 Volume 1 boundaries")
    
    if v2_match:
        new_v2_section = v2_match.group(1) + "\n" + new_v2_content + "  " + v2_match.group(3)
        content = content.replace(v2_match.group(0), new_v2_section)
        print(f"✅ Updated Grade 6 Volume 2 boundaries")
    
    # Write the updated content back
    with open(service_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Updated {service_file}")
    print("\n🎯 Test with: /lesson/RCM06_NA_SW_V2/3 (should show Lesson 3 Surface Area)")

def verify_specific_lessons():
    """Verify specific lesson mappings."""
    
    print("\n" + "="*60)
    print("VERIFICATION")
    print("="*60)
    
    # Known mappings we can verify
    known_mappings = [
        ("Lesson 3", "Surface Area", "textbook page 41", "PNG page 53"),
        # Add more as we discover them
    ]
    
    for lesson, topic, textbook_page, png_page in known_mappings:
        print(f"✅ {lesson} ({topic}): {textbook_page} → {png_page}")
    
    print(f"\n📝 Offset formula: PNG_page = textbook_page + 12")

if __name__ == "__main__":
    print("🔧 FIXING GRADE 6 LESSON BOUNDARIES")
    print("="*60)
    
    fix_grade6_lesson_boundaries()
    verify_specific_lessons()
    
    print(f"\n🚀 Next steps:")
    print(f"   1. Test lesson navigation: /lesson/RCM06_NA_SW_V2/3")
    print(f"   2. Verify more lessons manually")
    print(f"   3. Adjust individual lessons if needed")
