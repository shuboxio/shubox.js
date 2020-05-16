import { VideoDom } from "./video_dom";
export declare class DeviceSelection {
    dom: VideoDom;
    audioinput?: HTMLSelectElement;
    videoinput?: HTMLSelectElement;
    constructor(dom: VideoDom);
    private populateSelects;
    private gotDevices;
    private handleError;
    private updateAudioIn;
    private updateVideoIn;
}
