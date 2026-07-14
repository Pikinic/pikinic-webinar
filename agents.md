# Antigravity Agent Hand-off Notes — PiKiNiC Webinar Site

This file provides context, architectural details, and implementation notes for future AI coding agents working on this codebase.

---

## 1. Project Overview & Routing
The project is a Next.js App Router application built for the **PiKiNiC UK University Admissions Webinar** (scheduled for July 21st, 2026 at 8:00 PM WAT).

### Pages and Endpoints:
* **Homepage (`/` ➔ [app/page.tsx](file:///C:/Users/USER/Desktop/Picnic/pickinic_webinar/app/page.tsx))**:
  * Alternates white and deep-teal sections.
  * Features the Hero block, Trust Bar stats, Track Selector cards, Host biographies, Testimonials, FAQ list, and the Final CTA.
* **Registration Page (`/webinar/register` ➔ [app/webinar/register/page.tsx](file:///C:/Users/USER/Desktop/Picnic/pickinic_webinar/app/webinar/register/page.tsx))**:
  * A distraction-free landing page (no main nav or footer links).
  * Hosts the registration form and validates inputs using Zod.
  * Incorporates Google Calendar calendar link generation and trust assurances.
* **Registration API Endpoint (`/api/register` ➔ [app/api/register/route.ts](file:///C:/Users/USER/Desktop/Picnic/pickinic_webinar/app/api/register/route.ts))**:
  * Validates data server-side and writes to Google Sheets.

---

## 2. Component Architecture
All reusable components are located in the `app/components/` directory:

1. **`Header.tsx`**: Responsive, sticky navigation header. Displays the brand logo `logo.svg`, anchors for smooth scrolling, and the "Reserve Your Seat" CTA button.
2. **`Countdown.tsx`**: Client-side countdown timer ticking to July 21, 2026, 8pm WAT. Handles hydration states to prevent rendering mismatch.
   * `variant="cards"`: Displays animated cards with ticking seconds (used in Hero).
   * `variant="compact"`: Displays inline text (used in Footer CTA & Register Page).
3. **`TimelineRail.tsx`**: Interactive timeline rail representing the 24-hour admissions workflow.
   * Displays milestone nodes sequentially on scroll using `IntersectionObserver`.
   * Supports toggling between **Track A (Professionals - Red style)** and **Track B (Parents - Orange style)**.
4. **`FaqAccordion.tsx`**: Accordion component displaying common questions, utilizing the yellow active highlights.
5. **`ScrollProgress.tsx`**: A thin viewport progress bar pinned to the top of the browser.
6. **`Reveal.tsx`**: A viewport intersection wrapper that adds slide-up scroll reveal transitions to wrapped sections, respecting the `prefers-reduced-motion` query.

---

## 3. Styling & Tokens System (Tailwind CSS v4)
Configure styles inside [app/globals.css](file:///C:/Users/USER/Desktop/Picnic/pickinic_webinar/app/globals.css) using Tailwind CSS v4 `@theme` variables:
* `--color-teal-900`: `#045A58` (Primary branding/darks)
* `--color-red-500`: `#ED3237` (Track A Accent / CTAs)
* `--color-orange-500`: `#F58634` (Track B Accent)
* `--color-yellow-400`: `#FFCA06` (Highlight highlights)
* `--color-cream-50`: `#ffffff` (Assigned to white as requested for the main background)
* `--color-ink-900`: `#0C1917` (Body text near-black)
* `--font-sans`: Local custom brand font `atyp` (`--font-atyp`)
* `--font-mono`: System fallback monospace fonts (to prevent offline Next.js font build errors)

---

## 4. Form Validation (React Hook Form + Zod)
* Validation schema is defined in [app/schemas/register.ts](file:///C:/Users/USER/Desktop/Picnic/pickinic_webinar/app/schemas/register.ts).
* Handles input rules: name size bounds (2-50 characters), email formats, and a custom regex matching 10- or 11-digit local Nigerian mobile formats (with or without a leading `0`).
* **Frontend**: Wrapped in React Hook Form's resolver on the register page, displaying error helper text under input fields.
* **Backend**: The API route re-imports the Zod schema and runs a `safeParse` verification before triggering any storage processes.

---

## 5. Google Sheets API Integration
The API endpoint handles two sheets communication methods dynamically depending on the `.env.local` contents:

### Method A (Direct Service Account - standard GCP approach)
Uses the official Google APIs client (`googleapis`). It checks for `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY` inside your environment file and uses `google.auth.JWT` to authenticate and write rows.
* *Note: The Sheet must be shared with the Service Account email as an **Editor**.*

### Method B (Google Apps Script Web App URL)
If `GOOGLE_SCRIPT_URL` is set, it forwards the request data as a JSON payload to a public Apps Script endpoint.
* *Note: The Apps Script executes writes and native email dispatches.*

---

## 6. Project Credentials Setup (`.env.local`)
Create a [`.env.local`](file:///C:/Users/USER/Desktop/Picnic/pickinic_webinar/.env.local) file in the root folder with:
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account-email@project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SCRIPT_URL=
```
