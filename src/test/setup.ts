import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

(window as typeof window & { gtag: ReturnType<typeof vi.fn> }).gtag = vi.fn();

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = '';
  readonly thresholds: ReadonlyArray<number> = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn((): IntersectionObserverEntry[] => []);
  unobserve = vi.fn();
}

window.IntersectionObserver = MockIntersectionObserver;
