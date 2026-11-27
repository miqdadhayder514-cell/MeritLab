# MeritLab

MeritLab is a preparation platform for students working toward the National
University of Sciences and Technology (NUST) Entry Test.

## Technology

- Next.js App Router with React and TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL with Row Level Security
- Biome for linting and formatting

The mock-test section includes the 200-question "NUST NET-Engineering Full Mock
Test 1" and "NUST NET-Engineering Full Mock Test 2" from their corresponding
PDFs in `Full Mock Tests/`. Each paper has a 180-minute time limit. Practice
attempts, results, and answer reviews are kept separately in the current
browser session; scores are not persisted to Supabase.
Additional question banks, practice features, and analytics remain planned
phases.

## Architecture and security

- Keep student-specific data access and exam scoring on the server.
- Enforce database authorization with PostgreSQL row-level security policies.
- Never expose a Supabase service-role key to browser code.
- Avoid shared caching for personalized pages unless the data is explicitly
  safe to cache.
- Database schema changes will be tracked as ordered Supabase migrations. Domain
  tables and seed data will be introduced with their implementation phases.

## Environment

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from **Supabase Dashboard → Project
Settings → API**. The publishable key is intended for browser use. Never put a
secret or service-role key in a `NEXT_PUBLIC_` variable or commit `.env.local`.

The centralized browser/server clients use Supabase's SSR cookie-based session
handling. Authentication callbacks return to `/auth/callback`; add the deployed
site's origin and `https://your-domain.example/auth/callback` to
**Authentication → URL Configuration → Redirect URLs** in the Supabase
Dashboard. Keep the local `http://localhost:3000/**` redirect enabled during
development. Also enable email confirmations in **Authentication → Providers →
Email**. Password recovery redirects to `/auth/callback?next=/reset-password`.

## Database setup

Apply the versioned schema migration to the Supabase project:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The migration creates `profiles` and `user_roles`, inserts a student's profile
and `student` role from an Auth-user trigger, and enables restrictive RLS.
Authenticated users can only read their own profile and role. Profile updates
are limited to name, phone, avatar URL, and NET category; email follows Auth.
Role changes are available only through the `admin_set_user_role` database
function to an existing administrator; client role writes are not granted.

To establish the first administrator, use the Supabase SQL Editor as the project
owner after that account has registered and verified its email:

```sql
update public.user_roles
set role = 'admin'
where user_id = (
  select id from auth.users where email = 'admin@example.com'
);
```

There is deliberately no public administrator registration path. Subsequent
role changes should use `public.admin_set_user_role(uuid, text)` from a trusted
admin operation.

## Requirements

- Node.js 20.9 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Cloudflare Workers deployment

The production deployment uses OpenNext for Cloudflare Workers. In the
Cloudflare Workers Builds settings, use `npm run build:worker` as the build
command and `npx wrangler deploy` as the deploy command. Configure
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as
Cloudflare build environment variables so Next.js can include them in the
client bundle. Do not commit them to `wrangler.jsonc`.

To build and preview the Worker locally, run `npm run preview`. To deploy from
the command line, run `npm run deploy`.

## Validation

```bash
npm run lint
npm run check
npm run typecheck
npm run build
```

GitHub Actions runs the same checks on pushes and pull requests.
