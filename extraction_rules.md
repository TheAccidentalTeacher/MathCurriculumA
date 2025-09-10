# Session Extraction Rules & Logic Specifications

**Date:** September 8, 2025  
**Phase:** Phase 1 Analysis  
**Purpose:** Define precise extraction logic for session-level curriculum data

---

## **Core Extraction Rules**

### **1. Session Identification Patterns**

#### **Primary Pattern Recognition**
```regex
LESSON\s+(\d+)\s*\|\s*SESSION\s+(\d+)(?:\s+(Explore|Develop|Refine))?
```

**Capture Groups:**
- Group 1: Lesson Number
- Group 2: Session Number  
- Group 3: Session Type (optional)

#### **Examples:**
- `LESSON 1 | SESSION 1 Explore Rigid Transformations` ✅
- `LESSON 9 | SESSION 2 Develop Deriving y = mx + b` ✅
- `LESSON 20 | SESSION 5` ✅ (type inferred)
- `LESSON # | SESSION #` ❌ (placeholder, skip)

### **2. Session Type Inference Rules**

When session type is not explicitly stated:

```python
def infer_session_type(session_number: int) -> str:
    if session_number == 1:
        return "Explore"
    elif session_number in [2, 3, 4]:
        return "Develop" 
    elif session_number == 5:
        return "Refine"
    else:
        return "Unknown"
```

### **3. Page Range Calculation**

#### **Logic:**
1. **Start Page**: Page number where session marker appears
2. **End Page**: Page number before next session marker (or lesson end)
3. **Validation**: Session must span at least 1 page, typically 2-4 pages

#### **Algorithm:**
```python
def calculate_session_page_range(current_page: int, next_session_page: int, lesson_end_page: int) -> tuple:
    start_page = current_page
    if next_session_page:
        end_page = next_session_page - 1
    else:
        end_page = lesson_end_page
    return (start_page, end_page)
```

---

## **Validation Rules**

### **Session Completeness Validation**
- **Required Sessions**: 1, 2, 3, 4, 5 per lesson
- **Allowed Variations**: Some lessons may have 3-4 sessions (rare)
- **Error Handling**: Flag lessons with missing sessions for manual review

### **Session Sequence Validation** 
- Sessions must be sequential (1→2→3→4→5)
- No duplicate session numbers within a lesson
- No gaps in session numbering

### **Cross-Reference Validation**
- Session page ranges must not overlap
- Session page ranges must not exceed lesson boundaries
- All lesson pages must be covered by sessions

---

## **Special Cases & Exceptions**

### **Math in Action Lessons**
- **Pattern**: Typically end-of-unit lessons
- **Structure**: May not follow standard 5-session pattern
- **Handling**: Extract available sessions, flag as special type

### **Assessment Sessions**
- **Pattern**: Embedded within regular sessions or standalone
- **Identification**: Look for "assessment", "test", "checkpoint" keywords
- **Handling**: Mark as assessment content within session structure

### **Unit Openers/Closers**
- **Pattern**: Unit introduction and wrap-up content
- **Structure**: May not have session markers
- **Handling**: Treat as lesson-level content, not session-specific

### **Review Sessions**
- **Pattern**: Mid-unit or end-unit review content
- **Structure**: May have modified session patterns
- **Handling**: Extract as regular sessions but flag as review type

---

## **Data Structure Specification**

### **Enhanced Lesson Schema**
```json
{
  "lesson_number": 1,
  "title": "Understand Rigid Transformations and Their Properties",
  "start_page": 15,
  "end_page": 27,
  "standards_focus": ["8.G.1"],
  "lesson_type": "Understand", // Strategy, Understand, Math in Action
  "sessions": [
    {
      "session_number": 1,
      "session_type": "Explore",
      "title": "Explore Rigid Transformations", 
      "start_page": 15,
      "end_page": 18,
      "content_focus": "Prior knowledge activation, concept introduction",
      "activities": ["Exploration activity", "Guided practice"],
      "estimated_duration": "50 minutes"
    },
    {
      "session_number": 2,
      "session_type": "Develop",
      "title": "Develop Understanding of Rigid Transformations",
      "start_page": 19,
      "end_page": 22,
      "content_focus": "Skill building and practice",
      "activities": ["Guided instruction", "Independent practice"], 
      "estimated_duration": "50 minutes"
    }
    // ... sessions 3-5
  ],
  "total_sessions": 5,
  "session_validation": {
    "complete": true,
    "missing_sessions": [],
    "sequence_valid": true
  }
}
```

---

## **Error Handling & Quality Assurance**

### **Error Categories**

#### **Critical Errors** (Extraction Failure)
- No session markers found in lesson
- Invalid lesson/session number format
- Overlapping page ranges

#### **Warning Conditions** (Manual Review Required)
- Missing sessions (< 5 per lesson)
- Non-sequential session numbering
- Unusual page range sizes (< 1 or > 8 pages per session)

#### **Information Flags** (Acceptable Variations)
- Session type not explicitly stated (will be inferred)
- Math in Action lesson structure variation
- Assessment content embedded in sessions

### **Quality Metrics**
- **Session Coverage**: % of lessons with complete session extraction
- **Type Inference Rate**: % of sessions where type was successfully inferred
- **Page Range Accuracy**: % of sessions with valid page ranges
- **Validation Pass Rate**: % of lessons passing all validation rules

---

## **Implementation Priority**

### **Phase 2 Development Order:**
1. **Core Pattern Matching**: Implement basic session marker recognition
2. **Page Range Calculation**: Build logic for session boundaries  
3. **Type Inference**: Add session type inference logic
4. **Validation Suite**: Implement all validation rules
5. **Error Handling**: Add comprehensive error detection and reporting
6. **Quality Metrics**: Build validation and quality reporting

### **Testing Strategy:**
1. **Unit Tests**: Test regex patterns with known examples
2. **Integration Tests**: Test full extraction on sample lessons
3. **Validation Tests**: Verify all quality rules work correctly
4. **Edge Case Tests**: Test special cases and error conditions

---

## **Success Criteria**

- **≥95% Session Detection**: Successfully identify session markers
- **≥90% Complete Sessions**: Extract all 5 sessions per lesson
- **≥95% Valid Page Ranges**: Accurate session boundary calculation
- **≥90% Type Inference**: Successful session type classification
- **100% Validation Coverage**: All lessons pass through validation checks

---

**Status:** ✅ Analysis Complete - Ready for Phase 2 Implementation
