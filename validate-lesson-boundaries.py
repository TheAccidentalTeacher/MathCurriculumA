#!/usr/bin/env python3

import json
import os

def validate_lesson_boundaries():
    """Check if current lesson boundaries match expected accelerated pathway structure"""
    
    # Current lesson boundaries from DatabaseFreeLessonService
    current_boundaries = {
        'RCM07_NA_SW_V1': {
            1: { 'start': 15, 'end': 42, 'title': 'Solve Problems Involving Scale' },
            2: { 'start': 43, 'end': 58, 'title': 'Find Unit Rates Involving Ratios of Fractions' },
            3: { 'start': 59, 'end': 70, 'title': 'Understand Proportional Relationships' },
            4: { 'start': 71, 'end': 92, 'title': 'Represent Proportional Relationships' },
            5: { 'start': 93, 'end': 108, 'title': 'Solve Proportional Relationship Problems' },
            6: { 'start': 109, 'end': 148, 'title': 'Solve Area and Circumference Problems Involving Circles' },
            7: { 'start': 149, 'end': 160, 'title': 'Understand Addition with Negative Integers' },
            8: { 'start': 161, 'end': 182, 'title': 'Add with Negative Numbers' },
            9: { 'start': 183, 'end': 194, 'title': 'Understand Subtraction with Negative Integers' },
            10: { 'start': 195, 'end': 234, 'title': 'Add and Subtract Positive and Negative Numbers' },
            11: { 'start': 235, 'end': 246, 'title': 'Understand Multiplication with Negative Integers' },
            12: { 'start': 247, 'end': 268, 'title': 'Multiply and Divide with Negative Numbers' },
            13: { 'start': 269, 'end': 290, 'title': 'Express Rational Numbers as Terminating or Repeating Decimals' },
            14: { 'start': 291, 'end': 324, 'title': 'Use the Four Operations with Negative Numbers' },
            15: { 'start': 325, 'end': 346, 'title': 'Write Equivalent Expressions Involving Rational Numbers' },
            16: { 'start': 347, 'end': 358, 'title': 'Understand Reasons for Rewriting Expressions' },
            17: { 'start': 359, 'end': 370, 'title': 'Understand Multi-Step Equations' },
            18: { 'start': 371, 'end': 392, 'title': 'Write and Solve Multi-Step Equations' },
            19: { 'start': 393, 'end': 504, 'title': 'Write and Solve Inequalities' }
        },
        'RCM07_NA_SW_V2': {
            20: { 'start': 15, 'end': 42, 'title': 'Solve Problems Involving Percents' },
            21: { 'start': 43, 'end': 64, 'title': 'Solve Problems Involving Percent Change and Percent Error' },
            22: { 'start': 65, 'end': 76, 'title': 'Understand Random Sampling' },
            23: { 'start': 77, 'end': 98, 'title': 'Reason About Random Samples' },
            24: { 'start': 99, 'end': 138, 'title': 'Compare Populations' },
            25: { 'start': 139, 'end': 166, 'title': 'Solve Problems Involving Area and Surface Area' },
            26: { 'start': 167, 'end': 188, 'title': 'Solve Problems Involving Volume' },
            27: { 'start': 189, 'end': 204, 'title': 'Describe Plane Sections of Three-Dimensional Figures' },
            28: { 'start': 205, 'end': 226, 'title': 'Find Unknown Angle Measures' },
            29: { 'start': 227, 'end': 272, 'title': 'Draw Plane Figures with Given Conditions' },
            30: { 'start': 273, 'end': 284, 'title': 'Understand Probability' },
            31: { 'start': 285, 'end': 306, 'title': 'Solve Problems Involving Experimental Probability' },
            32: { 'start': 307, 'end': 328, 'title': 'Solve Problems Involving Probability Models' },
            33: { 'start': 329, 'end': 440, 'title': 'Solve Problems Involving Compound Events' }
        },
        'RCM08_NA_SW_V1': {
            1: { 'start': 15, 'end': 26, 'title': 'Understand Rigid Transformations and Their Properties' },
            2: { 'start': 27, 'end': 54, 'title': 'Work with Single Rigid Transformations in the Coordinate Plane' },
            3: { 'start': 55, 'end': 94, 'title': 'Work with Sequences of Transformations and Congruence' },
            4: { 'start': 95, 'end': 106, 'title': 'Understand Dilations and Similarity' },
            5: { 'start': 107, 'end': 128, 'title': 'Perform and Describe Transformations Involving Dilations' },
            6: { 'start': 129, 'end': 150, 'title': 'Describe Angle Relationships' },
            7: { 'start': 151, 'end': 190, 'title': 'Describe Angle Relationships in Triangles' },
            8: { 'start': 191, 'end': 212, 'title': 'Graph Proportional Relationships and Define Slope' },
            9: { 'start': 213, 'end': 240, 'title': 'Derive and Graph Linear Equations of the Form y = mx + b' },
            10: { 'start': 241, 'end': 262, 'title': 'Solve Linear Equations in One Variable' },
            11: { 'start': 263, 'end': 284, 'title': 'Determine the Number of Solutions to One-Variable Equations' },
            12: { 'start': 285, 'end': 296, 'title': 'Understand Systems of Linear Equations in Two Variables' },
            13: { 'start': 297, 'end': 324, 'title': 'Solve Systems of Linear Equations Algebraically' },
            14: { 'start': 325, 'end': 364, 'title': 'Represent and Solve Problems with Systems of Linear Equations' },
            15: { 'start': 365, 'end': 376, 'title': 'Understand Functions' },
            16: { 'start': 377, 'end': 404, 'title': 'Use Functions to Model Linear Relationships' },
            17: { 'start': 405, 'end': 426, 'title': 'Compare Different Representations of Functions' },
            18: { 'start': 427, 'end': 552, 'title': 'Analyze Functional Relationships Qualitatively' }
        },
        'RCM08_NA_SW_V2': {
            19: { 'start': 15, 'end': 36, 'title': 'Apply Exponent Properties for Positive Integer Exponents' },
            20: { 'start': 37, 'end': 58, 'title': 'Apply Exponent Properties for All Integer Exponents' },
            21: { 'start': 59, 'end': 80, 'title': 'Express Numbers Using Integer Powers of 10' },
            22: { 'start': 81, 'end': 126, 'title': 'Work with Scientific Notation' },
            23: { 'start': 127, 'end': 148, 'title': 'Find Square Roots and Cube Roots to Solve Problems' },
            24: { 'start': 149, 'end': 164, 'title': 'Express Rational Numbers as Fractions and Decimals' },
            25: { 'start': 165, 'end': 186, 'title': 'Find Rational Approximations of Irrational Numbers' },
            26: { 'start': 187, 'end': 198, 'title': 'Understand the Pythagorean Theorem and Its Converse' },
            27: { 'start': 199, 'end': 226, 'title': 'Apply the Pythagorean Theorem' },
            28: { 'start': 227, 'end': 266, 'title': 'Solve Problems with Volumes of Cylinders, Cones, and Spheres' },
            29: { 'start': 267, 'end': 294, 'title': 'Analyze Scatter Plots and Fit a Linear Model to Data' },
            30: { 'start': 295, 'end': 316, 'title': 'Write and Analyze an Equation for Fitting a Linear Model' },
            31: { 'start': 317, 'end': 328, 'title': 'Understand Two-Way Tables' },
            32: { 'start': 329, 'end': 456, 'title': 'Construct and Interpret Two-Way Tables' }
        }
    }
    
    # Expected accelerated pathway unit organization (based on curriculum structure)
    expected_units = {
        'RCM07_NA_SW_V1': {
            'Unit 1 - Proportional Relationships': [1, 2, 3, 4, 5, 6],
            'Unit 2 - Rational Number Operations': [7, 8, 9, 10, 11, 12, 13], 
            'Unit 3 - Expressions and Equations': [14, 15, 16, 17, 18, 19]
        },
        'RCM07_NA_SW_V2': {
            'Unit 4 - Percent and Proportional Relationships': [20, 21],
            'Unit 5 - Sampling and Statistical Inference': [22, 23, 24],
            'Unit 6 - Geometric Applications': [25, 26, 27, 28, 29],
            'Unit 7 - Statistics and Probability': [30, 31, 32, 33]
        },
        'RCM08_NA_SW_V1': {
            'Unit 1 - Transformations and Angle Relationships': [1, 2, 3, 4, 5, 6, 7],
            'Unit 2 - Linear Relationships': [8, 9, 10, 11, 12, 13, 14],
            'Unit 3 - Functions': [15, 16, 17, 18]
        },
        'RCM08_NA_SW_V2': {
            'Unit 4 - Exponents and Scientific Notation': [19, 20, 21, 22, 23, 24, 25],
            'Unit 5 - Pythagorean Theorem and Geometry': [26, 27, 28],
            'Unit 6 - Statistics and Data Analysis': [29, 30, 31, 32]
        }
    }
    
    print("🔍 VALIDATING LESSON BOUNDARIES AGAINST EXPECTED UNIT STRUCTURE")
    print("="*70)
    
    total_issues = 0
    total_lessons = 0
    
    for volume_id in current_boundaries:
        volume_name = {
            'RCM07_NA_SW_V1': 'Grade 7 Volume 1',
            'RCM07_NA_SW_V2': 'Grade 7 Volume 2',
            'RCM08_NA_SW_V1': 'Grade 8 Volume 1',
            'RCM08_NA_SW_V2': 'Grade 8 Volume 2'
        }[volume_id]
        
        print(f"\n📚 {volume_name} ({volume_id})")
        print("-" * 50)
        
        current_lessons = current_boundaries[volume_id]
        expected_units_vol = expected_units[volume_id]
        
        total_lessons += len(current_lessons)
        
        # Check each expected unit
        for unit_name, expected_lesson_numbers in expected_units_vol.items():
            print(f"\n🎯 {unit_name}")
            print(f"   Expected lessons: {expected_lesson_numbers}")
            
            unit_issues = []
            
            # Check if lessons exist and have reasonable boundaries
            for lesson_num in expected_lesson_numbers:
                if lesson_num not in current_lessons:
                    unit_issues.append(f"Missing Lesson {lesson_num}")
                else:
                    lesson = current_lessons[lesson_num]
                    pages = lesson['end'] - lesson['start'] + 1
                    
                    # Flag potential issues
                    if pages < 5:
                        unit_issues.append(f"L{lesson_num}: Too short ({pages} pages)")
                    elif pages > 200:
                        unit_issues.append(f"L{lesson_num}: Too long ({pages} pages)")
                    
                    if lesson['start'] > lesson['end']:
                        unit_issues.append(f"L{lesson_num}: Invalid range ({lesson['start']}-{lesson['end']})")
            
            # Check for lesson sequence gaps
            for i in range(len(expected_lesson_numbers) - 1):
                current_lesson = expected_lesson_numbers[i]
                next_lesson = expected_lesson_numbers[i + 1]
                
                if current_lesson in current_lessons and next_lesson in current_lessons:
                    current_end = current_lessons[current_lesson]['end']
                    next_start = current_lessons[next_lesson]['start']
                    
                    if current_end + 1 != next_start:
                        gap = next_start - current_end - 1
                        unit_issues.append(f"Gap between L{current_lesson} and L{next_lesson}: {gap} pages")
            
            # Display results
            if unit_issues:
                total_issues += len(unit_issues)
                print(f"   ⚠️  Issues found: {len(unit_issues)}")
                for issue in unit_issues:
                    print(f"      - {issue}")
            else:
                print(f"   ✅ No issues found")
            
            # Show actual lesson details
            print(f"   📖 Actual lessons:")
            for lesson_num in expected_lesson_numbers:
                if lesson_num in current_lessons:
                    lesson = current_lessons[lesson_num]
                    pages = lesson['end'] - lesson['start'] + 1
                    print(f"      L{lesson_num:2d}: pages {lesson['start']:3d}-{lesson['end']:3d} ({pages:2d} pages) - {lesson['title']}")
                else:
                    print(f"      L{lesson_num:2d}: ❌ MISSING")
    
    print("\n" + "="*70)
    print(f"📊 SUMMARY:")
    print(f"   Total lessons checked: {total_lessons}")
    print(f"   Issues found: {total_issues}")
    
    if total_issues == 0:
        print(f"   ✅ ALL LESSON BOUNDARIES ARE PROPERLY ALIGNED!")
    else:
        print(f"   ⚠️  {total_issues} issues need attention")
    
    return total_issues == 0

if __name__ == "__main__":
    validate_lesson_boundaries()
