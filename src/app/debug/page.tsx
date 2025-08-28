'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DebugData {
  health?: any;
  curriculum?: any;
  database?: any;
}

export default function DebugPage() {
  const [debugData, setDebugData] = useState<DebugData>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const [healthRes, curriculumRes, databaseRes] = await Promise.allSettled([
        fetch('/api/health'),
        fetch('/api/debug/curriculum'),
        fetch('/api/debug/database')
      ]);

      const newData: DebugData = {};

      if (healthRes.status === 'fulfilled') {
        newData.health = await healthRes.value.json();
      }
      if (curriculumRes.status === 'fulfilled') {
        newData.curriculum = await curriculumRes.value.json();
      }
      if (databaseRes.status === 'fulfilled') {
        newData.database = await databaseRes.value.json();
      }

      setDebugData(newData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Diagnostics failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
      'SUCCESS': 'bg-green-600',
      'HEALTHY': 'bg-green-600',
      'ERROR': 'bg-red-600',
      'UNHEALTHY': 'bg-red-600',
      'CRITICAL': 'bg-red-800',
      'CRITICAL_ERROR': 'bg-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-white text-xs ${colors[status as keyof typeof colors] || 'bg-gray-600'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">🔧 System Diagnostics</h1>
            <div className="flex gap-4">
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded transition-colors"
              >
                {loading ? '🔄 Running...' : '🔄 Refresh'}
              </button>
              <Link 
                href="/documents" 
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
              >
                📚 Back to App
              </Link>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-slate-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <div className="grid gap-6">
          {/* Health Check */}
          {debugData.health && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">🏥 Health Check</h2>
                <StatusBadge status={debugData.health.overallHealth} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(debugData.health.checks).map(([key, check]: [string, any]) => (
                  <div key={key} className="bg-slate-700 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{key}</h3>
                      <StatusBadge status={check.status} />
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{check.message}</p>
                    {check.error && (
                      <code className="text-red-400 text-xs block bg-slate-900 p-2 rounded">
                        {check.error}
                      </code>
                    )}
                    {check.data && (
                      <pre className="text-xs text-slate-400 bg-slate-900 p-2 rounded mt-2">
                        {JSON.stringify(check.data, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Database Inspection */}
          {debugData.database && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4">🗄️ Database Inspection</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Tables ({debugData.database.tables?.count || 0})</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    {debugData.database.tables?.list?.map((table: string) => (
                      <li key={table} className="font-mono">{table}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Documents Table</h3>
                  <div className="space-y-2 text-sm">
                    <div>Exists: {debugData.database.documentsTable?.exists ? '✅' : '❌'}</div>
                    <div>Row Count: {debugData.database.documentsTable?.rowCount || 0}</div>
                    {debugData.database.documentsTable?.samples?.length > 0 && (
                      <div>
                        <strong>Sample Documents:</strong>
                        <ul className="mt-1 space-y-1">
                          {debugData.database.documentsTable.samples.map((doc: any, idx: number) => (
                            <li key={idx} className="text-xs bg-slate-700 p-2 rounded">
                              {doc.filename} - {doc.title} ({doc.content_length} chars)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Curriculum Service */}
          {debugData.curriculum && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">📚 Curriculum Service</h2>
                <StatusBadge status={debugData.curriculum.overallStatus} />
              </div>
              
              <div className="space-y-4">
                {Object.entries(debugData.curriculum.tests).map(([key, test]: [string, any]) => (
                  <div key={key} className="bg-slate-700 p-4 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{key}</h3>
                      <div className="flex items-center gap-2">
                        {test.executionTime && (
                          <span className="text-xs text-slate-400">{test.executionTime}</span>
                        )}
                        <StatusBadge status={test.status} />
                      </div>
                    </div>
                    
                    {test.count !== undefined && (
                      <p className="text-sm text-slate-300">Count: {test.count}</p>
                    )}
                    
                    {test.sample && (
                      <details className="mt-2">
                        <summary className="text-sm text-blue-400 cursor-pointer">View Sample Data</summary>
                        <pre className="text-xs text-slate-400 bg-slate-900 p-2 rounded mt-2">
                          {JSON.stringify(test.sample, null, 2)}
                        </pre>
                      </details>
                    )}
                    
                    {test.error && (
                      <code className="text-red-400 text-xs block bg-slate-900 p-2 rounded">
                        {test.message}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">🚀 Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Test API Endpoints</h3>
              <div className="space-y-2">
                <a href="/api/health" target="_blank" className="block text-blue-400 hover:text-blue-300 text-sm">
                  /api/health - Health check
                </a>
                <a href="/api/docs" target="_blank" className="block text-blue-400 hover:text-blue-300 text-sm">
                  /api/docs - Documents API
                </a>
                <a href="/api/debug/database" target="_blank" className="block text-blue-400 hover:text-blue-300 text-sm">
                  /api/debug/database - Raw database
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Environment Info</h3>
              <div className="text-sm text-slate-300 space-y-1">
                <div>Environment: {debugData.health?.checks?.environment?.NODE_ENV || 'unknown'}</div>
                <div>Platform: {debugData.health?.checks?.environment?.RAILWAY || 'local'}</div>
                <div>DB URL: {debugData.health?.checks?.environment?.DATABASE_URL_exists ? '✅ Set' : '❌ Missing'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
