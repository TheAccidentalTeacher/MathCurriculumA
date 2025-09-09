# Session-Level Extraction Enhancement Plan
## 4-Phase Implementation Strategy

**Date Created:** September 8, 2025  
**Objective:** Extract complete session-level detail from Ready Classroom Mathematics curricula to enhance pathway generation accuracy  
**Current State:** Unit→Lesson structure captured; Session detail missing  
**Target State:** Unit→Lesson→Session structure with full 5-day breakdown  

---

## **PHASE 1: Analysis & Pattern Recognition** 
### **Duration:** 1-2 hours
### **Objective:** Thoroughly analyze session patterns in source data to create robust extraction rules

#### **Tasks:**

- [ ] **1.1 Session Pattern Analysis**
  - [ ] Examine session markers across multiple grades (Grade 6, 7, 8, Algebra 1)
  - [ ] Document regex patterns for session identification
  - [ ] Map session types: `Explore`, `Develop`, `Refine`
  - [ ] Identify page range patterns for each session type
  - [ ] Create session numbering validation (Sessions 1-5 per lesson)

- [ ] **1.2 Content Structure Analysis**
  - [ ] Analyze lesson flow: Explore→Develop(multiple)→Refine
  - [ ] Document session content patterns (activities, practice, assessments)
  - [ ] Identify session-specific learning objectives
  - [ ] Map session timing indicators (if present)

- [ ] **1.3 Edge Case Documentation**
  - [ ] Identify lessons with non-standard session counts
  - [ ] Document Math in Action lesson variations
  - [ ] Handle assessment sessions and review sessions
  - [ ] Account for unit opener/closer content

#### **Deliverables:**
- [ ] `session_patterns_analysis.json` - Complete pattern documentation
- [ ] `extraction_rules.md` - Detailed extraction logic specifications
- [ ] `edge_cases_inventory.md` - Known exceptions and handling strategies

---

## **PHASE 2: Enhanced Extraction Engine Development**
### **Duration:** 2-3 hours  
### **Objective:** Create robust session extraction capabilities in existing pipeline

#### **Tasks:**

- [ ] **2.1 Core Session Extraction**
  - [ ] Extend `comprehensive_extraction_engine.py` with session parsing
  - [ ] Implement session marker detection regex
  - [ ] Create session type classification logic
  - [ ] Build page range calculation for sessions
  - [ ] Add session title extraction from text previews

- [ ] **2.2 Data Structure Enhancement**
  - [ ] Design enhanced JSON schema with session arrays
  - [ ] Implement session validation (1-5 per lesson)
  - [ ] Add session metadata (type, duration estimates, objectives)
  - [ ] Create session→standards mapping where possible
  - [ ] Build session dependency tracking

- [ ] **2.3 Quality Assurance Features**
  - [ ] Implement session completeness validation
  - [ ] Add cross-reference checking (lesson→session consistency)
  - [ ] Create missing session detection alerts
  - [ ] Build duplicate session prevention
  - [ ] Add session sequence validation

#### **Deliverables:**
- [ ] Enhanced `comprehensive_extraction_engine.py`
- [ ] `session_extraction_module.py` - Dedicated session processing
- [ ] Updated JSON schema documentation
- [ ] Session validation test suite

---

## **PHASE 3: Data Extraction & Validation**
### **Duration:** 2-4 hours
### **Objective:** Extract session data for all curriculum grades and validate quality

#### **Tasks:**

- [ ] **3.1 Full Curriculum Extraction**
  - [ ] Run enhanced extraction on Grade 6 (both volumes)
  - [ ] Re-extract Grade 7 with session detail
  - [ ] Re-extract Grade 8 with session detail  
  - [ ] Re-extract Algebra 1 with session detail
  - [ ] Generate session-enhanced JSON structures

- [ ] **3.2 Data Quality Validation**
  - [ ] Verify session counts per lesson (should be ~5)
  - [ ] Validate session type distribution (1 Explore, 3-4 Develop, 1 Refine)
  - [ ] Check page range continuity and coverage
  - [ ] Confirm session title extraction accuracy
  - [ ] Cross-validate against known lesson structures

- [ ] **3.3 Comparative Analysis**
  - [ ] Compare old vs new data structures
  - [ ] Calculate extraction completeness metrics
  - [ ] Identify any data quality regressions
  - [ ] Document session coverage statistics per grade
  - [ ] Create extraction quality report

#### **Deliverables:**
- [ ] `GRADE6_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS.json`
- [ ] `GRADE7_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS.json`
- [ ] `GRADE8_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS.json`
- [ ] `ALGEBRA1_COMPLETE_CURRICULUM_STRUCTURE_WITH_SESSIONS.json`
- [ ] `session_extraction_quality_report.md`

---

## **PHASE 4: Integration & Enhancement**
### **Duration:** 2-3 hours
### **Objective:** Integrate session data into pathway generation and enhance system capabilities

#### **Tasks:**

- [ ] **4.1 Enhanced AI Service Integration**
  - [ ] Update `enhanced-ai-service.ts` to load session data
  - [ ] Modify `buildAdvancedPrompt()` to include session detail
  - [ ] Add session-level pacing calculations
  - [ ] Implement session-specific pathway recommendations
  - [ ] Create session-based time estimation logic

- [ ] **4.2 Pacing Guide Enhancement**
  - [ ] Update pacing calculations from lesson-based to session-based
  - [ ] Implement realistic session/week pacing (vs lesson/week)
  - [ ] Add session type balancing in pathways
  - [ ] Create session-level prerequisite tracking
  - [ ] Build session difficulty progression logic

- [ ] **4.3 API Response Enhancement**
  - [ ] Include session breakdown in pathway responses
  - [ ] Add session-level learning objectives
  - [ ] Provide session timing recommendations
  - [ ] Create session-specific resource suggestions
  - [ ] Build session progress tracking capabilities

- [ ] **4.4 Testing & Validation**
  - [ ] Test pathway generation with session data
  - [ ] Validate improved pacing accuracy
  - [ ] Compare old vs new pathway quality
  - [ ] Run accelerated pathway tests (Grade 8+9)
  - [ ] Verify session-based time estimates

#### **Deliverables:**
- [ ] Enhanced `enhanced-ai-service.ts` with session capabilities
- [ ] Updated pathway generation logic
- [ ] Session-enhanced API response examples
- [ ] Comparative testing results
- [ ] Updated system documentation

---

## **Success Metrics**

### **Quantitative Measures:**
- [ ] **Session Coverage:** >95% of lessons have complete session breakdown
- [ ] **Session Accuracy:** Session types correctly classified (Explore/Develop/Refine)
- [ ] **Timing Precision:** Session-based pacing within 10% of actual curriculum timing
- [ ] **Data Completeness:** All 4 grades have session-enhanced structures

### **Qualitative Measures:**
- [ ] **Pathway Quality:** More realistic and implementable pacing guides
- [ ] **Granularity:** Session-level detail enables daily lesson planning
- [ ] **Standards Alignment:** Session-specific standards mapping where applicable
- [ ] **Educator Utility:** Teachers can use session breakdown for actual planning

---

## **Risk Mitigation**

### **Technical Risks:**
- [ ] **Pattern Variations:** Some lessons may have non-standard session structures
  - *Mitigation:* Comprehensive pattern analysis in Phase 1
- [ ] **Data Quality:** Session extraction may introduce parsing errors
  - *Mitigation:* Extensive validation and quality checks in Phase 3
- [ ] **Performance Impact:** Session data significantly increases data size
  - *Mitigation:* Monitor load times and optimize data structures

### **Implementation Risks:**
- [ ] **Timeline Pressure:** 4 phases may take longer than estimated
  - *Mitigation:* Prioritize phases, can deploy incrementally
- [ ] **Compatibility Issues:** New session data may break existing features
  - *Mitigation:* Maintain backward compatibility, gradual integration

---

## **Phase Dependencies**

```
Phase 1 (Analysis) → Phase 2 (Development) → Phase 3 (Extraction) → Phase 4 (Integration)
      ↓                    ↓                      ↓                    ↓
Pattern Rules → Enhanced Engine → Session Data → Enhanced Pathways
```

---

## **Next Steps**

1. **Immediate:** Begin Phase 1 analysis
2. **Priority:** Focus on Grade 8 as primary test case (already extracted)
3. **Validation:** Use known lesson structures to validate extraction accuracy
4. **Iteration:** Each phase builds on previous, allows for course correction

---

**Status:** Ready to begin Phase 1  
**Estimated Total Duration:** 8-12 hours across 4 phases  
**Primary Goal:** Transform curriculum pathway generation from lesson-level to session-level granularity
