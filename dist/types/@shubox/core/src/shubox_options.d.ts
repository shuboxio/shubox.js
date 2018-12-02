import Shubox from 'shubox';
export declare class ShuboxOptions {
    shubox: Shubox;
    constructor(shubox: Shubox);
    toHash(): {
        error: (file: any, message: any) => void;
        sending: (file: any, xhr: any, formData: any) => void;
        success: (file: any) => void;
        textBehavior: string;
        successTemplate: string;
        uploadingTemplate: string;
        acceptedFiles: string;
        clickable: boolean;
        previewTemplate: string;
        previewsContainer: boolean | null;
        transformName: null;
        dictMaxFilesExceeded: string;
        maxFiles: null;
        extraParams: {};
    };
}
