import { describe, it, expect, vi, beforeEach } from 'vitest'
import { S3UploadHandler } from '~/shubox/handlers/upload'
import type { IDropzoneFile } from '~/shubox/config/types'

describe('S3UploadHandler', () => {
  let handler: S3UploadHandler
  let mockFile: IDropzoneFile
  let mockXhr: any
  let mockFormData: FormData

  beforeEach(() => {
    handler = new S3UploadHandler({
      extraParams: { 'x-custom': 'value' }
    })

    mockFile = {
      name: 'test.jpg',
      size: 1024,
      type: 'image/jpeg',
      postData: {
        aws_endpoint: 'https://s3.amazonaws.com/bucket',
        signature: 'sig123',
        policy: 'pol123',
        key: 'uploads/test.jpg',
        acl: 'public-read',
        success_action_status: '201'
      }
    } as any

    mockXhr = {
      open: vi.fn()
    }

    mockFormData = new FormData()
  })

  it('appends signature fields to form data', () => {
    handler.handle(mockFile, mockXhr, mockFormData)

    expect(mockFormData.get('key')).toBe('uploads/test.jpg')
    expect(mockFormData.get('policy')).toBe('pol123')
    expect(mockFormData.get('signature')).toBe('sig123')
    expect(mockFormData.get('acl')).toBe('public-read')
    expect(mockFormData.get('success_action_status')).toBe('201')
  })

  it('appends extra params to form data', () => {
    handler.handle(mockFile, mockXhr, mockFormData)

    expect(mockFormData.get('x-custom')).toBe('value')
  })

  it('throws error if signature not found on file', () => {
    const fileWithoutSignature = { name: 'test.jpg' } as IDropzoneFile

    expect(() => {
      handler.handle(fileWithoutSignature, mockXhr, mockFormData)
    }).toThrow('Signature not found on file')
  })
})
