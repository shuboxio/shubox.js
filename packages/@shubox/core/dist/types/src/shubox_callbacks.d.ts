import Shubox from 'shubox';
export declare class ShuboxCallbacks {
    shubox: Shubox;
    private options;
    constructor(shubox: Shubox);
    toHash(): {
        accept: any;
        sending: any;
        success: any;
        error: any;
        uploadProgress: any;
        totalUploadProgress: any;
    };
}
