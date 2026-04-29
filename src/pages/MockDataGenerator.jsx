import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Plus, Trash2, Check } from 'lucide-react';
import { faker } from '@faker-js/faker';

const FIELD_TYPES = [
  { value: 'uuid', label: 'UUID' },
  { value: 'fullName', label: 'Full Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'jobTitle', label: 'Job Title' },
  { value: 'company', label: 'Company' },
  { value: 'avatar', label: 'Avatar URL' },
  { value: 'date', label: 'Past Date' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'number', label: 'Number (1-1000)' },
];
const PREVIEW_LIMIT = 50;

export default function MockDataGenerator() {
  const [schema, setSchema] = useState([
    { id: 1, name: 'id', type: 'uuid' },
    { id: 2, name: 'name', type: 'fullName' },
    { id: 3, name: 'email', type: 'email' },
    { id: 4, name: 'role', type: 'jobTitle' },
  ]);
  const [rowCount, setRowCount] = useState(10);
  const generateData = (count) => {
    faker.seed(123); // Consistent preview
    const data = [];
    for (let i = 0; i < count; i++) {
      const row = {};
      schema.forEach(field => {
        switch(field.type) {
          case 'uuid': row[field.name] = faker.string.uuid(); break;
          case 'fullName': row[field.name] = faker.person.fullName(); break;
          case 'email': row[field.name] = faker.internet.email(); break;
          case 'phone': row[field.name] = faker.phone.number(); break;
          case 'jobTitle': row[field.name] = faker.person.jobTitle(); break;
          case 'company': row[field.name] = faker.company.name(); break;
          case 'avatar': row[field.name] = faker.image.avatar(); break;
          case 'date': row[field.name] = faker.date.past().toISOString(); break;
          case 'paragraph': row[field.name] = faker.lorem.paragraph(); break;
          case 'boolean': row[field.name] = faker.datatype.boolean(); break;
          case 'number': row[field.name] = faker.number.int({ min: 1, max: 1000 }); break;
          default: row[field.name] = faker.word.sample();
        }
      });
      data.push(row);
    }
    return data;
  };

  const previewData = useMemo(() => generateData(Math.min(rowCount, PREVIEW_LIMIT)), [schema, rowCount]);

  const addField = () => {
    setSchema([...schema, { id: Date.now(), name: 'new_field', type: 'fullName' }]);
  };

  const removeField = (id) => {
    setSchema(schema.filter(f => f.id !== id));
  };

  const updateField = (id, key, value) => {
    setSchema(schema.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const executeExport = (exportType) => {
    // Generate fresh non-seeded data for export
    faker.seed(); 
    const finalData = generateData(rowCount);
    
    let content = '';
    let mimeType = '';
    let ext = '';

    if (exportType === 'json') {
      content = JSON.stringify(finalData, null, 2);
      mimeType = 'application/json';
      ext = 'json';
    } else {
      if (finalData.length === 0) return;
      const headers = Object.keys(finalData[0]).join(',');
      const rows = finalData.map(row => 
        Object.values(row).map(val => {
          const str = String(val);
          return str.includes(',') ? `"${str}"` : str;
        }).join(',')
      );
      content = [headers, ...rows].join('\n');
      mimeType = 'text/csv';
      ext = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock_data.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6">
      <header className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">Mock Data Generator</h1>
            <p className="text-sm text-slate-400">Generate realistic fake data schemas for database seeding and UI prototyping.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => executeExport('json')}
            disabled={schema.length === 0 || rowCount < 1}
            className="flex items-center gap-2 bg-surface-800 hover:bg-surface-700 disabled:opacity-50 text-slate-200 px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            JSON
          </button>
          <button 
            onClick={() => executeExport('csv')}
            disabled={schema.length === 0 || rowCount < 1}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-slate-50 px-4 py-2 rounded-lg transition"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Export Settings</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Row Count</label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={rowCount}
                  onChange={(e) => setRowCount(Math.min(10000, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4">Max limit: 10,000 rows to prevent browser memory issues.</p>
          </div>

          <div className="bg-surface-900 border border-surface-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Schema</h2>
              <button 
                onClick={addField}
                className="text-brand-400 hover:text-brand-300 text-xs flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add Field
              </button>
            </div>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {schema.map((field) => (
                <div key={field.id} className="flex gap-2 items-start bg-surface-800/50 p-2 rounded-lg border border-surface-700">
                  <input 
                    type="text" 
                    value={field.name}
                    onChange={(e) => updateField(field.id, 'name', e.target.value)}
                    className="w-1/2 bg-surface-800 border border-surface-600 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                    placeholder="Field Name"
                  />
                  <select 
                    value={field.type}
                    onChange={(e) => updateField(field.id, 'type', e.target.value)}
                    className="w-1/2 bg-surface-800 border border-surface-600 rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
                  >
                    {FIELD_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => removeField(field.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {schema.length === 0 && (
                <p className="text-sm text-slate-500 italic text-center py-4">No fields defined.</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Data Preview</h2>
            <span className="text-xs text-slate-500">
              Showing {previewData.length} of {rowCount} rows (preview max {PREVIEW_LIMIT})
            </span>
          </div>
          
          <div className="bg-surface-900 border border-surface-700 rounded-xl flex-1 max-h-[700px] overflow-auto">
            {previewData.length > 0 ? (
              <table className="min-w-max text-left text-sm whitespace-nowrap">
                <thead className="bg-surface-800/50 text-slate-400 sticky top-0 backdrop-blur-md">
                  <tr>
                    {schema.map(s => (
                      <th key={s.id} className="px-4 py-3 font-semibold">{s.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800/50">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-800/20 transition">
                      {schema.map(s => (
                        <td key={s.id} className="px-4 py-3 text-slate-300 max-w-[200px] truncate" title={String(row[s.name])}>
                          {String(row[s.name])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Define a schema and set rows to preview data.
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
