# Editing the homepage banner

Everything in the big blue banner is controlled from two files. Change a
number, save, refresh the browser. If nothing happens, hard-refresh with
**Ctrl+Shift+R** — the browser caches the stylesheet.

Line numbers were correct on 2026-08-27. If they have drifted, search for the
snippet in the "find this" column instead.

---

## 1. The words — `index.html`

| Line | Find this | What it is |
|---|---|---|
| 68 | `<span class="line">Trinity AI XR Hub</span>` | The big headline |
| 70 | `<p class="hero-lede up">A facility within…` | The paragraph underneath |
| 70 | `<em class="mark">distinctly human</em>` | The highlighted words. Move the `<em>` tags around any phrase to highlight that phrase instead |
| 72 | `>Book a Session` | First button's text |
| 72 | `href="contact.html#book"` | Where it goes |
| 75 | `>Explore the Hub</a>` | Second button's text and link |

**Two cautions.** Keep the `<span class="line">` wrapper around the headline —
the animation splits it and will break without it. And keep the headline
short: it is set very large, so a long one wraps onto three or four lines and
pushes the buttons off the screen.

---

## 2. The layout — `styles.css`

| Line | Find this | Raise it to… |
|---|---|---|
| 85 | `--wrap-banner: max(108rem, 88%)` | move the logo **and** all banner text **further left**. Both numbers matter: `108rem` controls laptops, `88%` controls big monitors. This one line affects every page |
| 539 | `height: 64.8px` | make the **logo bigger**. It is 54px x 1.2 today. Above ~72px the header grows taller |
| 776 | `min-height: clamp(21rem, 55vh, 40rem)` | make the banner **taller**. The middle number, `55vh`, is the one that normally applies |
| 771 | `min(46rem, 58%)` | make the **text column wider**. Careful: too wide and the text runs under the picture |

---

## 3. The picture — `styles.css`, lines 820-850

These four are the ones you will most likely want.

| Line | Find this | Effect |
|---|---|---|
| 831 | `url("assets/students-vr.jpg")` | **Swap the photograph.** Put your file in `assets/` and change the name |
| 830 | `max-width: 62%` | **How big the picture is.** It is locked to the photograph's own proportions, so its width follows the banner's height. Raising this only helps on short, wide windows; to make it genuinely bigger, make the banner taller (line 776) |
| 833 |: 50% 25%` | **Slides the picture up and down.** Change the second number: lower shows more of the top of the photo, higher shows more of the bottom |
| 844 |: -20% 0` | **Slides the whole picture left or right.** More negative moves it left, so the blue hands over sooner. The percentage is of the picture's own width. Past about -24% the picture stops reaching the right edge of the screen and blue reappears there |

### The picture and the gradient are separate controls

The frame is locked to the photograph's own proportions (1600 x 1227), so the
image is never stretched or cropped — the whole picture always shows.

The mask (section 4) decides where the blue hands over to the picture. It
changes opacity and nothing else, so moving that boundary never moves,
resizes or crops the picture. They are genuinely independent.

---

## 4. The blue itself — `styles.css`

| Line | Find this | Effect |
|---|---|---|
| 745 | `linear-gradient(155deg, var(--ink) 0%, #03518f 40%, var(--ink-3) 90%)` | The **blue gradient**. `155deg` is its angle; the three colours are its stops. `var(--ink)` and `var(--ink-3)` are both Trinity Blue |
| 856-857 | `linear-gradient(to left, #000 86%, rgba(0, 0, 0, 0.55) 94%, transparent 100%)` | **Where the blue hands over to the picture.** Read right-to-left: a bigger first number keeps the photo solid further left. Raise the `86%` to move the boundary further left, lower it to show more blue. This moves the boundary only — the picture itself does not move. **Change both lines identically** — one is the Safari prefix |
| 825 | `right: -18rem` | How far the picture **hangs off the right edge**. This has to stay bigger than the slide below, or the picture stops reaching the screen edge and a sliver of blue reappears on the right |

---

## Before you publish a change

The white text sits on top of the photograph, so anything that moves the
picture left, lightens the blue, or softens the fade can make the text hard to
read. There is a script that checks this properly by sampling the real pixels
behind every line of text:

```
python hero_contrast.py
```

It is in the session scratchpad, not the repo. It must report `FAILURES: 0`.
The requirement is 4.5:1; today the worst case is 5.69:1, so there is not a
huge amount of headroom.

Also check the banner at a narrow window (drag it down to phone width). Below
880px the picture stops sitting beside the text and becomes a strip underneath
it, which is a completely different layout with its own rules further down the
stylesheet.
