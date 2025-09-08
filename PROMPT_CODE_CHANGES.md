# Prompt Code Changes - Before & After

## 1. Main AI Service Template Changes

### File: `src/lib/enhanced-ai-service.ts` - Line ~1670

#### BEFORE: Complex JSON Template
```javascript
**JSON OUTPUT REQUIRED:**
Return ONLY valid JSON in this exact format:

```json
{
  "overview": {
    "totalWeeks": ${totalWeeks},
    "lessonsPerWeek": 4,
    "description": "Brief description"
  },
  "weeklySchedule": [
    {
      "week": 1,
      "unit": "EXACT unit title from curriculum data",
      "lessons": ["Grade 8, Unit 1, Lesson 1: Title (Page #)"],
      "focusStandards": ["8.G.A.1"],
      "learningObjectives": ["Clear objective"],
      "assessmentType": "formative"
    }
  ],
  "assessmentPlan": {
    "formativeFrequency": "Weekly",
    "summativeSchedule": [],
    "diagnosticCheckpoints": [],
    "portfolioComponents": []
  },
  "differentiationStrategies": [],
  "flexibilityOptions": [],
  "standardsAlignment": []
}
```
```

#### AFTER: Simplified JSON Template
```javascript
**JSON OUTPUT REQUIRED:**
Return ONLY valid JSON in this exact format:

```json
{
  "overview": {
    "totalWeeks": ${totalWeeks},
    "lessonsPerWeek": 4,
    "description": "Brief description"
  },
  "weeklySchedule": [
    {
      "week": 1,
      "unit": "EXACT unit title from curriculum data",
      "lessons": ["Grade 8, Unit 1, Lesson 1: Title (Page #)"],
      "focusStandards": ["8.G.A.1"],
      "learningObjectives": ["Clear objective"]
    }
  ]
}
```
```

**Key Changes**:
- ❌ Removed `assessmentPlan` section
- ❌ Removed `differentiationStrategies` array
- ❌ Removed `flexibilityOptions` array  
- ❌ Removed `standardsAlignment` array
- ❌ Removed `assessmentType` from weekly schedule

---

## 2. Single-Grade Template Simplification

### File: `src/lib/enhanced-ai-service.ts` - Line ~1200

#### BEFORE: Complex Response Structure
```javascript
RESPONSE FORMAT:
Please structure your response as a detailed JSON object with the following structure:
{
  "overview": {
    "totalWeeks": number,
    "lessonsPerWeek": number,
    "paceDescription": "string"
  },
  "weeklySchedule": [
    {
      "week": number,
      "unit": "string",
      "lessons": ["lesson1", "lesson2"],
      "focusStandards": ["standard1", "standard2"],
      "learningObjectives": ["objective1", "objective2"],
      "assessmentType": "formative|summative|diagnostic",
      "differentiationNotes": "string"
    }
  ],
  "assessmentPlan": {
    "formativeFrequency": "string",
    "summativeSchedule": [
      {
        "week": number,
        "type": "string",
        "standards": ["standard1"],
        "description": "string"
      }
    ],
    "diagnosticCheckpoints": [week_numbers],
    "portfolioComponents": ["component1", "component2"]
  },
  "differentiationStrategies": [
    {
      "studentGroup": "string",
      "modifications": ["mod1", "mod2"],
      "resources": ["resource1", "resource2"],
      "assessmentAdjustments": ["adj1", "adj2"]
    }
  ],
  "flexibilityOptions": [
    {
      "scenario": "string",
      "adjustments": ["adj1", "adj2"],
      "impactAnalysis": "string"
    }
  ],
  "standardsAlignment": [
    {
      "standard": "string",
      "weeksCovered": [week_numbers],
      "depth": "introduction|development|mastery",
      "connections": ["connection1", "connection2"]
    }
  ]
}
```

#### AFTER: Simplified Response Structure
```javascript
RESPONSE FORMAT:
Please structure your response as a simple JSON object with this EXACT structure:

```json
{
  "overview": {
    "totalWeeks": number,
    "lessonsPerWeek": number,
    "description": "Brief description of the curriculum"
  },
  "weeklySchedule": [
    {
      "week": number,
      "unit": "Unit name",
      "lessons": ["lesson1", "lesson2"],
      "focusStandards": ["standard1", "standard2"],
      "learningObjectives": ["objective1", "objective2"]
    }
  ]
}
```

Generate exactly ${this.calculateWeeks(request.timeframe)} weeks of curriculum content.
```

**Key Changes**:
- ❌ Removed entire `assessmentPlan` object
- ❌ Removed `differentiationStrategies` array
- ❌ Removed `flexibilityOptions` array
- ❌ Removed `standardsAlignment` array
- ❌ Removed `assessmentType` and `differentiationNotes` from weekly items
- ✅ Added clear output constraint instruction

---

## 3. Frontend Forced Simplification

### File: `src/components/pacing/PacingGuideResults.tsx` - Line ~36

#### BEFORE: Conditional Tab Display
```javascript
// Determine if this is a detailed lesson guide
const isDetailedGuide = !!detailedLessonGuide;

// Complex tab array selection
{(isDetailedGuide 
  ? ['overview', 'detailed-lessons', 'progression', 'assessments', 'lesson-plans'] 
  : ['overview', 'weekly', 'assessments', 'differentiation', 'standards']
).map((view) => (...))}
```

#### AFTER: Forced Simple Mode
```javascript
// Force simple mode - we want basic tabs only
const isDetailedGuide = false;  // Always use simple mode
const currentGuide = pacingGuide || null;

// Only show simple tabs
{['overview', 'weekly', 'progression'].map((view) => (...))}
```

**Key Changes**:
- ✅ Always set `isDetailedGuide = false`
- ✅ Only use `pacingGuide` data, ignore `detailedLessonGuide`
- ✅ Fixed tab array to only 3 tabs: `overview`, `weekly`, `progression`
- ❌ Removed conditional logic for tab selection

---

## 4. Content View Simplification

### File: `src/components/pacing/PacingGuideResults.tsx` - Line ~145

#### BEFORE: Multiple Conditional Views
```javascript
{activeView === 'overview' && (
  <OverviewView 
    pacingGuide={currentGuide} 
    detailedLessonGuide={detailedLessonGuide}
  />
)}

{activeView === 'detailed-lessons' && isDetailedGuide && (
  <DetailedLessonsView 
    lessonGuide={detailedLessonGuide!}
    selectedLesson={selectedLesson}
    onLessonSelect={(lesson) => setSelectedLesson(lesson)}
  />
)}

{activeView === 'progression' && isDetailedGuide && (
  <ProgressionMapView progressionMap={detailedLessonGuide!.progressionMap} />
)}

{activeView === 'lesson-plans' && isDetailedGuide && (...)}
{activeView === 'assessments' && (...)}
{activeView === 'differentiation' && !isDetailedGuide && (...)}
{activeView === 'standards' && !isDetailedGuide && (...)}
```

#### AFTER: Simple View Selection
```javascript
{activeView === 'overview' && (
  <OverviewView 
    pacingGuide={currentGuide} 
  />
)}

{activeView === 'weekly' && (
  <WeeklyScheduleView 
    schedule={currentGuide.weeklySchedule}
    selectedWeek={selectedWeek}
    onWeekSelect={handleWeekSelect}
  />
)}

{activeView === 'progression' && (
  <ProgressionMapView progressionMap={[
    {
      stage: "1",
      weeks: Array.from({length: currentGuide.overview.totalWeeks}, (_, i) => i + 1),
      focus: "Complete mathematics curriculum",
      milestones: ["Weekly assessments", "Unit completions"],
      assessmentPoints: ["Formative assessments", "Unit tests"]
    }
  ]} />
)}
```

**Key Changes**:
- ❌ Removed all conditional `isDetailedGuide` checks
- ❌ Removed complex views: `DetailedLessonsView`, `LessonPlansView`, `AssessmentPlanView`, `DifferentiationView`, `StandardsAlignmentView`
- ✅ Simplified to only 3 views: `OverviewView`, `WeeklyScheduleView`, `ProgressionMapView`
- ✅ Created simple progression data structure instead of using complex `detailedLessonGuide.progressionMap`

---

## Summary of Prompt Logic Changes

### Elimination Strategy
1. **Removed Complex Sections**: Cut out 4 major JSON sections that added complexity
2. **Simplified Instructions**: Clear, specific output requirements
3. **Frontend Override**: Force simple mode regardless of backend response
4. **Single Path**: Eliminated multiple generation pathways

### Result Impact
- **Before**: 100+ line JSON responses with complex nested objects
- **After**: ~20 line JSON responses with simple week-by-week structure
- **User Experience**: 3 simple tabs instead of 5+ complex tabs
- **Maintenance**: Single codebase path instead of multiple conditional branches

### Technical Benefits
- ✅ Faster AI generation (simpler prompts)
- ✅ Predictable output format
- ✅ Reduced complexity in frontend handling
- ✅ Better user experience alignment with requirements
