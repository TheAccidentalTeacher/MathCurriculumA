import { StandardsService } from '../../lib/standards-service';

export default async function DatabaseDiagnosticPage() {
  const standardsService = new StandardsService();
  
  try {
    console.log('🔍 Checking database connection...');
    
    // Test Grade 6 data
    const grade6Data = await standardsService.getStandardsForGrade('6');
    console.log('📊 Grade 6 data:', grade6Data.length, 'lessons found');
    
    // Test Grade 7 data  
    const grade7Data = await standardsService.getStandardsForGrade('7');
    console.log('📊 Grade 7 data:', grade7Data.length, 'lessons found');
    
    // Test Grade 8 data
    const grade8Data = await standardsService.getStandardsForGrade('8');
    console.log('📊 Grade 8 data:', grade8Data.length, 'lessons found');
    
    // Sample some data
    if (grade6Data.length > 0) {
      console.log('📖 Sample Grade 6 lesson:', grade6Data[0]);
    }
    if (grade7Data.length > 0) {
      console.log('📖 Sample Grade 7 lesson:', grade7Data[0]);
    }
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Diagnostic</h1>
        <div className="space-y-4">
          <div>Grade 6: {grade6Data.length} lessons</div>
          <div>Grade 7: {grade7Data.length} lessons</div>
          <div>Grade 8: {grade8Data.length} lessons</div>
          
          {grade6Data.length > 0 && (
            <div>
              <h3 className="font-bold">Sample Grade 6 Lesson:</h3>
              <pre className="bg-gray-100 p-2 text-sm">
                {JSON.stringify(grade6Data[0], null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Database Diagnostic - ERROR</h1>
        <div className="text-red-600">
          Error: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }
}
