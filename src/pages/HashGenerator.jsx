import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default function HashGenerator() {
  const [inputText, setInputText] = useState('Hello, World!');
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '', sha512: '', bcrypt: '' });
  const [secrets, setSecrets] = useState({ uuid: '', hex32: '', base64: '' });
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    generateHashes();
  }, [inputText]);

  useEffect(() => {
    generateSecrets();
  }, []);

  const generateHashes = () => {
    if (!inputText) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '', bcrypt: '' });
      return;
    }
    
    // Hash synchronously for standard crypto algorithms
    const md5 = CryptoJS.MD5(inputText).toString();
    const sha1 = CryptoJS.SHA1(inputText).toString();
    const sha256 = CryptoJS.SHA256(inputText).toString();
    const sha512 = CryptoJS.SHA512(inputText).toString();
    
    setHashes(prev => ({ ...prev, md5, sha1, sha256, sha512 }));
    
    // Bcrypt is heavy, use a low salt round for real-time typing or debounce
    // But for MVP, 8 rounds is fast enough asynchronously
    bcrypt.hash(inputText, 8, (err, hash) => {
      if (!err) setHashes(prev => ({ ...prev, bcrypt: hash }));
    });
  };

  const generateSecrets = () => {
    const newUuid = uuidv4();
    const randomWords = CryptoJS.lib.WordArray.random(32);
    const hex32 = randomWords.toString(CryptoJS.enc.Hex);
    const base64 = randomWords.toString(CryptoJS.enc.Base64);
    
    setSecrets({ uuid: newUuid, hex32, base64 });
  };

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CopyButton = ({ value, id }) => (
    <button 
      onClick={() => copyToClipboard(value, id)}
      disabled={!value}
      className="p-1.5 text-slate-400 hover:text-brand-300 disabled:opacity-30 transition absolute right-2 top-2"
      title="Copy to clipboard"
    >
      {copiedKey === id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">Hash & Secret Generator</h1>
            <p className="text-sm text-slate-400">Generate secure API keys, tokens, and compute hashes locally.</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Hashes Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">Calculate Hashes</h2>
            <div className="mb-6">
              <label className="block text-xs text-slate-400 mb-2">Input String</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-24 bg-surface-800 border border-surface-600 rounded-lg p-3 text-sm text-slate-100 focus:outline-none focus:border-brand-500 resize-none"
                placeholder="Enter string to hash..."
              />
            </div>
            
            <div className="space-y-4">
              {['md5', 'sha1', 'sha256', 'sha512', 'bcrypt'].map((algo) => (
                <div key={algo}>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-semibold">{algo}</label>
                  <div className="relative">
                    <input
                      readOnly
                      value={hashes[algo]}
                      className="w-full bg-surface-950 border border-surface-800 rounded-lg py-2 pl-3 pr-10 font-mono text-xs text-slate-300 outline-none"
                    />
                    <CopyButton value={hashes[algo]} id={`hash_${algo}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secrets Section */}
        <div className="flex flex-col gap-6">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Secure Generator</h2>
              <button 
                onClick={generateSecrets}
                className="text-xs flex items-center gap-1 bg-surface-800 hover:bg-surface-700 text-slate-200 px-3 py-1.5 rounded-lg border border-surface-600 transition"
              >
                <RefreshCw className="w-3 h-3" /> Regenerate
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">UUID (v4)</label>
                <div className="relative">
                  <input
                    readOnly
                    value={secrets.uuid}
                    className="w-full bg-surface-950 border border-surface-800 rounded-lg py-3 pl-4 pr-10 font-mono text-sm text-brand-300 outline-none"
                  />
                  <div className="absolute right-1 top-1">
                    <CopyButton value={secrets.uuid} id="sec_uuid" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">256-bit Hex Token (32 bytes)</label>
                <div className="relative">
                  <input
                    readOnly
                    value={secrets.hex32}
                    className="w-full bg-surface-950 border border-surface-800 rounded-lg py-3 pl-4 pr-10 font-mono text-sm text-brand-300 outline-none break-all"
                  />
                  <div className="absolute right-1 top-1">
                    <CopyButton value={secrets.hex32} id="sec_hex" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1 font-semibold">Base64 Token (32 random bytes)</label>
                <div className="relative">
                  <input
                    readOnly
                    value={secrets.base64}
                    className="w-full bg-surface-950 border border-surface-800 rounded-lg py-3 pl-4 pr-10 font-mono text-sm text-brand-300 outline-none break-all"
                  />
                  <div className="absolute right-1 top-1">
                    <CopyButton value={secrets.base64} id="sec_base64" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-6 pt-4 border-t border-surface-800">
              Tokens are generated using cryptographically strong random number generators entirely within your browser. They are not sent over the network or logged.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}