import Shubox from 'shubox';
export declare class ShuboxCallbacks {
    shubox: Shubox;
    private options;
    constructor(shubox: Shubox);
    accept(file: any, done: any): void;
    sending(file: any, xhr: any, formData: any): void;
    success(file: any, response: any): void;
    error(file: any, message: any): void;
    uploadProgress(file: any, progress: any, bytesSent: any): void;
    totalUploadProgress(totalProgress: any, totalBytes: any, totalBytesSent: any): void;
}
