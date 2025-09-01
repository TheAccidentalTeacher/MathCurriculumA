'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OCRServiceInfo {
  message: string;
  status: string;
  version: string;
  availableVolumes: string[];
  endpoints: Record<string, string>;
  capabilities: string[];
}

interface OCRTestResult {
  success: boolean;
  testResult?: {
    pageNumber: number;
    confidence: number;
    processingTimeMs: number;
    content: {
      textLength: number;
      textPreview: string;
      textSample: string[];
      mathematicalFormulas: {
        count: number;
        samples: string[];
      };
      tables: {
        count: number;
        samples: Array<{
          rowCount: number;
          columnCount: number;
          confidence: number;
          preview: string[][];
        }>;
      };
    };
    metadata: any;
    assessment: {
      textQuality: string;
      formulaDetection: string;
      tableDetection: string;
      overallConfidence: string;
    };
  };
  serviceStatus?: {
    azureConnection: string;
    availableVolumes: string[];
    ready: boolean;
  };
  error?: string;
  message?: string;
}

interface ProcessingJob {
  jobId: string;
  status: string;
  progress: number;
  totalPages: number;
  processedPages: number;
  errors: string[];
  summary?: {
    volumeId: string;
    startedAt: string;
    completedAt?: string;
    processingTime?: number;
  };
  results?: {
    totalFormulas: number;
    totalTables: number;
    avgConfidence: number;
    textLength: number;
  };
}

export default function OCRAdminPage() {
  const [serviceInfo, setServiceInfo] = useState<OCRServiceInfo | null>(null);
  const [testResult, setTestResult] = useState<OCRTestResult | null>(null);
  const [processingJob, setProcessingJob] = useState<ProcessingJob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<string>('');

  // Load service info on mount
  useEffect(() => {
    loadServiceInfo();
  }, []);

  const loadServiceInfo = async () => {
    try {
      const response = await fetch('/api/ocr');
      const data = await response.json();
      setServiceInfo(data);
      if (data.availableVolumes?.length > 0) {
        setSelectedVolume(data.availableVolumes[0]);
      }
    } catch (err) {
      setError('Failed to load OCR service info');
    }
  };

  const runOCRTest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await fetch(`/api/ocr/test${selectedVolume ? `?volume=${selectedVolume}` : ''}`);
      const data = await response.json();
      setTestResult(data);
      
      if (!data.success) {
        setError(data.message || 'OCR test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test request failed');
    } finally {
      setLoading(false);
    }
  };

  const startProcessing = async () => {
    if (!selectedVolume) {
      setError('Please select a volume to process');
      return;
    }

    setLoading(true);
    setError(null);
    setProcessingJob(null);

    try {
      const response = await fetch('/api/ocr/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ volumeId: selectedVolume })
      });

      const data = await response.json();
      
      if (data.success) {
        setProcessingJob(data);
      } else {
        setError(data.message || 'Processing failed to start');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Home
            </Link>
            <h1 className="text-3xl font-bold">📄 OCR Administration</h1>
          </div>
          <div className="text-slate-400">
            Phase 2: Azure Document Intelligence Integration
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <h3 className="font-semibold text-red-300 mb-2">❌ Error</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Service Status */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🔧 Service Status
            </h2>
            
            {serviceInfo ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className={`font-medium ${serviceInfo.status === 'ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {serviceInfo.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Version:</span>
                  <span>{serviceInfo.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Volumes:</span>
                  <span>{serviceInfo.availableVolumes?.length || 0}</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Capabilities:</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    {serviceInfo.capabilities?.map((cap, index) => (
                      <div key={index}>✓ {cap}</div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400">Loading...</div>
            )}
          </div>

          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🎯 Quick Actions
            </h2>
            
            <div className="space-y-4">
              {serviceInfo?.availableVolumes && serviceInfo.availableVolumes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Volume:
                  </label>
                  <select 
                    value={selectedVolume}
                    onChange={(e) => setSelectedVolume(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    {serviceInfo.availableVolumes.map((volume) => (
                      <option key={volume} value={volume}>{volume}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={runOCRTest}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 
                          disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? '🔄 Testing...' : '🧪 Test OCR Service'}
              </button>

              <button
                onClick={startProcessing}
                disabled={loading || !selectedVolume}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 
                          disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? '🔄 Starting...' : '🚀 Start Volume Processing'}
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResult && testResult.success && testResult.testResult && (
          <div className="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🧪 Test Results
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-blue-400">
                  {testResult.testResult.confidence}%
                </div>
                <div className="text-sm text-slate-400">Confidence</div>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-green-400">
                  {testResult.testResult.content.textLength}
                </div>
                <div className="text-sm text-slate-400">Characters</div>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-purple-400">
                  {testResult.testResult.processingTimeMs}ms
                </div>
                <div className="text-sm text-slate-400">Processing</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-300 mb-2">📝 Text Content</h3>
                <div className="text-sm text-slate-400 mb-2">
                  Quality: {testResult.testResult.assessment.textQuality}
                </div>
                <div className="bg-slate-900 p-3 rounded text-xs text-slate-300 max-h-32 overflow-y-auto">
                  {testResult.testResult.content.textPreview}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-slate-300 mb-2">
                  📐 Mathematical Content
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Formulas:</span>
                    <span>{testResult.testResult.content.mathematicalFormulas.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Tables:</span>
                    <span>{testResult.testResult.content.tables.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Detection:</span>
                    <span className={testResult.testResult.content.mathematicalFormulas.count > 0 ? 'text-green-400' : 'text-slate-400'}>
                      {testResult.testResult.assessment.formulaDetection}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {testResult.testResult.content.mathematicalFormulas.samples.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-slate-300 mb-2">Formula Samples:</h4>
                <div className="space-y-1">
                  {testResult.testResult.content.mathematicalFormulas.samples.map((formula, index) => (
                    <div key={index} className="bg-slate-900 p-2 rounded text-xs font-mono text-green-300">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Processing Job Results */}
        {processingJob && (
          <div className="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🚀 Processing Job
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-blue-400">
                  {processingJob.progress}%
                </div>
                <div className="text-sm text-slate-400">Progress</div>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-green-400">
                  {processingJob.processedPages}
                </div>
                <div className="text-sm text-slate-400">Pages Done</div>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-2xl font-bold text-purple-400">
                  {processingJob.totalPages}
                </div>
                <div className="text-sm text-slate-400">Total Pages</div>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className={`text-2xl font-bold ${
                  processingJob.status === 'completed' ? 'text-green-400' :
                  processingJob.status === 'processing' ? 'text-blue-400' :
                  processingJob.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {processingJob.status.toUpperCase()}
                </div>
                <div className="text-sm text-slate-400">Status</div>
              </div>
            </div>

            {processingJob.results && (
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-blue-300">
                    {processingJob.results.totalFormulas}
                  </div>
                  <div className="text-sm text-slate-400">Formulas</div>
                </div>
                <div className="p-4 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-green-300">
                    {processingJob.results.totalTables}
                  </div>
                  <div className="text-sm text-slate-400">Tables</div>
                </div>
                <div className="p-4 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-purple-300">
                    {processingJob.results.avgConfidence}%
                  </div>
                  <div className="text-sm text-slate-400">Avg Confidence</div>
                </div>
                <div className="p-4 bg-slate-700 rounded">
                  <div className="text-lg font-bold text-yellow-300">
                    {Math.round(processingJob.results.textLength / 1000)}K
                  </div>
                  <div className="text-sm text-slate-400">Characters</div>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-slate-400">
              Job ID: {processingJob.jobId}
            </div>
          </div>
        )}

        {/* Available Volumes */}
        {serviceInfo?.availableVolumes && serviceInfo.availableVolumes.length > 0 && (
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📚 Available Volumes
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {serviceInfo.availableVolumes.map((volume) => (
                <div 
                  key={volume} 
                  className={`p-4 rounded border transition-colors cursor-pointer ${
                    selectedVolume === volume 
                      ? 'bg-blue-900/50 border-blue-500 text-blue-300' 
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedVolume(volume)}
                >
                  <div className="font-medium">{volume}</div>
                  <div className="text-sm text-slate-400">
                    Ready for OCR processing
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
