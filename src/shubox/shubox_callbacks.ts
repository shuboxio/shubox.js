import Dropzone from "dropzone";
import type { S3SignatureHandler } from './handlers/signature'
import type { S3UploadHandler } from './handlers/upload'
import type { SuccessHandler } from './handlers/success'
import type { IDropzoneFile } from './config/types'

interface ICallbackOptions {
  addedfile?: (file: IDropzoneFile) => void
  error?: (file: IDropzoneFile, message: string | Error) => void
  uploadingTemplate?: string
}

export class ShuboxCallbacks {
  private dropzoneInstance: Dropzone | null = null;

  constructor(
    private signatureHandler: S3SignatureHandler,
    private uploadHandler: S3UploadHandler,
    private successHandler: SuccessHandler,
    private options: ICallbackOptions
  ) {}

  /**
   * Set the Dropzone instance for use in callbacks
   * Must be called after the Dropzone instance is created
   */
  setDropzoneInstance(dropzone: Dropzone): void {
    this.dropzoneInstance = dropzone;
  }

  accept = (file: IDropzoneFile, done: (error?: string) => void): void => {
    this.signatureHandler.handle(file, done)
  }

  sending = (file: IDropzoneFile, xhr: XMLHttpRequest, formData: FormData): void => {
    this.uploadHandler.handle(file, xhr, formData)
  }

  success = (file: IDropzoneFile): void => {
    this.successHandler.handle(file)
  }

  addedfile = (file: IDropzoneFile): void => {
    // Call Dropzone's default addedfile handler with the correct context (the Dropzone instance)
    if (this.dropzoneInstance) {
      Dropzone.prototype.defaultOptions.addedfile!.apply(this.dropzoneInstance, [file]);
    }
    if (this.options.addedfile) {
      this.options.addedfile(file)
    }
  }

  error = (file: IDropzoneFile, message: string | Error): void => {
    const xhr = new XMLHttpRequest(); // bc type signature
    // Call Dropzone's default error handler with the correct context (the Dropzone instance)
    if (this.dropzoneInstance) {
      Dropzone.prototype.defaultOptions.error!.apply(this.dropzoneInstance, [file, message, xhr]);
    }

    if (this.options.error) {
      this.options.error(file, message)
    }
  }

  static pasteCallback(dz: Dropzone) {
    return ((event: ClipboardEvent) => {
      const items = (event.clipboardData)!.items;

      for (const item of items) {
        if (item.kind === "file") {
          // adds the file to your dropzone instance
          dz.addFile(item.getAsFile() as Dropzone.DropzoneFile);
        }
      }
    });
  }
}
