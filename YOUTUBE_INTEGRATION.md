# YouTube Integration for Math Curriculum App

This guide explains how to integrate Khan Academy video recommendations into your math curriculum application using the YouTube Data API v3.

## Overview

The YouTube integration automatically finds relevant Khan Academy videos for each lesson in your curriculum. Videos are displayed in the lesson viewer sidebar, providing students with additional explanations and examples for each topic.

## Setup Instructions

### 1. YouTube API Key Configuration

Your YouTube API key is stored on Railway. Make sure it's configured in your Railway project:

1. Go to your Railway project dashboard
2. Navigate to Variables
3. Ensure `YOUTUBE_API_KEY` is set to your API key
4. The key should have access to the YouTube Data API v3

### 2. API Permissions

Your YouTube API key needs these permissions:
- **YouTube Data API v3** - for searching videos and getting video details
- **Search** - for finding Khan Academy videos
- **Videos** - for getting detailed video information

### 3. Railway Deployment

The YouTube integration is configured in `railway.toml`:

```toml
[variables]
  NODE_ENV = "production"
  YOUTUBE_API_KEY = "${{YOUTUBE_API_KEY}}"
```

## Features

### Intelligent Video Search

The system automatically:
- **Extracts mathematical concepts** from lesson titles
- **Maps grade levels** (7th grade → "middle school", 8th grade → "8th grade algebra")
- **Searches Khan Academy channel only** for educational content
- **Ranks by relevance** and educational value
- **Caches results** to minimize API calls

### Smart Concept Detection

The search algorithm recognizes these mathematical concepts:

- **Proportional relationships**: ratios, scale factors, proportions
- **Algebraic expressions**: equations, inequalities, linear functions
- **Geometry**: angles, triangles, circles, volume, surface area
- **Statistics**: data analysis, probability
- **Number systems**: fractions, decimals, integers, absolute value

### Example Search Transformations:

```
"LESSON 1 | Solve Problems Involving Scale" 
→ "scale factor similar figures proportions middle school mathematics"

"LESSON 18 | Understand Functions"
→ "linear functions relationships 8th grade algebra mathematics"
```

## API Endpoints

### Get Videos for a Lesson

```
GET /api/lessons/{documentId}/{lessonNumber}/videos?title={lessonTitle}
```

**Parameters:**
- `documentId`: Document identifier (e.g., "RCM07_NA_SW_V1")
- `lessonNumber`: Lesson number (integer)
- `title`: Lesson title (URL encoded)

**Response:**
```json
{
  "success": true,
  "lesson": {
    "documentId": "RCM07_NA_SW_V1",
    "lessonNumber": 1,
    "title": "Solve Problems Involving Scale"
  },
  "videos": [
    {
      "id": "video_id",
      "title": "Scale Factor and Similar Figures",
      "description": "Learn about scale factors...",
      "thumbnail": "https://i.ytimg.com/vi/...",
      "duration": "8:45",
      "channelTitle": "Khan Academy",
      "publishedAt": "2023-01-01T00:00:00Z",
      "viewCount": "150000",
      "url": "https://www.youtube.com/watch?v=..."
    }
  ],
  "totalVideos": 1
}
```

## User Interface

### Lesson Viewer Integration

Videos appear in the lesson viewer sidebar with:
- **Video thumbnails** with duration overlay
- **Title and description** 
- **View count and publish date**
- **Direct YouTube links**
- **Embedded video player** for the top result

### Video Recommendations Component

The `KhanAcademyVideos` component provides:
- **Intelligent loading states**
- **Error handling** for API failures
- **Fallback search links** to Khan Academy
- **Responsive design** for all screen sizes

## Testing and Development

### Test YouTube API Integration

Run this command on Railway to test your API key:

```bash
npm run test-youtube
```

This will:
- Verify your API key is working
- Test searches for sample lessons
- Show video results and response times
- Provide debugging information

### Test Specific Lesson

```bash
npm run test-youtube test-lesson "Solve Problems Involving Scale" 7
```

### Batch Video Search

To find videos for all lessons in your curriculum:

```bash
npm run batch-videos
```

This will:
- Search all lessons in your database
- Export results to JSON file
- Provide comprehensive statistics
- Handle rate limiting automatically

## Rate Limiting

The system implements intelligent rate limiting:
- **1-second delays** between batch searches
- **Caching** to avoid duplicate API calls
- **Error handling** for quota exceeded
- **Fallback behavior** when API is unavailable

## API Quotas

YouTube Data API v3 has these limits:
- **10,000 units per day** (default)
- **Search operation**: 100 units
- **Video details**: 1 unit
- **Rate limit**: 300 requests per minute

Each lesson search uses approximately 101 units (search + details).

## Error Handling

The system gracefully handles:

### Development Environment
```
⚠️ YouTube API key not found. Videos will not be available until deployed to Railway.
```

### API Errors
```
❌ YouTube API error: 403 Quota Exceeded
```

### No Results
```
📹 No Khan Academy videos found for this lesson topic.
```

## Performance Optimization

### Caching Strategy
- **In-memory cache** for video results
- **Database caching** (planned for v2)
- **CDN optimization** for thumbnails

### Search Optimization
- **Concept extraction** for better search terms
- **Grade-level context** for appropriate results
- **Khan Academy channel filtering** for quality

## Troubleshooting

### Common Issues

**1. No videos found**
- Check lesson title formatting
- Verify mathematical concepts are recognized
- Try manual Khan Academy search

**2. API errors in production**
- Check Railway environment variables
- Verify API key permissions
- Monitor quota usage

**3. Slow performance**
- Enable result caching
- Reduce maxResults parameter
- Implement background processing

### Debug Mode

Enable detailed logging by adding to lesson viewer:
```javascript
console.log(`🔍 Searching for: "${lessonTitle}"`);
```

## Future Enhancements

### Planned Features
- **Video quality scoring** based on educational value
- **Playlist generation** for lesson sequences
- **Closed caption analysis** for content matching
- **User ratings** and recommendations
- **Offline video caching**

### Advanced Integration
- **Transcript analysis** for concept matching
- **Video length optimization** by lesson type
- **Multi-language support** for ESL students
- **Accessibility features** for diverse learners

## Support

For YouTube API issues:
1. Check Railway deployment logs
2. Verify API key configuration
3. Monitor quota usage in Google Cloud Console
4. Test with sample lessons using provided scripts

The integration provides a seamless way to enhance your math curriculum with Khan Academy's educational videos, creating a comprehensive learning experience for students.
