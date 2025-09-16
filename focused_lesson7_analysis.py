#!/usr/bin/env python3
"""
Focused analysis of Unit 1/Unit 2 transition to find actual Lesson 7 start
"""

import json
import re
import os

def analyze_focused_gap():
    """Analyze pages 140-180 specifically for Lesson 7 start"""
    
    volume_path = 'webapp_pages/RCM06_NA_SW_V1'
    document_path = os.path.join(volume_path, 'data', 'document.json')
    
    if not os.path.exists(document_path):
        print(f"❌ Document not found: {document_path}")
        return
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    pages_dict = {page['page_number']: page for page in document['pages']}
    
    print("🔍 Focused analysis: pages 140-180 for Lesson 7 transition...")
    print("=" * 60)
    
    # Check pages in the reasonable range around Unit 1/Unit 2 transition
    lesson_7_candidates = []
    
    for page_num in range(140, 181):  # Extended range but still reasonable
        if page_num in pages_dict:
            page = pages_dict[page_num]
            text_preview = page.get('text_preview', '')
            
            # Look for Lesson 7 indicators in the reasonable range
            if 'LESSON 7' in text_preview.upper():
                lesson_7_candidates.append((page_num, text_preview))
                print(f"\n🎯 LESSON 7 FOUND on PAGE {page_num}:")
                print(f"   Text: {text_preview[:200]}...")
                
                # Check if this looks like the actual start
                if 'Dear Family' in text_preview:
                    print(f"   ✅ Has 'Dear Family' - LIKELY START")
                elif re.search(r'SESSION\s*1', text_preview, re.IGNORECASE):
                    print(f"   ✅ Has 'SESSION 1' - LIKELY START")
                else:
                    print(f"   ⚠️  No clear start indicators")
            
            # Also show any "Dear Family" pages
            elif 'Dear Family' in text_preview:
                print(f"\n👨‍👩‍👧‍👦 PAGE {page_num} - Dear Family:")
                print(f"   Text: {text_preview[:150]}...")
            
            # Show unit transitions
            elif 'UNIT' in text_preview.upper() and ('2' in text_preview or 'TWO' in text_preview.upper()):
                print(f"\n📚 PAGE {page_num} - Unit 2 mention:")
                print(f"   Text: {text_preview[:150]}...")

    print(f"\n📊 ANALYSIS SUMMARY:")
    print(f"Found {len(lesson_7_candidates)} pages with 'LESSON 7' in range 140-180:")
    
    for page_num, text in lesson_7_candidates:
        has_dear_family = 'Dear Family' in text
        has_session_1 = re.search(r'SESSION\s*1', text, re.IGNORECASE) is not None
        
        confidence = "HIGH" if (has_dear_family or has_session_1) else "LOW"
        print(f"   Page {page_num}: {confidence} confidence")
        if has_dear_family:
            print(f"      ✅ Has Dear Family")
        if has_session_1:
            print(f"      ✅ Has Session 1")

if __name__ == "__main__":
    analyze_focused_gap()