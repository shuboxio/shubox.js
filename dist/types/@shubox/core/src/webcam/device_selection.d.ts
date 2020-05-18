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
    populateSelects(): void;
    gotDevices: (deviceInfos: MediaDeviceInfo[]) => void;
    handleError(error: Error): void;
    updateAudioIn: (event: Event) => void;
    updateVideoIn: (event: Event) => void;
}
