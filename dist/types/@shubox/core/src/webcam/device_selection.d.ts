import { IWebcamOptions } from "../webcam";
import { PhotoEvents } from "./photo_events";
import { VideoEvents } from "./video_events";
export declare class DeviceSelection {
    events: VideoEvents | PhotoEvents;
    webcamOptions: IWebcamOptions;
    audioinput?: HTMLSelectElement;
    videoinput?: HTMLSelectElement;
    initialized: boolean;
    constructor(events: VideoEvents | PhotoEvents, webcamOptions: IWebcamOptions);
    private populateSelects;
    private gotDevices;
    private handleError;
    private updateAudioIn;
    private updateVideoIn;
}
