import type { ShuboxApiClient } from '~/shubox/api/client'
import type { ITransformResult } from '~/shubox/config/types'

export interface ITransformPollerOptions {
  maxAttempts?: number
  interval?: number
}

export class TransformPoller {
  private attempts = 0
  private maxAttempts: number
  private interval: number

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

  async start(): Promise<ITransformResult> {
    return this.poll()
  }

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

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
