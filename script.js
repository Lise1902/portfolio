// =====================================================
// Lise Bousquet — Portfolio
// Slide 1: THE CLOUD HANDSHAKE
// A visual story only — no real login, no data asked.
// =====================================================

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- page parts ----
const $ = (id) => document.getElementById(id);
const login        = $("login");
const portfolio    = $("portfolio");
const card         = $("auth-card");
const title        = $("auth-title");
const text         = $("auth-text");
const sub          = $("auth-sub");
const statusEl     = $("auth-status");
const handshakeBtn = $("handshake-btn");
const steps        = $("steps");
const stepItems    = [...steps.querySelectorAll(".step")];
const progressBox  = $("progress");
const progressFill = $("progress-fill");
const modal        = $("modal");
const enterBtn     = $("enter-btn");
const scene        = $("cloud-scene");
const fillRect     = $("fill-rect");
const cloudStatus  = $("cloud-status-text");
const linkLayer    = $("link-layer");
const linkParts    = ["link-glow", "link-path", "link-core", "link-flow", "link-pulse"].map($);
const linkPath     = $("link-path");
const linkStart    = $("link-start");
const linkEnd      = $("link-end");
const linkDot      = $("link-dot");
const burst        = $("light-burst");
document.body.appendChild(burst);   // keep the light visible while slide 1 hides

// starting texts, so "Replay" can put them back
const START = {
  title: title.textContent, text: text.textContent,
  sub: sub.textContent, status: statusEl.textContent
};

// ---- timing ----
const TRAVEL    = reduceMotion ? 0 : 900;     // pulse travels console → cloud
const STEP_TIME = reduceMotion ? 250 : 950;   // one stage
const TOTAL     = TRAVEL + STEP_TIME * stepItems.length;

let timers = [];
let rafs = {};
function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
function clearAll() {
  timers.forEach(clearTimeout); timers = [];
  Object.values(rafs).forEach(cancelAnimationFrame); rafs = {};
}
function show(el) { el.hidden = false; el.classList.remove("fade-in"); void el.offsetWidth; el.classList.add("fade-in"); }

// =====================================================
// The fiber-optic line: from the console to the cloud
// =====================================================
// Convert a point of the cloud drawing (600×520 units) into page pixels
function cloudPoint(x, y) {
  const m = scene.getScreenCTM();
  if (!m) return null;
  const p = scene.createSVGPoint(); p.x = x; p.y = y;
  const s = p.matrixTransform(m);
  const box = linkLayer.getBoundingClientRect();
  return { x: s.x - box.left, y: s.y - box.top };
}

function drawLink() {
  const box = linkLayer.getBoundingClientRect();
  const a = card.getBoundingClientRect();
  const stacked = a.top > scene.getBoundingClientRect().bottom - 40;   // phone layout: cloud above the console
  let x1, y1, x2, y2, d;

  if (!stacked) {
    // desktop: right side of the console (button height) → left edge of the cloud
    const anchor = [handshakeBtn, steps].find((el) => !el.hidden) || card;
    const b = anchor.getBoundingClientRect();
    x1 = a.right - box.left;
    y1 = b.top + b.height / 2 - box.top;
    const end = cloudPoint(92, 372);
    if (!end) return;
    ({ x: x2, y: y2 } = end);
    // the cable hangs down a little between the box and the cloud: longer, like a real fiber cable
    const dx = x2 - x1, sag = Math.max(y1, y2) + Math.min(140, Math.abs(dx) * 0.45);
    d = `M${x1},${y1} C${x1 + dx * 0.3},${sag} ${x1 + dx * 0.7},${sag} ${x2},${y2}`;
  } else {
    // phone: top of the console → bottom of the cloud
    x1 = a.left + a.width / 2 - box.left;
    y1 = a.top - box.top;
    const end = cloudPoint(310, 462);
    if (!end) return;
    ({ x: x2, y: y2 } = end);
    d = `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`;
  }
  linkParts.forEach((p) => p.setAttribute("d", d));
  linkStart.setAttribute("cx", x1); linkStart.setAttribute("cy", y1);
  linkEnd.setAttribute("cx", x2);   linkEnd.setAttribute("cy", y2);
}

// keep the line attached: on resize, after fonts load, and while the cloud floats
function keepLinked() {
  drawLink();
  rafs.link = requestAnimationFrame(keepLinked);
}
window.addEventListener("resize", drawLink);
document.fonts && document.fonts.ready.then(drawLink);
window.addEventListener("load", () => { drawLink(); if (!reduceMotion) keepLinked(); });

// a bright pulse that travels along the line
function sendPulse(duration, repeat) {
  const start = performance.now();
  (function move(t) {
    const len = linkPath.getTotalLength();
    let p = (t - start) / duration;
    if (repeat) p = p % 1; else p = Math.min(1, p);
    const eased = repeat ? p : 1 - Math.pow(1 - p, 2);
    const pt = linkPath.getPointAtLength(eased * len);
    linkDot.setAttribute("cx", pt.x); linkDot.setAttribute("cy", pt.y);
    if (repeat || p < 1) rafs.pulse = requestAnimationFrame(move);
  })(start);
}

// the cloud fills with sky blue
function fillCloud(duration) {
  const start = performance.now();
  (function step(t) {
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(1 - p, 2);
    fillRect.setAttribute("width", 490 * eased);
    if (p < 1) rafs.fill = requestAnimationFrame(step);
  })(start);
}
function fillBar(duration) {
  const start = performance.now();
  (function step(t) {
    const p = Math.min(1, (t - start) / duration);
    progressFill.style.width = (p * 100) + "%";
    if (p < 1) rafs.bar = requestAnimationFrame(step);
  })(start);
}

// =====================================================
// STEP 2 — the handshake
// =====================================================
function startHandshake() {
  card.dataset.state = "connecting";
  title.textContent = "Handshake in progress";
  text.textContent = "Connecting to my Cloud…";
  sub.textContent = "Transmitting secure packets...";
  statusEl.textContent = "CONNECTING";
  cloudStatus.textContent = "INCOMING CONNECTION";

  handshakeBtn.hidden = true;
  show(steps); show(progressBox);
  drawLink();
  linkLayer.classList.add("on");
  fillBar(TOTAL);

  // 1) the pulse travels to the cloud…
  if (!reduceMotion) sendPulse(TRAVEL, false);
  // 2) …and the cloud lights up when it arrives
  later(() => {
    scene.classList.add("connecting");
    cloudStatus.textContent = "HANDSHAKE IN PROGRESS";
    fillCloud(STEP_TIME * stepItems.length);
    if (!reduceMotion) sendPulse(900, true);   // data keeps flowing
  }, TRAVEL);

  // 3) the three stages, one after the other
  stepItems.forEach((li, i) => {
    later(() => li.classList.add("active"), TRAVEL * 0.3 + i * STEP_TIME);
    later(() => { li.classList.remove("active"); li.classList.add("done"); }, TRAVEL + (i + 1) * STEP_TIME - 120);
  });
  later(success, TOTAL + 250);
}

// =====================================================
// STEP 3 — success
// =====================================================
function success() {
  cancelAnimationFrame(rafs.pulse);
  linkLayer.classList.remove("on");
  linkLayer.classList.add("solid");
  scene.classList.remove("connecting");
  scene.classList.add("connected", "cheer");
  later(() => scene.classList.remove("cheer"), 800);
  fillRect.setAttribute("width", 490);

  // the panel shows a finished status (steps stay checked)
  card.dataset.state = "success";
  title.textContent = "Connection complete";
  text.textContent = "All security checks passed.";
  sub.textContent = "Connection secured · end-to-end encrypted";
  statusEl.textContent = "CONNECTED";
  cloudStatus.textContent = "CONNECTED · ENCRYPTED";
  progressBox.hidden = true;

  // then the central ACCESS GRANTED modal
  later(openModal, reduceMotion ? 0 : 500);
}

// =====================================================
// Central modal
// =====================================================
function openModal() {
  modal.classList.remove("closing");
  modal.hidden = false;
  document.body.classList.add("modal-open");
  enterBtn.focus({ preventScroll: true });
}
function closeModal(after) {
  if (modal.hidden) { if (after) after(); return; }
  if (reduceMotion) {
    modal.hidden = true; document.body.classList.remove("modal-open");
    if (after) after(); return;
  }
  modal.classList.add("closing");
  later(() => {
    modal.hidden = true;
    modal.classList.remove("closing");
    document.body.classList.remove("modal-open");
    if (after) after();
  }, 300);
}
// keep keyboard focus inside the modal while it is open
modal.addEventListener("keydown", (e) => {
  if (e.key === "Tab") { e.preventDefault(); enterBtn.focus(); }
});

// =====================================================
// STEP 4 — enter the portfolio (from the modal button)
// =====================================================
function enterPortfolio() {
  clearAll();
  closeModal(playEntry);
}
function playEntry() {
  if (reduceMotion) return openPortfolio();
  const c = scene.getBoundingClientRect();
  burst.style.setProperty("--x", (c.left + c.width / 2) + "px");
  burst.style.setProperty("--y", (c.top + c.height * 0.6) + "px");
  burst.className = "light-burst go";
  later(() => {
    openPortfolio();
    burst.className = "light-burst fade";
    later(() => { burst.className = "light-burst"; }, 750);
  }, 950);
}

function openPortfolio() {
  clearAll();
  modal.hidden = true; modal.classList.remove("closing");
  document.body.classList.remove("modal-open");
  login.hidden = true;
  portfolio.hidden = false;
  document.body.classList.remove("locked");
  window.scrollTo(0, 0);
  if (window.startTour) window.startTour();
}

// =====================================================
// Replay — back to the start
// =====================================================
function resetIntro() {
  clearAll();
  burst.className = "light-burst";
  card.dataset.state = "idle";
  title.textContent = START.title;
  text.textContent = START.text;
  sub.textContent = START.sub;
  statusEl.textContent = START.status;
  cloudStatus.textContent = "AWAITING CONNECTION";

  modal.hidden = true; modal.classList.remove("closing");
  document.body.classList.remove("modal-open");
  handshakeBtn.hidden = false;
  steps.hidden = true; progressBox.hidden = true;
  stepItems.forEach((li) => li.classList.remove("active", "done"));
  progressFill.style.width = "0";
  fillRect.setAttribute("width", 0);
  scene.classList.remove("connecting", "connected", "cheer");
  linkLayer.classList.remove("on", "solid");

  portfolio.hidden = true;
  login.hidden = false;
  document.body.classList.add("locked");
  window.scrollTo(0, 0);
  drawLink();
  if (!reduceMotion) keepLinked();
  handshakeBtn.focus({ preventScroll: true });
}

// =====================================================
// Portfolio menu: highlight the page you are reading
// =====================================================
// Every section carries data-nav="<page>": several sections can belong to the same page
// (e.g. "Meet Lise" = intro + globe + game), and they all light up the same menu item.
// The active page = the last section whose top has passed a line at 30% of the screen.
// (Checked on every scroll, so page 1 stays active while you read it, even its bottom part.)
const menuLinks = [...document.querySelectorAll(".menu-links a")];
const navSections = [...document.querySelectorAll("[data-nav]:not(a)")];
let currentPage = null;
function updateActivePage() {
  const visible = navSections.filter((s) => s.offsetParent !== null);
  if (!visible.length) return;
  const line = window.innerHeight * 0.3;
  let page = visible[0].dataset.nav;
  visible.forEach((s) => { if (s.getBoundingClientRect().top <= line) page = s.dataset.nav; });
  // at the very bottom of the site, the last page is the one being read
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) page = visible[visible.length - 1].dataset.nav;
  if (page === currentPage) return;
  currentPage = page;
  document.body.dataset.page = page;                    // used by the travelling Lise
  window.dispatchEvent(new CustomEvent("pagechange", { detail: page }));
  menuLinks.forEach((a) => {
    const on = a.dataset.nav === page;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    // on phones the menu scrolls sideways: keep the active item in view
    // (only the menu bar moves sideways: scrollIntoView made the whole page jump on iPhone)
    if (on && window.innerWidth < 1100) {
      const bar = a.closest(".menu-links");
      if (bar && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: bar.scrollLeft + (a.getBoundingClientRect().left - bar.getBoundingClientRect().left) - (bar.clientWidth - a.offsetWidth) / 2, behavior: "smooth" });
    }
  });
}
let pageTick = false;
window.addEventListener("scroll", () => {
  if (pageTick) return;
  pageTick = true;
  requestAnimationFrame(() => { pageTick = false; updateActivePage(); });
}, { passive: true });
window.addEventListener("resize", updateActivePage);
window.addEventListener("load", updateActivePage);
// the portfolio appears after the handshake: check again a few times
[300, 1200, 2500].forEach((ms) => setTimeout(updateActivePage, ms));
document.addEventListener("click", () => setTimeout(updateActivePage, 900));

// ---- buttons (mouse, touch and keyboard all trigger "click") ----
handshakeBtn.addEventListener("click", startHandshake);
enterBtn.addEventListener("click", enterPortfolio);
$("skip")?.addEventListener("click", openPortfolio);
$("replay").addEventListener("click", resetIntro);

// =====================================================
// Page 1: the photo tilts gently with the mouse
// =====================================================
(function photoTilt() {
  const photo = document.getElementById("intro1-photo");
  if (!photo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  photo.addEventListener("mousemove", (e) => {
    const r = photo.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    photo.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
  });
  photo.addEventListener("mouseleave", () => { photo.style.transform = ""; });
})();

// =====================================================
// Mini Lise: a small copy of the home page avatar (on her floating cloud)
// in the top-right corner of pages 1, 2, 3 and 5. Same drawing, same moves.
// =====================================================
(function miniLise() {
  const src = document.getElementById("cloud-scene");
  if (!src) return;
  document.querySelectorAll(".mini-lise, .guide-host, .tour-host").forEach((slot, i) => {
    const svg = src.cloneNode(true);
    svg.removeAttribute("id");
    svg.setAttribute("class", "mini-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.removeAttribute("role"); svg.removeAttribute("aria-label");
    // keep only the avatar + cloud: no handshake effects
    svg.querySelectorAll(".pulses, .particles, .screen-check, [clip-path]").forEach((el) => el.remove());
    // give every id a unique name so the copies don't clash with each other
    svg.querySelectorAll("[id]").forEach((el) => {
      const oldId = el.id, newId = `${oldId}-mini${i}`;
      el.id = newId;
      svg.querySelectorAll("*").forEach((x) => {
        ["href", "fill", "filter", "clip-path"].forEach((attr) => {
          const v = x.getAttribute(attr);
          if (v && v.includes(`#${oldId}`)) x.setAttribute(attr, v.split(`#${oldId}`).join(`#${newId}`));
        });
      });
    });
    slot.appendChild(svg);
  });
})();

// =====================================================
// Travelling Lise: she glides down the right edge as the visitor scrolls,
// shows the current page in a bubble, and goes to the next page when clicked.
// She stays visible on every page.
// =====================================================
(function travellingLise() {
  const guide = document.getElementById("lise-guide");
  const fill = document.getElementById("lise-track-fill");
  const bubble = document.getElementById("guide-bubble");
  const main = document.getElementById("portfolio");
  if (!guide || !main) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const links = [...document.querySelectorAll(".menu-links a")];
  const order = links.map((a) => a.dataset.nav);
  const names = Object.fromEntries(links.map((a, i) => [a.dataset.nav, `${i + 1} · ${a.textContent.replace(/^\d/, "").trim()}`]));

  let ticking = false, lastY = window.scrollY, tiltTimer = null;
  function place() {
    ticking = false;
    const nav = document.querySelector(".menu");
    const top = nav ? nav.getBoundingClientRect().bottom + 12 : 80;
    const room = window.innerHeight - top - guide.offsetHeight - 16;
    const start = main.offsetTop, end = main.offsetTop + main.scrollHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, (window.scrollY - start) / Math.max(1, end - start)));
    guide.style.transform = `translateY(${top + p * room}px)`;
    if (fill) fill.style.height = `${p * 100}%`;

    // a small lean while moving: forward when going down, back when going up
    if (!reduce) {
      const dy = window.scrollY - lastY;
      guide.style.setProperty("--lean", `${Math.max(-8, Math.min(8, dy * 0.4))}deg`);
      clearTimeout(tiltTimer);
      tiltTimer = setTimeout(() => guide.style.setProperty("--lean", "0deg"), 160);
    }
    lastY = window.scrollY;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(place); } }, { passive: true });
  window.addEventListener("resize", place);
  new IntersectionObserver(() => place()).observe(main);   // first placement when the portfolio opens

  // bubble with the page name, shown for a moment on each new page
  let hideTimer = null;
  window.addEventListener("pagechange", (e) => {
    bubble.textContent = names[e.detail] || "";
    guide.classList.add("talk");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => guide.classList.remove("talk"), 2200);
  });

  // click (or Enter) on Lise: go to the next page
  function next() {
    const cur = document.body.dataset.page || order[0];
    const nextPage = order[(order.indexOf(cur) + 1) % order.length];
    const target = document.querySelector(`[data-nav="${nextPage}"]:not(a)`);
    if (target) target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  guide.addEventListener("click", next);
  guide.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } });
})();

// =====================================================
// Welcome tour: right after the handshake, Lise on her cloud
// greets the visitor in the middle of the screen, points at the menu,
// then flies to her guide spot on the right edge.
// Click (or any key) = next message. Each message also moves on by itself.
// =====================================================
(function welcomeTour() {
  const tour = document.getElementById("tour");
  const lise = document.getElementById("tour-lise");
  const textEl = document.getElementById("tour-text");
  const guide = document.getElementById("lise-guide");
  const menu = document.querySelector(".menu");
  if (!tour || !lise || !textEl || !guide) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const STEPS = [
    { text: "Welcome! I am Lise 👋" },
    { text: "Scroll to explore!" }
  ];
  let step = -1, typing = null, auto = null, running = false;

  function type(str) {
    clearInterval(typing);
    if (reduce) { textEl.textContent = str; return; }
    let i = 0; textEl.textContent = "";
    const chars = [...str];
    typing = setInterval(() => {
      textEl.textContent = chars.slice(0, ++i).join("");
      if (i >= chars.length) clearInterval(typing);
    }, 28);
  }

  function show(n) {
    step = n;
    const s = STEPS[n];
    menu && menu.classList.toggle("tour-glow", !!s.menu);
    lise.classList.toggle("look-up", !!s.menu);
    type(s.text);
    clearTimeout(auto);
    auto = setTimeout(nextStep, 1600 + s.text.length * 45);
  }

  function nextStep() {
    if (!running) return;
    if (step < STEPS.length - 1) show(step + 1); else flyAway();
  }

  // Lise flies from the centre to her small guide spot on the right
  function flyAway() {
    running = false;
    clearTimeout(auto); clearInterval(typing);
    menu && menu.classList.remove("tour-glow");
    window.dispatchEvent(new Event("scroll"));          // make sure the guide is in place
    const from = lise.getBoundingClientRect(), to = guide.getBoundingClientRect();
    const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    const dy = (to.top + to.height / 2) - (from.top + from.height / 2);
    const s = to.width / from.width;
    tour.classList.add("leaving");
    lise.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${s})`;
    setTimeout(finish, reduce ? 0 : 1000);
  }

  function finish() {
    running = false;
    clearTimeout(auto); clearInterval(typing);
    tour.hidden = true;
    tour.classList.remove("leaving", "on");
    lise.style.transform = "";
    menu && menu.classList.remove("tour-glow");
    document.body.classList.remove("touring");
    // the small guide says hello once it has landed
    guide.classList.add("talk");
    setTimeout(() => guide.classList.remove("talk"), 2600);
  }

  window.startTour = function () {
    if (reduce) return;                                  // no flying for people who turn animations off
    running = true;
    tour.hidden = false;
    document.body.classList.add("touring");
    requestAnimationFrame(() => tour.classList.add("on"));
    setTimeout(() => show(0), 500);
  };

  tour.addEventListener("click", () => {
    if (!running) return;
    // first click finishes the typing, the next one moves on
    const full = STEPS[step] && STEPS[step].text;
    if (full && textEl.textContent !== full) { clearInterval(typing); textEl.textContent = full; return; }
    nextStep();
  });
  document.addEventListener("keydown", (e) => {
    if (!running) return;
    if (e.key === "Escape") flyAway();
    else if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") { e.preventDefault(); nextStep(); }
  });
})();
