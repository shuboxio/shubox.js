import Dropzone from "dropzone";
import { Webcam } from "./src/webcam";
export interface IWebcamOptions {
    type: string;
    startCamera?: string;
    stopCamera?: string;
    startCapture?: string;
    takePhoto?: string;
    startRecording?: string;
    stopRecording?: string;
    photoTemplate?: string;
    videoTemplate?: string;
}
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
}
