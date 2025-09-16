'use client';

import React, { useState, useCallback } from 'react';

interface TableRow {
  id: string;
  input: number | string;
  output: number | string;
  editable: boolean;
}

interface InputOutputTableProps {
  title?: string;
  rule?: string;
  initialData?: Array<{ input: number | string; output?: number | string; editable?: boolean }>;
  width?: number;
  interactive?: boolean;
  showRule?: boolean;
  onValueChange?: (input: number | string, output: number | string) => void;
  onTableComplete?: (data: TableRow[]) => void;
  className?: string;
}

export default function InputOutputTable({
  title = "Input/Output Table",
  rule = "",
  initialData = [
    { input: 1, output: "", editable: true },
    { input: 2, output: "", editable: true },
    { input: 3, output: "", editable: true },
    { input: 4, output: "", editable: true },
    { input: 5, output: "", editable: true }
  ],
  width = 400,
  interactive = true,
  showRule = true,
  onValueChange,
  onTableComplete,
  className = ''
}: InputOutputTableProps) {
  
  const [tableData, setTableData] = useState<TableRow[]>(() => 
    initialData.map((row, index) => ({
      id: `row-${index}`,
      input: row.input,
      output: row.output || "",
      editable: row.editable !== false
    }))
  );

  const [currentRule, setCurrentRule] = useState(rule);
  const [showRuleInput, setShowRuleInput] = useState(false);

  // Function to evaluate a rule (basic math expressions)
  const evaluateRule = useCallback((rule: string, input: number): number | null => {
    try {
      // Replace common math notation
      let expression = rule
        .replace(/x/g, input.toString())
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/(\d)\(/g, '$1*(') // Handle implicit multiplication like 2(x+1)
        .replace(/\)(\d)/g, ')*$1');

      // Basic safety check - only allow numbers, operators, and parentheses
      if (!/^[\d+\-*/().\s**]+$/.test(expression)) {
        return null;
      }

      const result = Function(`"use strict"; return (${expression})`)();
      return typeof result === 'number' && !isNaN(result) ? Math.round(result * 100) / 100 : null;
    } catch {
      return null;
    }
  }, []);

  // Apply rule to fill in outputs
  const applyRule = useCallback(() => {
    if (!currentRule) return;

    setTableData(prevData => 
      prevData.map(row => {
        const inputNum = parseFloat(row.input.toString());
        if (!isNaN(inputNum)) {
          const calculatedOutput = evaluateRule(currentRule, inputNum);
          if (calculatedOutput !== null) {
            return { ...row, output: calculatedOutput };
          }
        }
        return row;
      })
    );
  }, [currentRule, evaluateRule]);

  // Handle manual input changes
  const handleInputChange = (rowId: string, field: 'input' | 'output', value: string) => {
    setTableData(prevData => {
      const newData = prevData.map(row => 
        row.id === rowId ? { ...row, [field]: value } : row
      );
      
      // Check if table is complete
      const isComplete = newData.every(row => 
        row.input !== "" && row.output !== ""
      );
      
      if (isComplete && onTableComplete) {
        onTableComplete(newData);
      }

      return newData;
    });

    // Trigger change callback
    if (onValueChange) {
      const row = tableData.find(r => r.id === rowId);
      if (row) {
        const newInput = field === 'input' ? value : row.input;
        const newOutput = field === 'output' ? value : row.output;
        onValueChange(newInput, newOutput);
      }
    }
  };

  // Add new row
  const addRow = () => {
    const newRow: TableRow = {
      id: `row-${Date.now()}`,
      input: "",
      output: "",
      editable: true
    };
    setTableData([...tableData, newRow]);
  };

  // Remove row
  const removeRow = (rowId: string) => {
    if (tableData.length > 1) {
      setTableData(tableData.filter(row => row.id !== rowId));
    }
  };

  // Find pattern in the data
  const findPattern = () => {
    const validRows = tableData.filter(row => {
      const input = parseFloat(row.input.toString());
      const output = parseFloat(row.output.toString());
      return !isNaN(input) && !isNaN(output);
    });

    if (validRows.length < 2) return "Need at least 2 complete rows to find pattern";

    // Check for common patterns
    const inputs = validRows.map(row => parseFloat(row.input.toString()));
    const outputs = validRows.map(row => parseFloat(row.output.toString()));

    // Linear pattern: y = mx + b
    const differences = [];
    for (let i = 1; i < inputs.length; i++) {
      const inputDiff = inputs[i] - inputs[i-1];
      const outputDiff = outputs[i] - outputs[i-1];
      if (inputDiff !== 0) {
        differences.push(outputDiff / inputDiff);
      }
    }

    // Check if all differences are the same (linear relationship)
    if (differences.length > 0 && differences.every(diff => Math.abs(diff - differences[0]) < 0.001)) {
      const slope = differences[0];
      const yIntercept = outputs[0] - slope * inputs[0];
      
      if (Math.abs(yIntercept) < 0.001) {
        return `Pattern found: y = ${slope}x`;
      } else {
        return `Pattern found: y = ${slope}x ${yIntercept >= 0 ? '+' : ''} ${yIntercept}`;
      }
    }

    // Check for simple multiplication
    const ratios = validRows.map(row => {
      const input = parseFloat(row.input.toString());
      const output = parseFloat(row.output.toString());
      return input !== 0 ? output / input : null;
    }).filter(ratio => ratio !== null);

    if (ratios.length > 1 && ratios.every(ratio => Math.abs(ratio! - ratios[0]!) < 0.001)) {
      return `Pattern found: y = ${ratios[0]}x`;
    }

    return "No clear linear pattern found";
  };

  return (
    <div className={`input-output-table bg-white rounded-lg border-2 border-blue-200 p-4 ${className}`} style={{ width }}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          📊 {title}
        </h3>
        
        {/* Rule Section */}
        {showRule && (
          <div className="mb-3">
            {showRuleInput ? (
              <div className="flex gap-2 items-center">
                <label className="text-sm font-medium text-gray-600">Rule:</label>
                <input
                  type="text"
                  value={currentRule}
                  onChange={(e) => setCurrentRule(e.target.value)}
                  placeholder="e.g., x + 2, 3*x, x^2"
                  className="flex-1 px-2 py-1 border rounded text-sm"
                />
                <button
                  onClick={applyRule}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Apply
                </button>
                <button
                  onClick={() => setShowRuleInput(false)}
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                {currentRule ? (
                  <div className="text-sm">
                    <span className="text-gray-600">Rule: </span>
                    <span className="font-mono bg-blue-50 px-2 py-1 rounded">{currentRule}</span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No rule set</div>
                )}
                {interactive && (
                  <button
                    onClick={() => setShowRuleInput(true)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit Rule
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-50">
              <th className="px-4 py-2 text-left font-semibold text-gray-700 border-r">Input (x)</th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Output (y)</th>
              {interactive && <th className="px-2 py-2 w-8"></th>}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-2 border-r">
                  {interactive && row.editable ? (
                    <input
                      type="text"
                      value={row.input}
                      onChange={(e) => handleInputChange(row.id, 'input', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-center focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <span className="block text-center font-mono">{row.input}</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {interactive && row.editable ? (
                    <input
                      type="text"
                      value={row.output}
                      onChange={(e) => handleInputChange(row.id, 'output', e.target.value)}
                      className="w-full px-2 py-1 border rounded text-center focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <span className="block text-center font-mono">{row.output}</span>
                  )}
                </td>
                {interactive && (
                  <td className="px-2 py-2">
                    {tableData.length > 1 && (
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                        title="Remove row"
                      >
                        ✕
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controls */}
      {interactive && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            + Add Row
          </button>
          
          <button
            onClick={() => {
              const pattern = findPattern();
              alert(pattern);
            }}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
          >
            🔍 Find Pattern
          </button>
          
          {currentRule && (
            <button
              onClick={applyRule}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              ↻ Apply Rule
            </button>
          )}
        </div>
      )}

      {/* Pattern Hint */}
      <div className="mt-3 text-xs text-gray-500">
        💡 Tip: Look for patterns in how the output changes as the input increases!
      </div>
    </div>
  );
}

// Pre-configured components for common use cases
export function LinearFunctionTable(props: Partial<InputOutputTableProps>) {
  return (
    <InputOutputTable
      title="Linear Function Table"
      rule="2*x + 1"
      initialData={[
        { input: 0, output: 1, editable: false },
        { input: 1, output: "", editable: true },
        { input: 2, output: "", editable: true },
        { input: 3, output: "", editable: true }
      ]}
      {...props}
    />
  );
}

export function QuadraticFunctionTable(props: Partial<InputOutputTableProps>) {
  return (
    <InputOutputTable
      title="Quadratic Function Table"
      rule="x^2"
      initialData={[
        { input: 0, output: "", editable: true },
        { input: 1, output: "", editable: true },
        { input: 2, output: "", editable: true },
        { input: 3, output: "", editable: true },
        { input: 4, output: "", editable: true }
      ]}
      {...props}
    />
  );
}

export function BlankFunctionTable(props: Partial<InputOutputTableProps>) {
  return (
    <InputOutputTable
      title="Function Table"
      initialData={[
        { input: "", output: "", editable: true },
        { input: "", output: "", editable: true },
        { input: "", output: "", editable: true },
        { input: "", output: "", editable: true },
        { input: "", output: "", editable: true }
      ]}
      showRule={false}
      {...props}
    />
  );
}

// Utility function to create a table with specific data
export function createInputOutputTable(
  data: Array<{ input: number | string; output?: number | string }>,
  rule?: string,
  options?: Partial<InputOutputTableProps>
) {
  return (
    <InputOutputTable
      initialData={data}
      rule={rule}
      {...options}
    />
  );
}