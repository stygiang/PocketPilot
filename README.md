# Safe to Spend

Production-ready MVP monorepo for the Safe to Spend product (Next.js web + Expo mobile) sharing one backend and one calculation engine.

## Setup

```bash
npx pnpm install
```

## Env vars

### Web (`apps/web/.env`)

```
DATABASE_URL=
JWT_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_APP_URL=
RESEND_API_KEY=
CRON_SECRET=
```

### Mobile (`apps/mobile/.env`)

```
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Run dev

```bash
pnpm dev
```

- Web runs on `http://localhost:3000`
- Expo will open the dev client for mobile

## Auth setup

- This MVP uses email/password auth with JWT sessions.
- Set `JWT_SECRET` (any long random string).

## Stripe setup (web)

- Create a subscription price and set `STRIPE_PRICE_ID`.
- Configure webhook endpoint at `/api/stripe/webhook` and set `STRIPE_WEBHOOK_SECRET`.
- Use `/app/account` to upgrade/portal.

## Prisma + database

```bash
cd packages/db
pnpm prisma:generate
pnpm prisma:migrate
```

Seed demo data (optional):

```bash
SEED_USER_EMAIL=you@example.com SEED_USER_PASSWORD=Password123! pnpm seed
```

## Tests and checks

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Deploy notes

- Web: Deploy `apps/web` to Vercel. Add all env vars from `apps/web/.env`.
- Mobile: Use Expo EAS. Set `EXPO_PUBLIC_API_BASE_URL` to your deployed web URL.

## Monorepo layout

```
apps/web        Next.js app (API + web UI)
apps/mobile     Expo app
packages/core   Shared calculation engine
packages/db     Prisma schema + client
packages/validators Zod schemas
```
