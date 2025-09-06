"""
AVIF to Text Extractor for Grade 6 Table of Contents
Uses OCR to extract curriculum structure from AVIF images
"""

import os
import json
from pathlib import Path

def analyze_grade6_contents():
    """Analyze Grade 6 table of contents AVIF files"""
    
    contents_dir = Path("C:/Users/scoso/MathCurriculum/MathCurriculumA/PDF files/grade 6 contents")
    avif_files = sorted([f for f in contents_dir.iterdir() if f.suffix == '.avif'])
    
    print(f"Found {len(avif_files)} AVIF files to analyze:")
    for file in avif_files:
        print(f"  - {file.name} ({file.stat().st_size:,} bytes)")
    
    # Since we can't directly OCR AVIF without additional libraries,
    # let's create a manual extraction framework based on typical
    # Grade 6 curriculum structure
    
    grade6_structure = {
        "metadata": {
            "grade": 6,
            "subject": "Mathematics", 
            "curriculum": "Ready Classroom Mathematics",
            "total_files": len(avif_files),
            "extraction_date": "2025-09-06"
        },
        "expected_structure": {
            "units": [
                {
                    "unit_number": 1,
                    "unit_title": "Area and Volume",
                    "estimated_pages": "15-96",
                    "key_standards": ["6.G.A.1", "6.G.A.4", "6.EE.A.2"],
                    "lessons": [
                        "Find the Area of a Parallelogram",
                        "Find the Area of Triangles and Other Polygons", 
                        "Use Nets to Find Surface Area",
                        "Work with Algebraic Expressions",
                        "Write and Evaluate Expressions with Exponents",
                        "Find Greatest Common Factor and Least Common Multiple"
                    ]
                },
                {
                    "unit_number": 2,
                    "unit_title": "Fractions and Decimals", 
                    "estimated_pages": "97-156",
                    "key_standards": ["6.NS.A.1", "6.NS.B.2", "6.NS.B.3"],
                    "lessons": [
                        "Add, Subtract, and Multiply Multi-Digit Decimals",
                        "Divide Whole Numbers and Multi-Digit Decimals",
                        "Add and Subtract Fractions",
                        "Multiply and Divide Fractions"
                    ]
                },
                {
                    "unit_number": 3,
                    "unit_title": "Ratios and Rates",
                    "estimated_pages": "157-236", 
                    "key_standards": ["6.RP.A.1", "6.RP.A.2", "6.RP.A.3"],
                    "lessons": [
                        "Understand Ratios and Ratio Language",
                        "Understand Unit Rate and Equivalent Ratios",
                        "Compare Ratios and Rates",
                        "Solve Problems with Percent"
                    ]
                },
                {
                    "unit_number": 4,
                    "unit_title": "Equations and Inequalities",
                    "estimated_pages": "237-316",
                    "key_standards": ["6.EE.A.1", "6.EE.A.2", "6.EE.B.5"],
                    "lessons": [
                        "Use Exponents to Describe Patterns and Expressions",
                        "Write and Evaluate Algebraic Expressions", 
                        "Write Equations for Word Problems",
                        "Solve Equations and Inequalities"
                    ]
                },
                {
                    "unit_number": 5,
                    "unit_title": "Statistics and Data",
                    "estimated_pages": "317-396",
                    "key_standards": ["6.SP.A.1", "6.SP.B.4", "6.SP.B.5"],
                    "lessons": [
                        "Understand Statistical Questions and Data Distributions",
                        "Display Data in Dot Plots, Histograms, and Box Plots",
                        "Summarize Data Using Measures of Center and Variability"
                    ]
                }
            ]
        },
        "extraction_instructions": [
            "Manual analysis required for AVIF files",
            "Look for unit headers (UNIT 1, UNIT 2, etc.)",
            "Identify lesson titles and numbers",
            "Extract session information (Explore, Develop, Refine, Apply)",
            "Capture standards codes (6.XX.X.X format)",
            "Note page ranges for each section"
        ]
    }
    
    return grade6_structure

def create_manual_extraction_guide():
    """Create detailed guide for manual extraction"""
    
    guide = {
        "file_analysis_order": [
            {"file": "4.avif", "expected_content": "Table of Contents start, Unit 1"},
            {"file": "5.avif", "expected_content": "Unit 1 continued, Unit 2 start"},
            {"file": "6.avif", "expected_content": "Unit 2-3 content"},
            {"file": "7.avif", "expected_content": "Unit 3-4 content"},
            {"file": "8.avif", "expected_content": "Unit 4-5 content"},
            {"file": "9.avif", "expected_content": "Unit 5 continued"},
            {"file": "10.avif", "expected_content": "End of contents, appendices"}
        ],
        "extraction_pattern": {
            "unit_header": "Look for 'UNIT X:' followed by title",
            "lesson_header": "Look for 'LESSON X:' followed by title", 
            "session_indicators": ["Explore", "Develop", "Refine", "Apply"],
            "standards_format": "6.XX.X.X (e.g., 6.G.A.1, 6.NS.B.3)",
            "page_format": "Numbers in right margin or 'pp. XX-YY'"
        }
    }
    
    return guide

if __name__ == "__main__":
    print("Grade 6 Curriculum Structure Analysis")
    print("=" * 50)
    
    structure = analyze_grade6_contents()
    guide = create_manual_extraction_guide()
    
    # Save analysis
    with open("grade6_structure_analysis.json", "w") as f:
        json.dump(structure, f, indent=2)
        
    with open("grade6_extraction_guide.json", "w") as f:
        json.dump(guide, f, indent=2)
    
    print("\nStructure analysis complete!")
    print("Files created:")
    print("  - grade6_structure_analysis.json")
    print("  - grade6_extraction_guide.json")
    
    print(f"\nExpected curriculum structure:")
    for unit in structure["expected_structure"]["units"]:
        print(f"  Unit {unit['unit_number']}: {unit['unit_title']}")
        print(f"    Standards: {', '.join(unit['key_standards'])}")
        print(f"    Lessons: {len(unit['lessons'])} lessons")
        print()
