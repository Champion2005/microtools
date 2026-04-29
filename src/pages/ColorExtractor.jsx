import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Copy, Droplet } from 'lucide-react';

// Basic utility to convert RGB to HEX
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

// Basic luminance for WCAG contrast
const getLuminance = (r, g, b) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Contrast ratio
const getContrast = (lum1, lum2) => {
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

export default function ColorExtractor() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colors, setColors] = useState([]);
  const canvasRef = useRef(null);

  const extractColors = useCallback((imgElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const colorCounts = {};
      const snap = 16; // round values to group similar colors
      
      for (let i = 0; i < imgData.length; i += 4 * 10) { // check every 10th pixel for speed
        const r = Math.round(imgData[i] / snap) * snap;
        const g = Math.round(imgData[i+1] / snap) * snap;
        const b = Math.round(imgData[i+2] / snap) * snap;
        const alpha = imgData[i+3];
        if (alpha < 200) continue; // skip transparent
        
        const key = `${r},${g},${b}`;
        colorCounts[key] = (colorCounts[key] || 0) + 1;
      }
      
      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
      
      const extracted = sorted.map(([k, count]) => {
        const [r, g, b] = k.split(',').map(Number);
        const hex = rgbToHex(r, g, b);
        const lum = getLuminance(r, g, b);
        const contrastWhite = getContrast(lum, 1).toFixed(2);
        const contrastBlack = getContrast(lum, 0).toFixed(2);
        return { hex, r, g, b, contrastWhite, contrastBlack, count };
      });
      
      setColors(extracted);
    } catch(err) {
      console.error(err);
    }
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    
    const img = new Image();
    img.src = url;
    img.onload = () => extractColors(img);
  };

  const cssVariables = colors.map((c, i) => `--color-${i+1}: ${c.hex};`).join('\n');

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">Color Palette Extractor</h1>
            <p className="text-sm text-slate-400">Extract colors and check WCAG contrast.</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
           <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 flex flex-col">
              <label className="text-sm font-semibold text-slate-400 mb-3 block uppercase tracking-wider">Upload Reference Image</label>
              
              <div className="relative group border-2 border-dashed border-surface-700 hover:border-brand-500 rounded-xl overflow-hidden bg-surface-950 transition flex items-center justify-center min-h-[300px]">
                {imageSrc ? (
                    <img src={imageSrc} alt="uploaded" className="object-contain max-h-[300px]" />
                ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <ImageIcon className="w-10 h-10 mb-2 opacity-50"/>
                      <span>Click to upload image</span>
                    </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />
           </div>
           
           {colors.length > 0 && (
             <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
               <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                 <Copy className="w-4 h-4"/> CSS Output
               </h2>
               <pre className="bg-surface-950 p-4 rounded-lg font-mono text-sm text-brand-300 overflow-x-auto">
{`:root {\n${cssVariables}\n}`}
               </pre>
             </div>
           )}
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Droplet className="w-4 h-4"/> Extracted Palette
              </h2>
              {colors.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                   {colors.map((c, idx) => (
                     <div key={idx} className="flex gap-4 items-center bg-surface-950 p-3 rounded-lg border border-surface-800">
                        <div className="w-16 h-16 rounded-lg pointer-events-none shadow-inner" style={{backgroundColor: c.hex}}></div>
                        <div className="flex-1">
                          <div className="font-mono text-slate-200 font-bold mb-1">{c.hex.toUpperCase()}</div>
                          <div className="text-xs text-slate-500 mb-1">RGB: {c.r}, {c.g}, {c.b}</div>
                        </div>
                        <div className="text-xs flex flex-col gap-1 items-end">
                           <span className={c.contrastWhite >= 4.5 ? 'text-green-400' : 'text-red-400'}>
                             White text: {c.contrastWhite}:1
                           </span>
                           <span className={c.contrastBlack >= 4.5 ? 'text-green-400' : 'text-red-400'}>
                             Black text: {c.contrastBlack}:1
                           </span>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <p className="text-slate-500 italic text-sm">Upload an image to see its colors.</p>
              )}
           </div>
        </div>
      </main>
    </div>
  );
}
