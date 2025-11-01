import type { IS3Signature, ITransformResult, ISignatureOptions, IApiClientConfig } from '~/shubox/config/types'
import { API_CONSTANTS } from '~/shubox/config/constants'
import { objectToFormData } from '~/shubox/object_to_form_data'
import { filenameFromFile } from '~/shubox/filename_from_file'

/**
 * Client for communicating with the Shubox API.
 * Handles signature fetching for S3 uploads and transform polling.
 */
export class ShuboxApiClient {
  private baseUrl: string
  private signatureUrl: string
  private uploadUrl: string
  private key: string

  /**
   * Creates a new ShuboxApiClient instance.
   * @param config - Configuration object containing API URLs and key
   */
  constructor(config: IApiClientConfig) {
    this.key = config.key
    this.baseUrl = config.baseUrl || API_CONSTANTS.BASE_URL
    this.signatureUrl = config.signatureUrl || `${this.baseUrl}${API_CONSTANTS.SIGNATURE_PATH}`
    this.uploadUrl = config.uploadUrl || `${this.baseUrl}${API_CONSTANTS.UPLOADS_PATH}`
  }

  /**
   * Fetches a pre-signed S3 upload URL from the Shubox API.
   * @param file - The file to be uploaded
   * @param options - Signature request options including key, s3Key, and extraParams
   * @returns Promise resolving to S3 signature with upload endpoint and credentials
   * @throws Error if the signature request fails
   */
  async fetchSignature(file: File, options: ISignatureOptions): Promise<IS3Signature> {
    const formData = objectToFormData({
      file: {
        name: filenameFromFile(file),
        size: file.size,
        type: file.type,
      },
      key: options.key,
      s3Key: options.s3Key,
      ...options.extraParams
    })

    const response = await fetch(this.signatureUrl, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch signature: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Polls the Shubox API to check if an image/video transform is ready.
   * @param uploadId - The unique upload identifier
   * @param transform - The transform string (e.g., "200x200#" or ".webp")
   * @returns Promise resolving to transform result with s3url and ready status
   * @throws Error if the polling request fails
   */
  async pollTransform(uploadId: string, transform: string): Promise<ITransformResult> {
    const url = `${this.uploadUrl}/${uploadId}?transform=${encodeURIComponent(transform)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to poll transform: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
