# Markdown Preview Plan

## Purpose
Provide instant markdown editing and safe preview for docs, README drafts, and notes.

## Real-World Use Cases
- Draft README content with immediate rendered output.
- Validate markdown formatting before publishing.
- Export polished HTML for internal documentation.

## MVP Scope
- Split view editor and live preview.
- GFM-style basic markdown support.
- Toggle for line wrap and sync scroll.
- Copy rendered HTML and markdown source.
- Download markdown file.

## Browser-Local Constraints
- Parse markdown locally in-browser.
- Sanitize rendered HTML to prevent script injection.
- Do not send content to external APIs.

## Suggested OSS Foundation
- Project: markdown-it + DOMPurify
- Repo: https://github.com/markdown-it/markdown-it
- License: MIT
- Repo: https://github.com/cure53/DOMPurify
- License: Apache-2.0
- Why: Fast markdown parsing with reliable sanitization for safe previews.

## Implementation Steps
1. Build responsive split pane with editor and preview.
2. Parse markdown with markdown-it options tuned for readability.
3. Sanitize rendered HTML with DOMPurify.
4. Add toolbar shortcuts for headings, links, lists, and code blocks.
5. Add copy/download actions and optional template snippets.

## UX States
- Empty: Load a starter markdown template.
- Loading: Not required for normal size documents.
- Error: Show parser fallback message if rendering fails.

## Validation Checklist
- Renders headings, lists, tables, and fenced code blocks.
- Prevents unsafe HTML execution in preview.
- Maintains typing performance for long documents.
- Works well on both desktop and mobile layouts.
