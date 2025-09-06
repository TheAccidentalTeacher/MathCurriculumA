# Grade 6 Table of Contents Data Extraction Template
# Use this template to manually extract data from AVIF files

## Instructions for Data Extraction

### From each AVIF file (4.avif through 10.avif), extract:

1. **Unit Information**
   - Unit number
   - Unit title
   - Standards mentioned at unit level

2. **Lesson Information** 
   - Lesson number
   - Lesson title
   - Primary standards codes (6.XX.X.X format)
   - Page numbers (start/end)

3. **Session Information**
   - Session number
   - Session title/description
   - Session type (Explore, Develop, Refine, Apply, Practice)
   - Associated standards
   - Page references

## Data Entry Template

### UNIT 1: [Unit Title]
**Standards**: [List all 6.XX.X.X codes]
**Pages**: [Start] - [End]

#### LESSON 1: [Lesson Title]
**Primary Standards**: [6.XX.X.X codes]
**Pages**: [Start] - [End]

##### Session 1: [Session Title]
- **Type**: [Explore/Develop/Refine/Apply]
- **Standards**: [Specific codes if different from lesson]
- **Pages**: [Start] - [End]
- **Duration**: [If specified]

##### Session 2: [Session Title]
- **Type**: [Explore/Develop/Refine/Apply]
- **Standards**: [Specific codes]
- **Pages**: [Start] - [End]
- **Duration**: [If specified]

#### LESSON 2: [Lesson Title]
[Continue pattern...]

### UNIT 2: [Unit Title]
[Continue pattern...]

## Sample Entry (fill this format for each unit/lesson/session):

### UNIT 1: Area and Volume
**Standards**: 6.G.A.1, 6.G.A.4, 6.EE.A.2
**Pages**: 15 - 96

#### LESSON 1: Find the Area of a Parallelogram
**Primary Standards**: 6.G.A.1
**Pages**: 15 - 30

##### Session 1: Explore Finding Areas
- **Type**: Explore
- **Standards**: 6.G.A.1
- **Pages**: 15 - 18
- **Duration**: 45 minutes

##### Session 2: Develop Area Formula
- **Type**: Develop  
- **Standards**: 6.G.A.1
- **Pages**: 19 - 25
- **Duration**: 45 minutes

##### Session 3: Refine Problem Solving
- **Type**: Refine
- **Standards**: 6.G.A.1, 6.EE.A.2
- **Pages**: 26 - 30
- **Duration**: 45 minutes

#### LESSON 2: Find the Area of Triangles and Other Polygons
**Primary Standards**: 6.G.A.1
**Pages**: 31 - 52

[Continue with all sessions...]

## Key Information to Look For:

### Standards Codes Format:
- **6.RP.A.1** - Ratios and Proportional Relationships
- **6.NS.B.3** - Number System  
- **6.EE.A.2** - Expressions and Equations
- **6.G.A.1** - Geometry
- **6.SP.B.4** - Statistics and Probability

### Session Types:
- **Explore** - Introduction/discovery activities
- **Develop** - Skill building and concept development
- **Refine** - Practice and application
- **Apply** - Real-world problem solving
- **Practice** - Additional reinforcement

### Page Number Patterns:
- Look for page ranges like "15-30" or "pp. 15-30"
- Note any special pages (assessments, reviews, etc.)

## Output Format:
Once extracted, save as:
- `grade6_scope_data.json` - Structured JSON data
- `grade6_pacing_guide.json` - Dynamic pacing guide format

## Next Steps After Extraction:
1. Run `python grade6_scope_extractor.py` with your data
2. Generate dynamic pacing guides
3. Create assessment calendars  
4. Build differentiation strategies
5. Connect to actual lesson content (future integration)
