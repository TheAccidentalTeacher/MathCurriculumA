#!/usr/bin/env python3
"""
Analyze the gap between Unit 1 and Unit 2 to find actual Lesson 7 start
"""

import json
import re
import os

def analyze_unit_gap():
    """Analyze pages 140-170 to find where Lesson 7 actually starts"""
    
    volume_path = 'webapp_pages/RCM06_NA_SW_V1'
    document_path = os.path.join(volume_path, 'data', 'document.json')
    
    if not os.path.exists(document_path):
        print(f"❌ Document not found: {document_path}")
        return
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    pages_dict = {page['page_number']: page for page in document['pages']}
    
    print("🔍 Analyzing pages 140-170 to find Lesson 7 start...")
    print("=" * 60)
    
    # Check pages between Lesson 6 end and suspected Lesson 7 start
    for page_num in range(140, 171):
        if page_num in pages_dict:
            page = pages_dict[page_num]
            text_preview = page.get('text_preview', '')
            
            # Look for key indicators
            indicators = []
            
            if 'LESSON 7' in text_preview.upper():
                indicators.append('🎯 LESSON 7')
            if 'Dear Family' in text_preview:
                indicators.append('👨‍👩‍👧‍👦 Dear Family')
            if 'SESSION 1' in text_preview.upper():
                indicators.append('📝 SESSION 1')
            if 'UNIT' in text_preview.upper():
                indicators.append('📚 UNIT mention')
            if 'Decimals' in text_preview:
                indicators.append('🔢 Decimals (Lesson 7 topic)')
            
            if indicators or page_num % 5 == 0:  # Show every 5th page or pages with indicators
                print(f"\n📄 PAGE {page_num}:")
                if indicators:
                    print(f"   Indicators: {' | '.join(indicators)}")
                print(f"   Text: {text_preview[:150]}...")
                
                if 'LESSON 7' in text_preview.upper() and 'Dear Family' in text_preview:
                    print(f"   🎯 *** LIKELY LESSON 7 START ***")

def find_actual_lesson_7_start():
    """Find the actual start page for Lesson 7"""
    
    volume_path = 'webapp_pages/RCM06_NA_SW_V1'
    document_path = os.path.join(volume_path, 'data', 'document.json')
    
    with open(document_path, 'r', encoding='utf-8') as f:
        document = json.load(f)
    
    # Look for "LESSON 7" + "Dear Family" combination
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        if 'LESSON 7' in text_preview.upper() and 'Dear Family' in text_preview:
            print(f"\n🎯 FOUND LESSON 7 START: Page {page_number}")
            print(f"Text sample: {text_preview[:200]}...")
            return page_number
    
    # Fallback: look for LESSON 7 | SESSION 1
    for page in document['pages']:
        text_preview = page.get('text_preview', '')
        page_number = page.get('page_number', 0)
        
        if re.search(r'LESSON\s+7\s*\|\s*SESSION\s*1', text_preview, re.IGNORECASE):
            print(f"\n📍 FOUND LESSON 7 SESSION 1: Page {page_number}")
            print(f"Text sample: {text_preview[:200]}...")
            return page_number
    
    print("❌ Could not find Lesson 7 start")
    return None

if __name__ == "__main__":
    analyze_unit_gap()
    print("\n" + "="*60)
    actual_start = find_actual_lesson_7_start()
    
    if actual_start:
        print(f"\n💡 RECOMMENDATION:")
        print(f"   Current Lesson 7 boundary: 157-178")
        print(f"   Actual Lesson 7 should start: {actual_start}")
        print(f"   Adjustment needed: +{actual_start - 157} pages")