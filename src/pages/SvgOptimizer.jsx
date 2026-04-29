import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, Info } from 'lucide-react';
import { optimize } from 'svgo';

const DEFAULT_SVG = `<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- Exported by Some Tool v1.0.0 -->
  <defs>
    <style>
      .cls-1 { fill: #0891b2; }
      .cls-2 { fill: #22d3ee; }
    </style>
  </defs>
  <g id="Layer_1" data-name="Layer 1">
    <circle class="cls-1" cx="100.12345" cy="100.12345" r="80.12345"/>
    <path class="cls-2" d="M100.12345,20.12345c44.12345,0,80.12345,35.12345,80.12345,80.12345H20.12345C20.12345,55.12345,55.12345,20.12345,100.12345,20.12345Z"/>
  </g>
</svg>`;

export default function SvgOptimizer() {
  const [inputSvg, setInputSvg] = useState(DEFAULT_SVG);
  const [outputSvg, setOutputSvg] = useState('');
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputSvg.trim()) {
      setOutputSvg('');
      setStats(null);
      setError(null);
      return;
    }

    try {
      const result = optimize(inputSvg, {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
          'removeDimensions',
          'sortAttrs',
        ],
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setOutputSvg(result.data);
      
      const inSize = new Blob([inputSvg]).size;
      const outSize = new Blob([result.data]).size;
      const saved = inSize > 0 ? ((inSize - outSize) / inSize) * 100 : 0;
      
      setStats({
        in: (inSize / 1024).toFixed(2),
        out: (outSize / 1024).toFixed(2),
        saved: saved.toFixed(1)
      });
      setError(null);
    } catch (err) {
      setError('Invalid SVG or optimization failed.');
      setOutputSvg('');
      setStats(null);
    }
  }, [inputSvg]);

  const copySvg = () => {
    if (!outputSvg) return;
    navigator.clipboard.writeText(outputSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    if (!outputSvg) return;
    const blob = new Blob([outputSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6 flex flex-col">
      <header className="max-w-7xl mx-auto w-full mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">SVG Optimizer</h1>
            <p className="text-sm text-slate-400">Clean, minify, and strip metadata from bloated SVG files.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={copySvg}
            disabled={!outputSvg}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 disabled:opacity-50 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy SVG'}
          </button>
          <button 
            onClick={downloadSvg}
            disabled={!outputSvg}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-slate-50 px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        <div className="flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Raw Input SVG</h2>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center gap-1 text-brand-400 hover:text-brand-300 transition"
            >
              <UploadCloud className="w-4 h-4" /> Upload File
            </button>
            <input 
              type="file" 
              accept=".svg" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </div>
          
          <div className="relative flex-1">
            <textarea
              value={inputSvg}
              onChange={(e) => setInputSvg(e.target.value)}
              className={`w-full h-full bg-surface-900 border ${error ? 'border-red-500/50' : 'border-surface-700'} rounded-xl p-4 font-mono text-sm focus:border-brand-500 outline-none resize-none`}
              placeholder="Paste raw SVG code here..."
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
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Optimized Output</h2>
            {stats && (
              <div className="flex items-center gap-4 text-xs font-mono bg-surface-800 px-3 py-1 rounded-full border border-surface-700">
                <span className="text-slate-400">{stats.in} KB &rarr; <span className="text-slate-200">{stats.out} KB</span></span>
                <span className="text-emerald-400 font-semibold">Saved {stats.saved}%</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col gap-4 min-h-0">
            <textarea
              readOnly
              value={outputSvg}
              className="w-full h-2/3 bg-surface-900/50 border border-surface-700 rounded-xl p-4 font-mono text-sm text-brand-300 outline-none resize-none"
              placeholder="Optimized SVG code will appear here..."
            />
            <div className="flex-1 bg-white border border-surface-700 rounded-xl overflow-hidden flex items-center justify-center p-4 relative checker-bg">
               <style>{`.checker-bg { background-image: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; }`}</style>
               {outputSvg ? (
                 <div dangerouslySetInnerHTML={{ __html: outputSvg }} className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full" />
               ) : (
                 <div className="text-slate-400 flex items-center gap-2 bg-surface-950 p-2 rounded">
                   <Info className="w-4 h-4" /> No valid SVG to preview
                 </div>
               )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
