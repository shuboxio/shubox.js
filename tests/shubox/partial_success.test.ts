import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { TransformCallback } from '../../src/shubox/transform_callback';
import { uploadCompleteEvent } from '../../src/shubox/upload_complete_event';
import { TransformError } from '../../src/shubox/errors';
import type { IShuboxFile } from '../../src/shubox/types';

describe('Partial Success Handling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Transform failures', () => {
    it('should call error callback when transform fails after retries', async () => {
      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
      } as IShuboxFile;

      const errorCallback = vi.fn();
      const successCallback = vi.fn();

      // Mock fetch to always fail (404)
      global.fetch = vi.fn().mockResolvedValue(
        new Response('Not Found', { status: 404 })
      );

      const transformCallback = new TransformCallback(
        mockFile,
        '200x200#',
        successCallback,
        1.0,
        true,
        errorCallback
      );

      // Start the transform polling
      transformCallback.run();

      // Fast-forward through all 10 retries
      for (let i = 0; i < 10; i++) {
        await vi.runOnlyPendingTimersAsync();
      }

      // Error callback should be called with TransformError
      expect(errorCallback).toHaveBeenCalled();
      const error = errorCallback.mock.calls[0][1];
      expect(error).toBeInstanceOf(TransformError);
      expect(error.message).toContain('Image processing failed for variant');
      expect(error.message).toContain('Original file uploaded successfully');
      expect(error.variant).toBe('200x200#');

      // Success callback should NOT be called
      expect(successCallback).not.toHaveBeenCalled();
    });

    it('should eventually succeed on transform after temporary failures', async () => {
      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
      } as IShuboxFile;

      const errorCallback = vi.fn();
      const successCallback = vi.fn();

      // Mock fetch to fail twice, then succeed
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce(new Response('Not Found', { status: 404 }))
        .mockResolvedValueOnce(new Response('Not Found', { status: 404 }))
        .mockResolvedValue(new Response('OK', { status: 200 }));

      const transformCallback = new TransformCallback(
        mockFile,
        '200x200#',
        successCallback,
        1.0,
        true,
        errorCallback
      );

      transformCallback.run();

      // Fast-forward through retries until success
      await vi.runOnlyPendingTimersAsync();
      await vi.runOnlyPendingTimersAsync();
      await vi.runOnlyPendingTimersAsync();

      // Success callback should be called
      expect(successCallback).toHaveBeenCalledWith(mockFile);
      expect(mockFile.transform).toBeDefined();

      // Error callback should NOT be called
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it('should report specific variant that failed', async () => {
      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
      } as IShuboxFile;

      const errorCallback = vi.fn();

      global.fetch = vi.fn().mockResolvedValue(
        new Response('Not Found', { status: 404 })
      );

      const transformCallback = new TransformCallback(
        mockFile,
        '400x400#.webp',
        vi.fn(),
        1.0,
        true,
        errorCallback
      );

      transformCallback.run();

      for (let i = 0; i < 10; i++) {
        await vi.runOnlyPendingTimersAsync();
      }

      const error = errorCallback.mock.calls[0][1];
      expect(error.variant).toBe('400x400#.webp');
      expect(error.message).toContain('400x400#.webp');
    });
  });

  describe('Upload complete notification failures', () => {
    it('should not block UI when upload complete notification fails', async () => {
      const mockShubox: any = {
        uploadUrl: 'https://api.test.com/uploads',
        key: 'test-key',
        version: '1.1.0',
        options: {},
      };

      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
      } as IShuboxFile;

      // Mock fetch to fail
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      // Should not throw, should return null
      const result = await uploadCompleteEvent(mockShubox, mockFile, {});

      expect(result).toBeNull();
    });

    it('should log error when upload complete notification fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const mockShubox: any = {
        uploadUrl: 'https://api.test.com/uploads',
        key: 'test-key',
        version: '1.1.0',
        options: {},
      };

      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
      } as IShuboxFile;

      global.fetch = vi.fn().mockRejectedValue(new Error('Server error'));

      await uploadCompleteEvent(mockShubox, mockFile, {});

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Upload complete notification failed')
      );

      consoleErrorSpy.mockRestore();
    });

    it('should succeed normally when upload complete notification works', async () => {
      const mockShubox: any = {
        uploadUrl: 'https://api.test.com/uploads',
        key: 'test-key',
        version: '1.1.0',
        options: {},
      };

      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
        lastModified: Date.now(),
        lastModifiedDate: new Date(),
      } as IShuboxFile;

      const mockResponse = new Response('OK', {
        status: 200,
        headers: { 'X-Shubox-API': '1.0' },
      });

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await uploadCompleteEvent(mockShubox, mockFile, {});

      expect(result).toBe(mockResponse);
    });
  });

  describe('Mixed success scenarios', () => {
    it('should handle main upload success with transform failure', async () => {
      // This scenario is tested through integration:
      // 1. Main upload succeeds (success callback called)
      // 2. Transform polling starts
      // 3. Transform fails after retries
      // 4. Error callback called with TransformError
      // 5. User sees success for main upload, error for transform

      const mockFile: IShuboxFile = {
        name: 'test.jpg',
        size: 1000,
        type: 'image/jpeg',
        s3: 'path/to/file.jpg',
        s3url: 'https://s3.amazonaws.com/bucket/path/to/file.jpg',
        width: 800,
        height: 600,
      } as IShuboxFile;

      const errorCallback = vi.fn();

      global.fetch = vi.fn().mockResolvedValue(
        new Response('Not Found', { status: 404 })
      );

      const transformCallback = new TransformCallback(
        mockFile,
        '200x200#',
        vi.fn(),
        1.0,
        true,
        errorCallback
      );

      transformCallback.run();

      for (let i = 0; i < 10; i++) {
        await vi.runOnlyPendingTimersAsync();
      }

      // Verify error message mentions original file succeeded
      const error = errorCallback.mock.calls[0][1];
      expect(error.message).toContain('Original file uploaded successfully');
    });
  });
});
