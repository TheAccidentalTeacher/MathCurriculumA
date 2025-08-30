'use client';

import Link from "next/link";
import { useState } from "react";

interface VolumeCard {
  id: string;
  title: string;
  pages: string;
  color: string;
  hoverColor: string;
  href: string;
}

const volumes: VolumeCard[] = [
  {
    id: 'volume1',
    title: '📘 Grade 7 Volume 1',
    pages: '504 pages',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
    href: '/viewer/volume1'
  },
  {
    id: 'volume2', 
    title: '📗 Grade 7 Volume 2',
    pages: '440 pages',
    color: 'bg-green-600',
    hoverColor: 'hover:bg-green-700',
    href: '/viewer/volume2'
  },
  {
    id: 'grade8-volume1',
    title: '📙 Grade 8 Volume 1', 
    pages: '552 pages',
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700',
    href: '/viewer/grade8-volume1'
  },
  {
    id: 'grade8-volume2',
    title: '📕 Grade 8 Volume 2',
    pages: '456 pages', 
    color: 'bg-orange-600',
    hoverColor: 'hover:bg-orange-700',
    href: '/viewer/grade8-volume2'
  }
];

export function FullCurriculumViewer() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = () => {
    setIsShuffling(true);
    // After shuffle animation, reveal the content
    setTimeout(() => {
      setIsRevealed(true);
      setIsShuffling(false);
    }, 1500); // Match the CSS animation duration
  };

  const handleReset = () => {
    setIsRevealed(false);
    setIsShuffling(false);
  };

  return (
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

        {/* Shuffle Animation Container */}
        <div className="relative min-h-[200px] mb-6">
          {!isRevealed && !isShuffling && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 animate-pulse">🎴</div>
                <p className="text-blue-200 text-lg font-medium mb-6">
                  Four volumes ready to be shuffled into one amazing curriculum!
                </p>
                
                <button
                  onClick={handleShuffle}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl group-hover:animate-spin">🎲</span>
                    <span>Shuffle the Curriculum!</span>
                    <span className="text-2xl group-hover:animate-bounce">🃏</span>
                  </span>
                  
                  {/* Sparkle effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-xl opacity-30 group-hover:opacity-100 blur group-hover:blur-none transition-all duration-300"></div>
                </button>
              </div>
            </div>
          )}

          {/* Shuffling Animation */}
          {isShuffling && (
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
                      <div className="text-xl mb-1">{volume.title.split(' ')[0]}</div>
                      <div className="text-sm opacity-75">{volume.pages}</div>
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

          {/* Revealed Content */}
          {isRevealed && (
            <div className="animate-fadeIn">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                      <div>{volume.title}</div>
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
                  🔄 Shuffle Again
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

        .card-shuffle {
          animation: cardShuffle 1.5s ease-in-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .volume-card {
          animation: volumeCardReveal 0.6s ease-out forwards;
          opacity: 0;
        }

        /* Sparkle animation for button */
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
