# JSON Diff Plan

## Purpose
Help users compare two JSON payloads quickly and understand exactly what changed.

## Real-World Use Cases
- Validate API response changes between environments.
- Review config updates before deployment.
- Check payload compatibility during integration testing.

## MVP Scope
- Two input panes for left and right JSON.
- Parse and validate both inputs with clear error states.
- Show key-level differences with path notation.
- Show a summary count for added, removed, and changed nodes.
- Copyable plain-language change summary.

## Browser-Local Constraints
- Parse and diff entirely in the browser.
- Never upload JSON to a server.
- Keep all intermediate data in memory only.

## Suggested OSS Foundation
- Project: jsondiffpatch
- Repo: https://github.com/benjamine/jsondiffpatch
- License: MIT
- Why: Mature JSON diff algorithm with compact delta format and good browser support.

## Implementation Steps
1. Build controlled textareas with JSON lint feedback.
2. Normalize JSON formatting before diffing for predictable output.
3. Generate diff with jsondiffpatch and transform to readable rows.
4. Add filters: show all, additions only, removals only, changes only.
5. Add export options: copy summary and download diff report as JSON.

## UX States
- Empty: Prompt users to paste both JSON documents.
- Loading: Short spinner while computing very large diffs.
- Error: Inline parse errors with line/column when available.

## Validation Checklist
- Works with nested objects and arrays.
- Handles invalid JSON gracefully.
- Handles payloads over 1 MB without freezing the UI.
- Produces deterministic output for the same inputs.
