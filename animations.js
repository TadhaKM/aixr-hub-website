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
// Matches the CSS breakpoint where banner photos stop being woven side
// layers and restack as strips — parallax only makes sense above it.
const desktopQuery = matchMedia("(min-width: 881px)");
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
  initMedia();
  initMicro();
  initProgress();
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
    [".split-media", ":scope > *"],
  ];

  M.inView(".reveal", (el) => {
    // lets CSS draw the accent rule under a section heading on entry
    el.classList.add("is-in");
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

// ---------- Photographs wipe open as they enter view ----------

function initMedia() {
  const photos = document.querySelectorAll(".split-media img");
  if (!photos.length) return;

  M.inView(photos, (el) => {
    // Wipe once. inView re-fires every time an element re-enters the
    // viewport, and a second animation cancels the first — which rejects the
    // first `finished` promise and used to strand that photo clipped after a
    // fast scroll.
    if (el.dataset.wiped) return;
    el.dataset.wiped = "1";

    const anim = M.animate(
      el,
      { clipPath: ["inset(0 0 100% 0)", "inset(0 0 0% 0)"] },
      { duration: 0.95, ease: [0.16, 1, 0.3, 1] }
    );

    // clip-path clips everything the element paints — box-shadow and focus
    // outline included — so the clip has to go once the wipe settles. One
    // frame after `finished`, because Motion commits the final keyframe to
    // inline style after the promise resolves. Both handlers plus a timeout:
    // a photo must never be left invisible if any of this misfires.
    const clear = () => requestAnimationFrame(() => { el.style.clipPath = "none"; });
    if (anim && anim.finished && anim.finished.then) anim.finished.then(clear, clear);
    setTimeout(clear, 1400);
  }, { margin: "0px 0px -12% 0px" });
}

// ---------- Micro-interactions (all pages) ----------

function initMicro() {
  if (!M.press) return;
  // .to-top is deliberately absent: it needs its own transform for the
  // show/hide and hover states, and Motion's press would leave an inline
  // transform behind that outranks them. It presses via CSS :active instead.
  M.press(".btn, .nav-cta", (el) => {
    M.animate(el, { scale: 0.965 }, { duration: 0.12 });
    return () =>
      M.animate(el, { scale: 1 }, { type: "spring", stiffness: 400, damping: 16 });
  });
}

// ---------- Reading-progress bar in the sticky header ----------

function initProgress() {
  const bar = document.querySelector(".scroll-progress > span");
  if (!bar || !M.scroll) return;
  scrollCancels.push(
    M.scroll(M.animate(bar, { scaleX: [0, 1] }, { ease: "linear" }))
  );
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
    // The HEA funding line opens the hero, ahead of the headline
    tl.add(".hero-note", { opacity: [0, 1], x: [-16, 0], duration: 600 }, 0)
      .add(".hero-title", { opacity: [0, 1], duration: 50 }, 120)
      .add(split1.chars, { y: ["0.9em", "0em"], opacity: [0, 1], duration: 850, delay: animeStagger(26) }, 200)
      .add(split2.chars, { y: ["0.9em", "0em"], opacity: [0, 1], duration: 850, delay: animeStagger(26) }, 340)
      .add(".hero-title .line:nth-child(3)", { opacity: [0, 1], duration: 10 }, 600)
      .add(".hero-title .mark", { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], duration: 700, ease: "outQuint" }, 620)
      .add(".hero-lede", { opacity: [0, 1], y: [24, 0], duration: 700 }, 820)
      .add(".hero-ctas", { opacity: [0, 1], duration: 10 }, 920)
      .add(".hero-ctas .btn", { opacity: [0, 1], y: [18, 0], duration: 600, delay: animeStagger(90) }, 920)
      .add(".hero-meta", { opacity: [0, 1], x: [-14, 0], duration: 600 }, 1080)
      // Blades and photo: OPACITY ONLY here — Motion's scroll() owns their transforms
      .add(".hero-blades", { opacity: [0, 1], duration: 1100 }, 150)
      .add(".hero-photo-bg", { opacity: [0, 1], duration: 1100 }, 250);
  }

  // Scroll-linked parallax (desktop only: below 881px the photo layer is a
  // stacked strip in normal flow, where a parallax offset would leave a gap)
  const hero = document.querySelector(".hero");
  if (hero && desktopQuery.matches) {
    const photo = hero.querySelector(".hero-photo-bg");
    const blades = hero.querySelector(".hero-blades");
    if (photo) {
      scrollCancels.push(M.scroll(
        M.animate(photo, { y: [0, 40] }, { ease: "linear" }),
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

// ---------- Interior pages: banner entrance + parallax ----------

function initInterior() {
  const springIn = (el, delay) => {
    if (!el) return;
    M.animate(
      el,
      { opacity: [0, 1], y: [16, 0] },
      { type: "spring", stiffness: 90, damping: 20, delay }
    );
  };

  // The heading reveals word by word; if the split fails for any reason the
  // heading still springs in as one block rather than being left hidden.
  const h1 = document.querySelector(".page-hero h1");
  let split = null;
  if (h1) {
    try {
      split = splitText(h1, { words: true, chars: false });
    } catch (err) {
      split = null;
    }
  }

  if (split && split.words && split.words.length) {
    // hand the hiding over to the words before un-hiding the heading itself,
    // so there is no frame where the full heading flashes into view
    split.words.forEach((w) => { w.style.opacity = "0"; });
    h1.style.opacity = "1";
    M.animate(
      split.words,
      { opacity: [0, 1], y: [22, 0] },
      { type: "spring", stiffness: 110, damping: 19, delay: M.stagger(0.035) }
    );
  } else {
    springIn(h1, 0);
  }

  springIn(document.querySelector(".page-hero .lede"), 0.14);
  springIn(document.querySelector(".page-hero .btn"), 0.24);

  const photo = document.querySelector(".page-hero-photo");
  if (photo && desktopQuery.matches) {
    scrollCancels.push(M.scroll(
      M.animate(photo, { y: [0, 44] }, { ease: "linear" }),
      { target: photo.closest(".page-hero"), offset: ["start start", "end start"] }
    ));
  }
}
