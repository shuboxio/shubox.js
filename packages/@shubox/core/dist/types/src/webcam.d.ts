import Dropzone from "dropzone";
import { IWebcamOptions } from "../index";
import { PhotoDom } from "./webcam/photo_dom";
import { PhotoEvents } from "./webcam/photo_events";
import { VideoDom } from "./webcam/video_dom";
import { VideoEvents } from "./webcam/video_events";
export declare class Webcam {
    static stopCamera(callback?: () => void): void;
    webcamOptions: IWebcamOptions;
    dropzone: Dropzone;
    dom: PhotoDom | VideoDom;
    events: PhotoEvents | VideoEvents;
    element: HTMLElement;
    constructor(dropzone: Dropzone, element: HTMLElement, webcamOptions: string | IWebcamOptions);
    domFactory(): PhotoDom | VideoDom;
    eventsFactory(): PhotoEvents | VideoEvents;
}
