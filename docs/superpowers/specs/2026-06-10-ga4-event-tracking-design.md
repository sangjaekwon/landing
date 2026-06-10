# GA4 Event Tracking — Design Spec

**Date:** 2026-06-10
**Status:** Approved

---

## Overview

Wire up real GA4 (`gtag`) event tracking for the three landing page features (시세 확인 / 행사 알림 / 거래). Currently `click_price` / `click_event` / `click_trade` are only written to `localStorage` (`/logs` debug page) and never reach GA4, even though the `gtag.js` snippet is already installed in `index.html` (measurement ID `G-00RCP0QN93`).

This spec adds:
- 6 core click events (CTA click + survey-CTA click, per feature)
- 1 bonus drop-off event (`dialog_close`)
- UTM passthrough as event parameters
- Removal of a dead `<script>` tag in `App.tsx`

---

## 1. Event Definitions

| # | Event name | Trigger | `feature` | Extra params | Notes |
|---|---|---|---|---|---|
| 1 | `click_price` | Click "시세 확인하기" CTA (opens dialog) | `price` | `utm_source`/`utm_medium`/`utm_campaign` | Existing name, GA4 send is new |
| 2 | `click_price_survey` | Click "설문 참여하기" inside the price flow's beta-gate screen (opens Google Form) | `price` | 〃 | New |
| 3 | `click_event` | Click "알림 설정하기" CTA | `event` | 〃 | Existing name, GA4 send is new |
| 4 | `click_event_survey` | Click "설문 참여하기" inside the event-alert flow's beta-gate screen | `event` | 〃 | New |
| 5 | `click_trade` | Click "거래 시작하기" CTA | `trade` | 〃 | Existing name, GA4 send is new |
| 6 | `click_trade_survey` | Click "설문 참여하기" inside the trade flow's beta-gate screen | `trade` | 〃 | New |
| 7 (bonus) | `dialog_close` | Click the dialog's "×" close button (abandon, not via survey CTA) | `price`/`event`/`trade` | `step: 'form' \| 'survey_prompt'`, utm_* | New — funnel drop-off point |

- `dialog_close` only fires from the explicit "×" button. Clicking "설문 참여하기" (which also closes the dialog) fires event #2/4/6 instead, never `dialog_close`.
- `step: 'form'` = closed before submitting the inner form. `step: 'survey_prompt'` = submitted the form, saw the beta-gate "설문 참여하기" screen, but closed without clicking it.
- UTM values come from the existing `getStoredUtm()` (reads `pkb_session_utm` from localStorage, captured on first visit via `captureUtm()`). Empty UTM fields are omitted from the event params rather than sent as empty strings.

---

## 2. Implementation

### 2a. `trackEvent` helper (`src/App.tsx`)

New function alongside the existing `logEvent`:

```ts
function trackEvent(name: string, params: Record<string, string> = {}): void {
  const utm = getStoredUtm();
  const cleanUtm = Object.fromEntries(
    Object.entries(utm).filter(([, v]) => v)
  );
  window.gtag?.('event', name, { ...cleanUtm, ...params });
  logEvent(name);
}
```

- Calls `gtag('event', ...)` for GA4 and keeps the existing `logEvent` call so `/logs` keeps working.
- `window.gtag` is optional-chained since the script may not have loaded yet (ad blockers, slow network).

### 2b. Type declaration (`src/vite-env.d.ts`)

```ts
interface Window {
  gtag?: (...args: unknown[]) => void;
}
```

### 2c. `src/content/landing.ts` changes

- `ValidationAction` type gains `surveyEvent: string`.
- Each entry in `validationActions` gets its survey event name:
  - `price` → `surveyEvent: 'click_price_survey'`
  - `event` → `surveyEvent: 'click_event_survey'`
  - `trade` → `surveyEvent: 'click_trade_survey'`
- `analyticsEvents` array gains 4 new entries (appended, existing entries unchanged):
  `'click_price_survey'`, `'click_event_survey'`, `'click_trade_survey'`, `'dialog_close'`

### 2d. Wiring in `src/App.tsx`

1. **`ValidationCard`** — CTA button `onClick`: replace `logEvent(action.analyticsEvent)` with `trackEvent(action.analyticsEvent, { feature: action.id })`.
2. **`FeatureDialog`** — "설문 참여하기" button `onClick`: add `trackEvent(action.surveyEvent, { feature: action.id })` (alongside the existing `window.open(googleFormUrl, ...)` and `onClose()` calls).
3. **`FeatureDialog`** — "×" close button `onClick`: add `trackEvent('dialog_close', { feature: action.id, step: submitted ? 'survey_prompt' : 'form' })` before calling `onClose()`.

### 2e. Cleanup

Remove the dead `<script async src="https://www.googletagmanager.com/gtag/js?id=G-00RCP0QN93"></script>` at `App.tsx:609`. It renders inside React's JSX tree and never executes; the real tag is already correctly installed in `index.html`.

---

## 3. Testing & Verification

### Unit tests

- `src/test/setup.ts`: add `window.gtag = vi.fn()` so `gtag` is mockable/spy-able in every test.
- `src/content/landing.test.ts`:
  - Update the `analyticsEvents` equality assertion to include the 4 new names.
  - Add assertions that each `validationActions[].surveyEvent` matches `/^click_.*_survey$/` and corresponds to the action's `id`.
- `src/App.test.tsx`:
  - For each of the 3 CTA buttons, clicking it calls `gtag('event', 'click_<feature>', expect.objectContaining({ feature: '<feature>' }))`.
  - For at least the price flow (CTA click → submit form → click "설문 참여하기"), assert `gtag('event', 'click_price_survey', expect.objectContaining({ feature: 'price' }))`.
  - Closing a dialog via "×" before submitting fires `gtag('event', 'dialog_close', expect.objectContaining({ feature: '<feature>', step: 'form' }))`.
  - Closing a dialog via "×" after submitting (beta-gate screen visible) fires `dialog_close` with `step: 'survey_prompt'`.

### Manual verification

1. `npm test` passes.
2. Local dev (`npm run dev`): click through all 3 flows, inspect `window.dataLayer` in devtools console to confirm pushes.
3. After deploying to Vercel: open the live site, trigger each of the 7 events, and confirm they appear in GA4 **Realtime** report / **DebugView** (with GA Debugger extension or `?gtm_debug=x`).

---

## 4. Post-Deploy GA4 Admin Setup (no code — manual console steps)

These steps happen in the GA4 console (analytics.google.com) after the code ships and events start flowing:

1. **Register custom dimensions** (Admin → Data display → Custom definitions → Create custom dimension), event-scoped:
   - `feature` (event parameter: `feature`)
   - `step` (event parameter: `step`)
   - `utm_source`, `utm_medium`, `utm_campaign` (event parameters of the same names)
   - Custom dimensions only start populating from the moment they're registered — register them as soon as possible after deploy so historical gaps are minimal.
2. **Mark conversions** (Admin → Data display → Events → toggle "Mark as conversion"):
   - `click_price_survey`, `click_event_survey`, `click_trade_survey` — these represent users reaching the actual lead-gen action (Google Form).
   - Do **not** mark the CTA clicks (1/3/5) or `dialog_close` as conversions — they're funnel/engagement signals, not the goal action.
3. **Build a funnel exploration** (Explore → Funnel exploration) per feature using `click_<feature>` → `click_<feature>_survey`, broken down by the `feature`/`utm_source` custom dimensions, to see CTA→survey conversion rate per feature and per campaign.
4. **(Optional) Verify in DebugView** before fully trusting numbers: add `&debug_mode=true` via GA Debugger or `gtag('set', 'debug_mode', true)` temporarily.

---

## Out of Scope

- Hero CTA ("서비스 둘러보기") click tracking — not requested for this round.
- Fixing `index.html`'s `gtag.js` `<script>` block being placed after `</html>` (works in browsers due to HTML parser leniency, but is technically invalid markup). Noted for a future cleanup pass.
- Wiring the unused `submit_price_card` / `submit_event_alert` / `submit_trade_card` / `select_trade_buy` / `select_trade_sell` entries already present in `analyticsEvents`.
