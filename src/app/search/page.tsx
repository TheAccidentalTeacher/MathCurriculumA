// Search page
export default function SearchPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-bold mb-8">Search Curriculum</h1>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Search Query</label>
            <input
              type="text"
              placeholder="Search for topics, concepts, problems..."
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">Grade Level</label>
              <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Grades</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Topic Type</label>
              <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Types</option>
                <option value="instruction">Instruction</option>
                <option value="practice">Practice</option>
                <option value="example">Examples</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium"
          >
            Search Curriculum
          </button>
        </form>
        
        <div className="mt-8">
          <div className="text-center text-slate-400 py-12">
            Enter a search query above to find curriculum content
          </div>
        </div>
      </div>
    </main>
  );
}
