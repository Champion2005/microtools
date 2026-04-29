# Text Cleanup Plan

## Purpose
Clean noisy pasted text into readable, consistent output for everyday writing tasks.

## Real-World Use Cases
- Clean meeting notes copied from chat or docs.
- Normalize copied text before publishing in tickets or emails.
- Fix spacing and punctuation in drafts quickly.

## MVP Scope
- Input and output panes with live preview.
- Toggle actions: trim lines, collapse spaces, normalize punctuation, remove duplicate blank lines.
- Optional sentence case conversion.
- Copy cleaned text button.
- Undo reset to original input.

## Browser-Local Constraints
- All transformations run in the browser.
- No remote text processing service.
- Do not persist content unless user chooses local save.

## Suggested OSS Foundation
- Project: lodash-es
- Repo: https://github.com/lodash/lodash
- License: MIT
- Why: Lightweight string helpers for predictable text transforms without heavy NLP dependencies.

## Implementation Steps
1. Define deterministic transform pipeline with pure helper functions.
2. Add toggles for each cleanup operation and display active operations.
3. Recompute output on option changes with debounced updates.
4. Add diff-like highlight mode to show what changed.
5. Add copy and reset actions with success feedback.

## UX States
- Empty: Explain available cleanup operations with an example.
- Loading: Not required for MVP unless input is very large.
- Error: Catch and display unexpected transform errors.

## Validation Checklist
- Preserves line endings when options are disabled.
- Produces expected output for mixed whitespace and punctuation.
- Handles long text blocks without lag.
- Keyboard-only operation works for all controls.
