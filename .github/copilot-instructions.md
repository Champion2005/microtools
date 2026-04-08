# Project Guidelines

## Stack
- Frontend uses Vite, React, and Tailwind CSS.
- Keep app code under `src/` and prefer colocating component-specific helpers.

## Build And Run
- Install dependencies with `npm install`.
- Run local development with `npm run dev`.
- Validate production output with `npm run build`.

## Frontend Conventions
- Build mobile-first layouts, then scale for tablet and desktop.
- Use semantic HTML and keep keyboard and screen-reader access in mind.
- Keep components focused; extract repeated UI into reusable pieces.
- Prefer Tailwind utility classes before adding custom CSS.
- Design for dark mode by default with a modern, tech-forward look.
- Avoid arbitrary Tailwind values; use predefined utilities or shared theme tokens.
- When custom values are needed, define them in a centralized theme and reuse them consistently.

## Change Quality
- For UI changes, include visible loading, empty, and error states when relevant.
- Keep copy concise and action-oriented.
- Avoid introducing heavy dependencies for small utility behavior.
