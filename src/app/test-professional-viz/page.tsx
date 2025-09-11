'use client';

import React from 'react';
import ProfessionalMathVisualizer, { 
  MathVisualizationDashboard,
  MiddleSchoolFunctionExplorer,
  GeometryWorkshop,
  createMathVisualization 
} from '../../components/ProfessionalMathVisualizer';
import PlotlyGrapher, { LinearFunctionGrapher, QuadraticFunctionGrapher } from '../../components/PlotlyGrapher';
import ThreeGeometryVisualizer, { CubeExplorer, SphereExplorer } from '../../components/ThreeGeometryVisualizer';

export default function ProfessionalVisualizationTest() {
  const handleInteraction = (data: any) => {
    console.log('Visualization interaction:', data);
  };

  // Test the smart content analysis
  const testContents = [
    "Let's explore linear functions and their slopes",
    "The volume of a cube is calculated using the formula V = s³",
    "Quadratic functions form parabolas when graphed",
    "Understanding the properties of spheres and cylinders"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Professional Mathematical Visualization Suite
          </h1>
          <p className="text-gray-600 mb-4">
            Battle-tested, production-ready visualization tools for mathematical education
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            ✅ Professional Grade • ✅ Interactive • ✅ Curriculum Aligned
          </div>
        </div>

        {/* Quick Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-semibold">Plotly.js Graphing</h3>
            <p className="text-sm text-gray-600">Interactive function plotting with zoom, pan, and mathematical analysis</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl mb-2">🎲</div>
            <h3 className="font-semibold">Three.js 3D</h3>
            <p className="text-sm text-gray-600">Professional 3D geometry with measurements and transformations</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="font-semibold">Smart Selection</h3>
            <p className="text-sm text-gray-600">AI-powered tool selection based on mathematical content</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold">Curriculum Ready</h3>
            <p className="text-sm text-gray-600">Pre-configured for grades 6-8 mathematical concepts</p>
          </div>
        </div>

        {/* Function Visualization Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">📈 Interactive Function Graphing</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <LinearFunctionGrapher />
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <QuadraticFunctionGrapher />
            </div>
          </div>
        </section>

        {/* 3D Geometry Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🎲 3D Geometry Exploration</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <CubeExplorer onShapeClick={() => alert('Cube clicked! Volume and surface area calculations available.')} />
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <SphereExplorer onShapeClick={() => alert('Sphere clicked! Explore radius and volume relationships.')} />
            </div>
          </div>
        </section>

        {/* Smart Content Analysis Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🧠 Smart Visualization Selection</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-gray-600 mb-4">
              The system automatically selects the appropriate visualization tool based on mathematical content:
            </p>
            
            <div className="space-y-4">
              {testContents.map((content, index) => {
                const visualization = createMathVisualization(content);
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">Content:</span>
                      <span className="text-sm text-gray-600 ml-2">"{content}"</span>
                    </div>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Selected Tool:</span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${
                        visualization.type === 'function' ? 'bg-blue-100 text-blue-800' :
                        visualization.type === 'geometry-3d' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {visualization.type.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="max-w-md">
                      <ProfessionalMathVisualizer
                        type={visualization.type}
                        content={visualization.content}
                        config={visualization.config}
                        onInteraction={handleInteraction}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Integration with AI Tutor */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">🤖 AI Tutor Integration Ready</h2>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Integration Benefits</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Automatic visualization selection based on conversation context
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Interactive mathematical exploration with AI guidance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Real-time mathematical calculations and explanations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Age-appropriate content for 11-year-old students
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Technical Features</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">⚡</span>
                    Professional-grade libraries (Plotly.js, Three.js)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">⚡</span>
                    Cross-browser compatibility and mobile support
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">⚡</span>
                    TypeScript implementation with full error handling
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">⚡</span>
                    Performance optimized for educational use
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>Professional Mathematical Visualization Suite • Production Ready • Grades 6-8 Curriculum Aligned</p>
        </div>
      </div>
    </div>
  );
}
