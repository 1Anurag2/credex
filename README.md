# Credex AI Spend Audit

A free tool that evaluates your startup's AI tool spend, instantly calculates potential savings, and provides a personalized, LLM-generated optimization report. Built for engineering managers and founders who want to stop overpaying for duplicate AI subscriptions.

## Screenshots

> ## Dashboard
>
> ![Dashboard](./images/Screenshot%202026-05-12%20135746.png)

## Audit Form
![Audit Form](./images/Screenshot%202026-05-12%20135806.png)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy the `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```

Required keys:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `ANTHROPIC_API_KEY`

### 3. Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### 4. Deploy

To deploy, push the code to a GitHub repository and connect it to Vercel. Ensure you add the environment variables in the Vercel dashboard before deploying.

## Decisions (Trade-offs)

1. **Next.js over Vite**: Traded a slightly heavier initial setup for native Server-Side Rendering (SSR). SSR is mandatory for generating dynamic Open Graph tags on the shareable URL, which is the core of the viral loop.
2. **Hardcoded Pricing over DB**: Traded CMS flexibility for speed and reliability. Hardcoding the pricing tiers in `utils/auditEngine.ts` guarantees the math is always correct for the MVP without requiring complex DB schemas.
3. **LLM as Synthesizer, not Calculator**: Traded "pure AI" for defensible logic. I wrote explicit math rules for the pricing to ensure accuracy, and only use the Anthropic API to write the prose summary. LLMs are bad at math, so this ensures financial trust.
4. **Email Gating _After_ Value**: Traded higher total lead volume for higher _quality_ leads. The user sees their total savings upfront, but must provide an email to get the detailed breakdown and shareable link.
5. **Supabase over SQLite**: Traded local simplicity for a real cloud backend. Using Vercel + Supabase ensures the lead data is actually stored in a production-ready environment as requested.

## Live Deployment

> _(Add your Vercel URL here)_
