#!/usr/bin/env python3
"""
Analyze page content around suspected lesson boundaries to understand patterns
"""

import json
import re
import os

def analyze_page_content(volume_path, page_numbers):
    """Analyze specific page content to understand lesson boundary patterns"""
    
    document_path = os.path.join(volume_path, 'data', 'document.json')
    if not os.path.exists(document_path):
        print(f"❌ Document not found: {document_path}")
        return
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    pages_dict = {page['page_number']: page for page in document['pages']}
    
    for page_num in page_numbers:
        if page_num in pages_dict:
            page = pages_dict[page_num]
            text_preview = page.get('text_preview', '')
            
            print(f"\n📄 PAGE {page_num}:")
            print(f"{'='*50}")
            
            # Show first 500 characters
            preview = text_preview[:500]
            print(f"Text preview: {preview}")
            
            # Look for lesson indicators
            if 'LESSON' in text_preview.upper():
                lesson_matches = re.findall(r'LESSON\s+(\d+)[^0-9]*([^.\n]+)', text_preview, re.IGNORECASE)
                if lesson_matches:
                    print(f"🎯 LESSON patterns found: {lesson_matches}")
            
            # Check for family letter
            if 'Dear Family' in text_preview:
                print(f"👨‍👩‍👧‍👦 Contains 'Dear Family'")
            
            # Check for lesson start indicators
            lesson_start_patterns = [
                r'LESSON\s+\d+',
                r'Find the Area',
                r'Dear Family',
                r'Lesson Overview',
                r'Learning Objectives'
            ]
            
            for pattern in lesson_start_patterns:
                if re.search(pattern, text_preview, re.IGNORECASE):
                    print(f"✅ Pattern '{pattern}' found")
        else:
            print(f"❌ Page {page_num} not found")

def check_suspected_lesson_starts():
    """Check pages around where lessons actually start based on user feedback"""
    volume_path = 'webapp_pages/RCM06_NA_SW_V1'
    
    # Check around page 15 (where user said Lesson 1 actually starts)
    # and other suspected boundaries
    suspected_pages = [
        3, 15, 16, 17, 18,  # Around Lesson 1
        19, 30, 31, 32,     # Around Lesson 2  
        41, 50, 51, 52,     # Around Lesson 3
        63, 70, 71, 72      # Around Lesson 4
    ]
    
    print("🔍 Analyzing suspected lesson boundary pages...")
    analyze_page_content(volume_path, suspected_pages)

if __name__ == "__main__":
    check_suspected_lesson_starts()