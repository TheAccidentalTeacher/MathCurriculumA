#!/usr/bin/env python3
"""
PRECISE LESSON EXTRACTION ENGINE
Focused extraction of actual curriculum lesson content
"""

import pymupdf  # PyMuPDF
import sqlite3
import json
import re
import os
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

class PreciseLessonExtractor:
    """Precise extraction focused on actual lesson pages"""
    
    def __init__(self, db_path: str = "curriculum_precise.db"):
        self.db_path = db_path
        self.pdf_dir = Path("PDF files")
        self.output_dir = Path("extracted_curriculum_precise")
        self.output_dir.mkdir(exist_ok=True)
        
        # More precise patterns for actual lesson pages
        self.patterns = {
            # Lesson headers on actual lesson pages (not TOC)
            'lesson_page_header': re.compile(r'©Curriculum Associates.*?LESSON\s+(\d+)\s+(.+?)(?=\s*\d+\s*$)', re.MULTILINE | re.DOTALL),
            
            # Session headers within lessons
            'session_header': re.compile(r'SESSION\s+(\d+)\s+(.+?)(?=\n|\r|$)', re.MULTILINE),
            
            # Standards on lesson pages
            'standards_on_page': re.compile(r'(\d+\.(?:RP|NS|EE|G|SP|F|A)\.(?:[A-C]\.)?[1-9]\d*)\b'),
            
            # Major work indicators
            'major_work_indicators': re.compile(r'\bmajor work\b', re.IGNORECASE),
            
            # Session types
            'session_type': re.compile(r'\b(Explore|Develop|Refine)\b', re.IGNORECASE),
            
            # Try It activities
            'try_it': re.compile(r'Try It\s*(.*?)(?=\n\n|\r\r|$)', re.MULTILINE | re.DOTALL),
            
            # Problem numbers
            'problems': re.compile(r'^\s*(\d+)\s+(.+?)(?=\n\s*\d+\s|\n\s*$)', re.MULTILINE),
            
            # Page numbers (to identify actual content pages vs TOC)
            'page_numbers': re.compile(r'\b(\d+)\s*$', re.MULTILINE)
        }
        
        self.init_database()
    
    def init_database(self):
        """Initialize precise database schema"""
        self.conn = sqlite3.connect(self.db_path)
        
        schema_sql = """
        -- Core lesson structure
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY,
            filename TEXT UNIQUE NOT NULL,
            grade INTEGER NOT NULL,
            volume TEXT NOT NULL,
            total_pages INTEGER,
            extraction_date TEXT,
            extraction_quality_score REAL
        );
        
        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY,
            document_id INTEGER NOT NULL,
            lesson_number INTEGER NOT NULL,
            title TEXT NOT NULL,
            unit_theme TEXT,
            start_page INTEGER,
            end_page INTEGER,
            standards TEXT,  -- JSON
            is_major_work BOOLEAN DEFAULT 0,
            estimated_days INTEGER DEFAULT 2,
            content_quality_score REAL,
            FOREIGN KEY (document_id) REFERENCES documents (id)
        );
        
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY,
            lesson_id INTEGER NOT NULL,
            session_number INTEGER NOT NULL,
            title TEXT,
            session_type TEXT, -- explore, develop, refine
            content TEXT NOT NULL,
            start_page INTEGER,
            activities_count INTEGER DEFAULT 0,
            problems_count INTEGER DEFAULT 0,
            FOREIGN KEY (lesson_id) REFERENCES lessons (id)
        );
        
        CREATE TABLE IF NOT EXISTS activities (
            id INTEGER PRIMARY KEY,
            session_id INTEGER NOT NULL,
            activity_type TEXT, -- try_it, develop, solution
            content TEXT NOT NULL,
            page_number INTEGER,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        );
        
        CREATE TABLE IF NOT EXISTS problems (
            id INTEGER PRIMARY KEY,
            session_id INTEGER NOT NULL,
            problem_number INTEGER,
            problem_text TEXT NOT NULL,
            page_number INTEGER,
            FOREIGN KEY (session_id) REFERENCES sessions (id)
        );
        
        -- GPT-5 ready summary table
        CREATE TABLE IF NOT EXISTS lesson_summaries_gpt5 (
            lesson_id INTEGER PRIMARY KEY,
            grade INTEGER,
            lesson_number INTEGER,
            title TEXT,
            standards_list TEXT,
            session_count INTEGER,
            total_content_length INTEGER,
            gpt5_context TEXT,  -- Formatted markdown for GPT-5
            extraction_confidence REAL,
            FOREIGN KEY (lesson_id) REFERENCES lessons (id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_lessons_grade ON lessons(document_id, lesson_number);
        CREATE INDEX IF NOT EXISTS idx_sessions_lesson ON sessions(lesson_id, session_number);
        """
        
        self.conn.executescript(schema_sql)
        self.conn.commit()
        print("✅ Precise database schema initialized")
    
    def extract_all_pdfs(self):
        """Extract all PDFs with precise lesson focus"""
        pdf_files = list(self.pdf_dir.glob("*.pdf"))
        results = {}
        
        for pdf_file in sorted(pdf_files):
            print(f"\n🎯 Processing {pdf_file.name} with precise extraction...")
            try:
                result = self.extract_pdf_precisely(pdf_file)
                results[pdf_file.name] = result
            except Exception as e:
                print(f"❌ Error: {str(e)}")
                results[pdf_file.name] = {"error": str(e)}
        
        return results
    
    def extract_pdf_precisely(self, pdf_path: Path) -> Dict[str, Any]:
        """Extract with focus on actual lesson content pages"""
        
        # Parse metadata
        filename = pdf_path.name
        grade_match = re.search(r'RCM(\d+)', filename)
        volume_match = re.search(r'V(\d+)', filename)
        
        if not grade_match or not volume_match:
            raise ValueError(f"Cannot parse grade/volume from {filename}")
        
        grade = int(grade_match.group(1))
        volume = f"V{volume_match.group(1)}"
        
        # Open PDF
        doc = pymupdf.open(pdf_path)
        total_pages = len(doc)
        
        # Step 1: Identify lesson pages (not TOC, not appendices)
        lesson_pages = self.identify_lesson_pages(doc)
        print(f"   📖 Found {len(lesson_pages)} potential lesson pages out of {total_pages}")
        
        # Step 2: Extract lessons from identified pages
        lessons = self.extract_lessons_from_pages(doc, lesson_pages)
        print(f"   📚 Extracted {len(lessons)} lessons")
        
        doc.close()
        
        # Step 3: Store in database
        doc_id = self.store_document(filename, grade, volume, total_pages, len(lessons))
        
        for lesson in lessons:
            self.store_lesson(doc_id, lesson)
        
        # Step 4: Generate GPT-5 summaries
        self.generate_gpt5_summaries(doc_id)
        
        return {
            "document_id": doc_id,
            "grade": grade,
            "volume": volume,
            "lesson_pages": len(lesson_pages),
            "lessons_extracted": len(lessons),
            "quality_score": self.calculate_extraction_quality(lessons)
        }
    
    def identify_lesson_pages(self, doc) -> List[int]:
        """Identify pages that contain actual lesson content"""
        lesson_pages = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            
            # Skip if this looks like TOC, index, or front matter
            if self.is_toc_or_front_matter(text):
                continue
            
            # Look for lesson indicators
            if self.patterns['lesson_page_header'].search(text):
                lesson_pages.append(page_num)
                continue
            
            # Look for session indicators (might be continuation of lesson)
            if self.patterns['session_header'].search(text) and any(
                abs(page_num - lp) <= 10 for lp in lesson_pages[-5:]  # Within 10 pages of recent lesson
            ):
                lesson_pages.append(page_num)
        
        return lesson_pages
    
    def is_toc_or_front_matter(self, text: str) -> bool:
        """Check if page is table of contents or front matter"""
        
        # TOC indicators
        toc_indicators = [
            'table of contents',
            'contents',
            'opener . . . . . . . .',
            'review . . . . . . . .',
            '. . . . . . . . . . . .',  # Dotted lines common in TOC
            'unit a\n',
            'unit b\n',
            'unit c\n'
        ]
        
        text_lower = text.lower()
        
        # If it has many TOC indicators
        toc_count = sum(1 for indicator in toc_indicators if indicator in text_lower)
        if toc_count >= 2:
            return True
        
        # If it's mostly dots and page numbers (typical TOC format)
        dot_lines = len(re.findall(r'\.{5,}', text))
        if dot_lines > 3:
            return True
        
        # Front matter indicators
        front_matter = [
            'copyright',
            '©curriculum associates',
            'table of contents',
            'acknowledgments',
            'introduction'
        ]
        
        if any(indicator in text_lower for indicator in front_matter) and len(text) < 500:
            return True
        
        return False
    
    def extract_lessons_from_pages(self, doc, lesson_pages: List[int]) -> List[Dict[str, Any]]:
        """Extract lesson data from identified pages"""
        lessons = []
        current_lesson = None
        
        for page_num in lesson_pages:
            page = doc[page_num]
            text = page.get_text()
            
            # Check for new lesson
            lesson_match = self.patterns['lesson_page_header'].search(text)
            if lesson_match:
                # Save previous lesson if exists
                if current_lesson:
                    lessons.append(current_lesson)
                
                # Start new lesson
                lesson_number = int(lesson_match.group(1))
                title = lesson_match.group(2).strip()
                title = re.sub(r'©.*$', '', title).strip()  # Remove copyright text
                
                current_lesson = {
                    'lesson_number': lesson_number,
                    'title': title,
                    'start_page': page_num + 1,  # 1-indexed
                    'end_page': page_num + 1,
                    'content_pages': [text],
                    'sessions': [],
                    'standards': [],
                    'is_major_work': False
                }
                
                # Extract standards from this page
                standards = list(set(self.patterns['standards_on_page'].findall(text)))
                current_lesson['standards'].extend(standards)
                
                # Check for major work
                if self.patterns['major_work_indicators'].search(text):
                    current_lesson['is_major_work'] = True
                
                print(f"      📝 Lesson {lesson_number}: {title[:50]}...")
            
            elif current_lesson:
                # Add to current lesson
                current_lesson['end_page'] = page_num + 1
                current_lesson['content_pages'].append(text)
                
                # Look for more standards
                standards = list(set(self.patterns['standards_on_page'].findall(text)))
                current_lesson['standards'].extend(standards)
        
        # Don't forget the last lesson
        if current_lesson:
            lessons.append(current_lesson)
        
        # Process sessions for each lesson
        for lesson in lessons:
            lesson['sessions'] = self.extract_sessions_from_lesson(lesson)
            lesson['standards'] = list(set(lesson['standards']))  # Remove duplicates
        
        return lessons
    
    def extract_sessions_from_lesson(self, lesson: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract sessions from lesson content"""
        sessions = []
        full_content = '\n'.join(lesson['content_pages'])
        
        # Find session boundaries
        session_matches = list(self.patterns['session_header'].finditer(full_content))
        
        if not session_matches:
            # No explicit sessions found, create a default session
            sessions.append({
                'session_number': 1,
                'title': 'Main Session',
                'session_type': 'develop',
                'content': full_content,
                'activities': self.extract_activities(full_content),
                'problems': self.extract_problems(full_content)
            })
            return sessions
        
        for i, session_match in enumerate(session_matches):
            session_number = int(session_match.group(1))
            session_title = session_match.group(2).strip() if session_match.group(2) else f"Session {session_number}"
            
            # Get session content
            start_pos = session_match.start()
            end_pos = session_matches[i + 1].start() if i + 1 < len(session_matches) else len(full_content)
            session_content = full_content[start_pos:end_pos]
            
            # Determine session type
            session_type = 'develop'  # default
            for stype in ['explore', 'develop', 'refine']:
                if stype.lower() in session_content.lower()[:200]:  # Check first 200 chars
                    session_type = stype.lower()
                    break
            
            sessions.append({
                'session_number': session_number,
                'title': session_title,
                'session_type': session_type,
                'content': session_content,
                'activities': self.extract_activities(session_content),
                'problems': self.extract_problems(session_content)
            })
        
        return sessions
    
    def extract_activities(self, content: str) -> List[Dict[str, Any]]:
        """Extract activities from session content"""
        activities = []
        
        # Try It activities
        try_it_matches = self.patterns['try_it'].finditer(content)
        for match in try_it_matches:
            activities.append({
                'type': 'try_it',
                'content': match.group(0).strip()
            })
        
        return activities
    
    def extract_problems(self, content: str) -> List[Dict[str, Any]]:
        """Extract numbered problems from content"""
        problems = []
        problem_matches = self.patterns['problems'].finditer(content)
        
        for match in problem_matches:
            problem_num = int(match.group(1))
            problem_text = match.group(2).strip()
            
            # Filter out false positives (like page numbers)
            if len(problem_text) < 20:  # Too short to be a real problem
                continue
            
            problems.append({
                'number': problem_num,
                'text': problem_text
            })
        
        return problems
    
    def store_document(self, filename: str, grade: int, volume: str, total_pages: int, lessons_count: int) -> int:
        """Store document in database"""
        cursor = self.conn.cursor()
        
        quality_score = min(1.0, lessons_count / 20.0)  # Rough quality estimate
        
        cursor.execute("""
            INSERT OR REPLACE INTO documents 
            (filename, grade, volume, total_pages, extraction_date, extraction_quality_score)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (filename, grade, volume, total_pages, datetime.now().isoformat(), quality_score))
        
        self.conn.commit()
        return cursor.lastrowid
    
    def store_lesson(self, doc_id: int, lesson: Dict[str, Any]):
        """Store lesson and sessions in database"""
        cursor = self.conn.cursor()
        
        # Calculate content quality
        total_content = len('\n'.join(lesson['content_pages']))
        content_quality = min(1.0, total_content / 2000.0)
        
        # Insert lesson
        cursor.execute("""
            INSERT INTO lessons 
            (document_id, lesson_number, title, start_page, end_page, standards, is_major_work, content_quality_score)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (doc_id, lesson['lesson_number'], lesson['title'], lesson['start_page'], lesson['end_page'],
              json.dumps(lesson['standards']), lesson['is_major_work'], content_quality))
        
        lesson_id = cursor.lastrowid
        
        # Insert sessions
        for session in lesson['sessions']:
            cursor.execute("""
                INSERT INTO sessions 
                (lesson_id, session_number, title, session_type, content, activities_count, problems_count)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (lesson_id, session['session_number'], session['title'], session['session_type'],
                  session['content'], len(session['activities']), len(session['problems'])))
            
            session_id = cursor.lastrowid
            
            # Insert activities
            for activity in session['activities']:
                cursor.execute("""
                    INSERT INTO activities (session_id, activity_type, content)
                    VALUES (?, ?, ?)
                """, (session_id, activity['type'], activity['content']))
            
            # Insert problems
            for problem in session['problems']:
                cursor.execute("""
                    INSERT INTO problems (session_id, problem_number, problem_text)
                    VALUES (?, ?, ?)
                """, (session_id, problem['number'], problem['text']))
        
        self.conn.commit()
    
    def calculate_extraction_quality(self, lessons: List[Dict[str, Any]]) -> float:
        """Calculate overall extraction quality score"""
        if not lessons:
            return 0.0
        
        quality_factors = []
        
        for lesson in lessons:
            # Title quality (not truncated, meaningful)
            title_quality = 1.0 if len(lesson['title']) > 10 else 0.5
            
            # Content quality (has substantial content)
            content_length = sum(len(page) for page in lesson['content_pages'])
            content_quality = min(1.0, content_length / 1000.0)
            
            # Standards quality (has standards identified)
            standards_quality = 1.0 if lesson['standards'] else 0.5
            
            # Session quality (has identified sessions)
            session_quality = 1.0 if lesson['sessions'] else 0.3
            
            lesson_quality = (title_quality + content_quality + standards_quality + session_quality) / 4
            quality_factors.append(lesson_quality)
        
        return sum(quality_factors) / len(quality_factors)
    
    def generate_gpt5_summaries(self, doc_id: int):
        """Generate GPT-5 optimized summaries"""
        cursor = self.conn.cursor()
        
        # Get document info
        cursor.execute("SELECT grade, volume FROM documents WHERE id = ?", (doc_id,))
        doc_info = cursor.fetchone()
        grade, volume = doc_info
        
        # Get all lessons for this document
        cursor.execute("""
            SELECT l.id, l.lesson_number, l.title, l.standards, l.is_major_work,
                   COUNT(s.id) as session_count
            FROM lessons l
            LEFT JOIN sessions s ON l.id = s.lesson_id
            WHERE l.document_id = ?
            GROUP BY l.id
            ORDER BY l.lesson_number
        """, (doc_id,))
        
        lessons = cursor.fetchall()
        
        for lesson_row in lessons:
            lesson_id, lesson_num, title, standards_json, is_major_work, session_count = lesson_row
            
            standards = json.loads(standards_json) if standards_json else []
            
            # Get session details
            cursor.execute("""
                SELECT session_number, title, session_type, 
                       LENGTH(content) as content_length,
                       activities_count, problems_count
                FROM sessions
                WHERE lesson_id = ?
                ORDER BY session_number
            """, (lesson_id,))
            
            sessions = cursor.fetchall()
            
            # Create GPT-5 context
            gpt5_context = self.create_gpt5_lesson_context(
                grade, volume, lesson_num, title, standards, is_major_work, sessions
            )
            
            total_content_length = sum(session[3] for session in sessions)
            
            # Calculate confidence based on data quality
            confidence = self.calculate_lesson_confidence(title, standards, sessions)
            
            # Insert summary
            cursor.execute("""
                INSERT OR REPLACE INTO lesson_summaries_gpt5
                (lesson_id, grade, lesson_number, title, standards_list, session_count,
                 total_content_length, gpt5_context, extraction_confidence)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (lesson_id, grade, lesson_num, title, ', '.join(standards), 
                  session_count, total_content_length, gpt5_context, confidence))
        
        self.conn.commit()
    
    def create_gpt5_lesson_context(self, grade: int, volume: str, lesson_num: int, title: str,
                                 standards: List[str], is_major_work: bool, sessions: List) -> str:
        """Create formatted context for GPT-5"""
        
        context = f"""# Grade {grade} {volume} - Lesson {lesson_num}: {title}

## Lesson Metadata
- **Standards**: {', '.join(standards) if standards else 'Not specified'}
- **Major Work**: {'Yes' if is_major_work else 'No'}
- **Session Count**: {len(sessions)}

## Learning Structure"""
        
        for session in sessions:
            session_num, session_title, session_type, content_length, activities_count, problems_count = session
            
            context += f"""

### Session {session_num}: {session_title or session_type.title()}
- **Type**: {session_type.title()}
- **Content Length**: {content_length} characters
- **Activities**: {activities_count}
- **Problems**: {problems_count}"""
        
        context += f"""

## Instructional Context
This lesson is part of the Ready Classroom Mathematics Grade {grade} {volume} curriculum.
"""
        
        if is_major_work:
            context += "This lesson focuses on **major work** content for this grade level.\n"
        
        return context
    
    def calculate_lesson_confidence(self, title: str, standards: List[str], sessions: List) -> float:
        """Calculate confidence in extraction quality"""
        factors = []
        
        # Title quality
        factors.append(1.0 if len(title) > 5 and not title.startswith('LESSON') else 0.5)
        
        # Standards presence
        factors.append(1.0 if standards else 0.3)
        
        # Session structure
        factors.append(1.0 if len(sessions) >= 1 else 0.0)
        
        # Content richness
        total_content = sum(session[3] for session in sessions) if sessions else 0
        factors.append(min(1.0, total_content / 1500.0))
        
        return sum(factors) / len(factors)
    
    def export_analysis(self):
        """Export analysis for review"""
        cursor = self.conn.cursor()
        
        # Get summary stats
        cursor.execute("""
            SELECT d.grade, d.volume, COUNT(l.id) as lesson_count,
                   AVG(ls.extraction_confidence) as avg_confidence,
                   COUNT(CASE WHEN ls.extraction_confidence > 0.7 THEN 1 END) as high_quality_lessons
            FROM documents d
            LEFT JOIN lessons l ON d.id = l.document_id
            LEFT JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
            GROUP BY d.id
            ORDER BY d.grade, d.volume
        """)
        
        results = cursor.fetchall()
        
        print("\n📊 PRECISION EXTRACTION ANALYSIS")
        print("=" * 50)
        
        total_lessons = 0
        high_quality = 0
        
        for row in results:
            grade, volume, lesson_count, avg_confidence, hq_lessons = row
            total_lessons += lesson_count or 0
            high_quality += hq_lessons or 0
            
            print(f"Grade {grade} {volume}: {lesson_count} lessons, "
                  f"confidence: {avg_confidence:.2f}, high quality: {hq_lessons}")
        
        print(f"\n🎯 SUMMARY: {total_lessons} total lessons, {high_quality} high quality")
        print(f"📈 Overall quality rate: {high_quality/max(total_lessons,1)*100:.1f}%")
    
    def close(self):
        if hasattr(self, 'conn'):
            self.conn.close()

def main():
    """Main execution"""
    print("🎯 Starting Precise Lesson Extraction")
    
    extractor = PreciseLessonExtractor()
    
    try:
        # Extract all PDFs
        results = extractor.extract_all_pdfs()
        
        # Analyze results
        extractor.export_analysis()
        
        print("\n✅ Precise extraction complete!")
        print(f"📄 Database: {extractor.db_path}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise
    finally:
        extractor.close()

if __name__ == "__main__":
    main()
