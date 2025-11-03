/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShuboxCallbacks } from '../../src/shubox/core/ShuboxCallbacks';
import type { ShuboxDropzoneFile } from '../../src/shubox/core/types';
import Dropzone from 'dropzone';

describe('Resource Cleanup', () => {
  let mockShubox: any;
  let callbacks: ShuboxCallbacks;
  let mockFile: ShuboxDropzoneFile;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.classList.add('shubox');

    mockShubox = {
      element: mockElement,
      key: 'test-key',
      signatureUrl: 'https://api.test.com/signatures',
      uploadUrl: 'https://api.test.com/uploads',
      version: '1.1.0',
      options: {},
      callbacks: {},
    };

    callbacks = new ShuboxCallbacks(mockShubox, []);

    mockFile = {
      name: 'test.jpg',
      size: 1000,
      type: 'image/jpeg',
      status: Dropzone.QUEUED,
      upload: { progress: 0, total: 1000, bytesSent: 0 },
    } as ShuboxDropzoneFile;
  });

  describe('canceled callback', () => {
    it('should clean up resources when upload is canceled', () => {
      // Set up file with retry data
      mockFile._shuboxRetryCount = 2;
      mockFile._shuboxRetryTimeout = setTimeout(() => {}, 1000);
      mockElement.classList.add('shubox-uploading', 'shubox-error');
      mockElement.dataset.shuboxProgress = '50';

      const callbackHash = callbacks.toHash();
      callbackHash.canceled(mockFile);

      // Verify cleanup
      expect(mockFile._shuboxRetryCount).toBeUndefined();
      expect(mockFile._shuboxRetryTimeout).toBeUndefined();
      expect(mockElement.classList.contains('shubox-uploading')).toBe(false);
      expect(mockElement.classList.contains('shubox-error')).toBe(false);
      expect(mockElement.dataset.shuboxProgress).toBeUndefined();
    });

    it('should call user canceled callback if provided', () => {
      const userCallback = vi.fn();
      mockShubox.options.canceled = userCallback;

      const callbackHash = callbacks.toHash();
      callbackHash.canceled(mockFile);

      expect(userCallback).toHaveBeenCalledWith(mockFile);
    });

    it('should clear pending retry timeout', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const timeoutId = setTimeout(() => {}, 5000);
      mockFile._shuboxRetryTimeout = timeoutId;

      const callbackHash = callbacks.toHash();
      callbackHash.canceled(mockFile);

      expect(clearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('removedfile callback', () => {
    it('should clean up resources when file is removed', () => {
      // Mock Dropzone's default removedfile to avoid calling internal methods
      const originalRemovedfile = Dropzone.prototype.defaultOptions.removedfile;
      Dropzone.prototype.defaultOptions.removedfile = vi.fn();

      mockFile._shuboxRetryCount = 3;
      mockElement.classList.add('shubox-uploading');
      mockElement.dataset.shuboxProgress = '75';

      const callbackHash = callbacks.toHash();
      callbackHash.removedfile(mockFile);

      expect(mockFile._shuboxRetryCount).toBeUndefined();
      expect(mockElement.classList.contains('shubox-uploading')).toBe(false);
      expect(mockElement.dataset.shuboxProgress).toBeUndefined();

      // Restore original
      Dropzone.prototype.defaultOptions.removedfile = originalRemovedfile;
    });

    it('should call user removedfile callback if provided', () => {
      // Mock Dropzone's default removedfile
      const originalRemovedfile = Dropzone.prototype.defaultOptions.removedfile;
      Dropzone.prototype.defaultOptions.removedfile = vi.fn();

      const userCallback = vi.fn();
      mockShubox.options.removedfile = userCallback;

      const callbackHash = callbacks.toHash();
      callbackHash.removedfile(mockFile);

      expect(userCallback).toHaveBeenCalledWith(mockFile);

      // Restore original
      Dropzone.prototype.defaultOptions.removedfile = originalRemovedfile;
    });
  });

  describe('queuecomplete callback', () => {
    it('should remove uploading class when queue is complete', () => {
      mockElement.classList.add('shubox-uploading');

      const callbackHash = callbacks.toHash();
      callbackHash.queuecomplete();

      expect(mockElement.classList.contains('shubox-uploading')).toBe(false);
    });

    it('should call user queuecomplete callback if provided', () => {
      const userCallback = vi.fn();
      mockShubox.options.queuecomplete = userCallback;

      const callbackHash = callbacks.toHash();
      callbackHash.queuecomplete();

      expect(userCallback).toHaveBeenCalled();
    });
  });

  describe('CSS class management', () => {
    it('should properly manage CSS classes throughout upload lifecycle', () => {
      // Add postData to file for sending callback
      mockFile.postData = {
        aws_endpoint: 'https://s3.amazonaws.com',
        key: 'test-key',
        policy: 'test-policy',
        success_action_status: '201',
        acl: 'public-read',
        'x-amz-credential': 'test',
        'x-amz-algorithm': 'AWS4-HMAC-SHA256',
        'x-amz-date': '20240101',
        'x-amz-signature': 'test-signature',
      };

      const callbackHash = callbacks.toHash();

      // Initially no classes
      expect(mockElement.classList.contains('shubox-uploading')).toBe(false);
      expect(mockElement.classList.contains('shubox-success')).toBe(false);
      expect(mockElement.classList.contains('shubox-error')).toBe(false);

      // During upload
      callbackHash.sending(mockFile, new XMLHttpRequest(), new FormData());
      expect(mockElement.classList.contains('shubox-uploading')).toBe(true);

      // Note: Testing success callback is complex due to uploadCompleteEvent async behavior
      // We'll just verify the class was added during sending
    });

    it('should clean up CSS classes on cancel', () => {
      mockElement.classList.add('shubox-uploading', 'shubox-error');

      const callbackHash = callbacks.toHash();
      callbackHash.canceled(mockFile);

      expect(mockElement.classList.contains('shubox-uploading')).toBe(false);
      expect(mockElement.classList.contains('shubox-error')).toBe(false);
    });
  });

  describe('progress data attribute', () => {
    it('should set progress during upload', () => {
      const callbackHash = callbacks.toHash();
      callbackHash.uploadProgress(mockFile, 42, 420);

      expect(mockElement.dataset.shuboxProgress).toBe('42');
    });

    it('should remove progress on cleanup', () => {
      mockElement.dataset.shuboxProgress = '50';

      const callbackHash = callbacks.toHash();
      callbackHash.canceled(mockFile);

      expect(mockElement.dataset.shuboxProgress).toBeUndefined();
    });
  });
});
