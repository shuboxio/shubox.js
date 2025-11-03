/**
 * Base class for all Shubox errors
 */
export class ShuboxError extends Error {
  public readonly code: string;
  public readonly recoverable: boolean;
  public readonly originalError?: Error;

  constructor(message: string, code: string, recoverable: boolean = false, originalError?: Error) {
    super(message);
    this.name = 'ShuboxError';
    this.code = code;
    this.recoverable = recoverable;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Network-related errors (timeouts, connection failures, etc.)
 */
export class NetworkError extends ShuboxError {
  constructor(message: string, originalError?: Error) {
    super(message, 'NETWORK_ERROR', true, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Errors during S3 signature fetching
 */
export class SignatureError extends ShuboxError {
  constructor(message: string, recoverable: boolean = false, originalError?: Error) {
    super(message, 'SIGNATURE_ERROR', recoverable, originalError);
    this.name = 'SignatureError';
  }
}

/**
 * Errors during S3 upload
 */
export class UploadError extends ShuboxError {
  public readonly statusCode?: number;

  constructor(
    message: string,
    statusCode?: number,
    recoverable: boolean = false,
    originalError?: Error,
  ) {
    super(message, 'UPLOAD_ERROR', recoverable, originalError);
    this.name = 'UploadError';
    this.statusCode = statusCode;
  }
}

/**
 * Errors during transform polling/processing
 */
export class TransformError extends ShuboxError {
  public readonly variant: string;

  constructor(message: string, variant: string, originalError?: Error) {
    super(message, 'TRANSFORM_ERROR', false, originalError);
    this.name = 'TransformError';
    this.variant = variant;
  }
}

/**
 * File validation errors
 */
export class ValidationError extends ShuboxError {
  constructor(message: string, originalError?: Error) {
    super(message, 'VALIDATION_ERROR', false, originalError);
    this.name = 'ValidationError';
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends ShuboxError {
  constructor(message: string = 'Request timed out') {
    super(message, 'TIMEOUT_ERROR', true);
    this.name = 'TimeoutError';
  }
}

/**
 * Offline errors
 */
export class OfflineError extends ShuboxError {
  constructor(message: string = 'Cannot upload while offline') {
    super(message, 'OFFLINE_ERROR', true);
    this.name = 'OfflineError';
  }
}
