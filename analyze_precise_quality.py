#!/usr/bin/env python3
"""
Analyze the quality of the precise extraction with correct schema.
"""

import sqlite3
import json
from typing import Dict, List, Tuple
import statistics

def analyze_precise_extraction():
    """Analyze the precise extraction database."""
    db_path = "curriculum_precise.db"
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Document overview
        cursor.execute("""
        SELECT d.grade, d.volume, COUNT(l.id) as lesson_count,
               AVG(l.content_quality_score) as avg_quality,
               COUNT(CASE WHEN l.content_quality_score >= 0.7 THEN 1 END) as high_quality
        FROM documents d 
        LEFT JOIN lessons l ON d.id = l.document_id 
        GROUP BY d.grade, d.volume 
        ORDER BY d.grade, d.volume
        """)
        doc_analysis = cursor.fetchall()
        
        # Overall lesson stats
        cursor.execute("SELECT COUNT(*) FROM lessons")
        total_lessons = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM sessions")
        total_sessions = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM activities")
        total_activities = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM problems")
        total_problems = cursor.fetchone()[0]
        
        # Session content analysis
        cursor.execute("SELECT AVG(LENGTH(content)) FROM sessions WHERE content IS NOT NULL")
        avg_session_content = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT COUNT(*) FROM sessions WHERE LENGTH(content) > 500")
        substantial_sessions = cursor.fetchone()[0]
        
        # GPT-5 summaries analysis
        cursor.execute("SELECT COUNT(*) FROM lesson_summaries_gpt5")
        gpt5_summaries = cursor.fetchone()[0]
        
        cursor.execute("SELECT AVG(extraction_confidence) FROM lesson_summaries_gpt5 WHERE extraction_confidence IS NOT NULL")
        avg_confidence = cursor.fetchone()[0] or 0
        
        cursor.execute("SELECT COUNT(*) FROM lesson_summaries_gpt5 WHERE extraction_confidence >= 0.7")
        high_confidence_summaries = cursor.fetchone()[0]
        
        cursor.execute("SELECT AVG(total_content_length) FROM lesson_summaries_gpt5")
        avg_gpt5_content = cursor.fetchone()[0] or 0
        
        # Standards coverage
        cursor.execute("SELECT COUNT(*) FROM lessons WHERE standards IS NOT NULL AND standards != '' AND standards != '[]'")
        lessons_with_standards = cursor.fetchone()[0]
        
        # Sample some high-quality content
        cursor.execute("""
        SELECT l.title, s.content, l.standards, ls.extraction_confidence
        FROM lessons l
        JOIN sessions s ON l.id = s.lesson_id
        LEFT JOIN lesson_summaries_gpt5 ls ON l.id = ls.lesson_id
        WHERE s.content IS NOT NULL AND LENGTH(s.content) > 200
        AND (ls.extraction_confidence IS NULL OR ls.extraction_confidence >= 0.6)
        ORDER BY RANDOM()
        LIMIT 3
        """)
        sample_content = cursor.fetchall()
        
        print("🎯 PRECISION EXTRACTION ANALYSIS")
        print("=" * 50)
        print(f"📊 Database Structure:")
        print(f"   📚 Total Lessons: {total_lessons}")
        print(f"   📝 Total Sessions: {total_sessions}")
        print(f"   🎯 Total Activities: {total_activities}")
        print(f"   🧮 Total Problems: {total_problems}")
        print(f"   🤖 GPT-5 Summaries: {gpt5_summaries}")
        
        print(f"\n📈 Content Quality:")
        print(f"   📖 Avg Session Content: {avg_session_content:.0f} chars")
        print(f"   💪 Substantial Sessions (>500 chars): {substantial_sessions}/{total_sessions} ({substantial_sessions/total_sessions*100:.1f}%)")
        print(f"   📊 Avg GPT-5 Context Length: {avg_gpt5_content:.0f} chars")
        print(f"   🎯 Avg Extraction Confidence: {avg_confidence:.2f}")
        print(f"   ✅ High Confidence GPT-5: {high_confidence_summaries}/{gpt5_summaries} ({high_confidence_summaries/gpt5_summaries*100:.1f}%)")
        print(f"   🏷️ Standards Coverage: {lessons_with_standards}/{total_lessons} ({lessons_with_standards/total_lessons*100:.1f}%)")
        
        print(f"\n📋 By Grade/Volume:")
        total_high_quality = 0
        for grade, volume, lesson_count, avg_quality, high_quality in doc_analysis:
            total_high_quality += high_quality
            quality_pct = (high_quality / lesson_count * 100) if lesson_count > 0 else 0
            print(f"   Grade {grade} V{volume}: {lesson_count} lessons, {avg_quality:.2f} quality, {high_quality} high-quality ({quality_pct:.1f}%)")
        
        # Calculate overall quality scores
        session_quality = min(100, (avg_session_content / 1000) * 100)  # Scale to 1000 chars
        confidence_quality = avg_confidence * 100
        standards_quality = (lessons_with_standards / total_lessons) * 100
        structure_quality = min(100, (total_sessions / total_lessons) * 50)  # Good if 2+ sessions per lesson
        
        overall_score = (session_quality * 0.3 + confidence_quality * 0.3 + 
                        standards_quality * 0.2 + structure_quality * 0.2)
        
        print(f"\n🏆 QUALITY ASSESSMENT:")
        print(f"   📝 Session Quality: {session_quality:.1f}/100")
        print(f"   🎯 Confidence Quality: {confidence_quality:.1f}/100")
        print(f"   🏷️ Standards Quality: {standards_quality:.1f}/100")
        print(f"   🏗️ Structure Quality: {structure_quality:.1f}/100")
        print(f"   📊 OVERALL SCORE: {overall_score:.1f}/100")
        
        if overall_score >= 70:
            rating = "🟢 EXCELLENT - Ready for GPT-5 Integration"
        elif overall_score >= 50:
            rating = "🟡 GOOD - Minor improvements needed"
        else:
            rating = "🔴 NEEDS WORK - Major improvements required"
            
        print(f"   🎯 Rating: {rating}")
        
        print(f"\n📖 SAMPLE EXTRACTED CONTENT:")
        for i, (title, content, standards, confidence) in enumerate(sample_content, 1):
            content_preview = content[:150] + "..." if len(content) > 150 else content
            conf_str = f" (confidence: {confidence:.2f})" if confidence else ""
            standards_preview = (standards[:30] + "...") if standards and len(standards) > 30 else (standards or "None")
            print(f"   {i}. {title}{conf_str}")
            print(f"      📝 Content: {content_preview}")
            print(f"      🏷️ Standards: {standards_preview}")
            print()
        
        # Compare with original extraction results
        print(f"📊 IMPROVEMENT OVER ORIGINAL:")
        print(f"   📚 Lessons: 89 → {total_lessons} ({total_lessons/89:.1f}x increase)")
        print(f"   📝 Content: ~498 chars → {avg_session_content:.0f} chars ({avg_session_content/498:.1f}x improvement)")
        print(f"   🎯 Quality Score: 33/100 → {overall_score:.1f}/100 ({overall_score-33:.1f} point improvement)")
        
        conn.close()
        
        if overall_score >= 60:
            print(f"\n✅ SUCCESS! Precision extraction significantly improved quality.")
            print(f"   Ready for GPT-5 pacing guide generation!")
        else:
            print(f"\n⚠️ Additional refinement needed before production use.")
            
        return overall_score
        
    except Exception as e:
        print(f"❌ Error analyzing database: {e}")
        import traceback
        traceback.print_exc()
        return 0

if __name__ == "__main__":
    print("🔍 Analyzing Precision Extraction Results...")
    analyze_precise_extraction()
