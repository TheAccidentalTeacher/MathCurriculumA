'use client';

import Link from "next/link";
import { useState } from "react";
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
    emoji: '📚'
  },
  {
    id: 'grade6-volume2',
    title: 'Grade 6 Volume 2',
    pages: '408 pages',
    color: 'bg-teal-600',
    hoverColor: 'hover:bg-teal-700',
    href: '/viewer/grade6-volume2',
    grade: 'G6',
    emoji: '📖'
  },
  {
    id: 'volume1',
    title: 'Grade 7 Volume 1',
    pages: '504 pages',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    href: '/viewer/volume1',
    grade: 'G7',
    emoji: '📘'
  },
  {
    id: 'volume2', 
    title: 'Grade 7 Volume 2',
    pages: '440 pages',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    href: '/viewer/volume2',
    grade: 'G7',
    emoji: '📗'
  },
  {
    id: 'grade8-volume1',
    title: 'Grade 8 Volume 1', 
    pages: '552 pages',
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    href: '/viewer/grade8-volume1',
    grade: 'G8',
    emoji: '📙'
  },
  {
    id: 'grade8-volume2',
    title: 'Grade 8 Volume 2',
    pages: '456 pages', 
    color: 'bg-orange-600',
    hoverColor: 'hover:bg-orange-700',
    href: '/viewer/grade8-volume2',
    grade: 'G8',
    emoji: '📕'
  }
];

export function CurriculumTransformer() {
  const [currentPhase, setCurrentPhase] = useState<'initial' | 'shuffling' | 'merging' | 'transformed'>('initial');

  const handleTransform = () => {
    setCurrentPhase('shuffling');
    
    // Phase 1: Shuffle animation
    setTimeout(() => {
      setCurrentPhase('merging');
    }, 1500);
    
    // Phase 2: Merge into accelerated pathway
    setTimeout(() => {
      setCurrentPhase('transformed');
    }, 3000);
  };

  const handleReset = () => {
    setCurrentPhase('initial');
  };

  return (
    <>
      {/* Full Curriculum Viewer Section */}
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 mb-8 relative overflow-hidden">
        {/* Background Mathematical Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="text-6xl font-mono text-blue-300 transform rotate-12 absolute top-4 left-4">π</div>
          <div className="text-4xl font-mono text-blue-300 transform -rotate-12 absolute top-12 right-8">∑</div>
          <div className="text-5xl font-mono text-blue-300 transform rotate-6 absolute bottom-8 left-12">∫</div>
          <div className="text-3xl font-mono text-blue-300 transform -rotate-6 absolute bottom-4 right-4">√</div>
          <div className="text-4xl font-mono text-blue-300 transform rotate-45 absolute top-1/2 left-1/2">∞</div>
        </div>

        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-blue-200 mb-3">
            🎴 Full Curriculum Viewer
          </h2>
          <p className="text-slate-300 mb-4">
            View the complete Ready Classroom Mathematics curriculum with high-resolution page images.
          </p>

          {/* Transformation Container */}
          <div className="relative min-h-[200px] mb-6">
            {currentPhase === 'initial' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-pulse">🎴</div>
                  <p className="text-blue-200 text-lg font-medium mb-6">
                    Six volumes ready to be transformed into one accelerated pathway!
                  </p>
                  
                  <button
                    onClick={handleTransform}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl group-hover:animate-spin">🎲</span>
                      <span>Transform the Curriculum!</span>
                      <span className="text-2xl group-hover:animate-bounce">⚡</span>
                    </span>
                    
                    {/* Magic effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-xl opacity-30 group-hover:opacity-100 blur group-hover:blur-none transition-all duration-300"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Phase 1: Shuffling Animation */}
            {currentPhase === 'shuffling' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {volumes.map((volume, index) => (
                    <div
                      key={volume.id}
                      className={`absolute w-48 h-32 ${volume.color} rounded-lg shadow-lg border-2 border-white/20 flex items-center justify-center card-shuffle`}
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        zIndex: volumes.length - index
                      }}
                    >
                      <div className="text-center text-white">
                        <div className="text-2xl mb-1">{volume.emoji}</div>
                        <div className="text-sm font-bold">{volume.grade}</div>
                        <div className="text-xs opacity-75">{volume.pages}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Central shuffle effect */}
                  <div className="text-6xl animate-spin text-yellow-400">
                    ✨
                  </div>
                </div>
              </div>
            )}

            {/* Phase 2: Merging Animation */}
            {currentPhase === 'merging' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Cards converging to center */}
                  {volumes.map((volume, index) => (
                    <div
                      key={volume.id}
                      className={`absolute w-48 h-32 ${volume.color} rounded-lg shadow-lg border-2 border-white/20 flex items-center justify-center cards-merge`}
                      style={{
                        animationDelay: `${index * 0.3}s`,
                        zIndex: volumes.length - index
                      }}
                    >
                      <div className="text-center text-white">
                        <div className="text-2xl mb-1">{volume.emoji}</div>
                        <div className="text-sm font-bold">{volume.grade}</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Transformation energy */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl animate-pulse text-purple-400 transformation-glow">
                      🌟
                    </div>
                  </div>
                  
                  {/* Emerging pathway text */}
                  <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 text-center pathway-emerge">
                    <div className="text-purple-300 font-bold animate-bounce">
                      ⚡ COMBINING INTO ACCELERATED PATHWAY ⚡
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Traditional volume buttons when transformed */}
            {currentPhase === 'transformed' && (
              <div className="animate-fadeIn">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {volumes.map((volume, index) => (
                    <Link
                      key={volume.id}
                      href={volume.href}
                      className={`volume-card inline-flex items-center justify-center px-6 py-3 ${volume.color} text-white rounded-lg ${volume.hoverColor} transition-all duration-300 font-medium transform hover:scale-105 hover:shadow-xl`}
                      style={{
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <div className="text-center">
                        <div>{volume.emoji} {volume.title}</div>
                        <div className="text-xs opacity-75 mt-1">({volume.pages})</div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-300">
                    <strong>Features:</strong> Navigate through all pages • High-resolution images • Quick page jumping
                  </div>
                  
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md text-sm transition-colors"
                  >
                    🔄 Transform Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes cardShuffle {
            0% {
              transform: translateX(0) translateY(0) rotate(0deg) scale(1);
              opacity: 1;
            }
            25% {
              transform: translateX(-100px) translateY(-50px) rotate(-15deg) scale(0.9);
              opacity: 0.8;
            }
            50% {
              transform: translateX(100px) translateY(50px) rotate(15deg) scale(1.1);
              opacity: 0.6;
            }
            75% {
              transform: translateX(-50px) translateY(-25px) rotate(-10deg) scale(0.95);
              opacity: 0.8;
            }
            100% {
              transform: translateX(0) translateY(0) rotate(0deg) scale(1);
              opacity: 0;
            }
          }

          @keyframes cardsMerge {
            0% {
              transform: translateX(0) translateY(0) rotate(0deg) scale(1);
              opacity: 1;
            }
            50% {
              transform: translateX(0) translateY(0) rotate(180deg) scale(0.5);
              opacity: 0.7;
            }
            100% {
              transform: translateX(0) translateY(0) rotate(360deg) scale(0);
              opacity: 0;
            }
          }

          @keyframes transformationGlow {
            0%, 100% { 
              filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.8));
              transform: scale(1) rotate(0deg);
            }
            50% { 
              filter: drop-shadow(0 0 40px rgba(168, 85, 247, 1));
              transform: scale(1.2) rotate(180deg);
            }
          }

          @keyframes pathwayEmerge {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes volumeCardReveal {
            0% {
              opacity: 0;
              transform: translateY(30px) rotateY(90deg);
            }
            100% {
              opacity: 1;
              transform: translateY(0) rotateY(0deg);
            }
          }

          @keyframes slideUp {
            0% {
              opacity: 0;
              transform: translateY(50px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .card-shuffle {
            animation: cardShuffle 1.5s ease-in-out forwards;
          }

          .cards-merge {
            animation: cardsMerge 1.5s ease-in-out forwards;
          }

          .transformation-glow {
            animation: transformationGlow 2s ease-in-out infinite;
          }

          .pathway-emerge {
            animation: pathwayEmerge 1s ease-out forwards 0.5s;
            opacity: 0;
          }

          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .volume-card {
            animation: volumeCardReveal 0.6s ease-out forwards;
            opacity: 0;
          }

          .pathway-container {
            animation: slideUp 1s ease-out forwards 0.5s;
            opacity: 0;
          }
        `}</style>
      </div>

      {/* Accelerated Pathway - Only shows after transformation */}
      {currentPhase === 'transformed' && (
        <div className="pathway-container">
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              <span className="text-2xl">🚀</span>
              <span>TRANSFORMATION COMPLETE!</span>
              <span className="text-2xl">⚡</span>
            </div>
            <p className="text-slate-400 mt-2 text-sm">
              Six volumes have merged into one powerful accelerated pathway
            </p>
          </div>
          
          <div className="mb-8">
            <AcceleratedPathwayViewer />
          </div>
        </div>
      )}
    </>
  );
}
