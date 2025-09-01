#!/usr/bin/env python3
"""
Database connection utility for accessing the precision-extracted curriculum database.
This module provides clean interfaces for the Next.js app to access lesson data.
"""

import sqlite3
import json
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict

@dataclass
class LessonSummary:
    """Structured lesson data for API consumption."""
    lesson_id: int
    grade: int
    lesson_number: int
    title: str
    standards: List[str]
    session_count: int
    total_content_length: int
    extraction_confidence: float
    gpt5_context: str
    unit_theme: str
    estimated_days: int
    is_major_work: bool

@dataclass
class DatabaseStats:
    """Database statistics for dashboard display."""
    total_lessons: int
    total_sessions: int
    total_activities: int
    total_problems: int
    high_confidence_lessons: int
    lessons_with_standards: int
    grade_distribution: Dict[str, int]
    volume_distribution: Dict[str, int]

class CurriculumDatabaseClient:
    """High-level client for accessing the precision curriculum database."""
    
    def __init__(self, db_path: str = "curriculum_precise.db"):
        """Initialize database connection."""
        self.db_path = Path(db_path)
        if not self.db_path.exists():
            raise FileNotFoundError(f"Precision database not found at {db_path}")
    
    def get_connection(self):
        """Get database connection with optimized settings."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        conn.execute("PRAGMA journal_mode = WAL")
        conn.execute("PRAGMA synchronous = NORMAL") 
        conn.execute("PRAGMA cache_size = 10000")
        return conn
    
    def get_database_stats(self) -> DatabaseStats:
        """Get comprehensive database statistics."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Basic counts
            cursor.execute("SELECT COUNT(*) FROM lessons")
            total_lessons = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM sessions")
            total_sessions = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM activities")
            total_activities = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM problems")
            total_problems = cursor.fetchone()[0]
            
            # Quality metrics
            cursor.execute("SELECT COUNT(*) FROM lesson_summaries_gpt5 WHERE extraction_confidence >= 0.7")
            high_confidence = cursor.fetchone()[0]
            
            cursor.execute("SELECT COUNT(*) FROM lessons WHERE standards IS NOT NULL AND standards != '' AND standards != '[]'")
            with_standards = cursor.fetchone()[0]
            
            # Grade distribution
            cursor.execute("""
            SELECT d.grade, COUNT(l.id) as lesson_count
            FROM documents d 
            LEFT JOIN lessons l ON d.id = l.document_id 
            GROUP BY d.grade
            """)
            grade_dist = {f"Grade {row[0]}": row[1] for row in cursor.fetchall()}
            
            # Volume distribution  
            cursor.execute("""
            SELECT d.volume, COUNT(l.id) as lesson_count
            FROM documents d 
            LEFT JOIN lessons l ON d.id = l.document_id 
            GROUP BY d.volume
            """)
            volume_dist = {f"Volume {row[0]}": row[1] for row in cursor.fetchall()}
            
            return DatabaseStats(
                total_lessons=total_lessons,
                total_sessions=total_sessions,
                total_activities=total_activities,
                total_problems=total_problems,
                high_confidence_lessons=high_confidence,
                lessons_with_standards=with_standards,
                grade_distribution=grade_dist,
                volume_distribution=volume_dist
            )
    
    def get_all_lesson_summaries(self) -> List[LessonSummary]:
        """Get all lesson summaries optimized for GPT-5 consumption."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            cursor.execute("""
            SELECT 
                ls.lesson_id,
                ls.grade,
                ls.lesson_number,
                ls.title,
                ls.standards_list,
                ls.session_count,
                ls.total_content_length,
                ls.gpt5_context,
                ls.extraction_confidence,
                l.unit_theme,
                l.estimated_days,
                l.is_major_work
            FROM lesson_summaries_gpt5 ls
            JOIN lessons l ON ls.lesson_id = l.id
            ORDER BY ls.grade, ls.lesson_number
            """)
            
            lessons = []
            for row in cursor.fetchall():
                # Parse standards JSON
                try:
                    standards = json.loads(row[4]) if row[4] else []
                except:
                    standards = []
                
                lessons.append(LessonSummary(
                    lesson_id=row[0],
                    grade=row[1],
                    lesson_number=row[2],
                    title=row[3],
                    standards=standards,
                    session_count=row[5],
                    total_content_length=row[6],
                    gpt5_context=row[7],
                    extraction_confidence=row[8],
                    unit_theme=row[9] or "General",
                    estimated_days=row[10] or 2,
                    is_major_work=bool(row[11])
                ))
            
            return lessons
    
    def get_lessons_by_grades(self, grades: List[int]) -> List[LessonSummary]:
        """Get lessons filtered by grade levels."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            placeholders = ','.join(['?' for _ in grades])
            cursor.execute(f"""
            SELECT 
                ls.lesson_id,
                ls.grade,
                ls.lesson_number,
                ls.title,
                ls.standards_list,
                ls.session_count,
                ls.total_content_length,
                ls.gpt5_context,
                ls.extraction_confidence,
                l.unit_theme,
                l.estimated_days,
                l.is_major_work
            FROM lesson_summaries_gpt5 ls
            JOIN lessons l ON ls.lesson_id = l.id
            WHERE ls.grade IN ({placeholders})
            ORDER BY ls.grade, ls.lesson_number
            """, grades)
            
            lessons = []
            for row in cursor.fetchall():
                try:
                    standards = json.loads(row[4]) if row[4] else []
                except:
                    standards = []
                
                lessons.append(LessonSummary(
                    lesson_id=row[0],
                    grade=row[1],
                    lesson_number=row[2],
                    title=row[3],
                    standards=standards,
                    session_count=row[5],
                    total_content_length=row[6],
                    gpt5_context=row[7],
                    extraction_confidence=row[8],
                    unit_theme=row[9] or "General",
                    estimated_days=row[10] or 2,
                    is_major_work=bool(row[11])
                ))
            
            return lessons
    
    def get_lesson_details(self, lesson_id: int) -> Optional[Dict[str, Any]]:
        """Get detailed information about a specific lesson including sessions."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Get lesson info
            cursor.execute("""
            SELECT l.*, ls.gpt5_context, ls.extraction_confidence, d.filename
            FROM lessons l
            LEFT JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
            JOIN documents d ON l.document_id = d.id
            WHERE l.id = ?
            """, (lesson_id,))
            
            lesson_row = cursor.fetchone()
            if not lesson_row:
                return None
            
            # Get sessions
            cursor.execute("""
            SELECT id, session_number, title, session_type, content, activities_count, problems_count
            FROM sessions
            WHERE lesson_id = ?
            ORDER BY session_number
            """, (lesson_id,))
            
            sessions = [dict(row) for row in cursor.fetchall()]
            
            # Parse standards
            try:
                standards = json.loads(lesson_row['standards']) if lesson_row['standards'] else []
            except:
                standards = []
            
            return {
                'lesson': dict(lesson_row),
                'sessions': sessions,
                'standards': standards,
                'total_sessions': len(sessions),
                'total_content': sum(len(s.get('content', '')) for s in sessions)
            }
    
    def search_lessons(self, query: str, grades: Optional[List[int]] = None) -> List[Dict[str, Any]]:
        """Search lessons by title or content."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            base_query = """
            SELECT 
                l.id,
                l.lesson_number,
                l.title,
                l.unit_theme,
                ls.grade,
                ls.extraction_confidence,
                d.filename
            FROM lessons l
            JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
            JOIN documents d ON l.document_id = d.id
            WHERE (l.title LIKE ? OR l.unit_theme LIKE ?)
            """
            
            params = [f"%{query}%", f"%{query}%"]
            
            if grades:
                placeholders = ','.join(['?' for _ in grades])
                base_query += f" AND ls.grade IN ({placeholders})"
                params.extend(grades)
            
            base_query += " ORDER BY ls.grade, l.lesson_number"
            
            cursor.execute(base_query, params)
            
            return [dict(row) for row in cursor.fetchall()]

def export_lessons_for_api() -> str:
    """Export lesson data as JSON for API consumption."""
    client = CurriculumDatabaseClient()
    lessons = client.get_all_lesson_summaries()
    stats = client.get_database_stats()
    
    export_data = {
        'lessons': [asdict(lesson) for lesson in lessons],
        'stats': asdict(stats),
        'metadata': {
            'total_lessons': len(lessons),
            'export_timestamp': '2025-09-01T00:00:00Z',
            'database_version': 'precision_v1.0',
            'extraction_quality': 'high_confidence'
        }
    }
    
    output_file = 'precision_lessons_export.json'
    with open(output_file, 'w') as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Exported {len(lessons)} lessons to {output_file}")
    return output_file

if __name__ == "__main__":
    # Test the database connection and export data
    try:
        client = CurriculumDatabaseClient()
        stats = client.get_database_stats()
        
        print("📊 PRECISION DATABASE CONNECTION TEST")
        print(f"✅ Total Lessons: {stats.total_lessons}")
        print(f"✅ Total Sessions: {stats.total_sessions}")
        print(f"✅ High Confidence: {stats.high_confidence_lessons}")
        print(f"✅ With Standards: {stats.lessons_with_standards}")
        print(f"✅ Grade Distribution: {stats.grade_distribution}")
        
        # Export for API
        export_file = export_lessons_for_api()
        print(f"✅ API export ready: {export_file}")
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
