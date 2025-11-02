/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { ShuboxResourceManager } from '../../src/shubox/resource_manager';
import { setupJsDom } from '../test_helpers';

describe('ShuboxResourceManager', () => {
  let element: HTMLElement;
  let manager: ShuboxResourceManager;

  beforeEach(async () => {
    await setupJsDom();
    element = document.createElement('form');
    document.body.appendChild(element);
    manager = new ShuboxResourceManager(element);
  });

  describe('cleanup', () => {
    test('cleanupFile clears retry timeout', () => {
      const file: any = {
        _shuboxRetryTimeout: setTimeout(() => {}, 5000),
        _shuboxRetryCount: 2,
      };

      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      manager.cleanupFile(file);

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(file._shuboxRetryTimeout).toBeUndefined();
    });

    test('cleanupFile resets retry count', () => {
      const file: any = {
        _shuboxRetryCount: 3,
      };

      manager.cleanupFile(file);

      expect(file._shuboxRetryCount).toBeUndefined();
    });

    test('cleanupFile removes error class', () => {
      element.classList.add('shubox-error');

      const file: any = {};
      manager.cleanupFile(file);

      expect(element.classList.contains('shubox-error')).toBe(false);
    });
  });

  describe('progress tracking', () => {
    test('resetProgress clears progress data attribute', () => {
      element.dataset.shuboxProgress = '50';

      const file: any = {};
      manager.resetProgress(file);

      expect(element.dataset.shuboxProgress).toBeUndefined();
    });
  });

  describe('lifecycle callbacks', () => {
    test('onFileCanceled cleans up file', () => {
      const file: any = {
        _shuboxRetryTimeout: setTimeout(() => {}, 5000),
      };

      const cleanupSpy = vi.spyOn(manager, 'cleanupFile');
      manager.onFileCanceled(file);

      expect(cleanupSpy).toHaveBeenCalledWith(file);
    });

    test('onFileRemoved cleans up file', () => {
      const file: any = {
        _shuboxRetryTimeout: setTimeout(() => {}, 5000),
      };

      const cleanupSpy = vi.spyOn(manager, 'cleanupFile');
      manager.onFileRemoved(file);

      expect(cleanupSpy).toHaveBeenCalledWith(file);
    });
  });
});
