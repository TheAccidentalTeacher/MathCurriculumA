'use client';

import React from 'react';
import InputOutputTable, { 
  LinearFunctionTable, 
  QuadraticFunctionTable, 
  BlankFunctionTable,
  createInputOutputTable 
} from '../../components/InputOutputTable';

export default function InputOutputTableTest() {
  const handleValueChange = (input: string | number, output: string | number) => {
    console.log(`Table value changed: ${input} → ${output}`);
  };

  const handleTableComplete = (data: any[]) => {
    console.log('Table completed with data:', data);
    alert(`Great job! You completed the table with ${data.length} rows.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              📊 Input/Output Table Test Suite
            </h1>
            <p className="text-gray-600">
              Perfect for function relationships and pattern recognition in middle school math
            </p>
          </div>

          {/* Pre-configured Tables Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📋 Pre-configured Tables</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Linear Function Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-blue-800">Linear Function</h3>
                  <p className="text-sm text-blue-600">Rule: y = 2x + 1</p>
                </div>
                <div className="p-4">
                  <LinearFunctionTable
                    interactive={true}
                    onValueChange={handleValueChange}
                    onTableComplete={handleTableComplete}
                  />
                </div>
              </div>

              {/* Quadratic Function Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-green-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-green-800">Quadratic Function</h3>
                  <p className="text-sm text-green-600">Rule: y = x²</p>
                </div>
                <div className="p-4">
                  <QuadraticFunctionTable
                    interactive={true}
                    onValueChange={handleValueChange}
                    onTableComplete={handleTableComplete}
                  />
                </div>
              </div>

              {/* Blank Function Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-purple-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-purple-800">Student Discovery</h3>
                  <p className="text-sm text-purple-600">Find your own pattern!</p>
                </div>
                <div className="p-4">
                  <BlankFunctionTable
                    interactive={true}
                    onValueChange={handleValueChange}
                    onTableComplete={handleTableComplete}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Custom Tables Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Custom Tables</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Custom Rule Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-orange-800">Custom Rule: 3x - 2</h3>
                  <p className="text-sm text-orange-600">Try different multiplication rules</p>
                </div>
                <div className="p-4">
                  <InputOutputTable
                    title="Custom Function Table"
                    rule="3*x - 2"
                    initialData={[
                      { input: 0, output: "", editable: true },
                      { input: 1, output: "", editable: true },
                      { input: 2, output: "", editable: true },
                      { input: 3, output: "", editable: true },
                      { input: 4, output: "", editable: true }
                    ]}
                    interactive={true}
                    showRule={true}
                    onValueChange={handleValueChange}
                    onTableComplete={handleTableComplete}
                  />
                </div>
              </div>

              {/* Pre-filled Data Table */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-50 px-4 py-3 border-b">
                  <h3 className="font-semibold text-teal-800">Pattern Recognition</h3>
                  <p className="text-sm text-teal-600">Find the hidden rule</p>
                </div>
                <div className="p-4">
                  <InputOutputTable
                    title="Mystery Pattern"
                    initialData={[
                      { input: 1, output: 5, editable: false },
                      { input: 2, output: 10, editable: false },
                      { input: 3, output: "", editable: true },
                      { input: 4, output: "", editable: true },
                      { input: 5, output: "", editable: true }
                    ]}
                    interactive={true}
                    showRule={false}
                    onValueChange={handleValueChange}
                    onTableComplete={handleTableComplete}
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Virtual Tutor Integration Demo */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">🤖 Virtual Tutor Integration</h2>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">AI Tutor Table Examples</h3>
              <p className="text-gray-600 mb-4">
                These are the syntax patterns students can use with Mr. Somers to generate tables:
              </p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm text-blue-600 mb-2">
                    [TABLE:linear]
                  </div>
                  <p className="text-sm text-gray-700">
                    Creates a linear function table with rule y = 2x + 1
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm text-green-600 mb-2">
                    [TABLE:quadratic]
                  </div>
                  <p className="text-sm text-gray-700">
                    Creates a quadratic function table with rule y = x²
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm text-purple-600 mb-2">
                    [TABLE:blank]
                  </div>
                  <p className="text-sm text-gray-700">
                    Creates an empty table for student exploration
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm text-orange-600 mb-2">
                    [TABLE:rule:5*x]
                  </div>
                  <p className="text-sm text-gray-700">
                    Creates a table with custom rule y = 5x
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm text-teal-600 mb-2">
                    [IOTABLE:1,2|2,4|3,6]
                  </div>
                  <p className="text-sm text-gray-700">
                    Creates a table with specific input-output pairs
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-mono text-sm text-indigo-600 mb-2">
                    [IOTABLE:x+3]
                  </div>
                  <p className="text-sm text-gray-700">
                    Creates a table with the rule y = x + 3
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className="text-center">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                🎓 How to Use Input/Output Tables
              </h3>
              <div className="text-sm text-blue-700 space-y-2">
                <p>• Fill in the missing values to complete the pattern</p>
                <p>• Click "Find Pattern" to discover the mathematical rule</p>
                <p>• Use "Apply Rule" to automatically fill in outputs</p>
                <p>• Add or remove rows to explore different ranges</p>
                <p>• Perfect for understanding functions, patterns, and relationships!</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}