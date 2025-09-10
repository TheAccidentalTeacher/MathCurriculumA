#!/usr/bin/env python3
"""
SESSION EXTRACTION MODULE
Dedicated module for extracting session-level curriculum data
Phase 2 Implementation of SESSION_EXTRACTION_ENHANCEMENT_PLAN.md
"""

import re
import json
from typing import Dict, List, Tuple, Optional, NamedTuple, Any
from dataclasses import dataclass
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class SessionData:
    """Enhanced session data structure"""
    lesson_number: int
    session_number: int
    session_type: str  # "Explore", "Develop", "Refine"
    title: str
    start_page: int
    end_page: int
    content_focus: str
    activities: List[str]
    inferred_type: bool  # True if session type was inferred
    page_span: int  # Number of pages in session
    
class SessionExtractionEngine:
    """Enhanced session extraction engine using Phase 1 analysis patterns"""
    
    def __init__(self):
        """Initialize with patterns from Phase 1 analysis"""
        
        # Core session identification patterns (from extraction_rules.md)
        self.session_patterns = {
            'primary_marker': re.compile(
                r'LESSON\s+(\d+)\s*\|\s*SESSION\s+(\d+)(?:\s+(Explore|Develop|Refine))?',
                re.IGNORECASE
            ),
            'lesson_title': re.compile(
                r'LESSON\s+(\d+)\s+([^|]+?)(?:\s*LESSON\s+\d+\s*\|\s*SESSION|$)',
                re.IGNORECASE
            ),
            'session_with_content': re.compile(
                r'LESSON\s+(\d+)\s*\|\s*SESSION\s+(\d+)\s+(.+?)(?=\s*➤|\s*LESSON|\s*$)',
                re.IGNORECASE | re.DOTALL
            )
        }
        
        # Edge case detection patterns (from edge_cases_inventory.md)
        self.edge_case_patterns = {
            'placeholder': re.compile(r'LESSON\s*#\s*\|\s*SESSION\s*#', re.IGNORECASE),
            'math_in_action': re.compile(r'Math\s+in\s+Action', re.IGNORECASE),
            'assessment': re.compile(r'\b(assessment|test|checkpoint|quiz)\b', re.IGNORECASE)
        }
        
        # Session type inference rules (from extraction_rules.md)
        self.type_inference_rules = {
            1: "Explore",
            2: "Develop", 
            3: "Develop",
            4: "Develop",
            5: "Refine"
        }
        
        # Quality metrics tracking
        self.extraction_stats = {
            'total_sessions_found': 0,
            'sessions_with_explicit_type': 0,
            'sessions_with_inferred_type': 0,
            'placeholder_sessions_skipped': 0,
            'math_in_action_lessons': 0,
            'validation_errors': []
        }
    
    def extract_sessions_from_document(self, document_json_path: str) -> Dict[int, List[SessionData]]:
        """
        Extract all sessions from a curriculum document JSON file
        
        Args:
            document_json_path: Path to webapp_pages/.../data/document.json
            
        Returns:
            Dictionary mapping lesson_number -> list of SessionData objects
        """
        logger.info(f"Starting session extraction from: {document_json_path}")
        
        try:
            with open(document_json_path, 'r', encoding='utf-8') as f:
                document_data = json.load(f)
        except Exception as e:
            logger.error(f"Failed to load document JSON: {e}")
            return {}
        
        # Extract sessions from all pages
        all_sessions = []
        for page_data in document_data.get('pages', []):
            page_number = page_data.get('page_number', 0)
            text_preview = page_data.get('text_preview', '')
            
            # Find session markers in this page
            sessions_on_page = self._extract_sessions_from_text(text_preview, page_number)
            all_sessions.extend(sessions_on_page)
        
        # Group sessions by lesson and calculate page ranges
        lessons_with_sessions = self._group_sessions_by_lesson(all_sessions)
        
        # Calculate page ranges for each session
        lessons_with_sessions = self._calculate_session_page_ranges(lessons_with_sessions)
        
        # Validate session completeness
        validation_results = self._validate_session_completeness(lessons_with_sessions)
        
        logger.info(f"Extraction complete. Found sessions for {len(lessons_with_sessions)} lessons")
        self._log_extraction_stats()
        
        return lessons_with_sessions
    
    def _extract_sessions_from_text(self, text: str, page_number: int) -> List[SessionData]:
        """Extract session markers from text content"""
        sessions = []
        
        # Check for placeholder patterns first (skip these)
        if self.edge_case_patterns['placeholder'].search(text):
            self.extraction_stats['placeholder_sessions_skipped'] += 1
            logger.debug(f"Skipping placeholder session on page {page_number}")
            return sessions
        
        # Look for primary session markers
        for match in self.session_patterns['primary_marker'].finditer(text):
            lesson_num = int(match.group(1))
            session_num = int(match.group(2))
            explicit_type = match.group(3)
            
            # Extract session title/content after the marker
            remaining_text = text[match.end():].strip()
            session_title = self._extract_session_title(remaining_text)
            
            # Determine session type (explicit or inferred)
            if explicit_type:
                session_type = explicit_type.title()
                inferred = False
                self.extraction_stats['sessions_with_explicit_type'] += 1
            else:
                session_type = self.type_inference_rules.get(session_num, "Unknown")
                inferred = True
                self.extraction_stats['sessions_with_inferred_type'] += 1
            
            # Create session data object
            session = SessionData(
                lesson_number=lesson_num,
                session_number=session_num,
                session_type=session_type,
                title=session_title,
                start_page=page_number,
                end_page=page_number,  # Will be calculated later
                content_focus=self._determine_content_focus(remaining_text, session_type),
                activities=self._extract_activities(remaining_text),
                inferred_type=inferred,
                page_span=1  # Will be calculated later
            )
            
            sessions.append(session)
            self.extraction_stats['total_sessions_found'] += 1
            
            logger.debug(f"Found session: L{lesson_num}S{session_num} '{session_title}' on page {page_number}")
        
        return sessions
    
    def _extract_session_title(self, text: str) -> str:
        """Extract session title from text following session marker"""
        # Clean up common formatting symbols
        text = re.sub(r'[➤→▶]', '', text).strip()
        
        # Take first meaningful line/phrase
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if len(line) > 3 and not line.startswith('©'):
                # Truncate if too long
                if len(line) > 80:
                    line = line[:77] + "..."
                return line
        
        return "Session Content"  # Fallback title
    
    def _determine_content_focus(self, text: str, session_type: str) -> str:
        """Determine the content focus based on session type and text content"""
        focus_map = {
            "Explore": "Prior knowledge activation, concept introduction",
            "Develop": "Skill building and practice",
            "Refine": "Fluency practice and extension"
        }
        
        # Check for specific content indicators
        if self.edge_case_patterns['assessment'].search(text):
            return "Assessment and evaluation"
        
        return focus_map.get(session_type, "General lesson content")
    
    def _extract_activities(self, text: str) -> List[str]:
        """Extract activity types from session text"""
        activities = []
        
        # Common activity patterns
        activity_patterns = [
            r'Try It',
            r'Guided Practice',
            r'Independent Practice', 
            r'Problem Solving',
            r'Math Toolkit',
            r'Reflection',
            r'Assessment'
        ]
        
        for pattern in activity_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                activities.append(pattern)
        
        return activities if activities else ["Instructional Activity"]
    
    def _group_sessions_by_lesson(self, sessions: List[SessionData]) -> Dict[int, List[SessionData]]:
        """Group sessions by lesson number and deduplicate"""
        lessons = {}
        
        for session in sessions:
            lesson_num = session.lesson_number
            if lesson_num not in lessons:
                lessons[lesson_num] = {}
            
            # Use lesson_num + session_num as unique key to deduplicate
            session_key = (lesson_num, session.session_number)
            
            # Keep the session with the best title (longest/most descriptive)
            if session_key not in lessons[lesson_num]:
                lessons[lesson_num][session_key] = session
            else:
                existing = lessons[lesson_num][session_key]
                # Keep the session with the better title
                if len(session.title) > len(existing.title) and session.title != "Session Content":
                    lessons[lesson_num][session_key] = session
        
        # Convert back to list format and sort
        result = {}
        for lesson_num, session_dict in lessons.items():
            session_list = list(session_dict.values())
            session_list.sort(key=lambda s: s.session_number)
            result[lesson_num] = session_list
        
        return result
    
    def _calculate_session_page_ranges(self, lessons: Dict[int, List[SessionData]]) -> Dict[int, List[SessionData]]:
        """Calculate end pages for each session based on next session start"""
        
        for lesson_num, sessions in lessons.items():
            for i, session in enumerate(sessions):
                if i < len(sessions) - 1:
                    # End page is one before next session starts
                    next_session = sessions[i + 1]
                    session.end_page = next_session.start_page - 1
                else:
                    # Last session in lesson - estimate based on typical session length
                    session.end_page = session.start_page + 3  # Typical session is 2-4 pages
                
                # Calculate page span
                session.page_span = session.end_page - session.start_page + 1
                
                # Validate reasonable page span
                if session.page_span < 1:
                    session.page_span = 1
                    session.end_page = session.start_page
                elif session.page_span > 8:  # Flag unusually long sessions
                    logger.warning(f"Unusually long session: L{session.lesson_number}S{session.session_number} spans {session.page_span} pages")
        
        return lessons
    
    def _validate_session_completeness(self, lessons: Dict[int, List[SessionData]]) -> Dict[str, Any]:
        """Validate session completeness and sequence"""
        validation_results = {
            'complete_lessons': 0,
            'incomplete_lessons': 0,
            'lessons_with_errors': [],
            'total_lessons': len(lessons)
        }
        
        for lesson_num, sessions in lessons.items():
            session_numbers = [s.session_number for s in sessions]
            expected_sessions = list(range(1, 6))  # [1, 2, 3, 4, 5]
            
            missing_sessions = set(expected_sessions) - set(session_numbers)
            extra_sessions = set(session_numbers) - set(expected_sessions)
            
            if not missing_sessions and not extra_sessions:
                validation_results['complete_lessons'] += 1
            else:
                validation_results['incomplete_lessons'] += 1
                error_info = {
                    'lesson_number': lesson_num,
                    'found_sessions': session_numbers,
                    'missing_sessions': list(missing_sessions),
                    'extra_sessions': list(extra_sessions)
                }
                validation_results['lessons_with_errors'].append(error_info)
                self.extraction_stats['validation_errors'].append(error_info)
        
        logger.info(f"Validation: {validation_results['complete_lessons']}/{validation_results['total_lessons']} lessons have complete sessions")
        
        return validation_results
    
    def _log_extraction_stats(self):
        """Log extraction statistics"""
        stats = self.extraction_stats
        logger.info("=== SESSION EXTRACTION STATISTICS ===")
        logger.info(f"Total sessions found: {stats['total_sessions_found']}")
        logger.info(f"Sessions with explicit type: {stats['sessions_with_explicit_type']}")
        logger.info(f"Sessions with inferred type: {stats['sessions_with_inferred_type']}")
        logger.info(f"Placeholder sessions skipped: {stats['placeholder_sessions_skipped']}")
        
        if stats['sessions_with_explicit_type'] > 0:
            explicit_rate = (stats['sessions_with_explicit_type'] / stats['total_sessions_found']) * 100
            logger.info(f"Explicit type rate: {explicit_rate:.1f}%")
        
        if stats['validation_errors']:
            logger.warning(f"Found {len(stats['validation_errors'])} lessons with session validation errors")
    
    def export_sessions_to_json(self, lessons: Dict[int, List[SessionData]], output_path: str):
        """Export extracted sessions to JSON format"""
        
        # Convert SessionData objects to dictionaries
        export_data = {
            "extraction_metadata": {
                "extraction_date": str(datetime.now()),
                "extraction_engine": "SessionExtractionEngine v1.0",
                "total_lessons": len(lessons),
                "total_sessions": sum(len(sessions) for sessions in lessons.values()),
                "extraction_stats": self.extraction_stats
            },
            "lessons_with_sessions": {}
        }
        
        for lesson_num, sessions in lessons.items():
            export_data["lessons_with_sessions"][str(lesson_num)] = [
                {
                    "lesson_number": s.lesson_number,
                    "session_number": s.session_number,
                    "session_type": s.session_type,
                    "title": s.title,
                    "start_page": s.start_page,
                    "end_page": s.end_page,
                    "page_span": s.page_span,
                    "content_focus": s.content_focus,
                    "activities": s.activities,
                    "inferred_type": s.inferred_type
                }
                for s in sessions
            ]
        
        # Write to JSON file
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Sessions exported to: {output_path}")


# Test and validation functions
def test_session_extraction():
    """Test session extraction on Grade 8 Volume 1"""
    engine = SessionExtractionEngine()
    
    # Test with Grade 8 Volume 1 (known good data)
    test_doc_path = "webapp_pages/RCM08_NA_SW_V1/data/document.json"
    
    if Path(test_doc_path).exists():
        logger.info("Testing session extraction on Grade 8 Volume 1...")
        lessons_with_sessions = engine.extract_sessions_from_document(test_doc_path)
        
        # Export test results
        output_path = "test_session_extraction_grade8_v1.json"
        engine.export_sessions_to_json(lessons_with_sessions, output_path)
        
        return lessons_with_sessions
    else:
        logger.error(f"Test document not found: {test_doc_path}")
        return {}


if __name__ == "__main__":
    # Run test extraction
    from datetime import datetime
    
    print("=== SESSION EXTRACTION ENGINE TEST ===")
    print(f"Starting test at: {datetime.now()}")
    
    results = test_session_extraction()
    
    if results:
        print(f"\nTest completed successfully!")
        print(f"Found sessions for {len(results)} lessons")
        
        # Show sample results
        for lesson_num in sorted(list(results.keys())[:3]):  # Show first 3 lessons
            sessions = results[lesson_num]
            print(f"\nLesson {lesson_num}: {len(sessions)} sessions")
            for session in sessions:
                print(f"  Session {session.session_number}: {session.session_type} - {session.title[:50]}...")
    else:
        print("Test failed - no results generated")
