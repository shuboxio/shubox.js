// Type definitions for Shubox 2.0
// Project: https://shubox.io
// Definitions by: Joel Oliveira <https://joeloliveira.com>
// TypeScript Version: 2.3.4

declare namespace Shubox {
  export interface ShuboxDefaultOptions {
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
    transformName?: null | string;
  }

  export interface ShuboxFile extends Dropzone.DropzoneFile {
    width: number;
    height: number;
    lastModified: number;
    s3: string;
    s3url: string;
    postData: object[];
  }
}

export = Shubox;
export as namespace Shubox;
