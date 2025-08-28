#!/usr/bin/env python3
"""
Visual PDF Extractor - Sample Pages Version
Quick test extraction for first few pages to verify functionality
"""

import fitz  # PyMuPDF
import os
import json
import sys
from typing import List, Dict, Any

class QuickVisualExtractor:
    def __init__(self, pdf_path: str, max_pages: int = 5):
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)
        self.filename = os.path.basename(pdf_path)
        self.max_pages = min(max_pages, len(self.doc))
        self.extracted_data = {
            "filename": self.filename,
            "total_pages": len(self.doc),
            "pages_processed": self.max_pages,
            "images": [],
            "text_blocks": [],
            "visual_elements": [],
            "drawings": []
        }
    
    def extract_sample_content(self):
        """Extract visual content from first few pages"""
        print(f"🔍 Quick visual extraction: {self.filename}")
        print(f"📄 Processing first {self.max_pages} pages (of {len(self.doc)} total)")
        
        for page_num in range(self.max_pages):
            print(f"  📄 Processing page {page_num + 1}...")
            page = self.doc[page_num]
            
            # Extract images
            self.extract_page_images(page, page_num)
            
            # Extract drawings and shapes
            self.extract_page_drawings(page, page_num)
            
            # Extract structured text
            self.extract_page_text_structure(page, page_num)
        
        return self.extracted_data
    
    def extract_page_images(self, page, page_num: int):
        """Extract embedded images"""
        image_list = page.get_images()
        
        for img_index, img in enumerate(image_list):
            try:
                xref = img[0]
                pix = fitz.Pixmap(self.doc, xref)
                
                # Get image rectangles on page
                img_rects = page.get_image_rects(xref)
                
                image_info = {
                    "page": page_num + 1,
                    "index": img_index + 1,
                    "width": pix.width,
                    "height": pix.height,
                    "colorspace": pix.colorspace.name if pix.colorspace else "Unknown",
                    "coordinates": []
                }
                
                # Convert rect coordinates to JSON-serializable format
                for rect in img_rects:
                    image_info["coordinates"].append({
                        "x": float(rect.x0),
                        "y": float(rect.y0),
                        "width": float(rect.width),
                        "height": float(rect.height)
                    })
                
                self.extracted_data["images"].append(image_info)
                print(f"    📸 Found image: {pix.width}x{pix.height} pixels")
                
                pix = None
                
            except Exception as e:
                print(f"    ⚠️ Error with image {img_index}: {e}")
    
    def extract_page_drawings(self, page, page_num: int):
        """Extract vector graphics and drawings"""
        drawings = page.get_drawings()
        
        for draw_index, drawing in enumerate(drawings):
            try:
                # Convert rect to serializable format
                rect = drawing.get("rect", [0, 0, 0, 0])
                
                drawing_info = {
                    "page": page_num + 1,
                    "index": draw_index + 1,
                    "bbox": [float(rect[0]), float(rect[1]), float(rect[2]), float(rect[3])],
                    "items": len(drawing.get("items", [])),
                    "type": self.classify_drawing(drawing)
                }
                
                self.extracted_data["drawings"].append(drawing_info)
                
            except Exception as e:
                print(f"    ⚠️ Error with drawing {draw_index}: {e}")
        
        if drawings:
            print(f"    🖼️ Found {len(drawings)} drawings/shapes")
    
    def extract_page_text_structure(self, page, page_num: int):
        """Extract text with basic structure recognition"""
        text_dict = page.get_text("dict")
        
        structured_blocks = []
        
        for block in text_dict["blocks"]:
            if "lines" in block:  # Text block
                full_text = ""
                fonts = []
                
                for line in block["lines"]:
                    for span in line["spans"]:
                        full_text += span["text"]
                        fonts.append({
                            "font": span["font"],
                            "size": span["size"]
                        })
                
                if full_text.strip():
                    text_block = {
                        "page": page_num + 1,
                        "text": full_text.strip(),
                        "bbox": [float(x) for x in block["bbox"]],
                        "type": self.classify_text_content(full_text.strip()),
                        "font_info": fonts[:3]  # Just first 3 font samples
                    }
                    
                    structured_blocks.append(text_block)
        
        # Add to main data
        self.extracted_data["text_blocks"].extend(structured_blocks)
        
        if structured_blocks:
            print(f"    📝 Found {len(structured_blocks)} text blocks")
    
    def classify_drawing(self, drawing) -> str:
        """Classify drawing types"""
        items = drawing.get("items", [])
        item_count = len(items)
        
        if item_count == 0:
            return "empty"
        elif item_count == 1:
            return "simple_shape"
        elif item_count < 5:
            return "basic_figure"
        elif item_count < 15:
            return "diagram"
        else:
            return "complex_graphic"
    
    def classify_text_content(self, text: str) -> str:
        """Classify text content"""
        text_lower = text.lower()
        
        if any(keyword in text_lower for keyword in ["unit ", "lesson ", "session "]):
            return "section_header"
        elif any(keyword in text_lower for keyword in ["activity", "try it", "practice"]):
            return "activity"
        elif text.strip() and text.strip()[0].isdigit() and len(text) < 200:
            return "problem"
        elif len(text) > 100:
            return "content_block"
        else:
            return "text"
    
    def generate_summary(self):
        """Generate extraction summary"""
        return {
            "pages_analyzed": self.max_pages,
            "total_images": len(self.extracted_data["images"]),
            "total_drawings": len(self.extracted_data["drawings"]),
            "total_text_blocks": len(self.extracted_data["text_blocks"]),
            "content_breakdown": self.analyze_content_types()
        }
    
    def analyze_content_types(self):
        """Analyze what types of content were found"""
        content_types = {}
        drawing_types = {}
        
        for block in self.extracted_data["text_blocks"]:
            content_type = block["type"]
            content_types[content_type] = content_types.get(content_type, 0) + 1
        
        for drawing in self.extracted_data["drawings"]:
            drawing_type = drawing["type"]
            drawing_types[drawing_type] = drawing_types.get(drawing_type, 0) + 1
        
        return {
            "text_types": content_types,
            "drawing_types": drawing_types
        }
    
    def save_results(self, output_file: str):
        """Save results to JSON file"""
        try:
            with open(output_file, 'w') as f:
                json.dump(self.extracted_data, f, indent=2)
            print(f"💾 Results saved to: {output_file}")
            return True
        except Exception as e:
            print(f"❌ Error saving results: {e}")
            return False
    
    def close(self):
        """Close the PDF"""
        self.doc.close()

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 quick_visual_extractor.py <pdf_path> [max_pages]")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)
    
    try:
        extractor = QuickVisualExtractor(pdf_path, max_pages)
        data = extractor.extract_sample_content()
        
        # Generate and display summary
        summary = extractor.generate_summary()
        
        print(f"\n📊 EXTRACTION SUMMARY:")
        print(f"✅ Pages processed: {summary['pages_analyzed']}")
        print(f"📸 Images found: {summary['total_images']}")
        print(f"🖼️ Drawings found: {summary['total_drawings']}")
        print(f"📝 Text blocks: {summary['total_text_blocks']}")
        
        if summary['content_breakdown']['text_types']:
            print(f"\n📝 Text content types:")
            for text_type, count in summary['content_breakdown']['text_types'].items():
                print(f"  {text_type}: {count}")
        
        if summary['content_breakdown']['drawing_types']:
            print(f"\n🖼️ Drawing types:")
            for drawing_type, count in summary['content_breakdown']['drawing_types'].items():
                print(f"  {drawing_type}: {count}")
        
        # Save results
        output_file = pdf_path.replace('.pdf', f'_sample_{max_pages}pages.json')
        extractor.save_results(output_file)
        
        extractor.close()
        
        print(f"\n🎉 Quick extraction completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
