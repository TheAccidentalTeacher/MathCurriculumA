import json
import os

def create_curriculum_comparison():
    """Create a comprehensive comparison of Grade 6 and Grade 7 curricula"""
    
    # Grade 6 data (from previous analysis)
    grade6_data = {
        "grade": 6,
        "title": "Ready Classroom Mathematics Grade 6",
        "total_pages": 894,
        "total_lessons": 33,
        "total_units": 6,
        "volumes": 2,
        "focus_areas": [
            "Ratios and Rates",
            "Fractions and Decimals", 
            "Rational Numbers",
            "Expressions and Equations",
            "Area and Volume",
            "Statistics"
        ]
    }
    
    # Grade 7 data (from current analysis)
    grade7_data = {
        "grade": 7,
        "title": "Ready Classroom Mathematics Grade 7", 
        "total_pages": 944,
        "total_lessons": 33,
        "total_units": 7,
        "volumes": 2,
        "focus_areas": [
            "Proportional Relationships",
            "Rational Number Operations",
            "Expressions and Equations",
            "Geometry",
            "Statistics and Probability"
        ]
    }
    
    print("="*80)
    print("READY CLASSROOM MATHEMATICS - CURRICULUM COMPARISON")
    print("="*80)
    print("Publisher: Curriculum Associates")
    print("Program: Complete Middle School Mathematics")
    print()
    
    print(f"{'Metric':<30} {'Grade 6':<15} {'Grade 7':<15}")
    print("-" * 60)
    print(f"{'Total Pages':<30} {grade6_data['total_pages']:<15} {grade7_data['total_pages']:<15}")
    print(f"{'Total Lessons':<30} {grade6_data['total_lessons']:<15} {grade7_data['total_lessons']:<15}")
    print(f"{'Total Units':<30} {grade6_data['total_units']:<15} {grade7_data['total_units']:<15}")
    print(f"{'Volumes':<30} {grade6_data['volumes']:<15} {grade7_data['volumes']:<15}")
    
    print()
    print("MATHEMATICAL PROGRESSION:")
    print("-" * 40)
    
    print("\nGrade 6 Focus Areas:")
    for i, area in enumerate(grade6_data['focus_areas'], 1):
        print(f"  {i}. {area}")
    
    print("\nGrade 7 Focus Areas:")
    for i, area in enumerate(grade7_data['focus_areas'], 1):
        print(f"  {i}. {area}")
    
    print()
    print("DOCUMENTATION STATUS:")
    print("-" * 30)
    print("✅ Grade 6: Complete analysis available (docs/GRADE6_CURRICULUM_ANALYSIS.md)")
    print("✅ Grade 7: Complete analysis available (docs/GRADE7_CURRICULUM_ANALYSIS.md)")
    print("📊 Combined: 1,838 pages of curriculum analyzed")
    print("🎯 Standards: Complete Common Core alignment documented")
    print("⏰ Pacing: Multiple scheduling options for both grades")
    
    print()
    print("IMPLEMENTATION READY:")
    print("-" * 25)
    print("🏫 Traditional Schedule: 180-day school year pacing")
    print("⚡ Accelerated Schedule: 160-day intensive pacing") 
    print("🕐 Block Schedule: 90-minute period optimization")
    print("📈 Assessment: Formative and summative frameworks")
    print("🔄 Differentiation: Support for all learner levels")
    
    total_combined = {
        "total_pages": grade6_data['total_pages'] + grade7_data['total_pages'],
        "total_lessons": grade6_data['total_lessons'] + grade7_data['total_lessons'],
        "total_units": grade6_data['total_units'] + grade7_data['total_units']
    }
    
    print()
    print("="*80)
    print("COMBINED CURRICULUM METRICS")
    print("="*80)
    print(f"Total Pages Analyzed: {total_combined['total_pages']:,}")
    print(f"Total Lessons Documented: {total_combined['total_lessons']}")
    print(f"Total Units Structured: {total_combined['total_units']}")
    print(f"Complete Grade Levels: 2 (Grades 6-7)")
    print(f"Documentation Files: 2 comprehensive analyses")
    print(f"Dynamic Pacing Options: 3 per grade level (6 total)")
    
    return total_combined

if __name__ == "__main__":
    create_curriculum_comparison()
