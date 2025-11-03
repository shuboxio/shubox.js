/**
 * @vitest-environment jsdom
 */
import Shubox from '../src/shubox/core/Shubox';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { setupJsDom } from './test_helpers';
import { OfflineError } from '../src/shubox/errors';
import type Dropzone from 'dropzone';

beforeEach(async () => {
  await setupJsDom();
});

describe('shubox', () => {
  describe('.instances', () => {
    test('holds onto all instances of shubox on a page', () => {
      new Shubox('.upload');
      expect(Shubox.instances.length).to.equal(2);
    });
  });

  describe('error handling', () => {
    describe('offline detection', () => {
      test('should block upload when offline', () => {
        const shubox = new Shubox('.upload', { key: 'test-key' });
        const mockFile = {
          name: 'test.jpg',
          size: 1000,
          type: 'image/jpeg',
        } as Dropzone.DropzoneFile;

        // Mock navigator.onLine as false
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: false,
        });

        const errorCallback = vi.fn();
        shubox.callbacks.error = errorCallback;

        shubox.upload(mockFile);

        expect(errorCallback).toHaveBeenCalled();
        const error = errorCallback.mock.calls[0][1];
        expect(error).toBeInstanceOf(OfflineError);
        expect(error.message).toContain('offline');
      });

      test('should allow upload when online', () => {
        const shubox = new Shubox('.upload', { key: 'test-key' });
        const mockFile = {
          name: 'test.jpg',
          size: 1000,
          type: 'image/jpeg',
        } as Dropzone.DropzoneFile;

        // Mock navigator.onLine as true
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: true,
        });

        const errorCallback = vi.fn();
        shubox.callbacks.error = errorCallback;

        // Mock dropzone.addFile to prevent thumbnail creation which fails in JSDOM
        if (shubox.element.dropzone) {
          shubox.element.dropzone.addFile = vi.fn();
        }

        // This would normally call dropzone.addFile, which we've now mocked
        shubox.upload(mockFile);

        expect(errorCallback).not.toHaveBeenCalled();
      });
    });

    describe('configuration options', () => {
      test('should accept timeout option', () => {
        const shubox = new Shubox('.upload', {
          key: 'test-key',
          timeout: 60000,
        });

        expect(shubox.options.timeout).toBe(60000);
      });

      test('should accept retryAttempts option', () => {
        const shubox = new Shubox('.upload', {
          key: 'test-key',
          retryAttempts: 5,
        });

        expect(shubox.options.retryAttempts).toBe(5);
      });

      test('should use default values when not specified', () => {
        const shubox = new Shubox('.upload', { key: 'test-key' });

        // Options should be undefined if not specified (defaults will be applied in fetchWithRetry)
        expect(shubox.options.timeout).toBeUndefined();
        expect(shubox.options.retryAttempts).toBeUndefined();
      });
    });
  });
});
