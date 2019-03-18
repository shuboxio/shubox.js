export interface IShuboxFile {
    s3url: string;
    transforms: any;
}
export declare class TransformCallback {
    file: IShuboxFile;
    variant: string;
    variantUrl: string;
    callback: (file: IShuboxFile) => void;
    retry: number;
    success: boolean;
    constructor(file: IShuboxFile, variant: string | undefined, callback: (file: IShuboxFile) => void);
    run: (error?: any) => void;
    validateResponse: (response: any) => any;
    private cacheBustedUrl;
}
