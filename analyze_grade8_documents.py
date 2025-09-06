import json
import re
import os

def analyze_grade8_documents():
    """Analyze Grade 8 document.json files to extract curriculum structure"""
    
    base_path = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\webapp_pages"
    
    volumes = {
        "Volume 1": f"{base_path}/RCM08_NA_SW_V1/data/document.json",
        "Volume 2": f"{base_path}/RCM08_NA_SW_V2/data/document.json"
    }
    
    grade8_analysis = {
        "grade": 8,
        "title": "Ready Classroom Mathematics Grade 8",
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
            "lessons": [],
            "contents_pages": []
        }
        
        # Track lessons found
        lessons_found = {}
        contents_pages = []
        
        # Process each page
        for page_num, page in enumerate(data.get('pages', []), 1):
            text_preview = page.get('text_preview', '')
            page_type = page.get('page_type', '')
            
            # Identify contents pages
            if page_type == 'contents' or 'Contents' in text_preview or 'Table of Contents' in text_preview:
                contents_pages.append({
                    "page_number": page_num,
                    "text_preview": text_preview[:200] + "..." if len(text_preview) > 200 else text_preview,
                    "page_type": page_type
                })
            
            # Look for lesson headers with improved pattern matching
            lesson_match = re.search(r'LESSON (\d+)\s+([^"]*?)(?:\s+LESSON \d+|\s+Dear Family|\s+Previously|\s+Look Back|\s+Prepare for|\s+Develop|\s+Practice|\s+Use the|$)', text_preview)
            
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title = lesson_match.group(2).strip()
                
                # Clean up common patterns
                lesson_title = re.sub(r'\s+(Use the next page|Study the Example|Read and try).*$', '', lesson_title)
                lesson_title = re.sub(r'\s+LESSON.*$', '', lesson_title)
                lesson_title = lesson_title.strip()
                
                if lesson_num not in lessons_found and lesson_title and len(lesson_title) > 8:
                    lessons_found[lesson_num] = {
                        "lesson_number": lesson_num,
                        "title": lesson_title,
                        "start_page": page_num,
                        "page_id": page.get('page_id', f'page_{page_num}')
                    }
        
        # Sort lessons
        sorted_lessons = sorted(lessons_found.values(), key=lambda x: x['lesson_number'])
        
        volume_data['lessons'] = sorted_lessons
        volume_data['contents_pages'] = contents_pages
        
        grade8_analysis['volumes'][volume_name] = volume_data
        grade8_analysis['total_pages'] += volume_data['total_pages']
        
        print(f"\n{volume_name} Analysis:")
        print(f"Total Pages: {volume_data['total_pages']}")
        print(f"Contents Pages Found: {len(contents_pages)}")
        print(f"Lessons Found: {len(sorted_lessons)}")
        
        if contents_pages:
            print("\nContents Pages:")
            for content in contents_pages:
                print(f"  Page {content['page_number']}: {content['text_preview']}")
        
        if sorted_lessons:
            print("\nLessons:")
            for lesson in sorted_lessons:
                print(f"  Lesson {lesson['lesson_number']}: {lesson['title']} (Page {lesson['start_page']})")
    
    # Save analysis
    output_file = "grade8_initial_analysis.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(grade8_analysis, f, indent=2, ensure_ascii=False)
    
    print(f"\n" + "="*80)
    print(f"GRADE 8 INITIAL ANALYSIS")
    print(f"="*80)
    print(f"Total Pages: {grade8_analysis['total_pages']}")
    print(f"Total Volumes: {len(grade8_analysis['volumes'])}")
    
    total_lessons = sum(len(vol['lessons']) for vol in grade8_analysis['volumes'].values())
    total_contents = sum(len(vol['contents_pages']) for vol in grade8_analysis['volumes'].values())
    
    print(f"Total Lessons: {total_lessons}")
    print(f"Total Contents Pages: {total_contents}")
    print(f"\nDetailed analysis saved to: {output_file}")
    
    return grade8_analysis

if __name__ == "__main__":
    analyze_grade8_documents()
