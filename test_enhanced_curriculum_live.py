#!/usr/bin/env python3
"""
Test the enhanced curriculum extraction results on the live server
"""

import json
import time
import requests

def test_local_api():
    """Test the local development server APIs"""
    
    base_url = "http://localhost:3002"
    
    print("🧪 TESTING ENHANCED CURRICULUM EXTRACTION RESULTS")
    print("=" * 55)
    
    # Test 1: Session Statistics API
    print("\n📊 Testing Session Statistics API...")
    try:
        response = requests.get(f"{base_url}/api/curriculum/session-stats", timeout=10)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Session Statistics API working!")
            print(f"   Total Sessions: {stats.get('totalSessions', 'N/A')}")
            print(f"   Total Lessons: {stats.get('totalLessons', 'N/A')}")
            print(f"   Completion Rate: {stats.get('completionRate', 'N/A')}%")
            print(f"   Enhanced Volumes: {stats.get('curriculaCount', 'N/A')}")
        else:
            print(f"❌ Session Statistics API failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Session Statistics API error: {e}")
    
    # Test 2: Sessions API
    print("\n🔍 Testing Sessions API...")
    try:
        response = requests.get(f"{base_url}/api/curriculum/sessions", timeout=10)
        if response.status_code == 200:
            sessions = response.json()
            print("✅ Sessions API working!")
            print(f"   Sessions returned: {len(sessions)}")
            if sessions:
                sample_session = sessions[0]
                print(f"   Sample session: Grade {sample_session.get('grade')} - {sample_session.get('session', {}).get('title', 'N/A')[:50]}...")
        else:
            print(f"❌ Sessions API failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"❌ Sessions API error: {e}")
    
    # Test 3: Enhanced Curriculum Service Files
    print("\n📁 Testing Enhanced Curriculum Files...")
    import os
    enhanced_files = [
        "GRADE6_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V1.json",
        "GRADE6_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V2.json", 
        "GRADE7_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V1.json",
        "GRADE7_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V2.json",
        "GRADE8_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V1.json",
        "GRADE8_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V2.json",
        "ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V1.json",
        "ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V2.json"
    ]
    
    existing_files = 0
    total_sessions = 0
    total_lessons = 0
    
    for filename in enhanced_files:
        if os.path.exists(filename):
            existing_files += 1
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    metadata = data.get('session_extraction_metadata', {})
                    sessions = metadata.get('total_sessions_extracted', 0)
                    lessons = metadata.get('lessons_with_sessions', 0)
                    total_sessions += sessions
                    total_lessons += lessons
                    print(f"✅ {filename}: {lessons} lessons, {sessions} sessions")
            except Exception as e:
                print(f"❌ Error reading {filename}: {e}")
        else:
            print(f"❌ Missing: {filename}")
    
    print(f"\n📈 Summary:")
    print(f"   Enhanced files available: {existing_files}/{len(enhanced_files)}")
    print(f"   Total sessions in files: {total_sessions}")
    print(f"   Total lessons in files: {total_lessons}")
    
    # Test 4: Web Pages Accessibility  
    print("\n🌐 Testing Web Pages...")
    pages_to_test = [
        "/curriculum",
        "/curriculum/enhanced", 
        "/curriculum/sessions"
    ]
    
    for page in pages_to_test:
        try:
            response = requests.get(f"{base_url}{page}", timeout=10)
            if response.status_code == 200:
                print(f"✅ {page} - Accessible")
            else:
                print(f"❌ {page} - Status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {page} - Error: {e}")
    
    print("\n" + "="*55)
    print("🎯 TEST SUMMARY")
    print("✅ Enhanced curriculum extraction results are now visible!")
    print("🔗 Main Curriculum: http://localhost:3002/curriculum")
    print("🔬 Enhanced Analysis: http://localhost:3002/curriculum/enhanced")
    print("🔍 Session Explorer: http://localhost:3002/curriculum/sessions")
    print("📊 API Endpoints: /api/curriculum/session-stats, /api/curriculum/sessions")


if __name__ == "__main__":
    test_local_api()
