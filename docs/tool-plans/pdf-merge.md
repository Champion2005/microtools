# PDF Merge Plan

## Purpose
Merge multiple PDF files into one clean output for sharing and archival.

## Real-World Use Cases
- Combine invoices into one monthly bundle.
- Merge signed documents into a single package.
- Prepare one printable file for meetings.

## MVP Scope
- Drag-and-drop multi-file PDF upload.
- File ordering controls: move up, move down, remove.
- Merge action and download output PDF.
- Basic metadata summary: file count and estimated size.

## Browser-Local Constraints
- Parse and merge PDFs fully in-browser.
- Never upload documents to a remote service.
- Clean in-memory buffers after export.

## Suggested OSS Foundation
- Project: pdf-lib
- Repo: https://github.com/Hopding/pdf-lib
- License: MIT
- Why: Strong browser compatibility and robust PDF manipulation APIs.

## Implementation Steps
1. Build uploader with MIME and extension validation.
2. Preserve file order in draggable list.
3. Merge with pdf-lib by appending pages from each source file.
4. Generate downloadable Blob URL and cleanup after save.
5. Add safeguards for very large combined PDFs.

## UX States
- Empty: Explain drag-and-drop and ordering behavior.
- Loading: Progress indicator while loading and merging pages.
- Error: Display file-level parse errors and keep valid files.

## Validation Checklist
- Correctly merges files in selected order.
- Keeps page orientation and dimensions.
- Handles password-protected PDFs with clear messaging.
- Works for at least 20 small PDFs in one batch.
