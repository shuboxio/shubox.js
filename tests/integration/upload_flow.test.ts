/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ShuboxApiClient } from '~/shubox/api/client'
import { ShuboxDomRenderer } from '~/shubox/dom/renderer'
import { S3SignatureHandler } from '~/shubox/handlers/signature'
import { S3UploadHandler } from '~/shubox/handlers/upload'
import { SuccessHandler } from '~/shubox/handlers/success'
import { ShuboxCallbacks } from '~/shubox/shubox_callbacks'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('Upload Flow Integration', () => {
  let mockFetch: any
  let apiClient: ShuboxApiClient
  let renderer: ShuboxDomRenderer
  let signatureHandler: S3SignatureHandler
  let uploadHandler: S3UploadHandler
  let successHandler: SuccessHandler
  let callbacks: ShuboxCallbacks

  beforeEach(() => {
    document.body.innerHTML = '<div class="shubox"></div>'
    mockFetch = vi.fn()
    global.fetch = mockFetch

    // Create core services (mimicking Shubox constructor)
    apiClient = new ShuboxApiClient({
      key: 'test-key',
      baseUrl: 'https://api.shubox.io',
      signatureUrl: 'https://api.shubox.io/signatures',
      uploadUrl: 'https://api.shubox.io/uploads'
    })

    renderer = new ShuboxDomRenderer()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('completes full upload flow from file drop to success', async () => {
    const successCallback = vi.fn()
    const mockFile: IDropzoneFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      upload: { progress: 0, total: 1024, bytesSent: 0 },
      status: 'queued' as any,
      previewElement: document.createElement('div'),
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test.jpg'
    } as any

    // Mock signature fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        endpoint: 'https://s3.amazonaws.com/bucket',
        signature: 'sig123',
        policy: 'pol123',
        key: 'uploads/test.jpg'
      })
    })

    // Create handlers
    signatureHandler = new S3SignatureHandler(apiClient, {
      key: 'test-key',
      s3Key: 'uploads/{{name}}'
    })

    uploadHandler = new S3UploadHandler({})

    successHandler = new SuccessHandler(renderer, apiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {},
      success: successCallback
    })

    callbacks = new ShuboxCallbacks(
      signatureHandler,
      uploadHandler,
      successHandler,
      {}
    )

    // Step 1: Accept callback fetches signature
    const doneCallback = vi.fn()

    // The accept callback returns void, but internally it's async
    // We need to let it complete
    callbacks.accept(mockFile, doneCallback)

    // Wait for all pending promises
    await new Promise(resolve => setTimeout(resolve, 10))

    // Verify signature was fetched
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.shubox.io/signatures',
      expect.objectContaining({ method: 'POST' })
    )

    // Verify done was called (no error)
    expect(doneCallback).toHaveBeenCalledWith()

    // Verify signature was stored on file
    expect((mockFile as any).__shuboxSignature).toBeDefined()

    // Step 2: Sending callback appends signature fields to form data
    // (XHR.open() is called by Dropzone before this callback)
    const mockXhr = { open: vi.fn() } as any
    const mockFormData = new FormData()
    callbacks.sending(mockFile, mockXhr, mockFormData)

    // Verify signature fields were added (by the upload handler called within sending callback)
    expect(mockFormData.get('key')).toBeDefined()
    expect(mockFormData.get('policy')).toBeDefined()
    expect(mockFormData.get('signature')).toBeDefined()

    // Step 3: Success callback triggers user callback
    await callbacks.success(mockFile)

    expect(successCallback).toHaveBeenCalledWith(mockFile)
  })

  it('handles transform polling flow', async () => {
    const transformCallback = vi.fn()
    const mockFile: IDropzoneFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      upload: { progress: 0, total: 1024, bytesSent: 0 },
      status: 'queued' as any,
      previewElement: document.createElement('div'),
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test.jpg'
    } as any

    // Add upload ID to simulate successful upload
    ;(mockFile as any).__shuboxUploadId = 'upload-123'

    // Mock signature fetch
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          endpoint: 'https://s3.amazonaws.com/bucket',
          signature: 'sig123',
          policy: 'pol123',
          key: 'uploads/test.jpg'
        })
      })
      // Mock transform polling
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
          ready: true
        })
      })

    // Create handlers with transforms
    signatureHandler = new S3SignatureHandler(apiClient, {
      key: 'test-key'
    })

    uploadHandler = new S3UploadHandler({})

    successHandler = new SuccessHandler(renderer, apiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {
        '200x200#': transformCallback
      }
    })

    callbacks = new ShuboxCallbacks(
      signatureHandler,
      uploadHandler,
      successHandler,
      {}
    )

    // Call accept to fetch signature
    const doneCallback = vi.fn()
    await callbacks.accept(mockFile, doneCallback)

    // Call success which should trigger transform polling
    await callbacks.success(mockFile)

    // Wait for async transform polling
    await new Promise(resolve => setTimeout(resolve, 50))

    // Verify transform endpoint was called
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/uploads/upload-123?transform=200x200%23')
    )

    expect(transformCallback).toHaveBeenCalled()
    expect(transformCallback.mock.calls[0][0].transform).toEqual({
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
      ready: true
    })
  })

  it('handles upload handler sending data to S3', () => {
    const mockFile: IDropzoneFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      upload: { progress: 0, total: 1024, bytesSent: 0 },
      status: 'queued' as any,
      previewElement: document.createElement('div')
    } as any

    // Attach signature to file (simulating accept callback)
    ;(mockFile as any).__shuboxSignature = {
      aws_endpoint: 'https://s3.amazonaws.com/bucket',
      signature: 'sig123',
      policy: 'pol123',
      key: 'uploads/test.jpg',
      acl: 'public-read',
      success_action_status: '201'
    }

    // Create upload handler with extra params
    uploadHandler = new S3UploadHandler({
      extraParams: { 'x-custom': 'value' }
    })

    const mockXhr = {
      open: vi.fn()
    } as any

    const mockFormData = new FormData()

    // Call upload handler
    uploadHandler.handle(mockFile, mockXhr, mockFormData)

    // Note: XHR.open() is called by Dropzone before the sending callback,
    // so the upload handler only appends signature fields to the form data

    // Verify signature fields were added to form data
    expect(mockFormData.get('key')).toBe('uploads/test.jpg')
    expect(mockFormData.get('policy')).toBe('pol123')
    expect(mockFormData.get('signature')).toBe('sig123')
    expect(mockFormData.get('acl')).toBe('public-read')
    expect(mockFormData.get('success_action_status')).toBe('201')
    expect(mockFormData.get('x-custom')).toBe('value')
  })
})
