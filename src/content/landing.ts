export type ActionId = 'price' | 'event' | 'trade';

export type ValidationAction = {
  id: ActionId;
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  inputs: string[];
  analyticsEvent: string;
};

export type LandingContent = {
  productName: string;
  eyebrow: string;
  title: string;
  heroDescription: string;
  heroCta: string;
  heroCaption: string;
  dashboardTitle: string;
  finalTitle: string;
  finalDescription: string;
};

export type ActionLinkState = {
  canOpen: boolean;
  label: string;
  helper: string;
};

export const analyticsEvents = [
  'click_price',
  'submit_price_card',
  'click_event',
  'submit_event_alert',
  'click_trade',
  'select_trade_buy',
  'select_trade_sell',
  'submit_trade_card',
] as const;

export const landingContent: LandingContent = {
  productName: '줍줍',
  eyebrow: '포켓몬카드 서비스',
  title: '포켓몬카드를\n가장 스마트하게 즐기는 법',
  heroDescription:
    '카드명만 입력해 시세를 확인하고, 놓치기 쉬운 프로모션 행사와 구매·판매 의향까지\n한 화면에서 관리하세요.',
  heroCta: '서비스 둘러보기',
  heroCaption: '서비스 보드를 확인한 뒤 필요한 기능을 바로 선택하세요.',
  dashboardTitle: '포켓몬카드 라이브 보드',
  finalTitle: '포켓몬카드 생활을 한 화면에서 시작하세요',
  finalDescription:
    '시세 확인, 행사 알림, 거래 시작 중 지금 필요한 기능을 선택하면 관련 안내를 받을 수 있습니다.',
};

export const validationActions: ValidationAction[] = [
  {
    id: 'price',
    icon: '₩',
    title: '내 카드 시세 확인하기',
    description: '카드 사진 또는 카드명을 남기면 최근 매물과 예상 거래 범위를 확인할 수 있습니다.',
    buttonLabel: '시세 확인하기',
    inputs: ['카드 사진 또는 카드명', '연락받을 이메일 또는 오픈프로필'],
    analyticsEvent: 'click_price'
  },
  {
    id: 'event',
    icon: '!',
    title: '행사 알림 받기',
    description: '프로모션 배포, 팝업스토어, 신제품 출시, 카드샵 행사와 대회를 지역별로 확인합니다.',
    buttonLabel: '알림 설정하기',
    inputs: ['관심 지역', '알림받을 연락처'],
    analyticsEvent: 'click_event'
  },
  {
    id: 'trade',
    icon: '↔',
    title: '카드 구매·판매 시작하기',
    description: '판매자는 카드 사진과 희망 가격을, 구매자는 찾는 카드와 예산을 남깁니다.',
    buttonLabel: '거래 시작하기',
    inputs: ['구매 또는 판매 카드명', '연락 가능한 오픈프로필'],
    analyticsEvent: 'click_trade'
  }
];

export const getActionLinkState = (googleFormUrl: string, defaultLabel: string): ActionLinkState => {
  if (googleFormUrl.trim()) {
    return {
      canOpen: true,
      label: defaultLabel,
      helper: '선택한 정보를 입력하고 관련 안내를 받아보세요.'
    };
  }

  return {
    canOpen: false,
    label: defaultLabel,
    helper: '선택한 정보를 입력하고 관련 안내를 받아보세요.'
  };
};

export const EVENT_REGIONS = [
  '전국', '서울', '부산', '대구', '인천', '광주',
  '대전', '울산', '세종', '경기', '강원', '충북',
  '충남', '전북', '전남', '경북', '경남', '제주',
] as const;

export const EVENT_CATEGORIES = [
  '프로모션 카드', '팝업스토어', '신제품 발매', '카드샵 행사',
  '대회·토너먼트', '한정판 굿즈', '온라인 이벤트', '콜라보 상품',
] as const;
