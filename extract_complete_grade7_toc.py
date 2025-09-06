import json
import re
import os

def extract_complete_grade7_toc():
    """Extract complete Grade 7 table of contents from both volumes"""
    
    base_path = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\webapp_pages"
    
    volumes = {
        "Volume 1": f"{base_path}/RCM07_NA_SW_V1/data/document.json",
        "Volume 2": f"{base_path}/RCM07_NA_SW_V2/data/document.json"
    }
    
    grade7_curriculum = {
        "grade": 7,
        "title": "Ready Classroom Mathematics Grade 7",
        "total_pages": 0,
        "volumes": {}
    }
    
    for volume_name, file_path in volumes.items():
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        volume_data = {
            "volume_name": volume_name,
            "total_pages": len(data.get('pages', [])),
            "units": [],
            "lessons": []
        }
        
        # Track lessons and units
        lessons_found = {}
        units_found = {}
        
        # Process each page
        for page_num, page in enumerate(data.get('pages', []), 1):
            text_preview = page.get('text_preview', '')
            
            # Look for lesson headers with more specific patterns
            lesson_match = re.search(r'LESSON (\d+)\s+([^"]*?)(?:\s+LESSON \d+|\s+Dear Family|\s+Previously|\s+Look Back|\s+Prepare for|\s+Develop|\s+Practice|\s+$)', text_preview)
            
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title = lesson_match.group(2).strip()
                
                # Clean up common endings
                lesson_title = re.sub(r'\s+(Use the next page|Study the Example|Read and try).*$', '', lesson_title)
                lesson_title = lesson_title.strip()
                
                if lesson_num not in lessons_found and lesson_title and len(lesson_title) > 5:
                    lessons_found[lesson_num] = {
                        "lesson_number": lesson_num,
                        "title": lesson_title,
                        "start_page": page_num,
                        "page_id": page.get('page_id', f'page_{page_num}')
                    }
            
            # Look for unit headers
            unit_match = re.search(r'UNIT (\d+)\s+([^"]*?)(?:\s+UNIT \d+|\s+LESSON|\s+$)', text_preview)
            if unit_match:
                unit_num = int(unit_match.group(1))
                unit_title = unit_match.group(2).strip()
                
                if unit_num not in units_found and unit_title and len(unit_title) > 5:
                    units_found[unit_num] = {
                        "unit_number": unit_num,
                        "title": unit_title,
                        "start_page": page_num,
                        "lessons": []
                    }
        
        # Sort and organize lessons and units
        sorted_lessons = sorted(lessons_found.values(), key=lambda x: x['lesson_number'])
        sorted_units = sorted(units_found.values(), key=lambda x: x['unit_number'])
        
        # Assign lessons to units (approximation based on lesson numbers)
        for unit in sorted_units:
            unit_lessons = []
            for lesson in sorted_lessons:
                # Rough assignment - this could be refined with more specific logic
                if unit['unit_number'] == 1 and lesson['lesson_number'] in [1, 2, 3, 4, 5]:
                    unit_lessons.append(lesson)
                elif unit['unit_number'] == 2 and lesson['lesson_number'] in [6, 7, 8, 9, 10]:
                    unit_lessons.append(lesson)
                elif unit['unit_number'] == 3 and lesson['lesson_number'] in [11, 12, 13, 14, 15]:
                    unit_lessons.append(lesson)
                # Add more unit logic as needed
            
            unit['lessons'] = unit_lessons
        
        volume_data['units'] = sorted_units
        volume_data['lessons'] = sorted_lessons
        
        grade7_curriculum['volumes'][volume_name] = volume_data
        grade7_curriculum['total_pages'] += volume_data['total_pages']
        
        print(f"\n{volume_name} Analysis:")
        print(f"Total Pages: {volume_data['total_pages']}")
        print(f"Units Found: {len(sorted_units)}")
        print(f"Lessons Found: {len(sorted_lessons)}")
        
        if sorted_units:
            print("\nUnits:")
            for unit in sorted_units:
                print(f"  Unit {unit['unit_number']}: {unit['title']} (Page {unit['start_page']})")
        
        if sorted_lessons:
            print("\nLessons:")
            for lesson in sorted_lessons:
                print(f"  Lesson {lesson['lesson_number']}: {lesson['title']} (Page {lesson['start_page']})")
    
    # Save complete analysis
    output_file = "grade7_complete_curriculum_analysis.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(grade7_curriculum, f, indent=2, ensure_ascii=False)
    
    print(f"\n" + "="*80)
    print(f"GRADE 7 CURRICULUM SUMMARY")
    print(f"="*80)
    print(f"Total Pages: {grade7_curriculum['total_pages']}")
    print(f"Total Volumes: {len(grade7_curriculum['volumes'])}")
    
    total_lessons = sum(len(vol['lessons']) for vol in grade7_curriculum['volumes'].values())
    total_units = sum(len(vol['units']) for vol in grade7_curriculum['volumes'].values())
    
    print(f"Total Lessons: {total_lessons}")
    print(f"Total Units: {total_units}")
    print(f"\nDetailed analysis saved to: {output_file}")
    
    return grade7_curriculum

if __name__ == "__main__":
    extract_complete_grade7_toc()
