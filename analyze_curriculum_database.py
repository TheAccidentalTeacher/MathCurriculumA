#!/usr/bin/env python3
"""
COMPREHENSIVE CURRICULUM DATABASE ANALYZER
Analyzes current extraction quality and identifies areas for improvement
"""

import sqlite3
import json
import os
from typing import Dict, List, Any
from pathlib import Path

class CurriculumDatabaseAnalyzer:
    def __init__(self, db_path: str = "curriculum.db"):
        self.db_path = db_path
        self.conn = sqlite3.connect(db_path)
        self.conn.row_factory = sqlite3.Row
        
    def analyze_current_state(self) -> Dict[str, Any]:
        """Comprehensive analysis of current database state"""
        analysis = {
            "database_overview": self._get_database_overview(),
            "content_quality": self._assess_content_quality(),
            "standards_coverage": self._analyze_standards_coverage(),
            "extraction_gaps": self._identify_extraction_gaps(),
            "gpt5_readiness": self._assess_gpt5_readiness(),
            "recommendations": []
        }
        
        # Generate recommendations based on analysis
        analysis["recommendations"] = self._generate_recommendations(analysis)
        return analysis
    
    def _get_database_overview(self) -> Dict[str, Any]:
        """Get high-level database statistics"""
        cursor = self.conn.cursor()
        
        # Get table info
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        overview = {
            "tables": tables,
            "table_counts": {}
        }
        
        # Get row counts for each table
        for table in tables:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                overview["table_counts"][table] = count
            except sqlite3.Error as e:
                overview["table_counts"][table] = f"Error: {e}"
        
        return overview
    
    def _assess_content_quality(self) -> Dict[str, Any]:
        """Assess the quality and completeness of extracted content"""
        cursor = self.conn.cursor()
        
        quality_metrics = {
            "documents": self._analyze_documents(),
            "sections": self._analyze_sections(),
            "text_quality": self._analyze_text_quality()
        }
        
        return quality_metrics
    
    def _analyze_documents(self) -> Dict[str, Any]:
        """Analyze document-level data"""
        cursor = self.conn.cursor()
        
        try:
            cursor.execute("""
                SELECT filename, title, grade, total_pages, 
                       LENGTH(raw_text) as text_length
                FROM documents 
                ORDER BY grade, filename
            """)
            
            docs = cursor.fetchall()
            doc_analysis = {
                "total_documents": len(docs),
                "by_grade": {},
                "text_lengths": {},
                "missing_data": []
            }
            
            for doc in docs:
                grade = doc[2] if doc[2] else "Unknown"
                if grade not in doc_analysis["by_grade"]:
                    doc_analysis["by_grade"][grade] = 0
                doc_analysis["by_grade"][grade] += 1
                
                doc_analysis["text_lengths"][doc[0]] = doc[4] if doc[4] else 0
                
                # Check for missing essential data
                if not doc[1]:  # No title
                    doc_analysis["missing_data"].append(f"{doc[0]}: Missing title")
                if not doc[2]:  # No grade
                    doc_analysis["missing_data"].append(f"{doc[0]}: Missing grade")
                if not doc[3]:  # No page count
                    doc_analysis["missing_data"].append(f"{doc[0]}: Missing page count")
                if not doc[4] or doc[4] < 1000:  # Very little text
                    doc_analysis["missing_data"].append(f"{doc[0]}: Insufficient text extraction")
            
            return doc_analysis
            
        except sqlite3.Error as e:
            return {"error": str(e)}
    
    def _analyze_sections(self) -> Dict[str, Any]:
        """Analyze section-level data (lessons, units, etc.)"""
        cursor = self.conn.cursor()
        
        try:
            cursor.execute("""
                SELECT s.title, s.section_type, s.start_page, s.end_page,
                       LENGTH(s.content) as content_length, d.filename, d.grade
                FROM sections s
                JOIN documents d ON s.document_id = d.id
                WHERE s.title LIKE '%LESSON%'
                ORDER BY d.grade, s.start_page
            """)
            
            sections = cursor.fetchall()
            section_analysis = {
                "total_lessons": len(sections),
                "by_grade": {},
                "lesson_patterns": {},
                "content_quality": {},
                "missing_structure": []
            }
            
            for section in sections:
                grade = section[6] if section[6] else "Unknown"
                if grade not in section_analysis["by_grade"]:
                    section_analysis["by_grade"][grade] = 0
                section_analysis["by_grade"][grade] += 1
                
                # Analyze lesson title patterns
                title = section[0]
                if "LESSON" in title:
                    # Extract lesson number pattern
                    import re
                    lesson_match = re.search(r'LESSON\s+(\d+)', title)
                    if lesson_match:
                        lesson_num = lesson_match.group(1)
                        if grade not in section_analysis["lesson_patterns"]:
                            section_analysis["lesson_patterns"][grade] = []
                        section_analysis["lesson_patterns"][grade].append(lesson_num)
                
                # Check content quality
                content_len = section[4] if section[4] else 0
                if content_len < 500:  # Too little content
                    section_analysis["missing_structure"].append(
                        f"Grade {grade}, {title}: Insufficient content ({content_len} chars)"
                    )
            
            return section_analysis
            
        except sqlite3.Error as e:
            return {"error": str(e)}
    
    def _analyze_text_quality(self) -> Dict[str, Any]:
        """Analyze quality of extracted text"""
        cursor = self.conn.cursor()
        
        quality_indicators = {
            "standards_references": 0,
            "lesson_structures": 0,
            "mathematical_notation": 0,
            "session_indicators": 0,
            "problem_numbering": 0
        }
        
        try:
            cursor.execute("SELECT content FROM sections WHERE content IS NOT NULL")
            contents = cursor.fetchall()
            
            for content_row in contents:
                content = content_row[0]
                if not content:
                    continue
                
                # Look for standards patterns
                if any(pattern in content for pattern in ['.RP.', '.NS.', '.EE.', '.G.', '.SP.']):
                    quality_indicators["standards_references"] += 1
                
                # Look for lesson structure
                if any(word in content for word in ['LESSON', 'SESSION', 'Explore', 'Develop', 'Refine']):
                    quality_indicators["lesson_structures"] += 1
                
                # Look for mathematical notation
                if any(symbol in content for symbol in ['×', '÷', '≤', '≥', '²', '³', '√']):
                    quality_indicators["mathematical_notation"] += 1
                
                # Look for session indicators
                if any(phrase in content for phrase in ['SESSION 1', 'SESSION 2', 'SESSION 3']):
                    quality_indicators["session_indicators"] += 1
                
                # Look for problem numbering
                import re
                if re.search(r'\b\d+\.\s', content):  # Pattern like "1. ", "2. "
                    quality_indicators["problem_numbering"] += 1
            
            return quality_indicators
            
        except sqlite3.Error as e:
            return {"error": str(e)}
    
    def _analyze_standards_coverage(self) -> Dict[str, Any]:
        """Analyze mathematical standards coverage"""
        cursor = self.conn.cursor()
        
        standards_analysis = {
            "found_standards": [],
            "by_grade": {},
            "major_work_indicators": [],
            "missing_mappings": []
        }
        
        try:
            cursor.execute("""
                SELECT content, d.grade 
                FROM sections s
                JOIN documents d ON s.document_id = d.id
                WHERE s.content IS NOT NULL
            """)
            
            contents = cursor.fetchall()
            
            import re
            standards_pattern = r'\b(\d+\.(?:RP|NS|EE|G|SP|F|A)\.(?:A|B|C)?\.\d+)\b'
            
            for content_row in contents:
                content, grade = content_row
                if not content:
                    continue
                
                # Find all standards references
                standards = re.findall(standards_pattern, content)
                for standard in standards:
                    if standard not in standards_analysis["found_standards"]:
                        standards_analysis["found_standards"].append(standard)
                    
                    if grade not in standards_analysis["by_grade"]:
                        standards_analysis["by_grade"][grade] = []
                    if standard not in standards_analysis["by_grade"][grade]:
                        standards_analysis["by_grade"][grade].append(standard)
            
            return standards_analysis
            
        except sqlite3.Error as e:
            return {"error": str(e)}
    
    def _identify_extraction_gaps(self) -> List[str]:
        """Identify specific gaps in the current extraction"""
        gaps = []
        
        # Check for expected curriculum volumes
        expected_files = [
            "RCM06_NA_SW_V1.pdf", "RCM06_NA_SW_V2.pdf",
            "RCM07_NA_SW_V1.pdf", "RCM07_NA_SW_V2.pdf", 
            "RCM08_NA_SW_V1.pdf", "RCM08_NA_SW_V2.pdf",
            "ALG01_NA_SW_V1.pdf", "ALG01_NA_SW_V2.pdf"
        ]
        
        cursor = self.conn.cursor()
        cursor.execute("SELECT DISTINCT filename FROM documents")
        existing_files = [row[0] for row in cursor.fetchall()]
        
        for expected in expected_files:
            if not any(expected in existing for existing in existing_files):
                gaps.append(f"Missing extraction for {expected}")
        
        # Check for structural completeness
        cursor.execute("""
            SELECT d.filename, COUNT(s.id) as section_count
            FROM documents d
            LEFT JOIN sections s ON d.id = s.document_id
            GROUP BY d.id, d.filename
        """)
        
        for row in cursor.fetchall():
            filename, section_count = row
            if section_count < 10:  # Expect at least 10 sections per curriculum volume
                gaps.append(f"Insufficient sections extracted from {filename} ({section_count} sections)")
        
        return gaps
    
    def _assess_gpt5_readiness(self) -> Dict[str, Any]:
        """Assess readiness for GPT-5 integration"""
        readiness = {
            "structure_completeness": 0,  # 0-100
            "standards_coverage": 0,      # 0-100  
            "content_richness": 0,        # 0-100
            "metadata_quality": 0,        # 0-100
            "overall_score": 0,           # 0-100
            "blocking_issues": []
        }
        
        # Check structure completeness
        cursor = self.conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM sections WHERE title LIKE '%LESSON%'")
        lesson_count = cursor.fetchone()[0]
        
        # Expect ~30 lessons per grade across 2 volumes, for 3 grades = ~180 lessons
        if lesson_count >= 150:
            readiness["structure_completeness"] = 100
        elif lesson_count >= 100:
            readiness["structure_completeness"] = 75
        elif lesson_count >= 50:
            readiness["structure_completeness"] = 50
        else:
            readiness["structure_completeness"] = 25
            readiness["blocking_issues"].append(f"Insufficient lesson extraction ({lesson_count} lessons)")
        
        # Check standards coverage
        standards_count = len(self._analyze_standards_coverage().get("found_standards", []))
        if standards_count >= 30:
            readiness["standards_coverage"] = 100
        elif standards_count >= 20:
            readiness["standards_coverage"] = 75
        elif standards_count >= 10:
            readiness["standards_coverage"] = 50
        else:
            readiness["standards_coverage"] = 25
            readiness["blocking_issues"].append(f"Insufficient standards mapping ({standards_count} standards)")
        
        # Check content richness
        cursor.execute("SELECT AVG(LENGTH(content)) FROM sections WHERE content IS NOT NULL")
        avg_content_length = cursor.fetchone()[0] or 0
        
        if avg_content_length >= 2000:
            readiness["content_richness"] = 100
        elif avg_content_length >= 1000:
            readiness["content_richness"] = 75
        elif avg_content_length >= 500:
            readiness["content_richness"] = 50
        else:
            readiness["content_richness"] = 25
            readiness["blocking_issues"].append(f"Poor content extraction quality (avg {avg_content_length:.0f} chars)")
        
        # Overall score
        readiness["overall_score"] = int(
            (readiness["structure_completeness"] + 
             readiness["standards_coverage"] + 
             readiness["content_richness"]) / 3
        )
        
        return readiness
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        gpt5_readiness = analysis.get("gpt5_readiness", {})
        overall_score = gpt5_readiness.get("overall_score", 0)
        
        if overall_score < 50:
            recommendations.append("🚨 CRITICAL: Complete re-extraction needed before GPT-5 integration")
        elif overall_score < 75:
            recommendations.append("⚠️ Significant improvements needed for production-ready GPT-5 integration")
        else:
            recommendations.append("✅ Database approaching GPT-5 readiness with minor improvements needed")
        
        # Specific recommendations based on gaps
        extraction_gaps = analysis.get("extraction_gaps", [])
        if extraction_gaps:
            recommendations.append(f"📄 Priority: Address {len(extraction_gaps)} extraction gaps")
            for gap in extraction_gaps[:3]:  # Show top 3
                recommendations.append(f"   • {gap}")
        
        # Content quality recommendations
        content_quality = analysis.get("content_quality", {})
        if content_quality.get("text_quality", {}).get("standards_references", 0) < 50:
            recommendations.append("📊 Improve standards reference extraction and parsing")
        
        if content_quality.get("text_quality", {}).get("lesson_structures", 0) < 100:
            recommendations.append("🏗️ Enhance lesson structure recognition and hierarchy building")
        
        return recommendations
    
    def export_analysis_report(self, output_file: str = "curriculum_analysis_report.json"):
        """Export comprehensive analysis report"""
        analysis = self.analyze_current_state()
        
        with open(output_file, 'w') as f:
            json.dump(analysis, f, indent=2, default=str)
        
        print(f"📊 Analysis report exported to {output_file}")
        return analysis
    
    def print_executive_summary(self):
        """Print concise executive summary"""
        analysis = self.analyze_current_state()
        
        print("\n" + "="*60)
        print("🎯 CURRICULUM DATABASE ANALYSIS - EXECUTIVE SUMMARY")
        print("="*60)
        
        # Database overview
        overview = analysis["database_overview"]
        print(f"\n📊 DATABASE OVERVIEW:")
        print(f"   Tables: {len(overview['tables'])}")
        for table, count in overview["table_counts"].items():
            print(f"   • {table}: {count} records")
        
        # GPT-5 readiness
        readiness = analysis["gpt5_readiness"]
        print(f"\n🧠 GPT-5 READINESS SCORE: {readiness['overall_score']}/100")
        print(f"   Structure: {readiness['structure_completeness']}/100")
        print(f"   Standards: {readiness['standards_coverage']}/100") 
        print(f"   Content: {readiness['content_richness']}/100")
        
        # Critical issues
        if readiness["blocking_issues"]:
            print(f"\n🚨 BLOCKING ISSUES:")
            for issue in readiness["blocking_issues"]:
                print(f"   • {issue}")
        
        # Top recommendations
        print(f"\n💡 TOP RECOMMENDATIONS:")
        for rec in analysis["recommendations"][:5]:
            print(f"   • {rec}")
        
        print("\n" + "="*60)
        print("For detailed analysis, run: analyzer.export_analysis_report()")
        print("="*60)

def main():
    """Main execution function"""
    print("🔍 Starting Comprehensive Curriculum Database Analysis...")
    
    analyzer = CurriculumDatabaseAnalyzer()
    
    # Print executive summary to console
    analyzer.print_executive_summary()
    
    # Export detailed report
    analysis = analyzer.export_analysis_report()
    
    print("\n✅ Analysis complete! Check curriculum_analysis_report.json for detailed findings.")

if __name__ == "__main__":
    main()
