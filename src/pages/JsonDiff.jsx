import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as jsondiffpatch from 'jsondiffpatch';
import { ArrowLeft, Check, Copy } from 'lucide-react';

const differ = jsondiffpatch.create({
  objectHash: function(obj) {
    return obj.id || obj._id || obj.name || JSON.stringify(obj);
  }
});

function parseJson(str) {
  try {
    return { data: JSON.parse(str), error: null };
  } catch (err) {
    return { data: null, error: err.message };
  }
}

function traverseDelta(delta, path = '', stats = { added: 0, removed: 0, changed: 0 }, changes = []) {
  if (!delta) return { stats, changes };

  if (Array.isArray(delta)) {
    if (delta.length === 1) {
      stats.added++;
      changes.push({ type: 'added', path, value: delta[0] });
    } else if (delta.length === 2) {
      stats.changed++;
      changes.push({ type: 'changed', path, oldValue: delta[0], newValue: delta[1] });
    } else if (delta.length === 3 && delta[2] === 0) {
      stats.removed++;
      changes.push({ type: 'removed', path, value: delta[0] });
    } else if (delta.length === 3 && delta[2] === 2) {
      // text diff, ignore for now or treat as changed
      stats.changed++;
      changes.push({ type: 'changed', path, textDiff: true });
    }
  } else if (typeof delta === 'object') {
    for (const key in delta) {
      if (key === '_t') continue;
      
      const newPath = path ? (Array.isArray(delta) ? `${path}[${key}]` : `${path}.${key}`) : key;
      // Handle array move/insert/delete which might have different keys in jsondiffpatch
      // like _0, _1 for removed/moved. Let's just do basic parsing.
      if (key.startsWith('_') && !key.startsWith('_t')) {
         const actualKey = key.substring(1);
         const subPath = path ? `${path}[${actualKey}]` : actualKey;
         traverseDelta(delta[key], subPath, stats, changes);
      } else {
         traverseDelta(delta[key], newPath, stats, changes);
      }
    }
  }
  return { stats, changes };
}

export default function JsonDiff() {
  const [leftInput, setLeftInput] = useState('{\n  "name": "Project",\n  "version": "1.0.0"\n}');
  const [rightInput, setRightInput] = useState('{\n  "name": "Project",\n  "version": "1.1.0",\n  "author": "Admin"\n}');
  const [copied, setCopied] = useState(false);

  const leftObj = useMemo(() => parseJson(leftInput), [leftInput]);
  const rightObj = useMemo(() => parseJson(rightInput), [rightInput]);

  const diffResult = useMemo(() => {
    if (leftObj.error || rightObj.error || !leftObj.data || !rightObj.data) {
      return null;
    }
    const delta = differ.diff(leftObj.data, rightObj.data);
    return traverseDelta(delta);
  }, [leftObj, rightObj]);

  const copySummary = () => {
    if (!diffResult) return;
    const summary = `Changes Summary:\nAdded: ${diffResult.stats.added}\nRemoved: ${diffResult.stats.removed}\nChanged: ${diffResult.stats.changed}\n\nDetails:\n` + 
      diffResult.changes.map(c => `- [${c.type.toUpperCase()}] ${c.path}`).join('\n');
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">JSON Diff</h1>
            <p className="text-sm text-slate-400">Compare two JSON payloads and surface missing keys, type mismatches, and schema drift.</p>
          </div>
        </div>
        {diffResult && (
          <button 
            onClick={copySummary}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Summary'}
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Original JSON</h2>
            {leftObj.error && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">{leftObj.error}</span>}
          </div>
          <textarea
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value)}
            className="w-full h-96 bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none"
            placeholder="Paste original JSON here..."
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Modified JSON</h2>
            {rightObj.error && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">{rightObj.error}</span>}
          </div>
          <textarea
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value)}
            className="w-full h-96 bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none"
            placeholder="Paste modified JSON here..."
          />
        </div>

        <div className="lg:col-span-2 bg-surface-900 border border-surface-700 rounded-xl p-6 mt-4">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Differences</h2>
          {!leftObj.error && !rightObj.error && !diffResult?.changes.length && (
             <p className="text-slate-400">No differences found. The JSON objects are identical.</p>
          )}
          {leftObj.error || rightObj.error ? (
            <p className="text-slate-400">Fix JSON syntax errors to see differences.</p>
          ) : diffResult?.changes.length > 0 && (
            <div>
              <div className="flex gap-4 mb-6">
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg text-sm">
                  <span className="font-bold">{diffResult.stats.added}</span> Added
                </div>
                <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm">
                  <span className="font-bold">{diffResult.stats.removed}</span> Removed
                </div>
                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-lg text-sm">
                  <span className="font-bold">{diffResult.stats.changed}</span> Changed
                </div>
              </div>
              <ul className="space-y-3 font-mono text-sm">
                {diffResult.changes.map((change, idx) => (
                  <li key={idx} className="flex gap-3 bg-surface-800 p-3 rounded-lg border border-surface-700 overflow-x-auto">
                    {change.type === 'added' && (
                      <span className="text-emerald-400 font-bold shrink-0">+ {change.path}</span>
                    )}
                    {change.type === 'removed' && (
                      <span className="text-red-400 font-bold shrink-0">- {change.path}</span>
                    )}
                    {change.type === 'changed' && (
                      <span className="text-amber-400 font-bold shrink-0">~ {change.path}</span>
                    )}
                    <span className="text-slate-500">
                      {change.type === 'added' && JSON.stringify(change.value)}
                      {change.type === 'removed' && JSON.stringify(change.value)}
                      {change.type === 'changed' && (
                        <span>
                          <span className="line-through text-red-300/70">{JSON.stringify(change.oldValue)}</span>
                          <span className="mx-2 text-slate-400">→</span>
                          <span className="text-emerald-300">{JSON.stringify(change.newValue)}</span>
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
