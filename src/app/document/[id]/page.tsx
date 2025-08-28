import { CurriculumService } from "@/lib/curriculum-service";
import Link from "next/link";
import { notFound } from "next/navigation";

const curriculumService = new CurriculumService();

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

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
              <div><span className="text-slate-400">Filename:</span> {document.filename}</div>
              <div><span className="text-slate-400">Created:</span> {new Date(document.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Document Content</h2>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="text-slate-300 whitespace-pre-wrap font-mono text-sm leading-relaxed max-h-96 overflow-y-auto">
              {document.content ? document.content.slice(0, 5000) + (document.content.length > 5000 ? '\n\n... (truncated for display)' : '') : 'No content available'}
            </div>
          </div>
          
          {document.content && document.content.length > 5000 && (
            <div className="mt-4 text-center">
              <div className="text-sm text-slate-400">
                Showing first 5,000 characters of {document.content.length.toLocaleString()} total characters
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
