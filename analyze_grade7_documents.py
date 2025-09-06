"""
DETAILED Grade 7 Curriculum Extraction
Analyzing actual document.json files from both volumes for precise table of contents
"""

import json
import re
from typing import Dict, List

def read_grade7_documents():
    """Read and analyze Grade 7 document.json files from both volumes"""
    
    print("📖 Reading Grade 7 Volume 1 document...")
    with open("webapp_pages/RCM07_NA_SW_V1/data/document.json", "r") as f:
        vol1_data = json.load(f)
    
    print("📖 Reading Grade 7 Volume 2 document...")
    with open("webapp_pages/RCM07_NA_SW_V2/data/document.json", "r") as f:
        vol2_data = json.load(f)
    
    return vol1_data, vol2_data

def extract_table_of_contents_grade7():
    """Extract detailed table of contents from Grade 7 documents"""
    
    vol1_data, vol2_data = read_grade7_documents()
    
    print(f"📊 Volume 1: {vol1_data.get('total_pages', 'Unknown')} pages")
    print(f"📊 Volume 2: {vol2_data.get('total_pages', 'Unknown')} pages")
    
    # Find contents pages
    vol1_contents_pages = []
    vol2_contents_pages = []
    
    # Search for contents pages in Volume 1
    for page in vol1_data.get('pages', []):
        if page.get('page_type') == 'contents' or 'Contents' in page.get('text_preview', ''):
            vol1_contents_pages.append({
                'page_number': page.get('page_number'),
                'text_preview': page.get('text_preview', ''),
                'keywords': page.get('keywords', [])
            })
    
    # Search for contents pages in Volume 2
    for page in vol2_data.get('pages', []):
        if page.get('page_type') == 'contents' or 'Contents' in page.get('text_preview', ''):
            vol2_contents_pages.append({
                'page_number': page.get('page_number'),
                'text_preview': page.get('text_preview', ''),
                'keywords': page.get('keywords', [])
            })
    
    print(f"\n🔍 Found {len(vol1_contents_pages)} contents pages in Volume 1")
    print(f"🔍 Found {len(vol2_contents_pages)} contents pages in Volume 2")
    
    # Extract lesson information from Volume 1
    vol1_lessons = []
    for page in vol1_data.get('pages', []):
        text_preview = page.get('text_preview', '')
        if 'LESSON' in text_preview and page.get('page_type') == 'lesson':
            # Extract lesson number and title
            lesson_match = re.search(r'LESSON (\d+)\s+([^.]+)', text_preview)
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title = lesson_match.group(2).strip()
                vol1_lessons.append({
                    'lesson_number': lesson_num,
                    'lesson_title': lesson_title,
                    'page_number': page.get('page_number'),
                    'keywords': page.get('keywords', [])
                })
    
    # Extract lesson information from Volume 2
    vol2_lessons = []
    for page in vol2_data.get('pages', []):
        text_preview = page.get('text_preview', '')
        if 'LESSON' in text_preview and page.get('page_type') == 'lesson':
            # Extract lesson number and title
            lesson_match = re.search(r'LESSON (\d+)\s+([^.]+)', text_preview)
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title = lesson_match.group(2).strip()
                vol2_lessons.append({
                    'lesson_number': lesson_num,
                    'lesson_title': lesson_title,
                    'page_number': page.get('page_number'),
                    'keywords': page.get('keywords', [])
                })
    
    # Remove duplicates and sort
    vol1_lessons = list({lesson['lesson_number']: lesson for lesson in vol1_lessons}.values())
    vol2_lessons = list({lesson['lesson_number']: lesson for lesson in vol2_lessons}.values())
    
    vol1_lessons.sort(key=lambda x: x['lesson_number'])
    vol2_lessons.sort(key=lambda x: x['lesson_number'])
    
    print(f"\n📚 Found {len(vol1_lessons)} lessons in Volume 1")
    print(f"📚 Found {len(vol2_lessons)} lessons in Volume 2")
    
    # Display contents pages for analysis
    print("\n🎯 VOLUME 1 TABLE OF CONTENTS:")
    for i, contents_page in enumerate(vol1_contents_pages):
        print(f"\n--- Contents Page {contents_page['page_number']} ---")
        print(contents_page['text_preview'][:500] + "..." if len(contents_page['text_preview']) > 500 else contents_page['text_preview'])
    
    print("\n🎯 VOLUME 2 TABLE OF CONTENTS:")
    for i, contents_page in enumerate(vol2_contents_pages):
        print(f"\n--- Contents Page {contents_page['page_number']} ---")
        print(contents_page['text_preview'][:500] + "..." if len(contents_page['text_preview']) > 500 else contents_page['text_preview'])
    
    # Display found lessons
    print("\n📖 VOLUME 1 LESSONS:")
    for lesson in vol1_lessons[:10]:  # Show first 10
        print(f"  Lesson {lesson['lesson_number']}: {lesson['lesson_title']} (Page {lesson['page_number']})")
    
    print("\n📖 VOLUME 2 LESSONS:")
    for lesson in vol2_lessons[:10]:  # Show first 10
        print(f"  Lesson {lesson['lesson_number']}: {lesson['lesson_title']} (Page {lesson['page_number']})")
    
    return {
        'vol1_data': vol1_data,
        'vol2_data': vol2_data,
        'vol1_contents': vol1_contents_pages,
        'vol2_contents': vol2_contents_pages,
        'vol1_lessons': vol1_lessons,
        'vol2_lessons': vol2_lessons
    }

def create_detailed_grade7_analysis():
    """Create detailed Grade 7 analysis based on actual document content"""
    
    analysis_data = extract_table_of_contents_grade7()
    
    # Create comprehensive analysis
    detailed_analysis = {
        "metadata": {
            "title": "Ready Classroom Mathematics Grade 7 - DETAILED Analysis",
            "grade": 7,
            "curriculum": "Ready Classroom Mathematics",
            "publisher": "Curriculum Associates",
            "total_volumes": 2,
            "extraction_source": "Direct document.json analysis",
            "extraction_date": "2025-09-06",
            "vol1_total_pages": analysis_data['vol1_data'].get('total_pages'),
            "vol2_total_pages": analysis_data['vol2_data'].get('total_pages'),
            "vol1_lessons_found": len(analysis_data['vol1_lessons']),
            "vol2_lessons_found": len(analysis_data['vol2_lessons'])
        },
        "volume_1_analysis": {
            "total_pages": analysis_data['vol1_data'].get('total_pages'),
            "contents_pages": analysis_data['vol1_contents'],
            "lessons_found": analysis_data['vol1_lessons'],
            "estimated_units": 3  # Based on typical Grade 7 structure
        },
        "volume_2_analysis": {
            "total_pages": analysis_data['vol2_data'].get('total_pages'),
            "contents_pages": analysis_data['vol2_contents'],
            "lessons_found": analysis_data['vol2_lessons'],
            "estimated_units": 3  # Based on typical Grade 7 structure
        }
    }
    
    # Save detailed analysis
    with open("grade7_detailed_analysis.json", "w") as f:
        json.dump(detailed_analysis, f, indent=2)
    
    return detailed_analysis

if __name__ == "__main__":
    print("🔍 DETAILED Grade 7 Curriculum Analysis Starting...")
    print("📋 Analyzing actual document.json files for precise table of contents extraction\n")
    
    try:
        detailed_analysis = create_detailed_grade7_analysis()
        
        print(f"\n✅ DETAILED ANALYSIS COMPLETE!")
        print(f"📊 Volume 1: {detailed_analysis['metadata']['vol1_total_pages']} pages, {detailed_analysis['metadata']['vol1_lessons_found']} lessons found")
        print(f"📊 Volume 2: {detailed_analysis['metadata']['vol2_total_pages']} pages, {detailed_analysis['metadata']['vol2_lessons_found']} lessons found")
        print(f"\n📁 Detailed analysis saved to: grade7_detailed_analysis.json")
        
        print(f"\n🎯 Ready to create precise Grade 7 curriculum documentation!")
        
    except FileNotFoundError as e:
        print(f"❌ Error: Could not find document files. {e}")
        print("💡 Make sure Grade 7 documents have been extracted to webapp_pages/")
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        print("💡 Check the document.json file structure and try again")
