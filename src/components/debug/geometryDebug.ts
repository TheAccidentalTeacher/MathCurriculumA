// Enhanced ChatInterface debugging utility
import { useEffect } from 'react';

export const debugGeometryMarkers = (content: string, component: string = 'ChatInterface') => {
  console.group(`🔍 [${component}] Debugging Geometry Markers`);
  console.log('Content:', content);
  
  // Test cube markers
  const cubeMatches = content.match(/\[CUBE:[^\]]+\]/g);
  if (cubeMatches) {
    console.log('✅ Found CUBE markers:', cubeMatches);
  }
  
  // Test shape markers  
  const shapeMatches = content.match(/\[SHAPE:[^\]]+\]/g);
  if (shapeMatches) {
    console.log('✅ Found SHAPE markers:', shapeMatches);
  }
  
  // Test split results
  const regex = /(\[CUBE:[^\]]+\]|\[SHAPE:[^\]]+\])/g;
  const parts = content.split(regex);
  console.log('Split parts count:', parts.length);
  parts.forEach((part, i) => {
    if (part.includes('[CUBE:') || part.includes('[SHAPE:')) {
      console.log(`  Part ${i} (MARKER):`, part);
    }
  });
  
  console.groupEnd();
};

export const useGeometryMarkerDebug = (content: string, enabled: boolean = true) => {
  useEffect(() => {
    if (enabled && (content.includes('[CUBE:') || content.includes('[SHAPE:'))) {
      debugGeometryMarkers(content);
    }
  }, [content, enabled]);
};
