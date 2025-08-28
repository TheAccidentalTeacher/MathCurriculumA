#!/usr/bin/env python3
"""
Vector to Image Renderer - Convert PDF vector graphics to PNG images
"""

import fitz
import os
import sys
from PIL import Image, ImageDraw, ImageFont
import json
from datetime import datetime

def render_vector_graphics(pdf_path, max_pages=25):
    """Convert vector graphics from PDF to PNG images"""
    doc = fitz.open(pdf_path)
    filename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Create output directories
    output_dir = f"rendered_{filename}"
    diagrams_dir = os.path.join(output_dir, "diagrams")
    full_pages_dir = os.path.join(output_dir, "full_pages")
    os.makedirs(diagrams_dir, exist_ok=True)
    os.makedirs(full_pages_dir, exist_ok=True)
    
    extraction_data = {
        "source_pdf": pdf_path,
        "extraction_date": datetime.now().isoformat(),
        "pages_processed": 0,
        "visual_elements": []
    }
    
    print(f"🎨 Rendering vector graphics from {filename}")
    
    for page_num in range(min(max_pages, len(doc))):
        print(f"  📄 Processing page {page_num + 1}...")
        page = doc[page_num]
        
        # Render full page as high-resolution image
        matrix = fitz.Matrix(3.0, 3.0)  # 3x scaling for better quality
        pix = page.get_pixmap(matrix=matrix)
        full_page_path = os.path.join(full_pages_dir, f"page_{page_num+1:03d}_full.png")
        pix.save(full_page_path)
        print(f"    💾 Saved full page: page_{page_num+1:03d}_full.png")
        
        # Get text for context
        page_text = page.get_text()
        
        # Analyze drawings
        drawings = page.get_drawings()
        page_diagrams = []
        
        for draw_index, drawing in enumerate(drawings):
            try:
                # Get drawing bounds
                rect = drawing.get("rect")
                if not rect:
                    continue
                
                # Skip tiny drawings (noise)
                if rect.width < 10 or rect.height < 10:
                    continue
                
                # Classify drawing type
                drawing_type = classify_drawing(drawing, page_text, rect)
                
                # Create cropped image of this drawing
                crop_rect = fitz.Rect(
                    max(0, rect.x0 - 10),
                    max(0, rect.y0 - 10), 
                    min(page.rect.width, rect.x1 + 10),
                    min(page.rect.height, rect.y1 + 10)
                )
                
                # Render just this section at high resolution
                crop_pix = page.get_pixmap(matrix=matrix, clip=crop_rect)
                
                if crop_pix.width > 20 and crop_pix.height > 20:
                    diagram_filename = f"page_{page_num+1:03d}_diagram_{draw_index+1:03d}_{drawing_type}.png"
                    diagram_path = os.path.join(diagrams_dir, diagram_filename)
                    crop_pix.save(diagram_path)
                    
                    # Get surrounding text for context
                    text_rect = fitz.Rect(rect.x0 - 100, rect.y0 - 50, rect.x1 + 100, rect.y1 + 50)
                    context_text = page.get_textbox(text_rect)
                    
                    diagram_data = {
                        "page": page_num + 1,
                        "diagram_index": draw_index + 1,
                        "type": drawing_type,
                        "filename": diagram_filename,
                        "bounds": {
                            "x0": rect.x0,
                            "y0": rect.y0,
                            "x1": rect.x1,
                            "y1": rect.y1,
                            "width": rect.width,
                            "height": rect.height
                        },
                        "context": context_text.strip()[:200] if context_text else "",
                        "drawing_elements": len(drawing.get("items", []))
                    }
                    
                    page_diagrams.append(diagram_data)
                    extraction_data["visual_elements"].append(diagram_data)
                
                crop_pix = None
                
            except Exception as e:
                print(f"    ⚠️ Error processing drawing {draw_index}: {e}")
        
        print(f"    🖼️ Extracted {len(page_diagrams)} diagrams from page {page_num + 1}")
        
        pix = None
    
    extraction_data["pages_processed"] = min(max_pages, len(doc))
    
    # Save extraction data
    json_path = os.path.join(output_dir, f"{filename}_rendered_extraction.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(extraction_data, f, indent=2, ensure_ascii=False)
    
    doc.close()
    
    print(f"\n✅ Vector rendering complete!")
    print(f"📄 Pages processed: {extraction_data['pages_processed']}")
    print(f"🖼️ Total diagrams rendered: {len(extraction_data['visual_elements'])}")
    print(f"📁 Full pages: {full_pages_dir}")
    print(f"📁 Individual diagrams: {diagrams_dir}")
    print(f"📊 Data saved: {json_path}")
    
    return extraction_data

def classify_drawing(drawing, page_text, rect):
    """Classify the type of drawing based on content and context"""
    items = drawing.get("items", [])
    num_items = len(items)
    
    # Get nearby text for context
    context_words = page_text.lower()
    
    # Classification logic
    if "number line" in context_words or "numberline" in context_words:
        return "number_line"
    elif rect.width > rect.height * 3 and num_items < 20:  # Long horizontal shapes
        return "number_line_candidate"
    elif "graph" in context_words or "coordinate" in context_words:
        return "coordinate_grid"
    elif "chart" in context_words or "table" in context_words:
        return "chart_or_table"
    elif rect.width > 200 and rect.height > 200:
        return "complex_diagram"
    elif num_items > 50:
        return "detailed_diagram"
    elif "circle" in context_words or "triangle" in context_words or "square" in context_words:
        return "geometric_shape"
    elif rect.width < 100 and rect.height < 100:
        return "small_element"
    else:
        return "mathematical_diagram"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 vector_renderer.py <pdf_path> [max_pages]")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 25
    
    render_vector_graphics(pdf_path, max_pages)
