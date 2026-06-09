# Pokemon Card Futuristic Landing Design

## Goal

Build a one-page landing page for validating Pokemon card collector demand with three equal fake-door CTA paths: price lookup, event alerts, and buying/selling.

## Product Direction

The page should not position itself as only a price app, event app, or marketplace. It should feel like a collector intelligence dashboard that brings price signals, event signals, and trade intent into one beta product.

The first meaningful question for visitors is: which problem do they care enough about to complete a small action?

## Visual Direction

Use the SaaS futuristic app direction from the approved mockup:

- Dark modern SaaS background.
- Subtle grid texture.
- Glassy cards and panels.
- Gradient accent text and CTA buttons.
- Dashboard-style hero preview.
- No Positivus-style heavy black borders or lime-only palette.

The reference is the Figma community design "SaaS Futuristic App Webflow Landing Page Design" and related Vaultflow pages. The local mockup is `.superpowers/brainstorm/79933-1780933041/content/vaultflow-pokemon-flow.html`.

## Page Structure

1. Navigation with product name, product areas, and beta waitlist CTA.
2. Centered SaaS hero explaining that Pokemon card price, event, and trade signals are gathered in one beta dashboard.
3. Dashboard preview showing price request trends, event radar, and interview/user-signal metrics.
4. Three equal fake-door action cards:
   - Price lookup: card photo or card name, language, contact.
   - Event alerts: region, event types, open chat or alert signup.
   - Trade: buy/sell choice, card details, price range, contact.
5. Validation flow section explaining what happens after a fake-door action.
6. Final CTA for beta participation and survey/interview.

## Interaction Requirements

The first CTA cards must remain equal in hierarchy. The page may visually feel like an app dashboard, but it should not hide the three validation actions below decorative content.

Each action card should:

- Have a clear button.
- Show the small required input fields before the user clicks.
- Link to the configured Google Form URL when available.
- Fall back to a disabled or preparation state when the Google Form URL is missing.

## Analytics Events

The implementation should expose stable event names in content or data attributes so analytics can be added later:

- `click_price`
- `submit_price_card`
- `click_event`
- `submit_event_alert`
- `click_trade`
- `select_trade_buy`
- `select_trade_sell`
- `submit_trade_card`
- `click_survey`
- `request_interview`

## Constraints

Use the existing Vite + React + TypeScript setup. Keep the implementation as a static landing page, with no backend and no real form submission logic. The page can use links to Google Form and Kakao OpenChat environment variables.

Use responsive CSS so the hero, dashboard preview, CTA cards, and process section work on desktop and mobile without text overlap.

## Acceptance Criteria

- `npm test` passes.
- `npm run build` passes.
- The page renders in the browser with the futuristic SaaS design direction.
- The three fake-door CTA cards are visible and balanced.
- Korean text does not break awkwardly across mobile and desktop.
- Missing external URLs do not create broken links.
