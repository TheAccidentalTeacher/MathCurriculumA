#!/usr/bin/env python3
"""
Verification script to confirm Grade 6 lesson mappings are correct.
"""

def verify_grade6_mappings():
    """Verify the Grade 6 lesson mappings after applying offset."""
    
    print("🎯 GRADE 6 LESSON VERIFICATION")
    print("="*50)
    
    # Key lessons to verify
    verifications = [
        {
            'volume': 'RCM06_NA_SW_V1',
            'lesson': 3,
            'title': 'Use Nets to Find Surface Area',
            'expected_png': 53,
            'textbook_page': 41,
            'description': 'This should show the Dear Family letter from your image'
        },
        {
            'volume': 'RCM06_NA_SW_V1', 
            'lesson': 1,
            'title': 'Find the Area of a Parallelogram',
            'expected_png': 15,
            'textbook_page': 3,
            'description': 'First lesson in Grade 6'
        }
    ]
    
    # Read the current boundaries
    service_file = 'src/lib/database-free-lesson-service.ts'
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for check in verifications:
        # Look for the lesson
        import re
        pattern = f"'{check['volume']}'.*?{check['lesson']}:\s*{{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*['\"]([^'\"]*)['\"]"
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            start_page = int(match.group(1))
            end_page = int(match.group(2))
            title = match.group(3)
            
            print(f"\n📍 {check['volume']} Lesson {check['lesson']}:")
            print(f"   Title: {title}")
            print(f"   PNG Pages: {start_page}-{end_page}")
            print(f"   Expected: {check['expected_png']}")
            
            if start_page == check['expected_png']:
                print(f"   ✅ CORRECT!")
                print(f"   📝 {check['description']}")
                print(f"   🔗 Test URL: /lesson/{check['volume']}/{check['lesson']}")
            else:
                print(f"   ❌ MISMATCH! Expected {check['expected_png']}, got {start_page}")
        else:
            print(f"\n❌ Could not find {check['volume']} Lesson {check['lesson']}")
    
    print(f"\n" + "="*50)
    print(f"📏 OFFSET CALCULATION VERIFICATION")
    print(f"="*50)
    print(f"From your image:")
    print(f"  - Shows 'LESSON 3' in blue circle")
    print(f"  - Shows 'Use Nets to Find Surface Area' title")
    print(f"  - Shows page '41' at bottom (textbook page)")
    print(f"  - Should be PNG file page_053.png")
    print(f"")
    print(f"Calculation: PNG_page = textbook_page + 12")
    print(f"            page_053 = page_41 + 12 ✅")

if __name__ == "__main__":
    verify_grade6_mappings()
