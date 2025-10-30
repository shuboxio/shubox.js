import type { ShuboxDropzoneFile } from "./types";

/**
 * Event detail for shubox:error events
 */
export interface ShuboxErrorEventDetail {
  error: Error;
  file: ShuboxDropzoneFile;
}

/**
 * Event detail for shubox:retry:start events
 */
export interface ShuboxRetryStartEventDetail {
  error: Error;
  file: ShuboxDropzoneFile;
  maxRetries: number;
}

/**
 * Event detail for shubox:retry:attempt events
 */
export interface ShuboxRetryAttemptEventDetail {
  error: Error;
  file: ShuboxDropzoneFile;
  attempt: number;
  maxRetries: number;
  delay: number;
}

/**
 * Event detail for shubox:recovered events
 */
export interface ShuboxRecoveredEventDetail {
  file: ShuboxDropzoneFile;
  attemptCount: number;
}

/**
 * Event detail for shubox:timeout events
 */
export interface ShuboxTimeoutEventDetail {
  file: ShuboxDropzoneFile;
  timeout: number;
}

/**
 * Dispatches a custom Shubox event on an element
 * @param element - The element to dispatch the event on
 * @param eventName - The name of the event (e.g., 'shubox:error')
 * @param detail - The event detail data
 */
export function dispatchShuboxEvent<T>(
  element: HTMLElement,
  eventName: string,
  detail: T
): void {
  const event = new CustomEvent(eventName, {
    detail,
    bubbles: true,
    cancelable: true,
  });
  element.dispatchEvent(event);
}
