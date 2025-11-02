/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxErrorHandler } from '../../src/shubox/error_handler';
import { NetworkError, TimeoutError, OfflineError } from '../../src/shubox/errors';
import { setupJsDom } from '../test_helpers';

describe('ShuboxErrorHandler', () => {
  let element: HTMLElement;
  let handler: ShuboxErrorHandler;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);
    handler = new ShuboxErrorHandler(element);
  });

  describe('recoverable error detection', () => {
    test('isRecoverableError returns true for NetworkError', () => {
      const error = new NetworkError('Connection failed');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for TimeoutError', () => {
      const error = new TimeoutError('Request timeout');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for OfflineError', () => {
      const error = new OfflineError('No connection');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns false for generic Error', () => {
      const error = new Error('Some error');
      expect(handler.isRecoverableError(error)).toBe(false);
    });
  });

  describe('retry scheduling', () => {
    test('calculateBackoffDelay returns exponential backoff', () => {
      expect(handler.calculateBackoffDelay(1)).toBe(1000); // 2^0 * 1000
      expect(handler.calculateBackoffDelay(2)).toBe(2000); // 2^1 * 1000
      expect(handler.calculateBackoffDelay(3)).toBe(4000); // 2^2 * 1000
      expect(handler.calculateBackoffDelay(4)).toBe(8000); // 2^3 * 1000
    });
  });

  describe('error event dispatching', () => {
    test('dispatchErrorEvent dispatches shubox:error event', () => {
      const dispatchSpy = vi.spyOn(element, 'dispatchEvent');
      const error = new Error('Test error');

      handler.dispatchErrorEvent(error);

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('shubox:error');
    });

    test('dispatchTimeoutEvent dispatches shubox:timeout event', () => {
      const dispatchSpy = vi.spyOn(element, 'dispatchEvent');

      handler.dispatchTimeoutEvent();

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('shubox:timeout');
    });

    test('dispatchRetryEvent dispatches shubox:retry:attempt event', () => {
      const dispatchSpy = vi.spyOn(element, 'dispatchEvent');

      handler.dispatchRetryEvent(1, 1000);

      expect(dispatchSpy).toHaveBeenCalled();
      const event = dispatchSpy.mock.calls[0][0] as CustomEvent;
      expect(event.type).toBe('shubox:retry:attempt');
      expect(event.detail.attempt).toBe(1);
      expect(event.detail.delay).toBe(1000);
    });
  });
});
