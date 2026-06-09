import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App landing page', () => {
  it('renders hero with background Pokemon images and centered heading', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /포켓몬카드 시세부터 행사, 거래까지 한 번에/ })
    ).toBeInTheDocument();
    expect(document.querySelector('.hero-bg')).toBeInTheDocument();
    expect(screen.getByText('포켓몬카드 라이브 보드')).toBeInTheDocument();
    expect(screen.getByText('시세 요청 트렌드')).toBeInTheDocument();
    expect(screen.getByText('이번 주 이벤트 레이더')).toBeInTheDocument();
    // HeroVisual (카드 팬) is gone
    expect(screen.queryByLabelText('포켓몬카드 미리보기')).not.toBeInTheDocument();
  });

  it('shows one hero CTA for browsing the service', () => {
    const { container } = render(<App />);

    expect(screen.getAllByRole('link', { name: '서비스 둘러보기' })).toHaveLength(1);
    expect(screen.queryByRole('link', { name: '카드 시세 확인하기' })).not.toBeInTheDocument();
  });

  it('renders the dashboard without the OS sidebar and with dated trend labels', () => {
    const { container } = render(<App />);

    expect(screen.queryByText('PokeBase OS')).not.toBeInTheDocument();
    expect(screen.getByText('6/03')).toBeInTheDocument();
    expect(screen.getByText('6/09')).toBeInTheDocument();
  });

  it('renders three equal feature action buttons', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '내 카드 시세 확인하기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '행사 알림 받기' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '카드 구매·판매 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '시세 확인하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '알림 설정하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '거래 시작하기' })).toBeInTheDocument();
  });

  it('keeps feature forms concise and renders a closing CTA', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: '포켓몬카드 생활을 한 화면에서 시작하세요' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '관심 기능 선택하기' })).toHaveAttribute('href', '#actions');
  });

  it('omits the survey section', () => {
    render(<App />);

    expect(screen.queryByText('베타 준비 중')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '포켓몬카드 서비스를 함께 만들어 가요' })).not.toBeInTheDocument();
  });

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

  it('event dialog shows region select dropdown and category buttons', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '알림 설정하기' }));

    expect(screen.getByRole('dialog', { name: '행사 알림 받기' })).toBeInTheDocument();
    // Region is now a <select>, not buttons
    const regionSelect = screen.getByLabelText('관심 지역') as HTMLSelectElement;
    expect(regionSelect.tagName).toBe('SELECT');
    // Expanded categories still present
    expect(screen.getByRole('button', { name: '프로모션 카드' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '대회·토너먼트' })).toBeInTheDocument();
    // Old 서울 button no longer exists
    expect(screen.queryByRole('button', { name: '서울' })).not.toBeInTheDocument();
  });

  it('trade dialog tab switching changes labels', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '거래 시작하기' }));

    expect(screen.getByRole('dialog', { name: '카드 구매·판매 시작하기' })).toBeInTheDocument();
    expect(screen.getByLabelText('찾는 카드명')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: '판매' }));
    expect(screen.getByLabelText('판매할 카드명')).toBeInTheDocument();
  });

  it('does not render internal experiment terminology to users', () => {
    const { container } = render(<App />);

    expect(container.textContent).not.toMatch(/fake|door|validation|experiment|signal/i);
    // 베타 준비 중 is intentional user-facing survey copy
    expect(container.textContent).not.toMatch(/행동 신호|수요 신호|검증|실험|데이터 제품|Google Form/);
  });

  it('exposes stable analytics data attributes for primary actions', () => {
    const { container } = render(<App />);

    expect(container.querySelector('[data-event="click_price"]')).toBeInTheDocument();
    expect(container.querySelector('[data-event="click_event"]')).toBeInTheDocument();
    expect(container.querySelector('[data-event="click_trade"]')).toBeInTheDocument();
  });

  it('renders the card gallery strip with Pokemon cards', () => {
    render(<App />);
    const gallerySection = screen.getByLabelText('인기 포켓몬카드 갤러리');
    expect(gallerySection).toBeInTheDocument();
    // galleryCards has 8 cards; the track doubles them for the scroll animation → 16 total
    expect(gallerySection.querySelectorAll('img')).toHaveLength(16);
  });

  it('shows beta gate modal after submitting price form', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '시세 확인하기' }));
    const dialog = screen.getByRole('dialog', { name: '내 카드 시세 확인하기' });
    const form = dialog.querySelector('form')!;
    fireEvent.submit(form);

    expect(screen.getByRole('heading', { name: '아직 베타 기간입니다' })).toBeInTheDocument();
    expect(screen.getByText(/여러분의 설문 참여가 더 좋은 서비스를/)).toBeInTheDocument();
  });

  it('trade dialog does not show KakaoTalk open profile field', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '거래 시작하기' }));

    expect(screen.getByRole('dialog', { name: '카드 구매·판매 시작하기' })).toBeInTheDocument();
    expect(screen.queryByLabelText('카카오 오픈프로필')).not.toBeInTheDocument();
    expect(screen.getByLabelText('찾는 카드명')).toBeInTheDocument();
    expect(screen.getByLabelText('최대 예산')).toBeInTheDocument();
  });

  it('renders /logs page when pathname is /logs', () => {
    const originalPathname = window.location.pathname;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, pathname: '/logs' },
    });

    render(<App />);
    expect(screen.getByText('PokeBase Click Log')).toBeInTheDocument();

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, pathname: originalPathname },
    });
  });
});
