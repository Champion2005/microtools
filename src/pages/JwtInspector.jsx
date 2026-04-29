import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function JwtInspector() {
  const [token, setToken] = useState('');

  const parsed = useMemo(() => {
    if (!token.trim()) return null;
    
    try {
      // Decode header
      const header = jwtDecode(token, { header: true });
      // Decode payload
      const payload = jwtDecode(token);
      
      return { header, payload, error: null };
    } catch (err) {
      return { header: null, payload: null, error: err.message };
    }
  }, [token]);

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    const now = Date.now();
    const target = timestamp * 1000;
    const diffInSeconds = Math.round((target - now) / 1000);
    
    if (diffInSeconds < 0) {
      return `Expired ${Math.abs(diffInSeconds)} seconds ago`;
    }
    
    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Expires in ${days} days, ${hours % 24} hours`;
    if (hours > 0) return `Expires in ${hours} hours, ${minutes % 60} minutes`;
    if (minutes > 0) return `Expires in ${minutes} minutes`;
    return `Expires in ${diffInSeconds} seconds`;
  };

  const isExpired = parsed?.payload?.exp && (parsed.payload.exp * 1000 < Date.now());

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-slate-50">JWT Inspector</h1>
          <p className="text-sm text-slate-400">Safely decode and inspect JSON Web Tokens locally. Data never leaves your browser.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Raw JWT Token</h2>
            <button 
              onClick={() => setToken('')} 
              className="text-xs text-red-400 hover:text-red-300 transition"
              disabled={!token}
            >
              Clear
            </button>
          </div>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full h-48 bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none resize-none break-all"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            spellCheck="false"
          />
          
          {parsed?.error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-4 rounded-xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Invalid Token</p>
                <p className="text-xs mt-1 opacity-80">{parsed.error}</p>
              </div>
            </div>
          )}

          {parsed?.payload && (
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${isExpired ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
              {isExpired ? <Clock className="w-5 h-5 shrink-0 mt-0.5" /> : <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />}
              <div>
                <p className="font-semibold text-sm">
                  {isExpired ? 'Token is Expired' : 'Token is Active'}
                </p>
                {parsed.payload.exp && (
                  <p className="text-xs mt-1 opacity-80">
                    {getRelativeTime(parsed.payload.exp)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Header</h2>
            <div className="bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm text-slate-200 overflow-x-auto min-h-[100px]">
              {parsed?.header ? (
                <pre>{JSON.stringify(parsed.header, null, 2)}</pre>
              ) : (
                <span className="text-slate-500 italic">Waiting for token...</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Payload</h2>
            <div className="bg-surface-900 border border-surface-700 rounded-xl p-4 font-mono text-sm text-slate-200 overflow-x-auto min-h-[250px]">
              {parsed?.payload ? (
                <pre>{JSON.stringify(parsed.payload, null, 2)}</pre>
              ) : (
                <span className="text-slate-500 italic">Waiting for token...</span>
              )}
            </div>
          </div>

          {parsed?.payload && (
            <div className="bg-surface-900 border border-surface-700 rounded-xl p-4">
               <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Important Claims</h3>
               <dl className="grid grid-cols-1 gap-2 text-sm">
                 {parsed.payload.iss && (
                   <div className="grid grid-cols-3 gap-2 py-1 border-b border-surface-800">
                     <dt className="text-slate-500 font-mono">iss</dt>
                     <dd className="col-span-2 text-slate-200 truncate" title={parsed.payload.iss}>{parsed.payload.iss}</dd>
                   </div>
                 )}
                 {parsed.payload.sub && (
                   <div className="grid grid-cols-3 gap-2 py-1 border-b border-surface-800">
                     <dt className="text-slate-500 font-mono">sub</dt>
                     <dd className="col-span-2 text-slate-200 truncate" title={parsed.payload.sub}>{parsed.payload.sub}</dd>
                   </div>
                 )}
                 {parsed.payload.aud && (
                   <div className="grid grid-cols-3 gap-2 py-1 border-b border-surface-800">
                     <dt className="text-slate-500 font-mono">aud</dt>
                     <dd className="col-span-2 text-slate-200 truncate" title={String(parsed.payload.aud)}>{String(parsed.payload.aud)}</dd>
                   </div>
                 )}
                 {parsed.payload.exp && (
                   <div className="grid grid-cols-3 gap-2 py-1 border-b border-surface-800">
                     <dt className="text-slate-500 font-mono">exp</dt>
                     <dd className="col-span-2 text-slate-200">{formatTime(parsed.payload.exp)}</dd>
                   </div>
                 )}
                 {parsed.payload.iat && (
                   <div className="grid grid-cols-3 gap-2 py-1">
                     <dt className="text-slate-500 font-mono">iat</dt>
                     <dd className="col-span-2 text-slate-200">{formatTime(parsed.payload.iat)}</dd>
                   </div>
                 )}
               </dl>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
