import { CurriculumService } from "@/lib/curriculum-service";
import Link from "next/link";
import { notFound } from "next/navigation";

const curriculumService = new CurriculumService();

export default async function SectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // In Prisma with PostgreSQL, IDs are strings (cuid), not numbers
  const section = await curriculumService.getSectionById(id);
  
  if (!section) {
    notFound();
  }

  const difficultyColors = {
    basic: 'bg-green-600',
    intermediate: 'bg-yellow-600', 
    advanced: 'bg-red-600'
  };

  const typeColors = {
    concept: 'bg-blue-600',
    example: 'bg-purple-600',
    exercise: 'bg-orange-600',
    assessment: 'bg-pink-600'
  };

  return (
    <main className="min-h-dvh text-slate-100 bg-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Search
          </Link>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {section.title}
          </h1>
          <div className="flex gap-4 text-sm text-slate-300 mb-4">
            <span className={`px-3 py-1 rounded-full text-white ${section.section_type === 'chapter' ? 'bg-blue-600' : 
              section.section_type === 'unit' ? 'bg-green-600' : 
              section.section_type === 'lesson' ? 'bg-purple-600' : 'bg-slate-600'}`}>
              {section.section_type}
            </span>
          </div>
          
          {section.content && (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                {section.content.substring(0, 1000)}
                {section.content.length > 1000 && '...'}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Topics ({section.topics?.length || 0})</h2>
          <div className="space-y-6">
            {section.topics?.map((topic: any, idx: number) => (
              <div key={topic.id} className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-400 flex-1 pr-4">
                    {topic.title}
                  </h3>
                  <div className="flex gap-2">
                    {topic.difficulty && (
                      <span className={`text-xs px-2 py-1 rounded text-white ${difficultyColors[topic.difficulty as keyof typeof difficultyColors] || 'bg-slate-600'}`}>
                        {topic.difficulty}
                      </span>
                    )}
                    {topic.topicType && (
                      <span className={`text-xs px-2 py-1 rounded text-white ${typeColors[topic.topicType as keyof typeof typeColors] || 'bg-slate-600'}`}>
                        {topic.topicType}
                      </span>
                    )}
                  </div>
                </div>
                
                {topic.description && (
                  <p className="text-slate-400 mb-3 italic">{topic.description}</p>
                )}
                
                <div className="text-slate-300 leading-relaxed">
                  <div className="whitespace-pre-wrap">
                    {topic.content.length > 800 
                      ? `${topic.content.substring(0, 800)}...` 
                      : topic.content
                    }
                  </div>
                </div>
                
                {topic.pageNumber && (
                  <div className="mt-3 text-xs text-slate-500">
                    Page {topic.pageNumber}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
