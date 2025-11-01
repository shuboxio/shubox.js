export const API_CONSTANTS = {
  BASE_URL: 'https://api.shubox.io',
  SIGNATURE_PATH: '/signatures',
  UPLOADS_PATH: '/uploads',
} as const

export const TEMPLATE_CONSTANTS = {
  SUCCESS: '{{s3url}}',
  UPLOADING: 'Uploading {{name}}...',
  COMPLETE: 'Upload complete',
} as const

export const DROPZONE_CONSTANTS = {
  DUMMY_URL: 'http://localhost',
  DEFAULT_ACCEPTED_FILES: 'image/*',
} as const
