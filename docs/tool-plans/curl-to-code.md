# CURL to Code Converter

## Purpose
Convert standard curl commands into production-ready code snippets (JS, Python, Go).

## Features
- Basic curl flag parsing (`-H`, `-d`, `-X`, etc.).
- Code generators for `fetch`, `axios`, `Python requests`, and `Go net/http`.
- Syntax highlighting via basic code blocks.
- One-click copy.

## Implementation Details
- Hand-rolled lexer to extract URL, headers, and body from the curl string.
- Template literal generators for each output language.
