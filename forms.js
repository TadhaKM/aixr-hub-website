// Trinity AI XR Hub · form submission
//
// =====================================================================
//  CONFIGURE HERE — these are the only two things you need to fill in.
//  Until they are filled in, the forms keep showing the old "mock"
//  confirmation and log a warning to the browser console, so the site
//  never looks broken while you are setting the accounts up.
// =====================================================================

var FORM_CONFIG = {

  // ---------------------------------------------------------------
  // 1. BOOKING / SESSION REQUESTS  →  Formspree
  //
  //    a) Go to https://formspree.io and create a free account.
  //    b) New Form → name it "Trinity AI XR Hub bookings".
  //    c) Set the recipient email to trinityaixr@tcd.ie.
  //    d) Copy the endpoint it shows you. It looks like:
  //         https://formspree.io/f/abcdwxyz
  //    e) Paste it below, replacing the whole placeholder string.
  // ---------------------------------------------------------------
  bookingEndpoint: "PASTE_FORMSPREE_ENDPOINT_HERE",

  // ---------------------------------------------------------------
  // 2. MAILING LIST  →  Mailchimp
  //
  //    a) In Mailchimp: Audience → Signup forms → Embedded form.
  //    b) In the generated HTML, find the <form action="..."> URL.
  //       It looks like:
  //         https://trinityaixr.us21.list-manage.com/subscribe/post?u=a1b2c3d4e5&id=f6g7h8i9
  //    c) Split that URL into the three pieces below.
  //
  //    Also turn ON double opt-in (Audience → Settings → Audience name
  //    and defaults). It sends a confirmation email, which is what makes
  //    the signup GDPR-valid and gives every subscriber an unsubscribe
  //    link automatically.
  // ---------------------------------------------------------------
  mailchimp: {
    account: "PASTE_ACCOUNT_HERE", // the bit before .list-manage.com, e.g. "trinityaixr.us21"
    u: "PASTE_U_HERE",             // the u= value
    id: "PASTE_ID_HERE"            // the id= value
  }
};

// =====================================================================
//  Nothing below here needs editing.
// =====================================================================

(function () {
  "use strict";

  var PLACEHOLDER = /PASTE_|REPLACE_ME/;

  function configured(value) {
    return typeof value === "string" && value.length > 0 && !PLACEHOLDER.test(value);
  }

  var bookingReady = configured(FORM_CONFIG.bookingEndpoint);
  var mc = FORM_CONFIG.mailchimp || {};
  var mailingReady = configured(mc.account) && configured(mc.u) && configured(mc.id);

  if (!bookingReady || !mailingReady) {
    // Deliberately loud: a form that silently swallows a real enquiry is
    // worse than one that visibly is not finished yet.
    console.warn(
      "[Trinity AI XR Hub] Forms are not connected yet" +
      (bookingReady ? "" : " · booking: set FORM_CONFIG.bookingEndpoint in forms.js") +
      (mailingReady ? "" : " · mailing list: set FORM_CONFIG.mailchimp in forms.js")
    );
  }

  var MAILCHIMP_POST = mailingReady
    ? "https://" + mc.account + ".list-manage.com/subscribe/post-json?u=" +
      encodeURIComponent(mc.u) + "&id=" + encodeURIComponent(mc.id)
    : null;

  // Mailchimp's own bot-trap field name is derived from the list ids
  var MAILCHIMP_HONEYPOT = mailingReady ? "b_" + mc.u + "_" + mc.id : "b_hp";

  // ---------- helpers ----------

  function statusEl(form) {
    return form.querySelector(".form-status");
  }

  function setStatus(form, message, state) {
    var el = statusEl(form);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("is-ok", "is-error", "is-busy");
    if (state) el.classList.add(state);
  }

  function setBusy(form, busy) {
    var btn = form.querySelector("button[type=submit], button:not([type])");
    form.setAttribute("aria-busy", String(busy));
    if (!btn) return;
    btn.disabled = busy;
    if (busy) {
      if (!btn.dataset.label) {
        btn.dataset.label = btn.textContent.trim();
        // Hold on to the arrow node before the label is overwritten:
        // setting textContent destroys every child, so looking the icon
        // up again on restore would find nothing.
        btn._icon = btn.querySelector("svg") || null;
      }
      btn.textContent = "Sending…";
    } else if (btn.dataset.label) {
      btn.textContent = btn.dataset.label;
      if (btn._icon) btn.appendChild(btn._icon);
    }
  }

  // Mailchimp replies with HTML in its message strings; never inject it
  function stripTags(html) {
    var d = document.createElement("div");
    d.innerHTML = String(html || "");
    return (d.textContent || "").trim();
  }

  // Mailchimp has no CORS headers, so the documented route from a static
  // page is its JSONP endpoint. This keeps the visitor on the page instead
  // of bouncing them to a list-manage.com confirmation screen.
  function jsonp(url) {
    return new Promise(function (resolve, reject) {
      var name = "mcCallback" + Math.floor(Math.random() * 1e9);
      var script = document.createElement("script");
      var timer = setTimeout(function () {
        cleanup();
        reject(new Error("timeout"));
      }, 12000);

      function cleanup() {
        clearTimeout(timer);
        try { delete window[name]; } catch (e) { window[name] = undefined; }
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[name] = function (data) { cleanup(); resolve(data); };
      script.onerror = function () { cleanup(); reject(new Error("network")); };
      script.src = url + "&c=" + name;
      document.head.appendChild(script);
    });
  }

  // ---------- booking form (Formspree) ----------

  function submitBooking(form) {
    var data = new FormData(form);
    return fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" }
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (res.ok) return { ok: true };
        var detail = body && body.errors && body.errors.length
          ? body.errors.map(function (e) { return e.message; }).join(", ")
          : "";
        return { ok: false, message: detail };
      });
    });
  }

  // ---------- mailing list (Mailchimp) ----------

  function submitMailing(form) {
    var email = form.querySelector('input[type="email"]');
    var value = email ? email.value.trim() : "";
    if (!value) return Promise.resolve({ ok: false, message: "Please enter an email address." });

    var url = MAILCHIMP_POST +
      "&EMAIL=" + encodeURIComponent(value) +
      "&" + encodeURIComponent(MAILCHIMP_HONEYPOT) + "=";

    return jsonp(url).then(function (data) {
      if (data && data.result === "success") return { ok: true };
      var msg = stripTags(data && data.msg);
      if (/already subscribed/i.test(msg)) {
        return { ok: true, message: "You are already on the list." };
      }
      // Mailchimp prefixes some messages with "0 - "
      return { ok: false, message: msg.replace(/^\d+\s*-\s*/, "") };
    });
  }

  // ---------- wiring ----------

  var forms = document.querySelectorAll("form[data-form]");

  Array.prototype.forEach.call(forms, function (form) {
    var kind = form.getAttribute("data-form"); // "booking" | "mailing"
    var ready = kind === "booking" ? bookingReady : mailingReady;

    // Point the form at the real endpoint so that it still submits (as a
    // normal page POST) if this script never runs.
    if (ready) {
      form.action = kind === "booking"
        ? FORM_CONFIG.bookingEndpoint
        : "https://" + mc.account + ".list-manage.com/subscribe/post?u=" + mc.u + "&id=" + mc.id;
      form.method = "post";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      // Honeypot: a real person never fills a hidden field
      var trap = form.querySelector(".hp-field");
      if (trap && trap.value) { setStatus(form, "Thanks.", "is-ok"); form.reset(); return; }

      if (!ready) {
        setStatus(
          form,
          "This form is not connected yet. Please email trinityaixr@tcd.ie.",
          "is-error"
        );
        return;
      }

      setBusy(form, true);
      setStatus(form, "Sending…", "is-busy");

      var run = kind === "booking" ? submitBooking(form) : submitMailing(form);

      run.then(function (result) {
        setBusy(form, false);
        if (result.ok) {
          setStatus(form, result.message || form.getAttribute("data-success") ||
            "Thanks. We will be in touch.", "is-ok");
          form.reset();
        } else {
          setStatus(form, result.message ||
            "Sorry, that did not go through. Please email trinityaixr@tcd.ie.", "is-error");
        }
      }).catch(function () {
        setBusy(form, false);
        setStatus(form,
          "Sorry, that did not go through. Please email trinityaixr@tcd.ie.", "is-error");
      });
    });
  });
})();
