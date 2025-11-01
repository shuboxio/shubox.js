/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SuccessHandler } from '~/shubox/handlers/success'
import { ShuboxDomRenderer } from '~/shubox/dom/renderer'
import { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('SuccessHandler', () => {
  let handler: SuccessHandler
  let mockRenderer: ShuboxDomRenderer
  let mockApiClient: ShuboxApiClient
  let mockFile: IDropzoneFile

  beforeEach(() => {
    mockRenderer = new ShuboxDomRenderer()
    mockApiClient = new ShuboxApiClient({ key: 'test-key', baseUrl: 'https://api.shubox.io' })

    handler = new SuccessHandler(mockRenderer, mockApiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {},
      success: vi.fn()
    })

    mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test.jpg'
    } as IDropzoneFile
  })

  it('calls user success callback with file', async () => {
    const successCallback = vi.fn()
    handler = new SuccessHandler(mockRenderer, mockApiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {},
      success: successCallback
    })

    await handler.handle(mockFile)

    expect(successCallback).toHaveBeenCalledWith(mockFile)
  })

  it('inserts template into target element when present', async () => {
    document.body.innerHTML = '<input type="text" id="target" />'
    const element = document.getElementById('target') as HTMLInputElement
    mockFile.previewElement = element

    vi.spyOn(mockRenderer, 'insertTemplate')

    await handler.handle(mockFile)

    expect(mockRenderer.insertTemplate).toHaveBeenCalledWith(
      element,
      '{{s3url}}',
      { s3url: 'https://s3.amazonaws.com/bucket/uploads/test.jpg', name: 'test.jpg', size: 1024 },
      'replace'
    )
  })

  it('starts transform polling when transforms configured', async () => {
    const transformCallback = vi.fn()

    handler = new SuccessHandler(mockRenderer, mockApiClient, {
      successTemplate: '{{s3url}}',
      textBehavior: 'replace',
      transforms: {
        '200x200#': transformCallback
      },
      success: vi.fn()
    })

    // Mock the upload response to include upload ID
    ;(mockFile as any).__shuboxUploadId = 'upload-123'

    vi.spyOn(mockApiClient, 'pollTransform').mockResolvedValue({
      s3url: 'https://s3.amazonaws.com/bucket/uploads/test-200x200.jpg',
      ready: true
    })

    await handler.handle(mockFile)

    // Wait for async transform polling
    await new Promise(resolve => setTimeout(resolve, 10))

    expect(transformCallback).toHaveBeenCalled()
  })
})
