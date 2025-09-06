import json
import re
import os

def extract_grade7_complete_curriculum():
    """Extract complete Grade 7 curriculum with proper unit organization"""
    
    base_path = r"c:\Users\scoso\MathCurriculum\MathCurriculumA\webapp_pages"
    
    volumes = {
        "Volume 1": f"{base_path}/RCM07_NA_SW_V1/data/document.json",
        "Volume 2": f"{base_path}/RCM07_NA_SW_V2/data/document.json"
    }
    
    # Define the complete Grade 7 curriculum structure based on contents pages
    grade7_structure = {
        "grade": 7,
        "title": "Ready Classroom Mathematics Grade 7",
        "total_pages": 0,
        "total_lessons": 33,
        "volumes": {
            "Volume 1": {
                "units": [
                    {
                        "unit_number": 1,
                        "title": "Proportional Relationships: Ratios, Rates, and Circles",
                        "lessons": [1, 2, 3, 4, 5, 6],
                        "description": "Scale drawings, unit rates with fractions, proportional relationships, circles"
                    },
                    {
                        "unit_number": 2, 
                        "title": "Numbers and Operations: Add and Subtract Rational Numbers",
                        "lessons": [7, 8, 9, 10],
                        "description": "Adding and subtracting positive and negative numbers"
                    },
                    {
                        "unit_number": 3,
                        "title": "Numbers and Operations: Multiply and Divide Rational Numbers", 
                        "lessons": [11, 12, 13, 14],
                        "description": "Multiplying and dividing with negative numbers, rational number operations"
                    },
                    {
                        "unit_number": 4,
                        "title": "Algebraic Thinking: Expressions, Equations, and Inequalities",
                        "lessons": [15, 16, 17, 18, 19],
                        "description": "Equivalent expressions, multi-step equations, inequalities"
                    }
                ]
            },
            "Volume 2": {
                "units": [
                    {
                        "unit_number": 5,
                        "title": "Proportional Reasoning: Percents and Statistical Samples",
                        "lessons": [20, 21, 22, 23, 24],
                        "description": "Percent problems, percent change, random sampling, population comparison"
                    },
                    {
                        "unit_number": 6,
                        "title": "Geometry: Solids, Triangles, and Angles",
                        "lessons": [25, 26, 27, 28, 29],
                        "description": "Area, surface area, volume, plane sections, angles, drawing figures"
                    },
                    {
                        "unit_number": 7,
                        "title": "Probability: Theoretical and Experimental Probability",
                        "lessons": [30, 31, 32, 33],
                        "description": "Understanding probability, experimental probability, probability models, compound events"
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
        "grade": 7,
        "title": "Ready Classroom Mathematics Grade 7",
        "curriculum_publisher": "Curriculum Associates",
        "curriculum_type": "Complete Mathematics Program",
        "total_pages": 944,  # 504 + 440
        "total_lessons": 33,
        "total_units": 7,
        "volumes": {}
    }
    
    for volume_name, volume_structure in grade7_structure["volumes"].items():
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
    output_file = "GRADE7_COMPLETE_CURRICULUM_STRUCTURE.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(complete_curriculum, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print(f"\n" + "="*80)
    print(f"GRADE 7 READY CLASSROOM MATHEMATICS - COMPLETE CURRICULUM")
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
    """Map lessons to their primary Common Core standards"""
    standards_map = {
        1: ["7.G.1"], 2: ["7.RP.1"], 3: ["7.RP.2"], 4: ["7.RP.2"], 5: ["7.RP.3"], 6: ["7.G.4"],
        7: ["7.NS.1"], 8: ["7.NS.1"], 9: ["7.NS.1"], 10: ["7.NS.1"], 
        11: ["7.NS.2"], 12: ["7.NS.2"], 13: ["7.NS.2"], 14: ["7.NS.3"],
        15: ["7.EE.1"], 16: ["7.EE.1"], 17: ["7.EE.4"], 18: ["7.EE.4"], 19: ["7.EE.4"],
        20: ["7.RP.3"], 21: ["7.RP.3"], 22: ["7.SP.1"], 23: ["7.SP.1"], 24: ["7.SP.4"],
        25: ["7.G.6"], 26: ["7.G.6"], 27: ["7.G.3"], 28: ["7.G.5"], 29: ["7.G.2"],
        30: ["7.SP.5"], 31: ["7.SP.6"], 32: ["7.SP.7"], 33: ["7.SP.8"]
    }
    return standards_map.get(lesson_num, [])

def get_key_concepts_for_lesson(lesson_num):
    """Define key mathematical concepts for each lesson"""
    concepts_map = {
        1: ["Scale drawings", "Proportional reasoning", "Similar figures"],
        2: ["Unit rates", "Ratios with fractions", "Complex fractions"],
        3: ["Proportional relationships", "Constant of proportionality"],
        4: ["Representing proportions", "Tables, graphs, equations"],
        5: ["Solving proportion problems", "Real-world applications"],
        6: ["Area of circles", "Circumference", "π (pi)"],
        7: ["Adding integers", "Number line", "Absolute value"],
        8: ["Adding negative numbers", "Integer operations"],
        9: ["Subtracting integers", "Relationship to addition"],
        10: ["Operations with rational numbers", "Problem solving"],
        11: ["Multiplying integers", "Sign rules"],
        12: ["Multiplying and dividing rational numbers"],
        13: ["Decimal representations", "Terminating vs repeating"],
        14: ["Four operations with rational numbers"],
        15: ["Equivalent expressions", "Distributive property"],
        16: ["Reasons for rewriting expressions"],
        17: ["Multi-step equations", "Solution strategies"],
        18: ["Writing and solving equations"],
        19: ["Inequalities", "Solution sets"],
        20: ["Percent problems", "Part-whole relationships"],
        21: ["Percent change", "Percent error"],
        22: ["Random sampling", "Representative samples"],
        23: ["Reasoning about samples", "Inference"],
        24: ["Comparing populations", "Statistical measures"],
        25: ["Area and surface area", "3D figures"],
        26: ["Volume", "Cubic units"],
        27: ["Plane sections", "Cross-sections"],
        28: ["Angle relationships", "Supplementary and complementary"],
        29: ["Drawing geometric figures", "Constructions"],
        30: ["Probability concepts", "Theoretical probability"],
        31: ["Experimental probability", "Data collection"],
        32: ["Probability models", "Compound events"],
        33: ["Compound events", "Tree diagrams", "Sample spaces"]
    }
    return concepts_map.get(lesson_num, [])

if __name__ == "__main__":
    extract_grade7_complete_curriculum()
