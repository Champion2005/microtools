# Mock Data Generator Plan

## Purpose
Quickly generate hundreds of rows of realistic fake data based on a custom schema, exportable as JSON or CSV for testing and prototyping.

## Real-World Use Cases
- Seeding a local database for pagination and performance testing.
- Creating realistic mock APIs for frontend development before the backend is ready.
- Generating dummy user lists for UI mockups.

## MVP Scope
- UI to define a schema: Add/remove columns, specify column name, and select data type (UUID, Full Name, Email, Job Title, Avatar URL, Paragraph, etc.).
- Input for the number of rows to generate (e.g., 10 to 1000).
- Live preview of the first few generated rows in a table.
- Export as JSON array or CSV string.
- **MCP Server Context:** An AI agent can use this tool to generate 500 realistic users and autonomously seed a SQLite database to test an application's pagination logic.

## Browser-Local Constraints
- Generation must be synchronous or use web workers locally.
- Large datasets should be generated as Blobs for downloading to prevent browser memory crashes.

## Suggested OSS Foundation
- Project: @faker-js/faker
- Repo: https://github.com/faker-js/faker
- License: MIT
- Why: The most comprehensive, actively maintained library for generating massive amounts of realistic fake data in the browser and Node.

## Implementation Steps
1. Build a dynamic form builder where users can define their data schema (Field Name + Faker Method).
2. Wire up `@faker-js/faker` to map selected types to generation functions.
3. Generate a preview subset (e.g., 5 rows) automatically as the schema changes.
4. Add a "Generate & Download" button that processes the full requested row count and triggers a file download (JSON/CSV).

## Validation Checklist
- Supports at least 10 common data types (UUID, Name, Email, Address, Date, Company, etc.).
- Safely generates 1,000 rows without freezing the UI.
- CSV export correctly escapes commas in generated text (like addresses).