# AGENTS.md

## Repository layout

pnpm monorepo, but only **`apps/web`** is real code. `apps/api`, `packages/*` (config, ui, types, utils), `infrastructure/*`, and `docs/*` are empty placeholders — do not assume they exist or hold anything. All work happens inside `apps/web`. Run all pnpm/node commands from `apps/web` (there is no root `package.json`; tooling binaries live in `apps/web/node_modules/.bin`).

`apps/web` is a Next.js 16 (App Router) app + Prisma against PostgreSQL.

## Commands (run from `apps/web`)

- `pnpm dev` — Next dev server on :3000
- `pnpm lint` — `eslint` (flat config, no args; covers `.next` etc. via config)
- `pnpm build` — **runs `prisma generate` before `next build`**. This ordering matters.
- There is **no test suite** and **no typecheck script**. To typecheck: `pnpm exec tsc --noEmit` (strict mode; client imports resolve only after `prisma generate`).
- Prisma CLI: `pnpm exec prisma migrate <...>`. Schema: `prisma/schema.prisma`; migrations in `prisma/migrations`.

Use `pnpm exec <bin>` rather than relying on a global install.

## Prisma is non-standard — read before touching

- Generator is `prisma-client` (Prisma 7 style), output to `lib/generated/prisma`, which is **gitignored**. It must be regenerated (`pnpm exec prisma generate`) before the project typechecks or builds. Imports come from `@/lib/generated/prisma/client`.
- DB access is via a **pg driver adapter**, not the default engine. `lib/prisma/client.ts` builds a custom `pg.Pool` (max 5, with DNS resolution and SSL), then `PrismaPg(pool)` → `PrismaClient`. If you change DB connection behavior, change it here.
- The schema has **no inline datasource url**; the data source URL is read from `DIRECT_URL` via `prisma7.config.ts` (not `DATABASE_URL`). Keep them consistent when pointed at the same DB.
- Code consistently passes `Prisma.TransactionClient` (as `tx`/`prisma`) into service/repository functions rather than importing the singleton — follow this pattern for any multi-step DB writes.

## Env vars (from `.env` / code references)

`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (≥32 chars, used to sign JWTs), `BOOKING_TIME_ZONE` (must equal `Asia/Kolkata`), `DEFAULT_INTERVIEWER_ID`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`. `.env` and `.env.backup` are gitignored.

## Architecture / conventions

- **Feature modules** live in `modules/<domain>/` with standard subfolders: `components/`, `constants/`, `context/`, `hooks/`, `services/`, `types/`, `utils/`, plus `repositories/` under `booking`. Shared/infra code lives in `lib/` (`lib/auth`, `lib/prisma`, `lib/razorpay`). Cross-cutting session-type config such as the allowed/sold session is in `modules/booking/constants/` and `modules/booking/types/`.
- **Auth is custom**, not NextAuth: `lib/auth/session.ts` signs/verifies an HS256 JWT in an httpOnly `vlsikeens_session` cookie (7-day). `lib/auth/current-user.ts` resolves the DB user; `lib/auth/password.ts` uses bcrypt (12 rounds). Route handlers read `getSessionUser()`/`getCurrentUser()`.
- **Booking/payments are server-authoritative and live in `modules/payments/services/payment.service.ts`.** This is the heart of the flow: validate → hold reservation → create booking → claim coupon → create payment. All booking writes must run inside a Prisma `$transaction`. The Razorpay webhook (`app/api/webhooks/razorpay/route.ts`) verifies the HMAC signature, and runs `confirmWebhookPayment` in a `Serializable` transaction. `verifyRazorpaySignature` uses `timingSafeEqual`.
- **Only "Mock Interview" + "Design Verification" are currently sellable** — other session types/domains are gated in `payment.service.ts` (throws `PaymentValidationError`) and marked "Under Development" in `modules/booking/constants/booking.constants.ts`, even though they appear in the UI.
- **Slot times are IST (`+05:30`)**; parsing in `payment.service.ts` requires `hh:mm AM/PM`, and a future slot; `BOOKING_TIME_ZONE` must be `Asia/Kolkata`.
- **All monetary amounts are integers** (paise / INR). Don't introduce floats.
- Dates/slots must be **future** and past time windows; held reservations expire (see `RESERVATION`/`expireHeldReservations` in `modules/booking/repositories/reservation.repository.ts`), with a 10-minute hold enforced in `modules/booking/services/reservation.service.ts`.
- Booking has a fixed 7-step wizard (`modules/booking/constants/booking.routes.ts`), with `app/book-session/*` pages and matching `app/api/booking/*` routes.

## Gotchas

- Generated Prisma client is absent on a fresh clone until `prisma generate` is run — expect type errors before that.
- `eslint.config.mjs` is flat config with explicit `globalIgnores`.
- When adding API routes, follow the existing pattern in `app/api/*`: validate input defensively (unknown-typed request bodies), return `NextResponse.json({ error })` with 4xx codes, and only write to the DB inside transactions.
