#!/usr/bin/env python3
"""
Quick extraction tester - Shows sample session data from our extractions
"""

import json
from pathlib import Path

def test_extraction_results():
    """Test and display sample extraction results"""
    
    print("🧪 TESTING SESSION EXTRACTION RESULTS")
    print("="*50)
    
    # Test files to examine
    test_files = [
        ("GRADE8_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V1.json", "Grade 8 Volume 1"),
        ("ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V2.json", "Algebra 1 Volume 2")
    ]
    
    for filename, description in test_files:
        print(f"\n📚 Testing {description}")
        print("-" * 30)
        
        if not Path(filename).exists():
            print(f"❌ File not found: {filename}")
            continue
        
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Extract basic info
            title = data.get("title", "Unknown")
            metadata = data.get("session_extraction_metadata", {})
            
            print(f"📖 Title: {title}")
            print(f"🎯 Total lessons with sessions: {metadata.get('lessons_with_sessions', 0)}")
            print(f"🔢 Total sessions extracted: {metadata.get('total_sessions_extracted', 0)}")
            
            # Show extraction stats
            extraction_stats = metadata.get("extraction_stats", {})
            if extraction_stats:
                explicit = extraction_stats.get("sessions_with_explicit_type", 0)
                inferred = extraction_stats.get("sessions_with_inferred_type", 0)
                total_found = extraction_stats.get("total_sessions_found", 0)
                
                print(f"✨ Explicit type detection: {explicit} sessions")
                print(f"🔮 Inferred type detection: {inferred} sessions")
                print(f"📊 Total sessions found: {total_found}")
                
                if explicit + inferred > 0:
                    explicit_rate = (explicit / (explicit + inferred)) * 100
                    print(f"📈 Explicit detection rate: {explicit_rate:.1f}%")
            
            # Find and show a sample lesson with sessions
            print(f"\n🎯 Sample Session Detail:")
            sample_shown = False
            
            for volume_name, volume_data in data.get("volumes", {}).items():
                if sample_shown:
                    break
                    
                for unit in volume_data.get("units", []):
                    if sample_shown:
                        break
                        
                    for lesson in unit.get("lessons", []):
                        sessions = lesson.get("sessions", [])
                        if sessions and len(sessions) >= 3:  # Show lesson with multiple sessions
                            print(f"   📝 Lesson {lesson.get('lesson_number')}: {lesson.get('title', 'Unknown')[:50]}...")
                            print(f"   📊 Sessions: {len(sessions)}")
                            
                            # Show first 3 sessions
                            for i, session in enumerate(sessions[:3]):
                                session_type = session.get("session_type", "Unknown")
                                session_title = session.get("title", "No title")[:40]
                                page_span = session.get("page_span", 0)
                                inferred = session.get("inferred_type", False)
                                detection_type = "inferred" if inferred else "explicit"
                                
                                print(f"     • Session {session.get('session_number', i+1)}: {session_type}")
                                print(f"       Title: {session_title}...")
                                print(f"       Pages: {page_span} pages ({detection_type} type)")
                            
                            if len(sessions) > 3:
                                print(f"     ... and {len(sessions) - 3} more sessions")
                                
                            sample_shown = True
                            break
            
            if not sample_shown:
                print("   ⚠️ No lessons with sessions found")
                
        except Exception as e:
            print(f"❌ Error reading {filename}: {e}")
    
    print(f"\n🎉 Extraction test complete!")
    print("💡 Open session_extraction_viewer.html in your browser for interactive viewing")

if __name__ == "__main__":
    test_extraction_results()
