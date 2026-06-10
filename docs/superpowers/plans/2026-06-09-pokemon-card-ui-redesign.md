# Pokemon Card UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero placeholder image with a Pokemon card fan layout, add an animated card gallery strip, improve each action dialog with Fake Door Test-style inputs, and add a survey/interview CTA section with real Pokemon card imagery.

**Architecture:** All UI components live in `src/App.tsx`. Card image data is extracted to a new `src/content/cards.ts` file. Survey copy is added to the existing `src/content/landing.ts`. Styles are added to `src/styles.css`. Pokemon card images are served directly from the `pokemontcg.io` CDN (`https://images.pokemontcg.io/{setId}/{number}_hires.png`).

**Tech Stack:** React 19, TypeScript, Vite, Vitest + @testing-library/react

---

## File Map

| Action | File |
|---|---|
| Create | `src/content/cards.ts` |
| Modify | `src/content/landing.ts` |
| Modify | `src/App.tsx` |
| Modify | `src/styles.css` |
| Modify | `src/App.test.tsx` |

---

### Task 1: Card data and survey copy

**Files:**
- Create: `src/content/cards.ts`
- Modify: `src/content/landing.ts`

- [ ] **Step 1: Create `src/content/cards.ts`**

```typescript
export type CardData = {
  id: string;
  name: string;
  priceRange: string;
  imageUrl: string;
};

const CDN = 'https://images.pokemontcg.io';

export const heroFanCards: CardData[] = [
  { id: 'sv3pt5/197', name: '리자몽 ex SAR', priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/197_hires.png` },
  { id: 'sv3pt5/25',  name: '피카츄',         priceRange: '₩3,000~6,000',   imageUrl: `${CDN}/sv3pt5/25_hires.png`  },
  { id: 'sv3pt5/205', name: '뮤츠 ex SAR',    priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
  { id: 'sv3pt5/133', name: '이브이',          priceRange: '₩5,000~9,000',   imageUrl: `${CDN}/sv3pt5/133_hires.png` },
];

export const galleryCards: CardData[] = [
  { id: 'sv3pt5/197', name: '리자몽 ex SAR', priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/197_hires.png` },
  { id: 'sv3/14',     name: '리자몽 ex',     priceRange: '₩30,000~45,000', imageUrl: `${CDN}/sv3/14_hires.png`     },
  { id: 'sv3pt5/205', name: '뮤츠 ex SAR',   priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
  { id: 'sv3pt5/6',   name: '리자드',         priceRange: '₩2,000~4,000',   imageUrl: `${CDN}/sv3pt5/6_hires.png`   },
  { id: 'sv3pt5/151', name: '뮤',             priceRange: '₩8,000~15,000',  imageUrl: `${CDN}/sv3pt5/151_hires.png` },
  { id: 'sv3pt5/150', name: '뮤츠',           priceRange: '₩6,000~12,000',  imageUrl: `${CDN}/sv3pt5/150_hires.png` },
  { id: 'sv3pt5/133', name: '이브이',          priceRange: '₩5,000~9,000',   imageUrl: `${CDN}/sv3pt5/133_hires.png` },
  { id: 'sv3pt5/25',  name: '피카츄',          priceRange: '₩3,000~6,000',   imageUrl: `${CDN}/sv3pt5/25_hires.png`  },
];

export const surveyDecorCards: CardData[] = [
  { id: 'sv3pt5/197', name: '리자몽 ex SAR', priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/197_hires.png` },
  { id: 'sv3pt5/205', name: '뮤츠 ex SAR',   priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
  { id: 'sv3pt5/151', name: '뮤',             priceRange: '₩8,000~15,000',  imageUrl: `${CDN}/sv3pt5/151_hires.png` },
];

export const priceDialogSampleCards: CardData[] = [
  { id: 'sv3pt5/197', name: '리자몽 ex SAR', priceRange: '₩45,000~62,000', imageUrl: `${CDN}/sv3pt5/197_hires.png` },
  { id: 'sv3/14',     name: '리자몽 ex',     priceRange: '₩30,000~45,000', imageUrl: `${CDN}/sv3/14_hires.png`     },
  { id: 'sv3pt5/205', name: '뮤츠 ex SAR',   priceRange: '₩28,000~40,000', imageUrl: `${CDN}/sv3pt5/205_hires.png` },
];
```

- [ ] **Step 2: Add survey fields to `src/content/landing.ts`**

Add to the `LandingContent` type (after `finalDescription`):
```typescript
  surveyEyebrow: string;
  surveyTitle: string;
  surveyDescription: string;
  surveyPrimaryLabel: string;
  surveySecondaryLabel: string;
```

Add to the `landingContent` object (after `finalDescription`):
```typescript
  surveyEyebrow: '베타 준비 중',
  surveyTitle: '포켓몬카드 서비스를 함께 만들어 가요',
  surveyDescription: '짧은 설문(3분)으로 원하는 기능을 알려주거나, 인터뷰에 참여해 더 깊은 이야기를 나눠보세요.',
  surveyPrimaryLabel: '설문 참여하기',
  surveySecondaryLabel: '인터뷰 신청하기',
```

- [ ] **Step 3: Write failing test in `src/content/landing.test.ts`**

Add at the end of the existing test file:
```typescript
it('includes survey section copy', () => {
  expect(landingContent.surveyEyebrow).toBe('베타 준비 중');
  expect(landingContent.surveyTitle).toContain('포켓몬카드');
  expect(landingContent.surveyPrimaryLabel).toBe('설문 참여하기');
  expect(landingContent.surveySecondaryLabel).toBe('인터뷰 신청하기');
});
```

- [ ] **Step 4: Run test to verify it fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 5 "survey"
```
Expected: FAIL — `surveyEyebrow` does not exist on `landingContent`

- [ ] **Step 5: Run tests after implementing (Step 2 must be done before this)**

```bash
npm test
```
Expected: all tests pass (the new survey test passes, existing tests unaffected)

- [ ] **Step 6: Commit**

```bash
git add src/content/cards.ts src/content/landing.ts src/content/landing.test.ts
git commit -m "feat: add card data constants and survey copy"
```

---

### Task 2: Hero fan visual

**Files:**
- Modify: `src/App.tsx` — replace `HeroVisual` function
- Modify: `src/styles.css` — replace `.hero-visual` block, add `.hero-fan` / `.hero-fan-card`
- Modify: `src/App.test.tsx` — update broken hero image test

- [ ] **Step 1: Update the broken test first**

In `src/App.test.tsx`, replace the assertion that checks for the old hero image:
```typescript
// REMOVE this line from the first test:
expect(screen.getByAltText('포켓몬카드 컬렉터 데스크와 시세 앱 화면')).toHaveAttribute(
  'src',
  '/assets/pokebase-card-desk.png'
);

// REPLACE with:
expect(screen.getByLabelText('포켓몬카드 미리보기')).toBeInTheDocument();
expect(screen.getAllByRole('img').some(img => img.getAttribute('alt') === '리자몽 ex SAR')).toBe(true);
```

- [ ] **Step 2: Run test to verify it fails (before implementing)**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "(FAIL|PASS|포켓몬카드 미리보기)"
```
Expected: FAIL — `포켓몬카드 미리보기` label not found

- [ ] **Step 3: Add import to `src/App.tsx`**

Add to the existing import from `./content/landing`:
```typescript
import {
  heroFanCards,
  galleryCards,
  surveyDecorCards,
  priceDialogSampleCards
} from './content/cards';
```

- [ ] **Step 4: Replace `HeroVisual` in `src/App.tsx`**

The fan transform values position each card: first outermost-left, fourth outermost-right, middle two overlap in center.

```typescript
const FAN_TRANSFORMS = [
  'rotate(-15deg) translate(-120px, 20px)',
  'rotate(-5deg) translate(-40px, -10px)',
  'rotate(5deg) translate(40px, -10px)',
  'rotate(15deg) translate(120px, 20px)',
] as const;

const FAN_Z_INDEXES = [1, 2, 3, 2] as const;

function HeroVisual() {
  return (
    <figure className="hero-fan" aria-label="포켓몬카드 미리보기">
      {heroFanCards.map((card, i) => (
        <img
          key={card.id}
          className="hero-fan-card"
          src={card.imageUrl}
          alt={card.name}
          style={{ transform: FAN_TRANSFORMS[i], zIndex: FAN_Z_INDEXES[i] }}
        />
      ))}
      <figcaption className="hero-insight">
        <span>오늘의 관심 카드</span>
        <strong>리자몽 ex SAR</strong>
        <p>최근 거래 범위와 행사 알림을 한 화면에서 확인</p>
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 5: Replace `.hero-visual` styles in `src/styles.css`**

Find and replace the entire `.hero-visual`, `.hero-visual img`, `.hero-visual::after`, `.hero-insight` blocks. The new styles:

```css
.hero-fan {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 548px;
  margin: 0;
  overflow: hidden;
  border-radius: 18px 4px 18px 4px;
  background: var(--color-navy);
  box-shadow: var(--shadow-soft);
}

.hero-fan::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(11, 122, 75, 0.22) 0%, transparent 65%);
  pointer-events: none;
}

.hero-fan-card {
  position: absolute;
  width: 155px;
  border-radius: 10px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition:
    transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.35s ease;
}

.hero-fan-card:hover {
  transform: translateY(-24px) scale(1.08) !important;
  z-index: 10 !important;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6);
}

.hero-insight {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 5;
  width: min(360px, calc(100% - 48px));
  margin: 0;
  padding: 18px 18px 18px 20px;
  border-left: 4px solid var(--color-primary);
  border-radius: 6px;
  color: var(--color-ink);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 48px rgba(16, 24, 40, 0.18);
}

.hero-insight span {
  display: block;
  color: var(--color-muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.hero-insight strong {
  display: block;
  margin-top: 6px;
  font-size: 1.35rem;
  letter-spacing: 0;
}

.hero-insight p {
  margin: 8px 0 0;
  color: #536276;
  font-size: 0.93rem;
  line-height: 1.5;
}
```

Also update the responsive breakpoints — find the `.hero-visual` references in `@media` blocks and rename to `.hero-fan`:

At `@media (max-width: 980px)`:
```css
  .hero-fan {
    min-height: 420px;
  }
```

At `@media (max-width: 620px)`:
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

- [ ] **Step 6: Run tests**

```bash
npm test
```
Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css src/App.test.tsx
git commit -m "feat: replace hero placeholder with Pokemon card fan layout"
```

---

### Task 3: Card gallery strip

**Files:**
- Modify: `src/App.tsx` — add `CardGallery` component and insert into `App`
- Modify: `src/styles.css` — add gallery styles
- Modify: `src/App.test.tsx` — add gallery render test

- [ ] **Step 1: Write failing test in `src/App.test.tsx`**

Add a new `it` block:
```typescript
it('renders the card gallery strip with Pokemon cards', () => {
  render(<App />);
  expect(screen.getByLabelText('인기 포켓몬카드 갤러리')).toBeInTheDocument();
  // gallery duplicates the 8 cards → 16 images rendered
  const gallerySection = screen.getByLabelText('인기 포켓몬카드 갤러리');
  expect(gallerySection.querySelectorAll('img')).toHaveLength(16);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -A 3 "gallery"
```
Expected: FAIL — `인기 포켓몬카드 갤러리` not found

- [ ] **Step 3: Add `CardGallery` component to `src/App.tsx`**

Add this function before the `App` function:
```typescript
function CardGallery() {
  const doubled = [...galleryCards, ...galleryCards];

  return (
    <section className="gallery-strip" aria-label="인기 포켓몬카드 갤러리">
      <div className="gallery-track" aria-hidden="true">
        {doubled.map((card, i) => (
          <figure className="gallery-card" key={i}>
            <img src={card.imageUrl} alt={card.name} loading="lazy" />
            <figcaption>
              <span className="gallery-card-name">{card.name}</span>
              <span className="gallery-card-price">{card.priceRange}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Insert `<CardGallery />` into `App` between hero and dashboard**

In the `App` return, after `<HeroVisual />` closes (i.e., after `</section>` that wraps the hero):
```tsx
        </section>

        <CardGallery />

        <DashboardPreview />
```

- [ ] **Step 5: Add gallery CSS to `src/styles.css`**

Add after the `.hero-fan-card:hover` block:
```css
.gallery-strip {
  overflow: hidden;
  padding: 44px 0;
  background: var(--color-navy);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.gallery-track {
  display: flex;
  align-items: flex-end;
  gap: 24px;
  width: max-content;
  animation: gallery-scroll 32s linear infinite;
}

.gallery-strip:hover .gallery-track {
  animation-play-state: paused;
}

@keyframes gallery-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.gallery-card {
  flex: 0 0 auto;
  width: 120px;
  margin: 0;
  cursor: pointer;
}

.gallery-card img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: block;
}

.gallery-card:hover img {
  transform: translateY(-8px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
}

.gallery-card figcaption {
  margin-top: 8px;
  text-align: center;
}

.gallery-card-name {
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.78rem;
  font-weight: 750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gallery-card-price {
  display: block;
  margin-top: 3px;
  color: var(--color-accent);
  font-size: 0.72rem;
}
```

- [ ] **Step 6: Run tests**

```bash
npm test
```
Expected: all tests pass including new gallery test

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css src/App.test.tsx
git commit -m "feat: add animated Pokemon card gallery strip"
```

---

### Task 4: Enhanced action dialogs (Fake Door Test)

**Files:**
- Modify: `src/App.tsx` — add 3 dialog content components, update `FeatureDialog`
- Modify: `src/styles.css` — add toggle button, tab, and price sample card styles
- Modify: `src/App.test.tsx` — update broken dialog test, add new dialog tests

- [ ] **Step 1: Update broken dialog test in `src/App.test.tsx`**

The current test checks `getByLabelText('카드 사진 또는 카드명')`. The new price dialog uses `카드명`. Update the test block named `'opens a working request panel when a feature action is clicked'`:

```typescript
it('opens a working request panel when a feature action is clicked', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '시세 확인하기' }));

  const dialog = screen.getByRole('dialog', { name: '내 카드 시세 확인하기' });
  expect(dialog).toBeInTheDocument();
  expect(screen.getByLabelText('카드명')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '등록하기' })).toBeInTheDocument();
});
```

Add a new test for event dialog:
```typescript
it('event dialog shows region and category toggles', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '알림 설정하기' }));

  expect(screen.getByRole('dialog', { name: '행사 알림 받기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '서울' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '프로모 카드' })).toBeInTheDocument();
});

it('trade dialog tab switching changes labels', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: '거래 시작하기' }));

  expect(screen.getByRole('dialog', { name: '카드 구매·판매 시작하기' })).toBeInTheDocument();
  expect(screen.getByLabelText('찾는 카드명')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: '판매' }));
  expect(screen.getByLabelText('판매할 카드명')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify new tests fail**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "(FAIL|region|tab)"
```
Expected: several FAIL

- [ ] **Step 3: Add dialog helper CSS to `src/styles.css`**

Add after the gallery styles:
```css
.dialog-field-label {
  margin: 0 0 8px;
  color: #344054;
  font-size: 0.95rem;
  font-weight: 760;
}

.toggle-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toggle-btn {
  min-height: 36px;
  padding: 0 14px;
  border: 1.5px solid var(--color-line);
  border-radius: 6px;
  color: #4f5f72;
  background: #ffffff;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.toggle-btn.active {
  border-color: var(--color-primary);
  color: var(--color-primary-dark);
  background: rgba(11, 122, 75, 0.08);
}

.dialog-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--color-line);
}

.dialog-tab {
  flex: 1;
  min-height: 44px;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  background: transparent;
  color: var(--color-muted);
  font-size: 0.95rem;
  font-weight: 750;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.dialog-tab.active {
  color: var(--color-primary-dark);
  border-bottom-color: var(--color-primary);
}

.price-card-samples {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.price-card-samples img {
  width: calc(33.33% - 7px);
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  opacity: 0.85;
  transition: opacity 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.price-card-samples img:hover {
  opacity: 1;
  transform: translateY(-4px);
}
```

- [ ] **Step 4: Add `PriceDialogContent` to `src/App.tsx`**

Add before `FeatureDialog`:
```typescript
function PriceDialogContent({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [edition, setEdition] = useState('한국판');

  return (
    <form className="dialog-form" onSubmit={onSubmit}>
      <div className="price-card-samples" aria-label="시세 확인 예시 카드">
        {priceDialogSampleCards.map((card) => (
          <img key={card.id} src={card.imageUrl} alt={card.name} />
        ))}
      </div>
      <label>
        <span>카드명</span>
        <input required placeholder="예: 리자몽 ex SAR, 뮤츠 ex" aria-label="카드명" />
      </label>
      <div>
        <p className="dialog-field-label">에디션</p>
        <div className="toggle-btn-group" role="group" aria-label="에디션 선택">
          {['한국판', '일본판', '영문판'].map((e) => (
            <button
              key={e}
              type="button"
              className={`toggle-btn${edition === e ? ' active' : ''}`}
              aria-pressed={edition === e}
              onClick={() => setEdition(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <label>
        <span>연락처 (카카오 오픈프로필 또는 이메일)</span>
        <input placeholder="오픈프로필 링크 또는 이메일 주소" aria-label="연락처" />
      </label>
      <button className="button button-primary" type="submit">
        등록하기
      </button>
    </form>
  );
}
```

- [ ] **Step 5: Add `EventDialogContent` to `src/App.tsx`**

Add after `PriceDialogContent`:
```typescript
const EVENT_REGIONS = ['서울', '부산', '대구', '대전', '전국'] as const;
const EVENT_CATEGORIES = ['프로모 카드', '팝업스토어', '신제품', '카드샵 행사', '대회'] as const;

function EventDialogContent({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [region, setRegion] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <form className="dialog-form" onSubmit={onSubmit}>
      <div>
        <p className="dialog-field-label">관심 지역</p>
        <div className="toggle-btn-group" role="group" aria-label="관심 지역 선택">
          {EVENT_REGIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={`toggle-btn${region === r ? ' active' : ''}`}
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
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
      <label>
        <span>연락처 (카카오 오픈프로필 또는 이메일)</span>
        <input placeholder="오픈프로필 링크 또는 이메일 주소" aria-label="연락처" />
      </label>
      <button className="button button-primary" type="submit">
        알림 신청하기
      </button>
    </form>
  );
}
```

- [ ] **Step 6: Add `TradeDialogContent` to `src/App.tsx`**

Add after `EventDialogContent`:
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
      <label>
        <span>카카오 오픈프로필</span>
        <input placeholder="오픈프로필 링크" aria-label="카카오 오픈프로필" />
      </label>
      <button className="button button-primary" type="submit">
        {tab === 'buy' ? '구매 의향 등록하기' : '판매 의향 등록하기'}
      </button>
    </form>
  );
}
```

- [ ] **Step 7: Update `FeatureDialog` to route by `action.id`**

Replace the `FeatureDialog` function body with:
```typescript
function FeatureDialog({
  action,
  onClose
}: {
  action: ValidationAction;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (googleFormUrl.trim()) {
      window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
    }
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="feature-dialog" role="dialog" aria-modal="true" aria-label={action.title}>
        <button className="dialog-close" type="button" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        <div className="dialog-heading">
          <span className="card-icon" aria-hidden="true">
            {action.icon}
          </span>
          <div>
            <p className="section-label">PokeBase</p>
            <h2>{action.title}</h2>
          </div>
        </div>

        {submitted ? (
          <div className="dialog-success">
            <h3>등록되었습니다</h3>
            <p>입력한 내용에 맞춰 관련 안내를 받을 수 있습니다.</p>
            <button className="button button-primary" type="button" onClick={onClose}>
              확인
            </button>
          </div>
        ) : (
          <>
            {action.id === 'price' && <PriceDialogContent onSubmit={handleSubmit} />}
            {action.id === 'event' && <EventDialogContent onSubmit={handleSubmit} />}
            {action.id === 'trade' && <TradeDialogContent onSubmit={handleSubmit} />}
          </>
        )}
      </section>
    </div>
  );
}
```

- [ ] **Step 8: Run tests**

```bash
npm test
```
Expected: all tests pass

- [ ] **Step 9: Commit**

```bash
git add src/App.tsx src/styles.css src/App.test.tsx
git commit -m "feat: replace generic dialog with Fake Door Test-style forms per action"
```

---

### Task 5: Survey and interview CTA section

**Files:**
- Modify: `src/App.tsx` — add `SurveySection`, insert into `App`
- Modify: `src/styles.css` — add survey section styles
- Modify: `src/App.test.tsx` — update broken terminology test, add survey test

- [ ] **Step 1: Update the broken terminology test in `src/App.test.tsx`**

The test `'does not render internal experiment terminology to users'` has a regex that blocks `베타|준비 중`, which we're now intentionally using. Update that test:

```typescript
it('does not render internal experiment terminology to users', () => {
  const { container } = render(<App />);

  expect(container.textContent).not.toMatch(/fake|door|validation|experiment|signal/i);
  // 베타 준비 중 is intentional user-facing survey copy — removed from exclusion list
  expect(container.textContent).not.toMatch(/행동 신호|수요 신호|검증|실험|데이터 제품|Google Form/);
});
```

Add a new survey test:
```typescript
it('renders survey and interview CTA after FinalCta', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: '포켓몬카드 서비스를 함께 만들어 가요' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '설문 참여하기' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: '인터뷰 신청하기' })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify survey test fails**

```bash
npm test -- --reporter=verbose 2>&1 | grep -E "(FAIL|설문|인터뷰)"
```
Expected: FAIL — heading not found

- [ ] **Step 3: Add `SurveySection` to `src/App.tsx`**

Add after the `FinalCta` function:
```typescript
function SurveySection() {
  const openForm = () => {
    if (googleFormUrl.trim()) {
      window.open(googleFormUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="survey-section" aria-labelledby="survey-title">
      <div className="survey-copy">
        <span className="section-label">{landingContent.surveyEyebrow}</span>
        <h2 id="survey-title">{landingContent.surveyTitle}</h2>
        <p>{landingContent.surveyDescription}</p>
        <div className="survey-actions">
          <button className="button button-primary" type="button" onClick={openForm}>
            {landingContent.surveyPrimaryLabel}
          </button>
          <button className="button button-ghost" type="button" onClick={openForm}>
            {landingContent.surveySecondaryLabel}
          </button>
        </div>
      </div>
      <div className="survey-cards" aria-hidden="true">
        {surveyDecorCards.map((card, i) => (
          <img key={card.id} className={`survey-card survey-card-${i + 1}`} src={card.imageUrl} alt="" />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Insert `<SurveySection />` into `App`**

In the `App` return, after `<FinalCta />` and before the closing `</div>` of `.page-shell`:
```tsx
        <FinalCta />
        <SurveySection />
      </div>
```

- [ ] **Step 5: Add survey CSS to `src/styles.css`**

Add after the `.final-cta` block:
```css
.survey-section {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px;
  align-items: center;
  padding: 60px 0 80px;
  border-top: 1px solid rgba(17, 24, 39, 0.08);
}

.survey-copy .section-label {
  display: block;
  margin-bottom: 12px;
}

.survey-copy h2 {
  margin: 0;
  color: var(--color-ink);
  font-size: clamp(1.8rem, 2.8vw, 2.6rem);
  line-height: 1.18;
  letter-spacing: 0;
}

.survey-copy p {
  max-width: 520px;
  margin: 14px 0 0;
  color: var(--color-muted);
  font-size: 1.05rem;
  line-height: 1.65;
}

.survey-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.survey-cards {
  position: relative;
  width: 280px;
  height: 210px;
  flex-shrink: 0;
}

.survey-card {
  position: absolute;
  width: 120px;
  border-radius: 10px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
}

.survey-card-1 {
  left: 0;
  top: 20px;
  transform: rotate(-8deg);
  z-index: 1;
}

.survey-card-2 {
  left: 80px;
  top: 0;
  transform: rotate(2deg);
  z-index: 2;
}

.survey-card-3 {
  left: 160px;
  top: 25px;
  transform: rotate(10deg);
  z-index: 1;
}
```

Add responsive rules inside the existing `@media (max-width: 980px)` block:
```css
  .survey-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .survey-cards {
    display: none;
  }
```

Add inside `@media (max-width: 620px)` block:
```css
  .survey-section {
    padding: 44px 0 60px;
  }

  .survey-actions .button {
    width: 100%;
  }
```

- [ ] **Step 6: Run all tests**

```bash
npm test
```
Expected: all tests pass (including survey test and updated terminology test)

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css src/App.test.tsx
git commit -m "feat: add survey and interview CTA section with Pokemon card decorations"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Hero fan with 4 real Pokemon card images — Task 2
- [x] Animated gallery strip, 8 cards, navy background — Task 3
- [x] Price dialog: card thumbnails + edition radio + contact — Task 4
- [x] Event dialog: region single-select + category multi-select + contact — Task 4
- [x] Trade dialog: buy/sell tab toggle + card name + price + contact — Task 4
- [x] Survey section: eyebrow + title + 2 CTAs + card decorations — Task 5
- [x] pokemontcg.io CDN for all images — cards.ts

**Placeholder scan:** No TBD/TODO found. All code blocks are complete.

**Type consistency:**
- `CardData` defined in Task 1, used in Tasks 2–5
- `PriceDialogContent`, `EventDialogContent`, `TradeDialogContent` defined in Task 4, referenced in `FeatureDialog` in same task
- `surveyDecorCards` defined in Task 1, imported in App.tsx in Tasks 3+
- `FAN_TRANSFORMS` and `FAN_Z_INDEXES` are `as const` tuples matching `heroFanCards.length` (4)
