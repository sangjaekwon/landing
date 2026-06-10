# PokeBase 랜딩페이지 포켓몬카드 비주얼 개편

**날짜**: 2026-06-09  
**브랜치**: figures-live-auction

---

## 목표

실제 포켓몬TCG 카드 이미지를 활용해 히어로 섹션의 시각적 임팩트를 높이고, Fake Door Test 방식으로 기능별 수요를 검증하는 다이얼로그를 개선한다. 설문·인터뷰 신청 섹션을 새로 추가한다.

---

## 변경 범위

### 1. 히어로 비주얼 교체

**현재**: `public/assets/pokebase-card-desk.png` 단일 이미지

**변경**:
- `HeroVisual` 컴포넌트에서 `<img>` 태그 제거
- 3~4장의 포켓몬카드 이미지를 CSS fan 레이아웃으로 표시
- 이미지 소스: `pokemontcg.io` CDN (`https://images.pokemontcg.io/{setId}/{number}_hires.png`)
- 카드 목록 (4장):
  - 리자몽 ex (sv3pt5 Charizard ex)
  - 피카츄 (sv3pt5 Pikachu)
  - 뮤츠 ex
  - 이브이 (Eevee)
- 기존 `hero-insight` 말풍선 (오늘의 관심 카드 / 리자몽 ex SAR) 유지
- CSS: 카드마다 개별 `rotate` + `translate`로 겹침 연출, hover 시 해당 카드 살짝 위로

### 2. 카드 갤러리 스트립

**위치**: 히어로와 `DashboardPreview` 사이에 새 `CardGallery` 컴포넌트 삽입

**구성**:
- 8장의 포켓몬카드 이미지 (pokemontcg.io CDN)
- CSS `@keyframes` 무한 자동 스크롤 (왼쪽 방향, `animation-play-state: paused` on hover)
- 각 카드 아래 카드명 + 예시 시세 텍스트 (`리자몽 ex SAR · ₩45,000~62,000`)
- 배경: `--color-navy` (#182235)
- 카드 호버 시 `translateY(-8px)` + `box-shadow` 강조
- 트랙을 두 벌 복사해 끊김 없는 루프 구현

**카드 목록 (8장)**:
1. 리자몽 ex SAR
2. 피카츄 프로모
3. 뮤츠 ex SAR
4. 리자드
5. 이상해꽃 ex
6. 거북왕 ex
7. 이브이 SAR
8. 잠만보 ex

### 3. 액션 다이얼로그 개선 (Fake Door Test)

`FeatureDialog` 컴포넌트를 액션 ID별로 분기해 맞춤 폼을 렌더링한다.

#### 시세 확인 (`id: 'price'`)
- 상단: 샘플 카드 썸네일 3장 (선택 암시 UI)
- 카드명 텍스트 입력 (필수)
- 에디션 라디오: 한국판 / 일본판 / 영문판
- 연락처 입력: 카카오 오픈프로필 또는 이메일

#### 행사 알림 (`id: 'event'`)
- 지역 토글 버튼: 서울 / 부산 / 대구 / 대전 / 전국 (단일 선택)
- 관심 분야 토글 버튼: 프로모 카드 / 팝업스토어 / 신제품 / 카드샵 행사 / 대회 (복수 선택)
- 연락처 입력

#### 거래 시작 (`id: 'trade'`)
- 구매 / 판매 탭 토글 (탭 전환 시 placeholder 및 안내 텍스트 변경)
- 카드명 입력 (필수)
- 희망 가격 또는 예산 입력
- 카카오 오픈프로필 입력

**공통**: 제출 후 "등록되었습니다" 성공 화면은 기존 유지. `VITE_GOOGLE_FORM_URL` 환경변수로 Google Form 연동.

### 4. 설문·인터뷰 신청 섹션

**위치**: `FinalCta` 컴포넌트 아래, `</main>` 안

**컴포넌트**: `SurveySection`

**레이아웃**: 좌우 2열
- 좌: 텍스트 + 버튼 2개
  - eyebrow: `베타 준비 중`
  - h2: `포켓몬카드 서비스를 함께 만들어 가요`
  - p: `짧은 설문(3분)으로 원하는 기능을 알려주거나, 인터뷰에 참여해 더 깊은 이야기를 나눠보세요.`
  - `[설문 참여하기]` (button-primary, `VITE_GOOGLE_FORM_URL` 링크)
  - `[인터뷰 신청하기]` (button-ghost)
- 우: 포켓몬카드 2~3장을 살짝 기울여 장식 배치 (pokemontcg.io 이미지)

**배경**: `--color-primary` 계열 연한 그린 (`rgba(11,122,75,0.07)`) + 상단 border

---

## 컴포넌트 변경 요약

| 컴포넌트 | 변경 유형 |
|---|---|
| `HeroVisual` | 수정 — img 제거, 카드 fan 레이아웃 추가 |
| `CardGallery` | 신규 — 무한 스크롤 카드 스트립 |
| `FeatureDialog` | 수정 — id별 맞춤 폼 렌더링 |
| `PriceDialogContent` | 신규 (FeatureDialog 내부) |
| `EventDialogContent` | 신규 (FeatureDialog 내부) |
| `TradeDialogContent` | 신규 (FeatureDialog 내부) |
| `SurveySection` | 신규 — 설문·인터뷰 CTA |
| `styles.css` | 수정 — fan, gallery, toggle-btn, survey 스타일 추가 |

---

## 이미지 소스

- CDN: `https://images.pokemontcg.io/{setId}/{number}_hires.png`
- 히어로 팬: 4장, 갤러리: 8장, 설문 섹션 장식: 3장
- 구체적인 setId/number는 구현 시 pokemontcg.io API로 확인

---

## 범위 외

- 백엔드 / API 연동 없음
- `VITE_GOOGLE_FORM_URL` 환경변수 값 자체는 변경 안 함
- 테스트 파일 (`App.test.tsx`, `landing.test.ts`) 변경 없음
