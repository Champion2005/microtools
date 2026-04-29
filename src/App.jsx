import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResizeTool from './pages/ResizeTool'
import JsonDiff from './pages/JsonDiff'
import TextCleanup from './pages/TextCleanup'
import QrGenerator from './pages/QrGenerator'
import PdfMerge from './pages/PdfMerge'
import CsvToJson from './pages/CsvToJson'
import MarkdownPreview from './pages/MarkdownPreview'
import JwtInspector from './pages/JwtInspector'
import CronTranslator from './pages/CronTranslator'

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
    status: 'Preview',
    href: '/qr-generator',
    isAvailable: true,
  },
  {
    name: 'PDF Merge',
    summary: 'Combine multiple PDF files into one document for sharing, printing, or record-keeping.',
    status: 'Preview',
    href: '/pdf-merge',
    isAvailable: true,
  },
  {
    name: 'CSV to JSON',
    summary: 'Convert spreadsheet exports into clean JSON for APIs, prototypes, and automation scripts.',
    status: 'Preview',
    href: '/csv-to-json',
    isAvailable: true,
  },
  {
    name: 'Markdown Preview',
    summary: 'Write markdown and instantly preview formatted output before publishing or sharing.',
    status: 'Preview',
    href: '/markdown-preview',
    isAvailable: true,
  },
  {
    name: 'JWT Inspector',
    summary: 'Safely decode and inspect JSON Web Tokens locally, including human-readable expiration times.',
    status: 'Preview',
    href: '/jwt-inspector',
    isAvailable: true,
  },
  {
    name: 'Cron Translator',
    summary: 'Convert cryptic cron schedule expressions into plain English and calculate their exact next run times.',
    status: 'Preview',
    href: '/cron-translator',
    isAvailable: true,
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
        <Route path="/qr-generator" element={<QrGenerator />} />
        <Route path="/pdf-merge" element={<PdfMerge />} />
        <Route path="/csv-to-json" element={<CsvToJson />} />
        <Route path="/markdown-preview" element={<MarkdownPreview />} />
        <Route path="/jwt-inspector" element={<JwtInspector />} />
        <Route path="/cron-translator" element={<CronTranslator />} />
      </Routes>
    </Router>
  )
}
