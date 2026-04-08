---
name: "Frontend Polish Pass"
description: "Polish an existing React + Tailwind UI for clarity, responsiveness, and accessibility."
argument-hint: "Point to the component or page to polish and list pain points"
agent: "agent"
---

Improve the targeted frontend area in this repository.

Checklist:
- Improve hierarchy and spacing without changing core behavior.
- Tighten copy for clarity.
- Ensure keyboard accessibility and semantic structure.
- Verify the layout at narrow and wide viewport sizes.
- Run `npm run build` and summarize what changed.

Context from user:
- Target area: ${input:target}
- Problems noticed: ${input:issues}
