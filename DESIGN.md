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
- Favicon remains a simplified single-stroke A on navy — the full woven mark is
  illegible at 16px; replace only if an official favicon/app-icon asset is provided.
- Brand strapline in guidelines: "Incubating Intelligence for Human Impact".
  Site hero keeps the content doc's tagline "Immersive Intelligence. Positive Impact."

### Rules
- Palette is closed: blue, navy, grey, white + derived tints only
- No card grids; editorial rows with hairline rules
- One authored motion moment (hero stagger + blade slide); reveals subtle; reduced-motion honored
- Browser surfaces themed: selection (blue/white), caret, scrollbar, focus rings
- Contact details are the real ones (trinity.aixrlab@gmail.com, TBS Dublin 2) — the
  guidelines PDF's "742 Evergreen Lane / info@trinityaixrlab.com" is template
  placeholder text and must not be used
