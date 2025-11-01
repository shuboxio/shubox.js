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
	constructor(private options: IUploadHandlerOptions = {}) { }

	/**
	 * Handles the Dropzone sending callback to configure S3 upload.
	 * Appends signature fields to the form data for S3 upload.
	 * Note: The XHR is already opened by Dropzone at this point, and the URL
	 * has been set by the signature handler in the accept callback.
	 * @param file - The file being uploaded (must have postData with signature attached)
	 * @param xhr - XMLHttpRequest object (already opened by Dropzone)
	 * @param formData - FormData to append signature fields to
	 * @throws Error if signature not found on file
	 */
	handle(file: IDropzoneFile, xhr: XMLHttpRequest, formData: FormData): void {
		const signature = (file as any).postData

		if (!signature) {
			throw new Error('Signature not found on file')
		}

		// Append all signature fields from API response to form data
		// This includes: key, policy, signature, and any AWS auth fields
		// Note: AWS form fields should be lowercase with dashes (e.g., x-amz-credential)
		Object.entries(signature).forEach(([key, value]) => {
			// Skip non-form-field properties
			if (key === 'aws_endpoint' || value === undefined || typeof value === 'object') {
				return
			}
			// Convert header-style names (X-Amz-*) to form field style (x-amz-*)
			const formKey = key.startsWith('X-') ? key.toLowerCase() : key
			formData.append(formKey, String(value))
		})

		// Append extra params
		if (this.options.extraParams) {
			Object.entries(this.options.extraParams).forEach(([key, value]) => {
				formData.append(key, value)
			})
		}
	}
}
