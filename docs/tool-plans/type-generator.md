# Type Generator Plan

## Purpose
Convert raw JSON payloads into strict, production-ready type definitions (TypeScript, Go, Rust, Python) instantly, without needing to manually map deeply nested structures.

## Real-World Use Cases
- Integrating 3rd-party API responses into a strongly-typed codebase.
- Generating data models from example JSON files.
- Avoiding typos and missing optional fields when manually writing interfaces.

## MVP Scope
- Input text area for raw JSON.
- Output text area for generated code.
- Language selector: TypeScript, Go, Rust, Python.
- Option to specify the root interface/struct name.
- **MCP Server Context:** An AI agent can use this tool to autonomously parse a JSON response it just fetched and perfectly inject the resulting TypeScript interfaces or Go structs into the project's source code.

## Browser-Local Constraints
- Type generation must happen entirely in-browser.
- No network requests to external APIs like quicktype.io.

## Suggested OSS Foundation
- Project: quicktype-core
- Repo: https://github.com/quicktype/quicktype
- License: Apache-2.0
- Why: The industry standard for inferring types from JSON and outputting multiple languages.

## Implementation Steps
1. Build split-pane UI for JSON input and Code output.
2. Wire up `quicktype-core` to process the JSON string based on selected language options.
3. Add a root name input field.
4. Provide copy to clipboard functionality.
5. Handle invalid JSON inputs gracefully with error messages.

## Validation Checklist
- Handles deeply nested JSON objects and arrays.
- Correctly infers primitive types (string, number, boolean).
- Handles null or mixed-type arrays by generating unions or optional fields.