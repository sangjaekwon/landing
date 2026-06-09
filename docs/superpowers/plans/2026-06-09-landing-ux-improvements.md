# Landing Page UX Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the hero to a full-bleed Pokemon character mosaic background, refactor all three feature dialogs to a beta-gate flow, clean up the live board, remove the SurveySection, and add UTM click analytics with a `/logs` viewer page.

**Architecture:** All changes live in the existing React SPA (`src/App.tsx`, `src/content/cards.ts`, `src/content/landing.ts`, `src/styles.css`). A `logEvent` utility writes to localStorage; a `LogsPage` component renders at `/logs`. No backend or routing library needed — pathname check in `App` root renders the log page branch.

**Tech Stack:** React 18, TypeScript, Vite, Vitest + Testing Library, localStorage, PokeAPI official artwork sprites.

---

## File Map

| File | What changes |
|------|-------------|
| `src/App.tsx` | Hero redesign, remove HeroVisual + SurveySection, dialog refactors, beta gate message, UTM capture, LogsPage route |
| `src/content/cards.ts` | Remove `heroFanCards`, fix gallery card name/price mismatches |
| `src/content/landing.ts` | Remove survey fields from type + data, expand `EVENT_REGIONS` and `EVENT_CATEGORIES` |
| `src/styles.css` | Full-bleed hero styles, image upload box, remove hero-fan/survey styles, select dropdown style |
| `src/App.test.tsx` | Update broken tests, add new behavior tests |

---

## Task 1: Update tests to reflect new behavior

**Files:**
- Modify: `src/App.test.tsx`

- [ ] **Step 1: Run current tests to see which fail**

```bash
npm test -- --run 2>&1 | head -60
```

Expected: some pass, some will fail after later tasks. This establishes the baseline.

- [ ] **Step 2: Update the hero rendering test**

In `App.test.tsx`, find the test `'renders the futuristic SaaS hero and dashboard preview'` and replace it:

```typescript
it('renders hero with background Pokemon images and centered heading', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /포켓몬카드 시세부터 행사, 거래까지 한 번에/ })
  ).toBeInTheDocument();
  expect(screen.getByLabelText('포켓몬 배경 이미지')).toBeInTheDocument();
  expect(screen.getByText('포켓몬카드 라이브 보드')).toBeInTheDocument();
  expect(screen.getByText('시세 요청 트렌드')).toBeInTheDocument();
  expect(screen.getByText('이번 주 이벤트 레이더')).toBeInTheDocument();
  // HeroVisual (카드 팬) is gone
  expect(screen.queryByLabelText('포켓몬카드 미리보기')).not.toBeInTheDocument();
});
```

- [ ] **Step 3: Update the price dialog test**

Find `'opens a working request panel when a feature action is clicked'` and replace:

```typescript
it('opens price dialog with image upload area when clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '시세 확인하기' }));

  const dialog = screen.getByRole('dialog', { name: '내 카드 시세 확인하기' });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByLabelText('카드 이미지 업로드')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '등록하기' })).toBeInTheDocument();
  // Old card name field is gone
  expect(screen.queryByLabelText('카드명')).not.toBeInTheDocument();
});
```

- [ ] **Step 4: Update the event dialog test**

Find `'event dialog shows region and category toggles'` and replace:

```typescript
it('event dialog shows region select dropdown and category checkboxes', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '알림 설정하기' }));

  expect(screen.getByRole('dialog', { name: '행사 알림 받기' })).toBeInTheDocument();
  // Region is now a <select>, not buttons
  expect(screen.getByLabelText('관심 지역')).toBeInTheDocument();
  const regionSelect = screen.getByLabelText('관심 지역') as HTMLSelectElement;
  expect(regionSelect.tagName).toBe('SELECT');
  // Expanded categories still present
  expect(screen.getByRole('button', { name: '프로모 카드' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '대회·토너먼트' })).toBeInTheDocument();
  // Old 서울 button no longer exists
  expect(screen.queryByRole('button', { name: '서울' })).not.toBeInTheDocument();
});
```

- [ ] **Step 5: Delete the survey section test**

Remove the entire test block:
```typescript
it('renders survey and interview CTA after FinalCta', () => {
  ...
});
```

- [ ] **Step 6: Add beta gate modal test**

Add after the existing tests:

```typescript
it('shows beta gate modal after submitting price form', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '시세 확인하기' }));
  const form = screen.getByRole('dialog', { name: '내 카드 시세 확인하기' }).querySelector('form')!;
  fireEvent.submit(form);

  expect(screen.getByRole('heading', { name: '아직 베타 기간입니다' })).toBeInTheDocument();
  expect(screen.getByText(/여러분의 설문 참여가 더 좋은 서비스를/)).toBeInTheDocument();
});
```

- [ ] **Step 7: Add trade dialog test (no KakaoTalk field)**

```typescript
it('trade dialog does not show KakaoTalk open profile field', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '거래 시작하기' }));

  expect(screen.getByRole('dialog', { name: '카드 구매·판매 시작하기' })).toBeInTheDocument();
  expect(screen.queryByLabelText('카카오 오픈프로필')).not.toBeInTheDocument();
  expect(screen.getByLabelText('찾는 카드명')).toBeInTheDocument();
  expect(screen.getByLabelText('최대 예산')).toBeInTheDocument();
});
```

- [ ] **Step 8: Commit the updated tests**

```bash
git add src/App.test.tsx
git commit -m "test: update tests to match new hero, dialogs, and removal of survey section"
```

---

## Task 2: Hero section full-bleed redesign

**Files:**
- Modify: `src/App.tsx` — remove `HeroVisual`, rewrite hero layout
- Modify: `src/styles.css` — new `.hero` styles, `.hero-bg`, overlay

- [ ] **Step 1: Add Pokemon background IDs constant to App.tsx**

At the top of `App.tsx`, after the imports, add:

```typescript
const HERO_POKEMON_IDS = [
  1, 4, 7, 25, 39, 52, 54, 63, 79, 92,
  104, 113, 116, 131, 133, 143, 147, 150, 151,
  152, 155, 158, 175, 179, 196, 197, 202, 249, 250,
] as const;

const POKEAPI_ART = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
```

- [ ] **Step 2: Replace HeroVisual with HeroBg component**

Remove the entire `HeroVisual` function. Add in its place:

```typescript
function HeroBg() {
  return (
    <div className="hero-bg" aria-label="포켓몬 배경 이미지" aria-hidden="true">
      {HERO_POKEMON_IDS.map((id) => (
        <img
          key={id}
          src={POKEAPI_ART(id)}
          alt=""
          loading="lazy"
          draggable={false}
        />
      ))}
      <div className="hero-overlay" />
    </div>
  );
}
```

- [ ] **Step 3: Rewrite the hero section in App JSX**

Find the `<section className="hero">` block inside `App` and replace it:

```tsx
<section className="hero">
  <HeroBg />
  <div className="hero-content">
    <p className="eyebrow">{landingContent.eyebrow}</p>
    <h1>{landingContent.title}</h1>
    <p className="hero-copy">{landingContent.heroDescription}</p>
    <HeroActions />
    <p className="hero-caption">{landingContent.heroCaption}</p>
    <div className="hero-points" aria-label="PokeBase 주요 기능">
      <div>
        <strong>시세</strong>
        <span>최근 거래 범위</span>
      </div>
      <div>
        <strong>행사</strong>
        <span>지역별 프로모션</span>
      </div>
      <div>
        <strong>거래</strong>
        <span>구매·판매 의향</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Move hero outside page-shell in App**

Change the structure so hero spans full width. Replace the relevant section in `App` return:

```tsx
return (
  <main>
    <div className="page-shell">
      <nav className="nav" aria-label="주요 메뉴">
        <BrandMark />
        <div className="nav-links" aria-hidden="true">
          <span>시세</span>
          <span>행사</span>
          <span>거래</span>
          <a className="button button-ghost" href="#actions">
            알림 신청
          </a>
        </div>
      </nav>
    </div>

    <section className="hero">
      <HeroBg />
      <div className="hero-content page-shell">
        <p className="eyebrow">{landingContent.eyebrow}</p>
        <h1>{landingContent.title}</h1>
        <p className="hero-copy">{landingContent.heroDescription}</p>
        <HeroActions />
        <p className="hero-caption">{landingContent.heroCaption}</p>
        <div className="hero-points" aria-label="PokeBase 주요 기능">
          <div><strong>시세</strong><span>최근 거래 범위</span></div>
          <div><strong>행사</strong><span>지역별 프로모</span></div>
          <div><strong>거래</strong><span>구매·판매 의향</span></div>
        </div>
      </div>
    </section>

    <div className="page-shell">
      <CardGallery />
      <DashboardPreview />

      <section id="actions" aria-labelledby="actions-title">
        <div className="section-title">
          <span className="section-label">기능 선택</span>
          <h2 id="actions-title">먼저 필요한 기능을 선택하세요</h2>
          <p>관심 있는 기능을 고르고 필요한 정보를 남기면, 관련 소식을 바로 받아볼 수 있습니다.</p>
        </div>
        <div className="cta-grid">
          {validationActions.map((action) => (
            <ValidationCard action={action} key={action.id} onSelect={setSelectedAction} />
          ))}
        </div>
      </section>

      <FinalCta />
    </div>

    {selectedAction ? <FeatureDialog action={selectedAction} onClose={() => setSelectedAction(null)} /> : null}
  </main>
);
```

- [ ] **Step 5: Update CSS for hero full-bleed + background**

In `src/styles.css`, replace the entire `.hero` block (lines 163–170) and remove `.hero-copy-block`, `.hero-fan`, `.hero-fan::before`, `.hero-fan-card`, `.hero-fan-card:hover`, `.hero-insight` blocks. Replace with:

```css
.hero {
  position: relative;
  min-height: calc(100vh - 76px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background: var(--color-navy);
}

.hero-bg {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  align-items: center;
  gap: 0;
  overflow: hidden;
}

.hero-bg img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
  opacity: 0.18;
  filter: grayscale(20%);
  pointer-events: none;
  user-select: none;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(24, 34, 53, 0.72) 0%,
    rgba(24, 34, 53, 0.58) 50%,
    rgba(11, 122, 75, 0.22) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 80px 0 88px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-content h1 {
  color: #ffffff;
}

.hero-content .eyebrow {
  color: #8fe3b6;
  background: rgba(11, 122, 75, 0.22);
  border-left-color: #8fe3b6;
}

.hero-content .hero-copy {
  color: #c9d8e8;
  max-width: 640px;
}

.hero-content .hero-caption {
  color: rgba(255, 255, 255, 0.55);
}

.hero-content .hero-points {
  border-top-color: rgba(255, 255, 255, 0.15);
  width: 100%;
  max-width: 560px;
}

.hero-content .hero-points div {
  border-left-color: rgba(143, 227, 182, 0.6);
  text-align: left;
}

.hero-content .hero-points strong {
  color: #ffffff;
}

.hero-content .hero-points span {
  color: rgba(255, 255, 255, 0.6);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
  justify-content: center;  /* update existing .hero-actions rule */
}
```

- [ ] **Step 6: Verify tests related to hero pass**

```bash
npm test -- --run --reporter=verbose 2>&1 | grep -A 3 "hero"
```

Expected: hero test passes.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: replace hero split-layout with full-bleed Pokemon character mosaic background"
```

---

## Task 3: Fix gallery card data and remove heroFanCards

**Files:**
- Modify: `src/content/cards.ts`
- Modify: `src/App.tsx` — remove `heroFanCards` import

- [ ] **Step 1: Update cards.ts**

Replace the entire file content:

```typescript
export type CardData = {
  id: string;
  name: string;
  priceRange: string;
  imageUrl: string;
};

const CDN = 'https://images.pokemontcg.io';

export const galleryCards: CardData[] = [
  { id: 'sv3pt5/182', name: '리자몽 ex SAR',  priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/182_hires.png` },
  { id: 'sv3/14',     name: '리자몽 ex',      priceRange: '₩30,000~45,000', imageUrl: `${CDN}/sv3/14_hires.png`     },
  { id: 'sv3pt5/205', name: '뮤츠 ex SAR',    priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
  { id: 'sv3pt5/6',   name: '리자몽',          priceRange: '₩2,500~5,000',   imageUrl: `${CDN}/sv3pt5/6_hires.png`   },
  { id: 'sv3pt5/151', name: '뮤',              priceRange: '₩8,000~15,000',  imageUrl: `${CDN}/sv3pt5/151_hires.png` },
  { id: 'sv3pt5/150', name: '뮤츠',            priceRange: '₩6,000~12,000',  imageUrl: `${CDN}/sv3pt5/150_hires.png` },
  { id: 'sv3pt5/133', name: '이브이',           priceRange: '₩5,000~9,000',   imageUrl: `${CDN}/sv3pt5/133_hires.png` },
  { id: 'sv3pt5/25',  name: '피카츄',           priceRange: '₩3,000~6,000',   imageUrl: `${CDN}/sv3pt5/25_hires.png`  },
];

export const surveyDecorCards: CardData[] = [
  { id: 'sv3pt5/182', name: '리자몽 ex SAR', priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/182_hires.png` },
  { id: 'sv3pt5/205', name: '뮤츠 ex SAR',   priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
  { id: 'sv3pt5/151', name: '뮤',             priceRange: '₩8,000~15,000',  imageUrl: `${CDN}/sv3pt5/151_hires.png` },
];
```

Key changes:
- Removed `heroFanCards` (HeroVisual no longer exists)
- Removed `priceDialogSampleCards` (price dialog no longer shows card samples)
- Fixed `sv3pt5/6` name from "리자드" (Charmeleon) to "리자몽" (Charizard) — card #6 in the 151 set is Charizard
- Updated `sv3pt5/197` → `sv3pt5/182` for Charizard ex SAR (corrected card number)

- [ ] **Step 2: Remove heroFanCards and priceDialogSampleCards imports in App.tsx**

In `src/App.tsx`, find the import line:

```typescript
import {
  heroFanCards,
  galleryCards,
  surveyDecorCards,
  priceDialogSampleCards
} from './content/cards';
```

Replace with:

```typescript
import {
  galleryCards,
  surveyDecorCards,
} from './content/cards';
```

- [ ] **Step 3: Remove FAN_TRANSFORMS and FAN_Z_INDEXES constants**

Remove these two constants from the top of `App.tsx`:

```typescript
const FAN_TRANSFORMS = [
  'rotate(-15deg) translate(-120px, 20px)',
  'rotate(-5deg) translate(-40px, -10px)',
  'rotate(5deg) translate(40px, -10px)',
  'rotate(15deg) translate(120px, 20px)',
] as const;

const FAN_Z_INDEXES = [1, 2, 3, 2] as const;
```

- [ ] **Step 4: Verify gallery test passes**

```bash
npm test -- --run --reporter=verbose 2>&1 | grep -A 3 "gallery"
```

Expected: gallery test (expects 16 img elements) passes.

- [ ] **Step 5: Commit**

```bash
git add src/content/cards.ts src/App.tsx
git commit -m "fix: correct gallery card name/price mismatches, remove heroFanCards"
```

---

## Task 4: Live board cleanup — remove search box, fix metric count

**Files:**
- Modify: `src/App.tsx` — `DashboardPreview` component

- [ ] **Step 1: Update DashboardPreview**

In `App.tsx`, find the `DashboardPreview` function. Make two changes:

**Change 1 — Remove the search-box div:**
Find and delete:
```tsx
<div className="search-box" aria-hidden="true">
  리자몽 ex, 서울 프로모션, 판매 의향...
</div>
```

**Change 2 — Fix the metric value for "이번 주 행사":**
Find:
```tsx
<div className="metric">
  <span>이번 주 행사</span>
  <strong>31개</strong>
</div>
```
Replace with:
```tsx
<div className="metric">
  <span>이번 주 행사</span>
  <strong>3건</strong>
</div>
```

The resulting `dash-header` becomes:
```tsx
<div className="dash-header">
  <h2>{landingContent.dashboardTitle}</h2>
</div>
```

- [ ] **Step 2: Remove search-box CSS**

In `src/styles.css`, find and remove the `.search-box` block (lines 501–511):
```css
.search-box {
  width: min(100%, 360px);
  min-height: 44px;
  padding: 12px 14px;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  color: #68778b;
  background: #f8faf9;
  font-size: 0.9rem;
  text-align: left;
}
```

Also remove the responsive rule for `.search-box` in the `@media (max-width: 980px)` block:
```css
.search-box {
  width: 100%;
}
```

Also remove the `.dash-header` flex direction override in `@media (max-width: 980px)` (it was for the search-box side-by-side layout):
```css
.dash-header {
  align-items: stretch;
  flex-direction: column;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "fix: remove live board search box, correct event metric count to 3"
```

---

## Task 5: Remove SurveySection

**Files:**
- Modify: `src/App.tsx` — delete `SurveySection`, remove call site
- Modify: `src/content/landing.ts` — remove survey fields from type + data

- [ ] **Step 1: Delete SurveySection from App.tsx**

Remove the entire `SurveySection` function:
```typescript
function SurveySection() {
  // ... entire function
}
```

Remove its call site in `App` return (inside the `page-shell` div):
```tsx
<SurveySection />
```

- [ ] **Step 2: Remove survey fields from landing.ts**

In `src/content/landing.ts`, remove these fields from the `LandingContent` type:
```typescript
surveyEyebrow: string;
surveyTitle: string;
surveyDescription: string;
surveyPrimaryLabel: string;
surveySecondaryLabel: string;
```

Remove the same keys from `landingContent`:
```typescript
surveyEyebrow: '베타 준비 중',
surveyTitle: '포켓몬카드 서비스를 함께 만들어 가요',
surveyDescription: '짧은 설문(3분)으로 원하는 기능을 알려주거나, 인터뷰에 참여해 더 깊은 이야기를 나눠보세요.',
surveyPrimaryLabel: '설문 참여하기',
surveySecondaryLabel: '인터뷰 신청하기',
```

- [ ] **Step 3: Remove survey CSS from styles.css**

Remove these blocks from `styles.css`:
- `.survey-section { ... }`
- `.survey-copy .section-label { ... }`
- `.survey-copy h2 { ... }`
- `.survey-copy p { ... }`
- `.survey-actions { ... }`
- `.survey-cards { ... }`
- `.survey-card { ... }`
- `.survey-card-1`, `.survey-card-2`, `.survey-card-3`

Also remove responsive overrides for these in the media query blocks.

- [ ] **Step 4: Remove surveyDecorCards import from App.tsx**

Since SurveySection used `surveyDecorCards`, update the import in `App.tsx`:

```typescript
import {
  galleryCards,
} from './content/cards';
```

- [ ] **Step 5: Run tests**

```bash
npm test -- --run 2>&1 | tail -20
```

Expected: The deleted survey test no longer exists, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/content/landing.ts src/styles.css src/content/cards.ts
git commit -m "feat: remove beta-preparation survey section from landing page"
```

---

## Task 6: Refactor all three dialogs with beta gate

**Files:**
- Modify: `src/App.tsx` — PriceDialogContent, EventDialogContent, TradeDialogContent, FeatureDialog
- Modify: `src/content/landing.ts` — update EVENT_REGIONS, EVENT_CATEGORIES
- Modify: `src/styles.css` — image upload box styles, select dropdown styles

### 6a: Update EVENT_REGIONS and EVENT_CATEGORIES

- [ ] **Step 1: Update landing.ts constants**

Find:
```typescript
const EVENT_REGIONS = ['서울', '부산', '대구', '대전', '전국'] as const;
const EVENT_CATEGORIES = ['프로모션 카드', '팝업스토어', '신제품', '카드샵 행사', '대회'] as const;
```

Replace with:
```typescript
export const EVENT_REGIONS = [
  '전국', '서울', '부산', '대구', '인천', '광주',
  '대전', '울산', '세종', '경기', '강원', '충북',
  '충남', '전북', '전남', '경북', '경남', '제주',
] as const;

export const EVENT_CATEGORIES = [
  '프로모션 카드', '팝업스토어', '신제품 발매', '카드샵 행사',
  '대회·토너먼트', '한정판 굿즈', '온라인 이벤트', '콜라보 상품',
] as const;
```

Note: Add `export` so `App.tsx` can import them (currently they're module-level consts in App.tsx — move them to landing.ts).

- [ ] **Step 2: Import EVENT_REGIONS and EVENT_CATEGORIES in App.tsx**

In `App.tsx`, remove the two const declarations for `EVENT_REGIONS` and `EVENT_CATEGORIES` from the top of the file. Add them to the import from `./content/landing`:

```typescript
import {
  landingContent,
  validationActions,
  EVENT_REGIONS,
  EVENT_CATEGORIES,
  type ValidationAction
} from './content/landing';
```

### 6b: Rewrite PriceDialogContent

- [ ] **Step 3: Replace PriceDialogContent**

Remove the entire existing `PriceDialogContent` function and replace with:

```typescript
function PriceDialogContent({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  return (
    <form className="dialog-form" onSubmit={onSubmit}>
      <label>
        <span>카드 이미지</span>
        <div className="image-upload-box">
          <input
            type="file"
            accept="image/*"
            aria-label="카드 이미지 업로드"
          />
          <div className="image-upload-placeholder" aria-hidden="true">
            <span className="image-upload-icon">📷</span>
            <p>이미지를 클릭하거나 드래그해서 올려주세요</p>
            <small>JPG, PNG, WEBP 지원</small>
          </div>
        </div>
      </label>
      <button className="button button-primary" type="submit">
        등록하기
      </button>
    </form>
  );
}
```

### 6c: Rewrite EventDialogContent

- [ ] **Step 4: Replace EventDialogContent**

Remove the existing `EventDialogContent` function and replace with:

```typescript
function EventDialogContent({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [categories, setCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <form className="dialog-form" onSubmit={onSubmit}>
      <label>
        <span>관심 지역</span>
        <select
          aria-label="관심 지역"
          className="dialog-select"
          defaultValue=""
        >
          <option value="" disabled>지역을 선택하세요</option>
          {EVENT_REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>
      <div>
        <p className="dialog-field-label">관심 분야</p>
        <div className="toggle-btn-group" role="group" aria-label="관심 분야 선택">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`toggle-btn${categories.includes(cat) ? ' active' : ''}`}
              aria-pressed={categories.includes(cat)}
              onClick={() => toggleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <button className="button button-primary" type="submit">
        알림 신청하기
      </button>
    </form>
  );
}
```

### 6d: Rewrite TradeDialogContent

- [ ] **Step 5: Replace TradeDialogContent**

Remove the existing `TradeDialogContent` function and replace with:

```typescript
function TradeDialogContent({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');

  return (
    <form className="dialog-form" onSubmit={onSubmit}>
      <div className="dialog-tabs" role="tablist">
        {(['buy', 'sell'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`dialog-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'buy' ? '구매' : '판매'}
          </button>
        ))}
      </div>
      <label>
        <span>{tab === 'buy' ? '찾는 카드명' : '판매할 카드명'}</span>
        <input
          required
          placeholder={tab === 'buy' ? '예: 리자몽 ex SAR 한국판' : '예: 뮤츠 ex SAR 일본판'}
          aria-label={tab === 'buy' ? '찾는 카드명' : '판매할 카드명'}
        />
      </label>
      <label>
        <span>{tab === 'buy' ? '최대 예산' : '희망 판매가'}</span>
        <input
          placeholder={tab === 'buy' ? '예: 50,000원' : '예: 45,000원'}
          aria-label={tab === 'buy' ? '최대 예산' : '희망 판매가'}
        />
      </label>
      <button className="button button-primary" type="submit">
        {tab === 'buy' ? '구매 의향 등록하기' : '판매 의향 등록하기'}
      </button>
    </form>
  );
}
```

### 6e: Update FeatureDialog submitted state

- [ ] **Step 6: Update the submitted/beta-gate state in FeatureDialog**

In `FeatureDialog`, find the submitted state JSX:

```tsx
{submitted ? (
  <div className="dialog-success">
    <h3>등록되었습니다</h3>
    <p>입력한 내용에 맞춰 관련 안내를 받을 수 있습니다.</p>
    <button className="button button-primary" type="button" onClick={onClose}>
      확인
    </button>
  </div>
) : (
```

Replace with:

```tsx
{submitted ? (
  <div className="dialog-success">
    <h3>아직 베타 기간입니다</h3>
    <p>여러분의 설문 참여가 더 좋은 서비스를 만들 수 있습니다. 짧은 설문(3분)으로 원하는 기능을 알려주세요.</p>
    <button
      className="button button-primary"
      type="button"
      onClick={() => {
        if (googleFormUrl.trim()) {
          window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
        }
        onClose();
      }}
    >
      설문 참여하기
    </button>
  </div>
) : (
```

- [ ] **Step 7: Add image upload CSS to styles.css**

After the `.dialog-form input` styles, add:

```css
.dialog-select {
  width: 100%;
  min-height: 50px;
  padding: 0 14px;
  border: 1px solid var(--color-line);
  border-radius: 6px;
  color: var(--color-ink);
  background: #ffffff;
  font: inherit;
  appearance: auto;
}

.image-upload-box {
  position: relative;
  min-height: 160px;
  border: 2px dashed var(--color-line);
  border-radius: 8px;
  background: #f8faf9;
  cursor: pointer;
  transition: border-color 0.2s ease;
  overflow: hidden;
}

.image-upload-box:hover {
  border-color: var(--color-primary);
}

.image-upload-box input[type="file"] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  min-height: unset;
  border: none;
  padding: 0;
}

.image-upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 160px;
  padding: 20px;
  pointer-events: none;
}

.image-upload-icon {
  font-size: 2rem;
}

.image-upload-placeholder p {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
}

.image-upload-placeholder small {
  color: var(--color-subtle);
  font-size: 0.82rem;
}
```

- [ ] **Step 8: Run tests**

```bash
npm test -- --run 2>&1 | tail -30
```

Expected: all dialog-related tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/content/landing.ts src/styles.css
git commit -m "feat: refactor dialogs to beta-gate flow, add image upload to price dialog, dropdown regions, remove KakaoTalk field"
```

---

## Task 7: UTM capture + logEvent utility + /logs page

**Files:**
- Modify: `src/App.tsx` — UTM capture on mount, `logEvent` utility, `LogsPage` component, route branch

- [ ] **Step 1: Add logEvent utility and UTM capture to App.tsx**

After the `googleFormUrl` constant at the top of `App.tsx`, add:

```typescript
type LogEntry = {
  event: string;
  ts: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

function getStoredUtm(): Pick<LogEntry, 'utm_source' | 'utm_medium' | 'utm_campaign'> {
  try {
    const raw = localStorage.getItem('pkb_session_utm');
    return raw ? JSON.parse(raw) : { utm_source: '', utm_medium: '', utm_campaign: '' };
  } catch {
    return { utm_source: '', utm_medium: '', utm_campaign: '' };
  }
}

function logEvent(eventName: string): void {
  try {
    const utm = getStoredUtm();
    const entry: LogEntry = { event: eventName, ts: new Date().toISOString(), ...utm };
    const raw = localStorage.getItem('pkb_events') ?? '[]';
    const events: LogEntry[] = JSON.parse(raw);
    events.push(entry);
    localStorage.setItem('pkb_events', JSON.stringify(events));
  } catch {
    // silently ignore storage errors
  }
}

function captureUtm(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm = {
      utm_source: params.get('utm_source') ?? '',
      utm_medium: params.get('utm_medium') ?? '',
      utm_campaign: params.get('utm_campaign') ?? '',
    };
    if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
      localStorage.setItem('pkb_session_utm', JSON.stringify(utm));
    }
  } catch {
    // silently ignore
  }
}
```

- [ ] **Step 2: Call captureUtm and wire logEvent in App's useEffect**

In the `App` function, update the existing `useEffect`:

```typescript
useEffect(() => {
  document.title = `${landingContent.productName} | Pokemon Card Intelligence`;
  captureUtm();
}, []);
```

- [ ] **Step 3: Wire logEvent to button clicks**

In `ValidationCard`, the button already has `data-event={action.analyticsEvent}`. Update the onClick to also call `logEvent`:

```tsx
<button
  className="button button-primary"
  type="button"
  data-event={action.analyticsEvent}
  onClick={() => {
    logEvent(action.analyticsEvent);
    onSelect(action);
  }}
>
  {action.buttonLabel}
</button>
```

- [ ] **Step 4: Add LogsPage component**

Add this component to `App.tsx` before the `App` function:

```typescript
function LogsPage() {
  const [events, setEvents] = useState<LogEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pkb_events') ?? '[]';
      setEvents(JSON.parse(raw));
    } catch {
      setEvents([]);
    }
  }, []);

  const clearLogs = () => {
    localStorage.removeItem('pkb_events');
    setEvents([]);
  };

  const counts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.event] = (acc[e.event] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main style={{ fontFamily: 'monospace', padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>PokeBase Click Log</h1>
      <p style={{ color: '#667085', marginBottom: '24px' }}>
        {events.length}개 이벤트 기록됨 (이 기기/브라우저 기준)
      </p>

      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {Object.entries(counts).map(([event, count]) => (
          <div key={event} style={{ padding: '8px 14px', background: '#f0f4f8', borderRadius: '6px', fontSize: '0.85rem' }}>
            <strong>{event}</strong>: {count}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={clearLogs}
        style={{ marginBottom: '20px', padding: '8px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' }}
      >
        로그 초기화
      </button>

      {events.length === 0 ? (
        <p style={{ color: '#667085' }}>기록된 이벤트가 없습니다. CTA 버튼을 클릭해보세요.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f0f4f8' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #dce3df' }}>시간</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #dce3df' }}>이벤트</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #dce3df' }}>utm_source</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #dce3df' }}>utm_medium</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', border: '1px solid #dce3df' }}>utm_campaign</th>
            </tr>
          </thead>
          <tbody>
            {[...events].reverse().map((entry, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8faf9' }}>
                <td style={{ padding: '8px 12px', border: '1px solid #dce3df', whiteSpace: 'nowrap' }}>
                  {new Date(entry.ts).toLocaleString('ko-KR')}
                </td>
                <td style={{ padding: '8px 12px', border: '1px solid #dce3df', fontWeight: 700, color: '#0b7a4b' }}>
                  {entry.event}
                </td>
                <td style={{ padding: '8px 12px', border: '1px solid #dce3df' }}>{entry.utm_source || '-'}</td>
                <td style={{ padding: '8px 12px', border: '1px solid #dce3df' }}>{entry.utm_medium || '-'}</td>
                <td style={{ padding: '8px 12px', border: '1px solid #dce3df' }}>{entry.utm_campaign || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ marginTop: '32px', color: '#98a2b3', fontSize: '0.8rem' }}>
        이 페이지는 공유하지 마세요. 로컬 브라우저 데이터만 표시됩니다.
      </p>
    </main>
  );
}
```

- [ ] **Step 5: Add /logs route branch in App**

In the main `App` function, add a route check at the very beginning of the return (before the main content JSX):

```typescript
function App() {
  const [selectedAction, setSelectedAction] = useState<ValidationAction | null>(null);

  useEffect(() => {
    document.title = `${landingContent.productName} | Pokemon Card Intelligence`;
    captureUtm();
  }, []);

  if (window.location.pathname === '/logs') {
    return <LogsPage />;
  }

  return (
    // ... existing JSX
  );
}
```

- [ ] **Step 6: Run tests**

```bash
npm test -- --run 2>&1 | tail -20
```

Expected: all tests pass (LogsPage only renders at /logs, tests run at default pathname).

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add UTM capture, click event logging to localStorage, and /logs viewer page"
```

---

## Task 8: CSS cleanup — remove dead styles, responsive adjustments

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Remove hero-fan, hero-insight, hero-copy-block dead styles**

Remove these CSS blocks that are no longer needed (HeroVisual is gone):
- `.hero-copy-block { ... }`
- `.hero-fan { ... }`
- `.hero-fan::before { ... }`
- `.hero-fan-card { ... }`
- `.hero-fan-card:hover { ... }`
- `.hero-insight { ... }`
- `.hero-insight span { ... }`
- `.hero-insight strong { ... }`
- `.hero-insight p { ... }`

- [ ] **Step 2: Update responsive media queries**

In the `@media (max-width: 980px)` block, remove or replace hero-related rules:

Remove:
```css
.hero {
  min-height: auto;
  grid-template-columns: 1fr;
  gap: 34px;
  padding: 46px 0 56px;
}

.hero-copy-block {
  max-width: 760px;
}

.hero-fan {
  min-height: 420px;
}
```

Add instead:
```css
.hero {
  min-height: 60vh;
}
```

In the `@media (max-width: 620px)` block, remove:
```css
.hero-fan {
  min-height: 330px;
  border-radius: 12px 3px 12px 3px;
}

.hero-insight {
  right: 14px;
  bottom: 14px;
  width: calc(100% - 28px);
  padding: 14px;
}
```

Add instead:
```css
.hero-content {
  padding: 56px 0 64px;
}
```

- [ ] **Step 3: Remove price-card-samples CSS**

Remove:
```css
.price-card-samples { ... }
.price-card-samples img { ... }
.price-card-samples img:hover { ... }
```

- [ ] **Step 4: Run full test suite**

```bash
npm test -- --run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css
git commit -m "chore: remove dead hero-fan, hero-insight, price-card-samples CSS"
```

---

## Usage Guide: Tracking Traffic Sources

Share links with UTM parameters to track which channel users come from:

```
https://your-domain.com/?utm_source=instagram&utm_medium=post&utm_campaign=launch
https://your-domain.com/?utm_source=discord&utm_medium=community&utm_campaign=launch
https://your-domain.com/?utm_source=twitter&utm_medium=social&utm_campaign=launch
```

View captured events at: `https://your-domain.com/logs`

Each click on a feature CTA is logged with the source, medium, and campaign from the entry URL.
