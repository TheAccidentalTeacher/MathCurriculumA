import { CurriculumService, SearchFilters } from "@/lib/curriculum-service";
import Link from "next/link";

const curriculumService = new CurriculumService();

interface SearchParams {
  q?: string;
  grade?: string;
  difficulty?: string;
  topicType?: string;
  sectionType?: string;
}

export default async function Home({ searchParams }: { searchParams?: Promise<SearchParams> }) {
  const params = (await searchParams) || {};
  const { q, grade, difficulty, topicType, sectionType } = params;
  
  let data: any = { documents: [], stats: { documents: 0, sections: 0, topics: 0, keywords: 0 } };
  let results: any[] = [];

  try {
    if (q) {
      const filters: SearchFilters = {
        ...(grade && { grade: parseInt(grade) }),
        ...(difficulty && { difficulty: difficulty as any }),
        ...(topicType && { topicType: topicType as any }),
        ...(sectionType && { sectionType: sectionType as any }),
      };
      results = await curriculumService.searchContent(q, filters);
    } else {
      data = {
        documents: await curriculumService.getAllDocuments(),
        stats: await curriculumService.getStats(),
      };
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }

  return (
    <main className="min-h-dvh text-slate-100 bg-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Math Curriculum Database</h1>
          <div className="text-sm text-slate-400 space-y-1">
            <div>{data.stats.documents} Documents • {data.stats.sections} Sections</div>
            <div>{data.stats.topics} Topics • {data.stats.keywords} Keywords</div>
          </div>
        </div>

        {/* Search Form */}
        <form className="space-y-4 mb-8 bg-slate-800 p-6 rounded-lg border border-slate-700" action="/" method="get">
          <div className="flex gap-4">
            <input
              type="text"
              name="q"
              defaultValue={q || ""}
              placeholder="Search curriculum content..."
              className="flex-1 rounded-md bg-slate-700 border border-slate-600 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="rounded-md bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium">
              Search
            </button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select name="grade" defaultValue={grade || ""} className="rounded-md bg-slate-700 border border-slate-600 px-3 py-2">
              <option value="">Any Grade</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
            </select>
            
            <select name="difficulty" defaultValue={difficulty || ""} className="rounded-md bg-slate-700 border border-slate-600 px-3 py-2">
              <option value="">Any Difficulty</option>
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <select name="topicType" defaultValue={topicType || ""} className="rounded-md bg-slate-700 border border-slate-600 px-3 py-2">
              <option value="">Any Topic Type</option>
              <option value="concept">Concept</option>
              <option value="example">Example</option>
              <option value="exercise">Exercise</option>
              <option value="assessment">Assessment</option>
            </select>
            
            <select name="sectionType" defaultValue={sectionType || ""} className="rounded-md bg-slate-700 border border-slate-600 px-3 py-2">
              <option value="">Any Section Type</option>
              <option value="chapter">Chapter</option>
              <option value="unit">Unit</option>
              <option value="lesson">Lesson</option>
              <option value="introduction">Introduction</option>
              <option value="appendix">Appendix</option>
            </select>
          </div>
        </form>

        {/* Search Results */}
        {q && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Search Results for "{q}" ({results.length} found)
            </h2>
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg text-blue-400">
                        {result.topicTitle || result.sectionTitle || result.documentTitle}
                      </h3>
                      <div className="text-sm text-slate-400 space-x-2 mt-1">
                        <span>Grade {result.documentGrade}</span>
                        {result.sectionType && <span>• {result.sectionType}</span>}
                        {result.topicType && <span>• {result.topicType}</span>}
                        {result.difficulty && <span>• {result.difficulty}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {result.documentId && (
                        <Link 
                          href={`/document/${result.documentId}`}
                          className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300 hover:bg-slate-600"
                        >
                          View Document
                        </Link>
                      )}
                      {result.sectionId && (
                        <Link 
                          href={`/section/${result.sectionId}`}
                          className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300 hover:bg-slate-600"
                        >
                          View Section
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-slate-300 leading-relaxed">
                    <div className="mb-2 text-sm font-medium text-slate-400">
                      {result.documentTitle} → {result.sectionTitle}
                    </div>
                    <p className="line-clamp-3">
                      {result.topicContent && result.topicContent.length > 300
                        ? `${result.topicContent.substring(0, 300)}...`
                        : result.topicContent || 'No content preview available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Overview */}
        {!q && data.documents && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Available Documents</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.documents.map((doc: any) => (
                <Link key={doc.id} href={`/document/${doc.id}`}>
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:bg-slate-750 transition-colors">
                    <h3 className="text-xl font-semibold mb-2 text-blue-400">{doc.title}</h3>
                    <div className="text-slate-400 space-y-1 mb-4">
                      <div>Grade {doc.grade} • {doc.subject}</div>
                      <div>{doc.publisher} {doc.version} • {doc.totalPages} pages</div>
                      <div className="text-xs">
                        Extracted {new Date(doc.extractedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-slate-300">
                      {JSON.parse(doc.metadata || '{}').sectionsCount || 0} sections extracted
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8">
              <Link 
                href="/keywords" 
                className="inline-block bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse by Keywords →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
