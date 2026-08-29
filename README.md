# GATE 2027 Study Tracker — competitive edition

A full-stack rebuild of the single-page GATE tracker: real accounts, cloud-saved progress,
the complete **CSE** and **EE/ECE** GATE 2027 syllabi, and a daily competition leaderboard.

## Stack

- **Next.js 14** (App Router, server components) + TypeScript + Tailwind
- **Prisma** — SQLite for local dev, one-line switch to Postgres for deploy
- **Own auth** — email + password (bcrypt) with an HTTP-only JWT session cookie
- framer-motion, recharts, lucide-react

## Routes

| Route | What it does |
| --- | --- |
| `/` | Public landing page with a live "top 3 today" preview |
| `/auth` | Sign up (name, avatar, colour, branch) or sign in — no email confirmation |
| `/dashboard` | Streak, progress ring, daily task set, session logger, focus timer, insights, syllabus accordion |
| `/compete` | Today / week / all-time leaderboards, branch filter, "who's winning" banner, 14-day winners strip |
| `/profile` | Edit name / avatar / colour / branch, personal stats, subject breakdown chart |

## Scoring

```
daily score = topics × 10 + daily tasks × 5 + hours × 8 + 15 (if every daily task is done)
streak      = consecutive days with a score > 0
```

Scores are cached per user per day in `DailyScore` and recomputed on every mutation, so
leaderboard reads are a single cheap query.

## Data model

`User`, `TopicProgress`, `DailyTaskDone`, `StudySession`, `DailyScore` (see `prisma/schema.prisma`).
Syllabus content ships as typed constants in `src/data/` (not database rows) so topic ids stay stable.
Every API route resolves the user from the session cookie and only ever reads or writes that user's
rows; the leaderboard endpoint returns display name, avatar, branch, score and streak — never emails.

## Local setup

```bash
cp .env.example .env      # set AUTH_SECRET to any long random string
npm install
npx prisma migrate dev    # creates prisma/dev.db
npm run db:seed           # optional demo users
npm run dev               # http://localhost:3000
```

Seeded demo accounts (password `gate2027`): `krish@demo.dev`, `aarav@demo.dev` (CSE),
`isha@demo.dev`, `dev@demo.dev` (ECE).

## Deploying

1. Set `provider = "postgresql"` in `prisma/schema.prisma`.
2. Point `DATABASE_URL` at a hosted Postgres (Neon, Supabase, Railway…).
3. Set `AUTH_SECRET` and optionally `NEXT_PUBLIC_APP_TIMEZONE` (defaults to `Asia/Kolkata`,
   which decides when the "day" rolls over for streaks and daily scores).
4. `npx prisma migrate deploy && npm run build`.
