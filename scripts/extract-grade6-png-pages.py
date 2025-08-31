#!/usr/bin/env python3
"""
Grade 6 PDF to PNG Page Extractor
Creates PNG images for each page like the Grade 7/8 volumes
"""

import fitz
import os
import json
import sys
from pathlib import Path

class Grade6PdfExtractor:
    def __init__(self, pdf_path: str, output_name: str):
        self.pdf_path = pdf_path
        self.output_name = output_name
        self.doc = fitz.open(pdf_path)
        
        # Create output directories matching Grade 7/8 structure
        self.output_dir = f"webapp_pages/{output_name}"
        self.pages_dir = os.path.join(self.output_dir, "pages")
        self.data_dir = os.path.join(self.output_dir, "data")
        
        os.makedirs(self.pages_dir, exist_ok=True)
        os.makedirs(self.data_dir, exist_ok=True)
        
        print(f"🔍 Extracting {output_name} from {os.path.basename(pdf_path)}")
        print(f"📄 Total pages: {len(self.doc)}")
    
    def extract_pages_to_png(self, target_pages: int = None):
        """Extract each page as a PNG image"""
        total_pages = len(self.doc)
        pages_to_extract = target_pages or total_pages
        
        print(f"🖼️  Extracting {pages_to_extract} pages to PNG...")
        
        extracted_pages = []
        
        for page_num in range(min(pages_to_extract, total_pages)):
            if page_num % 50 == 0:
                print(f"  📄 Processing page {page_num + 1}...")
            
            page = self.doc[page_num]
            
            # Convert page to image (300 DPI for good quality)
            mat = fitz.Matrix(300/72, 300/72)  # 300 DPI scaling
            pix = page.get_pixmap(matrix=mat)
            
            # Save as PNG
            page_filename = f"page_{str(page_num + 1).zfill(3)}.png"
            page_path = os.path.join(self.pages_dir, page_filename)
            pix.save(page_path)
            
            extracted_pages.append({
                "page_number": page_num + 1,
                "filename": page_filename,
                "path": page_path,
                "size": {"width": pix.width, "height": pix.height}
            })
            
        # Create manifest.json like Grade 7/8
        manifest = {
            "document_id": self.output_name,
            "source_pdf": self.pdf_path,
            "total_pages": len(extracted_pages),
            "extraction_date": "2025-08-31T12:00:00Z",
            "pages": extracted_pages,
            "format": "png",
            "dpi": 300
        }
        
        manifest_path = os.path.join(self.output_dir, "manifest.json")
        with open(manifest_path, 'w') as f:
            json.dump(manifest, f, indent=2)
        
        print(f"✅ Extracted {len(extracted_pages)} pages to {self.pages_dir}")
        print(f"📝 Created manifest: {manifest_path}")
        
        return manifest

def main():
    """Extract both Grade 6 volumes"""
    base_path = "/workspaces/MathCurriculumA"
    
    # Grade 6 Volume 1
    pdf_v1_path = os.path.join(base_path, "PDF files", "RCM06_NA_SW_V1.pdf")
    if os.path.exists(pdf_v1_path):
        print("📚 Extracting Grade 6 Volume 1...")
        extractor_v1 = Grade6PdfExtractor(pdf_v1_path, "RCM06_NA_SW_V1")
        manifest_v1 = extractor_v1.extract_pages_to_png(target_pages=512)
        print(f"🎉 Grade 6 V1 complete: {manifest_v1['total_pages']} pages")
    else:
        print(f"❌ PDF not found: {pdf_v1_path}")
    
    print()
    
    # Grade 6 Volume 2  
    pdf_v2_path = os.path.join(base_path, "PDF files", "RCM06_NA_SW_V2.pdf")
    if os.path.exists(pdf_v2_path):
        print("📚 Extracting Grade 6 Volume 2...")
        extractor_v2 = Grade6PdfExtractor(pdf_v2_path, "RCM06_NA_SW_V2")
        manifest_v2 = extractor_v2.extract_pages_to_png(target_pages=408)
        print(f"🎉 Grade 6 V2 complete: {manifest_v2['total_pages']} pages")
    else:
        print(f"❌ PDF not found: {pdf_v2_path}")
    
    print()
    print("🚀 Grade 6 PNG extraction complete!")
    print("📝 Ready for web deployment")

if __name__ == "__main__":
    main()
