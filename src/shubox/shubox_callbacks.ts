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
  constructor(
    private signatureHandler: S3SignatureHandler,
    private uploadHandler: S3UploadHandler,
    private successHandler: SuccessHandler,
    private options: ICallbackOptions
  ) {}

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
    Dropzone.prototype.defaultOptions.addedfile!.apply(this, [file]);
    if (this.options.addedfile) {
      this.options.addedfile(file)
    }
  }

  error = (file: IDropzoneFile, message: string | Error): void => {
    const xhr = new XMLHttpRequest(); // bc type signature
    Dropzone.prototype.defaultOptions.error!.apply(this, [file, message, xhr]);

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
