import { NetworkError, TimeoutError } from '../errors/ShuboxError';

export interface FetchWithRetryOptions {
  retryAttempts?: number;
  timeout?: number;
  retryDelay?: (attempt: number) => number;
}

/**
 * Default retry delay using exponential backoff
 * Attempt 1: 1000ms, Attempt 2: 2000ms, Attempt 3: 4000ms
 */
function defaultRetryDelay(attempt: number): number {
  return Math.pow(2, attempt) * 1000;
}

/**
 * Determines if an HTTP status code should be retried
 * Retry on 5xx (server errors) and 429 (rate limit)
 * Don't retry on 4xx (client errors like bad auth, invalid request)
 */
function shouldRetryStatus(status: number): boolean {
  return status >= 500 || status === 429;
}

/**
 * Fetches a URL with automatic retry logic and timeout support
 *
 * @param url - The URL to fetch
 * @param init - Fetch init options
 * @param options - Retry configuration options
 * @returns Promise that resolves to the Response
 * @throws NetworkError for network failures after retries exhausted
 * @throws TimeoutError if request times out
 * @throws Error for non-retryable errors (4xx responses)
 */
export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const { retryAttempts = 3, timeout = 30000, retryDelay = defaultRetryDelay } = options;

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < retryAttempts; attempt++) {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Merge the timeout signal with any existing signal
      const signal = init.signal
        ? mergeSignals([init.signal, controller.signal])
        : controller.signal;

      try {
        const response = await fetch(url, {
          ...init,
          signal,
        });

        clearTimeout(timeoutId);

        // Check if response is ok (status 200-299)
        if (!response.ok) {
          // For 4xx errors (client errors), don't retry
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          // For 5xx errors (server errors) or 429 (rate limit), retry if we have attempts left
          if (shouldRetryStatus(response.status) && attempt < retryAttempts - 1) {
            const retryMessage =
              response.status === 429
                ? 'Rate limit reached. Retrying...'
                : 'Shubox service temporarily unavailable. Retrying...';
            lastError = new Error(retryMessage);
            // Wait before retrying
            await delay(retryDelay(attempt));
            continue;
          }

          // No more retries, throw error
          const finalMessage =
            response.status === 429
              ? 'Rate limit exceeded. Please try again later.'
              : response.status >= 500
                ? 'Shubox service is unavailable. Please try again later.'
                : `Upload failed: ${response.statusText}`;

          throw new NetworkError(finalMessage, new Error(response.statusText));
        }

        // Success!
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error: unknown) {
      const err = error as Error;

      // Handle timeout
      if (err.name === 'AbortError') {
        if (attempt < retryAttempts - 1) {
          lastError = new TimeoutError('Request timed out. Retrying...');
          await delay(retryDelay(attempt));
          continue;
        }
        throw new TimeoutError('Upload timed out. Please check your connection and try again.');
      }

      // Handle network errors (connection refused, DNS failure, etc.)
      if (
        err.message.includes('fetch') ||
        err.message.includes('network') ||
        err.name === 'TypeError'
      ) {
        if (attempt < retryAttempts - 1) {
          lastError = err;
          await delay(retryDelay(attempt));
          continue;
        }
        throw new NetworkError(
          'Upload failed due to network error. Please check your connection and try again.',
          err,
        );
      }

      // For other errors (like 4xx), throw immediately
      throw err;
    }
  }

  // Should never reach here, but just in case
  throw new NetworkError('Request failed after retries', lastError);
}

/**
 * Helper to delay execution
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Merges multiple AbortSignals into one
 * The merged signal will abort when any of the source signals abort
 */
function mergeSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort();
      break;
    }
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  return controller.signal;
}

/**
 * Validates JSON response and handles parsing errors
 *
 * @param response - The response to parse
 * @returns Promise that resolves to the parsed JSON
 * @throws Error if JSON parsing fails
 */
export async function parseJsonResponse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new Error(
      `Failed to parse JSON response: ${error instanceof Error ? error.message : 'unknown error'}`,
    );
  }
}
