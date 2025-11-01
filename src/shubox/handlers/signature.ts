import type { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile, IS3Signature } from '~/shubox/config/types'

export interface ISignatureHandlerOptions {
  key: string
  s3Key?: string
  extraParams?: Record<string, any>
}

export class S3SignatureHandler {
  private signature: IS3Signature | null = null

  constructor(
    private apiClient: ShuboxApiClient,
    private options: ISignatureHandlerOptions
  ) {}

  async handle(file: IDropzoneFile, done: (error?: string) => void): Promise<void> {
    try {
      this.signature = await this.apiClient.fetchSignature(file, {
        key: this.options.key,
        s3Key: this.options.s3Key,
        extraParams: this.options.extraParams
      })

      // Store signature on file for upload handler
      ;(file as any).__shuboxSignature = this.signature

      done()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      done(message)
    }
  }

  getSignature(): IS3Signature | null {
    return this.signature
  }
}
