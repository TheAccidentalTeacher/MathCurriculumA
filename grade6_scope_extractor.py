"""
Grade 6 Curriculum Scope & Sequence Extractor
Dynamic Pacing Guide Foundation System
"""

import json
import re
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional

@dataclass
class Session:
    session_number: int
    session_title: str
    standards: List[str]
    page_start: Optional[int] = None
    page_end: Optional[int] = None
    duration_minutes: Optional[int] = None
    session_type: str = "standard"  # standard, explore, develop, refine, apply

@dataclass  
class Lesson:
    lesson_number: int
    lesson_title: str
    sessions: List[Session]
    primary_standards: List[str]
    total_sessions: int
    estimated_days: Optional[int] = None
    
@dataclass
class Unit:
    unit_number: int
    unit_title: str
    lessons: List[Lesson]
    unit_standards: List[str]
    total_lessons: int
    estimated_weeks: Optional[int] = None

@dataclass
class CurriculumScope:
    grade: int
    volume: int
    units: List[Unit]
    total_units: int
    total_lessons: int
    total_sessions: int

class Grade6ScopeExtractor:
    def __init__(self):
        self.standards_pattern = r'6\.[A-Z]{1,3}\.[A-Z]?\.\d+'
        self.session_patterns = [
            r'Session\s+(\d+)',
            r'Explore\s+(.+)',
            r'Develop\s+(.+)', 
            r'Refine\s+(.+)',
            r'Apply\s+(.+)'
        ]
        
    def extract_standards(self, text: str) -> List[str]:
        """Extract Grade 6 standards from text"""
        matches = re.findall(self.standards_pattern, text)
        return list(set(matches))  # Remove duplicates
        
    def parse_lesson_structure(self, content_lines: List[str]) -> List[Unit]:
        """Parse table of contents into structured curriculum data"""
        units = []
        current_unit = None
        current_lesson = None
        
        for line in content_lines:
            line = line.strip()
            if not line:
                continue
                
            # Unit detection (usually starts with "UNIT" or number)
            if self._is_unit_header(line):
                if current_unit:
                    units.append(current_unit)
                current_unit = self._create_unit_from_line(line)
                
            # Lesson detection
            elif self._is_lesson_header(line):
                if current_lesson and current_unit:
                    current_unit.lessons.append(current_lesson)
                current_lesson = self._create_lesson_from_line(line)
                
            # Session detection
            elif self._is_session_header(line):
                if current_lesson:
                    session = self._create_session_from_line(line)
                    current_lesson.sessions.append(session)
                    
        # Add final items
        if current_lesson and current_unit:
            current_unit.lessons.append(current_lesson)
        if current_unit:
            units.append(current_unit)
            
        return units
    
    def _is_unit_header(self, line: str) -> bool:
        """Detect if line is a unit header"""
        unit_indicators = ['UNIT', 'Unit', 'MODULE', 'Module']
        return any(indicator in line for indicator in unit_indicators)
    
    def _is_lesson_header(self, line: str) -> bool:
        """Detect if line is a lesson header"""
        lesson_indicators = ['LESSON', 'Lesson', 'Chapter']
        return any(indicator in line for indicator in lesson_indicators)
    
    def _is_session_header(self, line: str) -> bool:
        """Detect if line is a session header"""
        session_indicators = ['Session', 'Explore', 'Develop', 'Refine', 'Apply']
        return any(indicator in line for indicator in session_indicators)
    
    def _create_unit_from_line(self, line: str) -> Unit:
        """Extract unit information from line"""
        # Parse unit number and title
        # Example: "UNIT 1: Area and Volume"
        match = re.search(r'UNIT\s+(\d+):\s*(.+)', line, re.IGNORECASE)
        if match:
            unit_num = int(match.group(1))
            unit_title = match.group(2).strip()
        else:
            unit_num = 1
            unit_title = line.strip()
            
        return Unit(
            unit_number=unit_num,
            unit_title=unit_title,
            lessons=[],
            unit_standards=[],
            total_lessons=0
        )
    
    def _create_lesson_from_line(self, line: str) -> Lesson:
        """Extract lesson information from line"""
        # Parse lesson number and title
        # Example: "LESSON 1: Find the Area of a Parallelogram"
        match = re.search(r'LESSON\s+(\d+):\s*(.+)', line, re.IGNORECASE)
        if match:
            lesson_num = int(match.group(1))
            lesson_title = match.group(2).strip()
        else:
            lesson_num = 1
            lesson_title = line.strip()
            
        return Lesson(
            lesson_number=lesson_num,
            lesson_title=lesson_title,
            sessions=[],
            primary_standards=self.extract_standards(line),
            total_sessions=0
        )
    
    def _create_session_from_line(self, line: str) -> Session:
        """Extract session information from line"""
        # Parse session details
        session_num = 1
        session_title = line.strip()
        session_type = "standard"
        
        # Check for specific session types
        if 'Explore' in line:
            session_type = "explore"
        elif 'Develop' in line:
            session_type = "develop"
        elif 'Refine' in line:
            session_type = "refine"
        elif 'Apply' in line:
            session_type = "apply"
            
        return Session(
            session_number=session_num,
            session_title=session_title,
            standards=self.extract_standards(line),
            session_type=session_type
        )
    
    def create_dynamic_pacing_guide(self, curriculum: CurriculumScope) -> Dict:
        """Create Dynamic Pacing Guide structure from curriculum scope"""
        pacing_guide = {
            "metadata": {
                "grade": curriculum.grade,
                "volume": curriculum.volume,
                "total_units": curriculum.total_units,
                "total_lessons": curriculum.total_lessons,
                "total_sessions": curriculum.total_sessions,
                "created_date": "2025-09-06"
            },
            "pacing_options": {
                "traditional": {"weeks_per_unit": 4, "days_per_week": 5},
                "accelerated": {"weeks_per_unit": 3, "days_per_week": 5},
                "intensive": {"weeks_per_unit": 2, "days_per_week": 6}
            },
            "units": []
        }
        
        for unit in curriculum.units:
            unit_pacing = {
                "unit_number": unit.unit_number,
                "unit_title": unit.unit_title,
                "standards_focus": unit.unit_standards,
                "lessons": [],
                "assessment_points": [],
                "differentiation_notes": []
            }
            
            for lesson in unit.lessons:
                lesson_pacing = {
                    "lesson_number": lesson.lesson_number,
                    "lesson_title": lesson.lesson_title,
                    "primary_standards": lesson.primary_standards,
                    "sessions": [],
                    "estimated_days": lesson.estimated_days or len(lesson.sessions),
                    "prerequisite_skills": [],
                    "learning_objectives": []
                }
                
                for session in lesson.sessions:
                    session_pacing = {
                        "session_number": session.session_number,
                        "session_title": session.session_title,
                        "session_type": session.session_type,
                        "standards": session.standards,
                        "duration_minutes": session.duration_minutes or 45,
                        "materials_needed": [],
                        "key_activities": [],
                        "formative_assessments": []
                    }
                    lesson_pacing["sessions"].append(session_pacing)
                
                unit_pacing["lessons"].append(lesson_pacing)
            
            pacing_guide["units"].append(unit_pacing)
        
        return pacing_guide

# Example usage and template
def create_sample_grade6_structure():
    """Create sample structure based on typical Grade 6 curriculum"""
    sample_structure = {
        "instructions": [
            "Analyze each AVIF file (4.avif through 10.avif)",
            "Extract the hierarchical structure: Unit > Lesson > Session",
            "Identify all standards codes (6.XX.X.X format)",
            "Note page numbers and duration estimates",
            "Build complete curriculum database"
        ],
        "expected_units": [
            "Unit 1: Area and Volume",
            "Unit 2: Expressions and Equations", 
            "Unit 3: Ratios and Rates",
            "Unit 4: Decimals and Fractions",
            "Unit 5: Data and Statistics"
        ],
        "grade6_standards_domains": [
            "6.RP - Ratios and Proportional Relationships",
            "6.NS - The Number System",
            "6.EE - Expressions and Equations", 
            "6.G - Geometry",
            "6.SP - Statistics and Probability"
        ]
    }
    return sample_structure

if __name__ == "__main__":
    extractor = Grade6ScopeExtractor()
    sample = create_sample_grade6_structure()
    
    print("Grade 6 Curriculum Scope & Sequence Extractor Ready!")
    print("Next: Process AVIF files to extract table of contents data")
    print(json.dumps(sample, indent=2))
