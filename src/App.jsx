import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResizeTool from './pages/ResizeTool'
import JsonDiff from './pages/JsonDiff'
import TextCleanup from './pages/TextCleanup'

const tools = [
  {
    name: 'JSON Diff',
    summary: 'Compare JSON objects and quickly spot changed keys, missing fields, and type mismatches.',
    status: 'Preview',
    href: '/json-diff',
    isAvailable: true,
  },
  {
    name: 'Text Cleanup',
    summary: 'Fix spacing, normalize line breaks, and tidy pasted text for notes, docs, and messages.',
    status: 'Preview',
    href: '/text-cleanup',
    isAvailable: true,
  },
  {
    name: 'Image Resizer',
    summary: 'Resize screenshots and photos to common dimensions without leaving the browser.',
    status: 'Preview',
    href: '/resize-tool',
    isAvailable: true,
  },
  {
    name: 'QR Generator',
    summary: 'Create QR codes for links, Wi-Fi credentials, contact cards, and event check-ins.',
    status: 'Coming Soon',
    href: null,
    isAvailable: false,
  },
  {
    name: 'PDF Merge',
    summary: 'Combine multiple PDF files into one document for sharing, printing, or record-keeping.',
    status: 'Coming Soon',
    href: null,
    isAvailable: false,
  },
  {
    name: 'CSV to JSON',
    summary: 'Convert spreadsheet exports into clean JSON for APIs, prototypes, and automation scripts.',
    status: 'Coming Soon',
    href: null,
    isAvailable: false,
  },
  {
    name: 'Markdown Preview',
    summary: 'Write markdown and instantly preview formatted output before publishing or sharing.',
    status: 'Coming Soon',
    href: null,
    isAvailable: false,
  },
]

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home tools={tools} />} />
        <Route path="/resize-tool" element={<ResizeTool />} />
        <Route path="/json-diff" element={<JsonDiff />} />
        <Route path="/text-cleanup" element={<TextCleanup />} />
      </Routes>
    </Router>
  )
}
