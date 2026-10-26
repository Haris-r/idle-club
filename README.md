# DROP — Hoodie demand MVP

Mobile-first React + TypeScript + Vite + Supabase demand test. **Reservations are non-binding and take no payment.** Includes a landing page, hoodie illustration, selectable colours and sizes, quantity, email form, campaign tracking, admin magic-link login, statistics, and CSV export.

## Quickstart

1. Install Node.js 20.19+ (or 22.12+).
2. `npm install`
3. Create a [Supabase](https://supabase.com/dashboard) project, then run `supabase/schema.sql` in **SQL Editor**.
4. Copy `.env.example` to `.env.local`, fill in your project URL and **publishable** key (Supabase > Connect / API Keys). Never use a secret or service-role key in Vite.
5. In Supabase > Authentication > URL Configuration, set **Site URL** to your website and add `http://localhost:5173/admin` to redirect URLs for local login. Add your eventual production `/admin` address as well.
6. In Supabase > Authentication > Providers > Email, enable email OTP/magic-link sign-in and configure email sending for production. Restrict sign-ups where suitable.
7. `npm run dev` and open `http://localhost:5173`. Visit `http://localhost:5173/admin` and sign in once with the chosen admin email. Find that user's UUID in Supabase Authentication > Users; then run in SQL Editor: `insert into public.admin_users(user_id) values ('ACTUAL-UUID-HERE');` Refresh `/admin`.
8. `npm run build` to verify. Deploy to Vercel with the same `VITE_` environment variables. Configure SPA rewrite so `/admin` serves `index.html` (a sample `vercel.json` is provided).

## Before you share the link publicly (important)

- Replace the brand name, illustrative hoodie (not a photo of the actual merchandise), sample £45 launch price, planned fabric description, Instagram URL and product description.
- Replace `public/privacy.html` placeholder with a real UK GDPR privacy notice: identify controller, contact address, purposes, lawful basis, retention and rights. Keep optional marketing consent independent. Validate consent rules for any email campaigns.
- **Harden submission endpoint against abuse before launch.** The public RPC intentionally allows unauthenticated submissions; RLS blocks public reads, but it does not prevent bots from submitting fake reservations. Put a rate-limited server or Supabase Edge Function + Turnstile verification in front of writes; then revoke anonymous RPC execution and have only the server invoke it securely. Do not claim demand represents unique buyers (one email can reserve multiple variants and email addresses are not verified).
- Enable email confirmation / verification or at minimum a confirmation link before counting a registration as verified demand; consider a one-address-one-active-interest policy if that matches business goals.
- Limit and securely handle admin access; ensure production Supabase email sending is configured and test admin login with proper redirect URLs.
- Add explicit cancellation/removal workflow, bot protection, monitoring, accessibility and mobile testing.
- Export currently loads at most 5,000 submissions; implement paginated fetching for larger launches.
- Database uniqueness is per email + colour + size. Resubmitting the same combination **updates** quantity and preferences rather than increasing the total.

## Social campaign links

- `https://yourdomain.co.uk/?source=instagram`
- `https://yourdomain.co.uk/?source=tiktok`

This MVP deliberately avoids payments, checkout, inventory promises and shipping information. Product availability and final prices are unconfirmed.
