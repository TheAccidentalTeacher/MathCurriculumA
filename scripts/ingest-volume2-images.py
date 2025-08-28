#!/usr/bin/env python3
"""
Volume 2 Database Image Ingestion Script
Upload RCM07_NA_SW_V2 images to PostgreSQL database
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

def ensure_volume2_document(conn):
    """Ensure RCM07_NA_SW_V2.pdf document exists"""
    cursor = conn.cursor()
    
    # Check if Volume 2 document exists
    cursor.execute("SELECT id FROM documents WHERE filename = %s", ("RCM07_NA_SW_V2.pdf",))
    result = cursor.fetchone()
    
    if result:
        document_id = result[0]
        print(f"✅ Found existing Volume 2 document: {document_id}")
        return document_id
    else:
        # Create Volume 2 document
        cursor.execute("""
            INSERT INTO documents (filename, title, grade_level, volume, subject, publisher, content, page_count, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (
            "RCM07_NA_SW_V2.pdf",
            "Mathematics",
            "7",
            "V2",
            "Mathematics", 
            "Ready Classroom Mathematics",
            "Full curriculum content for Grade 7 Volume 2",
            440,
            datetime.now(),
            datetime.now()
        ))
        document_id = cursor.fetchone()[0]
        conn.commit()
        print(f"✅ Created Volume 2 document: {document_id}")
        return document_id

def ingest_volume2_images():
    """Ingest all Volume 2 page images"""
    
    print("🗄️ VOLUME 2 DATABASE IMAGE INGESTION")
    print("=" * 50)
    
    # Get database connection
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        # Ensure Volume 2 document exists
        document_id = ensure_volume2_document(conn)
        
        # Set up paths
        pages_dir = "webapp_pages/RCM07_NA_SW_V2/pages"
        
        if not os.path.exists(pages_dir):
            print(f"❌ Pages directory not found: {pages_dir}")
            return False
        
        # Get list of page files
        page_files = [f for f in os.listdir(pages_dir) if f.endswith('.png')]
        page_files.sort()
        
        print(f"📁 Images directory: {pages_dir}")
        print(f"📄 Found {len(page_files)} page images")
        print(f"🗄️ Target document ID: {document_id}")
        print()
        
        cursor = conn.cursor()
        
        # Clear existing page images for this document
        cursor.execute("DELETE FROM page_images WHERE document_id = %s", (document_id,))
        print(f"🧹 Cleared existing page images")
        
        # Process each page
        successful_uploads = 0
        total_size = 0
        
        for i, page_file in enumerate(page_files, 1):
            page_path = os.path.join(pages_dir, page_file)
            
            try:
                # Extract page number from filename
                page_number = int(page_file.replace('page_', '').replace('.png', ''))
                
                # Read and process image
                with Image.open(page_path) as img:
                    # Convert to PNG bytes
                    img_buffer = io.BytesIO()
                    img.save(img_buffer, format='PNG', optimize=True)
                    img_bytes = img_buffer.getvalue()
                    
                    width, height = img.size
                    file_size_kb = len(img_bytes) / 1024
                    total_size += file_size_kb
                    
                    # Classify page type
                    if page_number == 1:
                        page_type = "cover"
                    elif page_number <= 10:
                        page_type = "frontmatter" 
                    elif "unit" in page_file.lower():
                        page_type = "unit_opener"
                    else:
                        page_type = "content"
                    
                    # Insert into database
                    cursor.execute("""
                        INSERT INTO page_images (
                            document_id, page_number, filename, image_data, 
                            width, height, file_size_kb, page_type, 
                            word_count, text_preview, keywords, created_at
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        document_id, page_number, page_file, img_bytes,
                        width, height, file_size_kb, page_type,
                        0, f"Page {page_number} content", [],
                        datetime.now()
                    ))
                    
                    successful_uploads += 1
                    
                    if i % 50 == 0:
                        print(f"  ✅ Processed {i}/{len(page_files)} pages...")
                        conn.commit()  # Commit in batches
                    
            except Exception as e:
                print(f"  ❌ Page {i}: Failed to process {page_file} - {e}")
                continue
        
        # Final commit
        conn.commit()
        
        print()
        print("🎉 VOLUME 2 INGESTION COMPLETE!")
        print(f"✅ Successfully uploaded: {successful_uploads} pages")
        print(f"📊 Total data size: {total_size/1024:.1f} MB")
        print("🗄️ Stored in PostgreSQL database")
        print("🌐 Ready for web serving via API")
        
        return True
        
    except Exception as e:
        print(f"❌ Ingestion failed: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    success = ingest_volume2_images()
    sys.exit(0 if success else 1)
