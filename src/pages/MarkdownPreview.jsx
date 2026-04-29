import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, FileCode2, FileType2 } from 'lucide-react';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const DEFAULT_MARKDOWN = `# Markdown Preview

Write markdown on the left, and see the rendered output on the right.

## Features Supported
- **Bold** and *italic* text
- Lists (ordered and unordered)
- [Links](https://example.com)
- \`Inline code\` and fenced code blocks
- Blockquotes

> This is a sample blockquote.

### Code Example
\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Row 1    | Data A   |
| Row 2    | Data B   |
`;

export default function MarkdownPreview() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [wrapText, setWrapText] = useState(true);

  const previewRef = useRef(null);

  const htmlOutput = useMemo(() => {
    const rawHtml = md.render(markdown);
    return DOMPurify.sanitize(rawHtml);
  }, [markdown]);

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdown);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlOutput);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
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
            <h1 className="text-2xl font-display font-semibold text-slate-50">Markdown Preview</h1>
            <p className="text-sm text-slate-400">Write markdown and instantly preview formatted output before publishing.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={copyMarkdown}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-slate-200 px-3 py-2 rounded-lg text-sm transition"
          >
            {copiedMd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            Copy MD
          </button>
          <button 
            onClick={copyHtml}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 text-slate-200 px-3 py-2 rounded-lg text-sm transition"
          >
            {copiedHtml ? <Check className="w-4 h-4 text-emerald-400" /> : <FileCode2 className="w-4 h-4" />}
            Copy HTML
          </button>
          <button 
            onClick={downloadMarkdown}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-slate-50 px-3 py-2 rounded-lg text-sm transition"
          >
            <Download className="w-4 h-4" />
            Save .md
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        <div className="flex flex-col gap-2 h-full">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileType2 className="w-4 h-4" /> Markdown Source
            </h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={wrapText} 
                onChange={(e) => setWrapText(e.target.checked)}
                className="rounded border-surface-600 text-brand-500 bg-surface-800"
              />
              <span className="text-xs text-slate-400">Word Wrap</span>
            </label>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className={`w-full flex-1 bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none ${wrapText ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}
            placeholder="Type your markdown here..."
            spellCheck="false"
          />
        </div>

        <div className="flex flex-col gap-2 h-full">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" /> Live Preview
            </h2>
          </div>
          <div 
            ref={previewRef}
            className="w-full flex-1 bg-white border border-surface-700 rounded-xl p-6 overflow-y-auto text-slate-900 prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlOutput || '<p class="text-slate-400 italic">Preview will appear here...</p>' }}
          />
        </div>

      </main>
    </div>
  );
}
