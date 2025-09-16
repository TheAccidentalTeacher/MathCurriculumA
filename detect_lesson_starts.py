#!/usr/bin/env python3
"""
Detect actual lesson start pages by looking for visual lesson indicators
"""

import json
import re
import os

def find_lesson_start_pages(volume_path, volume_name):
    """Find actual lesson start pages by looking for 'Dear Family' pattern"""
    
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
    
    # Look for actual lesson content start pages
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        # Look for "Dear Family" pattern which indicates lesson start
        if 'Dear Family' in text_preview:
            # Try to extract lesson number from the same page
            lesson_match = re.search(r'LESSON\s+(\d+)', text_preview, re.IGNORECASE)
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_starts[lesson_num] = page_number
                print(f"  🎯 Found Lesson {lesson_num} start at page {page_number}")
        
        # Also look for lesson numbers in proximity to "Dear Family"
        if 'LESSON' in text_preview.upper():
            lesson_match = re.search(r'LESSON\s+(\d+)', text_preview, re.IGNORECASE)
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                # Check if "Dear Family" appears within a few pages
                start_check = max(0, page_number - 2)
                end_check = min(len(document['pages']), page_number + 3)
                
                for check_idx in range(start_check, end_check):
                    if check_idx < len(document['pages']):
                        check_page = document['pages'][check_idx]
                        check_text = check_page.get('text_preview', '')
                        if 'Dear Family' in check_text:
                            actual_start = check_page.get('page_number', 0)
                            if lesson_num not in lesson_starts:
                                lesson_starts[lesson_num] = actual_start
                                print(f"  📍 Found Lesson {lesson_num} near page {page_number}, actual start: {actual_start}")
                            break
    
    return lesson_starts

def check_grade6_volume1():
    """Check Grade 6 Volume 1 specifically"""
    volume_path = 'webapp_pages/RCM06_NA_SW_V1'
    lesson_starts = find_lesson_start_pages(volume_path, 'Grade 6 - Volume 1')
    
    print(f"\n🔍 Summary of actual lesson start pages:")
    for lesson_num in sorted(lesson_starts.keys()):
        page_num = lesson_starts[lesson_num]
        print(f"  Lesson {lesson_num:2d}: Page {page_num}")
    
    # Compare with current boundaries
    current_boundaries = {
        1: 3, 2: 19, 3: 41, 4: 63, 5: 85, 6: 107
    }
    
    print(f"\n📊 Comparison with current boundaries:")
    print(f"{'Lesson':<8} {'Current':<10} {'Actual':<10} {'Difference':<12}")
    print("-" * 40)
    
    for lesson_num in sorted(set(current_boundaries.keys()) | set(lesson_starts.keys())):
        current = current_boundaries.get(lesson_num, 'N/A')
        actual = lesson_starts.get(lesson_num, 'N/A')
        
        if isinstance(current, int) and isinstance(actual, int):
            diff = actual - current
            print(f"{lesson_num:<8} {current:<10} {actual:<10} {diff:+d}")
        else:
            print(f"{lesson_num:<8} {current:<10} {actual:<10} {'N/A':<12}")

if __name__ == "__main__":
    check_grade6_volume1()