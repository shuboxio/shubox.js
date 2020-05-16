import { IWebcamOptions } from "../../index";
import { Webcam } from "../webcam";
import { DeviceSelection } from "./device_selection";
export declare class VideoDom {
    webcam: Webcam;
    options: IWebcamOptions;
    video: HTMLVideoElement;
    image?: HTMLImageElement;
    canvas?: HTMLCanvasElement;
    deviceSelection?: DeviceSelection;
    initialized: boolean;
    constructor(webcam: Webcam);
    init(): void;
    alreadyStarted(): boolean;
    toggleStarted(): void;
    toggleStopped(): void;
    finalize(videoFile: any): void;
    findOrCreate(element: string): HTMLElement;
}
