import type { IDropzoneFile } from '~/shubox/config/types'

export interface IUploadHandlerOptions {
  extraParams?: Record<string, any>
}

/**
 * Handles posting files to S3 with pre-signed credentials.
 * Configures the XMLHttpRequest to upload directly to S3 instead of
 * the application server.
 */
export class S3UploadHandler {
  /**
   * Creates a new S3UploadHandler instance.
   * @param options - Handler options including extraParams to append to upload
   */
  constructor(private options: IUploadHandlerOptions = {}) {}

  /**
   * Handles the Dropzone sending callback to configure S3 upload.
   * Updates the XHR request to post to S3 and appends signature fields
   * to the form data.
   * @param file - The file being uploaded (must have __shuboxSignature attached)
   * @param xhr - XMLHttpRequest object to configure
   * @param formData - FormData to append signature fields to
   * @throws Error if signature not found on file
   */
  handle(file: IDropzoneFile, xhr: XMLHttpRequest, formData: FormData): void {
    const signature = (file as any).__shuboxSignature

    if (!signature) {
      throw new Error('Signature not found on file')
    }

    // Update XHR to post to S3 endpoint
    xhr.open('POST', signature.endpoint, true)

    // Append signature fields to form data
    formData.append('key', signature.key)
    formData.append('policy', signature.policy)
    formData.append('signature', signature.signature)

    if (signature.acl) {
      formData.append('acl', signature.acl)
    }

    if (signature.success_action_status) {
      formData.append('success_action_status', signature.success_action_status)
    }

    if (signature['Content-Type']) {
      formData.append('Content-Type', signature['Content-Type'])
    }

    // Append extra params
    if (this.options.extraParams) {
      Object.entries(this.options.extraParams).forEach(([key, value]) => {
        formData.append(key, value)
      })
    }
  }
}
