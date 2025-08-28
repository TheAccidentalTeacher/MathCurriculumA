#!/usr/bin/env python3
"""
Comprehensive Visual PDF Extractor for Math Curriculum
Extracts and saves all visual content from PDF with proper organization
"""

import fitz
import os
import json
import sys
from PIL import Image
import io

class MathCurriculumExtractor:
    def __init__(self, pdf_path: str):
        self.pdf_path = pdf_path
        self.doc = fitz.open(pdf_path)
        self.filename = os.path.splitext(os.path.basename(pdf_path))[0]
        
        # Create output directories
        self.output_dir = f"extracted_{self.filename}"
        self.images_dir = os.path.join(self.output_dir, "images")
        os.makedirs(self.images_dir, exist_ok=True)
        
        self.data = {
            "source_file": pdf_path,
            "total_pages": len(self.doc),
            "extraction_stats": {},
            "pages": []
        }
    
    def extract_full_curriculum(self, max_pages: int = None):
        """Extract visual content from entire curriculum"""
        pages_to_process = min(max_pages or len(self.doc), len(self.doc))
        
        print(f"🔍 Extracting visual content from {self.filename}")
        print(f"📄 Processing {pages_to_process} pages...")
        
        total_images = 0
        total_drawings = 0
        
        for page_num in range(pages_to_process):
            if page_num % 50 == 0:
                print(f"  📄 Processing page {page_num + 1}...")
            
            page = self.doc[page_num]
            page_data = self.extract_page_content(page, page_num)
            
            total_images += len(page_data["images"])
            total_drawings += len(page_data["drawings"])
            
            self.data["pages"].append(page_data)
        
        self.data["extraction_stats"] = {
            "total_images": total_images,
            "total_drawings": total_drawings,
            "pages_processed": pages_to_process
        }
        
        print(f"✅ Extraction complete!")
        print(f"📸 Total images: {total_images}")
        print(f"🖼️ Total drawings: {total_drawings}")
        
        return self.data
    
    def extract_page_content(self, page, page_num: int):
        """Extract all content from a single page"""
        page_data = {
            "page_number": page_num + 1,
            "images": [],
            "drawings": [],
            "text_structure": []
        }
        
        # Extract embedded images
        image_list = page.get_images()
        for img_index, img in enumerate(image_list):
            image_info = self.extract_and_save_image(page, img, page_num, img_index)
            if image_info:
                page_data["images"].append(image_info)
        
        # Extract vector graphics
        drawings = page.get_drawings()
        for draw_index, drawing in enumerate(drawings):
            drawing_info = self.analyze_drawing(drawing, page_num, draw_index)
            if drawing_info:
                page_data["drawings"].append(drawing_info)
        
        # Extract structured text
        text_blocks = self.extract_text_structure(page, page_num)
        page_data["text_structure"] = text_blocks
        
        return page_data
    
    def extract_and_save_image(self, page, img, page_num: int, img_index: int):
        """Extract and save image to file"""
        try:
            xref = img[0]
            pix = fitz.Pixmap(self.doc, xref)
            
            if pix.n - pix.alpha < 4:  # GRAY or RGB
                # Generate filename
                img_filename = f"page_{page_num+1:03d}_img_{img_index+1:02d}.png"
                img_path = os.path.join(self.images_dir, img_filename)
                
                # Save image
                pix.save(img_path)
                
                # Get position on page
                img_rects = page.get_image_rects(xref)
                
                # Analyze image context
                context = self.analyze_image_context(page, img_rects)
                
                image_info = {
                    "filename": img_filename,
                    "width": pix.width,
                    "height": pix.height,
                    "size_bytes": pix.size,
                    "colorspace": pix.colorspace.name if pix.colorspace else "Unknown",
                    "coordinates": [
                        {
                            "x": float(rect.x0),
                            "y": float(rect.y0),
                            "width": float(rect.width),
                            "height": float(rect.height)
                        }
                        for rect in img_rects
                    ],
                    "context": context,
                    "classification": self.classify_math_image(pix.width, pix.height, context)
                }
                
                pix = None
                return image_info
            
        except Exception as e:
            print(f"    ⚠️ Error extracting image: {e}")
        
        return None
    
    def analyze_drawing(self, drawing, page_num: int, draw_index: int):
        """Analyze vector drawing elements"""
        try:
            items = drawing.get("items", [])
            rect = drawing.get("rect", [0, 0, 0, 0])
            
            return {
                "type": self.classify_drawing_type(items, rect),
                "bbox": [float(x) for x in rect],
                "complexity": len(items),
                "classification": self.classify_math_drawing(items, rect)
            }
        except Exception as e:
            return None
    
    def classify_drawing_type(self, items, rect):
        """Classify drawing by complexity and structure"""
        item_count = len(items)
        
        if item_count == 0:
            return "empty"
        elif item_count == 1:
            return "simple_element"
        elif item_count < 5:
            return "basic_shape"
        elif item_count < 20:
            return "diagram"
        else:
            return "complex_graphic"
    
    def classify_math_drawing(self, items, rect):
        """Classify drawings by mathematical content type"""
        item_count = len(items)
        width = rect[2] - rect[0] if len(rect) >= 4 else 0
        height = rect[3] - rect[1] if len(rect) >= 4 else 0
        
        # Analyze dimensions
        if width > height * 3:
            return "number_line_candidate"
        elif abs(width - height) < min(width, height) * 0.3:
            return "geometric_shape_candidate"
        elif item_count > 20:
            return "complex_diagram"
        else:
            return "mathematical_element"
    
    def classify_math_image(self, width: int, height: int, context: str):
        """Classify images by mathematical content"""
        aspect_ratio = width / height if height > 0 else 1
        
        context_lower = context.lower()
        
        # Check context for specific math content
        if any(term in context_lower for term in ["number line", "coordinate", "axis"]):
            return "coordinate_system"
        elif any(term in context_lower for term in ["triangle", "circle", "polygon", "shape"]):
            return "geometric_figure"
        elif any(term in context_lower for term in ["graph", "chart", "data"]):
            return "data_visualization"
        elif any(term in context_lower for term in ["diagram", "figure", "illustration"]):
            return "mathematical_diagram"
        
        # Use dimensions as additional clues
        if aspect_ratio > 3:
            return "timeline_or_sequence"
        elif 0.3 < aspect_ratio < 3:
            return "diagram_or_illustration"
        else:
            return "mathematical_content"
    
    def analyze_image_context(self, page, img_rects):
        """Get text context around images"""
        if not img_rects:
            return "Unknown context"
        
        rect = img_rects[0]
        expanded_rect = fitz.Rect(
            max(0, rect.x0 - 100),
            max(0, rect.y0 - 100),
            rect.x1 + 100,
            rect.y1 + 100
        )
        
        context_text = page.get_textbox(expanded_rect)
        return context_text[:200] if context_text else "No text context"
    
    def extract_text_structure(self, page, page_num: int):
        """Extract structured text elements"""
        text_dict = page.get_text("dict")
        structured_elements = []
        
        for block in text_dict["blocks"]:
            if "lines" in block:
                full_text = ""
                for line in block["lines"]:
                    for span in line["spans"]:
                        full_text += span["text"]
                
                if full_text.strip():
                    element = {
                        "text": full_text.strip()[:500],  # Limit text length
                        "bbox": [float(x) for x in block["bbox"]],
                        "type": self.classify_text_type(full_text.strip())
                    }
                    structured_elements.append(element)
        
        return structured_elements
    
    def classify_text_type(self, text: str):
        """Classify text by educational content type"""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ["unit", "lesson", "session"]):
            return "section_header"
        elif any(word in text_lower for word in ["activity", "try it", "practice", "explore"]):
            return "activity_instruction"
        elif any(word in text_lower for word in ["problem", "exercise", "question"]):
            return "math_problem"
        elif text.strip() and text.strip()[0].isdigit() and "." in text[:10]:
            return "numbered_item"
        elif len(text) > 100:
            return "content_paragraph"
        else:
            return "text_element"
    
    def save_results(self):
        """Save extraction results to JSON file"""
        output_file = os.path.join(self.output_dir, f"{self.filename}_extraction.json")
        
        try:
            with open(output_file, 'w') as f:
                json.dump(self.data, f, indent=2)
            
            print(f"💾 Extraction data saved: {output_file}")
            return output_file
        except Exception as e:
            print(f"❌ Error saving results: {e}")
            return None
    
    def generate_report(self):
        """Generate summary report"""
        stats = self.data["extraction_stats"]
        
        # Count classifications
        image_types = {}
        drawing_types = {}
        text_types = {}
        
        for page in self.data["pages"]:
            for img in page["images"]:
                classification = img.get("classification", "unknown")
                image_types[classification] = image_types.get(classification, 0) + 1
            
            for drawing in page["drawings"]:
                d_type = drawing.get("classification", "unknown")
                drawing_types[d_type] = drawing_types.get(d_type, 0) + 1
            
            for text in page["text_structure"]:
                t_type = text.get("type", "unknown")
                text_types[t_type] = text_types.get(t_type, 0) + 1
        
        report = {
            "extraction_summary": stats,
            "content_classification": {
                "image_types": image_types,
                "drawing_types": drawing_types,
                "text_types": text_types
            }
        }
        
        return report
    
    def close(self):
        """Close PDF document"""
        self.doc.close()

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 comprehensive_extractor.py <pdf_path> [max_pages]")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    max_pages = int(sys.argv[2]) if len(sys.argv) > 2 else None
    
    if not os.path.exists(pdf_path):
        print(f"Error: File not found: {pdf_path}")
        sys.exit(1)
    
    try:
        extractor = MathCurriculumExtractor(pdf_path)
        
        # Extract content
        data = extractor.extract_full_curriculum(max_pages)
        
        # Save results
        output_file = extractor.save_results()
        
        # Generate and display report
        report = extractor.generate_report()
        
        print(f"\n📊 COMPREHENSIVE EXTRACTION REPORT:")
        print(f"✅ Pages processed: {report['extraction_summary']['pages_processed']}")
        print(f"📸 Images extracted: {report['extraction_summary']['total_images']}")
        print(f"🖼️ Drawings analyzed: {report['extraction_summary']['total_drawings']}")
        
        if report['content_classification']['image_types']:
            print(f"\n📸 Image classifications:")
            for img_type, count in report['content_classification']['image_types'].items():
                print(f"  {img_type}: {count}")
        
        if report['content_classification']['drawing_types']:
            print(f"\n🖼️ Drawing classifications:")
            for draw_type, count in report['content_classification']['drawing_types'].items():
                print(f"  {draw_type}: {count}")
        
        print(f"\n📁 Images saved to: {extractor.images_dir}")
        print(f"📄 Data saved to: {output_file}")
        
        extractor.close()
        
        print(f"\n🎉 Comprehensive extraction completed!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
