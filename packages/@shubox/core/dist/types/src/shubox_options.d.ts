import Shubox from 'shubox';
export declare class ShuboxOptions {
    shubox: Shubox;
    constructor(shubox: Shubox);
    toHash(): {
        cdn: null;
        addedfile: (file: any) => void;
        error: (file: any, message: any) => void;
        sending: (file: any, xhr: any, formData: any) => void;
        success: (file: any) => void;
        textBehavior: string;
        successTemplate: string;
        uploadingTemplate: string;
        acceptedFiles: string;
        s3Key: null;
        previewsContainer: boolean | null;
        transformName: null;
        extraParams: {};
    };
}
