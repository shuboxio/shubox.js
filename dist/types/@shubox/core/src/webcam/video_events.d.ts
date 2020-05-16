import { Webcam } from "../webcam";
export declare class VideoEvents {
    webcam: Webcam;
    private recordedBlobs;
    private mediaRecorder;
    constructor(webcam: Webcam);
    startCamera: (event?: Event | undefined, constraints?: any) => void;
    stopCamera: (event?: Event | undefined) => void;
    startRecording: (event?: Event | undefined) => void;
    stopRecording: (event?: Event | undefined) => void;
    private wireUpSelectorsAndEvents;
    private wireUp;
    private videoDataAvailable;
    private mediaRecorderOptions;
}
