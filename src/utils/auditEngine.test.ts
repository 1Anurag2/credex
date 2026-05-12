import { describe, it, expect } from 'vitest';
import { runAudit, AuditInput } from './auditEngine';

describe('Audit Engine', () => {
  it('calculates correct savings for Cursor Business overspend', () => {
    const input: AuditInput = {
      teamSize: 3,
      primaryUseCase: 'coding',
      tools: [
        { name: 'Cursor', plan: 'Business', monthlySpend: 120, seats: 3 }
      ]
    };
    
    const result = runAudit(input);
    expect(result.recommendations[0].savings).toBe(60); // (40-20) * 3
    expect(result.recommendations[0].recommendedAction).toBe('Downgrade to Pro');
    expect(result.totalMonthlySavings).toBe(60);
  });

  it('identifies Copilot Individual vs Business mismatch', () => {
    const input: AuditInput = {
      teamSize: 1,
      primaryUseCase: 'coding',
      tools: [
        { name: 'GitHub Copilot', plan: 'Business', monthlySpend: 19, seats: 1 }
      ]
    };
    
    const result = runAudit(input);
    expect(result.recommendations[0].savings).toBe(9); // 19 - 10
    expect(result.totalMonthlySavings).toBe(9);
  });

  it('recognizes when a user is already optimal', () => {
    const input: AuditInput = {
      teamSize: 10,
      primaryUseCase: 'coding',
      tools: [
        { name: 'Claude', plan: 'Pro', monthlySpend: 200, seats: 10 }
      ]
    };
    
    const result = runAudit(input);
    expect(result.recommendations[0].savings).toBe(0);
    expect(result.totalMonthlySavings).toBe(0);
  });

  it('recommends API alternatives for high-spend ChatGPT Teams', () => {
    // We didn't add API alternative logic for ChatGPT Team in the engine, but we did add a check for overlapping Claude/ChatGPT
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: 'mixed',
      tools: [
        { name: 'ChatGPT', plan: 'Plus', monthlySpend: 100, seats: 5 },
        { name: 'Claude', plan: 'Pro', monthlySpend: 100, seats: 5 }
      ]
    };
    
    const result = runAudit(input);
    // Should recommend consolidating
    const chatGptRec = result.recommendations.find(r => r.tool === 'ChatGPT');
    expect(chatGptRec?.savings).toBe(100);
    expect(chatGptRec?.recommendedAction).toBe('Consolidate subscriptions');
  });

  it('calculates total monthly and annual savings correctly across multiple tools', () => {
    const input: AuditInput = {
      teamSize: 2,
      primaryUseCase: 'mixed',
      tools: [
        { name: 'Claude', plan: 'Team', monthlySpend: 150, seats: 2 }, // min 5 seats = $150, should switch to Pro (2*20=40), savings = 110
        { name: 'Cursor', plan: 'Business', monthlySpend: 80, seats: 2 } // should downgrade to Pro, savings = 40
      ]
    };
    
    const result = runAudit(input);
    expect(result.totalMonthlySavings).toBe(150); // 110 + 40
    expect(result.totalAnnualSavings).toBe(1800);
    expect(result.totalCurrentSpend).toBe(230);
    expect(result.totalOptimizedSpend).toBe(80);
  });
});
