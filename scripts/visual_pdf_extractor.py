#!/usr/bin/env python3
"""
Visual PDF Extractor for Ready Classroom Mathematics
Extracts actual images, diagrams, and visual content using PyMuPDF

This script can extract:
- Embedded images from PDF pages
- Text with layout preservation
- Visual elements with coordinates
- Page-by-page analysis
"""

import fitz  # PyMuPDF
import os
import json
import sys
from PIL import Image
import io
import base64
from typing import List, Dict, Any

class VisualPDFExtractor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)
        self.filename = os.path.basename(pdf_path)
        self.extracted_data = {
            "filename": self.filename,
            "total_pages": len(self.doc),
            "images": [],
            "text_blocks": [],
            "visual_elements": [],
            "page_layouts": []
        }
    
    def extract_all_content(self):
        """Extract all visual and text content from the PDF"""
        print(f"🔍 Starting visual extraction: {self.filename}")
        print(f"📄 Total pages: {self.extracted_data['total_pages']}")
        
        for page_num in range(len(self.doc)):
            print(f"Processing page {page_num + 1}...")
            page = self.doc[page_num]
            
            # Extract images from this page
            self.extract_page_images(page, page_num)
            
            # Extract text blocks with layout information
            self.extract_page_text_blocks(page, page_num)
            
            # Extract visual elements (drawings, shapes, etc.)
            self.extract_page_drawings(page, page_num)
        
        print(f"✅ Extraction complete!")
        print(f"📊 Found {len(self.extracted_data['images'])} images")
        print(f"📝 Found {len(self.extracted_data['text_blocks'])} text blocks")
        print(f"🖼️ Found {len(self.extracted_data['visual_elements'])} visual elements")
        
        return self.extracted_data
    
    def extract_page_images(self, page, page_num: int):
        """Extract all images from a PDF page"""
        image_list = page.get_images()
        
        for img_index, img in enumerate(image_list):
            try:
                # Get image metadata
                xref = img[0]  # XREF number
                pix = fitz.Pixmap(self.doc, xref)
                
                # Convert to PIL Image for processing
                if pix.n - pix.alpha < 4:  # GRAY or RGB
                    img_data = pix.tobytes("png")
                    img_pil = Image.open(io.BytesIO(img_data))
                    
                    # Create filename for extracted image
                    img_filename = f"page_{page_num+1}_img_{img_index+1}.png"
                    img_path = os.path.join("/tmp", img_filename)
                    
                    # Save image temporarily
                    img_pil.save(img_path)
                    
                    # Get image position on page
                    img_rects = page.get_image_rects(xref)
                    
                    image_info = {
                        "page": page_num + 1,
                        "index": img_index + 1,
                        "filename": img_filename,
                        "width": pix.width,
                        "height": pix.height,
                        "size_bytes": len(img_data),
                        "format": "PNG",
                        "coordinates": [],
                        "description": self.analyze_image_context(page, img_rects)
                    }
                    
                    # Add coordinate information
                    for rect in img_rects:
                        image_info["coordinates"].append({
                            "x": rect.x0,
                            "y": rect.y0, 
                            "width": rect.width,
                            "height": rect.height
                        })
                    
                    self.extracted_data["images"].append(image_info)
                    
                    print(f"  📸 Extracted image: {img_filename} ({pix.width}x{pix.height})")
                
                pix = None  # Free memory
                
            except Exception as e:
                print(f"  ⚠️ Error extracting image {img_index}: {e}")
    
    def extract_page_text_blocks(self, page, page_num: int):
        """Extract text with layout preservation"""
        blocks = page.get_text("dict")
        
        for block in blocks["blocks"]:
            if "lines" in block:  # Text block
                text_content = []
                fonts_used = set()
                
                for line in block["lines"]:
                    line_text = ""
                    for span in line["spans"]:
                        line_text += span["text"]
                        fonts_used.add(f"{span['font']}-{span['size']}")
                    
                    if line_text.strip():
                        text_content.append(line_text.strip())
                
                if text_content:
                    text_block = {
                        "page": page_num + 1,
                        "bbox": [block["bbox"][0], block["bbox"][1], block["bbox"][2], block["bbox"][3]],
                        "text": "\n".join(text_content),
                        "fonts": list(fonts_used),
                        "type": self.classify_text_block("\n".join(text_content))
                    }
                    
                    self.extracted_data["text_blocks"].append(text_block)
    
    def extract_page_drawings(self, page, page_num: int):
        """Extract drawings, shapes, and visual elements"""
        drawings = page.get_drawings()
        
        for draw_index, drawing in enumerate(drawings):
            visual_element = {
                "page": page_num + 1,
                "index": draw_index + 1,
                "type": "drawing",
                "bbox": drawing["rect"],
                "items": len(drawing["items"]) if "items" in drawing else 0,
                "description": self.analyze_drawing(drawing)
            }
            
            self.extracted_data["visual_elements"].append(visual_element)
    
    def analyze_image_context(self, page, img_rects) -> str:
        """Analyze text around images to understand context"""
        if not img_rects:
            return "Image with unknown context"
        
        # Get text near the image
        rect = img_rects[0]
        expanded_rect = fitz.Rect(
            rect.x0 - 50, rect.y0 - 50,
            rect.x1 + 50, rect.y1 + 50
        )
        
        nearby_text = page.get_textbox(expanded_rect)
        
        # Classify based on nearby text
        text_lower = nearby_text.lower() if nearby_text else ""
        
        if any(word in text_lower for word in ["figure", "diagram", "chart", "graph"]):
            return "Mathematical diagram or figure"
        elif any(word in text_lower for word in ["number line", "coordinate", "axis"]):
            return "Number line or coordinate system"
        elif any(word in text_lower for word in ["triangle", "square", "circle", "polygon"]):
            return "Geometric shape illustration"
        elif any(word in text_lower for word in ["table", "data"]):
            return "Data table or chart"
        else:
            return f"Visual content near: {nearby_text[:100]}..." if nearby_text else "Mathematical visual element"
    
    def classify_text_block(self, text: str) -> str:
        """Classify text blocks by type"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["unit", "lesson", "session"]):
            return "section_header"
        elif any(word in text_lower for word in ["activity", "try it", "practice"]):
            return "activity"
        elif text.strip().startswith(tuple("123456789")):
            return "problem"
        elif len(text) > 200:
            return "content"
        else:
            return "text"
    
    def analyze_drawing(self, drawing) -> str:
        """Analyze drawing elements to classify them"""
        if not drawing.get("items"):
            return "Simple drawing element"
        
        item_count = len(drawing["items"])
        if item_count > 10:
            return "Complex diagram or chart"
        elif item_count > 3:
            return "Mathematical figure"
        else:
            return "Simple geometric element"
    
    def save_extraction_data(self, output_path: str):
        """Save extracted data to JSON file"""
        with open(output_path, 'w') as f:
            json.dump(self.extracted_data, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Saved extraction data to: {output_path}")
    
    def generate_summary(self):
        """Generate a summary of extracted content"""
        summary = {
            "total_pages": self.extracted_data["total_pages"],
            "total_images": len(self.extracted_data["images"]),
            "total_text_blocks": len(self.extracted_data["text_blocks"]),
            "total_visual_elements": len(self.extracted_data["visual_elements"]),
            "images_by_page": {},
            "content_types": {}
        }
        
        # Count images per page
        for img in self.extracted_data["images"]:
            page = img["page"]
            summary["images_by_page"][page] = summary["images_by_page"].get(page, 0) + 1
        
        # Count content types
        for block in self.extracted_data["text_blocks"]:
            content_type = block["type"]
            summary["content_types"][content_type] = summary["content_types"].get(content_type, 0) + 1
        
        return summary
    
    def close(self):
        """Close the PDF document"""
        self.doc.close()

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 visual_pdf_extractor.py <pdf_path>")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)
    
    try:
        # Extract visual content
        extractor = VisualPDFExtractor(pdf_path)
        data = extractor.extract_all_content()
        
        # Generate summary
        summary = extractor.generate_summary()
        print(f"\n📊 EXTRACTION SUMMARY:")
        print(f"Pages: {summary['total_pages']}")
        print(f"Images: {summary['total_images']}")
        print(f"Text blocks: {summary['total_text_blocks']}")
        print(f"Visual elements: {summary['total_visual_elements']}")
        
        if summary['images_by_page']:
            print(f"\nImages per page:")
            for page, count in sorted(summary['images_by_page'].items()):
                print(f"  Page {page}: {count} images")
        
        if summary['content_types']:
            print(f"\nContent types:")
            for content_type, count in summary['content_types'].items():
                print(f"  {content_type}: {count}")
        
        # Save results
        output_file = pdf_path.replace('.pdf', '_visual_extraction.json')
        extractor.save_extraction_data(output_file)
        
        extractor.close()
        
        print(f"\n🎉 Visual extraction completed successfully!")
        print(f"📁 Results saved to: {output_file}")
        
    except Exception as e:
        print(f"❌ Error during extraction: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
