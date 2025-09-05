# F12 Console Debugging Guide for Dynamic Pacing Guide Generator

## Overview
We've implemented comprehensive browser console debugging to help diagnose issues with the Dynamic Pacing Guide Generator, particularly the "empty content" problem where guides generate successfully but display empty sections.

## How to Access F12 Debugging

### 1. Open Browser Developer Tools
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
- **Safari**: Press `Cmd+Option+I` (Mac) - ensure Developer menu is enabled

### 2. Navigate to Console Tab
Click on the "Console" tab in the developer tools panel.

### 3. Enable All Log Levels
Make sure all log levels are enabled (Info, Warnings, Errors, Debug).

## Debug Information Available

### 🎯 Frontend (Pacing Generator Page)
When you submit a pacing guide request, you'll see organized console output:

```
🎯 [Frontend] Pacing Guide Form Submission
📝 [Frontend] Request payload: {
  "gradeLevel": "7",
  "timeframe": "semester",
  "studentPopulation": "Accelerated",
  ...
}
🚀 [Frontend] Submitting to API...
📨 [Frontend] API Response received: { success: true, ... }
📊 [Frontend] Generated guide structure:
  Title: "Grade 7 Semester Mathematics Pacing Guide"
  Overview: {...}
  Weekly schedule entries: 18
  Assessment plan: true
  Has recommendations: true
✅ [Frontend] Guide processing complete
```

### 🎯 Backend API Route (/api/pacing/generate)
The API route provides detailed server-side debugging:

```
🎯 [API] Pacing Guide Generation Request
📝 [API] Request body received: {
  "gradeLevel": "7",
  "timeframe": "semester",
  ...
}
✅ [API] Validating required fields...
🔍 [API] Validating grade combination...
📖 [API] Single grade detected
✅ [API] Final grades to validate: ["7"]
🔍 [API] Invalid grades found: []
🤖 [API] Initializing AI service...
🚀 [API] Calling AI service with request: {...}
📊 [API] AI service response received:
  Success: true
  Has pacing guide: true
  Pacing guide structure:
    Overview: {...}
    Weekly schedule count: 18
    Assessment plan: true
    Differentiation strategies count: 5
    Standards alignment count: 12
✅ [API] Returning successful response
🧹 [API] Cleaning up AI service...
```

### 🧠 AI Service (Enhanced AI Service)
Deep AI processing debugging:

```
🧠 [AI Service] Generating Pacing Guide
📝 [AI Service] Request received: {...}
🔍 [AI Service] Parsing grade configuration...
📊 [AI Service] Grade config: { selectedGrades: ["7"], pathwayType: "sequential" }
📚 [AI Service] Building curriculum contexts for grades: ["7"]
📖 [AI Service] Contexts built, count: 1
🔗 [AI Service] Merging curriculum contexts...
📋 [AI Service] Merged context prepared
💡 [AI Service] Generating advanced recommendations...
✨ [AI Service] Recommendations generated, count: 3
📝 [AI Service] Building advanced prompt...
🎯 [AI Service] Prompt built, length: 2847 characters
🤖 [AI Service] Calling OpenAI API...
📨 [AI Service] OpenAI response received
📝 [AI Service] AI response length: 3421 characters
🔍 [AI Service] AI response preview: {"overview":{"gradeLevel":"7","timeframe":"semester"...
🔧 [AI Service] Parsing AI response...
📊 Parsed response structure: ["overview", "weeklySchedule", "assessmentPlan", ...]
🏗️ [AI Service] Building structured pacing guide...
📋 [AI Service] Built pacing guide structure:
  Overview: {...}
  Weekly schedule entries: 18
  Assessment plan: true
  Differentiation strategies: 5
  Flexibility options: 3
  Standards alignment: 12
✅ [AI Service] Pacing guide parsed successfully
🎉 [AI Service] Returning successful result
```

## Debugging Common Issues

### 🔍 Empty Content Sections
If you see successful generation but empty content:

1. **Check API Response Structure**:
   Look for `📊 [API] AI service response received:` and verify:
   - `Has pacing guide: true`
   - `Weekly schedule count: > 0`
   - `Assessment plan: true`

2. **Check AI Response Parsing**:
   Look for `🔧 [AI Service] Parsing AI response...` and verify:
   - `AI response length: > 1000 characters`
   - `Parsed response structure:` contains expected keys
   - No parsing errors

3. **Check Frontend Processing**:
   Look for `📊 [Frontend] Generated guide structure:` and verify:
   - All sections have content
   - No undefined or null values

### 🔍 Grade Validation Issues
If you see grade validation errors:

```
❌ [API] Invalid grade: 9
❌ [API] Grade validation failed
```

This indicates unsupported grade levels. Currently supports grades 6, 7, 8.

### 🔍 AI Service Errors
If you see AI-related errors:

```
💥 [AI Service] Error generating pacing guide: OpenAI API error
🛟 [AI Service] Generating fallback pacing guide...
```

This indicates OpenAI API issues. Check:
- API key configuration
- Rate limits
- Network connectivity

### 🔍 JSON Parsing Errors
If you see parsing errors:

```
❌ Failed to parse AI response as JSON
🛟 [AI Service] Generating fallback pacing guide...
```

This indicates AI returned non-JSON content. The system will fall back to a basic guide.

## Console Search Tips

### Filter by Component
- `[Frontend]` - Frontend form and response handling
- `[API]` - Backend API route processing
- `[AI Service]` - AI service and OpenAI integration

### Filter by Operation
- `Request` - Initial request processing
- `Response` - API responses and results
- `Parsing` - JSON parsing and structure building
- `Error` - Error conditions and handling

### Filter by Status
- `✅` - Successful operations
- `❌` - Errors and failures
- `🔍` - Validation and checking
- `📊` - Data structure information

## Debugging Workflow

1. **Clear Console**: Click the clear button (🗑️) before testing
2. **Submit Request**: Fill out and submit the pacing guide form
3. **Monitor Output**: Watch the real-time console output
4. **Identify Issues**: Look for error messages or unexpected values
5. **Trace Flow**: Follow the request from frontend → API → AI service → response
6. **Check Structure**: Verify the final guide structure has content

## Production vs Development

- **Development**: Full error details and stack traces
- **Production**: Sanitized error messages for security

## Troubleshooting Steps

1. **Verify Request Format**: Check the initial request payload is correct
2. **Check API Status**: Ensure API returns `success: true`
3. **Validate AI Response**: Confirm AI service receives and parses content
4. **Inspect Final Structure**: Verify the frontend receives complete guide data
5. **Check Network**: Ensure no network errors in Network tab

This debugging system provides complete visibility into the pacing guide generation process, making it easy to identify exactly where issues occur in the pipeline.
