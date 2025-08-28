#!/usr/bin/env python3
"""
Database Image Ingestion Script
Upload all 504 full-page images to PostgreSQL database for web serving
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
import base64
from PIL import Image
import io

def get_db_connection():
    """Get PostgreSQL connection from environment"""
    try:
        # Read DATABASE_URL from .env file
        env_path = ".env"
        database_url = None
        
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                for line in f:
                    if line.startswith('DATABASE_URL='):
                        database_url = line.strip().split('=', 1)[1]
                        # Remove quotes if present
                        database_url = database_url.strip('"\'')
                        break
        
        if not database_url:
            print("❌ DATABASE_URL not found in .env file")
            return None
        
        print(f"🔗 Connecting to PostgreSQL...")
        conn = psycopg2.connect(database_url)
        print("✅ Database connection established")
        return conn
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return None

def ensure_document_exists(conn, document_id, filename):
    """Ensure document record exists in database"""
    cursor = conn.cursor()
    
    # Check if document exists
    cursor.execute("SELECT id FROM documents WHERE filename = %s", (filename,))
    if cursor.fetchone():
        print(f"📄 Document {filename} already exists")
        cursor.execute("SELECT id FROM documents WHERE filename = %s", (filename,))
        doc_id = cursor.fetchone()[0]
        cursor.close()
        return doc_id
    
    # Create document record
    title = filename.replace('_', ' ').replace('.pdf', '').title()
    grade_level = "7" if "RCM07" in filename else "8"
    volume = "V1" if "V1" in filename else "V2"
    
    cursor.execute("""
        INSERT INTO documents (id, filename, title, grade_level, volume, subject, publisher, content, page_count, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
    """, (
        document_id,
        filename,
        title,
        grade_level,
        volume,
        "Mathematics",
        "Ready Classroom Mathematics - Curriculum Associates",
        f"Complete {title} curriculum with visual elements",
        504,
        datetime.now()
    ))
    
    doc_id = cursor.fetchone()[0]
    conn.commit()
    cursor.close()
    
    print(f"✅ Created document record: {title}")
    return doc_id

def ingest_page_images(images_dir, data_file, document_id="rcm07-na-sw-v1"):
    """Ingest all page images into PostgreSQL database"""
    
    if not os.path.exists(images_dir):
        print(f"❌ Images directory not found: {images_dir}")
        return False
    
    if not os.path.exists(data_file):
        print(f"❌ Data file not found: {data_file}")
        return False
    
    # Load page metadata
    with open(data_file, 'r') as f:
        data = json.load(f)
    
    # Connect to database
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        # Ensure document exists
        filename = data.get('filename', 'RCM07_NA_SW_V1')
        doc_id = ensure_document_exists(conn, document_id, filename)
        
        print(f"🎯 INGESTING PAGE IMAGES")
        print(f"📁 Images directory: {images_dir}")
        print(f"📄 Total pages: {len(data['pages'])}")
        print(f"🗄️ Target document ID: {doc_id}")
        print()
        
        cursor = conn.cursor()
        
        # Clear existing page images for this document
        cursor.execute("DELETE FROM page_images WHERE document_id = %s", (doc_id,))
        deleted_count = cursor.rowcount
        if deleted_count > 0:
            print(f"🗑️ Deleted {deleted_count} existing page images")
        
        successful_uploads = 0
        total_size_kb = 0
        
        # Process each page
        for page_info in data['pages']:
            page_number = page_info['page_number']
            filename = page_info['filename']
            image_path = os.path.join(images_dir, filename)
            
            if not os.path.exists(image_path):
                print(f"❌ Page {page_number}: Image file not found: {filename}")
                continue
            
            print(f"  📄 Page {page_number:3d}: {filename} ", end="")
            
            try:
                # Read image file as binary data
                with open(image_path, 'rb') as img_file:
                    image_data = img_file.read()
                
                # Get image dimensions
                with Image.open(image_path) as img:
                    width, height = img.size
                
                file_size_kb = len(image_data) / 1024
                total_size_kb += file_size_kb
                
                # Extract page info
                page_type = classify_page_type(page_info.get('text_preview', ''), page_number, len(data['pages']))
                word_count = page_info.get('word_count', 0)
                text_preview = page_info.get('text_preview', '')[:500]  # Limit length
                keywords = extract_math_keywords(text_preview)
                
                # Insert into database
                cursor.execute("""
                    INSERT INTO page_images 
                    (document_id, page_number, filename, image_data, width, height, 
                     file_size_kb, page_type, word_count, text_preview, keywords)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    doc_id,
                    page_number,
                    filename,
                    psycopg2.Binary(image_data),  # Store as binary data
                    width,
                    height,
                    file_size_kb,
                    page_type,
                    word_count,
                    text_preview,
                    keywords
                ))
                
                successful_uploads += 1
                print(f"✅ {width}×{height}px ({file_size_kb:.1f}KB) [{page_type}]")
                
                # Commit every 50 pages to avoid memory issues
                if successful_uploads % 50 == 0:
                    conn.commit()
                    print(f"    💾 Committed batch ({successful_uploads} pages so far)")
                
            except Exception as e:
                print(f"❌ Error: {e}")
                continue
        
        # Final commit
        conn.commit()
        cursor.close()
        conn.close()
        
        print(f"\n🎉 INGESTION COMPLETE!")
        print(f"✅ Successfully uploaded: {successful_uploads} pages")
        print(f"📊 Total data size: {total_size_kb/1024:.1f} MB")
        print(f"🗄️ Stored in PostgreSQL database")
        print(f"🌐 Ready for web serving via API")
        
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        conn.rollback()
        conn.close()
        return False

def classify_page_type(text, page_num, total_pages):
    """Classify page type based on content"""
    text_lower = text.lower() if text else ""
    
    if page_num == 1:
        return "cover"
    elif page_num <= 3:
        return "frontmatter"
    elif page_num >= total_pages - 2:
        return "backmatter"
    elif 'contents' in text_lower or 'table of contents' in text_lower:
        return "contents"
    elif 'lesson' in text_lower:
        return "lesson"
    elif 'practice' in text_lower:
        return "practice"
    elif 'assessment' in text_lower or 'review' in text_lower:
        return "assessment"
    elif 'unit' in text_lower and 'opener' in text_lower:
        return "unit_opener"
    else:
        return "content"

def extract_math_keywords(text):
    """Extract mathematical keywords from text"""
    if not text:
        return []
    
    math_terms = [
        'fraction', 'decimal', 'percent', 'ratio', 'proportion', 'equation',
        'variable', 'integer', 'coordinate', 'graph', 'number line',
        'geometry', 'triangle', 'circle', 'rectangle', 'area', 'volume',
        'probability', 'statistics', 'mean', 'median'
    ]
    
    text_lower = text.lower()
    found_terms = []
    
    for term in math_terms:
        if term in text_lower:
            found_terms.append(term)
    
    return found_terms[:5]  # Limit to 5 terms

if __name__ == "__main__":
    # Default paths for Grade 7 Volume 1
    images_dir = "webapp_pages/RCM07_NA_SW_V1/pages"
    data_file = "webapp_pages/RCM07_NA_SW_V1/data/document.json"
    
    if len(sys.argv) > 1:
        images_dir = sys.argv[1]
    if len(sys.argv) > 2:
        data_file = sys.argv[2]
    
    print("🗄️ DATABASE IMAGE INGESTION")
    print("=" * 50)
    
    success = ingest_page_images(images_dir, data_file)
    
    if success:
        print(f"\n🚀 NEXT STEPS:")
        print(f"1. Create API endpoint: /api/documents/[id]/pages/[pageNumber]")
        print(f"2. Add page viewer component to Next.js app")
        print(f"3. Test image serving from database")
    else:
        print(f"\n❌ INGESTION FAILED")
        print(f"Check database connection and file paths")
