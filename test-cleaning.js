// Test the cleanExplanationText function
const jsonResponse = `{
  "CurriculumDesignRationale": "The dual-grade accelerated pacing guide for Grades 8 and 9 is designed to provide a seamless transition between foundational and advanced mathematical concepts, ensuring students are well-prepared for higher-level mathematics.",
  "DetailedCurriculumDecisions": {
    "MergedLessons": [
      "Combined Grade 8 'Linear Equations' with Algebra 1 'Solving Linear Systems' - Natural progression from basic to advanced",
      "Integrated Grade 8 'Functions' with Algebra 1 'Function Analysis' - Builds conceptual depth"
    ],
    "SkippedContent": [
      "Omitted Grade 8 'Review Topics' - Redundant with advanced content",
      "Removed basic arithmetic review - Students have mastered these skills"
    ],
    "PreservedEssentialContent": [
      "Maintained Grade 8 'Transformations' (High Priority) - Foundation for geometry",
      "Kept Algebra 1 'Quadratic Functions' (Critical) - Gateway concept"
    ],
    "ContentOverlapResolutions": [
      "Resolved overlap between Grade 8 'Data Analysis' and Algebra 1 'Statistics' by combining practical applications of data interpretation and statistical analysis without redundancy.",
      "Resolved overlap between Grade 8 'Exponents' and Algebra 1 'Exponential Functions' by focusing on application and real-world problem-solving, enhancing students' ability to apply these concepts practically."
    ]
  }
}`;

function cleanExplanationText(rawText) {
  if (!rawText) return '';
  
  let cleanText = rawText.trim();
  
  // Remove JSON wrapper if present
  if (cleanText.startsWith('{') && cleanText.endsWith('}')) {
    try {
      const jsonData = JSON.parse(cleanText);
      
      // Extract readable content from common JSON structures
      if (jsonData.CurriculumDesignRationale) {
        let extracted = jsonData.CurriculumDesignRationale + '\n\n';
        
        if (jsonData.DetailedCurriculumDecisions) {
          extracted += '**Detailed Curriculum Decisions:**\n\n';
          
          const decisions = jsonData.DetailedCurriculumDecisions;
          
          if (decisions.MergedLessons) {
            extracted += '**• Merged Lessons:**\n';
            decisions.MergedLessons.forEach((lesson) => {
              extracted += `- ${lesson}\n`;
            });
            extracted += '\n';
          }
          
          if (decisions.SkippedContent) {
            extracted += '**• Skipped Content:**\n';
            decisions.SkippedContent.forEach((content) => {
              extracted += `- ${content}\n`;
            });
            extracted += '\n';
          }
          
          if (decisions.PreservedEssentialContent) {
            extracted += '**• Preserved Essential Content:**\n';
            decisions.PreservedEssentialContent.forEach((content) => {
              extracted += `- ${content}\n`;
            });
            extracted += '\n';
          }
          
          if (decisions.ContentOverlapResolutions) {
            extracted += '**• Content Overlap Resolutions:**\n';
            decisions.ContentOverlapResolutions.forEach((resolution) => {
              extracted += `- ${resolution}\n`;
            });
          }
        }
        
        return extracted.trim();
      }
    } catch (e) {
      console.log('⚠️ [Clean Text] Failed to parse JSON, using raw text');
    }
  }
  
  return cleanText;
}

console.log("INPUT JSON:");
console.log(jsonResponse);
console.log("\n" + "=".repeat(80) + "\n");
console.log("CLEANED OUTPUT:");
console.log(cleanExplanationText(jsonResponse));
