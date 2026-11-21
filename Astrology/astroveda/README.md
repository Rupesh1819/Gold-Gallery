# AstroVeda — Vedic Astrology Consultation & Appointment Website

AstroVeda is a multilingual (English, Hindi, Marathi), mobile-first Vedic astrology consultation platform built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Supabase PostgreSQL.

## Features

- **Celestial Design System:** Deep Midnight (`#10172B`), Cosmic Blue (`#27304A`), Vedic Gold (`#D8B56D`), Warm Ivory (`#F7F3EA`), and Action Red (`#D62839`).
- **Multilingual Support:** Fully routed `/en`, `/hi`, and `/mr` pages powered by `next-intl` with Cormorant Garamond, Inter, and Noto Serif/Sans Devanagari fonts.
- **Consultation Booking Stepper:** Real-time slot selection, 4-step booking flow, and unique booking reference (`AST-XXXXXXXX`) generation.
- **Offline Payment Tracking:** Payments collected after consultations (UPI, Bank Transfer, Cash). No third-party payment gateway or card collection on the website.
- **Admin Dashboard:** Navy sidebar, appointment approvals/cancellations, weekly availability configuration, customer records, and DPDP-compliant data anonymisation.
- **PostgreSQL Database Integrity:** Row Level Security (RLS) on all 13 tables with exclusion constraints preventing double bookings.

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 20+ and npm
- Supabase CLI or Docker (optional for local database)

### 2. Installation
```bash
git clone <repository_url> astroveda
cd astroveda
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Supabase project credentials (URL, Publishable Key, and Service Role Secret Key).

### 4. Database Setup
Apply the migrations located in `supabase/migrations/` sequentially:
```bash
# Using Supabase CLI:
supabase db reset
# Or execute migrations 0001 through 0006 in your Supabase SQL Editor
```

### 5. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. The root URL automatically redirects to `/en` (or `/hi`/`/mr` based on your saved preference).

---

## Route Overview

### Public Multilingual Routes (`/en`, `/hi`, `/mr`)
- `/` — Homepage (Celestial Hero, Rashi Chakra, Highlights, Featured Services, About, Reviews, FAQs, CTA)
- `/about` — Editorial biography, verified lineage, credentials, and philosophy
- `/services` — All 8 consultation services with mode badges and prices
- `/services/[slug]` — Individual service in-depth breakdown, what to prepare, and FAQs
- `/book` — 4-step interactive booking stepper
- `/book/confirmation/[reference]` — Booking status, next steps, and self-service management
- `/horoscope` — 12 zodiac signs grid with daily, weekly, monthly tabs and lucky elements
- `/blog` & `/blog/[slug]` — Astrologer-authored articles on Vedic wisdom, Vastu, and remedies
- `/testimonials` — Consented client reviews and ratings
- `/contact` — Location, hours, tap-to-call, email, and direct WhatsApp click-to-chat
- `/faq` — Categorized questions on booking, payments, and consultation methods
- `/privacy-policy` — DPDP Act (2023) compliant privacy policy
- `/terms` — Consultation terms of service & statutory disclaimers
- `/cancellation-policy` — 24-hour rescheduling & cancellation policy

### Admin Portal
- `/admin/login` — Administrator sign-in
- `/admin` — Metrics overview (Appointments, Pending, Revenue) & upcoming consultation table
- `/admin/appointments` — Appointment management and status transitions
- `/admin/services` — Consultation offerings, durations, and pricing
- `/admin/availability` — Recurring weekly hours, breaks, and holiday exceptions
- `/admin/customers` — Client registry with DPDP-compliant anonymisation
- `/admin/content` — Article publishing and horoscope updates
- `/admin/testimonials` — Review consent verification and publishing
- `/admin/settings` — System approval mode (manual vs. auto) and business contacts

---

## Quality Assurance & Verification
- **Production Build:** `npm run build`
- **i18n Parity Check:** `npx tsx scripts/check-i18n.ts`
- **Pre-Launch Placeholder Scan:** `npx tsx scripts/check-placeholders.ts`
