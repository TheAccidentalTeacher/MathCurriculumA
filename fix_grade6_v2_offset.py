#!/usr/bin/env python3
"""
Script to test different offsets for Grade 6 Volume 2 by checking actual PNG content.
Since text extraction is incomplete, we'll work backwards from what we know.
"""

def check_original_v2_boundaries():
    """Check what the original Volume 2 boundaries were before offset."""
    
    print("🔍 ORIGINAL GRADE 6 VOLUME 2 BOUNDARIES (before offset)")
    print("="*60)
    
    # These would be the original table-of-contents page numbers
    # Let's reverse-engineer from current boundaries
    original_boundaries = {
        15: "around page 33 (357-12=345, but let's check earlier)",
        16: "around page 45", 
        17: "around page 57",
        18: "around page 65"
    }
    
    print("If Volume 2 has its own front matter, Lesson 15 might actually start much earlier")
    print("Let's check pages 10-50 to see what's actually there")
    
    return original_boundaries

def test_volume2_offset_candidates():
    """Test different possible offsets for Volume 2."""
    
    print(f"\n🧪 TESTING DIFFERENT VOLUME 2 OFFSETS")
    print("="*60)
    
    # Read current Volume 2 boundaries
    service_file = 'src/lib/database-free-lesson-service.ts'
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    import re
    # Find current Lesson 15 start page
    match = re.search(r"15:\s*\{\s*start:\s*(\d+)", content)
    if match:
        current_start = int(match.group(1))
        print(f"📊 Current Lesson 15 starts at PNG page: {current_start}")
        
        # If we applied +12 offset, the original would be:
        original_start = current_start - 12
        print(f"📋 Original table-of-contents said: page {original_start}")
        
        # Test different offsets
        test_offsets = [0, 5, 8, 10, 12, 15, 20]
        
        print(f"\n🔍 Testing different offsets for Lesson 15:")
        for offset in test_offsets:
            test_page = original_start + offset
            print(f"  Offset +{offset:2d}: PNG page {test_page:3d} (original {original_start} + {offset})")
        
        return original_start, current_start
    
    return None, None

def create_volume2_offset_tester():
    """Create a script to manually test Volume 2 offsets."""
    
    print(f"\n🔧 CREATING VOLUME 2 OFFSET CORRECTION SCRIPT")
    print("="*60)
    
    original_start, current_start = test_volume2_offset_candidates()
    
    if original_start:
        print(f"\nBased on analysis:")
        print(f"  📖 Original Lesson 15 was listed at textbook page {original_start}")
        print(f"  📄 Currently mapped to PNG page {current_start}")
        print(f"  🔧 Current offset appears to be +12 (same as Volume 1)")
        
        print(f"\n💡 Hypothesis:")
        print(f"  - Volume 2 might have DIFFERENT front matter than Volume 1")
        print(f"  - Volume 2 might need a DIFFERENT offset (not +12)")
        print(f"  - Volume 2 is a separate PDF with its own page numbering")
        
        # Let's check if Volume 2 needs a different offset
        # We need to find where Lesson 15 actually appears
        
        print(f"\n🎯 RECOMMENDATION:")
        print(f"  1. Manually test /lesson/RCM06_NA_SW_V2/15")
        print(f"  2. If it shows wrong content, try different offsets")
        print(f"  3. Look for the 'Dear Family' letter for Lesson 15")
        
        return True
    
    return False

def apply_custom_v2_offset(new_offset):
    """Apply a custom offset specifically to Volume 2."""
    
    print(f"\n🔧 APPLYING CUSTOM OFFSET (+{new_offset}) TO VOLUME 2 ONLY")
    print("="*60)
    
    service_file = 'src/lib/database-free-lesson-service.ts'
    
    # Read the file
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the Volume 2 section
    import re
    v2_pattern = r"('RCM06_NA_SW_V2':\s*\{)(.*?)(\s*\},)"
    v2_match = re.search(v2_pattern, content, re.DOTALL)
    
    if v2_match:
        v2_content = v2_match.group(2)
        
        # Extract current lessons and apply new offset
        lesson_pattern = r'(\d+):\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*([\'"].*?[\'"])'
        lessons = re.findall(lesson_pattern, v2_content)
        
        # Calculate new boundaries
        new_v2_content = "\n"
        changes_made = 0
        
        for lesson_num, start_page, end_page, title in lessons:
            # Remove current offset (+12) and apply new offset
            original_start = int(start_page) - 12
            original_end = int(end_page) - 12
            
            new_start = original_start + new_offset
            new_end = original_end + new_offset
            
            new_v2_content += f"      {lesson_num}: {{ start: {new_start}, end: {new_end}, title: {title} }},\n"
            
            print(f"  Lesson {lesson_num}: {start_page}-{end_page} → {new_start}-{new_end}")
            changes_made += 1
        
        # Replace the Volume 2 section
        new_v2_section = v2_match.group(1) + new_v2_content + "    " + v2_match.group(3)
        new_content = content.replace(v2_match.group(0), new_v2_section)
        
        # Write back
        with open(service_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"\n✅ Applied offset +{new_offset} to {changes_made} Volume 2 lessons")
        print(f"✅ Updated {service_file}")
        
        return True
    
    return False

if __name__ == "__main__":
    print("🔍 GRADE 6 VOLUME 2 OFFSET ANALYSIS")
    print("="*60)
    
    check_original_v2_boundaries()
    success = create_volume2_offset_tester()
    
    if success:
        print(f"\n" + "="*60)
        print(f"🎯 NEXT STEPS:")
        print(f"="*60)
        print(f"1. Test current Volume 2: /lesson/RCM06_NA_SW_V2/15")
        print(f"2. If wrong content, try different offset:")
        print(f"   python -c \"")
        print(f"   from analyze_grade6_v2 import apply_custom_v2_offset")
        print(f"   apply_custom_v2_offset(15)  # Try +15 instead of +12")
        print(f"   \"")
        print(f"3. Test again until Lesson 15 shows correct content")
        print(f"4. Once working, test a few more lessons to confirm")
