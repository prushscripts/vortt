# VORTT — First-Time Deploy Setup

Run `deploy.bat` any time to push and deploy. Before the first run, do these steps once.

---

## Step 1 — Create GitHub Repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `vortt` (private or public)
3. **Do NOT** initialize with README, .gitignore, or license — the code is already here
4. Copy the repo URL: `https://github.com/YOUR_USERNAME/vortt.git`

---

## Step 2 — Create Vercel Account

1. Go to [vercel.com](https://vercel.com) → sign up with GitHub (free)
2. That's it — the deploy script handles the rest

---

## Step 3 — Run deploy.bat

Double-click `deploy.bat` in Windows Explorer (or run it in terminal).

- First run: it will ask for your GitHub repo URL, then walk you through Vercel setup
- Every run after that: just enter a commit message and it handles everything

---

## Step 4 — Add Environment Variables in Vercel

After first deploy, go to:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these (required for the app to load):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `DATABASE_URL` | Your PostgreSQL connection string |
| `OPENAI_API_KEY` | Your OpenAI key |
| `TWILIO_ACCOUNT_SID` | Your Twilio SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Your Twilio number (+1...) |
| `NEXT_PUBLIC_GOOGLE_MAPS_KEY` | Your Google Maps API key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |

After adding variables, Vercel will redeploy automatically.

---

## Quick Reference

```
deploy.bat          → commit + push + deploy (daily use)
npm run dev         → local dev server at localhost:3000
npx prisma migrate dev → apply schema changes to DB
npx prisma studio   → visual DB browser
```
