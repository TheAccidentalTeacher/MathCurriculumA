#!/usr/bin/env python3
"""
Comprehensive lesson boundary detection using multiple patterns
"""

import json
import re
import os

def find_comprehensive_lesson_boundaries(volume_path, volume_name):
    """Find lesson boundaries using multiple detection methods"""
    
    document_path = os.path.join(volume_path, 'data', 'document.json')
    if not os.path.exists(document_path):
        print(f"❌ Document not found: {document_path}")
        return {}
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    total_pages = document.get('total_pages', len(document.get('pages', [])))
    print(f"\n📚 ======= {volume_name} =======")
    print(f"📄 Total pages: {total_pages}")
    
    lesson_candidates = {}
    
    # Method 1: Look for LESSON X | SESSION patterns (actual lesson content start)
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        # Look for "LESSON X | SESSION" pattern which indicates actual lesson start
        session_match = re.search(r'LESSON\s+(\d+)\s*\|\s*SESSION\s*1', text_preview, re.IGNORECASE)
        if session_match:
            lesson_num = int(session_match.group(1))
            lesson_candidates[lesson_num] = {
                'page': page_number,
                'method': 'SESSION_1',
                'confidence': 'HIGH',
                'text_sample': text_preview[:100]
            }
            print(f"  🎯 HIGH: Lesson {lesson_num} SESSION 1 at page {page_number}")
    
    # Method 2: Look for LESSON X followed by "Dear Family" within a few pages
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        lesson_match = re.search(r'LESSON\s+(\d+)', text_preview, re.IGNORECASE)
        if lesson_match:
            lesson_num = int(lesson_match.group(1))
            
            # Check next few pages for "Dear Family"
            for offset in range(5):  # Check current page and next 4
                check_page_num = page_number + offset
                check_page = None
                
                for p in document['pages']:
                    if p.get('page_number') == check_page_num:
                        check_page = p
                        break
                
                if check_page and 'Dear Family' in check_page.get('text_preview', ''):
                    dear_family_page = check_page_num
                    
                    # Use the "Dear Family" page as the lesson start
                    if lesson_num not in lesson_candidates or lesson_candidates[lesson_num]['confidence'] != 'HIGH':
                        lesson_candidates[lesson_num] = {
                            'page': dear_family_page,
                            'method': 'DEAR_FAMILY',
                            'confidence': 'MEDIUM',
                            'text_sample': check_page.get('text_preview', '')[:100]
                        }
                        print(f"  📍 MEDIUM: Lesson {lesson_num} with Dear Family at page {dear_family_page}")
                    break
    
    # Method 3: Look for lesson title patterns (as backup)
    lesson_titles = {
        1: "Find the Area of a Parallelogram",
        2: "Find the Area of Triangles and Other Polygons", 
        3: "Use Nets to Find Surface Area",
        4: "Work with Algebraic Expressions",
        5: "Write and Evaluate Expressions with Exponents",
        6: "Find Greatest Common Factor and Least Common Multiple"
    }
    
    for lesson_num, title in lesson_titles.items():
        if lesson_num not in lesson_candidates:
            # Look for title patterns
            title_words = title.split()[:3]  # First few words
            title_pattern = r'\b' + r'\s+'.join(re.escape(word) for word in title_words)
            
            for page in document['pages']:
                text_preview = page.get('text_preview', '')
                page_number = page.get('page_number', 0)
                
                if re.search(title_pattern, text_preview, re.IGNORECASE):
                    lesson_candidates[lesson_num] = {
                        'page': page_number,
                        'method': 'TITLE_MATCH',
                        'confidence': 'LOW',
                        'text_sample': text_preview[:100]
                    }
                    print(f"  📝 LOW: Lesson {lesson_num} title match at page {page_number}")
                    break
    
    return lesson_candidates

def calculate_lesson_boundaries(lesson_candidates):
    """Calculate end pages based on start pages"""
    boundaries = {}
    sorted_lessons = sorted(lesson_candidates.keys())
    
    for i, lesson_num in enumerate(sorted_lessons):
        start_page = lesson_candidates[lesson_num]['page']
        
        if i < len(sorted_lessons) - 1:
            next_lesson = sorted_lessons[i + 1]
            next_start = lesson_candidates[next_lesson]['page']
            end_page = next_start - 1
        else:
            # Last lesson - estimate end
            end_page = start_page + 25  # Conservative estimate
        
        boundaries[lesson_num] = {
            'start': start_page,
            'end': end_page,
            'method': lesson_candidates[lesson_num]['method'],
            'confidence': lesson_candidates[lesson_num]['confidence']
        }
    
    return boundaries

def main():
    print("🔍 Comprehensive lesson boundary detection...")
    
    # Focus on Grade 6 Volume 1 first
    volume_path = 'webapp_pages/RCM06_NA_SW_V1'
    volume_name = 'Grade 6 - Volume 1'
    
    if os.path.exists(volume_path):
        lesson_candidates = find_comprehensive_lesson_boundaries(volume_path, volume_name)
        boundaries = calculate_lesson_boundaries(lesson_candidates)
        
        print(f"\n📊 {volume_name} - Final Boundaries:")
        print("Lesson | Start | End  | Pages | Method     | Confidence")
        print("-" * 55)
        
        for lesson_num in sorted(boundaries.keys()):
            b = boundaries[lesson_num]
            pages = b['end'] - b['start'] + 1
            print(f"{lesson_num:6d} | {b['start']:5d} | {b['end']:4d} | {pages:5d} | {b['method']:10s} | {b['confidence']}")
        
        # Generate TypeScript format
        print(f"\n🔧 TypeScript boundaries for DatabaseFreeLessonService:")
        print("'RCM06_NA_SW_V1': {")
        for lesson_num in sorted(boundaries.keys()):
            b = boundaries[lesson_num]
            print(f"  {lesson_num}: {{ start: {b['start']}, end: {b['end']}, title: '...' }},  // {b['confidence']} confidence")
        print("},")
        
    else:
        print(f"❌ Volume path not found: {volume_path}")

if __name__ == "__main__":
    main()