# SA Sourcing Hub

Mobile-first cross-border order management app for buyers in the DRC, Congo-Brazzaville, Nigeria, and other markets to request goods sourced from South Africa.

## Stack

- Next.js App Router with TypeScript
- Tailwind CSS v4
- Drizzle ORM + Neon PostgreSQL
- NextAuth.js v5 credentials auth
- Vercel Blob uploads
- Resend transactional email
- Optional Upstash Redis rate limiting

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill required values.

3. Push the database schema to Neon:

```bash
npm run db:push
```

4. Start the app:

```bash
npm run dev
```

## Key Routes

- `/` landing page
- `/register` and `/login`
- `/dashboard`
- `/orders`, `/orders/new`, `/orders/[id]`
- `/notifications`
- `/profile`
- `/admin`, `/admin/orders`, `/admin/orders/[id]`, `/admin/users`

## Admin Access

Users register as `user` by default. Promote an admin directly in Neon:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Uploads

The upload route validates MIME type and file size server-side. Accepted types are JPEG, PNG, WEBP, HEIC, and PDF. Each file is limited to 10MB and stored in Vercel Blob.

## Email

Resend is used for transactional email. If `RESEND_API_KEY` is missing, email sends are skipped and logged server-side so local development still works.
