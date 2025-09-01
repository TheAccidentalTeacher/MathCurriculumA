#!/usr/bin/env python3
"""
COMPREHENSIVE CURRICULUM EXTRACTION ENGINE
Systematic extraction of Ready Classroom Mathematics curriculum data
"""

import pymupdf  # PyMuPDF
import sqlite3
import json
import re
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass
from datetime import datetime

@dataclass
class ExtractedUnit:
    """Structured unit data"""
    unit_number: str
    title: str
    theme: str
    page_start: int
    page_end: int
    lessons: List['ExtractedLesson']
    standards: List[str]

@dataclass
class ExtractedLesson:
    """Structured lesson data"""
    lesson_number: str
    title: str
    unit_number: str
    standards: List[str]
    focus_type: str  # "major", "supporting", "additional"
    instructional_days: int
    page_start: int
    page_end: int
    sessions: List['ExtractedSession']
    overview: str

@dataclass
class ExtractedSession:
    """Structured session data"""
    session_number: str
    title: str
    session_type: str  # "explore", "develop", "refine"
    content: str
    page_start: int
    page_end: int
    activities: List['ExtractedActivity']
    problems: List[str]

@dataclass
class ExtractedActivity:
    """Structured activity data"""
    activity_type: str  # "try_it", "develop", "solution", "math_toolkit"
    title: str
    content: str
    instructions: str

class CurriculumExtractionEngine:
    """Comprehensive extraction engine for RCM curriculum"""
    
    def __init__(self, db_path: str = "curriculum_master.db"):
        self.db_path = db_path
        self.pdf_dir = Path("PDF files")
        self.output_dir = Path("extracted_curriculum")
        self.output_dir.mkdir(exist_ok=True)
        
        # Regex patterns for curriculum structure
        self.patterns = {
            'unit_header': re.compile(r'^UNIT\s+([A-Z])\s*(.+?)(?=\s*©|\s*LESSON|\s*$)', re.MULTILINE | re.IGNORECASE),
            'lesson_header': re.compile(r'^LESSON\s+(\d+)\s*(.+?)(?=\s*©|\s*SESSION|\s*$)', re.MULTILINE | re.IGNORECASE),
            'session_header': re.compile(r'^SESSION\s+(\d+)\s*(.+?)(?=\s*©|\s*Try It|\s*$)', re.MULTILINE | re.IGNORECASE),
            'standards': re.compile(r'\b(\d+\.(?:RP|NS|EE|G|SP|F|A)\.(?:[A-C]\.)?[1-9]\d*)\b'),
            'focus_indicators': re.compile(r'\b(major work|supporting|additional)\b', re.IGNORECASE),
            'instructional_days': re.compile(r'(\d+)\s*(?:instructional\s+)?day(?:s)?', re.IGNORECASE),
            'session_types': re.compile(r'\b(explore|develop|refine)\b', re.IGNORECASE),
            'activity_markers': re.compile(r'\b(Try It|Develop|Solution|Math Toolkit)\b', re.IGNORECASE)
        }
        
        self.init_database()
    
    def init_database(self):
        """Initialize the comprehensive database schema"""
        self.conn = sqlite3.connect(self.db_path)
        
        # Create optimized schema for GPT-5 integration
        schema_sql = """
        -- Documents table
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            grade INTEGER NOT NULL,
            volume TEXT NOT NULL,  -- V1 or V2
            subject TEXT DEFAULT 'Mathematics',
            publisher TEXT DEFAULT 'Ready Classroom Mathematics',
            total_pages INTEGER,
            extraction_date TEXT NOT NULL,
            raw_text_length INTEGER,
            metadata TEXT  -- JSON
        );
        
        -- Units table
        CREATE TABLE IF NOT EXISTS units (
            id INTEGER PRIMARY KEY,
            document_id INTEGER NOT NULL,
            unit_number TEXT NOT NULL,  -- A, B, C, etc.
            title TEXT NOT NULL,
            theme TEXT,
            page_start INTEGER,
            page_end INTEGER,
            standards TEXT,  -- JSON array
            order_index INTEGER DEFAULT 0,
            FOREIGN KEY (document_id) REFERENCES documents (id)
        );
        
        -- Lessons table  
        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY,
            unit_id INTEGER NOT NULL,
            lesson_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            standards TEXT NOT NULL,  -- JSON array
            focus_type TEXT CHECK (focus_type IN ('major', 'supporting', 'additional')),
            instructional_days INTEGER DEFAULT 2,
            page_start INTEGER,
            page_end INTEGER,
            overview TEXT,
            prerequisites TEXT,  -- JSON array
            order_index INTEGER DEFAULT 0,
            FOREIGN KEY (unit_id) REFERENCES units (id)
        );
        
        -- Sessions table
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY,
            lesson_id INTEGER NOT NULL,
            session_number INTEGER NOT NULL,
            title TEXT,
            session_type TEXT CHECK (session_type IN ('explore', 'develop', 'refine')),
            content TEXT NOT NULL,
            page_start INTEGER,
            page_end INTEGER,
            learning_objectives TEXT,  -- JSON array
            key_concepts TEXT,  -- JSON array
            order_index INTEGER DEFAULT 0,
            FOREIGN KEY (lesson_id) REFERENCES lessons (id)
        );
        
        -- Activities table
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY,
            session_id INTEGER NOT NULL,
            activity_type TEXT NOT NULL,
            title TEXT,
            content TEXT NOT NULL,
            instructions TEXT,
            order_index INTEGER DEFAULT 0,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        );
        
        -- Problems table
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY,
            session_id INTEGER NOT NULL,
            problem_number TEXT,
            content TEXT NOT NULL,
            solution TEXT,
            difficulty TEXT,
            problem_type TEXT,
            order_index INTEGER DEFAULT 0,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        );
        
        -- Standards reference table
        CREATE TABLE IF NOT EXISTS standards (
            id INTEGER PRIMARY KEY,
            standard_code TEXT UNIQUE NOT NULL,  -- 7.RP.A.1
            grade INTEGER NOT NULL,
            domain TEXT NOT NULL,  -- RP, NS, EE, etc.
            cluster TEXT,  -- A, B, C
            standard_number INTEGER NOT NULL,
            description TEXT,
            focus_type TEXT CHECK (focus_type IN ('major', 'supporting', 'additional')),
            prerequisites TEXT  -- JSON array
        );
        
        -- GPT-5 optimized lesson summary table
        CREATE TABLE IF NOT EXISTS lesson_summaries (
            lesson_id INTEGER PRIMARY KEY,
            grade INTEGER NOT NULL,
            unit_title TEXT NOT NULL,
            lesson_title TEXT NOT NULL,
            standards_list TEXT NOT NULL,  -- Comma-separated
            focus_type TEXT NOT NULL,
            instructional_days INTEGER NOT NULL,
            learning_objectives TEXT NOT NULL,  -- JSON array
            key_concepts TEXT NOT NULL,  -- JSON array
            prerequisite_skills TEXT NOT NULL,  -- JSON array
            assessment_indicators TEXT NOT NULL,  -- JSON array
            session_summary TEXT NOT NULL,  -- Brief description of 3 sessions
            gpt_context TEXT NOT NULL,  -- Formatted text for GPT-5
            FOREIGN KEY (lesson_id) REFERENCES lessons (id)
        );
        
        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_lessons_unit ON lessons(unit_id);
        CREATE INDEX IF NOT EXISTS idx_sessions_lesson ON sessions(lesson_id);
        CREATE INDEX IF NOT EXISTS idx_activities_session ON activities(session_id);
        CREATE INDEX IF NOT EXISTS idx_problems_session ON problems(session_id);
        CREATE INDEX IF NOT EXISTS idx_standards_grade ON standards(grade);
        """
        
        self.conn.executescript(schema_sql)
        self.conn.commit()
        print("✅ Database schema initialized")
    
    def extract_all_pdfs(self):
        """Extract all PDF files systematically"""
        pdf_files = list(self.pdf_dir.glob("*.pdf"))
        
        print(f"🎯 Found {len(pdf_files)} PDF files to process")
        
        results = {}
        for pdf_file in sorted(pdf_files):
            print(f"\n📖 Processing {pdf_file.name}...")
            try:
                result = self.extract_single_pdf(pdf_file)
                results[pdf_file.name] = result
                print(f"✅ Successfully extracted {pdf_file.name}")
            except Exception as e:
                print(f"❌ Error processing {pdf_file.name}: {str(e)}")
                results[pdf_file.name] = {"error": str(e)}
        
        # Export comprehensive report
        self.export_extraction_report(results)
        return results
    
    def extract_single_pdf(self, pdf_path: Path) -> Dict[str, Any]:
        """Extract structured data from a single PDF"""
        
        # Parse filename for metadata
        filename = pdf_path.name
        grade_match = re.search(r'RCM(\d+)', filename)
        volume_match = re.search(r'V(\d+)', filename)
        
        if not grade_match or not volume_match:
            raise ValueError(f"Cannot parse grade/volume from filename: {filename}")
        
        grade = int(grade_match.group(1))
        volume = f"V{volume_match.group(1)}"
        
        # Open PDF
        doc = pymupdf.open(pdf_path)
        total_pages = len(doc)
        
        print(f"   📄 {total_pages} pages, Grade {grade}, {volume}")
        
        # Extract all text with page numbers
        page_texts = {}
        full_text = ""
        
        for page_num in range(total_pages):
            page = doc[page_num]
            text = page.get_text()
            page_texts[page_num + 1] = text  # 1-indexed pages
            full_text += f"\n--- PAGE {page_num + 1} ---\n{text}\n"
        
        doc.close()
        
        # Insert document record
        doc_id = self.insert_document(filename, f"Ready Classroom Mathematics Grade {grade} {volume}", 
                                    grade, volume, total_pages, len(full_text))
        
        # Extract structured content
        units = self.extract_units_from_text(full_text, page_texts, doc_id)
        
        # Generate lesson summaries for GPT-5
        self.generate_lesson_summaries(doc_id)
        
        return {
            "document_id": doc_id,
            "grade": grade,
            "volume": volume,
            "total_pages": total_pages,
            "text_length": len(full_text),
            "units_extracted": len(units),
            "lessons_extracted": sum(len(unit.lessons) for unit in units)
        }
    
    def extract_units_from_text(self, full_text: str, page_texts: Dict[int, str], doc_id: int) -> List[ExtractedUnit]:
        """Extract unit structure from text"""
        units = []
        
        # Find unit boundaries
        unit_matches = list(self.patterns['unit_header'].finditer(full_text))
        
        if not unit_matches:
            print("   ⚠️  No clear unit structure found, treating as single unit")
            # Create a default unit structure
            lessons = self.extract_lessons_from_text(full_text, page_texts)
            if lessons:
                unit = ExtractedUnit("1", "Mathematics Content", "General", 1, len(page_texts), lessons, [])
                unit_id = self.insert_unit(doc_id, unit)
                for lesson in lessons:
                    self.insert_lesson_with_sessions(unit_id, lesson)
                units.append(unit)
            return units
        
        for i, unit_match in enumerate(unit_matches):
            unit_number = unit_match.group(1)
            unit_title = unit_match.group(2).strip()
            
            # Determine unit text boundaries
            start_pos = unit_match.start()
            end_pos = unit_matches[i + 1].start() if i + 1 < len(unit_matches) else len(full_text)
            
            unit_text = full_text[start_pos:end_pos]
            
            # Find page range for this unit
            page_start, page_end = self.find_page_range(start_pos, end_pos, full_text)
            
            # Extract lessons within this unit
            lessons = self.extract_lessons_from_text(unit_text, page_texts)
            
            # Extract unit-level standards
            standards = list(set(self.patterns['standards'].findall(unit_text)))
            
            unit = ExtractedUnit(unit_number, unit_title, "Theme", page_start, page_end, lessons, standards)
            
            # Insert into database
            unit_id = self.insert_unit(doc_id, unit)
            for lesson in lessons:
                self.insert_lesson_with_sessions(unit_id, lesson)
            
            units.append(unit)
            print(f"   📚 Unit {unit_number}: {unit_title} ({len(lessons)} lessons)")
        
        return units
    
    def extract_lessons_from_text(self, text: str, page_texts: Dict[int, str]) -> List[ExtractedLesson]:
        """Extract lesson structure from text"""
        lessons = []
        
        lesson_matches = list(self.patterns['lesson_header'].finditer(text))
        
        if not lesson_matches:
            return lessons
        
        for i, lesson_match in enumerate(lesson_matches):
            lesson_number = lesson_match.group(1)
            lesson_title = lesson_match.group(2).strip()
            
            # Get lesson text
            start_pos = lesson_match.start()
            end_pos = lesson_matches[i + 1].start() if i + 1 < len(lesson_matches) else len(text)
            lesson_text = text[start_pos:end_pos]
            
            # Extract lesson metadata
            standards = list(set(self.patterns['standards'].findall(lesson_text)))
            focus_match = self.patterns['focus_indicators'].search(lesson_text)
            focus_type = focus_match.group(1).lower().replace(' work', '') if focus_match else 'supporting'
            
            days_match = self.patterns['instructional_days'].search(lesson_text)
            instructional_days = int(days_match.group(1)) if days_match else 2
            
            # Find page range
            page_start, page_end = self.find_page_range(start_pos, end_pos, text)
            
            # Extract sessions
            sessions = self.extract_sessions_from_text(lesson_text, lesson_number)
            
            # Create overview from first 500 chars of lesson content
            overview = lesson_text[:500].replace('\n', ' ').strip()
            
            lesson = ExtractedLesson(
                lesson_number, lesson_title, "", standards, focus_type,
                instructional_days, page_start, page_end, sessions, overview
            )
            
            lessons.append(lesson)
        
        return lessons
    
    def extract_sessions_from_text(self, lesson_text: str, lesson_number: str) -> List[ExtractedSession]:
        """Extract session structure from lesson text"""
        sessions = []
        
        session_matches = list(self.patterns['session_header'].finditer(lesson_text))
        
        # If no explicit sessions found, create default structure
        if not session_matches:
            # Look for common session patterns
            if 'explore' in lesson_text.lower() or 'develop' in lesson_text.lower() or 'refine' in lesson_text.lower():
                # Create inferred sessions
                sessions.append(ExtractedSession("1", "Explore", "explore", lesson_text[:len(lesson_text)//3], 0, 0, [], []))
                sessions.append(ExtractedSession("2", "Develop", "develop", lesson_text[len(lesson_text)//3:2*len(lesson_text)//3], 0, 0, [], []))
                sessions.append(ExtractedSession("3", "Refine", "refine", lesson_text[2*len(lesson_text)//3:], 0, 0, [], []))
            else:
                # Single session
                sessions.append(ExtractedSession("1", "Main Session", "develop", lesson_text, 0, 0, [], []))
            return sessions
        
        for i, session_match in enumerate(session_matches):
            session_number = session_match.group(1)
            session_title = session_match.group(2).strip() if session_match.group(2) else ""
            
            start_pos = session_match.start()
            end_pos = session_matches[i + 1].start() if i + 1 < len(session_matches) else len(lesson_text)
            session_text = lesson_text[start_pos:end_pos]
            
            # Determine session type
            session_type = "develop"  # default
            type_match = self.patterns['session_types'].search(session_text)
            if type_match:
                session_type = type_match.group(1).lower()
            
            # Extract activities (simplified)
            activities = []
            activity_matches = list(self.patterns['activity_markers'].finditer(session_text))
            for activity_match in activity_matches:
                activity_type = activity_match.group(1).lower().replace(' ', '_')
                activities.append(ExtractedActivity(activity_type, activity_match.group(1), session_text[activity_match.start():activity_match.start()+200], ""))
            
            page_start, page_end = self.find_page_range(start_pos, end_pos, lesson_text)
            
            session = ExtractedSession(
                session_number, session_title, session_type, 
                session_text, page_start, page_end, activities, []
            )
            sessions.append(session)
        
        return sessions
    
    def find_page_range(self, start_pos: int, end_pos: int, full_text: str) -> Tuple[int, int]:
        """Find page range for a text section"""
        # Simple implementation - count PAGE markers
        pages_before_start = len(re.findall(r'--- PAGE (\d+) ---', full_text[:start_pos]))
        pages_before_end = len(re.findall(r'--- PAGE (\d+) ---', full_text[:end_pos]))
        
        return max(1, pages_before_start), max(1, pages_before_end)
    
    def insert_document(self, filename: str, title: str, grade: int, volume: str, total_pages: int, text_length: int) -> int:
        """Insert document record"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT OR REPLACE INTO documents 
            (filename, title, grade, volume, total_pages, extraction_date, raw_text_length)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (filename, title, grade, volume, total_pages, datetime.now().isoformat(), text_length))
        
        self.conn.commit()
        return cursor.lastrowid
    
    def insert_unit(self, doc_id: int, unit: ExtractedUnit) -> int:
        """Insert unit record"""
        cursor = self.conn.cursor()
        cursor.execute("""
            INSERT INTO units (document_id, unit_number, title, theme, page_start, page_end, standards)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (doc_id, unit.unit_number, unit.title, unit.theme, unit.page_start, unit.page_end, json.dumps(unit.standards)))
        
        self.conn.commit()
        return cursor.lastrowid
    
    def insert_lesson_with_sessions(self, unit_id: int, lesson: ExtractedLesson) -> int:
        """Insert lesson and all its sessions"""
        cursor = self.conn.cursor()
        
        # Insert lesson
        cursor.execute("""
            INSERT INTO lessons (unit_id, lesson_number, title, standards, focus_type, instructional_days, page_start, page_end, overview)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (unit_id, int(lesson.lesson_number), lesson.title, json.dumps(lesson.standards), 
              lesson.focus_type, lesson.instructional_days, lesson.page_start, lesson.page_end, lesson.overview))
        
        lesson_id = cursor.lastrowid
        
        # Insert sessions
        for session in lesson.sessions:
            cursor.execute("""
                INSERT INTO sessions (lesson_id, session_number, title, session_type, content, page_start, page_end)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (lesson_id, int(session.session_number), session.title, session.session_type, 
                  session.content, session.page_start, session.page_end))
            
            session_id = cursor.lastrowid
            
            # Insert activities
            for activity in session.activities:
                cursor.execute("""
                    INSERT INTO activities (session_id, activity_type, title, content, instructions)
                    VALUES (?, ?, ?, ?, ?)
                """, (session_id, activity.activity_type, activity.title, activity.content, activity.instructions))
        
        self.conn.commit()
        return lesson_id
    
    def generate_lesson_summaries(self, doc_id: int):
        """Generate GPT-5 optimized lesson summaries"""
        cursor = self.conn.cursor()
        
        # Get all lessons for this document
        cursor.execute("""
            SELECT l.id, l.lesson_number, l.title, l.standards, l.focus_type, l.instructional_days, l.overview,
                   u.title as unit_title, d.grade
            FROM lessons l
            JOIN units u ON l.unit_id = u.id
            JOIN documents d ON u.document_id = d.id
            WHERE d.id = ?
            ORDER BY u.order_index, l.lesson_number
        """, (doc_id,))
        
        lessons = cursor.fetchall()
        
        for lesson_row in lessons:
            lesson_id, lesson_num, title, standards_json, focus_type, days, overview, unit_title, grade = lesson_row
            
            standards = json.loads(standards_json) if standards_json else []
            
            # Get sessions for this lesson
            cursor.execute("""
                SELECT session_number, title, session_type, content
                FROM sessions
                WHERE lesson_id = ?
                ORDER BY session_number
            """, (lesson_id,))
            
            sessions = cursor.fetchall()
            
            # Create GPT-5 context
            gpt_context = self.create_gpt5_context(grade, unit_title, title, standards, focus_type, days, overview, sessions)
            
            # Insert lesson summary
            cursor.execute("""
                INSERT OR REPLACE INTO lesson_summaries 
                (lesson_id, grade, unit_title, lesson_title, standards_list, focus_type, 
                 instructional_days, learning_objectives, key_concepts, prerequisite_skills, 
                 assessment_indicators, session_summary, gpt_context)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                lesson_id, grade, unit_title, title, ', '.join(standards), focus_type, days,
                json.dumps(["To be extracted from content"]),  # Placeholder
                json.dumps(["To be extracted from content"]),  # Placeholder
                json.dumps(["To be extracted from content"]),  # Placeholder
                json.dumps(["To be extracted from content"]),  # Placeholder
                f"{len(sessions)} sessions: {', '.join([s[2] for s in sessions])}",
                gpt_context
            ))
        
        self.conn.commit()
    
    def create_gpt5_context(self, grade: int, unit_title: str, lesson_title: str, standards: List[str], 
                          focus_type: str, days: int, overview: str, sessions: List) -> str:
        """Create formatted context for GPT-5 analysis"""
        
        context = f"""# Grade {grade} Lesson: {lesson_title}

## Unit Context
**Unit**: {unit_title}
**Focus Type**: {focus_type.title()} Work
**Standards**: {', '.join(standards)}
**Instructional Days**: {days}

## Lesson Overview
{overview}

## Session Structure
"""
        
        for session in sessions:
            session_num, session_title, session_type, content = session
            context += f"""
### Session {session_num}: {session_title or session_type.title()}
**Type**: {session_type.title()}
**Content Preview**: {content[:200]}...
"""
        
        return context
    
    def export_extraction_report(self, results: Dict[str, Any]):
        """Export comprehensive extraction report"""
        report_path = self.output_dir / "extraction_report.json"
        
        # Add database statistics
        cursor = self.conn.cursor()
        
        stats = {}
        for table in ['documents', 'units', 'lessons', 'sessions', 'activities', 'lesson_summaries']:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            stats[table] = cursor.fetchone()[0]
        
        report = {
            "extraction_date": datetime.now().isoformat(),
            "files_processed": results,
            "database_statistics": stats,
            "gpt5_readiness": self.assess_gpt5_readiness()
        }
        
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n📊 Extraction report saved to {report_path}")
    
    def assess_gpt5_readiness(self) -> Dict[str, Any]:
        """Assess readiness for GPT-5 integration"""
        cursor = self.conn.cursor()
        
        # Count lessons with good structure
        cursor.execute("SELECT COUNT(*) FROM lessons WHERE LENGTH(overview) > 100")
        quality_lessons = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM lessons")
        total_lessons = cursor.fetchone()[0]
        
        # Count standards coverage
        cursor.execute("SELECT COUNT(DISTINCT JSON_EXTRACT(standards, '$[0]')) FROM lessons WHERE standards != '[]'")
        unique_standards = cursor.fetchone()[0]
        
        readiness_score = 0
        if total_lessons > 50:
            readiness_score += 30
        if quality_lessons / max(total_lessons, 1) > 0.8:
            readiness_score += 40
        if unique_standards > 20:
            readiness_score += 30
        
        return {
            "overall_score": readiness_score,
            "total_lessons": total_lessons,
            "quality_lessons": quality_lessons,
            "unique_standards": unique_standards,
            "recommendations": ["Complete extraction pipeline", "Validate standards mapping", "Generate enhanced summaries"]
        }
    
    def close(self):
        """Close database connection"""
        if hasattr(self, 'conn'):
            self.conn.close()

def main():
    """Main execution function"""
    print("🚀 Starting Comprehensive Curriculum Extraction")
    print("=" * 60)
    
    engine = CurriculumExtractionEngine()
    
    try:
        results = engine.extract_all_pdfs()
        print(f"\n✅ Extraction complete! Processed {len(results)} files")
        
        # Print summary
        print("\n📊 EXTRACTION SUMMARY")
        print("-" * 40)
        
        total_lessons = 0
        total_units = 0
        
        for filename, result in results.items():
            if "error" not in result:
                print(f"📖 {filename}:")
                print(f"   Grade {result['grade']}, {result['volume']}")
                print(f"   {result['units_extracted']} units, {result['lessons_extracted']} lessons")
                total_units += result['units_extracted']
                total_lessons += result['lessons_extracted']
            else:
                print(f"❌ {filename}: {result['error']}")
        
        print(f"\n🎯 TOTALS: {total_units} units, {total_lessons} lessons extracted")
        
    except Exception as e:
        print(f"❌ Fatal error: {str(e)}")
        raise
    finally:
        engine.close()

if __name__ == "__main__":
    main()
