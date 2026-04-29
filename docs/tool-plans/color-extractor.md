# Color Palette Extractor

## Purpose
Analyze an uploaded image to extract its dominant colors and generate CSS/Tailwind variables.

## Features
- Image upload (local only via Canvas API).
- Dominant color extraction using pixel binning.
- WCAG contrast ratio checks against white/black text.
- Tailwind and CSS variable generation.

## Implementation Details
- Draw `File` to `<canvas>`, extract `ImageData`.
- Euclidean distance or basic box sorting to pick dominant colors.
- Luminance formula to calculate WCAG.
