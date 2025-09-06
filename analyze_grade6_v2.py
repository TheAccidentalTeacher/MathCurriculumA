#!/usr/bin/env python3
"""
Script to analyze and fix Grade 6 Volume 2 lesson boundaries.
Volume 1 is working, but Volume 2 may need a different offset.
"""

import re

def analyze_grade6_v2_offset():
    """Analyze Grade 6 Volume 2 to determine the correct offset."""
    
    print("🔍 ANALYZING GRADE 6 VOLUME 2 OFFSET")
    print("="*50)
    
    # Read current boundaries
    service_file = 'src/lib/database-free-lesson-service.ts'
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find Grade 6 Volume 2 section
    v2_pattern = r"'RCM06_NA_SW_V2':\s*\{(.*?)\},"
    v2_match = re.search(v2_pattern, content, re.DOTALL)
    
    if v2_match:
        v2_content = v2_match.group(1)
        print("Current Grade 6 Volume 2 boundaries:")
        
        # Extract lesson info
        lesson_pattern = r'(\d+):\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*[\'"]([^\'"]*)[\'"]'
        lessons = re.findall(lesson_pattern, v2_content)
        
        for lesson_num, start_page, end_page, title in lessons[:5]:  # Show first 5
            print(f"  Lesson {lesson_num}: pages {start_page}-{end_page} - {title}")
    
    print(f"\n📋 Grade 6 Volume 2 Analysis:")
    print(f"  - Volume 2 starts with Lesson 15 (not Lesson 1)")
    print(f"  - Volume 2 is a separate PDF file with its own page numbering")
    print(f"  - Volume 2 may have a different front matter offset than Volume 1")
    
    # Let's check what the actual page count is for Volume 2
    print(f"\n🔍 Checking Volume 2 PNG files...")
    
    import os
    v2_png_dir = 'webapp_pages/RCM06_NA_SW_V2/pages'
    if os.path.exists(v2_png_dir):
        png_files = [f for f in os.listdir(v2_png_dir) if f.endswith('.png')]
        png_count = len(png_files)
        print(f"  📁 Found {png_count} PNG files in Volume 2")
        
        # Show range
        if png_files:
            png_files.sort()
            first_png = png_files[0]
            last_png = png_files[-1]
            print(f"  📄 Range: {first_png} to {last_png}")
    
    return lessons

def check_volume2_table_of_contents():
    """Check what the table of contents says for Volume 2."""
    
    print(f"\n📖 CHECKING VOLUME 2 TABLE OF CONTENTS")
    print("="*50)
    
    # Let's check the JSON data for table of contents
    import json
    import os
    
    doc_path = 'webapp_pages/RCM06_NA_SW_V2/data/document.json'
    if os.path.exists(doc_path):
        with open(doc_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"📊 Document metadata:")
        if 'metadata' in data:
            total_pages = data['metadata'].get('total_pages', 'Unknown')
            print(f"  Total pages: {total_pages}")
        
        # Check first few pages for table of contents
        print(f"\n🔍 Searching first 20 pages for table of contents...")
        
        toc_pages = []
        for i, page_data in enumerate(data['pages'][:20]):
            content = page_data.get('content', '').lower()
            page_num = page_data.get('page_number', i+1)
            
            # Look for lesson indicators in table of contents
            if 'lesson' in content and ('unit' in content or 'page' in content):
                lines = content.split('\n')
                lesson_lines = [line for line in lines if 'lesson' in line.lower()]
                
                if lesson_lines:
                    print(f"  📄 Page {page_num} contains lesson references:")
                    for line in lesson_lines[:3]:  # Show first 3
                        if line.strip():
                            print(f"    {line.strip()[:80]}...")
                    toc_pages.append(page_num)
        
        if toc_pages:
            print(f"\n✅ Found table of contents on pages: {toc_pages}")
        else:
            print(f"\n❌ No clear table of contents found in first 20 pages")
    
    else:
        print(f"❌ Volume 2 document.json not found at {doc_path}")

def find_lesson_15_in_v2():
    """Find where Lesson 15 actually starts in Volume 2."""
    
    print(f"\n🎯 FINDING LESSON 15 IN VOLUME 2")
    print("="*50)
    
    import json
    import os
    
    doc_path = 'webapp_pages/RCM06_NA_SW_V2/data/document.json'
    if os.path.exists(doc_path):
        with open(doc_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Search through pages for Lesson 15 content
        print(f"🔍 Searching for Lesson 15 'Understand Rate Concepts'...")
        
        for i, page_data in enumerate(data['pages'][:50]):  # Check first 50 pages
            content = page_data.get('content', '').lower()
            page_num = page_data.get('page_number', i+1)
            
            # Look for lesson 15 patterns
            if ('lesson 15' in content or 'lesson fifteen' in content) and 'rate' in content:
                print(f"  📍 Found Lesson 15 content on PNG page {page_num}")
                print(f"  📝 Content preview: {content[:150]}...")
                return page_num
            
            # Also look for "understand rate concepts"
            if 'understand rate concepts' in content:
                print(f"  📍 Found 'Understand Rate Concepts' on PNG page {page_num}")
                print(f"  📝 Content preview: {content[:150]}...")
                return page_num
        
        print(f"❌ Could not find Lesson 15 content in first 50 pages")
        return None
    
    else:
        print(f"❌ Volume 2 document.json not found")
        return None

def suggest_v2_offset_correction(lessons, actual_lesson_15_page=None):
    """Suggest the correct offset for Volume 2 based on findings."""
    
    print(f"\n💡 VOLUME 2 OFFSET CORRECTION SUGGESTIONS")
    print("="*50)
    
    if lessons:
        # Current Lesson 15 mapping
        lesson_15 = next((l for l in lessons if l[0] == '15'), None)
        if lesson_15:
            current_start = int(lesson_15[1])
            print(f"📊 Current mapping: Lesson 15 starts at PNG page {current_start}")
            
            if actual_lesson_15_page:
                suggested_offset = actual_lesson_15_page - current_start + 12  # Remove current offset, add correct one
                print(f"📍 Actual location: Lesson 15 found at PNG page {actual_lesson_15_page}")
                print(f"🔧 Suggested offset correction: {suggested_offset} pages")
                
                if suggested_offset != 12:
                    print(f"⚠️  Volume 2 needs different offset than Volume 1!")
                    print(f"   Volume 1 offset: +12 pages")
                    print(f"   Volume 2 offset: +{suggested_offset} pages")
                else:
                    print(f"✅ Volume 2 offset appears correct (+12 pages)")
            else:
                print(f"❌ Could not determine actual Lesson 15 location")
    
    print(f"\n🚀 Next steps:")
    print(f"   1. Manually check a few Volume 2 lesson URLs")
    print(f"   2. If wrong, run offset correction for Volume 2 only")
    print(f"   3. Test: /lesson/RCM06_NA_SW_V2/15 (should show Lesson 15)")

if __name__ == "__main__":
    lessons = analyze_grade6_v2_offset()
    check_volume2_table_of_contents()
    actual_page = find_lesson_15_in_v2()
    suggest_v2_offset_correction(lessons, actual_page)
