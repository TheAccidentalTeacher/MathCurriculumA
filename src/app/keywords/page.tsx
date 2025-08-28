import { CurriculumService } from "@/lib/curriculum-service";
import Link from "next/link";

const curriculumService = new CurriculumService();

export default async function KeywordsPage({ searchParams }: { searchParams?: Promise<{ keyword?: string }> }) {
  const params = (await searchParams) || {};
  const { keyword } = params;

  let keywords: any[] = [];
  let topics: any[] = [];

  try {
    if (keyword) {
      const result = await curriculumService.searchContent(keyword);
      topics = result;
    } else {
      const stats = await curriculumService.getStats();
      keywords = [`Total Documents: ${stats.totalDocuments}`];
    }
  } catch (error) {
    console.error('Error loading keywords:', error);
  }

  return (
    <main className="min-h-dvh text-slate-100 bg-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Search
          </Link>
        </div>

        {keyword ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">Topics for "{keyword}"</h1>
            <div className="mb-6">
              <Link href="/keywords" className="text-blue-400 hover:text-blue-300">
                ← View All Keywords
              </Link>
            </div>
            
            <div className="space-y-6">
              {topics.map((topic: any, idx: number) => (
                <div key={idx} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-400 mb-2">{topic.topicTitle}</h3>
                  <div className="text-sm text-slate-400 mb-3">
                    Grade {topic.documentGrade} • {topic.documentTitle} → {topic.sectionTitle}
                  </div>
                  <div className="flex gap-2 mb-4">
                    {topic.topicType && (
                      <span className="text-xs px-2 py-1 bg-blue-600 rounded text-white">
                        {topic.topicType}
                      </span>
                    )}
                    {topic.difficulty && (
                      <span className="text-xs px-2 py-1 bg-green-600 rounded text-white">
                        {topic.difficulty}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 line-clamp-3">
                    {topic.topicContent.substring(0, 300)}...
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6">Browse by Keywords</h1>
            <p className="text-slate-400 mb-8">
              Click on any keyword to see related topics and content from the curriculum.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {keywords.map((kw: any) => (
                <Link 
                  key={kw.id} 
                  href={`/keywords?keyword=${encodeURIComponent(kw.keyword)}`}
                  className="block"
                >
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors text-center">
                    <div className="font-medium text-blue-400 mb-1">{kw.keyword}</div>
                    <div className="text-xs text-slate-500">{kw.frequency} occurrences</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
