# Frontend Checklist

Use this checklist before finalizing a UI change.

## UX
- Primary action is obvious within 3 seconds.
- Important information appears above the fold on common laptop sizes.
- Copy is short, direct, and aligned with user intent.

## Responsive
- Layout works at ~360px width and at desktop widths.
- Components do not overflow horizontally.
- Spacing scale remains consistent across breakpoints.

## Accessibility
- Inputs and buttons have clear text labels.
- Focus styles are visible when navigating with keyboard.
- Heading order is logical and not skipped.

## Performance
- Avoid unnecessary re-renders or heavy runtime work in render paths.
- Defer large data transforms into memoized helpers when needed.
