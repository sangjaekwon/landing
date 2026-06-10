import { describe, expect, it } from 'vitest';
import {
  analyticsEvents,
  getActionLinkState,
  landingContent,
  validationActions
} from './landing';

describe('landing content contract', () => {
  it('frames the product as a user-facing Pokemon card service', () => {
    expect(landingContent.productName).toBe('줍줍');
    expect(landingContent.title).toContain('포켓몬카드');
    expect(landingContent.heroDescription).toContain('시세');
    expect(landingContent.heroDescription).toContain('프로모');
    expect(landingContent.heroDescription).toContain('구매·판매');
  });

  it('defines exactly three equal user-facing actions', () => {
    expect(validationActions).toHaveLength(3);
    expect(validationActions.map((action) => action.id)).toEqual(['price', 'event', 'trade']);

    for (const action of validationActions) {
      expect(action.title.length).toBeGreaterThan(0);
      expect(action.description.length).toBeGreaterThan(0);
      expect(action.buttonLabel.length).toBeGreaterThan(0);
      expect(action.inputs).toHaveLength(2);
      expect(action.analyticsEvent).toMatch(/^click_/);
      expect(action.surveyEvent).toBe(`click_${action.id}_survey`);
    }
  });

  it('does not expose internal experiment language in public copy', () => {
    const publicCopy = [
      landingContent.eyebrow,
      landingContent.title,
      landingContent.heroDescription,
      landingContent.heroCta,
      landingContent.heroCaption,
      landingContent.dashboardTitle,
      landingContent.finalTitle,
      landingContent.finalDescription,
      ...validationActions.flatMap((action) => [
        action.title,
        action.description,
        action.buttonLabel,
        ...action.inputs
      ])
    ].join(' ');

    expect(publicCopy).not.toMatch(/fake|door|validation|experiment|signal/i);
    expect(publicCopy).not.toMatch(/행동 신호|수요 신호|검증|실험|데이터 제품|Google Form|베타|준비 중/);
  });

  it('keeps required analytics event names stable', () => {
    expect(analyticsEvents).toEqual([
      'click_price',
      'submit_price_card',
      'click_event',
      'submit_event_alert',
      'click_trade',
      'select_trade_buy',
      'select_trade_sell',
      'submit_trade_card',
      'click_price_survey',
      'click_event_survey',
      'click_trade_survey',
      'dialog_close',
    ]);
  });
});

describe('CTA link state', () => {
  it('returns a closed action state until a signup URL is configured', () => {
    expect(getActionLinkState('', '시세 요청 등록')).toEqual({
      canOpen: false,
      label: '시세 요청 등록',
      helper: '선택한 정보를 입력하고 관련 안내를 받아보세요.'
    });
  });

  it('returns an open action state when a signup URL is configured', () => {
    expect(getActionLinkState('https://forms.gle/example', '시세 요청 등록')).toEqual({
      canOpen: true,
      label: '시세 요청 등록',
      helper: '선택한 정보를 입력하고 관련 안내를 받아보세요.'
    });
  });
});
