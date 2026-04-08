---
description: "Use when creating or editing React components or styles in this repository. Covers structure, Tailwind usage, responsive behavior, and accessibility checks."
name: "React Tailwind Web Dev"
applyTo: "src/**/*.{js,jsx,ts,tsx,css}"
---

# React + Tailwind Guidance

- Keep component logic straightforward and move complex transforms into pure helper functions.
- Prefer composition over deeply nested conditional rendering.
- Use clear section landmarks (`header`, `main`, `section`, `footer`) for page-level layouts.
- Ensure controls have accessible labels and visible focus states.
- Design with small screens first, then add larger breakpoints intentionally.
- Reuse spacing, typography, and radius patterns to keep the UI coherent.
- Add brief comments only around non-obvious logic.
