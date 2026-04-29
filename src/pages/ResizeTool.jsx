import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, UploadCloud, X, Lock, Unlock, CheckCircle2 } from 'lucide-react';
import Pica from 'pica';

const pica = new Pica();

const PRESETS = [
  { label: 'Avatar (256x256)', width: 256, height: 256 },
  { label: 'Dribbble (400x300)', width: 400, height: 300 },
  { label: 'HD (720p)', width: 1280, height: 720 },
  { label: 'Post (1200x630)', width: 1200, height: 630 },
  { label: 'FHD (1080p)', width: 1920, height: 1080 },
  { label: '4K (2160p)', width: 3840, height: 2160 },
];

export default function ResizeTool() {
  const [images, setImages] = useState([]);
  
  const [resizeMode, setResizeMode] = useState('dimensions'); // 'dimensions' | 'multiplier'
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(630);
  const [lockRatio, setLockRatio] = useState(true);
  const [multiplier, setMultiplier] = useState(0.5);

  const [format, setFormat] = useState('image/jpeg');
  const [quality, setQuality] = useState(0.8);
  const [processing, setProcessing] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFiles = (files) => {
    const newImages = Array.from(files).filter(f => f.type.startsWith('image/')).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      status: 'pending', // pending, processing, done, error
      resultUrl: null,
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.url) URL.revokeObjectURL(img.url);
      if (img?.resultUrl) URL.revokeObjectURL(img.resultUrl);
      return prev.filter(i => i.id !== id);
    });
  };

  const applyPreset = (preset) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const processImages = async () => {
    setProcessing(true);
    const updatedImages = [...images];

    for (let i = 0; i < updatedImages.length; i++) {
      const imgObj = updatedImages[i];
      if (imgObj.status === 'done') continue;

      imgObj.status = 'processing';
      setImages([...updatedImages]);

      try {
        const img = new Image();
        img.src = imgObj.url;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        let targetWidth = width;
        let targetHeight = height;

        if (resizeMode === 'multiplier') {
          targetWidth = Math.max(1, Math.round(img.width * multiplier));
          targetHeight = Math.max(1, Math.round(img.height * multiplier));
        } else {
          if (lockRatio) {
            const ratio = img.width / img.height;
            if (targetWidth / targetHeight > ratio) {
              targetWidth = Math.round(targetHeight * ratio);
            } else {
              targetHeight = Math.round(targetWidth / ratio);
            }
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        await pica.resize(img, canvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        });

        const blob = await pica.toBlob(canvas, format, quality);
        imgObj.resultUrl = URL.createObjectURL(blob);
        imgObj.status = 'done';
        imgObj.resultBlob = blob;
      } catch (err) {
        console.error(err);
        imgObj.status = 'error';
      }

      setImages([...updatedImages]);
    }
    setProcessing(false);
  };

  const downloadSingle = (img) => {
    if (!img.resultUrl) return;
    const a = document.createElement('a');
    a.href = img.resultUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp';
    a.download = `resized_${img.name.split('.')[0]}.${ext}`;
    a.click();
  };

  const downloadAll = () => {
    images.filter(img => img.status === 'done').forEach(img => {
      downloadSingle(img);
    });
  };

  const pendingCount = images.filter(i => i.status !== 'done').length;

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">Image Batch Resize</h1>
            <p className="text-sm text-slate-400">Batch process screenshots into consistent dimensions or scales.</p>
          </div>
        </div>
        {images.some(img => img.status === 'done') && (
          <button 
            onClick={downloadAll}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-slate-50 px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            Download All
          </button>
        )}
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1 bg-surface-900 border border-surface-700 rounded-xl p-6 flex flex-col gap-6">
          
          <div>
            <div className="flex gap-2 mb-6 bg-surface-800 p-1 rounded-lg">
              <button 
                onClick={() => setResizeMode('dimensions')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded uppercase tracking-wide transition ${resizeMode === 'dimensions' ? 'bg-brand-500 text-slate-50' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Dimensions
              </button>
              <button 
                onClick={() => setResizeMode('multiplier')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded uppercase tracking-wide transition ${resizeMode === 'multiplier' ? 'bg-brand-500 text-slate-50' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Multiplier
              </button>
            </div>

            {resizeMode === 'dimensions' ? (
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Size Presets</h2>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map(preset => (
                      <button
                        key={preset.label}
                        onClick={() => applyPreset(preset)}
                        className="px-3 py-1.5 bg-surface-800 hover:bg-surface-700 text-xs font-semibold text-slate-200 rounded-lg border border-surface-600 transition"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Custom Size</h2>
                    <button 
                      onClick={() => setLockRatio(!lockRatio)}
                      className="text-slate-400 hover:text-brand-300 p-1 rounded"
                      title={lockRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                    >
                      {lockRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Width (px)</label>
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Height (px)</label>
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Scale Factor</h2>
                <div className="grid grid-cols-3 gap-2">
                  {[0.25, 0.5, 0.75, 1.25, 1.5, 2].map(m => (
                    <button
                      key={m}
                      onClick={() => setMultiplier(m)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${multiplier === m ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'bg-surface-800 border-surface-600 text-slate-200 hover:bg-surface-700'}`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <label className="block text-xs text-slate-400 mb-1">Custom Multiplier</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-xs text-slate-500 mt-2">Example: 0.5 shrinks the image to 50% width and height.</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-2 pt-6 border-t border-surface-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Output Format</h2>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 mb-4"
            >
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>

            {(format === 'image/jpeg' || format === 'image/webp') && (
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <label>Quality</label>
                  <span>{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-brand-500"
                />
              </div>
            )}
          </div>

          <button
            onClick={processImages}
            disabled={processing || images.length === 0 || pendingCount === 0}
            className="w-full mt-auto bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-50 py-3 rounded-lg font-semibold transition flex justify-center items-center gap-2"
          >
            {processing 
              ? 'Processing...' 
              : pendingCount === 0 && images.length > 0 
                ? <><CheckCircle2 className="w-4 h-4" /> All Resized</> 
                : `Resize ${pendingCount > 0 ? pendingCount : ''} Images`}
          </button>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
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
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-semibold mb-1">Click or drag images here</p>
            <p className="text-sm text-slate-500">Supports JPG, PNG, WebP</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="relative group bg-surface-900 border border-surface-700 rounded-xl overflow-hidden aspect-square flex flex-col">
                  <button 
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 bg-surface-900/80 text-slate-300 hover:text-red-400 p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex-1 overflow-hidden relative bg-surface-950 flex items-center justify-center">
                    <img 
                      src={img.resultUrl || img.url} 
                      alt={img.name} 
                      className={`max-w-full max-h-full object-contain ${img.status === 'processing' ? 'opacity-30' : ''}`}
                    />
                    {img.status === 'processing' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {img.status === 'done' && (
                      <div className="absolute inset-0 bg-surface-900/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button 
                          onClick={() => downloadSingle(img)}
                          className="bg-brand-600 hover:bg-brand-500 text-white rounded-full p-3 shadow-lg transform hover:scale-110 transition"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5 flex flex-col gap-1 border-t border-surface-700 bg-surface-800">
                    <span className="block text-xs truncate text-slate-300 font-medium" title={img.name}>{img.name}</span>
                    <div className="flex items-center justify-between text-[11px]">
                      {img.status === 'done' ? (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : img.status === 'error' ? (
                        <span className="text-red-400 font-semibold">Failed</span>
                      ) : img.status === 'processing' ? (
                        <span className="text-brand-300 font-semibold">Resizing...</span>
                      ) : (
                        <span className="text-slate-500 font-semibold">Ready</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
