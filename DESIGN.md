# Trinity AI XR Hub — Design System

## Status
Rebranded 2026-08-13 to comply with the official **Trinity AI XR Lab Brand Guidelines**
(PDF supplied by the team). Naming decision: the site keeps the content doc's
"AI XR Hub" name per the owner's choice; the logo and visual identity follow the
guidelines strictly.

## Tokens

### Color — official brand palette only
| Token | Value | Role |
|---|---|---|
| `--ink` | `#071C65` | Brand deep navy. Dominant ground: heroes, bands, footer |
| `--ink-2` | `#14337E` | Gradient midpoint on navy surfaces |
| `--ink-3` / `--accent` | `#2D67B3` | Brand blue. Buttons, marks, links, accent band |
| `--paper` | `#FFFFFF` | Brand white. Page ground |
| `--paper-2` | `#EEF3FA` | Derived blue-tinted surface for alternate bands |
| `--text` | `#5A5B5D` | Brand grey. Body text |
| `--accent-soft` | `#9DC1F0` | Derived tint: accents/focus/markers **on navy** (raw brand blue fails contrast there) |
| `--heading` | navy on paper, white on navy/blue surfaces | Headings |

### Type — brand fonts, strict
- **Primary (headings):** Josefin Sans (Google Fonts, variable)
- **Secondary (body, meta, data):** Arial — per guidelines, deliberately overriding the
  general "no system fonts" preference at the owner's instruction
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
- Navy → blue gradients (`155deg, #071C65 → #123A8C → #2D67B3`) on hero surfaces
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
  on-dark accents use `--accent-soft #9DC1F0`.
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
  tint + heading colour on `.news-item`, photo zoom on team monograms, light sweep
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
