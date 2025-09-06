#!/usr/bin/env python3
"""
Extract lesson data from Algebra 1 teacher's guide documents.

Teacher's guide structure:
- LESSON X OVERVIEW (introduction page)
- LESSON X | SESSION 1 (actual teaching content)
- LESSON X | SESSION 2 (continuation)
etc.
"""

import json
import re
import sys
import os

def extract_lesson_title_from_context(context, lesson_num):
    """Extract lesson title from the surrounding context"""
    # Look for common title patterns after LESSON X
    title_patterns = [
        rf'LESSON\s+{lesson_num}\s*\|\s*SESSION\s+\d+\s*([^\n]+)',
        rf'LESSON\s+{lesson_num}\s+OVERVIEW\s*([^\n]+)',
        rf'LESSON\s+{lesson_num}\s*([^\n|]+)',
    ]
    
    for pattern in title_patterns:
        match = re.search(pattern, context, re.IGNORECASE)
        if match:
            title = match.group(1).strip()
            # Clean up the title
            title = re.sub(r'^\s*[-|:]\s*', '', title)
            title = re.sub(r'\s+', ' ', title)
            if title and len(title) > 3:
                return title
    
    return f"Lesson {lesson_num}"

def count_sessions_in_lesson_range(page_texts, lesson_num, start_page, end_page):
    """Count the number of sessions in a lesson range"""
    session_pattern = re.compile(rf'LESSON\s+{lesson_num}\s*\|\s*SESSION\s+(\d+)', re.IGNORECASE)
    sessions = set()
    
    for page_num in range(start_page, end_page + 1):
        if page_num in page_texts:
            matches = session_pattern.finditer(page_texts[page_num])
            for match in matches:
                sessions.add(int(match.group(1)))
    
    return len(sessions) if sessions else 1

def extract_algebra_lessons(json_file):
    """
    Extract lesson data from Algebra 1 teacher's guide JSON.
    """
    
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Handle different document structures
    if isinstance(data, dict) and 'pages' in data:
        pages_data = data['pages']
    elif isinstance(data, list):
        pages_data = data
    else:
        print("Error: Unexpected document structure")
        return []
    
    lessons = []
    # Pattern to find lesson headers
    lesson_pattern = re.compile(r'LESSON\s+(\d+)(?:\s*\|\s*SESSION\s+(\d+)|\s+OVERVIEW)?', re.IGNORECASE)
    
    lesson_starts = {}  # Track where each lesson actually starts
    page_texts = {}     # Store page text for title extraction
    
    print(f"Processing {len(pages_data)} pages...")
    
    # Process all pages to find lesson boundaries
    for i, page_data in enumerate(pages_data):
        page_num = i + 1
        
        if not isinstance(page_data, dict):
            continue
            
        # Try different text field names
        text = page_data.get('text_preview', '') or page_data.get('text', '')
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
                # Show a snippet of context for debugging
                context_snippet = text[max(0, match.start()-50):match.end()+100].replace('\n', ' ')[:150]
                print(f"  Context: {context_snippet}...")
    
    print(f"Found {len(lesson_starts)} unique lessons")
    
    # Create lesson objects from the detected boundaries
    sorted_lessons = sorted(lesson_starts.items())
    
    for i, (lesson_num, lesson_info) in enumerate(sorted_lessons):
        start_page = lesson_info['page']
        
        # Calculate end page
        if i < len(sorted_lessons) - 1:
            end_page = sorted_lessons[i + 1][1]['page'] - 1
        else:
            end_page = len(pages_data)
        
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
        
        print(f"  Lesson {lesson_num}: '{lesson_title}' (pages {start_page}-{end_page}, {session_count} sessions)")
    
    return lessons

def main():
    if len(sys.argv) != 2:
        print("Usage: python extract_algebra_lessons.py <path_to_document.json>")
        sys.exit(1)
    
    json_file = sys.argv[1]
    
    if not os.path.exists(json_file):
        print(f"Error: File {json_file} does not exist")
        sys.exit(1)
    
    print(f"Extracting lessons from: {json_file}")
    lessons = extract_algebra_lessons(json_file)
    
    print(f"\nExtracted {len(lessons)} lessons:")
    for lesson in lessons:
        print(f"  {lesson['number']}. {lesson['title']} (Pages {lesson['startPage']}-{lesson['endPage']}, {lesson['sessions']} sessions)")
    
    # Save the extracted lesson data
    output_dir = os.path.dirname(json_file)
    output_file = os.path.join(output_dir, 'document_lessons.json')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(lessons, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved lesson data to {output_file}")

if __name__ == "__main__":
    main()
