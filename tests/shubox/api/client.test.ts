import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IApiClientConfig } from '~/shubox/config/types'

describe('ShuboxApiClient', () => {
  let client: ShuboxApiClient
  let mockFetch: any

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch

    const config: IApiClientConfig = {
      baseUrl: 'https://api.shubox.io',
      key: 'test-key'
    }
    client = new ShuboxApiClient(config)
  })

  describe('fetchSignature', () => {
    it('posts to signature endpoint with file metadata', async () => {
      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })
      const mockResponse = {
        endpoint: 'https://s3.amazonaws.com/bucket',
        signature: 'sig123',
        policy: 'pol123',
        key: 'uploads/test.jpg'
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await client.fetchSignature(mockFile, {
        key: 'test-key',
        s3Key: 'uploads/test.jpg'
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.shubox.io/signatures',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      )
      expect(result).toEqual(mockResponse)
    })

    it('throws error on failed request', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      const mockFile = new File(['content'], 'test.jpg', { type: 'image/jpeg' })

      await expect(
        client.fetchSignature(mockFile, { key: 'test-key' })
      ).rejects.toThrow('Failed to fetch signature: 401 Unauthorized')
    })
  })

  describe('pollTransform', () => {
    it('polls upload endpoint for transform status', async () => {
      const mockResponse = {
        s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
        ready: true
      }

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      })

      const result = await client.pollTransform('upload-123', '200x200#')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.shubox.io/uploads/upload-123?transform=200x200%23'
      )
      expect(result).toEqual(mockResponse)
    })
  })
})
