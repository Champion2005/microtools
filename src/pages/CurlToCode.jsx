import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code } from 'lucide-react';

export default function CurlToCode() {
  const [curl, setCurl] = useState("curl -X POST https://api.example.com/data \\n  -H 'Content-Type: application/json' \\n  -d '{\"key\":\"value\"}'");
  
  const parseCurl = (cmd) => {
    let method = 'GET';
    let url = '';
    const headers = {};
    let data = null;

    // Very naive regex parser for MVP
    const methodMatch = cmd.match(/-X\s+([A-Z]+)/);
    if (methodMatch) method = methodMatch[1];

    const dMatch = cmd.match(/(?:-d|--data)\s+['"]?([^'"]+)['"]?/);
    if (dMatch) {
      data = dMatch[1];
      if (method === 'GET') method = 'POST';
    }

    const headerMatches = cmd.matchAll(/-H\s+['"]?([^:'"]+):\s*([^'"]+)['"]?/g);
    for (const match of headerMatches) {
      headers[match[1]] = match[2];
    }

    const urlMatch = cmd.match(/(?:https?:\/\/[^\s'"]+)/);
    if (urlMatch) url = urlMatch[0];

    return { method, url, headers, data };
  };

  const generateJS = (parsed) => {
    const { method, url, headers, data } = parsed;
    return `fetch('${url}', {
  method: '${method}',
  headers: ${JSON.stringify(headers, null, 4).replace(/\n/g, '\n  ')}${data ? `,\n  body: JSON.stringify(${data})` : ''}
})
.then(res => res.json())
.then(console.log);`;
  };

  const generatePython = (parsed) => {
    const { method, url, headers, data } = parsed;
    return `import requests

url = '${url}'
headers = ${JSON.stringify(headers, null, 4)}
${data ? `data = '${data}'\n` : ''}
response = requests.request('${method}', url, headers=headers${data ? ', data=data' : ''})
print(response.json())`;
  };

  const generateGo = (parsed) => {
    const { method, url, headers, data } = parsed;
    return `package main

import (
\t"fmt"
\t"net/http"
\t"io/ioutil"
${data ? '\t"strings"\n' : ''})

func main() {
\turl := "${url}"
\t${data ? `payload := strings.NewReader(\`${data}\`)` : ''}
\treq, _ := http.NewRequest("${method}", url, ${data ? 'payload' : 'nil'})
${Object.entries(headers).map(([k, v]) => `\treq.Header.Add("${k}", "${v}")`).join('\n')}
\tres, _ := http.DefaultClient.Do(req)
\tdefer res.Body.Close()
\tbody, _ := ioutil.ReadAll(res.Body)
\tfmt.Println(string(body))
}`;
  };

  const parsed = parseCurl(curl);

  return (
    <div className="min-h-screen bg-surface-950 text-slate-300 p-6 flex flex-col items-center">
      <header className="w-full max-w-5xl mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 rounded-full hover:bg-surface-800 transition">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-50">CURL to Code Convert</h1>
            <p className="text-sm text-slate-400">Convert cURL commands to JS, Python, and Go.</p>
          </div>
        </div>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6 flex flex-col">
           <label className="text-sm font-semibold text-slate-400 mb-3 block uppercase tracking-wider">cURL Command</label>
           <textarea
              value={curl}
              onChange={(e) => setCurl(e.target.value)}
              className="w-full bg-surface-950 border border-surface-700 rounded-lg p-4 font-mono text-slate-300 focus:outline-none focus:border-brand-500 flex-1 resize-none"
              placeholder="curl https://..."
           />
        </div>

        <div className="flex flex-col gap-6">
           <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Code className="w-4 h-4"/> JavaScript (Fetch)
              </h2>
              <pre className="bg-surface-950 p-4 rounded-lg font-mono text-sm text-brand-300 overflow-x-auto whitespace-pre-wrap">{generateJS(parsed)}</pre>
           </div>
           
           <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Code className="w-4 h-4"/> Python (Requests)
              </h2>
              <pre className="bg-surface-950 p-4 rounded-lg font-mono text-sm text-blue-300 overflow-x-auto whitespace-pre-wrap">{generatePython(parsed)}</pre>
           </div>

           <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Code className="w-4 h-4"/> Go (net/http)
              </h2>
              <pre className="bg-surface-950 p-4 rounded-lg font-mono text-sm text-cyan-300 overflow-x-auto whitespace-pre-wrap">{generateGo(parsed)}</pre>
           </div>
        </div>
      </main>
    </div>
  );
}
