import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResizeTool from './pages/ResizeTool'
import JsonDiff from './pages/JsonDiff'
import TextCleanup from './pages/TextCleanup'

const tools = [
  {
    name: 'Image Batch Resize',
    summary: 'Drop a folder of screenshots and export optimized variants in one click.',
    status: 'Planned',
    href: '/resizetool',
  },
  {
    name: 'JSON Shape Diff',
    summary: 'Compare two payloads and highlight schema drift before it breaks a deploy.',
    status: 'In progress',
    href: '/jsondiff',
  },
  {
    name: 'Text Cleanup Pad',
    summary: 'Normalize spacing, punctuation, and casing for messy copy-pasted notes.',
    status: 'Planned',
    href: '/textcleanup',
  },
]

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home tools={tools} />} />
        <Route path="/resizetool" element={<ResizeTool />} />
        <Route path="/jsondiff" element={<JsonDiff />} />
        <Route path="/textcleanup" element={<TextCleanup />} />
      </Routes>
    </Router>
  )
}
