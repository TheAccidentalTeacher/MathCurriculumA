#!/usr/bin/env python3

import json
import re
import os
from typing import Dict, List, Tuple

def load_document_data(volume_id: str) -> Dict:
    """Load document.json for a volume"""
    doc_path = f'webapp_pages/{volume_id}/data/document.json'
    if not os.path.exists(doc_path):
        print(f"❌ Document not found: {doc_path}")
        return {}
    
    with open(doc_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def extract_lesson_boundaries_with_units(volume_id: str, volume_name: str) -> Dict:
    """Extract lesson boundaries and try to identify unit boundaries"""
    
    document = load_document_data(volume_id)
    if not document:
        return {}
    
    print(f"\n📚 ======= {volume_name} ({volume_id}) =======")
    print(f"📄 Total pages: {document.get('total_pages', 0)}")
    
    pages = document.get('pages', [])
    lessons = {}
    units = {}
    current_unit = None
    
    # Find lessons and units
    for page in pages:
        page_num = page.get('page_number', 0)
        text = page.get('text_preview', '')
        
        # Look for unit boundaries
        unit_patterns = [
            r'UNIT\s+(\d+)\s*[:|]\s*([^\\n\\r]+)',
            r'Unit\s+(\d+):\s*([^\\n\\r]+)',
            r'UNIT\s+(\d+)\s+([^\\n\\r]+)'
        ]
        
        for pattern in unit_patterns:
            unit_match = re.search(pattern, text, re.IGNORECASE)
            if unit_match:
                unit_num = int(unit_match.group(1))
                unit_title = unit_match.group(2).strip()
                units[unit_num] = {
                    'title': unit_title,
                    'start_page': page_num,
                    'lessons': []
                }
                current_unit = unit_num
                print(f"🎯 UNIT {unit_num}: {unit_title} (starts page {page_num})")
                break
        
        # Look for lesson boundaries
        lesson_patterns = [
            r'LESSON\s+(\d+)\s*[|:]\s*([^\\n\\r]+)',
            r'LESSON\s+(\d+)\s+([A-Z][^\\n\\r]+)',
            r'Dear Family.*LESSON\s+(\d+)\s*[:|]\s*([^\\n\\r]+)'
        ]
        
        for pattern in lesson_patterns:
            lesson_match = re.search(pattern, text, re.IGNORECASE)
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title = lesson_match.group(2).strip()
                
                # Clean up title
                lesson_title = re.sub(r'^[|:\s-]+', '', lesson_title)
                lesson_title = re.sub(r'\s+', ' ', lesson_title)
                lesson_title = lesson_title.split('Dear Family')[0].strip()
                
                lessons[lesson_num] = {
                    'title': lesson_title,
                    'start_page': page_num,
                    'unit': current_unit
                }
                
                # Add lesson to current unit
                if current_unit and current_unit in units:
                    units[current_unit]['lessons'].append(lesson_num)
                
                break
    
    # Calculate end pages for lessons
    sorted_lessons = sorted(lessons.keys())
    for i, lesson_num in enumerate(sorted_lessons):
        if i < len(sorted_lessons) - 1:
            next_lesson = sorted_lessons[i + 1]
            lessons[lesson_num]['end_page'] = lessons[next_lesson]['start_page'] - 1
        else:
            lessons[lesson_num]['end_page'] = document.get('total_pages', 0)
    
    return {
        'lessons': lessons,
        'units': units,
        'volume_id': volume_id,
        'volume_name': volume_name
    }

def load_accelerated_pathway_structure():
    """Parse accelerated pathway from TypeScript file to understand expected unit structure"""
    
    # This would be the expected structure based on the accelerated pathway
    # For now, let's define the expected unit boundaries manually based on what we know
    
    expected_structure = {
        'RCM07_NA_SW_V1': {
            'Unit 1': {'lessons': [1, 2, 3, 4, 5, 6], 'title': 'Proportional Relationships: Ratios, Rates, and Circles'},
            'Unit 2': {'lessons': [7, 8, 9, 10, 11, 12, 13], 'title': 'Rational Number Operations'},
            'Unit 3': {'lessons': [14, 15, 16, 17, 18, 19], 'title': 'Expressions and Equations'}
        },
        'RCM07_NA_SW_V2': {
            'Unit 4': {'lessons': [20, 21], 'title': 'Percent and Proportional Relationships'},
            'Unit 5': {'lessons': [22, 23, 24], 'title': 'Sampling and Statistical Inference'},
            'Unit 6': {'lessons': [25, 26, 27, 28, 29], 'title': 'Geometric Applications'},
            'Unit 7': {'lessons': [30, 31, 32, 33], 'title': 'Statistics and Probability'}
        },
        'RCM08_NA_SW_V1': {
            'Unit 1': {'lessons': [1, 2, 3, 4, 5, 6, 7], 'title': 'Transformations and Angle Relationships'},
            'Unit 2': {'lessons': [8, 9, 10, 11, 12, 13, 14], 'title': 'Linear Relationships'},
            'Unit 3': {'lessons': [15, 16, 17, 18], 'title': 'Functions'}
        },
        'RCM08_NA_SW_V2': {
            'Unit 4': {'lessons': [19, 20, 21, 22, 23, 24, 25], 'title': 'Exponents and Scientific Notation'},
            'Unit 5': {'lessons': [26, 27, 28], 'title': 'Pythagorean Theorem and Geometry'},
            'Unit 6': {'lessons': [29, 30, 31, 32], 'title': 'Statistics and Data Analysis'}
        }
    }
    
    return expected_structure

def verify_unit_lesson_alignment():
    """Main function to verify unit and lesson boundary alignment"""
    
    volumes = [
        ('RCM07_NA_SW_V1', 'Grade 7 - Volume 1'),
        ('RCM07_NA_SW_V2', 'Grade 7 - Volume 2'),
        ('RCM08_NA_SW_V1', 'Grade 8 - Volume 1'),
        ('RCM08_NA_SW_V2', 'Grade 8 - Volume 2')
    ]
    
    expected_structure = load_accelerated_pathway_structure()
    all_results = {}
    
    print("🔍 VERIFYING UNIT-LESSON ALIGNMENT")
    print("="*60)
    
    for volume_id, volume_name in volumes:
        result = extract_lesson_boundaries_with_units(volume_id, volume_name)
        
        if not result:
            continue
            
        all_results[volume_id] = result
        
        # Display extracted lessons and units
        lessons = result['lessons']
        units = result['units']
        
        print(f"\n📖 EXTRACTED LESSONS:")
        for lesson_num in sorted(lessons.keys()):
            lesson = lessons[lesson_num]
            pages = lesson['end_page'] - lesson['start_page'] + 1
            unit_info = f" (Unit {lesson['unit']})" if lesson['unit'] else ""
            print(f"  Lesson {lesson_num:2d}: pages {lesson['start_page']:3d}-{lesson['end_page']:3d} ({pages:2d} pages){unit_info}")
            print(f"              {lesson['title']}")
        
        print(f"\n🎯 EXTRACTED UNITS:")
        for unit_num in sorted(units.keys()):
            unit = units[unit_num]
            print(f"  Unit {unit_num}: {unit['title']}")
            print(f"          Lessons: {sorted(unit['lessons'])}")
        
        # Compare with expected structure
        if volume_id in expected_structure:
            print(f"\n✅ EXPECTED vs ACTUAL COMPARISON:")
            expected = expected_structure[volume_id]
            
            for expected_unit, expected_data in expected.items():
                print(f"\n  📋 {expected_unit}: {expected_data['title']}")
                print(f"       Expected lessons: {expected_data['lessons']}")
                
                # Find matching unit in extracted data
                found_match = False
                for unit_num, unit_data in units.items():
                    if set(expected_data['lessons']).intersection(set(unit_data['lessons'])):
                        print(f"       Actual lessons:   {sorted(unit_data['lessons'])}")
                        if set(expected_data['lessons']) == set(unit_data['lessons']):
                            print(f"       ✅ PERFECT MATCH")
                        else:
                            print(f"       ⚠️  PARTIAL MATCH")
                            missing = set(expected_data['lessons']) - set(unit_data['lessons'])
                            extra = set(unit_data['lessons']) - set(expected_data['lessons'])
                            if missing:
                                print(f"          Missing: {sorted(missing)}")
                            if extra:
                                print(f"          Extra: {sorted(extra)}")
                        found_match = True
                        break
                
                if not found_match:
                    print(f"       ❌ NO MATCHING UNIT FOUND")
        
        print("\n" + "-"*60)
    
    return all_results

if __name__ == "__main__":
    verify_unit_lesson_alignment()
    print("\n✅ Unit-lesson alignment verification complete!")
