import Shubox from 'shubox';
export declare class ShuboxCallbacks {
    shubox: Shubox;
    private options;
    readonly replaceable: Array<string>;
    constructor(shubox: Shubox);
    toHash(): {
        accept: any;
        sending: any;
        success: any;
        error: any;
        uploadProgress: any;
        totalUploadProgress: any;
    };
    _updateFormValue(file: any, templateName: any): void;
    _isFormElement(): boolean;
    _isAppendingText(): boolean;
    _insertableAtCursor(el: HTMLInputElement): boolean;
}
