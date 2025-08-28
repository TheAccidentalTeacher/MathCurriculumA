#!/usr/bin/env python3
"""
Simple Image Viewer for Extraction Results
"""

import os
import sqlite3
from PIL import Image, ImageTk
import tkinter as tk
from tkinter import ttk
import sys

def create_image_viewer(db_path, images_dir):
    """Create a simple GUI to browse extracted images"""
    
    if not os.path.exists(db_path) or not os.path.exists(images_dir):
        print("❌ Database or images directory not found")
        return
    
    # Connect to database
    conn = sqlite3.connect(db_path)
    
    # Get all visual elements
    elements = conn.execute("""
        SELECT filename, element_type, page_number, context, width, height
        FROM visual_elements
        ORDER BY page_number, filename
    """).fetchall()
    
    conn.close()
    
    print(f"🖼️ Found {len(elements)} visual elements")
    print("\nSample elements by type:")
    
    # Group by type for overview
    by_type = {}
    for element in elements:
        element_type = element[1]
        if element_type not in by_type:
            by_type[element_type] = []
        by_type[element_type].append(element)
    
    # Show samples
    for element_type, type_elements in by_type.items():
        print(f"\n📂 {element_type.upper()} ({len(type_elements)} elements):")
        for i, (filename, _, page, context, width, height) in enumerate(type_elements[:3]):
            img_path = os.path.join(images_dir, filename)
            exists = "✅" if os.path.exists(img_path) else "❌"
            print(f"  {i+1}. {filename} {exists}")
            print(f"     Page {page} • {width:.0f}×{height:.0f}px")
            if context.strip():
                print(f"     {context[:60]}...")
        
        if len(type_elements) > 3:
            print(f"  ... and {len(type_elements) - 3} more")
    
    print(f"\n💡 To view images:")
    print(f"   • Open VS Code: code {images_dir}")
    print(f"   • Use file manager: open {images_dir}")
    print(f"   • Command line: ls {images_dir}/*number_line*")
    
    # Show some specific high-value images
    print(f"\n🎯 RECOMMENDED IMAGES TO VIEW:")
    
    # Large number lines
    number_lines = [el for el in elements if 'number_line' in el[1]]
    if number_lines:
        largest = max(number_lines, key=lambda x: x[4] * x[5])  # width * height
        print(f"  📏 Largest number line: {largest[0]}")
        print(f"     {largest[4]:.0f}×{largest[5]:.0f}px on page {largest[2]}")
    
    # Complex diagrams
    complex_diagrams = [el for el in elements if el[1] == 'complex_diagram']
    if complex_diagrams:
        print(f"  🔍 Complex diagrams found: {len(complex_diagrams)}")
        for diag in complex_diagrams[:2]:
            print(f"     • {diag[0]} - Page {diag[2]}")
    
    # Geometric shapes
    shapes = [el for el in elements if el[1] == 'geometric_shape']
    if shapes:
        largest_shape = max(shapes, key=lambda x: x[4] * x[5])
        print(f"  🔷 Largest geometric shape: {largest_shape[0]}")
        print(f"     {largest_shape[4]:.0f}×{largest_shape[5]:.0f}px on page {largest_shape[2]}")

if __name__ == "__main__":
    db_path = "visual_extractions/test_sample/data/test_sample_visual_content.db"
    images_dir = "visual_extractions/test_sample/images"
    
    print("🎨 VISUAL EXTRACTION RESULTS BROWSER")
    print("=" * 50)
    
    create_image_viewer(db_path, images_dir)
