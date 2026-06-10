import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import {
  landingContent,
  validationActions,
  EVENT_REGIONS,
  EVENT_CATEGORIES,
  type ValidationAction
} from './content/landing';
import {
  galleryCards,
} from './content/cards';
import './styles.css';

const googleFormUrl = import.meta.env.VITE_GOOGLE_FORM_URL ?? '';

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

function trackEvent(eventName: string, params: Record<string, string> = {}): void {
  const cleanUtm = Object.fromEntries(
    Object.entries(getStoredUtm()).filter(([, value]) => value)
  );
  window.gtag?.('event', eventName, { ...cleanUtm, ...params });
  logEvent(eventName);
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

const HERO_ROWS = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 35, 36, 39, 40, 52, 54, 55],
  [63, 64, 79, 80, 92, 93, 94, 104, 105, 113, 116, 117, 120, 121, 123, 125, 126, 129, 130, 131, 133, 134, 135, 136],
  [143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 155, 158, 175, 179, 196, 197, 202, 225],
  [243, 244, 245, 246, 247, 248, 249, 250, 252, 255, 258, 280, 282, 384, 172, 173, 174, 183, 184, 198, 209, 212, 228, 229],
] as const;

const POKEAPI_ART = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

function BrandMark() {
  return (
    <div className="brand" aria-label={landingContent.productName}>
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" width="34" height="34">
          <defs>
            <clipPath id="pokeball-top">
              <rect x="0" y="0" width="34" height="17" />
            </clipPath>
          </defs>
          <circle cx="17" cy="17" r="15" fill="white" stroke="#0b7a4b" strokeWidth="2" />
          <circle cx="17" cy="17" r="15" fill="#0b7a4b" clipPath="url(#pokeball-top)" />
          <rect x="2" y="14.5" width="30" height="5" fill="#075c39" />
          <circle cx="17" cy="17" r="5" fill="white" stroke="#075c39" strokeWidth="2" />
          <circle cx="17" cy="17" r="2.5" fill="#0b7a4b" />
        </svg>
      </span>
      <span>{landingContent.productName}</span>
    </div>
  );
}

function DashboardPreview() {
  const chartPoints = [
    { date: '6/03', height: '36%' },
    { date: '6/04', height: '54%' },
    { date: '6/05', height: '42%' },
    { date: '6/06', height: '76%' },
    { date: '6/07', height: '66%' },
    { date: '6/08', height: '90%' },
    { date: '6/09', height: '72%' }
  ];

  return (
    <section className="product-stage" id="service-preview" aria-label="포켓몬카드 대시보드 미리보기" data-reveal>
      <div className="dashboard">
        <div className="dash-main">
          <div className="dash-header">
            <h2>{landingContent.dashboardTitle}</h2>
          </div>

          <div className="metric-row" aria-label="포켓몬카드 소식 요약">
            <div className="metric">
              <span>인기 조회</span>
              <strong>시세 42건</strong>
            </div>
            <div className="metric">
              <span>이번 주 행사</span>
              <strong>3건</strong>
            </div>
            <div className="metric">
              <span>거래 관심</span>
              <strong>12건</strong>
            </div>
          </div>

          <div className="dash-grid">
            <div className="panel">
              <h3>시세 요청 트렌드</h3>
              <div className="line-chart" aria-label="6월 3일부터 6월 9일까지 시세 요청 트렌드">
                {chartPoints.map(({ date, height }) => (
                  <div className="chart-column" key={date}>
                    <span style={{ height }} />
                    <small>{date}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <h3>이번 주 이벤트 레이더</h3>
              <div className="event-list">
                <div className="event-item">
                  <span>서울 프로모 카드 배포</span>
                  <b>오늘</b>
                </div>
                <div className="event-item">
                  <span>부산 카드샵 대회</span>
                  <b>D-2</b>
                </div>
                <div className="event-item">
                  <span>신제품 발매 알림</span>
                  <b>D-5</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroBg() {
  return (
    <div className="hero-bg" aria-hidden="true">
      <div className="hero-rays" />
      <div className="hero-pokemon-rows">
        {HERO_ROWS.map((row, i) => {
          const doubled = [...row, ...row];
          const dir = i % 2 === 0 ? 'left' : 'right';
          return (
            <div className={`hero-row hero-row--${i + 1}`} key={i}>
              <div className={`hero-row-track hero-row-track--${dir}`}>
                {doubled.map((id, j) => (
                  <img key={`${id}-${j}`} src={POKEAPI_ART(id)} alt="" draggable={false} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="hero-overlay" />
    </div>
  );
}

function CardGallery() {
  const doubled = [...galleryCards, ...galleryCards];

  return (
    <section className="gallery-strip" aria-label="인기 포켓몬카드 갤러리" data-reveal>
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

function ValidationCard({ action, onSelect }: { action: ValidationAction; onSelect: (action: ValidationAction) => void }) {
  return (
    <article className="action-card">
      <div className="card-icon" aria-hidden="true">
        {action.icon}
      </div>
      <h3>{action.title}</h3>
      <p>{action.description}</p>
      <button
        className="button button-primary"
        type="button"
        data-event={action.analyticsEvent}
        onClick={() => {
          trackEvent(action.analyticsEvent, { feature: action.id });
          onSelect(action);
        }}
      >
        {action.buttonLabel}
      </button>
      <div className="mini-form" aria-label={`${action.title} 입력 항목`}>
        {action.inputs.map((input) => (
          <span key={input}>{input}</span>
        ))}
      </div>
    </article>
  );
}

function PriceDialogContent({ onSubmit }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <form className="dialog-form" onSubmit={onSubmit}>
      <label>
        <span>카드 이미지</span>
        <div className="image-upload-box">
          <input
            type="file"
            accept="image/*"
            aria-label="카드 이미지 업로드"
            onChange={handleFileChange}
          />
          {previewUrl ? (
            <div className="image-preview-wrapper" aria-hidden="true">
              <img src={previewUrl} alt="업로드 미리보기" className="image-preview" />
              <div className="image-preview-hint">📷 클릭하여 변경</div>
            </div>
          ) : (
            <div className="image-upload-placeholder" aria-hidden="true">
              <span className="image-upload-icon">📷</span>
              <p>이미지를 클릭하거나 드래그해서 올려주세요</p>
              <small>JPG, PNG, WEBP 지원</small>
            </div>
          )}
        </div>
      </label>
      <button className="button button-primary" type="submit">
        등록하기
      </button>
    </form>
  );
}

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
    setSubmitted(true);
  };

  const handleClose = () => {
    trackEvent('dialog_close', {
      feature: action.id,
      step: submitted ? 'survey_prompt' : 'form'
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="feature-dialog" role="dialog" aria-modal="true" aria-label={action.title}>
        <button className="dialog-close" type="button" aria-label="닫기" onClick={handleClose}>
          ×
        </button>
        <div className="dialog-heading">
          <span className="card-icon" aria-hidden="true">
            {action.icon}
          </span>
          <div>
            <p className="section-label">{landingContent.productName}</p>
            <h2>{action.title}</h2>
          </div>
        </div>

        {submitted ? (
          <div className="dialog-success">
            <h3>아직 베타 기간입니다</h3>
            <p>여러분의 설문 참여가 더 좋은 서비스를 만들 수 있습니다. 짧은 설문(3분)으로 원하는 기능을 알려주세요.</p>
            <button
              className="button button-primary"
              type="button"
              onClick={() => {
                trackEvent(action.surveyEvent, { feature: action.id });
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

function FinalCta() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title" data-reveal>
      <div>
        <span className="section-label">Next step</span>
        <h2 id="final-cta-title">{landingContent.finalTitle}</h2>
        <p>{landingContent.finalDescription}</p>
      </div>
    </section>
  );
}

function HeroActions() {
  return (
    <div className="hero-actions">
      <a className="button button-primary" href="#service-preview">
        {landingContent.heroCta}
      </a>
    </div>
  );
}

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
    try {
      localStorage.removeItem('pkb_events');
    } catch {
      // silently ignore storage errors
    }
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

function App() {
  const [selectedAction, setSelectedAction] = useState<ValidationAction | null>(null);

  useEffect(() => {
    document.title = `${landingContent.productName} | 포켓몬카드 스마트하게 즐기기`;
    captureUtm();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  if (window.location.pathname === '/logs') {
    return <LogsPage />;
  }

  return (
    <main>
      <section className="hero">
        <HeroBg />
        <div className="hero-topbar page-shell">
          <BrandMark />
        </div>
        <div className="hero-content page-shell">
          <h1>포켓몬카드를<br />가장 스마트하게 즐기는 법</h1>
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
        <DashboardPreview />
        <CardGallery />

        <section id="actions" aria-labelledby="actions-title">
          <div className="section-title" data-reveal>
          <span className="section-label">지금 시작하기</span>
          <h2 id="actions-title">무엇을 도와드릴까요?</h2>
          <p>필요한 기능을 선택하고 간편하게 시작해 보세요.</p>
          </div>
          <div className="cta-grid" data-reveal style={{ transitionDelay: '120ms' }}>
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
}

export default App;
