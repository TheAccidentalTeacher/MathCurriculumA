#!/usr/bin/env python3
"""
Debug script to check why Grade 6 Volume 2 lessons are not loading.
"""

import json
import os

def check_volume2_files():
    """Check if Volume 2 files exist and are accessible."""
    
    print('🔍 CHECKING GRADE 6 VOLUME 2 FILE STRUCTURE')
    print('='*50)
    
    # Check document.json
    v2_data_path = 'webapp_pages/RCM06_NA_SW_V2/data/document.json'
    if os.path.exists(v2_data_path):
        print('✅ document.json exists')
        try:
            with open(v2_data_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            print('✅ document.json is valid JSON')
            print(f'📊 Contains {len(data.get("pages", []))} pages')
            if 'metadata' in data:
                print(f'📄 Total pages: {data["metadata"].get("total_pages", "Unknown")}')
        except Exception as e:
            print(f'❌ Error reading document.json: {e}')
    else:
        print('❌ document.json missing')
    
    # Check pages directory
    v2_pages_path = 'webapp_pages/RCM06_NA_SW_V2/pages'
    if os.path.exists(v2_pages_path):
        print('✅ Pages directory exists')
        png_files = [f for f in os.listdir(v2_pages_path) if f.endswith('.png')]
        print(f'📁 Contains {len(png_files)} PNG files')
        
        if png_files:
            png_files.sort()
            print(f'📄 Range: {png_files[0]} to {png_files[-1]}')
    else:
        print('❌ Pages directory missing')
    
    return data if os.path.exists(v2_data_path) else None

def check_lesson_boundaries():
    """Check the current lesson boundaries for Volume 2."""
    
    print('\n🎯 CHECKING CURRENT LESSON BOUNDARIES')
    print('='*50)
    
    service_file = 'src/lib/database-free-lesson-service.ts'
    if os.path.exists(service_file):
        with open(service_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find Volume 2 lesson 20
        import re
        match = re.search(r"20:\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*['\"]([^'\"]*)['\"]", content)
        if match:
            start_page = int(match.group(1))
            end_page = int(match.group(2))
            title = match.group(3)
            
            print(f'📝 Lesson 20 mapping:')
            print(f'   Title: {title}')
            print(f'   Pages: {start_page}-{end_page}')
            print(f'   PNG files: page_{start_page:03d}.png to page_{end_page:03d}.png')
            
            return start_page, end_page
        else:
            print('❌ Could not find Lesson 20 in boundaries')
    else:
        print('❌ database-free-lesson-service.ts not found')
    
    return None, None

def check_specific_png_files(start_page, end_page):
    """Check if the specific PNG files for a lesson exist."""
    
    if not start_page:
        return
    
    print('\n📁 CHECKING SPECIFIC PNG FILES')
    print('='*50)
    
    v2_pages_path = 'webapp_pages/RCM06_NA_SW_V2/pages'
    test_pages = [start_page, start_page + 1, start_page + 2]
    
    for page_num in test_pages:
        png_file = f'{v2_pages_path}/page_{page_num:03d}.png'
        if os.path.exists(png_file):
            file_size = os.path.getsize(png_file)
            print(f'✅ {png_file} exists ({file_size:,} bytes)')
        else:
            print(f'❌ {png_file} missing')

def check_api_route():
    """Check if the API route file exists."""
    
    print('\n🌐 CHECKING API ROUTE')
    print('='*50)
    
    api_route = 'src/app/api/lessons/[documentId]/[lessonNumber]/route.ts'
    if os.path.exists(api_route):
        print('✅ API route exists')
        
        # Check if it handles RCM06_NA_SW_V2
        with open(api_route, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'RCM06_NA_SW_V2' in content:
            print('✅ API route mentions RCM06_NA_SW_V2')
        else:
            print('⚠️  API route does not explicitly mention RCM06_NA_SW_V2')
    else:
        print('❌ API route missing')

if __name__ == "__main__":
    data = check_volume2_files()
    start_page, end_page = check_lesson_boundaries() 
    check_specific_png_files(start_page, end_page)
    check_api_route()
    
    print('\n🚀 DEBUGGING RECOMMENDATIONS')
    print('='*50)
    print('1. Check browser developer console for errors')
    print('2. Test API endpoint directly: /api/lessons/RCM06_NA_SW_V2/20')
    print('3. Verify lesson viewer component loads Volume 2 data')
    print('4. Check if lesson boundaries are too high (beyond available PNG files)')
