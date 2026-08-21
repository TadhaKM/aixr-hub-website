# Parked pages

Pages that are finished but not currently part of the site. They live here
rather than in the site root so they are **not served or deployed** — Vercel
publishes every `.html` in the root, so an unlinked page there would still be
reachable by URL and indexable by search engines.

## insights.html — Insights & News

Parked on request. The page itself is complete: News, Blogs and Case Studies
sections, a subnav, a testimonial and a mailing-list signup.

### To bring it back

1. `git mv _parked/insights.html insights.html`
2. Restore the header nav item on **all 8 pages**, after Research:
   ```html
   <li><a href="insights.html">Insights</a></li>
   ```
3. Restore the three footer "Explore" links on **all 8 pages**:
   ```html
   <li><a href="insights.html">Insights &amp; News</a></li>
   <li><a href="insights.html#blogs">Blogs</a></li>
   <li><a href="insights.html#impact">Case Studies</a></li>
   ```
4. Restore the two in-page links:
   - `index.html` — the "All Updates" link beside the Latest News heading
   - `students.html` — the "Check Latest Events" link in Curriculum-Integrated Teaching
5. Optionally restore the three "Read More" links on the homepage news items.
   **Note:** these previously pointed at `insights.html#news`, which is the top
   of the section rather than an article — a guideline audit flagged them as
   misleading. Give them real article URLs, or leave them off.

The exact markup for every one of these is in the commit that parked the page.
