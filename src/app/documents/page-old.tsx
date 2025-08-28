// Documents listing page
export default function DocumentsPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold mb-8">Curriculum Documents</h1>
        
        <div className="grid gap-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-2">RCM Grade 7 Volume 1</h3>
            <p className="text-slate-400 mb-4">Ready Common Math - Grade 7 Student Worktext</p>
            <div className="flex gap-4 text-sm">
              <span className="bg-blue-600 px-2 py-1 rounded">Grade 7</span>
              <span className="bg-green-600 px-2 py-1 rounded">Mathematics</span>
              <span className="bg-purple-600 px-2 py-1 rounded">Volume 1</span>
            </div>
            <div className="mt-4 text-sm text-slate-300">
              Extracted: 504 pages • Multiple sections and topics
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-2">RCM Grade 7 Volume 2</h3>
            <p className="text-slate-400 mb-4">Ready Common Math - Grade 7 Student Worktext</p>
            <div className="flex gap-4 text-sm">
              <span className="bg-blue-600 px-2 py-1 rounded">Grade 7</span>
              <span className="bg-green-600 px-2 py-1 rounded">Mathematics</span>
              <span className="bg-purple-600 px-2 py-1 rounded">Volume 2</span>
            </div>
            <div className="mt-4 text-sm text-slate-300">
              Extracted: Multiple sections and topics
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-2">RCM Grade 8 Volume 1</h3>
            <p className="text-slate-400 mb-4">Ready Common Math - Grade 8 Student Worktext</p>
            <div className="flex gap-4 text-sm">
              <span className="bg-blue-600 px-2 py-1 rounded">Grade 8</span>
              <span className="bg-green-600 px-2 py-1 rounded">Mathematics</span>
              <span className="bg-purple-600 px-2 py-1 rounded">Volume 1</span>
            </div>
            <div className="mt-4 text-sm text-slate-300">
              Extracted: Multiple sections and topics
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-xl font-semibold mb-2">RCM Grade 8 Volume 2</h3>
            <p className="text-slate-400 mb-4">Ready Common Math - Grade 8 Student Worktext</p>
            <div className="flex gap-4 text-sm">
              <span className="bg-blue-600 px-2 py-1 rounded">Grade 8</span>
              <span className="bg-green-600 px-2 py-1 rounded">Mathematics</span>
              <span className="bg-purple-600 px-2 py-1 rounded">Volume 2</span>
            </div>
            <div className="mt-4 text-sm text-slate-300">
              Extracted: Multiple sections and topics
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
