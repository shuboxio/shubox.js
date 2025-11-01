import type { ShuboxApiClient } from '~/shubox/api/client'
import type { ITransformResult } from '~/shubox/config/types'

export interface ITransformPollerOptions {
  maxAttempts?: number
  interval?: number
}

/**
 * Polls the Shubox API for image/video transform completion.
 * Repeatedly checks if server-side transforms (resize, crop, format conversion)
 * are ready and invokes a callback when complete.
 */
export class TransformPoller {
  private attempts = 0
  private maxAttempts: number
  private interval: number

  /**
   * Creates a new TransformPoller instance.
   * @param apiClient - Shubox API client for polling requests
   * @param uploadId - Unique identifier for the upload
   * @param transform - Transform string (e.g., "200x200#" for crop, ".webp" for format)
   * @param callback - Callback to invoke when transform is ready
   * @param options - Polling options including maxAttempts and interval
   */
  constructor(
    private apiClient: ShuboxApiClient,
    private uploadId: string,
    private transform: string,
    private callback: (result: ITransformResult) => void,
    options: ITransformPollerOptions = {}
  ) {
    this.maxAttempts = options.maxAttempts || 30
    this.interval = options.interval || 1000
  }

  /**
   * Starts polling for transform completion.
   * Polls at configured interval until transform is ready or max attempts reached.
   * @returns Promise resolving to transform result when ready
   * @throws Error if max polling attempts exceeded
   */
  async start(): Promise<ITransformResult> {
    return this.poll()
  }

  /**
   * Internal polling method that recursively checks transform status.
   * @private
   */
  private async poll(): Promise<ITransformResult> {
    if (this.attempts >= this.maxAttempts) {
      throw new Error('Transform polling exceeded max attempts')
    }

    this.attempts++

    const result = await this.apiClient.pollTransform(this.uploadId, this.transform)

    if (result.ready) {
      this.callback(result)
      return result
    }

    await this.wait(this.interval)
    return this.poll()
  }

  /**
   * Waits for specified milliseconds before next poll attempt.
   * @private
   */
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
