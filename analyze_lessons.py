#!/usr/bin/env python3

import sqlite3
import pandas as pd

print("🔍 Analyzing Precision Database Structure\n")

# Connect to database
conn = sqlite3.connect('/workspaces/MathCurriculumA/curriculum_precise.db')

# Check document structure
print("📚 Document Structure:")
docs = pd.read_sql("SELECT * FROM documents LIMIT 3", conn)
print(docs)

# Check lesson counts by grade/volume  
print("\n📊 Lesson Counts by Grade/Volume:")
counts = pd.read_sql("""
  SELECT d.grade, d.volume, COUNT(l.id) as lesson_count, 
         COUNT(DISTINCT l.lesson_number) as unique_lessons,
         MIN(l.lesson_number) as min_lesson, MAX(l.lesson_number) as max_lesson
  FROM documents d 
  LEFT JOIN lessons l ON d.id = l.document_id 
  GROUP BY d.grade, d.volume 
  ORDER BY d.grade, d.volume
""", conn)
print(counts)

# Check sample lessons for Grade 7
print("\n🎯 Sample Grade 7 Lessons:")
sample_lessons = pd.read_sql("""
  SELECT l.lesson_number, l.title, l.unit_number, d.grade, d.volume
  FROM lessons l 
  JOIN documents d ON l.document_id = d.id 
  WHERE d.grade = '7' AND l.lesson_number <= 10
  ORDER BY d.volume, l.lesson_number 
  LIMIT 10
""", conn)
print(sample_lessons)

# Check unique lesson titles to see if they're reasonable
print("\n📖 Sample Lesson Titles (showing distinct lessons):")
titles = pd.read_sql("""
  SELECT DISTINCT l.title, COUNT(*) as occurrences
  FROM lessons l 
  WHERE l.title LIKE '%lesson%' OR l.title LIKE '%Lesson%' OR l.title LIKE '%LESSON%'
  GROUP BY l.title
  ORDER BY occurrences DESC
  LIMIT 15
""", conn)
print(titles)

conn.close()
