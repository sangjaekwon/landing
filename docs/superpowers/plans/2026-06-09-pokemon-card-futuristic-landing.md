# Pokemon Card Futuristic Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite + React landing page that validates Pokemon card demand through three equal fake-door CTA paths.

**Architecture:** Keep business copy and CTA metadata in `src/content/landing.ts`, render the page in `src/App.tsx`, and keep visual styling in `src/styles.css`. Tests lock the content contract, CTA link state, and the presence of stable analytics event names.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, CSS.

---

## File Structure

- Create `package.json`: defines Vite, build, and test commands.
- Create `index.html`: Vite entry point.
- Create `tsconfig.json`: TypeScript project config.
- Create `vite.config.ts`: React/Vitest config.
- Create `src/main.tsx`: React root bootstrap.
- Create `src/App.tsx`: page composition, CTA rendering, dashboard preview, validation flow.
- Create `src/content/landing.ts`: typed copy, CTA metadata, event names, external link state.
- Create `src/content/landing.test.ts`: content and CTA state tests.
- Create `src/App.test.tsx`: rendered page tests.
- Create `src/test/setup.ts`: jest-dom setup.
- Create `src/styles.css`: futuristic SaaS visual system and responsive layout.
- Update `README.md`: local setup and env vars.

### Task 1: Restore Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/vite-env.d.ts`

- [ ] **Step 1: Write app/test scaffold without production landing code**

Create config files with React/Vite/Vitest scripts and no implemented landing behavior.

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: dependencies install and `package-lock.json` is generated.

### Task 2: Content Contract by TDD

**Files:**
- Create: `src/content/landing.test.ts`
- Create: `src/content/landing.ts`

- [ ] **Step 1: Write failing content tests**

Tests must assert:

- Title frames the product as Pokemon card intelligence, not a single-function app.
- Exactly three primary fake-door actions exist.
- Action IDs are `price`, `event`, and `trade`.
- Required analytics events include `click_price`, `click_event`, `click_trade`, `click_survey`, and `request_interview`.
- Missing Google Form URL disables CTA links.
- Configured Google Form URL enables CTA links.

- [ ] **Step 2: Run red test**

Run: `npm test -- src/content/landing.test.ts`
Expected: FAIL because `src/content/landing.ts` does not exist or exports are missing.

- [ ] **Step 3: Implement minimal content module**

Add typed landing content, action metadata, analytics event names, and `getActionLinkState()`.

- [ ] **Step 4: Run green test**

Run: `npm test -- src/content/landing.test.ts`
Expected: PASS.

### Task 3: Rendered Landing by TDD

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/App.tsx`
- Create: `src/main.tsx`

- [ ] **Step 1: Write failing render tests**

Tests must assert:

- Main hero heading renders.
- Three CTA action buttons render.
- Dashboard preview renders.
- Missing URL state renders disabled preparation buttons.
- Analytics `data-event` attributes are present for the three primary CTAs.

- [ ] **Step 2: Run red test**

Run: `npm test -- src/App.test.tsx`
Expected: FAIL because `src/App.tsx` is missing or incomplete.

- [ ] **Step 3: Implement React page**

Render navigation, hero, dashboard preview, CTA grid, validation flow, final CTA, and link state.

- [ ] **Step 4: Run green test**

Run: `npm test -- src/App.test.tsx`
Expected: PASS.

### Task 4: Visual Styling and Responsive QA

**Files:**
- Create: `src/styles.css`
- Update: `README.md`

- [ ] **Step 1: Implement CSS**

Create the dark SaaS visual system from the approved mockup: grid background, glass panels, gradient text, dashboard preview, balanced CTA cards, and mobile breakpoints.

- [ ] **Step 2: Run automated checks**

Run: `npm test`
Expected: all tests pass.

Run: `npm run build`
Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Browser QA**

Run local dev server, open the page, and check desktop and mobile screenshots for text overlap, blank areas, and CTA hierarchy.

- [ ] **Step 4: Final report**

Report files changed, verification commands, and any remaining caveats.
