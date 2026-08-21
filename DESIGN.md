# Trinity AI XR Hub — Design System

## Status
Rebranded 2026-08-13 to the **Trinity AI XR Lab Brand Guidelines**, then rebased
2026-08-21 onto the **TCD Visual Identity Handbook**, which outranks it. Naming
decision: the site keeps the content doc's "AI XR Hub" name per the owner's choice.

### TCD handbook compliance (2026-08-21)
| § | Requirement | Status |
|---|---|---|
| 1 | Full institutional name at least once per page | Footer credit reads "Trinity College Dublin, the University of Dublin" on all 7 pages |
| 2.2 | No sub-brand or unit-specific logos | **Deliberate conflict — see below** |
| 2.3 | Clear zone = half the shield height around the logo | Partner strip: 66px lockups, 42px above / 51px below / 114px left / 58px right, all clear of the 33px minimum |
| 3 | Source Sans Pro | `--font-body` / `--font-mono` = Source Sans 3 (its maintained successor), with Source Sans Pro as the next fallback |
| 4.1 | Trinity Blue `#0569b9`, Grey `#50555a`; secondary colours must not predominate | Palette rebased to exact hex. Trinity Blue now carries every dominant surface (27 uses); Navy `#001e69` demoted to 3 uses, all gradient depth stops |
| 5 | Bilingual unit naming | Carried by the official Trinity lockup, which is itself bilingual. No Irish unit name invented — Trinity Business School's own site does not present one either |
| 6 | Trinity logo leftmost, equal prominence with partners | Trinity is first in the partner strip; all three logos are 66px |

**§2.2 conflict, on the record.** The handbook forbids unit-specific logos, but the
Hub has its own approved mark and the owner chose to keep it (asked and answered,
2026-08-21). Everything else in the handbook is applied. If Trinity's brand office
ever objects, the fix is one asset swap: `assets/logo*.png` in the header, footer and
favicon, with no CSS or layout change needed.

**Why Josefin Sans survives §3.** The handbook mandates Source Sans Pro; the Hub's own
guidelines mandate Josefin Sans. Split by role at the owner's instruction: Source Sans
runs all body, meta and form text (the bulk of the page); Josefin Sans is confined to
display headings, where it functions as the Hub's mark rather than as text.

### Portrait hover flip (team.html, 2026-08-21)
Hovering a team portrait turns it about its vertical axis onto a navy plate
carrying a LinkedIn shortcut. Three traps are load-bearing:

- **`preserve-3d` cannot live on `.monogram--photo`.** The frame keeps
  `overflow: hidden`, and an element whose computed overflow is not `visible`
  has its used `transform-style` forced back to `flat` — the back face then
  renders on the wrong side with no error anywhere. It lives on the inner
  `.mono-flip`, which must never be given an overflow, opacity, filter, mask or
  clip-path of its own. `perspective` is not a grouping property and stays on
  the frame.
- **`.mono-flip` must stay `position: absolute`.** An in-flow child gives the
  frame intrinsic content and collapses the `width: 100%` / `aspect-ratio`
  contract — the 2×2px portrait failure recorded below.
- **Reduced motion swaps the mechanism, it does not zero the transform.**
  `transform: none` on a plate that is `rotate: y 180deg` + backface-hidden
  hides it permanently. The reduced variant cross-fades instead, so the reveal
  survives and only the rotation goes.

- **The `:focus-visible` rule must stay separate from the `:hover` rule.** A CSS
  selector list is not forgiving: one unsupported selector invalidates the whole
  rule. Sharing a list with `:has()` meant that on any engine without it the
  hover flip died too — and since the plate is now the only profile link, losing
  the reveal loses the link entirely (it is backface-hidden and turned away, so
  it is neither visible nor clickable). Split, the worst case is only that
  keyboard focus does not spin the card.
- **The badge size is a token, because `body { zoom: 0.8 }` is gated on width,
  not on pointer type.** A coarse-pointer tablet at ≥921px would otherwise
  render the 44px badge at 35px, under the tap-target floor. `--badge` is
  pre-divided to `3.4375rem` inside that breakpoint.

**The plate is the profile link.** The text "LinkedIn" buttons that used to sit
under each bio were removed on request, which makes the plate the *only* route
to a profile — so it carries a real `href`, a per-person
`aria-label="NAME on LinkedIn"`, and stays keyboard focusable. `:focus-visible`
flips it in and rings the frame; a link you cannot see is a link you cannot use.

**Devices without hover get a badge, not a flip.** `.mono-back`'s base state is
a 44px corner badge pinned bottom-right (the bottom-left 38% belongs to
`.monogram::after`), permanently visible and tappable. Only inside
`(hover: hover) and (pointer: fine)` is it promoted to the full turned-away
plate. Structuring it this way — badge as the base, plate as the enhancement —
avoids negated media queries entirely, and means a phone can never land in the
tap-to-flip-then-tap-again trap. Removing the text buttons without this would
have left every phone visitor with no way to reach any profile at all.

Two layout rules died with the text buttons: `.core-member > p:last-child` and
`.adv > p:last-child` carried `margin-top: auto` to pin the button to the foot
of the card. With the button gone the last child is the bio, and leaving those
rules would have shoved the bio to the bottom leaving a gap under the role.

**Consequence, deliberate:** team portraits are no longer lightbox triggers.
You must hover a photo to click it, so the flip made the lightbox unreachable;
`.monogram--photo img` was removed from the lightbox selector in `main.js`
rather than leaving a `role="button"` labelled "View larger" on a control that
cannot open. `.split-media` photos on the business and students pages keep it.
**Kierstyn Olson's tile shows initials, not a photograph.** It used to borrow
`assets/jose.jpg` — José Antonio Flaque García's portrait, still shown under his
own name in the Core Team. That was tolerable as a mute placeholder, but once
the card carried a LinkedIn link it became a profile affordance mounted on the
wrong person's face, and on touch the badge sits permanently in the corner of
that face. Excluding her instead would have left her unreachable from every
device once the text buttons went. So the front face is now `.mono-initials`
("KO") on the brand ground, which misrepresents nobody; swapping in a real
headshot is a one-line change back to the standard `<img>` markup.

The plate's visible label is "LinkedIn", not "View profile", to satisfy WCAG
2.5.3 Label in Name: the accessible name is "NAME on LinkedIn", and a speech
input user saying what they can see has to be able to activate the control.

## Tokens

### Color — official brand palette only
| Token | Value | Role |
|---|---|---|
| `--ink` | `#0569b9` | **Trinity Blue.** Dominant ground: heroes, bands, footer |
| `--ink-2` | `#001e69` | Trinity Navy — *secondary*, used only as a gradient depth stop |
| `--ink-3` / `--accent` | `#0569b9` | Trinity Blue. Buttons, marks, links, accent band |
| `--paper` | `#FFFFFF` | White. Page ground — the handbook counts white space as core identity |
| `--paper-2` | `#EEF3FA` | Derived blue-tinted surface for alternate bands |
| `--text` | `#50555a` | **Trinity Grey.** Body text |
| `--accent-soft` | `#c0daee` | Trinity Blue at 25%. Focus rings, borders, markers, carets — **UI only, never text** (3.89:1 on Trinity Blue clears WCAG's 3:1 bar for non-text, but not 4.5:1) |
| `--on-ink-faint` | `#dae8f4` | The darkest blue tint that still clears 4.5:1 on Trinity Blue. Faint *text* on blue surfaces |
| `--heading` | Trinity Blue on paper, white on blue surfaces | Headings |

Two contrast failures were introduced by the rebase and fixed at the same time:
`--on-ink-faint` was 3.31:1 on the new lighter blue (now 4.51:1), and dark mode's
`--cta-text` was 3.89:1 (now Navy, 10.44:1). The two places `--accent-soft` was used
as *text* — the mobile nav CTA and the row hover CTA — moved to white, 5.63:1.

### Type — brand fonts, strict
- **Primary (headings):** Josefin Sans (Google Fonts, variable)
- **Secondary (body, meta, data):** Source Sans 3 (TCD handbook §3), falling back to
  Source Sans Pro then `system-ui`. This replaced Arial on 2026-08-21; the handbook
  outranks the Hub guidelines, and it also settles the standing "no system fonts" rule
- Body measure ≤ 68ch, tabular numerals on dates retained
- **Reading size** (raised 2026-08-20): `1.1875rem` on phones/tablets, `1.3125rem` on
  desktop. Desktop carries `body { zoom: 0.8 }`, so 21px authored lands at ~16.8px on
  screen; the two sizes are set separately so both contexts read comfortably.
- **Alignment** is a single dial: `--text-align` on `:root` (`center` | `left`).
  It reaches section heads, page intros, cards (`.offer`/`.pillar`/`.adv`/`.core-member`),
  pull quotes, CTA strips and the mobile footer. Deliberately *excluded*, whatever the
  dial says: long multi-paragraph prose bodies, tick-list items, news rows, audience
  rows and form fields — centring those costs more in scannability than it returns.
  Constrained columns are centred on the page (`margin-inline: auto`) regardless.

### Graphic language
- Navy → blue gradients (`155deg, #0569b9 → #03518f → #0569b9`, with `#001e69` for depth) on hero surfaces
- Translucent white **diagonal blades** (115°) over gradients — replaces the earlier
  perspective-grid motif, matching the guidelines' pattern pages
- Accent CTA band is brand blue gradient with white buttons (was chartreuse)

### Logo
- **Official assets in use**: `assets/logo-blue.png` (navy lockup, on white — header)
  and `assets/logo-white.png` (white lockup, on navy — footer). Both 529×446,
  transparent, full lockup including the TRINITY / AI XR HUB wordmark.
  **Never recolor** (guidelines' incorrect-usage page).
- **Favicon** is generated from the official logo (`assets/favicon-*.png`, `favicon.ico`,
  `apple-touch-icon.png`): a navy rounded square carrying the white lockup. The 16/32px
  sizes use the **triangular mark only** — the TRINITY / AI XR HUB wordmark is illegible
  below ~64px. Regenerate from `logo-white.png` if the artwork changes.
- Brand strapline in guidelines: "Incubating Intelligence for Human Impact".
  Site hero keeps the content doc's tagline "Immersive Intelligence. Positive Impact."

### Dark mode
- Token-driven: bare `:root` holds the light palette; `@media (prefers-color-scheme: dark)`
  overrides tokens for un-stamped visitors; `:root[data-theme="dark"|"light"]` (set by the
  header toggle, persisted in localStorage, restored pre-paint by a head script) wins over the OS.
- Dark ground is `#0A1230` (deeper than band navy so band hierarchy survives); text `#C7D1E9`;
  on-dark accents use `--accent-soft #c0daee` (Trinity Blue 25%).
- Header logo swaps navy/white lockup via `--display-light/--display-dark` tokens.
- The homepage partner strip stays a fixed white island in both themes — the TCD and TBS
  logo files have opaque white backgrounds.
- White text on navy surfaces is literal `#FFFFFF`, never `var(--paper)` (which flips dark).

### Animation layer (Motion + anime.js)
- Vendored in `assets/vendor/` (no CDN at runtime): Motion 13.1.0 (IIFE, `window.Motion`)
  and anime.js 4.5.0 (self-contained ESM). Logic lives in `animations.js`.
- **`html.anim` gate**: set pre-paint only when ESM works and reduced-motion is off.
  JS-owned hidden states gate on `.anim`; the original CSS keyframes run under
  `html:not(.anim)` as the fallback (JS off, file 404, old browser) — never both.
- Division of labor: anime.js = homepage hero timeline (char-split headline,
  clip-path highlight wipe); Motion = scroll parallax (hero photo/blades,
  about banner photo), `inView` spring reveals with per-child staggers, `press`
  micro-interaction on buttons. On scroll-driven layers the timeline animates
  opacity only — Motion owns their transforms.
- Deliberate exception: row-hover uses a mild overshoot bezier (1.18) — flagged
  by the detector as bounce-easing, kept intentionally as part of the spring
  motion language this feature introduces.

### Responsive behaviour (reworked 2026-08-20)
- **Photo layers never disappear.** `.hero-photo-bg`, `.page-hero-photo` and
  `.accent-photo` were previously `display: none` below 780px — the reason the site
  read as image-less on a phone. Below **880px** they restack as full-bleed strips:
  the homepage photo drops *below* the headline (flex `order`), interior banners sit
  *above* the heading, and CTA-strip photos sit above their text.
- Each page carries inline **position dials** (`right` / `left` / `width` /
  `background-position` / `mask-image`) tuned for the desktop composition. The mobile
  block cancels them with `!important` — inline styles otherwise win and shove the
  image off-screen. Same for `.split-media img` dials (`margin-top` / `left` / `width`).
- 880px is the single source of truth: `animations.js` gates parallax on
  `min-width: 881px` so scroll-driven offsets never apply to a stacked strip.
- **`backdrop-filter` must not live on `.site-header`.** It makes the header a
  containing block for `position: fixed` descendants, which collapsed the full-screen
  mobile nav overlay to the header's own height. The blur lives on
  `.site-header::before` instead.
- Mobile nav: flex container + `margin: auto` on the list — centred when short,
  scrollable and never clipped when the menu exceeds the screen. Brand and theme
  toggle are raised above the overlay, and the lockup swaps to white while it is open.
- Watch equal-specificity ordering: a later `.band { padding-block }` mobile rule will
  silently beat an earlier `.band--accent { padding-top }`. Use `.band.band--accent`.

### Interactive furniture
- **Reading-progress bar** on the sticky header's bottom edge, driven by Motion
  `scroll()`. Kept inside the header rather than fixed to the viewport, because
  `position: fixed` under `body { zoom: 0.8 }` mis-computes full-width offsets.
- **Back-to-top** button (`.to-top`) lives in `main.js`, not `animations.js`, so it
  still works when the animation module is unavailable. Appears past 60vh.
- Hover language: accent underline sweep on `.offer`/`.adv`, rule sweep on `.pillar`,
  tint + heading colour on `.news-item`, portrait flip on team monograms, light sweep
  across `.btn` faces (`::before`, `z-index: -1` under `isolation: isolate`),
  clip-path wipe on `.split-media` photos entering view, staggered mobile nav items.

### Interaction layer (things that respond to the visitor)
Lives in `main.js` (classic script, so none of it depends on the `html.anim` gate
or on Motion loading).

- **Photo lightbox.** Every `.split-media img` and `.monogram--photo img` becomes a
  `role="button"`, `tabindex="0"` control that opens a modal dialog. Escape, the
  close button and a backdrop click all dismiss it; focus moves to the close button
  on open and returns to the photo on close. The overlay is appended to `body`, so
  it inherits the desktop `zoom: 0.8` — `.lightbox { zoom: 1.25 }` above 921px
  cancels it exactly (0.8 × 1.25 = 1) and the fixed overlay covers the true viewport
  instead of 80% of it.
- **Scroll-spy** on `.side-toc` (About) and `.subnav` (Insights): an
  IntersectionObserver with a `-18% / -68%` band marks the section being read.
- **Pointer-reactive surfaces**, gated on `(min-width: 881px) and (hover: hover)`
  *and* reduced-motion: a soft light (`.hero-glow`) trails the cursor across the
  homepage banner via `transform` (composited, not a gradient repaint), and the
  audience rows carry a spotlight driven by `--mx`/`--my` custom properties. The
  rows use background only — their children already own `transform` for the hover
  slide, so there is no transform contention.
- **Section heading rules.** `.band-head h2::after` draws a short accent rule when
  the head scrolls in; `animations.js` adds `.is-in`, and `html:not(.anim)` plus the
  reduced-motion block both show it outright so it can never be stuck at `scaleX(0)`.
- **VR view** — a headset-shaped toggle in the bottom-left corner makes the page
  look as though it is being seen through a headset: two lens apertures, the
  screen-door grid real panels show, chromatic fringing on the rims (warm left,
  cool right) and a slow head drift, with the lenses shifting against the page as
  the pointer moves. Notes worth keeping:
  - Nothing about the page itself is transformed or filtered. Doing either would
    make `body` a containing block for `position: fixed` and break the sticky
    header, lightbox and back-to-top at once. The whole effect is a fixed,
    `pointer-events: none` overlay, and the panel tint uses `backdrop-filter`,
    which affects what is painted behind without touching layout.
  - The apertures are an **SVG mask**, not stacked CSS gradients — punching two
    soft holes in one dark sheet needs real mask compositing. Both ellipses carry
    `mix-blend-mode: darken` so they union; painted normally the second one's
    feathered edge overwrites the first one's clear centre and leaves a dark
    crescent straight down the text column.
  - The mask gradient only reaches fully clear at 74% of the radius, so the
    visible opening is much smaller than the ellipse. Size radii accordingly.
  - Phones get **one** wide aperture; two on a 390px screen leaves nothing
    readable through either.
  - State lives in `sessionStorage`, so it survives navigation and you can browse
    the whole site in VR, but it does not persist forever.
  - The lightbox's Escape handler calls `stopImmediatePropagation()`, or the same
    keypress would close the lightbox *and* exit VR.
  - `body.vr-on .site-header` is raised above the overlay and flipped to a dark
    HUD. The header sits outside the apertures, so left under the surround the nav
    is still clickable but too dim to read. Raising it also lifts the progress bar
    and the mobile menu, which are its children.
  - The button hints itself: a double-bounce plus an expanding ring, delayed a few
    seconds, capped at five iterations, suppressed on hover/focus and while VR is
    on, and never shown again once `localStorage['vr-seen']` is set.

### Traps worth remembering
- **Full-bleed bands and centred text do not share a coordinate system.**
  `.accent-photo` was pinned with `right: min(53%, 48rem)`, i.e. to the band's
  right edge, while the heading and button sit in a centred max-width `.wrap`.
  Every change of window width or browser zoom slid the photo across the
  composition — 33% to 67% of the band between 1280px and 3000px. It is now
  anchored to the band centre (`left: 50%` with a `-17rem` margin against a
  fixed `34rem` width), which is the same axis the `.wrap` centres on, so the
  three hold their relationship at any width. Mobile nulls the margin.
- **Never override `--display-light` / `--display-dark` on a container.** They
  swap the header logo *and* the theme toggle's sun/moon. Overriding them to get
  the white lockup froze the toggle on the wrong glyph, contradicting its own
  `aria-pressed`. Write `display` on `.logo-light` / `.logo-dark` directly, as the
  `nav-open` and `vr-on` blocks both now do.
- **`margin-inline: auto` on a flex item stops it stretching.** Turning
  `.core-member` / `.adv` into flex columns collapsed every `.monogram` to 2×2px:
  the frames have no in-flow content (the `<img>` is absolutely positioned), so
  once they stopped stretching they shrank to zero and `aspect-ratio` took the
  height with it. Any frame like that needs an explicit `width`.
- **Every new fixed-position control needs a `body.nav-open` hide**, or it floats
  over the mobile menu as a live, often invisible, tab stop. `.to-top` and
  `.vr-toggle` both carry one.
- **Every new document-level Escape handler must `stopImmediatePropagation()`**
  when it acts. Three now listen (mobile nav, lightbox, VR) and without it one
  keypress cascades through all of them.

### Team page
- Every one of the 16 people carries a `.person-link` to their real LinkedIn
  profile, opening in a new tab. Each has `aria-label="<Name> on LinkedIn"`:
  sixteen links all announced as "LinkedIn" would be indistinguishable to a
  screen-reader user.
- `.core-member` and `.adv` are flex columns with `p:last-child { margin-top: auto }`
  so the profile buttons align along the bottom of each row rather than following
  bios of differing length.
- All ten advisory members carry a portrait. Nine are their own photographs;
  **Kierstyn Olson is still the `assets/jose.jpg` placeholder** (`alt=""`, with an
  HTML comment marking it) because no photo has been supplied. Swap it and set the
  alt to her name when one arrives.
- Supplied headshots are square; they are pre-cropped to the frame's 1:1.12 ratio
  and capped at 400px wide before use. Two of the originals were ~800KB each — the
  set went from 1,972KB to 169KB, which matters on a page carrying twelve of them.

### Parked pages
`_parked/` holds finished pages that are not currently part of the site. They
sit outside the site root deliberately: Vercel serves every `.html` in the root,
so an unlinked page there would still be reachable by URL and indexable.
`_parked/README.md` carries the exact steps to bring one back.

Currently parked: **insights.html** (Insights & News). Removing it also removed
7 nav items, 21 footer links, the homepage "All Updates" link, the three
homepage "Read More" links and the students page "Check Latest Events" link.
Those Read More links pointed at `insights.html#news` — the top of a section
rather than an article — which a guideline audit flagged as misleading, so they
should get real article URLs rather than simply being restored.

### Form validation
`forms.js` sets `form.noValidate = true` **at runtime**, not in the markup. A
natively invalid form never fires `submit` at all, so the inline error path
would be unreachable and the browser's own bubble would show instead; setting it
from JS means a no-JS visitor still gets native validation before the form posts.

On submit, each invalid control gets `aria-invalid="true"`, its own
`validationMessage` written into a `.field-error` node linked by
`aria-describedby`, and the first offender takes focus. Errors clear per-field on
`input`. Provider errors that mention an address are routed to the email field
rather than only landing in `.form-status` at the foot of the form.

### Map card (contact page)
The address is a link to Google Maps (`/maps/search/?api=1&query=…`, the
documented URL scheme), wrapped in the `<address>` element with a CSS-drawn
street plan and pin above it.

Deliberately **not** an embedded Google map: an iframe would load Google's
scripts and cookies for every visitor before anyone had consented, which a
Trinity page should not do unprompted. If an embed is wanted later, gate it
behind a click-to-load placeholder and cover it in the privacy notice.
- **Cross-document view transitions** (`@view-transition { navigation: auto }`)
  cross-fade page-to-page instead of flashing white. `.site-header` carries its own
  `view-transition-name`, so the chrome appears to persist while the content
  changes. Unsupported browsers just navigate normally — there is nothing to
  fall back to and nothing to polyfill.

### Forms
- Submission lives in `forms.js`, which carries the only configuration block:
  a **Formspree** endpoint for booking requests and **Mailchimp** account/`u`/`id`
  for the 9 mailing-list signups. Setup steps are in [FORMS.md](FORMS.md).
- Until those values are filled in the forms say *"This form is not connected
  yet"* and warn in the console. They never fake a success message — a form that
  silently swallows a real booking is worse than one that admits it is unfinished.
- Mailchimp sends no CORS headers, so the mailing list uses its documented JSONP
  endpoint; that keeps the visitor on the page instead of bouncing them to
  list-manage.com. Its reply messages contain HTML and are stripped to text
  before display, never injected.
- `action` is set from the config at runtime, so a JS-less browser still posts
  natively to the real provider. Every form carries a hidden `.hp-field`
  honeypot, and the mailing forms also send Mailchimp's own `b_{u}_{id}` trap.
- `.form-status` uses `color: inherit` plus `--form-ok`/`--form-error`, which are
  redeclared on navy grounds (`.band--ink`, `.band--accent`, `.site-footer`) and
  for the dark theme. The previous `var(--text)` grey fell to ~1.9:1 in the footer.

### Rules
- Palette is closed: blue, navy, grey, white + derived tints only
- No card grids; editorial rows with hairline rules
- One authored motion moment (hero stagger + blade slide); reveals subtle; reduced-motion honored
- Browser surfaces themed: selection (blue/white), caret, scrollbar, focus rings
- Contact details are the real ones (trinityaixr@tcd.ie; Trinity Business School,
  182 Pearse Street, Dublin 2, D02 F6N2) — the guidelines PDF's "742 Evergreen Lane /
  info@trinityaixrlab.com" is template placeholder text and must not be used
- The HEA funding acknowledgement appears as the homepage hero's opening line and as
  the footer's HEA lockup (`hea-logo-white.png` — the stock file is navy artwork and
  would vanish on the navy footer)
