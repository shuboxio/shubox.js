import { describe, it, expect } from 'vitest'
import { API_CONSTANTS, TEMPLATE_CONSTANTS } from '~/shubox/config/constants'

describe('API_CONSTANTS', () => {
  it('has default base URL', () => {
    expect(API_CONSTANTS.BASE_URL).toBe('https://api.shubox.io')
  })

  it('has signature endpoint path', () => {
    expect(API_CONSTANTS.SIGNATURE_PATH).toBe('/signatures')
  })

  it('has uploads endpoint path', () => {
    expect(API_CONSTANTS.UPLOADS_PATH).toBe('/uploads')
  })
})

describe('TEMPLATE_CONSTANTS', () => {
  it('has default success template', () => {
    expect(TEMPLATE_CONSTANTS.SUCCESS).toBe('{{s3url}}')
  })

  it('has default uploading template', () => {
    expect(TEMPLATE_CONSTANTS.UPLOADING).toContain('Uploading')
  })
})
