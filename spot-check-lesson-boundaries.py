#!/usr/bin/env python3

import json
import os

def spot_check_actual_lesson_content():
    """Spot check actual lesson content at key boundary points to ensure accuracy"""
    
    volumes = [
        ('RCM07_NA_SW_V1', 'Grade 7 Volume 1'),
        ('RCM07_NA_SW_V2', 'Grade 7 Volume 2'), 
        ('RCM08_NA_SW_V1', 'Grade 8 Volume 1'),
        ('RCM08_NA_SW_V2', 'Grade 8 Volume 2')
    ]
    
    # Key boundary checks - start/end of units and some middle lessons
    test_points = {
        'RCM07_NA_SW_V1': [
            (1, 15, "Should be start of Lesson 1"),
            (6, 148, "Should be end of Unit 1 (Lesson 6)"),
            (7, 149, "Should be start of Unit 2 (Lesson 7)"), 
            (13, 290, "Should be end of Unit 2 (Lesson 13)"),
            (14, 291, "Should be start of Unit 3 (Lesson 14)"),
            (19, 504, "Should be end of Unit 3 (Lesson 19)")
        ],
        'RCM07_NA_SW_V2': [
            (20, 15, "Should be start of Lesson 20"),
            (23, 98, "Should be end of Lesson 23 - the problematic one we fixed"),
            (24, 99, "Should be start of Lesson 24"),
            (33, 440, "Should be end of last lesson")
        ],
        'RCM08_NA_SW_V1': [
            (1, 15, "Should be start of Lesson 1"),
            (7, 190, "Should be end of Unit 1 (Lesson 7)"),
            (8, 191, "Should be start of Unit 2 (Lesson 8)"),
            (18, 552, "Should be end of last lesson")
        ],
        'RCM08_NA_SW_V2': [
            (19, 15, "Should be start of Lesson 19"),
            (25, 186, "Should be end of Lesson 25"), 
            (26, 187, "Should be start of Lesson 26"),
            (32, 456, "Should be end of last lesson")
        ]
    }
    
    print("🔍 SPOT CHECKING ACTUAL LESSON CONTENT AT KEY BOUNDARIES")
    print("="*70)
    
    for volume_id, volume_name in volumes:
        doc_path = f'webapp_pages/{volume_id}/data/document.json'
        
        if not os.path.exists(doc_path):
            print(f"❌ Document not found: {doc_path}")
            continue
            
        with open(doc_path, 'r', encoding='utf-8') as f:
            document = json.load(f)
        
        pages = document.get('pages', [])
        page_lookup = {p['page_number']: p for p in pages}
        
        print(f"\n📚 {volume_name} ({volume_id})")
        print("-" * 50)
        
        test_cases = test_points.get(volume_id, [])
        
        for lesson_num, page_num, description in test_cases:
            print(f"\n🔍 {description}")
            print(f"    Checking Lesson {lesson_num}, Page {page_num}")
            
            if page_num in page_lookup:
                page_content = page_lookup[page_num]
                text_preview = page_content.get('text_preview', '')[:200]
                
                # Check for lesson markers
                lesson_patterns = [
                    f'LESSON {lesson_num}',
                    f'LESSON\\s+{lesson_num}',
                    f'L{lesson_num}'
                ]
                
                found_lesson = False
                for pattern in lesson_patterns:
                    if pattern in text_preview.upper():
                        found_lesson = True
                        break
                
                if found_lesson:
                    print(f"    ✅ Found lesson marker for Lesson {lesson_num}")
                else:
                    print(f"    ⚠️  No clear lesson marker found")
                
                print(f"    📄 Content preview: {text_preview}")
                
                # For start pages, look for "Dear Family" (typical lesson start)
                if "start of" in description.lower():
                    if "dear family" in text_preview.lower():
                        print(f"    ✅ Found 'Dear Family' marker (typical lesson start)")
                    else:
                        print(f"    ⚠️  No 'Dear Family' found (unusual for lesson start)")
                        
            else:
                print(f"    ❌ Page {page_num} not found in document")
    
    print("\n" + "="*70)
    print("✅ Spot check complete!")

if __name__ == "__main__":
    spot_check_actual_lesson_content()
