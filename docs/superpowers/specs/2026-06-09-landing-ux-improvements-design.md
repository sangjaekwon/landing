# Landing Page UX Improvements — Design Spec

**Date:** 2026-06-09  
**Status:** Approved

---

## Overview

A set of focused UX improvements to the PokeBase landing page covering: hero section redesign, live board cleanup, dialog form refactoring to beta-gate flow, and a UTM-based click analytics system with a local log viewer page.

---

## 1. Hero Section Redesign

**Current:** Two-column layout — left text block, right Pokemon card fan visual.

**New:** Full-width section with a mosaic grid of Pokemon character artwork as the background (25–30 Pokemon from PokeAPI official artwork sprites), covered by a semi-transparent dark gradient overlay. Heading, subtext, and CTA are centered vertically and horizontally over the overlay.

- Background images: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png` for a curated set of recognizable Pokemon (IDs: 1, 4, 7, 25, 39, 52, 54, 63, 79, 92, 104, 113, 116, 131, 133, 143, 147, 150, 151, 152, 155, 158, 175, 179, 196, 197, 202, 249, 250)
- Overlay: `rgba(0,0,0,0.55)` gradient so text is always readable
- Remove `HeroVisual` component and `heroFanCards` data entirely
- Hero layout becomes a single centered column with `text-align: center`

---

## 2. Gallery Card Name/Price Fix

Current `galleryCards` in `cards.ts` may have name/price mismatches due to CDN card IDs not matching displayed names. Audit and correct all entries so each `imageUrl`, `name`, and `priceRange` are consistent.

---

## 3. Live Board Cleanup

**Remove:** `search-box` div inside `DashboardPreview`.

**Reduce:** `이번 주 행사` metric value from `31개` to `3건` (consistent with actual event list shown below).

Event list stays at 3 items (already correct in code).

---

## 4. Remove Beta Section

Delete `SurveySection` component and its call in `App`. Remove `surveyEyebrow`, `surveyTitle`, `surveyDescription`, `surveyPrimaryLabel`, `surveySecondaryLabel` from `landingContent` and `LandingContent` type.

---

## 5. Dialog Refactor — Beta Gate Flow

All three dialogs now show a **beta modal** after the primary action button is clicked (instead of opening a Google Form). The submitted state message changes to:

> **아직 베타 기간입니다**  
> 여러분의 설문 참여가 더 좋은 서비스를 만들 수 있습니다.  
> [설문 참여하기] button → opens googleFormUrl

### 5a. 시세 확인 (PriceDialogContent)

Replace the current multi-field form with:
- Image upload area (drag-and-drop styled box, `<input type="file" accept="image/*">`)
- Single "등록하기" button
- On click → show beta modal (no actual upload needed for the fake door test)

### 5b. 행사 알림 (EventDialogContent)

- **관심 지역**: Change from toggle-button group to `<select>` dropdown containing all 17 Korean administrative regions + "전국" as default option:  
  전국, 서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주
- **관심 분야**: Expand from 5 categories to 8:  
  프로모 카드, 팝업스토어, 신제품 발매, 카드샵 행사, 대회·토너먼트, 한정판 굿즈, 온라인 이벤트, 콜라보 상품
- Remove 연락처 field
- On "알림 신청하기" click → beta modal

### 5c. 카드 구매·판매 (TradeDialogContent)

- Keep buy/sell tabs
- Keep card name field
- Keep budget/price field  
- **Remove** 카카오 오픈프로필 field entirely
- On submit → beta modal

---

## 6. UTM Analytics + Local Log Page

### UTM Capture

On app mount (`useEffect`), read URL search params:
```
?utm_source=instagram&utm_medium=post&utm_campaign=launch
```
Store as `{ utm_source, utm_medium, utm_campaign }` in localStorage key `pkb_session_utm`.

### Click Event Logging

A `logEvent(eventName: string)` utility writes to localStorage key `pkb_events` (JSON array):
```json
{ "event": "click_price", "ts": "2026-06-09T12:34:56Z", "utm_source": "instagram" }
```

Call `logEvent` on every CTA button click (existing `data-event` attributes are already on buttons — reuse them).

### Log Viewer Page (`/logs`)

A separate React component `LogsPage` rendered when `window.location.pathname === '/logs'`.

- Table showing all stored events: timestamp, event name, utm_source, utm_medium, utm_campaign
- "Clear logs" button
- Summary row: event counts grouped by name
- Not linked from the main nav (hidden admin page)

---

## Files Changed

| File | Change |
|------|--------|
| `src/App.tsx` | Hero redesign, dialog refactors, remove SurveySection, add UTM capture, add LogsPage route |
| `src/content/cards.ts` | Fix gallery card name/price/image mismatches, remove heroFanCards |
| `src/content/landing.ts` | Remove survey fields, update EVENT_REGIONS/CATEGORIES |
| `src/styles.css` | Hero full-bleed background styles, image upload box styles |
