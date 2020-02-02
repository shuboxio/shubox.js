import Dropzone from "dropzone";
import { IWebcamOptions } from "../index";
export declare class ShuboxWebcam {
    static stopVideo(callback?: () => void): void;
    private readonly photoConstraints;
    private element;
    private dropzone;
    private webcamOptions;
    private image;
    private canvas;
    private video;
    constructor(dropzone: Dropzone, element: HTMLElement, webcamOptions: string | IWebcamOptions);
    init(): void;
    private wireUpElements;
    private startCamera;
    private stopVideo;
    private startCapture;
}
