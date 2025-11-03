import { describe, it, expect } from 'vitest';
import {
  ShuboxError,
  NetworkError,
  SignatureError,
  UploadError,
  TransformError,
  ValidationError,
  TimeoutError,
  OfflineError,
} from '../../src/shubox/errors/ShuboxError';

describe('ShuboxError', () => {
  it('should create a base error with all properties', () => {
    const originalError = new Error('Original error');
    const error = new ShuboxError('Test error', 'TEST_CODE', true, originalError);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.recoverable).toBe(true);
    expect(error.originalError).toBe(originalError);
    expect(error.name).toBe('ShuboxError');
  });

  it('should default recoverable to false', () => {
    const error = new ShuboxError('Test error', 'TEST_CODE');
    expect(error.recoverable).toBe(false);
  });

  it('should have proper stack trace', () => {
    const error = new ShuboxError('Test error', 'TEST_CODE');
    expect(error.stack).toBeDefined();
  });
});

describe('NetworkError', () => {
  it('should create a network error', () => {
    const originalError = new Error('Network failed');
    const error = new NetworkError('Network request failed', originalError);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(NetworkError);
    expect(error.message).toBe('Network request failed');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.recoverable).toBe(true);
    expect(error.originalError).toBe(originalError);
    expect(error.name).toBe('NetworkError');
  });

  it('should work without original error', () => {
    const error = new NetworkError('Network request failed');
    expect(error.originalError).toBeUndefined();
  });
});

describe('SignatureError', () => {
  it('should create a signature error', () => {
    const error = new SignatureError('Signature fetch failed', false);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(SignatureError);
    expect(error.message).toBe('Signature fetch failed');
    expect(error.code).toBe('SIGNATURE_ERROR');
    expect(error.recoverable).toBe(false);
    expect(error.name).toBe('SignatureError');
  });

  it('should allow recoverable signatures errors', () => {
    const error = new SignatureError('Temporary failure', true);
    expect(error.recoverable).toBe(true);
  });
});

describe('UploadError', () => {
  it('should create an upload error with status code', () => {
    const error = new UploadError('Upload failed', 500, true);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(UploadError);
    expect(error.message).toBe('Upload failed');
    expect(error.code).toBe('UPLOAD_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.recoverable).toBe(true);
    expect(error.name).toBe('UploadError');
  });

  it('should work without status code', () => {
    const error = new UploadError('Upload failed');
    expect(error.statusCode).toBeUndefined();
  });
});

describe('TransformError', () => {
  it('should create a transform error with variant', () => {
    const error = new TransformError('Transform failed', '200x200#');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(TransformError);
    expect(error.message).toBe('Transform failed');
    expect(error.code).toBe('TRANSFORM_ERROR');
    expect(error.variant).toBe('200x200#');
    expect(error.recoverable).toBe(false);
    expect(error.name).toBe('TransformError');
  });

  it('should include original error', () => {
    const originalError = new Error('HTTP 500');
    const error = new TransformError('Transform failed', '200x200#', originalError);
    expect(error.originalError).toBe(originalError);
  });
});

describe('ValidationError', () => {
  it('should create a validation error', () => {
    const error = new ValidationError('File type not allowed');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('File type not allowed');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.recoverable).toBe(false);
    expect(error.name).toBe('ValidationError');
  });
});

describe('TimeoutError', () => {
  it('should create a timeout error with default message', () => {
    const error = new TimeoutError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(TimeoutError);
    expect(error.message).toBe('Request timed out');
    expect(error.code).toBe('TIMEOUT_ERROR');
    expect(error.name).toBe('TimeoutError');
    expect(error.recoverable).toBe(true);
  });

  it('should allow custom message', () => {
    const error = new TimeoutError('Upload timed out after 30s');
    expect(error.message).toBe('Upload timed out after 30s');
  });
});

describe('OfflineError', () => {
  it('should create an offline error with default message', () => {
    const error = new OfflineError();

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ShuboxError);
    expect(error).toBeInstanceOf(OfflineError);
    expect(error.message).toBe('Cannot upload while offline');
    expect(error.code).toBe('OFFLINE_ERROR');
    expect(error.recoverable).toBe(true);
    expect(error.name).toBe('OfflineError');
  });

  it('should allow custom message', () => {
    const error = new OfflineError('No internet connection detected');
    expect(error.message).toBe('No internet connection detected');
  });
});

describe('Error instanceof checks', () => {
  it('should allow checking error types with instanceof', () => {
    const networkError = new NetworkError('Network failed');
    const timeoutError = new TimeoutError();
    const offlineError = new OfflineError();
    const transformError = new TransformError('Transform failed', '200x200#');

    // All errors are instances of base classes
    expect(networkError instanceof ShuboxError).toBe(true);
    expect(networkError instanceof Error).toBe(true);

    // Specific type checks
    expect(networkError instanceof NetworkError).toBe(true);
    expect(networkError instanceof TimeoutError).toBe(false);

    // Timeout and Offline extend ShuboxError directly (not NetworkError)
    expect(timeoutError instanceof ShuboxError).toBe(true);
    expect(timeoutError instanceof NetworkError).toBe(false);
    expect(offlineError instanceof ShuboxError).toBe(true);
    expect(offlineError instanceof NetworkError).toBe(false);

    // Transform is not a network error
    expect(transformError instanceof NetworkError).toBe(false);
    expect(transformError instanceof TransformError).toBe(true);
  });
});
