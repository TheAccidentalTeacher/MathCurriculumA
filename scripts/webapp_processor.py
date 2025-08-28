#!/usr/bin/env python3
"""
Production Full Page Processor - Complete PDF to full-page images for web integration
"""

import fitz
import os
import sys
import json
import sqlite3
from datetime import datetime
from pathlib import Path

def process_pdf_for_webapp(pdf_path, output_base="webapp_pages", dpi=150):
    """
    Process PDF for web app integration - full pages only
    Creates clean directory structure suitable for Next.js integration
    """
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return None
    
    doc = fitz.open(pdf_path)
    filename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Create clean output structure
    document_dir = os.path.join(output_base, filename)
    pages_dir = os.path.join(document_dir, "pages")
    data_dir = os.path.join(document_dir, "data")
    
    for dir_path in [pages_dir, data_dir]:
        os.makedirs(dir_path, exist_ok=True)
    
    print(f"🎯 PROCESSING FOR WEB APP: {filename}")
    print(f"📄 Total pages: {len(doc)}")
    print(f"🎨 Resolution: {dpi} DPI")
    print(f"📁 Output: {document_dir}")
    print()
    
    # Calculate zoom for desired DPI
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)
    
    # Initialize data structure
    document_data = {
        "id": filename.lower().replace('_', '-'),
        "title": filename.replace('_', ' ').title(),
        "filename": filename,
        "source_pdf": pdf_path,
        "processing_date": datetime.now().isoformat(),
        "total_pages": len(doc),
        "resolution_dpi": dpi,
        "pages": [],
        "stats": {
            "total_words": 0,
            "content_pages": 0,
            "file_size_mb": 0
        }
    }
    
    # Process each page
    total_file_size = 0
    
    for page_num in range(len(doc)):
        print(f"  📄 Page {page_num + 1:2d}/{len(doc)} ", end="")
        
        page = doc[page_num]
        
        # Extract full page image
        pix = page.get_pixmap(matrix=matrix)
        
        # Use simple naming: page_001.png, page_002.png, etc.
        page_filename = f"page_{page_num+1:03d}.png"
        page_path = os.path.join(pages_dir, page_filename)
        pix.save(page_path)
        
        # Get page info
        page_text = page.get_text()
        word_count = len(page_text.split())
        file_size = os.path.getsize(page_path)
        total_file_size += file_size
        
        # Extract key information
        page_info = {
            "page_number": page_num + 1,
            "filename": page_filename,
            "image_path": f"pages/{page_filename}",
            "dimensions": {
                "width": pix.width,
                "height": pix.height
            },
            "word_count": word_count,
            "has_significant_content": word_count > 20,
            "file_size_kb": round(file_size / 1024, 1),
            "text_preview": extract_page_preview(page_text),
            "keywords": extract_keywords(page_text),
            "page_type": classify_page_type(page_text, page_num + 1, len(doc))
        }
        
        document_data["pages"].append(page_info)
        document_data["stats"]["total_words"] += word_count
        
        if page_info["has_significant_content"]:
            document_data["stats"]["content_pages"] += 1
        
        print(f"→ {pix.width}×{pix.height}px ({page_info['file_size_kb']}KB) [{page_info['page_type']}]")
        pix = None
    
    # Finalize stats
    document_data["stats"]["file_size_mb"] = round(total_file_size / (1024 * 1024), 1)
    document_data["stats"]["avg_words_per_page"] = round(document_data["stats"]["total_words"] / len(doc))
    
    # Save JSON data for web app
    json_path = os.path.join(data_dir, "document.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(document_data, f, indent=2, ensure_ascii=False)
    
    # Create SQLite database for advanced queries
    create_document_database(document_data, data_dir)
    
    # Create manifest for easy integration
    create_integration_manifest(document_data, document_dir)
    
    doc.close()
    
    print(f"\n✅ WEB APP PROCESSING COMPLETE!")
    print(f"📄 Pages: {len(doc)} ({document_data['stats']['content_pages']} with content)")
    print(f"📊 Total words: {document_data['stats']['total_words']:,}")
    print(f"💾 Total size: {document_data['stats']['file_size_mb']} MB")
    print(f"📁 Pages directory: {pages_dir}")
    print(f"📋 Document data: {json_path}")
    print(f"🌐 Ready for Next.js integration")
    
    return document_data

def extract_page_preview(text):
    """Extract meaningful preview from page text"""
    # Remove copyright and header text
    lines = text.split('\n')
    meaningful_lines = []
    
    for line in lines:
        line = line.strip()
        if len(line) > 10 and not line.startswith('©') and 'Curriculum Associates' not in line:
            meaningful_lines.append(line)
        
        if len(meaningful_lines) >= 3:
            break
    
    preview = ' '.join(meaningful_lines)
    return preview[:200] + "..." if len(preview) > 200 else preview

def extract_keywords(text):
    """Extract key mathematical terms and concepts"""
    # Common math curriculum keywords
    math_keywords = [
        'fraction', 'decimal', 'percent', 'ratio', 'proportion', 'equation', 'expression',
        'variable', 'integer', 'rational', 'coordinate', 'graph', 'number line',
        'geometry', 'triangle', 'circle', 'rectangle', 'angle', 'area', 'perimeter',
        'volume', 'probability', 'statistics', 'mean', 'median', 'mode'
    ]
    
    text_lower = text.lower()
    found_keywords = []
    
    for keyword in math_keywords:
        if keyword in text_lower:
            found_keywords.append(keyword)
    
    return found_keywords[:5]  # Limit to top 5

def classify_page_type(text, page_num, total_pages):
    """Classify the type of page based on content"""
    text_lower = text.lower()
    
    if page_num == 1:
        return "cover"
    elif page_num <= 3:
        return "frontmatter"
    elif page_num >= total_pages - 2:
        return "backmatter"
    elif 'table of contents' in text_lower or 'contents' in text_lower:
        return "contents"
    elif 'lesson' in text_lower and any(word in text_lower for word in ['introduction', 'explore', 'develop']):
        return "lesson"
    elif 'practice' in text_lower or 'exercise' in text_lower:
        return "practice"
    elif 'review' in text_lower or 'assessment' in text_lower:
        return "assessment"
    elif 'unit' in text_lower and 'opener' in text_lower:
        return "unit_opener"
    else:
        return "content"

def create_document_database(document_data, data_dir):
    """Create SQLite database for the document"""
    db_path = os.path.join(data_dir, "document.db")
    conn = sqlite3.connect(db_path)
    
    # Create pages table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS pages (
            page_number INTEGER PRIMARY KEY,
            filename TEXT,
            image_path TEXT,
            width INTEGER,
            height INTEGER,
            word_count INTEGER,
            has_content BOOLEAN,
            file_size_kb REAL,
            page_type TEXT,
            text_preview TEXT,
            keywords TEXT
        )
    ''')
    
    # Insert page data
    for page in document_data["pages"]:
        conn.execute('''
            INSERT INTO pages 
            (page_number, filename, image_path, width, height, word_count, 
             has_content, file_size_kb, page_type, text_preview, keywords)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            page["page_number"],
            page["filename"],
            page["image_path"],
            page["dimensions"]["width"],
            page["dimensions"]["height"],
            page["word_count"],
            page["has_significant_content"],
            page["file_size_kb"],
            page["page_type"],
            page["text_preview"],
            ','.join(page["keywords"])
        ))
    
    conn.commit()
    conn.close()

def create_integration_manifest(document_data, document_dir):
    """Create manifest file for easy Next.js integration"""
    manifest = {
        "document_id": document_data["id"],
        "title": document_data["title"],
        "pages_count": document_data["total_pages"],
        "content_pages": document_data["stats"]["content_pages"],
        "total_words": document_data["stats"]["total_words"],
        "file_size_mb": document_data["stats"]["file_size_mb"],
        "integration": {
            "pages_directory": "pages/",
            "data_file": "data/document.json",
            "database_file": "data/document.db",
            "image_format": "PNG",
            "resolution_dpi": document_data["resolution_dpi"]
        },
        "api_endpoints": {
            "get_page": f"/api/documents/{document_data['id']}/page/[pageNumber]",
            "get_info": f"/api/documents/{document_data['id']}/info",
            "search": f"/api/documents/{document_data['id']}/search"
        }
    }
    
    manifest_path = os.path.join(document_dir, "manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 webapp_processor.py <pdf_path> [dpi]")
        print("Example: python3 webapp_processor.py RCM07_NA_SW_V1.pdf 150")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    dpi = int(sys.argv[2]) if len(sys.argv) > 2 else 150
    
    result = process_pdf_for_webapp(pdf_path, dpi=dpi)
    
    if result:
        print(f"\n🚀 NEXT STEPS:")
        print(f"1. Copy webapp_pages/{result['filename']} to your Next.js public directory")
        print(f"2. Use the API endpoints defined in manifest.json")
        print(f"3. Display pages using: /pages/page_001.png, /pages/page_002.png, etc.")
