// Trinity AI XR Hub — shared behaviour
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
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // Scroll reveals live in animations.js (Motion inView + springs);
  // with the JS animation layer unavailable, .reveal content is simply visible.

  // Mock form handling: confirm inline, keep the page put
  document.querySelectorAll("form[data-mock]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.textContent = form.getAttribute("data-mock-message") ||
          "Thanks — we’ll be in touch within 3–5 working days.";
      }
      form.reset();
    });
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
