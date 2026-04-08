import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResizeTool from './pages/ResizeTool'
import JsonDiff from './pages/JsonDiff'
import TextCleanup from './pages/TextCleanup'

const tools = [
  {
    name: 'Image Batch Resize',
    summary: 'Batch process screenshots into consistent dimensions and file sizes.',
    status: 'Planned',
    href: '/resize-tool',
  },
  {
    name: 'JSON Shape Diff',
    summary: 'Compare two payloads and flag schema drift before it reaches production.',
    status: 'In Progress',
    href: '/json-diff',
  },
  {
    name: 'Text Cleanup Pad',
    summary: 'Normalize casing, punctuation, and spacing from messy pasted content.',
    status: 'Planned',
    href: '/text-cleanup',
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
