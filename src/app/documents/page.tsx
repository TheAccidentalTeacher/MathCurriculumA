import Link from 'next/link';
import { curriculumService } from '@/lib/curriculum-service';

// Force dynamic rendering to avoid build-time database calls
export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const documents = await curriculumService.getAllDocuments();
  const stats = await curriculumService.getStats();

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Curriculum Documents</h1>
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">📊 Database Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-2xl font-bold text-blue-400">{stats.totalDocuments}</div>
                <div className="text-slate-300">Total Documents</div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-2xl font-bold text-green-400">
                  {stats.gradeDistribution.length}
                </div>
                <div className="text-slate-300">Grade Levels</div>
              </div>
              <div className="bg-slate-700 p-3 rounded">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.subjectDistribution.length}
                </div>
                <div className="text-slate-300">Subjects</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6">
          {documents.map((document) => (
            <div key={document.id} className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors">
              <Link href={`/document/${document.id}`} className="block">
                <h3 className="text-xl font-semibold mb-2 hover:text-blue-400 transition-colors">
                  {document.title}
                </h3>
                <p className="text-slate-400 mb-4">{document.filename}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {document.grade_level && (
                    <span className="bg-blue-600 px-2 py-1 rounded text-sm">
                      {document.grade_level}
                    </span>
                  )}
                  {document.subject && (
                    <span className="bg-green-600 px-2 py-1 rounded text-sm">
                      {document.subject}
                    </span>
                  )}
                  <span className="bg-slate-600 px-2 py-1 rounded text-sm">
                    Ready Classroom Mathematics
                  </span>
                </div>

                <div className="text-sm text-slate-300 mb-3">
                  <div className="bg-slate-700 p-3 rounded">
                    <strong>Content Preview:</strong><br />
                    {document.contentPreview}
                  </div>
                </div>
                
                <div className="text-xs text-slate-400 flex justify-between">
                  <span>Extracted: {document.created_at.toLocaleDateString()}</span>
                  <span>Click to explore content →</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold mb-2">No Documents Found</h2>
            <p className="text-slate-400">
              Run the PDF extraction script to add curriculum documents to the database.
            </p>
            <div className="mt-4 bg-slate-800 p-4 rounded text-left text-sm">
              <code className="text-green-400">
                npx tsx scripts/simple-pdf-extractor.ts path/to/your/pdf.pdf
              </code>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link 
            href="/search" 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
          >
            🔍 Search Content
          </Link>
        </div>
      </div>
    </main>
  );
}
