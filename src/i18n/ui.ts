// Single module for UI strings (PRD v0.2 §0/§10: English-only MVP, no i18n routing).
// Keep all user-facing copy here so a future locale can be added without touching components.

export const lang = "en" as const;

export const site = {
  name: "Evora",
  // Public contact address; used as the fallback in form error messages.
  // NOT the form delivery target (TBC-15 is still open).
  contactEmail: "naufalhanifr001@gmail.com",
} as const;

export const ui = {
  home: {
    title: "Evora",
    placeholder: "Placeholder scaffold. Page content will come from the frontend team.",
  },
  notFound: {
    title: "404 — Page not found | Evora",
    heading: "404",
    body: "Page not found.",
    back: "Back to home",
  },
  form: {
    errorFallback: `Something went wrong. Please email us at ${site.contactEmail}.`,
  },
} as const;
