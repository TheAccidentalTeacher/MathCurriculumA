#!/usr/bin/env python3
"""
Script to find Grade 6 lesson boundaries by looking for:
1. "LESSON X" pattern in the blue circle
2. "Dear Family" text on the same page

This will help us map the correct PNG file numbers to lesson numbers,
accounting for the front matter offset.
"""

import json
import os
import re
from pathlib import Path

def search_lesson_patterns():
    """Search for lesson patterns in Grade 6 volumes."""
    
    volumes = ['RCM06_NA_SW_V1', 'RCM06_NA_SW_V2']
    all_lessons = []
    
    for volume in volumes:
        volume_path = f'webapp_pages/{volume}/data/document.json'
        
        if not os.path.exists(volume_path):
            print(f"❌ {volume} not found at {volume_path}")
            continue
            
        print(f"🔍 Searching {volume}...")
        
        with open(volume_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Search through all pages
        for page_data in data['pages']:
            page_num = page_data.get('page_number', 0)
            content = page_data.get('content', '').lower()
            
            # Look for lesson patterns
            lesson_match = re.search(r'lesson\s+(\d+)', content)
            has_dear_family = 'dear family' in content
            has_surface_area = 'surface area' in content
            has_nets = 'nets' in content
            
            # If we find lesson number AND family content
            if lesson_match and has_dear_family:
                lesson_num = int(lesson_match.group(1))
                
                print(f"✅ Found LESSON {lesson_num} in PNG page_{page_num:03d}.png")
                print(f"   Content preview: {content[:100]}...")
                
                all_lessons.append({
                    'volume': volume,
                    'lesson_number': lesson_num,
                    'png_file': f"page_{page_num:03d}.png",
                    'png_page_number': page_num,
                    'has_dear_family': has_dear_family,
                    'has_surface_area': has_surface_area,
                    'has_nets': has_nets
                })
            
            # Also check for specific lesson 3 patterns
            elif lesson_match and (has_surface_area or has_nets):
                lesson_num = int(lesson_match.group(1))
                print(f"📝 Potential LESSON {lesson_num} in PNG page_{page_num:03d}.png (surface area/nets)")
                print(f"   Content: {content[:150]}...")
    
    return all_lessons

def analyze_offset():
    """Analyze the offset between PNG numbers and textbook page numbers."""
    
    print("\n" + "="*60)
    print("OFFSET ANALYSIS")
    print("="*60)
    
    # Known example: Lesson 3 should be on textbook page 41, but is PNG page 53
    known_textbook_page = 41
    known_png_page = 53
    calculated_offset = known_png_page - known_textbook_page
    
    print(f"Known example:")
    print(f"  Lesson 3 'Surface Area' = textbook page {known_textbook_page}")
    print(f"  Found in PNG file page_{known_png_page:03d}.png")
    print(f"  Calculated offset: {calculated_offset} pages")
    
    return calculated_offset

def search_visual_patterns():
    """Search for visual patterns that might indicate lessons."""
    
    print("\n" + "="*60)
    print("VISUAL PATTERN SEARCH")
    print("="*60)
    
    volumes = ['RCM06_NA_SW_V1', 'RCM06_NA_SW_V2']
    
    for volume in volumes:
        volume_path = f'webapp_pages/{volume}/data/document.json'
        
        if not os.path.exists(volume_path):
            continue
            
        print(f"\n🔍 Checking {volume} for lesson indicators...")
        
        with open(volume_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        lesson_indicators = 0
        
        for page_data in data['pages']:
            page_num = page_data.get('page_number', 0)
            content = page_data.get('content', '').lower()
            
            # Look for various lesson indicators
            patterns = [
                r'lesson\s+\d+',
                r'dear family',
                r'this week your student',
                r'use nets to find',
                r'surface area',
                r'three-dimensional figures'
            ]
            
            matches = []
            for pattern in patterns:
                if re.search(pattern, content):
                    matches.append(pattern.replace('\\s+', ' ').replace('\\d+', 'X'))
            
            if len(matches) >= 2:  # If multiple patterns match
                lesson_indicators += 1
                print(f"  📍 PNG page_{page_num:03d}.png: {', '.join(matches)}")
                
                # Show content preview
                lines = content.split('\n')[:3]
                preview = ' '.join(lines).strip()[:100]
                print(f"     Preview: {preview}...")
        
        print(f"  Found {lesson_indicators} potential lesson pages in {volume}")

if __name__ == "__main__":
    print("🔍 GRADE 6 LESSON BOUNDARY DETECTION")
    print("="*60)
    
    # 1. Search for explicit lesson patterns
    lessons = search_lesson_patterns()
    
    # 2. Analyze the offset
    offset = analyze_offset()
    
    # 3. Search for visual patterns
    search_visual_patterns()
    
    # 4. Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)
    
    if lessons:
        print(f"✅ Found {len(lessons)} explicit lessons:")
        for lesson in lessons:
            print(f"  {lesson['volume']}: Lesson {lesson['lesson_number']} → {lesson['png_file']}")
    else:
        print("❌ No explicit lesson patterns found in text content")
    
    print(f"\n📏 Estimated offset: {offset} pages")
    print(f"   (PNG file numbers are {offset} pages ahead of textbook page numbers)")
    
    print(f"\n💡 Next steps:")
    print(f"   1. Manually verify PNG files around the offset")
    print(f"   2. Update database-free-lesson-service.ts with correct PNG numbers")
    print(f"   3. Test lesson navigation")
