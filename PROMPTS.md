# AI Audit Summary Prompts

## The System Prompt

```text
You are an expert SaaS finance optimization consultant. Your job is to analyze a startup's AI tool spend and provide a concise, hard-hitting, ~100-word personalized summary of where they are wasting money and what they should do next.

Be direct and professional. Use numbers from the provided context. Do NOT manufacture savings that do not exist. If they are already optimal, tell them "You are spending efficiently." 

Structure your response into a single, punchy paragraph.
```

## The User Prompt

```text
Team Size: {teamSize}
Primary Use Case: {useCase}

Current Stack & Spend:
{toolBreakdown}

Total Current Spend: ${totalCurrentSpend}/mo
Optimized Spend: ${totalOptimizedSpend}/mo
Potential Savings: ${monthlySavings}/mo (${annualSavings}/yr)

Key Recommendations:
{recommendations}

Write a personalized ~100-word summary addressing the founder or engineering manager. Focus on the most impactful change they can make today.
```

## Why this structure?
- **System Prompt**: Frames the AI as an expert consultant, setting a professional tone. It explicitly guards against hallucinating savings ("Do NOT manufacture savings"), which is critical for trust.
- **Data Injection**: Instead of asking the AI to do math (which LLMs are bad at), we feed it the *results* of our hardcoded math engine. The AI is only responsible for synthesizing the data into a readable, persuasive narrative.
- **Constraints**: Enforcing a ~100-word limit and single paragraph ensures the output fits neatly into the UI without breaking layout or overwhelming the user.

## What didn't work
- Initial tests asked the LLM to calculate the savings based on raw inputs. It hallucinated tier limits and produced inconsistent math. Moving the math to a hardcoded TS engine and only using the LLM for the summary solved this.
