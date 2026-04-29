import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, UploadCloud, X, ArrowUp, ArrowDown, FileText } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const pdfs = Array.from(newFiles).filter(f => f.type === 'application/pdf').map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
    }));
    
    if (pdfs.length > 0) {
      setFiles(prev => [...prev, ...pdfs]);
      setMergedPdfUrl(null); // Reset merged output if new files are added
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setMergedPdfUrl(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
      return newFiles;
    });
    setMergedPdfUrl(null);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
      return newFiles;
    });
    setMergedPdfUrl(null);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const mergePdfs = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const f of files) {
        const arrayBuffer = await f.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error('Failed to merge PDFs:', error);
      alert('Failed to merge PDFs. Ensure files are valid and not encrypted.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">PDF Merge</h1>
            <p className="text-sm text-slate-400">Combine multiple PDF files into one clean document for sharing.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            className="border-2 border-dashed border-surface-700 rounded-xl p-10 text-center hover:border-brand-500/50 hover:bg-surface-800/30 transition cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
          >
            <input 
              type="file" 
              multiple 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <UploadCloud className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-300 font-semibold mb-2 text-lg">Click or drag PDF files here</p>
            <p className="text-sm text-slate-500">Only .pdf files are supported</p>
          </div>

          {files.length > 0 && (
            <div className="bg-surface-900 border border-surface-700 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-surface-700 flex justify-between items-center bg-surface-800/50">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Files to Merge</h2>
                <button 
                  onClick={() => setFiles([])}
                  className="text-xs text-red-400 hover:text-red-300 transition"
                >
                  Clear All
                </button>
              </div>
              <ul className="divide-y divide-surface-800">
                {files.map((file, index) => (
                  <li key={file.id} className="p-4 flex items-center gap-4 hover:bg-surface-800/30 transition">
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => moveUp(index)} 
                        disabled={index === 0}
                        className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => moveDown(index)} 
                        disabled={index === files.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-300 disabled:opacity-30 transition"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-brand-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate" title={file.name}>{file.name}</p>
                      <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
                    </div>
                    
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="p-2 text-slate-500 hover:text-red-400 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 sticky top-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Summary</h2>
            
            <dl className="space-y-4 mb-8">
              <div className="flex justify-between">
                <dt className="text-sm text-slate-400">Total Files</dt>
                <dd className="text-sm font-semibold text-slate-200">{files.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-slate-400">Est. Size</dt>
                <dd className="text-sm font-semibold text-slate-200">{formatSize(totalSize)}</dd>
              </div>
            </dl>

            <button
              onClick={mergePdfs}
              disabled={processing || files.length < 2}
              className="w-full mb-4 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-50 py-3 rounded-lg font-semibold transition"
            >
              {processing ? 'Merging...' : 'Merge PDFs'}
            </button>

            {mergedPdfUrl && (
              <div className="pt-6 border-t border-surface-700 mt-2">
                <p className="text-xs text-emerald-400 font-semibold mb-3 text-center">Merge Successful!</p>
                <a
                  href={mergedPdfUrl}
                  download="merged_document.pdf"
                  className="w-full flex justify-center items-center gap-2 bg-surface-800 hover:bg-surface-700 border border-surface-600 text-slate-200 py-3 rounded-lg font-semibold transition"
                >
                  <Download className="w-4 h-4" />
                  Download Merged PDF
                </a>
              </div>
            )}
            
            {files.length === 1 && (
              <p className="text-xs text-slate-500 mt-2 text-center">Add at least one more file to merge.</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
