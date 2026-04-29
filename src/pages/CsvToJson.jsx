import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, UploadCloud, Copy, Check, Trash2 } from 'lucide-react';
import Papa from 'papaparse';

export default function CsvToJson() {
  const [csvInput, setCsvInput] = useState('');
  const [fileName, setFileName] = useState(null);
  const [delimiter, setDelimiter] = useState('auto');
  const [hasHeader, setHasHeader] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file || !file.name.endsWith('.csv')) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvInput(e.target.result);
    };
    reader.readAsText(file);
  };

  const parseResult = useMemo(() => {
    if (!csvInput.trim()) return { data: null, error: null, meta: null };
    
    const result = Papa.parse(csvInput.trim(), {
      header: hasHeader,
      delimiter: delimiter === 'auto' ? '' : delimiter,
      skipEmptyLines: true,
    });
    
    return {
      data: result.data,
      error: result.errors.length > 0 ? result.errors : null,
      meta: result.meta
    };
  }, [csvInput, delimiter, hasHeader]);

  const jsonOutput = useMemo(() => {
    if (!parseResult.data) return '';
    return JSON.stringify(parseResult.data, null, 2);
  }, [parseResult.data]);

  const copyJson = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? fileName.replace('.csv', '.json') : 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setCsvInput('');
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">CSV to JSON</h1>
            <p className="text-sm text-slate-400">Convert spreadsheet exports into clean JSON for APIs and prototyping.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={copyJson}
            disabled={!jsonOutput}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 disabled:opacity-50 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button 
            onClick={downloadJson}
            disabled={!jsonOutput}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-slate-50 px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-4">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasHeader} 
                  onChange={(e) => setHasHeader(e.target.checked)}
                  className="rounded border-surface-600 text-brand-500 bg-surface-800"
                />
                <span className="text-sm font-semibold text-slate-300">First row is header</span>
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-400">Delimiter:</span>
                <select 
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="bg-surface-800 border border-surface-600 rounded-lg px-2 py-1 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="auto">Auto-detect</option>
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab (\t)</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </div>
            </div>
            
            {fileName && (
              <button onClick={clearAll} className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {!fileName && (
            <div 
              className="border-2 border-dashed border-surface-700 rounded-xl p-8 text-center hover:border-brand-500/50 hover:bg-surface-800/30 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFiles(e.dataTransfer.files);
              }}
            >
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <UploadCloud className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-semibold text-sm">Click or drag a CSV file here</p>
              <p className="text-xs text-slate-500 mt-1">Or paste data below</p>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-2 min-h-[300px]">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                {fileName ? `File: ${fileName}` : 'CSV Input'}
              </h2>
            </div>
            <textarea
              value={csvInput}
              onChange={(e) => {
                setCsvInput(e.target.value);
                if (fileName) setFileName(null);
              }}
              className="w-full flex-1 bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none"
              placeholder="id,name,email&#10;1,Alice,alice@example.com&#10;2,Bob,bob@example.com"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 min-h-[400px]">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">JSON Output</h2>
            {parseResult.data && (
              <span className="text-xs bg-surface-800 text-slate-300 px-2 py-1 rounded">
                {parseResult.data.length} row{parseResult.data.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="relative flex-1">
            <textarea
              readOnly
              value={jsonOutput}
              className={`w-full h-full bg-surface-900/50 border ${parseResult.error ? 'border-amber-500/50' : 'border-surface-700'} rounded-xl p-4 font-mono text-sm text-slate-200 outline-none resize-none`}
              placeholder="JSON will appear here..."
            />
            {parseResult.error && (
              <div className="absolute bottom-4 right-4 max-w-sm bg-surface-800 border border-amber-500/50 rounded-lg p-3 shadow-lg">
                <p className="text-xs font-semibold text-amber-400 mb-1">Parsing Warnings</p>
                <ul className="text-xs text-slate-300 space-y-1 max-h-32 overflow-y-auto">
                  {parseResult.error.map((err, i) => (
                    <li key={i}>Row {err.row}: {err.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
