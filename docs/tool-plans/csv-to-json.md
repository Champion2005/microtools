# CSV to JSON Plan

## Purpose
Convert CSV data into valid JSON quickly for API testing, automation, and prototypes.

## Real-World Use Cases
- Convert spreadsheet exports for mock API payloads.
- Prepare seed data for local development.
- Validate column consistency before import jobs.

## MVP Scope
- Paste CSV or upload .csv file.
- Auto-detect delimiter with manual override.
- Header row toggle.
- JSON preview with pretty print.
- Download JSON and copy to clipboard.

## Browser-Local Constraints
- Parse CSV in-browser with no backend dependency.
- Keep imported data local to the current tab.
- Support large files with streaming parse where possible.

## Suggested OSS Foundation
- Project: Papa Parse
- Repo: https://github.com/mholt/PapaParse
- License: MIT
- Why: Widely used browser CSV parser with robust delimiter and header support.

## Implementation Steps
1. Build input methods for paste and file upload.
2. Parse with Papa Parse using selected options.
3. Transform rows into array of objects or arrays based on header setting.
4. Display validation warnings for ragged rows.
5. Add export actions: copy JSON and download .json.

## UX States
- Empty: Provide sample CSV snippet.
- Loading: Show row parse progress for large files.
- Error: Report parsing issues with row context.

## Validation Checklist
- Correct delimiter detection for comma and semicolon files.
- Stable parsing for quoted values and escaped commas.
- Correct output for missing headers and duplicate headers.
- Handles files over 50,000 rows with responsive UI.
