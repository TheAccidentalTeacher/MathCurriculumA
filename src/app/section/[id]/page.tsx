import { notFound } from 'next/navigation';
import Link from 'next/link';
import { curriculumService } from '@/lib/curriculum-service';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Get document by ID since we don't have sections
  const document = await curriculumService.getDocumentById(id);
  
  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen text-slate-100 bg-slate-900">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <Link href="/documents" className="text-blue-400 hover:text-blue-300">
            ← Back to Documents
          </Link>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {document.title}
          </h1>
          <div className="flex gap-4 text-sm text-slate-300 mb-4">
            {document.grade_level && (
              <span className="px-3 py-1 rounded-full text-white bg-blue-600">
                {document.grade_level}
              </span>
            )}
            {document.subject && (
              <span className="px-3 py-1 rounded-full text-white bg-green-600">
                {document.subject}
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-white bg-purple-600">
              {document.filename}
            </span>
          </div>
          
          {document.content && (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-mono text-sm max-h-96 overflow-y-auto">
                {document.content.substring(0, 2000)}
                {document.content.length > 2000 && '\n\n... (truncated for display)'}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Document Information</h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-300">
            <div className="space-y-2">
              <div><span className="text-slate-400">Filename:</span> {document.filename}</div>
              <div><span className="text-slate-400">Title:</span> {document.title}</div>
              <div><span className="text-slate-400">Grade Level:</span> {document.grade_level || 'Not specified'}</div>
            </div>
            <div className="space-y-2">
              <div><span className="text-slate-400">Subject:</span> {document.subject || 'Not specified'}</div>
              <div><span className="text-slate-400">Created:</span> {new Date(document.created_at).toLocaleDateString()}</div>
              <div><span className="text-slate-400">Content Length:</span> {document.content?.length.toLocaleString() || 0} characters</div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-700">
            <Link 
              href={`/search?q=${encodeURIComponent(document.title.split(' ').slice(0, 3).join(' '))}`}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors inline-block"
            >
              🔍 Search Similar Content
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
