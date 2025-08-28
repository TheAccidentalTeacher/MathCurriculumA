#!/usr/bin/env python3
"""
Full PDF Visual Processor - Complete extraction and database integration
"""

import fitz
import os
import sys
import json
import sqlite3
from datetime import datetime
from PIL import Image
import base64
import io

def process_full_pdf(pdf_path, output_base_dir="visual_extractions"):
    """Process entire PDF with visual extraction and database integration"""
    doc = fitz.open(pdf_path)
    filename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Create output structure
    output_dir = os.path.join(output_base_dir, filename)
    images_dir = os.path.join(output_dir, "images")
    data_dir = os.path.join(output_dir, "data")
    
    for dir_path in [images_dir, data_dir]:
        os.makedirs(dir_path, exist_ok=True)
    
    print(f"🎨 Processing complete PDF: {filename}")
    print(f"📄 Total pages: {len(doc)}")
    
    # Database connection
    db_path = os.path.join(data_dir, f"{filename}_visual_content.db")
    conn = sqlite3.connect(db_path)
    
    # Create tables
    conn.execute('''
        CREATE TABLE IF NOT EXISTS visual_elements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_number INTEGER,
            element_type TEXT,
            filename TEXT,
            bounds_x0 REAL,
            bounds_y0 REAL,
            bounds_x1 REAL,
            bounds_y1 REAL,
            width REAL,
            height REAL,
            context TEXT,
            drawing_elements INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.execute('''
        CREATE TABLE IF NOT EXISTS full_pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_number INTEGER,
            filename TEXT,
            text_content TEXT,
            visual_elements_count INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    total_visual_elements = 0
    all_elements = []
    
    # Process each page
    for page_num in range(len(doc)):
        print(f"  📄 Processing page {page_num + 1}/{len(doc)}...")
        page = doc[page_num]
        
        # Save full page image
        matrix = fitz.Matrix(2.0, 2.0)  # 2x scaling for good quality
        pix = page.get_pixmap(matrix=matrix)
        full_page_filename = f"page_{page_num+1:03d}_full.png"
        full_page_path = os.path.join(images_dir, full_page_filename)
        pix.save(full_page_path)
        
        # Get page text
        page_text = page.get_text()
        
        # Process drawings
        drawings = page.get_drawings()
        page_elements = []
        
        for draw_index, drawing in enumerate(drawings):
            try:
                rect = drawing.get("rect")
                if not rect or rect.width < 15 or rect.height < 15:
                    continue
                
                # Classify drawing
                element_type = classify_visual_element(drawing, page_text, rect)
                
                # Create diagram image
                crop_rect = fitz.Rect(
                    max(0, rect.x0 - 5),
                    max(0, rect.y0 - 5),
                    min(page.rect.width, rect.x1 + 5),
                    min(page.rect.height, rect.y1 + 5)
                )
                
                crop_pix = page.get_pixmap(matrix=matrix, clip=crop_rect)
                
                if crop_pix.width > 10 and crop_pix.height > 10:
                    diagram_filename = f"page_{page_num+1:03d}_element_{draw_index+1:03d}_{element_type}.png"
                    diagram_path = os.path.join(images_dir, diagram_filename)
                    crop_pix.save(diagram_path)
                    
                    # Get context
                    context_rect = fitz.Rect(rect.x0 - 100, rect.y0 - 50, rect.x1 + 100, rect.y1 + 50)
                    context_text = page.get_textbox(context_rect)
                    
                    element_data = {
                        "page": page_num + 1,
                        "element_index": draw_index + 1,
                        "type": element_type,
                        "filename": diagram_filename,
                        "bounds": {
                            "x0": float(rect.x0),
                            "y0": float(rect.y0),
                            "x1": float(rect.x1),
                            "y1": float(rect.y1),
                            "width": float(rect.width),
                            "height": float(rect.height)
                        },
                        "context": context_text.strip()[:300] if context_text else "",
                        "drawing_elements": len(drawing.get("items", []))
                    }
                    
                    page_elements.append(element_data)
                    all_elements.append(element_data)
                    
                    # Insert into database
                    conn.execute('''
                        INSERT INTO visual_elements 
                        (page_number, element_type, filename, bounds_x0, bounds_y0, bounds_x1, bounds_y1, 
                         width, height, context, drawing_elements)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        page_num + 1,
                        element_type,
                        diagram_filename,
                        float(rect.x0),
                        float(rect.y0),
                        float(rect.x1),
                        float(rect.y1),
                        float(rect.width),
                        float(rect.height),
                        context_text.strip()[:300] if context_text else "",
                        len(drawing.get("items", []))
                    ))
                
                crop_pix = None
                
            except Exception as e:
                print(f"    ⚠️ Error processing element {draw_index}: {e}")
        
        # Insert full page record
        conn.execute('''
            INSERT INTO full_pages (page_number, filename, text_content, visual_elements_count)
            VALUES (?, ?, ?, ?)
        ''', (
            page_num + 1,
            full_page_filename,
            page_text[:5000],  # Limit text size
            len(page_elements)
        ))
        
        total_visual_elements += len(page_elements)
        
        if (page_num + 1) % 10 == 0:
            print(f"    ✅ Completed {page_num + 1} pages, {total_visual_elements} visual elements so far")
        
        pix = None
    
    # Save summary JSON
    summary_data = {
        "source_pdf": pdf_path,
        "filename": filename,
        "processing_date": datetime.now().isoformat(),
        "total_pages": len(doc),
        "total_visual_elements": total_visual_elements,
        "element_types": {},
        "database_path": db_path,
        "images_directory": images_dir
    }
    
    # Count element types
    for element in all_elements:
        element_type = element["type"]
        summary_data["element_types"][element_type] = summary_data["element_types"].get(element_type, 0) + 1
    
    summary_path = os.path.join(data_dir, f"{filename}_processing_summary.json")
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, indent=2, ensure_ascii=False)
    
    # Commit and close database
    conn.commit()
    conn.close()
    doc.close()
    
    print(f"\n🎉 COMPLETE! PDF processing finished:")
    print(f"📄 Pages processed: {len(doc)}")
    print(f"🖼️ Visual elements extracted: {total_visual_elements}")
    print(f"📊 Element types found:")
    for element_type, count in summary_data["element_types"].items():
        print(f"   • {element_type}: {count}")
    print(f"🗄️ Database: {db_path}")
    print(f"🖼️ Images: {images_dir}")
    print(f"📋 Summary: {summary_path}")
    
    return summary_data

def classify_visual_element(drawing, page_text, rect):
    """Enhanced classification for visual elements"""
    items = drawing.get("items", [])
    num_items = len(items)
    context_words = page_text.lower()
    
    # Size-based classification
    area = rect.width * rect.height
    aspect_ratio = rect.width / rect.height if rect.height > 0 else 1
    
    # Content-based classification
    if "number line" in context_words:
        return "number_line"
    elif aspect_ratio > 4 and rect.width > 100:  # Long horizontal elements
        return "number_line_candidate"
    elif "coordinate" in context_words or "graph" in context_words:
        return "coordinate_grid"
    elif "chart" in context_words or "table" in context_words:
        return "data_visualization"
    elif "circle" in context_words or "triangle" in context_words or "rectangle" in context_words:
        return "geometric_shape"
    elif area > 50000:  # Large elements
        return "complex_diagram"
    elif num_items > 20:
        return "detailed_diagram"
    elif rect.width < 50 and rect.height < 50:
        return "icon_or_symbol"
    else:
        return "mathematical_element"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 full_pdf_processor.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    process_full_pdf(pdf_path)
