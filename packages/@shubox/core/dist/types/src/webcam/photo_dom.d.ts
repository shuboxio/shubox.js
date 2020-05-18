import { IWebcamOptions, Webcam } from "../webcam";
export declare class PhotoDom {
    webcam: Webcam;
    options: IWebcamOptions;
    video: HTMLVideoElement;
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    constructor(webcam: Webcam);
    init(): void;
    toggleStarted(): void;
    toggleStopped(): void;
    findOrCreate(element: string): HTMLElement;
    alreadyStarted(): boolean;
    recordingStarted(): void;
    finalize(_: Blob): void;
}
