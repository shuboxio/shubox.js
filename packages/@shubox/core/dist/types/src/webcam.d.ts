import Dropzone from "dropzone";
import { DeviceSelection } from "./webcam/device_selection";
import { PhotoDom } from "./webcam/photo_dom";
import { PhotoEvents } from "./webcam/photo_events";
import { VideoDom } from "./webcam/video_dom";
import { VideoEvents } from "./webcam/video_events";
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
    audioInput?: string;
    videoInput?: string;
    timeLimit?: number;
    cameraStarted?: (webcam: Webcam) => void;
    cameraStopped?: (webcam: Webcam) => void;
    photoTaken?: (webcam: Webcam, file: Blob) => void;
    recordingStarted?: (webcam: Webcam) => void;
    recordingStopped?: (webcam: Webcam, file: Blob) => void;
}
export declare class Webcam {
    static stopCamera(callback?: () => void): void;
    webcamOptions: IWebcamOptions;
    dropzone: Dropzone;
    dom: PhotoDom | VideoDom;
    events: PhotoEvents | VideoEvents;
    element: HTMLElement;
    deviceSelection: DeviceSelection;
    constructor(dropzone: Dropzone, element: HTMLElement, webcamOptions: string | IWebcamOptions);
    domFactory(): PhotoDom | VideoDom;
    eventsFactory(): PhotoEvents | VideoEvents;
}
