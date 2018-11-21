export interface ShuboxFile {
    s3url: string;
}
export declare class Variant {
    success: boolean;
    s3url: string;
    variant: string;
    constructor(file: ShuboxFile, variant?: string);
    url(): string;
}
