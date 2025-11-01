import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TransformPoller } from '~/shubox/handlers/transform_poller'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IApiClientConfig } from '~/shubox/config/types'

describe('TransformPoller', () => {
  let poller: TransformPoller
  let mockApiClient: ShuboxApiClient

  beforeEach(() => {
    vi.useFakeTimers()

    const config: IApiClientConfig = {
      baseUrl: 'https://api.shubox.io',
      key: 'test-key'
    }
    mockApiClient = new ShuboxApiClient(config)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('polls transform endpoint until ready', async () => {
    vi.spyOn(mockApiClient, 'pollTransform')
      .mockResolvedValueOnce({ s3url: 'https://example.com/file.jpg', ready: false })
      .mockResolvedValueOnce({ s3url: 'https://example.com/file.jpg', ready: true })

    poller = new TransformPoller(mockApiClient, 'upload-123', '200x200#', vi.fn())

    const pollPromise = poller.start()

    await vi.advanceTimersByTimeAsync(1000)
    await vi.advanceTimersByTimeAsync(1000)

    const result = await pollPromise

    expect(mockApiClient.pollTransform).toHaveBeenCalledTimes(2)
    expect(result.ready).toBe(true)
  })

  it('calls callback when transform is ready', async () => {
    const callback = vi.fn()

    vi.spyOn(mockApiClient, 'pollTransform')
      .mockResolvedValue({ s3url: 'https://example.com/file.jpg', ready: true })

    poller = new TransformPoller(mockApiClient, 'upload-123', '200x200#', callback)

    await poller.start()

    expect(callback).toHaveBeenCalledWith({ s3url: 'https://example.com/file.jpg', ready: true })
  })

  it('stops polling after max attempts', async () => {
    vi.spyOn(mockApiClient, 'pollTransform')
      .mockResolvedValue({ s3url: 'https://example.com/file.jpg', ready: false })

    poller = new TransformPoller(mockApiClient, 'upload-123', '200x200#', vi.fn(), {
      maxAttempts: 3,
      interval: 1000
    })

    // Start polling and set up the rejection handler first
    const pollPromise = expect(poller.start()).rejects.toThrow('Transform polling exceeded max attempts')

    // Advance timers to let polling complete
    await vi.advanceTimersByTimeAsync(1000)
    await vi.advanceTimersByTimeAsync(1000)
    await vi.advanceTimersByTimeAsync(1000)

    // Wait for the promise to reject
    await pollPromise
  })
})
