import { describe, it, expect, beforeEach, beforeAll, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { NetworkError, TimeoutError, UploadError } from '~/shubox/errors';
import type { ShuboxDropzoneFile } from '~/shubox/types';

describe('Error Event System', () => {
  let dom: JSDOM;
  let document: Document;
  let Shubox: any;
  let shubox: any;
  let element: HTMLElement;

  beforeAll(async () => {
    // Set up JSDOM before importing Shubox (which imports Dropzone)
    const initialDom = new JSDOM('<!DOCTYPE html><div></div>');
    global.window = initialDom.window as any;
    global.document = initialDom.window.document;
    global.HTMLElement = initialDom.window.HTMLElement;
    global.CustomEvent = initialDom.window.CustomEvent;
    global.Event = initialDom.window.Event;
    global.navigator = initialDom.window.navigator;
    global.XMLHttpRequest = initialDom.window.XMLHttpRequest;

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
    global.XMLHttpRequest = dom.window.XMLHttpRequest;

    // Mock navigator.onLine to be online
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);

    shubox = new Shubox('.shubox-test', { key: 'test-key' });
    element = document.querySelector('.shubox-test') as HTMLElement;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('shubox:error event', () => {
    it('should dispatch error event when upload fails (non-recoverable)', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:error', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
      } as ShuboxDropzoneFile;

      const error = new Error('Upload failed');

      // Trigger error callback with non-recoverable error
      shubox.callbacks.error(mockFile, error);

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0];
      expect(event.type).toBe('shubox:error');
      expect(event.detail.error).toBe(error);
      expect(event.detail.file).toBe(mockFile);
    });

    it('should dispatch error event after retries exhausted', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:error', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        _shuboxRetryCount: 3, // Already retried 3 times
      } as ShuboxDropzoneFile;

      const error = new NetworkError('Network error');

      // Trigger error callback - should not retry anymore
      shubox.callbacks.error(mockFile, error);

      expect(eventHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('shubox:timeout event', () => {
    it('should dispatch timeout event when upload times out', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:timeout', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
      } as ShuboxDropzoneFile;

      const timeoutError = new TimeoutError('Request timed out');

      shubox.callbacks.error(mockFile, timeoutError);

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0];
      expect(event.type).toBe('shubox:timeout');
      expect(event.detail.file).toBe(mockFile);
      expect(event.detail.timeout).toBe(60000); // Default timeout
    });
  });

  describe('shubox:retry:start event', () => {
    it('should dispatch retry:start event on first retry', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:retry:start', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        status: 'error',
      } as ShuboxDropzoneFile;

      const error = new NetworkError('Network error');

      // First failure - should trigger retry:start
      shubox.callbacks.error(mockFile, error);

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0];
      expect(event.type).toBe('shubox:retry:start');
      expect(event.detail.error).toBe(error);
      expect(event.detail.file).toBe(mockFile);
      expect(event.detail.maxRetries).toBe(3);
    });

    it('should NOT dispatch retry:start on subsequent retries', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:retry:start', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        status: 'error',
        _shuboxRetryCount: 1, // Already retried once
      } as ShuboxDropzoneFile;

      const error = new NetworkError('Network error');

      // Second failure - should NOT trigger retry:start
      shubox.callbacks.error(mockFile, error);

      expect(eventHandler).not.toHaveBeenCalled();
    });
  });

  describe('shubox:retry:attempt event', () => {
    it('should dispatch retry:attempt on every retry', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:retry:attempt', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        status: 'error',
      } as ShuboxDropzoneFile;

      const error = new NetworkError('Network error');

      // First retry
      shubox.callbacks.error(mockFile, error);

      expect(eventHandler).toHaveBeenCalledTimes(1);
      let event = eventHandler.mock.calls[0][0];
      expect(event.type).toBe('shubox:retry:attempt');
      expect(event.detail.attempt).toBe(1);
      expect(event.detail.maxRetries).toBe(3);
      expect(event.detail.delay).toBe(1000); // 2^0 * 1000
    });

    it('should include correct attempt number and delay', () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:retry:attempt', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        status: 'error',
        _shuboxRetryCount: 1, // Second retry
      } as ShuboxDropzoneFile;

      const error = new NetworkError('Network error');

      shubox.callbacks.error(mockFile, error);

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0];
      expect(event.detail.attempt).toBe(2);
      expect(event.detail.delay).toBe(2000); // 2^1 * 1000
    });
  });

  describe('shubox:recovered event', () => {
    it('should dispatch recovered event when upload succeeds after retries', async () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:recovered', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        _shuboxRetryCount: 2, // Had 2 failures before this success
      } as ShuboxDropzoneFile;

      const mockResponse = '<Location>https://s3.amazonaws.com/bucket/test.jpg</Location>';

      // Call success callback - the recovered event should be dispatched synchronously
      shubox.callbacks.success(mockFile, mockResponse);

      // Wait for next tick to let any async operations complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(eventHandler).toHaveBeenCalledTimes(1);
      const event = eventHandler.mock.calls[0][0];
      expect(event.type).toBe('shubox:recovered');
      expect(event.detail.file).toBe(mockFile);
      expect(event.detail.attemptCount).toBe(3); // 2 retries + 1 initial = 3 attempts
    });

    it('should NOT dispatch recovered event on first successful upload', async () => {
      const eventHandler = vi.fn();
      element.addEventListener('shubox:recovered', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
        // No _shuboxRetryCount - first attempt
      } as ShuboxDropzoneFile;

      const mockResponse = '<Location>https://s3.amazonaws.com/bucket/test.jpg</Location>';

      // Call success callback - no recovered event should be dispatched
      shubox.callbacks.success(mockFile, mockResponse);

      // Wait for next tick to let any async operations complete
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(eventHandler).not.toHaveBeenCalled();
    });
  });

  describe('Event Bubbling', () => {
    it('should bubble events up the DOM', () => {
      const parentHandler = vi.fn();
      const parent = element.parentElement || document.body;
      parent.addEventListener('shubox:error', parentHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
      } as ShuboxDropzoneFile;

      const error = new Error('Test error');

      shubox.callbacks.error(mockFile, error);

      expect(parentHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Cancellation', () => {
    it('should create cancelable events', () => {
      const eventHandler = vi.fn((event: Event) => {
        expect(event.cancelable).toBe(true);
      });

      element.addEventListener('shubox:error', eventHandler as any);

      const mockFile = {
        name: 'test.jpg',
        size: 1024,
        type: 'image/jpeg',
      } as ShuboxDropzoneFile;

      shubox.callbacks.error(mockFile, new Error('Test'));

      expect(eventHandler).toHaveBeenCalled();
    });
  });
});
