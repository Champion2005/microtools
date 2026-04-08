---
name: web-dev
description: 'Build and refine React + Tailwind features for this repository. Use when adding interfaces, wiring component state, improving responsive behavior, or fixing frontend bugs.'
argument-hint: 'Describe the feature, bug, or UX update you need'
---

# Web Dev Skill

## When To Use
- Building a new microtool interface in `src/`.
- Refactoring an existing component for readability and reuse.
- Improving responsive layout, hierarchy, or interaction quality.
- Fixing frontend bugs related to state, rendering, or styling.

## Procedure
1. Confirm the intended user workflow and success criteria.
2. Review relevant components and nearby styles before editing.
3. Implement changes with Tailwind-first styling and semantic HTML.
4. Validate accessibility basics (labels, focus, keyboard flow).
5. Run `npm run build` and report results.

## Quality Checklist
- Mobile-first layout works at narrow widths.
- Key actions are visible and clearly labeled.
- Empty, loading, and error behavior are handled when relevant.
- UI copy is concise and avoids jargon.

## References
- [Frontend checklist](./references/frontend-checklist.md)
