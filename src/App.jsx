import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResizeTool from './pages/ResizeTool'
import JsonDiff from './pages/JsonDiff'
import TextCleanup from './pages/TextCleanup'
import QrGenerator from './pages/QrGenerator'
import PdfMerge from './pages/PdfMerge'
import CsvToJson from './pages/CsvToJson'
import MarkdownPreview from './pages/MarkdownPreview'
import HashGenerator from './pages/HashGenerator'
import CronTranslator from './pages/CronTranslator'
import TypeGenerator from './pages/TypeGenerator'
import SvgOptimizer from './pages/SvgOptimizer'
import MockDataGenerator from './pages/MockDataGenerator'
import RegexPlayground from './pages/RegexPlayground'
import CurlToCode from './pages/CurlToCode'
import ColorExtractor from './pages/ColorExtractor'
import ColorExtractor from './pages/ColorExtractor'

const tools = [
  {
    name: 'CSV to JSON',
    summary: 'Convert spreadsheet exports into clean JSON for APIs, prototypes, and automation scripts.',
    status: 'Preview',
    category: 'Data & Conversion',
    href: '/csv-to-json',
    isAvailable: true,
  },
  {
    name: 'JSON Diff',
    summary: 'Compare JSON objects and quickly spot changed keys, missing fields, and type mismatches.',
    status: 'Preview',
    category: 'Data & Conversion',
    href: '/json-diff',
    isAvailable: true,
  },
  {
    name: 'Type Generator',
    summary: 'Instantly convert JSON into strict, production-ready types or structs.',
    status: 'Preview',
    category: 'Data & Conversion',
    href: '/type-generator',
    isAvailable: true,
  },
  {
    name: 'Mock Data Generator',
    summary: 'Generate realistic fake data schemas for database seeding and UI prototyping.',
    status: 'Preview',
    category: 'Data & Conversion',
    href: '/mock-data-generator',
    isAvailable: true,
  },
  {
    name: 'Text Cleanup',
    summary: 'Fix spacing, normalize line breaks, and tidy pasted text for notes, docs, and messages.',
    status: 'Preview',
    category: 'Text & Content',
    href: '/text-cleanup',
    isAvailable: true,
  },
  {
    name: 'Markdown Preview',
    summary: 'Write markdown and instantly preview formatted output before publishing or sharing.',
    status: 'Preview',
    category: 'Text & Content',
    href: '/markdown-preview',
    isAvailable: true,
  },
  {
    name: 'Cron Translator',
    summary: 'Convert cryptic cron schedule expressions into plain English and calculate their exact next run times.',
    status: 'Preview',
    category: 'Text & Content',
    href: '/cron-translator',
    isAvailable: true,
  },
  {
    name: 'Image Resizer',
    summary: 'Resize screenshots and photos to common dimensions or scaling factors.',
    status: 'Preview',
    category: 'Media & Assets',
    href: '/resize-tool',
    isAvailable: true,
  },
  {
    name: 'QR Generator',
    summary: 'Create QR codes for links, Wi-Fi credentials, contact cards, and event check-ins.',
    status: 'Preview',
    category: 'Media & Assets',
    href: '/qr-generator',
    isAvailable: true,
  },
  {
    name: 'PDF Merge',
    summary: 'Combine multiple PDF files into one document for sharing, printing, or record-keeping.',
    status: 'Preview',
    category: 'Media & Assets',
    href: '/pdf-merge',
    isAvailable: true,
  },
  {
    name: 'SVG Optimizer',
    summary: 'Clean, minify, and strip metadata from bloated SVG files.',
    status: 'Preview',
    category: 'Media & Assets',
    href: '/svg-optimizer',
    isAvailable: true,
  },
  {
    name: 'Hash & Secret Generator',
    summary: 'Generate secure API keys, tokens, and compute cryptographically secure hashes locally.',
    status: 'Preview',
    category: 'Security & Auth',
    href: '/hash-generator',
    isAvailable: true,
  },

  {
    name: 'RegEx Playground',
    summary: 'A real-time tester with syntax highlighting that explains exactly what each part of your pattern is doing.',
    status: 'Preview',
    category: 'Text & Content',
    href: '/regex-playground',
    isAvailable: true,
  },
  {
    name: 'CURL to Code Converter',
    summary: 'Paste a standard curl command to instantly generate production-ready code snippets.',
    status: 'Preview',
    category: 'Data & Conversion',
    href: '/curl-to-code',
    isAvailable: true,
  },
  {
    name: 'Color Palette Extractor',
    summary: 'Extract dominant colors from images, check WCAG, and generate CSS/Tailwind variables.',
    status: 'Preview',
    category: 'Media & Assets',
    href: '/color-extractor',
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
        <Route path="/hash-generator" element={<HashGenerator />} />
        <Route path="/cron-translator" element={<CronTranslator />} />
        <Route path="/type-generator" element={<TypeGenerator />} />
        <Route path="/svg-optimizer" element={<SvgOptimizer />} />
        <Route path="/mock-data-generator" element={<MockDataGenerator />} />
      
        <Route path="/regex-playground" element={<RegexPlayground />} />
        <Route path="/curl-to-code" element={<CurlToCode />} />
        <Route path="/color-extractor" element={<ColorExtractor />} />
      </Routes>

    </Router>
  )
}
