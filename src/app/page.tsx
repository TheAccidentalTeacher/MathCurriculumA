'use client';

import { useState, useEffect } from 'react';
import { AcceleratedPathwayViewer } from "@/components/AcceleratedPathwayViewer";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState<any>({ documents: [], stats: { documents: 0, sections: 0, topics: 0, keywords: 0 } });
  const [results, setResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAcceleratedViewer, setShowAcceleratedViewer] = useState(false);
  const [usePrecisionDatabase, setUsePrecisionDatabase] = useState(true); // Default to precision database

  useEffect(() => {
    loadInitialData();
  }, [usePrecisionDatabase]); // Reload when database selection changes

  const loadInitialData = async () => {
    try {
      const apiEndpoint = usePrecisionDatabase ? '/api/precision/docs' : '/api/docs';
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const initialData = await response.json();
        setData(initialData);
      } else {
        throw new Error(`API responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Set fallback data
      setData({ documents: [], stats: { documents: 0, sections: 0, topics: 0, keywords: 0 } });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(gradeFilter && { grade: gradeFilter }),
      });
      
      const response = await fetch(`/api/search/global?${params}`);
      if (response.ok) {
        const searchResults = await response.json();
        setResults(searchResults);
      } else {
        console.error('Search failed:', response.statusText);
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleShuffle = () => {
    const cards = document.querySelectorAll('[data-volume-card]');
    let completedAnimations = 0;
    
    // Create EPIC particle explosion container
    const explosionContainer = document.createElement('div');
    explosionContainer.className = 'fixed inset-0 pointer-events-none z-50';
    explosionContainer.style.background = 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, rgba(0, 0, 0, 0.3) 100%)';
    document.body.appendChild(explosionContainer);
    
    // Generate multiple particle layers
    const particleImages = [
      '/animations/download-17.png', '/animations/download-18.png', '/animations/download-19.png',
      '/animations/download-20.png', '/animations/download-21.png', '/animations/download-22.png',
      '/animations/download-23.png', '/animations/download-24.png'
    ];
    
    // Create 50 particle elements
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute animate-spin';
      particle.style.cssText = `
        width: ${Math.random() * 60 + 20}px;
        height: ${Math.random() * 60 + 20}px;
        background-image: url(${particleImages[Math.floor(Math.random() * particleImages.length)]});
        background-size: cover;
        background-position: center;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.8 + 0.3};
        animation-duration: ${Math.random() * 3 + 1}s;
        filter: hue-rotate(${Math.random() * 360}deg) brightness(1.5);
      `;
      explosionContainer.appendChild(particle);
      
      // Animate particles flying around
      setTimeout(() => {
        particle.style.transition = 'all 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        particle.style.transform = `
          translateX(${(Math.random() - 0.5) * 800}px) 
          translateY(${(Math.random() - 0.5) * 600}px) 
          rotate(${Math.random() * 720}deg) 
          scale(${Math.random() * 2 + 0.5})
        `;
      }, Math.random() * 500);
    }
    
    // Add pulsing energy rings
    for (let ring = 0; ring < 5; ring++) {
      const energyRing = document.createElement('div');
      energyRing.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: ${100 + ring * 100}px;
        height: ${100 + ring * 100}px;
        margin-left: ${-(50 + ring * 50)}px;
        margin-top: ${-(50 + ring * 50)}px;
        border: 3px solid rgba(147, 51, 234, ${0.8 - ring * 0.15});
        border-radius: 50%;
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        animation-delay: ${ring * 0.2}s;
      `;
      explosionContainer.appendChild(energyRing);
    }
    
    cards.forEach((card, i) => {
      // Add magical glow to each card
      const glow = document.createElement('div');
      glow.className = 'absolute inset-0 rounded-xl animate-pulse';
      glow.style.cssText = `
        background: linear-gradient(45deg, 
          rgba(147, 51, 234, 0.6), 
          rgba(59, 130, 246, 0.6), 
          rgba(16, 185, 129, 0.6), 
          rgba(245, 101, 101, 0.6)
        );
        filter: blur(10px);
        z-index: -1;
      `;
      (card as HTMLElement).style.position = 'relative';
      (card as HTMLElement).appendChild(glow);
      
      setTimeout(() => {
        // Phase 1: MASSIVE explosion spread
        (card as HTMLElement).style.transform = `
          translateX(${(Math.random() - 0.5) * 600}px) 
          translateY(${(Math.random() - 0.5) * 500}px) 
          rotate(${(Math.random() - 0.5) * 180}deg) 
          scale(${1.5 + Math.random() * 0.8})
        `;
        (card as HTMLElement).style.transition = 'transform 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        (card as HTMLElement).style.zIndex = '20';
        (card as HTMLElement).style.filter = 'brightness(1.4) saturate(1.6) drop-shadow(0 0 30px rgba(147, 51, 234, 0.8))';
        
        // Phase 2: Chaotic orbital dance
        setTimeout(() => {
          (card as HTMLElement).style.transform = `
            translateX(${(Math.random() - 0.5) * 400}px) 
            translateY(${(Math.random() - 0.5) * 400}px) 
            rotate(${(Math.random() - 0.5) * 270}deg) 
            scale(${0.6 + Math.random() * 1.2})
          `;
          (card as HTMLElement).style.transition = 'transform 0.8s ease-in-out';
          (card as HTMLElement).style.filter = 'brightness(1.8) hue-rotate(90deg) drop-shadow(0 0 40px rgba(59, 130, 246, 1))';
          
          // Phase 3: Vortex spiral effect
          setTimeout(() => {
            const angle = (i * 60) + (Math.random() * 45);
            const radius = 200 + Math.random() * 150;
            const spiralX = Math.cos(angle * Math.PI / 180) * radius;
            const spiralY = Math.sin(angle * Math.PI / 180) * radius;
            
            (card as HTMLElement).style.transform = `
              translateX(${spiralX}px) 
              translateY(${spiralY}px) 
              rotate(${angle * 3}deg) 
              scale(${1.3 + Math.random() * 0.5})
            `;
            (card as HTMLElement).style.transition = 'transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            (card as HTMLElement).style.filter = 'brightness(2) hue-rotate(180deg) drop-shadow(0 0 50px rgba(16, 185, 129, 1))';
            
            // Phase 4: Matrix-style convergence
            setTimeout(() => {
              (card as HTMLElement).style.transform = `
                translateX(${(Math.random() - 0.5) * 100}px) 
                translateY(${(Math.random() - 0.5) * 100}px) 
                rotate(${720 + (Math.random() * 180)}deg) 
                scale(${0.8 + Math.random() * 0.6})
              `;
              (card as HTMLElement).style.transition = 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
              (card as HTMLElement).style.filter = 'brightness(1.2) hue-rotate(270deg) drop-shadow(0 0 60px rgba(245, 101, 101, 1))';
              
              // Phase 5: EPIC final slam down
              setTimeout(() => {
                (card as HTMLElement).style.transform = 'translateX(0) translateY(0) rotate(0deg) scale(1)';
                (card as HTMLElement).style.transition = 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                (card as HTMLElement).style.zIndex = '1';
                (card as HTMLElement).style.filter = 'brightness(1) saturate(1) hue-rotate(0deg) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))';
                
                // Remove glow after animation
                setTimeout(() => {
                  if (glow.parentNode) {
                    glow.remove();
                  }
                }, 1800);
                
                completedAnimations++;
                
                // GRAND FINALE - Show accelerated viewer with cinematic reveal
                if (completedAnimations === cards.length) {
                  setTimeout(() => {
                    // Remove particle explosion
                    explosionContainer.style.opacity = '0';
                    explosionContainer.style.transition = 'opacity 1s ease-out';
                    setTimeout(() => explosionContainer.remove(), 1000);
                    
                    // Show the accelerated viewer with dramatic entrance
                    setShowAcceleratedViewer(true);
                  }, 1000);
                }
              }, 1500);
            }, 1000);
          }, 800);
        }, 1200);
      }, i * 200); // Stagger each card's epic journey
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

        {/* Database Selection Toggle */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-purple-200">Database Source</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUsePrecisionDatabase(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    !usePrecisionDatabase 
                      ? 'bg-gray-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  🗄️ Legacy Database
                </button>
                <button
                  onClick={() => setUsePrecisionDatabase(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    usePrecisionDatabase 
                      ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  ⚡ Precision Database
                </button>
              </div>
            </div>
            
            {usePrecisionDatabase && (
              <div className="text-sm text-green-300 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>21x more lessons • 1.6x better quality</span>
                </div>
                <div className="text-xs text-green-400">GPT-5 optimized • 53.8% high confidence</div>
              </div>
            )}
            
            {!usePrecisionDatabase && data.metadata && (
              <div className="text-sm text-gray-400">
                <div>Legacy extraction • Limited data</div>
              </div>
            )}
          </div>
          
          {data.metadata && data.metadata.improvements && (
            <div className="mt-3 pt-3 border-t border-purple-500/20">
              <div className="text-sm text-purple-200 mb-2">Recent Improvements:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {data.metadata.improvements.map((improvement: string, idx: number) => (
                  <div key={idx} className="text-purple-300 flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    {improvement}
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <Link href="/viewer/grade6-volume1" data-volume-card className="block p-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: 'url(/animations/download-11.png)'}}></div>
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">📚</div>
                <div className="font-bold text-lg drop-shadow-md">Grade 6 Volume 1</div>
                <div className="text-sm opacity-90 mt-1 drop-shadow-sm">(512 pages)</div>
              </div>
            </Link>
            <Link href="/viewer/grade6-volume2" data-volume-card className="block p-4 bg-teal-600 text-white rounded-xl shadow-lg hover:bg-teal-700 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: 'url(/animations/download-12.png)'}}></div>
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">📖</div>
                <div className="font-bold text-lg drop-shadow-md">Grade 6 Volume 2</div>
                <div className="text-sm opacity-90 mt-1 drop-shadow-sm">(408 pages)</div>
              </div>
            </Link>
            
            {/* Grade 7 Volumes */}
            <Link href="/viewer/volume1" data-volume-card className="block p-4 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: 'url(/animations/download-13.png)'}}></div>
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">📘</div>
                <div className="font-bold text-lg drop-shadow-md">Grade 7 Volume 1</div>
                <div className="text-sm opacity-90 mt-1 drop-shadow-sm">(504 pages)</div>
              </div>
            </Link>
            <Link href="/viewer/volume2" data-volume-card className="block p-4 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: 'url(/animations/download-14.png)'}}></div>
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">📗</div>
                <div className="font-bold text-lg drop-shadow-md">Grade 7 Volume 2</div>
                <div className="text-sm opacity-90 mt-1 drop-shadow-sm">(440 pages)</div>
              </div>
            </Link>
            
            {/* Grade 8 Volumes */}
            <Link href="/viewer/grade8-volume1" data-volume-card className="block p-4 bg-purple-600 text-white rounded-xl shadow-lg hover:bg-purple-700 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: 'url(/animations/download-15.png)'}}></div>
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">📙</div>
                <div className="font-bold text-lg drop-shadow-md">Grade 8 Volume 1</div>
                <div className="text-sm opacity-90 mt-1 drop-shadow-sm">(552 pages)</div>
              </div>
            </Link>
            <Link href="/viewer/grade8-volume2" data-volume-card className="block p-4 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition-colors relative overflow-hidden group">
              <div className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-50 transition-opacity" style={{backgroundImage: 'url(/animations/download-16.png)'}}></div>
              <div className="text-center relative z-10">
                <div className="text-3xl mb-2 drop-shadow-lg">📕</div>
                <div className="font-bold text-lg drop-shadow-md">Grade 8 Volume 2</div>
                <div className="text-sm opacity-90 mt-1 drop-shadow-sm">(456 pages)</div>
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
