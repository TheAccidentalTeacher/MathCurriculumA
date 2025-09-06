#!/usr/bin/env python3
"""
Quick script to test different offsets for Grade 6 Volume 2.
We'll try several offset values and you can test them.
"""

def apply_volume2_offset(new_offset):
    """Apply a specific offset to Volume 2 only."""
    
    print(f"🔧 APPLYING OFFSET +{new_offset} TO GRADE 6 VOLUME 2")
    print("="*50)
    
    service_file = 'src/lib/database-free-lesson-service.ts'
    
    # Read the file
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Process line by line to target Volume 2 only
    lines = content.split('\n')
    updated_lines = []
    
    in_v2_section = False
    changes_made = 0
    
    for line in lines:
        # Check if we're entering Volume 2 section
        if "'RCM06_NA_SW_V2'" in line:
            in_v2_section = True
            updated_lines.append(line)
            continue
        
        # Check if we're leaving Volume 2 section
        if in_v2_section and line.strip().startswith("'RCM0") and "RCM06_NA_SW_V2" not in line:
            in_v2_section = False
        
        # If we're in Volume 2 section and this line has start/end values
        if in_v2_section and 'start:' in line and 'end:' in line:
            import re
            match = re.search(r'(\d+):\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*([\'"].*?[\'"])', line)
            if match:
                lesson_num = match.group(1)
                current_start = int(match.group(2))
                current_end = int(match.group(3))
                title = match.group(4)
                
                # Calculate original values (remove current +12 offset)
                original_start = current_start - 12
                original_end = current_end - 12
                
                # Apply new offset
                new_start = original_start + new_offset
                new_end = original_end + new_offset
                
                # Create new line
                new_line = f"      {lesson_num}: {{ start: {new_start}, end: {new_end}, title: {title} }},"
                updated_lines.append(new_line)
                
                print(f"  Lesson {lesson_num}: {current_start}-{current_end} → {new_start}-{new_end}")
                changes_made += 1
                continue
        
        # Keep the line as-is
        updated_lines.append(line)
    
    # Write back
    with open(service_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(updated_lines))
    
    print(f"\n✅ Applied offset +{new_offset} to {changes_made} Volume 2 lessons")
    print(f"🎯 Test URL: /lesson/RCM06_NA_SW_V2/15 (should show Lesson 15)")
    
    return changes_made

def test_offsets():
    """Test different common offsets for Volume 2."""
    
    print("🧪 VOLUME 2 OFFSET TESTING GUIDE")
    print("="*50)
    print("Try these offsets one by one until Volume 2 works:")
    print()
    print("# Test current (+12 offset)")
    print("# Check: /lesson/RCM06_NA_SW_V2/15")
    print()
    print("# If wrong, try +8 offset:")
    print("python -c \"from test_v2_offsets import apply_volume2_offset; apply_volume2_offset(8)\"")
    print()
    print("# If still wrong, try +15 offset:")
    print("python -c \"from test_v2_offsets import apply_volume2_offset; apply_volume2_offset(15)\"")
    print()
    print("# If still wrong, try +5 offset:")
    print("python -c \"from test_v2_offsets import apply_volume2_offset; apply_volume2_offset(5)\"")
    print()
    print("# If still wrong, try +20 offset:")
    print("python -c \"from test_v2_offsets import apply_volume2_offset; apply_volume2_offset(20)\"")

if __name__ == "__main__":
    test_offsets()
    
    print("\n" + "="*50)
    print("🎯 QUICK TEST INSTRUCTIONS:")
    print("="*50)
    print("1. First test current Volume 2: /lesson/RCM06_NA_SW_V2/15")
    print("2. If wrong content, try: python -c \"from test_v2_offsets import apply_volume2_offset; apply_volume2_offset(8)\"")
    print("3. Test again: /lesson/RCM06_NA_SW_V2/15")
    print("4. Repeat with different offsets (5, 15, 20) until it works")
    print("5. Look for 'Dear Family' letter for Lesson 15")
