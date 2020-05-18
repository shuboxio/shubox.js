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
    recordingStarted(): void;
    finalize(videoFile: Blob): void;
    findOrCreate(element: string): HTMLElement;
}
