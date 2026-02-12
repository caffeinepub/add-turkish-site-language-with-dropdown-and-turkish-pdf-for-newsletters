# Specification

## Summary
**Goal:** Add a Turkish language option to the site with a dropdown language picker, full Turkish UI translations, and language-specific newsletter PDF selection.

**Planned changes:**
- Update the language picker UI to a dropdown with exactly two options (English default, Türkçe) and show the currently selected language in the header.
- Add a single, consistent source of truth for Turkish translations covering all user-facing UI text (including newsletter labels/buttons and PDF viewer controls) and ensure language switching updates all visible strings.
- Implement language-specific PDF selection for Newsletter 1 so English opens the existing English PDF and Turkish opens the provided Turkish PDF, updating immediately when the language is switched (no refresh).
- Ensure no assistant/AI credit or “built by/powered by” attribution text appears anywhere in the UI.

**User-visible outcome:** Users can switch between English and Türkçe from a header dropdown; the entire site UI text updates to the selected language, and Newsletter 1 opens the matching English or Turkish PDF without reloading the page.
