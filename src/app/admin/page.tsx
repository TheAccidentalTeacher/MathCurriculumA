// Admin page to inspect database contents
export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-8">Database Admin</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">📊 Database Stats</h3>
            <div className="space-y-2 text-slate-300">
              <p>Documents: Loading...</p>
              <p>Sections: Loading...</p>
              <p>Topics: Loading...</p>
              <p>Keywords: Loading...</p>
            </div>
          </div>
          
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">🔧 Database Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                Re-extract PDFs
              </button>
              <button className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                Export Data
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                Clear Database
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h3 className="text-xl font-semibold mb-4">📋 Recent Activity</h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p>Database initialized</p>
              <p>PDFs extracted</p>
              <p>Ready for use</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Database Schema</h2>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <pre className="text-sm text-slate-300 overflow-x-auto">
{`Documents
├── id (String, Primary Key)
├── filename (String, Unique)
├── title (String)
├── grade_level (String, Optional)
├── subject (String, Optional)
├── version (String, Optional)
└── content (Text)

Sections (Many-to-One with Documents)
├── id (String, Primary Key)
├── document_id (String, Foreign Key)
├── title (String)
├── content (Text)
├── section_type (String, Optional)
└── order_index (Integer)

Topics (Many-to-One with Sections)
├── id (String, Primary Key)
├── section_id (String, Foreign Key)
├── title (String)
├── content (Text)
├── topic_type (String, Optional)
├── difficulty (String, Optional)
└── order_index (Integer)

Keywords (Many-to-Many with Topics)
├── id (String, Primary Key)
├── word (String, Unique)
├── definition (String, Optional)
└── subject (String, Optional)`}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
}
