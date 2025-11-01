import { DROPZONE_CONSTANTS, TEMPLATE_CONSTANTS } from './constants'

export const DROPZONE_DEFAULTS = {
  url: DROPZONE_CONSTANTS.DUMMY_URL,
  acceptedFiles: DROPZONE_CONSTANTS.DEFAULT_ACCEPTED_FILES,
  autoProcessQueue: false,
  clickable: true,
  createImageThumbnails: true,
  maxFiles: null,
  maxFilesize: null,
  parallelUploads: 2,
  uploadMultiple: false,
} as const

export const SHUBOX_DEFAULTS = {
  textBehavior: 'replace',
  successTemplate: TEMPLATE_CONSTANTS.SUCCESS,
  uploadingTemplate: TEMPLATE_CONSTANTS.UPLOADING,
  previewsContainer: null,
  transforms: {},
  extraParams: {},
} as const
