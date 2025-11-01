import type { IDropzoneFile } from '~/shubox/config/types'

export interface IUploadHandlerOptions {
  extraParams?: Record<string, any>
}

export class S3UploadHandler {
  constructor(private options: IUploadHandlerOptions = {}) {}

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
