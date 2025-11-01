/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShuboxCallbacks } from '~/shubox/shubox_callbacks'
import { S3SignatureHandler } from '~/shubox/handlers/signature'
import { S3UploadHandler } from '~/shubox/handlers/upload'
import { SuccessHandler } from '~/shubox/handlers/success'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('ShuboxCallbacks (refactored)', () => {
  let callbacks: ShuboxCallbacks
  let mockSignatureHandler: S3SignatureHandler
  let mockUploadHandler: S3UploadHandler
  let mockSuccessHandler: SuccessHandler

  beforeEach(() => {
    mockSignatureHandler = {
      handle: vi.fn()
    } as any

    mockUploadHandler = {
      handle: vi.fn()
    } as any

    mockSuccessHandler = {
      handle: vi.fn()
    } as any

    callbacks = new ShuboxCallbacks(
      mockSignatureHandler,
      mockUploadHandler,
      mockSuccessHandler,
      {}
    )
  })

  describe('accept', () => {
    it('delegates to signature handler', () => {
      const mockFile = { name: 'test.jpg' } as IDropzoneFile
      const mockDone = vi.fn()

      callbacks.accept(mockFile, mockDone)

      expect(mockSignatureHandler.handle).toHaveBeenCalledWith(mockFile, mockDone)
    })
  })

  describe('sending', () => {
    it('delegates to upload handler', () => {
      const mockFile = { name: 'test.jpg' } as IDropzoneFile
      const mockXhr = {} as XMLHttpRequest
      const mockFormData = new FormData()

      callbacks.sending(mockFile, mockXhr, mockFormData)

      expect(mockUploadHandler.handle).toHaveBeenCalledWith(mockFile, mockXhr, mockFormData)
    })
  })

  describe('success', () => {
    it('delegates to success handler', () => {
      const mockFile = { name: 'test.jpg' } as IDropzoneFile

      callbacks.success(mockFile)

      expect(mockSuccessHandler.handle).toHaveBeenCalledWith(mockFile)
    })
  })
})
