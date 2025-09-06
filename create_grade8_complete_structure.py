import json
import re
import os

def extract_grade8_complete_curriculum():
    """Extract complete Grade 8 curriculum with proper unit organization"""
    
    base_path = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\webapp_pages"
    
    volumes = {
        "Volume 1": f"{base_path}/RCM08_NA_SW_V1/data/document.json",
        "Volume 2": f"{base_path}/RCM08_NA_SW_V2/data/document.json"
    }
    
    # Define the complete Grade 8 curriculum structure based on contents analysis
    grade8_structure = {
        "grade": 8,
        "title": "Ready Classroom Mathematics Grade 8",
        "total_pages": 0,
        "total_lessons": 32,
        "volumes": {
            "Volume 1": {
                "units": [
                    {
                        "unit_number": 1,
                        "title": "Geometric Figures: Rigid Transformations and Congruence",
                        "lessons": [1, 2, 3],
                        "description": "Transformations, congruence, coordinate plane"
                    },
                    {
                        "unit_number": 2, 
                        "title": "Geometric Figures: Transformations, Similarity, and Angle Relationships",
                        "lessons": [4, 5, 6, 7],
                        "description": "Dilations, similarity, angle relationships, triangles"
                    },
                    {
                        "unit_number": 3,
                        "title": "Linear Relationships: Slope, Linear Equations, and Systems", 
                        "lessons": [8, 9, 10, 11, 12, 13, 14],
                        "description": "Slope, linear equations, systems of equations"
                    },
                    {
                        "unit_number": 4,
                        "title": "Linear and Nonlinear Relationships: Functions",
                        "lessons": [15, 16, 17, 18],
                        "description": "Functions, modeling relationships, functional analysis"
                    }
                ]
            },
            "Volume 2": {
                "units": [
                    {
                        "unit_number": 5,
                        "title": "Integer Exponents: Properties and Scientific Notation",
                        "lessons": [19, 20, 21, 22],
                        "description": "Exponent properties, scientific notation, powers of 10"
                    },
                    {
                        "unit_number": 6,
                        "title": "The Real Number System: Rational and Irrational Numbers",
                        "lessons": [23, 24, 25],
                        "description": "Square roots, cube roots, rational approximations, Pythagorean theorem"
                    },
                    {
                        "unit_number": 7,
                        "title": "The Real Number System: The Pythagorean Theorem",
                        "lessons": [26, 27],
                        "description": "Pythagorean theorem applications, real-world problems"
                    },
                    {
                        "unit_number": 8,
                        "title": "Measurement and Geometry: Volume and Surface Area",
                        "lessons": [28],
                        "description": "Cylinders, cones, spheres volume calculations"
                    },
                    {
                        "unit_number": 9,
                        "title": "Two-Variable Data and Fitting a Linear Model",
                        "lessons": [29, 30, 31, 32],
                        "description": "Scatter plots, linear models, two-way tables, data analysis"
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
            
            # Look for lesson headers
            lesson_match = re.search(r'LESSON (\d+)\s+([^"]*?)(?:\s+LESSON \d+|\s+Dear Family|\s+Previously|\s+Look Back|\s+Prepare for|\s+Develop|\s+Practice|\s+$)', text_preview)
            
            if lesson_match:
                lesson_num = int(lesson_match.group(1))
                lesson_title = lesson_match.group(2).strip()
                
                # Clean up common patterns
                lesson_title = re.sub(r'\s+(Use the next page|Study the Example|Read and try).*$', '', lesson_title)
                lesson_title = re.sub(r'\s+LESSON.*$', '', lesson_title)
                lesson_title = lesson_title.strip()
                
                if lesson_num not in lesson_details and lesson_title and len(lesson_title) > 8:
                    lesson_details[lesson_num] = {
                        "lesson_number": lesson_num,
                        "title": lesson_title,
                        "volume": volume_name,
                        "start_page": page_num,
                        "page_id": page.get('page_id', f'page_{page_num}')
                    }
    
    # Now build the complete curriculum with lesson details
    complete_curriculum = {
        "grade": 8,
        "title": "Ready Classroom Mathematics Grade 8",
        "curriculum_publisher": "Curriculum Associates",
        "curriculum_type": "Complete Mathematics Program",
        "total_pages": 1008,  # 552 + 456
        "total_lessons": 32,
        "total_units": 9,
        "volumes": {}
    }
    
    for volume_name, volume_structure in grade8_structure["volumes"].items():
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
                        "standards_focus": get_standards_for_lesson(lesson_num),
                        "key_concepts": get_key_concepts_for_lesson(lesson_num)
                    })
            
            volume_data["units"].append(unit_data)
        
        complete_curriculum["volumes"][volume_name] = volume_data
    
    # Save the complete curriculum analysis
    output_file = "GRADE8_COMPLETE_CURRICULUM_STRUCTURE.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(complete_curriculum, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n" + "="*80)
    print(f"GRADE 8 READY CLASSROOM MATHEMATICS - COMPLETE CURRICULUM")
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

def get_standards_for_lesson(lesson_num):
    """Map lessons to their primary Common Core standards for Grade 8"""
    standards_map = {
        # Unit 1: Transformations and Congruence
        1: ["8.G.1"], 2: ["8.G.2"], 3: ["8.G.2"], 
        # Unit 2: Similarity and Angles
        4: ["8.G.3"], 5: ["8.G.4"], 6: ["8.G.5"], 7: ["8.G.5"],
        # Unit 3: Linear Equations and Systems
        8: ["8.EE.5"], 9: ["8.EE.6"], 10: ["8.EE.7"], 11: ["8.EE.7"], 12: ["8.EE.8"], 13: ["8.EE.8"], 14: ["8.EE.8"],
        # Unit 4: Functions
        15: ["8.F.1"], 16: ["8.F.2"], 17: ["8.F.3"], 18: ["8.F.5"],
        # Unit 5: Exponents and Scientific Notation
        19: ["8.EE.1"], 20: ["8.EE.1"], 21: ["8.EE.3"], 22: ["8.EE.4"],
        # Unit 6: Real Numbers
        23: ["8.EE.2"], 24: ["8.NS.1"], 25: ["8.NS.2"],
        # Unit 7: Pythagorean Theorem
        26: ["8.G.6"], 27: ["8.G.7"],
        # Unit 8: Volume
        28: ["8.G.9"],
        # Unit 9: Data Analysis
        29: ["8.SP.1"], 30: ["8.SP.2"], 31: ["8.SP.4"], 32: ["8.SP.4"]
    }
    return standards_map.get(lesson_num, [])

def get_key_concepts_for_lesson(lesson_num):
    """Define key mathematical concepts for each Grade 8 lesson"""
    concepts_map = {
        # Transformations and Congruence
        1: ["Rigid transformations", "Properties of transformations", "Coordinate plane"],
        2: ["Single transformations", "Reflections, rotations, translations"],
        3: ["Sequence of transformations", "Congruence", "Composite transformations"],
        
        # Similarity and Angles
        4: ["Dilations", "Similarity", "Scale factors"],
        5: ["Transformation sequences with dilations", "Similar figures"],
        6: ["Angle relationships", "Vertical angles", "Linear pairs"],
        7: ["Triangle angle relationships", "Interior and exterior angles"],
        
        # Linear Equations and Systems
        8: ["Proportional relationships", "Slope", "Rate of change"],
        9: ["Linear equations", "y = mx + b form", "Slope-intercept"],
        10: ["Solving linear equations", "One variable", "Solution methods"],
        11: ["Number of solutions", "Infinite, one, or no solution"],
        12: ["Systems of equations", "Graphical solutions"],
        13: ["Algebraic methods", "Substitution", "Elimination"],
        14: ["Real-world applications", "System modeling"],
        
        # Functions
        15: ["Function definition", "Input-output relationships"],
        16: ["Linear functions", "Function notation"],
        17: ["Multiple representations", "Tables, graphs, equations"],
        18: ["Qualitative analysis", "Increasing, decreasing, constant"],
        
        # Exponents and Scientific Notation
        19: ["Exponent properties", "Product rule", "Quotient rule"],
        20: ["Integer exponents", "Negative exponents", "Zero exponent"],
        21: ["Powers of 10", "Scientific notation basics"],
        22: ["Scientific notation", "Operations", "Real-world applications"],
        
        # Real Numbers
        23: ["Square roots", "Cube roots", "Perfect squares and cubes"],
        24: ["Rational numbers", "Decimal representations"],
        25: ["Irrational numbers", "Rational approximations"],
        
        # Pythagorean Theorem
        26: ["Pythagorean theorem", "Right triangles", "Converse"],
        27: ["Applications", "Distance formula", "Real-world problems"],
        
        # Volume
        28: ["Volume formulas", "Cylinders, cones, spheres"],
        
        # Data Analysis
        29: ["Scatter plots", "Linear associations", "Outliers"],
        30: ["Linear models", "Line of best fit", "Predictions"],
        31: ["Two-way tables", "Frequency tables"],
        32: ["Interpreting two-way tables", "Associations"]
    }
    return concepts_map.get(lesson_num, [])

if __name__ == "__main__":
    extract_grade8_complete_curriculum()
