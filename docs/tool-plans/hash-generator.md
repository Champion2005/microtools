# Hash & Secret Generator Plan

## Purpose
Quickly generate cryptographically secure tokens (UUID, Hex, Base64) and calculate hashes (MD5, SHA-1, SHA-256, SHA-512, Bcrypt) entirely in the browser.

## Real-World Use Cases
- Generating secure API keys, OAuth secrets, or temporary passwords.
- Validating webhook signatures or hashing payload data locally.
- Seeding databases with secure bcrypt hashes instead of plain text passwords.

## MVP Scope
- UI to generate random secure strings in various formats (Hex, Base64) with custom lengths.
- Input field to hash any string into MD5, SHA-1, SHA-256, SHA-512, and Bcrypt simultaneously.
- Quick copy buttons for all generated values.
- **MCP Server Context:** An AI agent can use this tool to securely hash passwords before inserting them into a database, or to generate secure API keys for a new service without relying on weak pseudo-random generation.

## Browser-Local Constraints
- All generation must use the browser's native `crypto.subtle` or a reliable local library.
- Secrets are never persisted.

## Suggested OSS Foundation
- Project: bcryptjs
- Repo: https://github.com/dcodeIO/bcrypt.js
- License: MIT
- Project: crypto-js
- Repo: https://github.com/brix/crypto-js
- License: MIT

## Validation Checklist
- Generates 32-byte hex strings correctly.
- Bcrypt hashing completes without freezing the UI (using a web worker or async if needed, but a low salt rounds like 10 is fast enough synchronously).
- Live hashing updates as the user types.