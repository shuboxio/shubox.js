import { VideoDom } from "./video_dom";
export declare class DeviceSelection {
    dom: VideoDom;
    audioInSelect?: HTMLSelectElement;
    audioOutSelect?: HTMLSelectElement;
    videoInSelect?: HTMLSelectElement;
    constructor(dom: VideoDom);
    toggleStopped(): void;
    private populateSelects;
    private gotDevices;
    private handleError;
}
