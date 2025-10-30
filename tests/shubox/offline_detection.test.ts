import { describe, it, expect, beforeEach, beforeAll, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Offline Detection', () => {
  let dom: JSDOM;
  let document: Document;
  let Shubox: any;
  let navigatorOnLineSpy: any;

  beforeAll(async () => {
    // Set up JSDOM before importing Shubox (which imports Dropzone)
    const initialDom = new JSDOM('<!DOCTYPE html><div></div>');
    global.window = initialDom.window as any;
    global.document = initialDom.window.document;
    global.HTMLElement = initialDom.window.HTMLElement;
    global.CustomEvent = initialDom.window.CustomEvent;
    global.Event = initialDom.window.Event;
    global.navigator = initialDom.window.navigator;

    // Now safe to import Shubox
    const module = await import('~/shubox');
    Shubox = module.default;
  });

  beforeEach(() => {
    dom = new JSDOM('<!DOCTYPE html><div class="shubox-test"></div>');
    document = dom.window.document;
    global.document = document;
    global.window = dom.window as any;
    global.HTMLElement = dom.window.HTMLElement;
    global.CustomEvent = dom.window.CustomEvent;
    global.Event = dom.window.Event;
    global.navigator = dom.window.navigator;

    // Mock navigator.onLine
    navigatorOnLineSpy = vi.spyOn(navigator, 'onLine', 'get');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should disable dropzone when initialized offline', () => {
      navigatorOnLineSpy.mockReturnValue(false);

      const shubox = new Shubox('.shubox-test', { key: 'test-key' });
      const element = document.querySelector('.shubox-test') as HTMLElement;

      expect(element.classList.contains('shubox-offline')).toBe(true);
      expect(element.getAttribute('data-shubox-offline')).toBe('true');
    });

    it('should enable dropzone when initialized online', () => {
      navigatorOnLineSpy.mockReturnValue(true);

      const shubox = new Shubox('.shubox-test', { key: 'test-key' });
      const element = document.querySelector('.shubox-test') as HTMLElement;

      expect(element.classList.contains('shubox-offline')).toBe(false);
      expect(element.getAttribute('data-shubox-offline')).toBeNull();
    });
  });

  describe('Online/Offline Events', () => {
    it('should disable dropzone when going offline', () => {
      navigatorOnLineSpy.mockReturnValue(true);

      const shubox = new Shubox('.shubox-test', { key: 'test-key' });
      const element = document.querySelector('.shubox-test') as HTMLElement;

      // Initially online
      expect(element.classList.contains('shubox-offline')).toBe(false);

      // Simulate going offline
      navigatorOnLineSpy.mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));

      expect(element.classList.contains('shubox-offline')).toBe(true);
      expect(element.getAttribute('data-shubox-offline')).toBe('true');
    });

    it('should enable dropzone when coming back online', () => {
      navigatorOnLineSpy.mockReturnValue(false);

      const shubox = new Shubox('.shubox-test', { key: 'test-key' });
      const element = document.querySelector('.shubox-test') as HTMLElement;

      // Initially offline
      expect(element.classList.contains('shubox-offline')).toBe(true);

      // Simulate coming back online
      navigatorOnLineSpy.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));

      expect(element.classList.contains('shubox-offline')).toBe(false);
      expect(element.getAttribute('data-shubox-offline')).toBeNull();
    });
  });

  describe('Configuration Options', () => {
    it('should respect offlineCheck: false option', () => {
      navigatorOnLineSpy.mockReturnValue(false);

      const shubox = new Shubox('.shubox-test', {
        key: 'test-key',
        offlineCheck: false
      });
      const element = document.querySelector('.shubox-test') as HTMLElement;

      // Should NOT be disabled even though offline
      expect(element.classList.contains('shubox-offline')).toBe(false);
      expect(element.getAttribute('data-shubox-offline')).toBeNull();
    });

    it('should enable offline check by default', () => {
      navigatorOnLineSpy.mockReturnValue(false);

      const shubox = new Shubox('.shubox-test', { key: 'test-key' });
      const element = document.querySelector('.shubox-test') as HTMLElement;

      // Should be disabled when offline (default behavior)
      expect(element.classList.contains('shubox-offline')).toBe(true);
    });
  });

  describe('Multiple Elements', () => {
    beforeEach(() => {
      dom = new JSDOM(`
        <!DOCTYPE html>
        <div class="shubox-multi"></div>
        <div class="shubox-multi"></div>
      `);
      document = dom.window.document;
      global.document = document;
      global.window = dom.window as any;
      global.HTMLElement = dom.window.HTMLElement;
    });

    it('should disable all dropzone instances when going offline', () => {
      navigatorOnLineSpy.mockReturnValue(true);

      const shubox = new Shubox('.shubox-multi', { key: 'test-key' });
      const elements = document.querySelectorAll('.shubox-multi');

      // Initially online
      elements.forEach(el => {
        expect(el.classList.contains('shubox-offline')).toBe(false);
      });

      // Simulate going offline
      navigatorOnLineSpy.mockReturnValue(false);
      window.dispatchEvent(new Event('offline'));

      // All should be offline
      elements.forEach(el => {
        expect(el.classList.contains('shubox-offline')).toBe(true);
        expect(el.getAttribute('data-shubox-offline')).toBe('true');
      });
    });

    it('should enable all dropzone instances when coming back online', () => {
      navigatorOnLineSpy.mockReturnValue(false);

      const shubox = new Shubox('.shubox-multi', { key: 'test-key' });
      const elements = document.querySelectorAll('.shubox-multi');

      // Initially offline
      elements.forEach(el => {
        expect(el.classList.contains('shubox-offline')).toBe(true);
      });

      // Simulate coming back online
      navigatorOnLineSpy.mockReturnValue(true);
      window.dispatchEvent(new Event('online'));

      // All should be online
      elements.forEach(el => {
        expect(el.classList.contains('shubox-offline')).toBe(false);
        expect(el.getAttribute('data-shubox-offline')).toBeNull();
      });
    });
  });
});
