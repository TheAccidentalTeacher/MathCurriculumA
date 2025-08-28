import { CurriculumService } from "@/lib/curriculum-service";
import Link from "next/link";
import { notFound } from "next/navigation";

const curriculumService = new CurriculumService();

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // In Prisma with PostgreSQL, IDs are strings (cuid), not numbers
  const document = await curriculumService.getDocumentById(id);
  
  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-dvh text-slate-100 bg-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to Search
          </Link>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
          <div className="grid md:grid-cols-2 gap-4 text-slate-300">
            <div>
              <div><span className="text-slate-400">Grade:</span> {document.grade_level}</div>
              <div><span className="text-slate-400">Subject:</span> {document.subject}</div>
            </div>
            <div>
              <div><span className="text-slate-400">Version:</span> {document.version}</div>
              <div><span className="text-slate-400">Created:</span> {new Date(document.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Sections ({document.sections?.length || 0})</h2>
          <div className="space-y-4">
            {document.sections?.map((section: any) => (
              <Link key={section.id} href={`/section/${section.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:bg-slate-750 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-400">
                        {section.sectionNumber && `${section.sectionNumber}. `}
                        {section.title}
                      </h3>
                      <div className="text-sm text-slate-400 mt-1">
                        {section.sectionType} 
                        {section.startPage && section.endPage && (
                          <span> • Pages {section.startPage}-{section.endPage}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-300">
                      View Section →
                    </div>
                  </div>
                  
                  <p className="text-slate-300 line-clamp-2">
                    {section.content 
                      ? (section.content.length > 200 
                         ? `${section.content.substring(0, 200)}...` 
                         : section.content)
                      : 'No preview available'
                    }
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
