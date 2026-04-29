import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

export default function QrGenerator() {
  const [template, setTemplate] = useState('url');
  
  // Form fields based on template
  const [url, setUrl] = useState('https://example.com');
  const [text, setText] = useState('Hello, World!');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);
  
  // vCard fields
  const [vcName, setVcName] = useState('');
  const [vcPhone, setVcPhone] = useState('');
  const [vcEmail, setVcEmail] = useState('');
  const [vcCompany, setVcCompany] = useState('');
  
  // Output configuration
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(4);
  const [colorLight, setColorLight] = useState('#ffffff');
  const [colorDark, setColorDark] = useState('#000000');
  
  const [payload, setPayload] = useState('');
  const [svgOutput, setSvgOutput] = useState('');
  const [pngOutput, setPngOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef(null);

  useEffect(() => {
    let newPayload = '';
    if (template === 'url') {
      newPayload = url;
    } else if (template === 'text') {
      newPayload = text;
    } else if (template === 'wifi') {
      newPayload = `WIFI:T:${wifiType};S:${wifiSsid};P:${wifiPassword};H:${wifiHidden ? 'true' : 'false'};;`;
    } else if (template === 'vcard') {
      newPayload = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcName}\nTEL:${vcPhone}\nEMAIL:${vcEmail}\nORG:${vcCompany}\nEND:VCARD`;
    }
    setPayload(newPayload);
  }, [template, url, text, wifiSsid, wifiPassword, wifiType, wifiHidden, vcName, vcPhone, vcEmail, vcCompany]);

  useEffect(() => {
    if (!payload) {
      setSvgOutput('');
      setPngOutput('');
      return;
    }

    const opts = {
      errorCorrectionLevel: errorCorrection,
      margin: margin,
      color: {
        dark: colorDark,
        light: colorLight,
      }
    };

    // Generate SVG
    QRCode.toString(payload, { ...opts, type: 'svg' }, (err, string) => {
      if (err) console.error(err);
      else setSvgOutput(string);
    });

    // Generate PNG
    QRCode.toDataURL(payload, { ...opts, width: size }, (err, url) => {
      if (err) console.error(err);
      else setPngOutput(url);
    });
  }, [payload, errorCorrection, size, margin, colorDark, colorLight]);

  const copyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (type) => {
    const a = document.createElement('a');
    if (type === 'png') {
      a.href = pngOutput;
      a.download = 'qrcode.png';
    } else if (type === 'svg') {
      const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
      a.href = URL.createObjectURL(blob);
      a.download = 'qrcode.svg';
    }
    a.click();
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">QR Generator</h1>
            <p className="text-sm text-slate-400">Create high-quality QR codes for links, Wi-Fi, and contacts.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Content</h2>
            
            <div className="flex gap-2 mb-6 bg-surface-800 p-1 rounded-lg">
              {['url', 'text', 'wifi', 'vcard'].map(t => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded uppercase tracking-wide transition ${
                    template === t ? 'bg-brand-500 text-slate-50' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {template === 'url' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Website URL</label>
                  <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                </div>
              )}
              {template === 'text' && (
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Plain Text</label>
                  <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 resize-none" />
                </div>
              )}
              {template === 'wifi' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Network Name (SSID)</label>
                    <input type="text" value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Password</label>
                    <input type="password" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs text-slate-400 mb-1">Encryption</label>
                      <select value={wifiType} onChange={(e) => setWifiType(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500">
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">None</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer pt-5">
                      <input type="checkbox" checked={wifiHidden} onChange={(e) => setWifiHidden(e.target.checked)} className="rounded border-surface-600 text-brand-500 bg-surface-800" />
                      <span className="text-sm text-slate-300">Hidden Network</span>
                    </label>
                  </div>
                </>
              )}
              {template === 'vcard' && (
                <>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Full Name</label>
                    <input type="text" value={vcName} onChange={(e) => setVcName(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Phone</label>
                    <input type="tel" value={vcPhone} onChange={(e) => setVcPhone(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email</label>
                    <input type="email" value={vcEmail} onChange={(e) => setVcEmail(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Company</label>
                    <input type="text" value={vcCompany} onChange={(e) => setVcCompany(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-surface-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Payload</h3>
                <button onClick={copyPayload} className="text-brand-400 hover:text-brand-300 text-xs flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="bg-surface-950 p-3 rounded-lg text-xs font-mono text-slate-500 break-all border border-surface-800">
                {payload || 'No payload generated'}
              </div>
            </div>
          </div>

          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Design Options</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Error Correction Level</label>
                <select value={errorCorrection} onChange={(e) => setErrorCorrection(e.target.value)} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500">
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">Higher levels make the code denser but more resilient to damage.</p>
              </div>
              
              <div>
                <label className="block text-xs text-slate-400 mb-1">Output Size (px)</label>
                <input type="number" min="100" max="2000" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Margin (blocks)</label>
                <input type="number" min="0" max="10" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Foreground</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={colorDark} onChange={(e) => setColorDark(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <span className="text-xs text-slate-300 font-mono">{colorDark}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Background</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={colorLight} onChange={(e) => setColorLight(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                    <span className="text-xs text-slate-300 font-mono">{colorLight}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 flex flex-col items-center justify-center sticky top-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6 w-full text-left">Preview</h2>
            
            <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-200 mb-8 min-h-[240px] flex items-center justify-center w-full max-w-[300px] aspect-square">
              {svgOutput ? (
                <div dangerouslySetInnerHTML={{ __html: svgOutput }} className="w-full h-full" />
              ) : (
                <QrCode className="w-16 h-16 text-slate-300" />
              )}
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={() => downloadFile('png')}
                disabled={!pngOutput}
                className="w-full flex justify-center items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-50 py-3 rounded-lg font-semibold transition"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
              <button 
                onClick={() => downloadFile('svg')}
                disabled={!svgOutput}
                className="w-full flex justify-center items-center gap-2 bg-surface-800 hover:bg-surface-700 border border-surface-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 py-3 rounded-lg font-semibold transition"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
