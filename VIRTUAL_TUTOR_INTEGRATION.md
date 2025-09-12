# Virtual Tutor Integration Guide

## Overview

The Virtual Tutor system now supports two modes:

1. **Standalone Mode** - General math help without a specific lesson
2. **Lesson-Specific Mode** - Tutoring for a specific lesson with context

## How It Works

### Standalone Mode (Default)

When accessing `/virtualtutor` directly, the tutor operates in standalone mode:

- **URL**: `http://localhost:3001/virtualtutor`
- **Context**: "General Math Help" 
- **Behavior**: Ready to help with any math topic
- **Character Greeting**: "Hello! I'm here to help you with General Math Help."

### Lesson-Specific Mode

When accessing from a lesson or with URL parameters:

- **URL**: `http://localhost:3001/virtualtutor?docId=RCM07_NA_SW_V1&lessonNumber=5&lessonTitle=Solve%20Proportional%20Relationship%20Problems`
- **Context**: Specific lesson information
- **Behavior**: Focused on the specific lesson content
- **Character Greeting**: "Hello! I'm here to help you with [Lesson Title]."

## URL Parameters

- `docId` - Document ID (e.g., "RCM07_NA_SW_V1")
- `lessonNumber` - Lesson number (e.g., "5")
- `lessonTitle` - URL-encoded lesson title (e.g., "Solve%20Proportional%20Relationship%20Problems")

## Implementation Examples

### From a Lesson Page (Full Screen Tutor)

```typescript
const openFullScreenTutor = (documentId: string, lessonNumber: number, lessonTitle: string) => {
  const url = `/virtualtutor?docId=${encodeURIComponent(documentId)}&lessonNumber=${lessonNumber}&lessonTitle=${encodeURIComponent(lessonTitle)}`;
  window.open(url, '_blank');
};
```

### From Home Page (Standalone)

```typescript
// Simple link to standalone mode
<Link href="/virtualtutor">Virtual Tutor</Link>
```

## Character Display Context

The avatar size is now **160x160px** with enhanced animations and interactions:

- **Hover effects**: Scale and glow
- **Click interactions**: Multiple fun animations
- **Random idle animations**: Float, wiggle, heartbeat
- **Expression-based effects**: Different animations for speaking/thinking/idle

## Features in Both Modes

1. **Character Selection**: Choose between Mr. Somers and Gimli
2. **Interactive Avatars**: Large, clickable avatars with fun animations
3. **Smart Context**: AI understands the mode and adjusts responses accordingly
4. **Enhanced UI**: Larger, more engaging interface perfect for middle school students

## Safety Features

- Embedded tutoring (VirtualTutorPanel) continues to work within lessons
- Standalone mode doesn't break lesson-specific functionality
- URL parameters are optional - defaults to standalone mode
- Maintains backward compatibility with existing lesson integration
