# QR Generator Plan

## Purpose
Generate high-quality QR codes for links, contact sharing, and operational workflows.

## Real-World Use Cases
- Share event links and registration pages.
- Generate Wi-Fi QR cards for offices or meetings.
- Print QR labels for quick internal navigation.

## MVP Scope
- Input text with templates: URL, plain text, Wi-Fi, vCard.
- Size and error-correction controls.
- Live QR preview.
- Download as PNG and SVG.
- Copy input payload button.

## Browser-Local Constraints
- Generate QR codes on-device in the browser.
- No server-side rendering for QR images.
- Keep payload content local.

## Suggested OSS Foundation
- Project: node-qrcode
- Repo: https://github.com/soldair/node-qrcode
- License: MIT
- Why: Popular and reliable QR generation library with browser support and multiple output formats.

## Implementation Steps
1. Build template selector and structured input form.
2. Convert template form values into final payload string.
3. Generate PNG canvas preview and SVG output.
4. Add download buttons and filename helper.
5. Add payload validation with friendly error messages.

## UX States
- Empty: Show sample payload and template examples.
- Loading: Minimal spinner during regeneration after edits.
- Error: Explain invalid payload format for selected template.

## Validation Checklist
- Generated QR scans correctly on Android and iOS.
- SVG and PNG outputs match the same payload.
- Supports long URL payloads with proper error correction.
- Maintains legibility at small sizes.
