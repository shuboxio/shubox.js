// Type definitions for Shubox 2.0
// Project: https://shubox.io
// Definitions by: Joel Oliveira <https://joeloliveira.com>
// TypeScript Version: 2.3.4

declare namespace Shubox {
  export interface DefaultOptions {
    success?: (file: Dropzone.DropzoneFile) => void;
    error?: (file: any, message: string) => void;
    textBehavior?: string;
    s3urlTemplate?: string;
    acceptedFiles?: string;
    clickable?: boolean;
    previewsContainer?: null | string | HTMLElement;
    dictMaxFilesExceeded?: string;
    maxFiles?: null | number;
    extraParams?: object;
  }

  export interface ShuboxFile extends Dropzone.DropzoneFile {
    width: number;
    height: number;
    lastModified: number;
    s3: string;
    s3url: string;
    postData: object[];
  }

  export interface Callbacks {
    accept: (file: ShuboxFile, done: (error?: string | Error) => void) => void;
    sending: (
      file: ShuboxFile,
      xhr: XMLHttpRequest,
      formData: FormData,
    ) => void;
    success: (file: ShuboxFile, response: Object | string) => void;
    error: (file: ShuboxFile, message: string) => void;
    uploadProgress: (
      file: ShuboxFile,
      progress: number,
      bytesSent: number,
    ) => void;
    totalUploadProgress: (
      totalProgress: number,
      totalBytes: number,
      totalBytesSent: number,
    ) => void;
  }

  export interface FormCallbacks {}
}
