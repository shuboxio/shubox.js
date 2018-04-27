export declare class ShuboxCallbacks {
    element: HTMLElement | HTMLInputElement;
    private options;
    accept(file: any, done: any): void;
    sending(file: any, xhr: any, formData: any): void;
    success(file: any, response: any): void;
    error(file: any, message: any): void;
    uploadProgress(file: any, progress: any, bytesSent: any): void;
    totalUploadProgress(totalProgress: any, totalBytes: any, totalBytesSent: any): void;
}
