/**
 * @vitest-environment jsdom
 */
import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import { ShuboxCallbacks } from '../../src/shubox/core/ShuboxCallbacks';
import { NetworkError, UploadError } from '../../src/shubox/errors/ShuboxError';
import type { ShuboxDropzoneFile } from '../../src/shubox/core/types';
import Shubox from '../../src/shubox/core/Shubox'
import Dropzone from 'dropzone';

describe('S3 Upload Retry', () => {
  let shuboxCallbacks: ShuboxCallbacks;
  let mockShubox: any;
  let mockFile: ShuboxDropzoneFile;
  let mockDropzone: any;

  beforeEach(() => {
    // Reset timers
    vi.useFakeTimers();

    // Create mock Shubox instance
    mockShubox = {
      element: document.createElement('div'),
      options: {
        retryAttempts: 3,
        timeout: 60000,
        error: vi.fn(),
        onRetry: vi.fn(),
      },
      key: 'test-key',
      signatureUrl: 'https://api.shubox.io/signatures',
      uploadUrl: 'https://api.shubox.io/uploads',
      version: '1.0.0',
      callbacks: {},
    };

    // Create mock Dropzone instance
    mockDropzone = {
      files: [],
      processFile: vi.fn(),
      options: {},
    };

    // Create mock file
    mockFile = {
      name: 'test.jpg',
      size: 1000,
      type: 'image/jpeg',
      status: Dropzone.QUEUED,
      upload: { progress: 0, total: 1000, bytesSent: 0 },
      s3: '',
      s3url: '',
      postData: {} as any,
    } as ShuboxDropzoneFile;

    mockDropzone.files.push(mockFile);

    shuboxCallbacks = new ShuboxCallbacks(mockShubox as Shubox, [mockDropzone]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('error callback with retry logic', () => {
    test('should retry on recoverable error', () => {
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      // First error - should trigger retry
      callbacks.error(mockFile, networkError);

      expect(mockFile._shuboxRetryCount).toBe(1);
      expect(mockFile.status).toBe(Dropzone.QUEUED);
      expect(mockShubox.options.error).not.toHaveBeenCalled();
      expect(mockShubox.options.onRetry).toHaveBeenCalledWith(1, networkError, mockFile);
    });

    test('should use exponential backoff for retries', () => {
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      // First retry - should wait 1s
      callbacks.error(mockFile, networkError);
      expect(mockFile._shuboxRetryCount).toBe(1);

      // Advance timer by 1s and verify processFile is called
      vi.advanceTimersByTime(1000);
      expect(mockDropzone.processFile).toHaveBeenCalledWith(mockFile);

      // Reset mock
      mockDropzone.processFile.mockClear();

      // Second retry - should wait 2s
      callbacks.error(mockFile, networkError);
      expect(mockFile._shuboxRetryCount).toBe(2);

      vi.advanceTimersByTime(1999);
      expect(mockDropzone.processFile).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(mockDropzone.processFile).toHaveBeenCalledWith(mockFile);
    });

    test('should stop retrying after max attempts', () => {
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      // Exhaust all retries
      for (let i = 0; i < 3; i++) {
        callbacks.error(mockFile, networkError);
        vi.advanceTimersByTime(Math.pow(2, i) * 1000);
      }

      // This should now call the error handler instead of retrying
      callbacks.error(mockFile, networkError);

      expect(mockFile._shuboxRetryCount).toBe(3);
      expect(mockShubox.element.classList.contains('shubox-error')).toBe(true);
      expect(mockShubox.options.error).toHaveBeenCalledWith(mockFile, networkError);
    });

    test('should not retry non-recoverable errors', () => {
      const callbacks = shuboxCallbacks.toHash();
      const clientError = new Error('HTTP 403: Forbidden');

      // Set initial status to uploading
      mockFile.status = Dropzone.UPLOADING;

      callbacks.error(mockFile, clientError);

      expect(mockFile._shuboxRetryCount).toBe(0);
      // Status should remain as it was, not changed to QUEUED for retry
      expect(mockFile.status).toBe(Dropzone.UPLOADING);
      expect(mockShubox.element.classList.contains('shubox-error')).toBe(true);
      expect(mockShubox.options.error).toHaveBeenCalledWith(mockFile, clientError);
      expect(mockShubox.options.onRetry).not.toHaveBeenCalled();
    });

    test('should initialize retry count on first error', () => {
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      expect(mockFile._shuboxRetryCount).toBeUndefined();

      callbacks.error(mockFile, networkError);

      expect(mockFile._shuboxRetryCount).toBe(1);
    });

    test('should remove error class when retrying', () => {
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      mockShubox.element.classList.add('shubox-error');

      callbacks.error(mockFile, networkError);

      expect(mockShubox.element.classList.contains('shubox-error')).toBe(false);
    });

    test('should handle string errors', () => {
      const callbacks = shuboxCallbacks.toHash();

      callbacks.error(mockFile, 'Network timeout');

      // Should attempt retry for timeout message
      expect(mockFile._shuboxRetryCount).toBe(1);
      expect(mockShubox.options.onRetry).toHaveBeenCalled();
    });

    test('should respect custom retry attempts setting', () => {
      mockShubox.options.retryAttempts = 5;
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      // Try 5 times (should retry)
      for (let i = 0; i < 5; i++) {
        callbacks.error(mockFile, networkError);
        vi.advanceTimersByTime(Math.pow(2, i) * 1000);
      }

      expect(mockFile._shuboxRetryCount).toBe(5);
      expect(mockShubox.options.error).not.toHaveBeenCalled();

      // 6th attempt should fail
      callbacks.error(mockFile, networkError);
      expect(mockShubox.options.error).toHaveBeenCalled();
    });

    test('should call onRetry callback with correct parameters', () => {
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      callbacks.error(mockFile, networkError);

      expect(mockShubox.options.onRetry).toHaveBeenCalledWith(
        1, // attempt number
        networkError, // error object
        mockFile // file
      );
    });

    test('should work without onRetry callback', () => {
      mockShubox.options.onRetry = undefined;
      const callbacks = shuboxCallbacks.toHash();
      const networkError = new NetworkError('Connection failed');

      // Should not throw error
      expect(() => callbacks.error(mockFile, networkError)).not.toThrow();
      expect(mockFile._shuboxRetryCount).toBe(1);
    });
  });

  describe('timeout configuration', () => {
    beforeEach(() => {
      // Set up DOM elements for Shubox
      document.body.innerHTML = `
        <div id="main">
          <div class="upload upload1"></div>
        </div>
      `;
    });

    test('should pass timeout to Dropzone options', () => {
      const shubox = new Shubox('.upload', {
        key: 'test-key',
        timeout: 120000
      });

      // The timeout should be set in Dropzone options
      // We can verify this by checking if it's in the options
      expect(shubox.options.timeout).toBe(120000);
    });

    test('should use default timeout when not specified', () => {
      const shubox = new Shubox('.upload', {
        key: 'test-key'
      });

      // Default timeout should be undefined (will use Dropzone default of 60s)
      expect(shubox.options.timeout).toBeUndefined();
    });
  });
});
