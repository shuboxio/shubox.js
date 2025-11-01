import { describe, it, expect, vi, beforeEach } from 'vitest'
import { S3SignatureHandler } from '~/shubox/handlers/signature'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IApiClientConfig, IDropzoneFile } from '~/shubox/config/types'

describe('S3SignatureHandler', () => {
  let handler: S3SignatureHandler
  let mockApiClient: ShuboxApiClient
  let mockFile: IDropzoneFile
  let mockDone: any

  beforeEach(() => {
    const config: IApiClientConfig = {
      baseUrl: 'https://api.shubox.io',
      key: 'test-key'
    }
    mockApiClient = new ShuboxApiClient(config)

    handler = new S3SignatureHandler(mockApiClient, {
      key: 'test-key',
      s3Key: 'uploads/{{timestamp}}-{{name}}'
    })

    mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg'
    } as IDropzoneFile

    mockDone = vi.fn()
  })

  it('fetches signature and calls done callback', async () => {
    const mockSignature = {
      endpoint: 'https://s3.amazonaws.com/bucket',
      signature: 'sig123',
      policy: 'pol123',
      key: 'uploads/test.jpg'
    }

    vi.spyOn(mockApiClient, 'fetchSignature').mockResolvedValue(mockSignature)

    await handler.handle(mockFile, mockDone)

    expect(mockApiClient.fetchSignature).toHaveBeenCalledWith(
      mockFile,
      expect.objectContaining({
        key: 'test-key'
      })
    )
    expect(mockDone).toHaveBeenCalled()
  })

  it('calls done with error message on failure', async () => {
    const error = new Error('Signature fetch failed')
    vi.spyOn(mockApiClient, 'fetchSignature').mockRejectedValue(error)

    await handler.handle(mockFile, mockDone)

    expect(mockDone).toHaveBeenCalledWith('Signature fetch failed')
  })
})
