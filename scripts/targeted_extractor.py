#!/usr/bin/env python3
"""
Targeted Visual Extractor - Extract from specific page range
"""

import fitz
import os
import sys
from PIL import Image

def extract_page_range(pdf_path, start_page, end_page):
    """Extract images from specific page range"""
    doc = fitz.open(pdf_path)
    filename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    output_dir = f"extracted_{filename}_pages_{start_page}_{end_page}"
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(images_dir, exist_ok=True)
    
    total_images = 0
    total_drawings = 0
    
    print(f"🔍 Extracting from {filename}, pages {start_page} to {end_page}")
    
    for page_num in range(start_page - 1, min(end_page, len(doc))):
        print(f"  📄 Processing page {page_num + 1}...")
        page = doc[page_num]
        
        # Extract images
        image_list = page.get_images()
        page_images = 0
        
        for img_index, img in enumerate(image_list):
            try:
                xref = img[0]
                pix = fitz.Pixmap(doc, xref)
                
                if pix.n - pix.alpha < 4:
                    img_filename = f"page_{page_num+1:03d}_img_{img_index+1:02d}.png"
                    img_path = os.path.join(images_dir, img_filename)
                    pix.save(img_path)
                    
                    # Get context
                    img_rects = page.get_image_rects(xref)
                    context = "No context"
                    if img_rects:
                        rect = img_rects[0]
                        expanded = fitz.Rect(rect.x0 - 50, rect.y0 - 50, rect.x1 + 50, rect.y1 + 50)
                        context = page.get_textbox(expanded)
                    
                    print(f"    📸 Saved: {img_filename} ({pix.width}x{pix.height})")
                    print(f"        Context: {context[:100]}...")
                    
                    page_images += 1
                    total_images += 1
                
                pix = None
            except Exception as e:
                print(f"    ⚠️ Error: {e}")
        
        # Count drawings
        drawings = page.get_drawings()
        total_drawings += len(drawings)
        
        if page_images > 0 or len(drawings) > 0:
            print(f"    Found: {page_images} images, {len(drawings)} drawings")
    
    doc.close()
    
    print(f"\n✅ Extraction complete!")
    print(f"📸 Total images: {total_images}")
    print(f"🖼️ Total drawings: {total_drawings}")
    print(f"📁 Images saved to: {images_dir}")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python3 targeted_extractor.py <pdf_path> <start_page> <end_page>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    start_page = int(sys.argv[2])
    end_page = int(sys.argv[3])
    
    extract_page_range(pdf_path, start_page, end_page)
