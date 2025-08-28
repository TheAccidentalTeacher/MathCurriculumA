#!/usr/bin/env python3
"""
Visual Extraction Results Viewer
"""

import sqlite3
import os
import json
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np

def view_extraction_results(db_path, images_dir):
    """Display extraction results with statistics and sample images"""
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found: {db_path}")
        return
    
    if not os.path.exists(images_dir):
        print(f"❌ Images directory not found: {images_dir}")
        return
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    print("🎨 VISUAL EXTRACTION RESULTS")
    print("=" * 50)
    
    # Get overall statistics
    total_elements = conn.execute("SELECT COUNT(*) FROM visual_elements").fetchone()[0]
    total_pages = conn.execute("SELECT COUNT(DISTINCT page_number) FROM full_pages").fetchone()[0]
    
    print(f"📄 Pages processed: {total_pages}")
    print(f"🖼️ Total visual elements: {total_elements}")
    print()
    
    # Get element type breakdown
    print("📊 ELEMENT TYPES:")
    type_stats = conn.execute("""
        SELECT element_type, COUNT(*) as count, 
               AVG(width) as avg_width, AVG(height) as avg_height
        FROM visual_elements 
        GROUP BY element_type 
        ORDER BY count DESC
    """).fetchall()
    
    for element_type, count, avg_width, avg_height in type_stats:
        percentage = (count / total_elements) * 100
        print(f"  • {element_type}: {count} elements ({percentage:.1f}%)")
        print(f"    Average size: {avg_width:.0f} × {avg_height:.0f} pixels")
    
    print()
    
    # Show samples by type
    print("🖼️ SAMPLE ELEMENTS:")
    for element_type, _, _, _ in type_stats[:3]:  # Show top 3 types
        samples = conn.execute("""
            SELECT filename, page_number, context, width, height
            FROM visual_elements 
            WHERE element_type = ?
            ORDER BY width * height DESC
            LIMIT 3
        """, (element_type,)).fetchall()
        
        print(f"\n  📂 {element_type.upper()}:")
        for filename, page, context, width, height in samples:
            print(f"    • {filename}")
            print(f"      Page {page} • {width:.0f}×{height:.0f}px")
            if context.strip():
                print(f"      Context: {context[:100]}...")
            
            # Check if image file exists
            img_path = os.path.join(images_dir, filename)
            if os.path.exists(img_path):
                print(f"      ✅ Image file exists")
            else:
                print(f"      ❌ Image file missing")
    
    # Page-by-page breakdown
    print(f"\n📄 PAGE-BY-PAGE BREAKDOWN:")
    page_stats = conn.execute("""
        SELECT page_number, visual_elements_count
        FROM full_pages 
        ORDER BY page_number
    """).fetchall()
    
    for page_num, element_count in page_stats:
        print(f"  Page {page_num}: {element_count} visual elements")
    
    # Most common contexts
    print(f"\n🔤 COMMON CONTEXTS:")
    contexts = conn.execute("""
        SELECT context, COUNT(*) as frequency
        FROM visual_elements 
        WHERE context != ''
        GROUP BY context
        ORDER BY frequency DESC
        LIMIT 5
    """).fetchall()
    
    for context, frequency in contexts:
        print(f"  • \"{context[:80]}...\" ({frequency} elements)")
    
    conn.close()
    
    print(f"\n✅ Database location: {db_path}")
    print(f"🖼️ Images location: {images_dir}")
    print(f"\n💡 To view individual images, open the files in: {images_dir}")
    
    return {
        "total_elements": total_elements,
        "total_pages": total_pages,
        "type_breakdown": dict([(t[0], t[1]) for t in type_stats]),
        "db_path": db_path,
        "images_dir": images_dir
    }

def show_sample_images(images_dir, element_type="number_line", count=6):
    """Display sample images in a grid"""
    print(f"\n🖼️ SHOWING SAMPLE {element_type.upper()} IMAGES:")
    
    # Find images of this type
    image_files = [f for f in os.listdir(images_dir) if element_type in f and f.endswith('.png')]
    
    if not image_files:
        print(f"❌ No {element_type} images found")
        return
    
    # Show first few images
    sample_files = image_files[:count]
    
    print(f"Found {len(image_files)} {element_type} images, showing first {len(sample_files)}:")
    
    for i, filename in enumerate(sample_files, 1):
        img_path = os.path.join(images_dir, filename)
        try:
            with Image.open(img_path) as img:
                print(f"  {i}. {filename} - {img.size[0]}×{img.size[1]}px")
        except Exception as e:
            print(f"  {i}. {filename} - Error: {e}")

if __name__ == "__main__":
    # Default paths for our test sample
    db_path = "visual_extractions/test_sample/data/test_sample_visual_content.db"
    images_dir = "visual_extractions/test_sample/images"
    
    print("🎯 VIEWING EXTRACTION RESULTS")
    print("=" * 50)
    
    if os.path.exists(db_path):
        results = view_extraction_results(db_path, images_dir)
        
        # Show sample images
        show_sample_images(images_dir, "number_line", 5)
        show_sample_images(images_dir, "geometric_shape", 3)
        
    else:
        print("❌ No extraction results found. Run the visual extraction first.")
        print("Example: python3 scripts/full_pdf_processor.py test_sample.pdf")
