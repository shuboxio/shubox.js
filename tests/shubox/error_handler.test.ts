/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxErrorHandler } from '../../src/shubox/errors/ErrorHandler';
import { NetworkError, TimeoutError, OfflineError, UploadError } from '../../src/shubox/errors/ShuboxError';
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

    test('isRecoverableError returns true for timeout errors in message', () => {
      const error = new Error('Request timed out');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for connection errors in message', () => {
      const error = new Error('Network connection failed');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for 5xx server errors', () => {
      const error = new UploadError('Server error', 500, true);
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for 503 service unavailable in message', () => {
      const error = new Error('HTTP 503: Service Unavailable');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns true for 429 rate limit in message', () => {
      const error = new Error('HTTP 429: Too Many Requests');
      expect(handler.isRecoverableError(error)).toBe(true);
    });

    test('isRecoverableError returns false for 4xx client errors', () => {
      const error = new UploadError('Bad request', 400);
      expect(handler.isRecoverableError(error)).toBe(false);
    });

    test('isRecoverableError returns false for 401 unauthorized in message', () => {
      const error = new Error('HTTP 401: Unauthorized');
      expect(handler.isRecoverableError(error)).toBe(false);
    });

    test('isRecoverableError returns false for 403 forbidden in message', () => {
      const error = new Error('HTTP 403: Forbidden');
      expect(handler.isRecoverableError(error)).toBe(false);
    });

    test('isRecoverableError returns false for 404 not found in message', () => {
      const error = new Error('HTTP 404: Not Found');
      expect(handler.isRecoverableError(error)).toBe(false);
    });

    test('isRecoverableError returns false for validation errors', () => {
      const error = new Error('File type not allowed');
      expect(handler.isRecoverableError(error)).toBe(false);
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
