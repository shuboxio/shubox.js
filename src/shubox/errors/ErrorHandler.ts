// src/shubox/errors/ErrorHandler.ts
import Dropzone from 'dropzone';

import { dispatchShuboxEvent } from '../events/dispatchEvent';

import { NetworkError, TimeoutError, OfflineError, ShuboxError, UploadError } from './ShuboxError';

export class ShuboxErrorHandler {
  constructor(private element: HTMLElement) {}

  isRecoverableError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();

    // Network errors are recoverable
    if (error instanceof NetworkError) {
      return true;
    }

    // Timeout errors are recoverable (they might succeed on retry)
    if (error instanceof TimeoutError) {
      return true;
    }

    // Offline errors are recoverable
    if (error instanceof OfflineError) {
      return true;
    }

    // Timeout errors in message
    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return true;
    }

    // Connection errors are recoverable
    if (
      errorMessage.includes('network') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('fetch')
    ) {
      return true;
    }

    // 5xx server errors are recoverable (server might recover)
    if (error instanceof UploadError && error.statusCode && error.statusCode >= 500) {
      return true;
    }

    // HTTP 5xx errors in message
    if (errorMessage.match(/http 5\d{2}/)) {
      return true;
    }

    // 429 rate limit errors are recoverable
    if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
      return true;
    }

    // Service unavailable, bad gateway, gateway timeout
    if (
      errorMessage.includes('503') ||
      errorMessage.includes('502') ||
      errorMessage.includes('504') ||
      errorMessage.includes('service unavailable') ||
      errorMessage.includes('bad gateway') ||
      errorMessage.includes('gateway timeout')
    ) {
      return true;
    }

    // All other errors (4xx, validation errors, etc.) are not recoverable
    return false;
  }

  calculateBackoffDelay(attemptNumber: number): number {
    return Math.pow(2, attemptNumber - 1) * 1000;
  }

  dispatchErrorEvent(error: Error, file?: any): void {
    const detail: any = {
      error,
      message: error.message,
    };

    if (error instanceof ShuboxError) {
      detail.code = error.code;
    }

    if (file) {
      detail.file = file;
    }

    dispatchShuboxEvent(this.element, 'shubox:error', detail);
  }

  dispatchTimeoutEvent(file?: any, timeout?: number): void {
    const detail: any = {};
    if (file) {
      detail.file = file;
    }
    if (timeout) {
      detail.timeout = timeout;
    }
    dispatchShuboxEvent(this.element, 'shubox:timeout', detail);
  }

  dispatchRetryEvent(
    attemptNumber: number,
    delay: number,
    error?: Error,
    file?: any,
    maxRetries?: number,
  ): void {
    const detail: any = {
      attempt: attemptNumber,
      delay,
    };
    if (error) {
      detail.error = error;
    }
    if (file) {
      detail.file = file;
    }
    if (maxRetries !== undefined) {
      detail.maxRetries = maxRetries;
    }
    dispatchShuboxEvent(this.element, 'shubox:retry:attempt', detail);
  }

  dispatchRetryStartEvent(error: Error, file: any, maxRetries: number): void {
    dispatchShuboxEvent(this.element, 'shubox:retry:start', {
      error,
      file,
      maxRetries,
    });
  }

  dispatchRecoveredEvent(file?: any, attemptCount?: number): void {
    const detail: any = {};
    if (file) {
      detail.file = file;
    }
    if (attemptCount !== undefined) {
      detail.attemptCount = attemptCount;
    }
    dispatchShuboxEvent(this.element, 'shubox:recovered', detail);
  }
}
