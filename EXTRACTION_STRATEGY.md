# Math Curriculum Extraction Strategy

## Current Problem
- 4 PDFs (~1GB) contain mostly visual/graphical math content
- Current text-only extraction gets ~2MB of fragmented text
- No understanding of curriculum structure (units, lessons, exercises)

## Better Approach Needed

### 1. **Visual-Aware Extraction**
- Use OCR + layout analysis to understand page structure
- Extract math equations, diagrams, and visual elements
- Preserve spatial relationships between text and graphics

### 2. **Curriculum Structure Recognition**
- Detect table of contents, chapter headings, lesson titles
- Identify exercise blocks, example problems, answer keys
- Parse learning objectives, vocabulary, skill practices

### 3. **Content Classification**
- **Instructional Content**: Explanations, examples, concepts
- **Practice Content**: Exercises, problems, assessments
- **Reference Content**: Glossary, formulas, tables
- **Metadata**: Grade level, standards, difficulty

### 4. **Rich Data Model**
Instead of simple text chunks:
```
Curriculum:
├── Units (e.g., "Ratios and Proportional Relationships")
│   ├── Lessons (e.g., "Lesson 1: Understanding Ratios")
│   │   ├── Learning Objectives
│   │   ├── Vocabulary Terms
│   │   ├── Instructional Content (text + images)
│   │   ├── Worked Examples (problems + solutions)
│   │   └── Practice Problems (with answer keys)
│   └── Unit Assessment
└── Appendices (glossary, reference materials)
```

## Recommended Tools
1. **pdf2image** + **pytesseract** for OCR
2. **pdfplumber** for better layout analysis  
3. **mathpix** API for equation extraction
4. **spaCy** for content classification
5. **OpenAI GPT-4V** for visual content understanding

## Implementation Plan
1. **Phase 1**: Better text extraction with layout preservation
2. **Phase 2**: Add OCR for visual elements  
3. **Phase 3**: Intelligent content classification
4. **Phase 4**: Curriculum structure recognition

Would you like me to implement Phase 1 first?
