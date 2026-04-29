import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Info } from 'lucide-react';
import cronstrue from 'cronstrue';
import * as cronParserModule from 'cron-parser';

const COMMON_CRONS = [
  { expr: '* * * * *', label: 'Every minute' },
  { expr: '*/5 * * * *', label: 'Every 5 minutes' },
  { expr: '0 * * * *', label: 'Every hour' },
  { expr: '0 0 * * *', label: 'Every day at midnight' },
  { expr: '0 0 * * 0', label: 'Every Sunday at midnight' },
];

export default function CronTranslator() {
  const [cron, setCron] = useState('0 4 8-14 * *');

  const { translation, upcoming, error } = useMemo(() => {
    if (!cron.trim()) return { translation: null, upcoming: [], error: null };

    try {
      const trans = cronstrue.toString(cron, { throwExceptionOnParseError: true });
      
      const parser = cronParserModule.default || cronParserModule;
      const interval = parser.parseExpression(cron);
      const times = [];
      for (let i = 0; i < 5; i++) {
        times.push(interval.next().toDate());
      }

      return { translation: trans, upcoming: times, error: null };
    } catch (err) {
      return { translation: null, upcoming: [], error: err.message };
    }
  }, [cron]);

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-semibold text-slate-50">Cron Translator</h1>
          <p className="text-sm text-slate-400">Convert cryptic cron expressions into plain English and calculate next run times.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Cron Expression</label>
            </div>
            <input
              type="text"
              value={cron}
              onChange={(e) => setCron(e.target.value)}
              className={`w-full bg-surface-900 border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-surface-700 focus:border-brand-500 focus:ring-brand-500'} rounded-xl p-4 font-mono text-lg outline-none`}
              placeholder="* * * * *"
            />
            {error && <p className="text-xs text-red-400 mt-1">{error.replace('Error: ', '')}</p>}
          </div>

          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> Translation
            </h2>
            <p className="text-xl font-medium text-slate-100 leading-relaxed">
              {translation || <span className="text-slate-500 italic">Enter a valid cron expression...</span>}
            </p>
          </div>

          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Next Executions (Local Time)
            </h2>
            {upcoming.length > 0 ? (
              <ul className="space-y-3">
                {upcoming.map((date, idx) => (
                  <li key={idx} className="flex justify-between items-center py-2 border-b border-surface-800 last:border-0">
                    <span className="text-slate-200">{date.toLocaleDateString()}</span>
                    <span className="text-brand-300 font-mono text-sm bg-brand-500/10 px-2 py-1 rounded">
                      {date.toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 italic">No upcoming executions calculated.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Common Examples</h2>
            <div className="grid grid-cols-1 gap-2">
              {COMMON_CRONS.map(ex => (
                <button
                  key={ex.expr}
                  onClick={() => setCron(ex.expr)}
                  className="flex flex-col items-start p-3 rounded-lg border border-surface-800 hover:border-brand-500/50 hover:bg-surface-800 transition text-left group"
                >
                  <span className="font-mono text-brand-400 group-hover:text-brand-300 mb-1">{ex.expr}</span>
                  <span className="text-xs text-slate-400 group-hover:text-slate-300">{ex.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Syntax Guide</h2>
            <div className="font-mono text-xs text-slate-400 bg-surface-950 p-4 rounded-lg border border-surface-800 overflow-x-auto">
<pre>
{`┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6)
│ │ │ │ │
* * * * *`}
</pre>
            </div>
            <ul className="mt-4 text-xs text-slate-400 space-y-2">
              <li><strong className="text-slate-200">*</strong> - any value</li>
              <li><strong className="text-slate-200">,</strong> - value list separator</li>
              <li><strong className="text-slate-200">-</strong> - range of values</li>
              <li><strong className="text-slate-200">/</strong> - step values (e.g., */5)</li>
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
