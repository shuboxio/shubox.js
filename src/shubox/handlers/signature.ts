import type { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile, IS3Signature } from '~/shubox/config/types'

export interface ISignatureHandlerOptions {
  key: string
  s3Key?: string
  extraParams?: Record<string, any>
}

/**
 * Handles fetching S3 pre-signed upload URLs from the Shubox API.
 * This is the first step in the upload lifecycle, providing credentials
 * needed to upload directly to S3.
 */
export class S3SignatureHandler {
  private signature: IS3Signature | null = null
  private dropzoneInstance: any = null

  /**
   * Creates a new S3SignatureHandler instance.
   * @param apiClient - Shubox API client for making signature requests
   * @param options - Handler options including key, s3Key, and extraParams
   */
  constructor(
    private apiClient: ShuboxApiClient,
    private options: ISignatureHandlerOptions
  ) {}

  /**
   * Set the Dropzone instance so we can update its URL at runtime
   */
  setDropzoneInstance(dropzone: any): void {
    this.dropzoneInstance = dropzone
  }

  /**
   * Handles the Dropzone accept callback to fetch S3 signature.
   * Fetches pre-signed S3 credentials and stores them on the file object
   * for use by the upload handler.
   * @param file - The file being uploaded
   * @param done - Callback to invoke when complete (with error message if failed)
   */
  async handle(file: IDropzoneFile, done: (error?: string) => void): Promise<void> {
    try {
      this.signature = await this.apiClient.fetchSignature(file, {
        key: this.options.key,
        s3Key: this.options.s3Key,
        extraParams: this.options.extraParams
      })

      // Store signature on file for upload handler
      ;(file as any).__shuboxSignature = this.signature

      // Update Dropzone URL to S3 endpoint for this upload
      // This must happen before the sending callback is invoked
      if (this.dropzoneInstance) {
        this.dropzoneInstance.options.url = this.signature!.aws_endpoint
      }

      done()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      done(message)
    }
  }

  /**
   * Gets the most recently fetched signature.
   * @returns The last fetched S3 signature, or null if none exists
   */
  getSignature(): IS3Signature | null {
    return this.signature
  }
}
