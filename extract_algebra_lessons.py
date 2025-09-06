#!/usr/bin/env python3
"""
Extract lessons from Algebra 1 (Grade 9) Teacher's Guide volumes.
Teacher's guides have a different structure than student workbooks.
"""

import json
import re
import sys

def extract_algebra_lessons(json_file):
    """
    Extract lesson data from Algebra 1 teacher's guide JSON.
    
    Teacher's guide structure:
    - Unit X
    - Lesson Y Overview (with objectives, vocabulary, etc.)
    - Lesson Y | Session 1, Session 2, etc. (actual teaching sessions)
    
    We want to extract the main lessons, not the individual sessions.
    """
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    lessons = []
    # More flexible patterns for teacher's guide
    lesson_pattern = re.compile(r'LESSON\s+(\d+)(?:\s*\|\s*SESSION\s+(\d+)|\s+OVERVIEW)?', re.IGNORECASE)
    unit_pattern = re.compile(r'UNIT\s+(\d+)', re.IGNORECASE)
    
    lesson_starts = {}  # Track where each lesson actually starts
    page_texts = {}     # Store page text for title extraction
    
    # Process all pages to find lesson boundaries
    for page_num, page_data in enumerate(data, 1):
        if not isinstance(page_data, dict):
            continue
            
        text = page_data.get('text', '')
        if not text:
            continue
            
        page_texts[page_num] = text
        
        # Look for lesson headers in the text
        lesson_matches = lesson_pattern.finditer(text)
        for match in lesson_matches:
            lesson_num = int(match.group(1))
            session_num = int(match.group(2)) if match.group(2) else None
            
            # Record the first occurrence of each lesson
            if lesson_num not in lesson_starts:
                lesson_starts[lesson_num] = {
                    'page': page_num,
                    'text_context': text[max(0, match.start()-100):match.end()+200]
                }
                print(f"Found Lesson {lesson_num} on page {page_num}")
                print(f"Context: {text[max(0, match.start()-50):match.end()+100][:150]}...")
    
    # Create lesson objects from the detected boundaries
    sorted_lessons = sorted(lesson_starts.items())
    
    for i, (lesson_num, lesson_info) in enumerate(sorted_lessons):
        start_page = lesson_info['page']
        
        # Calculate end page
        if i < len(sorted_lessons) - 1:
            end_page = sorted_lessons[i + 1][1]['page'] - 1
        else:
            end_page = len(data)
        
        # Extract lesson title from context
        context = lesson_info['text_context']
        lesson_title = extract_lesson_title_from_context(context, lesson_num)
        
        # Count sessions for this lesson
        session_count = count_sessions_in_lesson_range(page_texts, lesson_num, start_page, end_page)
        
        lessons.append({
            'number': lesson_num,
            'title': lesson_title,
            'startPage': start_page,
            'endPage': end_page,
            'sessions': session_count
        })
    
    return lessons
            if unit_match:
                unit_num = int(unit_match.group(1))
                current_unit = unit_num
                print(f"Found Unit {unit_num} on page {page_num}")
                continue
            
            # Check for lesson boundaries (main lessons, not sessions)
            lesson_match = lesson_pattern.match(line)
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title_part = lesson_match.group(2)
                
                # Skip if this looks like a session (contains "SESSION")
                if 'SESSION' in line.upper():
                    continue
                
                # If we have a previous lesson, save it
                if current_lesson is not None:
                    current_lesson['sessions'] = session_count
                    lessons.append(current_lesson)
                
                # Start new lesson
                lesson_title = lesson_title_part.strip() if lesson_title_part else "Unknown Title"
                
                # Try to extract full title from subsequent lines if incomplete
                if lesson_title == "Unknown Title" or len(lesson_title) < 5:
                    # Look ahead for the title
                    for next_line in lines[lines.index(line)+1:lines.index(line)+5]:
                        next_line = next_line.strip()
                        if next_line and not next_line.startswith('LESSON') and len(next_line) > 5:
                            if not any(word in next_line.upper() for word in ['OVERVIEW', 'OBJECTIVE', 'VOCABULARY', 'LEARNING']):
                                lesson_title = next_line
                                break
                
                current_lesson = {
                    'number': lesson_num,
                    'title': lesson_title,
                    'unit': current_unit,
                    'startPage': page_num,
                    'endPage': page_num  # Will be updated when next lesson found
                }
                session_count = 0
                print(f"Found Lesson {lesson_num}: {lesson_title} on page {page_num}")
            
            # Count sessions within current lesson
            elif current_lesson and re.search(r'SESSION\s+\d+', line, re.IGNORECASE):
                session_count += 1
    
    # Don't forget the last lesson
    if current_lesson is not None:
        current_lesson['sessions'] = session_count
        lessons.append(current_lesson)
    
    # Update end pages
    for i in range(len(lessons) - 1):
        lessons[i]['endPage'] = lessons[i + 1]['startPage'] - 1
    
    if lessons:
        # Set last lesson end page to a reasonable estimate
        lessons[-1]['endPage'] = lessons[-1]['startPage'] + 20  # Estimate
    
    return lessons

def main():
    if len(sys.argv) != 2:
        print("Usage: python extract_algebra_lessons.py <algebra_json_file>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    
    try:
        lessons = extract_algebra_lessons(json_file)
        
        print(f"\nExtracted {len(lessons)} lessons:")
        for lesson in lessons:
            print(f"Lesson {lesson['number']}: {lesson['title']} "
                  f"(Unit {lesson['unit']}, Pages {lesson['startPage']}-{lesson['endPage']}, "
                  f"{lesson['sessions']} sessions)")
        
        # Save to file
        output_file = json_file.replace('.json', '_lessons.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(lessons, f, indent=2, ensure_ascii=False)
        
        print(f"\nSaved lesson data to {output_file}")
        
    except Exception as e:
        print(f"Error processing {json_file}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
