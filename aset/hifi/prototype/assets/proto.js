/* global document, window, URLSearchParams, setTimeout */
// Evora high-fi click prototype (NVA-8). Design reference only, not production code.
// URL params for rendering frames: ?frame=1 (hide prototype panel), ?menu=open, ?scrolled=1,
// ?topic=project-inquiry, ?state=error|sending|success|fail|ratelimit|over (contact page).

const EMAIL = "naufalhanifr001@gmail.com";
const params = new URLSearchParams(window.location.search);
const page = document.body.dataset.page;
if (params.get("frame")) document.body.classList.add("is-frame");

const ICON = {
  menu: '<svg class="icon-open" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close:
    '<svg class="icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  alert:
    '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13Zm-.75 3.25h1.5v4.5h-1.5v-4.5Zm0 5.75h1.5V12h-1.5v-1.5Z"/></svg>',
  alertLg:
    '<svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1 5h2v7h-2V7Zm0 9h2v2h-2v-2Z"/></svg>',
  check:
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5 12 13l8.5-6.5"/></svg>',
};

const NAV = [
  { href: "index.html", label: "Home", key: "home", desktop: false },
  { href: "about.html", label: "About", key: "about", desktop: true },
  { href: "services.html", label: "Services", key: "services", desktop: true },
];
const cur = (k) => (k === page ? ' aria-current="page"' : "");

function header() {
  const desk = NAV.filter((n) => n.desktop)
    .map((n) => `<a href="${n.href}"${cur(n.key)}>${n.label}</a>`)
    .join("");
  const mob = NAV.map(
    (n) => `<li><a class="menu-item" href="${n.href}"${cur(n.key)}>${n.label}</a></li>`,
  ).join("");
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header" id="site-header">
    <div class="container site-header__bar">
      <a class="logo" href="index.html"><img src="../../../public/brand/evora-wordmark-on-light.svg" alt="Evora" width="121" height="24"></a>
      <nav class="nav" aria-label="Main">${desk}</nav>
      <a class="btn btn--primary btn--sm" href="contact.html"${page === "contact" ? ' aria-current="page"' : ""}>Contact us</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">${ICON.menu}${ICON.close}</button>
    </div>
    <div class="mobile-menu" id="mobile-menu" aria-label="Menu" role="dialog" aria-modal="true">
      <nav aria-label="Main"><ul>${mob}</ul></nav>
      <div class="mobile-menu__cta"><a class="btn btn--primary btn--block" href="contact.html">Contact us</a></div>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer on-dark">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html"><img src="../../../public/brand/evora-wordmark-on-dark.svg" alt="Evora" width="162" height="32"></a>
          <p>Design, motion, and web, built by one team.</p>
        </div>
        <div class="footer-col">
          <h2>Navigation</h2>
          <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("")}<li><a href="contact.html">Contact</a></li></ul>
        </div>
        <div class="footer-col">
          <h2>Contact</h2>
          <ul><li><a href="mailto:${EMAIL}">${EMAIL}</a></li></ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 <span class="tbc">[TBC-10: legal entity name]</span></span>
        <a href="privacy.html">Privacy Policy</a>
      </div>
    </div>
  </footer>`;
}

document.getElementById("header-slot")?.insertAdjacentHTML("afterend", header());
document.getElementById("header-slot")?.remove();
document.getElementById("footer-slot")?.insertAdjacentHTML("afterend", footer());
document.getElementById("footer-slot")?.remove();

// ---------- Sticky header shadow ----------
const hdr = document.getElementById("site-header");
const onScroll = () =>
  hdr?.classList.toggle("is-scrolled", window.scrollY > 8 || !!params.get("scrolled"));
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile menu: aria-expanded, focus trap, Esc, scroll lock ----------
const btn = document.querySelector(".menu-btn");
const menu = document.getElementById("mobile-menu");
function setMenu(open, focusBack = true) {
  if (!btn || !menu) return;
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menu.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
  if (open) menu.querySelector("a")?.focus({ preventScroll: true });
  else if (focusBack) btn.focus();
}
btn?.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
document.addEventListener("keydown", (e) => {
  if (!menu?.classList.contains("is-open")) return;
  if (e.key === "Escape") setMenu(false);
  if (e.key === "Tab") {
    const f = [btn, ...menu.querySelectorAll("a")];
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) {
      e.preventDefault();
      f[f.length - 1].focus();
    } else if (!e.shiftKey && i === f.length - 1) {
      e.preventDefault();
      f[0].focus();
    }
  }
});
if (params.get("menu") === "open") {
  setMenu(true, false);
  menu?.querySelector("a")?.blur();
}

// ---------- Contact form ----------
const form = document.getElementById("contact-form");
if (form) initForm(form);

function initForm(form) {
  const $ = (s) => form.querySelector(s);
  const topic = $("#topic");
  const t = params.get("topic");
  if (t && topic.querySelector(`option[value="${t}"]`)) topic.value = t;

  const msg = $("#message");
  const counter = $("#message-count");
  const fmt = (n) => n.toLocaleString("en-US");
  const count = () => {
    const n = msg.value.length;
    counter.textContent = `${fmt(n)} / 5,000`;
    counter.classList.toggle("is-over", n > 5000);
  };
  msg.addEventListener("input", count);

  const RULES = {
    name: (v) => (v.trim() ? "" : "Enter your name."),
    email: (v) =>
      !v.trim()
        ? "Enter your email address."
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ""
          : "Enter a valid email address, for example name@example.com.",
    topic: (v) => (v ? "" : "Choose a topic."),
    message: (v) =>
      !v.trim()
        ? "Enter your message."
        : v.length > 5000
          ? `Your message can be up to 5,000 characters. It is now ${fmt(v.length)}.`
          : "",
    consent: (_, el) => (el.checked ? "" : "Check the box to agree before sending."),
  };
  const LABEL = {
    name: "Name",
    email: "Email",
    topic: "Topic",
    message: "Message",
    consent: "Privacy consent",
  };

  function validateField(id) {
    const el = $("#" + id);
    const err = RULES[id](el.value, el);
    const field = el.closest(".field");
    const out = $("#" + id + "-error");
    if (err) {
      field.setAttribute("data-invalid", "");
      el.setAttribute("aria-invalid", "true");
      out.querySelector("span").textContent = err;
    } else {
      field.removeAttribute("data-invalid");
      el.removeAttribute("aria-invalid");
    }
    return err;
  }
  Object.keys(RULES).forEach((id) =>
    $("#" + id).addEventListener(id === "consent" ? "change" : "blur", () => {
      if (
        $("#" + id)
          .closest(".field")
          .hasAttribute("data-invalid")
      )
        validateField(id);
    }),
  );

  const status = document.getElementById("form-status");
  const submit = $("#submit");
  function showBanner(html, focus) {
    status.innerHTML = html;
    status.hidden = false;
    if (focus) status.firstElementChild.focus();
  }
  function clearBanner() {
    status.innerHTML = "";
    status.hidden = true;
  }

  function summary(errs) {
    const items = errs
      .map(([id]) => `<li><a class="link" href="#${id}">${LABEL[id]}</a></li>`)
      .join("");
    const n = errs.length;
    showBanner(
      `<div class="banner banner--error" tabindex="-1" aria-labelledby="sum-title">
        <span class="banner__icon">${ICON.alertLg}</span>
        <div><p class="banner__title" id="sum-title">${n === 1 ? "1 field needs" : n + " fields need"} your attention:</p>
        <ul>${items}</ul></div></div>`,
      true,
    );
  }

  function setSending(on) {
    submit.setAttribute("aria-busy", String(on));
    submit.innerHTML = on
      ? '<span class="spinner" aria-hidden="true"></span>Sending…'
      : submit.dataset.label;
  }

  function fail(kind) {
    const body =
      kind === "ratelimit"
        ? `Too many attempts in a short time. Please try again in a few minutes, or email us at <a class="link" href="mailto:${EMAIL}">${EMAIL}</a>.`
        : `Check your connection and try again. You can also email us at <a class="link" href="mailto:${EMAIL}">${EMAIL}</a>.`;
    const title = kind === "ratelimit" ? "Please wait a moment." : "Your message wasn’t sent.";
    showBanner(
      `<div class="banner banner--error" role="alert" tabindex="-1"><span class="banner__icon">${ICON.alertLg}</span>
       <div><p class="banner__title">${title}</p><p class="banner__body">${body}</p></div></div>`,
      !["fail", "ratelimit"].includes(params.get("state")),
    );
    submit.dataset.label = "Try again";
    submit.textContent = "Try again";
  }

  function success() {
    const name = $("#name").value.trim().split(" ")[0] || "there";
    const panel = document.getElementById("form-wrap");
    panel.innerHTML = `
      <div class="success-panel" role="status">
        <div class="success-panel__icon">${ICON.check}</div>
        <h2 class="t-h2" id="success-title" tabindex="-1">Message sent</h2>
        <p class="t-body-lg">Thanks, ${name}. Your message has reached our team.</p>
        <div class="actions">
          <a class="btn btn--secondary" href="index.html">Back to home</a>
          <a class="link-standalone" href="contact.html">Send another message <span class="arrow" aria-hidden="true">→</span></a>
        </div>
      </div>`;
    document.getElementById("success-title").focus({ preventScroll: !!params.get("frame") });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (submit.getAttribute("aria-busy") === "true") return;
    const errs = Object.keys(RULES)
      .map((id) => [id, validateField(id)])
      .filter(([, err]) => err);
    if (errs.length) return summary(errs);
    if ($("#website").value) return success(); // honeypot: pretend success, send nothing
    clearBanner();
    setSending(true);
    const outcome = document.querySelector('input[name="sim"]:checked')?.value || "success";
    setTimeout(() => {
      setSending(false);
      if (outcome === "success") success();
      else fail(outcome);
    }, 1400);
  });

  submit.dataset.label = submit.textContent;
  count();

  // Frame states
  const st = params.get("state");
  const fill = (over) => {
    $("#name").value = "Rani Pratama";
    $("#email").value = "rani@example.com";
    $("#org").value = "Studio Rani";
    topic.value = "project-inquiry";
    msg.value = over
      ? "x".repeat(5214)
      : "Hi! We’re planning a new website for our studio and would like help with the design and some simple animation. Could we talk about how you usually work?";
    $("#consent").checked = true;
    count();
  };
  if (st === "error") {
    $("#name").value = "Rani";
    $("#email").value = "rani@";
    topic.value = "project-inquiry";
    msg.value = "Hi! We’re planning a new website.";
    count();
    form.requestSubmit();
  } else if (st === "over") {
    fill(true);
    form.requestSubmit();
  } else if (st === "sending") {
    fill();
    setSending(true);
  } else if (st === "success") {
    fill();
    success();
  } else if (st === "fail" || st === "ratelimit") {
    fill();
    fail(st);
  } else if (st === "filled") {
    fill();
  }
}

// Prototype panel: collapsed on small screens so it doesn't cover the form.
const pp = document.querySelector(".proto-panel");
if (pp && window.innerWidth < 768) pp.open = false;

// Privacy TOC: collapsed by default below 1024px, always open on desktop.
const toc = document.querySelector(".toc details");
if (toc && window.innerWidth < 1024) toc.open = false;
