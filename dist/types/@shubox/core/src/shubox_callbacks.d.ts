/// <reference types="dropzone" />
import Dropzone from 'dropzone';
import Shubox from 'shubox';
export interface ShuboxDefaultOptions {
    success?: (file: Dropzone.DropzoneFile) => void;
    error?: (file: Dropzone.DropzoneFile, message: string) => void;
    sending?: (file: Dropzone.DropzoneFile, xhr: XMLHttpRequest, formData: any) => void;
    addedfile?: (file: Dropzone.DropzoneFile) => void;
    textBehavior?: string;
    s3urlTemplate?: string;
    successTemplate?: string;
    acceptedFiles?: string;
    previewsContainer?: null | string | HTMLElement;
    extraParams?: object;
    transformName?: null | string;
    transformCallbacks?: null | object;
    s3Key?: null | string;
    cdn?: null | string;
}
export declare class ShuboxCallbacks {
    shubox: Shubox;
    private options;
    readonly replaceable: Array<string>;
    static pasteCallback(dz: Dropzone): (event: any) => void;
    constructor(shubox: Shubox);
    toHash(): {
        accept: (file: any, done: any) => void;
        sending: (file: any, xhr: any, formData: any) => void;
        addedfile: (file: any) => void;
        success: (file: any, response: any) => void;
        error: (file: any, message: any) => void;
        uploadProgress: (file: any, progress: any, bytesSent: any) => void;
    };
    _updateFormValue(file: any, templateName: any): void;
    _isFormElement(): boolean;
    _isAppendingText(): boolean;
    _insertableAtCursor(el: HTMLInputElement): boolean;
}
