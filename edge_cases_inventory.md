# Edge Cases Inventory & Handling Strategies

**Date:** September 8, 2025  
**Phase:** Phase 1 Analysis  
**Purpose:** Document known exceptions and edge cases in session extraction

---

## **Identified Edge Cases**

### **1. Placeholder Session Markers**

#### **Issue:** Generic placeholder patterns found in text
```
"LESSON # | SESSION #"
"LESSON 11 | SESSION 3" (when # symbols are used)
```

#### **Detection:** 
- Look for `#` symbols or obviously templated text
- Cross-reference with actual lesson numbers

#### **Handling Strategy:**
- Skip placeholder entries during extraction
- Flag for manual review
- Continue processing actual session markers

---

### **2. Math in Action Lessons**

#### **Issue:** End-of-unit performance task lessons may have different structure
```
Examples found: 
- Unit 1: Math in Action - Design a Miniature Golf Course
- Unit 2: Math in Action - Plan a School Field Day
```

#### **Characteristics:**
- Typically 2-3 sessions instead of 5
- Focus on project-based learning
- Different content structure

#### **Handling Strategy:**
- Identify by lesson title containing "Math in Action"
- Extract available sessions (may be 2-3 instead of 5)
- Mark with special lesson_type: "Math in Action"
- Apply modified validation rules (allow < 5 sessions)

---

### **3. Session Type Inference Challenges**

#### **Issue:** Many sessions don't explicitly state Explore/Develop/Refine
```
Examples:
- "LESSON 2 | SESSION 1" (type not stated)
- "LESSON 20 | SESSION 2" (type not stated)
```

#### **Current Success Rate:** ~30% have explicit type, 70% need inference

#### **Handling Strategy:**
- Use session number-based inference (established in extraction_rules.md)
- Session 1 = Explore, Sessions 2-4 = Develop, Session 5 = Refine
- Flag inferred types in metadata for quality tracking

---

### **4. Multi-Page Session Spans**

#### **Issue:** Sessions may span multiple pages with scattered content
```
Example: Session starts on page 15, continues on pages 16, 17, 18
Session marker only appears on first page
```

#### **Handling Strategy:**
- Calculate page ranges based on distance to next session marker
- Validate reasonable page span (typically 2-4 pages per session)
- Flag unusually long (>6 pages) or short (<1 page) sessions

---

### **5. Assessment Integration**

#### **Issue:** Assessments may be embedded within sessions or standalone

#### **Types Found:**
- **Mid-Session Checkpoints**: Quick formative assessments
- **End-Session Assessments**: Session wrap-up activities
- **Unit Assessments**: May span multiple pages

#### **Handling Strategy:**
- Extract as part of session content
- Add assessment metadata to session structure
- Don't create separate "assessment sessions"

---

### **6. Unit Opener/Closer Content**

#### **Issue:** Unit introduction and wrap-up pages may not have session markers

#### **Characteristics:**
- Unit overview pages
- Standards introduction
- Unit vocabulary
- Unit reflection activities

#### **Handling Strategy:**
- Treat as lesson-level content, not session-specific
- Include in first/last lesson of unit if present
- Don't force session structure on non-lesson content

---

### **7. Session Title Extraction Challenges**

#### **Issue:** Session titles may be incomplete or fragmented in text_preview

#### **Examples:**
```
"LESSON 1 | SESSION 1 Explore Rigid Transformations" ✅ Good
"LESSON 2 | SESSION 1 Look Back What are the coordinates..." ❌ Fragmented
"LESSON 9 | SESSION 5 ➤Complete the Example below..." ❌ No clear title
```

#### **Handling Strategy:**
- Extract available title text after session marker
- Clean up formatting symbols (➤, arrows, etc.)
- If no clear title, use generic: "Session {number}"
- Flag sessions with missing/unclear titles

---

### **8. Page Number Inconsistencies**

#### **Issue:** PDF page numbers may not match document page numbering

#### **Potential Problems:**
- Cover pages, table of contents affect numbering
- Different volumes may restart numbering
- Page ranges may cross volume boundaries

#### **Handling Strategy:**
- Use sequential page_number from document.json
- Validate page ranges within volume boundaries
- Flag sessions that cross volume boundaries (shouldn't happen)

---

### **9. Duplicate or Overlapping Sessions**

#### **Issue:** Text parsing errors may create duplicate session entries

#### **Detection:**
- Same lesson number + session number appearing multiple times
- Overlapping page ranges within same lesson

#### **Handling Strategy:**
- Detect duplicates during extraction
- Keep the session with most complete information
- Log duplicate detection for quality metrics

---

### **10. Missing Session Numbers**

#### **Issue:** Sessions may be missing from sequence (1,2,4,5 but no 3)

#### **Causes:**
- PDF extraction errors
- Special lesson structures
- Assessment replacements

#### **Handling Strategy:**
- Flag lessons with missing session numbers
- Continue extraction of available sessions
- Mark lesson as "incomplete" in validation
- Manual review for flagged lessons

---

## **Volume-Specific Edge Cases**

### **Grade 6 Volume 2 (RCM06_NA_SW_V2)**
- **Observed:** Clear session numbering
- **Edge Cases:** None identified yet
- **Quality:** High extraction confidence

### **Grade 7 Volumes (RCM07_NA_SW_V1/V2)**
- **Observed:** Consistent session patterns
- **Edge Cases:** Some sessions lack explicit types
- **Quality:** High extraction confidence  

### **Grade 8 Volumes (RCM08_NA_SW_V1/V2)**
- **Observed:** Best session type identification
- **Edge Cases:** Some placeholder patterns found
- **Quality:** Highest extraction confidence

### **Algebra 1 Volumes (ALG01_NA_SW_V1/V2)**
- **Status:** Not yet analyzed
- **Expected:** Similar patterns to Grade 8
- **Plan:** Analyze in Phase 3

---

## **Quality Assurance Protocols**

### **Pre-Extraction Validation**
- [ ] Verify document.json files are complete
- [ ] Check page numbering consistency
- [ ] Validate file structure integrity

### **During Extraction**
- [ ] Log all edge cases encountered
- [ ] Track extraction success rates per volume
- [ ] Flag problematic lessons for review

### **Post-Extraction Validation**
- [ ] Verify session completeness (aim for 95%+ complete lessons)
- [ ] Validate page range calculations
- [ ] Cross-check session counts with known lesson counts

### **Manual Review Triggers**
- Lessons with < 3 sessions extracted
- Sessions with > 6 pages or < 1 page
- Duplicate session markers detected
- Placeholder patterns found
- Page range overlaps or gaps

---

## **Success Metrics & Thresholds**

### **Acceptable Quality Levels:**
- **Session Detection Rate:** ≥95%
- **Complete Lessons (5 sessions):** ≥90%
- **Valid Page Ranges:** ≥95%
- **Manual Review Rate:** ≤5%

### **Edge Case Impact Assessment:**
- **Low Impact:** Type inference needed (expected)
- **Medium Impact:** Missing 1 session per lesson
- **High Impact:** >2 sessions missing per lesson
- **Critical Impact:** No sessions detected for lesson

---

## **Implementation Notes**

### **Error Recovery Strategies:**
1. **Graceful Degradation**: Extract what's possible, flag the rest
2. **Partial Success**: Better to have 4/5 sessions than 0/5
3. **Quality Over Quantity**: Flag questionable extractions for review
4. **Iterative Improvement**: Learn from edge cases to improve patterns

### **Development Priorities:**
1. **Handle Common Cases First** (95% of lessons)
2. **Add Edge Case Support** (remaining 5%)
3. **Implement Quality Metrics** (monitor success rates)
4. **Build Manual Review Workflow** (handle exceptions)

---

**Status:** ✅ Edge Cases Documented - Ready for Phase 2 Implementation  
**Next Steps:** Use this inventory to build robust extraction logic in Phase 2
