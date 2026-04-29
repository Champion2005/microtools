# SVG Optimizer Plan

## Purpose
Clean, minify, and strip metadata from bloated SVG files exported by design tools, making them production-ready for the web.

## Real-World Use Cases
- Reducing bundle size by optimizing vector assets.
- Cleaning up inline SVGs to make React components more readable.
- Removing hidden layers, comments, and unnecessary precision from Figma exports.

## MVP Scope
- Text area to paste raw SVG code (or upload an SVG file).
- Output text area for the minified SVG code.
- Live visual preview of both the original and optimized SVG side-by-side (or toggle).
- Size comparison showing original size, optimized size, and percentage saved.
- **MCP Server Context:** An AI agent tasked with adding an icon can take a bloated SVG, run it through the MCP tool, and inject the perfectly minified version directly into a React component.

## Browser-Local Constraints
- Optimization must run locally in the browser.
- Render previews safely.

## Suggested OSS Foundation
- Project: svgo
- Repo: https://github.com/svg/svgo
- License: MIT
- Why: The gold standard for SVG optimization, widely used in build tools and plugins.

## Implementation Steps
1. Build input for pasting SVG code.
2. Integrate SVGO to process the input string.
3. Calculate and display byte size differences.
4. Render the optimized SVG to ensure it hasn't visually broken.
5. Add copy and download actions for the optimized code.

## Validation Checklist
- Strips comments and DOCTYPE declarations.
- Reduces path data precision without noticeable visual distortion.
- Removes empty attributes and unused defs.