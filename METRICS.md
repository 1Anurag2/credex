# Metrics & Telemetry

## North Star Metric
**Number of Qualified Consultations Booked per Week**
*Why:* This is a B2B lead-gen tool for Credex. DAU (Daily Active Users) or "Audits Completed" are vanity metrics if they don't convert into revenue. The entire purpose of this tool is to identify startups overspending on AI and get them on a call with Credex to buy discounted credits. If this number is growing, the tool is a success.

## Input Metrics
1. **Visitor-to-Audit Conversion Rate**: The percentage of landing page visitors who actually complete the form. Target: >20%.
2. **K-Factor (Virality)**: How many new visits are generated per completed audit via the Shareable Public URL. This measures how effectively the tool acts as a viral loop.
3. **Average Identified Savings**: The dollar amount of savings the engine finds per audit. If this is consistently <$100, we are targeting the wrong demographic (e.g., hobbyists instead of Series A startups).

## First Instrumentation Focus
I would prioritize instrumenting the **Drop-off Points in the Form**. 
Specifically, using PostHog or Mixpanel, I want to see if users abandon the form when asked for their Monthly Spend vs their Team Size. This tells me if the cognitive load of finding their spend data is too high.

## The Pivot Trigger
**Trigger:** If we generate 1,000 completed audits but 0 consultations booked over a 4-week period.
**Action:** This indicates that the "savings" are either too low to motivate a conversation, or users don't trust Credex to fulfill the savings. We would need to pivot the CTA from "Book a Consultation" to something lower friction, like "Enter email to instantly receive a 10% discount code for Anthropic."
