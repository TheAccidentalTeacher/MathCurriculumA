'use client';

import { useState, useEffect } from 'react';
import { CurriculumService, SearchFilters } from "@/lib/curriculum-service";
import { AcceleratedPathwayViewer } from "@/components/AcceleratedPathwayViewer";
import Link from "next/link";

const curriculumService = new CurriculumService();

export default function Home() {
  const [data, setData] = useState<any>({ documents: [], stats: { documents: 0, sections: 0, topics: 0, keywords: 0 } });
  const [results, setResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAcceleratedViewer, setShowAcceleratedViewer] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const initialData = {
        documents: await curriculumService.getAllDocuments(),
        stats: await curriculumService.getStats(),
      };
      setData(initialData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const filters: SearchFilters = {
        ...(gradeFilter && { grade: gradeFilter }),
      };
      const searchResults = await curriculumService.searchContent(searchQuery, filters);
      setResults(searchResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    const cards = document.querySelectorAll('[data-volume-card]');
    let completedAnimations = 0;
    
    cards.forEach((card, i) => {
      setTimeout(() => {
        (card as HTMLElement).style.transform = 'scale(0.95) rotate(' + (Math.random() * 10 - 5) + 'deg)';
        (card as HTMLElement).style.transition = 'transform 0.2s ease';
        setTimeout(() => {
          (card as HTMLElement).style.transform = 'scale(1) rotate(0deg)';
          completedAnimations++;
          
          // Show accelerated viewer after all cards complete their animation
          if (completedAnimations === cards.length) {
            setTimeout(() => {
              setShowAcceleratedViewer(true);
            }, 300); // Small delay after last card settles
          }
        }, 200);
      }, i * 100);
    });
  };

  return (
        <main className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Math Curriculum Database</h1>
          <div className="text-sm text-slate-400 space-y-1">
            <div>{data.stats.documents} Documents • {data.stats.sections} Sections</div>
            <div>{data.stats.topics} Topics • {data.stats.keywords} Keywords</div>
          </div>
        </div>

        {/* Change Log */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 mb-6">
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white font-medium">
              📋 Change Log 
              <span className="text-xs bg-green-600 px-2 py-1 rounded">Active Development</span>
              <span className="ml-auto group-open:rotate-90 transition-transform">▶</span>
            </summary>
            <div className="mt-3 space-y-2 text-sm text-slate-400 border-t border-slate-700 pt-3">
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span><strong>🎯 COMPLETE PAGE MAPPING FIX:</strong> All 19 Volume 2 lessons now have correct page numbers - NO MORE NEGATIVE PAGES!</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span>G7 V2: All pages ≥420 | G8 V2: All pages ≥448 | Perfect PDF navigation across entire curriculum</span>
              </div>
              <div className="flex gap-3">
                <span className="text-orange-400 font-mono">2025-08-30</span>
                <span><strong>🚫 NEGATIVE PAGE FIX:</strong> Corrected G8 U6 L23→p.557, G7 U6 L25→p.542 (were causing page -303, -233 errors)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 font-mono">2025-08-30</span>
                <span><strong>📋 PAGE MAPPING CORRECTED:</strong> Fixed lesson start pages - G7 U1 L1 now correctly starts at page 4 (not 19)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-cyan-400 font-mono">2025-08-30</span>
                <span>Verified: L1→p.4, L2→p.31, L3→p.47, L4→p.59, L5→p.81, L6→p.97 with PDF conversion working</span>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-400 font-mono">2025-08-30</span>
                <span><strong>🔧 CRITICAL FIX:</strong> Fixed page mapping - continuous page numbers now correctly convert to PDF pages</span>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-400 font-mono">2025-08-30</span>
                <span>G7 V1: pages 1-419 (PDF offset +12), G7 V2: pages 420+ (PDF offset -404), G8 similar pattern</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 font-mono">2025-08-30</span>
                <span><strong>🔄 MAJOR CORRECTION:</strong> Restructured accelerated pathway to match EXACT official scope and sequence (Units A-J)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-red-400 font-mono">2025-08-30</span>
                <span>Fixed lesson order, pacing (109 total sessions), and Major Work designations per official document</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span><strong>🔧 FIXED:</strong> Direct lesson navigation - all "View →" buttons now jump to specific lesson pages</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span>Updated all 4 volume viewers to properly handle page query parameters</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span><strong>✅ MAJOR UPDATE:</strong> Added Grade 8 lessons per accelerated scope sequence (40+ total lessons)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span>Integrated transformations, linear equations, and exponent properties from G8 curriculum</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span>Added Unit D (Geometry) and Unit E (Advanced Topics) with proper Grade 7/8 sequencing</span>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-mono">2025-08-30</span>
                <span>Completed shuffled lesson system foundation with accurate page mapping</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-mono">NEXT</span>
                <span>Add remaining G8 lessons from scope sequence (functions, statistics)</span>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400 font-mono">FUTURE</span>
                <span>Educator dashboard for drag-and-drop lesson customization</span>
              </div>
            </div>
          </details>
        </div>

        {/* Interactive Curriculum Transformer */}
        <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 border border-blue-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 mb-4">
            🎴 Full Curriculum Viewer
          </h2>
          <p className="text-slate-300 mb-6 text-lg">
            Transform six volumes into one powerful accelerated pathway
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {/* Grade 6 Volumes */}
            <Link href="/viewer/grade6-volume1" data-volume-card className="block p-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors">
              <div className="text-center">
                <div className="text-3xl mb-2">📚</div>
                <div className="font-bold text-lg">Grade 6 Volume 1</div>
                <div className="text-sm opacity-90 mt-1">(512 pages)</div>
              </div>
            </Link>
            <Link href="/viewer/grade6-volume2" data-volume-card className="block p-4 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition-colors">
              <div className="text-center">
                <div className="text-3xl mb-2">📖</div>
                <div className="font-bold text-lg">Grade 6 Volume 2</div>
                <div className="text-sm opacity-90 mt-1">(408 pages)</div>
              </div>
            </Link>
            
            {/* Grade 7 Volumes */}
            <Link href="/viewer/volume1" data-volume-card className="block p-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors">
              <div className="text-center">
                <div className="text-3xl mb-2">📘</div>
                <div className="font-bold text-lg">Grade 7 Volume 1</div>
                <div className="text-sm opacity-90 mt-1">(504 pages)</div>
              </div>
            </Link>
            <Link href="/viewer/volume2" data-volume-card className="block p-4 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-colors">
              <div className="text-center">
                <div className="text-3xl mb-2">📗</div>
                <div className="font-bold text-lg">Grade 7 Volume 2</div>
                <div className="text-sm opacity-90 mt-1">(440 pages)</div>
              </div>
            </Link>
            
            {/* Grade 8 Volumes */}
            <Link href="/viewer/grade8-volume1" data-volume-card className="block p-4 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-colors">
              <div className="text-center">
                <div className="text-3xl mb-2">📙</div>
                <div className="font-bold text-lg">Grade 8 Volume 1</div>
                <div className="text-sm opacity-90 mt-1">(552 pages)</div>
              </div>
            </Link>
            <Link href="/viewer/grade8-volume2" data-volume-card className="block p-4 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition-colors">
              <div className="text-center">
                <div className="text-3xl mb-2">📕</div>
                <div className="font-bold text-lg">Grade 8 Volume 2</div>
                <div className="text-sm opacity-90 mt-1">(456 pages)</div>
              </div>
            </Link>
          </div>
          
          {/* Transform Button and Pacing Generator Link */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-300">
              <strong>Features:</strong> Navigate through all pages • High-resolution images • Quick page jumping
            </div>
            
            <div className="flex gap-4">
              <Link 
                href="/pacing-generator"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                🚀 Advanced Pacing Generator
              </Link>
              <button
                onClick={handleShuffle}
                className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-xl font-medium transition-all duration-300"
              >
                {showAcceleratedViewer ? '🎲 Shuffle Again' : '🎯 Generate Accelerated Pathway'}
              </button>
            </div>
          </div>
        </div>

        {/* Accelerated Pathway Viewer - Appears after shuffle animation */}
        {showAcceleratedViewer && (
          <div className="mb-8 transform transition-all duration-1000 ease-out animate-fade-in-up">
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center flex-1">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    🎯 Accelerated Grade 7/8 Pathway Generated!
                  </h2>
                  <p className="text-slate-300 mt-2">Your beautiful accelerated curriculum plan is ready</p>
                </div>
                <button
                  onClick={() => setShowAcceleratedViewer(false)}
                  className="ml-4 px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
                  title="Hide pathway viewer"
                >
                  ✕
                </button>
              </div>
              <AcceleratedPathwayViewer />
            </div>
          </div>
        )}

        {/* Search Form */}
        <form className="space-y-4 mb-8 bg-slate-800 p-6 rounded-lg border border-slate-700" onSubmit={handleSearch}>
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curriculum content..."
              className="flex-1 rounded-md bg-slate-700 border border-slate-600 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-3 font-medium"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={gradeFilter} 
              onChange={(e) => setGradeFilter(e.target.value)}
              className="rounded-md bg-slate-700 border border-slate-600 px-3 py-2"
            >
              <option value="">Any Grade</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
            </select>
            
            <select name="subject" className="rounded-md bg-slate-700 border border-slate-600 px-3 py-2">
              <option value="">Any Subject</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </form>

        {/* Search Results */}
        {searchQuery && results.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Search Results for "{searchQuery}" ({results.length} found)
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
        {!searchQuery && data.documents && (
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
