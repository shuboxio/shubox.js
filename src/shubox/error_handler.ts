// src/shubox/error_handler.ts
import Dropzone from 'dropzone';
import {
  NetworkError,
  TimeoutError,
  OfflineError,
  ShuboxError,
} from './errors';
import { dispatchShuboxEvent } from './events';

export class ShuboxErrorHandler {
  constructor(private element: HTMLElement) {}

  isRecoverableError(error: Error): boolean {
    return (
      error instanceof NetworkError ||
      error instanceof TimeoutError ||
      error instanceof OfflineError
    );
  }

  calculateBackoffDelay(attemptNumber: number): number {
    return Math.pow(2, attemptNumber - 1) * 1000;
  }

  dispatchErrorEvent(error: Error): void {
    const detail =
      error instanceof ShuboxError
        ? {
            code: error.code,
            message: error.message,
          }
        : { message: error.message };

    dispatchShuboxEvent(this.element, 'shubox:error', detail);
  }

  dispatchTimeoutEvent(): void {
    dispatchShuboxEvent(this.element, 'shubox:timeout', {});
  }

  dispatchRetryEvent(attemptNumber: number, delay: number): void {
    dispatchShuboxEvent(this.element, 'shubox:retry:attempt', {
      attempt: attemptNumber,
      delay,
    });
  }

  dispatchRecoveredEvent(): void {
    dispatchShuboxEvent(this.element, 'shubox:recovered', {});
  }
}
