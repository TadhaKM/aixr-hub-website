// Trinity AI XR Hub · shared behaviour
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Sticky header state
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("nav-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !document.body.classList.contains("nav-open")) return;
      // Consume it. Other document-level Escape handlers (VR view) would
      // otherwise see nav-open already cleared and treat the same keypress
      // as their own dismissal.
      e.stopImmediatePropagation();
      setOpen(false);
      toggle.focus();
    });
  }

  // Back to top: lives here rather than animations.js so it still works
  // when the animation module is unavailable
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    var trackTop = function () {
      toTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", trackTop, { passive: true });
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    trackTop();
  }

  // Scroll reveals live in animations.js (Motion inView + springs);
  // with the JS animation layer unavailable, .reveal content is simply visible.

  // Form submission lives in forms.js (Formspree for bookings, Mailchimp for
  // the mailing list). Both endpoints are configured at the top of that file.

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(min-width: 881px) and (hover: hover)");

  // ---------------------------------------------------------------
  // Photo lightbox — click (or Enter/Space) any content photo to see it
  // at full size. Built on demand so pages with no photos pay nothing.
  // ---------------------------------------------------------------
  var photos = document.querySelectorAll(".split-media img, .monogram--photo img");
  if (photos.length) {
    var box = null, boxImg = null, boxCap = null, lastFocus = null;
    var supportsInert = "inert" in HTMLElement.prototype;

    var buildBox = function () {
      box = document.createElement("div");
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Enlarged photo");
      box.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Close photo">' +
        '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" ' +
        'stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button><figure><img alt=""><figcaption></figcaption></figure>';
      document.body.appendChild(box);
      boxImg = box.querySelector("img");
      boxCap = box.querySelector("figcaption");

      box.querySelector(".lightbox-close").addEventListener("click", closeBox);
      box.addEventListener("click", function (e) {
        // only the backdrop closes, not the picture itself
        if (e.target === box || e.target.tagName === "FIGURE") closeBox();
      });
      // Fallback trap for browsers without inert; where inert is supported
      // the background is genuinely removed from the tab order instead.
      if (!supportsInert) {
        box.addEventListener("keydown", function (e) {
          if (e.key === "Tab") { e.preventDefault(); box.querySelector(".lightbox-close").focus(); }
        });
      }
    };

    // Hides the rest of the page from the tab order AND from screen readers
    // while the dialog is open — aria-modal alone does not do this.
    var inerted = [];
    var setBackgroundInert = function (on) {
      if (!supportsInert) return;
      if (on) {
        inerted = Array.prototype.filter.call(document.body.children, function (el) {
          return el !== box;
        });
        inerted.forEach(function (el) { el.inert = true; });
      } else {
        inerted.forEach(function (el) { el.inert = false; });
        inerted = [];
      }
    };

    var openBox = function (img) {
      if (!box) buildBox();
      lastFocus = img;
      boxImg.src = img.currentSrc || img.src;
      boxImg.alt = img.alt || "";
      boxCap.textContent = img.alt || "";
      boxCap.hidden = !img.alt;
      lockScroll(true);
      setBackgroundInert(true);
      // On the very first open the element was created this frame, so there
      // is no previous style to transition from. One frame's grace gives the
      // fade and the image scale-in something to animate away from. Focus
      // has to wait for the same frame: an element inside a
      // visibility:hidden subtree cannot take focus.
      requestAnimationFrame(function () {
        document.body.classList.add("lb-open");
        // and one more frame so the visibility change has actually been
        // applied — focus() is refused inside a visibility:hidden subtree
        requestAnimationFrame(function () {
          box.querySelector(".lightbox-close").focus();
        });
      });
    };

    // Locking body scroll removes the scrollbar, which would shunt the whole
    // page sideways by its width. Pad the same amount back on. The padding is
    // divided by the effective zoom because body is scaled on desktop.
    var lockScroll = function (on) {
      if (on) {
        var sbw = window.innerWidth - document.documentElement.clientWidth;
        if (sbw > 0) {
          var zoom = document.body.offsetWidth
            ? document.body.getBoundingClientRect().width / document.body.offsetWidth
            : 1;
          document.body.style.paddingRight = (sbw / (zoom || 1)) + "px";
        }
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      }
    };

    var closeBox = function () {
      if (!box) return;
      document.body.classList.remove("lb-open");
      lockScroll(false);
      // lift inert before restoring focus, or the target is still unfocusable
      setBackgroundInert(false);
      if (lastFocus) lastFocus.focus();
    };

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !document.body.classList.contains("lb-open")) return;
      // Consume the key. Other document-level Escape handlers (VR view)
      // would otherwise see lb-open already cleared by this one and treat
      // the same keypress as their own dismissal.
      e.stopImmediatePropagation();
      closeBox();
    });

    Array.prototype.forEach.call(photos, function (img) {
      img.classList.add("zoomable");
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "View larger: " + (img.alt || "photo"));
      img.addEventListener("click", function () { openBox(img); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBox(img); }
      });
    });
  }

  // ---------------------------------------------------------------
  // Scroll-spy: the in-page nav highlights the section you are reading
  // ---------------------------------------------------------------
  // Deterministic rather than an IntersectionObserver band: several targets
  // are bare <h2> elements only ~40px tall, and a fast scroll can carry one
  // straight past a narrow observer band without ever reporting a crossing,
  // leaving nothing highlighted. Picking the last heading above the reading
  // line always yields exactly one current section.
  var spyLinks = document.querySelectorAll(".side-toc a[href^='#'], .subnav a[href^='#']");
  if (spyLinks.length) {
    var spyPairs = [];
    Array.prototype.forEach.call(spyLinks, function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) spyPairs.push({ link: a, target: el });
    });

    if (spyPairs.length) {
      var spyQueued = false;
      var updateSpy = function () {
        var line = window.innerHeight * 0.28;
        var current = null;
        spyPairs.forEach(function (pair) {
          if (pair.target.getBoundingClientRect().top <= line) current = pair;
        });
        // before the first heading, keep the first link marked
        if (!current) current = spyPairs[0];
        spyPairs.forEach(function (pair) {
          pair.link.classList.toggle("is-current", pair === current);
        });
      };
      window.addEventListener("scroll", function () {
        if (spyQueued) return;
        spyQueued = true;
        requestAnimationFrame(function () { spyQueued = false; updateSpy(); });
      }, { passive: true });
      window.addEventListener("resize", updateSpy, { passive: true });
      updateSpy();
    }
  }

  // ---------------------------------------------------------------
  // VR view — look at the site as if through a headset.
  // Injected rather than written into all 8 pages: the whole feature
  // needs JS, so a button in the markup would be dead without it.
  // ---------------------------------------------------------------
  (function () {
    var NS = "http://www.w3.org/2000/svg";
    var STORE = "vr-view";
    var stage = null;
    var eyeL = null, eyeR = null;
    var phoneQuery = window.matchMedia("(max-width: 700px)");

    // One wide aperture on a phone; two lenses above 700px. Re-applied on
    // every breakpoint change, not just at build time — rotating a handset
    // to landscape crosses 700px, and a stale single aperture would leave
    // the CSS fringe and glare drawing rims where no lens exists.
    var applyApertures = function () {
      if (!eyeL || !eyeR) return;
      if (phoneQuery.matches) {
        // radii run past the viewBox because the mask gradient only goes
        // fully clear at 74% of the radius
        eyeL.setAttribute("cx", "50");
        eyeL.setAttribute("rx", "66");
        eyeL.setAttribute("ry", "42");
        eyeR.setAttribute("rx", "0");
        eyeR.setAttribute("ry", "0");
      } else {
        eyeL.setAttribute("cx", "27");
        eyeL.setAttribute("rx", "27");
        eyeL.setAttribute("ry", "48");
        eyeR.setAttribute("cx", "73");
        eyeR.setAttribute("rx", "27");
        eyeR.setAttribute("ry", "48");
      }
    };

    if (phoneQuery.addEventListener) phoneQuery.addEventListener("change", applyApertures);
    else if (phoneQuery.addListener) phoneQuery.addListener(applyApertures);

    var SEEN = "vr-seen";

    var btn = document.createElement("button");
    btn.className = "vr-toggle";
    btn.type = "button";
    btn.title = "VR view";
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML =
      '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M3 9.2a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4.6a2 2 0 0 1-2 2h-3.1a2 2 0 0 1-1.6-.8l-.9-1.2a1.8 1.8 0 0 0-2.8 0l-.9 1.2a2 2 0 0 1-1.6.8H5a2 2 0 0 1-2-2z"/>' +
      '<path d="M7.6 7.2V6.1M16.4 7.2V6.1"/></svg>' +
      '<span class="sr-only">VR view</span>';
    document.body.appendChild(btn);

    // The two apertures are an SVG mask rather than stacked CSS gradients:
    // punching two soft holes in one dark sheet needs real mask
    // compositing, and SVG does it identically in every browser.
    var buildStage = function () {
      stage = document.createElement("div");
      stage.className = "vr-stage";
      stage.setAttribute("aria-hidden", "true");

      var inner = document.createElement("div");
      inner.className = "vr-inner";

      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "vr-lenses");
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.innerHTML =
        '<defs>' +
        // Black = aperture (page shows through), white = dark surround.
        // The clear stop sits far out so the feather is a narrow rim
        // rather than a haze creeping over half the content.
        '<radialGradient id="vrEye">' +
        '<stop offset="0%" stop-color="#000"/>' +
        '<stop offset="74%" stop-color="#000"/>' +
        '<stop offset="93%" stop-color="#3a3a3a"/>' +
        '<stop offset="100%" stop-color="#fff"/>' +
        '</radialGradient>' +
        '<mask id="vrMask">' +
        '<rect width="100" height="100" fill="#fff"/>' +
        // mix-blend-mode:darken makes the two apertures a union. Painted
        // normally the second ellipse's feathered edge overwrites the
        // first one's clear centre, leaving a dark crescent down the
        // middle of the page exactly where the text column sits.
        '<ellipse class="vr-eye vr-eye--l" cx="27" cy="50" rx="27" ry="48" fill="url(#vrEye)" style="mix-blend-mode:darken"/>' +
        '<ellipse class="vr-eye vr-eye--r" cx="73" cy="50" rx="27" ry="48" fill="url(#vrEye)" style="mix-blend-mode:darken"/>' +
        '</mask>' +
        '</defs>' +
        '<rect width="100" height="100" fill="#04060f" mask="url(#vrMask)"/>';

      ["vr-panel"].forEach(function (c) {
        var d = document.createElement("div"); d.className = c; inner.appendChild(d);
      });
      inner.appendChild(svg);
      ["vr-grid", "vr-fringe", "vr-glare", "vr-reticle", "vr-flash"].forEach(function (c) {
        var d = document.createElement("div"); d.className = c; inner.appendChild(d);
      });

      stage.appendChild(inner);
      document.body.appendChild(stage);

      eyeL = svg.querySelector(".vr-eye--l");
      eyeR = svg.querySelector(".vr-eye--r");
      applyApertures();
    };

    var setVR = function (on, remember) {
      if (on && !stage) buildStage();
      document.body.classList.toggle("vr-on", on);
      btn.setAttribute("aria-pressed", String(on));
      if (remember) {
        try {
          if (on) sessionStorage.setItem(STORE, "1");
          else sessionStorage.removeItem(STORE);
        } catch (e) {}
      }
    };

    // Removing the class is what actually ends the hint. The CSS also stops
    // the animation on :hover, but that alone restarts the five-iteration
    // count every time the pointer leaves, so it could bounce forever.
    var endHint = function (remember) {
      btn.classList.remove("is-hinting");
      if (remember) { try { localStorage.setItem(SEEN, "1"); } catch (e) {} }
    };

    // Noticing it is enough to stop the bounce; only using it is remembered.
    btn.addEventListener("pointerenter", function () { endHint(false); });
    btn.addEventListener("focus", function () { endHint(false); });

    btn.addEventListener("click", function () {
      endHint(true);
      setVR(!document.body.classList.contains("vr-on"), true);
    });

    // Held back a few seconds so the bounce does not compete with the
    // page's own entrance animations, and skipped entirely once the
    // visitor has found the button at least once.
    var alreadySeen = false;
    try { alreadySeen = localStorage.getItem(SEEN) === "1"; } catch (e) {}
    if (!alreadySeen) {
      setTimeout(function () {
        if (!document.body.classList.contains("vr-on")) btn.classList.add("is-hinting");
      }, 3200);
    }

    document.addEventListener("keydown", function (e) {
      // the lightbox owns Escape while it is open
      if (e.key !== "Escape") return;
      if (document.body.classList.contains("lb-open")) return;
      if (document.body.classList.contains("vr-on")) setVR(false, true);
    });

    // Turning your head: the lenses shift slightly against the page
    document.addEventListener("pointermove", function (e) {
      if (!stage || !document.body.classList.contains("vr-on")) return;
      if (reduceMotion.matches) return;
      var dx = (e.clientX / window.innerWidth - 0.5) * -1.6;
      var dy = (e.clientY / window.innerHeight - 0.5) * -1.2;
      stage.style.transform = "translate(" + dx + "%," + dy + "%)";
    }, { passive: true });

    // survives navigation, so you can browse the whole site "in VR"
    try {
      if (sessionStorage.getItem(STORE) === "1") setVR(true, false);
    } catch (e) {}
  })();

  // ---------------------------------------------------------------
  // Pointer-reactive surfaces (fine pointers on wide screens only)
  // ---------------------------------------------------------------
  // Listeners are bound unconditionally and the media queries are consulted
  // per event: reading them once at load left the effects dead if the window
  // started narrow and was later widened past the breakpoint.
  var pointerActive = function () {
    return finePointer.matches && !reduceMotion.matches;
  };

  // soft light trailing the cursor across the homepage banner
  var hero = document.querySelector(".hero");
  var glow = hero && hero.querySelector(".hero-glow");
  if (glow) {
    var gx = 0, gy = 0, gQueued = false;
    hero.addEventListener("pointermove", function (e) {
      if (!pointerActive()) return;
      var r = hero.getBoundingClientRect();
      // getBoundingClientRect and clientX are in rendered pixels, but the
      // transform below is interpreted inside body's zoomed coordinate
      // space. Divide by the effective zoom or the glow trails the cursor
      // toward the top-left by exactly the zoom factor.
      var zoom = hero.offsetWidth ? r.width / hero.offsetWidth : 1;
      gx = (e.clientX - r.left) / zoom;
      gy = (e.clientY - r.top) / zoom;
      if (gQueued) return;
      gQueued = true;
      requestAnimationFrame(function () {
        gQueued = false;
        glow.style.transform = "translate3d(" + gx + "px," + gy + "px,0)";
      });
    }, { passive: true });
  }

  // spotlight under the pointer on the audience rows (percentages, so the
  // zoom cancels out here)
  Array.prototype.forEach.call(document.querySelectorAll(".row"), function (row) {
    var queued = false, px = 50, py = 50;
    row.addEventListener("pointermove", function (e) {
      if (!pointerActive()) return;
      var r = row.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 100;
      py = ((e.clientY - r.top) / r.height) * 100;
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () {
        queued = false;
        row.style.setProperty("--mx", px + "%");
        row.style.setProperty("--my", py + "%");
      });
    }, { passive: true });
  });

  // Theme toggle: un-stamped root follows the OS; an explicit choice is
  // stamped on <html> and persisted (the head script restores it pre-paint)
  var themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    var effectiveTheme = function () {
      var stamped = document.documentElement.getAttribute("data-theme");
      if (stamped === "dark" || stamped === "light") return stamped;
      return darkQuery.matches ? "dark" : "light";
    };
    var reflectTheme = function () {
      themeToggle.setAttribute("aria-pressed", String(effectiveTheme() === "dark"));
    };
    themeToggle.addEventListener("click", function () {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      reflectTheme();
    });
    if (darkQuery.addEventListener) darkQuery.addEventListener("change", reflectTheme);
    reflectTheme();
  }

  // Current year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Intl.DateTimeFormat("en-IE", { year: "numeric" }).format(new Date());
  });
})();
