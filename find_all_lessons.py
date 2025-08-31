#!/usr/bin/env python3

import json
import re
import os

def find_lesson_boundaries(volume_path, volume_name):
    """Find all lesson boundaries for a given volume"""
    
    document_path = os.path.join(volume_path, 'data', 'document.json')
    if not os.path.exists(document_path):
        print(f"❌ Document not found: {document_path}")
        return {}
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    total_pages = document['total_pages']
    print(f"\n📚 ======= {volume_name} =======")
    print(f"📄 Total pages: {total_pages}")
    
    lessons = {}
    lesson_starts = {}
    
    # Find all lesson start pages (pages with "Dear Family")
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        
        # Look for lesson start pattern
        match = re.search(r'LESSON\s+(\d+)\s+.*?Dear Family', text_preview, re.IGNORECASE)
        if match:
            lesson_num = int(match.group(1))
            lesson_starts[lesson_num] = page['page_number']
            
            # Extract lesson title
            title_match = re.search(r'LESSON\s+\d+\s+(.*?)\s+Dear Family', text_preview, re.IGNORECASE)
            if title_match:
                title = title_match.group(1).strip()
                lessons[lesson_num] = {
                    'start': page['page_number'],
                    'title': title
                }
    
    # Calculate end pages based on next lesson starts
    sorted_lessons = sorted(lessons.keys())
    for i, lesson_num in enumerate(sorted_lessons):
        if i < len(sorted_lessons) - 1:
            next_lesson = sorted_lessons[i + 1]
            lessons[lesson_num]['end'] = lessons[next_lesson]['start'] - 1
        else:
            # Last lesson goes to end of document
            lessons[lesson_num]['end'] = total_pages
    
    # Print results
    print(f"📖 Found {len(lessons)} lessons:")
    for lesson_num in sorted(lessons.keys()):
        lesson = lessons[lesson_num]
        page_count = lesson['end'] - lesson['start'] + 1
        print(f"  Lesson {lesson_num:2d}: pages {lesson['start']:3d}-{lesson['end']:3d} ({page_count:2d} pages) - {lesson['title']}")
    
    return lessons

def generate_typescript_boundaries():
    """Generate TypeScript boundaries for all volumes"""
    
    volumes = {
        'RCM07_NA_SW_V1': 'Grade 7 - Volume 1',
        'RCM07_NA_SW_V2': 'Grade 7 - Volume 2', 
        'RCM08_NA_SW_V1': 'Grade 8 - Volume 1',
        'RCM08_NA_SW_V2': 'Grade 8 - Volume 2'
    }
    
    all_boundaries = {}
    
    for volume_id, volume_name in volumes.items():
        volume_path = f'/workspaces/MathCurriculumA/webapp_pages/{volume_id}'
        if os.path.exists(volume_path):
            boundaries = find_lesson_boundaries(volume_path, volume_name)
            if boundaries:
                all_boundaries[volume_id] = boundaries
    
    # Generate TypeScript code
    print(f"\n🔧 ======= TYPESCRIPT BOUNDARIES =======")
    print("  private static lessonBoundaries: Record<string, Record<number, { start: number; end: number; title: string }>> = {")
    
    for volume_id, lessons in all_boundaries.items():
        print(f"    '{volume_id}': {{")
        for lesson_num in sorted(lessons.keys()):
            lesson = lessons[lesson_num]
            print(f"      {lesson_num}: {{ start: {lesson['start']}, end: {lesson['end']}, title: '{lesson['title']}' }},")
        print("    },")
    
    print("  };")
    
    return all_boundaries

if __name__ == "__main__":
    print("🔍 Finding all lesson boundaries across all curriculum volumes...")
    generate_typescript_boundaries()
    print("\n✅ Lesson boundary analysis complete!")
