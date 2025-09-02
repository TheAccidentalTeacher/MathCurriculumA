'use client';

import React from 'react';
import 'katex/dist/katex.min.css';

// Import KaTeX directly for custom rendering
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Custom math rendering components using KaTeX
 */
const InlineMath: React.FC<{ math: string }> = ({ math }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: false,
      throwOnError: false,
      strict: false
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (error) {
    return (
      <span className="px-2 py-1 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
        [{math}]
      </span>
    );
  }
};

const BlockMath: React.FC<{ math: string }> = ({ math }) => {
  try {
    const html = katex.renderToString(math, {
      displayMode: true,
      throwOnError: false,
      strict: false
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} className="text-center my-4" />;
  } catch (error) {
    return (
      <div className="my-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
        <strong>Math Rendering Error:</strong> {math}
      </div>
    );
  }
};

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Component to render mathematical expressions in text content.
 * Converts LaTeX notation to properly formatted math equations.
 * 
 * Supports:
 * - Inline math: \(...\) or $...$
 * - Block math: \[...\] or $$...$$
 * - Mixed text and math content
 */
export default function MathRenderer({ content, className = '' }: MathRendererProps) {
  const renderMathContent = (text: string) => {
    // Split content by different math delimiters
    // Handle block math first (higher precedence)
    const blockMathRegex = /(\\\[(.*?)\\\]|\$\$(.*?)\$\$)/g;
    const inlineMathRegex = /(\\\((.*?)\\\)|\$(.*?)\$)/g;
    
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let key = 0;

    // First pass: handle block math
    let blockMatch;
    const blockPositions: { start: number; end: number; latex: string; key: number }[] = [];
    
    while ((blockMatch = blockMathRegex.exec(text)) !== null) {
      const latex = blockMatch[2] || blockMatch[3]; // Get the LaTeX content
      blockPositions.push({
        start: blockMatch.index,
        end: blockMatch.index + blockMatch[0].length,
        latex,
        key: key++
      });
    }

    // Process text with block math
    let currentIndex = 0;
    blockPositions.forEach(({ start, end, latex, key: blockKey }) => {
      // Add text before block math
      if (currentIndex < start) {
        const textPart = text.substring(currentIndex, start);
        parts.push(
          <span key={`text-before-block-${blockKey}`}>
            {renderInlineMath(textPart, key)}
          </span>
        );
        key += 10; // Reserve space for inline math keys
      }

      // Add block math
      try {
        parts.push(
          <div key={`block-math-${blockKey}`} className="my-4">
            <BlockMath math={latex} />
          </div>
        );
      } catch (error) {
        console.warn('Error rendering block math:', latex, error);
        parts.push(
          <div key={`block-math-error-${blockKey}`} className="my-4 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Math Rendering Error:</strong> {latex}
          </div>
        );
      }

      currentIndex = end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      parts.push(
        <span key={`text-remaining-${key}`}>
          {renderInlineMath(remainingText, key + 100)}
        </span>
      );
    }

    return parts;
  };

  const renderInlineMath = (text: string, startKey: number) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = startKey;

    const inlineMathRegex = /(\\\((.*?)\\\)|\$(.*?)\$)/g;
    
    while ((match = inlineMathRegex.exec(text)) !== null) {
      // Add text before math
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add inline math
      const latex = match[2] || match[3]; // Get the LaTeX content
      try {
        parts.push(
          <InlineMath key={`inline-math-${key++}`} math={latex} />
        );
      } catch (error) {
        console.warn('Error rendering inline math:', latex, error);
        parts.push(
          <span 
            key={`inline-math-error-${key++}`} 
            className="px-2 py-1 bg-red-50 border border-red-200 rounded text-red-700 text-xs"
            title={`Math Rendering Error: ${latex}`}
          >
            [{latex}]
          </span>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : parts;
  };

  // If no math expressions found, return plain text
  if (!content.match(/(\\\[.*?\\\]|\$\$.*?\$\$|\\\(.*?\\\)|\$.*?\$)/)) {
    return <span className={className}>{content}</span>;
  }

  return (
    <div className={`math-content ${className}`}>
      {renderMathContent(content)}
    </div>
  );
}

// Utility function to check if text contains math
export function containsMath(text: string): boolean {
  return /(\\\[.*?\\\]|\$\$.*?\$\$|\\\(.*?\\\)|\$.*?\$)/.test(text);
}

// Utility function to clean LaTeX for display
export function cleanLatex(text: string): string {
  return text
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$');
}
