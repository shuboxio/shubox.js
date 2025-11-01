import type { IS3Signature, ITransformResult, ISignatureOptions, IApiClientConfig } from '~/shubox/config/types'
import { API_CONSTANTS } from '~/shubox/config/constants'
import { objectToFormData } from '~/shubox/object_to_form_data'

export class ShuboxApiClient {
  private baseUrl: string
  private signatureUrl: string
  private uploadUrl: string
  private key: string

  constructor(config: IApiClientConfig) {
    this.key = config.key
    this.baseUrl = config.baseUrl || API_CONSTANTS.BASE_URL
    this.signatureUrl = config.signatureUrl || `${this.baseUrl}${API_CONSTANTS.SIGNATURE_PATH}`
    this.uploadUrl = config.uploadUrl || `${this.baseUrl}${API_CONSTANTS.UPLOADS_PATH}`
  }

  async fetchSignature(file: File, options: ISignatureOptions): Promise<IS3Signature> {
    const formData = objectToFormData({
      name: file.name,
      size: file.size,
      type: file.type,
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

  async pollTransform(uploadId: string, transform: string): Promise<ITransformResult> {
    const url = `${this.uploadUrl}/${uploadId}?transform=${encodeURIComponent(transform)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to poll transform: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }
}
