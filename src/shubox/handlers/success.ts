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

export class SuccessHandler {
  constructor(
    private renderer: ShuboxDomRenderer,
    private apiClient: ShuboxApiClient,
    private options: ISuccessHandlerOptions
  ) {}

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
