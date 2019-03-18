import Shubox from "shubox";
export declare class ShuboxOptions {
    shubox: Shubox;
    constructor(shubox: Shubox);
    toHash(): {
        acceptedFiles: string;
        addedfile(file: any): void;
        cdn: null;
        error(file: any, message: any): void;
        extraParams: {};
        previewsContainer: boolean | null;
        s3Key: null;
        sending(file: any, xhr: any, formData: any): void;
        success(file: any): void;
        successTemplate: string;
        textBehavior: string;
        transformName: null;
        uploadingTemplate: string;
    };
}
