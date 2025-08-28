#!/usr/bin/env python3
"""
Full Page Image Extractor - Extract complete PDF pages as high-resolution images
Simple, clean, focused on full-page context preservation
"""

import fitz
import os
import sys
import json
from datetime import datetime
from PIL import Image

def extract_full_pages(pdf_path, output_dir="full_page_extractions", dpi=150):
    """
    Extract each PDF page as a high-resolution PNG image
    
    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save images
        dpi: Resolution for image extraction (150 = good quality, 300 = high quality)
    """
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        return None
    
    doc = fitz.open(pdf_path)
    filename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    # Create output directory
    pages_dir = os.path.join(output_dir, filename)
    os.makedirs(pages_dir, exist_ok=True)
    
    print(f"📄 Extracting full pages from: {filename}")
    print(f"📄 Total pages: {len(doc)}")
    print(f"🎯 Resolution: {dpi} DPI")
    print(f"📁 Output directory: {pages_dir}")
    print()
    
    # Calculate zoom factor for desired DPI (72 is default PDF DPI)
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)
    
    extraction_data = {
        "source_pdf": pdf_path,
        "filename": filename,
        "extraction_date": datetime.now().isoformat(),
        "total_pages": len(doc),
        "resolution_dpi": dpi,
        "pages": []
    }
    
    # Extract each page
    for page_num in range(len(doc)):
        print(f"  📄 Processing page {page_num + 1}/{len(doc)}...", end="")
        
        page = doc[page_num]
        
        # Render page at high resolution
        pix = page.get_pixmap(matrix=matrix)
        
        # Save as PNG
        page_filename = f"page_{page_num+1:03d}.png"
        page_path = os.path.join(pages_dir, page_filename)
        pix.save(page_path)
        
        # Get page text for context
        page_text = page.get_text()
        word_count = len(page_text.split())
        
        # Get page dimensions
        page_info = {
            "page_number": page_num + 1,
            "filename": page_filename,
            "image_size": {
                "width": pix.width,
                "height": pix.height
            },
            "pdf_size": {
                "width": float(page.rect.width),
                "height": float(page.rect.height)
            },
            "word_count": word_count,
            "has_content": word_count > 10,
            "text_preview": page_text.strip()[:200] + "..." if len(page_text.strip()) > 200 else page_text.strip()
        }
        
        extraction_data["pages"].append(page_info)
        
        file_size_kb = os.path.getsize(page_path) / 1024
        print(f" ✅ {pix.width}×{pix.height}px ({file_size_kb:.0f}KB)")
        
        pix = None
    
    doc.close()
    
    # Save extraction metadata
    metadata_path = os.path.join(pages_dir, f"{filename}_extraction_info.json")
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(extraction_data, f, indent=2, ensure_ascii=False)
    
    # Create index HTML for viewing
    create_viewing_page(extraction_data, pages_dir)
    
    print(f"\n✅ EXTRACTION COMPLETE!")
    print(f"📄 Pages extracted: {len(doc)}")
    print(f"📁 Images saved to: {pages_dir}")
    print(f"📊 Metadata: {metadata_path}")
    print(f"🌐 View images: file://{os.path.abspath(os.path.join(pages_dir, 'index.html'))}")
    
    return extraction_data

def create_viewing_page(extraction_data, output_dir):
    """Create an HTML page for viewing all extracted pages"""
    
    html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{extraction_data["filename"]} - Full Page View</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }}
        .stat-card {{
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
        }}
        .stat-number {{
            font-size: 2em;
            font-weight: bold;
            color: #667eea;
        }}
        .pages-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
        }}
        .page-card {{
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s;
        }}
        .page-card:hover {{
            transform: translateY(-5px);
        }}
        .page-image {{
            width: 100%;
            height: auto;
            display: block;
            border-bottom: 2px solid #eee;
        }}
        .page-info {{
            padding: 20px;
        }}
        .page-title {{
            font-size: 1.2em;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }}
        .page-meta {{
            color: #666;
            font-size: 0.9em;
            margin-bottom: 15px;
        }}
        .page-preview {{
            color: #888;
            font-size: 0.8em;
            max-height: 60px;
            overflow: hidden;
            line-height: 1.4;
        }}
        .download-btn {{
            display: inline-block;
            margin-top: 10px;
            padding: 8px 16px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 0.9em;
        }}
        .download-btn:hover {{
            background: #5a6fd8;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>📄 {extraction_data["filename"]}</h1>
        <p>Full page extractions • {extraction_data["total_pages"]} pages • {extraction_data["resolution_dpi"]} DPI</p>
    </div>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">{extraction_data["total_pages"]}</div>
            <div>Total Pages</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{extraction_data["resolution_dpi"]}</div>
            <div>DPI Quality</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{len([p for p in extraction_data["pages"] if p["has_content"]])}</div>
            <div>Content Pages</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">{sum(p["word_count"] for p in extraction_data["pages"]):,}</div>
            <div>Total Words</div>
        </div>
    </div>

    <div class="pages-grid">'''
    
    for page_info in extraction_data["pages"]:
        html_content += f'''
        <div class="page-card">
            <img src="{page_info["filename"]}" alt="Page {page_info["page_number"]}" class="page-image">
            <div class="page-info">
                <div class="page-title">Page {page_info["page_number"]}</div>
                <div class="page-meta">
                    {page_info["image_size"]["width"]} × {page_info["image_size"]["height"]} pixels<br>
                    {page_info["word_count"]} words
                </div>
                <div class="page-preview">{page_info["text_preview"]}</div>
                <a href="{page_info["filename"]}" download class="download-btn">Download PNG</a>
            </div>
        </div>'''
    
    html_content += '''
    </div>

    <script>
        // Add click to zoom functionality
        document.querySelectorAll('.page-image').forEach(img => {
            img.addEventListener('click', function() {
                window.open(this.src, '_blank');
            });
            img.style.cursor = 'pointer';
            img.title = 'Click to view full size';
        });
    </script>
</body>
</html>'''
    
    html_path = os.path.join(output_dir, 'index.html')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

def extract_specific_pages(pdf_path, page_numbers, output_dir="selected_pages", dpi=200):
    """Extract specific pages by number"""
    
    doc = fitz.open(pdf_path)
    filename = os.path.splitext(os.path.basename(pdf_path))[0]
    
    pages_dir = os.path.join(output_dir, filename)
    os.makedirs(pages_dir, exist_ok=True)
    
    zoom = dpi / 72.0
    matrix = fitz.Matrix(zoom, zoom)
    
    print(f"📄 Extracting specific pages from: {filename}")
    print(f"📄 Pages to extract: {page_numbers}")
    
    for page_num in page_numbers:
        if 1 <= page_num <= len(doc):
            page = doc[page_num - 1]  # Convert to 0-based
            pix = page.get_pixmap(matrix=matrix)
            
            page_filename = f"page_{page_num:03d}.png"
            page_path = os.path.join(pages_dir, page_filename)
            pix.save(page_path)
            
            file_size_kb = os.path.getsize(page_path) / 1024
            print(f"  ✅ Page {page_num}: {pix.width}×{pix.height}px ({file_size_kb:.0f}KB)")
            
            pix = None
        else:
            print(f"  ❌ Page {page_num}: Not found in PDF")
    
    doc.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python3 full_page_extractor.py <pdf_path> [dpi] [specific_pages]")
        print("Examples:")
        print("  python3 full_page_extractor.py document.pdf")
        print("  python3 full_page_extractor.py document.pdf 200")
        print("  python3 full_page_extractor.py document.pdf 150 1,5,10")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    dpi = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2].isdigit() else 150
    
    if len(sys.argv) > 3 and ',' in sys.argv[3]:
        # Extract specific pages
        page_numbers = [int(p.strip()) for p in sys.argv[3].split(',')]
        extract_specific_pages(pdf_path, page_numbers, dpi=dpi)
    else:
        # Extract all pages
        extract_full_pages(pdf_path, dpi=dpi)
