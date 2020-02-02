import Dropzone from "dropzone";
export interface IWebcamOptions {
    type: string;
    startCamera?: string;
    stopCamera?: string;
    startCapture?: string;
}
export interface IUserOptions {
    signatureUrl?: string;
    uploadUrl?: string;
    uuid?: string;
    key?: string;
    webcam?: string | IWebcamOptions;
}
export default class Shubox {
    static instances: Dropzone[];
    static stopVideo: () => void;
    signatureUrl: string;
    uploadUrl: string;
    key: string;
    selector: string;
    element: HTMLElement | HTMLInputElement;
    options: any;
    callbacks: any;
    constructor(selector?: string, options?: IUserOptions);
    init(options: object): void;
}
