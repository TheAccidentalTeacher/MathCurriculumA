// Quick test for 8th-9th grade accelerated pathway
const testRequest = {
  gradeLevel: "8",
  gradeCombination: {
    selectedGrades: ["8", "9"],
    pathwayType: "accelerated"
  },
  scheduleType: "block",
  totalDays: 180,
  daysPerWeek: 5,
  sessionLengthMinutes: 90,
  acceleratedPathway: "accelerated-8-9",
  targetMode: "lesson-by-lesson",
  focusType: "detailed-analysis"
};

console.log("Test request for 8th-9th grade accelerated pathway:");
console.log(JSON.stringify(testRequest, null, 2));

// Test that would be sent to the API
fetch('/api/pacing/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testRequest)
}).then(response => response.json())
  .then(data => {
    console.log("API Response:", data);
  })
  .catch(error => {
    console.error("API Error:", error);
  });
