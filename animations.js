// Trinity AI XR Hub — animation layer
// Motion (window.Motion, IIFE) owns scroll/viewport work: parallax, inView
// reveals, press micro-interactions. anime.js (ESM) owns the homepage hero
// entrance timeline. The html.anim class is the contract with styles.css:
// while present, JS owns initial-hidden states; removing it hands everything
// back to the CSS fallback path.

import {
  createTimeline,
  stagger as animeStagger,
  splitText,
} from "./assets/vendor/anime-4.5.0.esm.min.js";

const root = document.documentElement;
const M = window.Motion;
const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
const desktopQuery = matchMedia("(min-width: 781px)");
const scrollCancels = [];

if (!root.classList.contains("anim") || reducedQuery.matches || !M) {
  root.classList.remove("anim");
} else {
  reducedQuery.addEventListener("change", (e) => {
    if (!e.matches) return;
    root.classList.remove("anim");
    scrollCancels.forEach((cancel) => { try { cancel(); } catch (err) {} });
  });

  initReveals();
  initMicro();
  if (document.querySelector(".hero")) initHome();
  if (document.querySelector(".page-hero")) initInterior();
}

// ---------- Reveals (all pages): Motion inView + springs ----------

function initReveals() {
  const GROUPS = [
    [".rows", ".row"],
    [".pillars", ".pillar"],
    [".offer-grid", ".offer"],
    [".news-list", ".news-item"],
    [".core-team", ".core-member"],
    [".advisory", ".adv"],
    [".partners-row", "img"],
  ];

  M.inView(".reveal", (el) => {
    const group = GROUPS.find(([container]) => el.matches(container));
    if (group) {
      M.animate(el, { opacity: 1 }, { duration: 0.3 });
      M.animate(
        el.querySelectorAll(group[1]),
        { opacity: [0, 1], y: [18, 0] },
        { type: "spring", stiffness: 110, damping: 18, delay: M.stagger(0.08) }
      );
    } else {
      M.animate(
        el,
        { opacity: [0, 1], y: [22, 0] },
        { type: "spring", stiffness: 100, damping: 20 }
      );
    }
    // no return value: fire once per element, like the old IntersectionObserver
  }, { margin: "0px 0px -10% 0px" });
}

// ---------- Micro-interactions (all pages) ----------

function initMicro() {
  if (!M.press) return;
  M.press(".btn, .nav-cta", (el) => {
    M.animate(el, { scale: 0.965 }, { duration: 0.12 });
    return () =>
      M.animate(el, { scale: 1 }, { type: "spring", stiffness: 400, damping: 16 });
  });
}

// ---------- Homepage: bold hero ----------

function initHome() {
  const title = document.querySelector(".hero-title");
  if (title) {
    const lines = title.querySelectorAll(".line");
    const mark = title.querySelector(".mark");
    const split1 = splitText(lines[0], { words: false, chars: true });
    const split2 = splitText(lines[1], { words: false, chars: true });
    // Pre-hide chars so nothing flashes between the title fade-in and each
    // char's staggered start; the mark is hidden by its clip until the wipe.
    [...split1.chars, ...split2.chars].forEach((c) => { c.style.opacity = "0"; });
    if (mark) mark.style.clipPath = "inset(0 100% 0 0)";

    const tl = createTimeline({ defaults: { ease: "outExpo" } });
    tl.add(".hero-title", { opacity: [0, 1], duration: 50 }, 0)
      .add(split1.chars, { y: ["0.9em", "0em"], opacity: [0, 1], duration: 850, delay: animeStagger(26) }, 80)
      .add(split2.chars, { y: ["0.9em", "0em"], opacity: [0, 1], duration: 850, delay: animeStagger(26) }, 220)
      .add(".hero-title .line:nth-child(3)", { opacity: [0, 1], duration: 10 }, 480)
      .add(".hero-title .mark", { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], duration: 700, ease: "outQuint" }, 500)
      .add(".hero-lede", { opacity: [0, 1], y: [24, 0], duration: 700 }, 700)
      .add(".hero-ctas", { opacity: [0, 1], duration: 10 }, 800)
      .add(".hero-ctas .btn", { opacity: [0, 1], y: [18, 0], duration: 600, delay: animeStagger(90) }, 800)
      .add(".hero-note", { opacity: [0, 1], duration: 500 }, 980)
      .add(".hero-meta", { opacity: [0, 1], x: [-14, 0], duration: 600 }, 1050)
      // Blades and photo: OPACITY ONLY here — Motion's scroll() owns their transforms
      .add(".hero-blades", { opacity: [0, 1], duration: 1100 }, 150)
      .add(".hero-photo-bg", { opacity: [0, 1], duration: 1100 }, 250);
  }

  // Scroll-linked parallax (desktop only: the photo layer is hidden ≤780px)
  const hero = document.querySelector(".hero");
  if (hero && desktopQuery.matches) {
    const photo = hero.querySelector(".hero-photo-bg");
    const blades = hero.querySelector(".hero-blades");
    if (photo) {
      scrollCancels.push(M.scroll(
        M.animate(photo, { y: [0, 70] }, { ease: "linear" }),
        { target: hero, offset: ["start start", "end start"] }
      ));
    }
    if (blades) {
      scrollCancels.push(M.scroll(
        M.animate(blades, { x: [0, -60] }, { ease: "linear" }),
        { target: hero, offset: ["start start", "end start"] }
      ));
    }
    const wrap = hero.querySelector(".wrap");
    if (wrap) {
      scrollCancels.push(M.scroll(
        M.animate(wrap, { opacity: [1, 0.35], y: [0, -30] }, { ease: "linear" }),
        { target: hero, offset: ["center start", "end start"] }
      ));
    }
  }
}

// ---------- Interior pages: subtle banner entrance + parallax ----------

function initInterior() {
  const springIn = (selector, delay) => {
    const el = document.querySelector(selector);
    if (!el) return;
    M.animate(
      el,
      { opacity: [0, 1], y: [16, 0] },
      { type: "spring", stiffness: 90, damping: 20, delay }
    );
  };
  springIn(".page-hero h1", 0);
  springIn(".page-hero .lede", 0.1);
  springIn(".page-hero .btn", 0.18);

  const photo = document.querySelector(".page-hero-photo");
  if (photo && desktopQuery.matches) {
    scrollCancels.push(M.scroll(
      M.animate(photo, { y: [0, 44] }, { ease: "linear" }),
      { target: photo.closest(".page-hero"), offset: ["start start", "end start"] }
    ));
  }
}
