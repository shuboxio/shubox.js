import { Webcam } from "../webcam";
export declare class PhotoEvents {
    webcam: Webcam;
    constructor(webcam: Webcam);
    startCamera: (event?: Event | undefined, constraints?: any) => void;
    takePhoto: (event?: Event | undefined) => void;
    stopCamera: (event?: Event | undefined) => void;
    private wireUpSelectorsAndEvents;
    private wireUp;
}
