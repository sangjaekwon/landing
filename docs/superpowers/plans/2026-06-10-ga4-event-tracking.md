# GA4 Event Tracking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Send six core feature funnel events plus one dialog drop-off event from the React landing page to GA4 while keeping the local `/logs` debug view.

**Architecture:** Add a small `trackEvent` helper in `src/App.tsx` that forwards events to `window.gtag` with stable parameters and then records the same event in localStorage. Keep feature event names in `src/content/landing.ts` so UI wiring and tests share one contract.

**Tech Stack:** Vite, React, TypeScript, Vitest, React Testing Library, GA4 `gtag.js`.

---

### Task 1: Add Analytics Contract Tests

**Files:**
- Modify: `src/content/landing.test.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/test/setup.ts`

- [ ] **Step 1: Mock GA in test setup**

```ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

window.gtag = vi.fn();
```

- [ ] **Step 2: Assert survey event names in content tests**

Add expectations that `analyticsEvents` includes:

```ts
'click_price_survey',
'click_event_survey',
'click_trade_survey',
'dialog_close'
```

Also assert each `validationActions` entry has `surveyEvent` equal to `click_${action.id}_survey`.

- [ ] **Step 3: Assert GA4 dispatch from app tests**

Add tests that click the three primary feature buttons and expect calls like:

```ts
expect(window.gtag).toHaveBeenCalledWith(
  'event',
  'click_price',
  expect.objectContaining({ feature: 'price' })
);
```

Add a price-flow test that submits the form, clicks `설문 참여하기`, and expects `click_price_survey`.

Add two close tests: closing before submit sends `dialog_close` with `step: 'form'`; closing after submit sends `step: 'survey_prompt'`.

- [ ] **Step 4: Run tests to verify failure**

Run: `npm test -- --run`

Expected: FAIL because `window.gtag`, `surveyEvent`, and `trackEvent` wiring are not implemented yet.

### Task 2: Implement GA4 Tracking

**Files:**
- Modify: `src/vite-env.d.ts`
- Modify: `src/content/landing.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Declare optional `window.gtag`**

```ts
interface Window {
  gtag?: (...args: unknown[]) => void;
}
```

- [ ] **Step 2: Add survey events to action content**

Add `surveyEvent: string` to `ValidationAction`, append survey/drop-off names to `analyticsEvents`, and set:

```ts
surveyEvent: 'click_price_survey'
surveyEvent: 'click_event_survey'
surveyEvent: 'click_trade_survey'
```

- [ ] **Step 3: Add `trackEvent` helper**

```ts
function trackEvent(eventName: string, params: Record<string, string> = {}): void {
  const cleanUtm = Object.fromEntries(
    Object.entries(getStoredUtm()).filter(([, value]) => value)
  );
  window.gtag?.('event', eventName, { ...cleanUtm, ...params });
  logEvent(eventName);
}
```

- [ ] **Step 4: Wire events**

Primary CTA: `trackEvent(action.analyticsEvent, { feature: action.id })`.

Survey CTA: `trackEvent(action.surveyEvent, { feature: action.id })`.

Close button: `trackEvent('dialog_close', { feature: action.id, step: submitted ? 'survey_prompt' : 'form' })`.

- [ ] **Step 5: Run tests and build**

Run: `npm test -- --run`

Run: `npm run build`

Expected: both pass.
