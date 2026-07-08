// src/utils/trackVisits.js
// Fires one visit-tracking request per page view.

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function detectSource() {
  const params = new URLSearchParams(window.location.search);
  const utm = params.get("utm_source");
  if (utm) return utm.toLowerCase();

  const ref = document.referrer;
  if (!ref) return "direct";
  if (ref.includes("google.")) return "google";
  if (ref.includes("facebook.") || ref.includes("fb.")) return "facebook";
  if (ref.includes("wa.me") || ref.includes("whatsapp")) return "whatsapp";
  return "referral";
}

export function trackVisit(page = window.location.pathname) {
  // One count per page per browser tab per session — avoids double-counting
  // on re-renders, back/forward nav, or React strict-mode double effects.
  const key = `visited:${page}`;
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");

  fetch(`${API_BASE}/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, source: detectSource() }),
    keepalive: true, // lets the request finish even if the user navigates away immediately
  }).catch(() => {
    /* silently ignore — never let analytics break the site */
  });
}