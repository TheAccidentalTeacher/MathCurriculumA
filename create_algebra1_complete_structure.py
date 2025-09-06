import json
import re
import os

def extract_algebra1_complete_curriculum():
    """Extract complete Algebra 1 curriculum with proper unit organization"""
    
    base_path = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\webapp_pages"
    
    volumes = {
        "Volume 1": f"{base_path}/ALG01_NA_SW_V1/data/document.json",
        "Volume 2": f"{base_path}/ALG01_NA_SW_V2/data/document.json"
    }
    
    # Define the complete Algebra 1 curriculum structure based on high school standards
    algebra1_structure = {
        "grade": 9,
        "title": "Ready Classroom Mathematics Algebra 1",
        "total_pages": 0,
        "total_lessons": 28,  # Adjusted based on typical Algebra 1 scope
        "volumes": {
            "Volume 1": {
                "units": [
                    {
                        "unit_number": 1,
                        "title": "Expressions, Equations, and Inequalities",
                        "lessons": [1, 2, 3, 4],
                        "description": "Representing quantities, solving equations, linear equations, linear inequalities"
                    },
                    {
                        "unit_number": 2, 
                        "title": "Functions and Linear Relationships",
                        "lessons": [5, 6, 7, 8, 9],
                        "description": "Function concepts, graphs, linear functions, data fitting, piecewise functions"
                    },
                    {
                        "unit_number": 3,
                        "title": "Systems of Linear Equations and Inequalities", 
                        "lessons": [10, 11, 12, 13],
                        "description": "Graphing, substitution, elimination, linear inequalities, systems"
                    }
                ]
            },
            "Volume 2": {
                "units": [
                    {
                        "unit_number": 4,
                        "title": "Sequences and Exponential Functions",
                        "lessons": [14, 15, 16, 17, 18],
                        "description": "Sequences, exponential graphs, exponential modeling, comparing functions, rational exponents"
                    },
                    {
                        "unit_number": 5,
                        "title": "Polynomials and Quadratic Functions",
                        "lessons": [19, 20, 21, 22],
                        "description": "Polynomial operations, quadratic graphs, quadratic modeling, factoring"
                    },
                    {
                        "unit_number": 6,
                        "title": "Quadratic Equations and Complex Solutions",
                        "lessons": [23, 24, 25],
                        "description": "Solving quadratic equations, completing the square, quadratic formula"
                    },
                    {
                        "unit_number": 7,
                        "title": "Statistics and Data Analysis",
                        "lessons": [26, 27, 28],
                        "description": "One-variable statistics, comparing data sets, two-way frequency tables"
                    }
                ]
            }
        }
    }
    
    # Extract detailed lesson information from documents
    lesson_details = {}
    
    for volume_name, file_path in volumes.items():
        if not os.path.exists(file_path):
            print(f"File not found: {file_path}")
            continue
            
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"\nAnalyzing {volume_name} ({len(data.get('pages', []))} pages)...")
        
        # Process each page for lesson details
        for page_num, page in enumerate(data.get('pages', []), 1):
            text_preview = page.get('text_preview', '')
            
            # Look for lesson headers with multiple patterns for Algebra 1
            lesson_patterns = [
                r'LESSON (\d+)\s+([^|]*?)(?:\s+Overview|\s+LESSON|\s+Learning Progression|\s+Example|$)',
                r'Lesson (\d+)\s+([^|]*?)(?:\s+Overview|\s+Lesson|\s+Learning Progression|\s+Example|$)'
            ]
            
            for pattern in lesson_patterns:
                lesson_match = re.search(pattern, text_preview)
                if lesson_match:
                    lesson_num = int(lesson_match.group(1))
                    lesson_title = lesson_match.group(2).strip()
                    
                    # Clean up common patterns specific to Algebra 1
                    lesson_title = re.sub(r'\s+(Overview|Learning Progression|Example).*$', '', lesson_title)
                    lesson_title = re.sub(r'\s+\|.*$', '', lesson_title)
                    lesson_title = lesson_title.strip()
                    
                    # Only include lessons 1-28 and avoid duplicates
                    if 1 <= lesson_num <= 28 and lesson_num not in lesson_details and lesson_title and len(lesson_title) > 8:
                        lesson_details[lesson_num] = {
                            "lesson_number": lesson_num,
                            "title": lesson_title,
                            "volume": volume_name,
                            "start_page": page_num,
                            "page_id": page.get('page_id', f'page_{page_num}')
                        }
                    break
    
    # Now build the complete curriculum with lesson details
    complete_curriculum = {
        "grade": 9,
        "title": "Ready Classroom Mathematics Algebra 1",
        "curriculum_publisher": "Curriculum Associates",
        "curriculum_type": "High School Algebra 1 Program",
        "total_pages": 1354,  # 656 + 698
        "total_lessons": 28,
        "total_units": 7,
        "volumes": {}
    }
    
    for volume_name, volume_structure in algebra1_structure["volumes"].items():
        volume_data = {
            "volume_name": volume_name,
            "units": []
        }
        
        for unit in volume_structure["units"]:
            unit_data = {
                "unit_number": unit["unit_number"],
                "title": unit["title"],
                "description": unit["description"],
                "lessons": []
            }
            
            for lesson_num in unit["lessons"]:
                if lesson_num in lesson_details:
                    lesson = lesson_details[lesson_num]
                    unit_data["lessons"].append({
                        "lesson_number": lesson["lesson_number"],
                        "title": lesson["title"],
                        "start_page": lesson["start_page"],
                        "standards_focus": get_algebra1_standards_for_lesson(lesson_num),
                        "key_concepts": get_algebra1_key_concepts_for_lesson(lesson_num)
                    })
                else:
                    # Add placeholder for lessons not found
                    unit_data["lessons"].append({
                        "lesson_number": lesson_num,
                        "title": f"Lesson {lesson_num} (Title not extracted)",
                        "start_page": "TBD",
                        "standards_focus": get_algebra1_standards_for_lesson(lesson_num),
                        "key_concepts": get_algebra1_key_concepts_for_lesson(lesson_num)
                    })
            
            volume_data["units"].append(unit_data)
        
        complete_curriculum["volumes"][volume_name] = volume_data
    
    # Save the complete curriculum analysis
    output_file = "ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(complete_curriculum, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n" + "="*80)
    print(f"ALGEBRA 1 READY CLASSROOM MATHEMATICS - COMPLETE CURRICULUM")
    print(f"="*80)
    print(f"Publisher: Curriculum Associates")
    print(f"Total Pages: {complete_curriculum['total_pages']}")
    print(f"Total Lessons: {complete_curriculum['total_lessons']}")
    print(f"Total Units: {complete_curriculum['total_units']}")
    print(f"Volumes: {len(complete_curriculum['volumes'])}")
    
    for volume_name, volume in complete_curriculum["volumes"].items():
        print(f"\n{volume_name}:")
        for unit in volume["units"]:
            print(f"  Unit {unit['unit_number']}: {unit['title']}")
            print(f"    Lessons: {len(unit['lessons'])} ({', '.join([str(l['lesson_number']) for l in unit['lessons']])})")
            for lesson in unit["lessons"]:
                print(f"      Lesson {lesson['lesson_number']}: {lesson['title']} (Page {lesson['start_page']})")
    
    print(f"\nComplete curriculum structure saved to: {output_file}")
    return complete_curriculum

def get_algebra1_standards_for_lesson(lesson_num):
    """Map lessons to their primary Common Core Algebra 1 standards"""
    standards_map = {
        # Unit 1: Expressions, Equations, and Inequalities
        1: ["A-SSE.1", "A-CED.1"], 2: ["A-REI.1", "A-REI.3"], 3: ["A-CED.2", "A-REI.3"], 4: ["A-CED.1", "A-REI.3"],
        # Unit 2: Functions and Linear Relationships  
        5: ["F-IF.1", "F-IF.2"], 6: ["F-IF.4", "F-IF.7"], 7: ["F-IF.3", "F-LE.2"], 8: ["S-ID.6", "F-LE.2"], 9: ["F-IF.7", "F-BF.3"],
        # Unit 3: Systems
        10: ["A-REI.6", "A-REI.7"], 11: ["A-REI.5", "A-REI.6"], 12: ["A-CED.2", "A-REI.12"], 13: ["A-CED.3", "A-REI.12"],
        # Unit 4: Sequences and Exponentials
        14: ["F-IF.3", "F-BF.2"], 15: ["F-IF.7", "F-LE.2"], 16: ["F-LE.1", "F-LE.2"], 17: ["F-LE.3"], 18: ["N-RN.1", "N-RN.2"],
        # Unit 5: Polynomials and Quadratics
        19: ["A-APR.1"], 20: ["F-IF.7", "F-IF.8"], 21: ["A-CED.1", "F-IF.4"], 22: ["A-SSE.2", "A-SSE.3"],
        # Unit 6: Quadratic Equations
        23: ["A-REI.4"], 24: ["A-SSE.3", "A-REI.4"], 25: ["A-REI.4"],
        # Unit 7: Statistics
        26: ["S-ID.1", "S-ID.2"], 27: ["S-ID.3"], 28: ["S-ID.5"]
    }
    return standards_map.get(lesson_num, [])

def get_algebra1_key_concepts_for_lesson(lesson_num):
    """Define key mathematical concepts for each Algebra 1 lesson"""
    concepts_map = {
        # Unit 1: Expressions, Equations, and Inequalities
        1: ["Representing quantities", "Variables and expressions", "Mathematical modeling"],
        2: ["Equation solving strategies", "Properties of equality", "Inverse operations"],
        3: ["Linear equations in two variables", "Standard form", "Slope-intercept form"],
        4: ["Linear inequalities", "Inequality notation", "Solution sets"],
        
        # Unit 2: Functions and Linear Relationships
        5: ["Function definition", "Domain and range", "Function notation"],
        6: ["Interpreting graphs", "Function behavior", "Key features"],
        7: ["Linear functions", "Slope", "Rate of change"],
        8: ["Fitting linear models", "Correlation", "Line of best fit"],
        9: ["Piecewise functions", "Absolute value", "Step functions"],
        
        # Unit 3: Systems
        10: ["Graphing systems", "Substitution method", "Point of intersection"],
        11: ["Elimination method", "Linear combinations", "System solutions"],
        12: ["Linear inequalities in two variables", "Half-plane solutions"],
        13: ["Systems of inequalities", "Feasible regions", "Optimization"],
        
        # Unit 4: Sequences and Exponentials
        14: ["Arithmetic sequences", "Geometric sequences", "Recursive formulas"],
        15: ["Exponential functions", "Growth and decay", "Exponential graphs"],
        16: ["Exponential modeling", "Real-world applications", "Base and exponent"],
        17: ["Comparing linear and exponential", "Growth rates", "Function families"],
        18: ["Rational exponents", "Radical expressions", "Exponent rules"],
        
        # Unit 5: Polynomials and Quadratics
        19: ["Polynomial operations", "Adding, subtracting, multiplying polynomials"],
        20: ["Quadratic functions", "Parabolas", "Vertex form"],
        21: ["Quadratic modeling", "Maximum and minimum", "Applications"],
        22: ["Factoring polynomials", "Greatest common factor", "Factoring patterns"],
        
        # Unit 6: Quadratic Equations
        23: ["Solving quadratic equations", "Zero product property", "Factoring"],
        24: ["Completing the square", "Perfect square trinomials", "Vertex form"],
        25: ["Quadratic formula", "Discriminant", "Nature of solutions"],
        
        # Unit 7: Statistics
        26: ["Descriptive statistics", "Measures of center and spread", "Data distributions"],
        27: ["Comparing data sets", "Box plots", "Statistical inference"],
        28: ["Two-way frequency tables", "Conditional probability", "Independence"]
    }
    return concepts_map.get(lesson_num, [])

if __name__ == "__main__":
    extract_algebra1_complete_curriculum()
