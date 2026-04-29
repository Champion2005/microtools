import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, XCircle } from 'lucide-react';

const CHEAT_SHEET = [
  { label: 'Email', source: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
  { label: 'URL', source: '^(https?:\\/\\/)?([\\w.-]+)\\.([a-z\\.]{2,6})([\\/\\w .-]*)*\\/?$' },
  { label: 'IPv4', source: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$' },
  { label: 'Hex Color', source: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$' }
];

export default function RegexPlayground() {
  const [pattern, setPattern] = useState('([A-Z])\\w+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello world. This is a Test String.');
  const [copied, setCopied] = useState(false);

  const { error, matches } = useMemo(() => {
    if (!pattern) return { error: null, matches: [] };
    try {
      const regex = new RegExp(pattern, flags);
      const results = [];
      let match;
      if (regex.global) {
        while ((match = regex.exec(testString)) !== null) {
          results.push(match);
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) results.push(match);
      }
      return { error: null, matches: results };
    } catch (err) {
      return { error: err.message, matches: [] };
    }
  }, [pattern, flags, testString]);

  const copyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">RegEx Playground</h1>
            <p className="text-sm text-slate-400">Test patterns and extract groups.</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
            <div className="flex gap-2">
              <div className="flex flex-1 items-center bg-surface-950 border border-surface-700 rounded-lg focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition px-3">
                <span className="text-slate-500 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  className="flex-1 bg-transparent border-none text-slate-50 font-mono outline-none pt-3 pb-3 px-2"
                  placeholder="pattern"
                />
                <span className="text-slate-500 font-mono text-lg">/</span>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  className="w-16 bg-transparent border-none text-brand-400 font-mono outline-none py-3 text-center"
                  placeholder="gmi"
                />
              </div>
              <button onClick={copyRegex} className="bg-brand-600 hover:bg-brand-500 text-white px-4 rounded-lg text-sm font-semibold transition">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><XCircle className="w-4 h-4"/> {error}</p>}
          </div>

          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 flex-1 flex flex-col">
            <label className="text-sm font-semibold text-slate-400 mb-3 block uppercase tracking-wider">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full bg-surface-950 border border-surface-700 rounded-lg p-4 font-mono text-slate-300 focus:outline-none focus:border-brand-500 min-h-[200px] resize-y"
              placeholder="Paste text here to match against..."
            />
          </div>

          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-400 mb-4 block uppercase tracking-wider flex items-center gap-2">
              <Search className="w-4 h-4"/> Matches ({matches.length})
            </h2>
            {matches.length > 0 ? (
              <div className="flex flex-col gap-3">
                {matches.map((m, i) => (
                  <div key={i} className="bg-surface-950 border border-surface-800 rounded-lg p-3">
                    <span className="text-brand-300 font-mono font-bold bg-brand-500/10 px-2 py-1 rounded inline-block mb-2">Match {i + 1}</span>
                    <p className="text-slate-200 font-mono break-all">{m[0]}</p>
                    {m.length > 1 && (
                      <div className="mt-2 pt-2 border-t border-surface-800">
                        <span className="text-xs text-slate-500 font-semibold mb-1 block">Groups:</span>
                        {m.slice(1).map((g, gi) => (
                           <div key={gi} className="text-sm font-mono text-slate-400"><span className="text-brand-400">$(gi+1)</span>: {g}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-slate-500 text-sm italic">No matches found.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
             <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Cheat Sheet</h2>
             <div className="flex flex-col gap-2">
               {CHEAT_SHEET.map(item => (
                 <button
                   key={item.label}
                   onClick={() => setPattern(item.source)}
                   className="flex flex-col items-start p-3 bg-surface-950 border border-surface-800 rounded-lg hover:border-brand-500 transition text-left group"
                 >
                   <span className="text-sm font-semibold text-slate-200 mb-1">{item.label}</span>
                   <span className="font-mono text-xs text-brand-400 truncate w-full">{item.source}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
