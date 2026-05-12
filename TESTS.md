# Automated Tests

The core business logic is isolated in pure TypeScript functions to ensure the "savings" are mathematically defensible and easily testable without requiring React components or a database.

## Test Runner
We use **Vitest**.
To run the tests:
```bash
npm run test
```

## Test Files & Coverage

### `src/utils/auditEngine.test.ts`
This file covers the core audit logic.

1. **Test**: `calculates correct savings for Cursor Business overspend`
   - *Covers*: Ensures that if a user has a small team (< 5) but is paying for Business ($40/mo), the engine recommends downgrading to Pro ($20/mo) and accurately calculates the difference.
2. **Test**: `identifies Copilot Individual vs Business mismatch`
   - *Covers*: Ensures that if a single developer is paying for Copilot Business ($19/mo), it recommends downgrading to Individual ($10/mo).
3. **Test**: `recognizes when a user is already optimal`
   - *Covers*: Ensures the engine does *not* manufacture savings. If a user is on Claude Free or API direct with low spend, it correctly identifies $0 in savings.
4. **Test**: `recommends API alternatives for high-spend ChatGPT Teams`
   - *Covers*: If a team is spending >$200/mo on ChatGPT Team, suggests that moving some bulk operations to API could save X%.
5. **Test**: `calculates total monthly and annual savings correctly across multiple tools`
   - *Covers*: The aggregation function that sums up the recommendations array and multiplies by 12 for the annual hero number.
