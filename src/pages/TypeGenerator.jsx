import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, FileCode2 } from 'lucide-react';
import { quicktype, InputData, jsonInputForTargetLanguage } from 'quicktype-core';

export default function TypeGenerator() {
  const [jsonInput, setJsonInput] = useState('{\n  "id": 1,\n  "name": "Jane Doe",\n  "isActive": true,\n  "tags": ["admin", "staff"],\n  "address": {\n    "street": "123 Main St",\n    "city": "Metropolis"\n  }\n}');
  const [outputCode, setOutputCode] = useState('');
  const [language, setLanguage] = useState('typescript');
  const [rootName, setRootName] = useState('User');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function generateTypes() {
      if (!jsonInput.trim()) {
        setOutputCode('');
        setError(null);
        return;
      }
      
      setIsGenerating(true);
      setError(null);
      
      try {
        // Validate JSON first
        JSON.parse(jsonInput);
        
        const jsonInputForTarget = await jsonInputForTargetLanguage(language);
        await jsonInputForTarget.addSource({
          name: rootName || 'Root',
          samples: [jsonInput]
        });

        const inputData = new InputData();
        inputData.addInput(jsonInputForTarget);

        const result = await quicktype({
          inputData,
          lang: language,
          rendererOptions: {
            'just-types': 'true',
            'acronym-style': 'original'
          }
        });

        setOutputCode(result.lines.join('\n'));
      } catch (err) {
        setError(err.message || 'Invalid JSON or generation error');
      } finally {
        setIsGenerating(false);
      }
    }

    const timer = setTimeout(() => {
      generateTypes();
    }, 500);

    return () => clearTimeout(timer);
  }, [jsonInput, language, rootName]);

  const copyCode = () => {
    if (!outputCode) return;
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6 flex flex-col">
      <header className="max-w-7xl mx-auto w-full mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">Type Generator</h1>
            <p className="text-sm text-slate-400">Instantly convert JSON into strict, production-ready types or structs.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={copyCode}
            disabled={!outputCode}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-slate-50 px-4 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Types'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        <div className="flex flex-col gap-4 h-full">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-brand-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Raw JSON</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400">Root Name:</span>
              <input 
                type="text" 
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="w-32 bg-surface-800 border border-surface-600 rounded-lg px-3 py-1 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                placeholder="Root"
              />
            </div>
          </div>
          
          <div className="relative flex-1">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className={`w-full h-full bg-surface-900 border ${error ? 'border-red-500/50' : 'border-surface-700'} rounded-xl p-4 font-mono text-sm focus:border-brand-500 outline-none resize-none`}
              placeholder="Paste raw JSON here..."
              spellCheck="false"
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-4 flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Generated Code</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-surface-800 border border-surface-600 rounded-lg px-3 py-1 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="typescript">TypeScript</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="csharp">Java / C#</option>
              <option value="swift">Swift</option>
            </select>
          </div>
          
          <div className="relative flex-1">
            <textarea
              readOnly
              value={outputCode}
              className="w-full h-full bg-surface-900/50 border border-surface-700 rounded-xl p-4 font-mono text-sm text-brand-300 outline-none resize-none"
              placeholder="Generated types will appear here..."
            />
            {isGenerating && (
              <div className="absolute inset-0 bg-surface-950/50 flex items-center justify-center rounded-xl">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
