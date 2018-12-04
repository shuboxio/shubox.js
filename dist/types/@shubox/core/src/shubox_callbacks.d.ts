/// <reference types="dropzone" />
import Dropzone from 'dropzone';
import Shubox from 'shubox';
export interface ShuboxDefaultOptions {
    success?: (file: Dropzone.DropzoneFile) => void;
    error?: (file: Dropzone.DropzoneFile, message: string) => void;
    sending?: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: any) => void;
    textBehavior?: string;
    s3urlTemplate?: string;
    successTemplate?: string;
    acceptedFiles?: string;
    clickable?: boolean;
    previewsContainer?: null | string | HTMLElement;
    dictMaxFilesExceeded?: string;
    maxFiles?: null | number;
    extraParams?: object;
    transformName?: null | string;
}
export declare class ShuboxCallbacks {
    shubox: Shubox;
    private options;
    readonly replaceable: Array<string>;
    static pasteCallback(dz: Dropzone): (event: any) => void;
    constructor(shubox: Shubox);
    toHash(): {
        accept: any;
        sending: (file: any, xhr: any, formData: any) => void;
        success: any;
        error: (file: any, message: any) => void;
        uploadProgress: any;
        totalUploadProgress: any;
    };
    _updateFormValue(file: any, templateName: any): void;
    _isFormElement(): boolean;
    _isAppendingText(): boolean;
    _insertableAtCursor(el: HTMLInputElement): boolean;
}
