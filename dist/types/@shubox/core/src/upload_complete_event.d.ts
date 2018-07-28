import Shubox from 'shubox';
export interface ShuboxFile extends Dropzone.DropzoneFile {
    width: number;
    height: number;
    lastModified: number;
    s3: string;
    s3url: string;
    postData: object[];
}
export declare function uploadCompleteEvent(shubox: Shubox, file: ShuboxFile, extraParams: object): void;
