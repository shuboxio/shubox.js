import { IWebcamOptions, Webcam } from "../webcam";
export declare class VideoDom {
    webcam: Webcam;
    options: IWebcamOptions;
    video: HTMLVideoElement;
    image?: HTMLImageElement;
    canvas?: HTMLCanvasElement;
    initialized: boolean;
    constructor(webcam: Webcam);
    init(): void;
    alreadyStarted(): boolean;
    toggleStarted(): void;
    toggleStopped(): void;
    finalize(videoFile: any): void;
    findOrCreate(element: string): HTMLElement;
}
