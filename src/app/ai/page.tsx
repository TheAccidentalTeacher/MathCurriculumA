'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AITestResult {
  success: boolean;
  model: string;
  response?: string;
  metrics?: {
    tokens: number;
    cost: number;
    costFormatted: string;
  };
  error?: string;
  timestamp?: string;
}

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  costPer1k: {
    prompt: number;
    completion: number;
  };
  features: {
    tools: boolean;
    reasoning: boolean;
  };
  bestFor: string[];
}

interface AIServiceInfo {
  message: string;
  status: string;
  version: string;
  capabilities: {
    characters: string[];
    models: string[];
    features: string[];
  };
  models: ModelInfo[];
}

export default function AITestPage() {
  const [serviceInfo, setServiceInfo] = useState<AIServiceInfo | null>(null);
  const [testResult, setTestResult] = useState<AITestResult | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load service info on mount
  useEffect(() => {
    loadServiceInfo();
  }, []);

  const loadServiceInfo = async () => {
    try {
      const response = await fetch('/api/ai/chat');
      const data = await response.json();
      setServiceInfo(data);
      
      if (data.models?.length > 0) {
        setSelectedModel(data.models[0].id);
      }
    } catch (err) {
      setError('Failed to load AI service info');
    }
  };

  const runAITest = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: selectedModel })
      });

      const data = await response.json();
      setTestResult(data);
      
      if (!data.success) {
        setError(data.error || 'AI test failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Test request failed');
    } finally {
      setLoading(false);
    }
  };

  const getModelBadgeColor = (modelId: string) => {
    if (modelId.includes('gpt-5')) return 'bg-purple-600';
    if (modelId.includes('o1')) return 'bg-indigo-600';
    if (modelId.includes('4o')) return 'bg-blue-600';
    return 'bg-green-600';
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
            <Link href="/ocr" className="text-green-400 hover:text-green-300">
              OCR Admin →
            </Link>
            <h1 className="text-3xl font-bold">🤖 AI Tutor Test Center</h1>
          </div>
          <div className="text-slate-400">
            Phase 3: OpenAI Integration Testing
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
                  <span className="text-slate-400">Characters:</span>
                  <span>{serviceInfo.capabilities?.characters?.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Models:</span>
                  <span>{serviceInfo.capabilities?.models?.length || 0}</span>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Features:</h4>
                  <div className="text-xs text-slate-400 space-y-1">
                    {serviceInfo.capabilities?.features?.map((feature, index) => (
                      <div key={index}>✓ {feature}</div>
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
              🧪 Model Testing
            </h2>
            
            <div className="space-y-4">
              {serviceInfo?.models && serviceInfo.models.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Model:
                  </label>
                  <select 
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-white"
                  >
                    {serviceInfo.models.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={runAITest}
                disabled={loading || !selectedModel}
                className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 
                          disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {loading ? '🔄 Testing AI Connection...' : '🧪 Test AI Model'}
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className="mb-8 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🧪 Test Results
            </h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-700 rounded">
                <div className={`text-2xl font-bold ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                  {testResult.success ? '✅' : '❌'}
                </div>
                <div className="text-sm text-slate-400">Status</div>
              </div>
              <div className="p-4 bg-slate-700 rounded">
                <div className="text-lg font-bold text-blue-400">
                  {testResult.model}
                </div>
                <div className="text-sm text-slate-400">Model</div>
              </div>
              {testResult.metrics && (
                <>
                  <div className="p-4 bg-slate-700 rounded">
                    <div className="text-lg font-bold text-purple-400">
                      {testResult.metrics.tokens}
                    </div>
                    <div className="text-sm text-slate-400">Tokens</div>
                  </div>
                  <div className="p-4 bg-slate-700 rounded">
                    <div className="text-lg font-bold text-yellow-400">
                      {testResult.metrics.costFormatted}
                    </div>
                    <div className="text-sm text-slate-400">Cost</div>
                  </div>
                </>
              )}
            </div>

            {testResult.success && testResult.response && (
              <div>
                <h3 className="font-medium text-slate-300 mb-2">🤖 AI Response:</h3>
                <div className="bg-slate-900 p-4 rounded text-slate-200 border border-slate-600">
                  {testResult.response}
                </div>
              </div>
            )}

            {testResult.error && (
              <div>
                <h3 className="font-medium text-red-300 mb-2">❌ Error Details:</h3>
                <div className="bg-red-900/20 p-4 rounded text-red-200 border border-red-700">
                  {testResult.error}
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  💡 <strong>Troubleshooting:</strong>
                  <ul className="mt-2 ml-4 space-y-1">
                    <li>• Check that OPENAI_API_KEY is set in Railway environment variables</li>
                    <li>• Verify the API key has sufficient credits</li>
                    <li>• Ensure the selected model is available in your account</li>
                    <li>• Check Railway deployment logs for detailed error messages</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Available Models */}
        {serviceInfo?.models && serviceInfo.models.length > 0 && (
          <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🧠 Available AI Models
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceInfo.models.map((model) => (
                <div 
                  key={model.id} 
                  className={`p-4 rounded border transition-colors cursor-pointer ${
                    selectedModel === model.id 
                      ? 'bg-purple-900/50 border-purple-500' 
                      : 'bg-slate-700 border-slate-600 hover:border-slate-500'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getModelBadgeColor(model.id)} text-white`}>
                      {model.name}
                    </span>
                    <div className="flex gap-1">
                      {model.features.tools && <span className="text-xs">🛠️</span>}
                      {model.features.reasoning && <span className="text-xs">🧠</span>}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 mb-2">
                    {model.description}
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>Max Tokens: {model.maxTokens.toLocaleString()}</div>
                    <div>Cost: ${model.costPer1k.prompt}/$${model.costPer1k.completion} per 1K</div>
                    <div>Best for: {model.bestFor.slice(0, 2).join(', ')}</div>
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
