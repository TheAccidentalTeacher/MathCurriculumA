#!/usr/bin/env python3

# SYSTEMATIC ANALYSIS: Why Grade 6 Volume 2 doesn't work like the others
# Let's compare what works vs what doesn't

def analyze_systematic_differences():
    print("🔍 SYSTEMATIC ANALYSIS: Grade 6 Volume 2 Problem")
    print("=" * 60)
    print()
    
    # WORKING EXAMPLES (according to user)
    print("✅ WORKING EXAMPLES:")
    print()
    
    # Grade 6 Volume 1 (with +12 offset applied, works perfectly)
    g6v1_original = {1: 3, 2: 19, 3: 41, 4: 63, 5: 85, 6: 107, 7: 145, 8: 167}
    g6v1_current = {1: 15, 2: 31, 3: 53, 4: 75, 5: 97, 6: 119, 7: 157, 8: 179}
    print("Grade 6 Volume 1:")
    print("  Original start pages:", list(g6v1_original.values())[:5])
    print("  Current PNG start:", list(g6v1_current.values())[:5]) 
    print("  Applied offset: +12")
    print("  Result: WORKS PERFECTLY ✅")
    print()
    
    # Grade 7 Volume 1 (works perfectly - no offset needed)
    g7v1_current = {1: 15, 2: 43, 3: 59, 4: 71, 5: 93}
    print("Grade 7 Volume 1:")
    print("  PNG start pages:", list(g7v1_current.values()))
    print("  Applied offset: None (original boundaries work)")
    print("  Result: WORKS PERFECTLY ✅")
    print()
    
    # PROBLEM CASE
    print("❌ PROBLEM CASE:")
    print()
    
    # Grade 6 Volume 2 original boundaries
    g6v2_original = {
        15: 345, 16: 357, 17: 385, 18: 397, 19: 435, 20: 463, 
        21: 475, 22: 503, 23: 541, 24: 553, 25: 569, 26: 581, 
        27: 609, 28: 621, 29: 659, 30: 671, 31: 693, 32: 715, 33: 737
    }
    
    # Current boundaries (after our fixes)
    g6v2_current = {
        19: 19, 20: 47, 21: 59, 22: 87, 23: 125, 24: 137, 
        25: 153, 26: 165, 27: 193, 28: 205, 29: 243, 30: 255, 
        31: 277, 32: 299, 33: 321
    }
    
    print("Grade 6 Volume 2:")
    print("  Original textbook pages:", [g6v2_original[i] for i in [27, 30, 33]])
    print("  Current PNG start:", [g6v2_current[i] for i in [27, 30, 33]])
    print("  Applied offset: -416 (textbook_page - 416 = PNG)")
    print("  Result: STILL NOT WORKING ❌")
    print()
    
    # CRITICAL INSIGHT ANALYSIS
    print("🧠 CRITICAL INSIGHTS:")
    print()
    
    print("1. PATTERN RECOGNITION:")
    print("   - Grade 6 Vol 1: Textbook pages 3,19,41... -> PNGs 15,31,53... (+12 offset)")
    print("   - Grade 7 Vol 1: Original boundaries work directly (no offset needed)")
    print("   - Grade 6 Vol 2: Textbook pages 345,357,385... -> PNG ranges ???")
    print()
    
    print("2. THE CORE QUESTION:")
    print("   Why do Grades 7-8 work without any offset adjustments?")
    print("   What makes Grade 6 Volume 2 different?")
    print()
    
    print("3. HYPOTHESIS:")
    print("   - Maybe Grade 6 Vol 2 boundaries were wrong from the start")
    print("   - Maybe there's a different document/PNG mapping for Grade 6 Vol 2")
    print("   - Maybe we need to check if there are different PNG files for Grade 6 Vol 2")
    print()
    
    # USER'S SPECIFIC FEEDBACK
    print("🎯 USER'S SPECIFIC FEEDBACK:")
    print("   - 'Lesson 30 should start at page 253 but shows PNG 255'")
    print("   - 'This works perfectly for 6 vol 1 and 7 vol 1 and 2 and 8 vol 1 and 2'")
    print("   - 'but not vol 2 of grade 6'")
    print()
    
    # NEXT INVESTIGATION STEPS
    print("🔍 SYSTEMATIC INVESTIGATION NEEDED:")
    print("1. Check what PNG files actually exist for Grade 6 Volume 2")
    print("2. Compare how Grades 7-8 lesson boundaries were originally set")
    print("3. Verify if there's a different document.json for Grade 6 Vol 2")
    print("4. Test a single lesson boundary manually to understand the mapping")
    print()
    
    print("🚨 RECOMMENDATION: Let's step back and investigate the fundamentals")
    print("   instead of applying more offset calculations.")

if __name__ == "__main__":
    analyze_systematic_differences()
