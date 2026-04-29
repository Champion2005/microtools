import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, RotateCcw } from 'lucide-react';
import { capitalize } from 'lodash-es';

function normalizePunctuation(str) {
  return str
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/…/g, "...")
    .replace(/–/g, "-")
    .replace(/—/g, "-");
}

function collapseSpaces(str) {
  return str.replace(/[ \t]+/g, ' ');
}

function removeDuplicateBlankLines(str) {
  return str.replace(/\n\s*\n\s*\n/g, '\n\n');
}

function sentenceCase(str) {
  return str.split(/([.!?]\s+)/).map(part => {
    // Check if it's just punctuation/spaces
    if (/^[.!?]\s+$/.test(part)) return part;
    return capitalize(part);
  }).join('');
}

export default function TextCleanup() {
  const [input, setInput] = useState('This  is   some noisy text...\n\n\nIt has  weird   spacing. and “smart quotes”!\n\n\n\nWhat   do you think?');
  const [options, setOptions] = useState({
    trimLines: true,
    collapseSpaces: true,
    normalizePunctuation: true,
    removeBlankLines: true,
    sentenceCase: false,
  });
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    let result = input;
    if (!result) return '';

    if (options.normalizePunctuation) {
      result = normalizePunctuation(result);
    }
    
    if (options.collapseSpaces) {
      // Apply space collapse per line so we don't destroy newlines
      result = result.split('\n').map(collapseSpaces).join('\n');
    }

    if (options.trimLines) {
      result = result.split('\n').map(line => line.trim()).join('\n');
    }

    if (options.removeBlankLines) {
      result = removeDuplicateBlankLines(result);
    }

    if (options.sentenceCase) {
      result = result.split('\n').map(sentenceCase).join('\n');
    }

    return result;
  }, [input, options]);

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionChange = (key) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">Text Cleanup Pad</h1>
            <p className="text-sm text-slate-400">Clean pasted notes by normalizing punctuation, spacing, and casing.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setInput('')}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button 
            onClick={copyOutput}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-slate-50 px-4 py-2 rounded-lg transition"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Result'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 bg-surface-900 border border-surface-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Cleanup Options</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.trimLines} 
                onChange={() => handleOptionChange('trimLines')}
                className="w-5 h-5 rounded border-surface-600 text-brand-500 focus:ring-brand-500 bg-surface-800"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition">Trim Lines</div>
                <div className="text-xs text-slate-400">Remove leading and trailing spaces on each line</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.collapseSpaces} 
                onChange={() => handleOptionChange('collapseSpaces')}
                className="w-5 h-5 rounded border-surface-600 text-brand-500 focus:ring-brand-500 bg-surface-800"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition">Collapse Spaces</div>
                <div className="text-xs text-slate-400">Replace multiple spaces or tabs with a single space</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.normalizePunctuation} 
                onChange={() => handleOptionChange('normalizePunctuation')}
                className="w-5 h-5 rounded border-surface-600 text-brand-500 focus:ring-brand-500 bg-surface-800"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition">Normalize Punctuation</div>
                <div className="text-xs text-slate-400">Convert smart quotes to straight quotes, em-dashes to hyphens</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.removeBlankLines} 
                onChange={() => handleOptionChange('removeBlankLines')}
                className="w-5 h-5 rounded border-surface-600 text-brand-500 focus:ring-brand-500 bg-surface-800"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition">Remove Duplicate Blank Lines</div>
                <div className="text-xs text-slate-400">Collapse 3 or more consecutive newlines into 2</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.sentenceCase} 
                onChange={() => handleOptionChange('sentenceCase')}
                className="w-5 h-5 rounded border-surface-600 text-brand-500 focus:ring-brand-500 bg-surface-800"
              />
              <div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-brand-300 transition">Sentence Case (Optional)</div>
                <div className="text-xs text-slate-400">Capitalize the first letter of each sentence</div>
              </div>
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Input Text</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-48 bg-surface-900 border border-surface-700 rounded-xl p-4 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none"
              placeholder="Paste noisy text here..."
            />
          </div>
          
          <div className="flex flex-col gap-2 flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Cleaned Output</h2>
            <textarea
              readOnly
              value={output}
              className="w-full h-48 bg-surface-800/50 border border-surface-700 rounded-xl p-4 text-sm text-slate-200 outline-none resize-none"
              placeholder="Cleaned text will appear here..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
