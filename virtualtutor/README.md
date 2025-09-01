# Virtual Tutor System - Implementation Guide

## Project Overview

The Virtual Tutor System is an AI-powered educational assistant featuring **Mr. Somers** (teacher) and **Gimli** (dog) characters that provide personalized tutoring experiences. The system dynamically analyzes lesson content using OCR, AI, and RAG technologies to deliver contextually relevant educational support.

### Vision Statement
*"When a new lesson is opened, a new virtual tutor begins based on JUST that content"* - Creating lesson-specific AI tutoring that adapts to individual student needs with WCAG 2.02 accessibility compliance.

## System Architecture

### Core Technologies
- **OCR Engine**: Mathpix for mathematical content recognition
- **AI Platform**: Azure OpenAI GPT-4o for natural language processing
- **Vector Database**: Pinecone/Weaviate for content retrieval
- **Frontend**: Next.js/React with TypeScript
- **Character System**: Mr. Somers and Gimli with animation frames
- **Accessibility**: WCAG 2.02 compliant design

### Integration Points
- **Target Location**: Right sidebar (`xl:col-span-1`) in LessonViewer.tsx
- **Current Replacement**: Enhance/replace KhanAcademyVideos.tsx component
- **API Route**: `/api/lessons/[documentId]/[lessonNumber]/virtualtutor`
- **Character Assets**: `/public/animations/` and `/virtualtutor/`

## Phase-by-Phase Implementation Plan

### Phase 1: Foundation Setup
**Duration**: 1-2 weeks  
**Goal**: Establish basic virtual tutor infrastructure

#### 1.1 Component Architecture
- [ ] Create `VirtualTutorPanel.tsx` component
- [ ] Implement character selection system (Mr. Somers/Gimli)
- [ ] Design responsive layout for lesson sidebar integration
- [ ] Add animation frame system for character expressions

#### 1.2 Basic UI Implementation
- [ ] Character display with idle animations
- [ ] Chat interface foundation
- [ ] Accessibility features (screen reader support, keyboard navigation)
- [ ] Mobile-responsive design

#### 1.3 Integration Testing
- [ ] Replace KhanAcademyVideos in LessonViewer
- [ ] Test lesson page rendering
- [ ] Validate responsive behavior
- [ ] Accessibility compliance testing

**Deliverables**: Functional UI component with character display and basic chat interface

---

### Phase 2: OCR Integration
**Duration**: 2-3 weeks  
**Goal**: Implement Mathpix OCR for lesson content analysis

#### 2.1 Mathpix Setup
- [ ] Configure Mathpix API credentials
- [ ] Create OCR processing service
- [ ] Implement error handling and retry logic
- [ ] Add progress tracking for batch processing

#### 2.2 Content Processing Pipeline
- [ ] Extract text and math from lesson pages (22-30 pages per lesson)
- [ ] Parse mathematical expressions and formulas
- [ ] Structure extracted content with metadata
- [ ] Cache processed content for performance

#### 2.3 Content Analysis
- [ ] Identify key concepts and learning objectives
- [ ] Extract practice problems and solutions
- [ ] Categorize content difficulty levels
- [ ] Generate content summaries

**Deliverables**: Automated OCR pipeline that processes lesson content and structures it for AI consumption

---

### Phase 3: AI Chat System
**Duration**: 2-3 weeks  
**Goal**: Implement Azure OpenAI GPT-4o for interactive tutoring

#### 3.1 Azure OpenAI Integration
- [ ] Configure Azure OpenAI API connection
- [ ] Implement GPT-4o chat completions
- [ ] Design prompt engineering for educational context
- [ ] Add conversation memory management

#### 3.2 Educational AI Features
- [ ] Question answering system
- [ ] Step-by-step problem solving
- [ ] Concept explanations with examples
- [ ] Learning progress tracking

#### 3.3 Character Personality System
- [ ] Mr. Somers: Professional teacher persona with encouraging tone
- [ ] Gimli: Friendly, enthusiastic learning companion
- [ ] Context-aware responses based on lesson content
- [ ] Adaptive difficulty based on student interaction

**Deliverables**: Interactive AI chat system with character-specific personalities and educational capabilities

---

### Phase 4: RAG Implementation
**Duration**: 3-4 weeks  
**Goal**: Implement Retrieval-Augmented Generation for contextual responses

#### 4.1 Vector Database Setup
- [ ] Choose and configure vector database (Pinecone/Weaviate)
- [ ] Design embedding schema for curriculum content
- [ ] Implement content vectorization pipeline
- [ ] Create semantic search capabilities

#### 4.2 Content Embedding
- [ ] Embed lesson content using Azure OpenAI embeddings
- [ ] Create hierarchical content organization (unit → lesson → page → concept)
- [ ] Implement cross-referencing between related concepts
- [ ] Add metadata for content filtering and ranking

#### 4.3 Retrieval System
- [ ] Semantic search for relevant content
- [ ] Context-aware content ranking
- [ ] Multi-modal retrieval (text + mathematical expressions)
- [ ] Real-time content updates

**Deliverables**: RAG system that provides contextually relevant information retrieval for AI responses

---

### Phase 5: Advanced Features
**Duration**: 2-3 weeks  
**Goal**: Enhanced tutoring capabilities and personalization

#### 5.1 Adaptive Learning
- [ ] Student progress tracking
- [ ] Difficulty adjustment algorithms
- [ ] Personalized learning paths
- [ ] Performance analytics

#### 5.2 Interactive Learning Tools
- [ ] Step-by-step problem walkthrough
- [ ] Interactive worksheets generation
- [ ] Hint system with progressive disclosure
- [ ] Practice problem generation

#### 5.3 Multi-Modal Support
- [ ] Voice input/output capabilities
- [ ] Visual learning aids generation
- [ ] Interactive diagrams and graphs
- [ ] Handwriting recognition for math problems

**Deliverables**: Advanced tutoring features with personalization and multi-modal interaction

---

### Phase 6: Testing & Optimization
**Duration**: 2-3 weeks  
**Goal**: Comprehensive testing and performance optimization

#### 6.1 Performance Optimization
- [ ] Response time optimization (< 2 seconds for AI responses)
- [ ] Caching strategies for frequently accessed content
- [ ] Batch processing optimization
- [ ] Memory usage optimization

#### 6.2 Quality Assurance
- [ ] Automated testing suite for AI responses
- [ ] Educational content accuracy validation
- [ ] User experience testing
- [ ] Load testing for concurrent users

#### 6.3 Accessibility Compliance
- [ ] WCAG 2.02 AA compliance validation
- [ ] Screen reader compatibility testing
- [ ] Keyboard navigation testing
- [ ] Color contrast and visual accessibility

**Deliverables**: Production-ready virtual tutor system with comprehensive testing coverage

---

## Character Assets

### Mr. Somers (Teacher Character)
- **Primary Image**: `download-13.png`
- **Personality**: Professional, encouraging, patient educator
- **Animation Frames**: `download-11.png` through `download-24.png`
- **Voice Tone**: Formal but warm, explanatory

### Gimli (Dog Companion)
- **Primary Image**: `download (25).png`
- **Personality**: Enthusiastic, friendly, motivational learning buddy
- **Secondary Image**: `gimli 1.jpg`
- **Voice Tone**: Casual, encouraging, playful

## Technical Specifications

### API Endpoints
```typescript
// Virtual Tutor API Routes
GET    /api/lessons/[documentId]/[lessonNumber]/virtualtutor/content
POST   /api/lessons/[documentId]/[lessonNumber]/virtualtutor/chat
GET    /api/lessons/[documentId]/[lessonNumber]/virtualtutor/progress
POST   /api/virtualtutor/ocr/process
GET    /api/virtualtutor/characters/[character]/animations
```

### Component Structure
```
src/components/virtualtutor/
├── VirtualTutorPanel.tsx          # Main container component
├── CharacterDisplay.tsx           # Character animation and display
├── ChatInterface.tsx              # Chat UI and message handling
├── ProgressTracker.tsx            # Learning progress visualization
├── ContentAnalyzer.tsx            # OCR and content processing
├── AIResponseHandler.tsx          # Azure OpenAI integration
└── AccessibilityWrapper.tsx       # WCAG compliance layer
```

### Database Schema
```sql
-- Virtual Tutor Tables
CREATE TABLE virtual_tutor_sessions (
  id TEXT PRIMARY KEY,
  document_id TEXT,
  lesson_number INTEGER,
  student_id TEXT,
  character_choice TEXT,
  session_start DATETIME,
  session_end DATETIME,
  messages_count INTEGER
);

CREATE TABLE lesson_content_embeddings (
  id TEXT PRIMARY KEY,
  document_id TEXT,
  lesson_number INTEGER,
  page_number INTEGER,
  content_type TEXT,
  embedding_vector BLOB,
  metadata JSON
);

CREATE TABLE student_progress (
  id TEXT PRIMARY KEY,
  student_id TEXT,
  document_id TEXT,
  lesson_number INTEGER,
  concepts_mastered JSON,
  difficulty_level INTEGER,
  last_interaction DATETIME
);
```

## Success Metrics

### Performance Targets
- **Response Time**: < 2 seconds for AI responses
- **OCR Accuracy**: > 95% for mathematical content
- **Uptime**: 99.9% availability
- **Concurrent Users**: Support 100+ simultaneous sessions

### Educational Effectiveness
- **Engagement**: Increased time-on-lesson metrics
- **Comprehension**: Improved assessment scores
- **Accessibility**: 100% WCAG 2.02 compliance
- **User Satisfaction**: > 4.5/5 rating

## Development Timeline

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| Phase 1 | 1-2 weeks | UI components, character integration |
| Phase 2 | 2-3 weeks | OCR pipeline, content processing |
| Phase 3 | 2-3 weeks | AI chat system, character personalities |
| Phase 4 | 3-4 weeks | RAG implementation, vector search |
| Phase 5 | 2-3 weeks | Advanced features, personalization |
| Phase 6 | 2-3 weeks | Testing, optimization, deployment |

**Total Estimated Duration**: 12-18 weeks

## Next Steps

1. **Phase Selection**: Choose starting phase based on immediate priorities
2. **Environment Setup**: Configure development environment with required APIs
3. **Asset Preparation**: Organize character animations and prepare asset pipeline
4. **Team Alignment**: Ensure all stakeholders understand the implementation plan

## Resources & Documentation

- **Mathpix API**: [OCR Documentation](https://docs.mathpix.com/)
- **Azure OpenAI**: [Service Documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/openai/)
- **WCAG 2.02**: [Accessibility Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- **Next.js**: [Framework Documentation](https://nextjs.org/docs)

---

*This implementation guide serves as the roadmap for creating an innovative, AI-powered virtual tutor system that will transform the educational experience for students using the MathCurriculumA platform.*
