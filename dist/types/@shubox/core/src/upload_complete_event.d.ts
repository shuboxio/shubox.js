/// <reference types="dropzone" />
import Shubox from "shubox";
export interface IShuboxFile extends Dropzone.DropzoneFile {
    width: number;
    height: number;
    lastModified: number;
    lastModifiedDate: any;
    s3: string;
    s3url: string;
    postData: object[];
}
export declare function uploadCompleteEvent(shubox: Shubox, file: IShuboxFile, extraParams: object): void;
