# PokeBase Landing

Futuristic SaaS-style landing page for validating Pokemon card collector demand.

The page tests three equal fake-door actions:

- Price lookup: card photo or card name, language, contact.
- Event alerts: region, event types, open chat or alert signup.
- Trade intent: buy/sell choice, card details, price range, contact.

## Local Setup

```bash
npm install
npm run dev
npm test
npm run build
```

## External Links

Set these in local `.env.local` or Vercel environment variables:

```bash
VITE_GOOGLE_FORM_URL=https://forms.gle/your-form
VITE_KAKAO_OPENCHAT_URL=https://open.kakao.com/o/your-room
```

If `VITE_GOOGLE_FORM_URL` is empty, the three fake-door CTA buttons stay disabled and show a preparation state.

## Measurement Events

The page exposes stable `data-event` values for later analytics wiring:

```text
click_price
click_price_survey
click_event
click_event_survey
click_trade
click_trade_survey
dialog_close
```
