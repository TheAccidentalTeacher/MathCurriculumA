'use client';

import React from 'react';
import MathRenderer from './MathRenderer';

// Import the widget components (same as ChatInterface)
import MathGrapher, { createLinearGraph, createPointGraph } from './MathGrapher';
import PlaceValueChart, { createPowersOf10Chart } from './PlaceValueChart';
import ScientificNotationBuilder, { createScientificNotationExample } from './ScientificNotationBuilder';
import PowersOf10NumberLine, { createPowersOf10NumberLine } from './PowersOf10NumberLine';
import ChatGeoGebra, { ChatGeometryExplorer } from './ChatGeoGebra';
import PowersOf10Activity from './PowersOf10GeoGebra';
import GeometryVisualizer, { TriangleExplorer, CircleExplorer, CubeExplorer, SphereExplorer, CylinderExplorer } from './GeometryVisualizer';
import Cube3DVisualizer from './Cube3DVisualizer';

interface KidFriendlyMathProps {
  content: string;
  className?: string;
}

/**
 * Child-friendly math renderer that converts complex LaTeX to simple explanations
 * AND handles interactive widget rendering like the original ChatInterface
 * Designed for 11-year-old students
 */
export default function KidFriendlyMath({ content, className = "" }: KidFriendlyMathProps) {
  
  // Convert complex LaTeX patterns to kid-friendly explanations
  const makeKidFriendly = (text: string): string => {
    let kidText = text;
    
    // Area formula conversions
    kidText = kidText.replace(
      /\\text\{Area\}\s*=\s*\\frac\{1\}\{2\}\s*\\times\s*\\text\{base\}\s*\\times\s*\\text\{height\}/g,
      "**Area of a triangle = (base × height) ÷ 2**"
    );
    
    kidText = kidText.replace(
      /\\text\{Area\}\s*=\s*\\frac\{1\}\{2\}\s*×\s*\\text\{base\}\s*×\s*\\text\{height\}/g,
      "**Area of a triangle = (base × height) ÷ 2**"
    );
    
    // Specific calculation conversions
    kidText = kidText.replace(
      /\\text\{Area\}\s*=\s*\\frac\{1\}\{2\}\s*\\times\s*(\d+)\s*\\times\s*(\d+)\s*=\s*(\d+)/g,
      "**Area = ($1 × $2) ÷ 2 = $3**"
    );
    
    // Perimeter formulas
    kidText = kidText.replace(
      /\\text\{Perimeter\}\s*=\s*([a-z])\s*\+\s*([a-z])\s*\+\s*([a-z])/g,
      "**Perimeter = side $1 + side $2 + side $3**"
    );
    
    // General LaTeX cleanup
    kidText = kidText.replace(/\\text\{([^}]+)\}/g, "$1"); // Remove \text{}
    kidText = kidText.replace(/\\times/g, "×"); // Convert \times to ×
    kidText = kidText.replace(/\\div/g, "÷"); // Convert \div to ÷
    kidText = kidText.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 ÷ $2)"); // Convert fractions
    
    // Remove display math brackets
    kidText = kidText.replace(/\\\[|\\\]/g, "");
    kidText = kidText.replace(/\$\$|\$/g, ""); // Remove $ brackets
    
    // Clean up extra spaces and newlines
    kidText = kidText.replace(/\s+/g, " ").trim();
    
    return kidText;
  };

  // Split content into sections and process each (including widgets)
  const processContent = (text: string): React.ReactNode[] => {
    // First, split by widget markers (same logic as ChatInterface)
    const parts = text.split(/(\[GRAPH:[^\]]+\]|\[PLACEVALUE:[^\]]+\]|\[SCIENTIFIC:[^\]]+\]|\[POWERLINE:[^\]]+\]|\[GEOGEBRA:[^\]]+\]|\[GEOMETRY:[^\]]+\]|\[SHAPE:[^\]]+\]|\[POWERS10:[^\]]+\]|\[CUBE:[^\]]+\]|\[3D:[^\]]+\])/g);
    
    return parts.map((part, index) => {
      // Handle Place Value Chart
      const placeValueMatch = part.match(/\[PLACEVALUE:([^\]]+)\]/);
      if (placeValueMatch) {
        const number = parseFloat(placeValueMatch[1]) || 3500;
        return (
          <div key={index} className="my-4">
            <div className="mb-2 text-sm font-medium text-blue-700">
              🔢 Interactive Place Value Chart:
            </div>
            <PlaceValueChart 
              number={number}
              showPowersOf10={true}
              interactive={true}
              width={600}
              height={300}
            />
          </div>
        );
      }

      // Handle GeoGebra activities
      const geogebraMatch = part.match(/\[GEOGEBRA:([^\]]+)\]/);
      if (geogebraMatch) {
        const activity = geogebraMatch[1].toLowerCase();
        
        if (activity.includes('triangle') || activity.includes('geometry')) {
          const geometryCommands = [
            'A = (0, 0)',
            'B = (3, 0)', 
            'C = (1.5, 2.6)',
            'triangle = Polygon(A, B, C)',
            'SetColor(triangle, "lightblue")',
            'ShowLabel(A, true)',
            'ShowLabel(B, true)', 
            'ShowLabel(C, true)',
            // Add measurements for learning
            'a = Distance(B, C)',
            'b = Distance(A, C)', 
            'c = Distance(A, B)',
            'area = Area(triangle)',
            'Text("a = " + a, (2.2, 1.3))',
            'Text("b = " + b, (0.75, 1.8))',
            'Text("c = " + c, (1.5, -0.3))',
            'Text("Area = " + area, (1.5, 0.8))',
          ];
          
          return (
            <div key={index} className="my-4">
              <div className="mb-2 text-sm font-medium text-green-700">
                📐 Interactive Triangle Explorer:
              </div>
              <ChatGeometryExplorer shapes={geometryCommands} />
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                <strong>Try this:</strong> Click and drag the corner points (A, B, C) to change the triangle shape and see how the measurements update!
              </div>
            </div>
          );
        }
        
        return (
          <div key={index} className="my-4">
            <ChatGeoGebra 
              commands={['f(x) = x^2']}
              title="🧮 Interactive Math Activity"
            />
          </div>
        );
      }

      // Handle Powers of 10 activities
      const powers10Match = part.match(/\[POWERS10:([^\]]+)\]/);
      if (powers10Match) {
        const activityType = powers10Match[1].toLowerCase();
        return (
          <div key={index} className="my-4">
            <div className="mb-2 text-sm font-medium text-purple-700">
              💫 Powers of 10 Explorer:
            </div>
            <PowersOf10Activity 
              activityType={activityType.includes('place') ? 'place-value' : 'number-line'}
            />
            <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
              <strong>Learning tip:</strong> Each time you multiply by 10, the number moves one place to the left!
            </div>
          </div>
        );
      }

      // Regular text processing with kid-friendly math
      if (part.trim()) {
        const sections = part.split(/\n\s*\n/); // Split on double newlines
        
        return sections.map((section, sIndex) => {
          const cleanSection = makeKidFriendly(section);
          
          // Check if this section contains math
          const hasMath = section.includes("\\") || section.includes("Area") || section.includes("Perimeter");
          
          if (hasMath && cleanSection.includes("=")) {
            // This is a math calculation, make it prominent
            return (
              <div key={`${index}-${sIndex}`} className="my-3 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                <div className="text-lg font-semibold text-blue-900 mb-2">
                  🧮 Let's Calculate:
                </div>
                <div className="text-base text-gray-800 leading-relaxed">
                  {cleanSection}
                </div>
              </div>
            );
          }
          
          // Regular text processing
          return (
            <div key={`${index}-${sIndex}`} className="my-2 text-base text-gray-700 leading-relaxed">
              {cleanSection}
            </div>
          );
        });
      }
      
      return null;
    }).flat().filter(Boolean);
  };

  const processedContent = processContent(content);

  return (
    <div className={`kid-friendly-math ${className}`}>
      {processedContent}
      
      {/* Add helpful context for triangle area */}
      {content.includes("triangle") && content.includes("area") && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm font-medium text-yellow-800 mb-1">
            💡 Remember:
          </div>
          <div className="text-sm text-yellow-700">
            The area of a triangle is always "base times height, then divide by 2" because a triangle is exactly half of a rectangle!
          </div>
        </div>
      )}
    </div>
  );
}
