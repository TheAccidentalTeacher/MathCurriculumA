// Browser console utility to test dynamic scope and sequence
// Run this in the browser console at http://localhost:3000

async function displayScopeSequence() {
  console.log('🔍 Fetching Dynamic Scope & Sequence Data...');
  
  try {
    const response = await fetch('/api/scope-sequence');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API Success!');
      
      if (data.data?.allGrades) {
        console.log('\n📚 CURRICULUM SCOPE & SEQUENCE (Generated from actual lesson data):');
        console.log('=' .repeat(70));
        
        data.data.allGrades.forEach(grade => {
          console.log(`\n${grade.displayName}:`);
          console.log(`  📖 Total Lessons: ${grade.totalLessons}`);
          console.log(`  📅 Estimated Days: ${grade.estimatedDays}`);
          console.log(`  📁 Units: ${grade.totalUnits}`);
          
          if (grade.documents) {
            console.log(`  📄 Documents:`);
            grade.documents.forEach(doc => {
              console.log(`    - ${doc.title}: ${doc.lessons} lessons`);
            });
          }
        });
        
        console.log('\n🚀 ACCELERATED PATHWAYS:');
        console.log('=' .repeat(40));
        
        if (data.data.acceleratedPathways) {
          data.data.acceleratedPathways.forEach(pathway => {
            console.log(`\n${pathway.pathway}:`);
            console.log(`  📚 Grades: ${pathway.grades.join(', ')}`);
            console.log(`  📖 Total Lessons: ${pathway.totalLessons}`);
            console.log(`  📅 Estimated Days: ${pathway.estimatedDays}`);
            console.log(`  📝 Description: ${pathway.description}`);
          });
        }
      }
    } else {
      console.error('❌ API Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Fetch Error:', error);
  }
}

// Auto-run the display function
displayScopeSequence();

// Export for manual testing
window.testScopeSequence = displayScopeSequence;
