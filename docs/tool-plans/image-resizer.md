# Image Resizer Plan

## Purpose
Resize and optimize images quickly for docs, social posts, and product updates.

## Real-World Use Cases
- Prepare screenshots for changelog posts.
- Reduce file size for faster uploads.
- Create consistent dimensions for reports and presentations.

## MVP Scope
- Drag-and-drop or file picker for multiple images.
- Presets for common target sizes.
- Manual width and height with aspect-ratio lock.
- Quality slider for JPEG/WebP output.
- Batch download as individual files.

## Browser-Local Constraints
- Decode, resize, and export images fully in-browser.
- No file uploads to external servers.
- Free memory after export to avoid tab slowdowns.

## Suggested OSS Foundation
- Project: pica
- Repo: https://github.com/nodeca/pica
- License: MIT
- Why: High-quality in-browser image resizing with good performance and quality retention.

## Implementation Steps
1. Build uploader and thumbnail list with file metadata.
2. Use pica with canvas workers for resize operations.
3. Add presets plus custom size controls.
4. Support output format selection: PNG, JPEG, WebP.
5. Add progress display and per-file download actions.

## UX States
- Empty: Explain supported file types and max recommended size.
- Loading: Show per-image resize progress.
- Error: Mark invalid files and continue processing valid ones.

## Validation Checklist
- Keeps expected aspect ratio when lock is enabled.
- Produces accurate dimensions for presets.
- Handles at least 10 medium images in one run.
- Works on modern Chrome, Edge, and Firefox.
