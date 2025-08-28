
# Math Curriculum Platform

A Next.js full-stack web application for extracting, managing, and searching math curriculum content from PDF textbooks. Deployed on Railway with PostgreSQL.

## 🚀 Live Demo

**Production URL**: `https://your-app.railway.app` (after deployment)

## ✨ Features

- **📚 Document Management** - Upload and organize curriculum PDFs
- **🔍 Smart Search** - Search across all extracted content with filters
- **⚙️ Database Admin** - Inspect and manage curriculum data
- **📊 Analytics** - View extraction stats and content metrics
- **🎯 Curriculum Structure** - Organized by documents → sections → topics
- **🏷️ Keyword Tagging** - Automatic keyword extraction and linking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Railway managed)
- **ORM**: Prisma
- **Deployment**: Railway
- **PDF Processing**: pdf-parse + custom extraction logic

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/           # Database admin interface
│   ├── api/             # API routes (search, documents)
│   ├── documents/       # Document browsing interface
│   └── search/          # Advanced search interface
├── lib/
│   ├── db.ts           # Prisma database client
│   └── curriculum-service.ts # Business logic
├── scripts/
│   ├── extract-curriculum.ts # PDF extraction logic
│   └── migrate-db.ts         # Database migration
└── prisma/
    └── schema.prisma    # Database schema
```

## 🚀 Quick Start (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheAccidentalTeacher/MathCurriculumA.git
   cd MathCurriculumA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Visit** http://localhost:3000

## 🌍 Production Deployment (Railway)

See [DEPLOY_TO_RAILWAY.md](./DEPLOY_TO_RAILWAY.md) for complete deployment instructions.

### Quick Deploy to Railway:

1. **Push to GitHub**
2. **Connect GitHub repo to Railway**
3. **Add PostgreSQL database service**
4. **Deploy automatically**

## 📊 Database Schema

```
Documents (PDF files)
├── Sections (chapters, units, lessons)
│   └── Topics (individual concepts, problems)
│       └── Keywords (tagged terms)
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run extract` - Extract content from PDFs
- `npm run seed` - Migrate + extract (full setup)

## 🏗️ Architecture

### Data Flow
1. **PDF Upload** → Raw curriculum files
2. **Extraction** → Text + metadata extraction
3. **Processing** → Structure recognition (sections, topics)
4. **Storage** → PostgreSQL with relationships
5. **Search** → Full-text search with filters
6. **Display** → React components with Tailwind UI

### Key Components
- **CurriculumService** - Business logic layer
- **Prisma** - Type-safe database operations  
- **PDF Parser** - Content extraction pipeline
- **Search API** - RESTful endpoints with filters

## 🎯 Curriculum Data Model

**Documents** represent entire PDF textbooks with metadata like grade level and subject.

**Sections** are structural divisions (chapters, units, lessons) within documents.

**Topics** are individual concepts, problems, or instructional content within sections.

**Keywords** are extracted terms that can be searched and filtered across all content.

## 🔍 Search Capabilities

- **Full-text search** across all content
- **Filter by grade level** (7, 8, etc.)
- **Filter by topic type** (instruction, practice, example, assessment)
- **Filter by difficulty** (basic, intermediate, advanced)
- **Filter by section type** (chapter, unit, lesson)

## 🚀 Production Features

- **Automatic deployments** on git push
- **Managed PostgreSQL** database
- **Environment-based configuration**
- **Production-optimized** builds
- **Monitoring and logs** via Railway

## 📈 Roadmap

- [ ] **Visual Content Extraction** - OCR for diagrams and equations
- [ ] **AI-Powered Search** - Semantic search with embeddings
- [ ] **Lesson Plan Generation** - Auto-generate from curriculum
- [ ] **Progress Tracking** - Student/teacher dashboards
- [ ] **Multi-format Export** - PDF, Word, Google Docs
- [ ] **Standards Alignment** - Map to Common Core/state standards

## 🤝 Contributing

This is an educational project. Contributions welcome!

## 📄 License

Educational use only. Curriculum content subject to original publisher rights.

---

Built with ❤️ for educators by [TheAccidentalTeacher](https://github.com/TheAccidentalTeacher)