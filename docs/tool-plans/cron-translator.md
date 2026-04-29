# Cron Translator Plan

## Purpose
Convert cryptic cron schedule expressions into plain English descriptions and calculate their exact next run times.

## Real-World Use Cases
- Verifying CI/CD pipeline schedules (e.g., GitHub Actions) before merging to production.
- Debugging automated background jobs that run at unexpected times.
- Translating legacy cron strings for documentation and team communication.

## MVP Scope
- Input field for a standard 5-part or 6-part cron expression.
- Real-time translation into a human-readable English sentence.
- Display a list of the next 5 upcoming execution dates in the user's local time.
- Quick reference cheat sheet for common cron syntax (`*`, `*/5`, `1-5`).
- **MCP Server Context:** An AI agent can interpret cron strings found in codebases (like `.github/workflows`) to predict when a job will run next, answering user queries about deployment schedules seamlessly.

## Browser-Local Constraints
- All parsing and timezone math must execute in the browser.
- No reliance on backend scheduling or time services.

## Suggested OSS Foundation
- Project: cronstrue
- Repo: https://github.com/bradymholt/cRonstrue
- License: MIT
- Why: Excellent translation of cron to human-readable strings with broad syntax support.
- Project: cron-parser
- Repo: https://github.com/harrisiirak/cron-parser
- License: MIT
- Why: Robust parser for computing upcoming execution intervals based on timezones.

## Implementation Steps
1. Build an input field optimized for short strings.
2. Wire up `cronstrue` to provide a live human-readable translation as the user types.
3. Use `cron-parser` to compute the next 5 execution times based on the user's local machine time.
4. Add quick-copy buttons for both the human translation and the next run times.
5. Provide a cheat sheet grid of common cron symbols below the input.

## UX States
- Empty: Display a default example like `0 0 * * *` (Every day at midnight) to guide the user.
- Loading: Instantaneous.
- Error: Subtly highlight the input field in red and show "Invalid cron expression" if parsing fails.

## Validation Checklist
- Supports standard Unix cron syntax (5 parts).
- Supports extended syntax like specific weekdays or step values (`*/15`).
- Handles timezones correctly, reflecting the user's local machine time for upcoming runs.
- Updates instantly without typing lag.