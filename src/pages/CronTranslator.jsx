import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Info, Settings2, TerminalSquare } from 'lucide-react';
import cronstrue from 'cronstrue';
import cronParser from 'cron-parser';

const COMMON_CRONS = [
  { expr: '* * * * *', label: 'Every minute' },
  { expr: '*/5 * * * *', label: 'Every 5 minutes' },
  { expr: '0 * * * *', label: 'Every hour' },
  { expr: '0 0 * * *', label: 'Every day at midnight' },
  { expr: '0 0 * * 0', label: 'Every Sunday at midnight' },
];

const BUILDER_OPTIONS = {
  minute: [
    { value: '*', label: 'Every minute (*)' },
    { value: '*/5', label: 'Every 5 mins (*/5)' },
    { value: '*/15', label: 'Every 15 mins (*/15)' },
    { value: '0', label: 'Top of hour (0)' },
    { value: '30', label: 'Half past (30)' }
  ],
  hour: [
    { value: '*', label: 'Every hour (*)' },
    { value: '*/2', label: 'Every 2 hours (*/2)' },
    { value: '0', label: 'Midnight (0)' },
    { value: '12', label: 'Noon (12)' },
    { value: '9-17', label: 'Work hours (9-17)' }
  ],
  dayMonth: [
    { value: '*', label: 'Every day (*)' },
    { value: '1', label: '1st of month (1)' },
    { value: '15', label: '15th of month (15)' },
    { value: '*/2', label: 'Every 2 days (*/2)' }
  ],
  month: [
    { value: '*', label: 'Every month (*)' },
    { value: '1', label: 'January (1)' },
    { value: '6', label: 'June (6)' },
    { value: '12', label: 'December (12)' },
    { value: '*/3', label: 'Every quarter (*/3)' }
  ],
  dayWeek: [
    { value: '*', label: 'Every day (*)' },
    { value: '1-5', label: 'Mon-Fri (1-5)' },
    { value: '0,6', label: 'Weekends (0,6)' },
    { value: '1', label: 'Monday (1)' },
    { value: '5', label: 'Friday (5)' }
  ]
};

export default function CronTranslator() {
  const [cron, setCron] = useState('0 4 8-14 * *');
  const [builderMode, setBuilderMode] = useState(false);
  
  // Builder State
  const [bMin, setBMin] = useState('0');
  const [bHour, setBHour] = useState('*');
  const [bDayM, setBDayM] = useState('*');
  const [bMon, setBMon] = useState('*');
  const [bDayW, setBDayW] = useState('*');

  // Sync builder to cron when builder is active
  useEffect(() => {
    if (builderMode) {
      setCron(`${bMin} ${bHour} ${bDayM} ${bMon} ${bDayW}`);
    }
  }, [bMin, bHour, bDayM, bMon, bDayW, builderMode]);

  // Sync cron to builder when switching to builder mode (simple split)
  const handleToggleMode = (mode) => {
    if (mode && !builderMode) {
      const parts = cron.trim().split(/\s+/);
      if (parts.length === 5) {
        setBMin(parts[0]);
        setBHour(parts[1]);
        setBDayM(parts[2]);
        setBMon(parts[3]);
        setBDayW(parts[4]);
      }
    }
    setBuilderMode(mode);
  };

  const { translation, upcoming, error } = useMemo(() => {
    if (!cron.trim()) return { translation: null, upcoming: [], error: null };

    try {
      const trans = cronstrue.toString(cron, { throwExceptionOnParseError: true });
      
      // Robust interop for cron-parser
      const parser = cronParser.parseExpression ? cronParser : (cronParser.default || cronParser);
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

  const BuilderSelect = ({ label, value, setter, options }) => (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[120px]">
      <label className="text-xs text-slate-400 font-semibold uppercase">{label}</label>
      <div className="relative">
        <input 
          type="text" 
          value={value}
          onChange={(e) => setter(e.target.value)}
          className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500 font-mono"
        />
        <select 
          onChange={(e) => setter(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Quick select options"
        >
          <option value="" disabled>Presets...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );

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
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center bg-surface-900 border border-surface-800 rounded-xl p-1.5 w-fit">
              <button 
                onClick={() => handleToggleMode(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${!builderMode ? 'bg-surface-800 text-brand-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <TerminalSquare className="w-4 h-4" /> Raw Expression
              </button>
              <button 
                onClick={() => handleToggleMode(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${builderMode ? 'bg-surface-800 text-brand-300 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Settings2 className="w-4 h-4" /> Visual Builder
              </button>
            </div>

            {!builderMode ? (
              <div>
                <input
                  type="text"
                  value={cron}
                  onChange={(e) => setCron(e.target.value)}
                  className={`w-full bg-surface-900 border ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-surface-700 focus:border-brand-500 focus:ring-brand-500'} rounded-xl p-4 font-mono text-lg outline-none`}
                  placeholder="* * * * *"
                />
                {error && <p className="text-xs text-red-400 mt-2">{error.replace('Error: ', '')}</p>}
              </div>
            ) : (
              <div className="bg-surface-900 border border-surface-700 rounded-xl p-4">
                <div className="flex flex-wrap gap-4">
                  <BuilderSelect label="Minute" value={bMin} setter={setBMin} options={BUILDER_OPTIONS.minute} />
                  <BuilderSelect label="Hour" value={bHour} setter={setBHour} options={BUILDER_OPTIONS.hour} />
                  <BuilderSelect label="Day (Month)" value={bDayM} setter={setBDayM} options={BUILDER_OPTIONS.dayMonth} />
                  <BuilderSelect label="Month" value={bMon} setter={setBMon} options={BUILDER_OPTIONS.month} />
                  <BuilderSelect label="Day (Week)" value={bDayW} setter={setBDayW} options={BUILDER_OPTIONS.dayWeek} />
                </div>
                <p className="text-xs text-slate-500 mt-4 italic">Type custom values directly or use the dropdowns to pick presets.</p>
                <div className="mt-4 pt-4 border-t border-surface-800 font-mono text-lg text-brand-400 text-center tracking-widest">
                  {cron}
                </div>
              </div>
            )}
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
                  onClick={() => { setBuilderMode(false); setCron(ex.expr); }}
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
