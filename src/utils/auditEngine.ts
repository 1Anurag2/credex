export type ToolName = "Cursor" | "GitHub Copilot" | "Claude" | "ChatGPT" | "Gemini" | "Windsurf" | "Anthropic API" | "OpenAI API";

export interface ToolInput {
  name: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditRecommendation {
  tool: ToolName;
  currentSpend: number;
  recommendedAction: string;
  savings: number;
  reason: string;
}

export interface AuditInput {
  teamSize: number;
  primaryUseCase: string;
  tools: ToolInput[];
}

export interface AuditResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: AuditRecommendation[] = [];
  let totalCurrentSpend = 0;
  let totalSavings = 0;

  const EXPECTED_COSTS: Record<string, Record<string, number>> = {
    "Cursor": { "Hobby": 0, "Pro": 20, "Business": 40, "Enterprise": 100 },
    "GitHub Copilot": { "Individual": 10, "Business": 19, "Enterprise": 39 },
    "Claude": { "Free": 0, "Pro": 20, "Team": 30, "Enterprise": 100, "API direct": 0 },
    "ChatGPT": { "Free": 0, "Plus": 20, "Team": 30, "Enterprise": 60, "API direct": 0 },
    "Gemini": { "Free": 0, "Advanced": 20, "API": 0 },
    "Windsurf": { "Free": 0, "Pro": 15, "Enterprise": 50 },
    "Anthropic API": { "API direct": 0 },
    "OpenAI API": { "API direct": 0 },
  };

  for (const tool of input.tools) {
    totalCurrentSpend += tool.monthlySpend;
    let savings = 0;
    let action = "Keep current plan";
    let reason = "You're spending efficiently.";

    switch (tool.name) {
      case "Cursor":
        if (tool.plan === "Business" && tool.seats < 5) {
          savings = (40 - 20) * tool.seats;
          action = "Downgrade to Pro";
          reason = "Business tier ($40/mo) is overkill for small teams. Pro ($20/mo) has the same core features.";
        } else if (tool.plan === "Enterprise") {
          savings = (tool.monthlySpend / tool.seats - 20) * tool.seats;
          action = "Review Enterprise Agreement";
          reason = "You may be overpaying for Enterprise features. Evaluate if Pro ($20/mo) suffices.";
        }
        break;

      case "GitHub Copilot":
        if (tool.plan === "Business" && tool.seats === 1) {
          savings = (19 - 10) * tool.seats;
          action = "Downgrade to Individual";
          reason = "Single users should use Individual ($10/mo) instead of Business ($19/mo).";
        } else if (tool.plan === "Enterprise" && input.primaryUseCase !== "mixed") {
          savings = (39 - 19) * tool.seats;
          action = "Downgrade to Business";
          reason = "Unless you need deep enterprise search, Business ($19/mo) is more cost-effective.";
        }
        break;

      case "Claude":
        if (tool.plan === "Team" && tool.seats < 5) {
          // Anthropic requires 5 seats min for Team
          savings = 150 - (20 * tool.seats);
          action = "Switch to Pro (Individual)";
          reason = "Team plan requires 5 minimum seats ($150/mo). Switching to individual Pro accounts saves money.";
        } else if (tool.plan === "Pro" && input.primaryUseCase === "coding" && input.tools.some(t => t.name === "Cursor")) {
          savings = tool.monthlySpend;
          action = "Cancel Claude Pro";
          reason = "You already pay for Cursor, which provides Claude 3.5 Sonnet access built-in.";
        }
        break;

      case "ChatGPT":
        if (tool.plan === "Team" && tool.seats === 1) {
          savings = 60 - 20; // min 2 users at $30/mo = 60 vs 20
          action = "Downgrade to Plus";
          reason = "Team plan requires 2 seats minimum. Plus is $20/mo and sufficient for individuals.";
        } else if (tool.plan === "Plus" && input.tools.some(t => t.name === "Claude" && (t.plan === "Pro" || t.plan === "Team"))) {
          savings = tool.monthlySpend;
          action = "Consolidate subscriptions";
          reason = "You are paying for both ChatGPT and Claude. Consider consolidating to one platform for non-coding tasks.";
        }
        break;
        
      case "Anthropic API":
      case "OpenAI API":
        if (tool.monthlySpend > 500 && input.teamSize < 10) {
          savings = tool.monthlySpend * 0.2; // Arbitrary 20% savings estimate for prompt optimization
          action = "Optimize API Prompts / Caching";
          reason = "API spend >$500/mo for a small team usually indicates unoptimized prompts or missing caching.";
        }
        break;
    }

    // Dynamic cost check if no specific rule matched
    if (savings === 0 && EXPECTED_COSTS[tool.name] && EXPECTED_COSTS[tool.name][tool.plan] !== undefined) {
      const expectedCost = EXPECTED_COSTS[tool.name][tool.plan] * tool.seats;
      if (tool.monthlySpend > expectedCost && expectedCost > 0) {
        savings = tool.monthlySpend - expectedCost;
        action = "Audit Unused Seats/Licenses";
        reason = `You are paying $${tool.monthlySpend}/mo, but ${tool.seats} seats on the ${tool.plan} plan should cost ~$${expectedCost}/mo. You may have unused or duplicate licenses.`;
      } else if (tool.monthlySpend > 0 && expectedCost === 0 && !tool.name.includes("API")) {
        savings = tool.monthlySpend;
        action = "Switch to Free Tier";
        reason = `The ${tool.plan} plan is usually free, but you're paying $${tool.monthlySpend}/mo. Review your billing setup.`;
      }
    }

    if (savings > 0) {
      totalSavings += savings;
    } else {
      savings = 0; // Prevent negative savings
    }

    recommendations.push({
      tool: tool.name,
      currentSpend: tool.monthlySpend,
      recommendedAction: action,
      savings,
      reason
    });
  }

  return {
    recommendations,
    totalMonthlySavings: totalSavings,
    totalAnnualSavings: totalSavings * 12,
    totalCurrentSpend,
    totalOptimizedSpend: totalCurrentSpend - totalSavings,
  };
}
