'use client';

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { AcceleratedPathwayViewer } from "./AcceleratedPathwayViewer";

interface VolumeCard {
  id: string;
  title: string;
  pages: string;
  color: string;
  hoverColor: string;
  href: string;
  grade: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
}

const volumes: VolumeCard[] = [
  {
    id: 'grade6-volume1',
    title: 'Grade 6 Volume 1',
    pages: '512 pages',
    color: 'bg-indigo-600',
    hoverColor: 'hover:bg-indigo-700',
    href: '/viewer/grade6-volume1',
    grade: 'G6',
    emoji: '📚',
    gradientFrom: '#4F46E5',
    gradientTo: '#7C3AED'
  },
  {
    id: 'grade6-volume2',
    title: 'Grade 6 Volume 2',
    pages: '408 pages',
    color: 'bg-teal-600',
    hoverColor: 'hover:bg-teal-700',
    href: '/viewer/grade6-volume2',
    grade: 'G6',
    emoji: '📖',
    gradientFrom: '#0D9488',
    gradientTo: '#059669'
  },
  {
    id: 'volume1',
    title: 'Grade 7 Volume 1',
    pages: '504 pages',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    href: '/viewer/volume1',
    grade: 'G7',
    emoji: '📘',
    gradientFrom: '#2563EB',
    gradientTo: '#1D4ED8'
  },
  {
    id: 'volume2', 
    title: 'Grade 7 Volume 2',
    pages: '440 pages',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    href: '/viewer/volume2',
    grade: 'G7',
    emoji: '📗',
    gradientFrom: '#16A34A',
    gradientTo: '#15803D'
  },
  {
    id: 'grade8-volume1',
    title: 'Grade 8 Volume 1', 
    pages: '552 pages',
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    href: '/viewer/grade8-volume1',
    grade: 'G8',
    emoji: '📙',
    gradientFrom: '#9333EA',
    gradientTo: '#7C2D12'
  },
  {
    id: 'grade8-volume2',
    title: 'Grade 8 Volume 2',
    pages: '456 pages', 
    color: 'bg-orange-600',
    hoverColor: 'hover:bg-orange-700',
    href: '/viewer/grade8-volume2',
    grade: 'G8',
    emoji: '📕',
    gradientFrom: '#EA580C',
    gradientTo: '#DC2626'
  }
];

type AnimationPhase = 'initial' | 'spreading' | 'shuffling' | 'converging' | 'merging' | 'transforming' | 'complete';

export function CurriculumTransformer() {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('initial');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate magical particles
  useEffect(() => {
    if (currentPhase === 'merging' || currentPhase === 'transforming') {
      const newParticles = Array.from({length: 50}, (_, i) => ({
        id: i,
        x: Math.random() * 800,
        y: Math.random() * 400,
        opacity: Math.random() * 0.8 + 0.2
      }));
      setParticles(newParticles);
    }
  }, [currentPhase]);

  const startTransformation = async () => {
    setCurrentPhase('spreading');
    
    // Phase 1: Spread out cards dramatically 
    setTimeout(() => setCurrentPhase('shuffling'), 1000);
    
    // Phase 2: Dynamic shuffling dance
    setTimeout(() => setCurrentPhase('converging'), 3000);
    
    // Phase 3: Converge to center with energy
    setTimeout(() => setCurrentPhase('merging'), 4500);
    
    // Phase 4: Merge with magical effects
    setTimeout(() => setCurrentPhase('transforming'), 6000);
    
    // Phase 5: Final transformation reveal
    setTimeout(() => setCurrentPhase('complete'), 8000);
  };

  const resetTransformation = () => {
    setCurrentPhase('initial');
    setParticles([]);
  };

  return (
    <>
      {/* Hero Section with Advanced Animation System */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border border-blue-700 rounded-2xl p-8 mb-8 overflow-hidden min-h-[600px]">
        
        {/* Advanced Background Effects */}
        <div className="absolute inset-0">
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-teal-900/20 animate-gradient-shift"></div>
          
          {/* Dynamic mathematical symbols */}
          <div className="absolute inset-0 opacity-10">
            <div className="text-8xl font-mono text-blue-300 absolute top-8 left-8 animate-float-1">π</div>
            <div className="text-6xl font-mono text-purple-300 absolute top-16 right-12 animate-float-2">∑</div>
            <div className="text-7xl font-mono text-teal-300 absolute bottom-12 left-16 animate-float-3">∫</div>
            <div className="text-5xl font-mono text-pink-300 absolute bottom-8 right-8 animate-float-4">√</div>
            <div className="text-9xl font-mono text-indigo-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow">∞</div>
          </div>

          {/* Particle system */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                opacity: particle.opacity,
                animationDelay: `${particle.id * 0.1}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-4">
              🎴 Full Curriculum Transformation Engine
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Experience the revolutionary merger of six complete mathematics volumes into one accelerated learning pathway
            </p>
          </div>

          {/* Advanced Animation Container */}
          <div 
            ref={containerRef}
            className="relative h-96 mb-8 flex items-center justify-center"
          >
            
            {/* Initial State - Elegant Stack */}
            {currentPhase === 'initial' && (
              <div className="text-center animate-fade-in">
                <div className="relative mb-8">
                  {/* Stacked book effect */}
                  <div className="relative inline-block">
                    {volumes.slice(0, 3).map((volume, index) => (
                      <div
                        key={volume.id}
                        className="absolute w-24 h-32 rounded-lg shadow-2xl border-2 border-white/30"
                        style={{
                          background: `linear-gradient(135deg, ${volume.gradientFrom}, ${volume.gradientTo})`,
                          transform: `translateX(${index * 8}px) translateY(${index * -4}px) rotate(${index * 2 - 2}deg)`,
                          zIndex: 10 - index
                        }}
                      >
                        <div className="text-white text-center p-2">
                          <div className="text-lg">{volume.emoji}</div>
                          <div className="text-xs font-bold">{volume.grade}</div>
                        </div>
                      </div>
                    ))}
                    <div className="w-24 h-32"></div> {/* Spacer */}
                  </div>
                </div>
                
                <p className="text-blue-200 text-xl font-semibold mb-8 animate-pulse">
                  Six Volumes Ready for Transformation
                </p>
                
                <button
                  onClick={startTransformation}
                  className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"></div>
                  
                  <span className="relative flex items-center gap-4">
                    <span className="text-3xl animate-bounce">🚀</span>
                    <span>TRANSFORM CURRICULUM</span>
                    <span className="text-3xl animate-spin">⚡</span>
                  </span>
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-full w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl"></div>
                  </div>
                </button>
              </div>
            )}

            {/* Phase 1: Dramatic Spreading */}
            {currentPhase === 'spreading' && (
              <div className="absolute inset-0">
                {volumes.map((volume, index) => {
                  const angle = (index / volumes.length) * 2 * Math.PI;
                  const radius = 180;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={volume.id}
                      className="absolute w-32 h-20 rounded-xl shadow-2xl border-2 border-white/40 transition-all duration-1000 ease-out"
                      style={{
                        background: `linear-gradient(135deg, ${volume.gradientFrom}, ${volume.gradientTo})`,
                        transform: `translate(${x}px, ${y}px) rotate(${angle * 180 / Math.PI}deg)`,
                        left: '50%',
                        top: '50%',
                        marginLeft: '-4rem',
                        marginTop: '-2.5rem'
                      }}
                    >
                      <div className="text-white text-center p-2">
                        <div className="text-lg">{volume.emoji}</div>
                        <div className="text-xs font-bold">{volume.grade}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Phase 2: Dynamic Shuffling Dance */}
            {currentPhase === 'shuffling' && (
              <div className="absolute inset-0">
                {volumes.map((volume, index) => (
                  <div
                    key={volume.id}
                    className="absolute w-32 h-20 rounded-xl shadow-2xl border-2 border-white/40 animate-shuffle-dance"
                    style={{
                      background: `linear-gradient(135deg, ${volume.gradientFrom}, ${volume.gradientTo})`,
                      animationDelay: `${index * 0.2}s`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-4rem',
                      marginTop: '-2.5rem'
                    }}
                  >
                    <div className="text-white text-center p-2">
                      <div className="text-lg animate-bounce">{volume.emoji}</div>
                      <div className="text-xs font-bold">{volume.grade}</div>
                    </div>
                  </div>
                ))}
                
                {/* Energy effects */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-8xl animate-spin text-yellow-400 drop-shadow-2xl">
                    ⚡
                  </div>
                </div>
              </div>
            )}

            {/* Phase 3: Converging with Energy */}
            {currentPhase === 'converging' && (
              <div className="absolute inset-0">
                {volumes.map((volume, index) => (
                  <div
                    key={volume.id}
                    className="absolute w-32 h-20 rounded-xl shadow-2xl border-2 border-white/40 animate-converge"
                    style={{
                      background: `linear-gradient(135deg, ${volume.gradientFrom}, ${volume.gradientTo})`,
                      animationDelay: `${index * 0.15}s`,
                      left: '50%',
                      top: '50%',
                      marginLeft: '-4rem',
                      marginTop: '-2.5rem'
                    }}
                  >
                    <div className="text-white text-center p-2">
                      <div className="text-lg">{volume.emoji}</div>
                      <div className="text-xs font-bold">{volume.grade}</div>
                    </div>
                  </div>
                ))}
                
                {/* Convergence energy */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl animate-pulse text-purple-400 drop-shadow-2xl">
                    🌟
                  </div>
                </div>
              </div>
            )}

            {/* Phase 4: Magical Merging */}
            {currentPhase === 'merging' && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Cards spinning and shrinking into center */}
                {volumes.map((volume, index) => (
                  <div
                    key={volume.id}
                    className="absolute w-32 h-20 rounded-xl shadow-2xl border-2 border-white/40 animate-merge-spiral"
                    style={{
                      background: `linear-gradient(135deg, ${volume.gradientFrom}, ${volume.gradientTo})`,
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="text-white text-center p-2">
                      <div className="text-lg">{volume.emoji}</div>
                      <div className="text-xs font-bold">{volume.grade}</div>
                    </div>
                  </div>
                ))}
                
                {/* Central transformation energy */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-12xl animate-transformation-pulse text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text drop-shadow-2xl">
                    ✨
                  </div>
                </div>
                
                {/* Energy rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-purple-400 rounded-full animate-ping opacity-75"></div>
                  <div className="absolute w-48 h-48 border-4 border-pink-400 rounded-full animate-ping opacity-50" style={{animationDelay: '0.5s'}}></div>
                  <div className="absolute w-64 h-64 border-4 border-orange-400 rounded-full animate-ping opacity-25" style={{animationDelay: '1s'}}></div>
                </div>
              </div>
            )}

            {/* Phase 5: Final Transformation */}
            {currentPhase === 'transforming' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-16xl mb-4 animate-transformation-reveal bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                    🎯
                  </div>
                  <div className="text-2xl font-bold text-white animate-type-writer">
                    ACCELERATED PATHWAY CREATED
                  </div>
                  <div className="text-purple-300 font-semibold animate-slide-up mt-2">
                    ⚡ Six volumes merged into one powerful learning system ⚡
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Completion State - Show volume cards */}
          {currentPhase === 'complete' && (
            <div className="animate-slide-up-fade">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {volumes.map((volume, index) => (
                  <Link
                    key={volume.id}
                    href={volume.href}
                    className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-card-reveal"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Card background with gradient */}
                    <div 
                      className="h-24 flex items-center justify-center text-white font-bold relative"
                      style={{
                        background: `linear-gradient(135deg, ${volume.gradientFrom}, ${volume.gradientTo})`
                      }}
                    >
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="text-center relative z-10">
                        <div className="text-2xl mb-1 group-hover:animate-bounce">{volume.emoji}</div>
                        <div className="font-bold">{volume.title}</div>
                        <div className="text-xs opacity-90">({volume.pages})</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Pacing Generator Link */}
              <div className="mb-6">
                <Link
                  href="/pacing-generator"
                  className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white rounded-xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">🎯</span>
                        <h3 className="text-xl font-bold">Create Custom Pacing Guide</h3>
                      </div>
                      <p className="text-purple-100 text-sm">
                        Generate adaptive pacing guides tailored to your students' needs. 
                        Perfect for accelerated, scaffolded, or standard instruction.
                      </p>
                    </div>
                    <div className="text-4xl animate-bounce">
                      ⚡
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-sm text-purple-200">
                    <div className="flex items-center gap-1">
                      <span>📊</span>
                      <span>Data-driven analysis</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>📄</span>
                      <span>PDF/CSV export</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🔧</span>
                      <span>Fully customizable</span>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
                <div className="text-sm text-slate-300">
                  <strong className="text-white">Enhanced Features:</strong> 
                  <span className="ml-2">High-resolution pages • Instant navigation • Mathematical concept tracking</span>
                </div>
                
                <button
                  onClick={resetTransformation}
                  className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                >
                  🔄 Transform Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Accelerated Pathway Section - Enhanced */}
      {currentPhase === 'complete' && (
        <div className="animate-slide-up-delay">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl">
              <span className="text-3xl animate-spin-slow">🚀</span>
              <span>TRANSFORMATION SUCCESSFUL!</span>
              <span className="text-3xl animate-bounce">⚡</span>
            </div>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">
              Your complete mathematics curriculum is now unified into one intelligent, adaptive learning pathway
            </p>
          </div>
          
          <div className="mb-8">
            <AcceleratedPathwayViewer />
          </div>
        </div>
      )}

      {/* Advanced CSS Animations */}
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }

        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }

        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(7deg); }
        }

        @keyframes float-4 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(-4deg); }
        }

        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes shuffle-dance {
          0% { transform: translate(-64px, -40px) rotate(0deg) scale(1); }
          20% { transform: translate(100px, -80px) rotate(45deg) scale(1.1); }
          40% { transform: translate(-120px, 60px) rotate(-30deg) scale(0.9); }
          60% { transform: translate(80px, 100px) rotate(60deg) scale(1.2); }
          80% { transform: translate(-90px, -70px) rotate(-45deg) scale(0.95); }
          100% { transform: translate(-64px, -40px) rotate(0deg) scale(1); }
        }

        @keyframes converge {
          0% { 
            transform: translate(var(--start-x, -64px), var(--start-y, -40px)) rotate(var(--start-rot, 0deg)) scale(1);
            opacity: 1;
          }
          100% { 
            transform: translate(-64px, -40px) rotate(720deg) scale(0.8);
            opacity: 0.8;
          }
        }

        @keyframes merge-spiral {
          0% {
            transform: translate(-64px, -40px) rotate(0deg) scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: translate(-32px, -20px) rotate(360deg) scale(0.4);
            opacity: 0.4;
          }
          100% {
            transform: translate(0px, 0px) rotate(720deg) scale(0);
            opacity: 0;
          }
        }

        @keyframes transformation-pulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: drop-shadow(0 0 30px rgba(168, 85, 247, 0.8));
          }
          50% {
            transform: scale(1.3) rotate(180deg);
            filter: drop-shadow(0 0 60px rgba(168, 85, 247, 1));
          }
        }

        @keyframes transformation-reveal {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes type-writer {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up-fade {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes card-reveal {
          0% {
            opacity: 0;
            transform: translateY(50px) rotateY(90deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateY(0deg);
          }
        }

        /* Animation Classes */
        .animate-gradient-shift {
          animation: gradient-shift 8s ease-in-out infinite;
        }

        .animate-float-1 {
          animation: float-1 6s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 7s ease-in-out infinite 1s;
        }

        .animate-float-3 {
          animation: float-3 8s ease-in-out infinite 2s;
        }

        .animate-float-4 {
          animation: float-4 5s ease-in-out infinite 0.5s;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-shuffle-dance {
          animation: shuffle-dance 2s ease-in-out infinite;
        }

        .animate-converge {
          animation: converge 1.5s ease-in-out forwards;
        }

        .animate-merge-spiral {
          animation: merge-spiral 2s ease-in-out forwards;
        }

        .animate-transformation-pulse {
          animation: transformation-pulse 3s ease-in-out infinite;
        }

        .animate-transformation-reveal {
          animation: transformation-reveal 2s ease-out forwards;
        }

        .animate-type-writer {
          animation: type-writer 2s steps(25) forwards;
          overflow: hidden;
          white-space: nowrap;
          border-right: 3px solid;
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out forwards 0.5s;
          opacity: 0;
        }

        .animate-slide-up-fade {
          animation: slide-up-fade 0.8s ease-out forwards;
        }

        .animate-slide-up-delay {
          animation: slide-up 1s ease-out forwards 1s;
          opacity: 0;
        }

        .animate-card-reveal {
          animation: card-reveal 0.6s ease-out forwards;
          opacity: 0;
        }

        /* Custom text size */
        .text-12xl {
          font-size: 8rem;
          line-height: 1;
        }

        .text-16xl {
          font-size: 12rem;
          line-height: 1;
        }
      `}</style>
    </>
  );
}
