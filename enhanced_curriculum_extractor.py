#!/usr/bin/env python3
"""
ENHANCED CURRICULUM EXTRACTION ENGINE
Extends comprehensive_extraction_engine.py with session-level extraction
Phase 2 Implementation - Integration with existing pipeline
"""

import json
import re
from pathlib import Path
from typing import Dict, List, Any
from session_extraction_module import SessionExtractionEngine, SessionData
import logging

logger = logging.getLogger(__name__)

class EnhancedCurriculumExtractor:
    """Enhanced extractor that combines lesson-level and session-level extraction"""
    
    def __init__(self):
        self.session_engine = SessionExtractionEngine()
        
    def create_enhanced_curriculum_structure(self, 
                                           grade: int, 
                                           volume: str,
                                           base_structure_path: str = None) -> Dict[str, Any]:
        """
        Create enhanced curriculum structure with session detail
        
        Args:
            grade: Grade level (6, 7, 8, or 9 for Algebra 1)
            volume: Volume identifier (V1, V2)
            base_structure_path: Path to existing structure JSON (optional)
        
        Returns:
            Enhanced curriculum structure with sessions
        """
        
        # Determine document path based on grade and volume
        grade_map = {6: "RCM06", 7: "RCM07", 8: "RCM08", 9: "ALG01"}
        doc_code = grade_map.get(grade, f"RCM{grade:02d}")
        doc_path = f"webapp_pages/{doc_code}_NA_SW_{volume}/data/document.json"
        
        logger.info(f"Creating enhanced structure for Grade {grade} Volume {volume}")
        
        # Load base structure if provided
        base_structure = {}
        if base_structure_path and Path(base_structure_path).exists():
            with open(base_structure_path, 'r', encoding='utf-8') as f:
                base_structure = json.load(f)
            logger.info(f"Loaded base structure from: {base_structure_path}")
        
        # Extract sessions from document
        if Path(doc_path).exists():
            lessons_with_sessions = self.session_engine.extract_sessions_from_document(doc_path)
            logger.info(f"Extracted sessions for {len(lessons_with_sessions)} lessons")
        else:
            logger.warning(f"Document not found: {doc_path}")
            lessons_with_sessions = {}
        
        # Create enhanced structure
        enhanced_structure = self._merge_base_with_sessions(base_structure, lessons_with_sessions, grade, volume)
        
        return enhanced_structure
    
    def _merge_base_with_sessions(self, 
                                base_structure: Dict[str, Any], 
                                lessons_with_sessions: Dict[int, List[SessionData]],
                                grade: int,
                                volume: str) -> Dict[str, Any]:
        """Merge base curriculum structure with extracted session data"""
        
        # Start with base structure or create new one
        if base_structure:
            enhanced = base_structure.copy()
        else:
            enhanced = {
                "grade": grade,
                "title": f"Ready Classroom Mathematics Grade {grade}",
                "curriculum_publisher": "Curriculum Associates",
                "curriculum_type": "Complete Mathematics Program",
                "extraction_version": "Enhanced v2.0 - With Sessions",
                "volumes": {}
            }
        
        # Ensure volumes structure exists
        if "volumes" not in enhanced:
            enhanced["volumes"] = {}
        
        volume_key = f"Volume {volume[-1]}"  # V1 -> "Volume 1"
        if volume_key not in enhanced["volumes"]:
            enhanced["volumes"][volume_key] = {
                "volume_name": volume_key,
                "units": []
            }
        
        # Process each lesson with sessions
        self._integrate_sessions_into_lessons(enhanced, lessons_with_sessions, volume_key)
        
        # Add session extraction metadata
        enhanced["session_extraction_metadata"] = {
            "extraction_engine": "SessionExtractionEngine v1.0",
            "extraction_stats": self.session_engine.extraction_stats,
            "lessons_with_sessions": len(lessons_with_sessions),
            "total_sessions_extracted": sum(len(sessions) for sessions in lessons_with_sessions.values())
        }
        
        return enhanced
    
    def _integrate_sessions_into_lessons(self, 
                                       enhanced: Dict[str, Any], 
                                       lessons_with_sessions: Dict[int, List[SessionData]],
                                       volume_key: str):
        """Integrate session data into existing lesson structures"""
        
        # Navigate through the structure to find lessons
        volume_data = enhanced["volumes"][volume_key]
        
        for unit in volume_data.get("units", []):
            for lesson in unit.get("lessons", []):
                lesson_number = lesson.get("lesson_number")
                
                if lesson_number in lessons_with_sessions:
                    sessions_data = lessons_with_sessions[lesson_number]
                    
                    # Convert SessionData objects to dictionaries
                    sessions_list = []
                    for session in sessions_data:
                        session_dict = {
                            "session_number": session.session_number,
                            "session_type": session.session_type,
                            "title": session.title,
                            "start_page": session.start_page,
                            "end_page": session.end_page,
                            "page_span": session.page_span,
                            "content_focus": session.content_focus,
                            "activities": session.activities,
                            "inferred_type": session.inferred_type,
                            "estimated_duration": "50 minutes"  # Standard class period
                        }
                        sessions_list.append(session_dict)
                    
                    # Add sessions to lesson
                    lesson["sessions"] = sessions_list
                    lesson["total_sessions"] = len(sessions_list)
                    lesson["session_validation"] = {
                        "complete": len(sessions_list) == 5,
                        "missing_sessions": [i for i in range(1, 6) if i not in [s.session_number for s in sessions_data]],
                        "sequence_valid": sessions_list == sorted(sessions_list, key=lambda s: s["session_number"])
                    }
                    
                    logger.debug(f"Added {len(sessions_list)} sessions to Lesson {lesson_number}")
                else:
                    logger.warning(f"No sessions found for Lesson {lesson_number}")
    
    def extract_all_grades_with_sessions(self) -> Dict[str, str]:
        """Extract enhanced structures for all available grades"""
        
        extractions = {}
        grade_configs = [
            (6, "V1"), (6, "V2"),
            (7, "V1"), (7, "V2"), 
            (8, "V1"), (8, "V2"),
            (9, "V1"), (9, "V2")  # Algebra 1
        ]
        
        for grade, volume in grade_configs:
            try:
                # Check if base structure exists
                grade_name = "ALGEBRA1" if grade == 9 else f"GRADE{grade}"
                base_path = f"{grade_name}_COMPLETE_CURRICULUM_STRUCTURE.json"
                
                # Create enhanced structure
                enhanced_structure = self.create_enhanced_curriculum_structure(
                    grade=grade,
                    volume=volume,
                    base_structure_path=base_path if Path(base_path).exists() else None
                )
                
                # Generate output filename
                output_filename = f"{grade_name}_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_{volume}.json"
                
                # Write enhanced structure
                with open(output_filename, 'w', encoding='utf-8') as f:
                    json.dump(enhanced_structure, f, indent=2, ensure_ascii=False)
                
                extractions[f"Grade {grade} {volume}"] = output_filename
                logger.info(f"Created enhanced structure: {output_filename}")
                
            except Exception as e:
                logger.error(f"Failed to extract Grade {grade} {volume}: {e}")
                extractions[f"Grade {grade} {volume}"] = f"FAILED: {e}"
        
        return extractions


def main():
    """Main extraction function"""
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    
    print("=== ENHANCED CURRICULUM EXTRACTION ENGINE ===")
    print("Phase 2: Enhanced Extraction Engine Development")
    print()
    
    extractor = EnhancedCurriculumExtractor()
    
    # Test with Grade 8 Volume 1 first
    print("Testing enhanced extraction on Grade 8 Volume 1...")
    
    try:
        enhanced_structure = extractor.create_enhanced_curriculum_structure(
            grade=8,
            volume="V1",
            base_structure_path="GRADE8_COMPLETE_CURRICULUM_STRUCTURE.json"
        )
        
        # Save test result
        output_path = "GRADE8_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS_V1.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(enhanced_structure, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Test successful! Enhanced structure saved to: {output_path}")
        
        # Show some statistics
        metadata = enhanced_structure.get("session_extraction_metadata", {})
        print(f"📊 Extraction Statistics:")
        print(f"   - Lessons with sessions: {metadata.get('lessons_with_sessions', 0)}")
        print(f"   - Total sessions extracted: {metadata.get('total_sessions_extracted', 0)}")
        
        # Show sample session data
        volume_data = enhanced_structure.get("volumes", {}).get("Volume 1", {})
        if volume_data and volume_data.get("units"):
            first_unit = volume_data["units"][0]
            if first_unit.get("lessons") and first_unit["lessons"][0].get("sessions"):
                sample_lesson = first_unit["lessons"][0]
                print(f"📝 Sample Lesson: {sample_lesson.get('title', 'Unknown')}")
                print(f"   - Sessions: {sample_lesson.get('total_sessions', 0)}")
                for session in sample_lesson.get("sessions", [])[:3]:  # Show first 3 sessions
                    print(f"     • Session {session['session_number']}: {session['session_type']} - {session['title'][:50]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False


if __name__ == "__main__":
    success = main()
    
    if success:
        print("\n🎉 Phase 2 Development Complete!")
        print("✅ Session extraction engine successfully integrated")
        print("✅ Enhanced curriculum structure generated")
        print("🚀 Ready to proceed to Phase 3: Data Extraction & Validation")
    else:
        print("\n❌ Phase 2 Development Failed")
        print("🔧 Check logs and fix issues before proceeding")
