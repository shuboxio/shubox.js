import type { ShuboxDomRenderer } from '~/shubox/dom/renderer'
import type { ShuboxApiClient } from '~/shubox/api/client'
import type { IDropzoneFile, ITemplateData } from '~/shubox/config/types'
import { TransformPoller } from './transform_poller'

export interface ISuccessHandlerOptions {
  successTemplate: string
  textBehavior: 'replace' | 'append' | 'insertAtCursor'
  transforms: Record<string, (file: IDropzoneFile) => void>
  success?: (file: IDropzoneFile) => void
}

/**
 * Orchestrates post-upload actions after successful S3 upload.
 * Handles template insertion into DOM, transform polling, and user callbacks.
 */
export class SuccessHandler {
  /**
   * Creates a new SuccessHandler instance.
   * @param renderer - DOM renderer for inserting templates
   * @param apiClient - API client for transform polling
   * @param options - Handler options including successTemplate, textBehavior, transforms, and callbacks
   */
  constructor(
    private renderer: ShuboxDomRenderer,
    private apiClient: ShuboxApiClient,
    private options: ISuccessHandlerOptions
  ) {}

  /**
   * Handles the Dropzone success callback after file upload completes.
   * Performs three main actions:
   * 1. Inserts success template into preview element (if present)
   * 2. Starts transform polling for configured transforms
   * 3. Invokes user success callback
   * @param file - The successfully uploaded file with s3url attached
   */
  async handle(file: IDropzoneFile): Promise<void> {
    // Insert template into preview element if present
    if (file.previewElement) {
      const data: ITemplateData = {
        s3url: file.s3url,
        name: file.name,
        size: file.size
      }

      this.renderer.insertTemplate(
        file.previewElement as HTMLElement,
        this.options.successTemplate,
        data,
        this.options.textBehavior
      )
    }

    // Start transform polling if transforms configured
    if (Object.keys(this.options.transforms).length > 0) {
      const uploadId = (file as any).__shuboxUploadId

      if (uploadId) {
        for (const [transform, callback] of Object.entries(this.options.transforms)) {
          const poller = new TransformPoller(
            this.apiClient,
            uploadId,
            transform,
            (result) => {
              file.transform = result
              callback(file)
            }
          )

          poller.start().catch(err => {
            console.error('Transform polling failed:', err)
          })
        }
      }
    }

    // Call user success callback
    if (this.options.success) {
      this.options.success(file)
    }
  }
}
