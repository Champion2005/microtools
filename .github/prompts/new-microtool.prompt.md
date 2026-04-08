---
name: "New Microtool UI"
description: "Create a new React + Tailwind interface for a microtool in this repository."
argument-hint: "Describe the microtool purpose, required inputs, and expected output"
agent: "agent"
---

Build a production-ready microtool UI in this codebase using React and Tailwind.

Requirements:
- Use a focused page or component structure under `src/`.
- Support mobile and desktop layouts.
- Include input validation and helpful empty states.
- Keep copy concise and clear.
- Run `npm run build` after changes and report results.

Inputs from user:
- Tool purpose: ${input:purpose}
- Inputs to collect: ${input:inputs}
- Output format: ${input:output}
