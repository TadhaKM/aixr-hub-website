# Connecting the forms

The site has 10 forms: **1 booking form** (contact page) and **9 mailing-list
signups** (the footer on all 8 pages, plus the newsletter band on Insights).

All the code is written and tested. What is left is creating the two accounts
and pasting four values into the top of [`forms.js`](forms.js).

Until you do, the forms show *"This form is not connected yet. Please email
trinityaixr@tcd.ie."* and log a warning in the browser console. They do **not**
fake a success message — a form that silently swallows a real booking is worse
than one that admits it is not finished.

---

## 1. Booking form → Formspree

Handles session bookings, event requests, and collaboration enquiries from the
contact page.

1. Go to **https://formspree.io** and create a free account.
2. **+ New Form**. Name it *Trinity AI XR Hub bookings*.
3. Set the recipient email to **trinityaixr@tcd.ie**.
4. Formspree shows you an endpoint like `https://formspree.io/f/abcdwxyz`.
   Copy it.
5. Open `forms.js` and replace the placeholder:

   ```js
   bookingEndpoint: "https://formspree.io/f/abcdwxyz",
   ```

6. Formspree will email you once to confirm the recipient address. Click that
   link or nothing will be delivered.

**Free tier:** 50 submissions per month. If the Hub outgrows that, their paid
tier is about €10/month, or move to a Vercel function (see *Alternatives*).

---

## 2. Mailing list → Mailchimp

1. Go to **https://mailchimp.com** and create a free account.
2. Create an **Audience** named *Trinity AI XR Hub*.
3. **Audience → Signup forms → Embedded form**.
4. In the generated HTML, find the `<form action="...">` URL. It looks like:

   ```
   https://trinityaixr.us21.list-manage.com/subscribe/post?u=a1b2c3d4e5f6&id=7g8h9i0j
   ```

5. Split it into the three pieces and paste them into `forms.js`:

   ```js
   mailchimp: {
     account: "trinityaixr.us21",   // the part before .list-manage.com
     u:       "a1b2c3d4e5f6",       // the u= value
     id:      "7g8h9i0j"            // the id= value
   }
   ```

6. **Turn on double opt-in** — *Audience → Settings → Audience name and
   defaults → Enable double opt-in*. This is not optional for a Trinity list:
   it sends a confirmation email, which is what makes the signup valid consent
   under GDPR, and it gives every subscriber an automatic unsubscribe link.

**Free tier:** up to 500 contacts and 1,000 sends/month.

---

## What you get once it is connected

| Behaviour | Booking form | Mailing list |
|---|---|---|
| Submits without leaving the page | yes | yes |
| Button disables and reads "Sending…" | yes | yes |
| Success message | "Request received. We aim to respond within 3–5 working days." | "Thanks. Check your inbox to confirm your subscription." |
| Already-subscribed address | n/a | "You are already on the list." |
| Server rejects it | shows the actual reason | shows the actual reason |
| Network fails | "Please email trinityaixr@tcd.ie." | same |
| Works with JavaScript disabled | yes, posts natively to the provider | yes |
| Spam protection | hidden honeypot field | honeypot + Mailchimp's own |

Submitted booking fields: name, email, organisation, topic, message. They
arrive with the subject line *"Trinity AI XR Hub booking request"*.

---

## Testing it

After pasting the values, run the site and submit each form once with your own
address. You should get:

- a booking email at trinityaixr@tcd.ie within a minute, and the submission
  visible in the Formspree dashboard;
- a Mailchimp confirmation email, and after clicking it, your address in the
  audience.

If nothing arrives, open the browser console (F12) — the failure reason is
printed there.

---

## Alternatives, if Formspree does not suit

The submission logic is isolated in `forms.js`. Swapping providers means
changing the endpoint and, for a non-Formspree service, the `submitBooking`
function. Two options that keep data inside your own infrastructure:

- **Vercel serverless function + Resend.** Requires a `RESEND_API_KEY`
  environment variable and a verified sender domain. Nothing passes through a
  third-party dashboard.
- **Microsoft Power Automate / Forms.** Trinity already licenses Microsoft 365,
  so this may be preferable to a new external supplier from a data-protection
  point of view. Worth asking TCD IT before signing up for anything.

---

## Data protection note

The booking form collects a name, email, organisation and free-text message;
the mailing list collects an email address. Both are personal data under GDPR.
Before this goes live you should:

- confirm with TCD that an external processor (Formspree / Mailchimp) is
  acceptable, and check whether a Data Processing Agreement is required;
- add a privacy notice, or link the existing Trinity one, near the booking
  form;
- keep double opt-in enabled so consent is recorded and evidenced.

The mailing-list forms already carry the line *"We will only use your address
for Hub news and event updates. You can unsubscribe at any time."*
