# Specification

## Summary
**Goal:** Fix the production regression causing a blank screen by preventing runtime render crashes and ensuring the app always shows a non-blank UI (Shop by default or a clear fallback).

**Planned changes:**
- Identify and fix the runtime error(s) that prevent React from rendering in production, especially on initial load to the Shop view.
- Add a top-level error fallback screen that appears on unexpected render errors and includes “Reload” and “Go to Shop” recovery actions.
- Harden product image URL handling on Shop, Gallery, and Buy Product pages to safely handle missing/invalid image data with visible placeholders and English fallback text.
- Ensure invalid view state (e.g., Buy view without a selected product) renders a clear English fallback message with a button to return to Shop rather than rendering null/empty content.

**User-visible outcome:** The deployed site no longer shows a blank screen; the Header and Shop view (or a clear English fallback) render reliably, errors show an actionable recovery screen, and missing/invalid product image data or invalid view state does not crash the app.
