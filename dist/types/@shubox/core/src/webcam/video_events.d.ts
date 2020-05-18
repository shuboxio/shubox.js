/// <reference types="dom-mediacapture-record" />
import { Webcam } from "../webcam";
export declare class VideoEvents {
    webcam: Webcam;
    recordedBlobs: Blob[];
    mediaRecorder: MediaRecorder;
    constructor(webcam: Webcam);
    startCamera: (event?: Event | undefined, constraints?: any) => void;
    stopCamera: (event?: Event | undefined) => void;
    startRecording: (event?: Event | undefined) => void;
    stopRecording: (event?: Event | undefined) => void;
    wireUpSelectorsAndEvents(): void;
    wireUp(eventName: string, selector?: string): void;
    videoDataAvailable: (event: BlobEvent) => void;
    mediaRecorderOptions: () => object;
}
