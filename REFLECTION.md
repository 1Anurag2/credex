# Reflection

> **NOTE TO CANDIDATE**: You MUST edit this file to reflect your actual experience. The entries below are placeholders/drafts.

## 1. The hardest bug you hit this week, and how you debugged it
The hardest bug was dealing with the Anthropic API rate limits occasionally causing the summary generation to fail, which broke the UI flow. My hypothesis was that I wasn't catching the `429` status code correctly on the backend and sending a generic `500` to the frontend instead. I debugged it by using Postman to intentionally hammer the endpoint and watched the Next.js server logs. I realized I needed to wrap the Anthropic call in a `try/catch` and, if it failed, return a hardcoded templated summary. I implemented a fallback template that reads the math engine's output directly, ensuring the user always gets a summary even if the LLM is down.

## 2. A decision you reversed mid-week, and what made you reverse it
I originally planned to build this as a pure Single Page Application (SPA) using Vite. However, mid-week I reversed that decision and migrated to Next.js App Router. The requirement to have a "Shareable result URL" with "Open Graph tags for clean link previews" made me realize that doing client-side OG tags in Vite is incredibly painful and often ignored by Twitter/Slack crawlers. Moving to Next.js allowed me to use Server-Side Rendering (`generateMetadata`) to pull the specific audit from Supabase and render dynamic OG tags seamlessly.

## 3. What you would build in week 2 if you had it
If I had Week 2, I would build the "Benchmark Mode" feature. Right now, the tool tells you if *you* are overspending based on pricing tiers. But I'd love to aggregate the anonymous data from the database to say: "You spend $400/developer/month on AI tools. Startups your size average $250/developer/month." This adds a layer of FOMO and competitive benchmarking that makes the tool even more viral. I would also implement the PDF export feature using `react-pdf` to make the report easier to circulate internally at a company.

## 4. How you used AI tools
I used **Claude 3.5 Sonnet** (via the web UI) and **Gemini** as pair programmers. I primarily used them to help draft the Next.js API routes quickly, particularly the Resend integration. I did *not* trust them to write the core `auditEngine.ts` math logic; I wrote that by hand because LLMs are notoriously bad at correctly applying complex pricing conditions (like minimum seat requirements). One specific time the AI was wrong: it suggested using a client-side Supabase call for saving leads, but doing so would expose my Supabase anon key, which technically violates the "No secrets in the repo/client" rule if I didn't want the user to be able to spoof lead data. I caught it and moved the logic to a Next.js API route.

## 5. Self-rating (1-10)
- **Discipline**: 9/10 — I stuck to the plan, committed consistently, and didn't fall into the trap of over-engineering early.
- **Code quality**: 8/10 — The Next.js code is clean and typed, though the CSS could be further componentized.
- **Design sense**: 8/10 — The UI uses Shadcn and Tailwind to look professional and trustworthy.
- **Problem-solving**: 9/10 — The decision to switch to Next.js for Open Graph tags was a critical pivot that saved the viral loop feature.
- **Entrepreneurial thinking**: 9/10 — The GTM strategy focuses heavily on zero-budget channels where the target demographic actually hangs out.
