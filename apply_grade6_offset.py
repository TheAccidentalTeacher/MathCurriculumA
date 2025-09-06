#!/usr/bin/env python3
"""
Simple script to apply 12-page offset to Grade 6 lesson boundaries.

We know from the image that:
- Lesson 3 shows "textbook page 41" at bottom
- But it's actually PNG file page_053.png 
- Offset = 12 pages

This script will add 12 to all Grade 6 start and end pages.
"""

def apply_offset_to_grade6():
    """Apply 12-page offset to all Grade 6 lesson boundaries."""
    
    service_file = 'src/lib/database-free-lesson-service.ts'
    
    # Read the file
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("🔧 Applying 12-page offset to Grade 6 lessons...")
    
    # Split into lines for easier processing
    lines = content.split('\n')
    updated_lines = []
    
    in_rcm06_section = False
    changes_made = 0
    
    for line in lines:
        # Check if we're entering a Grade 6 section
        if "'RCM06_NA_SW_V1'" in line or "'RCM06_NA_SW_V2'" in line:
            in_rcm06_section = True
            updated_lines.append(line)
            continue
        
        # Check if we're leaving Grade 6 section
        if in_rcm06_section and line.strip().startswith("'RCM0") and "RCM06" not in line:
            in_rcm06_section = False
        
        # If we're in Grade 6 section and this line has start/end values
        if in_rcm06_section and 'start:' in line and 'end:' in line:
            # Extract lesson number and current values
            import re
            match = re.search(r'(\d+):\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+),\s*title:\s*([\'"].*?[\'"])', line)
            if match:
                lesson_num = match.group(1)
                old_start = int(match.group(2))
                old_end = int(match.group(3))
                title = match.group(4)
                
                # Apply offset
                new_start = old_start + 12
                new_end = old_end + 12
                
                # Create new line
                new_line = f"      {lesson_num}: {{ start: {new_start}, end: {new_end}, title: {title} }},"
                updated_lines.append(new_line)
                
                print(f"  Lesson {lesson_num}: {old_start}-{old_end} → {new_start}-{new_end}")
                changes_made += 1
                continue
        
        # Keep the line as-is
        updated_lines.append(line)
    
    # Write back the updated content
    with open(service_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(updated_lines))
    
    print(f"\n✅ Applied offset to {changes_made} lessons")
    print(f"✅ Updated {service_file}")
    
    return changes_made

def verify_lesson_3():
    """Verify that Lesson 3 now points to the correct page."""
    
    service_file = 'src/lib/database-free-lesson-service.ts'
    
    with open(service_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Look for lesson 3 in RCM06_NA_SW_V2
    import re
    match = re.search(r"'RCM06_NA_SW_V2'.*?3:\s*\{\s*start:\s*(\d+),\s*end:\s*(\d+)", content, re.DOTALL)
    
    if match:
        start_page = int(match.group(1))
        end_page = int(match.group(2))
        
        print(f"\n🎯 Verification:")
        print(f"  Lesson 3 (Surface Area) now maps to PNG pages {start_page}-{end_page}")
        
        if start_page == 53:  # We expect page 41 + 12 = 53
            print(f"  ✅ CORRECT! PNG page_{start_page:03d}.png should show the 'Dear Family' letter")
        else:
            print(f"  ❌ Expected PNG page 53, but got {start_page}")
    
    print(f"\n🚀 Test URL: /lesson/RCM06_NA_SW_V2/3")

if __name__ == "__main__":
    print("🔧 APPLYING 12-PAGE OFFSET TO GRADE 6")
    print("="*50)
    
    changes = apply_offset_to_grade6()
    
    if changes > 0:
        verify_lesson_3()
        print(f"\n✅ Grade 6 lesson boundaries updated!")
        print(f"✅ All PNG file references now account for front matter offset")
    else:
        print(f"\n❌ No changes made - check if offset was already applied")
