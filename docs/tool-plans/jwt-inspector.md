# JWT Inspector Plan

## Purpose
Safely decode and inspect JSON Web Tokens (JWT) entirely locally, ensuring sensitive auth tokens are never transmitted to third-party servers.

## Real-World Use Cases
- Debugging authentication failures and claim mismatches in local development.
- Verifying token expiration times by converting Unix timestamps to local, human-readable time.
- Inspecting headers to verify signing algorithms during API development.

## MVP Scope
- Text input for pasting a raw JWT string.
- Automatic decoding into Header and Payload JSON objects.
- Highlighting of critical claims like `exp`, `iat`, `iss`, and `sub`.
- Human-readable countdown/conversion for expiration timestamps (e.g., "Expires in 5 minutes").
- **MCP Server Context:** An AI agent can decode a token to autonomously diagnose authentication issues, read claims, and determine expiration without ever sending the sensitive token out of the secure local environment.

## Browser-Local Constraints
- Decoding must happen exclusively in the browser using base64 decoding.
- Never perform signature verification against a remote JWKS (the MVP focuses strictly on decoding, not verifying).
- Tokens must *never* be logged or persisted in local storage.

## Suggested OSS Foundation
- Project: jwt-decode
- Repo: https://github.com/auth0/jwt-decode
- License: MIT
- Why: Industry standard, lightweight, zero-dependency library for safely decoding JWTs in the browser without verifying signatures.

## Implementation Steps
1. Create a large text area for pasting the raw JWT.
2. Implement robust validation to detect invalid or malformed tokens.
3. Parse the header and payload, displaying them in formatted JSON viewers.
4. Extract timestamp claims (`exp`, `iat`) and render them as relative human time.
5. Add a one-click copy button for the decoded JSON payload.

## UX States
- Empty: Show a visual placeholder indicating where to paste the token.
- Loading: Instantaneous, no loading state required.
- Error: Show a clear "Invalid JWT format" message if decoding fails.

## Validation Checklist
- Correctly parses standard 3-part JWTs.
- Handles missing or malformed signatures gracefully.
- Accurately converts `exp` timestamps to the user's local timezone.
- Fails securely without crashing the UI on garbage input.