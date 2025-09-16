#!/usr/bin/env python3
"""
Find all 'Dear Family' lesson starts and extract proper lesson boundaries
"""

import json
import re
import os

def find_dear_family_lessons(volume_path, volume_name):
    """Find all lessons that start with 'Dear Family' pattern"""
    
    document_path = os.path.join(volume_path, 'data', 'document.json')
    if not os.path.exists(document_path):
        print(f"❌ Document not found: {document_path}")
        return {}
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    total_pages = document.get('total_pages', len(document.get('pages', [])))
    print(f"\n📚 ======= {volume_name} =======")
    print(f"📄 Total pages: {total_pages}")
    
    lesson_starts = {}
    
    # Look for pages containing "Dear Family"
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        if 'Dear Family' in text_preview:
            print(f"\n📄 Page {page_number}: Found 'Dear Family'")
            print(f"Text preview: {text_preview[:200]}...")
            
            # Look for LESSON pattern on this page or nearby pages
            lesson_patterns = [
                r'LESSON\s+(\d+)',
                r'LESSON\s+(\d+)\s*\|\s*SESSION',
                r'LESSON\s+(\d+)\s+.*?Dear Family'
            ]
            
            lesson_num = None
            for pattern in lesson_patterns:
                match = re.search(pattern, text_preview, re.IGNORECASE)
                if match:
                    lesson_num = int(match.group(1))
                    print(f"  🎯 Found LESSON {lesson_num} pattern: {match.group(0)}")
                    break
            
            if lesson_num:
                lesson_starts[lesson_num] = page_number
            else:
                print(f"  ⚠️  'Dear Family' found but no lesson number detected")
    
    # Also search for lesson patterns near "Dear Family" (within 3 pages)
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        # Look for LESSON patterns
        lesson_match = re.search(r'LESSON\s+(\d+)', text_preview, re.IGNORECASE)
        if lesson_match:
            lesson_num = int(lesson_match.group(1))
            
            # Check if "Dear Family" appears within 3 pages after this
            start_check = page_number
            end_check = min(len(document['pages']), page_number + 4)
            
            for check_offset in range(4):  # Check current page and next 3
                check_idx = None
                for i, p in enumerate(document['pages']):
                    if p.get('page_number') == page_number + check_offset:
                        check_idx = i
                        break
                
                if check_idx is not None and check_idx < len(document['pages']):
                    check_page = document['pages'][check_idx]
                    check_text = check_page.get('text_preview', '')
                    check_page_num = check_page.get('page_number', 0)
                    
                    if 'Dear Family' in check_text:
                        if lesson_num not in lesson_starts:
                            lesson_starts[lesson_num] = check_page_num
                            print(f"  📍 LESSON {lesson_num} found on page {page_number}, 'Dear Family' on page {check_page_num}")
                        break
    
    return lesson_starts

def find_all_grade6_boundaries():
    """Find lesson boundaries for both Grade 6 volumes"""
    
    volumes = [
        ('webapp_pages/RCM06_NA_SW_V1', 'Grade 6 - Volume 1'),
        ('webapp_pages/RCM06_NA_SW_V2', 'Grade 6 - Volume 2')
    ]
    
    all_boundaries = {}
    
    for volume_path, volume_name in volumes:
        if os.path.exists(volume_path):
            lesson_starts = find_dear_family_lessons(volume_path, volume_name)
            
            print(f"\n🔍 {volume_name} - Lesson Start Pages:")
            for lesson_num in sorted(lesson_starts.keys()):
                page_num = lesson_starts[lesson_num]
                print(f"  Lesson {lesson_num:2d}: Page {page_num}")
            
            # Calculate lesson end pages
            sorted_lessons = sorted(lesson_starts.keys())
            lesson_boundaries = {}
            
            for i, lesson_num in enumerate(sorted_lessons):
                start_page = lesson_starts[lesson_num]
                
                if i < len(sorted_lessons) - 1:
                    next_lesson = sorted_lessons[i + 1]
                    next_start = lesson_starts[next_lesson]
                    end_page = next_start - 1
                else:
                    # Last lesson - estimate end page (you may need to adjust this)
                    end_page = start_page + 20  # Conservative estimate
                
                lesson_boundaries[lesson_num] = {
                    'start': start_page,
                    'end': end_page
                }
            
            # Get volume ID for TypeScript format
            volume_id = os.path.basename(volume_path)
            all_boundaries[volume_id] = lesson_boundaries
            
            print(f"\n📊 {volume_name} - Complete Boundaries:")
            for lesson_num in sorted(lesson_boundaries.keys()):
                boundary = lesson_boundaries[lesson_num]
                pages = boundary['end'] - boundary['start'] + 1
                print(f"  {lesson_num}: {{ start: {boundary['start']}, end: {boundary['end']}, title: '...' }}, // {pages} pages")
        
        else:
            print(f"❌ Volume path not found: {volume_path}")
    
    return all_boundaries

if __name__ == "__main__":
    print("🔍 Finding all 'Dear Family' lesson boundaries...")
    boundaries = find_all_grade6_boundaries()
    
    print("\n" + "="*60)
    print("🎯 CORRECTED LESSON BOUNDARIES")
    print("="*60)
    
    for volume_id, lessons in boundaries.items():
        print(f"\n'{volume_id}': {{")
        for lesson_num in sorted(lessons.keys()):
            boundary = lessons[lesson_num]
            print(f"  {lesson_num}: {{ start: {boundary['start']}, end: {boundary['end']}, title: '...' }},")
        print("},")