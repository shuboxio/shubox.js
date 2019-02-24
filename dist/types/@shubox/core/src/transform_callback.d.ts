export interface ShuboxFile {
    s3url: string;
    transforms: any;
}
export declare class TransformCallback {
    file: ShuboxFile;
    variant: string;
    variantUrl: string;
    callback: (file: ShuboxFile) => void;
    retry: number;
    success: boolean;
    constructor(file: ShuboxFile, variant: string | undefined, callback: (file: ShuboxFile) => void);
    run: (error?: any) => void;
    validateResponse: (response: any) => any;
    _cacheBustedUrl: () => string;
}
