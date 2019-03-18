export interface ShuboxFile {
    s3url: string;
}
export declare class Variant {
    s3url: string;
    variant: string;
    constructor(file: ShuboxFile, variant?: string);
    url(): string;
    private cleanFilename;
    private variantPrefix;
    private variantFiletype;
}
