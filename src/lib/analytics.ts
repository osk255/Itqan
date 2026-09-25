// Vendor-neutral conversion events (docs/seo/ANALYTICS_PLAN.md).
//
// Events are pushed to `window.dataLayer`, the queue Google Tag Manager and
// GA4 read. Until the client approves an analytics tool (CLIENT_QUESTIONS #6),
// nothing reads the queue and no third-party script is loaded, so this has no
// privacy impact. Never put personal data (names, emails, phone numbers,
// message text) in an event.

export type AnalyticsEvent =
  | "contact_submit" // enquiry form sent successfully
  | "cooperation_cta_click" // any "Become a Partner" / cooperation enquiry link
  | "email_click" // mailto: link
  | "phone_click" // tel: link
  | "product_view"; // a product page was viewed

type Params = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  (window.dataLayer ??= []).push({ event, page_path: location.pathname, ...params });
}

/**
 * Classifies a clicked link into a conversion event, if it is one.
 * `link_location` says where on the page it was (header, footer, …).
 */
export function trackLinkClick(a: HTMLAnchorElement) {
  const href = a.getAttribute("href") ?? "";
  const where = a.closest("header, footer, nav#mobile-menu") ? (a.closest("footer") ? "footer" : "header") : "content";
  if (href.startsWith("tel:")) track("phone_click", { link_location: where });
  else if (href.startsWith("mailto:")) track("email_click", { link_location: where });
  else if (href.includes("/contact-us/?type=cooperation")) track("cooperation_cta_click", { link_location: where, link_text: (a.textContent ?? "").replace(/[→↗]/g, "").trim() });
}
