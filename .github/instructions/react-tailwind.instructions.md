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
- Treat dark mode as the default visual baseline for this project.
- Keep a modern, tech-forward visual style with consistent palette, contrast, and component rhythm.
- Do not use arbitrary Tailwind values (for example `px-[13px]`, `text-[#9ef]`, `shadow-[...]`).
- Use predefined Tailwind utilities first; if a value is missing, define it once in a shared theme and reuse it.
- Centralize custom design tokens in the Tailwind theme layer (`@theme` in a shared stylesheet) instead of one-off classes.
- Stick to the selected theme tokens for colors, spacing, radius, shadows, and typography across the app.
- Add brief comments only around non-obvious logic.
