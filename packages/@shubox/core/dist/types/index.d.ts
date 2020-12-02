import Dropzone from "dropzone";
import { IWebcamOptions, Webcam } from "./src/webcam";
export interface IUserOptions {
    signatureUrl?: string;
    uploadUrl?: string;
    uuid?: string;
    key?: string;
    webcam?: "photo" | "video" | IWebcamOptions;
}
export default class Shubox {
    static instances: Dropzone[];
    static stopCamera: () => void;
    signatureUrl: string;
    uploadUrl: string;
    key: string;
    selector: string;
    element: HTMLElement | HTMLInputElement;
    options: any;
    callbacks: any;
    webcam?: Webcam;
    constructor(selector?: string, options?: IUserOptions);
    init(options: object): void;
    upload(file: Dropzone.DropzoneFile): void;
}
